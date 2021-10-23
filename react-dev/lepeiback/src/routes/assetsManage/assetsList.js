import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, DatePicker ,Tooltip, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
import moment from 'moment';
import { portUrl } from '../../utils/img';
import { formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const TextArea = Input.TextArea;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;

class AssetsList extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        assetsTypeList:[],
        list:{},
        detailList:[],
        exportUrl:'',
        visible:false,
        confirmLoading:false,
        visible1:false,
        confirmLoading1:false,
        visible2:false,
        confirmLoading2:false,
        visible3:false,
        confirmLoading3:false,
        allotRecordList:[],
        safetyStock:'',
        applyNumPre:'',
        assetName:'',
        totalNum:'',
        stockNum:'',
        catName:'',
        inventoryDate:moment().format('YYYY-MM-DD'),
      };
  }
  componentDidMount=()=>{
    this.assetManageList()
    this.getAssetsType()
    this.props.dispatch({
      type:'user/getInformation',
    })
  
  }
  // 获取资产管理列表
  assetManageList = (params) =>{
    this.props.dispatch({
      type:'assetsManage/assetManageList',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          res.data.dataList&&res.data.dataList.map(item => {

          })
          this.setState({
            list:res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }
  // 获取资产类型列表
  getAssetsType = () =>{
    this.props.dispatch({
      type:'assetsManage/assetsType',
      callback:(res) =>{
        if(res.code === 200){
          this.setState({assetsTypeList:res.data})
        }
      }
    })
  }
  // 查询
  search=()=>{
    this.props.form.validateFields(["kw","catId"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw": values.kw||'',
          "catId": values.catId||'',
        }
        this.assetManageList(params)
    })
  }
  // 分页
  onPageChange = (current,size) =>{
    this.props.form.validateFields(["kw","catId"],(err,values) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "catId": values.catId||'',
        }
        this.assetManageList(params)
    })
  }
  // 申领规则
  applyRules = (id,safetyStock,applyNumPre) =>{
    this.setState({
      visible:true,
      assetId:id,
      safetyStock,
      applyNumPre
    })
  }

  // 申领规则设置保存
  handleOk = () =>{
    this.props.form.validateFields(["safetyStock","applyNumPre"],(err,values) =>{
      if(!err){
        const params = {
          "id":this.state.assetId,
          "safetyStock":values.safetyStock,
          "applyNumPre":values.applyNumPre,
        }
        this.props.dispatch({
          type:'assetsManage/applyRuleSet',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("申领规则设置成功！")
              this.setState({
                visible:false,
              })
              this.props.form.resetFields(["safetyStock","applyNumPre"])
              this.search()
            }
          }
        })
      }
    })
  }
  // 取消
  handleCancel = () =>{
    this.setState({visible:false})
    this.props.form.resetFields(["safetyStock","applyNumPre"])
  }
  // 入库记录
  stockRecord = (id,name,totalNum,stockNum) =>{
    sessionStorage.setItem("name",name)
    console.log(name)
    this.props.dispatch(routerRedux.push("/stock-record?id="+id+"&totalNum="+totalNum+"&stockNum="+stockNum))
  }
  // 分配记录
  allotRecord = (id,name,totalNum,stockNum) =>{
    this.getAllotRecord(id)
    this.setState({
      visible1:true,
      assetName:name,
      totalNum:totalNum,
      stockNum:stockNum,
      assetId:id,
    })
  }
  // 获取分配记录详情
  getAllotRecord = (id) =>{
    this.props.dispatch({
      type:'assetsManage/allotRecord',
      payload:{id},
      callback:(res) =>{
        if(res.code === 200){
          res.data && res.data.map((item, index) =>{
            item.key = index
          })
          this.setState({
            allotRecordList:res.data,
          })
        }
      }
    })
  }
  // 返回
  handleCancel1 = () =>{
    this.setState({visible1:false})
  }
  // 删除分配记录
  delAllotRecord = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delAllotRecord',
            payload:{id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.getAllotRecord(that.state.assetId)
              }
            }
          })
        },
        onCancel() {},
      });
  }
  // 分配记录导出
  allotRecordExport = () =>{
    let token=sessionStorage.getItem("token");
    let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
    let userId=sessionStorage.getItem("userId");
    let id = this.state.assetId||'';
    let url=portUrl("/manager/property-distribution-records/distribution-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&id="+id)
    this.setState({exportUrl:url})
  }
  // 盘点
  takeStock = (id, name, catName, totalNum, stockNum, appliedNum) => {
    if(appliedNum > 0){
      return message.error("物品申领还有未完成的流程，请处理完成后再盘点！")
    }
    this.setState({
      visible2:true,
      catName:catName,
      assetName:name,
      totalNum:totalNum,
      stockNum:stockNum,
      assetId:id,
    })
  }
  // 盘点日期
  onTimeChange = (date, dateString) => {
    this.setState({
      inventoryDate:dateString
    })
  }
  // 盘点确定
  handleOk2 = () =>{
    this.props.form.validateFields(["newStock","remark"],(err,values) =>{
      if(!err){
        if(parseInt(values.newStock) > parseInt(this.state.totalNum)){
          return message.error("盘点数量不能大于总量！")
        }
        if(values.newStock == this.state.totalNum){
          return message.error("盘点数量与总量一致，无需盘点！")
        }
        const params = {
          "id":this.state.assetId,
          "newStock":values.newStock,
          "remark":values.remark || '',
          "inventoryDate":this.state.inventoryDate
        }
        console.log({params})
        this.props.dispatch({
          type:'assetsManage/takeStock',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("盘点成功！")
              this.setState({
                visible2:false,
              })
              this.props.form.resetFields(["newStock","remark"])
              this.search()
            }
          }
        })
      }
    })
  }
  // 取消
  handleCancel2 = () =>{
    this.setState({visible2:false})
    this.props.form.resetFields(["newStock","remark"])
  }
  // 盘点记录
  takeStockRecord = (id) => {
    this.props.dispatch({
      type:'assetsManage/takeStockRecord',
      payload:{id},
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            visible3:true,
            takeStockList:res.data,
          })
        }
      }
    })
  }
  // 取消
  handleCancel3 = () =>{
    this.setState({visible3:false})
  }
  // 资产分配
  assetAllot = () =>{
    this.props.dispatch(routerRedux.push("/asset-allocation"))
  }
  // 资产转移
  assetTransfer = () =>{
    this.props.dispatch(routerRedux.push("/asset-transfer"))
  }
  // 资产类型
  toAssetTypes = () =>{
    this.props.dispatch(routerRedux.push("/asset-types"))
  }
  // 资产增提
  assetIncrease = () =>{
    this.props.dispatch(routerRedux.push("/asset-increase"))
  }
  
  // 资产列表导出
  export=()=>{
    this.props.form.validateFields((err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let catId = values.catId||'';
      let kw = values.kw||'';
      let url=portUrl("/manager/property-info/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&catId="+catId+"&kw="+kw)
      this.setState({exportUrl:url})
    })
  }
  
  // 删除
  del = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delAssetsInfo',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.search()
              }
            }
          })
        },
        onCancel() {},
      });
  }
  render(){
    const { list, detailList, assetsTypeList, visible, confirmLoading,visible1, confirmLoading1, safetyStock, applyNumPre,allotRecordList,assetName,totalNum,
      stockNum, catName,visible2, confirmLoading2,visible3, confirmLoading3 , takeStockList} = this.state;
      console.log({allotRecordList});
    const { getFieldDecorator } = this.props.form;
    const {information} = this.props;
    console.log({information})
    const formItemLayout = {
      labelCol: { span:7 },
      wrapperCol: { span: 16 }
    };
    let timestamp = (new Date()).getTime();
    let options = []
    assetsTypeList&&assetsTypeList.map(item =>{
      options.push(<Option key={item.id} value={item.id}>{item.catName}</Option>)
    })
    const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        width:200,
        title: '资产名称',
        dataIndex: 'name',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span className="text">{record}</span>
          </Tooltip>
        )
      },{
        width:200,
        title: '资产类型',
        dataIndex: 'catName',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span className="text">{record}</span>
          </Tooltip>
        )
      },{
        title: '计量单位',
        dataIndex: 'unit',
      },{
        title: '总量',
        dataIndex: 'totalNum',
      },{
        title: '库存量',
        dataIndex: 'stockNum',
      },{
        title: '安全库存量',
        dataIndex: 'safetyStock',
      },{
        title: '单次限领数量',
        dataIndex: 'applyNumPre',
      },{
        title: '操作',
        dataIndex: '',
        width:360,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.applyRules.bind(this,record.id,record.safetyStock,record.applyNumPre)}>申领规则&emsp;</a>
            <a href="javascript:;" onClick={this.stockRecord.bind(this,record.id,record.name,record.totalNum,record.stockNum)}>入库记录&emsp;</a>
            <a href="javascript:;" onClick={this.allotRecord.bind(this,record.id,record.name,record.totalNum,record.stockNum)}>分配记录&emsp;</a>
            <a href="javascript:;" onClick={this.takeStock.bind(this,record.id,record.name,record.catName,record.totalNum,record.stockNum,record.appliedNum)}>盘点&emsp;</a>
            <a href="javascript:;" onClick={this.takeStockRecord.bind(this,record.id)}>盘点记录&emsp;</a>
          </span>
        )
      }
    ]
    const columns1 = [{
        title: '分配时间',
        dataIndex: 'createTime',
        render:(record) => (
          <span> {formatDate(record)} </span>
        )
      },{
        title: '分配类型',
        dataIndex: 'typeName',
      },{
        title: '使用人',
        dataIndex: '',
        render:(record) => (
          <span>{record.type == 2 ? record.oldPersonName + '-->' + record.newPersonName : record.newPersonName}</span>
        )
      },{
        title: '数量',
        dataIndex: 'num',
      },{
        title: '计量单位',
        dataIndex: 'unit',
      },{
        title: '是否归还',
        dataIndex: 'returnStatus',
       
      },{
        title: '归还时间',
        dataIndex: 'returnTime',
        render:(record) => (
          <span> {record != 0 ? formatDate(record) : null} </span>
        )
      },{
        title: '操作',
        dataIndex: '',
        render:(text, record) => (
          <span>
            {record.type == 1?<a href="javascript:;" onClick={this.delAllotRecord.bind(this,record.id)}>删除</a>:null}
          </span>
        )
      }
    ]
    const columns2 = [{
        title: '资产名称',
        dataIndex: 'propertyName',
      },{
        title: '库存量',
        dataIndex: 'oldStock',
      },{
        title: '盘点量',
        dataIndex: 'NewStock',
      },{
        title: '盘点人',
        dataIndex: 'inventoryPerson',
      },{
        title: '盘点日期',
        dataIndex: 'inventoryDate',
      },{
        title: '盘点备注',
        dataIndex: 'remark',
      }
    ]
    return (
      <div className="content-main asset-info">
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={5}>
              <FormItem >
                {getFieldDecorator('kw')(
                  <Search
                    placeholder="资产名称"
                  />
                )}
              </FormItem>
            </Col> 
            <Col span={5}>
              <FormItem >
                {getFieldDecorator("catId")(
                  <Select  
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="资产类型"> 
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
            
            <Col span={12} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.assetAllot.bind(this)}>资产分配</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.assetTransfer.bind(this)}>资产转移</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.assetIncrease.bind(this)}>资产增提</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&nbsp;&nbsp;&nbsp;&nbsp;
                
            </Col>
          </Row>
        </Form>
        <Table  columns={columns} dataSource={detailList} pagination={false}/>
        <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
        <Modal
            title="申领规则"
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form>
              <Row gutter={24} >
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'安全库存'}>
                    {getFieldDecorator("safetyStock",{initialValue:safetyStock||'',rules:[{required:true,message:"请填写正确格式的安全库存量",pattern: /(^[0-9]\d*$)/}]})(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24} >
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'单次限领数量'}>
                    {getFieldDecorator("applyNumPre",{initialValue:applyNumPre||'',rules:[{required:true,message:"请填写正确格式的单次限领数量",pattern: /(^[0-9]\d*$)/}]})(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
        </Modal>
        <Modal
            className="allot-record-modal"
            width={1000}
            title="分配记录"
            visible={visible1}
            confirmLoading={confirmLoading1}
            onCancel={this.handleCancel1}
            footer={<Button type="primary" onClick={this.handleCancel1}>返回</Button>}
          >
          <div style={{margin:"0 0 20px 20px"}}>
            <Row gutter={24}>
              <Col className="text" span={6}><div>资产名称：{assetName}</div></Col>
              <Col className="text" span={4}><div>总量：{totalNum}</div></Col>
              <Col className="text" span={4}><div>库存量：{stockNum}</div></Col>
              <Col className="text" span={4}> 
                <Button type="primary"><a href={this.state.exportUrl} onClick={this.allotRecordExport.bind(this)}>导出</a></Button>
              </Col>
            </Row>
          </div>
          <Table columns={columns1} dataSource={allotRecordList} pagination={false}/>
        </Modal>
        <Modal
            className="take-stock-modal"
            width={600}
            title="盘点"
            visible={visible2}
            confirmLoading={confirmLoading2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
          >
            <Form>
              <Row gutter={24} >
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'资产类型'}>
                    {getFieldDecorator("catName",{initialValue:catName})(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'资产名称'}>
                    {getFieldDecorator("assetName",{initialValue:assetName})(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'库存量'}>
                    {getFieldDecorator("stockNum",{initialValue:stockNum})(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'盘点数量'}>
                    {getFieldDecorator("newStock",{initialValue:'',rules:[{required:true,message:"请输入盘点数量"}]})(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'盘点人'}>
                      <Input value={information&&information.username}/>
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'盘点日期'}>
                    {getFieldDecorator("inventoryDate",{initialValue:moment(timestamp)})(
                       <DatePicker onChange={this.onTimeChange}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'盘点备注'}>
                    {getFieldDecorator("remark")(
                      <TextArea autosize={{ minRows: 1, maxRows: 3 }}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
        </Modal>
        <Modal
            width={900}
            title="盘点记录"
            visible={visible3}
            confirmLoading={confirmLoading3}
            onCancel={this.handleCancel3}
            footer={<Button type="primary" onClick={this.handleCancel3}>返回</Button>}
          >
          <Table  columns={columns2} dataSource={takeStockList} pagination={false}/>
        </Modal>
      </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    information:state.user.information
  }
}

export default connect(mapStateToProps)(Form.create()(AssetsList));
