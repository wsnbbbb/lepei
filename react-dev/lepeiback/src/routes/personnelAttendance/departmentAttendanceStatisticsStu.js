/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,Button,Select,DatePicker } from 'antd';
import PageIndex from '../../components/page';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';
import { routerRedux } from 'dva/router';

const { Option  } = Select;

class PersonnelAttendanceStatisticsStu extends Component{
  constructor(props) {
      super(props);
      this.state = {
        stuData:{},
        page:1,
        pageSize:20,
        classDataArrs: [],
        gradeDataArrs:[],
        allGradeDataArrs:[],
      }
    }

    componentDidMount = () => {
      this.getGradeNameAll();
      let {page,pageSize} = this.state;
      this.getPageData({page,pageSize,day:moment().format("YYYY-MM-DD")});
    }

    getGradeNameAll = () => {
      let that = this;
      that.props.dispatch({
        type: "departmentAttenStatistics/getGradeName",
        payload: {},
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              allGradeDataArrs: res.data,
            });
          }
        },
      });
    };

    queryList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let pageSize = that.state.pageSize;
        const params = Object.assign({page:1,pageSize},values);
        params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
        that.getPageData(params);
        that.setState({
          page:1
        })
      })
    }

    resetQuery = () => {
      let that = this;
      let pageSize = that.state.pageSize;
      that.props.form.resetFields();
      that.getPageData({page:1,pageSize});
      that.setState({
        page:1,
        classDataArrs:[],
        gradeDataArrs:[],
      })
    }

    getPageData = (params) =>{
      let that = this;
      let keys = Object.keys(params);
      keys.forEach(ele => {
        if(!params[ele]){
          delete params[ele];
        }
      })
      this.props.dispatch({
        type: 'departmentAttenStatistics/getClassDailySurveyByPage',
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            let stuData = res.data;
            that.setState({
              stuData
            })
          }
        }
      })
    }

    export = () => {
      this.props.form.validateFields().then(values => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        const params = {...values};
        params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
        let classId = params.classId || '';
        let gradeId = params.gradeId || '';
        let academicStage = params.academicStage || '';
        let day = params.day || '';
        let url = portUrl("/manager/attendance/record/class-daily-survey-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&classId=" + classId +
            "&gradeId=" + gradeId + "&academicStage=" + academicStage + "&day=" + day)
        window.open(url,"_blank")
      })
    }

    onPageChange =  (current, size) => {
      let that = this;
      that.props.form.validateFields().then(values => {
        const params = Object.assign({page:current,pageSize:size},values);
        params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
        that.setState({ page: current, pageSize: size })
        that.getPageData(params);
      })
    }

    toDetail = (record) => {
      this.props.dispatch(routerRedux.push("/department-attendance-statistics-stu-detail?id="+record.classId))
    }

    stageChange = (val) => {
      if(val){
        let academicStage = val;
        let gradeDataArrs = this.state.allGradeDataArrs;
        gradeDataArrs = gradeDataArrs.filter(ty => ty.type + "" === academicStage);
        this.setState({gradeDataArrs})
      }else{
        this.setState({gradeDataArrs:[]})
      }
      this.props.form.resetFields(["gradeId","classId"]);
    }

    gradeChange = (val) => {
      if(val){
        let that = this;
        let gradeId = val;
        this.props.dispatch({
          type: 'departmentAttenStatistics/getClassName',
          payload: {gradeId},
          callback: (res) => {
            if (res.code === 200) {
              that.setState({
                classDataArrs: res.data
              })
            }
          }
        })
      }else{
        this.setState({classDataArrs:[]})
      }
      this.props.form.resetFields(["classId"]);
    }

    getRowIndex = (record,index) => {
      return index + "";
    }

    render(){
      const {stuData,gradeDataArrs,classDataArrs} = this.state;
      const { getFieldDecorator } = this.props.form;
      const dayFormat = 'YYYY年MM月DD日';
      let stuColumns = [
        {
          title:"学业阶段",
          dataIndex:"academicStage",
        },
        {
          title:"年级",
          dataIndex:"gradeName",
        },
        {
          title:"班级",
          dataIndex:"className",
        },
        {
          title:"应到人数",
          dataIndex:"dueNumber",
        },
        {
          title:"实到人数",
          dataIndex:"actualNumber",
        },
        {
          title:"出勤率",
          dataIndex:"attendRate",
          render: (text, record) => {
            return (<span>{text*100}%</span>)
          }
        },
        {
          title:"病假率",
          dataIndex:"sickLeaveRate",
          render: (text, record) => {
            return (<span>{text*100}%</span>)
          }
        },
        {
          title:"事假率",
          dataIndex:"absenceLeaveRate",
          render: (text, record) => {
            return (<span>{text*100}%</span>)
          }
        },{
          title: '操作',
          width: 100,
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.toDetail.bind(this,record)}>详情</a>
            </span>
          ),
        }
      ];

      let classArrs = [];
      classDataArrs.forEach((ele) => {
        classArrs.push(<Option key={ele.classId}>{ele.className}</Option>);
      });
      let gradeArrs = [];
      gradeDataArrs.forEach((ele) => {
        gradeArrs.push(<Option key={ele.gradeId}>{ele.gradeName}</Option>);
      });


      return (
        <div className="stu-statistics">
            <Form>
              <Row className="ant-row-fun" gutter={24}>
                <Col xl={{ span: 16, offset: 0 }}>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("academicStage")(<Select placeholder="学业阶段" onChange={this.stageChange}>
                        <Option key="1">幼儿园</Option>
                        <Option key="2">小学</Option>
                        <Option key="3">初中</Option>
                        <Option key="4">高中</Option>
                        <Option key="5">大学</Option>
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("gradeId")(<Select placeholder="年级" onChange={this.gradeChange} showSearch optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                        {gradeArrs}
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("classId", {})(<Select placeholder="班级" showSearch optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                        {classArrs}
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("day", {
                        initialValue: moment(),
                      })(<DatePicker placeholder="考勤日期" allowClear={false} format={dayFormat} style={{width:"220px"}}></DatePicker>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                </Col>
                <Col xl={{ span: 8, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                  <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
                  <Button type='primary' onClick={this.export.bind(this)}>导出</Button>&emsp;&emsp;
                </Col>
              </Row>
            </Form>
            <Table rowKey={this.getRowIndex} columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
            <div className="paginationBox">
              <PageIndex getPage={this.onPageChange.bind(this)} total={stuData.totalCount} totalPage={stuData.totalPage} currentPage={stuData.currentPage} />
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(PersonnelAttendanceStatisticsStu));
