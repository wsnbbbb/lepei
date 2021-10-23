/**
 * 推送配置
 */
import React, { Component } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Select,
  TimePicker,
  Radio,
  Modal,TreeSelect
} from "antd";
import { connect } from "dva";
import "./style.less";
import moment from "moment";

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

class PushConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stuData: [],
      modal_titile: "",
      visible: false,
      formData: {},
      mode:"add",
      notCanClass:[],
      allClassArr:[],
    };
  }

  componentDidMount = () => {
    this.getAllClass();
    this.getPageData();
  };

  getAllClass = () => {
    this.props.dispatch({
      // type: "childrensActivities/getAllClass",
      type:'user/getClassByGrade',
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let allClassArr = res.data;
          allClassArr.forEach(ele => {
            ele.key = ele.gradeId+"-1";
            ele.value = ele.gradeId+"-1";
            ele.title = ele.gradeName;
            ele.disabled = true;
            ele.disableCheckbox = true;
            if(ele.classData && ele.classData.length > 0){
              this.getGradeClassChild(ele);
            }
          })
          this.setState({
            allClassArr
          });
        }
      },
    });
  }

  getGradeClassChild = (ele) =>{
    ele.children = ele.classData;
    ele.children.forEach(ty => {
      ty.key = ty.classId;
      ty.value = ty.classId;
      ty.title = ele.gradeName+ty.className;
      ty.isLeaf = true;
      if(ty.classData && ty.classData.length > 0){
        this.getGradeClassChild(ty);
      }
    })
  }

  getPageData = () => {
    let that = this;
    this.props.dispatch({
      type: "pushConfiguration/getChildActivityCront",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let notCanClass = [];
          res.data.forEach(ele => {
            notCanClass.push.apply(notCanClass,[...ele.classIds]);
            // notCanClass.concat([...ele.classIds]);
          })
          notCanClass = Array.from(new Set(notCanClass));
          that.setState({
            stuData: res.data,
            notCanClass
          });
        }
      },
    });
  };
  getDetail = (id) => {
    let that = this;
    that.props.dispatch({
      type: "pushConfiguration/getChildActivityCrontDetail",
      payload: {id},
      callback: (res) => {
        if (res.code === 200) {
          res.data.isPush = res.data.isPush + "";
          res.data.classIds = res.data.classIds.split(",");
          that.setState({formData:res.data})
        }
      }
    });
  }

  toEdit = (record) => {
    let title = "添加推送配置";
    if (record) {
      title = "修改推送配置";
      this.getDetail(record.crontId);
    }
    this.setState({
      modal_titile: title,
      visible: true,
      mode:record ? "mod":"add",
    });
  };

  toDelete = (record) => {
    let that = this;
    Modal.confirm({
      title: "确定要删除吗？",
      okText: "删除",
      okType: "primary",
      cancelText: "取消",
      onOk() {
        that.props.dispatch({
          type: "pushConfiguration/deleteChildActivityCront",
          payload: { id: record.crontId },
          callback: (res) => {
            if (res.code === 200) {
              that.getPageData();
            }
          },
        });
      },
      onCancel() {},
    });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }
  handleSave = (e) => {
    let that = this;
    that.props.form.validateFields().then(values => {
      let params = {...values};
      params.pushTime = moment(values.pushTime.format("1970-01-01 HH:mm:00")).unix();
      let types = "pushConfiguration/addChildActivityCront";
      if(that.state.mode === "mod"){
        params.id = this.state.formData.crontId;
        types = "pushConfiguration/modChildActivityCront";
      }
      that.props.dispatch({
        type: types,
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.getPageData();
            that.handleCancel();
          }
        },
      });
    });
  };

  render() {
    const { stuData,modal_titile,visible,formData,allClassArr,notCanClass } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    let classArr = allClassArr.filter((x) => !notCanClass.some((item) => allClassArr.indexOf(x) === item));
    let classOptions = [];
    classArr.forEach(ele => {
      classOptions.push(<Option key={ele.classId}>{ele.className}</Option>)
    })

    let stuColumns = [
      {
        title: "班级",
        dataIndex: "classes",
      },
      {
        title: "是否推送",
        dataIndex: "isPush",
        render: (text, record) => <span>{text === "1" ? "是" : "否"}</span>,
      },
      {
        title: "推送时间",
        dataIndex: "pushTime",
        render: (text, record) => {
          if(record.pushTime){
            return (<span>{moment(parseInt(record.pushTime , 0) * 1000).format("HH:mm")}</span>);
          }
          return null;
        },
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={this.toEdit.bind(this, record)}>
              编辑
            </a>
            &emsp;
            <a href="javascript:;" onClick={this.toDelete.bind(this, record)}>
              删除
            </a>
            &emsp;
          </span>
        ),
      },
    ];

    const tProps = {
      treeData:allClassArr,
      treeDefaultExpandAll:true,
      // value: this.state.value,
      // onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择适用班级',
      filterTreeNode:function(inputValue,treeNode){
        // console.log(treeNode.props.title)
        // let filterStr = treeNode.props.gradeName || "" + treeNode.props.className || "";
        return treeNode.props.title.indexOf(inputValue) !== -1
      },
      style: {
        width: '100%',
      },
    };

    return (
      <div className="content-main content-box">
        <div>
          <Row className="ant-row-fun" gutter={24}>
            <Col
              xl={{ span: 24, offset: 0 }}
              style={{ textAlign: "right", paddingRight: "20px" }}
            >
              <Button type="primary" onClick={this.toEdit.bind(this,null)}>
                添加
              </Button>
              &emsp;
            </Col>
          </Row>
          <Table
            rowKey="crontId"
            columns={stuColumns}
            dataSource={stuData}
            pagination={false}
          />
        </div>

        <Modal
          title={modal_titile}
          visible={visible}
          keyboard={false}
          maskClosable={false}
          width="600px"
          onOk={this.handleSave}
          okText="保存"
          onCancel={this.handleCancel}
        >
          <div className="edit-modal">
            <Form key="fixedAttendanceStu">
              <Row gutter={24}>
                <Col span={22}>
                  <Form.Item {...formItemLayout} label="选择班级">
                    {getFieldDecorator("classIds", {
                      initialValue:
                      formData.classIds || [],
                      rules: [{ required: true, message: "请选择适用班级" }],
                    })(
                      // <Select mode="multiple" placeholder="请选择适用班级" optionFilterProp="children"
                      // filterOption={(input, option) =>
                      //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      // }>
                      //   {classOptions}
                      // </Select>
                      <TreeSelect {...tProps}></TreeSelect>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={22}>
                  <Form.Item {...formItemLayout} label="是否推送">
                    {getFieldDecorator("isPush", {
                      initialValue:
                      formData.isPush || "1",
                    })(
                      <Radio.Group name="isPush">
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={22}>
                  <Form.Item {...formItemLayout} label="推送时间">
                    {getFieldDecorator("pushTime", {
                      initialValue:formData.pushTime ? moment(formData.pushTime * 1000) : moment('09:30', 'HH:mm'),
                    })(
                      <TimePicker format="HH:mm"></TimePicker>
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
export default connect(mapStateToProps)(Form.create()(PushConfiguration));
