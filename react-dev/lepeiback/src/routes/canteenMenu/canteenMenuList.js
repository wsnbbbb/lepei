import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Row, Col, Icon,Menu, Dropdown,Modal,message } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class CanteenMenuList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getCanteenMenuList(params)
    }
    getCanteenMenuList=(params)=>{
      this.props.dispatch({
        type:'canteenMenu/canteenMenuList',
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
        }
        this.getCanteenMenuList(params)
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
            type:'canteenMenu/delCanteenMenu',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                  }
                  me.getCanteenMenuList(params)
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
        }
        this.getCanteenMenuList(params)
      })
    }
    addCanteenMenu=(type,id)=>{
       if(Number(type)===1){
      this.props.dispatch(routerRedux.push("/add-canteen-menu?type=" + type))
    }else{
      this.props.dispatch(routerRedux.push("/add-canteen-menu?type=" + type + "&id=" + id))
    }
    }
    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'id',
          }, {
            title: '菜谱名称',
            dataIndex: 'title',
          }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '发布人',
            dataIndex: 'publisherName',
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.addCanteenMenu.bind(this,2,record.id)}>编辑</a> 
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
          const {canteenMenuList,} = this.props;
          console.log(canteenMenuList)
          if(!canteenMenuList){
            return null;
          }
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入菜谱名称"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.addCanteenMenu.bind(this,1)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={canteenMenuList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={canteenMenuList.totalCount} totalPage={canteenMenuList.totalPage} currentPage={canteenMenuList.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    canteenMenuList:state.canteenMenu
  }
}
export default connect(mapStateToProps)(Form.create()(CanteenMenuList));
