import { useCallback, useEffect, useRef, useState } from "react";

// Описываем интерфейс для опций запроса, расширяя стандартный RequestInit из TS
interface MutationOptions extends Omit<RequestInit, "body"> {
  headers?: Record<string, string>;
}

// Интерфейс для возвращаемого значения хука
interface UseMutationReturn<TData, TVariables> {
  mutate: (
    body: TVariables,
    customOptions?: MutationOptions,
  ) => Promise<TData | undefined>;
  data: TData | null;
  isLoading: boolean;
  error: string | null;
}

export const useMutation = <TData = unknown, TVariables = unknown>(
  url: string,
  options: MutationOptions = {},
): UseMutationReturn<TData, TVariables> => {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const optionsRef = useRef<MutationOptions>(options);

  // всегда актуальная ссылка на {}
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const mutate = useCallback(
    async (
      body: TVariables,
      customOptions: MutationOptions = {},
    ): Promise<TData | undefined> => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...optionsRef.current.headers,
            ...customOptions.headers,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
          ...optionsRef.current,
          ...customOptions,
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const result: TData = await response.json();
        setData(result);
        return result;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        const errorMessage = (err as Error).message || "Что-то пошло не так";
        setError(errorMessage);
        throw err;
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [url],
  );

  return { mutate, data, isLoading, error };
};
