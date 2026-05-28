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
});
