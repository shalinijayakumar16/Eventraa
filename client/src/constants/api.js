const rawBaseUrl = (process.env.REACT_APP_BASE_URL || "").trim();

export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const normalizePath = (path = "") => (path.startsWith("/") ? path : `/${path}`);

export const apiUrl = (path = "") => `${BASE_URL}${normalizePath(path)}`;

export const assetUrl = (path = "") => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.replace(/^\/+/, "");
  return `${BASE_URL}/${normalized}`;
};
