import React from 'react'
import { mount } from 'enzyme'
import LogoWithName from './LogoWithName'

it('should render using mount', ()=>{
  const mounted = mount(<LogoWithName width={50} fill="black"/>)

  expect(mounted).toMatchSnapshot()
})
