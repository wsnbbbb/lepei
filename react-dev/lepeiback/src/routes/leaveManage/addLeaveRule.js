import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col, Select,message,Breadcrumb,Tooltip } from 'antd';
import { routerRedux,Link } from 'dva/router';
import BottomBtns from '../../components/bottom-btns';
import ApproveLevel from '../../components/approveLevel';
import { getQueryString } from '../../utils/public';

import './style.less';
import { ok } from 'assert';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;


class AddLeaveRule extends Component{
    constructor(props) {
        super(props);
        this.state = {
          disabled:true
        };
    }
    componentDidMount=()=>{
      const type=getQueryString('type');
      if(type==2){
        const id=getQueryString('id')
        this.props.dispatch({
          type:'leave/getLeaveRuleDetail',
          payload:{"ruleId":id}
        })
      }else{
        this.setState({disabled:false})
      }
      this.props.dispatch({ //获取教职工
        type:'user/getCommonPersonList',
        payload:{"personType":'2,3', "status": 1}
      })
      
    }
    getBtnDate=(data)=>{
      console.log(data)
      const type=getQueryString('type');
      if(data==='edit'){
          this.setState({disabled:false})
      }else if(data==='cancel'){
          this.props.history.push('/examine-rules')
      }else if(data==='submit'){
          const levelData=this.handlerChild.handleSubmit();
          const id=getQueryString('id')
          // 判断每个层级是否有同一个人
          let ids=[];
          for(let key  in levelData[0]){
            ids.push(...levelData[0][key])
          }
          let nary=ids.slice().sort();
          for(var i=0;i<nary.length;i++){
            if (nary[i]==nary[i+1]){
              // alert("数组重复内容："+nary[i]);
              return message.error('审批人重复，每个审批层级的审批人应不同',3)
            }
          }
          this.props.form.validateFields((err, values) => {
            if(!err&&levelData[1]){
              const params={"ruleName":values.ruleName,"ruleIntro":values.ruleIntro,"levelPerson":levelData[0],"handlerPerson":values.handlerPerson}
              this.props.dispatch({
                type:type==1?'leave/addLeaveRule':'leave/updateLeaveRuleDetail',
                payload:type==1?params:{"ruleId":id,...params},
                callback:(res)=>{
                  console.log(res)
                  if(res.code===200){
                    const text=type==1?"创建审批规则成功":"更新审批规则成功"
                    message.success(text,2)
                    this.props.dispatch(routerRedux.push("/examine-rules"))
                  }
                }
              })
            }            
          })
          
      }
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const type=getQueryString('type');
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const {leaveRuleDetail,staffData} = this.props;
        console.log(leaveRuleDetail)
        const {disabled}= this.state;
        let children = [];
        staffData&&staffData.length>0&&staffData.map(item=>{ //教职工列表
            return children.push(<Option key={item.personId} >{item.personName}</Option>);
        })
        return (
            <div className="leave-main content-main" style={{padding:"10px 10px 50px 10px"}}>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/examine-rules">审批规则管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>添加审批规则</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <p className="tip">基础资料</p>
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={12}>
                        <FormItem {...formItemLayout} label={'规则名称'}>
                          {getFieldDecorator("ruleName",{initialValue:type==2&&leaveRuleDetail&&leaveRuleDetail.ruleName||'',rules:[{required:true,message:"请输入规则名称"}]})(
                            <Input disabled={disabled} placeholder="请输入规则名称" maxLength="20"/>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <FormItem {...formItemLayout} label={'规则简介'}>
                          {getFieldDecorator("ruleIntro",{initialValue:type==2&&leaveRuleDetail&&leaveRuleDetail.ruleIntro||''})(
                             <TextArea disabled={disabled} placeholder="请输入规则简介" autosize={{ minRows: 3 }} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                </Form>    
                <p className="tip">审批层级</p> 
                <ApproveLevel onHandlerRef={this.handlerRef.bind(this)} disabled={disabled} />
                <p className="tip">查看人</p> 
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={12}>
                        <FormItem {...formItemLayout} label={'查看人'}>
                          {getFieldDecorator("handlerPerson",{initialValue:type==2&&leaveRuleDetail&&leaveRuleDetail.handlers||[]})(
                            <Select
                                mode="multiple"
                                placeholder="请选择"
                                optionFilterProp="children"
                                style={{ width: '90%' }}
                                disabled={disabled}
                            >
                                {children}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                </Form>    
                <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} />
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    leaveRuleDetail:state.leave.leaveRuleDetail,
    staffData:state.user.commonPersonData,
  }
}
export default connect(mapStateToProps)(Form.create()(AddLeaveRule));
