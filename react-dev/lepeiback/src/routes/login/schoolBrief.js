import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,message,Radio,Upload,Icon,Modal  } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";
import ImgCutter from '../../components/imgCutter'

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
class SchoolBrief extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            imgPath:'',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            imgs:[],
            oldImgs:[],
            cropVisible: false,
            imgPath1:'',
        };
    }
    componentDidMount=()=>{ 
        this.props.dispatch({ //获取简介详情
            type:'information/getSchoolBrief',
            callback:(res)=>{
            if(res.code===200){
                let imgData=[];
                res.data.imgs.length>0&&res.data.imgs.map((item,index)=>{
                  imgData.push({
                    uid: index+'~'+item,
                    name: 'xxx.png',
                    status: 'done',
                    url:getImg(item),

                  })
                })
                this.setState({
                  imgPath:res.data.logo,
                  oldImgs:res.data.imgs,
                  editorState: BraftEditor.createEditorState(res.data.desc),
                  fileList:imgData,
                  imgPath1:res.data.aerialView,
                })
            }
            }
        })
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
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
    }
    handleChange1 = (info) => {
      if (info.file.status === 'done') {
        this.setState({ imgPath1: info.file.response.id })
        this.props.dispatch({
          type: 'dataScreem/aerialViewSet',
          payload: { "aerialView": info.file.response.id },
          callback: (res) => {
            if (res.code === 200) {
              message.success(`${info.file.name} 上传成功！`);
            }
          }
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  
    // 裁剪
    handleOk1 = (dataUrl) => {
      this.setState({
        cropVisible: false
      });
      this.blob = dataUrl;
    }
    // 裁剪取消
    handleCropCancel1 = () => {
      this.setState({
        cropVisible: false
      });
    }
  
      // 上传图片
    beforeUpload1 = (file) => {
      // console.log({ file });
      let imageType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      let isImage = imageType.findIndex(o => o === file.type) !== -1;
      if (!isImage) {
        message.error('请选择正确的图片类型!');
        return false;
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error('图片大小不能超过2M!');
      //   return false;
      // }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let _this = this;
      reader.onload = (e) => {
        _this.setState({
          cropSrc: e.target.result,
          cropVisible: true,
        })
      }
      return new Promise((resolve, reject) => {
        let index = setInterval(() => {
          if (this.blob) {  // 监听裁剪是否完成
            window.clearInterval(index);
            this.blob.uid = file.uid;   // 需要给裁剪后的blob对象设置uid，否则会报错！
            this.blob.name = file.name
            resolve(this.blob);   // 执行后续的上传操作
          }
        }, 100);
      });
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                const params={
                    "name": values.name,
                    "logo": this.state.imgPath,
                    "intro": values.intro,
                    "imgs": this.state.imgs.length>0?this.state.imgs:this.state.oldImgs,
                    "desc": this.state.editorState.toHTML(),
                    "aerialView": this.state.imgPath1
                }
                this.props.dispatch({
                    type:'information/updateSchoolBrief',
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("更新成功",2)
                            // this.props.form.resetFields();
                            this.props.dispatch(routerRedux.push("/school-brief"))
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
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
        // return isJPG && isLt2M;
    }
    handleChange = (info) => {
      console.log(info)
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
            console.log(info.file.response.id)
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

    handleImgsChange = ({ fileList }) => {
      console.log(fileList)
      this.setState({ fileList })
      let imgs=[]
      fileList.length>0&&fileList.map(item=>{
        if(item.response&&item.response.success){
          imgs.push(item.response.id)
        }else{
          const uid=item.uid.split('~')[1]
          imgs.push(uid)
        }
      })
      this.setState({imgs})
      console.log(imgs)
    };
    render(){
        const {schoolBrief} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const {editorState,disabled,imgPath,imgPath1, previewVisible, previewImage, fileList, cropVisible, cropSrc,}=this.state;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
        </div>
        );
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
        // const { imgPath, points, cropVisible, cropSrc, treeData ,devSns} = this.state
        // const qiniuToken = sessionStorage.getItem('qiniuToken');
        const props1 = {
          name: 'file',
          action: 'https://upload.qiniup.com/',
          accept: "image/jpg,image/jpeg,image/png",
          headers: {
            authorization: 'authorization-text',
            "Content-Disposition": 'form-data; name="file";'
          },
          data: {
            token: qiniuToken ? qiniuToken : this.state.qiniuToken,
          },
          onChange: this.handleChange1,
          beforeUpload: this.beforeUpload1
        };
        return (
            <div className="brief-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item>学校简介</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学校名称'}>
                      {getFieldDecorator("name",{initialValue:schoolBrief&&schoolBrief.name||'',rules:[{required:true, message:'请输入学校名称',whitespace: true}]})(
                        <Input placeholder='学校名称'/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'学校Logo'}>
                      {getFieldDecorator("logo",{initialValue:schoolBrief&&schoolBrief.logo||''})(
                        <span>
                        {imgPath?<img className="school-logo" src={getImg(imgPath)} />:null}
                        <Upload {...props} showUploadList={false}>
                            <Button disabled={disabled}>
                            <Icon type="upload" /> 上传图标
                            </Button>
                        </Upload></span>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={20}>
                    <FormItem {...formItemLayout2} label={'简介'}>
                      {getFieldDecorator("intro",{initialValue:schoolBrief&&schoolBrief.intro||''})(
                        <TextArea autosize={{ minRows: 2 }} placeholder='请输入简介'/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={20}>
                    <FormItem {...formItemLayout2} label={'学校图片'}>
                      {/* {getFieldDecorator("imgs",{initialValue:''})( */}
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
                            {fileList.length >= 24 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      {/* )} */}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>详细介绍：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>
                {/* <Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>详细介绍：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row> */}
                <Row style={{marginTop: '30px'}}>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>校园鸟瞰图：</label></Col>
                    <Col span={17}>
                      <Upload
                        {...props1}
                        showUploadList={false}
                        > 
                        <Button type="primary">上传图片</Button>
                      </Upload>&emsp;&emsp;
                    </Col>
                </Row>
                <Row style={{marginTop: '30px'}}>
                <Col span={5} style={{textAlign:'right',marginRight:5}}><label>校园鸟瞰图：</label></Col>
                  <Col span={17}>
                      {imgPath1?<img className="map-preview" src={getImg(imgPath1)} />:null}
                  </Col>
                  </Row>
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                  </Col>
                </Row>
              </Form>
              <Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel1} width={600}>
                <ImgCutter aspectRatio={434 / 309} src={cropSrc} onOk={this.handleOk1} />
              </Modal>
            </div> 
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    schoolBrief:state.information.schoolBrief
  }
}
export default connect(mapStateToProps)(Form.create()(SchoolBrief));
