import outing1 from "@/assets/outing1.jpg";
import outing2 from "@/assets/outing2.jpg";
import outing3 from "@/assets/outing3.jpg";
import outing4 from "@/assets/outing4.jpg";
import outing5 from "@/assets/outing5.jpg";
import outing6 from "@/assets/outing6.jpg";

export type Category = "Camping" | "Beach" | "Mountain";

export interface Organizer {
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Outing {
  id: string;
  title: string;
  destination: string;
  category: Category;
  date: string; // ISO
  image: string;
  spotsTotal: number;
  spotsTaken: number;
  organizer: Organizer;
  description: string;
  whatToBring: string[];
  participants: { name: string; initials: string; color: string }[];
}

const people = [
  { name: "Yasmine", initials: "YA", color: "#c17c74" },
  { name: "Youssef", initials: "YO", color: "#8b6f5e" },
  { name: "Salma", initials: "SA", color: "#d4a574" },
  { name: "Rayan", initials: "RA", color: "#9a7a5b" },
  { name: "Imane", initials: "IM", color: "#c2956b" },
  { name: "Anas", initials: "AN", color: "#a67c5b" },
  { name: "Khadija", initials: "KH", color: "#b06b5e" },
];

export const outings: Outing[] = [
  {
    id: "bin-el-ouidane-camp",
    title: "Bin El Ouidane Lakeside Camp",
    destination: "Bin El Ouidane, Azilal",
    category: "Camping",
    date: "2026-07-12T17:00:00",
    image: outing1,
    spotsTotal: 8,
    spotsTaken: 5,
    organizer: { name: "Yasmine Benali", initials: "YB", avatarColor: "#c17c74" },
    description:
      "Two-day camp on the turquoise lake of Bin El Ouidane in the Atlas. Sunset paddle, tagine by the fire and a sunrise swim. Easy access, beginner friendly.",
    whatToBring: ["Tent & sleeping bag", "Headlamp", "Reusable mug", "Swimsuit", "A story to share"],
    participants: people.slice(0, 5),
  },
  {
    id: "dades-gorges-trek",
    title: "Dades Gorges Sunset Trek",
    destination: "Dades Gorges, Tinghir",
    category: "Mountain",
    date: "2026-07-19T15:30:00",
    image: outing2,
    spotsTotal: 10,
    spotsTaken: 7,
    organizer: { name: "Youssef Amrani", initials: "YA", avatarColor: "#8b6f5e" },
    description:
      "A 9 km loop through the red rock walls of the Dades, finishing on a ridge for golden hour. Moderate pace. Mint tea break halfway.",
    whatToBring: ["Hiking shoes", "2L water", "Snack to share", "Layer for evening"],
    participants: people.slice(1, 7),
  },
  {
    id: "imsouane-surf-morning",
    title: "Imsouane Surf Morning",
    destination: "Imsouane, La Baie",
    category: "Beach",
    date: "2026-07-05T08:00:00",
    image: outing3,
    spotsTotal: 6,
    spotsTaken: 4,
    organizer: { name: "Salma Bennis", initials: "SB", avatarColor: "#d4a574" },
    description:
      "Dawn session on the longest right-hander in Morocco, followed by msemen and orange juice on the cliff. Boards available to share for all levels.",
    whatToBring: ["Swimwear", "Towel", "Reef-safe sunscreen", "Appetite"],
    participants: people.slice(0, 4),
  },
  {
    id: "toubkal-summit",
    title: "Toubkal Summit Push",
    destination: "Mount Toubkal, High Atlas",
    category: "Mountain",
    date: "2026-08-02T04:30:00",
    image: outing4,
    spotsTotal: 6,
    spotsTaken: 6,
    organizer: { name: "Rayan El Idrissi", initials: "RE", avatarColor: "#9a7a5b" },
    description:
      "Alpine start from the refuge for a sunrise on North Africa's highest peak. Technical sections, prior trekking experience required. Back to Imlil by afternoon.",
    whatToBring: ["Crampons", "Helmet", "Warm layers", "Headlamp", "1.5L water"],
    participants: people.slice(2, 7),
  },
  {
    id: "ifrane-cedar-hike",
    title: "Ifrane Cedar Forest Day Hike",
    destination: "Cedraie d'Ifrane, Middle Atlas",
    category: "Camping",
    date: "2026-07-26T09:00:00",
    image: outing5,
    spotsTotal: 12,
    spotsTaken: 3,
    organizer: { name: "Imane Tazi", initials: "IT", avatarColor: "#c2956b" },
    description:
      "Slow day among centenary cedars with a picnic clearing, Barbary macaques and a small talk on local fauna. Dogs welcome.",
    whatToBring: ["Picnic to share", "Comfortable shoes", "Camera"],
    participants: people.slice(3, 6),
  },
  {
    id: "taghazout-kayak",
    title: "Taghazout Hidden Cove Kayak",
    destination: "Taghazout, Anchor Point",
    category: "Beach",
    date: "2026-08-09T10:00:00",
    image: outing6,
    spotsTotal: 8,
    spotsTaken: 2,
    organizer: { name: "Anas Cherkaoui", initials: "AC", avatarColor: "#a67c5b" },
    description:
      "Paddle north from Taghazout to a cove only reachable by sea. Swim, snorkel and grilled sardines on the sand. Kayaks included.",
    whatToBring: ["Swimwear", "Dry bag", "Water bottle", "Snacks"],
    participants: people.slice(0, 3),

  },
];

export function getOuting(id: string) {
  return outings.find((o) => o.id === id);
}

export const currentUser = {
  name: "Yasmine Benali",
  initials: "YB",
  bio: "Casablancaise, trail runner et chasseuse de levers de soleil. Toujours partante pour un café à 5h avant de prendre la route de l'Atlas.",
  tags: ["Camping lover", "Beach addict", "Sunrise hiker"],
  organized: ["bin-el-ouidane-camp"],
  joined: ["imsouane-surf-morning", "ifrane-cedar-hike"],
};
