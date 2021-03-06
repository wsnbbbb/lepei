import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Upload,message,Button,Input,Select,Form,Row,Col,Icon,DatePicker,Radio,TreeSelect,Breadcrumb} from 'antd';
import BottomBtns from '../../components/bottom-btns';
import StepIndex from '../../components/steps';
import AddSelect from '../../components/addSelect';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import md5 from 'md5';
import {getQueryString,onlyDate,isBlank} from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
class AccountDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            formLayout: "",
            userName: "",
            showChangePwd: 0,
            deleteBind: true,
            phone: "",
            status: "",
            password: "",
            checkPassword: ""
        };
    }
    componentDidMount=()=>{
        const type=getQueryString('type');
        
      this.accountDetail();
    }

    accountDetail = () => {
        this.props.dispatch({
            type:'setting/accountDetail',
            payload:{
                "userId": this.props.match.params.userId,
            },
            callback:(res)=>{
                this.props.form.setFieldsValue({
                    "userName": res.data.userName,
                    "realName": res.data.realName,
                })
                this.setState({
                    status: res.data.status.toString()
                })
                if(res.data.phone){
                    this.setState({
                        deleteBind: false,
                        phone: res.data.phone,
                        userName: res.data.userName,
                    })
                }

            }
        })
    }
    
    update = () => {
        this.props.form.validateFields((err, values) => {
            // if(!password||!endDate){
            //   return message.error('???????????????',2)
            // }
            values.password;
            values.checkPassword;
            if(!err){
              this.props.dispatch({
                type:'setting/updateAccount',
                payload:{
                  "userId": this.props.match.params.userId,
                  "realName": values.realName,
                  "status": this.state.status,
                  "isChangePwd": this.state.showChangePwd,
                  "password": this.state.showChangePwd==1?md5(values.password):"",
                  "checkPassword": this.state.showChangePwd==1?md5(values.checkPassword):"",
                  "isUnbind": this.state.deleteBind?1:0
                },
                callback:(res)=>{
                  if(res.code===200){
                    message.success('???????????????',3)
                    setTimeout(() => {
                        window.history.go(-1)
                    }, 2000);
                  }
                }
              })
            }
        })
    }

    deleteBind = (e) =>{
        this.setState({
            deleteBind: true,
        })
    }
    handleFormLayoutChange = (e) => {
        this.setState({ status: e.target.value });
    }
    handleChangePwd = (e) => {
        this.setState({ showChangePwd: e.target.value });
    }
    cancel= (e) => {
        this.props.dispatch(
            routerRedux.push("/account-manage")
        )
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/account-manage">??????????????????</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>??????????????????</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <h3 className='detail-title'>????????????</h3>
                <div className="content-main information">
                    <Form.Item {...formItemLayout} label="?????????">
                        {getFieldDecorator('userName', {
                            rules: [{
                            required: true,
                            message: '',
                            }],
                        })(
                            <Input disabled/>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="?????????">
                        {getFieldDecorator('realName', {
                         
                        })(
                            <Input placeholder="????????????????????????" />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        {...formItemLayout}
                    >
                        <RadioGroup value={this.state.status} onChange={this.handleFormLayoutChange}>
                            <Radio.Button value="1">??????</Radio.Button>
                            <Radio.Button value="2">??????</Radio.Button>
                        </RadioGroup>
                    </Form.Item>
                    <Form.Item
                        label="??????????????????"
                        {...formItemLayout}
                    >
                        <Radio.Group defaultValue="0" onChange={this.handleChangePwd}>
                            <Radio.Button value="1">???</Radio.Button>
                            <Radio.Button value="0">???</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {this.state.showChangePwd==1?
                    <div><Form.Item {...formItemLayout} label="?????????" >
                        {getFieldDecorator('password', {
                            rules: [{
                            required: true,
                            message: '???????????????',
                            }],
                        })(
                            <Input.Password placeholder="???????????????" />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="????????????">
                        {getFieldDecorator('checkPassword', {
                            rules: [{
                            required: true,
                            message: '?????????????????????',
                            }],
                        })(
                            <Input.Password placeholder="?????????????????????" />
                        )}
                    </Form.Item></div> : ""

                    }
                    <Form.Item {...formItemLayout} label="????????????">
                      {
                          this.state.deleteBind?"???":
                            <div className="bind-box">
                                    <Icon type="close-circle" className="del-btn" onClick={this.deleteBind.bind(this)} />
                                    <img src={require('../../assets/bg1.png')}/>
                                    <p className="bind-name">{this.state.userName}</p>
                                    <p>{this.state.phone}</p>
                            </div>
                      }
                    </Form.Item>
                </div>
                <div className="btn-box">
                    <Button className="btn-cancel" onClick={this.cancel.bind(this)}>??????</Button>
                    <Button className="btn-submit" onClick={this.update.bind(this)} type="primary">??????</Button>
                </div>
            </div>
        )
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    
  }
}

export default connect(mapStateToProps)(Form.create()(AccountDetail));
