/**
 * 紫领体检
 */
import React, { Component } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Input,
  Radio,
  Select,
  Modal,
  InputNumber,Typography,DatePicker
} from "antd";
import { connect } from "dva";
import "./style.less";
import moment from "moment";
import { getQueryString} from '../../utils/public';
import { getImg } from "../../utils/img";
import echarts from 'echarts';

const { Option } = Select;
const { Title,Text } = Typography;
const { RangePicker } = DatePicker;

let linecharts;
let chartType = "";

class ZilingPhyexaManageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: require("history/createHashHistory"),
      personId:"",
      stuData: {},
      configData: {showQuotas:[]},
      currentStand:"height",
      surveyData:{},
      startDate:moment().subtract(2, 'month').format("YYYY-MM-DD"),
      endDate:moment().format("YYYY-MM-DD"),
      visible:false,
      modDate:"",
      detaiData:{quotas:{}},
    };
  }

  componentDidMount = () => {
    const personId = getQueryString("personId");
    this.setState({personId})
    this.getConfigData();
    //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:"学生体检详情",
        parentRoute:"/ziling-phyexa"
      },
    });
    setTimeout(() => {
      this.getPersonInfo();
      this.getSurveyData();
    },300);
  };

  componentWillUnmount = () =>{
    //组件卸载时，清空手动加入的面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {},
    })
  }

  getPersonInfo = () => {
    let that = this;
    that.props.dispatch({
      type: "zilingPhyexa/getBodyExaminationPerson",
      payload: { personId:this.state.personId },
      callback: (res) => {
        if (res.code === 200) {
          let stuData = res.data;
          if(stuData.birthday){
            let birthday = moment(stuData.birthday * 1000);
            let now = moment();
            let duration = moment.duration(now.diff(birthday));
            stuData.age = duration._data.years;
          }
          let sex = "保密";
          if(stuData.sex + "" === "1") sex = "男";
          else if(stuData.sex + "" === "2") sex = "女";
          stuData.sex = sex;
          that.setState({ stuData });
        }
      },
    });
  }

  getConfigData = () => {
    let that = this;
    that.props.dispatch({
      type: "zilingPhyexa/getBodyExaminationConfigData",
      payload: { },
      callback: (res) => {
        if (res.code === 200) {
          let configData = res.data;
          configData.allQuotas && configData.allQuotas.forEach(ele =>{
            ele.value = ele.key;
          })
          that.setState({ configData });
        }
      },
    });
  };

  getSurveyData = () => {
    let {startDate,endDate,currentStand,personId} = this.state;
    let params = {
      personId,startDate,endDate,quota:currentStand
    };

    this.props.dispatch({
      type: "zilingPhyexa/getBodyExaminationSurvey",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let surveyData = res.data;
          this.setState({ surveyData });
          linecharts = null;
          let keys = ["vision","hearing","dentalCaries"];
          if(keys.includes(this.state.currentStand)){
            if(!linecharts || chartType !== "1") {
              chartType = "1";
              linecharts = echarts.init(document.getElementById('lineCharts'));
            }
            this.setLineChart(surveyData.evaluates || []);
          }else{
            if(!linecharts || chartType !== "0"){
              chartType = "1";
              linecharts = echarts.init(document.getElementById('lineCharts'));
            }
            this.setPhyexaLineChart(surveyData.quotaValues || {});
          }
        }
      },
    });
  }

  setPhyexaLineChart = (quotaValues) => {
    let xData = quotaValues.dates || [];
    let yData = quotaValues.values || [];
    let allQuotas =this.state.configData.allQuotas || [];
    let quotas = allQuotas.find(ele => ele.key === this.state.currentStand);
    let title = "身高(cm)";
    let unit = "(cm)";
    if(quotas){
      title = quotas.label;
      if(quotas.unit) unit = `(${quotas.unit})`;
      else unit = "";
    }

    linecharts.setOption({
      title: {
        text: title + unit
      },
      tooltip: {
          trigger: 'axis',
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
        type:"category",
        data: xData,
        axisTick: {
          alignWithLabel: true
        },
      },
      yAxis: {
        type:"value",
      },
      series: [
        {
          name: title + (unit ? `(${unit || ""})` : ""),
          type: 'line',
          data: yData,
          label: {
              show: true,
              position: 'top'
          },
        }
      ]
    });
  }

  setLineChart = (evaluates) => {
    let fill = ["无","正常","异常"];
    let xData = evaluates.map(ele => ele.date);
    let yData = evaluates.map(ele => fill[ele.evaluate]);
    let allQuotas =this.state.configData.allQuotas || [];
    let quotas = allQuotas.find(ele => ele.key === this.state.currentStand);
    let title = "听力";
    if(quotas){
      title = quotas.label;
    }
    linecharts.setOption({
      title:{show:false},
      tooltip: {
          trigger: 'axis',
          formatter:function (params){
            return params[0].axisValue + "：" + params[0].data;
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
      },
      xAxis: {
        type:"category",
        data: xData,
        axisTick: {
          alignWithLabel: true
        },
      },
      yAxis: {
        type:"category",
        data:fill,
      },
      series: [
        {
          name: title,
          type: 'line',
          data: yData,
          label: {
              show: true,
              position: 'top',
              formatter:function (params){
                return params.name + "\r\n" + params.data;
              }
          },
        }
      ]
    });
  }

  standChange = (e) => {
    this.setState({
      currentStand:e.target.value
    });
    setTimeout(() => {
      this.getSurveyData();
    },300);
  }

  handleCancel = () => {
    this.state.history().goBack();
  };
  dateChange = (dates) => {
    let startDate = dates[0].format("YYYY-MM-DD");
    let endDate = "";
    if(dates.length > 1){
      endDate = dates[1].format("YYYY-MM-DD");
    }
    this.setState({startDate,endDate});
    setTimeout(() => {
      this.getSurveyData();
    },300);
  }

  toEditItem = (record) => {
    let params = {
      id:this.state.personId,
      date:record.date
    }
    let types = "zilingPhyexa/getBodyExaminationDetail";
    this.props.dispatch({
      type: types,
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let detaiData = res.data;
          Object.keys(detaiData.quotas).forEach(ele => detaiData.quotas[ele] = detaiData.quotas[ele] + "")
          this.setState({
            modDate:record.date,
            visible:true,
            detaiData
          })
        }
      },
    })

  }
  handleSave = () => {
    this.props.form.validateFields().then(values => {
      let params = {...values};
      params.personId = this.state.personId;
      params.date = this.state.modDate;
      let types = "zilingPhyexa/updateBodyExaminationDetail";
      this.props.dispatch({
        type: types,
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            this.getSurveyData();
            this.handleModalCancel();
          }
        },
      })
    })
  }

  toDeleteItem = (record) => {
    let that = this;
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        let params = {
          personId:that.state.personId,
          date:record.date
        }
        that.props.dispatch({
          type: "zilingPhyexa/deleteBodyExaminationDetail",
          payload: params,
          callback: (res) => {
            if (res.code === 200) {
              that.getSurveyData();
            }
          }
        });
      },
      onCancel() {
      },
    });
  }

  handleModalCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible:false,
      modDate:"",
      detaiData:{quotas:{}},
    });
  }

  render() {
    const {
      stuData,
      configData,
      currentStand,startDate,endDate,surveyData,visible,detaiData,modDate
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    let standOption = [];
    configData.allQuotas && configData.allQuotas.forEach(ele => {
      if(configData.showQuotas.includes(ele.key)){
        standOption.push(<Radio.Button key={ele.key} value={ele.key}>{ele.label}</Radio.Button>);
      }
    })

    let columns = [
      {
        title: "时间",
        dataIndex: "date",
      },
      {
        title: "评价",
        dataIndex: "evaluate",
        render: (text, record) => {
          let evaluate = "无";
          if(record.evaluate + "" === "1"){
            evaluate = "体格发育正常";
          } else if(record.evaluate + "" === "2"){
            evaluate = "体弱";
          } else if(record.evaluate + "" === "3"){
            evaluate = "肥胖";
          }
          return (<span>{evaluate}</span>)
        }
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={this.toEditItem.bind(this, record)}>
              编辑
            </a>&emsp;
            <a href="javascript:;" onClick={this.toDeleteItem.bind(this, record)}>
              删除
            </a>&emsp;
          </span>
        ),
      },
    ];

    return (
      <div className="content-main content-box">
        <div>
          <Row gutter={24} className="stuinfo sturow">
            <div className="head">
              <img alt="" src={getImg(stuData.portrait)}></img>
            </div>
            <div className="info">
              <Title level={4}>{stuData.personName}</Title>
              <Text type="secondary">性别：{stuData.sex}</Text>
              <Text type="secondary">所在班级：{stuData.gradeName || "" + stuData.className || ""}</Text>
              <Text type="secondary">当前年龄：{stuData.age}岁</Text>
            </div>
          </Row>
          <Row gutter={24} className="sturow" style={{marginTop:20}}>
            <Radio.Group name="standRadio "buttonStyle="solid" value={currentStand} onChange={this.standChange}>{standOption}</Radio.Group>
            <Row gutter={24} className="sturow" style={{marginTop:20}}>
              <span>选择时间：</span><RangePicker style={{width:400}} format="YYYY年MM月DD日" value={[moment(startDate,"YYYY-MM-DD"),moment(endDate,"YYYY-MM-DD")]} onChange={this.dateChange}></RangePicker>
            </Row>
          </Row>
          <Row gutter={24} className="sturow" style={{marginTop:20}}>
            <Col span={22}>
				      <div id="lineCharts" style={{ width: '100%', height: 370 }} />
            </Col>
          </Row>
          <Row gutter={24} className="sturow" >
            <Col span={22}>
              <Title level={4}>体检分析建议</Title>
              <div className="gridtables">
                <Table
                  rowKey="date"
                  columns={columns}
                  dataSource={surveyData.evaluates}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24} className="sturow" style={{textAlign:"center",marginTop:20}}>
            <Col span={22}>
              <Button type="primary" ghost onClick={this.handleCancel.bind(this)}>取消</Button>
            </Col>
          </Row>
        </div>


        <Modal
          title={modDate + "体检记录"}
          visible={visible}
          keyboard={false}
          maskClosable={false}
          width="700px"
          onOk={this.handleSave}
          okText="保存"
          onCancel={this.handleModalCancel}
        >
          <div className="edit-modal">
            <Form layout="horizontal" labelAlign="right">
              <Row gutter={24}>
                {configData.showQuotas.includes("vision") ? (<Col span={11}>
                  <Form.Item label="视力" {...formItemLayout1}>
                    {getFieldDecorator("quotas.vision", {
                        initialValue: detaiData.quotas.vision,
                        rules: [{ required: true, message: "请选择视力情况" },],
                      })(
                      <Select placeholder="请选择视力情况">
                        <Option key="1">正常</Option>
                        <Option key="2">异常</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>) : null}

                {configData.showQuotas.includes("hearing") ? (<Col span={11}>
                  <Form.Item label="听力" {...formItemLayout1}>
                    {getFieldDecorator("quotas.hearing", {
                        initialValue: detaiData.quotas.hearing,
                        rules: [{ required: true, message: "请选择听力情况" },],
                      })(
                      <Select placeholder="请选择听力情况">
                        <Option key="1">正常</Option>
                        <Option key="2">异常</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("dentalCaries") ? (<Col span={11}>
                  <Form.Item label="龋齿" {...formItemLayout1}>
                    {getFieldDecorator("quotas.dentalCaries", {
                        initialValue: detaiData.quotas.dentalCaries,
                        rules: [{ required: true, message: "请选择龋齿情况" },],
                      })(
                      <Select placeholder="请选择龋齿情况">
                        <Option key="1">有</Option>
                        <Option key="2">无</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("height") ? (<Col span={11}>
                  <Form.Item label="身高" {...formItemLayout1}>
                    {getFieldDecorator("quotas.height", {
                        initialValue: detaiData.quotas.height,
                        rules: [{ required: true, message: "请输入身高" },],
                      })(
                      <InputNumber placeholder="请输入身高" style={{width:170}} min={1} max={300} step={0.1} precision={1} suffix="cm"></InputNumber>
                    )}<span>cm</span>
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("weight") ? (<Col span={11}>
                  <Form.Item label="体重" {...formItemLayout1}>
                    {getFieldDecorator("quotas.weight", {
                        initialValue: detaiData.quotas.weight,
                        rules: [{ required: true, message: "请输入体重" },],
                      })(
                      <InputNumber placeholder="请输入体重" style={{width:170}} min={1} max={300} step={0.1} precision={1} suffix="kg"></InputNumber>
                    )}<span>cm</span>
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("hemoglobin") ? (<Col span={11}>
                  <Form.Item label="血色素" {...formItemLayout1}>
                    {getFieldDecorator("quotas.hemoglobin", {
                        initialValue: detaiData.quotas.hemoglobin,
                        rules: [{ required: true, message: "请输入血色素" },],
                      })(
                      <InputNumber placeholder="请输入血色素" style={{width:170}} min={1} max={3000} step={0.1} precision={1} suffix="g/l"></InputNumber>
                    )}<span>cm</span>
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("headCircumference") ? (<Col span={11}>
                  <Form.Item label="头围" {...formItemLayout1}>
                    {getFieldDecorator("quotas.headCircumference", {
                        initialValue: detaiData.quotas.headCircumference,
                        rules: [{ required: true, message: "请输入头围" },],
                      })(
                      <InputNumber placeholder="请输入头围" style={{width:170}} min={1} max={300} step={0.1} precision={1} suffix="cm"></InputNumber>
                    )}<span>cm</span>
                  </Form.Item>
                </Col>) : null}
                {configData.showQuotas.includes("hipline") ? (<Col span={11}>
                  <Form.Item label="臀围" {...formItemLayout1}>
                    {getFieldDecorator("quotas.hipline", {
                        initialValue: detaiData.quotas.hipline,
                        rules: [{ required: true, message: "请输入臀围" },],
                      })(
                      <InputNumber placeholder="请输入臀围" style={{width:170}} min={1} max={300} step={0.1} precision={1} suffix="cm"></InputNumber>
                    )}<span>cm</span>
                  </Form.Item>
                </Col>) : null}

              </Row>
              <Row gutter={24}>
                <Col span={22}>
                  <Form.Item label="评价" {...formItemLayout2}>
                    {getFieldDecorator("evaluate", {
                        initialValue: detaiData.evaluate + "",
                      })(
                        <Select placeholder="请选择评价">
                          <Option key="0">无</Option>
                          <Option key="1">体格发育正常</Option>
                          <Option key="2">体弱</Option>
                          <Option key="3">肥胖</Option>
                        </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={22}>
                  <Form.Item label="建议" {...formItemLayout2}>
                    {getFieldDecorator("suggest", {
                        initialValue: detaiData.suggest,
                      })(
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} placeholder="请输入建议" maxLength={500}></Input.TextArea>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(ZilingPhyexaManageView));
