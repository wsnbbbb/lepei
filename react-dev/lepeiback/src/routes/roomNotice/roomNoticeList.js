import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class RoomNoticeList extends Component{
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
      this.getRoomNoticeList(params)
    }
    getRoomNoticeList=(params)=>{
      this.props.dispatch({
        type:'roomNotice/getRoomNotice',
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
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomNoticeList(params)
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
            type:'roomNotice/delRoomNotice',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getRoomNoticeList(params)
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
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomNoticeList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/update-room-notice?id="+id))
    }
    onTimeChange=(date, dateString)=>{
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    setClassNotice = () => {
      this.props.dispatch(routerRedux.push("/set-room-notice"))
    }
    render(){
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key:'title'
          }, {
            title: '教室',
            dataIndex: 'roomNames',
            className:'gradeName',
            key:'roomNames',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="grade-content">{record}</span>
            </Tooltip>)
            }
          }, {
            title: '发布人',
            dataIndex: 'publisherName',
            key:'publisherName',
          }, {
            title: '发布时间',
            dataIndex: 'createTime',
            key:'createTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record.id)}>编辑</a> 
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
          const {roomNoticeData} = this.props;
          if(!roomNoticeData){
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
                  <Col span={8}>
                    <FormItem label=''>
                      {getFieldDecorator('time')(
                        <RangePicker onChange={this.onTimeChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.setClassNotice.bind(this)}>发布通知</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={roomNoticeData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={roomNoticeData.totalCount} totalPage={roomNoticeData.totalPage} currentPage={roomNoticeData.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    roomNoticeData:state.roomNotice
  }
}
export default connect(mapStateToProps)(Form.create()(RoomNoticeList));
