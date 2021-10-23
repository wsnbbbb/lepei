import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,message,Radio,Upload, Icon,Checkbox ,Modal } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class AddSchoolNotice extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),imgPath:'',
            contentType:'1',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            imgs:[],
            oldImgs:[],
            title:'发布校园公告',
            title1:'编辑校园公告'
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString('id')
        if(id){
           this.props.dispatch({
               type:'schoolNotice/getSchoolNoticeDetail',
               payload:{"id":id},
               callback:(res)=>{
                if(res.code===200){
                  let imgData=[];
                  res.data.pics&&res.data.pics.split(",").length>0&&res.data.pics.split(",").map((item,index)=>{
                    imgData.push({
                      uid: item,
                      name: 'xxx.png',
                      status: 'done',
                      url:getImg(item)
                    })
                  })
                  if(res.data.contentType==1){
                    this.setState({editorState: BraftEditor.createEditorState(res.data.content)})
                  }
                  this.setState({imgPath:res.data.coverImg,fileList:imgData,oldImgs:res.data.pics.split(","),contentType:res.data.contentType})
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
                parentRoute:"/school-notice-list"
              },
            })
        }else{
          this.props.dispatch({
              type: 'user/setLastRoute',
              payload: {
                breadcrumbTitle:this.state.title,
                parentRoute:"/school-notice-list"
              },
            })
       }
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
    }
    submit=()=>{
        const id=getQueryString('id')
        if(this.state.editorState.isEmpty()&&this.state.contentType==1){
          return message.error("富文本内容不能为空",2)
        }
        if(this.state.contentType==4&&(this.state.imgs<=0&&this.state.oldImgs<=0)){
          return message.error("图文模式必须上传图片",2)
        }
        if(id&&this.state.contentType==4&&(this.state.imgs<=0&&this.state.oldImgs<=0)){
          return message.error("图文模式必须上传图片",2)
        }
        this.props.form.validateFields((err, values) => {
          console.log(values)
            const {contentType} = this.state;
            let params;
            if(!err){
              if(contentType==4){
                params={
                  "title":values.title,
                  "contentType":values.contentType,
                  "receivePlatform":(values.receivePlatform).join(),
                  "content":contentType==1?this.state.editorState.toHTML():(contentType==2?values.chainContent:(contentType==3?values.content3:values.content4)),
                  "pics":this.state.imgs.length>0?(this.state.imgs).join():(this.state.oldImgs).join(),
                }
              }else{
                params={
                  "title":values.title,
                  "coverImg":this.state.imgPath,
                  "contentType":values.contentType,
                  "receivePlatform":(values.receivePlatform).join(),
                  "intro":values.intro,
                  "content":contentType==1?this.state.editorState.toHTML():(contentType==2?values.chainContent:(contentType==3?values.content3:values.content4)),
                }
              }
                
                this.props.dispatch({
                    type:id?'schoolNotice/updateSchoolNotice':'schoolNotice/addSchoolNotice',
                    payload:id?{...params,"id":id}:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(id?"更新成功":"创建成功",2)
                            this.props.form.resetFields();
                            this.props.dispatch(routerRedux.push("/school-notice-list"))
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
        const isJPG = file.type === 'image/jpeg'||file.type === "image/png";
        if (!isJPG) {
          message.error('上传的图片只能为jpg或png格式！');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
      console.log(info )
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
    typeChange=(e)=>{
      console.log(e)
      this.setState({contentType:e.target.value})
    }
    onCheckChange=(checkedValues)=> {
      console.log('checked = ', checkedValues);
      this.setState({platform:checkedValues})
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    };

    clear=()=>{
      this.setState({
        imgPath: ''
      })
    }

    handleImgsChange = ({ fileList, file }) => {
      const id=getQueryString('id')
      console.log(file)
      console.log(fileList)
      this.setState({ fileList })
      if(id&&file.status=="removed"){
        let arr = []
        this.state.fileList.map(item=>{
          arr.push(item.uid)
        })
        this.setState({
          oldImgs: arr
        })
      }

      if(file.response&&file.response.success){
        console.log("33")
        let arr = fileList.filter(item=>{
          return (item.response&&item.response.success)||(item.status=="done")
        })
        this.setState({ fileList: arr })
      }

      if(!file.status){
        let arr = fileList.filter(item=>{
          return (item.response&&item.response.success)||(item.status=="done")
        })
        this.setState({ fileList: arr })
      }
     
      let imgs=[]
      fileList.length>0&&fileList.map(item=>{
        if(item.response&&item.response.success){
          imgs.push(item.response.id)
        }else{
          // const uid=item.uid.split('~')[1]
          // imgs.push(item.uid)
        }
        if(!item.response&&item.status&&item.status=="done"){
          imgs.push(item.uid)
        }
      })
      
      this.setState({imgs})
      console.log("arr")
      // console.log(arr)
      console.log(imgs)
    };
    render(){
        const {schoolNoticeDetail} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const {editorState,disabled,imgPath,contentType,previewVisible, previewImage, fileList}=this.state;
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
        const options = [
          { label: '班牌端', value: '3' },
          { label: '教师端', value: '2' },
          { label: '家长端', value: '1' },
        ];
        const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
          </div>
          );
        return (
            <div className="room-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/school-notice-list">校园公告</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{id?"编辑校园公告":"发布校园公告"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'公告类型'}>
                      {getFieldDecorator("contentType",{initialValue:id&&schoolNoticeDetail?String(schoolNoticeDetail.contentType):'1',rules:[{required:true, message:'请选择公告类型'}]})(
                         <RadioGroup onChange={this.typeChange}>
                              <Radio.Button value="1">富文本</Radio.Button>
                              <Radio.Button value="3">纯文本</Radio.Button>
                              <Radio.Button value="4">图文</Radio.Button>
                              <Radio.Button value="2">链接</Radio.Button>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'接收平台'}>
                      {getFieldDecorator("receivePlatform",{initialValue:id&&schoolNoticeDetail?schoolNoticeDetail.receivePlatform.split(','):'',rules:[{required:true, message:'请选择接收平台'}]})(
                         <Checkbox.Group options={options} onChange={this.onCheckChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'公告标题'}>
                      {getFieldDecorator("title",{initialValue:id&&schoolNoticeDetail?schoolNoticeDetail.title:'',rules:[{required:true, message:'请输入公告标题',whitespace: true}]})(
                        <Input placeholder='请输入公告标题' maxLength='30'/>
                      )}
                    </FormItem>
                  </Col>
                  {contentType==4?null:<Col span={14}>
                    <FormItem {...formItemLayout} label={'简介'}>
                      {getFieldDecorator("intro",{initialValue:id&&schoolNoticeDetail?schoolNoticeDetail.intro:''})(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} maxLength='60'/>
                      )}
                    </FormItem>
                  </Col>}
                  {contentType==4?null:<Col span={14}>
                    <FormItem {...formItemLayout} label={'封面'}>
                      {getFieldDecorator("coverImg",{initialValue:id&&schoolNoticeDetail?schoolNoticeDetail.coverImg:''})(
                        <span>
                        {imgPath?<img className="person-img" src={getImg(imgPath)} />:null}
                        <Upload {...props} showUploadList={false}>
                            <Button disabled={disabled}>
                            <Icon type="upload" /> 上传
                            </Button>
                           
                        </Upload>
                        &nbsp;&nbsp;<Button type="danger" onClick={this.clear.bind(this)}>清除</Button></span>
                      )}
                    </FormItem>
                  </Col>}
                  {contentType==3?
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'内容'}>
                      {getFieldDecorator("content3",{initialValue:id&&schoolNoticeDetail&&schoolNoticeDetail.contentType==3?schoolNoticeDetail.content:'',rules:[{required:true, message:'请输入公告内容',whitespace: true}]})(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                      )}
                    </FormItem>
                  </Col>:null}
                  {contentType==4?
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'内容'}>
                      {getFieldDecorator("content4",{initialValue:id&&schoolNoticeDetail&&schoolNoticeDetail.contentType==4?schoolNoticeDetail.content:'',rules:[{required:true, message:'请输入公告内容',whitespace: true}]})(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                      )}
                    </FormItem>
                  </Col>:null}
                {contentType==2?
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'链接'}>
                      {getFieldDecorator("chainContent",{initialValue:id&&schoolNoticeDetail&&schoolNoticeDetail.contentType==2?schoolNoticeDetail.content:'',rules:[{required:true, message:'请输入公告内容',whitespace: true}]})(
                        <Input placeholder='请输入链接地址' maxLength='1000'/>
                      )}
                    </FormItem>
                  </Col>:null}
                </Row>
                {contentType==1?<Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label><span className="must">*</span>内容：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>:null}
                
                {contentType==4?<Row><Col span={5} style={{textAlign:'right',marginRight:5}}><label><span className="must">*</span>图片：</label></Col>
                  <Col span={17}>
                    {/* <FormItem {...formItemLayout2} label={'图片'}> */}
                        <Upload
                            action="https://upload.qiniup.com/"
                            accept="image/jpg,image/jpeg,image/png"
                            listType="picture-card"
                            fileList={fileList}
                            multiple={true}
                            beforeUpload={this.beforeUpload}
                            onPreview={this.handlePreview}
                            onChange={this.handleImgsChange}
                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                        >
                            {fileList.length >= 9 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    {/* </FormItem> */}
                  </Col></Row>:null}
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to='/school-notice-list'>返回</Link></Button>
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
    schoolNoticeDetail:state.schoolNotice.schoolNoticeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(AddSchoolNotice));
