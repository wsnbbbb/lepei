/**
 * 排班制考勤规则
 */
import React,{Component} from 'react';
import { Table,Form,Breadcrumb,Row, Col,Button,Modal,DatePicker,Select,Input } from 'antd';

import { portUrl } from '../../utils/img';

import { connect } from 'dva';
import './style.less';

import moment from 'moment';

import SchedulAttendanceRulesEdit from "../personnelAttendance/schedulAttendanceRulesEdit"
import SchedulAttendanceRulesImp from "../personnelAttendance/schedulAttendanceRulesImp"

const {MonthPicker} = DatePicker;
const { confirm } = Modal;
const { Option } = Select;

class SchedulAttendanceRules extends Component{
  constructor(props) {
      super(props);
      this.state = {
        stuData:[],
        teachData:[],
        ruleDetail:{},
        schedulData:{},
        qryMonth:moment().format("yyyy-MM"),
        exportUrl:"",
        rulesData:[],
        editSinglevisible:false,
        ruleModData:{
          code:"",
          personId:"",
          date:"",
          times:"",
          alias:"",
        }
      }
    }

    componentDidMount = () => {
      let params = {
        month:this.state.qryMonth
      }
      this.getFixRuleList(params);
      this.getScheduleRuleDetail();
    }
    // 规则列表查询
    getFixRuleList = (params) => {
      let that = this
      this.props.dispatch({
          type: 'scheduleRule/getAttendanceScheduleList',
          payload: params,
          callback: (res) => {
              if (res.code === 200) {
                let schedulData = res.data
                that.setState({
                  schedulData
                })
              }
          }
      })
    }

