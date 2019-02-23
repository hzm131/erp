import React from 'react'
import { mount } from 'enzyme'
import Form from './Form'

import mock from './mock'

it('should render new form', () => {
  const mounted = mount(
    <Form
      type="new"
      onSubmit={mock.onSubmit}
      obj={mock.obj}
      fields={mock.fields}
      onClickCancel={mock.onClickCancel}
    />
  )

  expect(mounted).toMatchSnapshot()
})

it('should render show form', () => {
  const mounted = mount(
    <Form
      type="show"
      onSubmit={mock.onSubmit}
      obj={mock.obj}
      fields={mock.fields}
      onClickCancel={mock.onClickCancel}
    />
  )

  expect(mounted).toMatchSnapshot()
})

it('should render edit form', () => {
  const mounted = mount(
    <Form
      type="edit"
      onSubmit={mock.onSubmit}
      obj={mock.obj}
      fields={mock.fields}
      onClickCancel={mock.onClickCancel}
    />
  )

  expect(mounted).toMatchSnapshot()
})

it('should render nothing when obj is not defined and type in ["edit", "show"]', () => {
  const mounted = mount(
    <Form
      type="edit"
      onSubmit={mock.onSubmit}
      fields={mock.fields}
      onClickCancel={mock.onClickCancel}
    />
  )

  expect(mounted).toMatchSnapshot()
})
