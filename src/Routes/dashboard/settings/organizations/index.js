import React, { PureComponent } from 'react'

import { LayoutWithLocation as Layout } from 'components/Layout/Layout'

import api from 'services/api'

import { Table } from 'antd'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '公司全名',
    dataIndex: 'name'
  },
  {
    title: '公司简称',
    dataIndex: 'abbreviation'
  },
  {
    title: '公司电话',
    dataIndex: 'phone_number'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at'
  }
]

export default class Organizations extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      pageSize: 25,
      count: 0
    }
  }

  componentDidMount() {
    this.getListData(1)
  }

  async getListData(pageIndex) {
    const { pageSize } = this.state
    const result = await api.get('/v1/organizations', {
      params: {
        limit: pageSize,
        offset: (pageIndex - 1) * 20
      }
    })

    this.setState({
      dataSource: result.data.rows,
      count: result.data.count
    })
  }

  render() {
    const { dataSource, count, pageSize } = this.state

    return (
      <Layout>
        <Table
          // onRow={record => {
          //   return {
          //     onClick: () => onClickRow(record)
          //   }
          // }}
          className="styled-table"
          bordered
          rowKey="id"
          size="small"
          pagination={{
            showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`,
            pageSize: pageSize,
            total: count
          }}
          onChange={({ current }) => {
            this.getListData(current)
          }}
          // loading={loading}
          dataSource={dataSource}
          columns={columns}
        />
      </Layout>
    )
  }
}
