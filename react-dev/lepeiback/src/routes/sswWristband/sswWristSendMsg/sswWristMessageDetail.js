import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Breadcrumb,message,Menu,Icon,Dropdown,Tooltip,Radio } from 'antd';
import PageIndex from '../../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString,getGradeType,getSexType,getResidence} from '../../../utils/public';
import '../style.less';
import { stat } from 'fs';
import { get } from 'http';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;

class SswMessageDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false,
          size:'-1'
        };
    }
    componentDidMount=()=>{
      const id=getQueryString("id")
      const params={
        "messageId":id,
      }
      const params2={
        "messageId":id,
        "page":this.state.page,
        "prePage":this.state.prePage
      }
      this.getSswMessageDetail(params)
      this.getSswRecordList(params2)
    }
    getSswMessageDetail=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getSswMessageDetail',
        payload:params
      })
    }
    getSswRecordList=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getSswMessageRecordList',
        payload:params
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      const id=getQueryString("id")
      this.setState({page:current,prePage:size})
      const params={
        "page":current,
        "prePage":size,
        "messageId":id,
        "sendStatus":this.state.size,
      }
      this.getSswRecordList(params)
    }
    handleSizeChange=(e)=>{
      this.setState({size:e.target.value})
      const id=getQueryString("id")
      const params={
        "messageId":id,
        "sendStatus":e.target.value,
        "page":this.state.page,
        "prePage":this.state.prePage
      }
      this.getSswRecordList(params)
    }
    send=(personId)=>{
      const id=getQueryString("id")
      this.props.dispatch({
        type:'sswWristband/getSswResendMessage',
        payload:{
          messageId:id,personId:personId
        },
        callback:(res)=>{
          if(res.code===200){
            message.success("重发成功",2)
            const params={
              "messageId":id,
              "sendStatus":this.state.size,
              "page":this.state.page,
              "prePage":this.state.prePage
            }
            this.getSswRecordList(params)
          }
        }
      })
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render:(record)=>(
              <span>{getSexType(record)}</span>
            )
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            key: 'gradeType',
            render:(record)=>(
                <span>{getGradeType(record)}</span>
            )
          }, {
            title: '年级',
            dataIndex: 'gradeName',      
            key: 'gradeName',   
          }, {
            title: '班级',
            dataIndex: 'className',         
            key: 'className',   
          }, {
            title: '读书形式',
            dataIndex: 'inResidence',         
            key: 'inResidence',   
            render:(record)=>(
                <span>{getResidence(record)}</span>
            )
          }, {
            title: '手环MAC',
            dataIndex: 'macId',         
            key: 'macId',   
          }, {
            title: '状态',
            dataIndex: 'sendStatus',         
            key: 'sendStatus',   
            render:(record)=>(
                <span style={{color:record==2?"#f00":""}}>{record==0?"发送中":(record==1?"成功":(record==2?"失败":""))}</span>
            )
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.sendStatus==2?<a href="javascript:;" className="check-btn"  onClick={this.send.bind(this,record.personId)}>再次发送</a> :null}
              </span>
            )
          }];
          const staffColumns = [{
            title: '姓名',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render:(record)=>(
              <span>{getSexType(record)}</span>
            )
          }, {
            title: '当前部门',
            dataIndex: 'departmentName',         
            key: 'departmentName',  
          }, {
            title: '手环MAC',
            dataIndex: 'macId',         
            key: 'macId',   
          }, {
            title: '状态',
            dataIndex: 'sendStatus',         
            key: 'sendStatus',   
            render:(record)=>(
                <span style={{color:record==2?"#f00":""}}>{record==0?"发送中":(record==1?"成功":(record==2?"失败":""))}</span>
            )
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.sendStatus==2?<a href="javascript:;" className="check-btn" onClick={this.send.bind(this,record.personId)} >再次发送</a> :null}
              </span>
            )
          }];
          const {sswMessageRecordList,sswMessageDetail} = this.props;
          const {size} = this.state;
          if(!sswMessageRecordList){
            return null;
          }
          const page=getQueryString('page');
          const kw=getQueryString('kw')||'';
          const sendType=getQueryString('sendType')||'';
          const sendGroup=getQueryString('sendGroup')||'';
          const prePage=getQueryString('prePage');
        return (
            <div className="content-main">
              <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item>智能硬件管理</Breadcrumb.Item>
                      <Breadcrumb.Item>顺势为蓝牙手环</Breadcrumb.Item>
                      <Breadcrumb.Item><Link to={encodeURI(encodeURI("/ssw-wrist-message?page="+page+"&prePage="+prePage+"&kw="+decodeURI(kw)+"&sendType="+sendType+"&sendGroup="+sendGroup))}>顺势为手环消息发送</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>顺势为手环消息详情</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <Row className="message-content">
                <Col span={4}>消息类型：</Col><Col span={20}>{sswMessageDetail&&sswMessageDetail.sendType==1?"个人发送":"群体发送"}</Col>  
              </Row> 
              <Row className="message-content">
                <Col span={4}>标题：</Col><Col span={20}>{sswMessageDetail&&sswMessageDetail.title}</Col>  
              </Row> 
              <Row className="message-content">
                <Col span={4}>内容：</Col><Col span={20}>{sswMessageDetail&&sswMessageDetail.content}</Col>  
              </Row> 
              <Row className="message-content">
                <Col span={4}>发送状态：</Col>  
                <Col span={20}>全部（{sswMessageDetail&&sswMessageDetail.totalCount}条）&nbsp;&nbsp;&nbsp;&nbsp;
                      成功（{sswMessageDetail&&sswMessageDetail.successCount||'0'}条）&nbsp;&nbsp;&nbsp;&nbsp;
                      失败（<span style={{color:"#f00"}}>{sswMessageDetail&&sswMessageDetail.failCount||'0'}</span>条）&nbsp;&nbsp;&nbsp;&nbsp;
                      发送中（{sswMessageDetail&&sswMessageDetail.sendingCount||'0'}条）&nbsp;&nbsp;&nbsp;&nbsp;
                </Col>  
              </Row> 
              <Row className="message-content">
                <Col span={4}>条件筛选：</Col><Col span={20}>
                  <Radio.Group value={size} onChange={this.handleSizeChange}>
                    <Radio.Button value="-1">全部</Radio.Button>
                    <Radio.Button value="1">成功</Radio.Button>
                    <Radio.Button value="2">失败</Radio.Button>
                    <Radio.Button value="0">发送中</Radio.Button>
                  </Radio.Group>
                </Col>  
              </Row>      
              <Table className='content-table' scroll={{ x: 1000 }} columns={sswMessageDetail&&sswMessageDetail.sendGroup==1?columns:staffColumns} dataSource={sswMessageRecordList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={sswMessageRecordList.totalCount} totalPage={sswMessageRecordList.totalPage} currentPage={sswMessageRecordList.currentPage}/>
              <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to={encodeURI(encodeURI("/ssw-wrist-message?page="+page+"&prePage="+prePage+"&kw="+decodeURI(kw)+"&sendType="+sendType+"&sendGroup="+sendGroup))}>返回</Link></Button>
                  </Col>
                </Row>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    sswMessageDetail:state.sswWristband.sswMessageDetail,
    sswMessageRecordList:state.sswWristband.sswMessageRecordList
  }
}
export default connect(mapStateToProps)(Form.create()(SswMessageDetail));
