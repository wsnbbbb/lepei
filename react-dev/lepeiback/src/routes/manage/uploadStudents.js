import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col, Input,Button,message,Modal,Table,Radio,Select  } from 'antd';
import {Link,routerRedux} from 'dva/router';
import {getUpload} from '../../utils/img';
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class UploadStudents extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            file:"",
            visible:false,
            classValue:'',
            rule:1,
            title:"学生批量导入",
        };
    }
    componentDidMount=()=>{
        this.props.dispatch({
            type:'user/getCommonGradeList'
        })
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/student-manage"
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

    onChange=(e)=>{
        this.setState({file:e.target.files[0]})
    }
    hideModal=()=>{
        this.setState({visible:false})
    }
    submit=()=>{
        if(!this.state.file){
            return message.error("请上传表格后再导入",2);
        }
        if(!this.state.classValue&&this.state.rule==1){
            return message.error("请选择年级班级后再导入",2);
        }
        const params = new FormData()
        const classId=this.state.classValue&&this.state.rule==1?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):0;
        console.log(classId)
        params.append('excel', this.state.file)
        params.append('classId',classId)
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.dispatch({
                    type:'person/uploadStudents',
                    payload:params,
                    callback:(res)=>{
                        this.setState({file: ''})
                        this.props.form.resetFields(["excel"])
                        if(res.code===200){
                            if(res.data.hasError===true){
                                if(res.data.header&&res.data.sheetData){
                                    this.setState({visible:true,header:res.data.header,sheetData:res.data.sheetData})
                                }
                                message.error(res.msg,2)
                            }else{
                                message.success("批量导入成功！",2)
                                this.props.dispatch(routerRedux.push("/student-manage"))
                            }
                        }
                    }
                })
            }
        })
    }
    gradeChange=(val)=>{
        if(val){
          this.setState({disabled:false})
          const id=val.substring(val.lastIndexOf('-')+1, val.length)
          this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId": id||""},
            callback:(res)=>{
              if(res.code===200){
                console.log(res.data)
                if(res.data[0]){
                    this.setState({classValue:res.data[0].className+'-'+res.data[0].classId})
                }
              }
            }
          })
        }else{
          this.setState({classValue:'',disabled:true})
        }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    radioChange=(e)=>{
        const val=e.target.value;
        if(val==2){
            this.setState({classValue:""})
        }
        this.setState({rule:val})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:8 },
            wrapperCol: { span: 15 }
        };
        const {visible,header,sheetData,rule} = this.state;
        let ths=[];
        if(header){
            for (var p in header){
                ths.push(<th>{header[p]}</th>)
            }
        }
        console.log({ths});
        
        let tbodys=[]
        if(sheetData){
            sheetData.map((item,idx)=>{
                console.log(item)
                let tds=[]
                for(var p in item){
                    tds.push(<td style={{color:item.error?"#f00":""}}>{item[p]?item[p]:"无"}</td>)
                }
                return tbodys.push(<tr>{tds}</tr>)
            })
        }
        const {commonData,gradeList} = this.props;
        let classOptions=[];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
        })
        let options=[]
        gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
        })
        return (
            <div className="add-salary-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/student-manage">学生管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>学生批量导入</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form salary-form">
                    <Row gutter={24}>
                        <Col span={10}>
                        <FormItem {...formItemLayout} label={'导入规则'}>
                            {getFieldDecorator("rule",{initialValue:'1',rules:[{required:true,message:'请选择',whitespace: true}]})(
                                <RadioGroup onChange={this.radioChange.bind(this)}>
                                    <RadioButton value="1">指定班级</RadioButton>
                                    <RadioButton value="2">不指定班级</RadioButton>
                                </RadioGroup>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    {rule==1?<Row gutter={24}>
                        <Col span={10}>
                        <FormItem {...formItemLayout} label={'选择年级'}>
                            {getFieldDecorator("gradeId",{initialValue:'',rules:[{required:true,message:'请选择',whitespace: true}]})(
                                <Select showSearch onChange={this.gradeChange.bind(this)}>
                                    {options}
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                    </Row>:null}
                    {rule==1?<Row gutter={24}>
                        <Col span={10}>
                        <FormItem {...formItemLayout} label={'选择班级'}>
                            {/* {getFieldDecorator("classId",{rules:[{required:true,message:'请输入名称',whitespace: true}]})( */}
                                <Select showSearch value={this.state.classValue} onChange={this.classChange}>
                                    {classOptions}
                                </Select>
                             {/* )} */}
                            </FormItem>
                        </Col>
                    </Row>:null}
                    <Row gutter={24}>
                        <Col span={10}>
                            <FormItem {...formItemLayout} label={'选择表格'}>
                            {getFieldDecorator("excel",{initialValue:''})(
                                <input type="file" name="file" onChange={this.onChange} single="true"/>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <p style={{marginLeft:"14%",color:'#aaa'}}>支持扩展名：xls,xlsx...&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href={getUpload("学生信息导入模板.xls")} >下载导入模板</a>
                    </p>
                    <div className="salary-btns">
                        <Link to='/student-manage'><Button style={{marginRight:16}}>返回</Button></Link>
                        <Button type='primary' onClick={this.submit.bind(this)}>导入</Button>
                    </div>
                </Form>  
                <Modal
                    title="错误提示"
                    visible={visible}
                    onCancel={this.hideModal}
                    footer={null}
                    className="salary-modal"
                >
                    <table border="1" className="salary-table">
                        <thead>
                            <tr>{ths}<th>提示</th></tr>
                        </thead>
                        <tbody>
                            {tbodys}
                        </tbody>
                    </table>
                </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(UploadStudents));
