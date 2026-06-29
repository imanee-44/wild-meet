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
  { name: "Mara", initials: "MA", color: "#C17B5C" },
  { name: "Jonas", initials: "JO", color: "#2D4A3E" },
  { name: "Lila", initials: "LI", color: "#8a5a3b" },
  { name: "Ravi", initials: "RA", color: "#6b8e6a" },
  { name: "Sofia", initials: "SO", color: "#d49b6a" },
  { name: "Theo", initials: "TH", color: "#4a6b5c" },
  { name: "Aya", initials: "AY", color: "#b8674a" },
];

export const outings: Outing[] = [
  {
    id: "lake-mira-overnight",
    title: "Lake Mira Overnight Camp",
    destination: "Lake Mira, Pine Valley",
    category: "Camping",
    date: "2026-07-12T17:00:00",
    image: outing1,
    spotsTotal: 8,
    spotsTaken: 5,
    organizer: { name: "Mara Vidal", initials: "MV", avatarColor: "#C17B5C" },
    description:
      "Two-day lakeside camp with sunset paddle, campfire dinner and a sunrise swim. Easy access, beginner friendly. Bring a hammock and your favorite playlist.",
    whatToBring: ["Tent & sleeping bag", "Headlamp", "Reusable mug", "Swimsuit", "A story to share"],
    participants: people.slice(0, 5),
  },
  {
    id: "red-canyon-trek",
    title: "Red Canyon Sunset Trek",
    destination: "Red Canyon, Sage County",
    category: "Mountain",
    date: "2026-07-19T15:30:00",
    image: outing2,
    spotsTotal: 10,
    spotsTaken: 7,
    organizer: { name: "Jonas Park", initials: "JP", avatarColor: "#2D4A3E" },
    description:
      "A 9 km loop through slot canyons, finishing on a ridge for golden hour. Moderate pace. We'll stop for tea halfway and watch the colors turn.",
    whatToBring: ["Hiking shoes", "2L water", "Snack to share", "Layer for evening"],
    participants: people.slice(1, 7),
  },
  {
    id: "wild-surf-saturday",
    title: "Wild Surf Saturday",
    destination: "Costa Selva, North Beach",
    category: "Beach",
    date: "2026-07-05T08:00:00",
    image: outing3,
    spotsTotal: 6,
    spotsTaken: 4,
    organizer: { name: "Lila Romero", initials: "LR", avatarColor: "#8a5a3b" },
    description:
      "Morning surf session for all levels followed by a slow breakfast on the dunes. Boards available to share if you don't have one.",
    whatToBring: ["Swimwear", "Towel", "Reef-safe sunscreen", "Appetite"],
    participants: people.slice(0, 4),
  },
  {
    id: "alpenglow-summit",
    title: "Alpenglow Summit Push",
    destination: "Mount Ferra, North Ridge",
    category: "Mountain",
    date: "2026-08-02T04:30:00",
    image: outing4,
    spotsTotal: 6,
    spotsTaken: 6,
    organizer: { name: "Ravi Singh", initials: "RS", avatarColor: "#6b8e6a" },
    description:
      "Alpine start for a sunrise summit. Technical sections, prior hiking experience required. We'll be back at the trailhead by lunch.",
    whatToBring: ["Crampons", "Helmet", "Warm layers", "Headlamp", "1.5L water"],
    participants: people.slice(2, 7),
  },
  {
    id: "pine-trail-day-hike",
    title: "Pine Trail Day Hike",
    destination: "Old Pine Forest",
    category: "Camping",
    date: "2026-07-26T09:00:00",
    image: outing5,
    spotsTotal: 12,
    spotsTaken: 3,
    organizer: { name: "Sofia Bruni", initials: "SB", avatarColor: "#d49b6a" },
    description:
      "A relaxed forest day with a picnic clearing, optional swim and a small ranger talk on local flora. Dogs welcome.",
    whatToBring: ["Picnic to share", "Comfortable shoes", "Camera"],
    participants: people.slice(3, 6),
  },
  {
    id: "hidden-cove-kayak",
    title: "Hidden Cove Kayak Day",
    destination: "Selva Cove",
    category: "Beach",
    date: "2026-08-09T10:00:00",
    image: outing6,
    spotsTotal: 8,
    spotsTaken: 2,
    organizer: { name: "Theo Marsh", initials: "TM", avatarColor: "#4a6b5c" },
    description:
      "Paddle to a hidden cove only reachable from the water, swim, snorkel and lunch on the sand. Kayaks included.",
    whatToBring: ["Swimwear", "Dry bag", "Water bottle", "Snacks"],
    participants: people.slice(0, 3),
  },
];

export function getOuting(id: string) {
  return outings.find((o) => o.id === id);
}

export const currentUser = {
  name: "Mara Vidal",
  initials: "MV",
  bio: "Trail runner, weekend camper and golden-hour chaser. Mostly here to find people who'll wake up at 5am for a sunrise.",
  tags: ["🏕️ Camping lover", "🌊 Beach addict", "🏔️ Sunrise hiker"],
  organized: ["lake-mira-overnight"],
  joined: ["wild-surf-saturday", "pine-trail-day-hike"],
};
