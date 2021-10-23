import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { onlyDate, belongType } from '../../utils/public';
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class TeacherInfo extends Component {
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
      date:moment().format('YYYY-MM-DD')
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
  }

  // 获取自定义类型列表
  getList = (params) => {
    this.props.dispatch({
      type: 'teacherDataCollect/customTypeList',
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
        'status': values.status || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
        "date": this.state.date,
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
        'status': values.status || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
        "date": this.state.date,
      }
      this.getList(params)
    })
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
  // 学业阶段选择
  handleChange = (value) => {
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
  // 年级选择
  gradeChange = (val) => {
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
  // 时间选择
  onChangeRange = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      date: dateString
    })
  }
  // 编辑
  edit = () => {

  }
  // 复制
  copy = () => {

  }
  // 删除
  del = () => {

  }
  render() {
    const columns = [{
      title: '编号',
      dataIndex: 'id',
    }, {
      title: '项目名称',
      dataIndex: 'name',
    }, {
      title: '所属类型',
      dataIndex: 'cate',
      render:( record) => (
        <span>{belongType(record)}</span>
      )
    }, {
      title: '发布人',
      dataIndex: 'publisherName',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        return (<span>{record == 1 ? '启用' : '禁用'}</span>)
      }
    }, {
      title: '操作',
      dataIndex: '',
      width:180,
      fixed:'right',
      render:(text, record) => (
        <span>
          <a href="javascript:;" onClick={this.edit.bind(this,record.id,record.appliedNum)}>编辑&emsp;</a>
          <a href="javascript:;" onClick={this.copy.bind(this,record.id)}>复制&emsp;</a>
          <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
        </span>
      )
    }];
    const { flag,isShow, } = this.state;
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
    return (
      <div className="consume-record">
        <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>教师数据管理</Breadcrumb.Item>
            <Breadcrumb.Item>教师数据审核</Breadcrumb.Item>
          </Breadcrumb>
          <h3>教师个人信息</h3>
        </div>
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="请输入姓名或证件号" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select allowClear placeholder="状态" onChange={this.handleChange.bind(this)}>
                      <Option value="1">启用</Option>
                      <Option value="2">禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select allowClear placeholder="状态" onChange={this.handleChange.bind(this)}>
                      <Option value="1">启用</Option>
                      <Option value="2">禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={15} style={{ textAlign: 'right',paddingRight:'20px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <Button type='primary' onClick={this.reset.bind(this)}>添加</Button>
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
export default connect(mapStateToProps)(Form.create()(TeacherInfo));
