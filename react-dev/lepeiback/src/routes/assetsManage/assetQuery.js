import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Breadcrumb, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { Link } from 'dva/router';
import PageIndex from '../../components/page';
import { portUrl, getUpload } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AssetQuery extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        list:{},
        detailList:[],
        checkVal:''
      };
  }
  componentDidMount=()=>{
    this.assetQueryList()
  
  }
  
  // 资产查询列表
  assetQueryList = (params) =>{
    this.props.dispatch({
      type:'assetsManage/assetQueryList',
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
  
  onChange = (e) => {
    this.setState({checkVal:e.target.value})
  }

  // 查询
  search = () =>{
    const params = {
      "kw":this.state.checkVal || '',
      "page":1,
      "prePage":this.state.prePage,
    }
    this.assetQueryList(params)
  }
  // 分页
  onPageChange = (current,size) =>{
    this.setState({page:current,prePage:size})
      const params = {
        "kw":this.state.checkVal || '',
        "page":current,
        "prePage":size, 
      }
    this.assetQueryList(params)
  }
  // 导出
  export=()=>{
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let kw = this.state.checkVal || '';
      let url=portUrl("/manager/property-distribution/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw)
      this.setState({exportUrl:url})
  }

   

  render(){
    const { list, detailList } = this.state;
    const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        title: '资产名称',
        dataIndex: 'propertyName',
        
      },{
        title: '使用人',
        dataIndex: 'personName',
        
      },{
        title: '数量',
        dataIndex: 'num',
        
      }
    ]
    return (
        <div className="content-main asset-query">
          <Row gutter={24} className="content-form">
            <Col span={5} style={{paddingTop:"5px"}}>
              <Search onChange={this.onChange.bind(this)} placeholder="资产名称/使用人"/> 
            </Col>
            <Col span={5}>
              <Button  type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;&emsp;
              <Button  type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
            </Col>
          </Row>
          <Table  columns={columns} dataSource={detailList} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
        
        </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AssetQuery));
