import swaggerToForm from './swaggerToForm'

const obj = {
  type: 'object',
  fields: {
    edit: ['name'],
    list: ['name'],
    detail: ['name'],
    create: ['name']
  },
  required: ['name'],
  properties: {
    id: {
      type: 'integer'
    },
    name: {
      type: 'string',
      description: '机构名称'
    },
    abbreviation: {
      type: 'string',
      description: '机构简称'
    }
  }
}

it('should render swagger definition to form', () => {
  expect(swaggerToForm(obj)).toMatchSnapshot()
})
