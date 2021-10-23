import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Icon, Button,Row,Col,Select,TreeSelect,Tree } from 'antd';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
let id = 0;

class AddTeacher extends Component{
    constructor(props) {
        super(props);
        this.state = {
            subjects: []
        };
    }
    componentDidMount=()=>{
        this.props.onTeacherRef(this);
        this.props.dispatch({ //获取教师
            type:'user/getCommonPersonList',
            payload:{"personType": 2, "status": 1}
        })
        this.props.dispatch({ //获取教师
            type: 'user/getAllSubject',
            payload: {},
            callback: res => {
                if(res.code == 200){
                    this.setState({
                        subjects: res.data
                    })
                }
            }

        })
        // this.add();
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
        let teacherId;
        let teacherType;
        let teacherIds=[];
        let teacherTypes=[];
        let subjectId;
        let subjectIds=[];
        let flag=false;
        this.props.form.validateFields((err, values) => {
          if (!err) {
              flag=true
              if(values.teacherId&&values.teacherType&&values.subjectId){
                teacherId=values.teacherId.slice(1);
                teacherType=values.teacherType.slice(1);
                teacherId.map((item)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        const id = item.substring(item.lastIndexOf('-')+1, item.length)
                        teacherIds.push(id)
                    }
                })

                teacherId=teacherIds
                teacherType.map((item)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                            teacherTypes.push(item)
                    }
               
                })

                let newArr = teacherType.filter(item => item)
                teacherType = newArr
                subjectId=values.subjectId.slice(1);
                subjectId.map((item)=>{
                    if(item!=""||typeof(item) != "undefined"||typeof(item) != "null"){
                        subjectIds.push(item)
                    }
                })
                subjectId=subjectIds
              }
              return [teacherId,teacherType,subjectId,flag]
          }
        });
        console.log(teacherId)
      
        return [teacherId,teacherType,subjectId,flag]
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {teacherData} = this.props;
        let treeData=[];
        teacherData&&teacherData.length>0&&teacherData.map(item=>{ //老师
            treeData.push({
                title:item.personName,
                value:item.personName+'-'+item.personId,
                key:item.personId
            })
        })

        const {subjects } = this.state
        let option1 = subjects&&subjects.map(function(item){
            return  <Option value={item.subjectId} key={item.subjectId}>{item.subjectName}</Option>
        })
        const tProps = {
            treeData,
            // value: this.state.classId,
            // onChange: this.onSelectChange,
            treeCheckable: false,
            dropdownStyle:{ maxHeight:170, overflow: 'auto' },
            placeholder:"请选择",
            treeNodeFilterProp:"title",
            // style: { width: 260 },
        };
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18, offset: 0 },
                sm: { span: 16, offset: 1 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem
                        {...formItemLayoutWithOutLabel} label={'老师'}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`teacherId[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请选择关联老师",
                        }],
                        })(
                            <TreeSelect showSearch {...tProps} />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayoutWithOutLabel} label={'身份'}>
                      {getFieldDecorator(`teacherType[${k}]`,{
                        rules: [{
                            required: true,
                            message: "请选择身份",
                        }],
                      })(
                        <Select style={{ width: '86%', marginRight: 10 }}>
                            <Option value="1">科任老师</Option>
                            <Option value="2">副班主任</Option>
                            <Option value="3">班主任</Option>
                            <Option value="4">导师</Option>
                        </Select>
                      )}
                      {/* {keys.length > 1 ? ( */}
                        {/* <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        /> */}
                        {/* ) : null} */}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayoutWithOutLabel} label={'科目'}>
                        {getFieldDecorator(`subjectId[${k}]`,{
                        rules: [{
                            required: false,
                            message: "请选择科目",
                        }],
                        })(
                        <Select mode="multiple"  
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '86%', marginRight: 10 }}>
                        {option1}
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
                <Button disabled={this.props.data} type="dashed" onClick={this.add} style={{ width: '80%' }}>
                    <Icon type="plus" /> 添加关联老师
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
    teacherData:state.user.commonPersonData
  }
}

export default connect(mapStateToProps)(Form.create()(AddTeacher));
