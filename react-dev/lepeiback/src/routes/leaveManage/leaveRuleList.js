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
          
        };
    }
    componentDidMount=()=>{
        const params={"kw":""}
        this.getLeaveRule(params)
    }
    getLeaveRule=(params)=>{
      this.props.dispatch({
        type:'leave/getLeaveRule',
        payload:params,
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "kw":values.kw||'',
        }
        this.getLeaveRule(params)
      })
    }
    // 删除
    showConfirm=(id,level)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>{Number(level)<=1?"确定要删除这条信息吗？":"多层级审批暂无法删除，请联系乐陪工作人员！"}</span>,
        onOk() {
          if(level<=1){
            me.props.dispatch({
              type:'leave/delLeaveRule',
              payload:{"ruleId":id},
              callback:(res)=>{
                if(res.code===200){
                  message.success('删除成功！',3)
                  me.props.form.validateFields((err, values) => {
                    const params={
                      "kw":values.kw||'',
                    }
                    me.getLeaveRule(params)
                  })
                }
              }
            })
          }
         
        },
        onCancel() {},
      });
    }
    goToDetail=(type,id)=>{
      if(type==1){
        this.props.dispatch(routerRedux.push("/add-leave-rule?type=1"))
      }else{
        this.props.dispatch(routerRedux.push("/add-leave-rule?type=2&id="+id))
      }
      
    }
    render(){
        const text = <span>未制定规则，审批人由申请人制定</span>;
        const columns = [{
            title: '规则名称',
            dataIndex: 'ruleName',
          }, {
            title: '简介',
            dataIndex: 'ruleIntro',
          }, {
            title: '审批层级',
            dataIndex: 'level',
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
                    <span onClick={this.showConfirm.bind(this,record.id,record.level)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const {leaveRules} = this.props;
          if(!leaveRules){
            return null;
          }
        return (
            <div className="leave-main content-main">
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                        {/* <Breadcrumb.Item><Link to="/leave-type">请假类型管理</Link></Breadcrumb.Item> */}
                        <Breadcrumb.Item>审批规则管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Form className="ant-advanced-search-form content-form" onSubmit={this.search.bind(this)}>
                    <Row gutter={24}>
                        <Col span={5}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                                <Search placeholder="请输入规则名称"/>
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={2} offset={0}>
                            <Button type='primary' htmlType="submit" onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                        <Col span={2} >
                            <Button onClick={this.goToDetail.bind(this,1)}>添加</Button>
                        </Col>
                    </Row>
                </Form>              
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={leaveRules} pagination={false}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    leaveRules:state.leave.leaveRules
  }
}
export default connect(mapStateToProps)(Form.create()(LeaveType));
