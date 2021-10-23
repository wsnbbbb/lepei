import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col, Input,Button,message,Modal } from 'antd';
import { getQueryString,numFun } from '../../utils/public';
import {Link,routerRedux} from 'dva/router';
import './style.less';


const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            title:'成绩详情'
        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id');
        this.getScoreDetail(id)
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/score-manage"
            },
          })
    }
    componentWillUnmount = () => {
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })    
    }
    getScoreDetail=(scoreId)=>{
        this.props.dispatch({
            type:"studentScore/getScoreDetail",
            payload:{"scoreId":scoreId},
        })
    }
    submit=()=>{
        const scoreId=getQueryString('id');
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.dispatch({
                    type:"studentScore/updateScoreTitle",
                    payload:{"scoreId": scoreId, "title": values.title},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("修改成功",2)
                            window.history.go(-1)
                        }
                    }
                })
            }
        })
    }
    // 删除
    showConfirm=(personCode)=> {
        let me=this;
        const scoreId=getQueryString('id');
        confirm({
          title: '提示',
          content: '确定要删除这个人的成绩吗？',
          onOk() {
            me.props.dispatch({
              type:'studentScore/delPersonScore',
              payload:{
                "scoreId": scoreId,
                "personCode":personCode
              },
              callback:(res)=>{
                if(res.code===200){
                    message.success('删除成功！',3)
                    me.getScoreDetail(scoreId)
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
    showDataModal=(items,data,index)=>{
        console.log(items,data,index)
        const {salaryDetail} = this.props;
        let tdName;
        salaryDetail&&salaryDetail.items.map(t=>{
            if(t.itemId===index){
                tdName=t.itemName
            }
        })
        this.setState({visible:true,personName:items.personName,idCardNo:items.personCode,personId:items.personId,tdData:data,type:2,tdName:tdName,itemId:index})
    }
    handleOk=()=>{
        let _this = this
        const {personId,type,itemId} = this.state;
        const scoreId=getQueryString('id');
        this.props.form.validateFields((err, values) => {
            // if((values.data>=1000000||values.data<=-1000000)&&type==2){
            //     return message.error("成绩不能超过1000000",2)
            // }
            if(!err){
                const params={
                    "scoreId": scoreId,
                    "personCode": values.personCode,
                    "itemId": _this.state.itemId,
                    "itemVal":values.data
                }
                this.props.dispatch({
                    type:"studentScore/updateItemScore",
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("修改成功",2)
                            this.props.form.resetFields();
                            this.setState({visible:false})
                            this.getScoreDetail(getQueryString('id'))
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
        salaryDetail.items.map((t,n)=>{
            ths.push(<th>{t.itemName}</th>)
            idx.push(t.itemId)
        })
        salaryDetail.persons.map((p,i)=>{
            let tds=[];
            idx.map((k, index)=>{
                // console.log(k)
                tds.push(<td className="can-edit" onDoubleClick={this.showDataModal.bind(this,p,p.scores[index].itemVal,p.scores[index].itemId)}>{p.scores[index].itemVal}</td>)
            })
            tbodys.push(
                <tr>
                    <td>{p.personCode}</td>
                    <td>{p.personName}</td>
                    {tds}
                    <td><a href="javascript:;" onClick={this.showConfirm.bind(this,p.personCode)}>删除</a></td>
                </tr>
            )
        })
        return (
            <div className="salary-detail">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/score-manage">新生成绩管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>成绩详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <div className="content-main">
                    <Form className="ant-advanced-search-form">
                        <Row gutter={24}>
                            <Col span={10}>
                                <FormItem {...formItemLayout} label={'名称'}>
                                {getFieldDecorator("title",{initialValue:salaryDetail.title||'',rules:[{required:true,message:'请输入名称',whitespace: true}]})(
                                    <Input maxLength="20" />
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>  
  
                    <table border="1" className="salary-detail-table">
                        <thead>
                            <tr>
                                <th>考号</th><th>姓名</th>{ths}<th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbodys}
                        </tbody>
                    </table>
                    <div className="salary-detail-btns">
                        <Link to='/score-manage'><Button style={{marginRight:16}}>返回</Button></Link>
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
                            <FormItem {...formItemLayout} label={'考号'}>
                                {getFieldDecorator("personCode",{initialValue:idCardNo||''})(
                                <Input disabled={true}/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={tdName}>
                                {getFieldDecorator("data",{initialValue:tdData,rules: [{
                                    max: 20,
                                    message:"最大长度为20"
                                }]})(
                                <Input placeholder='请输入'/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
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
    salaryDetail:state.studentScore.salaryDetail
  }
}

export default connect(mapStateToProps)(Form.create()(ScoreDetail));
