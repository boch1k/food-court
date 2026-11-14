import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS: RequestInit = {
  headers: { "Content-Type": "application/json" },
};

export function handleFetch(url: string, options: RequestInit = {}) {
  return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
    if (res.ok) return res.json();
    return res.json().then((json) => Promise.reject(json));
  });
}

export function useFetchEffect<T = any>(
  url: string,
  options: RequestInit,
  condition: boolean,
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<T>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const memoizedFetch = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    handleFetch(url, { ...options, signal: controller.signal })
      .then(setData)
      .catch((err: unknown) => {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || controller.signal.aborted)
        ) {
          return;
        }
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    if (condition) memoizedFetch();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [memoizedFetch, condition]);

  return { data, loading, error };
}

// Compatibility wrapper for existing callers of the imperative fetch helper.
export function useFetch() {
  return { handleFetch };
}
