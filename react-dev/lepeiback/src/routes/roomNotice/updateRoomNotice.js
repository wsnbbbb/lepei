import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Select,Radio,Input,TreeSelect,message   } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

class UpdateRoomNotice extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value: '1',type:3,treeValue:[],editorState: BraftEditor.createEditorState(null),
            title:'更新教室通知'
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString("id");
        if(id){
          this.props.dispatch({
            type:'roomNotice/roomNoticeDetail',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                this.setState({editorState: BraftEditor.createEditorState(res.data.content),type:res.data.contentType})
              }
            }
          })
        }
        this.props.dispatch({ //获取班级
          type:'user/getAllClassRooms',
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
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title,
            parentRoute:"/room-notice-list"
          },
          })
    }
    componentWillUnmount = () => {
      sessionStorage.removeItem("qiniuToken");
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
    }
    onChange=(e)=>{
        this.setState({
            value: e.target.value,
        });
    }
    typeChange=(val)=>{
        this.setState({type:val})
    }
    onTreeChange=(value)=>{
        this.setState({ treeValue:value });
    }
    submit=()=>{
      const id=getQueryString("id");
      this.props.form.validateFields((err, values) => {
          if(this.state.editorState.isEmpty()&&this.state.type==1){
            return message.error("富文本内容不能为空",2)
          }
          if(!err){
            const params={
                "isReadingReceipt":values.isReadingReceipt,
                "title":values.title,"contentType":values.contentType,
                "content":this.state.type==1?this.state.editorState.toHTML():(this.state.type==3?values.contentText:values.contentChain),
                "roomIds":values.roomIds,"id":id,
            }
            this.props.dispatch({
                type:'roomNotice/updateRoomNotice',
                payload:params,
                callback:(res)=>{
                    if(res.code===200){
                        message.success("更新成功",2)
                        this.props.dispatch(routerRedux.push("/room-notice-list"))
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
    render(){
        const { allClassRooms,roomNoticeDetail } =this.props;
        let treeData=[]
        allClassRooms&&allClassRooms.map(item=>{
          treeData.push(
              <Option key={item.id}>{item.name}</Option>
          )
        })
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const { editorState,type } = this.state;
        return (
            <div className="room-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教学管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/room-notice-list">教室通知</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>更新教室通知</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'选择教室'}>
                      {getFieldDecorator("roomIds",{initialValue:roomNoticeDetail&&roomNoticeDetail.roomIds||[],rules:[{required:true, message:'请选择'}]})(
                        <Select mode="multiple" optionFilterProp="children" >
                          {treeData}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'通知标题'}>
                      {getFieldDecorator("title",{initialValue:roomNoticeDetail&&roomNoticeDetail.title||'',rules:[{required:true, message:'请输入标题',whitespace: true}]})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label={'内容类型'}>
                      {getFieldDecorator("contentType",{initialValue:roomNoticeDetail&&roomNoticeDetail.contentType||'',rules:[{required:true, message:'请选择'}]})(
                        <Select onChange={this.typeChange.bind(this)} >
                          <Option value={1} key={1}>富文本</Option>
                          {/* <Option value={2} key={2}>超链接</Option> */}
                          <Option value={3} key={3}>纯文本</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {this.state.type==3?<Col span={14}>
                    <FormItem {...formItemLayout} label={'内容'}>
                      {getFieldDecorator("contentText",{initialValue:roomNoticeDetail&&roomNoticeDetail.contentType==3&&roomNoticeDetail.content||'',rules:[{required:true, message:'请输入内容'}]})(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                      )}
                    </FormItem>
                  </Col>:null}
                  {this.state.type==2?<Col span={14}>
                    <FormItem {...formItemLayout} label={'内容'}>
                      {getFieldDecorator("contentChain",{initialValue:roomNoticeDetail&&roomNoticeDetail.contentType==2&&roomNoticeDetail.content||'',rules:[{required:true, message:'请输入内容'}]})(
                        <Input  />
                      )}
                    </FormItem>
                  </Col>:null}
                </Row>
                {this.state.type==1?<Row>
                    <Col span={5} style={{textAlign:'right',marginRight:5}}><label><span className="must">*</span>内容：</label></Col>
                    <Col span={17}>
                        <BraftEditor
                            value={roomNoticeDetail&&roomNoticeDetail.contentType==1?editorState:''}
                            onChange={this.handleEditorChange}
                            onSave={this.submitContent}
                            media={{uploadFn: this.myUploadFn}}
                        />
                    </Col>
                </Row>:null}
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to='/room-notice-list'>返回</Link></Button>
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
    roomNoticeDetail:state.roomNotice.roomNoticeDetail,
    allClassRooms:state.user.allClassRooms,
  }
}
export default connect(mapStateToProps)(Form.create()(UpdateRoomNotice));
