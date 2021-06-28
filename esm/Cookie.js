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
    var requests = [key + "=" + value];
    var path = options.path, domain = options.domain, maxAge = options.maxAge, expires = options.expires, secure = options.secure, samesite = options.samesite;
    if (path)
        requests.push("path=" + path);
    if (domain)
        requests.push("domain=" + domain);
    if (typeof maxAge === 'number')
        requests.push("max-age=" + maxAge);
    if (expires)
        requests.push("expires=" + expires.toUTCString());
    if (secure)
        requests.push('secure');
    if (samesite)
        requests.push("samesite=" + samesite);
    document.cookie = requests.join('; ');
}
export function getCookieAs(key) {
    var value = getCookie(key);
    if (value)
        return JSON.parse(decodeURIComponent(value));
    return null;
}
export function setCookieAs(key, value) {
    setCookie(key, encodeURIComponent(JSON.stringify(value)));
}
//# sourceMappingURL=Cookie.js.map