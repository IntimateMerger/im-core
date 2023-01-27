type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type XHRParams = {
    url: string;
    method: HTTPMethod;
    body?: Document | XMLHttpRequestBodyInit | null;
    onLoad?: (responseText: string) => unknown;
    onError?: () => unknown;
    onTimeout?: () => unknown;
} & XHRRequestOptions;
type XHRRequestOptions = {
    timeout?: number;
    requestHeaders?: {
        [key: string]: string | string[];
    };
    withCredentials?: boolean;
    asynchronous?: boolean;
};
/**
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function xhrRequest(params: XHRParams): XMLHttpRequest;
/**
 * Sends a GET request using XMLHttpRequest
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function get(url: string, onLoad: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest and send the request with the GET method.
 * Set the request header to `Accept: application/json`.
 * The received response is processed as JSON.parse and called back in the onLoad argument.
 * The expected data type can be specified by generics.
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function getData<Response>(url: string, onLoad: (data: Response) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest and send data with the POST method.
 * @param url
 * @param body
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function post(url: string, body?: XMLHttpRequestBodyInit | null, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in JSON format using the POST method.
 * Set the request header to `Content-Type: application/json`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function postDataAsJson<T extends Record<string, unknown>>(url: string, data: T, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in application/x-www-form-urlencoded format using the POST method.
 * The request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function postDataAsXWwwFormUrlEncoded<RequestBody extends Record<string, unknown>>(url: string, data: RequestBody, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in multipart/form-data format using the POST method.
 * The request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
 * @template RequestBody - extends Record<string, string | Blob>
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export declare function postDataAsMultipartFormData<RequestBody extends Record<string, string | Blob>>(url: string, data: RequestBody, onLoad?: (responseText: string) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
export {};
