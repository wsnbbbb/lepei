import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Alert , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {formatDate, getSyncStatus} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';
import { getImg } from '../../utils/img';
import moment from 'moment';


class SyncRecords extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          data: {}
        };
    }
    componentDidMount=()=>{
      const params={
        "page": 1,
        "prePage": 20
      }
      this.getList(params)
    }
  
    getList=(params)=>{
      this.props.dispatch({
        type: 'syncRecords/syncRecords',
        payload: params,
        callback: res=>{
          if(res.code === 200){
            this.setState({
              data: res.data
            })
          }
        }
      })
    }

    sync=()=>{
      this.props.dispatch({
        type: 'syncRecords/syncData',
        payload: {},
        callback: res=>{
          if(res.code === 200){
            message.success("操作成功！")
          }
        }
      })
    }

    refresh=()=>{
      const params={
        "page": 1,
        "prePage": 20
      }
      this.getList(params)
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page: current,prePage: size})
        const params={
          "page": current,
          "prePage": size
        }
        this.getList(params)
      })
    }

    render(){
        const columns = [{
          title: '同步时间',
          dataIndex: 'syncTime',
          render:(record)=>{
            return(<span>{formatDate(record)}</span>)
          }
        }, {
          title: '同步内容',
          dataIndex: 'syncResult',
          render:(record)=>{
            return(<span>{record}</span>)
          }
        },{
          title: '状态',
          dataIndex: 'status',
          render:(record)=>{
            return(<span style={{color: record==3?"red":""}}>{getSyncStatus(record)}</span>)
          }
        }];
 
        return (
            <div className="content-main didano">
              <Alert style={{margin: '10px 0 20px 0'}}
                message="提示"
                description="本功能仅针对需立即同步的数据，对于非立即更新的数据，系统会自动在每日零点自动同步前一日的增量数据。"
                type="error"
              />
              <Form className="ant-advanced-search-form content-form " style={{padding: '0px 0 20px 0'}}>
                <Row gutter={24}>
                  <Col span={4}>
                      <Button type='primary' onClick={this.sync.bind(this)}>立即同步</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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
export default connect(mapStateToProps)(Form.create()(SyncRecords));
