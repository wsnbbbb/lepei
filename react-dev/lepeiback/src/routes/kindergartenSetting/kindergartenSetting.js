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

class kindergartenSetting extends Component{
    constructor(props) {
        super(props);
        this.state = {
          teacherIds: [],
        };
    }
    componentDidMount=()=>{
      this.getHandlers();
      this.getTeachersAndWorks();
    }
  
    getHandlers = ()=>{
      this.props.dispatch({
        type:'kindergarten/getDirector',
        payload: {},
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              "teacherIds": res.data.teacherIds
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
              "approverList": res.data
            })
          }
        }
      })
    }
    
    submit = ()=>{
      if(this.state.teacherIds.length==0){
        message.warning("请至少选择一个！！")
        return
      }
      const params={
        "teacherIds": this.state.teacherIds
      }
      this.props.dispatch({
        type:'kindergarten/saveDirector',
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


    onChange = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        "teacherIds": value
      })
    }


    back = ()=>{
      window.history.go(-1)
    }

    render(){
  
   
      const Option1 = this.state.approverList&&this.state.approverList.map((item, index)=>{
        return  <Option key={index} value={item.personId}>{item.personName}
                </Option>
      })
        return (
            <div className="content-main approver-setting">
              <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>园长设置</Breadcrumb.Item>
                    </Breadcrumb>
              </div>
             <div className="setting-content">

              <Row className="content-row"> 
              &nbsp;园长：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Select
                    showSearch
                    mode="multiple"
                    style={{ width: '400px' }}
                    placeholder="请选择"
                    value={this.state.teacherIds}
                    onChange={this.onChange.bind(this)}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {Option1}
                  </Select>
              </Row>
            
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

export default connect(mapStateToProps)(Form.create()(kindergartenSetting));
