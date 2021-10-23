import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, TreeSelect, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { belongType } from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

class TeacherDataAudit extends Component {
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
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
    this.props.dispatch({
      type:'user/getDepartmentList',
      callback:(res)=>{
          if(res.code===200){
            this.setState({treeData:res.data})
          }
      }
    })
  }

  // 获取数据列表
  getList = (params) => {
    this.props.dispatch({
      type: 'teacherDataCollect/teacherDataList',
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

  // 查询
  search = () => {
    if(this.state.teachingStartAge&&this.state.teachingEndAge){
      if(!(/(^[0-9]\d*$)/.test(this.state.teachingStartAge))||!(/(^[0-9]\d*$)/.test(this.state.teachingStartAge))){
        return message.error("教龄必须为大于等于0的整数")
      }
    }else if(this.state.teachingStartAge||this.state.teachingEndAge){
      return message.error("教龄必须输入完整")
    }

    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        'status': values.status || '',
        'cate': values.cate || '',
        "itemId": values.itemId || '',
        "classId": values.classId || '',
        "departmentId": values.departmentId ? values.departmentId.substring(values.departmentId.lastIndexOf('-') + 1, values.departmentId.length) : '',
        "teachingStartAge": this.state.teachingStartAge,
        "teachingEndAge": this.state.teachingEndAge,
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
    if(this.state.teachingStartAge&&this.state.teachingEndAge){
      if(!(/(^[1-9]\d*$)/.test(this.state.teachingStartAge))||!(/(^[1-9]\d*$)/.test(this.state.teachingStartAge))){
        return message.error("教龄必须为大于等于0的整数")
      }
    }else if(this.state.teachingStartAge||this.state.teachingEndAge){
      return message.error("教龄必须输入完整")
    }

    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        'status': values.status || '',
        'cate': values.cate || '',
        "itemId": values.itemId || '',
        "classId": values.classId || '',
        "departmentId": values.departmentId ? values.departmentId.substring(values.departmentId.lastIndexOf('-') + 1, values.departmentId.length) : '',
        "teachingStartAge": this.state.teachingStartAge,
        "teachingEndAge": this.state.teachingEndAge,
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
      applyStartDate:'',
      applyEndDate:'',
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
            this.props.form.resetFields(["itemId"])
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

  // 审核
  audit = (id) => {
    this.props.dispatch(routerRedux.push("/single-data-audit?id=" + id))
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
    const columns = [{
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '所属部门',
      dataIndex: 'departmentName',
    }, {
      title: '年龄',
      dataIndex: 'age',
    }, {
      title: '教龄',
      dataIndex: 'teachingAge',
    }, {
      title: '项目名称',
      dataIndex: 'itemName',
    }, {
      title: '所属类型',
      dataIndex: 'cate',
      render: (record) => {
        return (<span>{belongType(record)}</span>)
      }
    },{
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        return (<span style={{color:this.statusColor(record)}}>{this.auditType(record)}</span>)
      }
    }, {
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
          <a href="javascript:;" onClick={this.audit.bind(this,record.id)}>{record.status == 1 ? "审核" : ''}</a>
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
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="姓名" />
                  )}
                </FormItem>
              </Col>
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
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="unfold" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col span={4}>
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
              </Col>
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
                    placeholder={['上报开始时间', '上报结束时间']}
                    onChange={this.onChangeRange1} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  <InputGroup compact className="inputs">
                    <Input value={teachingStartAge} maxLength={3} style={{ textAlign:'center' }} onChange={this.changeNumber1} placeholder="开始教龄" />
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
                    <Input value={teachingEndAge} maxLength={3} style={{ textAlign:'center',borderLeft: 0 }} onChange={this.changeNumber2} placeholder="结束教龄" />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={6} >
                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
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
  }
}
export default connect(mapStateToProps)(Form.create()(TeacherDataAudit));
