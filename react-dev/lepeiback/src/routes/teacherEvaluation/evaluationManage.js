import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs, Form, Button, DatePicker, Input,Row, Col,Table, Modal, message,} from 'antd';
import { onlyDate, formatDate,addKeys} from '../../utils/public';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import QrCode from 'qrcode.react';
import './style.less';
import { qrUrl } from '@/config';
import { log } from 'util';


const TabPane = Tabs.TabPane;
const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
class EvaluationManage extends Component{
    constructor(props){
        super(props);
        this.state = {
            page:1,
            prePage:20,
            list:[],
            page1:1,
            prePage1:20,
            templateList:[],
            visible: false,
            confirmLoading: false,
            visible1: false,
            confirmLoading1: false,
            templateName:'',
            templateId:'',
            show:false,
            qrUrl:'',
            name:''
          

        }
    }
    componentDidMount = () => {
        const params={
            "kw":"",
            "page":this.state.page,
            "prePage":this.state.prePage,
            "attendTime":"",
        }
        this.getEvaluationList(params)
        const params1={
            "kw":"",
            "page":this.state.page1,
            "prePage":this.state.prePage1,
            "attendTime":"",
        }
        this.getTemplateList(params1)
    }
    // 评课管理列表
    getEvaluationList=(params)=>{
        this.props.dispatch({
            type:'teacherEvaluation/getEvaluationList',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    addKeys(res.data.dataList)
                  this.setState({
                    list: res.data,
                    dataList:res.data.dataList
                  })
                }
            }
        })
    }
    // 评课模板列表
    getTemplateList=(params1)=>{
        this.props.dispatch({
            type:'teacherEvaluation/getTemplateList',
            payload: params1,
            callback: (res)=>{
                if(res.code===200){
                    addKeys(res.data.dataList)
                  this.setState({
                    templateList: res.data,
                    dataList1:res.data.dataList
                  })
                }
            }
        })
    }

    changeTab = (key) => {//选项卡切换
        console.log(key);
    }
   
    //查询
    search = () => {
        this.props.form.validateFields(["kw","time"],(err, values) => {
            const rangeValue = values['time'];
        console.log({rangeValue});
        
        const params={
            "page":1,
            "prePage":this.state.prePage,
            "kw":values.kw||'',
            "attendTime":rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
        }
        console.log("params",params);
        this.getEvaluationList(params)
        })
    }
    
    // 评课管理-分页
    onPageChange=(current,size)=>{
        this.props.form.validateFields(["kw","time"],(err, values) => {
          this.setState({page:current,prePage:size})
          const rangeValue = values['time'];
          const params={
            "page":current,
            "prePage":size,
            "kw":values.kw||'',
            "attendTime":rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
           
          }
          this.getEvaluationList(params)
        })
    }
   
    // 评课管理-增加
    evaluationOfType =(type,id) => {
        if(type == 1){
            this.props.dispatch(routerRedux.push("/evaluation-of-type-detail?type=1"))
        }else{//编辑
            this.props.dispatch(routerRedux.push("/evaluation-of-type-detail?type=2&id="+id))
        }
    }
    // 生成二维码
    qrCode =() => {
        let schoolId = sessionStorage.getItem("schoolId")
        console.log({schoolId});
        
        this.setState({
            show:true,
            qrUrl:qrUrl+"?id="+schoolId
        })
        console.log(this.state.qrUrl);
        
    }
    cancel = ()=>{
        this.setState({
            show:false
        })
    }
    // 评课管理-删除
    evaluationDel=(id)=>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                type:'teacherEvaluation/delEvaluation',
                payload:{"typeId":id},
                callback:(res)=>{
                  if(res.code===200){
                    message.success('删除成功！',3)
                    that.props.form.validateFields(["kw","time"],(err, values) => {
                        const rangeValue = values['time'];
                        const params={
                            "page":that.state.page,
                            "prePage":that.state.prePage,
                            "kw":values.kw||'',
                            "attendTime":rangeValue&&rangeValue.length==2?(rangeValue[0].format('YYYY-MM-DD')+'~'+rangeValue[1].format('YYYY-MM-DD')):''
                         
                        }
                      that.getEvaluationList(params)
                    })
                  }
                }
              })
            },
            onCancel() {},
        });

    }
    // 评课模板-查询
    search1 = () => {
        this.props.form.validateFields(["kw1","timer"],(err, value) => {
        const rangeValue1 = value['timer'];
        console.log("timer",value.timer);
        const params1={
            "page":1,
            "prePage":this.state.prePage1,
            "kw":value.kw1||'',
            "attendTime":rangeValue1&&rangeValue1.length==2?(rangeValue1[0].format('YYYY-MM-DD')+'~'+rangeValue1[1].format('YYYY-MM-DD')):''
            
        }
        console.log("1111",params1);
        
        this.getTemplateList(params1)
        })
    }
    // 评课模板分页
    onPageChange1=(current,size)=>{
        this.props.form.validateFields(["kw1","timer"],(err, values) => {
          this.setState({page1:current,prePage1:size})
          const rangeValue1 = values['timer'];
          const params1={
            "page":current,
            "prePage":size,
            "kw":values.kw1||'',
            "attendTime":rangeValue1&&rangeValue1.length==2?(rangeValue1[0].format('YYYY-MM-DD')+'~'+rangeValue1[1].format('YYYY-MM-DD')):''
          }
          this.getTemplateList(params1)
        })
    }
    // 新增模板
    addTemplate = () => {
        this.props.form.resetFields(["addTemplateName"])
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.props.form.validateFields(["addTemplateName"],(err, values) => {
            console.log({values});
            
            const templateName = values.addTemplateName
            if(templateName === ''){
                // message.error("请输入模板名称！")
                return
            }
            if(!err){
                this.props.dispatch({
                    type:'teacherEvaluation/addEvaTemplate',
                    payload: {
                        templateName
                    },
                    callback: (res)=>{
                        // console.log("res",res);
                        if(res.code===200){
                            message.success("新增模板成功!")
                            this.setState({
                                confirmLoading: true,
                            });
                            setTimeout(() => {
                              this.setState({
                                visible: false,
                                confirmLoading: false,
                              });
                            }, 1000);
                            this.props.form.resetFields(["addTemplateName"])
                            this.getTemplateList()
                        }
                        
                    }
    
                })
            }
            
        })
        
    };
    
    handleCancel = () => {
        this.setState({
          visible: false,
        });
        this.props.form.resetFields(["addTemplateName"])
    };
    // 编辑模板
    editTemplate = (id,name)=>{
        this.setState({
            visible1: true,
            templateName: name,
            templateId: id
        });
    }
    onOk =()=>{
        this.props.form.validateFields(["templateName"],(err, values) => {
            const templateName = values.templateName
            if(!err){
                this.props.dispatch({
                    type:'teacherEvaluation/editEvaTemplate',
                    payload: {
                        templateName,
                        id: this.state.templateId
                    },
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("更新成功！")
                            this.setState({
                                confirmLoading1: true,
                            });
                            setTimeout(() => {
                              this.setState({
                                visible1: false,
                                confirmLoading1: false,
                              });
                            }, 1000);
                            this.props.form.resetFields(["templateName"])
                            this.getTemplateList()
                        }
                    }
    
                })
            }
        })
    }   
    handleCancel1 = () => {
        this.setState({
          visible1: false,
        });
        this.props.form.resetFields(["templateName"])
    };
    // 删除评课模板
    delTemplate = (id) =>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                type:'teacherEvaluation/delEvaTemplate',
                payload:{
                    id
                },
                callback:(res)=>{
                    console.log("res",res);
                  if(res.code===200){
                    message.success('删除成功！',3)
                    that.props.form.validateFields(["kw1","timer"],(err, values) => {
                        const rangeValue1 = values['timer'];
                        const params1={
                            "page":that.state.page1,
                            "prePage":that.state.prePage1,
                            "kw":values.kw1||'',
                            "attendTime":rangeValue1&&rangeValue1.length==2?(rangeValue1[0].format('YYYY-MM-DD')+'~'+rangeValue1[1].format('YYYY-MM-DD')):''
                        }
                      that.getTemplateList(params1)
                    })
                  }
                }
              })
            },
            onCancel() {},
          });
        
    }
    // 模板管理
    templateManage = (id)=>{
        this.props.dispatch(routerRedux.push("/template-manage?id="+id))
    }
    
    render(){
        const QRCode = require('qrcode.react');
        const {currentTab,list,templateList,visible, confirmLoading,templateName,visible1, confirmLoading1,dataList,dataList1} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout2 = {
            labelCol: { span:3 },
            wrapperCol: { span: 21 }
        };
        const formItemLayout = {
            labelCol: { span:4 },
            wrapperCol: { span: 20 }
        };
        const columns = [
            {
              title: '序号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '上课教师',
              dataIndex: 'teacherName',
              width:500,
              key: 'teacherName',
            },
            {
                title: '上课时间',
                dataIndex: '',
                key: 'teachingTime',
                render:(record)=>{
                   return <span>
                    {onlyDate(record.teachingTime)}
                   </span>
                }
            },
            {
              title: '上课地点',
              dataIndex: 'teachingPlace',
              key: 'teachingPlace',
            },
            {
              title: '上课主题',
              dataIndex: 'teachingTitle',
              key: 'teachingTitle',
            },
            {
            title: '操作',
            dataIndex: '',
            width:200,
            fixed:'right',
            render:(text, record) => (
            <span>
                <a href="javascript:;"  onClick={this.evaluationOfType.bind(this,2,record.id)}>编辑</a>&emsp;
                <a href="javascript:;"  onClick={this.evaluationDel.bind(this,record.id)}>删除</a>  
            </span>
            )},
          ];
        const columns1 = [
            {
              title: '序号',
              dataIndex: 'id',
              key:'id',
              width:100
            },
            {
              title: '模版名称',
              dataIndex: 'templateName',
              key:'templateName',
            },
            {
                title: '模板分值',
                dataIndex: 'totalScore',
                key:'totalScore',
                width:250
            },
            {
                title: '创建人',
                dataIndex: 'createName',
                key:'createName',
                width:250
            },
            {
                title: '创建时间',
                dataIndex: '',
                key:'createTime',
                width:300,
                render:(record)=>{
                   return <span>{formatDate(record.createTime)}</span>
                }
            },
            {
                title: '操作',
                dataIndex: '',
                width:250,
                fixed:'right',
                render:(text, record) => (
                <div>
                    <a href="javascript:;"  onClick={this.delTemplate.bind(this,record.id)}>删除</a>&emsp; 
                    <a href="javascript:;"  onClick={this.editTemplate.bind(this,record.id, record.templateName)}>编辑模板名称</a>&emsp;
                    <a href="javascript:;"  onClick={this.templateManage.bind(this,record.id)}>模板管理</a>
                </div>
                )
            },
          ];
        
        return(
            <div className="content-main evaluation-manage">
                 <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                    <TabPane tab="评课管理" key="1" className="content-form">
                        <Form>
                            <Row gutter={24}>
                                <Col span={4}>
                                    <FormItem label="">
                                        {getFieldDecorator('kw')(
                                            <Search placeholder="教师姓名/上课地点/上课主题"/>
                                        )}
                                    </FormItem>
                                </Col> 
                                 <Col span={6} >
                                    <FormItem {...formItemLayout2} label={'日期：'}>
                                        {getFieldDecorator("time",{})(
                                            <RangePicker />
                                         )}
                                    </FormItem>
                                </Col>
                                <Col span={8} offset={0}>
                                    <Button type='primary' onClick={this.search.bind(this)} className="marginTop">查询</Button>
                                    <Button type='primary' onClick={this.evaluationOfType.bind(this,1)} style={{margin:'5px 10px 0 10px'}}>新增</Button>
                                    <Button type='primary' onClick={this.qrCode.bind(this)} className="marginTop">生成二维码</Button>
                                    
                                </Col>
                               
                            </Row>
                        </Form>
                        <Table scroll={{ x: 800 }} columns={columns} dataSource={dataList} pagination={false}/>
                        <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
                                  
                    </TabPane>
                    <TabPane tab="评课模板" key="2" className="content-form">
                        <Form>
                            <Row gutter={24}>
                                <Col span={4}>
                                    <FormItem label="">
                                        {getFieldDecorator('kw1')(
                                            <Search placeholder="模板名称"/>
                                        )}
                                    </FormItem>
                                </Col> 
                                 <Col span={6} >
                                    <FormItem {...formItemLayout2} label={'日期：'}>
                                        {getFieldDecorator("timer",{})(
                                            <RangePicker/>
                                        )} 
                                    </FormItem>
                                </Col>
                                <Col span={8} offset={0}>
                                    <Button type='primary' onClick={this.search1.bind(this)} className="marginTop">查询</Button>
                                    <Button type='primary' onClick={this.addTemplate.bind(this)} style={{margin:'5px 10px 0 10px'}}>新增模板</Button>
                                   
                                </Col>
                               
                            </Row>
                        </Form>
                        <Table scroll={{ x: 800 }} columns={columns1} dataSource={dataList1} pagination={false}/>
                        <PageIndex getPage={this.onPageChange1.bind(this)} total={templateList.totalCount} totalPage={templateList.totalPage} currentPage={templateList.currentPage}/>
                                   
                    </TabPane>
                </Tabs>
                <Modal
                    title="新增模板"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Row gutter={24}>
                            <Col span={22}>
                                <FormItem {...formItemLayout} label="模板名称：">
                                    {getFieldDecorator('addTemplateName',{rules:[{required:true,message:"请输入模板名称"},{max:30,message:"最多输入30个字"}]})(
                                        <Input  placeholder="输入模板名称，30字以内" max={30}/>
                                    )}
                                </FormItem>
                            </Col> 
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    
                    title="编辑模板"
                    visible={visible1}
                    onOk={this.onOk}
                    confirmLoading={confirmLoading1}
                    onCancel={this.handleCancel1}
                >
                    <Form>
                        <Row gutter={24}>
                            <Col span={22}>
                                <FormItem {...formItemLayout} label="模板名称">
                                    {getFieldDecorator('templateName',{initialValue:templateName&&this.state.templateName||'',rules:[{required:true,message:"请输入模板名称"},{max:30,message:"最多输入30个字"}]})(
                                        <Input  placeholder="输入模板名称，30字以内" max={30}/>
                                    )}
                                </FormItem>
                            </Col> 
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    width={200}
                    visible={this.state.show}
                    onCancel={this.cancel}
                    footer={null}
                    closable={false}
                    centered
                >
                    <QRCode
                        className="qrCode"
                        value={this.state.qrUrl}  //value参数为生成二维码的链接
                        fgColor="#000000"  //二维码的颜色
                    />
                </Modal>
           

            </div>
        )
    }

   
}

const mapStateToProps = (state) => {
    return {
      
    }
  }
  
export default connect(mapStateToProps)(Form.create()(EvaluationManage));