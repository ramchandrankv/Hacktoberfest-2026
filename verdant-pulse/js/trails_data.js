/**
 * VerdantPulse - Trail & Phenology Regional Datasets
 * Historical tabular data for TabPFN foliage prediction & regional biodiversity
 */

const TRAILS_DATABASE = [
  {
    id: "white-mountains-franconia",
    name: "Franconia Ridge Loop",
    region: "White Mountains, New Hampshire, USA",
    latitude: 44.1611,
    longitude: -71.6811,
    elevationMeters: 1463,
    trailLengthKm: 14.3,
    difficulty: "Strenuous",
    forestType: "Northern Hardwood & Balsam Fir",
    dominantSpecies: ["Sugar Maple", "Yellow Birch", "American Beech", "Balsam Fir", "Paper Birch"],
    historicalTabularData: [
      // DayOfYear, Elevation(m), Lat, MeanTemp(C), RainLast7d(mm), CanopyCoverage(%) -> FoliageScore(0-100), MudRisk(0-10)
      [265, 1400, 44.16, 11.2, 12, 85, 38, 3],
      [272, 1400, 44.16, 8.5, 4, 85, 74, 2],
      [279, 1400, 44.16, 5.1, 28, 80, 96, 7], // Peak early October
      [286, 1400, 44.16, 3.2, 18, 65, 68, 6], // Past peak
      [293, 1400, 44.16, 0.5, 45, 40, 25, 8]  // Late fall
    ],
    tactileHints: {
      touch: "Touch the papery white peeling bark of mature Paper Birches and the velvet moss on glacial granite boulders.",
      sight: "Look for high-contrast golden birches against deep spruce greens on the knife-edge ridge at 1,200m.",
      scent: "The crisp resinous aroma of wet balsam fir needles mixed with cold alpine rock air."
    }
  },
  {
    id: "blue-ridge-craggy-gardens",
    name: "Craggy Pinnacle Trail",
    region: "Blue Ridge Parkway, North Carolina, USA",
    latitude: 35.7022,
    longitude: -82.3789,
    elevationMeters: 1795,
    trailLengthKm: 2.3,
    difficulty: "Moderate",
    forestType: "Southern Appalachian Spruce-Fir & Heath Bald",
    dominantSpecies: ["Mountain Ash", "Catawba Rhododendron", "Red Spruce", "Scarlet Oak", "Black Cherry"],
    historicalTabularData: [
      [270, 1750, 35.70, 14.5, 8, 90, 42, 2],
      [278, 1750, 35.70, 11.8, 15, 88, 70, 3],
      [285, 1750, 35.70, 9.2, 10, 85, 98, 4], // Peak mid October
      [292, 1750, 35.70, 7.0, 32, 70, 82, 6],
      [300, 1750, 35.70, 4.8, 22, 50, 40, 5]
    ],
    tactileHints: {
      touch: "Feel the leathery, tough evergreen leaves of rhododendron and the rough lichen encrusting the summit quartzite.",
      sight: "Crimson Mountain Ash berries dangling like lanterns against the backdrop of blue haze ridges.",
      scent: "Earthy humic forest soil and crushed sweet birch bark along the shaded stair sections."
    }
  },
  {
    id: "adirondacks-mount-jo",
    name: "Mount Jo Loop & Heart Lake",
    region: "Adirondack High Peaks, New York, USA",
    latitude: 44.1866,
    longitude: -73.9686,
    elevationMeters: 877,
    trailLengthKm: 4.2,
    difficulty: "Moderate",
    forestType: "Transition Mixed Boreal-Hardwood",
    dominantSpecies: ["Red Maple", "Sugar Maple", "Eastern Hemlock", "Quaking Aspen", "White Pine"],
    historicalTabularData: [
      [262, 850, 44.18, 12.8, 18, 92, 35, 4],
      [270, 850, 44.18, 9.5, 22, 90, 82, 6],
      [276, 850, 44.18, 6.2, 14, 88, 99, 4], // Peak first week of Oct
      [284, 850, 44.18, 4.5, 30, 72, 72, 7],
      [292, 850, 44.18, 2.0, 40, 45, 30, 8]
    ],
    tactileHints: {
      touch: "Crush dry fallen sugar maple leaves in your hands; feel the soft spongy humus blanket underfoot.",
      sight: "Look for Heart Lake reflecting mirrored walls of vibrant orange and fiery scarlet red maples.",
      scent: "Petrichor rising from damp lakeside pine needles and cool lake mist at sunrise."
    }
  },
  {
    id: "shenandoah-old-rag",
    name: "Old Rag Mountain Trail",
    region: "Shenandoah National Park, Virginia, USA",
    latitude: 38.5529,
    longitude: -78.3168,
    elevationMeters: 996,
    trailLengthKm: 15.1,
    difficulty: "Very Strenuous (Rock Scramble)",
    forestType: "Oak-Hickory Forest & Granite Balds",
    dominantSpecies: ["Chestnut Oak", "Red Oak", "Shagbark Hickory", "Witch Hazel", "Eastern Redcedar"],
    historicalTabularData: [
      [275, 950, 38.55, 16.0, 10, 88, 40, 2],
      [283, 950, 38.55, 13.5, 5, 88, 71, 1],
      [290, 950, 38.55, 10.8, 12, 85, 95, 3], // Peak mid/late Oct
      [298, 950, 38.55, 8.2, 24, 75, 85, 4],
      [306, 950, 38.55, 5.5, 35, 55, 48, 6]
    ],
    tactileHints: {
      touch: "Grip the rough, billion-year-old Old Rag granite boulders during the scramble; feel the warm sunlit stone.",
      sight: "Golden yellow hickory crowns glowing like torches through the brown and amber oak canopy.",
      scent: "Subtle spicy sweetness of yellow autumn witch-hazel flowers blooming along the shaded stream hollows."
    }
  },
  {
    id: "tamalpais-steep-ravine",
    name: "Steep Ravine & Matt Davis Loop",
    region: "Mount Tamalpais, California, USA",
    latitude: 37.9042,
    longitude: -122.6288,
    elevationMeters: 785,
    trailLengthKm: 11.8,
    difficulty: "Moderate to Strenuous",
    forestType: "Coastal Redwood & Mixed Evergreen",
    dominantSpecies: ["Coast Redwood", "Douglas Fir", "California Bay Laurel", "Tanoak", "Sword Fern"],
    historicalTabularData: [
      [280, 500, 37.90, 18.2, 2, 95, 20, 1],
      [290, 500, 37.90, 16.5, 8, 95, 30, 2],
      [300, 500, 37.90, 15.0, 15, 95, 50, 3], // California autumn: subtle golden bay laurel & bigleaf maple
      [310, 500, 37.90, 13.5, 25, 95, 65, 4],
      [320, 500, 37.90, 12.0, 40, 95, 75, 5]
    ],
    tactileHints: {
      touch: "Touch the fibrous, spongy, cinnamon-colored bark of ancient Coast Redwoods; feel the damp morning fog condensate.",
      sight: "Towering redwoods filtered through rolling Pacific ocean fog banks; giant golden bigleaf maple leaves on the creek bed.",
      scent: "Crushed California Bay leaves releasing invigorating menthol and peppery evergreen oils."
    }
  },
  {
    id: "olympic-hoh-rainforest",
    name: "Hall of Mosses & Hoh River Trail",
    region: "Olympic National Park, Washington, USA",
    latitude: 47.8601,
    longitude: -123.9351,
    elevationMeters: 180,
    trailLengthKm: 6.8,
    difficulty: "Easy to Moderate",
    forestType: "Temperate Rainforest",
    dominantSpecies: ["Sitka Spruce", "Western Hemlock", "Bigleaf Maple", "Club Moss", "Sword Fern"],
    historicalTabularData: [
      [270, 180, 47.86, 13.0, 45, 98, 45, 7],
      [280, 180, 47.86, 10.5, 60, 98, 75, 8],
      [290, 180, 47.86, 8.2, 85, 95, 95, 9], // Bigleaf maples turn luminous neon yellow draping moss
      [300, 180, 47.86, 6.0, 110, 85, 78, 10],
      [310, 180, 47.86, 4.5, 140, 70, 50, 10]
    ],
    tactileHints: {
      touch: "Touch thick emerald hanging carpets of club moss (Selaginella oregana); feel how water-saturated and pillow-soft it is.",
      sight: "Enormous Bigleaf Maple branches weeping with curtains of golden-green moss like primeval cathedral chandeliers.",
      scent: "Pure ozone, cold glacier river spray, and deep, oxygen-rich ancient humus."
    }
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TRAILS_DATABASE };
}
