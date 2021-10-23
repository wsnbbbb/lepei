import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Icon, Button,Row,Col,Select,TreeSelect,Tree, Input } from 'antd';
import {getQueryString} from '../utils/public';
import './style.less';
import { object } from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
let id = 0;

class LeaveRule extends Component{
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
    componentDidMount=()=>{
        this.props.onHandlerRef(this);
        this.props.dispatch({ //获取审批列表
            type:'leave/getLeaveRule',
            payload:{"kw":''}
        })
        const type=getQueryString('type')
        if(type==2){
            const id = getQueryString('id')
            this.props.dispatch({
                type:'leave/getLeaveTypeDetail',
                payload:{"id":id},
                callback:(res)=>{
                    if(res.code===200){
                        // 设置初始keys
                        const { form } = this.props;
                        console.log(res.data)
                        const approvalRules=res.data&&res.data.approval_rules!=""&&JSON.parse(res.data.approval_rules)||[]
                        let newKeys=[]
                        if( approvalRules&&approvalRules.length>0){
                            approvalRules.map((item,index)=>{
                                newKeys.push(index+1)
                            })
                        }
                        form.setFieldsValue({
                            keys: newKeys,
                        });
                    }
                }
            })
        }else{
            this.add()
        }
    }
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        // if (keys.length === 1) {
        //   return;
        // }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        id=keys.length;
        if(keys.length===5){
            return;
        }
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
          keys: nextKeys,
        });
    }
    
    handleSubmit = (e) => {
        // e.preventDefault();
        let teacherClassId=[];let flag=false;let starts=[];let ends=[];
        let rules=[];
        this.props.form.validateFields((err, values) => {
            console.log(values)
          if (!err) {
              flag=true;
              if(values.start,values.end,values.teacherClassId){
                teacherClassId=values.teacherClassId.slice(1);
                starts=values.start.slice(1);
                ends=values.end.slice(1);
                teacherClassId.map((item,index)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        rules.push({
                            "start":starts[index],"end":ends[index],"rule_id":teacherClassId[index]
                        })
                    }
                })
              }
              return [rules,flag]
          }
        });
        return [rules,flag]
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {leaveRules,disabled,leaveTypeDetail} = this.props;
        const approvalRules=leaveTypeDetail&&leaveTypeDetail.approval_rules!=""&&JSON.parse(leaveTypeDetail.approval_rules)
        console.log(approvalRules)
        let child=[]
        leaveRules&&leaveRules.length>0&&leaveRules.map(item=>{
            child.push(<Option key={item.id}>{item.ruleName}</Option>)
        })
        const formItemLayoutWithOutLabel = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const type=getQueryString('type')
        const formItems = keys.map((k, index) => (
            <Row gutter={24}>
                <Col span={6}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={'假期长度'}
                        required={true}
                        key={k}
                    >
                        {getFieldDecorator(`start[${k}]`, {
                            initialValue:type==2&&approvalRules&&approvalRules[k-1]&&approvalRules[k-1].start||'',
                            rules: [{
                                required: true,
                                message:"请输入",
                            }],
                        })(
                            <Input type="number" disabled={disabled} />
                        )}
                    </FormItem>
                </Col>
                <Col span={1} style={{marginTop:8}}>至</Col>
                <Col span={6}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={''}
                        required={true}
                        key={k}
                    >
                        {getFieldDecorator(`end[${k}]`, {
                            initialValue: type==2&&approvalRules&&approvalRules[k-1]&&approvalRules[k-1].end||'',
                            rules: [{
                                required: true,
                                message:"请输入",
                            }],
                        })(
                            <Input type="number" disabled={disabled} addonAfter="含"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={10}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={'审批规则'}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`teacherClassId[${k}]`, {
                            initialValue: type==2&&approvalRules&&approvalRules[k-1]&&approvalRules[k-1].rule_id||[],
                            rules: [{
                                required: true,
                                message:"请选择",
                            }],
                        })(
                            <Select disabled={disabled} style={{width:'86%'}}>
                                {child}
                            </Select>
                        )}
                        {keys.length > 1 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                                style={{marginLeft:8}}
                            />
                        ) : null}
                    </FormItem>
                </Col>
            </Row>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Button disabled={disabled} type="dashed" onClick={this.add} style={{ width: '20%',margin:'0 0 0 10%' }}>
                    <Icon type="plus" /> 增加假期长度选项
                </Button>
            </Form>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    leaveRules:state.leave.leaveRules,
    leaveTypeDetail:state.leave.leaveTypeDetail
  }
}

export default connect(mapStateToProps)(Form.create()(LeaveRule));
