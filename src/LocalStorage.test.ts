import {describe, it, expect, beforeEach} from 'vitest';
import {getItem, setItem, removeItem, getValue, setValue} from './LocalStorage';

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
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
      const obj = {id: 1, label: 'a', tags: ['x', 'y']};
      setValue('obj', obj);
      expect(getValue('obj')).toEqual(obj);
    });

    it('未セットのキーは null を返す', () => {
      expect(getValue('missing')).toBeNull();
    });

    it('プリミティブ (数値・真偽値) も復元できる', () => {
      setValue('num', 42);
      setValue('bool', true);
      expect(getValue<number>('num')).toBe(42);
      expect(getValue<boolean>('bool')).toBe(true);
    });
  });
});
