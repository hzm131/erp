import React from 'react'
import Loadable from 'react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "Login" */ './OldPosSystem'),
  loading: () => <div />
})
