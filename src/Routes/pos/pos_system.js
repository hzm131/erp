import React from 'react'
import moment from 'moment'
import { Link } from '@reach/router'
import swal from 'sweetalert'
import {
  Input,
  Table,
  Button,
  message,
  Icon,
  Modal,
} from 'antd'
import api from 'services/api'
import querystring from 'querystring'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import './pos-system.css'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _pickBy from 'lodash/pickBy'
import OrderDetail from 'components/OrderDetail/OrderDetail'

const dateFormat = 'YYYY-MM-DD'

const searchAPIDebounced = AwesomeDebouncePromise(url => api.get(url), 500)

class PosSystem extends React.Component {
  state = {
    modalVisible: false,
    valueInput: '',
    tableColor: null, //右边table点击列后的颜色
    orders: [], //表单中保存的数据
    selectedOrder: {},
    salesmen: [],
    salesman: '',
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    loading: false,
    onceAgain: {},
    show: true,
    showButton:true, // 填写按钮是否可见的状态
    saveButton:0
  }

  async getOrders() {
    const { pageSize, pageIndex, valueInput } = this.state
    const condition = valueInput
    this.setState({
      loading: true
    })

    const q = {
      limit: pageSize,
      offset: pageSize * (pageIndex - 1),
      withRelated:
        'customer.person,prescription.optometrist.person,salesman.person'
    }

    if (condition) {
      q.where_name_or_abbreviation_mobile_or_member_card_number_like = condition
    }

    const searchRes = await searchAPIDebounced(
      `/v1/orders?${querystring.stringify(q)}`
    )

    this.setState({
      loading: false
    })

    const orders = searchRes.data.rows.map(v => {
      let age
      let birthday = _get(v, 'customer.person.birthday', '')
      if (!birthday) {
        birthday = _get(v, 'customer.person.birthday_infer', '')
      }

      age = moment().diff(birthday, 'years') + 1

      if (!birthday) {
        age = ''
      }

      return {
        ...v,
        age
      }
    })

    this.setState({
      orders,
      count: searchRes.data.count
    })
  }

  async getSalesmen() {
    const res = await api.get(
      '/v1/salesmen?limit=20&offset=0&withRelated=person'
    )

    this.setState({
      salesmen: res.data.rows
    })
  }

  async componentWillMount() {
    await Promise.all([this.getOrders(), this.getSalesmen()])
  }

  emitEmpty() {
    this.setState(
      {
        valueInput: '',
        onceAgain: {},
      },
      () => {
        this.getOrders()
      }
    )
  }

  sonShow = () => {
    let object = _pickBy(this.state.selectedOrder, (value, key) => {
      if (value == null) {
        return false
      }
      if(key === 'temp_product_items'){
        return false
      }
      if(key === 'total_price'){
        return false
      }
      if(key === 'prescription'){
        return false
      }
      if(key === 'prescription_id'){
        return false
      }
      return true
    })
    this.setState({
      modalVisible: false,
      onceAgain: object,
      show: true,
    })
  }

