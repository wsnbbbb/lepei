import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Icon, Button,Row,Col,Select,TreeSelect,Tree } from 'antd';
import './style.less';
import { stat } from 'fs';
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
            payload:{"personType":'2,3'}
        })
        // this.add()
        // 查看处理人
        this.props.dispatch({
            type:'room/getApplyHandlers',
        })
        // 设置初始keys
        const { form,getHandlers } = this.props;
        let newKeys=[]
        if( getHandlers&&getHandlers.approvers){
            for(var i in getHandlers.approvers) {
                newKeys.push(Number(i))
            }
        }
        form.setFieldsValue({
            keys: newKeys,
        });
    }
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        console.log(k,keys)
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
            console.log(values.teacherClassId)
          if (!err) {
              flag=true;
              if(values.teacherClassId){
                teacherClassId=values.teacherClassId.slice(1);
                console.log(teacherClassId)
                teacherClassId.map((item,index)=>{
                    console.log(index)
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        teacherClassIds[index+1]=item
                    }
                })
                teacherClassId=teacherClassIds
              }
              return [teacherClassId,flag]
          }
        });
        console.log(teacherClassId)
        return [teacherClassId,flag]
      }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {staffData,data,getHandlers} = this.props;
        let children = [];
        staffData&&staffData.length>0&&staffData.map(item=>{ //教职工列表
            return children.push(<Option key={item.personId} >{item.personName}</Option>);
        })
        const formItemLayoutWithOutLabel = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        console.log(keys)
        const formItems = keys.map((k, index) => (
            <Row gutter={24} style={{margin:'0px 0px 30px'}}>
                <Col span={24}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={''}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`teacherClassId[${k}]`, {
                            initialValue: getHandlers&&getHandlers.approvers[k]||[],
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
                <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.add} style={{ width: '90%' }}>
                    <Icon type="plus" /> 添加审批人
                </Button>
                </FormItem>
            </Form>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    staffData:state.user.commonPersonData,
    getHandlers:state.room.saveHanders
  }
}

export default connect(mapStateToProps)(Form.create()(SetHandlers));
