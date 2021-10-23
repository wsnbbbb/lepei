import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input,TreeSelect, Select, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { onlyDate, getGradeType, getScoreLevel } from '../../utils/public';
import { routerRedux } from 'dva/router'
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';

const { MonthPicker, RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class assessmentRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      deviceNo: '',
      remark: '',
      currentDeviceNo: '',
      previewImg: '',
      classValue: '',
      exportUrl: '',
      disabled: true,
      disabled1: true,
      isShow: false,
      flag: false,
      date:moment().format('YYYY-MM-DD'),
      treeData: [],
      itemList: []

    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
      // "date": moment().format('YYYY-MM-DD')
    }

    this.getList(params)

    this.props.dispatch({
      type: 'teacherAssessment/getAssessmentItemList',
      callback:(res)=>{
          if(res.code===200){
              this.setState({itemList: res.data})
          }
      }
    })

    this.props.dispatch({
      type: 'teacherAssessment/departmentTree',
      callback:(res)=>{
          if(res.code===200){
              this.setState({treeData: res.data})
          }
      }
    })

  }

  // 获取记录列表
  getList = (params) => {
    this.props.dispatch({
      type: 'teacherAssessment/assessmentRecords',
      payload: params,
      callback: res => {
        this.setState({
          data: res.data
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
        "kw": values.kw || '',
        'itemId': values.itemId || '',
        'departmentId': values.departmentId || '',
        'scoreLevel': values.scoreLevel || '',
        'applyStartDate': values.date&&values.date[0].format("YYYY-MM-DD") || '',
        'applyEndDate': values.date&&values.date[1].format("YYYY-MM-DD") || '',
        'status': values.status || '',
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
        "prePage": size,
        "kw": values.kw || '',
        'itemId': values.itemId || '',
        'departmentId': values.departmentId || '',
        'scoreLevel': values.scoreLevel || '',
        'applyStartDate': values.date&&values.date[0].format("YYYY-MM-DD") || '',
        'applyEndDate': values.date&&values.date[1].format("YYYY-MM-DD") || '',
        'status': values.status || '',
      }
      this.getList(params)
    })
  }
  del = (id)=>{
    let me = this;
    confirm({
      title: '提示',
      content: "确定要删除这条信息吗？",
      onOk() {
        me.props.dispatch({
          type:'teacherAssessment/delAssessRecord',
          payload:{ id },
          callback:(res) =>{
            if(res.code === 200){
              message.success('删除成功！')
              me.props.form.validateFields((err, values) => {
                const params = {
                  "kw": values.kw||'',
                  "page": me.state.page,
                  "prePage": me.state.prePage,
                  'itemId': values.itemId || '',
                  'departmentId': values.departmentId || '',
                  'scoreLevel': values.scoreLevel || '',
                  'applyStartDate': values.date&&values.date[0].format("YYYY-MM-DD") || '',
                  'applyEndDate': values.date&&values.date[1].format("YYYY-MM-DD") || '',
                  'status': values.status || '',
                }
                me.getList(params)
              })
            }
          }
        })
      },
      onCancel() {},
    });
  }

  toDetail =(id)=>{
    this.props.dispatch(routerRedux.push("/assessment-detail?id="+id))
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
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

  // 时间选择
  onChangeRange = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      date: dateString
    })
  }
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let kw = values.kw || '';
      let departmentId = values.departmentId || '';
      let scoreLevel = values.scoreLevel || '';
      let applyStartDate = values.date&&values.date[0].format("YYYY-MM-DD") || '';
      let applyEndDate = values.date&&values.date[1].format("YYYY-MM-DD") || '';
      let status = values.status || '';
      let url = portUrl("/manager/teacher-assessment-records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
      "&departmentId=" + departmentId + "&scoreLevel=" + scoreLevel + "&applyStartDate=" + applyStartDate + "&applyEndDate=" + applyEndDate + "&status=" + status )
      this.setState({ exportUrl: url })
    })
  }
  // 部门选择
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode value={item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode value={item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
  })
  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '考核名称',
      dataIndex: 'itemName',
    },{
      title: '类型一',
      dataIndex: 'typeOne',
    },{
      title: '类型二',
      dataIndex: 'typeTwo',
    },{
      title: '部门',
      dataIndex: 'departmentName',
    },{
      title: '考核得分',
      dataIndex: 'score',
    }, {
      title: '结果',
      dataIndex: 'scoreLevel',
      render:(record)=>{
        return(<span>{getScoreLevel(record)}</span>)
      }

      // 状态(0: 待审批, 1: 已通过, 2: 已退回)
    }, {
      title: '状态',
      dataIndex: 'status',
      render:(record)=>{
        return(<span>{record==0?"待审批":(record==1?"已通过":"已退回")}</span>)
      }
    }, {
      title: '提交时间',
      dataIndex: 'applyDate'
    }, {
      title: '操作',
      dataIndex: '',
      width:150,
      fixed:'right',
      render:(text, record) => (
        <span>
          <a href="javascript:;" onClick={this.toDetail.bind(this, record.id)}>查看&emsp;</a>
          <a href="javascript:;" onClick={this.del.bind(this, record.id)}>删除</a>
        </span>
      )
    }];
    const { flag,isShow, treeData, itemList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { commonData, gradeList } = this.props;
    let options = []
    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
    })
    let classOptions = [];
    commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
      return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
    })

    let itemOptions = []
    itemList && itemList.length > 0 && itemList.map(item => {
      return itemOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
    })

    return (
      <div className="consume-record">
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
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("itemId")(
                    <Select allowClear placeholder="考核名称">
                      {itemOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
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
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("scoreLevel")(
                    <Select allowClear placeholder="结果">
                      <Option value="">全部</Option>
                      <Option value="1">优秀</Option>
                      <Option value="2">良好</Option>
                      <Option value="3">合格</Option>
                      <Option value="4">不合格</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              
              <Col span={7} style={{ textAlign: 'right',paddingRight:'20px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col span={6} >
                <FormItem>
                  {getFieldDecorator("date")(
                    <RangePicker
                      format={'YYYY/MM/DD'}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select placeholder="状态" allowClear>
                      <Option value='' key=''>全部</Option>
                      <Option value='0' key='0'>待审核</Option>
                      <Option value='1' key='1'>已通过</Option>
                      <Option value='2' key='2'>已退回</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} >
                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
              </Col>
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage} />
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
export default connect(mapStateToProps)(Form.create()(assessmentRecords));
