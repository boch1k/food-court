import { useCallback, useEffect, useState } from "react";

/* [state, useState] = useLocalStorage('key', init) // useState сохраняет в state и localStorage */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = (): T => {
    // проверяем что это не SSR
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Ошибка при чтении ключа localStorage “${key}”:`, error);
      return initialValue;
    }
  };
  // проверяем в localStorage при монтровании
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // сохраняем в localStorage и state
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Ошибка при записи ключа localStorage “${key}”:`, error);
      }
    },
    [key],
  );
  // отслеживаем изменения из других вкладках
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
