import React from 'react'
import { mount } from 'enzyme'

import List from './List'
import mock from './mock'

it('should render using shallow', () => {
  const mounted = mount(
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
  )

  expect(mounted).toMatchSnapshot()
})
