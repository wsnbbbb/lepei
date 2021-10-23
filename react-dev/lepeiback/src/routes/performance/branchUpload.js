import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Breadcrumb, Form, Row, Col,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {onlyDate} from '../../utils/public';
import './style.less';


const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class branchUpload extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          data: [],
        };
    }
    componentDidMount=()=>{
      this.getList({})
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'performance/getBranchRelation',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              data: res.data
            })
          }
        }
      })
    }

    gotoUpload = (id)=>{
      this.props.dispatch(routerRedux.push("/import-branch?id="+id))
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "startTime": values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
          "endTime": values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
        }
        this.getList(params)
        this.setState({page:1})
      })
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page": current,
          "prePage": size,
          "kw": values.kw||'',
          "startTime": values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
          "endTime": values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
        }
        this.getList(params)
      })
    }


    toDetail = (id) => {
      this.props.dispatch(routerRedux.push("/branch-detail?id="+id))
    }

 
    render(){
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: '序号',
            dataIndex: 'templateId',
            render: (text, record, index)=>`${index+1}`,
          }, {
            title: '绩效名称',
            dataIndex: 'templateName'
          }, {
            title: '创建日期',
            dataIndex: 'createTime',
            render:( record) => (
              <span>{onlyDate(record)}</span>
            )
          },{
            title: '总人数',
            dataIndex: 'totalPersonNum'
          }, {
            title: '实发金额',
            dataIndex: 'realMoney'
          }, {
            title: '上传状态',
            dataIndex: 'isUpload',
            width: 150,
            render:(record)=>{
              return(<span style={{color: record==0?"red":""}}>{record==0?"未上传":"已上传"}</span>)
            }
            
          },{
            title: '发布状态',
            dataIndex: 'isPublished',
            width: 150,
            render:(record)=>{
                return(<span style={{color: record==0?"red":""}}>{record==0?"未发布":"已发布"}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(text, record) => (
              <span className="make-box">
                {record.isUpload == 1? <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this, record.templateId)}>查看</a>:null}
                &nbsp;&nbsp;
                {record.isUpload == 0&&record.isPublished == 0? <a href="javascript:;" onClick={this.gotoUpload.bind(this, record.templateId)}>上传</a>:null}&nbsp;&nbsp;
                {record.isUpload == 1&&record.isPublished == 0? <a href="javascript:;" onClick={this.gotoUpload.bind(this, record.templateId)}>重新上传</a>:null}
               
              </span>
            )
          }];

    
        return (
            <div className="content-main performance">
                <div className="breadcrumb">
                    <Breadcrumb>
                      <Breadcrumb.Item>绩效管理</Breadcrumb.Item>
                      <Breadcrumb.Item>绩效上传</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>绩效上传</h3>
                    
                </div>
              <Form>
                    <Row gutter={24}>
                        <Col span={4}>
                            <FormItem label="">
                                {getFieldDecorator('kw')(
                                    <Search placeholder="名称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                           <FormItem >
                                {getFieldDecorator("date", {rules: [{
                                    required: false,
                                    message:"请选择日期"
                                }]})(
                                <RangePicker style={{ width: 380 }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始日期', '结束日期']}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)} >查询</Button>
                        </Col>
                    </Row>
                </Form>     
              <Table className='content-table'  columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(branchUpload));
