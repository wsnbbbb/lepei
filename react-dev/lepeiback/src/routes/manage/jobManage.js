import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Form,Row,Col,Icon,Tooltip,Dropdown,Modal,message, Select } from 'antd';
import PageIndex from '../../components/page';
// import {Link} from 'dva/router';
import { routerRedux } from 'dva/router';

import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class JobMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          jobList:{}
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      let jobManageParams = JSON.parse(sessionStorage.getItem('jobManageParams'))
      if(jobManageParams){
        this.setState({
          page:jobManageParams.page,
          prePage:jobManageParams.prePage,
          kw:jobManageParams.kw,
          authStatus:jobManageParams.authStatus
        })
        this.getJobList(jobManageParams)
      }else{
        this.getJobList(params)
      }
    }

    // 获取列表
    getJobList=(params)=>{
      this.props.dispatch({
        type:'job/getJobList',
        payload:params,
        callback:(res) =>{
          if(res.code == 200) {
            this.setState({
              jobList:res.data
            })
            sessionStorage.removeItem('jobManageParams')
          }
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "kw":values.kw||'',
          "authStatus":values.authStatus||'',
          "page":1,
          "prePage":this.state.prePage
        }
        this.getJobList(params)
        this.setState({page:1})
      })
    }
     // 分页
     onPageChange = (current,size) => {
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "kw":values.kw||'',
          "authStatus":values.authStatus||'',
          "page":current,
          "prePage":size,
        }
        this.getJobList(params)
      })
    }

    // 删除
    showConfirm = (id) => {
      let that = this;
      confirm({
        title: '提示',
        content: '确定要删除职务信息吗？',
        onOk() {
          that.props.dispatch({
            type:'job/delJob',
            payload:{"jobId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',2)
                that.onPageChange(that.state.page,that.state.prePage)
              }
            }
          })
        },
        onCancel() {},
      });
    }

    // 重置
    reset = () => {
      this.props.form.resetFields(["kw", "authStatus"])
      this.setState({
        kw:'',
        authStatus:''
      })
      sessionStorage.removeItem('jobManageParams')
    }
    // 添加/查看
    goToDetail = (type,id) =>{
      if(Number(type) === 1){
        this.props.dispatch(routerRedux.push("/job-detail?type="+type))
      }else{
        this.props.form.validateFields((err, values) => {
          let params = {
            "kw":values.kw||'',
            "authStatus":values.authStatus||'',
            "page":this.state.page,
            "prePage":this.state.prePage,
          }
          sessionStorage.setItem('jobManageParams',JSON.stringify(params))
        })
        this.props.dispatch(routerRedux.push("/job-detail?type="+type+"&jobId="+id))
      }
    }

    render(){
      const formItemLayout = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
      };
      const columns = [{
        title: '职务名称',
        dataIndex: 'jobName',
      }, {
        width:600,
        title: '职务简介',
        dataIndex: 'intro',
        className:'intro',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span className="text">{record}</span>
          </Tooltip>
        )
      }, {
        title: '功能权限',
        dataIndex: 'accessCount',
        render:(record)=>{
          return record==0 ? <span>无</span> : <span>{record ? record : '0'}个权限</span>
        }
      }, {
        title: '数据权限',
        dataIndex: 'dataAuthType',
        render:(record) =>{
          if(record == 0) return "无"
          if(record == 1) return "全校"
          if(record == 2) return "年级"
          if(record == 3) return "班级"
        }
      }, {
        title: '状态',
        dataIndex: 'authStatus',
        render:(record) =>{
          return <span style={{color:record == 1 ? '#52C41A' : (record == 2 ? '#f00' : '')}}>{record == 1 ? '启用' : (record == 2 ? '禁用' : '')}</span>
        }
      },{
        title: '操作',
        dataIndex: '',
        width:120,
        render:(text, record) => (
          <span className="make-box">
            <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.jobId)}>查看</a> 
            <a href="javascript:;" onClick={this.showConfirm.bind(this,record.jobId)}>删除</a>
          </span>
        )
      }];
      const { getFieldDecorator } = this.props.form;
      const {jobList} =this.state;
      return (
          <div className="content-main">
            <Form className="ant-advanced-search-form content-form">
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label=''>
                    {getFieldDecorator('kw',{initialValue:this.state.kw ? this.state.kw : ''})(
                      <Search  placeholder="请输入职务名称"/>
                    )}
                  </FormItem>
                </Col> 
                <Col span={6}>
                  <FormItem {...formItemLayout} label={'当前状态'}>
                    {getFieldDecorator("authStatus",{initialValue:this.state.authStatus ? this.state.authStatus : ''})(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="2">禁用</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={1}>
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                  <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                  <Button type='primary' onClick={this.goToDetail.bind(this,1)}>添加</Button>
                </Col>
              </Row>
            </Form>              
            <Table className='content-table' columns={columns} dataSource={jobList.dataList} pagination={false}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={jobList.totalCount} totalPage={jobList.totalPage} currentPage={jobList.currentPage}/>
          </div>
      );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    //  jobList:state.job
  }
}

export default connect(mapStateToProps)(Form.create()(JobMange));
