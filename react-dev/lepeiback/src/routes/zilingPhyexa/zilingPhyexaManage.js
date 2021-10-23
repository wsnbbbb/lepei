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
  Select,
  Checkbox,
  Modal,
  message,
} from "antd";
import { connect } from "dva";
import "./style.less";
import { routerRedux } from 'dva/router';
import moment from "moment";
import PageIndex from "../../components/page";

const { Option } = Select;

class ZilingPhyexaManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stuData: {},
      visible: false,
      configData: {},
      page: 1,
      pageSize: 20,
      allGradeDataArrs:[],
      gradeDataArrs: [],
      classDataArrs: [],
      checkedValues:[],
    };
  }

  componentDidMount = () => {
    this.getGradeNameAll();
    let { page, pageSize } = this.state;
    this.getPageData({ page, pageSize });
  };

  getGradeNameAll = () => {
    let that = this;
    that.props.dispatch({
      type: "zilingPhyexa/getGradeName",
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
        type: 'zilingPhyexa/getClassName',
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

  queryList = () => {
    let that = this;
    that.props.form.validateFields().then((values) => {
      let pageSize = that.state.pageSize;
      const params = Object.assign({ page: 1, pageSize }, values);
      that.getPageData(params);
      that.setState({
        page: 1,
      });
    });
  };

  refreshData = () => {
    let that = this;
    that.props.form.validateFields().then((values) => {
      let pageSize = that.state.pageSize;
      let page = that.state.page;
      const params = Object.assign({ page, pageSize }, values);
      that.getPageData(params);
    });
  };

  resetQuery = () => {
    let that = this;
    let pageSize = that.state.pageSize;
    that.props.form.resetFields();
    that.getPageData({ page: 1, pageSize });
    that.setState({
      page: 1,
    });
  };

  getPageData = (params) => {
    Object.keys(params).forEach((ele) => {
      if (!params[ele]) {
        delete params[ele];
      }
    });
    this.props.dispatch({
      type: "zilingPhyexa/getBodyExaminationByPage",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            stuData: res.data,
          });
        }
      },
    });
  };

  onPageChange = (current, size) => {
    let that = this;
    that.props.form.validateFields().then((values) => {
      const params = Object.assign({ page: current, pageSize: size }, values);
      that.setState({ page: current, pageSize: size });
      that.getPageData(params);
    });
  };

  getConfigData = () => {
    let that = this;
    that.props.dispatch({
      type: "zilingPhyexa/getBodyExaminationConfigData",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let configData = res.data;
          configData.allQuotas && configData.allQuotas.forEach(ele =>{
            ele.value = ele.key;
          })
          let checkedValues = configData.showQuotas;
          that.setState({ configData,checkedValues });
        }
      },
    });
  };

  toEditConfig = () => {
    this.getConfigData();
    this.setState({
      visible: true,
    });
  };

  toDetail = (record) =>{
    let url = "/ziling-phyexa-view";
    if(record){
      url = url + "?personId="+record.personId;
    }
    this.props.dispatch(routerRedux.push(url))
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      checkedValues:[],
    });
  };
  handleSave = (e) => {
    let that = this;
    if(that.state.checkedValues.length < 1){
      message.error("请选择体检参数",3);
      return;
    }
    let types = "zilingPhyexa/setBodyExaminationConfigData";
    that.props.dispatch({
      type: types,
      payload: {viewQuota:that.state.checkedValues},
      callback: (res) => {
        if (res.code === 200) {
          that.handleCancel();
        }
      },
    });
  };

  checkConfigChange = (checkedValues) =>{
    this.setState({checkedValues})
  }

  render() {
    const {
      stuData,
      visible,
      configData,
      gradeDataArrs,
      classDataArrs,checkedValues
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    let classArrs = [];
    classDataArrs.forEach((ele) => {
      classArrs.push(<Option key={ele.classId}>{ele.className}</Option>);
    });
    let gradeArrs = [];
    gradeDataArrs.forEach((ele) => {
      gradeArrs.push(<Option key={ele.gradeId}>{ele.gradeName}</Option>);
    });

    let stuColumns = [
      {
        title: "姓名",
        dataIndex: "personName",
      },
      {
        title: "年级",
        dataIndex: "gradeName",
      },
      {
        title: "班级",
        dataIndex: "className",
      },
      {
        title: "性别",
        dataIndex: "sex",
        render: (text, record) => {
          let sex = "保密";
          if(text + "" === "1") sex = "男";
          else if(text + "" === "2") sex = "女";
          return (<span>{sex}</span>)
        }
      },
      {
        title: "年龄",
        dataIndex: "birthday",
        render: (text, record) => {
          let age = "";
          if(record.birthday){
            let birthday = moment(record.birthday * 1000);
            let now = moment();
            let duration = moment.duration(now.diff(birthday));
            age = `${duration._data.years}岁`
          }
          return (<span>{age}</span>)
        }
      },
      {
        title: "最近体检时间",
        dataIndex: "latestExamineTime",
      },
      {
        title: "记录人",
        dataIndex: "recordPersonName",
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={this.toDetail.bind(this, record)}>
              查看
            </a>
          </span>
        ),
      },
    ];

    return (
      <div className="content-main content-box">
        <div>
          <Form>
            <Row className="ant-row-fun" gutter={24}>
              <Col xl={{ span: 18, offset: 0 }}>
                <Col xl={{ span: 6, offset: 0 }}>
                  <Form.Item>
                    {getFieldDecorator("name")(
                      <Input placeholder="学生姓名" maxLength={30} />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 0 }}>
                  <Form.Item>
                    <Select placeholder="学业阶段" onChange={this.stageChange}>
                        <Option key="1">幼儿园</Option>
                        <Option key="2">小学</Option>
                        <Option key="3">初中</Option>
                        <Option key="4">高中</Option>
                        <Option key="5">大学</Option>
                    </Select>
                    &emsp;&emsp;
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 0 }}>
                  <Form.Item>
                    {getFieldDecorator("gradeId")(<Select placeholder="年级" onChange={this.gradeChange} showSearch optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                      {gradeArrs}
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 0 }}>
                  <Form.Item>
                    {getFieldDecorator("classId")(
                      <Select
                        placeholder="班级"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {classArrs}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Col>
              <Col
                xl={{ span: 6, offset: 0 }}
                style={{ textAlign: "right", paddingRight: "20px" }}
              >
                <Button type="primary" onClick={this.queryList.bind(this)}>
                  查询
                </Button>
                &emsp;
                <Button
                  type="primary"
                  ghost
                  onClick={this.resetQuery.bind(this)}
                >
                  重置
                </Button>
                &emsp;
                <Button
                  type="primary"
                  onClick={this.toEditConfig.bind(this)}
                >
                  体检标准管理
                </Button>
                &emsp;
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="personId"
            columns={stuColumns}
            dataSource={stuData.dataList}
            pagination={false}
          />
          <div className="paginationBox">
            <PageIndex
              getPage={this.onPageChange.bind(this)}
              total={stuData.totalCount}
              totalPage={stuData.totalPage}
              currentPage={stuData.currentPage}
            />
          </div>
        </div>

        <Modal
          title={"选择体检参数"}
          visible={visible}
          keyboard={false}
          maskClosable={false}
          width="600px"
          onOk={this.handleSave}
          okText="保存"
          onCancel={this.handleCancel}
        >
          <div className="edit-modal">
            <Checkbox.Group name="configCheck" options={configData.allQuotas} value={checkedValues} onChange={this.checkConfigChange}></Checkbox.Group>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(ZilingPhyexaManage));
