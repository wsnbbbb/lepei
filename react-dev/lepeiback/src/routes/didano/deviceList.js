import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class DeviceList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleAdd: false,
          reset:false,
          data: {},
          deviceNo: '',
          remark: '',
          currentDeviceNo: ''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getDeviceList(params)
      this.props.dispatch({ //获取所有审批规则
        type:'user/getApprovalRules',
      })
      // 查看审批规则
      this.props.dispatch({
        type:'room/getApplyHandlers',
      })
    }
    getDeviceList=(params)=>{
      this.props.dispatch({
        type:'didano/didanoDevices',
        payload:params,
        callback: res=>{
          this.setState({
            data: res.data
          })
        }
      })
    }
    add = ()=>{
      this.setState({
        visibleAdd: true
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||''
        }
        this.getDeviceList(params)
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
            type:'didano/deleteDevice',
            payload:{"deviceNo":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                  }
                  me.getDeviceList(params)
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
        }
        this.getDeviceList(params)
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
    showEditModal = (no) => {
      let params = {
        deviceNo: no
      }
      this.setState({
        currentDeviceNo: no
      })
      this.props.dispatch({
        type: 'didano/deviceDetail',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              visible: true,
              deviceNo: res.data.deviceNo,
              remark: res.data.remark
            })

          }
        }
      })
      
    }
    
    handleEditOk = (e) => {
        let me = this
        this.props.form.validateFields((err, values) => {
          console.log(values)
          this.props.dispatch({
            type:'didano/updateDevice',
            payload:{
              "newDeviceNo": values.editDeviceNo,
              "remark": values.editRemark,
              "oldDeviceNo": this.state.currentDeviceNo
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('更新成功！',2)
                this.props.form.resetFields();
                this.setState({
                  visible: false,reset:true
                });
                const params={
                  "page": me.state.page,
                  "prePage": me.state.prePage,
                  "kw": values.kw||'',
                }
                me.getDeviceList(params)
              }
            }
          })
        })
    }

    handleOk = (e) => {
      let me = this
      this.props.form.validateFields((err, values) => {
        console.log(values)
        this.props.dispatch({
          type: 'didano/createDevice',
          payload:{
            "deviceNo": values.deviceNo,
            "remark": values.remark||"",
          },
          callback:(res)=>{
            if(res.code===200){
              message.success('添加成功！',2)
              this.props.form.resetFields();
              this.setState({
                visibleAdd: false
              });
              const params={
                "page": me.state.page,
                "prePage": me.state.prePage,
                "kw": values.kw||'',
              }
              me.getDeviceList(params)
            }
          }
        })
      })
  }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,reset:true,
          visibleAdd: false
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const columns = [{
            title: '设备号',
            dataIndex: 'deviceNo',
          }, {
            title: '备注',
            dataIndex: 'remark',
          }, {
            title: '绑定时间',
            dataIndex: 'createTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showEditModal.bind(this,record.deviceNo)}>编辑</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.deviceNo)}>删除</span>
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
            // return null;
          }
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
        return (
            <div className="content-main didano">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入设备号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.add.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
              <Modal
                title="设备配置"
                visible={this.state.visible}
                onOk={this.handleEditOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'设备号'}>
                      {getFieldDecorator("editDeviceNo",{initialValue: this.state.deviceNo?this.state.deviceNo:'',rules:[{required:true, message:'请输入设备号',whitespace: true}]})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'备注'}>
                      {getFieldDecorator("editRemark",{initialValue: this.state.remark?this.state.remark:'',rules:[{required:false, message:'请输入备注',whitespace: true}]})(
                        <TextArea />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>              
              </Modal>
              <Modal
                title="设备添加"
                visible={this.state.visibleAdd}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'设备号'}>
                      {getFieldDecorator("deviceNo",{rules:[{required:true, message:'请输入设备号',whitespace: true}]})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'备注'}>
                      {getFieldDecorator("remark",{rules:[{required:false, message:'请输入备注',whitespace: true}]})(
                        <TextArea />
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
    //  getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules
  }
}
export default connect(mapStateToProps)(Form.create()(DeviceList));
