import { useCallback, useEffect, useRef, useState } from "react";

type FetchState<T> = {
  data: T | undefined;
  loading: boolean;
  error: unknown;
};

type UseFetchResult<T> = FetchState<T> & {
  execute: () => Promise<T | undefined>;
};

/** Fetch JSON and reject non-2xx responses with their parsed JSON body. */
export async function handleFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body as T;
}

/** Run a request from an event handler: `onClick={() => execute()}`. */
export function useFetchEvent<T>(
  url: string,
  options?: RequestInit,
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    loading: false,
    error: undefined,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (): Promise<T | undefined> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ data: undefined, loading: true, error: undefined });

    try {
      const data = await handleFetch<T>(url, {
        ...options,
        signal: controller.signal,
      });
      if (!controller.signal.aborted) {
        setState({ data, loading: false, error: undefined });
      }
      return data;
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({ data: undefined, loading: false, error });
      }
      return undefined;
    }
  }, [url, options]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, execute };
}

/** Run a request on mount and when `condition` or `url` changes. */
export function useFetchEffect<T>(
  url: string,
  options: RequestInit | undefined,
  condition: boolean,
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  useEffect(() => {
    if (!condition) {
      setState((current) =>
        current.loading ? { ...current, loading: false } : current,
      );
      return;
    }

    const controller = new AbortController();
    setState({ data: undefined, loading: true, error: undefined });

    void handleFetch<T>(url, {
      ...options,
      signal: controller.signal,
    }).then(
      (data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: undefined });
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ data: undefined, loading: false, error });
        }
      },
    );

    return () => controller.abort();
  }, [condition, url]);

  return state;
}
