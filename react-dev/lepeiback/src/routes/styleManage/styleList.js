import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Tooltip, DatePicker, Row, Col, Icon,Menu, Dropdown,Modal,message } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class StyleList extends Component{
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
      this.getStyleList(params)
    }
    getStyleList=(params)=>{
      this.props.dispatch({
        type:'styleManage/styleList',
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
          "startTime":this.state.startTime||"",
          "endTime":this.state.endTime||""
        }
        this.getStyleList(params)
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
            type:'styleManage/delStyle',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "startTime": me.state.startTime||"",
                    "endTime": me.state.endTime||""
                  }
                  me.getStyleList(params)
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
          "startTime":this.state.startTime||"",
          "endTime":this.state.endTime||""
        }
        this.getStyleList(params)
      })
    }
    addCanteenMenu = () => {
      this.props.dispatch(routerRedux.push("/add-style"))
    }
    editCanteenMenu=(id)=>{
        this.props.dispatch(routerRedux.push("/add-style?id="+id))
    }
    onTimeChange=(date, dateString)=>{
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'id',
          }, {
            title: '标题',
            dataIndex: 'title',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
                <span className="common-tooltips-content">{record}</span>
              </Tooltip>)
            }
          }, {
            title: '类型',
            dataIndex: 'type',
            render:(record)=>{
              let res=record==1?"校园风采":"班级风采"
              return(<span>{res}</span>)
            }
          }, {
            title: '发布来源',
            dataIndex: 'publishPlatform',
            render:(record)=>{
              let res="";
              if(record==1){
                res="运营平台"
              }else if(record==2){
                res="学校后台"
              }else if(record==3){
                res="教师端"
              }
              return(<span>{res}</span>)
            }
          }, {
            title: '发布人',
            dataIndex: 'publisherName',
          },{
            title: '发布时间',
            dataIndex: 'createTime',
            render:(record)=>{
              return(<span>{record}</span>)
            }
          },{
            title: '点击量',
            dataIndex: 'clicksNum',
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.editCanteenMenu.bind(this,record.id)}>编辑</a> 
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
                        <Search placeholder="请输入标题"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} >
                      <FormItem label={''}>
                        {getFieldDecorator("time")(
                          <RangePicker onChange={this.onTimeChange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.addCanteenMenu.bind(this)}>添加</Button>
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
    canteenMenuList: state.styleManage
  }
}
export default connect(mapStateToProps)(Form.create()(StyleList));
