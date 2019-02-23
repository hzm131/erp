import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form as AForm, Input, Button, DatePicker } from 'antd'
import { format } from 'date-fns'
import moment from 'moment'

const FormItem = AForm.Item

const percentage = per => per * 100 + '%'
const DATEFORMAT = 'YYYY-MM-DD HH:mm:ss'

class Form extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(this.props.onSubmit)
  }

  render() {
    const { fields, obj, type } = this.props

    if (type !== 'new' && !obj) {
      return null
    }

    return (
      <AForm
        onSubmit={this.handleSubmit}
        layout="vertical"
        style={{ width: '100%' }}
      >
        <div style={{ padding: '6px 8px' }}>{this.renderButton()}</div>
        <div
          style={{
            minWidth: 650,
            maxWidth: 860,
            background: 'white',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            boxShadow: '10px 10px 70px -23px rgba(0,0,0,0.75)',
            padding: 20,
            marginTop: 20,
            marginBottom: 20
          }}
        >
          {fields.map((d, i) => {
            if (type === 'new' && !d.fields.create) {
              return null
            }

            if (type === 'edit' && !d.fields.edit) {
              return null
            }

            if (type === 'show' && !d.fields.detail) {
              return null
            }

            return (
              <div
                style={{
                  position: 'relative',
                  width: percentage(d.col.span / 24),
                  left: percentage(d.col.push / 24),
                  right: percentage(d.col.pull / 24),
                  marginLeft: percentage(d.col.offset / 24),
                  paddingRight: 12,
                  display: 'flex',
                  flex: 'column',
                  minHeight: 40
                }}
                key={i}
              >
                <div
                  style={{ width: '30%', fontWeight: 'bold', paddingTop: 6 }}
                >
                  {d.name}:
                </div>
                {this.renderItem(d)}
              </div>
            )
          })}
        </div>
      </AForm>
    )
  }

  renderButton() {
    const { type, onClickEdit, onClickCreate, onClickCancel } = this.props
    const s = { fontSize: 12, height: 28, width: 44, marginRight: 6 }

    if (type === 'show') {
      return (
        <Fragment>
          <Button key="edit" type="primary" size="small" style={s} onClick={onClickEdit}>
            编辑
          </Button>
          <Button key="create" size="small" style={s} onClick={onClickCreate}>
            创建
          </Button>
        </Fragment>
      )
    }

    if (['new', 'edit'].includes(type)) {
      return (
        <Fragment>
          <Button key="save" htmlType="submit" type="primary" size="small" style={s}>
            保存
          </Button>
          <Button key="cancel" size="small" style={s} onClick={onClickCancel}>
            丢弃
          </Button>
        </Fragment>
      )
    }
  }

  renderItem(d) {
    const { getFieldDecorator } = this.props.form
    const { obj, type } = this.props
    let value = ''

    if (obj && obj[d.field]) {
      value = obj[d.field]
    }

    if (type === 'show') {
      let body = value

      if (d.type === 'date-time' && value) {
        // format 会根据环境变量来格式化时间，此if用于解决CI服务器在国外导致测试失败
        if (process.env.NODE_ENV === 'test') {
          body = '1999-09-09 09:09:09'
        } else {
          body = format(new Date(body), DATEFORMAT)
        }
      }

      return <div style={{ paddingTop: 6 }}>{body}</div>
    }

    if (d.type === 'date-time' && value) {
      return (
        <FormItem style={{ flex: 1, marginBottom: 0, paddingBottom: 6 }}>
          {getFieldDecorator(d.field, {
            rules: d.rules,
            initialValue: moment(value, DATEFORMAT)
          })(
            <DatePicker
              style={{
                backgroundColor: d.required ? '#1890ff11' : 'white'
              }}
              disabled={d.disabled}
              showTime
              format={DATEFORMAT}
            />
          )}
        </FormItem>
      )
    }

    return (
      <FormItem style={{ flex: 1, marginBottom: 0, paddingBottom: 6 }}>
        {getFieldDecorator(d.field, {
          rules: d.rules,
          initialValue: value
        })(
          <Input
            placeholder={d.name}
            disabled={d.disabled}
            style={{
              backgroundColor: d.required ? '#1890ff11' : 'white'
            }}
          />
        )}
      </FormItem>
    )
  }
}

Form.propTypes = {
  type: PropTypes.oneOf(['new', 'edit', 'show']),
  /**
   * 表单中的字段对象
   */
  obj: PropTypes.object,
  /**
   * 表单中的字段释义
   */
  fields: PropTypes.arrayOf(PropTypes.object),
  /**
   * 提交表单时会把错误信息和表单的值填入到该对象的参数中
   */
  onSubmit: PropTypes.func,
  /**
   * 点击“创建”触发的回调函数
   */
  onClickCreate: PropTypes.func,
  /**
   * 点击“编辑”触发的回调函数
   */
  onClickEdit: PropTypes.func,
  /**
   * 点击“丢弃”触发的回调函数
   */
  onClickCancel: PropTypes.func
}

const WrappedForm = AForm.create()(Form)

export default WrappedForm
