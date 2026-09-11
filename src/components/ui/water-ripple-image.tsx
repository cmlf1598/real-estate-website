import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WaterRippleImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** Blue cast, as if the image were seen through water. 0-1. */
  blueish?: number;
  /** Size of the surface pattern. Higher is finer. */
  scale?: number;
  /** Strength of the light picked up off the moving surface. */
  illumination?: number;
  /** How far the ambient surface bends the image. */
  surfaceDistortion?: number;
  /** How far the rings spreading from the cursor bend the image. */
  waterDistortion?: number;
  /** Surface movement while the cursor is away. 0 leaves the image still. */
  ambient?: number;
  /**
   * Resolution multiplier. Raise it when the element is transform-scaled up,
   * so the canvas still has pixels to show at full size.
   */
  renderScale?: number;
}

// Enough pixels to stay sharp, few enough that the shader holds 60fps.
const PIXEL_BUDGET = 900_000;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// The snoise2 below is the Ashima Arts / Ian McEwan simplex noise (MIT).
const FRAG = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uCover;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uAspect;
uniform float uBlueish;
uniform float uScale;
uniform float uIllumination;
uniform float uSurfaceDistortion;
uniform float uWaterDistortion;
uniform float uAmbient;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.1;

  // How awake the surface is: the cursor wakes it, uAmbient keeps a floor.
  float life = max(uHover, uAmbient);

  // Two noise fields drifting against each other read as moving water.
  vec2 p = uv * uScale;
  float n1 = fbm(p + vec2(t, t * 0.6));
  float n2 = snoise(p * 1.6 - vec2(t * 0.7, t * 0.35));
  vec2 surface = vec2(n1, n2) * life;

  // Rings spreading from the cursor. The falloff is tight on purpose: they
  // should read as water moving under the hand, not as a target drawn on the
  // image. Past about a fifth of the frame there is nothing left of them.
  vec2 d = (uv - uMouse) * vec2(uAspect, 1.0);
  float dist = length(d);
  float ring = sin(dist * 22.0 - uTime * 2.4) * exp(-dist * 9.0) * uHover;
  vec2 rings = normalize(d + 1e-5) * ring;

  vec2 offset = surface * uSurfaceDistortion + rings * uWaterDistortion;
  vec2 tuv = (uv + offset - 0.5) * uCover + 0.5;
  vec3 col = texture2D(uTexture, clamp(tuv, 0.0005, 0.9995)).rgb;

  // Light off the surface, as a gain rather than an addition. Adding lifts the
  // blacks into grey and draws the rings on top of the photo; a gain leaves
  // dark water dark and only brightens what already catches light.
  col *= 1.0 + uIllumination * (n1 * life * 0.6 + ring);

  // Blue cast, strongest where the water is moving.
  col = mix(col, col * vec3(0.55, 0.82, 1.15), uBlueish * life);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function WaterRippleImage({
  src,
  alt = "",
  className,
  blueish = 0.12,
  scale = 3.2,
  illumination = 0.08,
  surfaceDistortion = 0.009,
  waterDistortion = 0.016,
  ambient = 0,
  renderScale = 1,
}: WaterRippleImageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(null);

  // Until the shader is actually running, the plain image is what you see.
  const [live, setLive] = useState(false);

  // Read by the render loop, so changing a dial does not rebuild the context.
  const dials = useRef({ blueish, scale, illumination, surfaceDistortion, waterDistortion, ambient });
  dials.current = { blueish, scale, illumination, surfaceDistortion, waterDistortion, ambient };

  useEffect(() => {
    const host = wrap.current;
    const cvs = canvas.current;
    const img = image.current;
    if (!host || !cvs || !img) return;

    // Motion the user has asked not to see. Leave the plain image alone.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = cvs.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One oversized triangle is cheaper to rasterise than a quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uTexture = u("uTexture");
    const uCover = u("uCover");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uHover = u("uHover");
    const uAspect = u("uAspect");
    const uBlueish = u("uBlueish");
    const uScale = u("uScale");
    const uIllumination = u("uIllumination");
    const uSurfaceDistortion = u("uSurfaceDistortion");
    const uWaterDistortion = u("uWaterDistortion");
    const uAmbient = u("uAmbient");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // The photo is not a power of two, so no mipmaps and clamp at the edges.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    let textured = false;
    let raf = 0;
    let running = false;
    let inView = true;
    const t0 = performance.now();

    let hover = 0;
    let target = 0;
    const mouse = { x: 0.5, y: 0.5 };

    const resize = () => {
      if (!textured) return;
      // The element may be transform-scaled; offsetWidth is the untransformed box.
      const cssW = host.offsetWidth;
      const cssH = host.offsetHeight;
      if (!cssW || !cssH) return;

      let px = Math.min(window.devicePixelRatio || 1, 2) * renderScale;
      const affordable = Math.sqrt(PIXEL_BUDGET / (cssW * cssH));
      if (px > affordable) px = affordable;

      cvs.width = Math.max(1, Math.round(cssW * px));
      cvs.height = Math.max(1, Math.round(cssH * px));
      gl.viewport(0, 0, cvs.width, cvs.height);

      // Emulate object-cover by sampling a narrower range on the long axis.
      const boxAspect = cssW / cssH;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      gl.uniform2f(
        uCover,
        boxAspect > imgAspect ? 1 : boxAspect / imgAspect,
        boxAspect > imgAspect ? imgAspect / boxAspect : 1
      );
      gl.uniform1f(uAspect, boxAspect);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!textured) return;

      // Ease towards the cursor state so arriving and leaving are not abrupt.
      hover += (target - hover) * 0.075;
      if (target === 0 && hover < 0.002) hover = 0;

      const d = dials.current;
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, hover);
      gl.uniform1f(uBlueish, d.blueish);
      gl.uniform1f(uScale, d.scale);
      gl.uniform1f(uIllumination, d.illumination);
      gl.uniform1f(uSurfaceDistortion, d.surfaceDistortion);
      gl.uniform1f(uWaterDistortion, d.waterDistortion);
      gl.uniform1f(uAmbient, d.ambient);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Nothing moving and nothing asking it to: stop burning frames.
      if (!inView || (hover === 0 && d.ambient === 0)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !textured) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const upload = () => {
      if (!img.naturalWidth) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform1i(uTexture, 0);
      textured = true;
      setLive(true);
      resize();
      start();
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x = (e.clientX - rect.left) / rect.width;
      // Texture rows are flipped on upload, so v runs from the bottom.
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      target = 1;
      start();
    };
    const onLeave = () => {
      target = 0;
      start();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);

    const ro = new ResizeObserver(() => {
      resize();
      start();
    });
    ro.observe(host);

    // Off screen there is nothing to look at, so there is nothing to render.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
      },
      { rootMargin: "200px" }
    );
    io.observe(host);

    if (img.complete && img.naturalWidth) upload();
    else img.addEventListener("load", upload);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      running = false;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      img.removeEventListener("load", upload);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // Deliberately not losing the context: the canvas is going away with the
      // component, and a lost context is handed back to the next mount.
      setLive(false);
    };
  }, [src, renderScale]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden", className)}>
      <img
        ref={image}
        src={src}
        alt={alt}
        decoding="async"
        className={cn("h-full w-full object-cover", live && "invisible")}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full", !live && "hidden")}
      />
    </div>
  );
}

export default WaterRippleImage;
