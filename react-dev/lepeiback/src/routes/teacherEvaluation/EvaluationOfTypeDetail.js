import React,{Component} from 'react';
import { connect } from 'dva';
import { Card,Select,Form,Col,Row,Input,DatePicker,Upload, message, Button, Icon } from 'antd';
import {Link,routerRedux} from "dva/router";
import moment from 'moment';
import { getQueryString } from '../../utils/public';
import { getImg } from '../../utils/img';
import { log } from 'util';

const FormItem = Form.Item;
const Option = Select.Option;

class EvaluationOfTypeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            templateDetail: {},  //模板详情
            fileList:[],
            teachingPlanId:[],
            allTemplate:[],
            oldFiles:[]
        }
    }
    componentDidMount =()=>{
        const type=getQueryString('type');
        const id=getQueryString('id');
        this.props.dispatch({ //获取所有评课模板
            type:'teacherEvaluation/getEvaluationTemplate',
            callback:(res)=>{
                if(res.code === 200){ 
                    this.setState({allTemplate:res.data})
                }
            }
        })
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res)=>{
                if(res.code===200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })
        if(type==2&&id){
            this.props.dispatch({ //根据typeId获取评课模板详情
                type:'teacherEvaluation/getTemplateDetail',
                payload:{id},
                callback:(res)=>{
                    res.data.teachingTime =  moment(res.data.teachingTime, "YYYY-MM-DD")
                    if(res.code===200){
                        let planData = []
                        let oldFiles = []
                        res.data.teachingPlan.length>0&&res.data.teachingPlan.map((item,index) =>{
                            planData.push({
                                uid: index+'~'+item.hash,
                                name: item.name,
                                status: 'done',
                            }) 
                            oldFiles.push(item.hash)
                        })
                        this.setState({
                            templateDetail: res.data,
                            oldFiles:oldFiles,
                            fileList:planData,
                        });
                    }
                }
            })
        }
    }
    // 文件上传
    beforeUpload (file) {
        const isFileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/msword'|| file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.ms-excel' || file.type === 'text/html  ' || file.type === 'application/pdf';
        const maxFileSize = 10;
        const isLtMax = file.size / 1024 / 1024 < maxFileSize;
        if (!isFileType) {
            message.error('仅支持扩展名为.doc/.jpg/.png/.ppt/.xls/.text/.pdf等文件的上传！');
        }
        if (!isLtMax) {
            message.error('文件不能超过10M!');
        }
        return new Promise((resolve, reject) => {
          if(!isLtMax||!isFileType) {
            reject(file);
          } else {
            resolve(file);
          }
        });
    };
    handleChange =  ({ fileList }) => {
        console.log({fileList});
        
        this.setState({ fileList })
        let teachingPlanId = []
        fileList.length>0&&fileList.map(item =>{
            if(item.response&&item.response.success){
                teachingPlanId.push(item.response.id)
              }else{
                const uid=item.uid.split('~')[1]
                teachingPlanId.push(uid)
              }
        })
        this.setState({teachingPlanId})
       
      };
    // 取消
    cancel =()=>{
        this.props.dispatch(
            routerRedux.push("/evaluation-manage")
        )
    }
    // 确定
    submit =()=>{
        const type=getQueryString('type');
        const id=getQueryString('id');
        this.props.form.validateFields((err,values) =>{
            if(!err){
                let params = {
                    templateId:values.templateId,
                    teacherName:values.teacherName,
                    teachingTitle:values.teachingTitle,
                    teachingTime:values.teachingTime.format('YYYY-MM-DD'),
                    classTime:values.classTime,
                    teachingPlace:values.teachingPlace,
                    teachingPlan:this.state.teachingPlanId.length>0?this.state.teachingPlanId:this.state.oldFiles,
                    "id": type==1?"":id
                }
               
                console.log("params",params);
                this.props.dispatch({
                    type:type==1?'teacherEvaluation/addEvaluation':'teacherEvaluation/editEvaluation',
                    payload:params,
                    callback:(res)=>{
                        console.log("res",res);
                        if(res.code===200){
                            message.success(type==1?'新建评课成功':'更新评课成功')
                            window.history.go(-1)
                        }
                    }
                })
            }
        })
    }


    render(){
        const type=getQueryString('type');
        const {templateDetail,planList,allTemplate} = this.state
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            multiple: true,
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
                token:qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            beforeUpload:this.beforeUpload,
            onChange: this.handleChange,
            fileList:this.state.fileList
        } 
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
       
        let templateOption = []
        allTemplate&&allTemplate.length>0&&allTemplate.map(item=>{
            templateOption.push(<Option key={item.id}>{item.templateName}</Option>)
        })
       
        return (
            <div>
                <Card title={type==1?"新建评课":"评课详情"} bordered={false} >
                    <Form className=" content-form " style={{width:'100%'}}>
                        <Row gutter={24}>
                            <Col span={9} offset={2}>
                                <FormItem {...formItemLayout} label='选择模板'>
                                {getFieldDecorator('templateId',{initialValue:templateDetail&&templateDetail.templateId||'',rules:[{required:true,message:"请选择模板"}]})(
                                <Select placeholder="请选择模板">
                                        {templateOption}
                                </Select>,
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={9} offset={2}>
                                <FormItem {...formItemLayout} label='上课教师：'>
                                {getFieldDecorator('teacherName',{initialValue:templateDetail&&templateDetail.teacherName||'',rules:[{required:true,message:"请输入上课教师"},{max:20,message:"最多输入20个字"}]})(
                                <Input placeholder="请输入上课教师"/>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem {...formItemLayout} label='上课地点：'>
                                {getFieldDecorator('teachingPlace',{initialValue:templateDetail&&templateDetail.teachingPlace||'',rules:[{required:true,message:"请输入上课地点"},{max:20,message:"最多输入20个字"}]})(
                                <Input placeholder="请输入上课地点"/>
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={9} offset={2}>
                                <FormItem {...formItemLayout} label='上课时间：'>
                                {getFieldDecorator('teachingTime',{initialValue:templateDetail&&templateDetail.teachingTime||'',rules:[{required:true,message:"请选择上课时间"}]})(
                                <DatePicker style={{ width: '100%' }} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem {...formItemLayout} label='节次：'>
                                {getFieldDecorator('classTime',{initialValue:templateDetail&&templateDetail.classTime||'',rules:[{required:true,message:"请输入上课节次"},{max:10,message:"最多输入10个字"}]})(
                                <Input placeholder="请输入上课节次"/>
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={9} offset={2}>
                                <FormItem {...formItemLayout} label='课程主题：'>
                                {getFieldDecorator('teachingTitle',{initialValue:type==2&&templateDetail&&templateDetail.teachingTitle||'',rules:[{required:true,message:"请输入课程主题"},{max:30,message:"最多输入30个字"}]})(
                                <Input placeholder="请输入课程主题"/>
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={9} offset={2}>
                                <FormItem {...formItemLayout} label='教案：'>
                                <Upload 
                                {...props}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传文件
                                    </Button>
                                    <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持扩展名：.doc/.ppt/.xls/.text/.pdf及图片文件的上传，10M以内，文件有效期30天！</p>
                                </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={1} offset={17} style={{marginRight:'20px'}}>
                                <Button  onClick={this.cancel.bind(this)} >取消</Button>
                            </Col>
                            <Col span={2} offset={0}>
                                <Button type='primary' onClick={this.submit.bind(this,type)} >确定</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        
    }
  }
  
  export default connect(mapStateToProps)(Form.create()(EvaluationOfTypeDetail));