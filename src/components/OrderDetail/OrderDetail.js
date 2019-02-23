import React, { PureComponent, Fragment } from 'react'
import moment from 'moment'
import {
  Input,
  DatePicker,
  Radio,
  Button,
  Popconfirm,
  Select,
  AutoComplete,
  Switch
} from 'antd'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _merge from 'lodash/merge'
import _toNumber from 'lodash/toNumber'
import _findIndex from 'lodash/findIndex'
import _sumBy from 'lodash/sumBy'

import './order-detail.css'

const Option = Select.Option
const { TextArea } = Input

const dateFormat = 'YYYY-MM-DD'
const unitData = ['副', '片']

class OrderDetail extends PureComponent {
  constructor(props) {
    super(props)

    this.state = OrderDetail.getDefaultState()
    this.isSaving = false
  }

  static productKey = 0

  static getDefaultProcutItem() {
    return { key: OrderDetail.productKey++, count: 1, discount: 10 }
  }

  static getDefaultState() {
    return {
      selectedOrder: {
        customer: {
          person: {}
        },
        prescription: {}
      },
      salesmen: [],
      salesman: {},
      dataSource: [OrderDetail.getDefaultProcutItem()],
      totalPrice: 0,
      discountedTotalPrice: 0,
      touchedTotalPrice: false,
      actualTotalPrice: 0, //实收价
      note: '',
      dataList: [],
      showTitle:'不可编辑',
      stateButton:false
    }
  }

  componentDidMount() {
    if (!_isEmpty(this.props.selectedOrder)) {
      const state = {
        selectedOrder: this.props.selectedOrder,
        salesmen: this.props.salesmen,
        salesman: this.props.selectedOrder.salesman
      }
      if (this.props.selectedOrder.temp_product_items) {
        state.dataSource = JSON.parse(
          this.props.selectedOrder.temp_product_items
        )
      }

      if (this.props.selectedOrder.total_price) {
        state.actualTotalPrice = _toNumber(this.props.selectedOrder.total_price)
        state.touchedTotalPrice = true
      }
      this.setState(state, () => {
        this.updateTotalPrice()
      })
    }
  }

  async componentDidUpdate(prevProps) {
    if (!_isEqual(this.props, prevProps)) {
      let selectedOrder = this.props.selectedOrder || {}
      selectedOrder = _merge(
        OrderDetail.getDefaultState().selectedOrder,
        selectedOrder
      )
      let orders = this.props.orders || []

      const state = {
        selectedOrder: selectedOrder,
        salesmen: this.props.salesmen,
        salesman: selectedOrder.salesman,
        orders: orders
      }

      if (this.props.selectedOrder.temp_product_items) {
        try {
          state.dataSource = JSON.parse(
            this.props.selectedOrder.temp_product_items
          )
        } catch (e) {
          window.Raven.captureException(e)
        }
      }
      if (this.props.selectedOrder.total_price) {
        state.actualTotalPrice = _toNumber(this.props.selectedOrder.total_price)
      } else {
        state.actualTotalPrice = 0
      }

      if(this.props.saveButton === 1){
        state.stateButton = false
      }

      await this.setState(state, () => {
        this.updateTotalPrice()
      })
    }
  }

  updatePrescription(key, value) {
    this.setState({
      selectedOrder: {
        ...this.state.selectedOrder,
        prescription: {
          ...this.state.selectedOrder.prescription,
          [key]: value
        }
      }
    })
  }
  updateTotalPrice() {
    const { dataSource, touchedTotalPrice } = this.state

    let filteredDataSource = dataSource
      .filter(v => v.count > 0 && v.unitPrice > 0)
      .map(v => ({
        ...v,
        totalPrice: _toNumber(v.totalPrice),
        discountedPrice: _toNumber(v.discountedPrice)
      }))

    if (filteredDataSource.length > 0) {
      const discountedTotalPrice = _sumBy(filteredDataSource, 'discountedPrice')
      const actualTotalPrice = touchedTotalPrice
        ? this.state.actualTotalPrice
        : discountedTotalPrice

      this.setState({
        totalPrice: _sumBy(filteredDataSource, 'totalPrice'),
        discountedTotalPrice,
        actualTotalPrice
      })
    } else {
      this.setState({
        totalPrice: 0,
        discountedTotalPrice: 0
      })

      if (!touchedTotalPrice) {
        this.setState({
          actualTotalPrice: 0
        })
      }
    }
  }

