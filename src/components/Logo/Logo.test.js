import React from 'react'
import { mount } from 'enzyme'
import Logo from './Logo'

it('should render using mount', ()=>{
  const mounted = mount(<Logo width={50} fill="black"/>)

  expect(mounted).toMatchSnapshot()
})
