/**
 * 意外事件类型管理
 */
import React, { Component } from "react";
import { Table, Form, Tabs, Breadcrumb, Row, Col, Button, Modal  } from "antd";

import PageIndex from '../../components/page';
import { connect } from "dva";
import "./style.less";
import { routerRedux } from 'dva/router';

import { withActivation } from 'react-activation'


const { confirm } = Modal;
const { TabPane } = Tabs;


@withActivation
class AccidentsTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stuData: {
        data1:{},
        data2:{},
        data3:{},
        data4:{},
        data5:{},
        data6:{},
      },
      activeKey:"1",
    };
  }

  componentDidMount = () => {
    let stuData = this.state.stuData;
    let category = this.state.activeKey;
    let pageSize = stuData["data"+category].pageSize || 20;
    let page = stuData["data"+category].page || 1;
    this.getPageData({page,pageSize,category});
  };

  //路由状态返回，组件做些什么处理
  componentDidActivate = () => {
    this.refreshData();
  }

  queryList = () => {
    let that = this;
    let stuData = that.state.stuData;
    let category = that.state.activeKey;
    let pageSize = stuData["data"+category].pageSize || 20;
    const params = {page:1,pageSize,category};
    that.getPageData(params);
    stuData["data"+category].page = 1;
    that.setState({
      stuData
    })
  }

  refreshData = () =>{
    let that = this;
    let stuData = that.state.stuData;
    let category = that.state.activeKey;
    let pageSize = stuData["data"+category].pageSize || 20;
    let page = stuData["data"+category].page || 1;
    const params = {page,pageSize,category};
    that.getPageData(params);
  }

  resetQuery = () => {
    let that = this;
    let stuData = that.state.stuData;
    let category = that.state.activeKey;
    let pageSize = stuData["data"+category].pageSize || 20;
    that.getPageData({page:1,pageSize,category});
    stuData["data"+category].page = 1;
    that.setState({
      stuData
    })
  }

  getPageData = (params) =>{
    let that = this;
    let keys = Object.keys(params);
    keys.forEach(ele => {
      if(!params[ele]){
        delete params[ele];
      }
    })
    that.props.dispatch({
      type: "accidentsTypes/getAccidentTypesByPage",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let stuData = that.state.stuData;
          stuData["data" + params.category] = res.data
          that.setState({
            stuData
          })
        }
      }
    })
  }

  onPageChange =  (current, size) => {
    let that = this;
    let category = that.state.activeKey;
    const params = {page:current,pageSize:size,category};
    that.setState({ page: current, pageSize: size })
    that.getPageData(params);
  }

  ruleTempAdd = (id) => {
    let category = this.state.activeKey;
    let url = "/accident-types-edit?category=" + category;
    if(id){
      url = url + "&id="+id;
    }
    this.props.dispatch(routerRedux.push(url))
  };

  ruleDelete = (id, type) => {
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
          type: "accidentsTypes/deleteAccidentTypes",
          payload: params,
          callback: (res) => {
            if (res.code === 200) {
              that.refreshData(type);
            }
          },
        });
      },
      onCancel() {},
    });
  };

  tabsChange = (activeKey) => {
    this.setState({activeKey});
    let stuData = this.state.stuData;
    if(!stuData["data" + activeKey].dataList || stuData["data" + activeKey].dataList.length < 1){
      let category = activeKey;
      let pageSize = stuData["data"+category].pageSize || 20;
      let page = stuData["data"+category].page || 1;
      this.getPageData({page,pageSize,category});
    }
  }

  getTableColumns = () =>{
    const { activeKey,stuData } = this.state;
    let typeTabs = ["类型名称","发生地点","活动名称","同行角色","处理类型","转归类型"];
    let stuColumns = [
      {
        title: "序号",
        dataIndex: "id",
        width:80,
        render:(text,record,index) => {
          return (<span>{(index + 1)}</span>)
        }
      },
      {
        title: typeTabs[parseInt(activeKey,0) - 1],
        dataIndex: "name",
      },
      {
        title: "关联事件",
        dataIndex: "recordCount",
      },
      {
        title: "是否开通描述",
        dataIndex: "isOpenedDesc",
        render:(text,record) => {
          return (<span>{record.isOpenedDesc + "" === "1" ? "是" : "否"}</span>)
        }
      },
      {
        title: "备注",
        dataIndex: "remark",
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={this.ruleTempAdd.bind(this, record.id)}>编辑</a>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              target=""
              rel="noopener noreferrer"
              onClick={this.ruleDelete.bind(this, record.id)}
            >
              删除
            </a>
          </span>
        ),
      },
    ];
    return {stuColumns,tableData: stuData["data" + activeKey]};
  }

  render() {
    const { activeKey } = this.state;
    let {stuColumns,tableData} = this.getTableColumns();

    let typeTabs = [{title:"伤害类型",key:"1"},{title:"发生地点",key:"2"},{title:"伤害发生时活动",key:"3"},{title:"伤害同行",key:"4"},{title:"处理方式",key:"5"},{title:"转归",key:"6"},];
    let tabpanels = [];
    typeTabs.forEach(ele => {
      tabpanels.push(<TabPane tab={ele.title} key={ele.key}></TabPane>)
    })

    return (
      <div className="content-main content-box">
        <Row gutter={24}>
          <Col span={20}>
            <Tabs activeKey={activeKey} onChange={this.tabsChange}>
              {tabpanels}
            </Tabs>
          </Col>
          <Col span={4} style={{textAlign:"right",paddingRight:"20px"}}>
            <Button type='primary' onClick={this.ruleTempAdd.bind(this,null)}>添加</Button>&emsp;
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={stuColumns}
          dataSource={tableData.dataList}
          pagination={false}
        />
        <div className="paginationBox">
          <PageIndex getPage={this.onPageChange.bind(this)} total={tableData.totalCount} totalPage={tableData.totalPage} currentPage={tableData.currentPage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(AccidentsTypes));
