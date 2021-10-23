import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, message, Select, Form, DatePicker, Row, Col, Breadcrumb } from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import { Link } from 'dva/router';
import { portUrl } from '../../utils/img';
import { getGradeType } from '../../utils/public';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

class StatisticsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      data: {},
      exportUrl: '',
      classValue: '',
      classId: '',
      monthTime:moment().format('YYYY-MM'),
      disabled:true,
      disabled1:true,
			title:"数据统计",

    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
      "date": this.state.monthTime
    }
    this.getList(params)
    //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/student-style"
      },
      })
  }

  componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }

  // 统计列表
  getList = (params) => {
    this.props.dispatch({
      type: 'classSpace/getStatisticsList',
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
    console.log({dateString});
    this.setState({
      monthTime: dateString,
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      if(!values.date){
        return  message.error("请选择日期")
      }
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": this.state.classId || '',
        "date": this.state.monthTime,
      }
      this.getList(params)
    })
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "gradeType": values.gradeType || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId": this.state.classId || '',
        "date": this.state.monthTime,
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
      let gradeType = values.gradeType || '';
      let gradeId = values.gradeId || '';
      let classId = this.state.classId || '';
      let date = this.state.monthTime
      let url = portUrl("/manager/student-style/statistics-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + 
      "&gradeType=" + gradeType + "&gradeId=" + gradeId + "&classId=" + classId + "&date=" + date)
      this.setState({ exportUrl: url })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };
    const { data, monthTime } = this.state;
    const { gradeList, commonData } = this.props;

    const columns = [{
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
      title: '发表动态（次）',
      dataIndex: 'count',
    }];

    let options = []
    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option value={item.gradeName + '-' + item.gradeId} key={item.gradeId}>{item.gradeName}</Option>)
    })
    let classOptions = [];
    commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
      return classOptions.push(<Option key={item.classId} value={item.className + '-' + item.classId}>{item.className}</Option>)
    })

    return (
      <div className="content-main statistics-list">
         {/* <Breadcrumb>
            <Breadcrumb.Item><Link to="/student-style">学生风采</Link></Breadcrumb.Item>
            <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          </Breadcrumb> */}
        <Form className="ant-advanced-search-form content-form">
          <Row gutter={24}>
            <Col span={5}>
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
            <Col span={5}>
              <FormItem {...formItemLayout} label={'年级'}>
                {getFieldDecorator("gradeId", { initialValue: '' })(
                  <Select showSearch onChange={this.gradeChange.bind(this)} disabled={this.state.disabled1}>
                    <Option value="">全部</Option>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={'班级'}>
                <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                  <Option value='' key=''>全部</Option>
                  {classOptions}
                </Select>
              </FormItem>
            </Col>

            <Col span={4}>
              <FormItem label=''>
                {getFieldDecorator("date",{initialValue:moment(this.state.monthTime)})(
                  <MonthPicker onChange={this.onTimeChange} />
                )}
                </FormItem>
            </Col>
            <Col span={4}>
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;&emsp;
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
            </Col>
          </Row>
        </Form>
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={data.dataList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commonData: state.user,
    gradeList:state.user.gradeNameData
  }
}
export default connect(mapStateToProps)(Form.create()(StatisticsList));
