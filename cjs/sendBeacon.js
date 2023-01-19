"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBeaconAsJson = exports.sendBeaconAsMultipartFormData = exports.sendBeaconAsXWwwUrlEncoded = exports.sendBeacon = void 0;
var XHR_1 = require("./XHR");
/**
 * navigator.sendBeaconを糖衣する関数で、sendBeaconが使用できない場合XHRにフォールバックします。
 * @param url
 * @param body {Blob | string | FormData | URLSearchParams} 型によってContent-Typeとペイロードが変化します。Blob型はそのtypeに応じ、stirngはtext/plain、FormDataはmultipart/form-data、URLSearchParamsはapplication/x-www-form-urlencodedとして送信されます。
 * @returns {boolean}
 */
function sendBeacon(url, body) {
    if (navigator.sendBeacon) {
        return navigator.sendBeacon(url, body);
    }
    else {
        try {
            (0, XHR_1.post)(url, body, void 0, { asynchronous: false });
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.sendBeacon = sendBeacon;
/**
 * データをURLSearchParamsに変換し、sendBeacon関数を実行、application/x-www-form-urlencodedとしてデータを送信します。
 * @param url
 * @param data
 * @returns {boolean}
 */
function sendBeaconAsXWwwUrlEncoded(url, data) {
    var urlSearchParams = new URLSearchParams();
    for (var name_1 in data) {
        urlSearchParams.append(name_1, String(data[name_1]));
    }
    return sendBeacon(url, urlSearchParams);
}
exports.sendBeaconAsXWwwUrlEncoded = sendBeaconAsXWwwUrlEncoded;
/**
 * データをFormDataに変換し、sendBeacon関数を実行、multipart/form-dataとしてデータを送信します。
 * @param url
 * @param data
 * @returns
 */
function sendBeaconAsMultipartFormData(url, data) {
    var formData = new FormData();
    for (var name_2 in data) {
        formData.append(name_2, String(data[name_2]));
    }
    return sendBeacon(url, formData);
}
exports.sendBeaconAsMultipartFormData = sendBeaconAsMultipartFormData;
/**
 *
 * @param url データをBlob(type: 'application/json')に変換し、sendBeacon関数を実行、application/jsonとしてデータを送信します。
 * @param data
 * @returns
 */
function sendBeaconAsJson(url, data) {
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return sendBeacon(url, blob);
}
exports.sendBeaconAsJson = sendBeaconAsJson;
//# sourceMappingURL=sendBeacon.js.map