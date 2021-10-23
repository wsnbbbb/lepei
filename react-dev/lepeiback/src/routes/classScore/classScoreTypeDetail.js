import React,{Component} from 'react';
import { connect } from 'dva';
import {Link,routerRedux} from "dva/router";
import { message,Button,Input,Switch,InputNumber, Select,Form,Col,Row,Icon,Radio,TreeSelect,Breadcrumb,Modal } from 'antd';
import { getQueryString } from '../../utils/public';
import './style.less';
import { stat } from 'fs';
import { log } from 'util';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
class ClassScoreTypeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            semesterId:'',
            visible: false ,
            typeVal:'',
            dataList: [],
            defaultFullScore: 0,
            title:"班级考评详情",
            title1:"添加班级考评",
        };
    }
    componentDidMount=()=>{
        const type=getQueryString('type');
        const id=getQueryString('id');
        this.props.dispatch({ //获取所有学期
            type:'user/getAllSemesters',
            callback:(res)=>{
                if(res.code===200){
                    res.data.length>0&&res.data.map(item=>{
                        if(item.isCurrent){
                            this.setState({semesterId:item.semesterId})
                        }
                    })
                }
            }
        })
        this.props.dispatch({ //获取上学期考评项
            type:'classScore/getTermTypes'
        })
        this.props.dispatch({ //获取所有学生
            type:'user/getPubStudents'
        })
        
        this.props.dispatch({ //获取教职工
            type:'user/getCommonPersonList',
            payload:{"personType":"2,3", "status": 1}
        })
        this.props.dispatch({ //获取指定学校的所有后台用户
            type:'user/getAllSchoolUser'
        })
        if(type==2&&id){
            this.props.dispatch({ //根据typeId获取考评项详情
                type:'classScore/getTypeDetail',
                payload:{"typeId":id},
                callback:(res)=>{
                    console.log("res",res);
                    if(res.code===200){
                        this.setState({
                            typeDetails: res.data,
                            dataList: res.data.secondTypes,
                            defaultFullScore: res.data.defaultFullScore
                        });
                        

                    }
                }
            })
        }

        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/class-score"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/class-score"
                },
              })
        }
    }
    showModal = () => {
        this.props.form.resetFields();
        this.setState({
          visible: true,
        });
    }
    
    handleOk = (e) => {
        if(!this.state.typeVal){
            message.warning("请选择考评项")
            return
        }
        this.props.dispatch({ //根据typeId获取考评项详情
            type:'classScore/getTypeDetail',
            payload:{"typeId":this.state.typeVal},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        visible: false,
                        typeDetails:res.data,
                        dataList: res.data.secondTypes
                    });
                }
            }
        })
    }
    addItem = () =>{
        let newData = this.state.dataList
        newData.push({
            typeName: "",
            totalStar: 1,
            totalScore: 0,
            proportion: 0
        })
        this.setState({
            dataList: newData
        })
    }
    removeItem = (index) =>{
        let oldData = this.state.dataList
        let newData = oldData.filter((item, index1)=>{
            return index !== index1
        })
        this.setState({
            dataList: newData
        })
    }
    onChange1 = (index, e) => {
        // console.log('changed', e.target.value, index);
        let newData = this.state.dataList
        newData[index].typeName = e.target.value
        this.setState({
            dataList: newData
        })
    }
    onChange2(index, value) {
        console.log('changed', value);
        let newData = this.state.dataList
        newData[index].totalStar = value
        this.setState({
            dataList: newData
        })
    }
    onChange3(index, e) {
        let newData = this.state.dataList
        newData[index].totalScore = e.target.value
        this.setState({
            dataList: newData
        })
    }
    onChange4(index, e) {
        let newData = this.state.dataList
        newData[index].proportion = e.target.value
        this.setState({
            dataList: newData
        })
    }
    onChange5(checked) {
        console.log(`switch to ${checked}`);
    }
      
    handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    }
    typeChange=(val)=>{
        this.setState({typeVal:val})
    }
    submit=()=>{

        const type=getQueryString('type');
        const id=getQueryString('id');
   
        this.props.form.validateFields((err, values) => {
            if(!err){
                let flag = true
                let allScore = 0
                this.state.dataList&&this.state.dataList.map(item=>{
                    if(!item.typeName){
                        flag = false
                    }
                    allScore += item.totalScore*item.proportion*0.01
                })
                if(!flag) {
                    message.warn('子项名称输入不完整')
                    return
                }
                if(this.state.dataList.length>0&&parseFloat(values.totalScore)!==allScore){
                    message.warn('子项分数之和与总分数不等，请检查')
                    return
                }
                let param = {
                    semesterId: values.semesterId,
                    typeName: values.typeName,
                    totalScore: values.totalScore,
                    totalStar: values.totalStar,
                    orderNum: values.orderNum,
                    defaultFullScore: values.defaultFullScore?1:0,
                    hasSecondTypes: this.state.dataList.length==0?0:1,
                    secondTypes: this.state.dataList,
                    padExaminers: values.padExaminers,
                    teacherExaminers: values.teacherExaminers,
                    studentExaminers: values.studentExaminers,
                    "typeId": type==1?"":id
                }
                this.props.dispatch({
                    type:type==1?'classScore/addClassScoreType':'classScore/updateClassScoreType',
                    // payload:type==1?{...values}:{"typeId":id,...values},
                    payload: param,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(type==1?'创建考评项成功':'更新考评项成功',2)
                            window.history.go(-1)
                            // this.props.dispatch(routerRedux.push("/class-score?key=3"))
                        }
                    }
                })
            }
            
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {dataList, defaultFullScore} = this.state
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayout1 = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        const type=getQueryString('type');
        const {allTerms,termTypes,pubStudents,commonPersonData,allSchoolUsers} = this.props;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })
        let typeChild=[]
        termTypes&&termTypes.length>0&&termTypes.map(item=>{
            typeChild.push(<Option key={item.typeId}>{item.typeName}</Option>)
        })
        let studentChild=[]
        pubStudents&&pubStudents.length>0&&pubStudents.map(item=>{
            studentChild.push(<Option key={item.personId}>{item.personName+'('+item.className+')'}</Option>)
        })
        let staffChild=[]
        commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item=>{
            staffChild.push(<Option key={item.personId}>{item.personName}</Option>)
        })
        let schoolUserChild=[]
        allSchoolUsers&&allSchoolUsers.length>0&&allSchoolUsers.map(item=>{
            schoolUserChild.push(<Option key={item.userId}>{item.userName}</Option>)
        })
        const {semesterId,typeDetails} = this.state
        return (
            <div className='detail-main'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/class-score?key=3">班级考评</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{type==1?"添加班级考评":"班级考评详情"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <div className="content-main information" style={{width:'100%'}}>
                    <Form className="ant-advanced-search-form content-form teacher-form" style={{width:'100%'}}>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='学期'>
                                {getFieldDecorator('semesterId',{initialValue:semesterId,rules:[{required:true,message:"请选择学业阶段"}]})(
                                    <Select disabled={type!=1}>
                                        {termChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={5} offset={2}>
                                <FormItem {...formItemLayout1} label={'考评项'}>
                                {getFieldDecorator("typeName",{initialValue:typeDetails&&typeDetails.typeName||'',rules:[{required:true,message:"请输入考评项"}]})(
                                    <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem {...formItemLayout1} label={'五星数量'}>
                                {getFieldDecorator("totalStar",{initialValue: typeDetails&&typeDetails.totalStar||0,rules:[{required:true,message:"请选择"}]})(
                                    <InputNumber disabled={typeDetails&&typeDetails.hasScore&&type==2} min={0} max={10} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem {...formItemLayout1} label={'考评项总分'}>
                                {getFieldDecorator("totalScore",{initialValue: typeDetails&&typeDetails.totalScore||0,rules:[{required:true,message:"请输入"}]})(
                                    <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} />
                                )}
                                </FormItem>
                            </Col>
                            {
                                typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={3} style={{marginTop:8}} ><a href='javascript:;' onClick={this.showModal}>上学期考评项</a></Col> 
                            }
                            {
                                typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={3} style={{marginTop:8}} ><a href='javascript:;' onClick={this.addItem}>添加二级考评项</a></Col>     
                            }
                            
                        </Row>
                        {
                            dataList&&dataList.map((item, index) =>{
                               return <Row gutter={24} key={index}>
                                        <Col span={5} offset={2}>
                                            <FormItem {...formItemLayout1} label={'子项名称'}>
                                                <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} value={item.typeName} onChange={this.onChange1.bind(this, index)} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'五星数量'}>
                                                <InputNumber disabled={typeDetails&&typeDetails.hasScore&&type==2} value={item.totalStar} onChange={this.onChange2.bind(this, index)} min={0} max={10} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'子项分数'}>
                                                <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} value={item.totalScore} onChange={this.onChange3.bind(this, index)} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'占比'}>
                                                <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} suffix="%" value={item.proportion} onChange={this.onChange4.bind(this, index)} />
                                            </FormItem>
                                        </Col>
                                        {
                                             typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={2} style={{marginTop:8}} ><a href='javascript:;' onClick={this.removeItem.bind(this, index)}>删除</a></Col> 
                                        }
                                            
                                    </Row>
                            })
                        }
                       
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='默认满分'>
                                    {getFieldDecorator('defaultFullScore', { initialValue: defaultFullScore==1, valuePropName: 'checked' })(<Switch />)}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='排序'>
                                {getFieldDecorator('orderNum',{initialValue:typeDetails&&typeDetails.orderNum||''})(
                                    <Input clear='true'/>
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='pad考评人'>
                                {getFieldDecorator('padExaminers',{initialValue:typeDetails&&typeDetails.padExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {schoolUserChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='APP教师/员工考评人'>
                                {getFieldDecorator('teacherExaminers',{initialValue:typeDetails&&typeDetails.teacherExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {staffChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='APP学生考评人'>
                                {getFieldDecorator('studentExaminers',{initialValue:typeDetails&&typeDetails.studentExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {studentChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row style={{marginTop:20}}>
                            <Col span={2} offset={10}>
                                <Button ><Link to='/class-score?key=3'>返回</Link></Button>
                            </Col>
                            <Col span={2} offset={0}>
                                <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                            </Col>
                        </Row>
                    </Form> 
                </div>
                <Modal
                    title="选择考评项"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Select onChange={this.typeChange} style={{width:'60%',marginLeft:'20%'}} placeholder='请选择'>
                        {typeChild}
                    </Select>
                </Modal>
            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    termTypes:state.classScore.termTypes,
    pubStudents:state.user.pubStudents,
    commonPersonData:state.user.commonPersonData,
    allSchoolUsers:state.user.allSchoolUsers
  }
}

export default connect(mapStateToProps)(Form.create()(ClassScoreTypeDetail));