  updatePrice(current) {
    if (current.count && current.unitPrice) {
      current.totalPrice =
        _toNumber(current.count) * _toNumber(current.unitPrice)

      current.totalPrice = current.totalPrice.toFixed(2)
    } else {
      current.totalPrice = ''
    }

    if (current.totalPrice && current.discount) {
      current.discountedPrice =
        _toNumber(current.totalPrice) * _toNumber(current.discount) * 0.1

      current.discountedPrice = current.discountedPrice.toFixed(2)
    } else {
      current.discountedPrice = ''
    }

    this.updateTotalPrice()
  }

  getCurrentProdictItem(record) {
    const { dataSource } = this.state
    const index = _findIndex(dataSource, { key: record.key })

    return dataSource[index]
  }

  addProductItem(record) {
    const { dataSource } = this.state
    const index = _findIndex(dataSource, { key: record.key })
    dataSource.splice(index + 1, 0, OrderDetail.getDefaultProcutItem())

    this.setState({
      dataSource: dataSource.concat([])
    })
  }

  deleteProductItem(record) {
    const { dataSource } = this.state
    const index = _findIndex(dataSource, { key: record.key })
    dataSource.splice(index, 1)
    this.setState({
      dataSource: dataSource.concat([])
    })
  }

  render() {
    const { selectedOrder, dataSource, dataList } = this.state
    return (
      <div
        style={{
          flex: 1,
          padding: '12px',
          backgroundColor: '#F5F5F5',
          borderRadius: '8px',
          fontSize: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>姓名:</span>
              <span>
                <Input
                  style={{
                    marginLeft: '12px',
                    width: '120px',
                    fontSize: '12px'
                  }}
                  value={_get(selectedOrder, 'customer.person.name', '')}
                  onChange={e => {
                    const { selectedOrder } = this.state
                    _set(selectedOrder, 'customer.person.name', e.target.value)

                    this.setState({
                      selectedOrder: {
                        ...selectedOrder
                      }
                    })
                  }}
                />
              </span>
            </div>
            <div>
              <Radio.Group
                value={_get(selectedOrder, 'customer.person.sex', -1)}
                onChange={e => {
                  const { selectedOrder } = this.state

                  _set(selectedOrder, 'customer.person.sex', e.target.value)

                  this.setState({
                    selectedOrder: {
                      ...selectedOrder
                    }
                  })
                }}
              >
                <Radio.Button value={0}>男</Radio.Button>
                <Radio.Button value={1}>女</Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <span>购买日期:</span>
              <span>
                <DatePicker
                  style={{ marginLeft: '12px', fontSize: '12px' }}
                  disabled
                  value={
                    selectedOrder.created_at
                      ? moment(selectedOrder.created_at)
                      : moment()
                  }
                  format={dateFormat}
                />
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>电话:</span>
              <span>
                <Input
                  style={{ marginLeft: '12px', fontSize: '12px' }}
                  value={_get(selectedOrder, 'customer.person.mobile', '')}
                  onChange={e => {
                    const { selectedOrder } = this.state

                    _set(
                      selectedOrder,
                      'customer.person.mobile',
                      e.target.value
                    )

                    this.setState({
                      selectedOrder: {
                        ...selectedOrder
                      }
                    })
                  }}
                />
              </span>
            </div>
            <div>
              <span>年龄:</span>
              <span>
                <Input
                  style={{
                    marginLeft: '12px',
                    width: '40px',
                    fontSize: '12px'
                  }}
                  value={selectedOrder.age}
                  onChange={e => {
                    const { selectedOrder } = this.state
                    const age = e.target.value

                    const date = moment()
                      .subtract(age, 'years')
                      .format()

                    _set(selectedOrder, 'customer.person.birthday_infer', date)

                    this.setState({
                      selectedOrder: {
                        ...selectedOrder,
                        age
                      }
                    })
                  }}
                />
              </span>
            </div>
            <div>
              <span>职业:</span>
              <span>
                <Input
                  style={{
                    marginLeft: '12px',
                    width: '120px',
                    fontSize: '12px'
                  }}
                  value={_get(selectedOrder, 'customer.person.job', '')}
                  onChange={e => {
                    const { selectedOrder } = this.state

                    _set(selectedOrder, 'customer.person.job', e.target.value)

                    this.setState({
                      selectedOrder: {
                        ...selectedOrder
                      }
                    })
                  }}
                />
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>卡号:</span>
              <span>
                <Input
                  style={{ marginLeft: '12px', fontSize: '12px' }}
                  value={_get(selectedOrder, 'customer.member_card_number', '')}
                  onChange={e => {
                    const { selectedOrder } = this.state

                    _set(
                      selectedOrder,
                      'customer.member_card_number',
                      e.target.value
                    )

                    this.setState({
                      selectedOrder: {
                        ...selectedOrder
                      }
                    })
                  }}
                />
              </span>
            </div>

            <div>
              <span>生日:</span>
              <span style={{ marginRight: '12px' }}>
                <DatePicker
                  allowClear={false}
                  style={{ marginLeft: '10px', fontSize: '12px' }}
                  value={
                    _get(selectedOrder, 'customer.person.birthday', '')
                      ? moment(
                          _get(selectedOrder, 'customer.person.birthday', '')
                        )
                      : null
                  }
                  format={dateFormat}
                  onChange={(date, dateString) => {
                    const { selectedOrder } = this.state

                    if (!dateString) {
                      return
                    }

                    _set(
                      selectedOrder,
                      'customer.person.birthday',
                      date.toJSON()
                    )

                    delete selectedOrder.customer.person.birthday_infer

                    let age = moment().diff(date, 'years') + 1
                    this.setState({
                      selectedOrder: {
                        ...selectedOrder,
                        age: age
                      }
                    })
                  }}
                />
              </span>
              <span>
                <Button
                  shape="circle"
                  icon="close"
                  size="small"
                  style={{ color: '#CDCDCD' }}
                  onClick={() => {
                    this.setState({
                      selectedOrder: {
                        ...selectedOrder,
                        customer: {
                          ...selectedOrder.customer,
                          person: {
                            ...selectedOrder.customer.person,
                            birthday: ''
                          }
                        }
                      }
                    })
                  }}
                />
              </span>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#DEDEDE',
              marginTop: '15px'
            }}
          />
        </div>

        <div>
            { !this.props.showButton?(
              <div style={{marginTop:'15px',display:'flex',alignItems:'center'}}>
                <span>
                  <Switch checked={this.state.stateButton} onChange={async (checked)=>{
                    await this.setState({
                        stateButton: !this.state.stateButton,
                        selectedOrder:{
                          ...this.state.selectedOrder,
                          prescription:{
                            ...this.state.selectedOrder.prescription,
                            use_for: 0,
                            vertex_distance: 12
                          }
                        }
                      })
                      if(!this.state.stateButton){
                        this.setState({
                          selectedOrder:{
                            ...this.state.selectedOrder,
                            prescription:{}
                          }
                        })
                      }
                  }} />
                   </span>
                <span style={{marginLeft:'15px'}}>{this.state.stateButton?'含配镜处方':'无配镜处方'}</span>
              </div>
              ):null
            }
        </div>

        {
          this.state.stateButton || this.props.showButton?(
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '15px'
                }}
              >
                <div>
                  <Radio.Group
                    value={_get(selectedOrder,'prescription.use_for','')}
                    onChange={e =>
                      this.updatePrescription('use_for', e.target.value)
                    }
                  >
                    <Radio.Button value={0}>远用</Radio.Button>
                    <Radio.Button value={1}>近用</Radio.Button>
                  </Radio.Group>
                </div>
                <div>
                  <span style={{ marginRight: '12px' }}>配镜类型:</span>
                  <span>
                  <Radio.Group
                    value={_get(
                      selectedOrder,
                      'prescription.vertex_distance',
                      ''
                    )}
                    onChange={e =>
                      this.updatePrescription('vertex_distance', e.target.value)
                    }
                  >
                    <Radio.Button value={12}>12mm(框架)</Radio.Button>
                    <Radio.Button value={0}>0mm(隐形)</Radio.Button>
                  </Radio.Group>
                </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: '15px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <table width="100%" className="table-color">
                  <tbody>
                  <tr>
                    <td>
                      <div
                        style={{
                          padding: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>配镜</span>
                        <span>处方</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>镜球</span>
                        <span>SPH</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>柱镜</span>
                        <span>CYL</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '3px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>轴位</span>
                        <span>AX</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '3px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>瞳距</span>
                        <span>MM</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '3px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>瞳高</span>
                        <span>MM</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '3px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>下加光</span>
                        <span>Add</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          padding: '3px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>矫正</span>
                        <span>视力</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center' }}>右(R)</td>
                    <td style={{ textAlign: 'center' }}>
                      <Input
                        value={_get(selectedOrder, 'prescription.right_sphere', '')}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('right_sphere', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.right_cylinder',
                          ''
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('right_cylinder', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.right_cylinder_axis',
                          ''
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'right_cylinder_axis',
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.right_papillary_distance'
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'right_papillary_distance',
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                      />{' '}
                      {/*瞳高右*/}
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(selectedOrder, 'prescription.right_add', '')}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('right_add', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.right_corrected_vision',
                          ''
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'right_corrected_vision',
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>左(L)</td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(selectedOrder, 'prescription.left_sphere', '')}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('left_sphere', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.left_cylinder',
                          ''
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('left_cylinder', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.left_cylinder_axis',
                          ''
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'left_cylinder_axis',
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.left_papillary_distance'
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'left_papillary_distance',
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                      />{' '}
                      {/*、瞳高左*/}
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(selectedOrder, 'prescription.left_add', '')}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription('left_add', e.target.value)
                        }
                      />
                    </td>
                    <td style={{ padding: '5px 0', textAlign: 'center' }}>
                      <Input
                        value={_get(
                          selectedOrder,
                          'prescription.left_corrected_vision'
                        )}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          width: '60px',
                          padding: '2px',
                          fontSize: '12px'
                        }}
                        onChange={e =>
                          this.updatePrescription(
                            'left_corrected_vision',
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ):null
        }

        <div
          style={{ marginTop: '20px', width: '650px' }}
          className={dataSource.length > 3 ? 'show' : ''}
        >
          {this.state.dataSource.map((values, index, array) => {
            return (
              <table
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  width: '650px',
                  marginTop: '2px'
                }}
                key={index}
              >
                <tbody>
                  <tr>
                    <td
                      style={{ padding: '8px', textAlign: 'center' }}
                      colSpan={7}
                    >
                      <AutoComplete
                        value={values.name}
                        onChange={value => {
                          const current = this.getCurrentProdictItem(values)
                          current.name = value
                          this.setState({
                            dataSource: dataSource.concat([])
                          })
                        }}
                        placeholder="请输入名称"
                        dataSource={dataList}
                        style={{ fontSize: '12px', width: '100%' }}
                        filterOption={(inputValue, option) => {
                          //排序
                          return (
                            option.props.children.indexOf(inputValue) !== -1
                          )
                        }}
                        onSearch={value => {
                          this.setState({
                            dataList: !value
                              ? []
                              : [
                                  value,
                                  '1.553变色非球面 加硬加膜',
                                  '1.601变色非球面 加硬加膜',
                                  '1.553制定太阳镜片 加硬加膜',
                                  '1.601制定太阳镜片 加硬加膜',
                                  '1.553双抗UV400抗蓝光 加硬加膜',
                                  '1.553抗蓝光防疲劳镜片 加硬加膜',
                                  '1.601抗蓝光防疲劳镜片 加硬加膜',
                                  '1.553青少年渐进非球面片 加硬加膜',
                                  '1.601青少年渐进非球面片 加硬加膜',
                                  '1.553超硬非球面环焦片 加硬加膜',
                                  '1.553非球面 绿膜',
                                  '1.553非球面 黄金膜',
                                  '1.553非球面 黄绿碧晶膜',
                                  '1.601非球面超薄 加硬加膜',
                                  '1.67非球面 加硬加膜',
                                  '1.74非球面 超发水膜',
                                  '1.499树脂片 加硬加膜',
                                  '1.553树脂片 加硬加膜',
                                  '1.553加硬加膜(绿膜) 加硬加膜',
                                  '1.553加硬加膜(蓝膜) 加硬加膜'
                                ]
                          })
                        }}
                      >
                        <Input value={values.name} disabled />
                      </AutoComplete>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div
                        style={{
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 5px'
                        }}
                      >
                        <span>数量:</span>
                        <span>
                          <Input
                            value={values.count + ''}
                            onChange={e => {
                              const current = this.getCurrentProdictItem(values) //改
                              current.count = _toNumber(e.target.value)
                              this.updatePrice(current)
                              this.setState({
                                dataSource: dataSource.concat([])
                              })
                            }}
                            style={{
                              width: '40px',
                              marginLeft: '5px',
                              padding: '2px',
                              fontSize: '12px'
                            }}
                            type="number"
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        <span>单位:</span>
                        <span>
                          <Select
                            style={{ width: '55px', marginLeft: '5px' }}
                            defaultValue={unitData[0]}
                            onChange={value => {
                              const current = this.getCurrentProdictItem(values) //改
                              current.unit = value

                              this.setState({
                                dataSource: dataSource.concat([])
                              })
                            }}
                          >
                            {unitData.map(unit => (
                              <Option key={unit}>{unit}</Option>
                            ))}
                          </Select>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        <span>单价:</span>
                        <span>
                          <Input
                            value={values.unitPrice + ''}
                            onChange={e => {
                              const current = this.getCurrentProdictItem(values)
                              current.unitPrice = _toNumber(e.target.value)

                              if (current.unitPrice < 0) {
                                current.unitPrice = 0
                              }

                              this.updatePrice(current)

                              this.setState({
                                dataSource: dataSource.concat([])
                              })
                            }}
                            style={{
                              width: '55px',
                              marginLeft: '5px',
                              padding: '2px',
                              fontSize: '12px'
                            }}
                            type="number"
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        <span>总价:</span>
                        <span>
                          <Input
                            style={{
                              width: '55px',
                              marginLeft: '5px',
                              padding: '2px',
                              fontSize: '12px'
                            }}
                            value={values.totalPrice}
                            disabled
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        <span>折扣:</span>
                        <span>
                          <Input
                            value={values.discount + ''}
                            onChange={e => {
                              const current = this.getCurrentProdictItem(values)
                              current.discount = _toNumber(e.target.value)

                              if (current.discount > 10) {
                                current.discount = 10
                              }

                              this.updatePrice(current)

                              this.setState({
                                dataSource: dataSource.concat([])
                              })
                            }}
                            style={{
                              width: '40px',
                              marginLeft: '8px',
                              padding: '2px',
                              fontSize: '12px'
                            }}
                            type="number"
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '110px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        <span>折扣后:</span>
                        <span>
                          <Input
                            value={values.discountedPrice}
                            style={{
                              width: '60px',
                              marginLeft: '8px',
                              padding: '2px',
                              fontSize: '12px'
                            }}
                            disabled
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '30px',
                          padding: '0 0 5px 0px'
                        }}
                      >
                        {dataSource.length >= 1 ? (
                          <Fragment>
                            <a
                              href=""
                              style={{ marginRight: '12px' }}
                              onClick={e => {
                                e.preventDefault()
                                this.addProductItem(values)
                              }}
                            >
                              添加
                            </a>
                            <br />
                            <Popconfirm
                              title="是否删除?"
                              onConfirm={e => {
                                this.deleteProductItem(values)
                                this.updateTotalPrice()
                              }}
                            >
                              {dataSource.length !== 1 ? (
                                <a href="">删除</a>
                              ) : null}
                            </Popconfirm>
                          </Fragment>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '15px',
            alignItems: 'flex-end'
          }}
        >
          <div>
            <span>原总价:</span>
            <span>
              <Input
                style={{ width: '80px', marginLeft: '12px' }}
                disabled
                value={this.state.totalPrice}
              />
            </span>
          </div>
          <div>
            <span>折扣后:</span>
            <span>
              <Input
                style={{ width: '80px', marginLeft: '12px' }}
                disabled
                value={this.state.discountedTotalPrice}
              />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>实收:</span>
            <span>
              <Input
                type="number"
                style={{
                  width: '120px',
                  marginLeft: '12px',
                  height: '40px',
                  fontSize: 20
                }}
                value={this.state.actualTotalPrice + ''}
                onChange={e => {
                  this.setState({
                    actualTotalPrice: _toNumber(e.target.value),
                    touchedTotalPrice: true
                  })
                }}
              />
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '15px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>备注:</div>
            <div>
              <TextArea
                rows={2}
                style={{
                  resize: 'none',
                  width: '395px',
                  marginLeft: '25px'
                }}
                value={selectedOrder.note || ''}
                onChange={e =>
                  this.setState({
                    selectedOrder: {
                      ...selectedOrder,
                      note: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>
          <div>
            {this.props.show ? (
              <Button
                type="primary"
                onClick={() => {
                  if (!this.isSaving) {
                    this.isSaving = true
                    this.props
                      .onClickSave(this.state)
                      .then(() => {
                        this.isSaving = false
                        this.setState({
                          stateButton: false,
                          touchedTotalPrice: false,
                          dataSource: [OrderDetail.getDefaultProcutItem()],
                          dataList:[]
                        })
                      })
                      .catch(() => (this.isSaving = false))
                  }
                }}
              >
                保存
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  this.props.bindClick()
                  this.props.bindShow()
                }}
              >
                再次购买
              </Button>
            )}
          </div>
          <div>
            {this.props.show ? (
              <Button
                onClick={() =>
                  this.setState({
                    ...OrderDetail.getDefaultState()
                    /*salesmen: this.props.salesmen*/
                  })
                }
              >
                清空
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default OrderDetail
