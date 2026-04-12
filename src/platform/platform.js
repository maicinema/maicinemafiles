import { demoFilms } from "./filmLibrary";

export const getStoredFilms = () => {
  const data = localStorage.getItem("films");

  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getLiveFilms = () => {
  const data = localStorage.getItem("liveFilms");

  try {
    return data ? JSON.parse(data) : demoFilms;
  } catch {
    return demoFilms;
  }
};

export const saveLiveFilms = (films) => {
  localStorage.setItem("liveFilms", JSON.stringify(films));
};

export const normalizeViews = (views) => {
  if (typeof views === "number") return views;

  if (typeof views === "string") {
    const clean = views.trim().toUpperCase();

    if (clean.endsWith("K")) {
      const num = parseFloat(clean.replace("K", ""));
      return isNaN(num) ? 0 : Math.round(num * 1000);
    }

    if (clean.endsWith("M")) {
      const num = parseFloat(clean.replace("M", ""));
      return isNaN(num) ? 0 : Math.round(num * 1000000);
    }

    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  return 0;
};