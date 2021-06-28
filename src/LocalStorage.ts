export function getLocalStorage(key: string) {
  if (localStorage) return localStorage.getItem(key) || null;
  return null;
}

export function setLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
}

export function getLocalStorageAs<T = unknown>(key: string): T | null {
  const value = getLocalStorage(key);
  if (value) return JSON.parse(value) as T;
  else return null;
}

export function setLocalStorageAs<T = unknown>(key: string, value: T) {
  setLocalStorage(key, JSON.stringify(value));
}
