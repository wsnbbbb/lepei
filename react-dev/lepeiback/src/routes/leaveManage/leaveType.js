import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Breadcrumb,Tooltip } from 'antd';
import { routerRedux,Link } from 'dva/router';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class LeaveType extends Component{
    constructor(props) {
        super(props);
        this.state = {
          title:'请假类型管理'
        };
    }
    componentDidMount=()=>{
        const params={"kw":""}
        this.getLeaveType(params)
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title,
            parentRoute:"/leave-manage"
          },
          })
    }

    
    getLeaveType=(params)=>{
      this.props.dispatch({
        type:'user/getLeaveType',
        payload:params,
        callback:(res)=>{
            console.log(res)
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "kw":values.kw||'',
        }
        this.getLeaveType(params)
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
            type:'leave/delLeaveType',
            payload:{"typeId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "kw":values.kw||'',
                  }
                  me.getLeaveType(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    goToDetail=(type,id)=>{
      if(type==1){
        this.props.dispatch(routerRedux.push("/add-leave-type?type=1"))
      }else{
        this.props.dispatch(routerRedux.push("/add-leave-type?type=2&id="+id))
      }
      
    }
    render(){
        const text = <span>未制定规则，审批人由申请人制定</span>;
        const columns = [{
            title: '类型名称',
            dataIndex: 'name',
          }, {
            title: '简介',
            dataIndex: 'intro',
            className:'reason',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="reason-content">{record}</span>
            </Tooltip>)}
          }, 
          {
            title: '所属分类',
            dataIndex: 'category',
            render: (record) => {
              return (<span>{record == 0 ? '事假' : (record == 1 ? '病假' : '其他')}</span>)
            }
          },{
            title: '审批规则',
            dataIndex: 'approvalRules',
            render:(record)=>{
              return(<span>{!record?<span>默认 <Tooltip placement="bottom" title={text}>
                    <Icon type="question-circle" />
                    </Tooltip></span>:<span>自定义规则</span>}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.id)}>查看</a> 
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
          const {leaveTypes} = this.props;
          if(!leaveTypes){
            return null;
          }
        return (
            <div className="leave-main content-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/leave-manage">教职工请假管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>请假类型管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                        <Col span={5}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                                <Search placeholder="请输入请假类型名称"/>
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                        <Col span={2} >
                            <Button onClick={this.goToDetail.bind(this,1)}>添加</Button>
                        </Col>
                    </Row>
                </Form>              
                <Table className='content-table' columns={columns} dataSource={leaveTypes} pagination={false}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     leaveTypes:state.user.leaveTypes
  }
}
export default connect(mapStateToProps)(Form.create()(LeaveType));
