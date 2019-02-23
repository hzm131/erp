
创建模式

```js
const mock = require('./mock').default
;
<Form
  type="new"
  onSubmit={mock.onSubmit}
  obj={mock.obj}
  fields={mock.fields}
  onClickCancel={mock.onClickCancel}
/>
```

编辑模式:

```js
const mock = require('./mock').default
;
<Form
  type="edit"
  onSubmit={mock.onSubmit}
  obj={mock.obj}
  fields={mock.fields}
  onClickCancel={mock.onClickCancel}
/>
```

展示模式:

```js
const mock = require('./mock').default
;
<Form
  type="show"
  onSubmit={mock.onSubmit}
  obj={mock.obj}
  fields={mock.fields}
  onClickCreate={mock.onClickCreate}
  onClickEdit={mock.onClickEdit}
/>
```

参数示例
```js { "file": "../mock.js" }
```
