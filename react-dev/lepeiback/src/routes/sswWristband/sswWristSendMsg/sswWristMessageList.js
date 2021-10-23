import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message,Menu,Icon,Dropdown,Tooltip} from 'antd';
import PageIndex from '../../../components/page';
import { routerRedux, Link } from 'dva/router';
import {formatDate,getQueryString} from '../../../utils/public';
import '../style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;

class SswMessageList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:getQueryString('page')||1,
          prePage:getQueryString('prePage')||20,
          visible:false,
        };
    }
    componentDidMount=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":this.state.page,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "sendType":values.sendType||'',
          "sendGroup":values.sendGroup||''
        }
        this.getSswLists(params)
      })
      
    }
    getSswLists=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getSswMessageList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "sendType":values.sendType,
          "sendGroup":values.sendGroup
        }
        this.getSswLists(params)
        this.setState({page:1})
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
          "sendType":values.sendType,
          "sendGroup":values.sendGroup
        }
        this.getSswLists(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'sswWristband/delSswMessage',
            payload:{"messageId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "sendType":values.sendType,
                    "sendGroup":values.sendGroup
                  }
                  me.getSswLists(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    gotoDetail=(id)=>{
      this.props.form.validateFields((err, values) => {
        let kw=values.kw||'';
        let sendType=values.sendType||'';
        let sendGroup=values.sendGroup||'';
        this.props.dispatch(routerRedux.push(encodeURI(encodeURI("/ssw-wrist-message-detail?id="+id+"&kw="+kw+"&sendType="+
        sendType+"&sendGroup="+sendGroup+"&page="+this.state.page+"&prePage="+this.state.prePage))))
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
        this.props.form.resetFields(['name'])
    }
    handleOk = (e) => {  
      this.props.form.validateFields((err, values) => {
        if(!err){
          this.setState({
            visible: false
          });
          if(values.name==2){
            this.props.dispatch(routerRedux.push("/add-group-send-msg"))  
          }else{
            this.props.dispatch(routerRedux.push("/add-person-send-msg"))
          }
        }
      })
    }
    handleCancel = (e) => {
        this.props.form.resetFields(['']);
        this.setState({
            visible: false
        });
    }
    render(){
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
          }, {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            className:'gradeName',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="grade-content">{record}</span>
              </Tooltip>)
            }
          }, {
            title: '发送规则',
            dataIndex: 'sendType',
            key: 'sendType',
            render:(record)=>(
                <span>{record=="1"?"个人发送":(record=="2"?"群体发送":"")}</span>
            )
          }, {
            title: '发送群体',
            dataIndex: 'sendGroup',         
            key: 'sendGroup',   
            render:(record)=>(
                <span>{record=="1"?"学生":(record=="2"?"教职工":"")}</span>
            )
          }, {
            title: '状态',
            dataIndex: '',         
            key: 'status',   
            render:(text, record)=>(
                <span>{record.successCount}/{record.totalCount}</span>
            )
          }, {
            title: '发送时间',
            dataIndex: 'createTime',         
            key: 'createTime',   
            render:(record)=>(
                <span>{formatDate(record)}</span>
            )
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.gotoDetail.bind(this,record.id)}>查看</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                  <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
                  </Menu.Item>
                </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {sswMessageList} = this.props;
          const {typeId} = this.state;
          if(!sswMessageList){
            return null;
          }
          const kw=getQueryString('kw');
          const sendType=getQueryString('sendType')||'';
          const sendGroup=getQueryString('sendGroup')||'';
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{initialValue:decodeURI(kw)||''})(
                        <Search placeholder="消息标题/消息内容"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'发送规则'}>
                      {getFieldDecorator("sendType",{initialValue:sendType||''})(
                        <Select
                            placeholder="请选择"
                        >
                            <Option key='0' value='0'>全部</Option>
                            <Option key='1' value='1'>个人发送</Option>
                            <Option key='2' value='2'>群体发送</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'发送群体'}>
                      {getFieldDecorator("sendGroup",{initialValue:sendGroup||''})(
                        <Select
                            placeholder="请选择"
                        >
                            <Option key='0' value='0'>全部</Option>
                            <Option key='1' value='1'>学生</Option>
                            <Option key='2' value='2'>教职工</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.showModal.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={sswMessageList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={sswMessageList.totalCount} totalPage={sswMessageList.totalPage} currentPage={sswMessageList.currentPage}/>
              <Modal
                title="添加消息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                 <Form className="ant-advanced-search-form content-form">
                  <Row gutter={24}>
                    <Col span={16}>
                      <FormItem {...formItemLayout} label='发送规则'>
                        {getFieldDecorator('name',{initialValue:'',rules:[{required:true, message:'请选择'}]})(
                          <Select
                              placeholder="请选择"
                          >
                              <Option key='1' value='1'>个人发送</Option>
                              <Option key='2' value='2'>群体发送</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col> 
                    
                  </Row>
                </Form>  
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    sswMessageList:state.sswWristband.sswMessageList,
  }
}
export default connect(mapStateToProps)(Form.create()(SswMessageList));
