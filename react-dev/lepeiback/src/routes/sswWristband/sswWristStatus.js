import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Modal,Card,Skeleton, Avatar,InputNumber,message  } from 'antd';
import { routerRedux, Link } from 'dva/router';
import {getSexType,getGradeType,formatDate,getQueryString} from '../../utils/public';

import './style.less';


const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const { Meta } = Card;

class SswWristStatus extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,modalData:[],
          selectedRows:[],selectedRowKeys: [],     
          infoData:[],locationData:[],  healthData:[],heartData:[]
        };
    }
    componentDidMount=()=>{
      
     
    }
    //获取个人信息及卡片信息
    getPersonCard=(params)=>{
        this.props.dispatch({
            type:'sswWristband/getSswPersonMacStatus',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    if(res.data.length>1){
                        this.setState({visible:true,modalData:res.data,selectedRows:[],selectedRowKeys: []})
                    }else if(res.data.length==1){
                        this.setState({visible:false,macStatus:res.data[0].macStatus})
                        const params={
                            "macId":res.data[0].macId,"personId":res.data[0].personId
                        }
                        this.getSswMacData(params)
                    }else{
                        return message.error("未找到相关信息",2)
                    }
                }
            }
        })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if(!values.kw){
          return message.error("请输入查询条件后再进行查询",3)
        }
        const params={'kw':values.kw}
        this.getPersonCard(params)
        this.setState({
            infoData:[],locationData:[],healthData:[],heartData:[]
        })
      })
    }
    getSswMacData=(params)=>{
      console.log(params)
        if(!params.macId||!params.personId){
          return message.error('未找到相关信息',2)
        }
        this.props.dispatch({
            type:'sswWristband/getSswPersonMacData',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        visible: false,
                        infoData:[res.data.macInfo],
                        locationData:[res.data.location],
                        healthData:[res.data.healthData],
                        heartData:[res.data.heartRate],
                    });
                }
            }
        })
    }
    handleOk = (e) => {
        console.log(this.state.selectedRows)
        const {selectedRows} = this.state;
        if(selectedRows.length<=0){
            return message.error("请选择人员或取消",2)
        }else{
            const params={
                "macId":selectedRows[0].macId,"personId":selectedRows[0].personId
            }
            this.getSswMacData(params)
            this.setState({macStatus:selectedRows[0].macStatus})
        }
    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false,selectedRows:[],selectedRowKeys: [],
        });
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({selectedRows:selectedRows,selectedRowKeys })
    }
    render(){
        const columns = [{
            title: '手环mac',
            dataIndex: 'macId',
          }, {
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
                return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
                return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
                return(<span style={{color:record==0?'#f00':''}}>{record==0?"离线":(record==1?"在线":"")}</span>)
            }
          }];
          const staffColumns = [{
            title: '手环mac',
            dataIndex: 'macId',
          }, {
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
                return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
                return(<span style={{color:record==0?'#f00':''}}>{record==0?"离线":(record==1?"在线":"")}</span>)
            }
          }];
          const columns2 = [{
            title: '手环mac',
            dataIndex: 'macId',
          }, {
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
                return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
                return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }];
          const staffColumns2 = [{
            title: '手环mac',
            dataIndex: 'macId',
          }, {
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
                return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          }];
          const positionColumns = [{
            title: '当前位置',
            dataIndex: 'position',
          }, {
            title: '更新时间',
            dataIndex: 'time',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          }];
          const positionColumns2 = [{
            title: '当前位置',
            dataIndex: '',
            render:(record)=>{
                return(<span >当前手环已离线无法定位，最后一次定位：{record.lastPosition}仅供参考，如需详细历史位置信息，请查找历史手环位置</span>)
            }
          }];
          const heartColumns = [{
            title: '心率值',
            dataIndex: 'heartRate',
            render:(record)=>{
              return(<span>{record||'0'}次/分</span>)
            }
          }, {
            title: '测量时间',
            dataIndex: 'receiveTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          }];
          const healthColumns = [{
            title: '步数',
            dataIndex: 'steps',
            render:(record)=>{
              return(<span>{record||'0'}步</span>)
            }
          }, {
            title: '距离',
            dataIndex: 'distances',
            render:(record)=>{
              return(<span>{record||'0'}米</span>)
            }
          }, {
            title: '卡路里',
            dataIndex: 'calories',
            render:(record)=>{
              return(<span>{record||'0'}卡</span>)
            }
          }, {
            title: '统计时间',
            dataIndex: 'createTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          }];

          const modalColumns = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '身份',
            dataIndex: 'personType',
            render:(record)=>{
                return( 
                    <span >{record==1?"学生":(record==2?"教师":"职工")}</span>
                )
            }
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }];
          const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys ,
            onChange: this.onChange ,
            type:'radio',
          };
          const { getFieldDecorator } = this.props.form;
          const {modalData,infoData,locationData,healthData,heartData,macStatus} = this.state;
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{initialValue:''})(
                        <Search placeholder="请输入姓名/手环MAC/IC卡号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>    
              {infoData.length>0&&macStatus==0?<h3 style={{fontWeight:"bold"}}>该手环已标记为停用，可能已遗失，历史信息如下</h3>:null}
              {infoData.length>0&&infoData[0].personType==1&&macStatus==1?<Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={infoData} pagination={false}/>:null}
              {infoData.length>0&&infoData[0].personType==1&&macStatus==0?<Table className='content-table' scroll={{ x: 1000 }} columns={columns2} dataSource={infoData} pagination={false}/>:null}
              {infoData.length>0&&infoData[0].personType!=1&&macStatus==1?<Table className='content-table' scroll={{ x: 1000 }} columns={staffColumns} dataSource={infoData} pagination={false}/>:null}
              {infoData.length>0&&infoData[0].personType!=1&&macStatus==0?<Table className='content-table' scroll={{ x: 1000 }} columns={staffColumns2} dataSource={infoData} pagination={false}/>:null}
              {locationData.length>0&&macStatus==1?<Table className='content-table' columns={infoData[0].status==1?positionColumns:positionColumns2} dataSource={locationData} pagination={false}/>:null}
              {heartData.length>0&&macStatus==1?<Table className='content-table'  columns={heartColumns} dataSource={heartData} pagination={false}/>:null}
              {healthData.length>0&&macStatus==1?<Table className='content-table' columns={healthColumns} dataSource={healthData} pagination={false}/>:null}
              <Modal
                title="请选择"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Table className='content-table' scroll={{ x: 1000 }} rowSelection={rowSelection} columns={modalColumns} dataSource={modalData} pagination={false}/>
              </Modal>
             
             
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // personMacData:state.sswWristband.personMacData
  }
}
export default connect(mapStateToProps)(Form.create()(SswWristStatus));
