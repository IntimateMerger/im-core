type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

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
  requestHeaders?: {[key: string]: string | string[]};
  withCredentials?: boolean;
  asynchronous?: boolean;
};

/**
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function xhrRequest(params: XHRParams) {
  const {
    url,
    method,
    body = null,
    onLoad,
    onError,
    onTimeout,
    timeout,
    requestHeaders,
    withCredentials = true,
    asynchronous = true,
  } = params;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, asynchronous);

  xhr.withCredentials = withCredentials;
  if (typeof timeout === 'number') xhr.timeout = timeout;

  for (const name in requestHeaders) {
    const content = requestHeaders[name];
    const list = typeof content === 'string' ? [content] : content;
    list.forEach(value => {
      xhr.setRequestHeader(name, value);
    });
  }

  if (onLoad)
    xhr.onload = () => {
      onLoad(xhr.responseText);
    };
  if (onError) xhr.onerror = onError;
  if (onTimeout) xhr.ontimeout = onTimeout;

  xhr.send(body);
  return xhr;
}

/**
 * Sends a GET request using XMLHttpRequest
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function get(
  url: string,
  onLoad: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return xhrRequest({
    url,
    method: 'GET',
    onLoad: (responseText: string) => {
      onLoad(responseText);
    },
    ...xhrRequestOptions,
  });
}

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
export function getData<Response>(
  url: string,
  onLoad: (data: Response) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return xhrRequest({
    url,
    method: 'GET',
    onLoad: responseText => {
      const data = JSON.parse(responseText) as Response;
      onLoad(data);
    },
    ...xhrRequestOptions,
    requestHeaders: {
      ...xhrRequestOptions.requestHeaders,
      Accept: 'application/json',
    },
  });
}

/**
 * Use XMLHttpRequest and send data with the POST method.
 * @param url
 * @param body
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function post(
  url: string,
  body?: XMLHttpRequestBodyInit | null,
  onLoad?: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  // If body is a string type, the request header is set to `Content-Type: text/plain;charset=UTF-8`.
  return xhrRequest({
    url,
    method: 'POST',
    body,
    onLoad,
    ...xhrRequestOptions,
  });
}

/**
 * Use XMLHttpRequest to send data in JSON format using the POST method.
 * Set the request header to `Content-Type: application/json`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsJson<T extends Record<string, unknown>>(
  url: string,
  data: T,
  onLoad?: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return post(url, JSON.stringify(data), onLoad, {
    requestHeaders: {
      ...xhrRequestOptions.requestHeaders,
      'Content-Type': 'application/json',
    },
    ...xhrRequestOptions,
  });
}

/**
 * Use XMLHttpRequest to send data in application/x-www-form-urlencoded format using the POST method.
 * The request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsXWwwFormUrlEncoded<
  RequestBody extends Record<string, unknown>
>(
  url: string,
  data: RequestBody,
  onLoad?: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  const urlSearchParams = new URLSearchParams();
  for (const name in data) {
    urlSearchParams.append(name, String(data[name]));
  }

  // If the URLSearchParams type is set in body, the request header is set to `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`.
  return post(url, urlSearchParams, onLoad, xhrRequestOptions);
}

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
export function postDataAsMultipartFormData<
  RequestBody extends Record<string, string | Blob>
>(
  url: string,
  data: RequestBody,
  onLoad?: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  // If the body is set to the FormData type, the request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
  return post(url, formData, onLoad, xhrRequestOptions);
}
