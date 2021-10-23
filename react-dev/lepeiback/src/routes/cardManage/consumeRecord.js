import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { onlyDate, getGradeType } from '../../utils/public';
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ConsumeRecord extends Component {
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
      "date":moment().format('YYYY-MM-DD')
    }
    this.getList(params)
  }

  // 获取记录列表
  getList = (params) => {
    this.props.dispatch({
      type: 'card/getConsumeList',
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
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let kw = values.kw || '';
      let gradeType = values.gradeType || '';
      let gradeId = values.gradeId || '';
      let classId = values.classId || '';
      let status = values.status || '';
      let date = this.state.date;
      let url = portUrl("/manager/card-transaction-records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
      "&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&status=" + status + "&date=" + date)
      this.setState({ exportUrl: url })
    })
  }
  render() {
    const columns = [{
      title: '编号',
      dataIndex: 'personId',
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
    }, {
      title: '学业阶段',
      dataIndex: 'gradeType',
      render: (record) => {
        return (<span>{getGradeType(record)}</span>)
      }
    }, {
      title: '年级',
      dataIndex: 'gradeName',
    }, {
      title: '班级',
      dataIndex: 'className',
    }, {
      title: '消费情况',
      dataIndex: 'status',
      render: (record) => {
        return (<span>{record == 1 ? '有' : '无'}</span>)
      }
    }, {
      title: '消费次数',
      dataIndex: 'count'
    }, {
      title: '总金额',
      dataIndex: 'money'
    }, {
      title: '统计日期',
      dataIndex: 'date',
    }];
    const { flag,isShow,  } = this.state;
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
            <Breadcrumb.Item>后勤管理</Breadcrumb.Item>
            <Breadcrumb.Item>一卡通管理</Breadcrumb.Item>
            <Breadcrumb.Item>学生消费概况</Breadcrumb.Item>
          </Breadcrumb>
          <h3>学生消费概况</h3>
        </div>
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="学生姓名/编号/IC卡号" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("gradeType")(
                    <Select allowClear placeholder="学业阶段" onChange={this.handleChange.bind(this)}>
                      <Option value="">全部</Option>
                      <Option value="1">幼儿园</Option>
                      <Option value="2">小学</Option>
                      <Option value="3">初中</Option>
                      <Option value="4">高中</Option>
                      <Option value="5">大学</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("gradeId")(
                    <Select allowClear placeholder="年级" showSearch onChange={this.gradeChange.bind(this)} disabled={this.state.disabled1}>
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("classId")(
                    <Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
                      {classOptions}
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
              <Col span={5} >
                <FormItem>
                  {getFieldDecorator("date",{initialValue:moment(this.state.date)})(
                    <DatePicker onChange={this.onChangeRange} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select placeholder="消费情况" allowClear>
                      <Option value='1' key=''>有</Option>
                      <Option value='0' key=''>无</Option>
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
export default connect(mapStateToProps)(Form.create()(ConsumeRecord));
