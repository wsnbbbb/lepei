import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Breadcrumb,Tooltip } from 'antd';
import { routerRedux,Link } from 'dva/router';
import PageIndex from '../../components/page';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ApprovalList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          data:{},
          detailList:[],
        };
    }
    componentDidMount=()=>{
      const params = {
        "page": 1,
        "prePage": 20,
      }
      this.getList(params)
    }
    // 获取多角色审批流列表
    getList = (params) =>{
      this.props.dispatch({
        type:'multiRoleApproval/approvalRuleList',
        payload:params,
        callback:res =>{
          this.setState({
            data: res.data,
            detailList:res.data.dataList
          })
        }
      })
    }
    // 查询
    search = () =>{
      this.props.form.validateFields((err, values) => {
        const params = {
          "kw":values.kw || '',
          "page": 1,
          "prePage": this.state.prePage,
        }
        this.getList(params)
        this.setState({ page: 1 })
      })
    }
    // 分页
    onPageChange = (current, size) => {
      this.props.form.validateFields((err, values) => {
        this.setState({ page: current, prePage: size })
        const params = {
          "page": current,
          "prePage": size,
          "kw": values.kw || '',
        }
        this.getList(params)
      })
    }
    // 删除
    showConfirm = (id,level) => {
      let me = this;
      confirm({
        title: '提示',
        content: "确定要删除这条信息吗？",
        onOk() {
          me.props.dispatch({
            type:'multiRoleApproval/delRoleApproval',
            payload:{ id },
            callback:(res) =>{
              if(res.code === 200){
                message.success('删除成功！')
                me.props.form.validateFields((err, values) => {
                  const params = {
                    "kw":values.kw || '',
                    "page": me.state.page,
                    "prePage": me.state.prePage,
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
    // 添加/编辑
    goToDetail = (type,id) =>{
      console.log({type});
      if(type == 1){
        this.props.dispatch(routerRedux.push("/multi-role-approval-detail"))
      }else{
        this.props.dispatch(routerRedux.push("/multi-role-approval-detail?ruleId=" + id))
      }
    }
    render(){
      const { data,detailList,  } = this.state;
      const { getFieldDecorator } = this.props.form;
      const text = <span>未制定规则，审批人由申请人制定</span>;
      const columns = [{
          title: '规则名称',
          dataIndex: 'name',
        }, {
          title: '简介',
          dataIndex: 'synopsis',
        }, {
          title: '审批层级',
          dataIndex: 'approvalLevel',
        },{
          title: '操作',
          dataIndex: '',
          width:150,
          fixed:'right',
          render:(text, record) => (
            <span className="make-box">
              <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.id)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" className="check-btn"  onClick={this.showConfirm.bind(this,record.id,record.approvalLevel)}>删除</a> 
            </span>
          )
      }];
      return (
          <div className="approval-list">
              <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                      <Breadcrumb.Item>多角色审批流</Breadcrumb.Item>
                  </Breadcrumb>
                  <h3>多角色审批流</h3>
              </div>
              <div className="content-main">
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                        <Col span={5}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                                <Search placeholder="规则名称"/>
                            )}
                            </FormItem>
                        </Col> 
                        <Col span={19} style={{ textAlign: 'right',paddingRight:'15px' }}>
                          <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                          <Button onClick={this.goToDetail.bind(this,1)}>添加</Button>
                        </Col>
                    </Row>
                </Form>              
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
              </div>
          </div>
      );
    }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(ApprovalList));
