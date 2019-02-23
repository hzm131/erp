import yaml from 'js-yaml'
export default {
  rows: [
    {
      id: 1,
      name: '上海测试科技有限公司',
      abbreviation: '测试',
      established_at: '2018-08-15T08:45:48.961Z',
      created_at: '2018-08-15T08:45:48.961Z',
      hide_value: 'secret'
    },
    {
      id: 2,
      name: 'Apple Inc',
      abbreviation: 'APPL',
      established_at: '2018-08-15T08:45:48.961Z',
      created_at: '2018-08-15T08:45:48.961Z',
      hide_value: 'secret'
    },
    {
      id: 3,
      name: 'Google Inc',
      abbreviation: 'GOOL',
      established_at: '2018-08-15T08:45:48.961Z',
      created_at: '2018-08-15T08:45:48.961Z',
      hide_value: 'secret'
    }
  ],
  fields: yaml.safeLoad(`
---
- name: 机构ID
  field: id
  col:
    span: 12
  rules: []
  required: true
  fields:
    create: true
    edit: true
    detail: true
    list: true
  type: string
- name: 机构名称
  field: name
  col:
    span: 12
  rules:
  - required: true
    message: 必须输入机构名称
  required: true
  fields:
    create: true
    edit: true
    detail: true
    list: true
  type: string
- name: 机构简称
  field: abbreviation
  col:
    span: 12
  rules: []
  required: false
  fields:
    create: true
    edit: false
    detail: true
    list: true
  type: string
- name: 成立时间
  field: established_at
  col:
    span: 12
  rules: []
  required: false
  fields:
    create: true
    edit: true
    detail: true
    list: false
  type: date-time
- name: 创建时间
  field: created_at
  col:
    span: 12
  rules: []
  required: false
  fields:
    create: false
    edit: false
    detail: true
    list: true
  type: date-time
- name: 隐藏字段
  field: hide_value
  col:
    span: 12
  rules: []
  required: false
  fields:
    create: false
    edit: false
    detail: false
    list: false
  type: string
  `),
  onClickCreate() {
    console.log('clicked create')
  },
  onClickEdit() {
    console.log('clicked edit')
  }
}
