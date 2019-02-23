import React, { Component } from 'react'
import { Router } from '@reach/router'
import Loadable from 'react-loadable'

import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

// routes
import POS from './pos'
import Dashboard from './dashboard'
import Login from './login'
import OldPosSystem from './old_pos_system'

const NotFound = Loadable({
  loader: () => import(/* webpackChunkName: "NotFound" */ 'components/NotFound/NotFound'),
  loading: () => <div />
})

let basepath = '/'
if (window.localStorage) {
  basepath = window.localStorage.basepath || '/'
}

export default class extends Component {
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Router basepath={basepath}>
          <NotFound default />
          <Login path="/" />
          <Dashboard path="dashboard/*" />
          <POS path="pos" />
          <OldPosSystem path="old_pos_system" />
        </Router>
      </LocaleProvider>
    )
  }
}
