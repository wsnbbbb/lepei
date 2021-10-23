import React,{Component} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Input , Form, Row, Col,Modal,message,DatePicker  } from 'antd';
import {getSexType,getGradeType,formatDate,getBeforeDate} from '../../../utils/public';
import PageIndex from '../../../components/page';
import '../style.less';


const Search = Input.Search;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

class HealthList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,modalData:[],
          selectedRows:[],selectedRowKeys: [],     
          infoData:[],
          date:getBeforeDate(0),
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
                        this.setState({visible:false,macId:res.data[0].macId})
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
        if(!this.state.date){
          return message.error("请输入时间后再进行查询",2)
        }
        const params={'kw':values.kw}
        this.getPersonCard(params)
        this.setState({
            infoData:[]
        })
      })
    }
    getSswMacData=(params)=>{
        if(!params.macId){
          return message.error('未找到相关信息',2)
        }
        const {date} = this.state;
        this.props.dispatch({
            type:'sswWristband/getSswPersonMacData',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        visible: false,
                        infoData:[res.data.macInfo],
                    });
                    this.props.dispatch({
                      type:'sswWristband/getSswHealthList',
                      payload:{
                        "macId":this.state.macId,"page":1,"prePage":20,"date":date
                      },
                      callback:(res)=>{
                        if(res.code===200){
                          this.setState({sswHealthList:res.data})
                        }
                      }
                    })
                }
            }
        })
    }
    handleOk = (e) => {
        const {selectedRows} = this.state;
        if(selectedRows.length<=0){
            return message.error("请选择人员或取消",2)
        }else{
            const params={
                "macId":selectedRows[0].macId,"personId":selectedRows[0].personId
            }
            this.getSswMacData(params)
            this.setState({macId:selectedRows[0].macId})
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
    onTimeChange=(value, dateString)=> {
      this.setState({
        date:dateString,
      })
    }
    disabledDate=(current)=> {
      return current && current > moment().endOf('day');
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        this.props.dispatch({
          type:'sswWristband/getSswHealthList',
          payload:{
            "macId":this.state.macId,"page":current,"prePage":size,"date":this.state.date
          },
          callback:(res)=>{
            if(res.code===200){
              this.setState({sswHealthList:res.data})
            }
          }
        })
      })
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
            title: '创建时间',
            dataIndex: 'createTime',
            render:(record)=>{
                return( 
                    <span >{formatDate(record)}</span>
                )
            }
          }];
          const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys ,
            onChange: this.onChange ,
            type:'radio',
          };
          const { getFieldDecorator } = this.props.form;
          const {modalData,infoData,date,sswHealthList} = this.state;
          const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24}
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label=''>
                      {getFieldDecorator('kw',{initialValue:''})(
                        <Search placeholder="请输入姓名/手环MAC/IC卡号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={8}>
                      <FormItem {...formItemLayout} label=''>
                            <DatePicker onChange={this.onTimeChange} disabledDate={this.disabledDate}  defaultValue={moment(date, dateFormat)}/>
                      </FormItem>
                  </Col>
                  <Col span={2} offset={2}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>    
              {infoData.length>0?<Table className='content-table' scroll={{ x: 1000 }} 
                columns={infoData[0].personType==1?columns:(infoData[0].personType!=1?staffColumns:'')}
                dataSource={infoData} pagination={false}/>:null}
             
              {sswHealthList?<Table className='content-table' scroll={{ x: 1000 }} columns={healthColumns} dataSource={sswHealthList.dataList} pagination={false}/>:null}
              {sswHealthList?<PageIndex getPage={this.onPageChange.bind(this)} total={sswHealthList.totalCount} totalPage={sswHealthList.totalPage} currentPage={sswHealthList.currentPage}/>:null}
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
    // personMacData:state.sswWristband.personMacData,
    // sswHealthList:state.sswWristband.sswHealthList,
  }
}
export default connect(mapStateToProps)(Form.create()(HealthList));
