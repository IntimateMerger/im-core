"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItem = getItem;
exports.setItem = setItem;
exports.removeItem = removeItem;
exports.getValue = getValue;
exports.setValue = setValue;
function getItem(key) {
    if (localStorage)
        return localStorage.getItem(key);
    else
        return null;
}
function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
function removeItem(key) {
    if (localStorage)
        localStorage.removeItem(key);
}
function getValue(key) {
    var value = getItem(key);
    if (value)
        return JSON.parse(value);
    else
        return null;
}
function setValue(key, value) {
    setItem(key, JSON.stringify(value));
}
//# sourceMappingURL=LocalStorage.js.map