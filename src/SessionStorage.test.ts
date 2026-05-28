import {describe, it, expect, beforeEach} from 'vitest';
import {
  getItem,
  setItem,
  removeItem,
  getValue,
  setValue,
} from './SessionStorage';

describe('SessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('setItem / getItem', () => {
    it('セットした文字列を取得できる', () => {
      setItem('foo', 'bar');
      expect(getItem('foo')).toBe('bar');
    });

    it('未セットのキーは null を返す', () => {
      expect(getItem('missing')).toBeNull();
    });

    it('同じキーに上書きできる', () => {
      setItem('k', 'first');
      setItem('k', 'second');
      expect(getItem('k')).toBe('second');
    });
  });

  describe('removeItem', () => {
    it('セット済みの値を削除できる', () => {
      setItem('foo', 'bar');
      removeItem('foo');
      expect(getItem('foo')).toBeNull();
    });
  });

  describe('getValue / setValue (JSON)', () => {
    it('オブジェクトを JSON 経由で取得できる', () => {
      const obj = {id: 1, label: 'a'};
      setValue('obj', obj);
      expect(getValue('obj')).toEqual(obj);
    });

    it('未セットのキーは null を返す', () => {
      expect(getValue('missing')).toBeNull();
    });

    it('localStorage と分離されている', () => {
      setValue('shared', {from: 'session'});
      localStorage.setItem('shared', JSON.stringify({from: 'local'}));
      // sessionStorage は session 側の値を返す
      expect(getValue('shared')).toEqual({from: 'session'});
    });
  });
});
