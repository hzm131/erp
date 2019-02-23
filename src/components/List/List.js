import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Table } from 'antd'
import format from 'date-fns/format'

//const rowSelection = {
//onChange: (selectedRowKeys, selectedRows) => {
//console.log(
//`selectedRowKeys: ${selectedRowKeys}`,
//'selectedRows: ',
//selectedRows
//)
//},
//getCheckboxProps: record => ({
//disabled: false,
//name: record.name
//})
//}

class List extends PureComponent {
  getRows() {
    const { rows } = this.props

    return rows.map(d => {
      d.key = d.id
      return d
    })
  }

  getFields() {
    const { fields } = this.props

    return fields.filter(v => v.fields.list).map(v => {
      return {
        title: v.name,
        dataIndex: v.field,
        render: vv => {
          if (v.type === 'date-time') {
            if (process.env.NODE_ENV === 'test') {
              return '1999-09-09 09:09:09'
            }

            return format(vv, 'YYYY-MM-DD HH:mm:ss')
          }
          return vv
        }
      }
    })
  }

  render() {
    const { pagination, onClickCreate, onClickRow, loading } = this.props

    return (
      <Fragment>
        <Button
          type="primary"
          size="small"
          style={{
            fontSize: 12,
            height: 28,
            width: 44,
            margin: '6px 8px'
          }}
          onClick={onClickCreate}
        >
          创建
        </Button>
        <div>
          <Table
            onRow={record => {
              return {
                onClick: () => onClickRow(record)
              }
            }}
            className="styled-table"
            //rowSelection={rowSelection}
            columns={this.getFields()}
            bordered
            dataSource={this.getRows()}
            size="small"
            pagination={{
              showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`,
              pageSize: 25,
              ...pagination
            }}
            loading={loading}
          />
        </div>
      </Fragment>
    )
  }
}

List.propTypes = {
  /**
   * 数据对象 默认以id为key 所以字段不能以key做field
   */
  rows: PropTypes.arrayOf(PropTypes.object),
  /**
   * 数据字段的定义
   */
  fields: PropTypes.arrayOf(PropTypes.object),
  /**
   * 点新建时调用的回调
   */
  onClickCreate: PropTypes.func,
  /**
   * 点击每行时触发的函数，第一个参数为当前行的记录
   */
  onClickRow: PropTypes.func,
  /**
   * pagigation 的配置项
   */
  pagination: PropTypes.object,
  /**
   * 是否正在加载数据
   */
  loading: PropTypes.bool
}

List.defaultProps = {
  loading: false
}

export default List
