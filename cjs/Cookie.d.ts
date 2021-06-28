export declare function getCookie(key: string): string | null;
interface CookieOption {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    samesite?: 'strict' | 'lax';
}
export declare function setCookie(key: string, value: string, options?: CookieOption): void;
export {};
