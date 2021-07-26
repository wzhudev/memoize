import memoize from '../src';

describe('ts-memoize', () => {
  let count = 0;

  describe('decorator', () => {
    beforeEach(() => {
      count = 0;
    });

    it('should work with get func', () => {
      class A {
        @memoize
        public get a() {
          count += 1;
          return 'a';
        }
      }

      const a = new A();

      expect(a.a).toBe('a');
      expect(count).toBe(1);
      expect(a.a).toBe('a');
      expect(a.a).toBe('a');
      expect(count).toBe(1);
    });

    it('should work with value func', () => {
      class A {
        @memoize
        public getFunction() {
          count += 1;
          return 'a';
        }
      }

      const a = new A();

      expect(a.getFunction()).toBe('a');
      expect(count).toBe(1);
      expect(a.getFunction()).toBe('a');
      expect(a.getFunction()).toBe('a');
      expect(count).toBe(1);
    });

    it('should work with value func with params', () => {
      class A {
        @memoize
        public getFunction(acc: number): number {
          count += 1;
          return acc + 1;
        }
      }

      const a = new A();

      expect(a.getFunction(1)).toBe(2);
      expect(count).toBe(1);
      expect(a.getFunction(1)).toBe(2);
      expect(count).toBe(1);
      expect(a.getFunction(2)).toBe(3);
      expect(count).toBe(2);
      expect(a.getFunction(1)).toBe(2);
      expect(count).toBe(3);
    });

    it('should work with setter', () => {
      class A {
        public get a() {
          count += 1;
          return this._a;
        }

        @memoize
        public set a(val: string) {
          this._a = val;
        }

        public _a = 'b';
      }

      const a = new A();

      expect(a.a).toBe('b');
      expect(count).toBe(1);

      a.a = 'c';

      expect(a._a).toBe('c');
      expect(a.a).toBe('c');
      expect(count).toBe(2);
      expect(a.a).toBe('c');
      expect(count).toBe(2);
    });
  });

  describe('fn', () => {
    beforeEach(() => (count = 0));

    it('should just work', () => {
      const a = memoize((a: number) => {
        count += 1;
        return a + 1;
      });

      expect(a(1)).toBe(2);
      expect(count).toBe(1);

      expect(a(1)).toBe(2);
      expect(count).toBe(1);

      expect(a(2)).toBe(3);
      expect(count).toBe(2);
    });

    it('should support no args function', () => {
      const a = memoize(() => {
        count += 1;
        return 0;
      });

      expect(a()).toBe(0);
      expect(count).toBe(1);

      expect(a()).toBe(0);
      expect(count).toBe(1);
    });
  });
});
