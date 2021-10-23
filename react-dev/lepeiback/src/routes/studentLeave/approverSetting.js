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

class approverSetting extends Component{
    constructor(props) {
        super(props);
        this.state = {
          approvers1: [],
          approvers2: [],
          approvers3: [],
          approvers2Data: [],
          approvers3Data:[],
          approverList: [],
			    title:"审批人设置",
        };
    }
    componentDidMount=()=>{
      this.getHandlers();
      this.getTeachersAndWorks();
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
  
    getHandlers = ()=>{
      this.props.dispatch({
        type:'studentLeave/getHandlers',
        payload: {},
        callback: (res)=>{
          if(res.code===200){
            let approvers2=[]
            res.data.approvers2.map(item=>{
              approvers2.push(item.personId)
            })
            let approvers3=[]
            res.data.ccers.map(item=>{
              approvers3.push(item.personId)
            })
            this.setState({
              "approvers1": res.data.approvers1,
              "approvers2Data": approvers2,
              "approvers3Data": approvers3
            })
          }
        }
      })
    }

    getTeachersAndWorks = ()=>{
      this.props.dispatch({
        type:'studentLeave/getTeachersAndWorks',
        payload: {},
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              "approverList": res.data,
              "approvers2": this.state.approvers2Data,
              "approvers3": this.state.approvers3Data
            })
          }
        }
      })
    }
    
    submit = ()=>{
      if(this.state.approvers1.length==0){
        message.warning("请填写完整！")
        return
      }
      const params={
        "ccers": this.state.approvers3,
        "approvers1": this.state.approvers1,
        "approvers2": this.state.approvers2
      }
      this.props.dispatch({
        type:'studentLeave/setHandlers',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            message.success("保存成功！")
            setTimeout(() => {
              window.history.go(-1)
            }, 3000);
          }
        }
      })
    }

    onChange1 = (checkedValues)=> {
      console.log('checked = ', checkedValues);
      this.setState({
        "approvers1": checkedValues
      })
    }

    onChange2 = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        "approvers2": value
      })
    }

    onChange3 = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        "approvers3": value
      })
    }

    back = ()=>{
      window.history.go(-1)
    }

    render(){
      const options = [
        { label: '班主任', value: '3' },
        { label: '副班主任', value: '2' },
        { label: '导师', value: '4' },
      ];
   
      const Option1 = this.state.approverList&&this.state.approverList.map((item, index)=>{
        return  <Option key={index} value={item.personId}>{item.personName}
                </Option>
      })
        return (
            <div className="content-main approver-setting">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-leave">学生请假管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>审批人设置</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
             <div className="setting-content">
              <Row className="content-row">
                  <span style={{color: "#FF3E3E"}}>*</span>第一处理人：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <CheckboxGroup options={options} value={this.state.approvers1} onChange={this.onChange1.bind(this)} />
              </Row>
              <Row className="content-row"> 
              &nbsp;第二处理人：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Select
                    showSearch
                    mode="multiple"
                    style={{ width: '400px' }}
                    placeholder="请选择"
                    value={this.state.approvers2}
                    onChange={this.onChange2.bind(this)}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {Option1}
                  </Select>
              </Row>
              <Row className="content-row"> 
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查看人：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Select
                    showSearch
                    mode="multiple"
                    style={{ width: '400px' }}
                    placeholder="请选择"
                    value={this.state.approvers3}
                    onChange={this.onChange3.bind(this)}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {Option1}
                  </Select>
              </Row>
              <Row className="content-row">
                <div className="btn-wrap">
                  <Button onClick={this.back.bind(this)} >取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button onClick={this.submit.bind(this)} type="primary">提交</Button>
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

export default connect(mapStateToProps)(Form.create()(approverSetting));