    getScheduleRuleDetail = () => {
      let that = this;
      that.props.dispatch({
        type: "scheduleRule/getAttendanceScheduleRule",
        payload:{ },
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              rulesData:res.data
            });
          }
        },
      });
    };

    setQryMonth = (date) => {
      this.setState({
        qryMonth:date.format("yyyy-MM")
      })
    }
    refreshData = () => {
      let params = {
        month:this.state.qryMonth
      }
      this.getFixRuleList(params);
    }
    refreshRuleData = () => {
      this.getScheduleRuleDetail();
    }

    ruleDelete = (personId) => {
      let that = this
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let params = {
            id:personId,
            date:that.state.qryMonth
          }
          that.props.dispatch({
            type: 'scheduleRule/deleteScheduleRuleByPerson',
            payload: params,
            callback: (res) => {
              if (res.code === 200) {
                that.refreshData();
              }
            }
          });
        },
        onCancel() {
        },
      });
    }

    querySchedul = () => {
      let params = {
        month:this.state.qryMonth
      }
      this.getFixRuleList(params);
    }
    toEditSingle = (record,day) =>{
      const { month,year} = this.state.schedulData;
      const rulesData = this.state.rulesData;
      let ruleData = rulesData.filter(ele => ele.code === record[month+"."+day]);
      if(ruleData.length > 0){
        ruleData = ruleData[0];
      }else{
        return;
      }

      let date = new Date();
      date.setFullYear(year,month-1,day);
      date.setHours(0,0,0,0);
      let modDate = moment(date).format("YYYY-MM-DD");
      this.setState({
        editSinglevisible:true,
        ruleModData:{
          times:(ruleData.startTime || "") + " - " + (ruleData.endTime || ""),
          alias:ruleData.alias,
          date:modDate,
          personId:record.personId,
          code:record[month+"."+day]
        }
      })

    }
    toSchelulEdit = () =>{
      this.schedulAttendanceRulesEdit.handleShow(this.state.rulesData);
    }
    impSchedul = () => {
      this.schedulAttendanceRulesImp.handleShow();
    }
    // 导出
    export=()=>{
      let qryMonth = this.state.qryMonth;
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let url=portUrl("/manager/attendance/personal-schedule/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&month="+qryMonth)
      this.setState({exportUrl:url});
    }

    handleCancelSingle = () =>{
      this.props.form.resetFields();
      this.setState({
        editSinglevisible:false
      })
    }

    handleSaveSingle = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let ruleModData = that.state.ruleModData;
        ruleModData.code = values.code;
        delete ruleModData.alias;
        delete ruleModData.times;
        ruleModData.id = ruleModData.personId;
        that.props.dispatch({
          type: "scheduleRule/setScheduleRuleByPerson",
          payload:ruleModData,
          callback: (res) => {
            if (res.code === 200) {
              that.refreshData();
              that.handleCancelSingle();
            }
          }
        })
      });
    }

    getTableData(){
      const { schedulData } = this.state;
      const {startDay = 0,endDay = 0 , month,year} = schedulData;
      let dayColumns = [];

      let that = this;
      let className = "schedul-column-disable";
      let now = new Date();
      now.setHours(0,0,0,0);

      for(let i = 1;i <= endDay;i++){
        if(i >= startDay){
          let colDate = new Date();
          colDate.setFullYear(year,month-1,i);
          colDate.setHours(0,0,0,0);
          dayColumns.push({
            title:month+"."+i,
            dataIndex:month+"."+i,
            className:colDate.getTime()<=now.getTime()?className:"",
            onCell:(record ) => {
              return {
                onDoubleClick: event => {
                  if(colDate.getTime()>now.getTime()){
                    that.toEditSingle(record,i)
                  }
                }
              }
            }
          })
        }
      }
      let schedulColumns = [
        {
          title: '编号',
          dataIndex: 'personId',
          width:120,
          fixed: 'left',
        },
        {
          title: '姓名',
          dataIndex: 'personName',
          width:120,
          fixed: 'left',
        }
      ];
      let operatColumns = [{
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span>
            <a target="" rel="noopener noreferrer" onClick={this.ruleDelete.bind(this, record.personId)}>删除</a>
          </span>
        ),
      }];
      schedulColumns = [...schedulColumns,...dayColumns,...operatColumns];

      let tableData = [];
      if(schedulData.schedule){
        schedulData.schedule.forEach(ele => {
          let obj = {
            personId:ele.personId,
            personName:ele.personName
          };
          for(let i = 1;i<=endDay;i++){
            if(i >= startDay){
              obj[month+"."+i] = ele.schedule[i] || "休";
            }
          };
          tableData.push(obj);
        })
      }
      return {schedulColumns,schedulData:tableData}
    }

    getEditSingleHtml(){
      const {editSinglevisible,ruleModData} = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
      let abcs = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
      let codeOptions = [];
      abcs.forEach(ele => {
        codeOptions.push(<Option key={ele}>{ele}</Option>)
      })
      return (
        <Modal
          title="修改班次"
          visible={editSinglevisible}
          keyboard={false}
          maskClosable={false}
          width="500px"
          onOk={this.handleSaveSingle}
          okText="保存"
          onCancel={this.handleCancelSingle}
        >
          <Form>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item {...formItemLayout} label="班次代号">
                  {getFieldDecorator("code", {
                    initialValue: ruleModData.code || "",
                    rules: [{ required: true, message: "请选择班次代号" },],
                  })(
                    <Select>
                      {codeOptions}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item {...formItemLayout} label="考勤时间段">
                    <Input value={ruleModData.times} disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item {...formItemLayout} label="别名">
                    <Input value={ruleModData.alias} disabled></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    render(){
      let tableData = this.getTableData();
      let editSingleHtml = this.getEditSingleHtml();
      const monthFormat = 'YYYY年MM月';
      return (
        <div className="content-main content-box">
          <Row className="ant-row-fun" gutter={24}>
            <Col xl={{ span: 12, offset: 0 }}>
              <MonthPicker defaultValue={moment(this.state.qryMonth,"yyyy-MM")} format={monthFormat} allowClear={false} onChange={this.setQryMonth.bind(this)} ></MonthPicker>&emsp;
              <Button type='primary' onClick={this.querySchedul.bind(this)}>查询</Button>&emsp;
            </Col>
            <Col xl={{ span: 12, offset: 0 }} style={{textAlign:"right"}}>
              <Button type='primary' onClick={this.impSchedul.bind(this,null,"add")}>导入班表</Button>&emsp;
              <Button type='primary' href={this.state.exportUrl} onClick={this.export.bind(this)}>导出班表</Button>&emsp;
              <Button type='primary' onClick={this.toSchelulEdit.bind(this)}>班次管理</Button>&emsp;
            </Col>
          </Row>
          <Table rowKey="personId" bordered columns={tableData.schedulColumns} dataSource={tableData.schedulData} pagination={false} scroll={{ x: 2300 }} />
          <SchedulAttendanceRulesEdit refreshRuleData={this.refreshRuleData.bind(this)} onRef={(ref)=>{ this.schedulAttendanceRulesEdit = ref }}></SchedulAttendanceRulesEdit>
          <SchedulAttendanceRulesImp refreshData={this.refreshData.bind(this)} onRef={(ref)=>{ this.schedulAttendanceRulesImp = ref }}></SchedulAttendanceRulesImp>
          {editSingleHtml}
        </div>
      )
    }
  }

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(SchedulAttendanceRules));


