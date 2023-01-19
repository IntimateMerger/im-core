type Body = Blob | string | FormData | URLSearchParams;
/**
 * navigator.sendBeaconを糖衣する関数で、sendBeaconが使用できない場合XHRにフォールバックします。
 * @param url
 * @param body {Blob | string | FormData | URLSearchParams} 型によってContent-Typeとペイロードが変化します。Blob型はそのtypeに応じ、stirngはtext/plain、FormDataはmultipart/form-data、URLSearchParamsはapplication/x-www-form-urlencodedとして送信されます。
 * @returns {boolean}
 */
export declare function sendBeacon(url: string, body?: Body): boolean;
type AnyObjects = Record<string, unknown>;
/**
 * データをURLSearchParamsに変換し、sendBeacon関数を実行、application/x-www-form-urlencodedとしてデータを送信します。
 * @param url
 * @param data
 * @returns {boolean}
 */
export declare function sendBeaconAsXWwwUrlEncoded<T extends AnyObjects>(url: string, data: T): boolean;
/**
 * データをFormDataに変換し、sendBeacon関数を実行、multipart/form-dataとしてデータを送信します。
 * @param url
 * @param data
 * @returns
 */
export declare function sendBeaconAsMultipartFormData<T extends AnyObjects>(url: string, data: T): boolean;
/**
 *
 * @param url データをBlob(type: 'application/json')に変換し、sendBeacon関数を実行、application/jsonとしてデータを送信します。
 * @param data
 * @returns
 */
export declare function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T): boolean;
export {};
