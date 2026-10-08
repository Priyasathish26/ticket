import { Link } from 'react-router-dom';
import s from '../styles/app.module.css';

/** 5 stars filled proportionally from a TMDB score out of 10. */
export function StarRating({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, value * 10));
  return (
    <span className={s.stars} role="img" aria-label={`Rated ${value.toFixed(1)} out of 10`}>
      <span className={s.starTrack} aria-hidden="true">
        <span className={s.starBg}>★★★★★</span>
        <span className={s.starFg} style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <b>{value.toFixed(1)}</b>
    </span>
  );
}

/** Fallback for network failure, missing config, or "movie not found". */
export function ErrorState({ error, onRetry }) {
  const notFound = error?.type === 'notfound';
  return (
    <div className={s.error} role="alert">
      <h2>{notFound ? 'Movie not found' : error?.type === 'network' ? 'Network failure' : 'Something went wrong'}</h2>
      <p>{error?.message}</p>
      {notFound
        ? <Link to="/" className={s.btn}>Back to home</Link>
        : onRetry && <button className={s.btn} onClick={onRetry}>Retry</button>}
    </div>
  );
}

/** Placeholder cards that mirror the real grid while data loads. */
export function SkeletonGrid({ count = 12 }) {
  return (
    <div className={s.grid} aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => <div key={i} className={`${s.skeleton} ${s.cardSkel}`} />)}
    </div>
  );
}
