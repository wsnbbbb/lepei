import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message} from 'antd';
import PageIndex from '../../components/page';
import {getApplyStatus,formatDate,formatPhone} from '../../utils/public';
import {getImg} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class VisitList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "status":1
      }
      this.getVisitLists(params)
    }
    getVisitLists=(params)=>{
      this.props.dispatch({
        type:'visit/getVisitList',
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
          "status":values.status,
        }
        this.getVisitLists(params)
        this.setState({page:1})
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "status":values.status,
        }
        this.getVisitLists(params)
      })
    }
    showModal = (record) => {
        this.setState({
          visible: true,
          itemDate:record
        });
        this.props.dispatch({
          type:'visit/getVisitDetail',
          payload:{"id":record.id}
        })
    }
    handleOk = (e) => {
      const {visitDetail} = this.props;
      if(visitDetail&&visitDetail.status==1){
        this.props.dispatch({
          type:'visit/updateVisit',
          payload:{"recordId":this.state.itemDate.id},
          callback:(res)=>{
            if(res.code===200){
              message.success("标记成功",2)
              this.props.form.validateFields((err, values) => {
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  "status":values.status
                }
                this.getVisitLists(params)
              })
              this.setState({
                visible: false,
              });
            }
          }
        })
      }else{
        this.setState({
          visible: false,
        });
      }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render(){
        const columns = [{
            title: '访客姓名',
            dataIndex: 'visitorName',
            key:'visitorName'
          }, {
            title: '访客手机号',
            dataIndex: 'visitorTel',
            key:'visitorTel',
            render:(record)=>{
                return(<span>{formatPhone(record)}</span>)
            }
          }, {
            title: '拜访对象',
            dataIndex: '',
            key:'visitedPersonName',
            render:(record)=>{
                return(<span>{record.visitedPersonName+''+formatPhone(record.visitedPersonTel)}</span>)
            }
          }, {
            title: '访客人数',
            dataIndex: 'visitorNum',      
            key:'visitorNum',      
          }, {
            title: '入校方式',
            dataIndex: '',
            key:'visitType',
            render:(record)=>{
                return(<span>{record.visitType==1?"步行":"开车——"}{record.visitType==2?record.plateNo:null}</span>)
            }
          },{
            title: '拜访时间',
            dataIndex: 'visitTime',
            key:'visitTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '当前状态',
            dataIndex: 'status',
            key:'status',
            render:(record)=>{
                return(<span style={{color:record==1?"green":""}}>{record==0?"待审核":(record==1?"已通过":(record==2?"已拒绝":(
                  record==3?"已使用":(record==4?"已过期":""))))}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showModal.bind(this,record)}>操作</a> 
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {visitList,visitDetail} = this.props;
          if(!visitList){
            return null;
          }
          console.log(visitDetail)
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入访客姓名/手机号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'当前状态'}>
                      {getFieldDecorator("status",{initialValue:'1'})(
                        <Select>
                          <Option value="-1">全部</Option>
                          <Option value="0">待审核</Option>
                          <Option value="1">已通过</Option>
                          <Option value="2">已拒绝</Option>
                          <Option value="3">已使用</Option>
                          <Option value="4">已过期</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={visitList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={visitList.totalCount} totalPage={visitList.totalPage} currentPage={visitList.currentPage}/>
              <Modal
                title="操作"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width="730px"
                footer={[
                  <Button key="back" onClick={this.handleCancel}>取消</Button>,
                  <Button key="submit" type="primary" onClick={this.handleOk}>
                    {visitDetail&&visitDetail.status==1?"标记为已使用":"确定"}
                  </Button>,
                ]}
              >
                  <span>
                    {visitDetail&&visitDetail.status==1?
                      <Alert
                        message="当前状态：已通过"
                        description={<span>此拜访请求，{visitDetail.visitedPersonName}已于{formatDate(visitDetail.dealTime)}确认，访客入校后，请标记为已使用</span>}
                        type="success"
                        showIcon
                      />:
                      (visitDetail&&visitDetail.status==0?<Alert
                        message="当前状态：待审核"
                        description={<span>此拜访请求，{visitDetail.visitedPersonName}未审核，<span className="stop-tip">访客不能入校</span></span>}
                        type="error"
                        showIcon
                      />:
                      (visitDetail&&visitDetail.status==2?<Alert
                        message="当前状态：已拒绝"
                        description={<span>此拜访请求，{visitDetail.visitedPersonName}已于{formatDate(visitDetail.dealTime)}拒绝了请求，<span className="stop-tip">访客不能入校</span>，如需入校，请重新发起拜访请求</span>}
                        type="error"
                        showIcon
                      />:
                      (visitDetail&&visitDetail.status==3?<Alert
                        message="当前状态：已使用"
                        description={<span>此拜访请求，已于{formatDate(visitDetail.dealTime)}使用，<span className="stop-tip">访客不能入校</span>，如需入校，请重新发起拜访请求</span>}
                        type="error"
                        showIcon
                      />:
                      (visitDetail&&visitDetail.status==4?<Alert
                        message="当前状态：已过期"
                        description={<span>此拜访请求，已于{formatDate(visitDetail.dealTime)}过期，<span className="stop-tip">访客不能入校</span>，如需入校，请重新发起拜访请求</span>}
                        type="error"
                        showIcon
                      />:null
                      ))))}
                      <div className="modal-detail-box">
                        <div className="detail-left">
                            <Row>
                              <Col span={8}>访客姓名：</Col><Col span={14}>{visitDetail&&visitDetail.visitorName}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>访客手机号：</Col><Col span={14}>{visitDetail&&visitDetail.visitorTel}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>拜访对象：</Col><Col span={14}>{visitDetail&&visitDetail.visitedPersonName+'-'+formatPhone(visitDetail.visitedPersonTel)}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>访客人数：</Col><Col span={14}>{visitDetail&&visitDetail.visitorNum}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>入校方式：</Col><Col span={14}>{visitDetail&&visitDetail.visitType==1?"步行":"开车——"}{visitDetail&&visitDetail.visitType==2?visitDetail&&visitDetail.plateNo:null}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>拜访来源：</Col>
                              <Col span={14}>
                                {visitDetail&&visitDetail.sourceName=='二维码'?visitDetail&&visitDetail.sourceName:`乐陪家长（${visitDetail&&visitDetail.sourceName}）`}
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>拜访时间：</Col><Col span={14}>{visitDetail&&formatDate(visitDetail.visitTime)}</Col>
                            </Row>
                            <Row>
                              <Col span={8}>拜访事由：</Col><Col span={14}>{visitDetail&&visitDetail.visitReason}</Col>
                            </Row>
                            <Row style={{color:"#bbb"}}>
                              <Col span={8}>操作记录：</Col><Col span={14}>
                                {visitDetail&&visitDetail.logs&&visitDetail.logs.length>0&&visitDetail.logs.map((item,i)=>
                                    <p key={i}>{formatDate(item.time)}&nbsp;&nbsp;{item.dealerName}&nbsp;&nbsp;{item.actType==1?"申请":(item.actType==2?"审批":(item.actType==4?"过期":(item.actTyp0e==5?"使用":"")))}
                                    &nbsp;&nbsp;{item.result==1&&item.actType!=4?"通过":(item.result==0&&item.actType!=4?"不通过":"")}&nbsp;&nbsp;{item.reason}
                                    </p>
                                )}
                              </Col>
                            </Row>
                        </div>
                        <div className="detail-right">
                          {visitDetail&&visitDetail.visitorPic?<img src={getImg(visitDetail.visitorPic)} />:null}
                        </div>
                      </div>
                    </span>                    
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     visitList:state.visit,
     visitDetail:state.visit.detail
  }
}
export default connect(mapStateToProps)(Form.create()(VisitList));
