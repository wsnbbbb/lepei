/**
 * 幼儿活动记录-route
 */
import React, { Component } from "react";
import { Table, Form, Row, Col, Button, Modal,Select,Input,DatePicker } from "antd";

import PageIndex from '../../components/page';
import { connect } from "dva";
import moment from "moment";
import "./style.less";

import { getImg } from "../../utils/img";
// const FormItem = Form.Item;

const { confirm } = Modal;
const { Option } = Select;

class ChildrensActivitiesRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      stuData: {},
      page:1,
      pageSize:20,
      stuDataDetail:{},
      gradeDataArrs:[],
      classDataArrs:[],
    };
  }

  componentDidMount = () => {
    this.getGradeNameAll();
    this.getAllClass();
    let {page,pageSize} = this.state;
    this.getPageData({page,pageSize});
  };

  getGradeNameAll = () => {
    let that = this;
    that.props.dispatch({
      type: "childrensActivities/getGradeName",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          that.setState({
            gradeDataArrs: res.data,
          });
        }
      },
    });
  };
  getAllClass = () => {
    let that = this;
    that.props.dispatch({
      type: "childrensActivities/getAllClass",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          that.setState({
            classDataArrs: res.data,
          });
        }
      },
    });
  };

  queryList = () => {
    let that = this;
    that.props.form.validateFields().then(values => {
      let pageSize = that.state.pageSize;
      const params = Object.assign({page:1,pageSize},values);
      params.startTime = params.startTime ? params.startTime.format("YYYY-MM-DD") : null;
      params.endTime = params.endTime ? params.endTime.format("YYYY-MM-DD") : null;
      that.getPageData(params);
      that.setState({
        page:1
      })
    })
  }

  refreshData = () =>{
    let that = this;
    that.props.form.validateFields().then(values => {
      let pageSize = that.state.pageSize;
      let page = that.state.page;
      const params = Object.assign({page,pageSize},values);
      params.startTime = params.startTime ? params.startTime.format("YYYY-MM-DD") : null;
      params.endTime = params.endTime ? params.endTime.format("YYYY-MM-DD") : null;
      that.getPageData(params);
    })
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
    Object.keys(params).forEach(ele => {
      if(!params[ele]){
        delete params[ele];
      }
    })
    this.props.dispatch({
      type: "childrensActivities/getChildActivityRecordByPage",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
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
      params.startTime = params.startTime ? params.startTime.format("YYYY-MM-DD") : null;
      params.endTime = params.endTime ? params.endTime.format("YYYY-MM-DD") : null;
      that.setState({ page: current, pageSize: size })
      that.getPageData(params);
    })
  }

  ruleRecordView = (id) =>{
    let that = this;
    that.props.dispatch({
      type: "childrensActivities/getChildActivityRecordDetail",
      payload: {id},
      callback: (res) => {
        if (res.code === 200) {
          that.setState({
            stuDataDetail: res.data,
            visible:true,
          })
        }
      }
    })

  }

  ruleDelete = (id) => {
    let that = this;
    confirm({
      title: "提示",
      content: "确定要删除吗？",
      okText: "确定",
      okType: "primary",
      cancelText: "取消",
      onOk() {
        let params = { id: id };
        that.props.dispatch({
          type: "childrensActivities/deleteChildActivityRecord",
          payload: params,
          callback: (res) => {
            if (res.code === 200) {
              that.refreshData();
            }
          },
        });
      },
      onCancel() {},
    });
  };

  showDetail = (id) =>{
    this.setState({visible:true})
  }

  closeModal = () =>{
    this.setState({
      stuDataDetail:{},
      visible:false
    })
  }

  render() {
    const { stuData,visible,stuDataDetail,gradeDataArrs,classDataArrs } = this.state;
    const { getFieldDecorator } = this.props.form;
    const dayFormat = 'YYYY年MM月DD日';
    let stuColumns = [
      {
        title: "姓名",
        dataIndex: "studentName",
      },
      {
        title: "性别",
        dataIndex: "sex",
        render: (text,record) => {
          let t = "保密";
          if(record.sex + "" === "1") t= "男"
          else if(record.sex + "" === "2") t= "女"
          return (<span>{t}</span>)
        }
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
        title: "活动名称",
        dataIndex: "activityName",
      },
      {
        title: "状态",
        dataIndex: "statusName",
      },
      {
        title: "类型",
        dataIndex: "typeName",
      },
      {
        title: "备注",
        dataIndex: "remark",
      },
      {
        title: "时间",
        dataIndex: "createTime",
        render: (text, record) => {
          let desc = '';
          if(record.createTime){
            desc = moment(record.createTime * 1000).format("YYYY-MM-DD HH:mm:ss");
          }
          return (<span>{desc}</span>)
        }
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={this.ruleRecordView.bind(this, record.activityId)}>查看</a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              target=""
              rel="noopener noreferrer"
              onClick={this.ruleDelete.bind(this, record.activityId)}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    let classArrs = [];
    classDataArrs.forEach((ele) => {
      classArrs.push(<Option key={ele.classId}>{ele.className}</Option>);
    });
    let gradeArrs = [];
    gradeDataArrs.forEach((ele) => {
      gradeArrs.push(<Option key={ele.gradeId}>{ele.gradeName}</Option>);
    });

    let detailPic = [];
    if(stuDataDetail.pic){
      stuDataDetail.pic.forEach(ele => {
        detailPic.push(<image src={getImg(ele)} className="childrens-detail-image"></image>)
      })
    }

    return (
      <div className="stu-statistics">
        <Form>
          <Row className="ant-row-fun" gutter={24}>
            <Col xl={{ span: 18, offset: 0 }}>
              <Col xl={{ span: 4, offset: 0 }}>
                <Form.Item>
                  {getFieldDecorator("gradeId")(<Select placeholder="年级" optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                    {gradeArrs}
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 4, offset: 0 }}>
                <Form.Item>
                  {getFieldDecorator("classId")(<Select placeholder="班级" optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                    {classArrs}
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 0 }}>
                <Form.Item>
                  {getFieldDecorator("kw")(<Input placeholder="学生姓名/活动名称" maxLength={30} />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 10, offset: 0 }}>
                <Col span={11}>
                  <Form.Item>
                    {getFieldDecorator("startTime", {
                    })(<DatePicker placeholder="开始日期" format={dayFormat} style={{width:"100%"}}></DatePicker>)}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item>
                    {getFieldDecorator("endTime", {
                    })(<DatePicker placeholder="结束日期" format={dayFormat} style={{width:"100%"}}></DatePicker>)}
                  </Form.Item>
                </Col>
              </Col>
            </Col>
            <Col xl={{ span: 6, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
              <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
              <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
            </Col>
          </Row>
        </Form>
        <Table rowKey="activityId" columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
        <div className="paginationBox">
          <PageIndex getPage={this.onPageChange.bind(this)} total={stuData.totalCount} totalPage={stuData.totalPage} currentPage={stuData.currentPage} />
        </div>

        <Modal
          title="活动明细"
          visible={visible}
          maskClosable={false}
          keyboard
          closable
          width="600px"
          onCancel={this.closeModal}
          footer={null}
        >
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">活动名称：</Col>
            <Col span={16}>{stuDataDetail.activityName}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">适用班级：</Col>
            <Col span={16}>{stuDataDetail.className}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">时间：</Col>
            <Col span={16}>{stuDataDetail.createTime ? moment(stuDataDetail.createTime * 1000).format("YYYY-MM-DD HH:mm:ss") : ""}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">类型：</Col>
            <Col span={16}>{stuDataDetail.typeName}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">状态：</Col>
            <Col span={16}>{stuDataDetail.statusName}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">备注：</Col>
            <Col span={16}>{stuDataDetail.remark}</Col>
          </Row>
          <Row gutter={24} className="childrens-act-record-row">
            <Col span={6} className="right-col">图片：</Col>
            <Col span={16}>
              {detailPic}
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(ChildrensActivitiesRecord));
