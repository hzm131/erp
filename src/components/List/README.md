List example:

```
const mock = require('./mock').default
;
<List
  rows={mock.rows}
  fields={mock.fields}
  onClickCreate={mock.onClickCreate}
  onClickRow={console.log}
  pagination={{
    pageSize: 3,
    total: 30,
    onChange: console.log
  }}
/>
```

参数示例
```js { "file": "../mock.js" }
```
