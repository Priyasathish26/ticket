const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

/** Build an image URL, or null when TMDB has no image. */
export const img = (path, size = 'w342') => (path ? `${IMG_BASE}/${size}${path}` : null);

export class ApiError extends Error {
  constructor(message, type) {
    super(message);
    this.type = type; // 'config' | 'network' | 'notfound' | 'server'
  }
}

/** GET a TMDB endpoint. Uses a v4 read-access token from VITE_TMDB_TOKEN. */
export async function tmdb(path, params = {}, signal) {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) throw new ApiError('Missing TMDB token. Add VITE_TMDB_TOKEN to your .env file.', 'config');

  const qs = new URLSearchParams({ language: 'en-US', ...params });
  let res;
  try {
    res = await fetch(`${BASE}${path}?${qs}`, { headers: { Authorization: `Bearer ${token}` }, signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('Network failure. Check your connection and try again.', 'network');
  }
  if (res.status === 404) throw new ApiError("We couldn't find that movie.", 'notfound');
  if (res.status === 401) throw new ApiError('Invalid TMDB token.', 'config');
  if (!res.ok) throw new ApiError(`Request failed (${res.status}).`, 'server');
  return res.json();
}
