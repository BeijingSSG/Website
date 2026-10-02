import { SEED_ROSTER } from "../data/roster";

const ROSTER_KEY = "supersonic.roster";
const PLAYS_KEY = "supersonic.plays";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadRoster() {
  return read(ROSTER_KEY, SEED_ROSTER);
}

export function saveRoster(roster) {
  write(ROSTER_KEY, roster);
}

export function loadPlays() {
  return read(PLAYS_KEY, []);
}

export function savePlays(plays) {
  write(PLAYS_KEY, plays);
}
