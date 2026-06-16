import fabiusLuminaRoseGold from "@/assets/images/Indikonnect_FabiusLumina_RoseGold.jpg";
import fabiusLuminaGold from "@/assets/images/Indikonnect_FabiusLumina_Gold.jpg";
import fabiusLuminaSteel from "@/assets/images/Indikonnect_FabiusLumina_Steel.jpg";
import fabiusResoluteBlack from "@/assets/images/Indikonnect_FabiusResolute_Black.jpg";
import fabiusResoluteBlue from "@/assets/images/Indikonnect_FabiusResolute_Blue.jpg";
import fabiusResoluteBrown from "@/assets/images/Indikonnect_FabiusResolute_Brown.jpg";
import aureategold1 from "@/assets/images/Indikonnect_AureateGold1_Dinner_Set.jpeg";
import crimsonsoverign1 from "@/assets/images/Indikonnect_CrimsonSoverign1_Dinner_Set.jpeg";
import royalopulence1 from "@/assets/images/Indikonnect_RoyalOpulence1_Dinner_Set.jpeg";
import spectrumluxe1 from "@/assets/images/Indikonnect_SpectrumLuxe1_Dinner_Set.jpeg";

export const categories = [
  { id: "horology", name: "Timeless Horology" },
  { id: "jewellery", name: "Elegant Jewellery" },
  { id: "dining", name: "Lifestyle Dining" },
];

export const priceRanges = [
  { value: "under-75k", label: "Under ₹75,000" },
  { value: "75k-125k", label: "₹75,000 – ₹1,25,000" },
  { value: "125k-175k", label: "₹1,25,000 – ₹1,75,000" },
  { value: "above-175k", label: "Above ₹1,75,000" },
];

export const variantOptions = ["Rose Gold", "Steel", "Gold", "Black", "Brown", "Blue", "Yellow Gold"];
export const materialOptions = ["18K Yellow Gold", "Diamond", "Gold Plated"];

