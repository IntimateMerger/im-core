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
export function getLocalStorageAs(key) {
    var value = getLocalStorage(key);
    if (value)
        return JSON.parse(value);
    else
        return null;
}
export function setLocalStorageAs(key, value) {
    setLocalStorage(key, JSON.stringify(value));
}
//# sourceMappingURL=LocalStorage.js.map