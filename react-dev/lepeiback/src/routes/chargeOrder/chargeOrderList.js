import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, TreeSelect, Modal, message, DatePicker, Drawer, Steps } from 'antd';
import PageIndex from '../../components/page';
import { dateToTimestamp, getApplyType, formatDate , getChargePlatform, getPayChannel, getOrderStatus, getPayStatus, getChargeStatus, getOrderType,getPersonType,getGradeType} from '../../utils/public';
import { portUrl, getImg } from '../../utils/img';
import './style.less';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const Step = Steps.Step;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>步骤 {index+1}</span>}>
    {dot}
  </Popover>
);
class ChargeOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      detailList:[],

      exportUrl: '',
      isShow: false,
      flag: false,
      startTime:'',
      endTime:'',
      classValue:'',
      disabled: true,
      disabled1: true,
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
  }

  // 获取记录列表
  getList = (params) => {
    this.props.dispatch({
      type:'chargeOrder/chargeOrderList',
      payload: params,
      callback: res => {
        if(res.code == 200){
          this.setState({
            data: res.data,
            detailList: res.data.dataList
          })
        }
      }
    })
  }
  //学业阶段选择
  handleChange1=(value)=>{
    if (value) {
      this.setState({ disabled1: false })
      this.props.dispatch({
        type: 'user/getGradeName',
        payload: { "type": value },
      })
    } else {
      this.setState({
        disabled1: true,
      })
    }
    this.props.form.resetFields(["gradeId","classId"])
    this.setState({
      classValue: '',
      classId: '',
      disabled: true,
    })
    
  }
  //年级选择
  gradeChange=(val)=>{
    if (val) {
      this.setState({ disabled: false })
      const id = val
      this.props.dispatch({
        type: 'user/getClassName',
        payload: { "gradeId": id },
        callback: (res) => {
          if (res.code === 200) {
            this.setState({ classId: '' })
          }
        }
      })
    } else {
      this.props.form.resetFields(["classId"])
      this.setState({ classId: '', disabled: true })
    }
  }

  // 重置
  reset = () => {
    this.props.form.resetFields()
    this.setState({
      startTime:'',
      endTime:'',
    })
  }
  // 展开/收起
  toggle = () => {
    this.setState({
      flag: !this.state.flag
    }, function () {
      if (this.state.flag) {
        this.setState({
          isShow: true,
        })
      } else {
        this.setState({
          isShow: false,
        })
      }
    })
  }
  
  // 发起时间选择
  onChangeRange = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      startTime: dateToTimestamp(dateString[0]),
      endTime: dateToTimestamp(dateString[1]),
    })
  }
 
  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        "personType":values.personType||'',
        "gradeType":values.gradeType||'',
        "gradeId":values.gradeId||'',
        "classId":values.classId||'',
        'orderType': values.orderType || '',
        "chargePlatform": values.chargePlatform || '',
        "payChannel": values.payChannel || '',
        "orderStatus": values.orderStatus || '',
        "payStatus": values.payStatus || '',
        "chargeStatus": values.chargeStatus || '',
        "startTime": this.state.startTime || '',
        "endTime": this.state.endTime || '',
      }
      this.getList(params)
      this.setState({ page: 1 })
    })
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        "personType":values.personType||'',
        "gradeType":values.gradeType||'',
        "gradeId":values.gradeId||'',
        "classId":values.classId||'',
        'orderType': values.orderType || '',
        "chargePlatform": values.chargePlatform || '',
        "payChannel": values.payChannel || '',
        "orderStatus": values.orderStatus || '',
        "payStatus": values.payStatus || '',
        "chargeStatus": values.chargeStatus || '',
        "startTime": this.state.startTime || '',
        "endTime": this.state.endTime || '',
      }
      this.getList(params)
    })
  }
 
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
        console.log(values)
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");
        let userId = sessionStorage.getItem("userId");
        console.log(userType,userId)
        let kw = values.kw || '';
        let personType=values.personType||'';
        let gradeType=values.gradeType||'';
        let gradeId=values.gradeId||'';
        let classId=values.classId||'';
        let orderType = values.orderType || ''
        let chargePlatform = values.chargePlatform || ''
        let payChannel = values.payChannel || ''
        let orderStatus = values.orderStatus || ''
        let payStatus = values.payStatus || ''
        let chargeStatus = values.chargeStatus || ''
        let startTime = this.state.startTime || ''
        let endTime = this.state.endTime || ''       
        let url = portUrl("/manager/ic/charge-order/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw + "&personType="+ personType +"&gradeType="+ gradeType +"&gradeId="+ gradeId +"&classId="+ classId +
        "&orderType=" + orderType + "&chargePlatform=" + chargePlatform + "&payChannel=" + payChannel + "&orderStatus=" + orderStatus + "&payStatus=" + payStatus + 
        "&chargeStatus=" + chargeStatus + "&startTime=" + startTime + "&endTime=" + endTime)
        this.setState({ exportUrl: url })
        console.log(url)
    })
  }

  render() {
    const { flag, isShow, data, detailList, exportUrl} = this.state;
    const {commonData,gradeList}=this.props
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
      render: (record) => {
        return (<span>{formatDate(record)}</span>)
      }
    }, {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 100
    }, {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
      width: 100
    },
    {
      title: '人员姓名',
      dataIndex: 'personName',
      width: 100
    }, 
    {
      title: '人员类型',
      dataIndex: 'personType',
      width: 100,
      render: (record) => {
        return (<span>{getPersonType(record)}</span>)
      }
    }, 
    {
      title: '学业阶段',
      dataIndex: 'gradeType',
      width: 100,
      render: (record) => {
        return (<span>{getGradeType(record)}</span>)
      }
    }, 
    {
      title: '年级名称',
      dataIndex: 'gradeName',
      width: 100
    }, 
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 100
    }, 
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 100
    }, {
      title: '资金流向',
      dataIndex: 'orderType',
      width: 100,
      render: (record) => {
        return (<span>{getOrderType(record)}</span>)
      }
    }, {
      title: '充值渠道',
      dataIndex: 'chargePlatform',
      width: 100,
      render: (record) => {
        return (<span>{getChargePlatform(record)}</span>)
      }
    }, {
      title: '支付渠道',
      dataIndex: 'payChannel',
      width: 100,
      render: (record) => {
        return (<span>{getPayChannel(record)}</span>)
      }
    }, {
      title: '充值金额',
      dataIndex: 'chargeMoney',
      width: 100
    }, {
      title: '服务费',
      dataIndex: 'serviceFee',
      width: 100
    }, {
      title: '订单金额',
      dataIndex: 'totalMoney',
      width: 100
    },{
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 100,
      render: (record) => {
        return (<span>{getOrderStatus(record)}</span>)
      }
    },{
      title: '支付状态',
      dataIndex: 'payStatus',
      width: 100,
      render: (record) => {
        return (<span>{getPayStatus(record)}</span>)
      }
    },{
      title: '充值状态',
      dataIndex: 'chargeStatus',
      width: 100,
      fixed:'right',
      render: (record) => {
        return (<span>{getChargeStatus(record)}</span>)
      }
    }];

    let options = []
    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
    })
    let classOptions = [];
    commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
      return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
    })


    return (
      <div className="special-case-record">
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={3}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="订单编号/电话号码/卡号/姓名" />
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("personType")(
                    <Select allowClear placeholder="人员类型">
                        <Option value='1' key=''>学生</Option>
                        <Option value='2' key=''>教师</Option>
                        <Option value='3' key=''>员工</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                    <FormItem allowClear placeholder="学业阶段">
                      {getFieldDecorator("gradeType",{initialValue:undefined})(
                        <Select placeholder="学业阶段" onChange={this.handleChange1.bind(this)}>
                          {/* <Option value="">全部</Option> */}
                          <Option value="1">幼儿园</Option>
                          <Option value="2">小学</Option>
                          <Option value="3">初中</Option>
                          <Option value="4">高中</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem allowClear placeholder="年级">
                      {getFieldDecorator("gradeId",{initialValue: undefined})(
                        <Select showSearch placeholder="年级" onChange={this.gradeChange.bind(this)} disabled={this.state.disabled1}>
                          {/* <Option value='' key=''>全部</Option> */}
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem  placeholder="班级">
                    {getFieldDecorator("classId")(
                       <Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
                         {classOptions}
                       </Select>
                     )}
                    </FormItem>
                  </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("orderType")(
                    <Select allowClear placeholder="全部订单类型">
                        <Option value='1' key=''>乐陪</Option>
                        <Option value='2' key=''>学校</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
             
              <Col span={6} style={{ textAlign: 'right',paddingRight:'20px'}}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="unfold" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
            <Col span={3}>
                <FormItem>
                  {getFieldDecorator("chargePlatform")(
                    <Select allowClear placeholder="全部充值渠道">
                        <Option value='1' key=''>乐陪APP</Option>
                        <Option value='2' key=''>微信公众号</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("payChannel")(
                    <Select allowClear placeholder="全部支付渠道">
                        <Option value='1' key=''>微信</Option>
                        <Option value='2' key=''>支付宝</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("chargeStatus")(
                    <Select allowClear placeholder="全部充值状态">
                        <Option value='0' key=''>待处理</Option>
                        <Option value='1' key=''>成功</Option>
                        <Option value='2' key=''>失败</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("orderStatus")(
                    <Select allowClear placeholder="全部订单状态">
                        <Option value='0' key=''>处理中</Option>
                        <Option value='1' key=''>成功</Option>
                        <Option value='2' key=''>失败</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("payStatus")(
                    <Select allowClear placeholder="全部支付状态">
                        <Option value='0' key=''>未支付</Option>
                        <Option value='1' key=''>第三方支付成功</Option>
                        <Option value='2' key=''>第三方支付异常</Option>
                        <Option value='5' key=''>第三方退款成功</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem>
                  {getFieldDecorator("applyDate")(
                    <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                    onChange={this.onChangeRange} />
                  )}
                </FormItem>
              </Col>
             
              <Col span={3} >
                <Button type='primary'><a href={exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
              </Col>
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
        </div>
      
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    commonData: state.user,
    gradeList: state.user.gradeNameData
  }
}
export default connect(mapStateToProps)(Form.create()(ChargeOrderList));
