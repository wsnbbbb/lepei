import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Form, Row, Col,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString, getCycleType} from '../../utils/public';
import './style.less';
const confirm = Modal.confirm;

class classEvaluationTypeList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          tableData: {},
          title:"考评项管理",

        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "semesterId": getQueryString("semesterId"),
        "groupId": getQueryString("groupId")
      }
      this.getList(params)

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/class-evaluation-group-list"
        },
      })
    }
    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })    
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

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "semesterId": getQueryString("semesterId"),
          "groupId": getQueryString("groupId")
        }
        this.getList(params)
      })
    }

    getDetail=(record)=>{
      if(getQueryString("scoreType")==1){
        this.props.dispatch(routerRedux.push("/add-evaluation-type?id="+record.id+"&scoreType=1&groupId="+getQueryString("groupId")))
      }else if(getQueryString("scoreType")==2){
        this.props.dispatch(routerRedux.push("/add-evaluation-type2?id="+record.id+"&scoreType=1&groupId="+getQueryString("groupId")))
      }else if(getQueryString("scoreType")==3){
        this.props.dispatch(routerRedux.push("/add-evaluation-type3?id="+record.id+"&scoreType=1&groupId="+getQueryString("groupId")))
      }
    }

    new = ()=>{
      if(getQueryString("scoreType")==1){
        this.props.dispatch(routerRedux.push("/add-evaluation-type?groupId="+getQueryString("groupId")))
      }else if(getQueryString("scoreType")==2){
        this.props.dispatch(routerRedux.push("/add-evaluation-type2?groupId="+getQueryString("groupId")))
      }else if(getQueryString("scoreType")==3){
        this.props.dispatch(routerRedux.push("/add-evaluation-type3?groupId="+getQueryString("groupId")))
      }
    }

    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条数据吗？',
        onOk() {
          me.props.dispatch({
            type:'evaluate/deleteEvaluationType',
            payload:{"id": id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page": me.state.page,
                    "prePage": me.state.prePage,
                    "semesterId": getQueryString("semesterId"),
                    "groupId": getQueryString("groupId")
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
            width: 100,
          }, {
            title: '考评项',
            dataIndex: 'typeName',
            width: 200,
          },{
            title: '排序',
            dataIndex: 'sort',
            width: 100,
          },{
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
            width: 360,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.getDetail.bind(this, record)}>查看</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.showConfirm.bind(this, record.id)}>删除</a>&nbsp;&nbsp;
              </span>
            )
          }];

        return (
            <div className="content-main">
                {/* <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/class-evaluation-group-list">年级组管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>考评项管理</Breadcrumb.Item>
                </Breadcrumb> */}
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                      <Button type='primary' onClick={this.new.bind(this)}>新建</Button>
                  </Col>
                </Row>
              </Form>              
              <Table columns={columns} dataSource={this.state.tableData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.tableData.totalCount} totalPage={this.state.tableData.totalPage} currentPage={this.state.tableData.currentPage}/>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(classEvaluationTypeList));
