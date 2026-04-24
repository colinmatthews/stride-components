import {
  ACTIVITIES,
  ATHLETES,
  CHALLENGES,
  CLUBS,
  ME,
  type Activity,
} from "./mock-data";

// Local-only replacement for the former backend API.
// Everything mutates in-memory mock data and returns a resolved Promise so
// callers that `await` these continue to work unchanged.

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function login(email: string, _password: string) {
  ME.name = ME.name || email.split("@")[0];
  return delay(undefined);
}

export async function register(name: string, email: string, _password: string) {
  if (name) ME.name = name;
  ME.handle = email.split("@")[0] || ME.handle;
  return delay(undefined);
}

export async function logout() {
  // Nothing to clear — this prototype has no session. Keep for compatibility.
  return delay(undefined);
}

export async function saveActivity(payload: {
  sport: Activity["sport"];
  title: string;
  description?: string;
  distanceKm: number;
  movingSeconds: number;
  elevationM: number;
  avgHr?: number;
  avgPaceSecPerKm?: number;
  avgSpeedKmh?: number;
  routeSeed: number;
}): Promise<Activity> {
  const activity: Activity = {
    id: `act-local-${Date.now()}`,
    athleteId: "me",
    sport: payload.sport,
    title: payload.title,
    description: payload.description,
    date: new Date().toISOString(),
    distanceKm: payload.distanceKm,
    movingSeconds: payload.movingSeconds,
    elevationM: payload.elevationM,
    avgHr: payload.avgHr,
    avgPaceSecPerKm: payload.avgPaceSecPerKm,
    avgSpeedKmh: payload.avgSpeedKmh,
    kudos: 0,
    comments: [],
    achievements: 0,
    routeSeed: payload.routeSeed,
    kudoed: false,
  };
  ACTIVITIES.unshift(activity);
  return delay(activity);
}

export async function toggleActivityKudo(activityId: string) {
  const activity = ACTIVITIES.find((entry) => entry.id === activityId);
  if (!activity) {
    throw new ApiError("Activity not found", 404);
  }
  activity.kudoed = !activity.kudoed;
  activity.kudos = Math.max(0, activity.kudos + (activity.kudoed ? 1 : -1));
  return delay({ kudos: activity.kudos, kudoed: Boolean(activity.kudoed) });
}

export async function addActivityComment(activityId: string, text: string) {
  const activity = ACTIVITIES.find((entry) => entry.id === activityId);
  if (!activity) {
    throw new ApiError("Activity not found", 404);
  }
  const comment = {
    id: `comment-${Date.now()}`,
    athleteId: "me",
    text,
  };
  activity.comments.push(comment);
  return delay(comment);
}

export async function toggleAthleteFollow(athleteId: string) {
  const athlete = ATHLETES.find((entry) => entry.id === athleteId);
  if (!athlete) {
    throw new ApiError("Athlete not found", 404);
  }
  const wasFollowing = Boolean(athlete.isFollowing);
  athlete.isFollowing = !wasFollowing;
  athlete.followers = Math.max(0, athlete.followers + (wasFollowing ? -1 : 1));
  ME.following = Math.max(0, ME.following + (wasFollowing ? -1 : 1));
  return delay({
    following: Boolean(athlete.isFollowing),
    followers: athlete.followers,
    meFollowing: ME.following,
  });
}

export async function toggleClubJoin(clubId: string) {
  const club = CLUBS.find((entry) => entry.id === clubId);
  if (!club) {
    throw new ApiError("Club not found", 404);
  }
  const wasJoined = Boolean(club.joined);
  club.joined = !wasJoined;
  club.members = Math.max(0, club.members + (wasJoined ? -1 : 1));
  return delay({ joined: Boolean(club.joined), members: club.members });
}

export async function toggleChallengeJoin(challengeId: string) {
  const challenge = CHALLENGES.find((entry) => entry.id === challengeId);
  if (!challenge) {
    throw new ApiError("Challenge not found", 404);
  }
  const wasJoined = Boolean(challenge.joined);
  challenge.joined = !wasJoined;
  challenge.participants = Math.max(0, challenge.participants + (wasJoined ? -1 : 1));
  return delay({ joined: Boolean(challenge.joined), participants: challenge.participants });
}
