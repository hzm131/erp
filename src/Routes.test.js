import React from 'react'
import Routes from './Routes'

import { shallow, mount } from 'enzyme'

import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'

const App = () => (
  <LocationProvider history={createHistory(createMemorySource('/'))}>
    <Routes />
  </LocationProvider>
)

it('renders without crashing using shallow', () => {
  const shallowed = shallow(<App />)
  expect(shallowed).toMatchSnapshot()
})

it('renders without crashing using mount', () => {
  const mounted = mount(<App />)
  expect(mounted).toMatchSnapshot()
})
