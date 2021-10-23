import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Select,Radio,Input,TreeSelect,message, Upload, Icon, Modal  } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString} from '../../utils/public';
import {getImg} from '../../utils/img';
import "./style.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ClassNoticeDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isReadingReceipt: '0',
      title:'',
      content:'',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imgs:[],
      noticeId:'',
      isDisabled: false,
      title2:'发布班级通知',
      title1:'编辑'
    }
  }
  componentDidMount=()=>{ 
    const id = getQueryString("id");
    if(id) {
      this.classNoticeDetail(id)
      this.setState({
        noticeId:id,
        isDisabled:true
      })
    }
    this.props.dispatch({ //获取班级
      type:'user/getClassByGrade',
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

    if(id){
      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title1,
            parentRoute:"/class-notice"
          },
        })
     }else{
      this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title2,
            parentRoute:"/class-notice"
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
  // 获取通知详情
  classNoticeDetail = (id) => {
    this.props.dispatch({
      type:'classNotice/classNoticeDetail',
      payload:{id},
      callback:res =>{
        if(res.code === 200){
          let imgData = [];
            res.data.pics.length > 0 && res.data.pics.map((item,index)=>{
              imgData.push({
                uid: index + '~' + item,
                name: 'xxx.png',
                status: 'done',
                url: getImg(item),
              })
            })
          this.setState({
            title: res.data.title,
            isReadingReceipt: res.data.isReadingReceipt.toString(),
            content: res.data.content,
            fileList: imgData
          })
        }
      }
    })
  }
  // 关闭预览
  handleCancel = () => this.setState({ previewVisible: false });
  // 图片预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 图片上传限制
  beforeUpload =(file)=> {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传图片不能大于2MB!');
      return new Promise((resolve, reject)=>{
        reject(file)
      })
    }
  }
  // 图片上传
  handleChange = ({ fileList }) => {
    console.log(fileList)
    this.setState({ fileList })
    let imgs = []
    fileList.length > 0 && fileList.map(item =>{
      if(item.response && item.response.success){
        imgs.push(item.response.id)
      }else{
        const uid = item.uid.split('~')[1]
        imgs.push(uid)
      }
    })
    this.setState({imgs})
  }
 
  // 提交
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        let id = this.state.noticeId
        let ids = values.classIds;
        let classIds = [];
        ids && ids.length > 0 && ids.map(item =>{
          let n = item.substring(item.lastIndexOf('-') + 1, item.length);
          classIds.push(n)
        })
        const params = {
          "title":values.title,
          "isReadingReceipt":values.isReadingReceipt,
          "content":values.content,
          "classIds":classIds,
          "pics":this.state.imgs || []
        }
        if(id){
          params.id = id
        } 
        console.log({params})
        this.props.dispatch({
          type:id ? 'classNotice/updateClassNotice' : 'classNotice/setClassNotice',
          payload:params,
          callback:(res)=>{
              if(res.code === 200){
                message.success(id ? "编辑成功" : "创建成功")
                window.history.go(-1)
              }
          }
        })
      }
    })
  }

  render(){
    const { noticeId, previewVisible, previewImage, fileList,title, content, isReadingReceipt,isDisabled } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const qiniuToken = sessionStorage.getItem('qiniuToken');
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
        beforeUpload:this.beforeUpload,
        onPreview:this.handlePreview
    };
    const { classData, classNoticeDetail } = this.props;
    if(!classData){
      return null
    }
    let ids = []
    noticeId && classNoticeDetail && classNoticeDetail.classes.map(item => {
      ids.push('c-' + item.classId)
    })
    // 班级选择options
    let treeData = []
    classData && classData.map(item => {
      let children = []
      item.classData && item.classData.length > 0 && item.classData.map(n => {
        children.push({
          title:item.gradeName + '-' + n.className,
          value:'c-' + n.classId,
          key:'c-' + n.classId,
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
      onChange: this.onTreeChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_CHILD,
      searchPlaceholder: '请选择',
      treeNodeFilterProp:"title",
    }

    return (
      <div className="notice-detail">
        {/* <div className="breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>家校互动</Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/class-notice">家长通知</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{noticeId ? '编辑' : '发布班级通知'}</Breadcrumb.Item>
            </Breadcrumb>
            <h3>{noticeId ? '编辑' : '发布班级通知'}</h3>
        </div> */}
        <div className="content-main detail">
          <Form {...formItemLayout}>
            <Row gutter={24}>
              <Col span={11}>
                <FormItem label={'通知标题'}>
                  {getFieldDecorator("title",{initialValue:title,rules:[{required:true, message:'请输入标题',whitespace: true}]})(
                    <Input maxLength={30} placeholder="请输入通知标题（最多30个汉字）"/>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label={'阅读回执'}>
                  {getFieldDecorator("isReadingReceipt",{initialValue: isReadingReceipt})(
                    <RadioGroup disabled={isDisabled}>
                      <Radio value='0'>不需要</Radio>
                      <Radio value='1'>需要</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={11}>
                <FormItem label={'通知内容'}>
                  {getFieldDecorator("content",{initialValue:content,rules:[{required:true, message:'请输入内容'}]})(
                    <TextArea placeholder="请输入通知内容（最多500个汉字）" maxLength={500} autosize={{ minRows: 10, maxRows: 13 }} />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label={'发布班级'}>
                  {getFieldDecorator("classIds",{initialValue:classNoticeDetail && ids || [],rules:[{required:true, message:'请选择'}]})(
                    <TreeSelect disabled={isDisabled} {...tProps} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} className="upload-pic">
              <Col span={24}>
                <FormItem label={'通知图片'}>
                  <Upload
                    {...props}
                    listType="picture-card"
                    fileList={fileList}
                  >
                    {
                      fileList.length >= 9 ? null :  
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text"></div>
                      </div>}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={2} offset={10}>
                <Button ><Link to='/class-notice'>返回</Link></Button>
              </Col>
              <Col span={2} offset={0}>
                <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
              </Col>
            </Row>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div> 
    );
  }
}
const mapStateToProps = (state) => {
  return {
    classData:state.user.classByGrade,
    classNoticeDetail:state.classNotice.classNoticeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(ClassNoticeDetail));
