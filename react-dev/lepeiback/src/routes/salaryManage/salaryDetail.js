import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col, Input,Button,message,Modal } from 'antd';
import { getQueryString,numFun } from '../../utils/public';
import {Link,routerRedux} from 'dva/router';
import './style.less';


const FormItem = Form.Item;
const confirm = Modal.confirm;

class SalaryDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
			title:"工资条详情",

        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id');
        this.getSalaryDetail(id)
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/salary-manage"
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
    getSalaryDetail=(salaryId)=>{
        this.props.dispatch({
            type:"salary/getSalaryDetail",
            payload:{"salaryId":salaryId},
        })
    }
    submit=()=>{
        const salaryId=getQueryString('id');
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.dispatch({
                    type:"salary/updateSalaryTitle",
                    payload:{"salaryId":salaryId,"title":values.title},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("修改成功",2)
                            this.props.dispatch(routerRedux.push("/salary-manage"))
                        }
                    }
                })
            }
        })
    }
    // 删除
    showConfirm=(personId)=> {
        let me=this;
        const salaryId=getQueryString('id');
        confirm({
          title: '提示',
          content: '确定要删除这个人工资条吗？',
          onOk() {
            me.props.dispatch({
              type:'salary/delPersonSalary',
              payload:{
                "salaryId":salaryId,"personId":personId
              },
              callback:(res)=>{
                if(res.code===200){
                    message.success('删除成功！',3)
                    me.getSalaryDetail(salaryId)
                }
              }
            })
          },
          onCancel() {},
        });
    }
    showModal=(item)=>{
        console.log(item)
        this.setState({visible:true,personName:item.name,idCardNo:item.idCardNo,personId:item.personId,remark:item.remark,type:1})
    }
    showDataModal=(item,data,index)=>{
        console.log(item,data,index)
        const {salaryDetail} = this.props;
        let tdName;
        salaryDetail&&salaryDetail.item.map(t=>{
            if(t.id===index){
                tdName=t.name
            }
        })
        this.setState({visible:true,personName:item.name,idCardNo:item.idCardNo,personId:item.personId,tdData:data,type:2,tdName:tdName,itemId:index})
    }
    handleOk=()=>{
        const {personId,type,itemId} = this.state;
        const salaryId=getQueryString('id');
        this.props.form.validateFields((err, values) => {
            if((values.data>=1000000||values.data<=-1000000)&&type==2){
                return message.error("金额不能超过1000000",2)
            }
            if(!err){
                const params=type===1?{
                    "salaryId":salaryId,"personId":personId,"remark":values.data
                }:{
                    "salaryId":salaryId,"personId":personId,"itemId":itemId,"money":values.data
                }
                this.props.dispatch({
                    type:type===1?"salary/updateSalaryRemark":"salary/updateSalaryItem",
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("修改成功",2)
                            this.props.form.resetFields();
                            this.setState({visible:false})
                            this.getSalaryDetail(salaryId)
                        }
                    }
                }) 
            }
        })
        
    }
    handleCancel=()=>{
        this.props.form.resetFields();
        this.setState({visible:false,personName:"",idCardNo:"",personId:"",remark:"",tdData:"",tdName:"",itemId:""})
    }
    render(){
        const {salaryDetail} = this.props;
        console.log(salaryDetail)
        if(!salaryDetail){
            return null;
        }
        const {personName,personId,idCardNo,remark,tdData,type,tdName} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:4 },
            wrapperCol: { span: 15 }
        };
        let ths=[];
        let tbodys=[];
        let idx=[];
        salaryDetail.item.map((t,n)=>{
            ths.push(<th>{t.name}</th>)
            idx.push(t.id)
        })
        salaryDetail.person.map((p,i)=>{
            let tds=[];
            idx.map(k=>{
                tds.push(<td className="can-edit" onDoubleClick={this.showDataModal.bind(this,p,p.item[k],k)}>{p.item[k]}</td>)
            })
            tbodys.push(
                <tr>
                    <td>{p.name}</td><td>{p.idCardNo}</td>{tds}
                    <td>{p.payMoney}</td><td>{p.deductMoney}</td><td>{p.realMoney}</td>
                    <td className="can-edit" style={{textAlign:'left'}} onDoubleClick={this.showModal.bind(this,p)}>{p.remark}</td>
                    <td><a href="javascript:;" onClick={this.showConfirm.bind(this,p.personId)}>删除</a></td>
                </tr>
            )
        })
        return (
            <div className="salary-detail">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>工资条</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/salary-manage">工资条管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>工资条详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <div className="content-main">
                    <Form className="ant-advanced-search-form">
                        <Row gutter={24}>
                            <Col span={10}>
                                <FormItem {...formItemLayout} label={'名称'}>
                                {getFieldDecorator("title",{initialValue:salaryDetail.salaryName||'',rules:[{required:true,message:'请输入名称',whitespace: true}]})(
                                    <Input maxLength="20" />
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>  
                    <p style={{marginLeft:20}}><span className="tip-title">总人数：</span>{salaryDetail.personNum}人&emsp;&emsp;<span className="tip-title">应发总额：</span>￥{numFun(salaryDetail.payMoney)}&emsp;&emsp;
                    <span className="tip-title">应扣总额：</span>{numFun(salaryDetail.deductMoney)}&emsp;&emsp;<span className="tip-title">实发总额：</span>￥{numFun(salaryDetail.realMoney)}</p>
                    <table border="1" className="salary-detail-table">
                        <thead>
                            <tr>
                                <th>姓名</th><th>证件号</th>{ths}<th>应发小计</th><th>应扣小计</th><th>实发合计</th><th>备注</th><th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbodys}
                        </tbody>
                    </table>
                    <div className="salary-detail-btns">
                        <Link to='/salary-manage'><Button style={{marginRight:16}}>返回</Button></Link>
                        <Button type='primary' onClick={this.submit.bind(this)}>保存</Button>
                    </div>
                </div>
                <Modal
                    title="修改数据"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form">
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'姓名'}>
                                {getFieldDecorator("name",{initialValue:personName||''})(
                                <Input disabled={true}/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'证件号'}>
                                {getFieldDecorator("idCard",{initialValue:idCardNo||''})(
                                <Input disabled={true}/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                        {type===1?<Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={"备注"}>
                                {getFieldDecorator("data",{initialValue:remark})(
                                <Input placeholder='请输入'/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>:
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={tdName}>
                                {getFieldDecorator("data",{initialValue:tdData,rules: [{
                                    pattern:/^-?\d+(\.\d{1,2})?$/,message:"输入只能为数字，且最多保留两位小数，可为负数"
                                }]})(
                                <Input placeholder='请输入'/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>}
                    </Form>    
                </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    salaryDetail:state.salary.salaryDetail
  }
}

export default connect(mapStateToProps)(Form.create()(SalaryDetail));
