import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Popover, Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, TreeSelect, Modal, message, DatePicker, Drawer, Steps } from 'antd';
import PageIndex from '../../components/page';
import { dateToTimestamp, getApplyType, formatDate } from '../../utils/public';
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
class SpecialCaseRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      detailList:[],
      typeList:[],
      exportUrl: '',
      isShow: false,
      flag: false,
      applyStartTime:'',
      applyEndTime:'',
      agreeStartTime:'',
      agreeEndTime:'',
      visible:false,
      typeName:'',
      applicant:'',
      applyTime:'',
      agreeTime:'',
      status:'',
      itemContents:[],
      processRecords:[],
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
    this.getTypeList()
  }
  // 获取类型名称列表
  getTypeList = () => {
    this.props.dispatch({
      type:'infantSpecialCase/getTypeList',
      callback:(res)=>{
          if(res.code === 200){
            this.setState({typeList:res.data})
          }
      }
    })
  }
  // 获取记录列表
  getList = (params) => {
    this.props.dispatch({
      type:'infantSpecialCase/specialMasterRecord',
      payload: params,
      callback: res => {
        if(res.code == 200){
          this.setState({
            data: res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
    this.setState({
      applyStartTime:'',
      applyEndTime:'',
      agreeStartTime:'',
      agreeEndTime:'',
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
      applyStartTime: dateToTimestamp(dateString[0]),
      applyEndTime: dateToTimestamp(dateString[1]),
    })
  }
 
  // 通过时间选择
  onChangeRange1 = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      agreeStartTime: dateToTimestamp(dateString[0]),
      agreeEndTime: dateToTimestamp(dateString[1]),
    })
  }
  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        'status': values.status || '',
        "typeId": values.typeId || '',
        "applyStartTime": this.state.applyStartTime,
        "applyEndTime": this.state.applyEndTime,
        "agreeStartTime": this.state.agreeStartTime,
        "agreeEndTime": this.state.agreeEndTime,
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
        'status': values.status || '',
        "typeId": values.typeId || '',
        "applyStartTime": this.state.applyStartTime,
        "applyEndTime": this.state.applyEndTime,
        "agreeStartTime": this.state.agreeStartTime,
        "agreeEndTime": this.state.agreeEndTime,
      }
      this.getList(params)
    })
  }
 
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      if(!values.typeId || !values.applyDate){
        this.setState({exportUrl:'javascript:void(0);'})
        return message.error("类型名称和发起时间不能为空")
      }else{
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let kw = values.kw || '';
        let typeId = values.typeId;
        let status = values.status || '';
        let applyStartTime = this.state.applyStartTime;
        let applyEndTime = this.state.applyEndTime;
        let agreeStartTime = this.state.agreeStartTime;
        let agreeEndTime = this.state.agreeEndTime;
        let url = portUrl("/manager/teacher-honor-records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
        "&typeId=" + typeId + "&status=" + status + "&applyStartTime=" + applyStartTime + "&applyEndTime=" + applyEndTime + "&agreeStartTime=" + agreeStartTime + 
        "&agreeEndTime=" + agreeEndTime)
        this.setState({ exportUrl: url })
      }
    })
  }

  // 查看id
  checkDetail = (id) => {
    this.props.dispatch({
      type:'infantSpecialCase/getRecordsDetail',
      payload:{id},
      callback:(res)=>{
          if(res.code === 200){
            let answerContents = []
            res.data.itemContents && res.data.itemContents.map(item =>{
              if(item.type == 4 || item.type == 5){
                let answerArr = []
                item.answerOptions && item.answerOptions.map(v =>{
                  item.answers.split(',').map(j =>{
                    if(j == v.item){
                      answerArr.push(v)
                    }
                  })
                })
                item.answers = answerArr
              }
              if(item.type == 6 || item.type == 7){
                let answerArr = []
                Array.isArray(item.answers)&&item.answers.map(v=>{
                  answerArr.push(v.hash)
                })
                item.answers = answerArr
              }
              answerContents.push({
                title:item.title,
                type:item.type,
                answers:item.answers,
                seq:item.seq
              })
            })
            console.log({answerContents});
            this.setState({
              typeName:res.data.typeName,
              applicant:res.data.applicant,
              applyTime:formatDate(res.data.applyTime),
              agreeTime:formatDate(res.data.agreeTime),
              status:getApplyType(res.data.status),
              itemContents:answerContents,
              processRecords:res.data.processRecords,
              visible: true
            })
          }
      }
    })
  }
  // 审批状态
  statusType = (type, result)=>{
    if(type == 0){
      return "申请"
    }else if(type == 2){
      if(result == 0){
        return "待审核"
      }else if(result == 1){
        return "通过"
      }else if(result == 2){
        return "驳回"
      }else if(result == 3){
        return "拒绝"
      }
    }
  }
  render() {
    const { flag, isShow, typeList, data, detailList, exportUrl,typeName,applicant,applyTime,agreeTime,status,itemContents,processRecords} = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '类型名称',
      dataIndex: 'itemName',
    }, {
      title: '申请人',
      dataIndex: 'applicant',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        return (<span>{getApplyType(record)}</span>)
      }
    }, {
      title: '发起时间',
      dataIndex: 'applyTime',
      render: (record) => {
        return (<span>{formatDate(record)}</span>)
      }
    }, {
      title: '通过时间',
      dataIndex: 'agreeTime',
      render: (record) => {
        return (<span>{formatDate(record)}</span>)
      }
    }, {
      title: '操作',
      dataIndex: '',
      width:100,
      fixed:'right',
      render:(text, record) => (
        <span>
          <a href="javascript:;" onClick={this.checkDetail.bind(this,record.id)}>查看</a>
        </span>
      )
    }];

    let options = []
    typeList && typeList.map(item => {
      return options.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
    })
    const steps = processRecords && processRecords.map((item, index)=>{
      let des = <div>
                  <div>{item.dealer}</div>
                  <div>{formatDate(item.time)}</div>
                  {item.reason ? <div className="reasons">{'原因：' + item.reason}</div> : null}
                </div>
      return  <Step title={this.statusType(item.actType, item.result)} description={des} key={index} />
    })
    return (
      <div className="special-case-record">
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="申请人" />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator("typeId")(
                    <Select allowClear placeholder="类型名称">
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select placeholder="审批状态" allowClear>
                      <Option value='0' key=''>待审批</Option>
                      <Option value='1' key=''>审批中</Option>
                      <Option value='2' key=''>已通过</Option>
                      <Option value='3' key=''>已拒绝</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={9} style={{ textAlign: 'right',paddingRight:'20px'}}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="unfold" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col span={6} >
                <FormItem>
                  {getFieldDecorator("applyDate")(
                    <RangePicker
                    showTime={{ format: 'YYYY-MM-DD' }}
                    format="YYYY-MM-DD"
                    placeholder={['发起开始时间', '发起结束时间']}
                    onChange={this.onChangeRange} />
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <FormItem>
                  {getFieldDecorator("agreeDate")(
                    <RangePicker
                    showTime={{ format: 'YYYY-MM-DD' }}
                    format="YYYY-MM-DD"
                    placeholder={['通过开始时间', '通过结束时间']}
                    onChange={this.onChangeRange1} />
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <Button type='primary'><a href={exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
              </Col>
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
        </div>
        <Drawer
          title="详情"
          className="detailDrawer"
          placement="right"
          width="600"
          onClose={()=> this.setState({visible:false})}
          visible={this.state.visible}
        >
          <div className="info">
            <p><span>类型名称：</span>{typeName}</p>
            <p><span>申请人：</span>{applicant}</p>
            <p><span>申请时间：</span>{applyTime}</p>
            <p><span>通过时间：</span>{agreeTime}</p>
            <p><span>审批状态：</span>{status}</p>
          </div>
          <div className="questions">
            {
              itemContents && itemContents.map(item =>{
                if(item.type == 4){
                  return <div key={item.seq}>
                          <h4>{item.seq + '、' + item.title}</h4>
                          <p>{Array.isArray(item.answers)&&item.answers[0]&&item.answers[0].item + '：' + Array.isArray(item.answers)&&item.answers[0]&&item.answers[0]&&item.answers[0].val}</p>
                        </div>
                }else if(item.type == 5){
                  return <div key={item.seq}>
                            <h4>{item.seq + '、' + item.title}</h4>
                            {
                              item.answers.map((v,i) =>{
                                return <p key={i}>{v.item + '：' + v.val}</p>
                              })
                            }
                          </div>
                }else if(item.type == 6){
                  return  <div key={item.seq}>
                            <h4>{item.seq + '、' + item.title}</h4>
                            {
                                Array.isArray(item.answers)&&item.answers.length==1&&item.answers[0]?<div className="img-box"><img src={getImg(item.answers[0])}/></div>:null
                              }
                          </div>
                  
                }else if(item.type == 7){
                  return  <div key={item.seq}>
                            <h4>{item.seq + '、' + item.title}</h4>
                            {
                              Array.isArray(item.answers)&&item.answers.map((v,i) =>{
                                return <div key={i} className="img-box">
                                  <img src={getImg(v)}/>
                                </div>
                              })
                            }
                          </div>
                }else{
                  return <div key={item.seq}>
                      <h4>{item.seq + '、' + item.title}</h4>
                      <p>{item.answers}</p>
                  </div>
                }
              })
            }
          </div>
          <Steps className="applyStep" current={processRecords && processRecords.length} progressDot={customDot}>
            {steps}
          </Steps>
        </Drawer>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(SpecialCaseRecord));
