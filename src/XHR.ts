type XMLHttpRequestBodyInit =
  | string
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams;

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
  requestHeaders?: {[key: string]: string | string[]};
  asynchronous?: boolean;
};

/**
 * XMLHttpRequestを使用したリクエストを送信する糖衣関数です。
 * @param params {XHRParams} withCredentialsとasyncが未設定の場合trueとします。
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
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
    withCredentials = true,
    requestHeaders,
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
 * XMLHttpRequestを使用し単純なGETリクエストを送信します。
 * @param url
 * @param onLoad
 * @param XHRRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
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
 * XMLHttpRequestを使用し、POSTメソッドでデータを送信します。
 * @param url
 * @param body
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
 */
export function post(
  url: string,
  body?: XMLHttpRequestBodyInit | null,
  onLoad?: (responseText: string) => unknown,
  xhrRequestOptions: XHRRequestOptions = {}
) {
  // bodyがstring型の場合、リクエストヘッダーには `Content-Type: text/plain;charset=UTF-8` が設定される。
  return xhrRequest({
    url,
    method: 'POST',
    body,
    onLoad,
    ...xhrRequestOptions,
  });
}

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
 * XMLHttpRequestを使用し、POSTメソッドでapplication/x-www-form-urlencoded形式のデータを送信します。
 * リクエストヘッダーには `Content-Type: application/x-www-form-urlencoded;charset=UTF-8` が設定されます。
 * @param url
 * @param data
 * @param onLoad
 * @param xhrRequestOptions
 * @returns {XMLHttpRequest}
 * @throws {SyntaxError | SecurityError | InvalidAccessError | InvalidStateError}
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

  // bodyにURLSearchParams型が設定された場合、リクエストヘッダーに `Content-Type: application/x-www-form-urlencoded;charset=UTF-8` が設定される。
  return post(url, urlSearchParams, onLoad, xhrRequestOptions);
}

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

  // bodyにFormData型が設定された場合、リクエストヘッダーに `Content-Type: multipart/form-data; boundary=...` が設定される。
  return post(url, formData, onLoad, xhrRequestOptions);
}
