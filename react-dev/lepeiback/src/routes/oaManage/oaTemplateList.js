import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Tooltip,Select,Divider, Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import {Encrypt, Decrypt} from '../../utils/secret'
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, dateToTimestamp, formatDate, addKeys} from '../../utils/public';
import { portUrl, questionUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class OaTemplateList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page: 1,
          prePage: 20,
          list: [],
        };
    }
    componentDidMount=()=>{
      const params={
        "page": this.state.page,
        "prePage": this.state.prePage,
      }
      this.getList(params)
     
    }
    getList=(params)=>{
      this.props.dispatch({
        type: 'oa/getOaTemplateList',
        payload: params,
        callback: res=>{
          if(res.code===200){
            this.setState({
              list: res.data
            })
          }
        }
      })
    }

    toDetail = (id) => {
      this.props.dispatch(
        routerRedux.push("/edit-OaTemplate/" + id)
      )
    }
  
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
      });
    }

    onChangeRange=(date, dateString)=>{
      this.setState({
          startTime: dateToTimestamp(dateString[0]),
          endTime: dateToTimestamp(dateString[1])
      })
      console.log(dateString)
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "status": values.status||'',
          "startTime": this.state.startTime||'',
          "endTime": this.state.endTime||''
        }
        this.getList(params)
      })
    }

    copy = (id) =>{
      let me = this
      this.props.dispatch({
        type: 'oa/copyOaTemplate',
        payload: {"id": id},
        callback: (res)=>{
          if(res.code===200){
            Modal.success({
              title: '提示',
              content: '复制成功！',
              onOk() {
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page": 1,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||'',
                    "startTime": me.state.startTime||'',
                    "endTime": me.state.endTime||''
                  }
                  me.getList(params)
                })
              },
            });
            
          }
        }})
      
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type: 'oa/deleteOaTemplate',
            payload: {"id": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||'',
                    "startTime": me.state.startTime||'',
                    "endTime": me.state.endTime||''
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
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "status": values.status||'',
          "startTime": this.state.startTime||'',
          "endTime": this.state.endTime||''
        }
        this.getList(params)
      })
    }
    toAdd = () => {
      this.props.dispatch(
        routerRedux.push("/new-OaTemplate")
      )
    }

    render(){

        const {list} = this.state;
 
        const columns = [{
            title: '流程名称',
            dataIndex: 'name',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="grade-content">{record}</span>
            </Tooltip>)
            }
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
              return( 
                <span>{record==1?"启用":(record==2?"禁用":"")}</span>
              )
            }
          }, {
            title: '发布人',
            dataIndex: 'publisherName',
          },{
            title: '添加时间',
            dataIndex: 'createTime',
            render:(record)=>{
              return( 
                <span>{formatDate(record)}</span>
              )
            }
          },{
            title: '操作',
            dataIndex: '',
            width:200,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this,record.id)}>编辑</a> <Divider type="vertical" />
                <a href="javascript:;" onClick={this.copy.bind(this, record.id)}>复制</a><Divider type="vertical" />
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this, record.id)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout1 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18}
          };
        return (
            <div className="content-main questionnaire">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Input placeholder="请输入流程名称" />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'当前状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">启用</Option>
                          <Option value="2">禁用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10} >
                      <FormItem {...formItemLayout1} label={'添加时间'}>
                        {getFieldDecorator("time", {})(
                           <RangePicker style={{ width: 380 }}
                           showTime={{ format: 'HH:mm:ss' }}
                           format="YYYY-MM-DD HH:mm:ss"
                           placeholder={['开始时间', '结束时间']}
                           onChange={this.onChangeRange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={6}>
                        &nbsp;&nbsp;
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                        <Button onClick={this.toAdd.bind(this)}>添加</Button>&nbsp;&nbsp;
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(Form.create()(OaTemplateList));
