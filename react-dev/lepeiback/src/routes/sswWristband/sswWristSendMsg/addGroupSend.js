import React,{Component} from 'react';
import { connect } from 'dva';
import {routerRedux,Link} from 'dva/router';
import { message,Button,Input,Select,Form,Col,Row,Radio,TreeSelect,Breadcrumb,Tree } from 'antd';
import '../style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;
class AddGroupSendMsg extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classId:'',
            groupId:'',
        };
    }
    componentDidMount=()=>{
        this.props.dispatch({ //获取班级
            type:'user/getClassByGrade',
        })
    }
    onSelectChange = (value) => {
        this.setState({ classId:value});
    }
    groupChange=(e)=>{
        this.setState({groupId:e.target.value})
    }
    onTreeChange=(value)=>{
        this.setState({ treeValue:value });
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
              let ids=values.classId;
              let classIds=[];
              ids&&ids.length>0&&ids.map(item=>{
                let n=item.substring(item.lastIndexOf('-')+1, item.length);
                classIds.push(n)
              })
              console.log(classIds)
              const params={
                "sendType":2,
                "title":values.title,"content":values.content,
                "sendGroup":values.sendGroup,
                "inResidence":values.inResidence,
                "classIds":classIds,"sex":values.sex
              }
              this.props.dispatch({
                  type:'sswWristband/addSswMessage',
                  payload:params,
                  callback:(res)=>{
                      if(res.code===200){
                          message.success("创建成功",2)
                          this.props.dispatch(routerRedux.push("/ssw-wrist-message"))
                      }
                  }
              })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const {classId,groupId}=this.state;
        const {classData} = this.props;
        let treeData=[]
        classData&&classData.map(item=>{
            let children=[]
            item.classData&&item.classData.length>0&&item.classData.map(n=>{
                children.push({
                    title:item.gradeName+'-'+n.className,value:'c-'+n.classId,key:'c-'+n.classId,
                })
            })
            treeData.push({
                title:item.gradeName,value:item.gradeId,key:item.gradeId,
                children:children
            })
        })
        const tProps = {
            treeData,
            // value: this.state.treeValue,
            onChange: this.onTreeChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_CHILD,
            searchPlaceholder: '请选择',
            treeNodeFilterProp:"title",
            style: {
              width: 300,
            },
        };
        return (
            <div className='detail-main'>
                <div className="breadcrumb">
                    <Breadcrumb>
                      <Breadcrumb.Item>智能硬件管理</Breadcrumb.Item>
                      <Breadcrumb.Item>顺势为蓝牙手环</Breadcrumb.Item>
                      <Breadcrumb.Item><Link to="/ssw-wrist-message">顺势为手环消息发送</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>群体发送消息</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="content-main">
                        <Form className="ant-advanced-search-form content-form teacher-form">
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='消息类型'>
                                    {getFieldDecorator('sendType',{initialValue:'群体发送'})(
                                        <Input disabled={true}/>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='标题'>
                                    {getFieldDecorator('title',{initialValue:'',
                                    rules:[{required:true,message:"请输入标题",whitespace: true,}]})(
                                        <Input clear='true' maxLength='10'/>
                                    )}
                                    </FormItem>
                                </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='内容'>
                                    {getFieldDecorator('content',{initialValue:'',rules:[{required:true,message:"请输入消息内容",whitespace: true}]})(
                                        <TextArea maxLength='60' placeholder="请输入消息内容" autosize={{ minRows: 2}} />
                                    )}
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label={'发送群体'}>
                                    {getFieldDecorator("sendGroup",{initialValue:'',rules:[{required:true,message:"请选择发送群体"}]})(
                                        <RadioGroup onChange={this.groupChange}>
                                            <RadioButton value="2">教职工</RadioButton>
                                            <RadioButton value="1">学生</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {groupId==1?<Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label={'学生类型'}>
                                    {getFieldDecorator("inResidence",{initialValue:'0',rules:[{required:true,message:"请选择学生类型"}]})(
                                        <RadioGroup>
                                            <RadioButton value="1">住读</RadioButton>
                                            <RadioButton value="2">走读</RadioButton>
                                            <RadioButton value="0">不限</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>:null}
                            {groupId==1?<Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='班级名称'>
                                    {getFieldDecorator("classId",{initialValue:[],rules:[{required:true, message:'请选择'}]})(
                                        <TreeSelect {...tProps} />
                                    )}
                                    </FormItem>
                                </Col> 
                            </Row>:null}
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label={'性别'}>
                                    {getFieldDecorator("sex",{initialValue:'-1',rules:[{required:true,message:"请选择学生类型"}]})(
                                        <RadioGroup >
                                            <RadioButton value="1">男</RadioButton>
                                            <RadioButton value="2">女</RadioButton>
                                            <RadioButton value="-1">不限</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{marginTop:20}}>
                                <Col span={2} offset={10}>
                                    <Button ><Link to='/ssw-wrist-message'>返回</Link></Button>
                                </Col>
                                <Col span={2} offset={0}>
                                    <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                                </Col>
                            </Row>
                        </Form> 
                </div>
            </div>
            
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

export default connect(mapStateToProps)(Form.create()(AddGroupSendMsg));
