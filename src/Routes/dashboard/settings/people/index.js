import React, { PureComponent } from 'react'

import { LayoutWithLocation as Layout } from 'components/Layout/Layout'
import { Table } from 'antd'

import api from 'services/api'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at'
  }
]

export default class People extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: [], //包存传回来的rows数组中的数据
      pageSize: 25, //每页要展示的数据条数
      count: 0 //保存全部数据数量
    }
  }

  componentDidMount() {
    this.getListData(1) //页面初始化的时候执行（这个方法会在组件加载完毕之后立即执行。在这个时候之后组件已经生成了对应的DOM结构）
  }

  async getListData(pageIndex) {
    const { pageSize } = this.state //pageSize 25

    const result = await api.get('/v1/people', {
      //发起数据请求 传递参数
      params: {
        limit: pageSize, //当前页的数量 当前位置
        offset: (pageIndex - 1) * 20 //偏移量 也就是第一页的数据
      }
    })
    this.setState({
      dataSource: result.data.rows, //data是对象 第二项是个数组，当前页里面有pageSize条数据
      count: result.data.count //第一项是count表示全部数据数量
    })
  }

  render() {
    const { dataSource, count, pageSize } = this.state

    return (
      <Layout>
        <div>搜索</div>
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
            showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`, //用于显示数据总量和当前数据顺序
            pageSize: pageSize, //每页的条数
            total: count //共多少条数据
          }}
          onChange={({ current }) => {
            //分页、排序、筛选变化时触发
            this.getListData(current) //执行getListData，传入current 当前的页数
          }}
          // loading={loading}
          dataSource={dataSource}
          columns={columns}
        />
      </Layout>
    )
  }
}
