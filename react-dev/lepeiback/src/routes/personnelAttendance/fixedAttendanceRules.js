/**
 * 固定班制考勤规则-route
 */
import React,{Component} from 'react';
import { Table,Form,Tabs ,Row, Col,Button,Modal } from 'antd';

import { connect } from 'dva';
import './style.less';
// const FormItem = Form.Item;

import FixedAttendanceRulesStuEdit  from"../personnelAttendance/fixedAttendanceRulesStuEdit";
import FixedAttendanceRulesTeachEdit  from"../personnelAttendance/fixedAttendanceRulesTeachEdit";
import FixedAttendanceWarnRulesEdit  from"../personnelAttendance/fixedAttendanceWarnRulesEdit";


const { confirm } = Modal;
const { TabPane  } = Tabs;

class fixedAttendanceRules extends Component{
  constructor(props) {
      super(props);
      this.state = {
        stuData:[],
        teachData:[],
        ruleDetail:{},
      }
    }

    componentDidMount = () => {
      this.getFixRuleList({type:"1"});
      this.getFixRuleList({type:"2"});
    }
    // 规则列表查询
    getFixRuleList = (params) => {
      let _this = this
      this.props.dispatch({
          type: 'fixAttendance/getFixRuleList',
          payload: params,
          callback: (res) => {
              if (res.code === 200) {
                if(params.type === "1"){
                  let stuData = res.data
                  _this.setState({
                    stuData
                  })
                }else if(params.type === "2"){
                  let teachData = res.data
                  _this.setState({
                    teachData
                  })
                }
              }
          }
      })
    }
    refreshData = (type) => {
      let params = {
        type,
      }
      this.getFixRuleList(params);
    }

    ruleStuAdd = (id) => {
      let mode = 'add';
      if(id) mode = 'mod'
      this.fixedAttendanceRulesStuEdit.handleShow(id,mode);
    };
    ruleTeachAdd = (id) => {
      let mode = 'add';
      if(id) mode = 'mod'
      this.fixedAttendanceRulesTeachEdit.handleShow(id,mode);
    };
    ruleWarnAdd = () => {
      this.fixedAttendanceWarnRulesEdit.handleShow();
    };

    ruleDelete = (id,type) => {
      let that = this
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let params = {id:id}
          that.props.dispatch({
            type: 'fixAttendance/deleteFixRule',
            payload: params,
            callback: (res) => {
              if (res.code === 200) {
                that.refreshData(type);
              }
            }
          });
        },
        onCancel() {
        },
      });
    };

    render(){
      const { stuData,teachData} = this.state;
      let stuColumns = [
        {
          title: '名称',
          dataIndex: 'name',
          width:200,
        },
        {
          title: '适用班级',
          dataIndex: 'group',
        },
        {
          title: '考勤时间段',
          dataIndex: 'attendancePeriod',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width:200,
        },{
          title: '操作',
          width: 120,
          render: (text, record) => (
            <span>
              <a onClick={this.ruleStuAdd.bind(this,record.id)}>编辑</a> &nbsp;&nbsp;&nbsp;&nbsp;
              <a target="" rel="noopener noreferrer" onClick={this.ruleDelete.bind(this, record.id,"1")}>删除</a>
            </span>
          ),
        }
      ];
      let teachColumns = [
        {
          title: '名称',
          dataIndex: 'name',
          width:200,
        },
        {
          title: '部门',
          dataIndex: 'group',
        },
        {
          title: '考勤时间段',
          dataIndex: 'attendancePeriod',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width:200,
        },{
          title: '操作',
          width: 120,
          render: (text, record) => (
            <span>
              <a onClick={this.ruleTeachAdd.bind(this,record.id)}>编辑</a> &nbsp;&nbsp;&nbsp;&nbsp;
              <a target="" rel="noopener noreferrer" onClick={this.ruleDelete.bind(this, record.id,"2")}>删除</a>
            </span>
          ),
        }
      ];
      return (
        <div className="content-main content-box">
          <Tabs defaultActiveKey="1">
            <TabPane tab="学生" key="1">
                <Row className="ant-row-fun" gutter={24}>
                  <Col xl={{ span: 9, offset: 0 }}>
                    <Button type='primary' onClick={this.ruleStuAdd.bind(this,null,"add")}>添加</Button>&emsp;
                    <Button type='primary' onClick={this.ruleWarnAdd.bind(this)}>预警功能配置</Button>&emsp;
                  </Col>
                </Row>
                <Table rowKey="id" columns={stuColumns} dataSource={stuData} pagination={false} />
                <FixedAttendanceRulesStuEdit refreshData={this.refreshData} onRef={(ref)=>{ this.fixedAttendanceRulesStuEdit = ref }}></FixedAttendanceRulesStuEdit>
                <FixedAttendanceWarnRulesEdit onRef={(ref)=>{ this.fixedAttendanceWarnRulesEdit = ref }}></FixedAttendanceWarnRulesEdit>
            </TabPane>
            <TabPane tab="教职工" key="2">
                <Row className="ant-row-fun" gutter={24}>
                  <Col xl={{ span: 9, offset: 0 }}>
                    <Button type='primary' onClick={this.ruleTeachAdd.bind(this,null)}>添加</Button>&emsp;
                  </Col>
                </Row>
                <Table rowKey="id" columns={teachColumns} dataSource={teachData} pagination={false} />
                <FixedAttendanceRulesTeachEdit refreshData={this.refreshData} onRef={(ref)=>{ this.fixedAttendanceRulesTeachEdit = ref }}></FixedAttendanceRulesTeachEdit>
            </TabPane>
          </Tabs>
        </div>
      )
    }
  }

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(fixedAttendanceRules));
