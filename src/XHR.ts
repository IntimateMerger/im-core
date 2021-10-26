interface GetOptions {
  onError?: () => unknown;
  onTimeout?: () => unknown;
  timeout?: number;
  withCredentials?: boolean;
}

export function get(
  url: string,
  onLoad: (responseText: string) => unknown,
  options: GetOptions = {}
): XMLHttpRequest {
  const {onError, onTimeout, timeout, withCredentials} = options;

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    onLoad(xhr.responseText);
  };

  if (onError)
    xhr.onerror = () => {
      onError();
    };

  if (onTimeout)
    xhr.ontimeout = () => {
      onTimeout();
    };

  xhr.withCredentials = !!withCredentials;

  xhr.open('GET', url, true);

  if (typeof timeout === 'number') xhr.timeout = timeout;

  xhr.send();

  return xhr;
}

export function getValueAs<T = unknown>(
  url: string,
  onLoad: (value: T) => unknown,
  options: GetOptions = {}
) {
  return get(
    url,
    responseText => {
      onLoad(JSON.parse(responseText) as T);
    },
    options
  );
}
