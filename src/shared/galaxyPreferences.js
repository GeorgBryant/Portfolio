import { DEFAULT_SETTINGS, PARAMS } from "../projects/shader-lab/shaders/params";

const STORAGE_KEY = "gbryant:galaxy-settings:v1";
const CHANGE_EVENT = "gbryant:galaxy-settings-changed";
const colorKeys = new Set(PARAMS.filter((p) => p.type === "color").map((p) => p.key));

export function readGalaxyPreferences() {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return { ...DEFAULT_SETTINGS };
    const result = { ...DEFAULT_SETTINGS };
    for (const param of PARAMS) {
      const value = saved[param.key];
      if (colorKeys.has(param.key)) {
        if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) result[param.key] = value;
      } else if (typeof value === "number" && Number.isFinite(value)) {
        result[param.key] = value;
      }
    }
    return result;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveGalaxyPreferences(settings) {
  if (typeof window === "undefined") return;
  try {
    const values = Object.fromEntries(PARAMS.map(({ key }) => [key, settings[key]]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Private browsing or blocked storage: current session still works.
  }
}

export function subscribeGalaxyPreferences(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
