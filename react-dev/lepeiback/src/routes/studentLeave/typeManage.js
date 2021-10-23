import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button, Input, Select, Form, Row, Col, Tag, Divider, Radio, Dropdown, Icon, Breadcrumb, Tabs, message, Modal, DatePicker, InputNumber } from 'antd';
import PageIndex from '../../components/page';
import { isBlank } from '../../utils/public';
import './style.less';

const confirm = Modal.confirm;
const { TextArea } = Input;

class typeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      visible: false,
      visibleEdit: false,
      applyPerson: '',
      gradeId: undefined,
      classId: undefined,
      leaveType: undefined,
      status: undefined,
      leaveList: [],
      kw: undefined,
      typeName: undefined,
      des: undefined,
      editTypeName: undefined,
      editDes: undefined,
      editId: undefined,
      dataList: {},
      isIll: 0,
      editIsIll: 0,
      title:'请假类型管理'
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.studentLeaveType(params);
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/student-leave"
      },
      })
  }

  componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	}

  // 请假类型列表
  studentLeaveType = (params) => {
    this.props.dispatch({
      type: 'studentLeave/studentLeaveType',
      payload: params,
      callback: (res) => {
        console.log(res)
        if (res.code === 200) {
          this.setState({
            dataList: res.data,
            leaveList: res.data.dataList
          })
        }
      }
    })
  }

  // 查询
  search = () => {
    const params = {
      "page": 1,
      "prePage": this.state.prePage,
      "kw": this.state.kw || "",
    }
    this.studentLeaveType(params)
  }
  // 分页
  onPageChange = (current, size) => {
    this.setState({ page: current, prePage: size })
    const params = {
      "page": current,
      "prePage": size,
      "kw": this.state.kw || "",
    }
    this.studentLeaveType(params)
  }

  onChange1 = (e) => {
    this.setState({
      kw: e.target.value
    })
  }
  onChange2 = (e) => {
    this.setState({
      typeName: e.target.value
    })
  }

  onChange3 = (e) => {
    this.setState({
      des: e.target.value
    })
  }

  onChange4 = (e) => {
    this.setState({
      editTypeName: e.target.value
    })
  }

  onChange5 = (e) => {
    this.setState({
      editDes: e.target.value
    })
  }

  addType = () => {
    this.setState({
      visible: true
    })
  }
  changeIsIll = (e) => {
    this.setState({
      isIll: e.target.value
    })
  }
  editIsIll = (e) => {
    this.setState({
      editIsIll: e.target.value
    })
  }
  // 类型添加
  handleAdd = () => {
    if (isBlank(this.state.typeName)) {
      message.warning("类型名称不能为空！")
      return
    }
    const params = {
      "typeName": this.state.typeName,
      "intro": this.state.des,
      "category": this.state.isIll
    }
    this.props.dispatch({
      type: 'studentLeave/addLeaveType',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          message.success("添加成功！")
          this.setState({
            visible: false,
            typeName: '',
            des: '',
            isIll: 0
          })
          this.studentLeaveType();
        }
      }
    })
  }

  // 添加取消
  handleCancel = () => {
    this.setState({
      visible: false,
      typeName: '',
      des: '',
      isIll: 0
    })
  }

  // 编辑
  edit = (id) => {
    let filterData = this.state.leaveList && this.state.leaveList.filter((item) => {
      return item.typeId == id
    })
    this.setState({
      visibleEdit: true,
      editTypeName: filterData[0].typeName,
      editDes: filterData[0].intro,
      editId: id,
      editIsIll: Number(filterData[0].category)
    })
  }

  // 编辑确定
  handleEdit = () => {
    if (isBlank(this.state.editTypeName)) {
      message.warning("类型名称不能为空！")
      return
    }
    const params = {
      typeName: this.state.editTypeName,
      intro: this.state.editDes,
      id: this.state.editId,
      category: this.state.editIsIll,
    }
    this.props.dispatch({
      type: 'studentLeave/editStudentLeaveType',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          message.success("编辑成功！")
          this.setState({
            visibleEdit: false,
            editTypeName: '',
            editDes: '',
            eidtId: '',
            editIsIll: 0,
          })
          this.studentLeaveType();
        }
      }
    })
  }

  //编辑取消 
  handleCancel1 = () => {
    this.setState({
      visibleEdit: false,
      editTypeName: undefined,
      editDes: undefined,
      eidtId: undefined,
      editIsIll: 0,
    })
  }
  // 删除
  showConfirm = (id) => {
    let me = this;
    confirm({
      title: '提示',
      content: <span>确定要删除这条信息吗？</span>,
      onOk() {
        me.props.dispatch({
          type: 'studentLeave/deleteStudentLeaveType',
          payload: { "id": id },
          callback: (res) => {
            if (res.code === 200) {
              message.success('删除成功！', 3)
              me.studentLeaveType()
            }
          }
        })
      },
      onCancel() { },
    });
  }
  
  render() {
    const columns = [{
      title: '类型名称',
      dataIndex: 'typeName',
    }, {
      title: '简介',
      dataIndex: 'intro',
    }, {
      title: '所属分类',
      dataIndex: 'category',
      render: (record) => {
        return (<span>{record == 0 ? '事假' : (record == 1 ? '病假' : '其他')}</span>)
      }
    }, {
      title: '操作',
      width: 150,
      dataIndex: '',
      render: (record) => (
        <span>
          <a href="javascript:;" onClick={this.edit.bind(this, record.typeId)}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.showConfirm.bind(this, record.typeId)}>删除</a>
        </span>
      ),
    }];

    return (
      <div className="content-main type-manage">
        {/* <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/student-leave">学生请假管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>请假类型管理</Breadcrumb.Item>
          </Breadcrumb>
        </div> */}
        <Row>
          <Input placeholder="请输入请假类型名称" value={this.state.kw} onChange={this.onChange1.bind(this)} maxLength={30} style={{ width: 200 }} />
          <div className="btn-wrap">
              <Button type="primary" onClick={this.search.bind(this)} >查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={this.addType.bind(this)}>添加</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        </Row>
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.leaveList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.dataList.totalCount} totalPage={this.state.dataList.totalPage} currentPage={this.state.dataList.currentPage} />
        <Modal
          title="添加请假类型"
          visible={this.state.visible}
          onOk={this.handleAdd}
          onCancel={this.handleCancel}
        >
          <Row>
            <span style={{ color: "#FF3E3E" }}>*</span>类型名称：<Input placeholder="请输入请假类型名称" value={this.state.typeName} onChange={this.onChange2.bind(this)} maxLength={30} style={{ width: 200 }} />
          </Row>
          <Row style={{ padding: "20px 0px" }}>
            &nbsp;类型简介：<TextArea rows={4} value={this.state.des} onChange={this.onChange3.bind(this)} style={{ display: "inline-block", width: "390px", verticalAlign: "top" }} />
          </Row>
          <Row style={{ paddingBottom: "20px" }}>
            &nbsp;所属分类：
            <Radio.Group rows={4} onChange={this.changeIsIll.bind(this)} value={this.state.isIll}>
              <Radio value={1}>病假</Radio>
              <Radio value={0}>事假</Radio>
              <Radio value={2}>其他</Radio>
            </Radio.Group>
          </Row>
        </Modal>
        <Modal
          title="编辑请假类型"
          visible={this.state.visibleEdit}
          onOk={this.handleEdit}
          onCancel={this.handleCancel1}
        >
          <Row>
            <span style={{ color: "#FF3E3E" }}>*</span>类型名称：<Input placeholder="请输入请假类型名称" value={this.state.editTypeName} onChange={this.onChange4.bind(this)} maxLength={20} style={{ width: 200 }} />
          </Row>
          <Row style={{ padding: "20px 0px" }}>
            &nbsp;类型简介：<TextArea rows={4} value={this.state.editDes} onChange={this.onChange5.bind(this)} style={{ display: "inline-block", width: "390px", verticalAlign: "top" }} />
          </Row>
          <Row style={{ paddingBottom: "20px" }}>
            &nbsp;所属分类：
            <Radio.Group rows={4} onChange={this.editIsIll.bind(this)} value={this.state.editIsIll}>
              <Radio value={1}>病假</Radio>
              <Radio value={0}>事假</Radio>
              <Radio value={2}>其他</Radio>
            </Radio.Group>
          </Row>
        </Modal>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(Form.create()(typeManage));
