import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb,Form,Row,Col, Input,Button,message,Modal,Table } from 'antd';
import {Link,routerRedux} from 'dva/router';
import { getQueryString } from '../../utils/public';
import {getUpload} from '../../utils/img';
import './style.less';

const FormItem = Form.Item;

class UploadStaff extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file:"",
            visible:false,
            title:"教师二次导入",
            title1:"职工二次导入",
        };
    }
    componentDidMount = () => {
        const type=getQueryString('type'); 
        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/teacher-manage"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/employee-manage"
                },
              })
        }
    }

    componentWillUnmount = () => {
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })
          
    }

    onChange = (e) => {
        this.setState({file:e.target.files[0]})
    }
    hideModal = () => {
        this.setState({visible:false})
    }
    submit = () => {
        if(!this.state.file){
            return message.error("请上传表格后再导入",2);
        }
        const type = getQueryString('type');
        const personType = (type == 1 ? 2 : 3);
        const params = new FormData()
        params.append('excel', this.state.file)
        params.append('personType', personType)
        console.log(personType)
        this.props.dispatch({
            type:'person/secondUploadStaff',
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
                        message.success("导入成功！",2)
                        this.props.dispatch(routerRedux.push("/teacher-manage"))
                    }
                }
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
        const type=getQueryString('type');
        return (
            <div className="add-salary-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={"/teacher-manage"}>教师管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>教师二次导入</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form salary-form">
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
                        <a href={getUpload("教师个人信息二次导入模板.xlsx")}>下载导入模板</a>
                    </p>
                    <div className="salary-btns">
                        <Link to={type==1?'/teacher-manage':'/employee-manage'}><Button style={{marginRight:16}}>返回</Button></Link>
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
    
  }
}

export default connect(mapStateToProps)(Form.create()(UploadStaff));
