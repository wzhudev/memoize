function memoizeFunc<T extends Function>(fn: T): T {
  let lastValue: any | undefined = undefined;
  let lastParams: any[] = [];
  let newParams: any[] = [];

  const result = function(...args: any[]) {
    newParams = [...args];

    if (!exactEqual(lastParams, newParams)) {
      lastValue = fn(...args);
    }

    lastParams = newParams;

    return lastValue;
  };

  return (result as any) as T;
}

function memoizeDecorator(target: any, key: string, descriptor: any) {
  return createMemoizer()(target, key, descriptor);
}

let memoizerId = 0;

function createMemoizer() {
  const memoizePrefix = `memoizer:${memoizerId++}`;
  let self: any = undefined;

  const result = function(_target: any, key: string, descriptor: any) {
    let fnKey: string | null = null;
    let fn: Function | null = null;
    let dirty = true;
    let lastParams: any[] = [];
    let newParams: any[] = [];
    let lastValue: any | undefined = undefined;

    if (typeof descriptor.value === 'function') {
      fnKey = 'value';
      fn = descriptor.value;

      // Deal with function, if the function has parameters, this decorator should compare
      // parameters and decide to use memoized value or not.
    } else if (typeof descriptor.get === 'function') {
      fnKey = 'get';
      fn = descriptor.get;
    }

    let setterFn: Function | null = null;

    // If the setter is assigned, the getter should get refreshed.
    if (typeof descriptor.set === 'function') {
      setterFn = descriptor.set;
    }

    if (!fn) {
      throw new Error('not supported!');
    }

    const memoizerKey = `${memoizePrefix}:${key}`;

    descriptor[fnKey!] = function(...args: any[]) {
      self = this;
      newParams = [...args];

      const valueUpdator = function() {
        dirty = dirty || !exactEqual(newParams, lastParams);

        if (dirty) {
          lastValue = fn!.apply(self, newParams);
          lastParams = newParams;
          dirty = false;
        }

        return lastValue;
      };

      const setterUpdator = function() {
        if (dirty) {
          lastValue = fn!.apply(self);
          dirty = false;
        }

        return lastValue;
      };

      // If the parameter never changes. Should compare parameters.
      if (!this.hasOwnProperty(memoizerKey)) {
        Object.defineProperty(this, memoizerKey, {
          configurable: true,
          enumerable: false,
          get: fnKey === 'value' ? valueUpdator : setterUpdator
        });
      }

      return this[memoizerKey];
    };

    if (setterFn) {
      descriptor.set = function(...args: any[]) {
        dirty = true;
        setterFn!.apply(this, args);
      };
    }
  };

  return result;
}

const exactEqual = function(a: any[], b: any[]) {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

function memoize<T>(target: any, key: string, descriptor: any): any;
function memoize<T extends Function>(fn: T): T;
function memoize(...args: any[]) {
  const l = args.length;

  if (l === 1) {
    return memoizeFunc(args[0]);
  } else if (l === 3) {
    return memoizeDecorator(args[0], args[1], args[2]);
  } else {
    throw new Error(
      '[ts-memoize] expect three parameters as decorator or one parameter as higher order function, ' +
        'but got ' +
        l
    );
  }
}

export default memoize;
