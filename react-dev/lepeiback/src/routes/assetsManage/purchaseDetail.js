import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Form, Row, Col} from 'antd';
import { Link } from 'dva/router';
import { portUrl } from '../../utils/img';
import { getQueryString, formatDate, assetStatus } from '../../utils/public';
import './style.less';


class PurchaseDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
      
      };
  }
  componentDidMount=()=>{
    this.getPurchaseDetail()
  
  }
  
  // 详情列表
  getPurchaseDetail = (params) =>{
    const id = getQueryString("id")
    this.props.dispatch({
      type:'assetsManage/getPurchaseDetail',
      payload:{id},
      callback:(res) =>{
        if(res.code === 200){
          res.data.applyProducts&&res.data.applyProducts.map((item,index) => {
            item.key = index
          })
          res.data.examineRecords&&res.data.examineRecords.map((item,index) => {
            item.key = index
          })
          this.setState({
            departmentName:res.data.detail.departmentName,
            applyTime:res.data.detail.applyTime,
            status:res.data.detail.status,
            applyName:res.data.detail.applyName,
            applyProducts:res.data.applyProducts,
            examineRecords:res.data.examineRecords,
          })
        }
      }
    })
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 导出
  export = () =>{
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let id = getQueryString("id")
      let url=portUrl("/manager/property-buy-apply/detail-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&id="+id)
      this.setState({exportUrl:url})
  }
  
  render(){
    const { applyProducts, examineRecords , departmentName, applyTime, status, applyName} = this.state;
    const columns = [{
        title: '物品名称',
        dataIndex: 'propertyName',
      },{
        title: '规格',
        dataIndex: 'specification',
      },{
        title: '单位',
        dataIndex: 'propertyUnit',
        
      },{
        title: '申购数量',
        dataIndex: 'applyNum',
      },{
        title: '单价',
        dataIndex: 'price',
      },{
        title: '预算费用',
        dataIndex: 'budgetFee',
      },{
        title: '时间要求',
        dataIndex: 'timeRequest',
      },{
        title: '用途',
        dataIndex: 'use',
      },{
        title: '备注',
        dataIndex: 'remark',
      }
    ]
    const columns1 = [{
        title: '序号',
        dataIndex: 'applyId',
      },{
        title: '审批人',
        dataIndex: 'dealerName',
        
      },{
        title: '审批状态',
        dataIndex: 'applyStatus',
        render:(record) =>(
          <span>{record == 1?"同意":(record == 0?"不同意":null)}</span>
        )
      },{
        title: '拒绝原因/备注',
        dataIndex: 'reason',
        
      },{
        title: '审批时间',
        dataIndex: 'createTime',
        render:(record) =>(
          <span>{formatDate(record)}</span>
        )
      }
    ]
    return (
        <div className="content-main assets-detail">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/goods-purchase">物品申购</Link></Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb> 
          <div className="detailList">
            <Row gutter={24} className="text-style">
              <Col span={10}>
                申购部门：{departmentName&&departmentName}
              </Col>
              <Col span={10}>
                申购人：{applyName}
              </Col>
            </Row>
            <Row gutter={24} className="text-style">
              <Col span={10}>
                申请时间：{formatDate(applyTime)}
              </Col>
              <Col span={10}>
                审批状态：{assetStatus(status)}
              </Col>
            </Row>
          </div>
          <h3 className="title">申购物品</h3>
          <Table style={{marginBottom:"20px"}} columns={columns} dataSource={applyProducts} pagination={false}/>
          <h3 className="title">审批流程</h3>
          <Table columns={columns1} dataSource={examineRecords} pagination={false}/>
          <div className="btn">
            <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
          </div>
        </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(PurchaseDetail));
