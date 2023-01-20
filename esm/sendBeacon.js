import { post } from './XHR';
/**
 * navigator.sendBeaconを糖衣する関数で、sendBeaconが使用できない場合XHRにフォールバックします。
 * @param {string} url
 * @param {(Blob | string | FormData | URLSearchParams)} body 型によってContent-Typeとペイロードが変化します。Blob型はそのtypeに応じ、stirngはtext/plain、FormDataはmultipart/form-data、URLSearchParamsはapplication/x-www-form-urlencodedとして送信されます。
 * @returns {boolean}
 */
export function sendBeacon(url, body) {
    if (navigator.sendBeacon) {
        return navigator.sendBeacon(url, body);
    }
    else {
        try {
            post(url, body, void 0, { asynchronous: false });
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
/**
 * データをURLSearchParamsに変換し、sendBeacon関数を実行、application/x-www-form-urlencodedとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export function sendBeaconAsXWwwUrlEncoded(url, data) {
    var urlSearchParams = new URLSearchParams();
    for (var name_1 in data) {
        urlSearchParams.append(name_1, String(data[name_1]));
    }
    return sendBeacon(url, urlSearchParams);
}
/**
 * データをFormDataに変換し、sendBeacon関数を実行、multipart/form-dataとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export function sendBeaconAsMultipartFormData(url, data) {
    var formData = new FormData();
    for (var name_2 in data) {
        formData.append(name_2, String(data[name_2]));
    }
    return sendBeacon(url, formData);
}
/**
 * データをJSON.stringifyしたBlobに変換し、sendBeacon関数を実行、application/jsonとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export function sendBeaconAsJson(url, data) {
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return sendBeacon(url, blob);
}
//# sourceMappingURL=sendBeacon.js.map