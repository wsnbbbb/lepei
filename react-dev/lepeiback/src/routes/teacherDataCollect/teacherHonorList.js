import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, TreeSelect, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { belongType } from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';
import TextArea from 'antd/lib/input/TextArea';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

class teacherHonorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      detailList:[],
      projectList:[],
      treeData: [],
      exportUrl: '',
      disabled: true,
      isShow: false,
      flag: false,
      teachingStartAge:'',
      teachingEndAge:'',
      issueCertStartDate:'',
      issueCertEndDate:'',
      applyStartDate:'',
      applyEndDate:'',
      visible: false,
      currentId: '',
      statistics: []
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getStatistics()
    this.getList(params)
  }

  getStatistics = ()=>{
    this.props.dispatch({
      type: 'teacherDataCollect/getHonorStatistics',
      payload: {},
      callback: res => {
        if(res.code === 200){

          this.setState({
            statistics: res.data
          })
        }
      }
    })
  }
  handleCancel = ()=>{
    this.setState({
      visible: false
    })
    this.props.form.resetFields(["reason", "reason1"])
  }

  handleCancel1 = ()=>{
    this.setState({
      visible1: false
    })
    this.props.form.resetFields(["reason", "reason1"])
  }

  newAdd = ()=>{
    this.props.dispatch(routerRedux.push("/teacher-data-check"))
  }

  getQuery = (status)=>{
    const params = {
      "page": 1,
      "prePage": 20,
      "status": status
    }
    this.getList(params)
  }

  handleOk = (type)=>{
    let me = this
    let arr = []
    if(type ==1){
      arr = ["reason"]
    }else if(type == 2){
      arr = ["reason1"]
    }
    this.props.form.validateFields(arr, (err, values) => {
      if(!err){
        let params = {
          id: this.state.currentId,
          type: type,
          reason: type==1?(values.reason||''):(values.reason1||'')
        }
        this.props.dispatch({
          type: 'teacherDataCollect/changeTeacherHonorPersonnelRecords',
          payload: params,
          callback: res => {
            if(res.code === 200){
              if(type == 1){
                message.success("撤回成功")
              }else if(type == 2){
                message.success("变更成功")
              }
              this.setState({
                visible: false,
                visible1: false
              })
              me.props.form.resetFields(["reason", "reason1"])
              me.search()

            }
          }
        })

      }
    })
  }

  // 获取数据列表
  getList = (params) => {
    this.props.dispatch({
      type: 'teacherDataCollect/getTeacherHonorRecords',
      payload: params,
      callback: res => {
        this.setState({
          data: res.data,
          detailList:res.data.dataList
        })
      }
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        'status': values.status || '',
        'cate': values.cate || '',
        "itemId": values.itemId || '',
        "issueCertStartDate": this.state.issueCertStartDate,
        "issueCertEndDate": this.state.issueCertEndDate,
        "applyStartDate": this.state.applyStartDate,
        "applyEndDate": this.state.applyEndDate,
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
        'status': values.status || '',
        'cate': values.cate || '',
        "itemId": values.itemId || '',
        "issueCertStartDate": this.state.issueCertStartDate,
        "issueCertEndDate": this.state.issueCertEndDate,
        "applyStartDate": this.state.applyStartDate,
        "applyEndDate": this.state.applyEndDate,
      }
      this.getList(params)
    })
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
    this.setState({
      teachingStartAge:'',
      teachingEndAge:'',
      issueCertStartDate:'',
      issueCertEndDate:'',
      "applyStartDate": '',
      "applyEndDate": '',
    })
  }
  // 展开/收起
  toggle = () => {
    console.log(this.state.flag);
    this.setState({
      flag: !this.state.flag
    }, function () {
      console.log(this.state.flag);
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
  // 所属类型选择
  cateSelect = (value) => {
    if (value) {
      this.setState({ disabled: false })
      this.props.dispatch({
        type: 'teacherDataCollect/getListByCate',
        payload: { "cate": value },
        callback: (res) => {
          if (res.code === 200) {
            this.setState({ projectList: res.data})
          }
        }
      })
    } else {
      this.props.form.resetFields(["itemId"])
      this.setState({ disabled: true })
    }
  }
  // 开始教龄
  changeNumber1 = (e) => {
    this.setState({teachingStartAge:e.target.value})
  }
  // 结束教龄
  changeNumber2 = (e) => {
    this.setState({teachingEndAge:e.target.value})
  }
 
  // 颁证时间选择
  onChangeRange = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      issueCertStartDate: dateString[0],
      issueCertEndDate: dateString[1],
    })
  }
 
  // 上报时间选择
  onChangeRange1 = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      applyStartDate: dateString[0],
      applyEndDate: dateString[1],
    })
  }
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let kw = values.kw || '';
      let cate = values.cate || '';
      let itemId = values.itemId || '';
      let departmentId = values.departmentId ? values.departmentId.substring(values.departmentId.lastIndexOf('-') + 1, values.departmentId.length) : '';
      let status = values.status || '';
      let teachingStartAge = this.state.teachingStartAge;
      let teachingEndAge = this.state.teachingEndAge;
      let issueCertStartDate = this.state.issueCertStartDate;
      let issueCertEndDate = this.state.issueCertEndDate;
      let applyStartDate = this.state.applyStartDate;
      let applyEndDate = this.state.applyEndDate;
      let url = portUrl("/manager/teacher-honor-records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
      "&cate=" + cate + "&itemId=" + itemId + "&departmentId=" + departmentId + "&status=" + status + "&teachingStartAge=" + teachingStartAge + "&teachingEndAge=" + 
      teachingEndAge + "&issueCertStartDate=" + issueCertStartDate + "&issueCertEndDate=" + issueCertEndDate + "&applyStartDate=" + applyStartDate + "&applyEndDate=" + applyEndDate)
      this.setState({ exportUrl: url })
    })
  }

  edit = (id) => {
    this.props.dispatch(routerRedux.push("/edit-teacher-data-check?id=" + id))
  }

   // 删除
   showConfirm=(id)=> {
    let me=this;
    confirm({
      title: '提示',
      content: '确定要删除这条数据吗？',
      onOk() {
        me.props.dispatch({
          type:'teacherDataCollect/deleteTeacherHonorPersonnelRecords',
          payload:{"id": id},
          callback:(res)=>{
            if(res.code===200){
              message.success('删除成功！',3)
              me.search()
              me.getStatistics()
            }
          }
        })
      },
      onCancel() {},
    });
  }


  delete = (id) => {
    this.setState({
      currentId: id
    })
  }
  delete = (id) => {
    let params = {
      id: this.state.currentId,
    }
    this.props.dispatch({
      type: 'teacherDataCollect/deleteTeacherHonorPersonnelRecords',
      payload: params,
      callback: res => {
        if(res.code === 200){
          message.success("删除成功")
          me.search()
        }
      }
    })

  }

  recall = (id) => {
    this.setState({
      visible: true,
      currentId: id
    })
  }

  alter = (id) => {
    this.setState({
      visible1: true,
      currentId: id
    })
  }
  // 审核状态
  auditType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "0":
        return "待提交";
      case "1":
        return "待审批";
      case "3":
        return "已通过";
      case "4":
        return "已退回";
      default:
        return ""
    }
  }
  // 状态颜色
  statusColor = (type) => {
    const types = type && type.toString()
    switch(types){
      case "0":
        return "#FD9C6B";
      case "1":
        return "#20A4FD";
      case "3":
        return "#43C964";
      case "4":
        return "#f00";
      default:
        return ""
    }
  }
  // 部门选择
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode value={item.departmentName + '-' + item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode value={item.departmentName + '-' + item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
  })
  render() {

    const formItemLayout = {
      labelCol: { span:7 },
      wrapperCol: { span: 16 }
    };

    const columns = [{
      title: '所属类型',
      dataIndex: 'cate',
      render: (record) => {
        return (<span>{belongType(record)}</span>)
      }
    }, {
      title: '项目名称',
      dataIndex: 'itemName',
    },{
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        return (<span style={{color:this.statusColor(record)}}>{this.auditType(record)}</span>)
      }
    },  {
      title: '颁证日期',
      dataIndex: 'issueCertDate'
    }, {
      title: '上报日期',
      dataIndex: 'applyDate'
    }, {
      title: '操作',
      dataIndex: '',
      width:100,
      fixed:'right',
      render:(text, record) => (
        <span>
          <a href="javascript:;" onClick={this.recall.bind(this,record.id)}>{record.status == 1 ? "撤回 " : ''}</a>
          <a href="javascript:;" onClick={this.alter.bind(this,record.id)}>{record.status == 3 ? "变更 " : ''}</a>
          <a href="javascript:;" onClick={this.edit.bind(this,record.id)}>{record.status == 4 || record.status == 0? "编辑 " : ''}</a>
          <a href="javascript:;" onClick={this.showConfirm.bind(this,record.id)}>{record.status == 4 || record.status == 0? "删除 " : ''}</a>
        </span>
      )
    }];
    const { flag, isShow, projectList, data, detailList, treeData, teachingStartAge, teachingEndAge } = this.state;
    const { getFieldDecorator } = this.props.form;
    let options = []
    projectList && projectList.map(item => {
      return options.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
    })
   
    return (
      <div className="teacher-data-audit">
        <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>教师数据收集管理</Breadcrumb.Item>
            <Breadcrumb.Item>教师数据审核</Breadcrumb.Item>
          </Breadcrumb>
          <h3>教师荣誉申请</h3>
        </div>
        <div className="content-main">
          <Row gutter={24}>
            <ul className="statics-box">
              {this.state.statistics.map((i, idx)=>{
                if(i.status == 1){
                  return <li key={idx} onClick={this.getQuery.bind(this, 1)}>
                          待审批 | {i.count}
                         </li>
                }else if(i.status == 3){
                  return <li key={idx} onClick={this.getQuery.bind(this, 3)}>
                           已通过 | {i.count}
                         </li>
                }else if(i.status == 4){
                  return <li key={idx} onClick={this.getQuery.bind(this, 4)} className="recall">
                           已退回 | {i.count}
                         </li>
                }else if(i.status == 0){
                  return <li key={idx} onClick={this.getQuery.bind(this, 0)}>
                           待提交 | {i.count}
                         </li>
                }
              })}
            </ul>
          </Row>
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              {/* <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="姓名" />
                  )}
                </FormItem>
              </Col> */}
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator("cate")(
                    <Select allowClear placeholder="所属类型" onChange={this.cateSelect.bind(this)}>
                      <Option value="1">师德师风</Option>
                      <Option value="2">荣誉称号</Option>
                      <Option value="3">教育教学</Option>
                      <Option value="4">科研创新</Option>
                      <Option value="5">支教扶薄</Option>
                      <Option value="6">培养教师</Option>
                      <Option value="7">指导学生</Option>
                      <Option value="8">其他兼职</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator("itemId")(
                    <Select allowClear placeholder="项目名称" showSearch disabled={this.state.disabled}>
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select placeholder="审批状态" allowClear>
                      <Option value='0' key=''>待提交</Option>
                      <Option value='1' key=''>待审批</Option>
                      <Option value='3' key=''>已通过</Option>
                      <Option value='4' key=''>已退回</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'right',paddingRight:'20px'}}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button type='primary' onClick={this.newAdd.bind(this)}>添加</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="unfold" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              {/* <Col span={4}>
                <FormItem>
                  {getFieldDecorator("departmentId")(
                    <TreeSelect
                      placeholder="请选择部门"
                      showSearch
                      dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                      allowClear
                      treeDefaultExpandAll
                    >
                    {this.renderTreeNodes(treeData)}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col> */}
              <Col span={5} >
                <FormItem>
                  {getFieldDecorator("issueCertDate")(
                    <RangePicker
                    showTime={{ format: 'YYYY-MM-DD' }}
                    format="YYYY-MM-DD"
                    placeholder={['颁证开始时间', '颁证结束时间']}
                    onChange={this.onChangeRange} />
                  )}
                </FormItem>
              </Col>
              <Col span={5} >
                <FormItem>
                  {getFieldDecorator("applyDate")(
                    <RangePicker
                    showTime={{ format: 'YYYY-MM-DD' }}
                    format="YYYY-MM-DD"
                    placeholder={['上报开始日期', '上报结束日期']}
                    onChange={this.onChangeRange1} />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={5} >
                <FormItem>
                  {getFieldDecorator("applyDate")(
                    <RangePicker
                    showTime={{ format: 'YYYY-MM-DD' }}
                    format="YYYY-MM-DD"
                    placeholder={['上报开始时间', '上报结束时间']}
                    onChange={this.onChangeRange1} />
                  )}
                </FormItem>
              </Col> */}
              {/* <Col span={4}>
                <FormItem>
                  <InputGroup compact className="inputs">
                    <Input value={teachingStartAge} style={{ textAlign:'center' }} onChange={this.changeNumber1} placeholder="开始教龄" />
                    <Input
                      style={{
                        width: 30,
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                      }}
                      placeholder="~"
                      disabled
                    />
                    <Input value={teachingEndAge} style={{ textAlign:'center',borderLeft: 0 }} onChange={this.changeNumber2} placeholder="结束教龄" />
                  </InputGroup>
                </FormItem>
              </Col> */}
              {/* <Col span={6} >
                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
              </Col> */}
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
          <Modal
              title="撤回"
              visible={this.state.visible}
              onOk={this.handleOk.bind(this, 1)}
              onCancel={this.handleCancel}
            >
              <Form>
                <Row gutter={24} >
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'撤回原因'}>
                      {getFieldDecorator("reason",{initialValue: '',rules:[{required:true, message:"请填写撤回原因，不超过20字"}]})(
                        <TextArea maxLength={20} autosize={{ minRows: 3, maxRows: 6 }}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
               
              </Form>
          </Modal>
          <Modal
              title="变更"
              visible={this.state.visible1}
              onOk={this.handleOk.bind(this, 2)}
              onCancel={this.handleCancel1}
            >
              <Form>
                <Row gutter={24} >
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'变更原因'}>
                      {getFieldDecorator("reason1",{initialValue: '',rules:[{required:true, message:"请填写变更原因，不超过20字"}]})(
                        <TextArea maxLength={20} autosize={{ minRows: 3, maxRows: 6 }}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
               
              </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(teacherHonorList));
