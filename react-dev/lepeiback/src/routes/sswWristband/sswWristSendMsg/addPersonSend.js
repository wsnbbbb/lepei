import React,{Component} from 'react';
import { connect } from 'dva';
import {Link,routerRedux} from 'dva/router';
import { message,Button,Input,Select,Form,Col,Row,Radio,TreeSelect,Breadcrumb,Tree ,Table} from 'antd';
import { getSexType,getGradeType,getResidence,getNumberType, formatIdcard } from '../../../utils/public';
import AddStudent from '../../../components/addStudent';
import AddPerson from '../../../components/addPerson';
import '../style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { TreeNode } = Tree;
class AddPersonSendMsg extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classId:'',
            groupId:'',
            step:1,
            tableData:[],
        };
    }
    componentDidMount=()=>{
        
    }
    groupChange=(e)=>{
        this.setState({groupId:e.target.value,tableData:[]})
    }
    addStudent=()=>{
        this.setState({step:2})
    }
    delTable=(data)=>{
        const {tableData} = this.state;
        let arr=[];
        tableData.map(item=>{
            if(item.personId!==data.personId){
                arr.push(item)
            }
        })
        this.setState({tableData:arr})
    }
    getData=(tip,data)=>{
        const {tableData} = this.state;
        console.log(tableData)
        if(tip==='cancel'){
            this.setState({step:1})
        }else{
            tableData.push(...data);
            let result = [];
            let obj = {};
            tableData.map((item)=>{
                if(!obj[item.personId]){
                    result.push(item);
                    obj[item.personId] = true;
                }

            })
            this.setState({tableData:result,step:1})
        }
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                const {tableData} = this.state;
                console.log(tableData)
                let studentIds=[];
                tableData&&tableData.length>0&&tableData.map(item=>{
                    return studentIds.push(item.personId)
                })
                console.log(studentIds)
                if(studentIds.length<=0){
                    return message.error('?????????????????????????????????',2)
                }
                const params={
                    "sendType":1,
                    "title":values.title,"content":values.content,
                    "sendGroup":values.sendGroup,
                    "personIds":studentIds,
                }
                this.props.dispatch({
                    type:'sswWristband/addSswMessage',
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("????????????",2)
                            this.props.dispatch(routerRedux.push("/ssw-wrist-message"))
                        }
                    }
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const {step,groupId}=this.state;
        const columns = [{
            title: '??????',
            dataIndex: 'personName'
        }, {
            title: '??????',
            dataIndex: 'sex',
            render:(text,record)=>(
              <span>{getSexType(record.sex)}</span>
            )
        }, {
            title: '????????????',
            dataIndex: 'numberType',
            render:(record)=>{
                return(<span>{getNumberType(record)}</span>)
            }
        }, 
        {
              title: '????????????',
              dataIndex: 'inResidence',
              render:(record)=>{
                return(<span>{getResidence(record)}</span>)
              }
        }, {
            title: '?????????',
            dataIndex: 'usin',
        }, {
            title: '????????????',
            dataIndex: 'gradeType',
            render:(record)=>{
                return(<span>{getGradeType(record)}</span>)
              }
        }, {
            title: '??????',
            dataIndex: 'gradeName',
        }, {
            title: '??????',
            dataIndex: 'className',
        }, {
            title: '??????',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span>
                <Button className="check-btn" disabled={this.state.disabled} onClick={this.delTable.bind(this,record)}>??????</Button> 
              </span>
            )
        }];
        const staffColumns = [{
            title: '??????',
            dataIndex: 'personName'
        }, {
            title: '??????',
            dataIndex: 'sex',
            render:(text,record)=>(
              <span>{getSexType(record.sex)}</span>
            )
        }, {
            title: '????????????',
            dataIndex: 'departmentName',
        }, {
            title: '??????',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span>
                <Button className="check-btn" disabled={this.state.disabled} onClick={this.delTable.bind(this,record)}>??????</Button> 
              </span>
            )
        }];
        return (
            <div className='detail-main'>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>??????????????????</Breadcrumb.Item>
                        <Breadcrumb.Item>?????????????????????</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/ssw-wrist-message">???????????????????????????</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>??????????????????</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-main">
                        <span style={{display:step==1?"block":"none"}}><Form className="ant-advanced-search-form content-form teacher-form">
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='????????????'>
                                    {getFieldDecorator('sendType',{initialValue:'????????????'})(
                                        <Input disabled={true}/>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='??????'>
                                    {getFieldDecorator('title',{initialValue:'',
                                    rules:[{required:true,message:"???????????????",whitespace: true,}]})(
                                        <Input clear='true' maxLength='10'/>
                                    )}
                                    </FormItem>
                                </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label='??????'>
                                    {getFieldDecorator('content',{initialValue:'',rules:[{required:true,message:"?????????????????????",whitespace: true}]})(
                                        <TextArea maxLength='60' placeholder="?????????????????????" autosize={{ minRows: 2}} />
                                    )}
                                    </FormItem>
                                </Col> 
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <FormItem {...formItemLayout} label={'????????????'}>
                                    {getFieldDecorator("sendGroup",{initialValue:'',rules:[{required:true,message:"?????????????????????"}]})(
                                        <RadioGroup onChange={this.groupChange}>
                                            <RadioButton value="2">?????????</RadioButton>
                                            <RadioButton value="1">??????</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {groupId?<Button type='primary' onClick={this.addStudent.bind(this)} style={{marginLeft:26}}>????????????</Button>:null}
                            {groupId?<div className='department-content' style={{padding:'20px 2%'}}>
                                <Table className='content-table' scroll={{ x: 1000 }} columns={groupId==1?columns:staffColumns} dataSource={this.state.tableData} pagination={false}/>
                                {/* <Pagination className='content-page' total={50} showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} showTotal={this.showTotal} onChange={this.onPageChange} /> */}
                            </div>:null}
                            <Row style={{marginTop:20}}>
                                <Col span={2} offset={10}>
                                    <Button ><Link to='/ssw-wrist-message'>??????</Link></Button>
                                </Col>
                                <Col span={2} offset={0}>
                                    <Button type='primary' onClick={this.submit.bind(this)} >??????</Button>
                                </Col>
                            </Row>
                            </Form> 
                            </span>
                            <div style={{display:step===2&&groupId==1?'block':'none'}}><AddStudent getData={this.getData.bind(this)} /></div>
                            <div style={{display:step===2&&groupId==2?'block':'none'}}><AddPerson getData={this.getData.bind(this)} /></div>
                            
                        
                </div>
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

export default connect(mapStateToProps)(Form.create()(AddPersonSendMsg));
