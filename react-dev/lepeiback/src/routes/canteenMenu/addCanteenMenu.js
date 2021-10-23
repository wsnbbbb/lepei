import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,message   } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";
import { stat } from 'fs';

const FormItem = Form.Item;

class AddCanteenMenu extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title:"添加",
            title1:"编辑",
            editorState: BraftEditor.createEditorState(null)
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString('id')
        const type=getQueryString('type');
        if(id){
            this.props.dispatch({
                type:'canteenMenu/canteenMenuDetail',
                payload:{"id":id},
                callback:(res)=>{
                    if(res.code===200){
                        this.setState({editorState: BraftEditor.createEditorState(res.data.content)})
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
        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/canteen-menu"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/canteen-menu"

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
            console.log(values)
            let params;
            if(!err){
                if(id){
                    params={
                        "title":values.title,
                        "content":this.state.editorState.toHTML(),
                        "id":id
                    }
                }else{
                    params={
                        "title":values.title,
                        "content":this.state.editorState.toHTML(),
                    }
                }
                
                this.props.dispatch({
                    type:id?'canteenMenu/updateCanteenMenu':'canteenMenu/createCanteenMenu',
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(id?"更新成功":"创建成功",2)
                            this.props.form.resetFields();
                            this.props.dispatch(routerRedux.push("/canteen-menu"))
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
        console.log(editorState.toHTML())
    }
    myUploadFn = (param) => {
        console.log(param)
        const serverURL = 'https://upload.qiniup.com/'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
      
        const successFn = (response) => {
          console.log(response)
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
        const {canteenMenuDetail} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const { editorState } = this.state;
        console.log(editorState)
        const id=getQueryString('id')
        return (
            <div className="room-main">
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'菜谱名称'}>
                      {getFieldDecorator("title",{initialValue:id&&canteenMenuDetail?canteenMenuDetail.title:'',rules:[{required:true, message:'请输入菜谱名称',whitespace: true}]})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label>上传图片：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to='/canteen-menu'>返回</Link></Button>
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
    canteenMenuDetail:state.canteenMenu.canteenMenuDetail
  }
}
export default connect(mapStateToProps)(Form.create()(AddCanteenMenu));
