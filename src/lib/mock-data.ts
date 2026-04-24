export type Sport = "Run" | "Ride" | "Swim" | "Hike" | "Walk";

export interface Athlete {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  city: string;
  country: string;
  followers: number;
  following: number;
  bio: string;
  isFollowing?: boolean;
}

export interface Activity {
  id: string;
  athleteId: string;
  sport: Sport;
  title: string;
  description?: string;
  date: string;
  distanceKm: number;
  movingSeconds: number;
  elevationM: number;
  avgHr?: number;
  avgPaceSecPerKm?: number;
  avgSpeedKmh?: number;
  kudos: number;
  comments: { id: string; athleteId: string; text: string }[];
  achievements: number;
  photo?: string;
  routeSeed: number;
  splits?: { km: number; paceSec: number; hr: number; elev: number }[];
  segments?: { id: string; rank: number }[];
  kudoed?: boolean;
}

export interface Segment {
  id: string;
  name: string;
  sport: Sport;
  location: string;
  distanceKm: number;
  avgGrade: number;
  elevationM: number;
  attempts: number;
  athletes: number;
  myBestSec?: number;
  korSec: number;
  korAthlete: string;
  routeSeed: number;
}

export interface Club {
  id: string;
  name: string;
  sport: Sport | "Multisport";
  city: string;
  members: number;
  cover: string;
  description: string;
  joined?: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  sport: Sport | "Multisport";
  goalKm: number;
  myProgressKm: number;
  participants: number;
  endsAt: string;
  badge: string;
  joined?: boolean;
}

export interface AppData {
  me: Athlete;
  athletes: Athlete[];
  activities: Activity[];
  segments: Segment[];
  clubs: Club[];
  challenges: Challenge[];
}

const ATHLETE_PHOTOS = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=160&h=160&fit=crop",
];

const ME_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop";

const ACTIVITY_PHOTOS_FALLBACK = [
  "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526676537331-7747bf8278fc?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1544191696-15693072e0b5?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=900&h=600&fit=crop",
];

const SEED_ME: Athlete = {
  id: "me",
  name: "Alex Carter",
  handle: "alex",
  avatar: ME_AVATAR,
  city: "Boulder",
  country: "US",
  followers: 182,
  following: 210,
  bio: "Chasing the next PR. Runner & rider.",
};

const SEED_ATHLETES: Athlete[] = [
  {
    id: "a1",
    name: "Maya Sato",
    handle: "maya.s",
    avatar: ATHLETE_PHOTOS[0],
    city: "Tokyo",
    country: "JP",
    followers: 1820,
    following: 240,
    bio: "Ultra runner. UTMB finisher.",
    isFollowing: true,
  },
  {
    id: "a2",
    name: "Diego Romero",
    handle: "dromero",
    avatar: ATHLETE_PHOTOS[1],
    city: "Barcelona",
    country: "ES",
    followers: 980,
    following: 410,
    bio: "Cyclist. Always uphill.",
    isFollowing: true,
  },
  {
    id: "a3",
    name: "Lena Hoffman",
    handle: "lenah",
    avatar: ATHLETE_PHOTOS[2],
    city: "Berlin",
    country: "DE",
    followers: 540,
    following: 320,
    bio: "Triathlete in training.",
    isFollowing: false,
  },
  {
    id: "a4",
    name: "Noah Bennett",
    handle: "noahb",
    avatar: ATHLETE_PHOTOS[3],
    city: "Wellington",
    country: "NZ",
    followers: 730,
    following: 180,
    bio: "Trail. Sea. Repeat.",
    isFollowing: true,
  },
  {
    id: "a5",
    name: "Priya Shah",
    handle: "priya.s",
    avatar: ATHLETE_PHOTOS[4],
    city: "Mumbai",
    country: "IN",
    followers: 2210,
    following: 540,
    bio: "Marathoner. Coach.",
    isFollowing: false,
  },
  {
    id: "a6",
    name: "Tomas Lima",
    handle: "tlima",
    avatar: ATHLETE_PHOTOS[5],
    city: "Lisbon",
    country: "PT",
    followers: 410,
    following: 290,
    bio: "Weekend warrior.",
    isFollowing: false,
  },
  {
    id: "a7",
    name: "Anya Volkov",
    handle: "anyav",
    avatar: ATHLETE_PHOTOS[6],
    city: "Reykjavik",
    country: "IS",
    followers: 1120,
    following: 220,
    bio: "Cold runs, hot coffee.",
    isFollowing: true,
  },
  {
    id: "a8",
    name: "Jamal Reed",
    handle: "jreed",
    avatar: ATHLETE_PHOTOS[7],
    city: "Cape Town",
    country: "ZA",
    followers: 660,
    following: 410,
    bio: "Mountain biker.",
    isFollowing: false,
  },
];

