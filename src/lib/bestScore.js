import { useCallback, useState } from "react";

export function useBestScore(key) {
  const [best, setBest] = useState(() => Number(localStorage.getItem(key) || 0));

  const update = useCallback(
    (score) => {
      setBest((current) => {
        if (score > current) {
          localStorage.setItem(key, String(score));
          return score;
        }
        return current;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    localStorage.removeItem(key);
    setBest(0);
  }, [key]);

  return { best, update, reset };
}
