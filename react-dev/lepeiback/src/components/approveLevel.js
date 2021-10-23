import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Icon, Button,Row,Col,Select,TreeSelect,Tree } from 'antd';
import './style.less';
import {getQueryString} from '../utils/public';
import { object } from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
let id = 0;

class SetHandlers extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{
        this.props.onHandlerRef(this);
        this.props.dispatch({ //获取教职工
            type:'user/getCommonPersonList',
            payload:{"personType":'2,3', "status": 1}
        })
        // 设置初始keys
        const { form } = this.props;
        const type=getQueryString('type')
        if(type==2){
            const id=getQueryString('id')
            this.props.dispatch({
                type:'leave/getLeaveRuleDetail',
                payload:{"ruleId":id},
                callback:(res)=>{
                    if(res.code===200){
                        let newKeys=[]
                        if( res.data&&res.data.levelData&&type==2){
                            for(var i in res.data.levelData) {
                                newKeys.push(Number(i))
                            }
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
        let teacherClassId;let flag=false;
        let teacherClassIds=new Object();
        this.props.form.validateFields((err, values) => {
          if (!err) {
              flag=true;
              if(values.teacherClassId){
                teacherClassId=values.teacherClassId.slice(1);
                teacherClassId.map((item,index)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        teacherClassIds[index+1]=item
                    }
                })
                teacherClassId=teacherClassIds
              }
              return [teacherClassId,flag]
          }
        });
        return [teacherClassId,flag]
      }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {staffData,data,leaveRuleDetail,disabled} = this.props;
        let children = [];
        staffData&&staffData.length>0&&staffData.map(item=>{ //教职工列表
            return children.push(<Option key={item.personId} >{item.personName}</Option>);
        })
        debugger
        const formItemLayoutWithOutLabel = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const type=getQueryString('type')
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={'审批人'}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`teacherClassId[${k}]`, {
                            initialValue: type==2&&leaveRuleDetail.levelData[k] ||[],
                            // getValueFromEvent: value => value.slice(0, 4),
                            rules: [{
                                required: true,
                                message:"请选择",
                            }],
                        })(
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
                <Button type="dashed" disabled={disabled} onClick={this.add} style={{ width: '32%',margin:'10px 0 10px 14%' }}>
                    <Icon type="plus" /> 增加审批层级
                </Button>
            </Form>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    staffData:state.user.commonPersonData,
    leaveRuleDetail:state.leave.leaveRuleDetail
  }
}

export default connect(mapStateToProps)(Form.create()(SetHandlers));
