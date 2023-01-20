var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * XMLHttpRequestを使用したリクエストを送信する糖衣関数です。
 * @param {XHRParams} params - withCredentialsとasynchronousは未設定の場合trueとします。
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function xhrRequest(params) {
    var url = params.url, method = params.method, _a = params.body, body = _a === void 0 ? null : _a, onLoad = params.onLoad, onError = params.onError, onTimeout = params.onTimeout, timeout = params.timeout, requestHeaders = params.requestHeaders, _b = params.withCredentials, withCredentials = _b === void 0 ? true : _b, _c = params.asynchronous, asynchronous = _c === void 0 ? true : _c;
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, asynchronous);
    xhr.withCredentials = withCredentials;
    if (typeof timeout === 'number')
        xhr.timeout = timeout;
    var _loop_1 = function (name_1) {
        var content = requestHeaders[name_1];
        var list = typeof content === 'string' ? [content] : content;
        list.forEach(function (value) {
            xhr.setRequestHeader(name_1, value);
        });
    };
    for (var name_1 in requestHeaders) {
        _loop_1(name_1);
    }
    if (onLoad)
        xhr.onload = function () {
            onLoad(xhr.responseText);
        };
    if (onError)
        xhr.onerror = onError;
    if (onTimeout)
        xhr.ontimeout = onTimeout;
    xhr.send(body);
    return xhr;
}
/**
 * XMLHttpRequestを使用し単純なGETリクエストを送信します。
 * @param {string} url
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function get(url, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return xhrRequest(__assign({ url: url, method: 'GET', onLoad: function (responseText) {
            onLoad(responseText);
        } }, xhrRequestOptions));
}
/**
 * XMLHttpRequestを使用し、GETメソッドでリクエストを送信します。
 * リクエストヘッダーは `Accept: application/json` を設定します。
 * 受け取ったレスポンスはJSON.parse処理し、onLoad引数にコールバックします。
 * 期待されるデータ型はジェネリクスで指定する事ができます。
 * @param {string} url
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function getData(url, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return xhrRequest(__assign(__assign({ url: url, method: 'GET', onLoad: function (responseText) {
            var data = JSON.parse(responseText);
            onLoad(data);
        } }, xhrRequestOptions), { requestHeaders: __assign(__assign({}, xhrRequestOptions.requestHeaders), { Accept: 'application/json' }) }));
}
/**
 * XMLHttpRequestを使用し、POSTメソッドでデータを送信します。
 * @param {string} url
 * @param {string} body
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function post(url, body, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    // bodyがstring型の場合、リクエストヘッダーには `Content-Type: text/plain;charset=UTF-8` が設定される。
    return xhrRequest(__assign({ url: url, method: 'POST', body: body, onLoad: onLoad }, xhrRequestOptions));
}
/**
 * XMLHttpRequestを使用し、POSTメソッドでJSON形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: application/json` を設定します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsJson(url, data, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return post(url, JSON.stringify(data), onLoad, __assign({ requestHeaders: __assign(__assign({}, xhrRequestOptions.requestHeaders), { 'Content-Type': 'application/json' }) }, xhrRequestOptions));
}
/**
 * XMLHttpRequestを使用し、POSTメソッドでapplication/x-www-form-urlencoded形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: application/x-www-form-urlencoded;charset=UTF-8` が設定されます。
 * @template RequestBody - extends Record<string, unknown>
 * @param {string} url
 * @param {RequestBody} data
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsXWwwFormUrlEncoded(url, data, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    var urlSearchParams = new URLSearchParams();
    for (var name_2 in data) {
        urlSearchParams.append(name_2, String(data[name_2]));
    }
    // bodyにURLSearchParams型が設定された場合、リクエストヘッダーに `Content-Type: application/x-www-form-urlencoded;charset=UTF-8` が設定される。
    return post(url, urlSearchParams, onLoad, xhrRequestOptions);
}
/**
 * XMLHttpRequestを使用し、POSTメソッドでmultipart/form-data形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: multipart/form-data; boundary=...` が設定されます。
 * @template RequestBody - extends Record<string, string | Blob>
 * @param {string} url
 * @param {RequestBody} data
 * @param {function} onLoad
 * @param {XHRRequestOptions} xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsMultipartFormData(url, data, onLoad, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    var formData = new FormData();
    for (var name_3 in data) {
        formData.append(name_3, data[name_3]);
    }
    // bodyにFormData型が設定された場合、リクエストヘッダーに `Content-Type: multipart/form-data; boundary=...` が設定される。
    return post(url, formData, onLoad, xhrRequestOptions);
}
//# sourceMappingURL=XHR.js.map