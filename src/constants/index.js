// Everything the site says about the house lives here.
// Swap in the real listing URL, photography and details without touching a component.

export const AIRBNB_URL = "https://www.airbnb.com";

export const CTA_LABEL = "Check dates on Airbnb";

export const PROPERTY = {
  name: "The Cliffs",
  location: "Port Campbell, Victoria",
  region: "Australia's southern coastline",
  guests: 8,
  bedrooms: 4,
  bathrooms: 3,
  minimumNights: 2,
  rateFrom: "A$1,450",
  rateUnit: "night",
};

// The bar that overlaps the hero, then follows you down the page.
export const STAY_FACTS = [
  { label: "Sleeps", value: "8 guests" },
  { label: "Rooms", value: "4 bedrooms · 3 baths" },
  { label: "Minimum", value: "2 nights" },
  { label: "From", value: "A$1,450 / night" },
];

export const HERO = {
  image: "/images/hero.jpg",
  alt: "The house lit from within, standing above the Southern Ocean at blue hour",
  headline: ["Nothing between you", "and the Southern Ocean"],
  meta: "Port Campbell · Victoria · Sleeps 8",
};

export const ARRIVAL = {
  image: "/images/headland.jpg",
  alt: "A dark headland above still water at blue hour",
  heading: "The last road before the water",
  body: [
    "The turn-off is unmarked. You follow a gravel track through wind-flattened tea tree for about four minutes, and then the scrub stops and the land simply ends.",
    "The house sits sixty metres back from the edge, low and dark against the heath, angled so that every room you spend time in faces south. There is no other building in sight.",
  ],
};

export const HOUSE = {
  image: "/images/house-dusk.jpg",
  alt: "The house in silhouette against a burning dusk sky, lit from within",
  heading: "Built for weather",
  body: [
    "Blackened timber, board-formed concrete and a low zinc roof pitched into the prevailing southerly. Inside, oak floors, wool, and twelve metres of glass that disappears into the wall when the wind drops.",
    "Hydronic underfloor heating throughout. A fireplace that will hold overnight. It is a warm house in a cold place, which is the whole point of it.",
  ],
  specs: [
    { label: "Sleeps", value: "8 across 4 bedrooms" },
    { label: "Bathrooms", value: "3, all with hot water on demand" },
    { label: "Kitchen", value: "Gas, full pantry, dishwasher" },
    { label: "Warmth", value: "Underfloor heating, wood fire" },
    { label: "Connection", value: "Starlink, 400 Mbps" },
    { label: "Parking", value: "Two cars, off the track" },
  ],
};

export const SPACES = [
  {
    name: "The Long Room",
    image: "/images/long-room.jpg",
    alt: "A long living room wrapped in glass, facing the ocean at dusk",
    note: "Twelve metres of glass, two sofas, and a fire that takes about an hour to fill the room. Most guests do not leave it before dark.",
  },
  {
    name: "Southerly",
    image: "/images/southerly.jpg",
    alt: "A concrete-walled bedroom with a long horizontal window onto the sea",
    note: "The main bedroom. Board-formed concrete, a linen bed facing a single horizontal window, and no curtain — you wake when the water does.",
  },
  {
    name: "The Table",
    image: "/images/table.jpg",
    alt: "A dining room filled with low golden light from the west",
    note: "Ten seats of oak. The western light arrives around six in summer and lands the length of it.",
  },
  {
    name: "The Terrace",
    image: "/images/terrace.jpg",
    alt: "A curved outdoor seating area sheltered from the wind, above the sea",
    note: "Cut into the lee of the ridge, so it holds still even when the ridge above it does not. A fire pit, and enough seating for everyone.",
  },
  {
    name: "The Quiet Room",
    image: "/images/quiet-room.jpg",
    alt: "A dark reading room with a large window onto the water",
    note: "One chair, one lamp, one window. The only room in the house without a speaker in it.",
  },
];

export const COAST = {
  image: "/images/cliff-gold.jpg",
  alt: "Limestone cliffs above a calm sea at golden hour",
  heading: "What is within half an hour",
  places: [
    { name: "Port Campbell", detail: "Bakery, pub, the swimming beach", time: "12 min" },
    { name: "Loch Ard Gorge", detail: "The walk down to the sand", time: "15 min" },
    { name: "The Twelve Apostles", detail: "Best an hour before sunrise", time: "18 min" },
    { name: "Timboon Distillery", detail: "Whisky, and the railway shed", time: "22 min" },
    { name: "Bay of Islands", detail: "Emptier than the Apostles, and better", time: "25 min" },
    { name: "Melbourne", detail: "The inland road, not the coast road", time: "3 hr 15" },
  ],
};

export const GALLERY = [
  { image: "/images/surf.jpg", alt: "Dark rock in white water below the cliffs at dusk" },
  { image: "/images/cliff-pale.jpg", alt: "Limestone cliffs under a pale lavender sky" },
  { image: "/images/window.jpg", alt: "A dark-framed window onto green water" },
  { image: "/images/water.jpg", alt: "Last gold light breaking up on black water" },
  { image: "/images/daybed.jpg", alt: "A daybed below a long window onto the sea" },
  { image: "/images/horizon.jpg", alt: "The sun on the horizon beside a cliff silhouette" },
];

export const GUESTS = [
  {
    quote:
      "We did not open the laptop once. On the second night the wind got up and we sat and watched it come across the water for two hours, which sounds like nothing and was the best part of the year.",
    name: "Anna and Pete",
    origin: "Fitzroy",
  },
  {
    quote:
      "Eight of us, four days, and nobody was ever in anyone's way. That is a very hard thing to design and they have done it.",
    name: "Marcus",
    origin: "Adelaide",
  },
];

export const BOOKING = {
  image: "/images/doorway.jpg",
  alt: "A dark room opening onto the last of the light",
  heading: "The house is quiet most of the winter",
  body: "Two-night minimum, from A$1,450 a night. Rates, the calendar and everything else are on the listing.",
};
