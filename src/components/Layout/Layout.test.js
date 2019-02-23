import React from 'react'
import { shallow, mount } from 'enzyme'
import DashboardLayout, { LayoutWithLocation } from './Layout'

it('should render default index using shallow', () => {
  const shallowd = shallow(
    <DashboardLayout pathname="/dashboard/settings/organizations">
      <div>BODY IN HERE</div>
    </DashboardLayout>
  )

  expect(shallowd).toMatchSnapshot()
})

it('should render deepest router using shallow 2', () => {
  const shallowd = shallow(
    <DashboardLayout pathname="/dashboard/settings/organizations/other">
      <div>BODY IN HERE</div>
    </DashboardLayout>
  )

  expect(shallowd).toMatchSnapshot()
})

it('LayoutWithLocation using shallow', () => {
  const shallowd = shallow(
    <LayoutWithLocation pathname="/dashboard/settings/organizations">
      <div>BODY IN HERE</div>
    </LayoutWithLocation>
  )

  expect(shallowd).toMatchSnapshot()
})

it('LayoutWithLocation using mount', () => {
  const mounted = mount(
    <LayoutWithLocation pathname="/dashboard/settings/organizations">
      <div>BODY IN HERE</div>
    </LayoutWithLocation>
  )

  expect(mounted).toMatchSnapshot()
})
