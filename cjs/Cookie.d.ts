export declare function getCookie(key: string): string | null;
interface CookieOption {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}
export declare function setCookie(key: string, value: string, options?: CookieOption): void;
export declare function deleteCookie(key: string): void;
export declare function getCookieAs<T = unknown>(key: string): T | null;
export declare function setCookieAs<T = unknown>(key: string, value: T): void;
export {};
