type Body = Blob | string | FormData | URLSearchParams;
/**
 * navigator.sendBeaconを糖衣する関数で、sendBeaconが使用できない場合XHRにフォールバックします。
 * @param {string} url
 * @param {(Blob | string | FormData | URLSearchParams)} body 型によってContent-Typeとペイロードが変化します。Blob型はそのtypeに応じ、stirngはtext/plain、FormDataはmultipart/form-data、URLSearchParamsはapplication/x-www-form-urlencodedとして送信されます。
 * @returns {boolean}
 */
export declare function sendBeacon(url: string, body?: Body): boolean;
type AnyObjects = Record<string, unknown>;
/**
 * データをURLSearchParamsに変換し、sendBeacon関数を実行、application/x-www-form-urlencodedとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export declare function sendBeaconAsXWwwUrlEncoded<T extends AnyObjects>(url: string, data: T): boolean;
/**
 * データをFormDataに変換し、sendBeacon関数を実行、multipart/form-dataとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export declare function sendBeaconAsMultipartFormData<T extends AnyObjects>(url: string, data: T): boolean;
/**
 * データをJSON.stringifyしたBlobに変換し、sendBeacon関数を実行、application/jsonとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export declare function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T): boolean;
export {};