// Helper for high-quality inline jewellery placeholder cards
const jewelleryPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="100%" height="100%" fill="%23fcf8f2"/><circle cx="250" cy="230" r="70" fill="none" stroke="%23dfb06c" stroke-width="4"/><circle cx="250" cy="160" r="15" fill="%23e8f4fd" stroke="%23b0cddb" stroke-width="2"/><text x="50%" y="370" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="17" fill="%238c7653">Fine Jewellery Collection</text><text x="50%" y="400" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="%23b5a182">Image Rendering Pending</text></svg>`;

export const allProducts = [
  // ─── TIMELESS HOROLOGY ───
  {
    id: "fabius-lumina-rose-gold",
    name: "Fabius Lumina Rose Gold",
    category: "horology",
    type: "Watch",
    imageBg: "#f5e6d8",
    specs: {
      movement: "Japanese",
      caseSize: "30.0mm",
      thickness: "6.7mm",
      caseMaterial: "Stainless Steel",
      topGlass: "Flat Sapphire Crystal",
      dial: "MOP with applied indexes",
      bandSize: "19.5mm",
      bandType: "Stainless steel solid separate 5 links bracelet with butterfly clasp",
      waterResistance: "5ATM",
    },
    variants: [
      {
        name: "Rose Gold",
        productCode: "3002610",
        baPrice: 86480,
        retailPrice: 90804,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaRoseGold,
        description: "Inspired by the gentle warmth of dawn, the Fabius Lumina Rose Gold is a masterclass in clarity and feminine brilliance. At its heart lies a luminous Mother-of-Pearl dial that catches and refracts the light, creating a continuous, commanding glow. Housed beneath a pristine flat sapphire crystal, the ultra-slim 6.7mm case and elegantly integrated 5-link bracelet drape seamlessly across the wrist. Adorned with a shimmering, stone-set bezel and applied indices, this timepiece is a perfect harmony of graceful elegance and unwavering precision.",
      },
      {
        name: "Steel",
        productCode: "3002611",
        baPrice: 85540,
        retailPrice: 89817,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaSteel,
        description: "Striking and sophisticated, the Fabius Lumina Steel draws the eye deep into its iridescent, dark Mother-of-Pearl dial. Enclosed in a sleek 30mm stainless steel silhouette, this timepiece reflects bold clarity and modern confidence. The brilliant, crystal-set bezel and delicately applied indexes create a dramatic, starry contrast against the cool, brushed-steel 5-link bracelet, catching the light dynamically with every movement. A commanding and versatile accessory for the woman who owns her time.",
      },
      {
        name: "Gold",
        productCode: "3002612",
        baPrice: 86480,
        retailPrice: 90804,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaGold,
        description: "Radiating pure, classic opulence, the Fabius Lumina Gold frames its ethereal Mother-of-Pearl dial in a rich, golden hue. The flawless flat sapphire crystal protects a face that dances with light, highlighted by a halo of brilliant accents along the bezel and indices. Its solid 5-link bracelet, secured by a seamless butterfly clasp, ensures a delicate yet enduring fit. A celebration of majestic brilliance and commanding grace, designed to illuminate your most cherished moments.",
      },
    ],
  },
  {
    id: "fabius-resolute-black",
    name: "Fabius Resolute Black",
    category: "horology",
    type: "Watch",
    imageBg: "#2d3748",
    specs: {
      movement: "Seagull (Automatic Skeleton)",
      caseSize: "42.0mm",
      caseMaterial: "Stainless Steel",
      topGlass: "Flat Sapphire Crystal",
      bottomGlass: "Flat Mineral Crystal",
      dial: "Texture dial with applied indexes",
      bandSize: "22-20mm",
      bandType: "Stainless steel buckle, Leather Strap",
      waterResistance: "5ATM",
      caseback: "See-through screw caseback",
    },
    variants: [
      {
        name: "Black",
        productCode: "5002610",
        baPrice: 109980,
        retailPrice: 115479,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBlack,
        description: "A tribute to architectural strength and precision engineering, the Fabius Resolute Black strips away the superfluous to reveal the beating heart within. The see-through skeleton dial and exhibition caseback expose the enduring, rhythmic dance of its automatic mechanics, protected by scratch-resistant flat sapphire crystal. Framed in a bold 42mm stainless steel case and paired with a premium textured black leather strap, this timepiece reflects an unwavering mindset and a strong core. Engineered for the modern man who thrives under pressure.",
      },
      {
        name: "Brown",
        productCode: "5002611",
        baPrice: 111860,
        retailPrice: 117453,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBrown,
        description: "Blending vintage charm with high-tech mechanical mastery, the Fabius Resolute Brown showcases the exposed, perpetual motion of its automatic skeleton movement. The sophisticated 42mm case is accented by a striking golden bezel, seamlessly transitioning into a rich, textured brown leather strap. Guarded by a flat sapphire crystal, the intricate gears and springs within represent endurance and a resilient core. A timeless, distinguished companion for those who forge their own enduring path.",
      },
      {
        name: "Blue",
        productCode: "5002612",
        baPrice: 109980,
        retailPrice: 115479,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBlue,
        description: "Bold, dynamic, and unyielding, the Fabius Resolute Blue commands attention with its striking nautical blue chapter ring and perfectly matched textured leather strap. The 42mm stainless steel case houses a fully exposed automatic skeleton movement, offering a transparent display of intricate mechanics through a flawless sapphire crystal. This exposure of the watch's inner workings serves as a daily reminder of inner strength and precision. A timepiece that perfectly balances contemporary, adventurous style with the enduring ability to withstand life's pressures.",
      },
    ],
  },

  // ─── LIFESTYLE DINING ───
  {
    id: "crimson-sovereign-dinner",
    name: "Crimson Sovereign — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#fef2f2",
    description: "A 34-piece Porcelain 24kt Gold Plated dinner set of regal elegance. Each piece is finished with intricate gold detailing, bringing the grandeur of a royal table to your home.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 34,
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Salad Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Salad Bowl", qty: 6 },
        { item: "Spoon", qty: 6 },
        { item: "Large Bowl", qty: 3 },
        { item: "Plate", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002612", baPrice: 184240, retailPrice: 193452, cv: 1800, shippingCost: 1500, image: crimsonsoverign1 },
    ],
  },
  {
    id: "spectrum-luxe",
    name: "Spectrum Luxe — Dinner & Tea Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#f0f4fe",
    description: "A bold 47-piece Porcelain 24kt Gold Plated set with a striking geometrical design. Combining a full dinner and tea service, Spectrum Luxe brings contemporary artistry to the luxury dining table.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 47,
      design: "Geometrical",
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Dessert Bowl", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Casserole", qty: 1 },
        { item: "Casserole Lid", qty: 1 },
        { item: "Platter", qty: 1 },
        { item: "Large Salad Bowl", qty: 2 },
        { item: "Large Bowl", qty: 1 },
        { item: "Tea Cup", qty: 6 },
        { item: "Saucer", qty: 6 },
        { item: "Tea Pot", qty: 1 },
        { item: "Tea Pot Lid", qty: 1 },
        { item: "Milk / Creamer", qty: 1 },
        { item: "Sugar Bowl", qty: 1 },
        { item: "Sugar Bowl Lid", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002611", baPrice: 131600, retailPrice: 138180, cv: 1200, shippingCost: 1500, image: spectrumluxe1 },
    ],
  },
  {
    id: "royal-opulance",
    name: "Royal Opulance — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#f0fdf4",
    description: "A sweeping 54-piece Porcelain 24kt Gold Plated dinner set for those who entertain at the highest standard. Royal Opulance is a complete luxury dining experience, with every piece finished in the finest gold detailing.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 54,
      contents: [
        { item: "Soup Bowl", qty: 6 },
        { item: "Soup Spoon", qty: 6 },
        { item: "Dinner Plate", qty: 6 },
        { item: "Salad Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Dessert Bowl", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Cassarole", qty: 2 },
        { item: "Cassarole Lid", qty: 2 },
        { item: "Platter", qty: 1 },
        { item: "Large Salad Bowl", qty: 2 },
        { item: "Large Bowl", qty: 1 },
        { item: "Pickle Jar", qty: 2 },
        { item: "Pickle Jar Lid", qty: 2 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002610", baPrice: 183300, retailPrice: 192465, cv: 1800, shippingCost: 1500, image: royalopulence1 },
    ],
  },
  {
    id: "aureate-gold",
    name: "Aureate Gold — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#fffbeb",
    description: "A refined 20-piece Porcelain 24kt Gold Plated dinner set for intimate dining. Aureate Gold brings warmth and elegance to everyday occasions, with rich gold accents on every piece.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 20,
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Salad Bowl", qty: 1 },
        { item: "Platter", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002615", baPrice: 69635, retailPrice: 72992, cv: 600, shippingCost: 750, image: aureategold1 },
    ],
  },

  // ─── ELEGANT JEWELLERY ───
  {
    id: "pendant-cv600-1",
    name: "Diamond Pendant — Amora",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "5 stones / 0.083 CTs",
      goldWeight: "0.3g gross: 0.308g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002610", 
        baPrice: 56250, 
        retailPrice: 58360, 
        cv: 600, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Amora Pendant features a modern horizontal bar design with a subtle bridge of light. A sleek, gracefully arched bar of polished 18K gold cradles a horizontal row of graduated diamonds. The minimalist linear setting allows the stones to take center stage, creating a subtle, floating curve of light that rests perfectly along the natural contour of the collarbone. A reflection of modern minimal luxury, engineered for effortless daily wear." 
      },
    ],
  },
  {
    id: "pendant-cv600-2",
    name: "Diamond Pendant — Maya",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "7 stones / 0.112 CTs",
      goldWeight: "0.42g gross: 0.435g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002611", 
        baPrice: 56550, 
        retailPrice: 58750, 
        cv: 600, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Maya Pendant celebrates natural symmetry with a radiant teardrop cluster. A central, brilliant-cut diamond is ringed by an engineered layout of accent stones, working together to amplify fire and reflection. Suspended from an integrated structural loop, this piece captures a timeless aesthetic while adding unmatched, brilliant dimensionality to formal and smart-casual ensembles alike." 
      },
    ],
  },
  {
    id: "pendant-cv600-3",
    name: "Diamond Pendant — Chloe",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "12 stones / 0.145 CTs",
      goldWeight: "0.5g gross: 0.518g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002612", 
        baPrice: 58425, 
        retailPrice: 61048, 
        cv: 600, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Art Deco charm meets clean-lined modern architecture in the Chloe Pendant. This unique rectangular shield layout stacks brilliant diamonds within a subtle, highly polished gold border. Offering clean lines and a distinctly geometric presentation, it is designed for individuals who appreciate sharp elegance and structured, artistic execution." 
      },
    ],
  },
  {
    id: "pendant-cv1200-1",
    name: "Diamond Pendant — Cora",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "22 stones / 0.28 CTs",
      goldWeight: "1.2g gross: 1.235g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002613", 
        baPrice: 123163, 
        retailPrice: 128687, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Cora Pendant offers a spectacular open-weave medallion form that catches light from every angle. Featuring dual concentrated concentric rings of pavé-set diamonds divided by a channel of radiant gold, it provides a striking multi-dimensional landscape. A bold yet remarkably lightweight accessory crafted for red carpets and milestone occasions." 
      },
    ],
  },
  {
    id: "pendant-cv1200-2",
    name: "Diamond Pendant — Diana",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "18 stones / 0.25 CTs",
      goldWeight: "1.15g gross: 1.185g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002614", 
        baPrice: 120775, 
        retailPrice: 126036, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by classical celestial crowns, the Diana Pendant features an explosive crescent cluster of brilliant-cut diamonds. Each diamond points outward along structural polished gold prongs, maximizing standard dispersion and ambient reflection. This dramatic arrangement bridges historic royal status with contemporary luxury aesthetics." 
      },
    ],
  },
  {
    id: "pendant-cv1200-3",
    name: "Diamond Pendant — Elena",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "16 stones / 0.22 CTs",
      goldWeight: "1.08g gross: 1.112g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002615", 
        baPrice: 119510, 
        retailPrice: 124877, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A sweeping, fluid silhouette defining contemporary minimalism. The Elena Pendant features two overlapping ribbons of premium gold and meticulous pavé diamonds that twist together in a soft, organic wave. Its subtle asymmetric loop represents an endless journey, offering an elegant choice for daily statement styling." 
      },
    ],
  },
  {
    id: "pendant-cv1200-4",
    name: "Diamond Pendant — Freya",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "26 stones / 0.31 CTs",
      goldWeight: "1.32g gross: 1.365g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002616", 
        baPrice: 126990, 
        retailPrice: 132590, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Freya Pendant exhibits an intricate geometric web configuration layout. Inspired by classical architectural structures, its interlocking gold paths hold diamond nodes that form a brilliant floral mosaic pattern. A masterpiece of precise micro-setting execution tailored for sophisticated jewelry connoisseurs." 
      },
    ],
  },
  {
    id: "pendant-cv1200-5",
    name: "Diamond Pendant — Grace",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "24 stones / 0.29 CTs",
      goldWeight: "1.28g gross: 1.315g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002617", 
        baPrice: 127575, 
        retailPrice: 133364, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Capturing the serene balance of water droplets, the Grace Pendant showcases a long, elegant pear-shaped layout outline. The inner drop is micro-paved with brilliant diamonds, while an outer mirror-finished solid gold ring creates a high-contrast protective perimeter. A classic choice that elongates and flatters the neckline beautifully." 
      },
    ],
  },
  {
    id: "pendant-cv1800-1",
    name: "Diamond Pendant — Iris",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "38 stones / 0.45 CTs",
      goldWeight: "1.75g gross: 1.812g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002618", 
        baPrice: 161575, 
        retailPrice: 168792, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "An open shield medallion showcasing complex design and master-level setting. The Iris Pendant frames an elevated central flower motif within layers of precision pavé borders. Designed for maximum light reflection and movement, this substantial piece commands immediate attention across any room." 
      },
    ],
  },
  {
    id: "pendant-cv1800-2",
    name: "Diamond Pendant — Juno",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "42 stones / 0.48 CTs",
      goldWeight: "1.82g gross: 1.875g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002619", 
        baPrice: 163860, 
        retailPrice: 171173, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Juno Pendant exhibits an explosive starburst structure array. Slender rays of 18K yellow gold fan out from a brilliant center diamond cluster, with alternating polished gold lines and diamond tips. This striking graphic design brings structural drama and unmatched energy to high-fashion ensembles." 
      },
    ],
  },
  {
    id: "pendant-cv1800-3",
    name: "Diamond Pendant — Kiara",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "45 stones / 0.52 CTs",
      goldWeight: "1.91g gross: 1.968g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002620", 
        baPrice: 171760, 
        retailPrice: 180796, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A signature statement of high luxury. The Kiara Pendant holds an elegant grid of baguette-cut diamonds, securely framed by brilliant accent rows. Combining structural symmetry with exquisite luxury, it is a timeless investment piece for collectors who value premium craftsmanship." 
      },
    ],
  },
  {
    id: "pendant-cv1800-4",
    name: "Diamond Pendant — Lyra",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "40 stones / 0.46 CTs",
      goldWeight: "1.72g gross: 1.775g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002621", 
        baPrice: 162508, 
        retailPrice: 169988, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by classical stringed lyres, this pendant features sweeping, harp-like gold lines accented by precise diamond borders. The flowing negative space creates a delicate, lightweight appearance that moves gracefully with every step." 
      },
    ],
  },
  {
    id: "pendant-cv1800-5",
    name: "Diamond Pendant — Nova",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "44 stones / 0.50 CTs",
      goldWeight: "1.85g gross: 1.905g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002622", 
        baPrice: 167560, 
        retailPrice: 174693, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A bold astronomical interpretation featuring clean intersecting cosmic orbit vectors. Rings of polished gold and channels of brilliant diamonds intertwine, centering around an unyielding core diamond. A modern sculptural marvel tailored for progressive tastemakers." 
      },
    ],
  },
  {
    id: "earrings-cv1200-1",
    name: "Diamond Earrings — Opal Halo",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "28 stones / 0.32 CTs",
      goldWeight: "1.35g gross: 1.392g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002623", 
        baPrice: 119890, 
        retailPrice: 125353, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A master study in classic harmony, the Opal Halo Studs arrange a border of diamonds around a clear central field. Balanced meticulously for weight, they rest flush against the earlobe, making them perfect for luxury daily wear." 
      },
    ],
  },
  {
    id: "earrings-cv1200-2",
    name: "Diamond Earrings — Square Drop",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "32 stones / 0.36 CTs",
      goldWeight: "1.48g gross: 1.525g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002624", 
        baPrice: 127375, 
        retailPrice: 133075, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Featuring a cascading geometric drop, these earrings connect a polished square stud to an articulated open drop element. Lined completely with micro-paved stones, they catch the light beautifully with every movement." 
      },
    ],
  },
  {
    id: "earrings-cv1800-1",
    name: "Diamond Earrings — Darlene",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "48 stones / 0.55 CTs",
      goldWeight: "1.92g gross: 1.985g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002625", 
        baPrice: 177575, 
        retailPrice: 185579, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Darlene Earrings capture the vibrant energy of a sunrise. Slender arcs of 18K yellow gold fan outward from a central focal point, each ray culminating in a brilliant diamond setting. This cascading drop effect captures movement beautifully, offering an airy, sculptural silhouette that sways gracefully with every turn of the head. Feminine and bold, these earrings are designed to light up the face with an effortless, celebratory glow." 
      },
    ],
  },
  {
    id: "earrings-cv1800-2",
    name: "Diamond Earrings — Faye",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "40 stones / 0.221 CTs",
      goldWeight: "1.42g gross: 1.46g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002626", 
        baPrice: 183855, 
        retailPrice: 192135, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by the concept of eternal grace, the Faye Earrings feature a rhythmic infinity silhouette crafted in 18K yellow gold. Interlocking bands of polished gold and diamond-encrusted curves weave together to form a seamless figure-eight. This intricate overlapping of textures creates a continuous play of light and shadow, resulting in a look that is both fluid and structurally captivating. A sophisticated choice for the modern woman." 
      },
    ],
  },
];