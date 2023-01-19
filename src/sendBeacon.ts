import {post} from './XHR';

type Body = Blob | string | FormData | URLSearchParams;

export function sendBeacon(url: string, body?: Body): boolean {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, body);
  } else {
    const xhr = post(url, body, void 0, {asynchronous: false});
    return xhr.status === 200;
  }
}

type AnyObjects = Record<string, unknown>; // ≒ {}

export function sendBeaconAsXWwwUrlEncoded<T extends AnyObjects>(
  url: string,
  data: T
) {
  const urlSearchParams = new URLSearchParams();
  for (const name in data) {
    urlSearchParams.append(name, String(data[name]));
  }

  return sendBeacon(url, urlSearchParams);
}

export function sendBeaconAsMultipartFormData<T extends AnyObjects>(
  url: string,
  data: T
) {
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, String(data[name]));
  }

  return sendBeacon(url, formData);
}

export function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T) {
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  return sendBeacon(url, blob);
}
