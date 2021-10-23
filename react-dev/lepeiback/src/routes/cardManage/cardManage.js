import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Modal,Card,Skeleton, Avatar,InputNumber,message  } from 'antd';
import { routerRedux, Link } from 'dva/router';
import {getSexType,getGradeType,formatDate,getQueryString} from '../../utils/public';
import Lepei from '../../assets/lepei.png';
import ShangTong from '../../assets/shangtong.png';
import SongXing from '../../assets/songxing.png';
import Yks from '../../assets/yks.png';

import './style.less';


const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const { Meta } = Card;

class CardManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,cardData:[],modalData:[],selectedRows:[],selectedRowKeys: [],cardLists:[],
          operateVisible:false,setVisible:false
        };
    }
    componentDidMount=()=>{
      const kw=getQueryString('kw');
      if(kw){
        const params={'kw':decodeURI(kw)}
        this.getPersonCard(params)
      }
     
    }
    //获取个人信息及卡片信息
    getPersonCard=(params)=>{
      this.props.dispatch({
        type:'card/getPeopleCard',
        payload:params,
        callback:(res)=>{
            if(res.code===200){
                if(res.data.length>1){
                    this.setState({visible:true,modalData:res.data,selectedRows:[],selectedRowKeys: [],customerId:res.data[0].icCustomerNo})
                }else{
                    this.setState({visible:false,cardData:[...res.data]})
                    if(res.data&&res.data.length>0){
                      console.log(res.data)
                        this.setState({customerId:res.data[0].icCustomerNo, personId: res.data[0].personId})

                        this.props.dispatch({
                            type:'card/getCardData',
                            payload:{"personId":res.data[0].personId},
                            callback:(res)=>{
                                console.log(res)
                                if(res.code===200){
                                    this.setState({cardLists:res.data})
                                }
                            }
                        })
                    }else{
                      message.error("未找到相关信息",3)
                    }
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
        this.setState({stMoney:'',stCardMoney:''})
      })
    }
    
    handleOk = (e) => {
        this.setState({
          visible: false,cardData:this.state.selectedRows,personId: this.state.selectedRows[0].personId
        });
        if(this.state.selectedRows.length>0){
            this.props.dispatch({
                type:'card/getCardData',
                payload:{"personId":this.state.selectedRows[0].personId},
                callback:(res)=>{
                    console.log(res)
                    if(res.code===200){
                        this.setState({cardLists:res.data})
                    }
                }
            })
        }
    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false,selectedRows:[],selectedRowKeys: [],
        });
    }
    showOperateModal=(item)=>{
      this.setState({
        operateVisible: true,
        cardId:item.icCardId,
        icCardStatusId:item.icCardStatusId,
        systemType:item.systemType
      });
    }
    operateHandleOk = (e) => {
      this.props.form.validateFields((err, values) => {
        if(!values.icChipNo&&this.state.selectVal==7&&this.state.systemType==1){
          return message.error('请输入物理卡号')
        }
        if(values.icChipNo&&values.icChipNo.length!=8){
          return message.error("物理卡号应该是8位数",2)
        }
        let reg=/^[0-9a-fA-F]+$/
        if(values.icChipNo&&!reg.test(values.icChipNo)){
          return message.error("卡号格式不正确(8位数字、A-F(a-f)字母组成)",3)
        }
        const param={'kw':values.kw}
        const params={'cardId':this.state.cardId,'cardType':values.cardType,'icChipNo':values.icChipNo,'fee':values.fee||''}
        this.props.dispatch({
          type:'card/lePeiOperate',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success('设置成功',2)
              // this.getPersonCard(param)
              this.props.dispatch({
                type:'card/getCardData',
                payload:{"personId":this.state.personId},
                callback:(res)=>{
                    console.log(res)
                    if(res.code===200){
                        this.setState({cardLists:res.data})
                    }
                }
            })
              this.setState({
                operateVisible: false,selectVal:''
              });
              this.props.form.resetFields(['cardType','icChipNo','fee']);
            }
          }
        })
      })
    }
  
    operateHandleCancel = (e) => {
      this.props.form.resetFields(['cardType','icChipNo','fee']);
      this.setState({
        operateVisible: false,selectVal:''
      });
    }
    showSetModal=(systemType,icCardNo)=>{
      if(systemType==2){ //获取商通限额信息
        this.props.dispatch({
          type:'card/getStIcConsumeLimitDetail',
          payload:{"cardNo":icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({
                AmtLimit:res.data.AmtLimit,
                Tconmoney:res.data.Tconmoney,
                Tcontimes:res.data.Tcontimes,
              })
            }
          }        
        })
      }else{ //获取松涬限额信息
        this.props.dispatch({
          type:'card/getSxIcConsumeLimitDetail',
          payload:{"customerId":this.state.customerId},
          callback:(res)=>{
            if(res.code===200){
              this.setState({
                AmtLimit:res.data.OnceMaxPay,
                Tconmoney:res.data.DayMaxPay,
                Tcontimes:res.data.CSMaxPay,
              })
            }
          }         
        })
      }
      this.setState({
        setVisible: true,
        systemType:systemType,
        icCardNo:icCardNo
      });
    }
    setHandleOk = (e) => {
      this.props.form.validateFields((err, values) => {
        console.log(values.AmtLimit)
        let params;
        if(this.state.systemType==2){
          params={
            "amtLimit":values.AmtLimit==0?0:(!values.AmtLimit?'100':values.AmtLimit),
            "tconMoney":values.Tconmoney||'500',
            "tconTimes":values.Tcontimes||'50',
            "cardNo":this.state.icCardNo
          }
        }else{
          params={
            "onceMaxPay":values.AmtLimit==0?0:(!values.AmtLimit?'100':values.AmtLimit),
            "dayMaxPay":values.Tconmoney==0?0:(!values.Tconmoney?'500':values.Tconmoney),
            "csMaxPay":values.Tcontimes==0?0:(!values.Tcontimes?'50':values.Tcontimes),
            "customerId":this.state.customerId
          }
        }
        
        const param={'kw':values.kw}
        this.props.dispatch({
          type:this.state.systemType==2?'card/setStIcConsumeLimit':'card/setSxIcConsumeLimit',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success('设置成功',2)
              this.getPersonCard(param)
              this.setState({
                setVisible: false,
              });
              this.props.form.resetFields(["Tconmoney","Tcontimes","AmtLimit"])
            }
          }
        })
      })
    }
    setHandleCancel = (e) => {
      this.setState({
        setVisible: false,
      });
      this.props.form.resetFields(["Tconmoney","Tcontimes","AmtLimit"])
    }
    goRechargeDetail=(type,icCustomerNo)=>{ //客户充值查询
      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push(type==2?
          encodeURI(encodeURI("/st-recharge-detail?kw="+values.kw+"&id="+icCustomerNo)):
          (type==3?encodeURI(encodeURI("/sx-recharge-detail?kw="+values.kw+"&id="+icCustomerNo)):
          (type==4?encodeURI(encodeURI("/yks-recharge-detail?kw="+values.kw+"&id="+icCustomerNo)):null))))
      })
    }
    goConsumeDetail=(type,icCustomerNo)=>{ //客户消费查询
      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push(type==2?
          encodeURI(encodeURI("/st-customer-consume-detail?kw="+values.kw+"&id="+icCustomerNo)):
          (type==3?encodeURI(encodeURI("/sx-customer-consume-detail?kw="+values.kw+"&id="+icCustomerNo)):
          (type==4?encodeURI(encodeURI("/yks-consume-detail?kw="+values.kw+"&id="+icCustomerNo)):null))))
      })
    }
    goCircleDetail=(type,id)=>{//客户圈存查询
      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push(type==3?encodeURI(encodeURI("/customer-circle-detail?kw="+values.kw+"&id="+id)):
        encodeURI(encodeURI("/yks-customer-circle-detail?kw="+values.kw+"&id="+id))))
      })
    }
    goIcCircle=(type,idCardNo)=>{ //ic卡圈存查询
      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push(type==2?
          encodeURI(encodeURI("/st-ic-circle-detail?kw="+values.kw+"&id="+idCardNo)):
          (type==3?encodeURI(encodeURI("/sx-ic-circle-detail?kw="+values.kw+"&id="+idCardNo)):
          (type==4?encodeURI(encodeURI("/yks-ic-circle-detail?kw="+values.kw+"&id="+idCardNo)):null))))
      })
    }
    goIcConsume=(type,idCardNo)=>{ //ic卡消费查询
      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push(type==2?
          encodeURI(encodeURI("/st-ic-consume-detail?kw="+values.kw+"&id="+idCardNo)):
          (type==3?encodeURI(encodeURI("/sx-ic-consume-detail?kw="+values.kw+"&id="+idCardNo)):
          (type==4?encodeURI(encodeURI("/yks-ic-consume-detail?kw="+values.kw+"&id="+idCardNo)):null))))
      })
      
    }
    onChange=(selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRows:selectedRows,selectedRowKeys })
    }
    selectChange=(value)=>{
      this.setState({
        selectVal:value
      })
    }
    checkMoney=(record)=>{
      console.log(record)
      if(record.systemType==2){
        this.props.dispatch({
          type:'card/getStMoney',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stMoney:res.data.OnMoney})
            }
          }
        })
      }else if(record.systemType==3){
        this.props.dispatch({
          type:'card/getSxMoney',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stMoney:res.data.QCYE})
            }
          }
        })
      }else if(record.systemType==4){
        this.props.dispatch({
          type:'card/getYksCustomerMoney',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stMoney:res.data.waitBalance})
            }
          }
        })
      }
      
    }
    checkCardMoney=(record)=>{
      if(record.systemType==2){
        this.props.dispatch({
          type:'card/getStIcBalance',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stCardMoney:res.data.OffMoney})
            }
          }
        })
      }else if(record.systemType==3){
        this.props.dispatch({
          type:'card/getSxMoney',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stCardMoney:res.data.TJJE})
            }
          }
        })
      }else if(record.systemType==4){
        this.props.dispatch({
          type:'card/getYksIcMoney',
          payload:{"cardNo":record.icCardNo},
          callback:(res)=>{
            if(res.code===200){
              this.setState({stCardMoney:res.data.balance})
            }
          }
        })
      }
    }
    render(){
        const studentColumns = [{
            title: '姓名',
            dataIndex: 'personName',
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
          }, {
            title: '人员类型',
            dataIndex: 'personType',
            render:(record)=>{
                return( <span >{record==1?"学生":(record==2?"教师":"职工")}</span>)
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
            title: '客户号',
            dataIndex: 'icCustomerNo',
          }, {
            title: '圈存余额',
            dataIndex: '',
            render:(record)=>{
                return( <span >{this.state.stMoney?this.state.stMoney:"--"}&nbsp;&nbsp;<Icon type="redo" onClick={this.checkMoney.bind(this,record)} /></span>)
            }
          }, {
            title: '查询',
            dataIndex: '',
            width:220,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goRechargeDetail.bind(this,record.systemType,record.icCustomerNo)}>充值查询</a> 
                <a href="javascript:;" className="check-btn" onClick={this.goConsumeDetail.bind(this,record.systemType,record.icCustomerNo)}>消费查询</a> 
                {record.systemType==3||record.systemType==4?<a href="javascript:;" className="check-btn" onClick={this.goCircleDetail.bind(this,record.systemType,record.icCustomerNo)}>圈存查询</a> :null}
              </span>
            )
          }];

          const studentColumns2 = [{
            title: '姓名',
            dataIndex: 'personName',
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
          }, {
            title: '人员类型',
            dataIndex: 'personType',
            render:(record)=>{
                return( <span >{record==1?"学生":(record==2?"教师":"职工")}</span>)
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
            title: '客户号',
            dataIndex: 'icCustomerNo',
          }];

          const teacherColumns = [{
            title: '姓名',
            dataIndex: 'personName',
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
          }, {
            title: '人员类型',
            dataIndex: 'personType',
            render:(record)=>{
                return( <span >{record==1?"学生":(record==2?"教师":"职工")}</span>)
            }
          }, {
            title: '客户号',
            dataIndex: 'icCustomerNo',
          }, {
            title: '圈存余额',
            dataIndex: '',
            render:(record)=>{
              return( 
                <span >{this.state.stMoney?this.state.stMoney:"--"}&nbsp;&nbsp;
                  <Icon type="redo" onClick={this.checkMoney.bind(this,record)} />
                </span>
              )
            }
          }, {
            title: '查询',
            dataIndex: '',
            width:220,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goRechargeDetail.bind(this,record.systemType,record.icCustomerNo)}>充值查询</a> 
                <a href="javascript:;" className="check-btn" onClick={this.goConsumeDetail.bind(this,record.systemType,record.icCustomerNo)}>消费查询</a> 
                {record.systemType==3||record.systemType==4?<a href="javascript:;" className="check-btn" onClick={this.goCircleDetail.bind(this,record.systemType,record.icCustomerNo)}>圈存查询</a> :null}
              </span>
            )
          }];

          const teacherColumns2 = [{
            title: '姓名',
            dataIndex: 'personName',
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
          }, {
            title: '人员类型',
            dataIndex: 'personType',
            render:(record)=>{
                return( <span >{record==1?"学生":(record==2?"教师":"职工")}</span>)
            }
          }, {
            title: '客户号',
            dataIndex: 'icCustomerNo',
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
          const {cardData,modalData,cardLists,icCardStatusId,systemType} = this.state;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          let cards=[];
          cardLists&&cardLists.length>0&&cardLists.map((item,index)=>{
            if(item.systemType==1){
              cards.push(
                <Col span={12} style={{minWidth:320}}>
                    <Card
                        style={{ marginTop: 16}}
                        actions={index==0?[<span onClick={this.showOperateModal.bind(this,item)}>操作</span>]:[]}
                    >
                        <Skeleton loading={false} avatar active>
                            <Meta
                            avatar={<Avatar src={Lepei} />}
                            description={
                                <div className="card-main">
                                    <Row><Col span={10}>物理卡号</Col><Col span={10}>{item.icChipNo}</Col></Row>
                                    <Row><Col span={10}>逻辑卡号</Col><Col span={10}>{item.icCardNo}</Col></Row>
                                    <Row><Col span={10}>当前状态</Col><Col span={8} offset={6} style={{color:item.icCardStatus==1?"#3E9E3E":"#f00"}}>{item.icCardStatus==1?"可用":"不可用"}</Col></Row>
                                    <Row><Col span={10}>系统状态</Col><Col span={8} offset={6}>{item.icCardStatusName}</Col></Row>
                                    <Row><Col span={10}>开卡时间</Col><Col span={10}>{formatDate(item.createTime)}</Col></Row>    
                                    {index!=0?<Row style={{height:41}}></Row>:null}
                                </div>
                            }
                            />
                        </Skeleton>
                    </Card>
                </Col>
              )
            }else{
              cards.push(
                    <Col span={12} style={{minWidth:320}}>
                        <Card
                            style={{ marginTop: 16 }}
                            actions={item.icCardStatus==1&&item.systemType!=4?
                              [ <span onClick={this.showSetModal.bind(this,item.systemType,item.icCardNo)}>限额设置</span>,
                                <span onClick={this.goIcConsume.bind(this,item.systemType,item.icCardNo)}>消费查询</span>, 
                                <span onClick={this.goIcCircle.bind(this,item.systemType,item.icCardNo)}>圈存查询</span>
                              ]:(item.icCardStatus!=1&&(item.icCardStatusId==2||item.icCardStatusId==8||item.icCardStatusId==10)&&index==0?[
                                <span onClick={this.showOperateModal.bind(this,item)}>操作</span>,
                                <span onClick={this.goIcConsume.bind(this,item.systemType,item.icCardNo)}>消费查询</span>, 
                                <span onClick={this.goIcCircle.bind(this,item.systemType,item.icCardNo)}>圈存查询</span>
                              ]:(item.icCardStatus==1&&item.systemType==4?[
                                <span onClick={this.goIcConsume.bind(this,item.systemType,item.icCardNo)}>消费查询</span>, 
                                <span onClick={this.goIcCircle.bind(this,item.systemType,item.icCardNo)}>圈存查询</span>
                              ]:[
                                <span onClick={this.goIcConsume.bind(this,item.systemType,item.icCardNo)}>消费查询</span>, 
                                <span onClick={this.goIcCircle.bind(this,item.systemType,item.icCardNo)}>圈存查询</span>
                              ]))
                            }
                        >
                            <Skeleton loading={false} avatar active >
                                <Meta
                                avatar={<Avatar src={item.systemType==2?ShangTong:(item.systemType==3?SongXing:Yks)} />}
                                description={
                                    <div className="card-main">
                                        <Row><Col span={10}>物理卡号</Col><Col span={10}>{item.icChipNo}</Col></Row>
                                        <Row><Col span={10}>逻辑卡号</Col><Col span={10}>{item.icCardNo}</Col></Row>
                                        <Row><Col span={10}>当前状态</Col><Col span={8} offset={6} style={{color:item.icCardStatus==1?"#3E9E3E":"#f00"}}>{item.icCardStatus==1?"可用":"不可用"}</Col></Row>
                                        <Row><Col span={10}>系统状态</Col><Col span={8} offset={6}>{item.icCardStatusName}</Col></Row>
                                        <Row><Col span={10}>开卡时间</Col><Col span={10}>{formatDate(item.createTime)}</Col></Row>
                                        {index==0?<Row style={{height:20}}>
                                          <Col span={10}>卡片余额</Col>
                                          <Col span={8} offset={6}>{this.state.stCardMoney?this.state.stCardMoney:"--"}&nbsp;&nbsp;<Icon type="redo" onClick={this.checkCardMoney.bind(this,item)} /></Col>
                                        </Row>:<Row style={{height:20}}>
                                          <Col span={10}></Col><Col span={8} offset={6}></Col>
                                        </Row>}
                                    </div>
                                }
                                />
                            </Skeleton>
                        </Card>
                    </Col>
              )
            }
          })
          const {stIcConsumeLimitDetail} = this.props;
          const kw=getQueryString('kw');
        return (
            <div className="content-main card-manage">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{initialValue:kw?decodeURI(kw):''})(
                        <Search placeholder="请输入姓名或证件号或手机号或卡号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              {cardData&&cardData.length>0&&cardData[0].systemType==1?<span>
                <Table className='content-table' scroll={{ x: 1000 }} columns={cardData&&cardData[0].personType==1?studentColumns2:teacherColumns2} dataSource={cardData} pagination={false}/>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={24}>
                    {cards}
                    </Row>
                </div>
              </span>:null}
              {cardData&&cardData.length>0&&cardData[0].systemType!=1?<span>
                <Table className='content-table' scroll={{ x: 1000 }} columns={cardData&&cardData[0].personType==1?studentColumns:teacherColumns} dataSource={cardData} pagination={false}/>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={24}>
                    {cards}
                    </Row>
                </div>
              </span>:null}
              <Modal
                title="请选择"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Table className='content-table' scroll={{ x: 1000 }} rowSelection={rowSelection} columns={modalColumns} dataSource={modalData} pagination={false}/>
              </Modal>
              <Modal
                title="操作"
                visible={this.state.operateVisible}
                onOk={this.operateHandleOk}
                onCancel={this.operateHandleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={20} >
                    <FormItem {...formItemLayout} label='操作'>
                      {getFieldDecorator('cardType',{initialValue:''})(
                        <Select onChange={this.selectChange}>
                          {icCardStatusId==2&&systemType==1?<Option value="1">解挂</Option>:null}
                          {(icCardStatusId==0||icCardStatusId==1)&&systemType==1?<Option value="2">挂失</Option>:null}
                          {icCardStatusId==2&&systemType==1?<Option value="7">补卡</Option>:null}
                          {(icCardStatusId==8||icCardStatusId==10)&&systemType==1?<Option value="8">补卡</Option>:null}
                          {(icCardStatusId==0||icCardStatusId==1)&&systemType==1?<Option value="8">注销</Option>:null}
                          {icCardStatusId==2&&systemType==1?<Option value="10">注销</Option>:null}
                          {icCardStatusId==2&&systemType!=1?<Option value="7">补卡</Option>:null}
                          {(icCardStatusId==10||icCardStatusId==8)&&systemType!=1?<Option value="8">补卡</Option>:null}
                        </Select>
                      )}
                    </FormItem>
                  </Col> 
                  {this.state.selectVal==7||(this.state.selectVal==8&&(icCardStatusId==8||icCardStatusId==10))?<Col span={20} >
                    <FormItem {...formItemLayout} label='物理卡号'>
                      {getFieldDecorator('icChipNo',{initialValue:'',rules:[{required:true, message:'请输入物理卡号',whitespace: true, pattern:/^[0-9a-fA-F]+$/}]})(
                        <Input maxLength='8'/>
                      )}
                    </FormItem>
                  </Col> :null}
                  {this.state.selectVal==7||(this.state.selectVal==8&&(icCardStatusId==8||icCardStatusId==10))?<Col span={20} >
                    <FormItem {...formItemLayout} label='补卡金额（元）'>
                      {getFieldDecorator('fee',{initialValue:'',rules:[{message:'请输入正确的金额', pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/}]})(
                        <Input placeholder=""/>
                      )}
                    </FormItem>
                  </Col> :null}
                </Row>
              </Form> 
              </Modal>
              <Modal
                title="限额设置"
                visible={this.state.setVisible}
                onOk={this.setHandleOk}
                onCancel={this.setHandleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={20} >
                    <FormItem {...formItemLayout} label='单日消费金额上限'>
                      {getFieldDecorator('Tconmoney',{initialValue:this.state.Tconmoney||''})(
                        <InputNumber min={0} max={500} />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={20} >
                    <FormItem {...formItemLayout} label='单日消费次数上限'>
                      {getFieldDecorator('Tcontimes',{initialValue:this.state.Tcontimes||''})(
                        <InputNumber min={0} max={50} />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={20} >
                    <FormItem {...formItemLayout} label='单次消费金额上限'>
                      {getFieldDecorator('AmtLimit',{initialValue:this.state.AmtLimit||''})(
                        <InputNumber min={0} max={100} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form> 
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    stIcConsumeLimitDetail:state.card.stIcConsumeLimitDetail
  }
}
export default connect(mapStateToProps)(Form.create()(CardManage));