const SEED_SEGMENTS: Segment[] = [
  {
    id: "seg-1",
    name: "Flagstaff Climb",
    sport: "Ride",
    location: "Boulder, USA",
    distanceKm: 7.2,
    avgGrade: 7.4,
    elevationM: 530,
    attempts: 14820,
    athletes: 4210,
    myBestSec: 1683,
    korSec: 1412,
    korAthlete: "T. Pidcock",
    routeSeed: 11,
  },
  {
    id: "seg-2",
    name: "Mesa Trail South",
    sport: "Run",
    location: "Boulder, USA",
    distanceKm: 5.6,
    avgGrade: 3.1,
    elevationM: 180,
    attempts: 8210,
    athletes: 2110,
    myBestSec: 1580,
    korSec: 1402,
    korAthlete: "K. Jornet",
    routeSeed: 12,
  },
  {
    id: "seg-3",
    name: "Bear Peak Out & Back",
    sport: "Run",
    location: "Boulder, USA",
    distanceKm: 12.3,
    avgGrade: 6.2,
    elevationM: 950,
    attempts: 3210,
    athletes: 980,
    korSec: 3421,
    korAthlete: "M. Sato",
    routeSeed: 13,
  },
  {
    id: "seg-4",
    name: "Old La Honda",
    sport: "Ride",
    location: "Woodside, USA",
    distanceKm: 5.5,
    avgGrade: 7.3,
    elevationM: 400,
    attempts: 24500,
    athletes: 7800,
    korSec: 902,
    korAthlete: "D. Romero",
    routeSeed: 14,
  },
  {
    id: "seg-5",
    name: "Sandbank Sprint",
    sport: "Run",
    location: "Wellington, NZ",
    distanceKm: 1.2,
    avgGrade: 1.0,
    elevationM: 8,
    attempts: 5400,
    athletes: 1820,
    myBestSec: 248,
    korSec: 198,
    korAthlete: "N. Bennett",
    routeSeed: 15,
  },
  {
    id: "seg-6",
    name: "City Loop Crit",
    sport: "Ride",
    location: "Berlin, DE",
    distanceKm: 3.4,
    avgGrade: 0.4,
    elevationM: 12,
    attempts: 9800,
    athletes: 3100,
    korSec: 286,
    korAthlete: "L. Hoffman",
    routeSeed: 16,
  },
];

