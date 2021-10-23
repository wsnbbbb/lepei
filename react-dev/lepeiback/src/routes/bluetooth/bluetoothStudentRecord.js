import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { formatDate, dateToTimestamp, getSexType, getGradeType, getResidence, getCheckType } from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class BluetoothStudentRecord extends Component {
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
      startTime: '',
      endTime: '',
      exportUrl: '',
      disabled: true,
      disabled1: true,
      isShow: false,
      flag: false,
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
      type: 'bluetooth/bluetoothStudentRecord',
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
        'inResidence': values.inResidence || '',
        'attendType': values.attendType || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
        "startTime": this.state.startTime || '',
        "endTime": this.state.endTime || ''
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
        'inResidence': values.inResidence || '',
        'attendType': values.attendType || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
        "startTime": this.state.startTime || '',
        "endTime": this.state.endTime || ''
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
      startTime: dateToTimestamp(dateString[0]),
      endTime: dateToTimestamp(dateString[1]),
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
      let inResidence = values.inResidence || '';
      let attendType = values.attendType || '';
      let startTime = this.state.startTime || '';
      let endTime = this.state.endTime || '';
      let url = portUrl("/manager/bluetooth-entry-data/student-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
      "&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&inResidence=" + inResidence + "&attendType=" + attendType + "&startTime=" + startTime + "&endTime=" + endTime)
      this.setState({ exportUrl: url })
    })
  }
  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: (record) => {
        return (<span>{getSexType(record)}</span>)
      }
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
      title: '读书形式',
      dataIndex: 'inResidence',
      render: (record) => {
        return (<span>{getResidence(record)}</span>)
      }
    }, {
      title: '出入时间',
      dataIndex: 'entryTime',
      render: (record) => {
        return (<span>{formatDate(record)}</span>)
      }
    }, {
      title: '地点',
      dataIndex: 'place'
    }, {
      title: '出入方式',
      dataIndex: 'entryType',
      render: (record) => {
        return (<span>{record == 1 ? "入" : "出"}</span>)
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (record) => {
        return (<span>{formatDate(record)}</span>)
      }
    },{
      title: '打卡方式',
      dataIndex: 'attendType',
      render: (record) => {
        return (<span>{record == 1 ? '自主打卡' : (record == 2 ? '老师补签' :'')}</span>)
      }
    }

    ];
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
      <div className="blue-tooth">
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="请输入学生姓名" />
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
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
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("gradeId")(
                    <Select allowClear placeholder="年级" showSearch onChange={this.gradeChange.bind(this)} disabled={this.state.disabled1}>
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("classId")(
                    <Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
                      {classOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("inResidence")(
                    <Select placeholder="读书形式" allowClear>
                      <Option value='' key=''>全部</Option>
                      <Option value='1' key=''>住读</Option>
                      <Option value='2' key=''>走读</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("attendType")(
                    <Select placeholder="打卡方式" allowClear>
                      <Option value='' key=''>全部</Option>
                      <Option value='1' key=''>自主打卡</Option>
                      <Option value='2' key=''>老师补签</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5} style={{ textAlign: 'right',paddingRight:'15px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col span={7} >
                <FormItem>
                  {getFieldDecorator("time")(
                    <RangePicker style={{ width: 380 }}
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={['开始时间', '结束时间']}
                      onChange={this.onChangeRange} />
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
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    commonData: state.user,
    gradeList: state.user.gradeNameData
  }
}
export default connect(mapStateToProps)(Form.create()(BluetoothStudentRecord));
