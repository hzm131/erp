import React, { Fragment } from 'react'
import { Router, Redirect } from '@reach/router'
import _groupBy from 'lodash/groupBy'
import _map from 'lodash/map'

const Frag = ({ children }) => <Fragment>{children}</Fragment>

function importModules() {
  const r = require.context('./', true, /index\.js$/)

  return r
    .keys()
    .filter(k => k !== './index.js')
    .reduce((prev, curr) => {
      const module = r(curr)
      const [, group, path] = /\.\/([^/]+)\/(.+)\/index.js/.exec(curr)

      prev.push({
        filepath: curr,
        group: group,
        path: path,
        config: module.config,
        module: module
      })
      return prev
    }, [])
}

const modules = importModules()

export default props => (
  <Router>
    <Redirect noThrow from="/settings" to="/dashboard/settings/organizations" />
    {_map(_groupBy(modules, 'group'), (v, k) => {
      return React.createElement(
        Frag,
        { path: k, key: k },
        v.map((vv, kk) =>
          React.createElement(
            vv.module.default,
            { key: kk, path: vv.path },
            null
          )
        )
      )
    })}
  </Router>
)
