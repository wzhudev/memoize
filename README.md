# ts-memoize

Sometimes it's expensive to calculate some value. With ts-memoize, you can use memoize pattern easily for TypeScript classes, to avoid uncessary comsumptions.

Only **one** API:

```ts
@memoize
```

Some examples:

```ts
// On getters.
class A {
  @memoize
  public get a() {
    return 'a';
  }
}

// On any methods.
class B {
  @memoize
  public getFunction() {
    return 'a';
  }
}

// Even methods with parameters...
class C {
  @memoize
  public getFunction(acc: number): number {
    return acc + 1;
  }
}
```
