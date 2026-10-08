import { useCallback, useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb';

/**
 * Fetches a paginated TMDB list endpoint.
 * Pass `path = null` to skip fetching (e.g. empty search).
 * Changing `path` or `params` resets to page 1 automatically.
 */
export default function useFetchMovies(path, params = {}) {
  const reqKey = `${path}?${JSON.stringify(params)}`;

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // bump to retry
  const [pageState, setPageState] = useState({ key: reqKey, page: 1 });

  // A stale page number from a previous request key counts as page 1
  const page = pageState.key === reqKey ? pageState.page : 1;

  useEffect(() => {
    if (!path) { setMovies([]); setLoading(false); return undefined; }

    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    if (page === 1) setMovies([]);

    tmdb(path, { ...params, page }, ctrl.signal)
      .then(data => {
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB caps at 500
        setMovies(prev => (page === 1 ? data.results : [...prev, ...data.results]));
      })
      .catch(e => { if (e.name !== 'AbortError') setError(e); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });

    return () => ctrl.abort(); // cancel in-flight request on change/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqKey, page, tick]);

  const loadMore = useCallback(() => setPageState({ key: reqKey, page: page + 1 }), [reqKey, page]);
  const retry = useCallback(() => setTick(t => t + 1), []);

  return { movies, loading, error, hasMore: Boolean(path) && page < totalPages, loadMore, retry };
}
