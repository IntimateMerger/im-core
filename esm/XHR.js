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
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws Network errors may occur during the execution of the XMLHttpRequest.
 * These errors do not result in the throwing of exceptions but can be
 * handled with the `onFailure` callback parameter.
 */
export function xhrRequest(params) {
    var url = params.url, method = params.method, responseType = params.responseType, _a = params.body, body = _a === void 0 ? null : _a, onLoadSuccess = params.onLoadSuccess, onFailure = params.onFailure, timeout = params.timeout, requestHeaders = params.requestHeaders, _b = params.withCredentials, withCredentials = _b === void 0 ? true : _b, _c = params.asynchronous, asynchronous = _c === void 0 ? true : _c;
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, asynchronous);
    if (typeof responseType === 'string')
        xhr.responseType = responseType;
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
    xhr.onload = function () {
        var status = xhr.status, statusText = xhr.statusText, readyState = xhr.readyState, response = xhr.response, responseText = xhr.responseText;
        var loadCallbackPayload = {
            status: status,
            statusText: statusText,
            readyState: readyState,
            response: response,
            responseText: responseText,
        };
        if (status >= 200 && status < 300 && readyState === 4) {
            if (onLoadSuccess)
                onLoadSuccess(loadCallbackPayload);
        }
        else {
            if (onFailure)
                onFailure();
        }
    };
    if (onFailure)
        xhr.onerror = onFailure;
    if (onFailure)
        xhr.ontimeout = onFailure;
    xhr.send(body);
    return xhr;
}
/**
 * Sends a GET request using XMLHttpRequest
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 */
export function get(url, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return xhrRequest(__assign({ url: url, method: 'GET', onLoadSuccess: onLoadSuccess }, xhrRequestOptions));
}
/**
 * Use XMLHttpRequest and send the request with the GET method.
 * Set the request header to `Accept: application/json`.
 * The expected data type can be specified by generics.
 * @param url
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function getData(url, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return xhrRequest(__assign(__assign({ url: url, method: 'GET', responseType: 'json', onLoadSuccess: function (callbackPayload) {
            var data = callbackPayload.response;
            onLoadSuccess(data);
        } }, xhrRequestOptions), { requestHeaders: __assign(__assign({}, xhrRequestOptions.requestHeaders), { Accept: 'application/json' }) }));
}
/**
 * Use XMLHttpRequest and send data with the POST method.
 * @param url
 * @param body
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function post(url, body, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    // If body is a string type, the request header is set to `Content-Type: text/plain;charset=UTF-8`.
    return xhrRequest(__assign({ url: url, method: 'POST', body: body, onLoadSuccess: onLoadSuccess }, xhrRequestOptions));
}
/**
 * Use XMLHttpRequest to send data in JSON format using the POST method.
 * Set the request header to `Content-Type: application/json`.
 * @param url
 * @param data
 * @param onLoadSuccess
 * @param xhrRequestOptions
 * @throws {TypeError}
 */
export function postDataAsJson(url, data, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    return post(url, JSON.stringify(data), onLoadSuccess, __assign({ requestHeaders: __assign(__assign({}, xhrRequestOptions.requestHeaders), { 'Content-Type': 'application/json' }) }, xhrRequestOptions));
}
/**
 * Use XMLHttpRequest to send data in application/x-www-form-urlencoded format using the POST method.
 * The request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 */
export function postDataAsXWwwFormUrlEncoded(url, data, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    var urlSearchParams = new URLSearchParams();
    for (var name_2 in data) {
        urlSearchParams.append(name_2, String(data[name_2]));
    }
    // If the URLSearchParams type is set in body, the request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
    return post(url, urlSearchParams, onLoadSuccess, xhrRequestOptions);
}
/**
 * Use XMLHttpRequest to send data in multipart/form-data format using the POST method.
 * The request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
 * @template RequestBody - extends Record<string, string | Blob>
 * @param url
 * @param data
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function postDataAsMultipartFormData(url, data, onLoadSuccess, xhrRequestOptions) {
    if (xhrRequestOptions === void 0) { xhrRequestOptions = {}; }
    var formData = new FormData();
    for (var name_3 in data) {
        formData.append(name_3, data[name_3]);
    }
    // If the body is set to the FormData type, the request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
    return post(url, formData, onLoadSuccess, xhrRequestOptions);
}
//# sourceMappingURL=XHR.js.map