const SEED_CLUBS: Club[] = [
  {
    id: "c1",
    name: "Front Range Trail Pack",
    sport: "Run",
    city: "Boulder, USA",
    members: 1842,
    cover: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&h=400&fit=crop",
    description: "Weekly group runs on Front Range trails. All paces welcome.",
    joined: true,
  },
  {
    id: "c2",
    name: "Sunrise Cycling Crew",
    sport: "Ride",
    city: "Barcelona, ES",
    members: 920,
    cover: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&h=400&fit=crop",
    description: "Early morning rides up the coast. Coffee included.",
    joined: false,
  },
  {
    id: "c3",
    name: "Tokyo Ultra Society",
    sport: "Run",
    city: "Tokyo, JP",
    members: 612,
    cover: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&h=400&fit=crop",
    description: "For those who run further than reasonable.",
    joined: false,
  },
  {
    id: "c4",
    name: "Berlin Tri Lab",
    sport: "Multisport",
    city: "Berlin, DE",
    members: 480,
    cover: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=900&h=400&fit=crop",
    description: "Swim. Bike. Run. Repeat. Together.",
    joined: false,
  },
  {
    id: "c5",
    name: "Cape Town MTB",
    sport: "Ride",
    city: "Cape Town, ZA",
    members: 1320,
    cover: "https://images.unsplash.com/photo-1544191696-15693072e0b5?w=900&h=400&fit=crop",
    description: "Singletrack and table mountain views.",
    joined: false,
  },
  {
    id: "c6",
    name: "Reykjavik Cold Runners",
    sport: "Run",
    city: "Reykjavik, IS",
    members: 280,
    cover: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&h=400&fit=crop",
    description: "Run through wind, snow and northern lights.",
    joined: true,
  },
];

const SEED_CHALLENGES: Challenge[] = [
  {
    id: "ch1",
    name: "April Distance Run",
    sport: "Run",
    goalKm: 100,
    myProgressKm: 62.4,
    participants: 184230,
    endsAt: "2026-04-30",
    badge: "RUN",
    joined: true,
  },
  {
    id: "ch2",
    name: "Climb 5,000m",
    sport: "Ride",
    goalKm: 5000,
    myProgressKm: 2180,
    participants: 92450,
    endsAt: "2026-04-30",
    badge: "CLIMB",
    joined: true,
  },
  {
    id: "ch3",
    name: "Gran Fondo 100K",
    sport: "Ride",
    goalKm: 100,
    myProgressKm: 48.2,
    participants: 64200,
    endsAt: "2026-05-15",
    badge: "GF",
    joined: false,
  },
  {
    id: "ch4",
    name: "10K Race Ready",
    sport: "Run",
    goalKm: 10,
    myProgressKm: 7.8,
    participants: 38120,
    endsAt: "2026-05-31",
    badge: "10K",
    joined: false,
  },
  {
    id: "ch5",
    name: "Swim 20K",
    sport: "Swim",
    goalKm: 20,
    myProgressKm: 5.1,
    participants: 22100,
    endsAt: "2026-04-30",
    badge: "SWIM",
    joined: false,
  },
];

const ACTIVITY_TITLES: Record<Sport, string[]> = {
  Run: [
    "Sunrise miles",
    "Tempo Tuesday",
    "Easy shakeout",
    "Long run",
    "Hill repeats",
    "Recovery jog",
    "Marathon pace",
  ],
  Ride: ["Coffee ride", "Climbing day", "Group ride", "Solo gravel", "Sunset spin", "Recovery roll"],
  Swim: ["Pool intervals", "Open water", "Endurance swim", "Drill set"],
  Hike: ["Ridge traverse", "Summit push", "Forest loop", "Sunset hike"],
  Walk: ["Lunch walk", "Dog walk", "Evening stroll"],
};

function rnd(seed: number) {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}

// Deterministic seed data so every teammate sees the same feed.
const BASE_TIME = Date.parse("2026-04-23T12:00:00.000Z");

