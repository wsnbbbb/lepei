import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col,Button,message,Modal,Select  } from 'antd';
import {Link,routerRedux} from 'dva/router';
import {getUpload} from '../../utils/img';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

class UploadClass extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file:"",
            visible:false,
            classValue:'',
            rule:1,
            title:"班级批量导入",
        };
    }
    componentDidMount=()=>{
        this.props.dispatch({
            type:'user/getCommonGradeList'
        })
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/class-manage"
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
        const params = new FormData();
        const gradeId=this.state.gradeId;
        console.log(gradeId)
        params.append('excel', this.state.file)
        params.append('gradeId',gradeId)
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.dispatch({
                    type:'class/uploadClasses',
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
                                this.props.dispatch(routerRedux.push("/class-manage"))
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
          this.setState({gradeId:id[1]||""})
        }else{
          this.setState({gradeId:'',disabled:true})
        }
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
        let tbodys=[]
        if(sheetData){
            sheetData.map((item,idx)=>{
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
                        <Breadcrumb.Item><Link to="/class-manage">班级管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>班级批量导入</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>班级批量导入</h3>
                </div> */}
                <Form className="ant-advanced-search-form salary-form">
                    {/* <Row gutter={24}>
                        <Col span={10}>
                        <FormItem {...formItemLayout} label={'选择年级'}>
                            {getFieldDecorator("gradeId",{initialValue:'',rules:[{required:true,message:'请选择年级',whitespace: true}]})(
                                <Select showSearch onChange={this.gradeChange.bind(this)}>
                                    {options}
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                    </Row> */}
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
                        <a href={getUpload("班级信息导入模板.xls")}>下载导入模板</a>
                    </p>
                    <div className="salary-btns">
                        <Link to='/class-manage'><Button style={{marginRight:16}}>返回</Button></Link>
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

export default connect(mapStateToProps)(Form.create()(UploadClass));
