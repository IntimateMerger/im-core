interface SetCookieOption {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}
export declare function getCookie(key: string): string | null;
export declare function setCookie(key: string, value: string, options?: SetCookieOption): void;
export declare function deleteCookie(key: string, options?: {
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}): void;
export declare function getCookieAs<T = unknown>(key: string): T | null;
export declare function setCookieAs<T = unknown>(key: string, value: T, options?: SetCookieOption): void;
export {};
