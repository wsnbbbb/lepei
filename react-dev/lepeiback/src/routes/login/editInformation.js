import React,{Component} from 'react';
import { connect } from 'dva';
import { Avatar,Upload,Button,Form,Tabs,Icon, Input,Row,Col,message } from 'antd';
import {getImg} from '../../utils/img';
import './style.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

class EditInformation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            step:1,
            count: 60,
            liked: true,
            isShow:false,
            imgPath:'',
            teacherPic:'',
            disabled:false
        };
        this.timer = null;
    }
    componentDidMount=()=>{
        sessionStorage.removeItem("qiniuToken");
        this.getInformation();
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
    beforeUpload =(file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
    }
    getInformation=()=>{
        this.props.dispatch({
            type:'user/getInformation',
            callback:(res)=>{
                if(res.code===200){
                    this.setState({imgPath:res.data.pic})
                    if(res.data.phone){
                        this.setState({isShow:true,step:3,teacherPic:res.data.teacherPic})
                    }else{
                        this.setState({isShow:false,step:1})
                    }
                }
            }
        })
    }
    componentWillUnmount = () => {
        clearInterval(this.timer);
    }
    
    changeTab=(key)=>{
        console.log(key)
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPsd')) {
            callback('两次输入的密码不一致');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['checkPsd'], { force: true });
        }
        callback();
    }
    // 更新账号信息
    updateInfo=()=>{
        const userId=sessionStorage.getItem("userId")
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type:'information/updateInformation',
                payload:{
                    "userId":userId,"realName":values.realName,"pic":this.state.imgPath,"intro":values.intro
                },
                callback:(res)=>{
                    if(res.code===200){
                        message.success('更新账号信息成功',2)
                        this.getInformation();
                    }
                }
            })
        })
    }
    // 更新密码
    updatePsd=()=>{
        const userId=sessionStorage.getItem("userId")
        this.props.form.validateFields((err, values) => {
            if(err&&err.oldPsd||err&&err.newPsd||err&&err.checkPsd){
                return 
            }
            if(values.oldPsd&&values.newPsd&&values.checkPsd){
                this.props.dispatch({
                    type:'information/updatePsd',
                    payload:{
                        "userId":userId,"oldPsd":values.oldPsd,"newPsd":values.newPsd,"checkPsd":values.checkPsd
                    },
                    callback:(res)=>{
                        if(res.code===200){
                            message.success('修改密码成功',2)
                        }
                    }
                })
            }
        })
    }
    timerChange = () => {
        this.setState({
          liked: false
        });
        this.timer = setInterval(function() {
          let count = this.state.count;
          count -= 1;
          if (count < 1) {
            this.setState({
              liked: true,disabled:false
            });
            count = 60;
            clearInterval(this.timer);
          }
          this.setState({
            count: count
          });
        }.bind(this), 1000);
    }
    // 获取验证码
    getCode = () => {
        const { liked } = this.state;
        if (!liked) {
          return false;
        }
        const values = this.props.form.getFieldsValue();
        if(!values.phone){
            return message.error('请输入手机号',2)
        }
        this.setState({disabled:true})
        this.props.dispatch({
            type:'user/getVerificationCode',
            payload:{"phone":values.phone},
            callback:(res)=>{
                if(res.code===200){
                    this.timerChange();
                    this.setState({disabled:true})
                }
                this.setState({disabled:false})
            }
        })
    }
    // 根据手机号查询账户绑定状态
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(err&&err.phone){
                return
            }
            if(values.phone&&values.code){
                this.props.dispatch({
                    type:'user/checkCode',
                    payload:{
                        "phone":values.phone,
                        "verificationCode":values.code
                    },
                    callback:(res)=>{
                        if(res.code===200){
                            this.setState({step:2,bindPhone:res.data.phone})
                        }
                    }
                })
            }
        })
    }
    // 账号绑定
    bindCount=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(values)
            this.props.dispatch({
                type:'information/bindCount',
                payload:{"phone":this.state.bindPhone},
                callback:(res)=>{
                    if(res.code===200){
                        message.success("绑定账号成功！",2)
                        this.getInformation();
                    }
                }
            })
        })
    }
    // 账号解绑
    unbind=()=>{
        this.props.dispatch({
            type:'information/unbindCount',
            callback:(res)=>{
                if(res.code===200){
                    message.success("解绑账号成功！",2)
                    this.getInformation();
                }
            }
        })
    }
    // 取消
    cancel=()=>{
        this.setState({step:1,key:1})
    }
    onChange=(info)=>{
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
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
            onChange:this.onChange,
            beforeUpload:this.beforeUpload
        };

        const {information,saveCode} = this.props;
        const userType=sessionStorage.getItem("userType");
        const { liked,step,isShow,imgPath,teacherPic,disabled } = this.state;
        const text = liked ? '获取验证码' : this.state.count + '秒后可重发';
        return (
            <div className="edit-information">
                <Tabs defaultActiveKey="1" tabPosition='left' onChange={this.changeTab.bind(this)}>
                    <TabPane tab="基础资料" key="1">
                    <div className='common-info'>
                        <div className='common-info-left'>
                            <h3>基础资料</h3>
                            <p>账号</p>
                            <p className='account-num'>{information&&information.username}</p>
                            <Form className="ant-advanced-search-form login-form" layout='vertical'>
                                <Row gutter={24}>
                                    <Col span={20}>
                                        <FormItem {...formItemLayout} label='姓名'>
                                        {getFieldDecorator('realName',{initialValue:information&&information.realName||''})(
                                            <Input size='large' placeholder='' maxLength="20"/>
                                        )}
                                        </FormItem>
                                    </Col> 
                                    </Row>
                                <Row gutter={24}>
                                    <Col span={20}>
                                        <FormItem {...formItemLayout} label={'个人简介'}>
                                        {getFieldDecorator("intro",{initialValue:information&&information.intro||''})(
                                        <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <Button type='primary' onClick={this.updateInfo.bind(this)}>更新信息</Button>
                        </div>
                        <div className='common-info-right'>
                            <img className="person-img" src={getImg(imgPath)} />
                            <Upload {...props} showUploadList={false}>
                                <Button>
                                <Icon type="upload" /> 更换头像
                                </Button>
                            </Upload>
                            <p className='tip'>头像修改后会同步至班牌、乐陪家长端、乐陪教师端等</p>
                        </div>
                    </div>
                    </TabPane>
                    <TabPane tab="密码修改" key="2">
                        <div className='edit-psd'>
                            <h3>密码修改</h3>
                            <Form layout='vertical'>
                            <Row gutter={24}>
                                <Col span={13}>
                                    <FormItem {...formItemLayout} label="旧密码">
                                    {getFieldDecorator('oldPsd', {
                                        rules: [{
                                            required: true, message: '请输入正确的密码!',pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,whitespace: true
                                        }],
                                    })(
                                        <Input type="password"/>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={13}>
                                    <FormItem {...formItemLayout} label="新密码">
                                    {getFieldDecorator('newPsd', {
                                        rules: [{
                                            required: true, message: '请输入正确的密码!',pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,whitespace: true
                                        }, {
                                            validator: this.validateToNextPassword,
                                        }],
                                    })(
                                        <Input type="password" />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={13}>
                                    <FormItem {...formItemLayout} label="确认新密码">
                                    {getFieldDecorator('checkPsd', {
                                        rules: [{
                                        required: true, message: '请输入正确的密码!',pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,whitespace: true
                                        }, {
                                        validator: this.compareToFirstPassword,
                                        }],
                                    })(
                                        <Input type="password" onBlur={this.handleConfirmBlur} />
                                    )}
                                    </FormItem>
                                </Col>
                                </Row>
                            </Form>
                            <p style={{color:'#f00',marginBottom:10}}>注：密码由6-20位，字母（区分大小写）、数字、符号两种及以上组成</p>
                            <Button type='primary' onClick={this.updatePsd.bind(this)}>确认修改</Button>
                        </div>
                    </TabPane>
                    {userType==2?<TabPane tab="账号绑定" key="3">
                        <div className='bind-account'>
                            <h3>账号绑定</h3>
                            {step==1?<Form className="ant-advanced-search-form login-form" layout='vertical'>
                                <Row gutter={24}>
                                    <Col span={10}>
                                        <FormItem {...formItemLayout} label=''>
                                        {getFieldDecorator('phone',{initialValue:'',
                                            rules: [{
                                                required: true, message: '请输入正确的手机号!',pattern:/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,whitespace: true
                                            }]
                                        })(
                                            <Input size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号" />
                                        )}
                                        </FormItem>
                                    </Col> 
                                </Row>
                                <Row gutter={24}>
                                    <Col span={16}>
                                        <FormItem {...formItemLayout} label="">
                                        <Row gutter={8}>
                                            <Col span={10}>
                                            {getFieldDecorator('code', {initialValue:'',rules: [{ required: true, message: '请输入验证码',whitespace: true }]})(
                                                <Input size='large' maxLength='10' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入验证码" />
                                            )}
                                            </Col>
                                            <Col span={8}>
                                            <Button size='large' disabled={disabled} onClick={this.getCode.bind(this)}>{text}</Button>
                                            </Col>
                                        </Row>
                                        </FormItem>
                                        <Button type='primary' size='large' style={{width:'50%'}} onClick={this.submit.bind(this)}>提交</Button>
                                    </Col>
                                </Row>
                            </Form>:null}
                            {step==2?<div className='is-bind'>
                                <p className='bind-title'>该手机号对应教师资料如下，是否绑定？</p>
                                <Avatar src={getImg(saveCode.pic)} />
                                <p style={{fontWeight:'bolder'}}>{saveCode&&saveCode.personName}</p>
                                <Button size='large' style={{marginRight:20}} onClick={this.cancel.bind(this)}>取消</Button>
                                <Button type='primary' size='large' onClick={this.bindCount.bind(this)}>绑定</Button>
                            </div>:null}
                            {step==3&&isShow?<div className='close-bind'>
                                <p className='bind-title'>当前绑定</p>
                                <Avatar src={getImg(teacherPic)} />
                                <p style={{fontWeight:'bolder'}}>{information&&information.teacherName}</p>
                                <Button size='large' type='primary' onClick={this.unbind.bind(this)}>解绑</Button>
                            </div>:null}
                        </div>
                    </TabPane>:null}
                </Tabs>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    information:state.user.information,
    saveCode:state.user.codeData
  }
}

export default connect(mapStateToProps)(Form.create()(EditInformation));
