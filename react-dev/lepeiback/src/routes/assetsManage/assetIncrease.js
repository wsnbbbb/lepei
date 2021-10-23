import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, DatePicker ,Breadcrumb, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, Tooltip} from 'antd';
import { routerRedux,Link } from 'dva/router';
import PageIndex from '../../components/page';
import moment from 'moment';
import { portUrl, getUpload } from '../../utils/img';
import { formatDate,onlyDate } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const TextArea = Input.TextArea;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class AssetIncrease extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        assetsTypeList:[],
        list:{},
        detailList:[],
        financialTime:'',
        exportUrl:'',
        visible:false,
        confirmLoading:false,
        allotRecordList:[],
        safetyStock:'',
        applyNumPre:'',
        assetName:'',
        totalNum:'',
        stockNum:'',
        catName:'',


      };
  }
  componentDidMount=()=>{
    this.getAssetIncrease()
    this.getAssetsType()
    
  }
  // 获取资产增提列表
  getAssetIncrease = (params) =>{
    this.props.dispatch({
      type:'assetsManage/getAssetIncrease',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
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
    this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw": values.kw||'',
          "catId": values.catId||'',
          "financialTime": this.state.financialTime||'',
        }
        this.getAssetIncrease(params)
    })
  }
  // 分页
  onPageChange = (current,size) =>{
    this.props.form.validateFields((err,values) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "catId": values.catId||'',
          "financialTime": this.state.financialTime||'',
        }
        this.getAssetIncrease(params)
    })
  }
  // 起止时间
  onTimeChange = (date, dateString) => {
    const start = dateString[0];
    const end = dateString[1];
    this.setState({
      financialTime:start + ' ~ ' + end
    })
  }
  // 查看
  showAssetIncrease = (id) =>{
      console.log(id)
      this.props.dispatch({
        type:'assetsManage/stockDetail',
        payload:{id},
        callback:(res)=>{
          if(res.code === 200){
            this.setState({
              visible:true,
              num:res.data.num,proCode:res.data.proCode,financialTime:res.data.financialTime,price:res.data.price,supplier:res.data.supplier,getTime:res.data.getTime,buyOrgType:res.data.buyOrgType,catName:res.data.catName,
              proValue:res.data.proValue,getType:res.data.getType,accountType:res.data.accountType,valueType:res.data.valueType,unit:res.data.unit,specification:res.data.specification,useStatus:res.data.useStatus,usage:res.data.usage,
              manageDepartment:res.data.manageDepartment,expireTime:res.data.expireTime,financialStatus:res.data.financialStatus,storePlace:res.data.storePlace,discountStatus:res.data.discountStatus,remark:res.data.remark,propertyName:res.data.propertyName,
            })
          }
        }
      })
  }
  // 返回
  handleCancel = () =>{
    this.setState({visible:false})
  }
  // 增提
  addIncrease = () =>{
      this.props.dispatch(routerRedux.push("/add-increase"))
  }
  // 编辑
  edit = (id,appliedNum) =>{
    if(appliedNum > 0){
      return message.error("物品申领还有未完成的流程，请处理完成后再盘点！")
    }
    this.props.dispatch(routerRedux.push("/add-increase?id="+id+"&appliedNum="+appliedNum))
  }
  
  // 资产增提导出
  export=()=>{
    this.props.form.validateFields((err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let catId = values.catId||'';
      let kw = values.kw||'';
      let financialTime = this.state.financialTime||'';
      let url=portUrl("/manager/property-storage/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&catId="+catId+"&kw="+kw+"&financialTime="+financialTime)
      this.setState({exportUrl:url})
    })
  }
  // 批量增提
  batch = () =>{
    this.props.dispatch(routerRedux.push("/batch-increase"))
  }
   
  // 删除
  del = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delAssetsIncrease',
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
    const { list, detailList, assetsTypeList, visible, catName,num, proCode,financialTime,price,supplier,getTime,buyOrgType,proValue,getType,accountType,valueType,
      unit,specification,useStatus,expireTime,financialStatus,storePlace,discountStatus,remark,propertyName,manageDepartment,usage} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span:8 },
      wrapperCol: { span: 15 }
    };
    let options = []
    assetsTypeList&&assetsTypeList.map(item =>{
      options.push(<Option key={item.id} value={item.id}>{item.catName}</Option>)
    })
    const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        width:200,
        title: '资产类型',
        dataIndex: 'catName',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span>{record}</span>
          </Tooltip>
        )
      },{
        width:200,
        title: '资产名称',
        dataIndex: 'propertyName',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span>{record}</span>
          </Tooltip>
        )
      },{
        title: '数量',
        dataIndex: 'num',
      },{
        title: '计量单位',
        dataIndex: 'unit',
      },{
        title: '财务入账日期',
        dataIndex: 'financialTime',
        render:( record) => (
          <span>{onlyDate(record)}</span>
        )
      },{
        width:300,
        title: '供应商',
        dataIndex: 'supplier',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span>{record}</span>
          </Tooltip>
          )
      },{
        title: '创建时间',
        dataIndex: 'createTime',
        render:( record) => (
          <span>{formatDate(record)}</span>
        )
      },{
        title: '操作',
        dataIndex: '',
        width:150,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.showAssetIncrease.bind(this,record.id)}>查看&emsp;</a>
            <a href="javascript:;" onClick={this.edit.bind(this,record.id,record.appliedNum)}>编辑&emsp;</a>
            <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
           
          </span>
        )
      }
    ]
   
    return (
      <div className="content-main asset-increase">
        <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/assets-list">资产管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>资产增提</Breadcrumb.Item>
        </Breadcrumb> 
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={5}>
              <FormItem >
                {getFieldDecorator('kw')(
                  <Search
                    placeholder="资产名称/供应商名称"
                  />
                )}
              </FormItem>
            </Col> 
            <Col span={4}>
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
            <Col span={5}>
              <FormItem >
                {getFieldDecorator("financialTime")(
                  <RangePicker onChange={this.onTimeChange} />
                )}
              </FormItem>
            </Col>
            
            <Col span={8} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.addIncrease.bind(this)}>增提</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={
                  <Menu>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href={this.state.exportUrl}  onClick={this.export.bind(this)}>导出</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.batch.bind(this)}>批量增提</a>
                    </Menu.Item>
                  </Menu>
                  }>
                  <a  href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
              </Dropdown>
            </Col> 
          </Row>
        </Form>
        <Table  columns={columns} dataSource={detailList} pagination={false}/>
        <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
        <Modal
          className="stock-Record-modal"
          width={800}
          title="详情"
          visible={visible}
          onCancel={this.handleCancel}
          footer={<Button type="primary" onClick={this.handleCancel}>返回</Button>}
        >
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>列表类型：</span>{catName}</Col>
            <Col offset={2} span={10}><span>资产名称：</span>{propertyName} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>资产编号：</span>{proCode} </Col>
            <Col offset={2} span={10}><span>采购组织形式：</span>{buyOrgType} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>取得方式：</span>{getType} </Col>
            <Col offset={2} span={10}><span>取得日期：</span>{onlyDate(getTime)} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>入账形式：</span>{accountType} </Col>
            <Col offset={2} span={10}><span>价值类型：</span>{valueType} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>数量：</span>{num} </Col>
            <Col offset={2} span={10}><span>单价：</span>{price} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>价值：</span>{proValue} </Col>
            <Col offset={2} span={10}><span>计量单位：</span>{unit} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>规格：</span>{specification} </Col>
            <Col offset={2} span={10}><span>使用状态：</span>{useStatus} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>使用方向：</span>{usage} </Col>
            <Col offset={2} span={10}><span>财务入账状态：</span>{financialStatus} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>财务入账时间：</span>{onlyDate(financialTime)} </Col>
            <Col offset={2} span={10}><span>管理部门：</span>{manageDepartment} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>预计使用年限：</span>{expireTime} </Col>
            <Col offset={2} span={10}><span>存放地点：</span>{storePlace} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={10}><span>折旧状态：</span>{discountStatus} </Col>
            <Col offset={2} span={10}><span>备注：</span>{remark} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>供应商：</span>{supplier} </Col>
          </Row>
        </Modal>          
      </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AssetIncrease));
