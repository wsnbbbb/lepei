import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Form, Row, Col} from 'antd';
import { Link } from 'dva/router';
import { portUrl } from '../../utils/img';
import { getQueryString, formatDate, assetStatus } from '../../utils/public';
import './style.less';


class AssetsDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
      
      };
  }
  componentDidMount=()=>{
    this.getAssetsDetail()
  
  }
  
  // 详情列表
  getAssetsDetail = (params) =>{
    const id = getQueryString("id")
    this.props.dispatch({
      type:'assetsManage/getAssetsDetail',
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
            applyUse:res.data.detail.applyUse,
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
      let url=portUrl("/manager/property-get-apply/detail-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&id="+id)
      this.setState({exportUrl:url})
  }
  
  render(){
    const { applyProducts, examineRecords , departmentName, applyUse, applyTime, status, applyName} = this.state;
    const columns = [{
        title: '物品名称',
        dataIndex: 'propertyName',
      },{
        title: '是否易耗品',
        dataIndex: 'isConsumable',
        render:(record) =>(
          <span>{record == 0?"否":(record == 1 ? "是" : null)}</span>
        )
      },{
        title: '单位',
        dataIndex: 'unit',
        
      },{
        title: '申领数量',
        dataIndex: 'applyNum',
        
      },{
        title: '是否通过',
        dataIndex: 'agreeStatus',
        render:(record) =>(
          <span>{record == 0 ? "否" : (record == 1 ? "是" : null)}</span>
        )
        
      },{
        title: '是否领取',
        dataIndex: '',
        render:(record) =>(
          <span>{record.agreeStatus == 0 ? '---' : (record.receiveStatus == 0 ? "否" : (record.receiveStatus == 1 ? "是" : ''))}</span>
        )
        
      },{
        title: '是否归还',
        dataIndex: '',
        render:(record) =>(
          <span>{record.agreeStatus == 0 || record.receiveStatus == 0 ? '---' : (record.isConsumable == 1 ? '无需归还' : (record.status == 0 ? "待归还" : (record.status == 1 ? "已归还" : null)))}</span>
        )
        
      },{
        title: '归还时间',
        dataIndex: 'returnTime',
        render:(record) =>(
          <span>{formatDate(record)}</span>
        )
      }
    ]
    const columns1 = [{
        title: '序号',
        dataIndex: 'stepNum',
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
        title: '拒绝原因',
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
            <Breadcrumb.Item><Link to="/goods-apply">物品申领</Link></Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb> 
          <div className="detailList">
            <Row gutter={24} className="text-style">
              <Col span={10}>
                申领部门：{departmentName&&departmentName}
              </Col>
              <Col span={10}>
                申领人：{applyName}
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
            <Row gutter={24} className="text-style">
              <Col span={10}>
                申领用途：{applyUse}
              </Col>
            </Row>
          </div>
          <h3 className="title">申领物品</h3>
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

export default connect(mapStateToProps)(Form.create()(AssetsDetail));
