import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Tooltip,Modal,DatePicker, message } from 'antd';
import PageIndex from '../../components/page';
import { Link } from 'dva/router';
import { onlyDate } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class FeedbackList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          currentTab:'1',
          page:1,
          prePage:20,
          List:[],
          dataList:[],
          startTime:'',
          endTime:'',
          exportUrl:'',
          visible:false,
          confirmLoading:false,
          detailList:[],
          recordId:'',
          replayVal:''
          
        };
    }
    componentDidMount=()=>{
        const params={
            "page":1,
            "prePage":20,
            "replyStartTime":'',
            "replyEndTime":''
          }
        this.getFeedbackList(params)
    }
    getFeedbackList = (params)=>{ //获取意见反馈列表
        this.props.dispatch({
            type:'ideaFeedback/getFeedbackList',
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
    
    // 查询
    search =()=>{
        this.props.form.validateFields((err, values) => {
            const rangeValue = values['time'];
            const rangeValue1 = values['time1'];
            const params={
              "page":1,
              "prePage":this.state.prePage,
              "kw":values.kw||'',
              "status":values.status||'',
              "feedbackStartTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
              "feedbackEndTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
              "replyStartTime":rangeValue1&&rangeValue1.length>0?(Date.parse(new Date(rangeValue1&&rangeValue1[0])).toString()).substr(0,10):'',
              "replyEndTime":rangeValue1&&rangeValue1.length>0?(Date.parse(new Date(rangeValue1&&rangeValue1[1])).toString()).substr(0,10):'',
            }
           
            this.getFeedbackList(params)
        })
    }
   
    // 分页
    onPageChange =(current,size)=>{
        this.props.form.validateFields((err, values) => {
            this.setState({page:current,prePage:size})
            const rangeValue = values['time'];
            const rangeValue1 = values['time1'];
            const params={
              "page":current,
              "prePage":size,
              "kw":values.kw||'',
              "status":values.status||'',
              "feedbackStartTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
              "feedbackEndTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
              "replyStartTime":rangeValue1&&rangeValue1.length>0?(Date.parse(new Date(rangeValue1&&rangeValue1[0])).toString()).substr(0,10):'',
              "replyEndTime":rangeValue1&&rangeValue1.length>0?(Date.parse(new Date(rangeValue1&&rangeValue1[1])).toString()).substr(0,10):'',
            } 
            this.getFeedbackList(params)
        })
    }
   
    // 查看
    feedbackDetail =(id)=>{
        this.props.dispatch({
            type:'ideaFeedback/getFeedbackDetail',
            payload:{id},
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        detailList:res.data,
                        recordId:res.data.id,
                        replayVal:res.data.replyContent,
                        visible: true,
                    })
                }
            }
        })
        
    }
    handleOk = ()=>{
        if(!this.state.replayVal){
            message.error("请输入回复内容！")
            return
        }
        const params = {
            id:Number(this.state.recordId),
            replyContent:this.state.replayVal
        }
        console.log({params});
        
        this.props.dispatch({
            type:'ideaFeedback/suggestionReply',
            payload:params,
            callback:(res)=>{
                if(res.code === 200){
                    message.success("意见回复成功！")
                    this.setState({
                        confirmLoading: true,
                    });
                    setTimeout(() => {
                        this.setState({
                          visible: false,
                          confirmLoading: false,
                        });
                    }, 500);
                    this.search()
                }
            }
            
        })
        
    }
    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };
    replyContent = (e)=>{
        this.setState({
            replayVal:e.target.value
        })
    }
    // 删除
    delFeedback = (id)=>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                    type:'ideaFeedback/delFeedback',
                    payload: {id},
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("删除成功！")
                            that.search()
                        }
                    }
                })
            },
            onCancel() {},
        })
    }
    render(){
        const {List,dataList, visible, detailList,confirmLoading} = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
        };
        const formItemLayout2 = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
        };
        const columns = [
            {
                title: '意见类型',
                dataIndex: 'typeName',
            },{
                title: '手机号',
                dataIndex: '',
                render:(record)=>{
                    return( <span >{record.isAnonymous==1?"匿名":(record.isAnonymous==0?record.tel:"")}</span>)
                }
                
            },{
                title: '反馈时间',
                dataIndex: 'feedbackTime',
                render:(record)=>{
                    return(<span>{onlyDate(record)}</span>)
                }
            },{
                title: '反馈内容',
                dataIndex: 'feedbackContent',
                render:(record)=>{
                    return(
                    <Tooltip placement="top" title={record}>
                      <span className="text">{record}</span>
                    </Tooltip>)
                }
            },{
                title: '回复人',
                dataIndex: 'handlerName',
                
            },{
                title: '回复时间',
                dataIndex: 'replyTime',
                render:(record)=>{
                    return(<span>{onlyDate(record)}</span>)
                }
            },{
                title: '操作',
                dataIndex: '',
                width:150,
                fixed:'right',
                render:(text, record) => (
                  <span>
                    <a href="javascript:;"  onClick={this.feedbackDetail.bind(this,record.id)}>查看</a>&emsp;
                    <a href="javascript:;"  onClick={this.delFeedback.bind(this,record.id)}>删除</a>
                  </span>
                )
            },
        ]
        return (
            <div className="content-main idea-feedback">
                <Form>
                    <Row gutter={24}>
                        <Col span={5}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                                <Search placeholder="意见类型/手机号/反馈内容/回复人"/>
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={3}>
                        <FormItem {...formItemLayout} label={'状态'}>
                            {getFieldDecorator("status",{initialValue:''})(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">未回复</Option>
                                    <Option value="2">已回复</Option>
                                </Select>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={6} >
                            <FormItem {...formItemLayout} label={'反馈时间'}>
                                {getFieldDecorator("time",)(
                                    <RangePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} >
                            <FormItem {...formItemLayout} label={'回复时间'}>
                                {getFieldDecorator("time1",)(
                                    <RangePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4} >
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                            <Button><Link to="/opinion-type-management">意见类型管理</Link></Button>
                        </Col>
                        
                    </Row>
                </Form>
                <Table scroll={{ x: 800 }} columns={columns} dataSource={dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={List.totalCount} totalPage={List.totalPage} currentPage={List.currentPage}/>
                <Modal
                    width={800}
                    title="查看"
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Row gutter={24} >
                            <Col span={11}>
                                <FormItem {...formItemLayout} label={'意见类型'}>
                                    <Input value={detailList.typeName} disabled/>
                                </FormItem>
                            </Col> 
                            <Col span={11}>
                            <FormItem {...formItemLayout} label={'反馈人'}>
                                    <Input value={detailList.isAnonymous==1?"匿名":detailList.tel} disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} >
                            <Col span={11}>
                                <FormItem {...formItemLayout} label={'反馈时间'}>
                                    <Input value={onlyDate(detailList.feedbackTime)} disabled/>
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24} >
                            <Col span={22}>
                                <FormItem {...formItemLayout2 } label={'反馈内容'}>
                                    <TextArea rows={5} value={detailList.feedbackContent} disabled/>
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24} >
                            <Col span={11}>
                                <FormItem {...formItemLayout} label={'回复人'}>
                                    <Input value={detailList.handlerName} disabled/>
                                </FormItem>
                            </Col> 
                            <Col span={11}>
                            <FormItem {...formItemLayout} label={'回复时间'}>
                                    <Input value={onlyDate(detailList.replyTime)} disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} >
                            <Col span={22}>
                                <FormItem {...formItemLayout2 } label={'回复内容'}>
                                    <TextArea rows={5} onChange={this.replyContent.bind(this)} value={this.state.replayVal}/>
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
export default connect(mapStateToProps)(Form.create()(FeedbackList));
