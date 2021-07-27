# memoize

Use memoize pattern in your TypeScript code.

## Installation

```bash
npm install @wendellhu/memoize

# or yarn
yarn add @wendellhu/memoize
```

## Usage

```ts
import { memoizeFunc, memoize } from '@wendellhu/memoize';
```

For function:

```ts
const memoizedGetter = memoizeFunc((a, b) => {
  // the function should not depend on values outside of its scope
  return someHeavyEvaluation(a, b);
});
```

For class:

```ts
import { memoize } from '@wendellhu/memoize';

// on getter (& setter)
class A {
  @memoize()
  public get a() {
    return someHeavyEvaluation();
  }

  public set value(val) {
    // re-evaluate when the setter is invoked
  }
}

// on method
class B {
  @memoize()
  public getFunction(param) {
    // re-evaluate when arguments change
    return someHeavyEvaluation(param);
  }
}

// or with key
class C {
  @memoize((param) => toKey(param))
  public getFunction(param, anotherParam) {
    // re-evaluate when arguments change, and cache by groups according to `key`
    return someHeavyEvaluation(param, anotherParam);
  }
}
```
