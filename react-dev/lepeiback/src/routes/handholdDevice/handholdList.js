import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, DatePicker, Row, Col, Icon, Menu, Dropdown, Modal, message } from 'antd';
import PageIndex from '../../components/page';
import { portUrl, getImg } from '../../utils/img';
import { getGradeType, getPersonType, getAttendType, getHoldCheckType, formatDate } from '../../utils/public';
import './style.less';
import ImgPreview from '../../components/imgPreview';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class HandholdList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      data: {},
      exportUrl: '',
      classValue: '',
      classId:'',
      previewVisible: false,
      licenceUrl: '',
      disabled:true,
      disabled1:true,
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20
    }
    this.getList(params)
  }

  // 考勤记录列表
  getList = (params) => {
    this.props.dispatch({
      type: 'handhold/getHandholdList',
      payload: params,
      callback: (res) => {
        console.log(res)
        if (res.code === 200) {
          this.setState({
            data: res.data
          })
        }
      }
    })
  }

  showImg = (url) => {
    this.setState({
      previewVisible: true,
      licenceUrl: getImg(url)
    })
  }
  closePreview = () => {
    this.setState({
      previewVisible: false
    })
  }

   // 学业阶段选择
  handleChange = (value) => {
    if (value) {
      this.setState({disabled1:false})
      this.props.dispatch({
        type: 'user/getGradeName',
        payload: { "type": value },
      })
    } else {
      this.setState({
        disabled1:true,
      })
    }
    this.props.form.resetFields(["gradeId"])
    this.setState({
      classValue: '',
      classId: '',
      disabled:true,
    })
  }

  // 年级选择
  gradeChange = (val) => {
    if (val) {
      this.setState({ disabled: false })
      const id = val.substring(val.lastIndexOf('-')+1, val.length)
      this.props.dispatch({
        type: 'user/getClassName',
        payload: { "gradeId": id|| "" },
      })
    } else {
      this.props.form.resetFields(["gradeId"])
      this.setState({ 
        disabled: true 
      })
    }
    this.setState({ 
      classValue: '', 
      classId: '', 
    })
  }

  // 班级选择
  classChange = (val) => {
    const value = val.substring(0, val.lastIndexOf('-'))
    const id = val.substring(val.lastIndexOf('-')+1, val.length)
    this.setState({
      classValue: value,
      classId: id
    })
  }

  // 时间选择
  onTimeChange = (date, dateString) => {
    const start = dateString[0] + " 00:00:00";
    const end = dateString[1] + " 23:59:59";
    this.setState({
      startTime: (new Date(start).getTime()) / 1000,
      endTime: (new Date(end).getTime()) / 1000
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        "personType": values.personType || '',
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": values.classId || '',
        "attendType": values.attendType || '',
        "startTime": this.state.startTime || "",
        "endTime": this.state.endTime || "",
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
        "personType": values.personType || '',
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": values.classId || '',
        "attendType": values.attendType || '',
        "startTime": this.state.startTime || "",
        "endTime": this.state.endTime || "",
      }
      this.getList(params)
    })
  }

  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let kw = values.kw || '';
      let personType = values.personType || '';
      let gradeType = values.gradeType || '';
      let gradeId = values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) || '';
      let classId = this.state.classId||'';
      let attendType = values.attendType || '';
      let startTime = this.state.startTime || "";
      let endTime = this.state.endTime || ""
      let url = portUrl("/manager/handheld-device-attends/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
        "&personType=" + personType + "&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&attendType=" + attendType + "&startTime=" + startTime
        + "&endTime=" + endTime)
      this.setState({ exportUrl: url })
    })
  }
  render() {
    const columns = [{
      title: '编号',
      dataIndex: 'id',
    }, {
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '人员类型',
      dataIndex: 'personType',
      render: (record) => {
        return (<span>{getPersonType(record)}</span>)
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
      title: '考勤模式',
      dataIndex: 'attendType',
      render: (record) => {
        return (<span>{getAttendType(record)}</span>)
      }
    }, {
      title: '照片',
      dataIndex: 'pic',
      render: (record) => {
        return (<span>{record ? <img src={getImg(record)} style={{ width: 60, height: 40, cursor: "pointer", margin: '0px 10px 10px 0px' }} onClick={this.showImg.bind(this, record)} /> : "无"}</span>)
      }
    }, {
      title: '考勤方式',
      dataIndex: 'checkType',
      render: (record) => {
        return (<span>{getHoldCheckType(record)}</span>)
      }
    }, {
      title: '考勤时间',
      dataIndex: 'attendTime',
      render: (record) => (
        <span>{formatDate(record)}</span>
      )
    }, {
      title: '设备登录ID',
      dataIndex: 'checkUserName',
    }];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    };
    const { data } = this.state;
    const { gradeList, commonData } = this.props;

    let options = []
    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option value={item.gradeName + '-' + item.gradeId} key={item.gradeId}>{item.gradeName}</Option>)
    })
    let classOptions = [];
    commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
      return classOptions.push(<Option key={item.classId} value={item.className + '-' + item.classId}>{item.className}</Option>)
    })

    return (
      <div className="content-main">
        <Form className="ant-advanced-search-form content-form">
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label=''>
                {getFieldDecorator('kw')(
                  <Search placeholder="学生姓名/教师姓名" />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'人员类型'}>
                {getFieldDecorator("personType", { initialValue: '' })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="1">学生</Option>
                    <Option value="2">教师</Option>
                    <Option value="3">员工</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'学业阶段'}>
                {getFieldDecorator("gradeType", { initialValue: '' })(
                  <Select onChange={this.handleChange.bind(this)}>
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
              <FormItem {...formItemLayout} label={'年级'}>
                {getFieldDecorator("gradeId", { initialValue: '' })(
                  <Select showSearch onChange={this.gradeChange.bind(this)} disabled={this.state.disabled1}>
                    <Option value="">全部</Option>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'班级'}>
                <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                  <Option value='' key=''>全部</Option>
                  {classOptions}
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'考勤模式'}>
                {getFieldDecorator("attendType", { initialValue: '' })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="1">签到</Option>
                    <Option value="2">签退</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label=''>
                <RangePicker onChange={this.onTimeChange} />
              </FormItem>
            </Col>
            <Col span={6}>
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        &nbsp;&nbsp;
                        {/* <Button type='primary' onClick={this.goToDetail.bind(this,1)}>导出</Button> */}
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
            </Col>
          </Row>
        </Form>
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={data.dataList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
        <ImgPreview
          visible={this.state.previewVisible}  // 是否可见
          onClose={this.closePreview} // 关闭事件
          src={this.state.licenceUrl} // 图片url
          picKey={"currentKey"} // 下载需要的key，根据自己需要决定
          isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
          isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
        >
        </ImgPreview>
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
export default connect(mapStateToProps)(Form.create()(HandholdList));
