import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Breadcrumb, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { Link } from 'dva/router';
import { portUrl, getUpload } from '../../utils/img';
import { getQueryString, formatDate ,onlyDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class StockRecord extends Component{
  constructor(props) {
      super(props);
      this.state = {
        storageList:[],
        exportUrl:'',
        visible:false, 
        confirmLoading:false,
      };
  }
  componentDidMount=()=>{
    this.getStockRecord()
  
  }
  
  // 获取入库记录列表
  getStockRecord = (params) =>{
    let id = getQueryString("id")
    this.props.dispatch({
      type:'assetsManage/getStockRecord',
      payload:{id},
      callback:(res) =>{
        if(res.code === 200){
          res.data&&res.data.map((item,index) =>{
            item.key = index
          })
          this.setState({
            storageList:res.data,
          })
        }
      }
    })
  }
  // 导出
  export=()=>{
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let id = getQueryString("id");
      let url=portUrl("/manager/property-storage/storage-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&id="+id)
      this.setState({exportUrl:url})
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 取消
  handleCancel = () =>{
    this.setState({visible:false})
  }

  // 查看
  detail = (id) =>{
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
  
  // 删除
  del = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delStockRecord',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.getStockRecord()
              }
            }
          })
        },
        onCancel() {},
      });
  }
  
  render(){
    const { storageList, visible, confirmLoading, num, proCode,financialTime,price,supplier,getTime,buyOrgType,proValue,getType,accountType,valueType,
      unit,specification,useStatus,expireTime,financialStatus,storePlace,discountStatus,remark,propertyName,catName,manageDepartment,usage  } = this.state;
    let assetName = sessionStorage.getItem("name");
    const totalNum = getQueryString("totalNum");
    const stockNum = getQueryString("stockNum");
      const columns = [{
          title: '序号',
          dataIndex: 'id',
        },{
          title: '资产编号',
          dataIndex: 'proCode',
        },{
          title: '数量',
          dataIndex: 'num',
        },{
          title: '计量单位',
          dataIndex: 'unit',
        },{
          title: '创建时间',
          dataIndex: 'createTime',
          render:(record) =>(
            <span>{formatDate(record)}</span>
          )
        },{
          title: '操作',
          dataIndex: '',
          width:180,
          fixed:'right',
          render:(text, record) => (
            <span>
             <a href="javascript:;" onClick={this.detail.bind(this,record.id)}>查看&emsp;</a>
             <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
            </span>
          )
        }
      ]
      return (
          <div className="content-main stock-Record">
            <Breadcrumb className="Breadcrumb">
              <Breadcrumb.Item><Link to="/assets-list">资产管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item>入库记录</Breadcrumb.Item>
            </Breadcrumb>  
            <div style={{margin:"0 0 20px 20px"}}>
              <Row gutter={16}>
                <Col className="text" span={4}><div>资产名称：{assetName}</div></Col>
                <Col className="text" span={3}><div>总量：{totalNum}</div></Col>
                <Col className="text" span={3}><div>库存量：{stockNum}</div></Col>
                <Col className="text" span={4}> 
                  <Button type="primary"><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                </Col>
              </Row>
            </div>
            <Table  columns={columns} dataSource={storageList} pagination={false}/>
            <Row gutter={16}>
              <Col className="back"> 
                <Button type="primary" onClick={this.back.bind(this)}>返回</Button>
              </Col>
              </Row>
            <Modal
                className="stock-Record-modal"
                width={800}
                title="详情"
                visible={visible}
                confirmLoading={confirmLoading}
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

export default connect(mapStateToProps)(Form.create()(StockRecord));
