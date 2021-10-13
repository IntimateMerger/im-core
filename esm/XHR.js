export function get(url, onLoad, options) {
    if (options === void 0) { options = {}; }
    var onError = options.onError, onTimeout = options.onTimeout, timeout = options.timeout, withCredentials = options.withCredentials;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
        onLoad(xhr.responseText);
    });
    if (onError)
        xhr.addEventListener('error', function () {
            onError();
        });
    if (onTimeout)
        xhr.addEventListener('timeout', function () {
            onTimeout();
        });
    xhr.withCredentials = !!withCredentials;
    xhr.open('GET', url, true);
    if (typeof timeout === 'number')
        xhr.timeout = timeout;
    xhr.send();
    return xhr;
}
export function getValueAs(url, onLoad, options) {
    if (options === void 0) { options = {}; }
    return get(url, function (responseText) {
        onLoad(JSON.parse(responseText));
    }, options);
}
//# sourceMappingURL=XHR.js.map