import React from 'react'
import { shallow } from 'enzyme'
import NotFound from './NotFound'

it('should render using shallow', ()=>{
  const shallowed = shallow(<NotFound />)

  expect(shallowed).toMatchSnapshot()
})
