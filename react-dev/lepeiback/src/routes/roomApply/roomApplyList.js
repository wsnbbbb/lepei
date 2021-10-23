import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class RoomApplyList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          reset:false
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getRoomList(params)
      this.props.dispatch({ //获取所有审批规则
        type:'user/getApprovalRules',
      })
      // 查看审批规则
      this.props.dispatch({
        type:'room/getApplyHandlers',
      })
    }
    getRoomList=(params)=>{
      this.props.dispatch({
        type:'room/getRoomApply',
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
          "status":values.status,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomList(params)
        this.setState({page:1})
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
            type:'room/delRoomApply',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "status":values.status,
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getRoomList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "status":values.status,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/room-apply-detail?id="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    
    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
          console.log(values)
          this.props.dispatch({
            type:'room/setApplyHandlers',
            payload:{"ruleId":values.ruleId},
            callback:(res)=>{
              if(res.code===200){
                message.success('设置成功！',2)
                // 查看处理人
                this.props.dispatch({
                  type:'room/getApplyHandlers',
                })
                this.props.form.resetFields();
                this.setState({
                  visible: false,reset:true
                });
              }
            }
          })
        })
        
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,reset:true
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const columns = [{
            title: '申请人',
            dataIndex: 'applicant',
          }, {
            title: '申请事由',
            dataIndex: 'reason',
            className:'reason',
            render:(record)=>{
              return(
              <Tooltip placement="top" title={record}>
                <span className="reason-content">{record}</span>
              </Tooltip>
              )
            }
          }, {
            title: '功能室/教室',
            dataIndex: 'roomName',
          }, {
            title: '开始时间',
            dataIndex: 'startTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '结束时间',
            dataIndex: 'endTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span>{getApplyStatus(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record.id)}>查看</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const {roomList,getHandlers,approvalRules} = this.props;
          console.log(getHandlers)
          if(!roomList){
            return null;
          }
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入申请人"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'审批状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select showSearch onChange={this.handleChange.bind(this)} >
                          <Option value="">全部</Option>
                          <Option value="0">取消申请</Option>
                          <Option value="1">待审核</Option>
                          <Option value="2">审批中</Option>
                          <Option value="3">已通过</Option>
                          <Option value="4">未通过</Option>
                          <Option value="5">已过期</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={''}>
                      {getFieldDecorator("time",{initialValue:''})(
                        <RangePicker onChange={this.onTimeChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.showModal.bind(this)}>审批规则</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={roomList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={roomList.totalCount} totalPage={roomList.totalPage} currentPage={roomList.currentPage}/>
              <Modal
                title="审批规则设置"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                {/* <Row gutter={24}>
                   
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'审批人'}>
                      
                        <SetHandlers onHandlerRef={this.handlerRef.bind(this)} data={this.state.reset}/>
                    </FormItem>
                  </Col>
                </Row> */}
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'审批规则'}>
                      {getFieldDecorator("ruleId",{initialValue:getHandlers&&getHandlers.ruleId||''})(
                          <Select
                              placeholder="请选择"
                              optionFilterProp="children"
                              style={{ width: '90%' }}
                          >
                              {children}
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
     roomList:state.room,
     getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules
  }
}
export default connect(mapStateToProps)(Form.create()(RoomApplyList));
