export function getItem(key: string) {
  if (sessionStorage) return sessionStorage.getItem(key);
  else return null;
}

export function setItem(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
}

export function removeItem(key: string) {
  if (sessionStorage) sessionStorage.removeItem(key);
}

export function getValue<T = unknown>(key: string): T | null {
  const value = getItem(key);
  if (value) return JSON.parse(value) as T;
  else return null;
}

export function setValue<T = unknown>(key: string, value: T) {
  setItem(key, JSON.stringify(value));
}
