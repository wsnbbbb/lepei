import React, { Component } from "react";
import { Modal, Form, Row, Col, Select,Button } from "antd";
import { connect } from "dva";
import "./style.less";

import FixedAttendanceChoosePersonDrawer from "./fixedAttendanceChoosePersonDrawer";

const { Option } = Select;

class FixedAttendanceWarnRulesEdit extends Component {
  constructor(props) {
    // 注意这里将props传入了构造器 Class 方式创建的组件必须总是调用带有 props 的构造器
    super(props);
    this.state = {
      title: "预警功能配置",
      visible: false,
      stuPersons:[],
      teachPersons:[],
      formData: [],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getAttendanceAllPersons("1");
    this.getAttendanceAllPersons("2");
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
      let datas = [...values];
      if(values.formData){
        datas = values.formData;
      }
      datas = datas.filter(ele => !!(ele.limitDay || ""));
      datas.forEach((ele,index) => {
        if(!ele.seq) ele.seq = index + 1;
        ele.excludeStudents = ele.excludeStudents || [];
      })

      let types = "fixAttendance/setAttendanceEarlyWarning";
      that.props.dispatch({
        type: types,
        payload: {rule:datas},
        callback: (res) => {
          if (res.code === 200) {
            this.props.form.resetFields();
            that.handleCancel();
          }
        },
      })
    });
  };

  handleShow() {
    this.getRuleDetail();
    this.setState({
      visible: true,
    });
  }
  getRuleDetail = async () => {
    let that = this;
    await that.props.dispatch({
      type: "fixAttendance/getAttendanceEarlyWarning",
      payload: { },
      callback: (res) => {
        if (res.code === 200) {
          res.data.forEach(ele => {
            ele.receivers = ele.receivers.map(el => el.id + "");
            ele.excludeStudents = ele.excludeStudents.map(el => el.id + "");
          })
          if(res.data.length < 2){
            let count = 2 - res.data.length;
            for (let i = 0; i < count; i++) {
              res.data.push({seq:i+1,limitDay:"",receivers:[],excludeStudents:[]});
            }
          }
          that.setState({
            formData: res.data,
          });
        }
      },
    });
  };

  getAttendanceAllPersons = async (personType) => {
    let that = this;
    await that.props.dispatch({
      type: "fixAttendance/getAttendanceAllPersons",
      payload: {personType},
      callback: (res) => {
        if (res.code === 200) {
          res.data.forEach(ele => {ele.key = ele.personId})
          if(personType === '1'){
            that.setState({
              stuPersons: res.data,
            });
          }else if(personType === '2'){
            that.setState({
              teachPersons: res.data,
            });
          }
        }
      },
    });
  };

  onFocus = () =>{
    let seleteds = document.getElementsByClassName("ant-select-search__field");
    for (let i = 0; i < seleteds.length; i++) {
      const element = seleteds[i];
      element.readOnly = true;
    }
  }

  onShowAddPerson = (ruleIndex,type) => {
    this.fixedAttendanceChoosePersonDrawer.onShowAddPerson(ruleIndex,type,this.state.teachPersons,this.state.stuPersons);
  }

  getAddPersons(choosePersons = [],drawerType,drawerPersonIndex){
    if(choosePersons.length < 1){
      return;
    }
    let {formData} = this.state;
    if(drawerType === "1"){
      //预警接收人
      let pers = [...formData[drawerPersonIndex - 1].receivers, ...choosePersons]
      let persons = new Set(pers);
      formData[drawerPersonIndex - 1].receivers = [...persons];
      this.setState({
        formData
      });
    }else if(drawerType === "2"){
      //排除人
      let pers = [...formData[drawerPersonIndex - 1].excludeStudents, ...choosePersons]
      let persons = new Set(pers);
      formData[drawerPersonIndex - 1].excludeStudents = [...persons];
      this.setState({
        formData
      });
    }
  }

  getRowHtml(){
    let { formData,stuPersons,teachPersons } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    let dayArray = [
      {value:"3",key:"3天"},
      {value:"5",key:"5天"},
      {value:"10",key:"10天"},
      {value:"15",key:"15天"},
    ]
    let dayOptions = [];
    dayArray.forEach(ele => {
      dayOptions.push(<Option key={ele.value} >{ele.key}</Option>)
    })

    let stuOptions = [];
    stuPersons.forEach(ele => {
      stuOptions.push(<Option key={ele.personId}>{ele.personName}</Option>)
    })
    let teachOptions = [];
    teachPersons.forEach(ele => {
      teachOptions.push(<Option key={ele.personId}>{ele.personName}</Option>)
    })
    let numToChina = ["一","二"];
    let rows = [];
    if(formData.length > 0){
      for(let i = 0;i<formData.length;i++){
        rows.push(<div key={i}>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label={"预警规则" + numToChina[i]}>
                <span>超过</span>
                {getFieldDecorator("formData["+i+"].limitDay", {
                  initialValue: formData[i].limitDay+"" || "",
                })(
                  <Select style={{ width: 120 }}>
                    {dayOptions}
                  </Select>
                )}
                <span>无签到信息，需推送预警信息</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="预警信息接收人">
                <div>
                {getFieldDecorator("formData["+i+"].receivers", {
                  initialValue: formData[i].receivers || [],
                })(
                  <Select className="person-select" mode="tags" open={false} showArrow={false} onFocus={this.onFocus}>
                    {teachOptions}
                  </Select>
                )}
                <Button type="primary" ghost onClick={this.onShowAddPerson.bind(this,(i+1),"1")}>添加</Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="排除列表">
                <span>相关人员添加进入排除列表后，系统将不再监控相关人员的预警信息</span>
                {getFieldDecorator("formData["+i+"].excludeStudents", {
                  initialValue: formData[i].excludeStudents || [],
                })(
                  <Select className="person-select" mode="tags" open={false} showArrow={false}>
                    {stuOptions}
                  </Select>
                )}
                <Button type="primary" ghost onClick={this.onShowAddPerson.bind(this,(i+1),"2")}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </div>);
      }
    }
    return <Form>{rows}</Form>;
  }

  render() {
    let { title, visible} = this.state;

    let ruleRows = this.getRowHtml();

    return (<div>
      <Modal
        title={title}
        visible={visible}
        keyboard={false}
        maskClosable={false}
        width="1000px"
        onOk={this.handleSave.bind(this)}
        okText="保存"
        onCancel={this.handleCancel.bind(this)} >
        <div className="edit-warn">
            {ruleRows}
        </div>
      </Modal>
      <FixedAttendanceChoosePersonDrawer getAddPersons={this.getAddPersons.bind(this)} onRef={(ref)=>{ this.fixedAttendanceChoosePersonDrawer = ref }}></FixedAttendanceChoosePersonDrawer>
    </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(
  Form.create()(FixedAttendanceWarnRulesEdit)
);
