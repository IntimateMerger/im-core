export function getCookie(key: string): string | null {
  const keyPrefix = `${key}=`;
  const charCount = keyPrefix.length;
  const cookieList = document.cookie.split('; ');

  for (let i = 0, len = cookieList.length, keyAndValue; i < len; i++) {
    keyAndValue = cookieList[i];
    if (keyAndValue.substr(0, charCount) === keyPrefix) {
      return keyAndValue.slice(charCount);
    }
  }

  return null;
}

export function setCookie(
  key: string,
  value: string,
  options: {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
) {
  const {path, domain, maxAge, expires, secure, sameSite} = options;

  let request = `${key}=${value}`;
  if (path) request += `;path=${path}`;
  if (domain) request += `;domain=${domain}`;
  if (typeof maxAge === 'number') request += `;max-age=${maxAge}`;
  if (expires) request += `;expires=${expires.toUTCString()}`;
  if (secure) request += ';secure';
  if (sameSite) request += `;samesite=${sameSite}`;

  document.cookie = request;
}

export function deleteCookie(
  key: string,
  options: {
    path?: string;
    domain?: string;
  } = {}
) {
  setCookie(key, '', {
    maxAge: 0,
    path: options.path,
    domain: options.domain,
  });
}

export function getCookieAs<T = unknown>(key: string): T | null {
  const value = getCookie(key);

  if (value) return JSON.parse(decodeURIComponent(value)) as T;
  return null;
}

export function setCookieAs<T = unknown>(key: string, value: T) {
  setCookie(key, encodeURIComponent(JSON.stringify(value)));
}
