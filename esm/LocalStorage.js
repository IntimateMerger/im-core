export function getItem(key) {
    if (localStorage)
        return localStorage.getItem(key);
    else
        return null;
}
export function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
export function removeItem(key) {
    if (localStorage)
        localStorage.removeItem(key);
}
export function getValue(key) {
    var value = getItem(key);
    if (value)
        return JSON.parse(value);
    else
        return null;
}
export function setValue(key, value) {
    setItem(key, JSON.stringify(value));
}
//# sourceMappingURL=LocalStorage.js.map