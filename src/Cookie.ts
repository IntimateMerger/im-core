export function getCookie(key: string): string | null{
  const keyPrefix = `${key}=`;
  const charCount = keyPrefix.length;
  const cookieList = document.cookie.split('; ');

  for (let i = 0, len = cookieList.length, keyAndValue; i < len; i++ ) {
    keyAndValue = cookieList[i];
    if (keyAndValue.substr(0, charCount) === keyPrefix) {
      return keyAndValue.slice(charCount);
    }
  }

  return null;
}

interface CookieOption {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  samesite?: 'strict' | 'lax';
}

export function setCookie(key: string, value: string, options: CookieOption = {}) {
  const requests = [`${key}=${value}`];

  const {
    path,
    domain,
    maxAge,
    expires,
    secure,
    samesite,
  } = options;

  if (path) requests.push(`path=${path}`);
  if (domain) requests.push(`domain=${domain}`);
  if (typeof maxAge === 'number') requests.push(`max-age=${maxAge}`);
  if (expires) requests.push(`expires=${expires.toUTCString()}`);
  if (secure) requests.push('secure');
  if (samesite) requests.push(`samesite=${samesite}`);

  document.cookie = requests.join('; ');
}
