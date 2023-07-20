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

type LoadCallbackPayload<Response> = {
  status: number;
  statusText: string;
  readyState: number;
  response: Response;
  responseText: string;
};

type LoadCallback<T> = (payload: LoadCallbackPayload<T>) => unknown;

type XHRRequestOptions = {
  timeout?: number;
  requestHeaders?: {[key: string]: string | string[]};
  withCredentials?: boolean;
  asynchronous?: boolean;
};

type XHRParams<Response> = {
  url: string;
  method: HTTPMethod;
  responseType?: XMLHttpRequestResponseType;
  body?: Document | XMLHttpRequestBodyInit | null;
  onLoadSuccess?: LoadCallback<Response>;
  onLoadFailure?: LoadCallback<Response>;
  onLoad?: () => unknown;
  onError?: () => unknown;
  onTimeout?: () => unknown;
} & XHRRequestOptions;

/**
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function xhrRequest<Response>(params: XHRParams<Response>) {
  const {
    url,
    method,
    responseType,
    body = null,
    onLoadSuccess,
    onLoadFailure,
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

  if (typeof responseType === 'string') xhr.responseType = responseType;

  xhr.withCredentials = withCredentials;
  if (typeof timeout === 'number') xhr.timeout = timeout;

  for (const name in requestHeaders) {
    const content = requestHeaders[name];
    const list = typeof content === 'string' ? [content] : content;
    list.forEach(value => {
      xhr.setRequestHeader(name, value);
    });
  }


  xhr.onload = () => {
    if (onLoad) onLoad();

    const {
      status,
      statusText,
      readyState,
      response,
      responseText,
    } = xhr;

    const loadCallbackPayload: LoadCallbackPayload<Response> = {
      status,
      statusText,
      readyState,
      response,
      responseText,
    };

    if (status === 200 && readyState === 4) {
      if (onLoadSuccess) onLoadSuccess(loadCallbackPayload);
    } else {
      if (onLoadFailure) onLoadFailure(loadCallbackPayload);
    }
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
export function get<Response>(
  url: string,
  onLoadSuccess: (payload: LoadCallbackPayload<Response>) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return xhrRequest({
    url,
    method: 'GET',
    onLoadSuccess,
    ...xhrRequestOptions,
  });
}

/**
 * Use XMLHttpRequest and send the request with the GET method.
 * Set the request header to `Accept: application/json`.
 * The received response is processed as JSON.parse and called back in the onLoad argument.
 * The expected data type can be specified by generics.
 * @param url
 * @param onLoadSuccess
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function getData<Response>(
  url: string,
  onLoadSuccess: (data: Response) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return xhrRequest<Response>({
    url,
    method: 'GET',
    responseType: 'json',
    onLoadSuccess: (callbackPayload) => {
      const data = callbackPayload.response as Response;
      onLoadSuccess(data);
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
export function post<Response>(
  url: string,
  body?: XMLHttpRequestBodyInit | null,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  // If body is a string type, the request header is set to `Content-Type: text/plain;charset=UTF-8`.
  return xhrRequest<Response>({
    url,
    method: 'POST',
    body,
    onLoadSuccess,
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
export function postDataAsJson<Request extends Record<string, unknown>, Response>(
  url: string,
  data: Request,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  return post<Response>(url, JSON.stringify(data), onLoadSuccess, {
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
  RequestBody extends Record<string, unknown>,
  Response
>(
  url: string,
  data: RequestBody,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  const urlSearchParams = new URLSearchParams();
  for (const name in data) {
    urlSearchParams.append(name, String(data[name]));
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
 * @param onLoad
 * @param xhrRequestOptions
 * @throws {(SyntaxError | SecurityError | InvalidAccessError | InvalidStateError)}
 */
export function postDataAsMultipartFormData<
  RequestBody extends Record<string, string | Blob>,
  Response
>(
  url: string,
  data: RequestBody,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  // If the body is set to the FormData type, the request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
  return post(url, formData, onLoadSuccess, xhrRequestOptions);
}
