import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Modal,Card,Skeleton, Avatar,message  } from 'antd';
import {getSexType,getGradeType,formatDate,getQueryString} from '../../utils/public';
import Lepei from '../../assets/lepei.png';
import './style.less';


const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const { Meta } = Card;

class ParentsCardManage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cardData:[], //个人信息列表
      modalData:[], //重名人员列表
      selectedRows:[],
      selectedRowKeys: [],
      cardLists:[], // 卡片信息
      operateVisible:false,
    };
  }
  componentDidMount = () => {
    const kw = getQueryString('kw');
    if(kw){
      const params = {'kw':decodeURI(kw)}
      this.getPersonCard(params)
    }
  }
  //获取个人信息及卡片信息
  getPersonCard = (params) => {
    this.props.dispatch({
      type:'card/getParentsCard',
      payload:params,
      callback:(res) => {
        if(res.code === 200){
          res.data.map((item,index) => {
            item.key = index
          })
          if(res.data.length > 1){
            this.setState({
              visible:true,
              modalData:res.data,
              selectedRows:[],
              selectedRowKeys: [],
            })
          }else{
            this.setState({
              visible:false,
              cardData:[...res.data]
            })
            if(res.data&&res.data.length > 0){
              console.log(res.data)
                this.setState({parentId: res.data[0].parentId})
                this.props.dispatch({
                  type:'card/getParentsCardData',
                  payload:{"parentId":res.data[0].parentId},
                  callback:(res) => {
                    console.log(res)
                    if(res.code === 200){
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
  search = () => {
    this.props.form.validateFields((err, values) => {
      if(!values.kw){
        return message.error("请输入查询条件后再进行查询",3)
      }
      const params = {'kw':values.kw}
      this.getPersonCard(params)
    })
  }
  // 重名人员选择
  onChange=(selectedRowKeys, selectedRows) => {
    this.setState({selectedRows:selectedRows,selectedRowKeys })
  }
  // 重名选择人员确定
  handleOk = (e) => {
    this.setState({
      visible: false,
      cardData:this.state.selectedRows,
      parentId: this.state.selectedRows[0].parentId
    });
    if(this.state.selectedRows.length > 0){
      this.props.dispatch({
        type:'card/getParentsCardData',
        payload:{"parentId":this.state.selectedRows[0].parentId},
        callback:(res) => {
          console.log(res)
          if(res.code === 200){
            this.setState({cardLists:res.data})
          }
        }
      })
    }
  }
  // 重名选择人员取消  
  handleCancel = (e) => {
    this.setState({
      visible: false,selectedRows:[],selectedRowKeys: [],
    });
  }
  // 操作
  showOperateModal = (item) => {
    this.setState({
      operateVisible: true,
      cardId:item.icCardId,
      icCardStatusId:item.icCardStatusId,
    });
  }

  // 操作下拉框选择
  selectChange = (value) => {
    console.log({value});
    this.setState({
      selectVal:value
    })
  }

  // 操作确定
  operateHandleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if(!values.icChipNo && this.state.selectVal == 7){
        return message.error('请输入物理卡号')
      }
      if(values.icChipNo && values.icChipNo.length != 8){
        return message.error("物理卡号应该是8位数",2)
      }
      let reg = /^[0-9a-fA-F]+$/
      if(values.icChipNo && !reg.test(values.icChipNo)){
        return message.error("卡号格式不正确(8位数字、A-F(a-f)字母组成)",3)
      }
      if(!err){
        const params = {
          'cardId':this.state.cardId, 
          'cardType':values.cardType, 
          'icChipNo':values.icChipNo,
          'fee':values.fee || ''
        }
        this.props.dispatch({
          type:'card/operateParentsCard',
          payload:params,
          callback:(res) => {
            if(res.code === 200){
              message.success('设置成功',2)
              this.props.dispatch({
                type:'card/getParentsCardData',
                payload:{"parentId":this.state.parentId},
                callback:(res) => {
                  console.log(res)
                  if(res.code === 200){
                    this.setState({cardLists:res.data})
                  }
                }
              })
              this.setState({
                operateVisible: false, 
                selectVal:''
              });
              this.props.form.resetFields(['cardType','icChipNo','fee']);
            }
          }
        })
      }
    })
  }
  // 操作取消
  operateHandleCancel = (e) => {
    this.props.form.resetFields(['cardType','icChipNo','fee']);
    this.setState({
      operateVisible: false,
      selectVal:''
    });
  }
  
  render(){
    const columns = [{
      title: '家长姓名',
      dataIndex: 'parentName',
    },{
      title: '关系',
      dataIndex: 'relationName',
    }, {
      title: '学生姓名',
      dataIndex: 'studentName',
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
   
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys ,
      onChange: this.onChange ,
      type:'radio',
    };
    const { getFieldDecorator } = this.props.form;
    const { cardData, modalData, cardLists, icCardStatusId } = this.state;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    };
    let cards = [];
    cardLists && cardLists.length > 0 && cardLists.map((item, index) => {
      cards.push(
        <Col span={10} style={{minWidth:320}} key={index}>
          <Card
            actions={index == 0 ? [<span onClick={this.showOperateModal.bind(this,item)}>操作</span>] : []}
          >
            <Skeleton loading={false} avatar active>
              <Meta
              avatar={<Avatar src={Lepei} />}
              description={
                <div className="card-main">
                  <Row><Col span={10}>物理卡号</Col><Col span={10}>{item.icChipNo}</Col></Row>
                  <Row><Col span={10}>逻辑卡号</Col><Col span={10}>{item.icCardNo}</Col></Row>
                  <Row><Col span={10}>当前状态</Col><Col span={8} style={{color:item.icCardStatus == 1 ? "#3E9E3E" : "#f00"}}>{item.icCardStatus == 1 ? "可用" : "不可用"}</Col></Row>
                  <Row><Col span={10}>系统状态</Col><Col span={8}>{item.icCardStatusName}</Col></Row>
                  <Row><Col span={10}>开卡时间</Col><Col span={10}>{formatDate(item.createTime)}</Col></Row>    
                  {index != 0 ? <Row style={{height:41}}></Row> : null}
                </div>
              }
              />
            </Skeleton>
          </Card>
        </Col>
      )
      
    })
    const kw = getQueryString('kw');
    console.log({kw});
    return (
      <div className="content-main parents-card-manage">
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={7}>
              <FormItem label=''>
                {getFieldDecorator('kw',{initialValue:kw ? decodeURI(kw) : ''})(
                  <Search placeholder="请输入家长姓名或学生姓名"/>
                )}
              </FormItem>
            </Col> 
            <Col span={2} offset={0}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Form>              
        {cardData&&cardData.length > 0 ? <span>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={cardData} pagination={false}/>
          <div className="card-info">
            <Row gutter={24}>{cards}</Row>
          </div>
        </span>:null}
        <Modal
          width={800}
          title="请选择"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table className='content-table' scroll={{ x: 1000 }} rowSelection={rowSelection} columns={columns} dataSource={modalData} pagination={false}/>
        </Modal>
        <Modal
          title="操作"
          visible={this.state.operateVisible}
          onOk={this.operateHandleOk}
          onCancel={this.operateHandleCancel}
        >
          <Form className="content-form">
          <Row gutter={24}>
            <Col span={20} >
              <FormItem {...formItemLayout} label='操作'>
                {getFieldDecorator('cardType')(
                  <Select onChange={this.selectChange} placeholder="请选择">
                    {icCardStatusId == 0 || icCardStatusId == 1 ? <Option value="2">挂失</Option>:null}
                    {icCardStatusId == 0 || icCardStatusId == 1 ? <Option value="8">注销</Option>:null}
                    {icCardStatusId == 2 ? <Option value="10">注销</Option>:null}
                    {icCardStatusId == 2 ? <Option value="1">解挂</Option>:null}
                    {icCardStatusId == 2 ? <Option value="7">补卡</Option>:null}
                    {icCardStatusId == 8 || icCardStatusId == 10 ? <Option value="8">补卡</Option>:null}
                    {/* {icCardStatusId==2&&systemType!=1?<Option value="7">补卡</Option>:null} */}
                    {/* {(icCardStatusId==10||icCardStatusId==8)&&systemType!=1?<Option value="8">补卡</Option>:null} */}
                  </Select>
                )}
              </FormItem>
            </Col> 
            {this.state.selectVal == 7 || (this.state.selectVal == 8 && (icCardStatusId == 8 || icCardStatusId == 10))?<Col span={20} >
              <FormItem {...formItemLayout} label='物理卡号'>
                {getFieldDecorator('icChipNo',{initialValue:'',rules:[{required:true, message:'请输入物理卡号',whitespace: true, pattern:/^[0-9a-fA-F]+$/}]})(
                  <Input maxLength={8}/>
                )}
              </FormItem>
            </Col> :null}
            {this.state.selectVal == 7 || (this.state.selectVal == 8 && (icCardStatusId == 8 || icCardStatusId == 10))?<Col span={20} >
              <FormItem {...formItemLayout} label='补卡金额（元）'>
                {getFieldDecorator('fee',{initialValue:'',rules:[{message:'请输入正确的金额', pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/}]})(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col> :null}
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
  }
}
export default connect(mapStateToProps)(Form.create()(ParentsCardManage));
