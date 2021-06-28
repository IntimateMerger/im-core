"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalStorageAs = exports.getLocalStorageAs = exports.setLocalStorage = exports.getLocalStorage = void 0;
function getLocalStorage(key) {
    if (localStorage)
        return localStorage.getItem(key) || null;
    return null;
}
exports.getLocalStorage = getLocalStorage;
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
exports.setLocalStorage = setLocalStorage;
function getLocalStorageAs(key) {
    var value = getLocalStorage(key);
    if (value)
        return JSON.parse(value);
    else
        return null;
}
exports.getLocalStorageAs = getLocalStorageAs;
function setLocalStorageAs(key, value) {
    setLocalStorage(key, JSON.stringify(value));
}
exports.setLocalStorageAs = setLocalStorageAs;
//# sourceMappingURL=LocalStorage.js.map