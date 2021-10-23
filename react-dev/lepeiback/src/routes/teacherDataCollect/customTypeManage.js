import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Input, Select, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { onlyDate, belongType } from '../../utils/public';
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class CustomTypeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      deviceNo: '',
      remark: '',
      currentDeviceNo: '',
      previewImg: '',
      classValue: '',
      exportUrl: '',
      disabled: true,
      disabled1: true,
      isShow: false,
      flag: false,
      date:moment().format('YYYY-MM-DD'),
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
  }

  componentWillUnmount = () => {
    sessionStorage.removeItem("qiniuToken");
    //组件卸载时，清空手动加入的面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {},
    })
}

  // 获取自定义类型列表
  getList = (params) => {
    this.props.dispatch({
      type: 'teacherDataCollect/customTypeList',
      payload: params,
      callback: res => {
        this.setState({
          data: res.data
        })
      }
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        'status': values.status || '',
      }
      this.getList(params)
      this.setState({ page: 1 })
    })
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "kw": values.kw || '',
        'status': values.status || '',
      }
      this.getList(params)
    })
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
  }
 
  // 添加/编辑
  add = (type,id) => {
    if(type == 1){
      this.props.dispatch(routerRedux.push("/custom-type-detail?type=" + type))
    }else{
      this.props.dispatch(routerRedux.push("/custom-type-detail?id=" + id + "&type=" + type))
    }
  }
 
  // 复制
  copy = (id) =>{
    let _this = this
    this.props.dispatch({
      type: 'teacherDataCollect/copyCustomType',
      payload: {"id": id},
      callback: (res) => {
        if(res.code === 200){
          Modal.success({
            title: '提示',
            content: '复制成功！',
            onOk() {
              _this.props.form.validateFields((err, values) => {
                const params={
                  "page": 1,
                  "prePage": _this.state.prePage,
                  "kw": values.kw||'',
                  "status": values.status||'',
                }
                _this.getList(params)
              })
            },
          });
        }
      }
    })
  }
  // 删除
  del = (id) => {
    let _this = this;
    confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk() {
        _this.props.dispatch({
          type: 'teacherDataCollect/delCustomType',
          payload: {"id": id},
          callback: (res)=>{
            if(res.code===200){
              message.success('删除成功！',3)
              _this.props.form.validateFields((err, values) => {
                const params={
                  "page" :_this.state.page,
                  "prePage": _this.state.prePage,
                  "kw": values.kw||'',
                  "status": values.status||'',
                }
                _this.getList(params)
              })
            }
          }
        })
      },
      onCancel() {},
    });
  }
  render() {
    const columns = [{
      title: '编号',
      dataIndex: 'id',
    }, {
      title: '项目名称',
      dataIndex: 'name',
    }, {
      title: '所属类型',
      dataIndex: 'cate',
      render:( record) => (
        <span>{belongType(record)}</span>
      )
    }, {
      title: '发布人',
      dataIndex: 'publisherName',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (record) => {
        return (<span>{record == 1 ? '启用' : '禁用'}</span>)
      }
    }, {
      title: '操作',
      dataIndex: '',
      width:180,
      fixed:'right',
      render:(text, record) => (
        <span>
          <a href="javascript:;" onClick={this.add.bind(this,2,record.id)}>编辑&emsp;</a>
          <a href="javascript:;" onClick={this.copy.bind(this,record.id)}>复制&emsp;</a>
          <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
        </span>
      )
    }];
    const { flag,isShow, } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="consume-record">
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="项目名称" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("status")(
                    <Select allowClear placeholder="状态">
                      <Option value="1">启用</Option>
                      <Option value="2">禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={15} style={{ textAlign: 'right',paddingRight:'20px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <Button type='primary' onClick={this.add.bind(this,1,null)}>添加</Button>
              </Col>
            </Row>
           
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(CustomTypeManage));
