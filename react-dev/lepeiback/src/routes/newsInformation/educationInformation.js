import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs, Form, Button, DatePicker, Input,Row, Col,Table, Modal, message, Select, Icon} from 'antd';
import BraftEditor from 'braft-editor';
import PageIndex from '../../components/page';
import Page from '../../components/minPage';
import { routerRedux } from 'dva/router';
import { getImg } from '../../utils/img';
import { formatPhone } from '../../utils/public'
import './style.less';
import { log } from 'util';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { Option } = Select;
const { TextArea } = Input;

class EducationInformation extends Component{
    constructor(props){
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            flag:true,
            page:1,
            prePage:20,
            status:'',
            msgStatus:'',
            newList:{},
            articleList:{},
            detailList:[],// 新闻列表
            msgDataList:[],
            type:1,
            imageUrl:'',
            loading: false,
            msgList:[], 
            msgDetail:[], //留言列表
            newId:0,
            page1:1,
            prePage1:20,
            page2:1,
            prePage2:20,
            active:0,
            msgId:'',
            realName:'',
            visible: false,
            replayVal:'',
            disabled:true
        }
    }
    componentDidMount = () => {
        const params={
            "kw":"",
            "page":this.state.page,
            "prePage":this.state.prePage,
            "status":''
        }
        
        this.getNewsList(params)
       
       
    }
    //选项卡切换
    changeTab = (key) => {
        if(key == 2){
            if(!this.state.flag) return
            const params={
                "kw":"",
                "page":this.state.page2,
                "prePage":this.state.prePage2,
                "status":1
            }
            this.getAllAticle(params)
            this.setState({flag:false})
        }
    }
    
    // 获取新闻列表
    getNewsList = (params)=>{
        this.props.dispatch({
            type:'newsInformation/getNewsList',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    this.setState({
                        newList: res.data,
                        detailList:res.data.dataList,
                    })
                   
                }
            }
        })
    }
    // 全部文章
    getAllAticle = (params)=>{
        this.props.dispatch({
            type:'newsInformation/getAllAticle',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    this.setState({
                        articleList: res.data,
                        msgDataList:res.data.dataList,
                        newId:res.data.dataList[0].id
                    })
                    if(this.state.page2 == 1){
                        this.setState({
                            active:res.data.dataList[0].id,
                        })
                        const params = {
                            "articleId":res.data.dataList[0].id,
                            "kw":'',
                            "endTime":'',
                            "startTime":'',
                            "page":this.state.page1,
                            "prePage":this.state.prePage1,
                        }
                       this.getMsgList(params)
                    }
                   
                }
            }
        })
    }
    // 查询
    search = () => {
        this.props.form.validateFields(["kw","status"],(err, values) => {
        const params={
            "page":1,
            "prePage":this.state.prePage,
            "kw":values.kw||'',
            "status":values.status||''
        }
        this.getNewsList(params)
        })
        
    }
    
    // 新闻列表分页
    onPageChange=(current,size)=>{
        this.props.form.validateFields(["kw","status"],(err, values) => {
          this.setState({page:current,prePage:size})
          const params={
            "page":current,
            "prePage":size,
            "kw":values.kw||'',
            "status":values.status||''
          }
          this.getNewsList(params)
        })
    }
   
    // 发布
    publish = ()=>{
        this.props.dispatch(routerRedux.push("/add-news"))
    }
    // 编辑新闻
    editNews = (id)=>{
        this.props.dispatch(routerRedux.push("/add-news?id="+id))
    }
  
    // 删除新闻
    delNews = (id)=>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                    type:'newsInformation/delNews',
                    payload: {id},
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("删除成功！")
                            that.props.form.validateFields(["kw","status"],(err, values) => {
                                const params={
                                    "page":that.state.page,
                                    "prePage":that.state.prePage,
                                    "kw":values.kw||'',
                                    "status":values.status||''
                                }
                                that.getNewsList(params)
                            })
                         
                        }
                    }
                })
            },
            onCancel() {},
        })
    }
    // 状态选择
    choice = (id,value)=>{
        let params={
            "articleId":id,
            "status":value
        }
        this.props.dispatch({
            type:'newsInformation/updateStatus',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    message.success("状态修改成功！")
                    this.getNewsList()
                    this.getAllAticle()
                }
            }
        })

    }
    // 留言列表
    getMsgList = (params)=>{
        this.props.dispatch({
            type:'newsInformation/getMsgList',
            payload: params,
            callback: (res)=>{
                this.setState({
                    disabled:false,
                    msgList: res.data,
                    msgDetail:res.data.dataList,
                })
            }
        })

    }
    // 留言列表查询
    searchMsg = ()=>{
        this.props.form.validateFields(["kw1","time"],(err, values) => {
            const rangeValue = values['time'];
            const params = {
                "articleId":this.state.newId,
                "kw":values.kw1||'',
                "endTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
                "startTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
                "page":1,
                "prePage":this.state.prePage1,
            }

            this.getMsgList(params)

        })
        
    }
   
    clickTitle = (id)=>{
        this.props.form.resetFields(["kw1","time"])
        this.setState({
            newId:id,
            active:id
        },function(){
            const params = {
                "articleId":id,
                "kw":'',
                "endTime":'',
                "startTime":'',
                "page":1,
                "prePage":this.state.prePage1,
            }
            this.getMsgList(params)
        })
        
    }
    // 全部文章分页
    onPageChange2 = (current,size)=>{
        this.setState({
            page2:current,
            prePage2:size
        })
        if(current != 1){
            this.setState({disabled:true})
        }
        const params = {
            "page":current,
            "prePage":size,
        }
        this.getAllAticle(params)
    }
   
    // 留言列表分页
    onPageChange1 = (current,size)=>{
        this.props.form.validateFields(["kw1","time"],(err, values) => {
            const rangeValue = values['time'];
          this.setState({page1:current,prePage1:size})
            const params={
                "articleId":this.state.newId,
                "kw":values.kw1||'',
                "endTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
                "startTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
                "page":current,
                "prePage":size,
            }
            console.log({params});
            
            this.getMsgList(params)
        })
    }
    // 改变精选状态
    changeStatus = (id,val)=>{
        let that = this
        confirm({
            title: '提示',
            content: <span>确定要{val==1?"移出精选":"移入精选"}吗？</span>,
            onOk() {
                let params = {
                    "commentId":id,
                    "status":val == 1 ? 2 : 1
                }
                that.props.dispatch({
                    type:'newsInformation/changeStatus',
                    payload: params,
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("修改成功！")
                            that.props.form.validateFields(["kw1","time"],(err, values) => {
                                const rangeValue = values['time'];
                                const params={
                                    "articleId":that.state.newId,
                                    "kw":values.kw1||'',
                                    "endTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
                                    "startTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
                                    "page":that.state.page1,
                                    "prePage":that.state.prePage1
                                }
                                that.getMsgList(params)
                            })
                        }
                    }
                })
            },
            onCancel() {},
        })
    }
    // 回复留言
    replay = (id,name)=>{
        this.setState({
            visible: true,
            realName:name,
            msgId:id
        });
    }
    replayMsg = (e)=>{
        this.setState({
            replayVal:e.target.value
        })
    }
    handleOk = ()=>{
        let params = {
            commentId:this.state.msgId,
            replyContent:this.state.replayVal
        }
        this.props.dispatch({
            type:'newsInformation/replayMsg',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    message.success("回复成功！")
                    this.setState({
                        visible: false,
                        replayVal:''
                    });
                }
            }
        })
        
    }
    handleCancel = e => {
        this.setState({
          visible: false,
          replayVal:''
        });
    };
    // 删除留言
    delMsg = (id)=>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定要删除这条信息吗？</span>,
            onOk() {
                that.props.dispatch({
                    type:'newsInformation/delMsg',
                    payload: {"commentId":id},
                    callback: (res)=>{
                        if(res.code===200){
                            message.success("删除成功！")
                            that.props.form.validateFields(["kw1","time"],(err, values) => {
                                const rangeValue = values['time'];
                                const params={
                                    "articleId":that.state.newId,
                                    "kw":values.kw1||'',
                                    "endTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[1])).toString()).substr(0,10):'',
                                    "startTime":rangeValue&&rangeValue.length>0?(Date.parse(new Date(rangeValue&&rangeValue[0])).toString()).substr(0,10):'',
                                    "page":that.state.page1,
                                    "prePage":that.state.prePage1
                                }
                                that.getMsgList(params)
                            })
                         
                        }
                    }
                })
            },
            onCancel() {},
        })
    }
    render(){
      const { newList, detailList,msgList,msgDetail,active,realName,articleList,msgDataList,} = this.state
      const { getFieldDecorator } = this.props.form;
      const defaultPic = require("../../assets/default.png")
      const formItemLayout = {
        labelCol: { span:3 },
        wrapperCol: { span: 21 }
      };
      let title = `回复${realName}的留言`
      const columns = [
        {
            title: '序号',
            dataIndex: 'id',
        },
        {
            title: '标题',
            dataIndex: 'title',
            render:(record)=>{
                return(
                  <span className="text">{record}</span>
                )
            }
        },
        {
            title: '是否置顶',
            dataIndex: 'isTop',
            render:(record)=>{
                return( <span >{record==0?"否":(record==1?"是":"")}</span>)
            }
        },
        {
            title: '置顶时间',
            dataIndex: 'topTime',
            
        },
        {
            title: '发布来源',
            dataIndex: 'publishPlatform',
            render:(record)=>{
                return( <span >{record==1?"运营平台":(record==2?"学校后台":(record==3?"教师端":""))}</span>)
            }
        },
        {
            title: '发布人',
            dataIndex: 'publisherName',
        },
        {
            title: '添加时间',
            dataIndex: 'createTime',
        },
        {
            title: '点击量',
            dataIndex: 'clicksNum',
        },
        {
            title: '留言数',
            dataIndex: 'commentNum',
        },
        {
            title: '状态',
            dataIndex: 'status',
            width:100,
            render:(text,record) =>{
                return (
                    <div className="choice">
                        <Select onChange={this.choice.bind(this,record.id)} value={record.status==1?"显示":(record.status==3?"隐藏":"待审核")} >
                            <Option value={1}>显示</Option>
                            <Option value={3}>隐藏</Option>
                            <Option value={0}>待审核</Option>
                        </Select>
                    </div>
                   
                )
            }
        },
        {
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text,record) =>(
                <span>
                    <a href="javascript:;"  onClick={this.editNews.bind(this,record.id)}>编辑</a>&emsp;
                    <a href="javascript:;"  onClick={this.delNews.bind(this,record.id)}>删除</a>  
                </span>
            )
        },
      ]
      const columns1 = [
        {
            title: '留言',
            dataIndex: '',
            width:500,
            render:(record) =>{
                return (<div className="msgInfo">
                    <div className="img">
                        <img src={record.portrait !=null?getImg(record.portrait):defaultPic} alt=""/>
                    </div>
                    <div>
                        <p className="user">{record.realName}({formatPhone(record.username)})的留言</p>
                        <p>{record.content}</p>
                    </div>
                </div>)
            }
        },
        {
            title: '留言时间',
            dataIndex: 'createTime',
        },
        {
            title: '留言状态',
            dataIndex: 'status',
            render:(record)=>{
                return( <span >{record==0?"待审核":(record==1?"已精选":(record==2?"未精选":""))}</span>)
            }
        },
        {
            title: '操作',
            dataIndex: '',
            fixed:'right',
            width:200,
            render:(text,record) =>(
                <span>
                    <a href="javascript:;"  onClick={this.changeStatus.bind(this,record.id,record.status)}>{record.status==1?"移出精选":"移入精选"}</a>&emsp;
                    <a href="javascript:;"  onClick={this.replay.bind(this,record.id,record.realName)}>回复</a>&emsp;
                    <a href="javascript:;"  onClick={this.delMsg.bind(this,record.id)}>删除</a>  
                </span>
            )
        },
      ]
        return(
            <div className="content-main">
                 <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                    <TabPane tab="教育资讯" key="1" className="content-form">
                        <Form>
                            <Row gutter={24}>
                                <Col span={4}>
                                    <FormItem label="">
                                        {getFieldDecorator('kw')(
                                            <Search placeholder="标题"/>
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={4} >
                                    <FormItem >
                                        {getFieldDecorator('status')(
                                            <Select placeholder="全部/显示/隐藏">
                                                <Option value="-1">全部</Option>
                                                <Option value="1">显示</Option>
                                                <Option value="3">隐藏</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} offset={0}>
                                    <Button type='primary' onClick={this.search.bind(this)} >查询</Button>
                                    <Button type='primary' onClick={this.publish.bind(this)} style={{margin:'5px 10px 0 10px'}}>发布</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table scroll={{ x: 800 }} columns={columns}  dataSource={detailList} pagination={false}/>
                        <PageIndex getPage={this.onPageChange.bind(this)} total={newList.totalCount} totalPage={newList.totalPage} currentPage={newList.currentPage}/>
                                
                    </TabPane>
                    <TabPane tab="留言管理" key="2" className="content-form msg-manage">
                        <div>
                            <div className="menu">
                                <h4>全部文章</h4>
                                <div className="content">
                                    {
                                        msgDataList&&msgDataList.map((item,index) => {
                                            return item.status == 1 ? <div className={active===item.id?"bgColor article":"article"} key={index} onClick={this.clickTitle.bind(this,item.id)}>
                                                        <p className="title">{item.title}</p>
                                                        <p className="info">
                                                            <span>{item.createTime}</span>
                                                            <span>{item.commentNum}条</span>
                                                            <span><Icon type="like" /> {item.likesNum}</span>
                                                        </p>
                                                    </div> : null
                                        })
                                    }
                                    
                                </div>
                            </div>
                            <Page getPage={this.onPageChange2.bind(this)} total={articleList.totalCount} totalPage={articleList.totalPage} currentPage={articleList.currentPage}/>
                        </div>
                        <div className="message">
                            <Form>
                                <Row gutter={24}>
                                    <Col span={6}>
                                        <FormItem label="">
                                            {getFieldDecorator('kw1')(
                                                <Search placeholder="手机号/昵称/留言内容"/>
                                            )}
                                        </FormItem>
                                    </Col> 
                                    <Col span={6} >
                                        <FormItem {...formItemLayout} label={'日期：'}>
                                            {getFieldDecorator("time",)(
                                                <RangePicker />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={3} offset={0}>
                                        <Button type='primary' onClick={this.searchMsg.bind(this)} disabled={this.state.disabled}>查询</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Table scroll={{ x: 800 }} columns={columns1} dataSource={msgDetail} pagination={false}/>
                            <PageIndex getPage={this.onPageChange1.bind(this)} total={msgList.totalCount} totalPage={msgList.totalPage} currentPage={msgList.currentPage}/>
                            <Modal
                                title={title}
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                               <TextArea rows={4} onChange={this.replayMsg.bind(this)} value={this.state.replayVal} placeholder="请输入回复"/>
                            </Modal>
                        </div>
                        
                    </TabPane>
                </Tabs>

            </div>
        )
    }

   
}

const mapStateToProps = (state) => {
    return {
      
    }
  }
  
export default connect(mapStateToProps)(Form.create()(EducationInformation));