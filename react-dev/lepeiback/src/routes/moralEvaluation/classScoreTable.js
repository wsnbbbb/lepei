import React,{Component} from 'react';
import { connect } from 'dva';
import {Link,routerRedux} from "dva/router";
import { Button,Input,Select,Form,Col,Row,DatePicker,Modal,message } from 'antd';
import {getDays,getAllDays} from '../../utils/public';
import {getImg} from '../../utils/img';
import moment from 'moment';
import './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;
    
class ClassScoreTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false ,
            classDisabled:true,
            classValue:'',
            ths:[],
            thData:[]
        }
    }
    componentDidMount=()=>{
        this.props.dispatch({ //获取所有学期
            type:'user/getAllSemesters',
        })
        this.props.dispatch({ //获取所有年级
            type:'user/getCommonGradeList',
        })
        this.props.dispatch({ //获取所有考评项
            type:'classScore/getClassScoreType',
        })
       
    }
    gradeChange=(val)=>{
        if(val){
          this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":val},
            callback:(res)=>{
              if(res.code===200){
                this.setState({classValue:'',classDisabled:false})
              }
            }
          })
        }else{
          this.setState({classValue:'',classDisabled:true})
        }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    showModal = (classId,typeId,date) => {
        this.setState({classId,typeId,date})
        this.props.dispatch({
            type:'classScore/getSingleClassScore',
            payload:{
                "classId":classId,"typeId":typeId,"date":date
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        visible: true,
                    });
                }
            }
        })
    }
    
    handleOk = (e) => {
        const {classId,typeId,date} = this.state;
        this.props.form.validateFields((err, values) => {
            if(!values.score){
                return message.error("请填分数",2)
            }
            this.props.dispatch({
                type:'classScore/setSingleClassScore',
                payload:{
                    "classId":classId,"typeId":typeId,"date":date,
                    "score":values.score,"remark":values.remark
                },
                callback:(res)=>{
                    if(res.code===200){
                        message.success("设置成功",2)
                        const params={
                            "semesterId":values.semesterId,
                            "gradeId":values.gradeId,
                            "classId":this.state.classValue,
                            "typeId":values.typeId,
                            "startDate":this.state.startDate,
                            "endDate":this.state.endDate
                        }
                        this.getClassScoreDetail(params)
                        this.setState({visible:false})
                        this.props.form.resetFields(["score","remark"]);
                    }
                }
            })
        })
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields(["score","remark"]);
        this.setState({
          visible: false,
        });
    }
    onTimeChange=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startDate:start,
          endDate:end
        })
        Date.prototype.format=function (){
            var s='';
            s+=this.getFullYear()+'-';          // 获取年份。
            s+=(this.getMonth()+1)+"-";         // 获取月份。
            s+= this.getDate();                 // 获取日。
            return(s);                          // 返回日期。
        };
        const dateData=getAllDays(start,end)
        console.log(dateData)
        let data=[]
        dateData&&dateData.map(item=>{
            let year = new Date(item).getFullYear();
            let month = new Date(item).getMonth().toString().length === 1 ? "0" + (parseInt(new Date(item).getMonth().toString(),10) + 1) : (new Date(item).getMonth() + 1);
            let day = new Date(item).getDate().toString().length === 1 ? "0" + new Date(item).getDate() : new Date(item).getDate();
            data.push({
                "date":year + "-" + month + "-" + day,"week":new Date(item).getDay()
            })
        })
        this.setState({ths:data})
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(values)
            const params={
                "semesterId":values.semesterId,
                "gradeId":values.gradeId,
                "classId":this.state.classValue,
                "typeId":values.typeId,
                "startDate":this.state.startDate,
                "endDate":this.state.endDate
            }
            this.getClassScoreDetail(params)
            this.setState({thData:this.state.ths})
        })
    }
    getClassScoreDetail=(params)=>{
        this.props.dispatch({
            type:'classScore/getClassScoreDetail',
            payload:params
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const {allTerms,classScoreType,commonGradeData,classNameData,classScoreDetails,singleClassScore} = this.props;
        console.log(singleClassScore)
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })
        let typeChild=[]
        classScoreType&&classScoreType.dataList.length>0&&classScoreType.dataList.map(item=>{
            typeChild.push(<Option key={item.typeId} value={item.typeId}>{item.typeName}</Option>)
        })
        let gradeChild=[]
        commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
            gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
        })
        let classChild=[]
        classNameData&&classNameData.length>0&&classNameData.map(item=>{
            classChild.push(<Option key={item.classId}>{item.className}</Option>)
        })
        const {classDisabled,classValue,thData} = this.state;
        let allDatas={}
        if(classScoreDetails){
            classScoreDetails.classData.map((item)=>
                item.classes.map((cls,ind)=>{
                    cls.recordsList.map((r,k)=>{
                        let scores=[]
                        thData.map((t,d)=>{
                            if(String(r.date)==String(t.date)){
                                scores.push(r.score)
                            }else{
                                scores.push("--")
                            }
                            r.tdlist=[r.typeName,...scores]
                        })
                    })
                    
                })
            )
            allDatas=classScoreDetails
        }
        console.log(allDatas,thData)
        return (
            <div className='socre-main content-main'>
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='学期'>
                            {getFieldDecorator('semesterId',{initialValue:''})(
                                <Select placeholder='请选择'>
                                    {termChild}
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={'年级'}>
                            {getFieldDecorator("gradeId",{initialValue:''})(
                                <Select showSearch onChange={this.gradeChange} optionFilterProp="children">
                                    <Option value='' key=''>全部</Option>
                                    {gradeChild}
                                </Select>
                            )}
                            </FormItem>
                        </Col>  
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={'班级'} optionFilterProp="children">
                                <Select showSearch value={classValue} onChange={this.classChange} disabled={classDisabled}>
                                <Option value='' key=''>全部</Option>
                                {classChild}
                                </Select>
                            </FormItem>
                        </Col> 
                                                                                                                                                                                                                                                                                                                                                                                                        
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='考评项'>
                            {getFieldDecorator('typeId',{initialValue:[]})(
                                <Select placeholder='请选择'>
                                    <Option key='' value=''>全部</Option>
                                    {typeChild}
                                </Select>
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='时间'>
                            {getFieldDecorator('time',{initialValue:''})(
                                <RangePicker onChange={this.onTimeChange} />
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={2} offset={2}>
                            <Button type='primary' onClick={this.submit}>查询</Button>
                        </Col>
                        <Col span={2} offset={0}>
                            <Button type='primary'>导出</Button>
                        </Col>
                    </Row>
                </Form> 
                <table border="1" className="class-score-table" style={{margin:'0 auto'}}>
                    <thead>
                        <tr>
                            <th>年级</th><th>班级</th><th>考评项</th>
                            {
                                thData.length>0&&thData.map((item,i)=>
                                    <th>
                                        {item.date}<br/>
                                        {getDays(item.week)}
                                    </th>
                                )
                            }
                            <th>合计</th><th>单项平均分</th><th>总分</th><th>总平均分</th><th>排名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {JSON.stringify(allDatas) != "{}"&&allDatas.classData.map((item)=>
                            item.classes.map((cls,ind)=>
                                cls.recordsList.map((r,k)=><tr key={k}>
                                    {ind===0&&k===0?<td rowSpan={item.classes.length*cls.recordsList.length}>{item.gradeName}</td>:null}
                                    {k===0?<td rowSpan={cls.recordsList.length}>{cls.className}</td>:null}
                                    {r.tdlist.map((n,i)=>
                                        <td key={i} onDoubleClick={this.showModal.bind(this,r.classId,r.typeId,r.date)}>{n}</td>
                                    )}
                                    <td>{r.total}</td>
                                    <td>{r.score}</td>
                                    {k===0?<td rowSpan={cls.recordsList.length}>{cls.totalScore}</td>:null}
                                    {k===0?<td rowSpan={cls.recordsList.length}>{cls.averageScore}</td>:null}
                                    {k===0?<td rowSpan={cls.recordsList.length}>{cls.rank}</td>:null}
                                </tr>)
                            )
                        )}
                    </tbody>
                </table>
                <Modal
                    title={singleClassScore?(
                        <span>
                            考评详情(<span style={{marginRight:12}}>{singleClassScore.date}</span><span style={{marginRight:12}}>{getDays(singleClassScore.week)}</span><span>{singleClassScore.typeName}</span>)
                        </span>)
                        :"考评详情"
                    }
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form content-form">
                        <Row gutter={24}>
                            <Col span={16}>
                                <FormItem {...formItemLayout} label='分数'>
                                {getFieldDecorator('score',{initialValue:singleClassScore&&singleClassScore.score||'',rules:[{required:true,message:"请输入"}]})(
                                    <Input />
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16}>
                                <FormItem {...formItemLayout} label='备注'>
                                {getFieldDecorator('remark',{initialValue:singleClassScore&&singleClassScore.remark||''})(
                                    <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16}>
                                <FormItem {...formItemLayout} label='图片'>
                                    {singleClassScore&&singleClassScore.imgs&&singleClassScore.imgs.map(item=>
                                        <img src={getImg(item)}/>
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
    allTerms:state.user.allTerms,
    classScoreType:state.classScore.classScoreType,
    commonGradeData:state.user.commonGradeData,
    classNameData:state.user.classNameData,
    classScoreDetails:state.classScore.classScoreDetails,
    singleClassScore:state.classScore.singleClassScore
  }
}

export default connect(mapStateToProps)(Form.create()(ClassScoreTable));
