import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Descriptions, Breadcrumb, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getCardType, getCardStatus, getQueryString} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';
import QueryString from 'qs';
import copy from 'copy-to-clipboard';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class MonitorDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          page1:1,
          prePage1:20,
          info: {},
          data1: {},
          visible: false,
          visibleAdd: false,
          reset:false,
          data: [],
          deviceNo: '',
          remark: '',
          currentDeviceNo: '',
          selectedRowKeys:[],
          ids:[],
          title:"按设备授权"
        };
    }
    componentDidMount=()=>{
      this.getList({
        "devId": getQueryString("id"),
        "page": 1,
        "prePage": this.state.prePage,}
      )
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/assessment-record"
        },
      })
    }

    componentWillUnmount = () => {
      sessionStorage.removeItem("qiniuToken");
          //组件卸载时，清空手动加入的面包屑
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {},
          })
    }

    getUnAuthList=(params)=>{
      this.props.dispatch({
        type:'monitor/getUnAuthList',
        payload: params,
        callback: res=>{
          this.setState({
            data1: res.data,
            selectedRowKeys: [],
            ids: []
          })
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'monitor/getMonitorAuth',
        payload: params,
        callback: res=>{
          this.setState({
            data: res.data,
            info: res.data.devInfo
          })
        }
      })
    }

    addPerson=(ids)=>{

      this.batchAddPerson({
        devId: getQueryString("id"),
        personIds: [ids]
      });
    }

    addPersonBatch=()=>{

      this.batchAddPerson({
        devId: getQueryString("id"),
        personIds: this.state.ids
      });
    }

    batchAddPerson=(params)=>{
      this.props.dispatch({
        type:'monitor/batchAddPerson',
        payload: params,
        callback: res=>{
          if(res.code==200){
            message.success("添加成功！")
            this.setState({
              visible: false
            })
            this.onPageChange(1, 20)
          }
        }
      })
    }

    delete = (id) => {
      let me=this;
      confirm({
        title: '提示',
        content: '确认删除?',
        onOk() {
          me.props.dispatch({
              type:'monitor/delAuthPerson',
              payload:{
                devId: getQueryString("id"),
                personId: id
              },
              callback:(res)=>{
                  if(res.code===200){
                    message.success('删除成功！')
                    me.onPageChange(1, 20)
                  }
              }
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "devId": getQueryString("id"),
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
        }
        this.getList(params)
        this.setState({page:1})
      })
    }

    // 查询
    search1=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": 20,
          "kw": values.kw1||'',
          "devId": getQueryString("id"),
          "personType": 2
        }
        this.getUnAuthList(params)
        this.setState({page1:1})
      })
    }

    handleCancel =()=>{
      this.setState({
        visible: false
      }) 
    }
  
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "devId": getQueryString("id"),
          "personType": 2
        }
        this.getList(params)
      })
    }

     // 分页
     onPageChange1=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page1:current, prePage1:size})
        const params={
          "page": current,
          "prePage": size,
          "kw": values.kw1||'',
          "devId": getQueryString("id"),
          "personType": 2
        }
        this.getUnAuthList(params)
      })
    }

 
    add = () => {
      this.props.form.resetFields(["kw1"]);
      this.setState({
        data1: {},
        visible: true,
        page1: 1,
      },   function(){
        this.props.form.validateFields((err, values) => {
          this.getUnAuthList({
            "page": 1,
            "prePage": this.state.prePage1,
            "kw": values.kw1||'',
            "devId": getQueryString("id"),
            "personType": 2
          });
        })
      })
     

    }

 
    // 选择项
    onSelectChange = (selectedRowKeys, selectedRows) => {
      let ids=[];
      selectedRows&&selectedRows.length >0 && selectedRows.map(item => {
        return ids.push(item.personId)
      })

      
      this.setState({ ids: ids, selectedRowKeys: selectedRowKeys});
       console.log(this.state.ids)
    }
    // 全选
    selectAll=(selected, selectedRows, changeRows)=>{
      console.log({selected})
      let allId = [];
      if(selected === true){
        selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
          return allId.push(item.personId)
        })
        this.setState({ ids:allId});
      }else{
        this.setState({ ids:[]});
      }
    }

    render(){
        const { selectedRowKeys, } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.onSelectChange(selectedRowKeys, selectedRows)
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            this.selectAll(selected, selectedRows, changeRows)
          },
        };
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'personSex',
            render:(record)=>{
            return(<span>{record==1?"男":"女"}</span>)
          }
          },{
            title: '组织信息（全）',
            dataIndex: 'departmentName',
            render:(record)=>{
                return(<span>{record}</span>)
            }
          },{
            title: '操作',
            dataIndex: 'personId',
            width: 200,
            render:(record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.delete.bind(this, record)}>删除</a>
              </span>
            )
          }];

  
          const columns1 = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'personSex',
            render:(record)=>{
            return(<span>{record==1?"男":"女"}</span>)
          }
          },{
            title: '部门',
            dataIndex: 'departmentName',
            render:(record)=>{
                return(<span>{record}</span>)
            }
          },{
            title: '操作',
            dataIndex: 'personId',
            width: 100,
            render:(record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.addPerson.bind(this, record)}>选择</a>
              </span>
            )
          }];
        return (
            <div className="content-main ban-card">
              <Descriptions title="设备信息">
                <Descriptions.Item label="设备序列号">{this.state.info&&this.state.info.devSn}</Descriptions.Item>
                <Descriptions.Item label="设备名称">{this.state.info&&this.state.info.devName}</Descriptions.Item>
                <Descriptions.Item label="建筑名称">{this.state.info&&this.state.info.buildName}</Descriptions.Item>
                <Descriptions.Item label="场所名称">{this.state.info&&this.state.info.placeName}</Descriptions.Item>
              </Descriptions>
             
              <Form>
                  <Row gutter={24}>
                      <Col span={6}>
                          <FormItem label="">
                              {getFieldDecorator('kw')(
                                  <Search placeholder="请输入姓名"/>
                              )}
                          </FormItem>
                      </Col> 
                      <Col span={8} offset={0}>
                          <Button type='primary' onClick={this.search.bind(this)} >查询</Button>&nbsp;&nbsp;
                          <Button type='primary' onClick={this.add.bind(this)} >添加</Button>
                      </Col>
                  </Row>
              </Form>     
              <Table className='content-table'  columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
              <Modal
              width="70%"
                title="添加"
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                footer={[
                  // <Button key="submit" type="primary" onClick={this.handleCancel}>
                  //   关闭
                  // </Button>
                ]}
                >
                  <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="">
                                {getFieldDecorator('kw1')(
                                    <Search placeholder="请输入姓名"/>
                                )}
                            </FormItem>
                        </Col> 
                        <Col span={8} offset={0}>
                            <Button type='primary' onClick={this.search1.bind(this)} >查询</Button>&nbsp;&nbsp;
                            <Button type='primary' disabled={this.state.ids.length==0} onClick={this.addPersonBatch.bind(this)} >批量选择</Button>
                        </Col>
                    </Row>
                  </Form>     
                  <Table className='content-table' rowSelection={rowSelection} columns={columns1} dataSource={this.state.data1.dataList} pagination={false}/>
                  <PageIndex getPage={this.onPageChange1.bind(this)} total={this.state.data1.totalCount} totalPage={this.state.data1.totalPage} currentPage={this.state.data1.currentPage}/>
                </Modal>      
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(MonitorDetail));