function generateActivities(): Activity[] {
  const sports: Sport[] = ["Run", "Ride", "Swim", "Hike", "Walk"];
  const allAthletes = [SEED_ME, ...SEED_ATHLETES];
  const out: Activity[] = [];

  for (let index = 0; index < 40; index += 1) {
    const random = rnd(index + 1);
    const sport = sports[Math.floor(random() * sports.length)];
    // Bias toward the current user so "You" feed has content.
    const athlete =
      index % 4 === 0 ? SEED_ME : allAthletes[Math.floor(random() * allAthletes.length)];
    const distance =
      sport === "Ride"
        ? 20 + random() * 80
        : sport === "Swim"
          ? 1 + random() * 3
          : sport === "Hike"
            ? 5 + random() * 15
            : 3 + random() * 20;
    const pace = sport === "Ride" ? 0 : 240 + random() * 180;
    const speed = sport === "Ride" ? 22 + random() * 15 : 0;
    const moving = sport === "Ride" ? (distance / speed) * 3600 : distance * pace;
    const elevation = sport === "Swim" ? 0 : Math.floor(50 + random() * 800);
    const title = ACTIVITY_TITLES[sport][Math.floor(random() * ACTIVITY_TITLES[sport].length)];
    const daysAgo = Math.floor(random() * 30);
    const date = new Date(
      BASE_TIME - daysAgo * 86400000 - Math.floor(random() * 86400000),
    ).toISOString();
    const hasPhoto = random() > 0.4;
    const splits =
      sport !== "Swim"
        ? Array.from({ length: Math.max(1, Math.floor(distance)) }, (_, splitIndex) => ({
            km: splitIndex + 1,
            paceSec:
              sport === "Ride"
                ? Math.floor(3600 / (speed + (random() - 0.5) * 4))
                : Math.floor(pace + (random() - 0.5) * 30),
            hr: Math.floor(140 + random() * 40),
            elev: Math.floor((random() - 0.5) * 30),
          }))
        : undefined;
    const segmentCandidates = SEED_SEGMENTS.filter((segment) => segment.sport === sport);
    const pickedSegment =
      (sport === "Run" || sport === "Ride") && segmentCandidates.length > 0
        ? segmentCandidates[index % segmentCandidates.length]
        : undefined;

    out.push({
      id: `act-${index + 1}`,
      athleteId: athlete.id,
      sport,
      title,
      description:
        random() > 0.6
          ? "Felt strong today. Legs finally coming back after the race."
          : undefined,
      date,
      distanceKm: Math.round(distance * 100) / 100,
      movingSeconds: Math.floor(moving),
      elevationM: elevation,
      avgHr: sport === "Swim" ? undefined : Math.floor(140 + random() * 30),
      avgPaceSecPerKm: sport === "Ride" ? undefined : Math.floor(pace),
      avgSpeedKmh: sport === "Ride" ? Math.round(speed * 10) / 10 : undefined,
      kudos: Math.floor(random() * 80),
      comments:
        random() > 0.5
          ? [
              {
                id: `c${index}-1`,
                athleteId: SEED_ATHLETES[Math.floor(random() * SEED_ATHLETES.length)].id,
                text: "Massive effort.",
              },
              ...(random() > 0.6
                ? [
                    {
                      id: `c${index}-2`,
                      athleteId: SEED_ATHLETES[Math.floor(random() * SEED_ATHLETES.length)].id,
                      text: "Beautiful route.",
                    },
                  ]
                : []),
            ]
          : [],
      achievements: Math.floor(random() * 4),
      photo: hasPhoto ? ACTIVITY_PHOTOS_FALLBACK[index % ACTIVITY_PHOTOS_FALLBACK.length] : undefined,
      routeSeed: index + 1,
      splits,
      segments: pickedSegment ? [{ id: pickedSegment.id, rank: Math.floor(random() * 50) + 1 }] : undefined,
      kudoed: false,
    });
  }

  out.sort((left, right) => +new Date(right.date) - +new Date(left.date));
  return out;
}

