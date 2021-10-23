import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, DatePicker, Row, Col, Modal, message } from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import echarts from 'echarts';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;

class HandheldStatistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      data: {},
      classId: '',
      classValue: '',
      totalCount: '',
      signInCount: '',
      signOutCount: '',
      unSignInCount: '',
      unSignOutCount: '',
      disabled: true,
      disabled1: true,
      date: moment().format('YYYY-MM-DD')
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
      "personType": 1,
      "date": this.state.date,
    }
    const params1 = {
      "personType": 1,
      "date": this.state.date,
      "signInType": -1,
      "signOutType": -1,
    }
    this.getList(params)
    this.statisticsPerson(params1)

  }

  // 统计人数
  statisticsPerson = (params) => {
    this.props.dispatch({
      type: 'handhold/statisticsPerson',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          // this.setState({
          //   totalCount: res.data.totalCount,
          //   signInCount: res.data.signInCount,
          //   signOutCount: res.data.signOutCount,
          //   unSignInCount: res.data.unSignInCount,
          //   unSignOutCount: res.data.unSignOutCount,
          // })
          let signData = [
            // { name: "已签到", value: 898 },
            res.data.signInCount > 0 ? {name:"已签到",value:res.data.signInCount}:null,
            res.data.unSignInCount > 0 ? { name: "未签到", value: res.data.unSignInCount } : null
          ]
          let signOutData = [
            // { name: "已签退", value: 300 },
            res.data.signOutCount > 0 ? {name:"已签退",value:res.data.signOutCount}:null,
            res.data.unSignOutCount > 0 ? { name: "未签退", value: res.data.unSignOutCount } : null
          ]
          let totalCount = res.data.totalCount
          const signChart = echarts.init(document.getElementById('signChart'));
          const signOutChart = echarts.init(document.getElementById('signOutChart'));
          signChart.setOption({
            title:
            {
              text: `签到情况(总人数${totalCount}人)`
            },
            color: ["#61A0A8", "#C1C1C1"],
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              y: '50',
              data: ['已签到', '未签到'],
              icon: "circle",
            },
            series: [
              {
                name: '签到情况',
                type: 'pie',
                data: signData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
          signOutChart.setOption({
            title:
            {
              text: `签退情况(总人数${totalCount}人)`
            },
            color: ["#FF9F7F", "#C1C1C1"],
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              y: '50',
              data: ['已签退', '未签退'],
              icon: "circle",
            },
            series: [
              {
                name: '签退情况',
                type: 'pie',
                data: signOutData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        }
      }
    })
  }
  // 统计列表
  getList = (params) => {
    this.props.dispatch({
      type: 'handhold/handStatistics',
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
    this.props.form.resetFields(["gradeId"])
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
      const id = val.substring(val.lastIndexOf('-')+1, val.length)
      this.props.dispatch({
        type: 'user/getClassName',
        payload: { "gradeId": id || "" },
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

  // 日期选择 
  onTimeChange = (date, dateString) => {
    this.setState({
      date: dateString
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      if (!values.date) {
        return message.error("请选择日期")
      }
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "personType": values.personType,
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": this.state.classId || '',
        "date": this.state.date,
        "signInType": values.signInType,
        "signOutType": values.signOutType,
      }
      const params1 = {
        "personType": values.personType,
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": this.state.classId || '',
        "date": this.state.date,
        "signInType": values.signInType,
        "signOutType": values.signOutType,
      }
      // console.log({params});
      // console.log({params1});
      this.getList(params)
      this.statisticsPerson(params1)
    })
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "personType": values.personType,
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": this.state.classId || '',
        "date": this.state.date,
        "signInType": values.signInType,
        "signOutType": values.signOutType,
      }
      this.getList(params)
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    let timestamp = (new Date()).getTime();
    const { data, totalCount, signInCount, signOutCount, unSignInCount, unSignOutCount, date } = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '人员类型',
      dataIndex: 'personType',
    }, {
      title: '学业阶段',
      dataIndex: 'gradeType',
    }, {
      title: '年级',
      dataIndex: 'gradeName',
    }, {
      title: '班级',
      dataIndex: 'className',
    }, {
      title: '签到',
      dataIndex: 'hasSignIn',
      render: (record) => (
        <span className={!record ? "redText" : ""}>{record ? '是' : '否'}</span>
      )
    }, {
      title: '签退',
      dataIndex: 'hasSignOut',
      render: (record) => (
        <span className={!record ? "redText" : ""}>{record ? '是' : '否'}</span>
      )
    }];

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
              <FormItem {...formItemLayout} label={'人员类型'}>
                {getFieldDecorator("personType", { initialValue: '1' })(
                  <Select>
                    <Option value="1">学生</Option>
                    <Option value="2">教师</Option>
                    <Option value="3">员工</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label=''>
                {getFieldDecorator("date", { initialValue: moment(timestamp) })(
                  <DatePicker onChange={this.onTimeChange} />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'签到'}>
                {getFieldDecorator("signInType", { initialValue: '-1' })(
                  <Select>
                    <Option value="-1">全部</Option>
                    <Option value="0">未签到</Option>
                    <Option value="1">已签到</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label={'签退'}>
                {getFieldDecorator("signOutType", { initialValue: '-1' })(
                  <Select >
                    <Option value="-1">全部</Option>
                    <Option value="0">未签退</Option>
                    <Option value="1">已签退</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className="charts">
          <div id="signChart" style={{ width: "45%", height: 300 }}></div>
          <div id="signOutChart" style={{ width: "45%", height: 300 }}></div>
        </div>
        {/* <div className="attends-statistics">
          <div className="data-box1">
                <p className="title">总人数：<span>{totalCount}</span></p>
          </div>
          <div className="data-box2">
            <span className="mr-20">签到：{signInCount}</span>
            <span>未签到：<span className="redText">{unSignInCount}</span></span>
          </div>
          <div className="data-box2">
            <span className="mr-20">签退：{signOutCount}</span>
            <span>未签退：<span className="redText">{unSignOutCount}</span></span>
          </div>
        </div> */}
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={data.dataList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
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
export default connect(mapStateToProps)(Form.create()(HandheldStatistical));
