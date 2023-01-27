type Body = Blob | string | FormData | URLSearchParams;
/**
 * Call navigator.sendBeacon, fallback to XHR for legacy browsers.
 * @param url
 * @param body Blob types are sent as text/plain for stirng, multipart/form-data for FormData, and application/x-www-form-urlencoded for URLSearchParams, depending on their type.
 */
export declare function sendBeacon(url: string, body?: Body): boolean;
type AnyObjects = Record<string, unknown>;
/**
 * Convert data to URLSearchParams, execute sendBeacon function, and send data as application/x-www-form-urlencoded.
 * @param url
 * @param data
 */
export declare function sendBeaconAsXWwwUrlEncoded<T extends AnyObjects>(url: string, data: T): boolean;
/**
 * Convert data to FormData, execute sendBeacon function, and send data as multipart/form-data.
 * @param url
 * @param data
 */
export declare function sendBeaconAsMultipartFormData<T extends AnyObjects>(url: string, data: T): boolean;
/**
 * Convert the data to JSON.stringify and Blob, execute the sendBeacon function, and send the data as application/json.
 * @param url
 * @param data
 */
export declare function sendBeaconAsJson<T extends AnyObjects>(url: string, data: T): boolean;
export {};
