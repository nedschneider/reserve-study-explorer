import type { Scenario } from "../types";
import { STUDY_DEFAULTS } from "../data/components";

/** Encode a scenario into a compact, URL-safe string. */
export function encodeScenario(s: Scenario): string {
  const json = JSON.stringify(s);
  // btoa works on Latin-1; our JSON is ASCII so this is safe.
  return btoa(json);
}

/** Decode a scenario string; returns study defaults on any failure. */
export function decodeScenario(raw: string | null | undefined): Scenario {
  if (!raw) return { ...STUDY_DEFAULTS };
  try {
    const json = atob(raw);
    const parsed = JSON.parse(json) as Partial<Scenario>;
    return { ...STUDY_DEFAULTS, ...parsed };
  } catch {
    return { ...STUDY_DEFAULTS };
  }
}

/** Read the scenario from the current URL's `?s=` param. */
export function readScenarioFromLocation(): Scenario {
  if (typeof window === "undefined") return { ...STUDY_DEFAULTS };
  const params = new URLSearchParams(window.location.search);
  return decodeScenario(params.get("s"));
}

/** Replace the URL with the encoded scenario (without creating history entries). */
export function writeScenarioToLocation(s: Scenario): void {
  if (typeof window === "undefined") return;
  const encoded = encodeScenario(s);
  const url = `${window.location.pathname}?s=${encoded}`;
  window.history.replaceState(null, "", url);
}

/** Build a full shareable URL for a scenario. */
export function shareUrl(s: Scenario): string {
  if (typeof window === "undefined") return `?s=${encodeScenario(s)}`;
  return `${window.location.origin}${window.location.pathname}?s=${encodeScenario(s)}`;
}
