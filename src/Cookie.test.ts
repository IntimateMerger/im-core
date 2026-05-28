import {describe, it, expect, beforeEach} from 'vitest';
import {
  getCookie,
  setCookie,
  deleteCookie,
  getCookieAs,
  setCookieAs,
} from './Cookie';

/**
 * jsdom の document.cookie は max-age=0 で実際に削除されるため、
 * 各テスト前に既存 cookie を全て掃除しておく。
 */
const clearAllCookies = () => {
  document.cookie.split('; ').forEach(c => {
    const eq = c.indexOf('=');
    const name = eq > -1 ? c.substring(0, eq) : c;
    if (name) document.cookie = `${name}=;max-age=0;path=/`;
  });
};

describe('Cookie', () => {
  beforeEach(() => {
    clearAllCookies();
  });

  describe('setCookie / getCookie', () => {
    it('セットした値を取得できる', () => {
      setCookie('foo', 'bar');
      expect(getCookie('foo')).toBe('bar');
    });

    it('未セットのキーは null を返す', () => {
      expect(getCookie('missing')).toBeNull();
    });

    it('複数の cookie が共存できる', () => {
      setCookie('a', '1');
      setCookie('b', '2');
      expect(getCookie('a')).toBe('1');
      expect(getCookie('b')).toBe('2');
    });

    it('同じキーに上書きできる', () => {
      setCookie('key', 'first');
      setCookie('key', 'second');
      expect(getCookie('key')).toBe('second');
    });

    it('option (path / sameSite) を付与しても値は取得できる', () => {
      setCookie('foo', 'bar', {path: '/', sameSite: 'lax'});
      expect(getCookie('foo')).toBe('bar');
    });
  });

  describe('deleteCookie', () => {
    it('セット済みの cookie を削除できる', () => {
      setCookie('foo', 'bar');
      expect(getCookie('foo')).toBe('bar');
      deleteCookie('foo');
      expect(getCookie('foo')).toBeNull();
    });

    it('存在しないキーを削除しても例外を出さない', () => {
      expect(() => deleteCookie('missing')).not.toThrow();
    });
  });

  describe('getCookieAs / setCookieAs', () => {
    it('オブジェクトをセット/取得できる (encode/decode 経由)', () => {
      const value = {id: 123, name: 'taro', flags: ['a', 'b']};
      setCookieAs('user', value);
      expect(getCookieAs('user')).toEqual(value);
    });

    it('未セットのキーは null を返す', () => {
      expect(getCookieAs('missing')).toBeNull();
    });

    it('日本語など URI encode が要る値も復元できる', () => {
      setCookieAs('label', {text: 'こんにちは'});
      expect(getCookieAs('label')).toEqual({text: 'こんにちは'});
    });

    it('ジェネリック型注釈で型推論が効く', () => {
      type User = {id: number; name: string};
      setCookieAs<User>('user', {id: 1, name: 'a'});
      const got = getCookieAs<User>('user');
      expect(got?.id).toBe(1);
      expect(got?.name).toBe('a');
    });
  });
});
