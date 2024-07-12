# xlsx

基于 [SheetJS](https://sheetjs.com/) 的 Excel 文件操作。由于 Excel 的操作并不是刚需，而且 SheetJs 脚本较大，因此采用延迟加载脚本的形式。默认情况下使用 https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js。

使用本地路径：

`angular.json`：
```json
{
  "glob": "**/{xlsx.full.min,cpexcel}.js",
  "input": "./node_modules/xlsx/dist",
  "output": "assets/xlsx/"
}
```

# Todo

Global Config Service implementation.

```typescript
const alainConfig: GlobalConfig = {
  xlsx: {
    url: '/assets/xlsx/xlsx.full.min.js',
    modules: [`/assets/xlsx/cpexcel.js`]
  }
};
```

## API

### LazyService

| 成员                                      | 说明      | 类型               | 默认值 |
|-----------------------------------------|---------|------------------|-----|
| `import(fileOrUrl: File &#124; string)` | 导入 Excel，返回 JSON | `Promise<{ [key: string]: any[][] }>` | - |
| `export(options: XlsxExportOptions)`    | 导出 Excel | `Promise<void>`  | - |
| `numberToSchema(val: number)`           | 数值转符号名  | `string`         | - |

### XlsxExportOptions

| 成员 | 说明                                                                                                    | 类型 | 默认值 |
|----|-------------------------------------------------------------------------------------------------------|----|-----|
| `[sheets]` | 数据源                                                                                                   | `{ [sheet: string]: WorkSheet }` | `XlsxExportSheet[]` | - |
| `[filename]` | Excel 文件名                                                                                             | `string` | `export.xlsx` |
| `[opts]` | Excel 写入选项，[WritingOptions](https://github.com/SheetJS/sheetjs/blob/master/docbits/81_writeopts.md) | `WritingOptions` | - |
| `[callback]` | 保存前触发                                                                                                 | `(wb: WorkBook) => void` | - |


### `[xlsx]` 指令

```html
<div [xlsx]="XlsxExportOptions"> 导出 </div>
```
