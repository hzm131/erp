import _map from 'lodash/map'

export default function swaggerToForm(obj, fields) {
  return _map(obj.properties, (v, k) => {
    v.required = obj.required && obj.required.includes(k)

    fields = obj.fields || fields;

    if(fields){
      v.fields = {}

      v.fields.create = fields.create.includes(k)
      v.fields.edit = fields.edit.includes(k)
      v.fields.list = fields.list.includes(k)
      v.fields.detail = fields.detail.includes(k)
    }

    const rules = []
    if (v.required) {
      rules.push({
        required: true,
        message: `必须输入${v.description}`
      })
    }

    return {
      name: v.description,
      type: v.type,
      field: k,
      col: {
        span: 12
      },
      rules,
      required: v.required,
      fields: v.fields
    }
  }).filter(v => v)
}
