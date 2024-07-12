# Other Utils

## deepGet

类似 `lodash.get`，根据 `path` 获取安全值：

```typescript
const obj = {
  id: 1,
  user: {
    name: 'cipchk',
    age: 18
  }
};

deepGet(obj, 'id'); // 1
deepGet(obj, 'user.age'); // 18
```

## deepCopy

基于 extend 的深度拷贝：

```typescript
const source = { a: 1, user: { name: 'cipchk' } };
const obj = deepCopy(source);
```

## deepMerge

深度合并：

```typescript
let original = { a: 1, b: { c: 'c' } };
deepMerge(original, { b: { d: 'd' }, arr: [ 1 ] });
// output: { a: 1, b: { c: 'c', d: 'd' }, arr: [ 1 ] }
```
