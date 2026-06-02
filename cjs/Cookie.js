"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.deleteCookie = deleteCookie;
exports.getCookieAs = getCookieAs;
exports.setCookieAs = setCookieAs;
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
function getCookieAs(key) {
    var value = getCookie(key);
    if (value)
        return JSON.parse(decodeURIComponent(value));
    return null;
}
function setCookieAs(key, value, options) {
    if (options === void 0) { options = {}; }
    setCookie(key, encodeURIComponent(JSON.stringify(value)), options);
}
//# sourceMappingURL=Cookie.js.map