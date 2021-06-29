export function getItem(key) {
    if (sessionStorage)
        return sessionStorage.getItem(key);
    else
        return null;
}
export function setItem(key, value) {
    try {
        sessionStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
export function removeItem(key) {
    if (sessionStorage)
        sessionStorage.removeItem(key);
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
//# sourceMappingURL=SessionStorage.js.map