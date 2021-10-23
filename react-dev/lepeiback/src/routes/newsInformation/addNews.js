import React,{Component} from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Input,Row, Col, message, Select,Breadcrumb, Radio,Upload, Icon,Modal} from 'antd';
import {Link,routerRedux} from "dva/router";
import {getImg,} from '../../utils/img';
import BraftEditor from 'braft-editor';
import ImgCutter from '../../components/imgCutter'
import moment from 'moment';
import {getQueryString} from '../../utils/public';
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

class addNews extends Component{
    constructor(props){
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            imgPath:'',
            loading: false,
            newsDetail:{},
            topStartTime:'',
            topEndTime:'',
            isTop:0,
            topTime:true,
            showStyle:1,
            active:1,
            cropVisible: false,
            cropSrc:'',
            title:'添加',
            title1:'编辑'
        }
    }
    componentDidMount = () => {
        const id=getQueryString('id');
        // 获取新闻详情
        if(id){
            this.props.dispatch({ 
                type:'newsInformation/getNewsDetail',
                payload:{id},
                callback:(res)=>{
                    console.log("res",res);
                    if(res.code === 200){
                        this.setState({
                            newsDetail:res.data,
                            editorState: BraftEditor.createEditorState(res.data.content),
                            topStartTime:res.data.topStartTime,
                            topEndTime:res.data.topEndTime,
                            imgPath:res.data.coverImg,
                            isTop:res.data.isTop,
                            showStyle:res.data.showStyle,
                            active:res.data.showStyle
                        })
                        if(res.data.isTop === 1){
                            this.setState({
                                topTime:false
                            })
                        }
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
                  parentRoute:"/news-information"
                },
              })
        }else{
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/news-information"
                },
              })
        }
        
    }
    componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }
    // 上传封面
    beforeUpload = (file) => {
        console.log({file});
        
        let imageType = ['image/jpeg','image/png','image/jpg','image/gif'];
        let isImage = imageType.findIndex(o => o === file.type) !== -1;
        if (!isImage) {
          message.error('请选择正确的图片类型!');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小不能超过2M!');
          return false;
        }
     
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
            if(this.blob){  // 监听裁剪是否完成
              window.clearInterval(index);
              this.blob.uid = file.uid;   // 需要给裁剪后的blob对象设置uid，否则会报错！
              this.blob.name = file.name
              resolve(this.blob);   // 执行后续的上传操作
            }
          },100);
        });
    }
    handleChange = (info) => {
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
            // const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            // param.success({
            //     url: getImg(JSON.parse(response.target.response).id)||JSON.parse(xhr.responseText).data.fileUrl,
            //     meta: {
            //     id: upLoadObject && upLoadObject.id,
            //     title: upLoadObject && upLoadObject.fileName,
            //     alt: upLoadObject && upLoadObject.fileName,
            //     loop: false, // 指定音视频是否循环播放
            //     autoPlay: false, // 指定音视频是否自动播放
            //     controls: false, // 指定音视频是否显示控制栏
            //     poster: '', // 指定视频播放器的封面
            //     }
            // })
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

    handleEditorChange = (editorState)=>{
        this.setState({ editorState })
    }
    // 置顶时间
    onChangeRange=(date, dateString)=>{
        console.log(date, dateString)
        this.setState({
            topStartTime: dateString[0],
            topEndTime: dateString[1]
        })
    }
    // 是否置顶
    changeIsTop = (e)=>{
        this.setState({
            isTop:e.target.value
        })
        if(e.target.value === 1){
            this.setState({
                topTime:false
            })
        }else{
            this.setState({
                topTime:true,
                topStartTime:'',
                topEndTime:''
            })
        }
    }
    clickImg = (showStyle)=>{
        console.log(showStyle);
        
        this.setState({
            showStyle,
            active:showStyle
        })
    }
    // 裁剪
    handleOk = (dataUrl) =>{
        this.setState({
            cropVisible: false
        });
        this.blob= dataUrl;
    }
    handleCropCancel = ()=>{
        this.setState({
            cropVisible: false
        });
    }
    // 保存
    save = ()=>{
        const id=getQueryString('id')
        if(this.state.editorState.isEmpty()){
            return message.error('新闻内容不能为空！')
        }
        if(this.state.isTop==1&&!this.state.topStartTime&&!this.state.topEndTime){
            return message.error('请选择置顶时间')
        }
       
        this.props.form.validateFields((err,values) =>{
            let params;
            if(!err){
                if(id){
                    params = {
                        "id":id,
                        "title":values.title,
                        "isTop":this.state.isTop,
                        "status":values.status,
                        "topStartTime":this.state.topStartTime||'',
                        "topEndTime":this.state.topEndTime||'',
                        "showStyle":this.state.showStyle,
                        "coverImg":this.state.imgPath,
                        "content":this.state.editorState.toHTML()
                    }
                }else{
                    params = {
                        "title":values.title,
                        "isTop":this.state.isTop,
                        "topStartTime":this.state.topStartTime||'',
                        "topEndTime":this.state.topEndTime||'',
                        "showStyle":this.state.showStyle,
                        "coverImg":this.state.imgPath,
                        "content":this.state.editorState.toHTML()
                    }
                    console.log("params",params);
                    
                }
                this.props.dispatch({ 
                    type:id?'newsInformation/saveEdit':'newsInformation/addNews',
                    payload:params,
                    callback:(res)=>{
                        console.log("res2",res);
                        if(res.code===200){
                            message.success(id?"更新成功":"创建成功")
                            // this.props.form.resetFields();
                            this.props.dispatch(routerRedux.push("/news-information"))
                        }
                    }
                })
            }
        })
    }
    render(){
      const {imgPath,loading,editorState, newsDetail,topTime,active,isTop,showStyle,cropVisible, cropSrc} = this.state
      const { getFieldDecorator } = this.props.form;
      const id=getQueryString('id')
      const uploadButton = (
        <div> 
          <Icon type={loading ? 'loading' : 'plus'} />
          <div>上传封面</div>
        </div>
      );
      const formItemLayout = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 9 },
            wrapperCol: { span: 10 }
        };
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
       
 
        return(
            <div className="content-main">
                    {/* <Breadcrumb style={{marginBottom:"25px"}}>
                        <Breadcrumb.Item><Link to="/news-information">教育资讯</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{id?"编辑":"添加"}</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Form>
                        <Row gutter={24}>
                            <Col span={14}>
                                <FormItem {...formItemLayout} label={'资讯标题：'}>
                                    {getFieldDecorator("title",{initialValue:id&&newsDetail?newsDetail.title:'',rules:[{required:true, message:'请输入资讯标题',whitespace: true}]})(
                                        <Input placeholder='标题，50字以内' maxLength={50}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={14}>
                                    <Form.Item {...formItemLayout} label="是否置顶：" >
                                        <Radio.Group onChange={this.changeIsTop} value={isTop}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} className={topTime?"hide":"show"}>
                            <Col span={14}>
                                <Form.Item {...formItemLayout} label="置顶时间：">
                                    <RangePicker  onChange={this.onChangeRange} value={[this.state.topStartTime?moment(this.state.topStartTime, dateFormat):"", this.state.topEndTime?moment(this.state.topEndTime, dateFormat):""]}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:"30px"}}>
                            <Col span={5} style={{textAlign:'right',marginRight:5}}><label>展示形式：</label></Col>
                            <Col span={16}>
                                <div className="imgs">
                                    <div className={active===1?"border":""} onClick={this.clickImg.bind(this,1)}>
                                        <img src={require("../../assets/news-pic2.png")} alt=""/>
                                    </div>
                                    <div className={active===3?"border":""} onClick={this.clickImg.bind(this,3)}>
                                        <img src={require("../../assets/news-pic3.png")} alt=""/>
                                    </div>
                                    <div className={active===2?"border":""} onClick={this.clickImg.bind(this,2)}>
                                        <img src={require("../../assets/news-pic1.png")} alt=""/>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                        {
                            showStyle!==1?
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Form.Item {...formItemLayout} label="封面：">
                                    {getFieldDecorator('coverImg',{initialValue:id&&newsDetail?newsDetail.coverImg:''})(
                                        <Upload
                                            {...props}
                                            listType="picture-card"
                                            showUploadList={false}
                                        >
                                            {imgPath ? <img src={getImg(imgPath)} alt="coverImg" style={{ width: '100%'}} /> : uploadButton}
                                        </Upload>
                                    )}
                                    </Form.Item>
                                </Col>
                            </Row>:null
                        }
                        <Row>
                            <Col span={5} style={{textAlign:'right',marginRight:5}}><label>内容：</label></Col>
                            <Col span={16}>
                                <BraftEditor
                                    value={editorState}
                                    onChange={this.handleEditorChange}
                                    media={{uploadFn: this.myUploadFn}}
                                />
                            </Col>
                        </Row>
                        {
                            id?
                            <Row gutter={24} style={{marginTop:'20px'}}>
                                <Col span={14}>
                                    <FormItem {...formItemLayout2} label={'状态：'}>
                                        {getFieldDecorator("status",{initialValue:id&&newsDetail?newsDetail.status:''})(
                                            <Select placeholder="显示/隐藏">
                                                <Option value={1}>显示</Option>
                                                <Option value={3}>隐藏</Option>
                                                <Option value={0}>待审核</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                 </Col>
                            </Row>:null
                        }
                        <Row style={{marginTop:20}}>
                            <Col span={1} offset={10} style={{marginRight:'20px'}}>
                                <Button><Link to='/news-information'>取消</Link></Button>
                            </Col>
                            <Col span={2} offset={0}>
                                <Button type='primary' onClick={this.save.bind(this,id)} >保存</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel} width={500}>
                        <ImgCutter aspectRatio={16/16} src={cropSrc} onOk={this.handleOk} />
                    </Modal>
                   
            </div>
        )
    }

   
}

const mapStateToProps = (state) => {
    return {
      
    }
  }
  
export default connect(mapStateToProps)(Form.create()(addNews));