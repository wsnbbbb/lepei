import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import { portUrl } from '../../utils/img'
import {getApplyStatus, onlyDate, formatDate} from '../../utils/public';
// import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class LeaveList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          exportUrl:''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getLeaveList(params)
      this.props.dispatch({
        type:'user/getLeaveType',
        payload:{},
        callback:(res)=>{
          console.log(res)
        }
      })
    }
    getLeaveList=(params)=>{
      this.props.dispatch({
        type:'leave/getApplyLeave',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "applyTypeId":values.applyTypeId,
          "status":values.status,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getLeaveList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'leave/delLeaveApply',
            payload:{"applyLeaveId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "applyTypeId":values.applyTypeId,
                    "status":values.status,
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getLeaveList(params)
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
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "applyTypeId":values.applyTypeId,
          "status":values.status,
          "startTime":this.state.startTime||"",
          "endTime":this.state.endTime||""
        }
        this.getLeaveList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/leave-detail?leaveId="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    // 导出
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let applyTypeId = values.applyTypeId ||'';
        let status = values.status||'';
        let startTime = this.state.startTime||'';
        let endTime = this.state.endTime||'';
        let url=portUrl("/manager/apply-leave/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+
          "&applyTypeId="+applyTypeId+"&status="+status+"&startTime="+startTime+"&endTime="+endTime)
        this.setState({exportUrl:url})
       
      })
    }
    render(){
        const columns = [{
            title: '申请人',
            dataIndex: 'personName',
          }, {
            title: '请假类型',
            dataIndex: 'applyTypeName',
          }, {
            title: '时长',
            dataIndex: '',
            render:(record)=>{
              return(<span>{record.days}天{record.hours}小时</span>)
            }
          }, {
            title: '审批状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span style={{color:record==1?"green":(record==4?"red":"")}}>{getApplyStatus(record)}</span>)
            }
          }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '请假原因',
            dataIndex: 'reason',
            className:'reason',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="reason-content">{record}</span>
            </Tooltip>)}
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record.id)}>查看</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span:0 },
            wrapperCol: { span: 24 }
          };
          const {leaveList,leaveTypes} = this.props;
          console.log(leaveTypes)
          let opts=[];
          leaveTypes&&leaveTypes.map(item=>{
            opts.push(<Option value={item.id}>{item.name}</Option>)
          })
          const menu = (
            <Menu>
              <Menu.Item>
                {/* <a href="javascript:;">请假类型管理</a> */}
                <Link to="leave-type">请假类型管理</Link> 
              </Menu.Item>
              <Menu.Item>
                <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
              </Menu.Item>
            </Menu>
          );
          if(!leaveList){
            return null;
          }
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入申请人"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'请假类型'}>
                      {getFieldDecorator("applyTypeId",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          {opts}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'审批状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select showSearch onChange={this.handleChange.bind(this)} >
                          <Option value="">全部</Option>
                          <Option value="0">取消申请</Option>
                          <Option value="1">待审核</Option>
                          <Option value="2">审批中</Option>
                          <Option value="3">已通过</Option>
                          <Option value="4">未通过</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} >
                      <FormItem {...formItemLayout2} label={''}>
                        {getFieldDecorator("time",{initialValue:''})(
                          <RangePicker onChange={this.onTimeChange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                    <Dropdown overlay={menu} >
                      <a className="ant-dropdown-link" style={{marginTop:10,display:'inline-block'}}>
                        展开 <Icon type="down" />
                      </a>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={leaveList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={leaveList.totalCount} totalPage={leaveList.totalPage} currentPage={leaveList.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     leaveList:state.leave,
     leaveTypes:state.user.leaveTypes
  }
}
export default connect(mapStateToProps)(Form.create()(LeaveList));
