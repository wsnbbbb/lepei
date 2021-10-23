import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,message,Radio,Upload, Icon } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddSubject extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),imgPath:'',
            title:"添加学科",
            title1:"编辑学科",
        };
        
    }
    componentDidMount=()=>{ 
        const id=getQueryString('id')
        if(id){
           this.props.dispatch({
               type:'subject/getSubjectDetail',
               payload:{"subjectId":id},
               callback:(res)=>{
                if(res.code===200){
                    this.setState({imgPath:res.data.pic,editorState: BraftEditor.createEditorState(res.data.description)})
                }
               }
           })
        }
        sessionStorage.removeItem("qiniuToken");
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res)=>{
                if(res.code===200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })
        if(id){
          //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title1,
              parentRoute:"/subject-manage"
            },
          })
        }else{
          //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/subject-manage"
            },
          })
        }
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })
    }
    submit=()=>{
        const id=getQueryString('id')
        if(!this.state.editorState){
            return message.error('请上传图片后再提交',2)
        }
        this.props.form.validateFields((err, values) => {
            let params;
            if(!err){
                if(id){
                    params={
                        "subjectName":values.subjectName,
                        "pic":this.state.imgPath,
                        "type":values.type,
                        "score":values.score,
                        "description":this.state.editorState.toHTML(),
                        "subjectId":id
                    }
                }else{
                    params={
                        "subjectName":values.subjectName,
                        "pic":this.state.imgPath,
                        "type":values.type,
                        "score":values.score,
                        "description":this.state.editorState.toHTML(),
                    }
                }
                
                this.props.dispatch({
                    type:id?'subject/updateSubject':'subject/createSubject',
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(id?"更新成功":"创建成功",2)
                            this.props.form.resetFields();
                            this.props.dispatch(routerRedux.push("/subject-manage"))
                        }
                    }
                })
            }
        })
    }
    async componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        // const htmlContent = await fetchEditorContent()
        // // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
        // this.setState({
        //   editorState: BraftEditor.createEditorState(htmlContent)
        // })
    }
    
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        // const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
    }
    
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    beforeUpload=(file)=> {
        const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    myUploadFn = (param) => {
        const serverURL = 'https://upload.qiniup.com/'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
      
        const successFn = (response) => {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          param.success({
            url: getImg(JSON.parse(response.target.response).id),
            meta: {
              alt: '图片',
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            }
          })
        }
      
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          param.progress(event.loaded / event.total * 100)
        }
      
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          param.error({
            msg: '上传失败.'
          })
        }
      
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
  
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        fd.append('file', param.file)
        fd.append('token', qiniuToken)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
      
    }
    render(){
        const {subjectDetail} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const {editorState,disabled,imgPath}=this.state;
        const id=getQueryString('id')
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            accept:"image/jpg,image/jpeg,image/png",
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
                token:qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            onChange:this.handleChange,
            beforeUpload:this.beforeUpload
        };
        console.log(this.state.imgPath)
        return (
            <div className="room-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item>科目与课表</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/subject-manage">科目管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{id?"编辑学科":"添加学科"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学科名称'}>
                      {getFieldDecorator("subjectName",{initialValue:id&&subjectDetail?subjectDetail.subjectName:'',rules:[{required:true, message:'请输入学科名称',whitespace: true}]})(
                        <Input placeholder='学科名称，20字以内' maxLength='20' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学科类型'}>
                      {getFieldDecorator("type",{initialValue:id&&subjectDetail?subjectDetail.type:'',rules:[{required:true, message:'请选择学科类型'}]})(
                         <RadioGroup>
                            <Radio value={1}>基础课</Radio>
                            <Radio value={2}>社团课</Radio>
                            <Radio value={3}>延时课</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学科图标'}>
                      {getFieldDecorator("pic",{initialValue:id&&subjectDetail?subjectDetail.pic:''})(
                        <span>
                        {imgPath?<img className="person-img" src={getImg(imgPath)} />:null}
                        <Upload {...props} showUploadList={false}>
                            <Button disabled={disabled}>
                            <Icon type="upload" /> 上传图标
                            </Button>
                        </Upload></span>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学科总分'}>
                      {getFieldDecorator("score",{initialValue:id&&subjectDetail?subjectDetail.score:''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>学科简介：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}m
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to='/subject-manage'>返回</Link></Button>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                  </Col>
                </Row>
              </Form>
            </div> 
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    subjectDetail:state.subject.subjectDetail
  }
}
export default connect(mapStateToProps)(Form.create()(AddSubject));
