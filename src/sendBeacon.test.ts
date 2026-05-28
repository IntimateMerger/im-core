import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {
  sendBeacon,
  sendBeaconAsXWwwUrlEncoded,
  sendBeaconAsMultipartFormData,
  sendBeaconAsJson,
} from './sendBeacon';

describe('sendBeacon', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendBeacon — navigator.sendBeacon が使える場合', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: vi.fn().mockReturnValue(true),
      });
    });

    it('URL と body を渡して navigator.sendBeacon を呼ぶ', () => {
      const ok = sendBeacon('https://example.com/log', 'payload');
      expect(navigator.sendBeacon).toHaveBeenCalledWith(
        'https://example.com/log',
        'payload'
      );
      expect(ok).toBe(true);
    });

    it('body 省略時も navigator.sendBeacon を呼ぶ', () => {
      sendBeacon('https://example.com/log');
      expect(navigator.sendBeacon).toHaveBeenCalledWith(
        'https://example.com/log',
        undefined
      );
    });
  });

  describe('sendBeaconAsXWwwUrlEncoded', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: vi.fn().mockReturnValue(true),
      });
    });

    it('URLSearchParams に変換して送信する', () => {
      sendBeaconAsXWwwUrlEncoded('https://example.com/log', {
        id: 1,
        name: 'a',
      });
      const args = (navigator.sendBeacon as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(args[0]).toBe('https://example.com/log');
      const body = args[1] as URLSearchParams;
      expect(body).toBeInstanceOf(URLSearchParams);
      expect(body.get('id')).toBe('1');
      expect(body.get('name')).toBe('a');
    });
  });

  describe('sendBeaconAsMultipartFormData', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: vi.fn().mockReturnValue(true),
      });
    });

    it('FormData に変換して送信する', () => {
      sendBeaconAsMultipartFormData('https://example.com/log', {
        key: 'value',
      });
      const args = (navigator.sendBeacon as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(args[1]).toBeInstanceOf(FormData);
      const fd = args[1] as FormData;
      expect(fd.get('key')).toBe('value');
    });
  });

  describe('sendBeaconAsJson', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: vi.fn().mockReturnValue(true),
      });
    });

    it('Blob (application/json) に変換して送信する', () => {
      sendBeaconAsJson('https://example.com/log', {id: 1, name: 'a'});
      const args = (navigator.sendBeacon as ReturnType<typeof vi.fn>).mock
        .calls[0];
      const blob = args[1] as Blob;
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });
  });

  describe('navigator.sendBeacon が無い環境での XHR フォールバック', () => {
    let originalXHR: typeof XMLHttpRequest;
    let xhrSendSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // navigator.sendBeacon を未定義にする
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: undefined,
      });
      // XMLHttpRequest を spy 可能な fake に差し替え
      originalXHR = globalThis.XMLHttpRequest;
      xhrSendSpy = vi.fn();
      class FakeXHR {
        open = vi.fn();
        setRequestHeader = vi.fn();
        addEventListener = vi.fn();
        send = xhrSendSpy;
        withCredentials = false;
      }
      // @ts-expect-error replacing global
      globalThis.XMLHttpRequest = FakeXHR;
    });

    afterEach(() => {
      globalThis.XMLHttpRequest = originalXHR;
    });

    it('post() 経由で XHR 送信 + true を返す', () => {
      const ok = sendBeacon('https://example.com/log', 'payload');
      expect(xhrSendSpy).toHaveBeenCalledTimes(1);
      expect(xhrSendSpy).toHaveBeenCalledWith('payload');
      expect(ok).toBe(true);
    });

    it('XHR 構築で例外が出たら false を返す', () => {
      // @ts-expect-error replacing global
      globalThis.XMLHttpRequest = function () {
        throw new Error('XHR not available');
      };
      const ok = sendBeacon('https://example.com/log', 'payload');
      expect(ok).toBe(false);
    });
  });
});
