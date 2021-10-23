import React, { Component } from "react";
import { Form, Row, Col, Table, Button,Drawer,Input } from "antd";
import { connect } from "dva";
import "./style.less";


class FixedAttendanceChoosePersonDrawer extends Component {
  constructor(props) {
    // 注意这里将props传入了构造器 Class 方式创建的组件必须总是调用带有 props 的构造器
    super(props);
    this.state = {
      stuPersons:[],
      teachPersons:[],
      drawerVisible: false,
      drawerData:[],
      drawerPersonIndex:-1,
      drawerType:"",
      selectedRowKeys:[],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  onDrawerClose = (isClear = false) => {
    if(isClear){
      this.setState({
        drawerPersonIndex:-1,
        drawerType:"",
        drawerData:[],
        selectedRowKeys:[],
      });
      this.props.form.resetFields(["personName"]);
    }
    this.setState({
      drawerVisible: false,
    });
  }

  onShowAddPerson = (ruleIndex,type,teachPersons,stuPersons) => {
    this.setState({
      drawerVisible: true,
      drawerPersonIndex:ruleIndex,
      drawerType:type,
      selectedRowKeys:[],
      teachPersons,
      stuPersons
    });
  }

  onAddPersons = () => {
    if(this.state.selectedRowKeys.length < 1){
      return;
    }
    let {selectedRowKeys,drawerType,drawerPersonIndex} = this.state;
    if(drawerType === "1"){
      //预警接收人
      this.props.getAddPersons(selectedRowKeys,drawerType,drawerPersonIndex);
    }else if(drawerType === "2"){
      //排除人
      this.props.getAddPersons(selectedRowKeys,drawerType,drawerPersonIndex);
    }
    this.onDrawerClose(true);
  }
  onSelectChange = (selectedRowKeys ) =>{
    this.setState({
      selectedRowKeys
    })
  }

  searchPerson = () => {
    let that = this;
    that.props.form.validateFields(["personName"],(err, values) => {
      if(values.personName){
        let personName = values.personName;
        if(that.state.drawerType === "1"){
          let teachData = that.state.teachPersons;
          let drawerData = teachData.filter(ele => ele.personName.indexOf(personName) !== -1);
          that.setState({drawerData});
        }else if(that.state.drawerType === "2"){
          let stuData = that.state.stuPersons;
          let drawerData = stuData.filter(ele => ele.personName.indexOf(personName) !== -1);
          that.setState({drawerData});
        }
        that.setState({selectedRowKeys:[]})
      }
    })
  }


  render() {
    let { drawerData,selectedRowKeys } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    let rowSelection = {
      columnTitle:"操作",
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    let drawerTableColumns = [
      {
        title: '姓名',
        dataIndex: 'personName',
      },
    ];

    return (
        <Drawer
          title="添加人员"
          placement="right"
          closable={false}
          onClose={this.onDrawerClose}
          visible={this.state.drawerVisible}
          zIndex={2000}
          width="500"
        >
          <div className="edit-warn-drawer">
            <Row className="ant-row-fun" gutter={24}>
              <Col xl={{ span: 20, offset: 0 }}>
                <Form>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("personName", {
                      rules: [{ required: true, message: "请输入姓名后搜索" },],
                    })(<Input style={{width:170,marginRight:20}} placeholder="请输入姓名" maxLength={30} />)}
                    <Button type='primary' onClick={this.searchPerson.bind(this)}>搜索</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <div className="tables">
              <Table rowKey="key" rowSelection={rowSelection} columns={drawerTableColumns} dataSource={drawerData} pagination={false} />
            </div>
            <Row className="ant-row-fun" gutter={24}>
              <Col xl={{ span: 9, offset: 0 }}>
                <Button type='primary' onClick={this.onAddPersons.bind(this)}>添加</Button>&emsp;
                <Button type='primary' ghost onClick={this.onDrawerClose.bind(this,true)}>返回</Button>&emsp;
              </Col>
            </Row>
          </div>
        </Drawer>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(
  Form.create()(FixedAttendanceChoosePersonDrawer)
);
