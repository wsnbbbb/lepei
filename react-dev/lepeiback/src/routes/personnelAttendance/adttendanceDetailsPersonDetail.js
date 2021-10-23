/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,Button,DatePicker,Breadcrumb,Modal,Select } from 'antd';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { getQueryString} from '../../utils/public';

const {Option} = Select;
const {MonthPicker} = DatePicker;

class AdttendanceDetailsPersonDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
        history: require("history").createHashHistory,
        visible:false,
        personId:"",
        stuData:[],
        formData:{},
        month:moment().format("YYYY-MM"),
        title:"人员考勤明细",
      }
    }

    componentDidMount = () => {
      let that = this;
      const personId = getQueryString("personId");
      that.setState({personId})
      setTimeout(() => {
        that.getPageData({month:moment().format("YYYY-MM")});
      },300);

      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/adttendance-details"
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
    monthChange = (value) =>{
      let month = value.format("YYYY-MM");
      this.setState({
        month
      })

      //业务操作，需要改变面包屑标题
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title + "-" + month,
          parentRoute:"/adttendance-details"
        },
      })
    }

    queryList = () => {
      const params = {month:this.state.month};
      this.getPageData(params);
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
        type: 'adttendanceDetails/getPersonalMonthDaily',
        payload: Object.assign({personId:that.state.personId},params),
        callback: (res) => {
          if (res.code === 200) {
            let data = res.data || [];
            data.forEach(ele => {
              if(ele.timeSlots && ele.timeSlots.length > 0){
                that.getTimeSlotsData(ele,0);
                if(ele.timeSlots.length > 1){
                  that.getTimeSlotsData(ele,1);
                }
                if(ele.timeSlots.length > 2){
                  that.getTimeSlotsData(ele,2);
                }
              }else{
                ele.timeSlots1 = null;
                ele.timeSlots2 = null;
                ele.timeSlots3 = null;
              }
            })
            that.setState({
              stuData: data
            })
          }
        }
      })
    }

    getHoursMinute = (minute) => {
      if(minute < 60){
        return `${minute}分钟`;
      }
      let hours = parseInt(minute / 60 , 0);
      let subMinute = minute - (hours * 60);
      return `${hours}小时${subMinute}分钟`;
    }

    getTimeSlotsData = (ele,index) => {
      let timeSlots = ele.timeSlots[index];
      ele["timeSlots" + (index + 1)] = {};
      if(timeSlots.signInStatus + "" === "0"){
        //签到异常
        if(!timeSlots.realSignInTime){
          //未签到
          ele["timeSlots" + (index + 1)]["inTime"] = null;
          ele["timeSlots" + (index + 1)]["inTimes"] = null;
          ele["timeSlots" + (index + 1)]["inStatus"] = "0";
        } else if(timeSlots.realSignInTime > timeSlots.shouldSignInTime){
          //迟到
          let inTimes = parseInt((timeSlots.realSignInTime - timeSlots.shouldSignInTime)  / 60 , 0);
          ele["timeSlots" + (index + 1)]["inTime"] = timeSlots.realSignInTime;
          ele["timeSlots" + (index + 1)]["inTimes"] = inTimes;
          ele["timeSlots" + (index + 1)]["inStatus"] = "0";
        }else{
          ele["timeSlots" + (index + 1)]["inTime"] = timeSlots.realSignInTime;
          ele["timeSlots" + (index + 1)]["inTimes"] = 0;
          ele["timeSlots" + (index + 1)]["inStatus"] = "1";
        }
      }else{
        //签到正常
        ele["timeSlots" + (index + 1)]["inTime"] = timeSlots.realSignInTime;
        ele["timeSlots" + (index + 1)]["inTimes"] = 0;
        ele["timeSlots" + (index + 1)]["inStatus"] = "1";
      }

      if(timeSlots.signOutStatus + "" === "0"){
        //签退异常
        if(!timeSlots.realSignOutTime){
          //未签退
          ele["timeSlots" + (index + 1)]["outTime"] = null;
          ele["timeSlots" + (index + 1)]["outTimes"] = null;
          ele["timeSlots" + (index + 1)]["outStatus"] = "0";
        } else if(timeSlots.realSignOutTime < timeSlots.shouldSignOutTime){
          //早退
          let outTimes = parseInt((timeSlots.shouldSignOutTime-timeSlots.realSignOutTime) / 60 , 0);
          ele["timeSlots" + (index + 1)]["outTime"] = timeSlots.realSignOutTime;
          ele["timeSlots" + (index + 1)]["outTimes"] = outTimes;
          ele["timeSlots" + (index + 1)]["outStatus"] = "0";
        }else{
          ele["timeSlots" + (index + 1)]["outTime"] = timeSlots.realSignOutTime || null;
          ele["timeSlots" + (index + 1)]["outTimes"] = 0;
          ele["timeSlots" + (index + 1)]["outStatus"] = "1";
        }
      }else{
        //签退正常
        ele["timeSlots" + (index + 1)]["outTime"] = timeSlots.realSignOutTime || null;
        ele["timeSlots" + (index + 1)]["outTimes"] = 0;
        ele["timeSlots" + (index + 1)]["outStatus"] = "1";
      }
    }

    toDealEx = (record) => {
      this.setState({
        visible:true,
        formData:record
      })
    }

    handleSave = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let formData = that.state.formData;
        let params = [];
        values.ids.forEach((ele,index) => {
          if(ele === "1"){
            params.push(formData.timeSlots[index].id + "");
          }
        })
        that.props.dispatch({
          type: 'adttendanceDetails/updatePersonalMonthDaily',
          payload: {id:params.join(",")},
          callback: (res) => {
            if (res.code === 200) {
              that.queryList();
              that.handleCancel();
            }
          }
        });
      });

    }
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible:false
      })
    }

    goback = () => {
      this.state.history().goBack();
    }

    render(){
      const {stuData,visible,month,title} = this.state;
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
      const monthFormat = 'YYYY年MM月';
      let stuColumns = [
        {
          title:"日期",
          dataIndex:"day",
        },
        {
          title:"请假",
          dataIndex:"leave",
        },
        {
          title:"时段1",
          dataIndex:"timeSlots1",
          render: (text, record) => {
            if(!record.timeSlots1){
              return null;
            }
            let notIn = null;
            let notOut = null;
            if(record.timeSlots1.inStatus === "0" && !record.timeSlots1.inTime){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>未签到&emsp;</span>);
            }
            else if(record.timeSlots1.inStatus === "1" && record.timeSlots1.inTime && record.timeSlots1.inTimes === 0){
              //正常签到
              notIn = (<span>签到{moment(record.timeSlots1.inTime * 1000).format(" HH:mm")}&emsp;</span>);
            }
            else if(record.timeSlots1.inStatus === "0" && record.timeSlots1.inTime && record.timeSlots1.inTimes > 0){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>签到{moment(record.timeSlots1.inTime * 1000).format(" HH:mm")}(迟到{this.getHoursMinute(record.timeSlots1.inTimes)})&emsp;</span>);
            }

            if(record.timeSlots1.outStatus === "0" && !record.timeSlots1.outTime){
              notOut = (<span style={{color:"rgba(220,20,60,1)"}}>未签退&emsp;</span>);
            }else if(record.timeSlots1.outStatus === "1" && !record.timeSlots1.outTime) {
              notOut = (<span style={{color:"rgba(60,179,113,1)"}}>正常&emsp;</span>);
            }else if(record.timeSlots1.outStatus === "1" && record.timeSlots1.outTime && record.timeSlots1.outTimes === 0){
              //正常签退
              notOut = (<span>签退{moment(record.timeSlots1.outTime * 1000).format(" HH:mm")}&emsp;</span>);
            }else if(record.timeSlots1.outStatus === "0" && record.timeSlots1.outTime && record.timeSlots1.outTimes > 0){
              notOut = (<span style={{color:"rgba(220,20,60,0.7)"}}>签退{moment(record.timeSlots1.outTime * 1000).format(" HH:mm")}(早退{this.getHoursMinute(record.timeSlots1.outTimes)})&emsp;</span>);
            }
            return (
              <span>
                {notIn} {notOut}
              </span>
            )
          }
        },
        {
          title:"时段2",
          dataIndex:"timeSlots2",
          render: (text, record) => {
            if(!record.timeSlots2){
              return null;
            }
            let notIn = null;
            let notOut = null;
            if(record.timeSlots2.inStatus === "0" && !record.timeSlots2.inTime){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>未签到&emsp;</span>);
            }
            else if(record.timeSlots2.inStatus === "1" && record.timeSlots2.inTime && record.timeSlots2.inTimes === 0){
              //正常签到
              notIn = (<span>签到{moment(record.timeSlots2.inTime * 1000).format(" HH:mm")}&emsp;</span>);
            }
            else if(record.timeSlots2.inStatus === "0" && record.timeSlots2.inTime && record.timeSlots2.inTimes > 0){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>签到{moment(record.timeSlots2.inTime * 1000).format(" HH:mm")}(迟到{record.timeSlots2.inTimes}分钟)&emsp;</span>);
            }

            if(record.timeSlots2.outStatus === "0" && !record.timeSlots2.outTime){
              notOut = (<span style={{color:"rgba(220,20,60,1)"}}>未签退&emsp;</span>);
            }else if(record.timeSlots2.outStatus === "1" && !record.timeSlots2.outTime) {
              notOut = (<span style={{color:"rgba(60,179,113,1)"}}>正常&emsp;</span>);
            }else if(record.timeSlots2.outStatus === "1" && record.timeSlots2.outTime && record.timeSlots2.outTimes === 0){
              //正常签退
              notOut = (<span>签退{moment(record.timeSlots2.outTime * 1000).format(" HH:mm")}&emsp;</span>);
            }else if(record.timeSlots2.outStatus === "0" && record.timeSlots2.outTime && record.timeSlots2.outTimes > 0){
              notOut = (<span style={{color:"rgba(220,20,60,0.7)"}}>签退{moment(record.timeSlots2.outTime * 1000).format(" HH:mm")}(早退{record.timeSlots2.outTimes}分钟)&emsp;</span>);
            }
            return (
              <span>
                {notIn} {notOut}
              </span>
            )
          }
        },
        {
          title:"时段3",
          dataIndex:"timeSlots3",
          render: (text, record) => {
            if(!record.timeSlots3){
              return null;
            }
            let notIn = null;
            let notOut = null;
            if(record.timeSlots3.inStatus === "0" && !record.timeSlots3.inTime){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>未签到&emsp;</span>);
            }
            else if(record.timeSlots3.inStatus === "1" && record.timeSlots3.inTime && record.timeSlots3.inTimes === 0){
              //正常签到
              notIn = (<span>签到{moment(record.timeSlots3.inTime * 1000).format(" HH:mm")}&emsp;</span>);
            }
            else if(record.timeSlots3.inStatus === "0" && record.timeSlots3.inTime && record.timeSlots3.inTimes > 0){
              notIn = (<span style={{color:"rgba(220,20,60,1)"}}>签到{moment(record.timeSlots3.inTime * 1000).format(" HH:mm")}(迟到{record.timeSlots3.inTimes}分钟)&emsp;</span>);
            }

            if(record.timeSlots3.outStatus === "0" && !record.timeSlots3.outTime){
              notOut = (<span style={{color:"rgba(220,20,60,1)"}}>未签退&emsp;</span>);
            }else if(record.timeSlots3.outStatus === "1" && !record.timeSlots3.outTime) {
              notOut = (<span style={{color:"rgba(60,179,113,1)"}}>正常&emsp;</span>);
            }else if(record.timeSlots3.outStatus === "1" && record.timeSlots3.outTime && record.timeSlots3.outTimes === 0){
              //正常签退
              notOut = (<span>签退{moment(record.timeSlots3.outTime * 1000).format(" HH:mm")}&emsp;</span>);
            }else if(record.timeSlots3.outStatus === "0" && record.timeSlots3.outTime && record.timeSlots3.outTimes > 0){
              notOut = (<span style={{color:"rgba(220,20,60,0.7)"}}>签退{moment(record.timeSlots3.outTime * 1000).format(" HH:mm")}(早退{record.timeSlots3.outTimes}分钟)&emsp;</span>);
            }
            return (
              <span>
                {notIn} {notOut}
              </span>
            )
          }
        },
        {
          title:"操作",
          dataIndex:"notSignIn",
          width:100,
          render: (text, record) => {
            let a_html = (<a onClick={this.toDealEx.bind(this,record)}>处理</a>);
            let count_1 = 0;
            record.timeSlots.forEach(ele => {
              if(ele.signInStatus + "" === "1" && ele.signOutStatus + "" === "1"){
                count_1 ++;
              }
            })
            if(count_1 === 3){
              a_html = null
            }
            return (
            <span>
              {a_html}
            </span>
          )},
        },
      ];

      return (
        <div className="content-main content-box">
          <div className="stu-statistics">
            <Row className="ant-row-fun" gutter={24}>
              <Col xl={{ span: 4, offset: 0 }}>
                <MonthPicker onChange={this.monthChange.bind(this)} allowClear={false} placeholder="考勤日期" defaultValue={moment(month,"YYYY-MM")} format={monthFormat} style={{width:"220px"}}></MonthPicker> &emsp;&emsp;
              </Col>
              <Col xl={{ span: 6, offset: 0 }}>
                <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                <Button type='primary' onClick={this.goback.bind(this)}>返回</Button>&emsp;
              </Col>
            </Row>
            <Table rowKey="day" columns={stuColumns} dataSource={stuData} pagination={false} />
          </div>

          <Modal
            title="考勤异常处理"
            visible={visible}
            keyboard={false}
            maskClosable={false}
            width="600px"
            onOk={this.handleSave}
            okText="提交"
            onCancel={this.handleCancel}
          >
            <div className="edit-modal">
              <Form>
                <Row gutter={24}>
                  <Col span={22}>
                    <Form.Item {...formItemLayout} label="时段1">
                      {getFieldDecorator("ids[0]", {
                        initialValue: "0",
                      })(
                        <Select>
                          <Option value="1">正常</Option>
                          <Option value="0">不处理</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item {...formItemLayout} label="时段2">
                      {getFieldDecorator("ids[1]", {
                        initialValue: "0",
                      })(
                        <Select>
                          <Option value="1">正常</Option>
                          <Option value="0">不处理</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item {...formItemLayout} label="时段3">
                      {getFieldDecorator("ids[2]", {
                        initialValue: "0",
                      })(
                        <Select>
                          <Option value="1">正常</Option>
                          <Option value="0">不处理</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        </div>
      )
    }
}

const mapStateToProps = (state,ownProps) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(AdttendanceDetailsPersonDetail));
