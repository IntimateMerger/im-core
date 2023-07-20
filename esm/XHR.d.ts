type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type LoadCallbackPayload<Response> = {
    status: number;
    statusText: string;
    readyState: number;
    response: Response;
};
type LoadCallback<T> = (payload: LoadCallbackPayload<T>) => unknown;
type XHRRequestOptions = {
    timeout?: number;
    requestHeaders?: {
        [key: string]: string | string[];
    };
    withCredentials?: boolean;
    asynchronous?: boolean;
};
type XHRParams<Response> = {
    url: string;
    method: HTTPMethod;
    responseType?: XMLHttpRequestResponseType;
    body?: Document | XMLHttpRequestBodyInit | null;
    onLoadSuccess?: LoadCallback<Response>;
    onFailure?: () => unknown;
} & XHRRequestOptions;
/**
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws Network errors may occur during the execution of the XMLHttpRequest.
 * These errors do not result in the throwing of exceptions but can be
 * handled with the `onFailure` callback parameter.
 */
export declare function xhrRequest<Response>(params: XHRParams<Response>): XMLHttpRequest;
/**
 * Sends a GET request using XMLHttpRequest
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 */
export declare function get<Response>(url: string, onLoadSuccess: (payload: LoadCallbackPayload<Response>) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest and send the request with the GET method.
 * Set the request header to `Accept: application/json`.
 * The expected data type can be specified by generics.
 * @param url
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export declare function getData<Response>(url: string, onLoadSuccess: (data: Response) => unknown, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest and send data with the POST method.
 * @param url
 * @param body
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export declare function post<Response>(url: string, body?: XMLHttpRequestBodyInit | null, onLoadSuccess?: LoadCallback<Response>, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in JSON format using the POST method.
 * Set the request header to `Content-Type: application/json`.
 * @param url
 * @param data
 * @param onLoadSuccess
 * @param xhrRequestOptions
 * @throws {TypeError}
 */
export declare function postDataAsJson<Request extends Record<string, unknown>, Response>(url: string, data: Request, onLoadSuccess?: LoadCallback<Response>, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in application/x-www-form-urlencoded format using the POST method.
 * The request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 */
export declare function postDataAsXWwwFormUrlEncoded<RequestBody extends Record<string, unknown>, Response>(url: string, data: RequestBody, onLoadSuccess?: LoadCallback<Response>, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
/**
 * Use XMLHttpRequest to send data in multipart/form-data format using the POST method.
 * The request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
 * @template RequestBody - extends Record<string, string | Blob>
 * @param url
 * @param data
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export declare function postDataAsMultipartFormData<RequestBody extends Record<string, string | Blob>, Response>(url: string, data: RequestBody, onLoadSuccess?: LoadCallback<Response>, xhrRequestOptions?: XHRRequestOptions): XMLHttpRequest;
export {};
