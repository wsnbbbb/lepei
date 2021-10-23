/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,Button,Select,DatePicker,Input,Icon } from 'antd';
import PageIndex from '../../components/page';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { withActivation } from 'react-activation'

const { Option  } = Select;

@withActivation
class AdttendanceDetailsStu extends Component{
  constructor(props) {
      super(props);
      this.state = {
        flag:false,
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
      this.getPageData({page,pageSize,day:moment().subtract(1, 'days').format("YYYY-MM-DD")});
    }

    //路由状态返回，组件做些什么处理
    componentDidActivate = () => {
      console.log('AdttendanceDetailsStu: componentDidActivate');
      this.queryCurrentPageList();
    }
    //路由状态前进，组件做些什么处理
    componentWillUnactivate = () => {
      console.log('AdttendanceDetailsStu: componentWillUnactivate')
    }

    getGradeNameAll = () => {
      let that = this;
      that.props.dispatch({
        type: "adttendanceDetails/getGradeName",
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
    queryCurrentPageList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let pageSize = that.state.pageSize;
        let page = that.state.page;
        const params = Object.assign({page,pageSize},values);
        params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
        that.getPageData(params);
      });
    }

    resetQuery = () => {
      let that = this;
      let pageSize = that.state.pageSize;
      that.props.form.resetFields();
      that.getPageData({page:1,pageSize});
      that.setState({
        page:1
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
        type: 'adttendanceDetails/getClassDailyDetailByPage',
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              stuData: res.data
            })
          }
        }
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

    toggle = () =>{
      this.setState({flag: !this.state.flag});
    }

    toDetail = (record) => {
      this.props.dispatch(routerRedux.push("/adttendance-person-details?personId="+record.personId))
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
          type: 'adttendanceDetails/getClassName',
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

    render(){
      const {stuData,gradeDataArrs,classDataArrs,flag} = this.state;
      const { getFieldDecorator } = this.props.form;
      const dayFormat = 'YYYY年MM月DD日';
      let stuColumns = [
        {
          title:"人员ID",
          dataIndex:"personId",
        },
        {
          title:"姓名",
          dataIndex:"personName",
        },
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
          title:"请假",
          dataIndex:"isLeave",
          render: (text, record) => (
            <span>
              {record.isLeave + "" === "1" ? "是" : "否" }
            </span>
          ),
        },
        {
          title:"状态",
          dataIndex:"status",
          render: (text, record) => {
            let desc = "";
            if(record.status + "" === "0"){
              desc = "正常"
            } else if(record.status + "" === "1"){
              desc = "异常"
            }
            return (
            <span>
              {desc}
            </span>
          )},
        },
        {
          title:"说明",
          dataIndex:"notSignIn",
          width:500,
          render: (text, record) => {
            let lateMinute = record.late && record.late > 0 ? record.late % 60 : 0;
            let leaveEarlyMinute = record.leaveEarly && record.leaveEarly > 0 ? record.late % 60 : 0;
            let str = "";
            if(record.notSignIn && record.notSignIn > 0){
              str += `未签到${record.notSignIn}次、`;
            }
            if(record.notSignOut && record.notSignOut > 0){
              str += `未签退${record.notSignOut}次、`;
            }
            if(lateMinute > 0){
              str += `迟到${lateMinute}分钟、`;
            }
            if(leaveEarlyMinute > 0){
              str += `早退${leaveEarlyMinute}分钟、`;
            }
            if(str){
              str = str.substring(0,str.length - 1);
            }
            return (
            <span>
              {str}
            </span>
          )},
        },
        {
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
                      {getFieldDecorator("person", {
                        initialValue: null,
                      })(<Input style={{width:"220px"}} placeholder="姓名/ID"></Input>)}
                      &emsp;&emsp;
                  </Form.Item>
                </Col>
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
                <Col xl={{ span: 6, offset: 0 }}  style={{ display: flag ? 'block' : 'none' }}>
                  <Form.Item>
                    {getFieldDecorator("day", {
                      initialValue: moment().subtract(1, 'day'),
                    })(<DatePicker placeholder="考勤日期" allowClear={false} format={dayFormat} style={{width:"220px"}}></DatePicker>)}
                    &emsp;&emsp;
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 0 }}  style={{ display: flag ? 'block' : 'none' }}>
                  <Form.Item>
                    {getFieldDecorator("hasLeave")(<Select placeholder="是否请假">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>)}
                    &emsp;&emsp;
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 0 }}  style={{ display: flag ? 'block' : 'none' }}>
                  <Form.Item>
                    {getFieldDecorator("status")(<Select placeholder="状态">
                        <Option value="-1">空</Option>
                      <Option value="1">异常</Option>
                      <Option value="0">正常</Option>
                    </Select>)}
                    &emsp;&emsp;
                  </Form.Item>
                </Col>
              </Col>
              <Col xl={{ span: 8, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} style={{marginLeft:"5px"}} /></span>
              </Col>
            </Row>
          </Form>
          <Table rowKey="personId" columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
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
export default connect(mapStateToProps)(Form.create()(AdttendanceDetailsStu));
