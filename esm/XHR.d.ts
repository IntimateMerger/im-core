interface GetOptions {
    onError?: () => unknown;
    onTimeout?: () => unknown;
    timeout?: number;
    withCredentials?: boolean;
}
export declare function get(url: string, onLoad: (responseText: string) => unknown, options?: GetOptions): XMLHttpRequest;
export declare function getValueAs<T = unknown>(url: string, onLoad: (value: T) => unknown, options?: GetOptions): XMLHttpRequest;
export {};
