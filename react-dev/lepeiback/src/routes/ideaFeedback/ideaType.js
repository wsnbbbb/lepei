import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Breadcrumb, Button, Input, Select , Form, Row, Col, Modal, message } from 'antd';
import PageIndex from '../../components/page';
import { Link } from 'dva/router';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class IdeaType extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          keyWord:'',
          List:[],
          dataList:[],
          visible:false,
          visible1:false,
          confirmLoading:false,
          confirmLoading1:false,
          detailList:[],
          teachersList:[],
          typeId:''
         
        };
    }
    componentDidMount=()=>{
        const params={
            "kw":this.state.keyWord,
            "page":1,
            "prePage":20,
        }
        this.getOpinionType(params)

        this.props.dispatch({ // 获取所有教师
            type:'ideaFeedback/getAllTeachers',
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        teachersList:res.data
                    })
                }
            }
        })
    }
    // 获取意见类型管理列表
    getOpinionType = (params)=>{
        this.props.dispatch({
            type:'ideaFeedback/getOpinionType',
            payload:params,
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        List:res.data,
                        dataList:res.data.dataList
                    })
                }
            }
        })
    }
    
    changeVal = (e)=>{
        this.setState({
            keyWord:e.target.value
        })
    }
    // 查询
    search = ()=>{
        const params={
            "kw":this.state.keyWord,
            "page":1,
            "prePage":this.state.prePage,
        }
        this.getOpinionType(params)
    }
   
    // 分页
    onPageChange = (current,size)=>{
        const params={
            "kw":this.state.keyWord,
            "page":current,
            "prePage":size,
        }
        this.getOpinionType(params)
    }

    // 添加
    add = ()=>{
        this.setState({
            visible:true
        })
    }
    handleOk = ()=>{
        this.props.form.validateFields(["typeName","handlerIds"],(err,values) =>{
            if(!err){
                const params = {
                    "typeName":values.typeName,
                    "handlerIds":values.handlerIds
                }
                this.props.dispatch({
                    type:'ideaFeedback/addOpinionType',
                    payload:params,
                    callback:(res)=>{
                        if(res.code === 200){
                            message.success("添加成功！")
                        this.setState({
                            confirmLoading: true,
                        });
                        setTimeout(() => {
                            this.setState({
                              visible: false,
                              confirmLoading: false,
                            });
                        }, 500);
                        this.getOpinionType()
                        this.props.form.resetFields(["typeName","handlerIds"])
                        }
                        
                    }
                })
            }
        })
    }
    handleCancel = ()=>{
        this.setState({
            visible:false
        })
        this.props.form.resetFields(["typeName","handlerIds"])
    }
   
    // 编辑
    editOpinionType = (id)=>{
        this.props.dispatch({
            type:'ideaFeedback/opinionTypeDetail',
            payload:{"typeId":id},
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        visible1:true,
                        typeId:id,
                        detailList:res.data
                    })
                }
            }
        })
    }
    handleOk1 = ()=>{
        this.props.form.validateFields(["editTypeName","editHandlerIds"],(err,values) =>{
            if(!err){
                const params = {
                    "typeId":this.state.typeId,
                    "typeName":values.editTypeName,
                    "handlerIds":values.editHandlerIds
                }
                this.props.dispatch({
                    type:'ideaFeedback/editOpinionType',
                    payload:params,
                    callback:(res)=>{
                        if(res.code === 200){
                            message.success("编辑成功！")
                            this.setState({
                                confirmLoading1: true,
                            });
                            setTimeout(() => {
                                this.setState({
                                visible1: false,
                                confirmLoading1: false,
                                });
                            }, 500);
                            this.getOpinionType()
                            this.props.form.resetFields(["editTypeName","editHandlerIds"])
                        }
                        
                    }
                })
            }
        })
    }
    handleCancel1 = ()=>{
        this.setState({
            visible1:false
        })
        this.props.form.resetFields(["editTypeName","editHandlerIds"])
    }
   
    // 删除
    delOpinionType = (id)=>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                    type:'ideaFeedback/delOpinionType',
                    payload: {"typeId":id},
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("删除成功！")
                            const params={
                                "kw":that.state.keyWord,
                                "page":that.state.page,
                                "prePage":that.state.prePage,
                            }
                            that.getOpinionType(params)
                        }
                    }
                })
            },
            onCancel() {},
        })
    }
    render(){
        const { List,dataList,visible,confirmLoading, visible1, confirmLoading1,detailList,teachersList } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const columns = [
            {
                title: '意见类型',
                dataIndex: 'typeName',
            },
            {
                title:'回复人',
                dataIndex:'handlers'
            },
            {
                title: '操作',
                dataIndex: '',
                width:150,
                fixed:'right',
                render:(text, record) => (
                  <span>
                    <a href="javascript:;"  onClick={this.editOpinionType.bind(this,record.typeId)}>编辑</a>&emsp;
                    <a href="javascript:;"  onClick={this.delOpinionType.bind(this,record.typeId)}>删除</a>
                  </span>
                )
            },
        ]
        let option = []
        teachersList&&teachersList.map(item =>{
            option.push(<Option key={item.personId} value={item.personId}>{item.personName}</Option>) 
        })
       
        return (
            <div className="content-main">
               <Breadcrumb style={{marginBottom:"25px"}}>
                    <Breadcrumb.Item><Link to="/idea-feedback">意见反馈</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>意见类型管理</Breadcrumb.Item>
                </Breadcrumb>
                <Form style={{marginBottom:'20px'}}>
                    <Row>
                        <Col span={5}>
                            <Search onChange={this.changeVal.bind(this)} placeholder="请输入意见类型"/>
                        </Col>
                        <Col span={5} offset={2}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;&emsp;
                            <Button onClick={this.add.bind(this)}>添加</Button>
                        </Col>
                    </Row>
                </Form>
                <Table scroll={{ x: 800 }} columns={columns} dataSource={dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={List.totalCount} totalPage={List.totalPage} currentPage={List.currentPage}/>
                <Modal
                    width={600}
                    title="添加"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Row gutter={24} >
                            <Col span={20}>
                                <FormItem {...formItemLayout} label={'意见类型'}>
                                {getFieldDecorator("typeName",{rules:[{required:true,message:"意见类型不能为空"},{max:20,message:"最多输入20字"}]})(
                                    <Input placeholder="请输入意见类型"/>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24} >
                            <Col span={20}>
                                <FormItem {...formItemLayout} label={'回复人'}>
                                {getFieldDecorator("handlerIds",{rules:[{required:true,message:"请输入回复人"}]})(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择"
                                    >
                                        {option}
                                    </Select>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    width={600}
                    title="编辑"
                    visible={visible1}
                    onOk={this.handleOk1}
                    confirmLoading={confirmLoading1}
                    onCancel={this.handleCancel1}
                >
                    <Form>
                        <Row gutter={24} >
                            <Col span={20}>
                                <FormItem {...formItemLayout} label={'意见类型'}>
                                {getFieldDecorator("editTypeName",{initialValue:detailList&&detailList.typeName||'',rules:[{required:true,message:"意见类型不能为空"},{max:20,message:"最多输入20字"}]})(
                                    <Input placeholder="请输入意见类型"/>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24} >
                            <Col span={20}>
                                <FormItem {...formItemLayout} label={'回复人'}>
                                {getFieldDecorator("editHandlerIds",{initialValue:detailList&&detailList.handlerIds||[],rules:[{required:true,message:"请选择回复人"}]})(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择"
                                    >
                                        {option}
                                    </Select>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                    </Form>
                </Modal>
            </div>
        )  
    }
}

const mapStateToProps = (state) => {
  return {
     
  }
}
export default connect(mapStateToProps)(Form.create()(IdeaType));
