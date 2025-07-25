import {post} from './XHR';

type Body = Blob | string | FormData | URLSearchParams;

/**
 * Call navigator.sendBeacon, fallback to XHR for legacy browsers.
 * @param url
 * @param body Blob types are sent as text/plain for stirng, multipart/form-data for FormData, and application/x-www-form-urlencoded for URLSearchParams, depending on their type.
 */
export function sendBeacon(url: string, body?: Body): boolean {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, body);
  } else {
    try {
      post(url, body, void 0, {asynchronous: true, withCredentials: true});
      return true;
    } catch {
      return false;
    }
  }
}

type AnyObjects = Record<string, unknown>; // ≒ {}

/**
 * Convert data to URLSearchParams, execute sendBeacon function, and send data as application/x-www-form-urlencoded.
 * @param url
 * @param data
 */
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

/**
 * Convert data to FormData, execute sendBeacon function, and send data as multipart/form-data.
 * @param url
 * @param data
 */
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

/**
 * Convert the data to JSON.stringify and Blob, execute the sendBeacon function, and send the data as application/json.
 * @param url
 * @param data
 */
export function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T) {
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  return sendBeacon(url, blob);
}
