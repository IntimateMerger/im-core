export function getLocalStorage(key) {
    if (localStorage)
        return localStorage.getItem(key) || null;
    return null;
}
export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
//# sourceMappingURL=LocalStorage.js.map