import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Breadcrumb, Input,Select,Form,Row,Col,Progress, Icon,Menu,Dropdown,Badge,Popover,Modal,message,TreeSelect } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link} from 'dva/router';
import {getSexType, formatIdcard, formatDate, formatVoteStatus} from '../../utils/public';
import { portUrl } from '../../utils/img'
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;

class VoteList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          data: {},
          visible: false,
          rank: [],
          title: '',
          votingCount: 0,
          currentVotingId: '',
          exportUrl: ''
        };
    }
    componentDidMount=()=>{
       const params={
         "page":1,"prePage":20
       }
       this.getList(params)
    }
    // 列表
    getList=(params)=>{
      this.props.dispatch({
        type:'vote/getVoteList',
        payload:params,
        callback:(res) =>{
          if(res.code == 200) {
            this.setState({
              data: res.data
            })
          }
        }
      })
    }
    getDetail=(id)=>{
      this.props.dispatch({
        type:'vote/getVotingStatistics',
        payload:{
          id: id
        },
        callback:(res) =>{
          if(res.code == 200) {
            this.setState({
              currentVotingId: id,
              rank: res.data.rank,
              visible: true,
              title: res.data.title,
              votingCount: res.data.votingCount
            })
          }
        }
      })
    }

    handleCancel=()=>{
      this.setState({
        visible: false
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "status": values.status||''
        }
        this.setState({page: 1})
        this.getList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条信息吗？',
        onOk() {
          me.props.dispatch({
            type:'vote/deleteVoting',
            payload:{"id": id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page": me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||''
                  }
                  me.getList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }

    // 停止/启动投票
    showConfirm1=(id, status)=> {
      let content = ''
      if(status == 4){
        content = "确定要启动吗？"
      }else{
        content = "确定要停止吗？"
      }
      let me=this;
      confirm({
        title: '提示',
        content: content,
        onOk() {
          me.props.dispatch({
            type:'vote/votingChange',
            payload:{"id": id, "type": status==4?1:2},
            callback:(res)=>{
              if(res.code===200){
                message.success(status == 4?'启动成功！':"已停止！",3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page": me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||''
                  }
                  me.getList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }


    // 分页
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page": current,
          "prePage": size,
          "kw": values.kw||'',
          "status": values.status||''
        }
        this.getList(params)
      })
    }
    // 添加/查看
    goToDetail1=(type,id)=>{
      if(Number(type)===1){
        this.props.dispatch(routerRedux.push("/teacher-detail?role=2&type="+type))
      }else{
        this.props.form.validateFields((err, values) => {
          let params={
            "page":this.state.page,
            "prePage":this.state.prePage,
            "personType":2,
            "kw":values.kw||'',
            "departmentId":values.departmentId,
            "jobId":values.jobId||''
          }
          sessionStorage.setItem('teacherManageParams',JSON.stringify(params))
        })
        this.props.dispatch(routerRedux.push("/teacher-detail?role=2&type="+type+"&personId="+id))
      }
    }

    goToDetail=(id)=>{
        this.props.dispatch(routerRedux.push("/vote-detail?type=1&id=" + id))
    }

    addNew=(id)=>{
      this.props.dispatch(routerRedux.push("/vote-detail?type=0"))
    }

    export=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let id = this.state.currentVotingId;
        let url=portUrl("/manager/voting/statistics-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&id="+id)
        this.setState({exportUrl: url})
    }
 
    // 重置
    // reset = () => {
    //   this.props.form.resetFields(["kw", "status"])
    // }
    render(){        
        const columns = [{
            title: '名称',
            dataIndex: 'title',
          },{
            title: '开始时间',
            dataIndex: 'startTime',
            width: 200,
            render:(record) => (
              <span>{formatDate(record)}</span>
            )
          },{
            title: '结束时间',
            dataIndex: 'endTime',
            width: 200,
            render:(record) => (
              <span>{formatDate(record)}</span>
            )
          },{
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render:(record) => (
              <span>{formatVoteStatus(record)}</span>
            )
          }, {
            title: '票数',
            dataIndex: 'votingCount',
          },{
            title: '操作',
            dataIndex: '',
            width: 210,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.getDetail.bind(this, record.id)}>投票统计</a> 
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this, record.id)}>详情</a>
                <a href="javascript:;" className="check-btn" onClick={this.showConfirm1.bind(this, record.id, record.status)}>{record.status==4?<span>启动</span>:<span style={{color: 'red'}}>停止</span>}</a>  
                {record.isAllowDel==0?null:<a href="javascript:;" onClick={this.showConfirm.bind(this,record.id)}>删除</a>}
              </span>
            )
          }];          

          const { data, visible, title, rank, votingCount} = this.state;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          };
         
      
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form teacher-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{initialValue: ''})(
                        <Search placeholder="名称" />
                      )}
                    </FormItem>
                  </Col> 
                
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'状态'}>
                      {getFieldDecorator("status",{initialValue: ''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">未开始</Option>
                          <Option value="2">进行中</Option>
                          <Option value="3">已结束</Option>
                          <Option value="4">已停止</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button type='primary' onClick={this.addNew.bind(this)}>添加</Button>
                  </Col>
                </Row>
            
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage}/>
              
              <Modal title={title} visible={visible} footer={null} onCancel={this.handleCancel} width={600}>
                <Row className="vote-modal-row"><p>总投票数（票）：{votingCount} </p></Row>
                <Row className="vote-modal-row"><p>排名： <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&nbsp;&nbsp;&nbsp;&nbsp;
                </p></Row>
                {rank.map((i, idx)=>{
                  return  <Row key={idx} className="vote-modal-row">
                            <Col span={2}>{i.name}</Col>
                            <Col span={16}><Progress percent={i.percent} status="active" /></Col>
                            <Col span={4} offset={2}>{i.votingCount} 票</Col>
                          </Row>
                })}
               
                
              </Modal>

            </div>

        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    personList:state.person,
    jobList:state.user.commonJobList
  }
}

export default connect(mapStateToProps)(Form.create()(VoteList));
