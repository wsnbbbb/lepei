import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Drawer,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class ClassInformationList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          drawerVisible:false,
          readDetail:[],
          detailList:[],
          showNoReadTitle:'',
          noReadPerson:'',
          classNoticeList:{},
          list:[]
        };
    }
    componentDidMount = () =>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getClassNoticeList(params)
    }
    // 获取列表
    getClassNoticeList = (params) =>{
      this.props.dispatch({
        type:'classNotice/getClassNotice',
        payload:params,
        callback: res => {
          if(res.code === 200){
            this.setState({
              classNoticeList: res.data,
              list:res.data.dataList
            })
          }
        }
      })
    }
    // 查询
    search = () =>{
      this.props.form.validateFields((err, values) => {
        const params = {
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw || '',
          "startTime":this.state.startTime || "",
          "endTime":this.state.endTime || ""
        }
        this.getClassNoticeList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm = (id) => {
      let me = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'classNotice/delClassNotice',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code === 200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params ={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw || '',
                    "startTime":me.state.startTime || "",
                    "endTime":me.state.endTime || ""
                  }
                  me.getClassNoticeList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange = (current,size) => {
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw":values.kw || '',
          "startTime":this.state.startTime || "",
          "endTime":this.state.endTime || ""
        }
        this.getClassNoticeList(params)
      })
    }
    // 发布家长通知/编辑
    goToDetail = (type,id) =>{
      if(type == 1){
        this.props.dispatch(routerRedux.push("/class-notice-detail"))
      }else{
        this.props.dispatch(routerRedux.push("/class-notice-detail?id="+id))
      }
    }
    // 时间选择
    onTimeChange = (date, dateString) =>{
      const start = dateString[0] + " 00:00:00";
      const end = dateString[1] + " 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    // 阅读回执
    receipt = (id) => {
      this.props.dispatch({
        type:'classNotice/getReceipt',
        payload:{id},
        callback:res => {
          if(res.code === 200) {
            let list = []
            res.data && res.data.map(item => {
              list.push({
                classId: item.classId,
                className: item.className,
                readCount: item.readCount,
                totalCount: item.totalCount
              })
            })
            this.setState({ 
              receiptData: res.data,
              detailList: list,
              drawerVisible: true
            })
          }
        }
      })
    }
    // 阅读回执取消
    onClose = () => {
      this.setState({ 
        drawerVisible: false,
        noReadPerson:''
      });
    };
    // 未读人员查看
    showNoReadData = (id,name) => {
      let arr = this.state.receiptData
      let persons = []
      arr && arr.map(item =>{
        if(item.classId == id && item.notReadPersons.length > 0){
          item.notReadPersons.map(v =>{
            persons.push(v.personName)
          })
        }
      })
      this.setState({
        showNoReadTitle: `${name}未读人数（${persons.length}人）`,
        noReadPerson: persons.join("、")
      })
    }
   
    render(){
      const { drawerVisible,classNoticeList,detailList,list, showNoReadTitle,noReadPerson } = this.state;
      const { getFieldDecorator } = this.props.form;
      const columns = [{
          title: '标题',
          dataIndex: 'title',
          key:'title',
        }, {
          title: '发布人',
          dataIndex: '',
          key:'publisherName',
          render:(record) =>{
            return(<span>{record.publisherName}</span>)
          }
        }, {
          title: '阅读回执',
          dataIndex: '',
          key:'isReadingReceipt',
          render:(record) =>{
            return record.isReadingReceipt == 0 ? <span>不需要</span> : <a href="javascript:;" onClick={this.receipt.bind(this,record.id)}>{'已读 ' + record.readCount + '/' + record.totalCount}</a>
          }
            
        },{
          title: '发布时间',
          dataIndex: 'createTime',
          key:'createTime',
          render:(record)=>{
            return(<span>{formatDate(record)}</span>)
          }
        },{
          title: '操作',
          dataIndex: '',
          width:150,
          fixed:'right',
          render:(text, record) => (
            <span className="make-box">
              <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.id)}>编辑</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.showConfirm.bind(this,record.id)}>删除</a>
            </span>
          )
      }];
      const columns1 = [{
        title: '班级',
        dataIndex: '',
        key:'className',
        render:(record) =>{
          return(<span>{record.className + '（已读' + record.readCount + '人/' + record.totalCount + '人）'}</span>)
        }
      }, {
        title: '未读',
        dataIndex: '',
        width:120,
        key:'classId',
        render:(record) =>{
          return(<a style={{paddingLeft:'18px'}} href="javascript:;" onClick={this.showNoReadData.bind(this,record.classId,record.className)}>查看</a>)
        }
      }]
      return (
        <div>
          <Form className="ant-advanced-search-form content-form">
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Search placeholder="标题/内容/发布人模糊查找"/>
                  )}
                </FormItem>
              </Col> 
              <Col span={7}>
                <FormItem label=''>
                  {getFieldDecorator('time')(
                    <RangePicker onChange={this.onTimeChange} />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;&emsp;
                <Button type='primary' onClick={this.goToDetail.bind(this,1)}>发布通知</Button>
              </Col>
            </Row>
          </Form>              
          <Table rowKey={record=>record.id} className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={list} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={classNoticeList.totalCount} totalPage={classNoticeList.totalPage} currentPage={classNoticeList.currentPage}/>
          <Drawer
            title="阅读回执"
            placement="right"
            closable
            className="read-drawer"
            width={600}
            onClose={this.onClose}
            visible={drawerVisible}
          >
            <Table rowKey={record=>record.classId} scroll={{ y: 500 }} columns={columns1} dataSource={detailList} pagination={false}/>
            {
              noReadPerson ?
                <div className="no-read-person">
                  <h3 className="title">{showNoReadTitle}</h3>
                  <div>{noReadPerson}</div>
                </div> : null
            }
          </Drawer>
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    classNoticeList:state.classNotice
  }
}
export default connect(mapStateToProps)(Form.create()(ClassInformationList));
