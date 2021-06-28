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