// Mutable, pre-populated mock state. Callers mutate these arrays directly; the
// UI reflects changes on re-render because state is kept inside each component.
export const ME: Athlete = { ...SEED_ME };
export const ATHLETES: Athlete[] = [ME, ...SEED_ATHLETES.map((a) => ({ ...a }))];
export const ACTIVITIES: Activity[] = generateActivities();
export const SEGMENTS: Segment[] = SEED_SEGMENTS.map((s) => ({ ...s }));
export const CLUBS: Club[] = SEED_CLUBS.map((c) => ({ ...c }));
export const CHALLENGES: Challenge[] = SEED_CHALLENGES.map((c) => ({ ...c }));

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function fmtDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${minutes}:${pad(secs)}`;
}

export function fmtPace(secPerKm: number): string {
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.floor(secPerKm % 60);
  return `${minutes}:${pad(seconds)}/km`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtTimeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDate(iso);
}

export function getAthlete(id: string): Athlete {
  return ATHLETES.find((athlete) => athlete.id === id) ?? ME;
}

export function getActivity(id: string): Activity | undefined {
  return ACTIVITIES.find((activity) => activity.id === id);
}

const ACTIVITY_PHOTOS: Record<string, string[]> = {
  Run: [
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
  ],
  Ride: [
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
  ],
  Swim: [
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=900&q=80&auto=format&fit=crop",
  ],
  Hike: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=900&q=80&auto=format&fit=crop",
  ],
  Walk: [
    "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=900&q=80&auto=format&fit=crop",
  ],
};

export function getActivityPhoto(activity: Pick<Activity, "sport" | "routeSeed">): string {
  const pool = ACTIVITY_PHOTOS[activity.sport] ?? ACTIVITY_PHOTOS.Run;
  const index = Math.abs(activity.routeSeed) % pool.length;
  return pool[index];
}

export function getSegment(id: string): Segment | undefined {
  return SEGMENTS.find((segment) => segment.id === id);
}

export function weeklyStats(athleteId: string = "me") {
  const activities = ACTIVITIES.filter((activity) => activity.athleteId === athleteId);
  const weeks: { label: string; km: number; time: number; elev: number }[] = [];
  const now = new Date();

  for (let index = 7; index >= 0; index -= 1) {
    const start = new Date(now);
    start.setDate(now.getDate() - index * 7 - 6);
    const end = new Date(now);
    end.setDate(now.getDate() - index * 7);

    const weekActivities = activities.filter((activity) => {
      const date = new Date(activity.date);
      return date >= start && date <= end;
    });

    weeks.push({
      label: `W${8 - index}`,
      km:
        Math.round(weekActivities.reduce((sum, activity) => sum + activity.distanceKm, 0) * 10) /
        10,
      time: weekActivities.reduce((sum, activity) => sum + activity.movingSeconds, 0),
      elev: weekActivities.reduce((sum, activity) => sum + activity.elevationM, 0),
    });
  }

  return weeks;
}

export function routePath(seed: number, width = 600, height = 300): string {
  const random = rnd(seed * 17 + 3);
  const points: [number, number][] = [];
  let x = width * 0.15;
  let y = height * 0.5;
  points.push([x, y]);

  for (let index = 0; index < 24; index += 1) {
    x += (width * 0.7) / 24 + (random() - 0.5) * 20;
    y += (random() - 0.5) * 40;
    y = Math.max(20, Math.min(height - 20, y));
    points.push([x, y]);
  }

  return points
    .map((point, index) => (index === 0 ? `M${point[0]},${point[1]}` : `L${point[0]},${point[1]}`))
    .join(" ");
}

export function elevationProfile(seed: number, points = 60) {
  const random = rnd(seed * 23 + 7);
  let value = 100 + random() * 200;
  return Array.from({ length: points }, (_, index) => {
    value += (random() - 0.45) * 40;
    value = Math.max(20, value);
    return { x: index, elev: Math.round(value) };
  });
}

// Kept for compatibility with code paths that used to hydrate AppData from the
// backend. In this frontend-only fork, everything is pre-populated at module
// load, so these are no-ops.
export function initializeAppData(_data: AppData) {
  // no-op
}

export function clearAppData() {
  // no-op — there is no auth session to clear in the prototype
}
