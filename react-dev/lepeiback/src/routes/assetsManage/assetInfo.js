import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Tooltip,Tag, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
import { portUrl, getUpload } from '../../utils/img';
import { notSeconds, } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;

class AssetInfo extends Component{
  constructor(props) {
      super(props);
      this.state = {
        assetsTypeList:[],
        assetInfoList:{},
        detailList:[],
        exportUrl:'',
        visible:false,
        confirmLoading:false,
      };
  }
  componentDidMount=()=>{
    this.assetInfoList()
    this.getAssetsType()
  
  }
  // 获取资产信息列表
  assetInfoList = (params) =>{
    this.props.dispatch({
      type:'assetsManage/assetList',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            assetInfoList:res.data,
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
          "kw": values.kw||'',
          "catId": values.catId||'',
        }
        this.assetInfoList(params)
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
        this.assetInfoList(params)
    })
  }
  // 添加
  add = (type,id) =>{
    if(type === 1){
      this.props.dispatch(routerRedux.push("/add-assetsType?type=" + type))
    }else{
      this.props.dispatch(routerRedux.push("/add-assetsType?id="+id + "&type=" + type))
    }
  }
  // 资产类型
  toAssetTypes = () =>{
    this.props.dispatch(routerRedux.push("/asset-types"))
  }
  // 计量单位管理
  unitManage = () =>{
    this.props.dispatch(routerRedux.push("/unit-manage"))
  }
  // 导入
  import = () =>{
    this.props.dispatch(routerRedux.push("/import-asset-info"))
  }
  // 导出
  export=()=>{
    this.props.form.validateFields((err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let catId = values.catId||'';
      let kw = values.kw||'';
      let url=portUrl("/manager/property-product/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&catId="+catId+"&kw="+kw)
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
    const { assetInfoList, detailList, assetsTypeList, visible, confirmLoading  } = this.state;
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
          width:400,
          title: '资产类型',
          dataIndex: 'catName',
          render:(record)=>(
            <Tooltip placement="top" title={record}>
              <span className="text">{record}</span>
            </Tooltip>
          )
        },{
          width:400,
          title: '资产名称',
          dataIndex: 'name',
          render:(record)=>(
            <Tooltip placement="top" title={record}>
              <span className="text">{record}</span>
            </Tooltip>
          )
        },{
          title: '是否易耗品',
          dataIndex: 'isConsumable',
          render:( record) => (
            <span>{record == 0 ? "否" : (record == 1 ? "是" : '')}</span>
          )
        },{
          title: '计量单位',
          dataIndex: 'unit',
        },{
          title: '操作',
          dataIndex: '',
          width:180,
          fixed:'right',
          render:(text, record) => (
            <span>
             <a href="javascript:;" onClick={this.add.bind(this,2,record.id)}>编辑</a>&emsp;
             <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
            </span>
          )
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
                      <Select allowClear placeholder="资产类型"> 
                        {options}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                
                <Col span={10} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={this.add.bind(this,1)}>新增</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={this.toAssetTypes.bind(this)}>资产类型</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={this.unitManage.bind(this)}>计量单位管理</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown overlay={
                      <Menu>
                        <Menu.Item>
                            <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.import.bind(this)}>导入</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                        </Menu.Item>
                      </Menu>
                    }>
                      <a href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                    </Dropdown>
                </Col>
              </Row>
            </Form>
            <Table  columns={columns} dataSource={detailList} pagination={false}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={assetInfoList.totalCount} totalPage={assetInfoList.totalPage} currentPage={assetInfoList.currentPage}/>
           
          </div> 
              
      );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AssetInfo));
