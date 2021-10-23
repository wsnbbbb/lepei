import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col, Input,Button,message,Modal,Table } from 'antd';
import {Link,routerRedux} from 'dva/router';
import { portUrl, getUpload } from '../../utils/img';
import './style.less';

const FormItem = Form.Item;

class addStudentScore extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file:"",
            visible:false,
            title:'添加'
        };
    }
    componentDidMount=()=>{
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
    onChange=(e)=>{
        this.setState({file:e.target.files[0]})
    }
    hideModal=()=>{
        this.setState({visible:false})
    }
    submit=()=>{
        if(!this.state.file){
            return message.error("请上传成绩表格后再提交",2);
        }
        this.props.form.validateFields((err, values) => {
            if(!err){
                const params = new FormData()
                params.append('excel', this.state.file)
                params.append('title', values.title)
                this.props.dispatch({
                    type:'studentScore/importStudentScore',
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
                                message.success("添加学生成绩成功！",2)
                                window.history.go(-1)
                                // this.props.dispatch(routerRedux.push("/salary-manage"))
                            }
                        }
                    }
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:8 },
            wrapperCol: { span: 15 }
        };
        const {visible,header,sheetData} = this.state;
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
                    tds.push(<td style={{color:item.error?"#f00":""}}>{item[p]}</td>)
                }
                return tbodys.push(<tr>{tds}</tr>)
            })
        }
        
        return (
            <div className="add-salary-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/score-manage">新生成绩发布</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>添加</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form salary-form">
                    <Row gutter={24}>
                        <Col span={10}>
                        <FormItem {...formItemLayout} label={'名称'}>
                            {getFieldDecorator("title",{initialValue:'',rules:[{required:true,message:'请输入名称',whitespace: true}]})(
                                <Input maxLength="20" />
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={10}>
                            <FormItem {...formItemLayout} label={'选择成绩表格'}>
                            {getFieldDecorator("excel",{initialValue:''})(
                                <input type="file" name="file" onChange={this.onChange} single="true"/>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <p style={{marginLeft:"14%",color:'#aaa'}}>支持扩展名：xls,xlsx...&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href={getUpload("新生成绩导入模板.xls")}>下载导入模板</a>
                    </p>
                    <div className="salary-btns">
                        <Link to='/score-manage'><Button style={{marginRight:16}}>返回</Button></Link>
                        <Button type='primary' onClick={this.submit.bind(this)}>提交</Button>
                    </div>
                </Form>  
                <Modal
                    title="错误提示"
                    visible={visible}
                    onCancel={this.hideModal}
                    footer={null}
                    className="salary-modal"
                >
                    <div className="table-box">
                        <table border="1" className="salary-table">
                            <thead>
                                <tr>{ths}<th>提示</th></tr>
                            </thead>
                            <tbody>
                                {tbodys}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    salaryList:state.salary
  }
}

export default connect(mapStateToProps)(Form.create()(addStudentScore));
