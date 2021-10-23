import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Input, Select, Upload,Tag, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import { getDeviceStatus } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class FacilityManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          dataList:[],
          visible:false,
          confirmLoading: false,
          state:'',
          status:'',
          versionNo:'',
        };
    }
    componentDidMount=()=>{
      this.facilityList()
    }
    // 获取设备列表
    facilityList = (params) =>{
      this.props.dispatch({
        type:'faceManage/facilityList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            res.data&&res.data.map((item,index) =>{
              item.key = index
            })
            this.setState({dataList:res.data})
          }
        }
      })
    }

    // 状态查询
    checkStatus = (id) =>{
      this.props.dispatch({
        type:'faceManage/checkDeviceStatus',
        payload:{"deviceKey":id},
        callback:(res) =>{
            this.setState({
              visible:true,
              state:res.data.state,
              status:res.data.status==1?"在线":(res.data.status==2?"离线":''),
              versionNo:res.data.versionNo,
            })
          }
      })
    }
    handleCancel = () =>{
      this.setState({visible:false})
    }
    // 清空授权
    clearFacility = (id) =>{
      let that=this;
      confirm({
        title: '提示',
        content: <span>确定清空授权吗？清空后不可恢复</span>,
        onOk() {
          that.props.dispatch({
            type:'faceManage/clearFacility',
            payload:{"deviceKey":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('清空授权成功！')
                that.facilityList()
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 授权管理
    authorizeManage = (id) =>{
      this.props.dispatch(routerRedux.push("/authorize-manage?deviceKey="+id))
    }
    render(){
      const { dataList, visible, confirmLoading, state, status, versionNo } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const columns = [{
          title: '设备序列号',
          dataIndex: 'deviceKey',
        },{
          title: '应用名称',
          dataIndex: 'applicationName',
        },{
          title: '设备名称',
          dataIndex: 'deviceName',
        },{
          title: '授权人数',
          dataIndex: 'personCount',
        },{
          title: '操作',
          dataIndex: '',
          width:300,
          fixed:'right',
          render:(text, record) => (
            <span>
              <a href="javascript:;" onClick={this.checkStatus.bind(this,record.deviceKey)}>状态查询</a>&emsp;
              <a href="javascript:;" onClick={this.authorizeManage.bind(this,record.deviceKey)}>授权管理</a>&emsp;
              <a href="javascript:;" onClick={this.clearFacility.bind(this,record.deviceKey)}>清空授权</a>&emsp;
            </span>
          )
        }
      ]
        return (
          <div className="content-main device-manage">
            <Table  columns={columns} dataSource={dataList} pagination={false}/>
            <Modal
                title="状态查询"
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handleCancel}>返回</Button>}
              >
                <Form>
                  <Row gutter={24}>
                      <Col span={22}>
                          <FormItem {...formItemLayout} label="设备状态">
                              {getFieldDecorator('state',{initialValue:getDeviceStatus(state)})(
                                  <Input disabled/>
                              )}
                          </FormItem>
                      </Col> 
                  </Row>
                  <Row gutter={24}>
                      <Col span={22}>
                          <FormItem {...formItemLayout} label="网络状态">
                              {getFieldDecorator('status',{initialValue:status})(
                                  <Input disabled/>
                              )}
                          </FormItem>
                      </Col> 
                  </Row>
                  <Row gutter={24}>
                      <Col span={22}>
                          <FormItem {...formItemLayout} label="版本号">
                              {getFieldDecorator('versionNo',{initialValue:versionNo})(
                                  <Input disabled/>
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

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(FacilityManage));
