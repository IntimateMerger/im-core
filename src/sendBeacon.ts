import {post} from './XHR';

type Body = Blob | string | FormData | URLSearchParams;

/**
 * navigator.sendBeaconを糖衣する関数で、sendBeaconが使用できない場合XHRにフォールバックします。
 * @param {string} url
 * @param {(Blob | string | FormData | URLSearchParams)} body 型によってContent-Typeとペイロードが変化します。Blob型はそのtypeに応じ、stirngはtext/plain、FormDataはmultipart/form-data、URLSearchParamsはapplication/x-www-form-urlencodedとして送信されます。
 * @returns {boolean}
 */
export function sendBeacon(url: string, body?: Body): boolean {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, body);
  } else {
    try {
      post(url, body, void 0, {asynchronous: false});
      return true;
    } catch {
      return false;
    }
  }
}

type AnyObjects = Record<string, unknown>; // ≒ {}

/**
 * データをURLSearchParamsに変換し、sendBeacon関数を実行、application/x-www-form-urlencodedとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
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
 * データをFormDataに変換し、sendBeacon関数を実行、multipart/form-dataとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
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
 * データをJSON.stringifyしたBlobに変換し、sendBeacon関数を実行、application/jsonとしてデータを送信します。
 * @template T - extends Record<string, unknown>
 * @param {string} url
 * @param {T} data
 * @returns {boolean}
 */
export function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T) {
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  return sendBeacon(url, blob);
}
