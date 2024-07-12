# Form Utils

## MatchControl

匹配两个控件值：

```typescript
this.form = new FormGroup({
  pwd: new FormControl(''),
  repwd: new FormControl(''),
}, {
  validators: MatchControl('pwd', 'repwd'),
});
```

## _Validators

一套用于响应式表单的验证器，包含：

- `_Validators.num` 是否为数字
- `_Validators.int` 是否为整数
- `_Validators.decimal` 是否为小数点数值
- `_Validators.idCard` 是否为中华人民共和国居民身份证
- `_Validators.mobile` 是否为手机号（中国）
- `_Validators.url` 是否 URL 地址
- `_Validators.ip` 是否 IP 地址（支持v4、v6）
- `_Validators.color` 是否颜色代码值
- `_Validators.chinese` 是否中文

每一个验证型都包括着用于表单验证器：

```typescript
this.valForm = fb.group({
  // 手机号
  mobile: [null, Validators.compose([Validators.required, _Validators.mobile])]
});
```
