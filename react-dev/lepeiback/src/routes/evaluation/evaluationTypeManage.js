import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getScoreType, getCycleType, getQueryString} from '../../utils/public';
import './style.less';

const confirm = Modal.confirm;

class evaluationTypeManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          tableData: {},
          currentId: '',
          tableData1: [],
          currentGroupId: '',
          copyGroupId: ''
        };
    }
    componentDidMount=()=>{
      const params={
        "page": 1,
        "prePage": 20,
        "groupId": getQueryString("id")
      }
      this.getList(params)
    }
    
    getList=(params)=>{
      this.props.dispatch({
        type:'evaluate/getClassEvaluationType',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
             tableData: res.data
           })
          }
        }
      })
    }
      
    add=()=>{
      this.props.dispatch(routerRedux.push("/add-evaluation-type"))
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "semesterId":values.semesterId||''
        }
        this.getList(params)
      })
    }

    // copyClassEvaluationGroup
    getDetail=(record)=>{
      const params={
        "id": record.id||'',
      }
      this.setState({
        currentId: record.id
      })
      this.props.dispatch({
        type:'evaluate/getEvaluationGroupDetail',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              visible: true
           })
           this.props.form.setFieldsValue({
            "semesterId": res.data.semesterId,
            "groupName": res.data.groupName,
            "grades": res.data.grades,
            "scoreType": res.data.scoreType,
            "icon": res.data.icon,
          })
          }
        }
      })
    }

    // 删除
    delete=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type: 'oa/deleteOaRecord',
            payload: {"id": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "id": getQueryString("id"),
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

    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'id',
            width: 60
          }, {
            title: '考评项',
            dataIndex: 'typeName',
            width: 160,
          }, {
            title: '排序',
            dataIndex: 'sort',
            width: 100,
          }, {
            title: '总分值',
            dataIndex: 'totalScore',
            width: 100,
          },{
            title: '评分周期',
            render:(record)=>{
              return(<span>{getCycleType(record.cycleType)}</span>)
            },
            width: 100,
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.getDetail.bind(this, record)}>查看</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.delete.bind(this, record)}>删除</a>
              </span>
            )
          }];

        return (
            <div className="content-main">
                <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item>年级组管理</Breadcrumb.Item>
                    <Breadcrumb.Item>考评项管理</Breadcrumb.Item>
                </Breadcrumb>
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                      <Button type='primary' onClick={this.add.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' columns={columns} dataSource={this.state.tableData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.tableData.totalCount} totalPage={this.state.tableData.totalPage} currentPage={this.state.tableData.currentPage}/>
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
export default connect(mapStateToProps)(Form.create()(evaluationTypeManage));
