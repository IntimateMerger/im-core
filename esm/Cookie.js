export function getCookie(key) {
    var keyPrefix = key + "=";
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
export function setCookie(key, value, options) {
    if (options === void 0) { options = {}; }
    var path = options.path, domain = options.domain, maxAge = options.maxAge, expires = options.expires, secure = options.secure, sameSite = options.sameSite;
    var request = key + "=" + value;
    if (path)
        request += ";path=" + path;
    if (domain)
        request += ";domain=" + domain;
    if (typeof maxAge === 'number')
        request += ";max-age=" + maxAge;
    if (expires)
        request += ";expires=" + expires.toUTCString();
    if (secure)
        request += ';secure';
    if (sameSite)
        request += ";samesite=" + sameSite;
    document.cookie = request;
}
export function deleteCookie(key, options) {
    if (options === void 0) { options = {}; }
    setCookie(key, '', {
        maxAge: 0,
        path: options.path,
        domain: options.domain,
        secure: options.secure,
        sameSite: options.sameSite,
    });
}
export function getCookieAs(key) {
    var value = getCookie(key);
    if (value)
        return JSON.parse(decodeURIComponent(value));
    return null;
}
export function setCookieAs(key, value, options) {
    if (options === void 0) { options = {}; }
    setCookie(key, encodeURIComponent(JSON.stringify(value)), options);
}
//# sourceMappingURL=Cookie.js.map