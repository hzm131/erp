import React from 'react'
import bgsvg from './bg.svg'
import styled from 'styled-components'
import { navigate } from '@reach/router'

import { Form, Icon, Input, Button, message } from 'antd'

import LogoWithName from 'components/LogoWithName/LogoWithName'

import api from 'services/api'

const Bg = styled.div`
  background-image: url(${bgsvg});
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%
  background-color: #f0f2f5;
  width: 100%;
  height: 100%;
`

const Content = styled.div`
  padding: 112px 0 24px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Top = styled.div`
  text-align: center;
`

const LogoContainer = styled.div`
  width: 264px;
`

const LoginBox = styled.div`
  width: 368px;
`

const FormItem = Form.Item

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      try {
        await api.login({
          username: values.username,
          password: values.password
        })
      } catch (e) {
        return message.error(e.message)
      }

      navigate('/pos')
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div style={{ height: 80 }} />
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入您的手机号'
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号为11位数字'
              }
            ]
          })(
            <Input
              prefix={
                <Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              placeholder="手机号"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入您的密码' },
              { pattern: /^.{6,16}$/, message: '密码长度为6至16位' }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

export default () => (
  <Bg>
    <Content>
      <Top>
        <LogoContainer>
          <LogoWithName />
        </LogoContainer>
      </Top>

      <LoginBox>
        <WrappedNormalLoginForm />
      </LoginBox>
    </Content>
  </Bg>
)
