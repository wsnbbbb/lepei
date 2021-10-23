import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Icon, Button,Row,Col,Select,TreeSelect,Tree } from 'antd';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
let id = 0;

class AddClass extends Component{
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
    componentDidMount=()=>{
        this.props.onClassRef(this);
        this.props.dispatch({ //获取班级
            type:'user/getClassByGrade',
            // payload:{}
        })
        // this.add()
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        // if (keys.length === 1) {
        //   return;
        // }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    
      add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
    
      handleSubmit = (e) => {
        // e.preventDefault();
        let teacherClassId;let teacherType;let teacherClassIds=[];let teacherTypes=[];let flag=false;
        this.props.form.validateFields((err, values) => {
          if (!err) {
              flag=true;
              if(values.teacherClassId&&values.teacherType){
                teacherClassId=values.teacherClassId.slice(1);
                teacherType=values.teacherType.slice(1);
                teacherClassId.map((item)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        const id = val.substring(val.lastIndexOf('-')+1, val.length)
                        teacherClassIds.push(id)
                    }
                })
                teacherClassId=teacherClassIds
                teacherType.map((item)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        teacherTypes.push(item)
                    }
                })
                teacherType=teacherTypes
              }
              return [teacherClassId,teacherType,flag]
          }
        });
        console.log(teacherClassId)
        return [teacherClassId,teacherType,flag]
      }
      onSelectChange=()=>{

      }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {classData,data} = this.props;
        let options=[]
        classData&&classData.length>0&&classData.map(item=>{
            let children=[];
            if(item.classData&&item.classData.length>0){
                item.classData.map(n=>{
                    return children.push(<TreeNode value={n.className+'-'+n.classId} title={n.className+'('+`${item.gradeName}`+')'} key={n.classId} />)
                })
            }
            return options.push(<TreeNode selectable={false} value={item.gradeName+'-'+item.gradeId} title={item.gradeName} key={item.gradeId}>{children}</TreeNode>)
        })
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18, offset: 0 },
                sm: { span: 16, offset: 2 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={'班级'}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`teacherClassId[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message:"请选择班级",
                            whitespace: true,
                        }],
                        })(
                            <TreeSelect
                                // style={{ width: 260 }}
                                value={this.state.classId}
                                dropdownStyle={{ maxHeight: 170, overflow: 'auto' }}
                                placeholder="请选择"
                                onChange={this.onSelectChange}
                                treeCheckable={false} 
                                showSearch
                            >
                                {options}
                            </TreeSelect>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayoutWithOutLabel} label={'身份'}>
                      {getFieldDecorator(`teacherType[${k}]`,{rules: [{
                            required: true,
                            message:"请选择身份",
                            whitespace: true,
                        }]})(
                        <Select style={{ width: '76%', marginRight: 10 }}>
                            <Option value="1">科任老师</Option>
                            <Option value="2">副班主任</Option>
                            <Option value="3">班主任</Option>
                            <Option value="4">导师</Option>
                        </Select>
                      )}
                      {/* {keys.length > 1 ? ( */}
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                        {/* ) : null} */}
                    </FormItem>
                  </Col>
            </Row>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" disabled={data} onClick={this.add} style={{ width: '100%' }}>
                    <Icon type="plus" /> 添加关联班级
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
    classData:state.user.classByGrade
  }
}

export default connect(mapStateToProps)(Form.create()(AddClass));
