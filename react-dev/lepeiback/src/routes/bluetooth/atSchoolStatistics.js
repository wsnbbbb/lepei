import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Select, Form, Row, Col, Breadcrumb, Modal } from 'antd';
import PageIndex from '../../components/page';
import echarts from 'echarts';
import { dateToTimestamp, getSexType, getGradeType, getPersonType } from '../../utils/public';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AtSchoolStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      data: {},
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
    this.statisticsPerson()
  }

  // 统计人数
  statisticsPerson = (params) => {
    this.props.dispatch({
      type: 'bluetooth/atSchoolStatisticsPerson',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let chartData = [
            res.data.inSchoolCount > 0 ? {name:"在校",value:res.data.inSchoolCount}:null,
            res.data.outSchoolCount > 0 ? { name: "不在校", value: res.data.outSchoolCount } : null
          ]
          let totalCount = res.data.totalCount
          const atSchoolChart = echarts.init(document.getElementById('atSchoolChart'));
          atSchoolChart.setOption({
            color: ["#7DC856", "#2DB7F5"],
            graphic:{       //图形中间文字
              type:"text",
              left:"center",
              top:"center",
              style:{
                text: `${totalCount}\n\r总人数（人）`,
                textAlign:"center",
                fill:"#959595",
                fontSize:20,
              }
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              y: '40',
              data: ['在校', '不在校'],
              icon: "circle",
            },
            series: [
              {
                type: 'pie',
                radius: ['50%', '70%'],
                data: chartData,
                label: {
                  normal: {
                    formatter: '{b}： {d}% {c}人',
                    fontSize:16,
                  },
                },
              }
            ]
          })
        }
      }
    })
  }
  // 获取列表
  getList = (params) => {
    this.props.dispatch({
      type: 'bluetooth/schoolListData',
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
        'personType': values.personType || '',
        'isInSchool': values.isInSchool || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
      }
      const params1 = {
        'personType': values.personType || '',
        'isInSchool': values.isInSchool || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
      }
      this.getList(params)
      this.statisticsPerson(params1)
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
        'personType': values.personType || '',
        'isInSchool': values.isInSchool || '',
        'gradeType': values.gradeType || '',
        "gradeId": values.gradeId || '',
        "classId": values.classId || '',
      }
      this.getList(params)
    })
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
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
    },{
      title: '状态',
      dataIndex: 'isInSchool',
      render: (record) => {
        return (<span>{record == 0 ? '否' : (record == 1 ? '是' :'')}</span>)
      }
    }];
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
          {/* 查询条件 */}
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("personType")(
                    <Select placeholder="人员类型" allowClear>
                      <Option value='1' key=''>学生</Option>
                      <Option value='2' key=''>教师</Option>
                      <Option value='3' key=''>员工</Option>
                    </Select>
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
              <Col span={3}>
                <FormItem>
                  {getFieldDecorator("isInSchool")(
                    <Select placeholder="是否在校" allowClear>
                      <Option value='0' key=''>否</Option>
                      <Option value='1' key=''>是</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'right',paddingRight:'15px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>
              </Col>
            </Row>
          </Form>
          {/* 统计 */}
          <div>
            <div className="title">
              <h3>统计</h3>
            </div>
            <div id="atSchoolChart" className="atSchoolChart" style={{ width: "45%", height: 300 }}></div>
          </div>
          <div className="title">
            <h3>列表</h3>
          </div>
          <Table className='content-table statistics-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false} />
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
export default connect(mapStateToProps)(Form.create()(AtSchoolStatistics));
