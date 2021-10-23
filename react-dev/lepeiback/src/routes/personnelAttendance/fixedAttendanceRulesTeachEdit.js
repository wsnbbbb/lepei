import React, { Component } from "react";
import { Modal, Form, Row, Col, Input, Select, TimePicker ,message,TreeSelect } from "antd";
import { connect } from "dva";
import "./style.less";
import moment from 'moment';

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

class FixedAttendanceRulesStuEdit extends Component {
  constructor(props) {
    // 注意这里将props传入了构造器 Class 方式创建的组件必须总是调用带有 props 的构造器
    super(props);
    this.state = {
      ruleId: "",
      title: "添加",
      mode: "add",
      visible: false,
      departmentData: [],
      markAbnormalVal:"0",
      formData: {
        name: "",
        groupType: "2",
        groupIds: [],
        attendancePeriod: [],
        checkDateType: "1",
        markAbnormalData: [],
        parentCanCheck: "",
      },
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getAttendanceDepartment();
  }

  handleCancel = (e) => {
    this.setState({
      formData:{
        name: "",
        groupType: "2",
        groupIds: [],
        attendancePeriod: [],
        checkDateType: "1",
        markAbnormalData: [],
        parentCanCheck: "",
      },
      markAbnormalVal:"1",
      visible: false,
    });
    this.props.form.resetFields();
  };
  handleSave = (e) => {
    let that = this;
    that.props.form.validateFields().then(values => {
      let params = {...values};
      params.groupType = that.state.formData.groupType;
      const format = 'HH:mm';
      let attendancePeriod = [];
      params.attendancePeriod.forEach(ele => {
        if(ele.start){
          // ele.startDate = ele.start
          ele.start = ele.start.format(format)
        }else{
          ele.start = "";
        }
        if(ele.end){
          // ele.endDate = ele.end
          ele.end = ele.end.format(format)
        }else{
          ele.end = "";
        }
        if(ele.prevTime) ele.prevTime = ele.prevTime * 60;
        if(ele.afterTime) ele.afterTime = ele.afterTime * 60;
        if(ele.start && ele.end){
          attendancePeriod.push(ele);
        }
      })
      if(!that.validAttendancePeriod(attendancePeriod)){
        return;
      }
      params.attendancePeriod = attendancePeriod;
      params.parentCanCheck = "0"
      let types = "fixAttendance/addFixRule";
      if(that.state.mode === 'mod'){
        types =  "fixAttendance/updateFixRule";
        params.id = this.state.ruleId + "";
      }
      if(!params.markAbnormalData.earlyTime){
        params.markAbnormalData.earlyTime = 0;
        params.markAbnormalData.lateTime = 0;
      }else{
        params.markAbnormalData.earlyTime = params.markAbnormalData.earlyTime * 60;
        params.markAbnormalData.lateTime = params.markAbnormalData.lateTime * 60;
      }
      if(!params.markAbnormalData.gapTime){
        params.markAbnormalData.gapTime = 0;
      }else{
        params.markAbnormalData.gapTime = params.markAbnormalData.gapTime * 60;
      }

      that.props.dispatch({
        type: types,
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.props.refreshData(params.groupType);
            that.props.form.resetFields();
            that.handleCancel();
          }
        },
      })
    });
  };

  validAttendancePeriod = (attendancePeriod) =>{
    let period1 = Object.assign({},attendancePeriod[0]);
    if(period1.startDate >= period1.endDate){
      message.error("考勤时间段1起止时间错误", 3);
      return false;
    }
    if(attendancePeriod.length < 2){
      return true;
    }
    let period2 = Object.assign({},attendancePeriod[1]);
    if(period2.startDate >= period2.endDate){
      message.error("考勤时间段2起止时间错误", 3);
      return false;
    }
    if(period2.startDate >= period1.startDate && period2.startDate <= period1.endDate){
      message.error("考勤时间段2时间范围冲突", 3);
      return false;
    }
    if(period2.endDate >= period1.startDate && period2.endDate <= period1.endDate){
      message.error("考勤时间段2时间范围冲突", 3);
      return false;
    }

    //第一个的结束时间+可签退时间内，第二个开始时间+可签到时间内，交叉则重新选择
    let endDate1 = period1.endDate.clone().add(period2.afterTime,"seconds");
    let startDate2 = period2.startDate.clone().add(0 - period2.prevTime,"seconds")
    if(endDate1 > startDate2){
      message.error("考勤时间段1与考勤时间段2时间范围冲突", 3);
      return false;
    }

    if(attendancePeriod.length > 2){
      let period3 = Object.assign({},attendancePeriod[2]);
      if(period3.startDate >= period3.endDate){
        message.error("考勤时间段2起止时间错误", 3);
        return false;
      }
      if(period3.startDate >= period2.startDate && period3.startDate <= period2.endDate){
        message.error("考勤时间段3时间范围冲突", 3);
        return false;
      }
      if(period3.endDate >= period2.startDate && period3.endDate <= period2.endDate){
        message.error("考勤时间段3时间范围冲突", 3);
        return false;
      }

      if(period3.startDate >= period1.startDate && period3.startDate <= period1.endDate){
        message.error("考勤时间段3时间范围冲突", 3);
        return false;
      }
      if(period3.endDate >= period1.startDate && period3.endDate <= period1.endDate){
        message.error("考勤时间段3时间范围冲突", 3);
        return false;
      }

      let endDate2 = period2.endDate.clone().add(period2.afterTime,"seconds");
      let startDate3 = period3.startDate.clone().add(0 - period3.prevTime,"seconds")
      if(endDate2 > startDate3){
        message.error("考勤时间段2与考勤时间段3时间范围冲突", 3);
        return false;
      }
    }

    return true;
  }


  handleShow(id, mode) {
    mode = mode ? mode : "add";
    let title = mode === "add" ? "添加" : mode === "mod" ? "修改" : "查看";
    if (id) this.getRuleDetail(id);
    this.setState({
      mode,
      title,
      visible: true,
    });
  }
  getRuleDetail = async (id) => {
    let that = this;
    await that.props.dispatch({
      type: "fixAttendance/getFixRuleDetail",
      payload: { id: id },
      callback: (res) => {
        if (res.code === 200) {
          let groupIds = res.data.groupIds.map(ele => ele + "");
          res.data.groupIds = groupIds;
          res.data.checkDateType = res.data.checkDateType + "";
          res.data.parentCanCheck = res.data.parentCanCheck + "";
          res.data.groupType = res.data.groupType + "";

          if(res.data.attendancePeriod && res.data.attendancePeriod.length > 0){
            res.data.attendancePeriod.forEach(ele => {
              ele.afterTime = parseInt(ele.afterTime / 60,0) + "";
              ele.prevTime = parseInt(ele.prevTime / 60,0) + "";
            })
          }
          if(res.data.markAbnormalData){
            res.data.markAbnormalData.isMarked = res.data.markAbnormalData.isMarked + "";
            res.data.markAbnormalData.earlyTime = parseInt(res.data.markAbnormalData.earlyTime / 60,0) + "";
            res.data.markAbnormalData.gapTime = parseInt(res.data.markAbnormalData.gapTime / 60,0) + "";
            res.data.markAbnormalData.lateTime = parseInt(res.data.markAbnormalData.lateTime / 60,0) + "";
          }
          that.setState({
            markAbnormalVal:res.data.markAbnormalData.isMarked || "0",
            ruleId: id,
            formData: res.data,
          });
        }
      },
    });
  };

  getDeptChildData = (child) => {
    let that = this;
    child.forEach(ele => {
      ele.key = ele.departmentId;
      ele.value = ele.departmentId;
      ele.title = ele.departmentName;
      ele.disabled = !ele.canSelect;
      ele.disableCheckbox = !ele.canSelect;
      if(ele.children && ele.children.length > 0){
        that.getDeptChildData(ele.children);
      }
    })
  }

  getAttendanceDepartment = async () => {
    let that = this;
    await that.props.dispatch({
      type: "fixAttendance/getDepartmentTree",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let data = res.data;
          data.forEach(ele => {
            ele.key = ele.departmentId;
            ele.value = ele.departmentId;
            ele.title = ele.departmentName;
            ele.disabled = !ele.canSelect;
            ele.disableCheckbox = !ele.canSelect;
            if(ele.children && ele.children.length > 0){
              that.getDeptChildData(ele.children);
            }
          })
          that.setState({
            departmentData: res.data,
          });
        }
      },
    });
  };

  markAbnormalChange = (v) => {
    this.setState({
      markAbnormalVal:v
    })
  }

  getAttendancePeriods() {
    const { getFieldDecorator } = this.props.form;
    let { formData } = this.state;
    const formItemLayout1 = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const format = 'HH:mm:00';
    let seconds = [
      { key: "10分钟", value: "10" },
      { key: "15分钟", value: "15" },
      { key: "30分钟", value: "30" },
      { key: "45分钟", value: "45" },
      { key: "60分钟", value: "60" },
    ];
    let secondOptions = [];
    seconds.forEach((ele) => {
      secondOptions.push(<Option value={ele.value}>{ele.key}</Option>);
    });
    let attendancePeriods = [];
    let periodIndex = 1;
    if (formData.attendancePeriod.length > 0) {
      for (let i = 1; i <= formData.attendancePeriod.length; i++) {
        let periodObj = formData.attendancePeriod[i - 1];
        attendancePeriods.push(
          <Row gutter={24} key={"PeriodTeach" + periodIndex}>
            <Col span={12}>
              <Form.Item
                {...formItemLayout1}
                label={"考勤时间段" + periodIndex}
              >
              <Col span={11}>
                <Form.Item style={{ width: 120 }}>
                  {getFieldDecorator("attendancePeriod["+(periodIndex - 1) +"].start", {
                    initialValue: periodObj.start
                      ? moment(periodObj.start, format)
                      : null,
                    rules: [
                      {
                        required: periodIndex === 1,
                        message: "请选择考勤时间段",
                      },
                    ],
                  })(<TimePicker style={{ width: 120 }} format={format} />)}
                </Form.Item>
                </Col>
                <Col span={2} className="span-timepick">
                  <span> - </span>
                </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator("attendancePeriod["+ (periodIndex - 1) +"].end", {
                    initialValue: periodObj.end
                    ? moment(periodObj.end, format)
                      : null,
                    rules: [
                      {
                        required: periodIndex === 1,
                        message: "请选择考勤时间段",
                      },
                    ],
                  })(<TimePicker style={{ width: 120 }} format={format} />)}
                </Form.Item>
                </Col>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout1}
                label="开始时间前"
                style={{ "marginBottom": 0 }}
              >
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].prevTime", {
                  initialValue: periodObj.prevTime || "30",
                })(<Select style={{ width: 120 }}>{secondOptions}</Select>)}
                <span>可签到</span>
              </Form.Item>
              <Form.Item {...formItemLayout1} label="结束时间后">
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].afterTime", {
                  initialValue: periodObj.afterTime || "30",
                })(<Select style={{ width: 120 }}>{secondOptions}</Select>)}
                <span>可签退</span>
              </Form.Item>
            </Col>
          </Row>
        );
        periodIndex++;
      }
    }
    if (formData.attendancePeriod.length < 3) {
      let count = 3 - formData.attendancePeriod.length;
      for (let i = 1; i <= count; i++) {
        attendancePeriods.push(
          <Row gutter={24} key={"PeriodTeach" + periodIndex}>
            <Col span={12}>
              <Form.Item
                {...formItemLayout1}
                label={"考勤时间段" + periodIndex}
              >
              <Col span={11}>
              <Form.Item style={{ width: 120 }}>
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].start", {
                  initialValue: null,
                  rules: [
                    {
                      required: periodIndex === 1,
                      message: "请选择考勤时间段",
                    },
                  ],
                })(<TimePicker style={{ width: 120 }} format={format} />)}
                </Form.Item>
                </Col>
              <Col span={2} className="span-timepick">
                <span> - </span>
              </Col>
              <Col span={11}>
                <Form.Item style={{ width: 120 }}>
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].end", {
                  initialValue: null,
                  rules: [
                    {
                      required: periodIndex === 1,
                      message: "请选择考勤时间段",
                    },
                  ],
                })(<TimePicker style={{ width: 120 }} format={format} />)}
                </Form.Item>
                </Col>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout1}
                label="开始时间前"
                style={{ "marginBottom": 0 }}
              >
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].prevTime", { initialValue: "30" })(
                  <Select style={{ width: 120 }}>{secondOptions}</Select>
                )}
                <span>可签到</span>
              </Form.Item>
              <Form.Item {...formItemLayout1} label="结束时间后">
                {getFieldDecorator("attendancePeriod["+(periodIndex - 1)+"].afterTime", { initialValue: "30" })(
                  <Select style={{ width: 120 }}>{secondOptions}</Select>
                )}
                <span>可签退</span>
              </Form.Item>
            </Col>
          </Row>
        );
        periodIndex++;
      }
    }
    return attendancePeriods;
  }

  getMarkAbnormal1 = () =>{
    let seconds = [
      { key: "10分钟", value: "10" },
      { key: "15分钟", value: "15" },
      { key: "30分钟", value: "30" },
      { key: "45分钟", value: "45" },
      { key: "60分钟", value: "60" },
    ];
    let secondOptions = [];
    seconds.forEach((ele) => {
      secondOptions.push(<Option value={ele.value}>{ele.key}</Option>);
    });
    let { formData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    if(formData.markAbnormalData.lateTime && formData.markAbnormalData.lateTime + "" === "0"){
      formData.markAbnormalData.lateTime = "30";
    }
    if(formData.markAbnormalData.earlyTime && formData.markAbnormalData.earlyTime + "" === "0"){
      formData.markAbnormalData.earlyTime = "30";
    }

    return (<div><Form.Item
      {...formItemLayout1}
      label="迟到"
      style={{ "marginBottom": 0 }}
    >
      {getFieldDecorator("markAbnormalData.lateTime", {
        initialValue: formData.markAbnormalData.lateTime || "30",
      })(
        <Select style={{ width: 120 }}>
          {secondOptions}
        </Select>
      )}
      <span>算作未签到</span>
    </Form.Item>
    <Form.Item
      {...formItemLayout1}
      label="早退"
      style={{ "marginBottom": 0 }}
    >
      {getFieldDecorator("markAbnormalData.earlyTime", {
        initialValue: formData.markAbnormalData.earlyTime || "30",
      })(
        <Select style={{ width: 120 }}>
          {secondOptions}
        </Select>
      )}
      <span>算作未签退</span>
    </Form.Item></div>)
  }
  getMarkAbnormal0 = () =>{
    let seconds = [
      { key: "10分钟", value: "10" },
      { key: "15分钟", value: "15" },
      { key: "30分钟", value: "30" },
      { key: "45分钟", value: "45" },
      { key: "60分钟", value: "60" },
    ];
    let secondOptions = [];
    seconds.forEach((ele) => {
      secondOptions.push(<Option value={ele.value}>{ele.key}</Option>);
    });
    let { formData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    if(formData.markAbnormalData.gapTime && formData.markAbnormalData.gapTime + "" === "0"){
      formData.markAbnormalData.gapTime = "30";
    }
    return (<div>
      <Form.Item {...formItemLayout1} label="忽略">
        {getFieldDecorator("markAbnormalData.gapTime", {
          initialValue: formData.markAbnormalData.gapTime || "30",
        })(<Select style={{ width: 120 }}>{secondOptions}</Select>)}
        <span>内的重复刷卡</span>
      </Form.Item></div>);
  }

  getMarkAbnormalData() {
    const { getFieldDecorator } = this.props.form;
    let { formData,markAbnormalVal } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    let mark1 = markAbnormalVal && markAbnormalVal === '1';
    let mark0 = markAbnormalVal && markAbnormalVal === '0';
    let markAbnormal = [];
    markAbnormal.push(
      <Row gutter={24} key="markAbnormalTeach1">
        <Col span={22}>
          <Form.Item
            {...formItemLayout}
            label="标记迟到、早退"
            style={{ "marginBottom": 0 }}
          >
            {getFieldDecorator("markAbnormalData.isMarked", {
              initialValue: formData.markAbnormalData.isMarked ? formData.markAbnormalData.isMarked + "" : "0",
            })(
              <Select placeholder="标记" onSelect={this.markAbnormalChange}>
                <Option value="0">不标记</Option>
                <Option value="1">标记</Option>
              </Select>
            )}
          </Form.Item>
          {mark1 ? this.getMarkAbnormal1.apply() : null}
          {mark0 ? this.getMarkAbnormal0.apply() : null}
        </Col>
      </Row>
    );
    return markAbnormal;
  }

  render() {
    let { title, visible, formData, departmentData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    let attendancePeriods = this.getAttendancePeriods();
    let markAbnormals = this.getMarkAbnormalData();

    const tProps = {
      treeData:departmentData,
      treeCheckable: true,
      treeDefaultExpandAll:true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择适用部门',
      filterTreeNode:function(inputValue,treeNode){
        // let filterStr = treeNode.props.gradeName || "" + treeNode.props.className || "";
        return treeNode.props.title.indexOf(inputValue) !== -1
      },
      style: {
        width: '100%',
      },
    };
    return (
      <Modal
        title={title}
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
            <Row gutter={24} key="fixedAttendanceTeach1">
              <Col span={22}>
                <Form.Item {...formItemLayout} label="规则名称">
                  {getFieldDecorator("name", {
                    initialValue: formData.name || "",
                    rules: [{ required: true, message: "请输入规则名称" },],
                  })(<Input placeholder="请输入规则名称" maxLength={30} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} key="fixedAttendanceTeach2">
              <Col span={22}>
                <Form.Item {...formItemLayout} label="适用部门">
                  {getFieldDecorator("groupIds", {
                    initialValue:
                    formData.groupIds || [],
                    rules: [{ required: true, message: "请选择适用部门" }],
                  })(
                    <TreeSelect {...tProps} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {attendancePeriods}
            <Row gutter={24} key="fixedAttendanceTeach3">
              <Col span={22}>
                <Form.Item {...formItemLayout} label="考勤日期">
                  {getFieldDecorator("checkDateType", {
                    initialValue: formData.checkDateType || "1",
                  })(
                    <Select>
                      <Option value="1">同步校历</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {markAbnormals}
          </Form>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(
  Form.create()(FixedAttendanceRulesStuEdit)
);
