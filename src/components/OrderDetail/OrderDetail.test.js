import React from 'react'
import { mount } from 'enzyme'
import OrderDetail from './OrderDetail'

it('should render using mount', ()=>{
  const mounted = mount(<OrderDetail />)

  expect(mounted).toMatchSnapshot()
})
