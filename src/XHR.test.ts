import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {
  xhrRequest,
  get,
  getData,
  post,
  postDataAsJson,
  postDataAsXWwwFormUrlEncoded,
  postDataAsMultipartFormData,
} from './XHR';

/**
 * jsdom の XMLHttpRequest は実通信できないため、テスト用の Fake で差し替えて
 * load / error / timeout の発火タイミングや setRequestHeader 等を観測する。
 */
class FakeXHR {
  public method = '';
  public url = '';
  public async = true;
  public withCredentials = false;
  public timeout = 0;
  public responseType: XMLHttpRequestResponseType = '';
  public readyState = 0;
  public status = 0;
  public statusText = '';
  public response: unknown = null;
  public headers: {[key: string]: string[]} = {};
  public body: unknown = null;
  private listeners: {[type: string]: Array<(event: Event) => void>} = {};

  open(method: string, url: string, asynchronous = true) {
    this.method = method;
    this.url = url;
    this.async = asynchronous;
  }

  setRequestHeader(name: string, value: string) {
    if (!this.headers[name]) this.headers[name] = [];
    this.headers[name].push(value);
  }

  addEventListener(type: string, fn: (event: Event) => void) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }

  send(body: unknown = null) {
    this.body = body;
  }

  fire(type: string, event: Event = new Event(type)) {
    (this.listeners[type] || []).forEach(fn => fn(event));
  }

  simulateLoad(status = 200, response: unknown = {ok: true}) {
    this.status = status;
    this.statusText = status === 200 ? 'OK' : 'Error';
    this.readyState = 4;
    this.response = response;
    this.fire('load');
  }
}

let last: FakeXHR;

beforeEach(() => {
  // @ts-expect-error - replacing global
  globalThis.XMLHttpRequest = function () {
    last = new FakeXHR();
    return last;
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('xhrRequest', () => {
  it('open / send が呼ばれる (withCredentials デフォルト true)', () => {
    xhrRequest({url: 'https://example.com/a', method: 'GET'});
    expect(last.method).toBe('GET');
    expect(last.url).toBe('https://example.com/a');
    expect(last.async).toBe(true);
    expect(last.withCredentials).toBe(true);
  });

  it('requestHeaders を全部 setRequestHeader で渡す', () => {
    xhrRequest({
      url: 'https://example.com/a',
      method: 'GET',
      requestHeaders: {
        'X-Token': 'abc',
        'X-Multi': ['v1', 'v2'],
      },
    });
    expect(last.headers['X-Token']).toEqual(['abc']);
    expect(last.headers['X-Multi']).toEqual(['v1', 'v2']);
  });

  it('timeout / responseType / withCredentials を反映する', () => {
    xhrRequest({
      url: 'https://example.com/a',
      method: 'GET',
      timeout: 5000,
      responseType: 'json',
      withCredentials: false,
    });
    expect(last.timeout).toBe(5000);
    expect(last.responseType).toBe('json');
    expect(last.withCredentials).toBe(false);
  });

  it('成功時 (status 200) に onLoadSuccess が呼ばれる', () => {
    const onLoadSuccess = vi.fn();
    xhrRequest({url: 'https://example.com/a', method: 'GET', onLoadSuccess});
    last.simulateLoad(200, {hello: 'world'});
    expect(onLoadSuccess).toHaveBeenCalledTimes(1);
    expect(onLoadSuccess.mock.calls[0][0]).toMatchObject({
      status: 200,
      readyState: 4,
      response: {hello: 'world'},
    });
  });

  it('失敗時 (status 500) に onLoadFailure と onFailure が呼ばれる', () => {
    const onLoadSuccess = vi.fn();
    const onLoadFailure = vi.fn();
    const onFailure = vi.fn();
    xhrRequest({
      url: 'https://example.com/a',
      method: 'GET',
      onLoadSuccess,
      onLoadFailure,
      onFailure,
    });
    last.simulateLoad(500, 'err');
    expect(onLoadSuccess).not.toHaveBeenCalled();
    expect(onLoadFailure).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledTimes(1);
  });

  it('error イベントで onError と onFailure が呼ばれる', () => {
    const onError = vi.fn();
    const onFailure = vi.fn();
    xhrRequest({
      url: 'https://example.com/a',
      method: 'GET',
      onError,
      onFailure,
    });
    last.fire('error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledTimes(1);
  });

  it('timeout イベントで onTimeout と onFailure が呼ばれる', () => {
    const onTimeout = vi.fn();
    const onFailure = vi.fn();
    xhrRequest({
      url: 'https://example.com/a',
      method: 'GET',
      onTimeout,
      onFailure,
    });
    last.fire('timeout');
    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledTimes(1);
  });
});

describe('get', () => {
  it('GET メソッドで送信する', () => {
    get('https://example.com/a', () => {});
    expect(last.method).toBe('GET');
  });
});

describe('getData', () => {
  it('responseType=json と Accept ヘッダを付与する', () => {
    getData('https://example.com/a', () => {});
    expect(last.method).toBe('GET');
    expect(last.responseType).toBe('json');
    expect(last.headers['Accept']).toEqual(['application/json']);
  });
});

describe('post', () => {
  it('POST メソッドで body を送信する', () => {
    post('https://example.com/a', 'payload');
    expect(last.method).toBe('POST');
    expect(last.body).toBe('payload');
  });
});

describe('postDataAsJson', () => {
  it('JSON 文字列化 + Content-Type: application/json', () => {
    postDataAsJson('https://example.com/a', {id: 1, name: 'a'});
    expect(last.method).toBe('POST');
    expect(last.body).toBe('{"id":1,"name":"a"}');
    expect(last.headers['Content-Type']).toEqual(['application/json']);
  });
});

describe('postDataAsXWwwFormUrlEncoded', () => {
  it('URLSearchParams 形式で body を送る', () => {
    postDataAsXWwwFormUrlEncoded('https://example.com/a', {id: 1, name: 'a'});
    expect(last.method).toBe('POST');
    expect(last.body).toBeInstanceOf(URLSearchParams);
    const params = last.body as URLSearchParams;
    expect(params.get('id')).toBe('1');
    expect(params.get('name')).toBe('a');
  });
});

describe('postDataAsMultipartFormData', () => {
  it('FormData 形式で body を送る', () => {
    postDataAsMultipartFormData('https://example.com/a', {key: 'value'});
    expect(last.method).toBe('POST');
    expect(last.body).toBeInstanceOf(FormData);
    const fd = last.body as FormData;
    expect(fd.get('key')).toBe('value');
  });
});
