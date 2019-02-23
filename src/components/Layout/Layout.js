import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import _find from 'lodash/find'
import { navigate, Location } from '@reach/router'
import yaml from 'js-yaml'

import Logo from 'components/Logo/Logo'

import generateNavs from './generateNavs'

const Layout = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  flex-direction: column;
`

const Nav = styled.div`
  display: flex;
  align-items: center;
  background-color: #222;
  min-width: 300px;
  height: 32px;
  padding: 0 16px;
  overflow: scroll-x;
`

const NavItem = styled.a`
  display: block;
  color: #9d9d9d;
  background-color: #222;
  padding: 4px 8px;
  min-width: 42px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: white;
  }

  ${props =>
    props.active &&
    css`
      color: white;
      background-color: #080808;
      &:hover {
        color: white;
      }
    `};
`

const Gap = styled.div`
  flex: 1;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`

const Sider = styled.div`
  width: 220px;
  border-right: 1px solid #afafb6;
`

const LogoContainer = styled.div`
  width: 100%
  margin: 14px 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  flex: 1;
`

const MenuItem = styled.a`
  display: block;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 8px;
  font-size: 13px;
  font-weight: bold;
  &:hover {
    color: rgba(0, 0, 0, 1);
  }
`

const SubMenuItem = styled.a`
  display: block;
  color: rgba(0, 0, 0, 0.65);
  padding: 2px 0 2px 18px;
  margin: 2px 0;
  font-size: 13px;
  cursor: pointer;
  ${props =>
    props.active &&
    css`
      color: white;
      background-color: #1890ff;
      &:hover {
        color: white;
      }
    `};
`

const SubMenu = styled.div`
  margin: 3px 0px 10px;
`

const navObj = yaml.safeLoad(`
- path: dashboard
  children:
  - name: 设置
    path: settings
    children:
    - name: 机构
      path: organizations
      children:
      - name: 机构
        path: ''
    - name: 人员管理
      path: people
      children:
      - name: 人员管理
        path: ''
`)

class DashboardLayout extends Component {
  render() {
    const { pathname } = this.props
    const _navs = this.props.navs

    const navs = generateNavs(_navs, pathname)

    const siders = _find(navs[0].children, { active: true })

    return (
      <Layout>
        <Nav>
          {navs[0].children.map((v, k) => (
            <NavItem
              key={k}
              active={v.active}
              href={v.fullpath}
              onClick={e => {
                e.preventDefault()
                navigate(v.fullpath)
              }}
            >
              {v.name}
            </NavItem>
          ))}
          <Gap />
          <NavItem>头像</NavItem>
        </Nav>
        <Container>
          <Sider>
            <LogoContainer>
              <Logo width={108} />
            </LogoContainer>

            {siders.children.map((v, k) => (
              <div key={k}>
                <MenuItem
                  href={v.fullpath}
                  onClick={e => {
                    e.preventDefault()
                    navigate(v.fullpath)
                  }}
                >
                  {v.name}
                </MenuItem>
                {v.children && (
                  <SubMenu>
                    {v.children.map((vv, kk) => (
                      <SubMenuItem
                        key={kk}
                        active={vv.active}
                        href={vv.fullpath}
                        onClick={e => {
                          e.preventDefault()
                          navigate(vv.fullpath)
                        }}
                      >
                        {vv.name}
                      </SubMenuItem>
                    ))}
                  </SubMenu>
                )}
              </div>
            ))}
          </Sider>

          <Content>{this.props.children}</Content>
        </Container>
      </Layout>
    )
  }
}

DashboardLayout.propTypes = {
  /**
   * 当前路径名
   */
  pathname: PropTypes.string,
  /**
   * 展示导航用的数据对象
   */
  navs: PropTypes.arrayOf(PropTypes.object)
}

DashboardLayout.defaultProps = {
  navs: navObj
}

export default DashboardLayout

export const LayoutWithLocation = p => (
  <Location>
    {props => (
      <DashboardLayout pathname={props.location.pathname} {...props} {...p} />
    )}
  </Location>
)
