type XMLHttpRequestBodyInit = string | Blob | BufferSource | FormData | URLSearchParams;
type XHRParams = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Document | XMLHttpRequestBodyInit | null;
    onLoad?: (responseText: string) => unknown;
    onError?: () => unknown;
    onTimeout?: () => unknown;
} & XHRRequestOptions;
type XHRRequestOptions = {
    timeout?: number;
    withCredentials?: boolean;
    requestHeaders?: {
        [key: string]: string | string[];
    };
    asynchronous?: boolean;
};
/**
 * XMLHttpRequestを使用したリクエストを送信する糖衣関数です。
 * @param params {XHRParams} withCredentialsとasyncが未設定の場合trueとします。
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function xhrRequest(params: XHRParams): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し単純なGETリクエストを送信します。
 * @param url
 * @param onLoad
 * @param XHRRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function get(url: string, onLoad: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し、GETメソッドでリクエストを送信します。
 * リクエストヘッダーは `Accept: application/json` を設定します。
 * 受け取ったレスポンスはJSON.parse処理し、onLoad引数にコールバックします。
 * 期待されるデータ型はジェネリクスで指定する事ができます。
 * @param url
 * @param onLoad {(data: T) => unknwon}
 * @param XHRRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function getData<Response>(url: string, onLoad: (data: Response) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し、POSTメソッドでデータを送信します。
 * @param url
 * @param body
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function post(url: string, body?: XMLHttpRequestBodyInit | null, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し、POSTメソッドでJSON形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: application/json` を設定します。
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function postDataAsJson<T extends Record<string, unknown>>(url: string, data: T, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し、POSTメソッドでapplication/x-www-form-urlencoded形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: application/x-www-form-urlencoded;charset=UTF-8` が設定されます。
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function postDataAsXWwwFormUrlEncoded<RequestBody extends Record<string, unknown>>(url: string, data: RequestBody, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * XMLHttpRequestを使用し、POSTメソッドでmultipart/form-data形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: multipart/form-data; boundary=...` が設定されます。
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export declare function postDataAsMultipartFormData<RequestBody extends Record<string, string | Blob>>(url: string, data: RequestBody, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
export {};
