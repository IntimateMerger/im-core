"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalStorage = exports.getLocalStorage = void 0;
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
//# sourceMappingURL=LocalStorage.js.map