import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Select,DatePicker  } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getImg} from '../../utils/img';
import {formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SchoolNoticeList extends Component{
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
      this.getSchoolNoticeList(params)
    }
    getSchoolNoticeList=(params)=>{
      this.props.dispatch({
        type:'schoolNotice/getSchoolNoticeList',
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
          "publishPlatform":values.publishPlatform,
          "receivePlatform":values.receivePlatform,
          "startTime":this.state.startTime||'',
          "endTime":this.state.endTime||'',
        }
        this.getSchoolNoticeList(params)
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
            type:'schoolNotice/delSchoolNotice',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "publishPlatform":values.publishPlatform,
                    "receivePlatform":values.receivePlatform,
                    "startTime":me.state.startTime||'',
                    "endTime":me.state.endTime||'',
                  }
                  me.getSchoolNoticeList(params)
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
          "publishPlatform":values.publishPlatform,
          "receivePlatform":values.receivePlatform,
          "startTime":this.state.startTime||'',
          "endTime":this.state.endTime||'',
        }
        this.getSchoolNoticeList(params)
      })
    }
    addCanteenMenu = () => {
      this.props.dispatch(routerRedux.push("/add-school-notice"))
    }
    setHander = () =>{
      this.props.dispatch(routerRedux.push("/set-teacher-hander?type=1"))
    }
    editCanteenMenu=(id)=>{
        this.props.dispatch(routerRedux.push("/add-school-notice?id="+id))
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
      const { getFieldDecorator } = this.props.form;
      const {schoolNoticeList} = this.props;
      console.log(schoolNoticeList)
      if(!schoolNoticeList){
        return null;
      }
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const columns = [{
          title: '公告标题',
          dataIndex: 'title',
          key:'title'
        }, {
          title: '公告类型',
          dataIndex: 'contentType',
          render:(record)=>{
            return(<span>{record==1?"富文本":(record==2?"链接":(record==3?"纯文本":"图文"))}</span>)
          }
        }, {
          title: '发布来源',
          dataIndex: 'publishPlatform',
          key:'publishPlatform',
          render:(record)=>{
            return(<span>{record==1?"运营平台":(record==2?"学校后台":(record==3?"教师端":"--"))}</span>)
          }
        }, {
          title: '接收平台',
          dataIndex: 'receivePlatform',
          key:'receivePlatform',
        }, {
          title: '发布者',
          dataIndex: 'publisherName',
          key:'publisherName'
        }, {
          title: '点击量',
          dataIndex: 'clicksNum',
          key:'clicksNum'
        }, {
          title: '提交时间',
          dataIndex: 'createTime',
          key:'createTime',
          render:(record)=>{
            return(<span>{formatDate(record)}</span>)
          }
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
      return (
          <div className="content-main">
            <Form className="ant-advanced-search-form content-form">
              <Row gutter={24}>
                <Col span={4}>
                  <FormItem label=''>
                    {getFieldDecorator('kw')(
                      <Search placeholder="公告标题"/>
                    )}
                  </FormItem>
                </Col> 
                <Col span={5}>
                  <FormItem {...formItemLayout} label={'发布来源'}>
                    {getFieldDecorator("publishPlatform",{initialValue:''})(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1">运营平台</Option>
                        <Option value="2">学校后台</Option>
                        <Option value="3">教师端</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem {...formItemLayout} label={'接收平台'}>
                    {getFieldDecorator("receivePlatform",{initialValue:''})(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1">家长端</Option>
                        <Option value="2">教师端</Option>
                        <Option value="3">班牌端</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label=''>
                    {getFieldDecorator('time')(
                      <RangePicker onChange={this.onTimeChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' onClick={this.addCanteenMenu.bind(this)}>添加</Button>&emsp;
                  <Button type='primary' onClick={this.setHander.bind(this)}>设置教师端发送人</Button>
                </Col>
              </Row>
            </Form>              
            <Table className='content-table' columns={columns} dataSource={schoolNoticeList.dataList} pagination={false}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={schoolNoticeList.totalCount} totalPage={schoolNoticeList.totalPage} currentPage={schoolNoticeList.currentPage}/>
          </div>
      );
      }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    schoolNoticeList:state.schoolNotice
  }
}
export default connect(mapStateToProps)(Form.create()(SchoolNoticeList));
