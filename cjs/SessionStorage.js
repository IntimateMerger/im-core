"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setValue = exports.getValue = exports.removeItem = exports.setItem = exports.getItem = void 0;
function getItem(key) {
    if (sessionStorage)
        return sessionStorage.getItem(key);
    else
        return null;
}
exports.getItem = getItem;
function setItem(key, value) {
    try {
        sessionStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
}
exports.setItem = setItem;
function removeItem(key) {
    if (sessionStorage)
        sessionStorage.removeItem(key);
}
exports.removeItem = removeItem;
function getValue(key) {
    var value = getItem(key);
    if (value)
        return JSON.parse(value);
    else
        return null;
}
exports.getValue = getValue;
function setValue(key, value) {
    setItem(key, JSON.stringify(value));
}
exports.setValue = setValue;
//# sourceMappingURL=SessionStorage.js.map