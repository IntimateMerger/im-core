"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookieAs = exports.getCookieAs = exports.deleteCookie = exports.setCookie = exports.getCookie = void 0;
function getCookie(key) {
    var keyPrefix = "".concat(key, "=");
    var charCount = keyPrefix.length;
    var cookieList = document.cookie.split('; ');
    for (var i = 0, len = cookieList.length, keyAndValue = void 0; i < len; i++) {
        keyAndValue = cookieList[i];
        if (keyAndValue.substr(0, charCount) === keyPrefix) {
            return keyAndValue.slice(charCount);
        }
    }
    return null;
}
exports.getCookie = getCookie;
function setCookie(key, value, options) {
    if (options === void 0) { options = {}; }
    var path = options.path, domain = options.domain, maxAge = options.maxAge, expires = options.expires, secure = options.secure, sameSite = options.sameSite;
    var request = "".concat(key, "=").concat(value);
    if (path)
        request += ";path=".concat(path);
    if (domain)
        request += ";domain=".concat(domain);
    if (typeof maxAge === 'number')
        request += ";max-age=".concat(maxAge);
    if (expires)
        request += ";expires=".concat(expires.toUTCString());
    if (secure)
        request += ';secure';
    if (sameSite)
        request += ";samesite=".concat(sameSite);
    document.cookie = request;
}
exports.setCookie = setCookie;
function deleteCookie(key, options) {
    if (options === void 0) { options = {}; }
    setCookie(key, '', {
        maxAge: 0,
        path: options.path,
        domain: options.domain,
        secure: options.secure,
        sameSite: options.sameSite,
    });
}
exports.deleteCookie = deleteCookie;
function getCookieAs(key) {
    var value = getCookie(key);
    if (value)
        return JSON.parse(decodeURIComponent(value));
    return null;
}
exports.getCookieAs = getCookieAs;
function setCookieAs(key, value, options) {
    if (options === void 0) { options = {}; }
    setCookie(key, encodeURIComponent(JSON.stringify(value)), options);
}
exports.setCookieAs = setCookieAs;
//# sourceMappingURL=Cookie.js.map