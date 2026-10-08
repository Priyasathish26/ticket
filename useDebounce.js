import { useEffect, useState } from 'react';

/** Returns `value` only after it has stopped changing for `delay` ms. */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // restart the timer on every keystroke
  }, [value, delay]);

  return debounced;
}
