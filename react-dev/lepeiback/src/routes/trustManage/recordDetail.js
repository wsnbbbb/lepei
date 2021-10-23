import React,{Component} from 'react';
import { routerRedux, Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Modal, InputNumber,Checkbox, DatePicker,TimePicker ,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import moment from 'moment';
import {isBlank, dateToTimestamp, formatDate, getQueryString} from '../../utils/public';
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


const defaultCheckedList = [{ label: '111', value: '1' },{ label: '222', value: '2' },];

class RecordDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title:'详情',
            name: '',
            gradeName: '',
            className: '',
            sex: '',
            phone: '',
            enrolStatus: '',
            fee: '',
            channel: '',
            payTime: '',
            refundTime: '',
            reason: '',
            orderNo:''
        }
    }

    componentDidMount=()=>{
        this.recordDetail()
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/trust-manage"
            },
        })
    }
    componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	}
    recordDetail = () =>{
        const params = {
            "trustId": getQueryString('trustId'),
            "studentId": getQueryString('studentId'),
        }
        this.props.dispatch({
          type:'trustManage/recordDetail',
          payload: params,
          callback: (res)=>{
            if(res.code === 200){
                this.setState({
                    name: res.data.personName,
                    gradeName: res.data.gradeName,
                    className: res.data.className,
                    sex: res.data.sex,
                    phone: res.data.phone,
                    enrolStatus: res.data.enrolStatus,
                    fee: res.data.fee,
                    channel: res.data.channel,
                    payTime: res.data.payTime,
                    refundTime: res.data.refundTime,
                    reason: res.data.reason,
                    orderNo: res.data.orderNo,
                })
            }  
          }
        })
    }
   
    closeWindow=()=>{
        // window.history.go(-1)
        window.close();
    }
   
    generateSex=(sex)=>{
        if(sex==1){
            return "男"
        }else if(sex==2){
            return "女"
        }
    }

    generateChannel=(channel)=>{
        if(channel==1){
            return "微信"
        }else if(channel==2){
            return "支付宝"
        }
    }

    generateEnrolStatus=(EnrolStatus)=>{
        if(EnrolStatus==1){
            return "已支付"
        }else if(EnrolStatus==2){
            return "已退款"
        }
    }
    
    

    render(){
     
     
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.placeDel}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.placeDel}>删除</a>
                </Menu.Item>
            </Menu>
          );

        return (

            <div className="content-main record-detail content-building content-termManage content-trust">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/trust-manage"}>报名统计</Link> \ 详情</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Row className="trust-row">
                        <label>学生姓名</label> <span className="trust-row-span">{this.state.name}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>年级班级</label> <span className="trust-row-span">{this.state.gradeName}{this.state.className}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>学生性别</label> <span className="trust-row-span">{this.generateSex(this.state.sex)}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>家长电话</label> <span className="trust-row-span">{this.state.phone}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <span className="trust-row-span">{this.generateEnrolStatus(this.state.enrolStatus)}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>金额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <span className="trust-row-span">{this.state.fee}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>支付方式</label> <span className="trust-row-span">{this.generateChannel(this.state.channel)}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>支付时间</label> <span className="trust-row-span">{formatDate(this.state.payTime)}</span>
                    </Row>
                    <Row className="trust-row">
                        <label>订单编号</label> <span className="trust-row-span">{this.state.orderNo}</span>
                    </Row>
                    {
                      this.state.enrolStatus==2?<span>
                        <Row className="trust-row">
                            <label>退款时间</label> <span className="trust-row-span">{formatDate(this.state.refundTime)}</span>
                        </Row>
                        <Row className="trust-row">
                            <label>退款说明</label> <span className="trust-row-span">{this.state.reason}</span>
                        </Row>
                      </span>:""
                    }

                <div className="btn-group">
                  <Row>
                    <Button onClick={this.closeWindow.bind(this)}>关闭</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  </Row>
                </div>
                   
                </div>
               
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // teacherList: state.trustManage.teacherList
  }
}

export default connect(mapStateToProps)(Form.create()(RecordDetail));
