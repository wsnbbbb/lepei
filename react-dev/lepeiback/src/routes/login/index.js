import React,{Component} from 'react';
import { connect } from 'dva';
import { Button,Form,Tabs,Icon, Input,Row,Col,Popover,Avatar, Select } from 'antd';
import md5 from 'md5';
import qs from 'qs'
import {getImg} from '../../utils/img';
import {getQueryString} from '../../utils/public';
import Logo from '../../assets/logo.png';
import Warn from '../../assets/warn.png';
import './style.less';
import { log } from 'util';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

class LoginPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            key:'1',
            show:true,
            showSelect:false,
            showLogin:false
        };
    }
    componentDidMount=()=>{
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("schoolId");
        localStorage.removeItem("logo")
        const schoolId=localStorage.getItem('schoolId');
        const code = getQueryString("code")
        sessionStorage.setItem("authFrom",getQueryString("authFrom"))
        if(code){
            let params = {"code":code}
            this.jumpLogin(params)
        }
        if(schoolId){
            this.getSchoolDetail(schoolId)
            this.setState({show:false,showLogin:true})
        }
        this.props.dispatch({
            type:'user/getAllSchool'
        })
    }
    jumpLogin = (params)=>{
        this.props.dispatch({
            type:'user/jumpLogin',
            payload:params,
            callback:(res)=>{
                if(res&&res.code===200){
                    sessionStorage.setItem("token",res.data.token)
                    sessionStorage.setItem("userType",res.data.userType)
                    sessionStorage.setItem("userId",res.data.userId)
                    sessionStorage.setItem("schoolId",res.data.schoolId)
                    sessionStorage.setItem("menu",JSON.stringify(res.data.menu))
                    this.props.history.push('/')
                }
            }
        })
    }
    getSchoolDetail=(val)=>{
        this.props.dispatch({
            type:'user/getSchoolDetail',
            payload:{"schoolId":val}
        })
        
    }
    changeTab=(key)=> {
        this.setState({key})
        this.props.form.resetFields();
    }
    submit=(e)=>{
        e.preventDefault();
        const schoolId=localStorage.getItem('schoolId');
        localStorage.setItem("logo", this.props.schoolInfo.logo)
        localStorage.setItem("schoolName", this.props.schoolInfo.schoolName)
        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type:'user/login',
                    payload: {
                        "username":values.username,
                        "password":md5(values.password),
                        "type":this.state.key==='1'?2:3,
                        "schoolId":schoolId
                    },
                    callback:(res)=>{
                        if(res&&res.code===200){
                            sessionStorage.setItem("token",res.data.token)
                            sessionStorage.setItem("userType",res.data.userType)
                            sessionStorage.setItem("userId",res.data.userId)
                            sessionStorage.setItem("schoolId",res.data.schoolId)
                            sessionStorage.setItem("menu",JSON.stringify(res.data.menu))
                            this.props.history.push('/')
                        }
                    }
                })
            }
        });
    }
    selectSchool=()=>{
        this.setState({show:false,showSelect:true})
    }
    selectChange=(val)=>{
        console.log(val)
        this.setState({showLogin:true,showSelect:false})
        localStorage.setItem("schoolId",val)
        this.getSchoolDetail(val)
    }
    changeSchool=()=>{
        this.setState({showLogin:false,showSelect:true})
    }
    render(){
        const {schoolInfo,allSchools} = this.props;
        const {key,show,showSelect,showLogin} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        };
        const content=(
            <p>{key==='1'?"???????????????????????????":"??????????????????????????????????????????"}</p>
        )
        const msg=key==='1'?'??????????????????':'?????????????????????'
        let renderContent;
        renderContent=
            <Form className="login-form" onSubmit={this.submit.bind(this)} >
                <Row gutter={24}>
                    <Col span={22} offset={1}>
                        <FormItem {...formItemLayout} label=''>
                        {getFieldDecorator('username',{initialValue:'',rules:[{required:true, message:msg,whitespace: true}]})(
                            <Input size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={key==='1'?"??????????????????":"??????????????????"} />
                        )}
                        </FormItem>
                    </Col> 
                    <Col span={22} offset={1}>
                        <FormItem {...formItemLayout} label={''}>
                        {getFieldDecorator("password",{initialValue:'',rules:[{required:true, message:'??????????????????',whitespace: true}]})(
                           <Input type='password' size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="???????????????" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
            
            <Popover placement="bottom" content={content} arrowPointAtCenter>
                <div className='forget-psd'>????????????</div>
            </Popover>
            <Col span={22} offset={1}><Button size='large' type='primary' htmlType="submit" style={{width:'100%',marginTop:30}} onClick={this.submit.bind(this)}>??????</Button></Col>
            <p style={{marginTop:'32%',padding:'0 20px'}}>{key==='2'?'*?????????????????????????????????':''}</p>
        </Form>
        let child=[];
        allSchools&&allSchools.map(item=>{
            child.push(
                <Option key={item.schoolId}>{item.schoolName}</Option>
            )
        })
        return (
            <div className="login">
                {show?<div className='login-mask'>
                    <img src={Warn}/> 
                    <p>???????????????????????????</p>
                    <Button type="primary" onClick={this.selectSchool}>????????????</Button>
                </div>:null}

                {showSelect?<span className="select-box">
                    <div className="bg-mask"></div>
                    <div className="bg-mask-back"></div>
                    <div className='login-top'>
                        <Avatar src={Logo}/>
                        <p className="login-title">??????????????????????????????</p>
                        <Select notFoundContent='???????????????' className="school-select" showSearch optionFilterProp="children" placeholder="?????????????????????" onChange={this.selectChange}>
                            {child}
                        </Select>
                    </div>
                </span>:null}

                {showLogin?<span className="login-box">
                    <div className="bg-mask"></div>
                    <div className="bg-mask-back"></div>
                    <div className="login-main">
                        <p className='change-school' onClick={this.changeSchool}>????????????</p>
                        <Avatar src={getImg(schoolInfo.logo)}/>
                        <p className='login-name'>{schoolInfo.schoolName}</p>
                        <p className="login-title">??????????????????????????????</p>
                        <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                            <TabPane tab="??????????????????" key="1">
                                {renderContent}
                            </TabPane>
                            <TabPane tab="???????????????" key="2">
                                {renderContent}
                            </TabPane>
                        </Tabs>
                    </div>
                </span>:null}
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };

const mapStateToProps = (state) => {
  return {
     schoolInfo:state.user,
     allSchools:state.user.allSchools
  }
}

export default connect(mapStateToProps)(Form.create()(LoginPage));
