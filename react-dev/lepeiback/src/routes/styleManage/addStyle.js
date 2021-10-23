import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,message, Radio, Select ,TreeSelect,Upload,Icon } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";
import { stat } from 'fs';

const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

class AddStyle extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            type: 1,
            id: '',
            disabled : true,
            ids:[],
            files:[],
            fileList:[], //附件列表
            oldFiles:[],
            title:'添加',
            title1:'编辑'
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString('id')
        this.setState({
            id: id
        })
        let _this = this
        if(id){
            this.props.dispatch({
                type:'styleManage/styleDetail',
                payload:{"id":id},
                callback:(res)=>{
                    console.log({res});
                    if(res.code===200){
                        let newFiles = []
                        let oldFiles = []
                        res.data.files&&res.data.files.length>0&&res.data.files.map((item,index) =>{
                            newFiles.push({
                                uid: index+'~'+item.hash,
                                name: item.name,
                                status: 'done',
                            })
                            oldFiles.push(item.hash)
                        })
                        let ids = []
                        res.data.classId&&res.data.classId.map(item =>{
                            ids.push('c-'+item)
                        })
                        this.setState({
                            editorState: BraftEditor.createEditorState(res.data.content),
                            type: res.data.type,
                            ids:ids,
                            oldFiles:oldFiles,
                            fileList:newFiles
                        })
                       
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
        // this.props.dispatch({
        //     type:'user/getCommonGradeList'
        // })
       
        this.props.dispatch({ //获取班级
            type:'user/getClassByGrade',
        })

        if(id){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/style-manage"
                },
              })
        }else{
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/style-manage"
                },
              })
        }
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
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
                let ids=values.classId;
                let classIds=[];
                ids&&ids.length>0&&ids.map(item=>{
                let n=item.substring(item.lastIndexOf('-')+1, item.length);
                classIds.push(n)
            })
                if(id){
                    params={
                        "title": values.title,
                        "content": this.state.editorState.toHTML(),
                        "id": id,
                        "files":this.state.files.length>0?this.state.files:this.state.oldFiles
                    }
                }else{
                    params={
                        "title": values.title,
                        "content": this.state.editorState.toHTML(),
                        "type": values.type,
                        "classId": classIds,
                        "files":this.state.files.length>0?this.state.files:this.state.oldFiles
                    }
                }
                
                this.props.dispatch({
                    type:id?'styleManage/updateStyle':'styleManage/createStyle',
                    payload: params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(id?"更新成功":"创建成功",2)
                            this.props.form.resetFields();
                            setTimeout(() => {
                                window.history.go(-1)
                            }, 1000);
                            // this.props.dispatch(routerRedux.push("/canteen-menu"))
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
   
    typeChange=(e)=>{
        this.setState({type: e.target.value})
    }
    back=(e)=>{
        window.history.go(-1)
    }
    // // 附件上传
    beforeUpload (file) {
        const isFileType = file.type === 'application/msword'|| file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'|| 
        file.type === 'application/pdf'||file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        const maxFileSize = 10;
        const isLtMax = file.size / 1024 / 1024 < maxFileSize;
        if (!isFileType) {
            message.error('仅支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf等文件的上传！');
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
        let files = []
        fileList.length>0&&fileList.map(item =>{
            if(item.response&&item.response.success){
                files.push(item.response.id)
              }else{
                const uid=item.uid.split('~')[1]
                files.push(uid)
              }
        })
        this.setState({files})
       
    };
    render(){
        const {styleDetail,classData} = this.props;
        const { getFieldDecorator } = this.props.form;
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
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
       
        if(!classData){
            return null
        }
        let treeData=[]
        classData&&classData.map(item=>{
            let children=[]
            item.classData&&item.classData.length>0&&item.classData.map(n=>{
                children.push({
                    title:item.gradeName+'-'+n.className,value:'c-'+n.classId,key:'c-'+n.classId,
                })
            })
            treeData.push({
                title:item.gradeName,
                value:item.gradeId,
                key:item.gradeId,
                children:children
            })
        })
        const tProps = {
            treeData,
            treeCheckable: true,
            showCheckedStrategy: SHOW_CHILD,
            searchPlaceholder: '请选择',
            treeNodeFilterProp:"title",
           
        };
        const { editorState } = this.state;
        const id=getQueryString('id')

        return (
            <div className="room-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/style-manage">风采管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{id?"编辑":"添加"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                    <Col span={14}>
                        <FormItem {...formItemLayout} label={'风采类型'}>
                        {getFieldDecorator("type",{initialValue: this.state.type||1})(
                            <Radio.Group disabled={ !this.state.id ? false: true} onChange={this.typeChange.bind(this)}>
                                <Radio value={2}>班级风采</Radio>
                                <Radio value={1}>校园风采</Radio>
                           </Radio.Group>
                        )}
                        </FormItem>
                    </Col>
                    {
                        this.state.type==2?<div><Col span={14}>
                            <FormItem {...formItemLayout} label={'年级班级'}>
                                {getFieldDecorator("classId",{initialValue: this.state.ids||[],rules:[{required:true, message:'请选择年级班级'}]})(
                                    <TreeSelect {...tProps} disabled={ !this.state.id ? false: true}>
                                    </TreeSelect>
                                )}
                            </FormItem>
                        </Col>
                        </div>:""
                    }
                    
                     <Col span={14}>
                        <FormItem {...formItemLayout} label={'标题'}>
                        {getFieldDecorator("title",{initialValue:id&&styleDetail?styleDetail.title:'',rules:[{required:true, message:'请输入标题',whitespace: true}]})(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>内容：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop:"20px"}}>
                    <Col span={8} offset={2}>
                        <FormItem {...formItemLayout} label={'上传附件'}>
                        <Upload 
                        {...props}
                        >
                            <Button>
                                <Icon type="upload" /> 上传文件
                            </Button>
                            <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持扩展名：.doc/.docx/.ppt/.pptx/.xls/.xlsx./.pdf</p>
                        </Upload>
                        </FormItem>
                    
                    </Col>

                </Row>
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button type='primary' onClick={this.back.bind(this)}>返回</Button>
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
    styleDetail:state.styleManage.styleDetail,
    classData:state.user.classByGrade,
  }
}
export default connect(mapStateToProps)(Form.create()(AddStyle));
