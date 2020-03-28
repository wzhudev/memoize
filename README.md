# ts-memoize

Use memoize pattern in your TypeScript code with easy API.

## Installation

```bash
npm install ts-memoize

# or yarn
yarn add ts-memoize
```

## Usage

For class:

```ts
@memoize
```

For function:

```ts
const memoizedGetter = memoize((a, b) => {
  // the function should not depend on values outside of its scope
  return someHeavyRevaluation(a, b);
});
```

Examples:

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