  render() {
    const {
      selectedOrder,
      salesmen,
      valueInput,
      modalVisible,
      onceAgain,
      show,
      showButton,
    } = this.state

    const suffix = valueInput ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty()} />
    ) : null

    return (
      <div
        style={{
          width: '1200px',
          margin: '30px auto',
          boxShadow: '0 0 5px #888',
          padding: '18px',
          borderRadius: '15px',
          fontSize: '12px'
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              boxSize: 'border-box',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}
            >
              <span>姓名/卡号/电话:</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  onChange={e =>
                    this.setState(
                      { valueInput: e.target.value, pageIndex: 1 },
                      () => this.getOrders()
                    )
                  }
                  placeholder="请输入姓名/卡号/电话"
                  style={{ marginLeft: '12px', width: '300px' }}
                  suffix={suffix}
                  value={valueInput}
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />
                <Button
                  type="primary"
                  icon="search"
                  style={{ marginLeft: '5px' }}
                />
              </span>
            </div>
            <div>
              <Button type="primary">
                <Link to={'/old_pos_system'}>查询老系统数据</Link>
              </Button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: '15px' }}>
          <div style={{ width: '500px', marginRight: '10px' }}>
            <Table
              key={this.state.valueInput}
              className="pos-system-left-table"
              rowKey="id"
              columns={[
                {
                  title: '时间',
                  dataIndex: 'created_at',
                  render: v => {
                    return moment(v).format(dateFormat)
                  }
                },
                {
                  title: '姓名',
                  dataIndex: 'customer.person.name'
                },
                {
                  title: '年龄',
                  dataIndex: 'age'
                },
                {
                  title: '电话',
                  dataIndex: 'customer.person.mobile'
                },
                {
                  title: '卡号',
                  dataIndex: 'customer.member_card_number'
                }
              ]}
              dataSource={this.state.orders}
              rowClassName={record =>
                record.id === this.state.selectedOrder.id ? 'clickStyle' : ''
              }
              onRow={record => {
                return {
                  onClick: () => {
                    this.setState({
                      selectedOrder: record,
                      modalVisible: true,
                    })
                  }
                }
              }}
              pagination={{
                showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`,
                pageSize: this.state.pageSize,
                defaultCurrent: this.state.pageIndex,
                total: this.state.count,
                onChange: (pageIndex, pageSize) => {
                  this.setState({ pageIndex, pageSize }, () => {
                    this.getOrders()
                  })
                }
              }}
              loading={this.state.loading}
            />
          </div>

          <OrderDetail
            saveButton={this.state.saveButton}
            selectedOrder={onceAgain} //初始化时这里是空  点击左侧表时不点击再次购买按钮 取消  这里会传入{}, 假如右侧填写了数据  由于传入了{} 右侧数据就没了
            salesmen={salesmen}
            show={show}
            onClickSave={async obj => {
              let personId = _get(obj, 'selectedOrder.customer.person_id', undefined)
              let customerId = _get(obj, 'selectedOrder.customer_id', undefined)
              let prescriptionId = _get(obj, 'selectedOrder.prescription_id', undefined)
              let totalPrice = _get(obj, 'actualTotalPrice', 0) // todo 总价不能为0
              let member_card_number = _get(
                obj,
                'selectedOrder.customer.member_card_number',
                ''
              )

              if (!member_card_number) {
                member_card_number = undefined
              }

              if (totalPrice === 0) {
                message.error('实收不能为0')
                return
              }

              if(!personId){ //不在personId时创建 存在时直接用
                if (!_isEmpty(_get(obj, 'selectedOrder.customer.person', {}))) {
                  let preson = _get(obj, 'selectedOrder.customer.person', {})
                  let object = _pickBy(preson, (value, key) => {
                    if (
                      value !== null &&
                      key !== 'id' &&
                      key !== 'updated_at' &&
                      key !== 'created_at'
                    ) {
                      return key
                    }
                  })
                  const peopleRes = await api.post('/v1/people', object)
                  personId = peopleRes.data.id
                }
              }

              if(!customerId){ //不存在customerId创建
                const customerRes = await api.post('/v1/customers', {
                  member_card_number,
                  person_id: personId
                })
                customerId = customerRes.data.id
              }


              const prescriptionObj = _get(
                obj,
                'selectedOrder.prescription',
                {}
              )
              let objectPrescription = _pickBy(prescriptionObj, (value, key) => {
                if (
                  value !== null &&
                  key !== 'id' &&
                  key !== 'updated_at' &&
                  key !== 'created_at'
                ) {
                  return key
                }
              })

             if(!_isEmpty(objectPrescription)){
               const prescriptionRes = await api.post(
                 '/v1/prescriptions',
                 normalizePrescription(objectPrescription)
               )
               prescriptionId = prescriptionRes.data.id
             }



              await api.post('/v1/orders', {
                customer_id: customerId,
                prescription_id: prescriptionId,
                total_price: totalPrice,
                note: obj.note || undefined,
                temp_product_items: JSON.stringify(obj.dataSource)
              })

              await swal({
                title: '保存成功',
                icon: 'success',
                button: '确定'
              })

              return this.emitEmpty()
            }}
          />

          <Modal
            title="订单详情"
            visible={this.state.modalVisible}
            onCancel={() =>
              this.setState({
                modalVisible: false,
                saveButton:0  //  当模态框弹不点再次购买按钮直接取消 那个组件中的按钮状态不变
              })
            }
            onOk={() =>
              this.setState({
                modalVisible: false,
                saveButton:0
              })
            }
            footer={null}
            width={720}
          >
            <OrderDetail
              showButton={showButton} //传入时 不显示按钮
              selectedOrder={selectedOrder}
              modalVisible={modalVisible}
              salesmen={salesmen}
              bindClick={this.sonShow.bind(this)}
              bindShow={e =>{  //点击再次购买按钮saveButton变为1后，再在OrderDetail右那个组件中判断传入的是1就将按钮设为false
                this.setState({
                  saveButton: 1
                })
              }}
            />
          </Modal>
        </div>
      </div>
    )
  }
}

export default PosSystem

function normalizePrescription(prescriptionObj) {
  if (prescriptionObj.right_sphere === '') {
    delete prescriptionObj.right_sphere
  }

  if (prescriptionObj.left_sphere === '') {
    delete prescriptionObj.left_sphere
  }

  if (prescriptionObj.right_cylinder === '') {
    delete prescriptionObj.right_cylinder
  }

  if (prescriptionObj.left_cylinder === '') {
    delete prescriptionObj.left_cylinder
  }

  if (prescriptionObj.right_cylinder_axis === '') {
    delete prescriptionObj.right_cylinder_axis
  }

  if (prescriptionObj.left_cylinder_axis === '') {
    delete prescriptionObj.left_cylinder_axis
  }

  if (prescriptionObj.right_corrected_vision === '') {
    delete prescriptionObj.right_corrected_vision
  }

  if (prescriptionObj.left_corrected_vision === '') {
    delete prescriptionObj.left_corrected_vision
  }

  if (prescriptionObj.right_papillary_distance === '') {
    delete prescriptionObj.right_papillary_distance
  }

  if (prescriptionObj.left_papillary_distance === '') {
    delete prescriptionObj.left_papillary_distance
  }

  if (prescriptionObj.right_add === '') {
    delete prescriptionObj.right_add
  }

  if (prescriptionObj.left_add === '') {
    delete prescriptionObj.left_add
  }

  if (prescriptionObj.right_prism === '') {
    delete prescriptionObj.right_prism
  }

  if (prescriptionObj.right_prism_base === '') {
    delete prescriptionObj.right_prism_base
  }

  if (prescriptionObj.left_prism === '') {
    delete prescriptionObj.left_prism
  }

  if (prescriptionObj.left_prism_base === '') {
    delete prescriptionObj.left_prism_base
  }

  return prescriptionObj
}
