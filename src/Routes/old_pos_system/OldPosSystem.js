import React from 'react'
import moment from 'moment'
import { Input, DatePicker, Radio, Table } from 'antd'
import api from 'services/api'
import querystring from 'querystring'
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import './old-pos-system.css'

const { TextArea } = Input
const RadioGroup = Radio.Group

const dateFormat = 'YYYY/MM/DD'
const date = new Date()
const str = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()


const columns = [
  {
    title: '编号',
    dataIndex: 'lsh',
    key:'lsh',
    sorter:(a,b) => a.lsh - b.lsh
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key:'name'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key:'sex'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key:'age'
  },
  {
    title: '电话',
    dataIndex: 'telephone',
    key:'telephone'
  },
  {
    title: '配镜日期',
    dataIndex: 'pjrq',
    key:'pjrq'
  },
  {
    title: '卡号',
    dataIndex: 'n5',
    key:'n5'
  }
]

const searchAPIDebounced = AwesomeDebouncePromise(url=> api.get(url), 500)

class OldPosSystem extends React.Component {
  state = {
    rowId:null,
    tableValue: '', //保存name输入框的值
    numberValue: 1, //保存电话/卡号
    dataSource: [
      {
        //初始化表单
        lsh: '',
        name: '',
        sex: '',
        age: '',
        telephone: '',
        pjrq: '',
        n5: ''
      }
    ],
    row: [], //存放表格中的总数据
    rows:{
        lsh: '',
        bm: '',
        kh: '',
        name: '',
        bz: '',
        pjrq: '',
        jjmc: '',
        jpmc: '',
        jjjg: '',
        jpjg: '',
        sjjg: '',
        age: '',
        sex: '',
        telephone: '',
        zhiye: '',
        job: '',
        address: '',
        yyyqiujing: '',
        yyzqiujing: '',
        yyyzhujing: '',
        yyzzhujing: '',
        yyyzhouwei: '',
        yyzzhouwei: '',
        yytongju: '',
        yyyshiju: '',
        yyzshiju: '',
        yyyjiaozheng: '',
        yyzjiaozheng: '',
        jyyqiujing: '',
        jyzqiujing: '',
        jyyzhujing: '',
        jyzzhujing: '',
        jyyzhouwei: '',
        jyzzhouwei: '',
        jytongju: '',
        jyytongju: '',
        jyyshiju: '',
        jyzshiju: '',
        jyyjiaozheng: '',
        jyzjiaozheng: '',
        yxyqiujing: '',
        yxzqiujing: '',
        yxyzhujing: '',
        yxzzhujing: '',
        yxyzhouwei: '',
        yxzzhouwei: '',
        yxtongju: '',
        yxyshiju: '',
        yxzshiju: '',
        yxyjiaozheng: '',
        yxzjiaozheng: '',
        n1: '',
        n2: '',
        n3: '',
        n4: '',
        n5: ' ',
        n6: '',
        n7: ' ',
        pjlx: '',
        jyyy: '',
        jjcl: '',
        jjxh: '',
        jjys: '',
        zsls: '',
        mc: '',
        note1: '',
        bh: '',
        sky: '',
        duanxin: '',
        yzzqiujing: '',
        yzyzhujing: '',
        created_at:'',
        updated_at:''
      },
  }

  async fetchList(condition, start, end){
    const q = {
      limit: 100,
      offset: 0
    }

    if(condition){
      q.where_name_or_n5_or_telephone_like = condition
    }
    const a = await searchAPIDebounced(`/v1/before_pos_data?${querystring.stringify(q)}`)

    this.setState({
      row: a.data.rows
    })
  }

  async componentWillMount() {
    await this.fetchList('')
  }

  setClassName = (record) => {
    return record.id === this.state.rowId ? 'clickStyle' : ''
  }

