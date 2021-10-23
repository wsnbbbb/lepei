/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,Button,Select,TreeSelect,DatePicker,Input,Icon } from 'antd';
import PageIndex from '../../components/page';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { withActivation } from 'react-activation'

const { SHOW_PARENT } = TreeSelect;
const { Option  } = Select;

@withActivation
class AdttendanceDetailsTeach extends Component{
  constructor(props) {
      super(props);
      this.state = {
        flag:false,
        stuData:{},
        page:1,
        pageSize:20,
        deptDataArrs: [],
      }
    }

    componentDidMount = () => {
      this.getAllDept();
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


    getAllDept = () => {
      let that = this;
      that.props.dispatch({
        type: "adttendanceDetails/getDepartmentTree",
        payload: {},
        callback: (res) => {
          if (res.code === 200) {
            let deptDataArrs = res.data;
            deptDataArrs.forEach((ele) => {
              ele.title = ele.departmentName;
              ele.value = ele.departmentId;
              ele.key = ele.departmentId;
              if(ele.children && ele.children.length > 0){
                that.getTreeChild(ele.children)
              }
            });
            that.setState({
              deptDataArrs
            });
          }
        },
      });
    };

    getTreeChild(childs){
      let that = this;
      childs.forEach(ele => {
        ele.title = ele.departmentName;
        ele.value = ele.departmentId;
        ele.key = ele.departmentId;
        if(ele.children && ele.children.length > 0){
          that.getTreeChild(ele.children);
        }
      })
    }

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
        type: 'adttendanceDetails/getDepartmentDailyDetailByPage',
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

    render(){
      const {stuData,deptDataArrs,flag} = this.state;
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
          title:"部门",
          dataIndex:"departmentName",
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

      const tProps = {
        treeData:deptDataArrs,
        treeDefaultExpandAll:true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder:'部门',
        style: {
          width: '100%',
        },
      };

      return (
        <div className="stu-statistics">
            <Form>
              <Row className="ant-row-fun" gutter={24}>
                <Col xl={{ span: 16, offset: 0 }}>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                        {getFieldDecorator("person", {
                          initialValue: "",
                        })(<Input style={{width:"220px"}} placeholder="姓名/ID"></Input>)}
                        &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("gradeId")(
                        <TreeSelect {...tProps} />)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }} >
                    <Form.Item>
                      {getFieldDecorator("hasLeave")(<Select placeholder="是否请假">
                        {/* <Option value="">全部</Option> */}
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }} >
                    <Form.Item>
                      {getFieldDecorator("status")(<Select placeholder="状态">
                        {/* <Option value="">全部</Option> */}
                        <Option value="-1">空</Option>
                        <Option value="1">异常</Option>
                        <Option value="0">正常</Option>
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
export default connect(mapStateToProps)(Form.create()(AdttendanceDetailsTeach));
