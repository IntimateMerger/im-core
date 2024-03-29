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
};

type LoadCallback<Response> = (
  payload: LoadCallbackPayload<Response>
) => unknown;

type XHRRequestOptions<Response> = {
  timeout?: number;
  requestHeaders?: {[key: string]: string | string[]};
  withCredentials?: boolean;
  asynchronous?: boolean;
  onLoadFailure?: LoadCallback<Response>;
  onFailure?: (event: Event | LoadCallbackPayload<Response>) => unknown;
  onError?: (event: Event) => unknown;
  onTimeout?: (event: Event) => unknown;
};

type XHRParams<Response> = {
  url: string;
  method: HTTPMethod;
  responseType?: XMLHttpRequestResponseType;
  body?: Document | XMLHttpRequestBodyInit | null;
  onLoadSuccess?: LoadCallback<Response>;
} & XHRRequestOptions<Response>;

/**
 * Sends a request using XMLHttpRequest
 * @param params - withCredentials and asynchronous are true if not set.
 * @throws Network errors may occur during the execution of the XMLHttpRequest.
 * These errors do not result in the throwing of exceptions but can be
 * handled with the `onFailure` callback parameter.
 */
export function xhrRequest<Response>(params: XHRParams<Response>) {
  const {
    url,
    method,
    responseType,
    body = null,
    onLoadSuccess,
    onLoadFailure,
    onFailure,
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
  if (typeof responseType === 'string') xhr.responseType = responseType;

  for (const name in requestHeaders) {
    const content = requestHeaders[name];
    const list = typeof content === 'string' ? [content] : content;
    list.forEach(value => {
      xhr.setRequestHeader(name, value);
    });
  }

  xhr.addEventListener('load', () => {
    const {status, statusText, readyState, response} = xhr;

    const loadCallbackPayload: LoadCallbackPayload<Response> = {
      status,
      statusText,
      readyState,
      response,
    };

    if (status >= 200 && status < 300 && readyState === 4) {
      if (onLoadSuccess) onLoadSuccess(loadCallbackPayload);
    } else {
      if (onLoadFailure) onLoadFailure(loadCallbackPayload);
      if (onFailure) onFailure(loadCallbackPayload);
    }
  });
  xhr.addEventListener('error', event => {
    if (onFailure) onFailure(event);
    if (onError) onError(event);
  });

  xhr.addEventListener('timeout', event => {
    if (onFailure) onFailure(event);
    if (onTimeout) onTimeout(event);
  });

  xhr.send(body);
  return xhr;
}

/**
 * Sends a GET request using XMLHttpRequest
 * @param url
 * @param onLoad
 * @param xhrRequestOptions
 */
export function get<Response>(
  url: string,
  onLoadSuccess: (payload: LoadCallbackPayload<Response>) => unknown,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
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
 * The expected data type can be specified by generics.
 * @param url
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function getData<Response>(
  url: string,
  onLoadSuccess: (data: Response) => unknown,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
) {
  return xhrRequest<Response>({
    url,
    method: 'GET',
    responseType: 'json',
    onLoadSuccess: callbackPayload => {
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
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function post<Response>(
  url: string,
  body?: XMLHttpRequestBodyInit | null,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
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
 * @param onLoadSuccess
 * @param xhrRequestOptions
 * @throws {TypeError}
 */
export function postDataAsJson<
  Request extends Record<string, unknown>,
  Response
>(
  url: string,
  data: Request,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
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
 */
export function postDataAsXWwwFormUrlEncoded<
  RequestBody extends Record<string, unknown>,
  Response
>(
  url: string,
  data: RequestBody,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
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
 * @param onLoadSuccess
 * @param xhrRequestOptions
 */
export function postDataAsMultipartFormData<
  RequestBody extends Record<string, string | Blob>,
  Response
>(
  url: string,
  data: RequestBody,
  onLoadSuccess?: LoadCallback<Response>,
  xhrRequestOptions: XHRRequestOptions<Response> = {}
) {
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  // If the body is set to the FormData type, the request header is set to `Content-Type: multipart/form-data; boundary=... ` is set in the request header.
  return post(url, formData, onLoadSuccess, xhrRequestOptions);
}
