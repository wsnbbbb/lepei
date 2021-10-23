import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, syncStatus} from '../../utils/public';
import './style.less';

const confirm = Modal.confirm;

class DidanoSync extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleAdd: false,
          reset:false,
          data: {},
          deviceNo: '',
          remark: '',
          currentDeviceNo: ''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getSyncRecords(params)
 
    }
    getSyncRecords=(params)=>{
      this.props.dispatch({
        type:'didano/didanoSyncRecords',
        payload:params,
        callback: res=>{
          if(res.code==200){
            this.setState({
              data: res.data
            })
          }else{

          }
          
        }
      })
    }
    refresh=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getSyncRecords(params)
    }
    fomartStatus=(record)=>{
      // (1：进行中，2：成功，3：失败)
      if(record==1){
        return "进行中"
      }else if(record==2){
        return "成功"
      }else if(record==3){
        "失败"
      }
    }
      
    fullSync=()=>{
      let me = this
      this.props.dispatch({
        type: 'didano/fullSync',
        payload: {},
        callback: res=>{
          if(res.code==200){
            me.getSyncRecords()
          }
        }
      })
    }

    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||''
        }
        this.getSyncRecords(params)
        this.setState({page:1})
      })
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size
        }
        this.getSyncRecords(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/room-apply-detail?id="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
 

    render(){
        const columns = [{
            title: '同步时间',
            dataIndex: 'syncTime',
            width: 200,
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span style={{color:record==3?"red":""}}>{syncStatus(record)}</span>)
            }
          }];

        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6} offset={0}>
                      <Button type='primary' onClick={this.fullSync.bind(this)}>立即全量同步</Button>
                  </Col>
                  <Col span={6} offset={0}>
                      <Button type='primary' onClick={this.refresh.bind(this)}>刷新</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
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
export default connect(mapStateToProps)(Form.create()(DidanoSync));
