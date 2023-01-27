"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBeaconAsJson = exports.sendBeaconAsMultipartFormData = exports.sendBeaconAsXWwwUrlEncoded = exports.sendBeacon = void 0;
var XHR_1 = require("./XHR");
/**
 * Call navigator.sendBeacon, fallback to XHR for legacy browsers.
 * @param url
 * @param body Blob types are sent as text/plain for stirng, multipart/form-data for FormData, and application/x-www-form-urlencoded for URLSearchParams, depending on their type.
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
 * Convert data to URLSearchParams, execute sendBeacon function, and send data as application/x-www-form-urlencoded.
 * @param url
 * @param data
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
 * Convert data to FormData, execute sendBeacon function, and send data as multipart/form-data.
 * @param url
 * @param data
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
 * Convert the data to JSON.stringify and Blob, execute the sendBeacon function, and send the data as application/json.
 * @param url
 * @param data
 */
function sendBeaconAsJson(url, data) {
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return sendBeacon(url, blob);
}
exports.sendBeaconAsJson = sendBeaconAsJson;
//# sourceMappingURL=sendBeacon.js.map