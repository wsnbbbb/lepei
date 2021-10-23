/**
 * 固定班制考勤规则-route
 */
import React, { Component } from "react";
import { Table, Form, Tabs, Row, Col, Button, Modal,Switch  } from "antd";

import { connect } from "dva";
import "./style.less";
import { routerRedux } from 'dva/router';
// const FormItem = Form.Item;
import { withActivation } from 'react-activation'


import ChildrensActivitiesRecord  from"./childrensActivitiesRecord";
import { getImg } from "../../utils/img";

const { confirm } = Modal;
const { TabPane } = Tabs;


@withActivation
class ChildrensActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stuData: [],
      ruleDetail: {},
    };
  }

  componentDidMount = () => {
    this.getTempPageData();
  };

  //路由状态返回，组件做些什么处理
  componentDidActivate = () => {
    this.getTempPageData();
  }

  getTempPageData = () => {
    let that = this;
    that.props.dispatch({
      type: "childrensActivities/getChildActivityTemplate",
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let stuData = res.data;
          that.setState({
            stuData,
          });
        }
      },
    });
  };
  refreshData = () => {
    this.getTempPageData();
  };

  ruleTempAdd = (id) => {
    let url = "/childrens-activities-edit";
    if(id){
      url = url + "?id="+id;
    }
    this.props.dispatch(routerRedux.push(url))
  };

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
          type: "childrensActivities/deleteChildActivityTemplate",
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

  enableChange = (record) =>{
    let params = {
      id:record.templateId,
      enable:record.enable + "" === "1" ? "0" : "1"
    }
    this.props.dispatch({
      type: "childrensActivities/setChildActivityEnable",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.refreshData();
        }
      },
    });
  }

  render() {
    const { stuData } = this.state;
    let stuColumns = [
      {
        title: "排序",
        dataIndex: "sort",
      },
      {
        title: "名称",
        dataIndex: "activityName",
      },
      {
        title: "适用班级",
        dataIndex: "classes",
        width:450,
        ellipsis:true,
      },
      {
        title: "选择时间",
        dataIndex: "timeType",
        render:(text,record) => {
          return (<span>{record.timeType + "" === "0" ? "时间点" : "时间段"}</span>)
        }
      },
      {
        title: "状态",
        dataIndex: "isType",
        render:(text,record) => {
          return (<span>{record.isType + "" === "1" ? "是" : "否"}</span>)
        }
      },
      {
        title: "类型",
        dataIndex: "isStatus",
        render:(text,record) => {
          return (<span>{record.isStatus + "" === "1" ? "是" : "否"}</span>)
        }
      },
      {
        title: "图标",
        dataIndex: "logo",
        render:(text,record) => {
          return (<span>{record.logo ? (<img alt="" className="childrens-table-image" src={getImg(record.logo)} ></img>) : null}</span>)
        }
      },
      {
        title: "备注",
        dataIndex: "isRemark",
        render:(text,record) => {
          return (<span>{record.isRemark + "" === "1" ? "是" : "否"}</span>)
        }
      },
      {
        title: "图片",
        dataIndex: "isPic",
        render:(text,record) => {
          return (<span>{record.isPic + "" === "1" ? "是" : "否"}</span>)
        }
      },
      {
        title: "是否启用",
        dataIndex: "enable",
        render:(text,record) => {
          return (<Switch checked={record.enable + "" === "1"} onChange={this.enableChange.bind(this,record)}></Switch>)
        }

      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={this.ruleTempAdd.bind(this, record.templateId)}>编辑</a>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              target=""
              rel="noopener noreferrer"
              onClick={this.ruleDelete.bind(this, record.templateId)}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    return (
      <div className="content-main content-box">
        <Tabs defaultActiveKey="1">
          <TabPane tab="活动模板" key="1">
            <Row className="ant-row-fun" gutter={24}>
              <Col
                xl={{ span: 24, offset: 0 }}
                style={{ textAlign: "right", paddingRight: "20px" }}
              >
                <Button
                  type="primary"
                  onClick={this.ruleTempAdd.bind(this, null)}
                >
                  添加
                </Button>
                &emsp;
              </Col>
            </Row>
            <Table
              rowKey="templateId"
              columns={stuColumns}
              dataSource={stuData}
              pagination={false}
            />
          </TabPane>
          <TabPane tab="活动记录" key="2">
            <ChildrensActivitiesRecord></ChildrensActivitiesRecord>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(ChildrensActivities));
