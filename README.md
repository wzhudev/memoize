# ts-memoize

Use memoize pattern in your TypeScript code with only one API.

## Installation

```bash
npm install ts-memoize

# or yarn
yarn add ts-memoize
```

## Usage

```ts
import memoize from 'ts-memoize';
```

For function:

```ts
const memoizedGetter = memoize((a, b) => {
  // the function should not depend on values outside of its scope
  return someHeavyRevaluation(a, b);
});
```

For class:

```ts
// on getter (& setter)
class A {
  @memoize
  public get a() {
    return someHeavyRevaluation();
  }

  public set value(val) {
    // re-evaluate when the setter is invoked
  }
}

// on method
class B {
  @memoize
  public getFunction(param) {
    // re-evaluate when arguments change
    return someHeavyRevaluation(param);
  }
}
```
