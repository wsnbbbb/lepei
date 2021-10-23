/**
 * 排班制考勤规则
 */
import React,{Component} from 'react';
import { Modal, Form, Row, Col, Input, Select, TimePicker ,message,Button,Radio  } from "antd";

import { connect } from 'dva';
import './style.less';

import moment from 'moment';

const { Option } = Select;

class SchedulAttendanceRulesEdit extends Component{
  constructor(props) {
    // 注意这里将props传入了构造器 Class 方式创建的组件必须总是调用带有 props 的构造器
    super(props);
    this.state = {
      visible: false,
      itemData:[],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };
  handleSave = (e) => {
    let that = this;
    that.props.form.validateFields().then(values => {
      let params = [...(values.itemData || [])];
      if(!params.length) return;

      let codes = params.map(ele => ele.code);

      let maxnum = 0;
      let max;
      let res = {};
      const getRepeat = (arr)=>{
        for (var i = 0; i < arr.length; i++) {
            if(!res[arr[i]]){
                res[arr[i]] = 1;
            }else{
                res[arr[i]] ++;
            }
        };
        var keys = Object.keys(res);
        for(var j=0;j<keys.length;j++){
            if(res[keys[j]] > maxnum){
                maxnum = res[keys[j]];
                max = keys[j];
            }
        }
        return maxnum + max
      }
      getRepeat(codes);
      if(maxnum > 1){
        message.error(`班次代号${max}有${maxnum}条重复`,3)
        return;
      }

      const format = 'HH:mm:00';
      let valid = true;
      for(let i = 0;i < params.length;i++){
        let obj = params[i];
        if(obj.startTime > obj.endTime){
          message.error(`班次代号${obj.code}的考勤时间错误`,3);
          valid = false;
          break;
        }
      }
      if(!valid){
        return;
      }
      params.forEach(ele => {
        ele.startTime = moment(ele.startTime).format(format);
        ele.endTime = moment(ele.endTime).format(format);
      })
      let types = "scheduleRule/setAttendanceScheduleRule";
      that.props.dispatch({
        type: types,
        payload: {rules:params},
        callback: (res) => {
          if (res.code === 200) {
            that.props.refreshRuleData();
            that.handleCancel();
          }
        },
      })
    });
  };

  handleShow(itemData) {
    this.setState({
      visible: true,
      itemData:itemData
    });
    if(itemData && itemData.length < 1){
      this.addItem();
    }
  }

  ruleDelete = (index) =>{
    let itemData = this.state.itemData;
    let indx = itemData.findIndex(ele => ele.index === index);
    itemData.splice(indx,1);
    this.setState({
      itemData
    });
  }

  addItem = () =>{
    let itemData = this.state.itemData;
    itemData.push({
      index:itemData.length + 1,
      code:"",
      alias:"",
      startTime:"",
      endTime:"",
      isDaySpan:"1",
    })
    this.setState({
      itemData
    });
  }

  getRowsHtml = () => {
    let itemData = this.state.itemData;

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

    const format = 'HH:mm';

    let rows = [];
    itemData.forEach((ele,index) => {
      rows.push(<Row gutter={24} key={"schedul_" + index}>
        <Row gutter={24} key={"schedul" + index + "-1"}>
            <Col span={10}>
              <Form.Item {...formItemLayout} label="班次代号">
                {getFieldDecorator("itemData["+index+"].code", {
                  initialValue: ele.code || "",
                  rules: [{ required: true, message: "请选择班次代号" },],
                })(
                  <Select>
                    {codeOptions}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item {...formItemLayout} label="班次别名">
                {getFieldDecorator("itemData["+index+"].alias", {
                  initialValue: ele.alias || "",
                  rules: [{ required: true, message: "请输入班次别名" },],
                })(<Input placeholder="请输入班次别名" maxLength={20} />)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <a target="" rel="noopener noreferrer" style={{lineHeight:"40px"}} onClick={this.ruleDelete.bind(this)}>删除</a>
            </Col>
          </Row>
          <Row gutter={24} key={"schedul" + index + "-2"}>
            <Col span={10}>
              <Form.Item {...formItemLayout} label="考勤时间段">
                <Col span={10}>
                  {getFieldDecorator("itemData["+index+"].startTime", {
                    initialValue: ele.startTime ? moment(ele.startTime,format) : null,
                    rules: [
                      {
                        required: true,
                        message: "请选择考勤时间段",
                      },
                    ],
                  })(<TimePicker style={{width:"120px"}} format={format} />)}
                </Col>
                <Col span={2} className="span-timepick"><span> - </span></Col>
                <Col span={10}>
                  <Form.Item >
                    {getFieldDecorator("itemData["+index+"].endTime", {
                      initialValue: ele.endTime ? moment(ele.endTime,format) : null,
                      rules: [
                        {
                          required: true,
                          message: "请选择考勤时间段",
                        },
                      ],
                    })(<TimePicker style={{width:"120px"}} format={format} />)}
                  </Form.Item>
                </Col>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("itemData["+index+"].isDaySpan", {
                  initialValue: ele.isDaySpan + "" !== "" ? ele.isDaySpan + "" : "1",
                })(
                  <Radio.Group>
                    <Radio value="0">隔日</Radio>
                    <Radio value="1">当天</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
      </Row>)
    })
    return rows;
  }


  render() {
    let { visible, } = this.state;
    let rowsHtml = this.getRowsHtml();
    return (
      <Modal
        title="班次管理"
        visible={visible}
        keyboard={false}
        maskClosable={false}
        width="1000px"
        onOk={this.handleSave}
        okText="保存"
        onCancel={this.handleCancel}
      >
        <div className="edit-modal">
          <Form>
            {rowsHtml}
            <Row gutter={24} key="button1">
              <Col span={22} style={{textAlign:"center"}}>
                <Button type="primary" onClick={this.addItem.bind(this)}>增加班次</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
  }

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(SchedulAttendanceRulesEdit));


