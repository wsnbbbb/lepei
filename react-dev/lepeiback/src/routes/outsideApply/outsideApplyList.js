import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Form, Row, Col, Select,Menu, Dropdown,Modal,message,Breadcrumb,Tooltip } from 'antd';
import { routerRedux,Link } from 'dva/router';
import { formatDate } from '../../utils/public';
import copy from 'copy-to-clipboard';
import PageIndex from '../../components/page';
import { questionUrl } from '../../utils/img';
import { outsideApplyUrl } from '../../config';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class OutsideApplyList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          data: {},
          detailList: [],
        };
    }
    componentDidMount=()=>{
      const params = {
        "page": 1,
        "prePage": 20,
      }
      this.getList(params)
    }
    // 获取列表
    getList = (params) =>{
      this.props.dispatch({
        type:'outsideApply/outsideApplyList',
        payload:params,
        callback:res =>{
          if(res.code === 200){
            this.setState({
              data: res.data,
              detailList: res.data.dataList
            })
          }
        }
      })
    }
    // 查询
    search = () =>{
      this.props.form.validateFields((err, values) => {
        const params = {
          "kw": values.kw || '',
          "status": values.status || '',
          "page": 1,
          "prePage": this.state.prePage,
        }
        this.getList(params)
        this.setState({ page: 1 })
      })
    }

    copy = ()=>{
      if(copy(`${outsideApplyUrl}?schoolId=${sessionStorage.getItem("schoolId")}`)){
        console.log("复制成功");
        message.success("复制成功")
      }else{
          console.log("复制失败")
      }
    }
    // 分页
    onPageChange = (current, size) => {
      this.props.form.validateFields((err, values) => {
        this.setState({ page: current, prePage: size })
        const params = {
          "page": current,
          "prePage": size,
          "kw": values.kw || '',
          "status": values.status || '',
        }
        this.getList(params)
      })
    }
    // 添加/编辑
    add = (type,id) => {
      if(type == 1){
        this.props.dispatch(routerRedux.push("/outside-apply-detail"))
      }else{
        this.props.dispatch(routerRedux.push("/outside-apply-detail?id=" + id))
      }
    }
    // 重置
    reset = () => {
      this.props.form.resetFields()
    }
    // 删除
    showConfirm = (id) => {
      let me = this;
      confirm({
        title: '提示',
        content: "确定要删除这条信息吗？",
        onOk() {
          me.props.dispatch({
            type:'outsideApply/delOutsideApply',
            payload:{ id },
            callback:(res) =>{
              if(res.code === 200){
                message.success('删除成功！')
                me.props.form.validateFields((err, values) => {
                  const params = {
                    "kw":values.kw || '',
                    "status":values.status || '',
                    "page": me.state.page,
                    "prePage": me.state.prePage,
                  }
                  me.getList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 添加/编辑
    goToDetail = (type,id) =>{
      console.log({type});
      if(type == 1){
        this.props.dispatch(routerRedux.push("/outside-apply-detail"))
      }else{
        this.props.dispatch(routerRedux.push("/outside-apply-detail?id=" + id))
      }
    }
    render(){
      const { data,detailList,  } = this.state;
      const { getFieldDecorator } = this.props.form;
      const columns = [{
          title: '类型名称',
          dataIndex: 'name',
        }, {
          title: '状态',
          dataIndex: 'status',
          render: (record) => {
            return (<span>{record == 1 ? '启用' : '禁用'}</span>)
          }
        }, {
          title: '添加时间',
          dataIndex: 'createTime',
          render: (record) => {
            return (<span>{formatDate(record)}</span>)
          }
        },{
          title: '操作',
          dataIndex: '',
          width:150,
          fixed:'right',
          render:(text, record) => (
            <span className="make-box">
              <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.id)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" className="check-btn"  onClick={this.showConfirm.bind(this,record.id)}>删除</a> 
            </span>
          )
      }];
      return (
          <div className="specialCase-list">
              <div className="breadcrumb">
                <Breadcrumb>
                  <Breadcrumb.Item>安全管理</Breadcrumb.Item>
                  <Breadcrumb.Item>校外申请</Breadcrumb.Item>
                  <Breadcrumb.Item>校外申请管理</Breadcrumb.Item>
                </Breadcrumb>
                <h3>校外申请管理</h3>
              </div>
              <div className="content-main">
                <Form>
                  <Row gutter={24}>
                    <Col span={5}>
                        <FormItem label=''>
                        {getFieldDecorator('kw')(
                            <Search placeholder="类型名称"/>
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
                      <Button type='primary' onClick={this.copy.bind(this)}>复制链接</Button>&emsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                      <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                      <Button type='primary' onClick={this.goToDetail.bind(this,1,null)}>添加</Button>
                    </Col>
                  </Row>
                </Form>              
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
              </div>
          </div>
      );
    }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(OutsideApplyList));
