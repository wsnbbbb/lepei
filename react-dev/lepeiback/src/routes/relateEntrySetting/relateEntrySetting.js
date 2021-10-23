import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Tag,Divider, Menu, Checkbox,Icon,Breadcrumb,Tabs,message,Modal,DatePicker,InputNumber } from 'antd';

import {isBlank} from '../../utils/public';
import './style.less';

const confirm = Modal.confirm;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;

class relateEntrySetting extends Component{
    constructor(props) {
        super(props);
        this.state = {
          deviceIds: [],
          status: '0',
          title:'联动门禁设置'
        };
    }
    componentDidMount = () => {
      this.getRelateEntry();
      this.getDevicesList();
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
    // 获取联动门禁设置
    getRelateEntry = () => {
      this.props.dispatch({
        type:'relateEntry/getRelateEntry',
        payload: {},
        callback: (res) => {
          if(res.code === 200){
            this.setState({
              "deviceIds": res.data.devices,
              "status": res.data.status
            })
          }
        }
      })
    }
    // 获取联动设备
    getDevicesList = ()=>{
      this.props.dispatch({
        type:'relateEntry/getDevicesList',
        payload: {},
        callback: (res)=>{
          if(res.code === 200){
            this.setState({
              "devicesList": res.data
            })
          }
        }
      })
    }
    // 保存
    submit = () => {
      if(this.state.status == 1) {
        if(this.state.deviceIds.length == 0) {
          message.warning("请至少选择一个联动设备！")
          return
        }
      }
      const params={
        "status": this.state.status,
        "devices": this.state.status == 0 ? []: this.state.deviceIds
      }
      this.props.dispatch({
        type:'relateEntry/setRelateEntry',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            message.success("保存成功！")
            setTimeout(() => {
              // window.history.go(-1)
            }, 3000);
          }
        }
      })
    }

    // 联动设备选择
    onChange = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        "deviceIds": value
      })
    }
    // 联动功能是否开启
    onChange1 = (value)=> {
      this.setState({
        "status": value
      })
      if(value == 0){
        this.deviceIds = []
      }
    }

    back = ()=>{
      window.history.go(-1)
    }

    render(){
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      };
      const Option1 = this.state.devicesList&&this.state.devicesList.map((item, index)=>{
        return  <Option key={index} value={item.devSn}>{item.devName}
                </Option>
      })
        return (
            <div className="content-main approver-setting">
              {/* <div className="breadcrumb">
                  <Breadcrumb>
                    <Breadcrumb.Item><Link to="/student-leave">学生请假</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>联动门禁设置</Breadcrumb.Item>
                  </Breadcrumb>
              </div> */}
             <div className="setting-content">
             <Row className="content-row"> 
                  <FormItem {...formItemLayout} label={'联动功能'}>
                      <Select value={this.state.status} 
                        onChange={this.onChange1.bind(this)}
                        style={{ width: '100px' }}>
                        <Option value="0">不启用</Option>
                        <Option value="1">启用</Option>
                      </Select>
                      &nbsp;&nbsp;启用“联动功能”后，请假的学生的卡片/手环，可在请假时间内开启门禁终端
                  </FormItem>
              </Row>
              {
                this.state.status == 1 ? (<Row className="content-row" >
                <FormItem {...formItemLayout} label={'联动设备'}>
                    <Select
                      showSearch
                      mode="multiple"
                      style={{ width: '400px' }}
                      placeholder="请选择"
                      value={this.state.deviceIds}
                      onChange={this.onChange.bind(this)}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {Option1}
                    </Select>
                </FormItem>
              </Row>):null
              }
            
              <Row className="content-row">
                <div className="btn-wrap">
                  {/* <Button onClick={this.back.bind(this)} >取消</Button>&nbsp;&nbsp;&nbsp;&nbsp; */}
                  <Button onClick={this.submit.bind(this)} type="primary">保存</Button>
                </div>
              </Row>
             </div>
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
   
  }
}

export default connect(mapStateToProps)(Form.create()(relateEntrySetting));