  bindChange = async (e) => {
    const str = e.target.value
    if(str.length !== 0 ){
      await this.fetchList(str)
    }else{
      await this.fetchList('')
    }
  }
  render() {

    return (
      <div
        style={{
          width: '1200px',
          margin: '50px auto',
          boxShadow:'0 0 5px #888',
          padding: '18px',
          borderRadius: '15px'
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              boxSize: 'border-box',
              justifyContent: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10}}>
              <span>姓名/卡号/电话:</span>
              <span>
                <Input
                  onChange={this.bindChange}
                  placeholder="请输入姓名/卡号/电话"
                  style={{ marginLeft: '12px' }}
                />
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: '30px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <Table
              className="old-pos-system-left-table"
              rowKey={'lsh'}
              columns={columns}
              dataSource={this.state.row}
              rowClassName={this.setClassName}
              onRow={(record)=>{
                return{
                  onClick:()=>{
                    this.setState({
                      rows: record
                    })
                    this.setState({ //点击后的背景色
                      rowId: record.id
                    })
                  }
                }
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex' }}>
                <span>姓名</span>
                <span
                  style={{
                    borderBottom: '1px solid',
                    marginLeft: '10px',
                    width: '60px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}
                >
                  {this.state.rows.name}
                </span>
              </div>
              <div>
                <RadioGroup
                  value={this.state.rows.sex}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Radio value={'男'}>男</Radio>
                  <Radio value={'女'}>女</Radio>
                </RadioGroup>
              </div>
              <div style={{ display: 'flex' }}>
                <span>年龄</span>
                <span
                  style={{
                    borderBottom: '1px solid',
                    marginLeft: '10px',
                    width: '20px',
                    textAlign: 'center'
                  }}
                >
                  {this.state.rows.age}
                </span>
              </div>
              <div style={{ display: 'flex' }}>
                <span>电话</span>
                <span
                  style={{
                    borderBottom: '1px solid',
                    marginLeft: '10px',
                    width: '100px',
                    textAlign: 'center',
                    boxSize: 'border-box',
                    fontSiz: '10px'
                  }}
                >
                  {this.state.rows.telephone}
                </span>
              </div>
              <div style={{ display: 'flex' }}>
                <span>职业</span>
                <span
                  style={{
                    borderBottom: '1px solid',
                    marginLeft: '10px',
                    width: '90px',
                    textAlign: 'center'
                  }}
                >
                  {this.state.rows.zhiye}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                alignItems: 'center'
              }}
            >
              <div style={{ marginLeft: '15px' }}>
                <RadioGroup value={this.state.rows.jyyy}>
                  <Radio value={'近用'}>近用</Radio>
                  <Radio value={'远用'}>远用</Radio>
                </RadioGroup>
              </div>
              <div style={{ marginRight: '15px' }}>
                <span style={{ marginRight: '10px' }}>配镜类型</span>
                <span>
                  <Input value={this.state.rows.pjlx} style={{width:'100px'}}/>
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <table border="1px" width="94%">
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
                          padding: '5px',
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
                          padding: '5px',
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
                          padding: '5px',
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
                          padding: '5px',
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
                          padding: '5px',
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
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      右(R)
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yyyqiujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yyyzhujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yyyzhouwei}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yytongju}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.jyyqiujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yyyshiju}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {' '}
                      {this.state.rows.yyyjiaozheng}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      左(L)
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.yyzqiujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.yyzzhujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.yyzzhouwei}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.jyytongju}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.jyzqiujing}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.yyzshiju}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      {this.state.rows.yyzjiaozheng}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex' }}>
                  <span>验光师</span>
                  <span
                    style={{
                      borderBottom: '1px solid',
                      marginLeft: '10px',
                      width: '80px',
                      textAlign: 'center'
                    }}
                  >
                    {this.state.rows.n7}
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span>配镜师</span>
                  <span
                    style={{
                      borderBottom: '1px solid',
                      marginLeft: '10px',
                      width: '80px',
                      textAlign: 'center'
                    }}
                  >
                    {this.state.rows.yzzqiujing}
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span>质检员</span>
                  <span
                    style={{
                      borderBottom: '1px solid',
                      marginLeft: '10px',
                      width: '80px',
                      textAlign: 'center'
                    }}
                  >
                    {this.state.rows.yzyzhujing}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ marginRight: '10px' }}>镜架材料</span>
                  <span>
                    <Input value={this.state.rows.jjcl} style={{ width: '90px',fontSize:'13px' }}/>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>名称</span>
                  <span>
                    <Input
                      style={{ width: '90px' ,fontSize:'13px'}}
                      value={this.state.rows.jjmc}
                    />
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}> 型号</span>
                  <span>
                    <Input
                      style={{ width: '90px' ,fontSize:'13px'}}
                      value={this.state.rows.jjxh}
                    />
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>颜色</span>
                  <span>
                    <Input value={this.state.rows.jjys} style={{width:'65px',fontSize:'13px'}}/>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>镜片名称</span>
                  <span>
                    <Input
                      style={{ width: '150px' }}
                      value={this.state.rows.jpmc}
                    />
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>折射率</span>
                  <span>
                    <Input
                      style={{ width: '80px' }}
                      value={this.state.rows.zsls}
                    />
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>膜层</span>
                  <span>
                    <Input defaultValue={this.state.rows.mc} style={{width:'65px'}}/>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>卡号</span>
                  <span>
                    <Input
                      style={{ width: '150px', fontSize: '12px' }}
                      value={this.state.rows.n5}
                      disabled
                    />
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>戴镜史</span>
                  <span>
                    <Input
                      style={{ width: '90px', fontSize: '12px' }}
                      value={this.state.rows.yxzzhujing}
                    />
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>生日</span>
                  <span>
                    <DatePicker
                      defaultValue={moment(str, dateFormat)}
                      format={dateFormat}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                  <span>原</span>
                  <span style={{ marginLeft: '25px' }}>价</span>
                </div>
                <div style={{ width: '17%', textAlign: 'center' }}>
                  <span>单</span>
                  <span style={{ marginLeft: '5px' }}>位</span>
                </div>
                <div style={{ width: '32%', textAlign: 'center' }}>
                  <span>折扣</span>
                  <span style={{ marginLeft: '5px' }}>(10无折扣)</span>
                </div>
                <div style={{ width: '21%', textAlign: 'center' }}>优惠价</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '15px'
                }}
              >
                <div style={{ width: '10%' }}>镜片价格</div>
                <div style={{ width: '20%' }}>
                  <Input
                    style={{ width: '100%', marginLeft: '10px' }}
                    value={this.state.rows.jpjg}
                  />
                </div>
                <div style={{ width: '15%' }}>
                  <Input
                    style={{ width: '80%', marginLeft: '20%' }}
                    value={this.state.rows.kh}
                  />
                </div>
                <div style={{ width: '25%', marginLeft: '5%' }}>
                  <span style={{ width: '30%' }}>付/对</span>
                  <span>
                    <Input
                      style={{ width: '70%', marginLeft: '10px' }}
                      value={this.state.rows.jyyshiju}
                    />
                  </span>
                </div>
                <div
                  style={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginLeft: '5%'
                  }}
                >
                  <Input
                    style={{ width: '100%' }}
                    value={this.state.rows.jyzshiju}
                  />{' '}
                  {/*优惠价*/}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '15px'
                }}
              >
                <div style={{ width: '10%' }}>镜架价格</div>
                <div style={{ width: '20%' }}>
                  <Input
                    style={{ width: '100%', marginLeft: '10px' }}
                    value={this.state.rows.jjjg}
                  />
                </div>
                <div style={{ width: '15%' }}>
                  <Input
                    style={{ width: '80%', marginLeft: '20%' }}
                    value={this.state.rows.n2}
                  />
                </div>
                <div style={{ width: '25%', marginLeft: '5%' }}>
                  <span style={{ width: '30%' }}>付/对</span>
                  <span>
                    <Input
                      style={{ width: '70%', marginLeft: '10px' }}
                      value={this.state.rows.jyyjiaozheng}
                    />
                  </span>
                </div>
                <div
                  style={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginLeft: '5%'
                  }}
                >
                  <Input
                    style={{ width: '100%' }}
                    value={this.state.rows.jyzjiaozheng}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '15px',
                  paddingRight: '10px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '50%'
                  }}
                >
                  <span>总价价格</span>
                  <span>
                    <Input style={{ width: '100%', marginLeft: '10px' }} value={this.state.rows.yxyqiujing}/>
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '50%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <div>实收价格</div>
                  <span>
                    <Input style={{ width: '100%', marginLeft: '10px' }} value={this.state.rows.n6}/>
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '15px'
                }}
              >
                <div style={{ width: '10%' }}>备注</div>
                <div style={{ width: '90%' }}>
                  <TextArea
                    rows={3}
                    style={{ resize: 'none' }}
                    value={this.state.rows.note1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OldPosSystem
