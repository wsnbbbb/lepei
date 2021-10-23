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

class AssetTypes extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        list:{},
        detailList:[],
        visible:false, 
        visible1:false, 
        visible2:false, 
        confirmLoading:false,
        confirmLoading1:false,
        isShow:false
      };
  }
  componentDidMount=()=>{
    this.getAssetTypes()
  
  }
  
  // 获取资产类型列表
  getAssetTypes = (params) =>{
    this.props.dispatch({
      type:'assetsManage/propertyType',
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
  // 查询
  search=()=>{
    this.props.form.validateFields(["kw"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw": values.kw||'',
        }
        this.getAssetTypes(params)
    })
  }
  // 分页
  onPageChange = (current,size) =>{
    this.props.form.validateFields(["kw"],(err,values) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "catId": values.catId||'',
        }
        this.getAssetTypes(params)
    })
  }
  // 新增
  add = () =>{
    this.setState({visible:true})
  }
  // 确定新增
  handleOk = () =>{
    this.props.form.validateFields(["name"],(err,values) =>{
      if(!err){
        const params = {
          "name":values.name
        }
        this.props.dispatch({
          type:'assetsManage/addPropertyType',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success("资产类型添加成功!")
                this.setState({confirmLoading: true,});
                setTimeout(() => {
                    this.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                }, 500);
                this.search()
                this.props.form.resetFields(["name"])
            }
          }
        })
      }
    })
  }
  // 取消
  handleCancel = () =>{
    this.setState({visible:false})
    this.props.form.resetFields(["name"])
  }
  // 编辑
  eidt = (id) =>{
    this.props.dispatch({
      type:'assetsManage/propertyTypeName',
      payload:{id},
      callback:(res)=>{
        if(res.code === 200){
          this.setState({
            catName:res.data.catName,
            visible1:true,
            catId:id
          })
        }
      }
    })
   
  }
  // 编辑确定
  handleOk1 = () =>{
    this.props.form.validateFields(["name1"],(err,values) =>{
      if(!err){
        const params = {
          "id":this.state.catId,
          "name":values.name1
        }
        this.props.dispatch({
          type:'assetsManage/editPropertyType',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success("资产类型修改成功!")
                this.setState({confirmLoading: true,});
                setTimeout(() => {
                    this.setState({
                        visible1: false,
                        confirmLoading1: false,
                    });
                }, 500);
                this.search()
                this.props.form.resetFields(["name1"])
            }
          }
        })
      }
    })
  }
  // 取消
  handleCancel1 = () =>{
    this.setState({visible1:false})
    this.props.form.resetFields(["name1"])
  }
  // 导入
  import = () =>{
    this.setState({visible2:true})
  }
  // 文件上传
  changeFile=(e)=> {
    this.setState({file: e.target.files[0]})
  }
  // 确定导入
  handleOk2 = () =>{
    this.props.form.validateFields(["excel"],(err,values) =>{
      if(!err){
        const params = new FormData();
        params.append('excel', this.state.file)
       console.log({params});
        this.props.dispatch({
          type:'assetsManage/importAssetTypes',
          payload:params,
          callback:(res)=>{
            this.setState({file: ''})
            this.props.form.resetFields(["excel"])
            if(res.code===200){
              if(res.data.hasError===true){
                if(res.data.header&&res.data.sheetData){
                  message.error(res.msg)
                  let errData = []
                  res.data.sheetData.map(item =>{
                    if(item.error){
                      errData.push(item)
                    }
                  })
                  this.setState({
                    visible2:true,
                    header:res.data.header,
                    sheetData:errData,
                    isShow:true
                  })
                }
            }else{
                message.success("资产类型导入成功")
                this.setState({visible2:false,isShow:false})
                this.props.form.resetFields(["excel"])
                this.search()
            }
            }
          }
        })
      }
    })
  }
  // 取消导入
  handleCancel2 = () =>{
    this.setState({
      visible2:false,
      isShow:false
    })
    this.props.form.resetFields(["excel"])
  }
  // 导出
  export=()=>{
    this.props.form.validateFields(["kw"],(err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let kw = values.kw||'';
      let url=portUrl("/manager/property-category/cat-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw)
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
            type:'assetsManage/delAssetType',
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
    const { list, detailList, catName, visible, confirmLoading, visible1, confirmLoading1, visible2,header, sheetData ,isShow } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span:8 },
      wrapperCol: { span: 15 }
    };
  
    const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        title: '资产类型',
        dataIndex: 'catName',
        
      },{
        title: '操作',
        dataIndex: '',
        width:180,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.eidt.bind(this,record.id)}>编辑</a>&emsp;
            <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>
          </span>
        )
      }
    ]

    let ths=[];
      if(header){
        for (var i in header){
          ths.push(<th key={i}>{header[i]}</th>)
        }
      }
      let tbodys=[]
      if(sheetData){
        sheetData.map((item,idx)=>{
          let tds=[]
          for(var i in item){
            tds.push(<td key={i} style={{color:item.error?"#f00":""}}>{item[i]?item[i]:"无"}</td>)
          }
          return tbodys.push(<tr key={idx}>{tds}</tr>)
        })
      }
    return (
        <div className="content-main asset-types">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/asset-info">资产信息</Link></Breadcrumb.Item>
            <Breadcrumb.Item>资产类型</Breadcrumb.Item>
          </Breadcrumb>  
          <Form className="content-form">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem >
                  {getFieldDecorator("kw")(
                    <Search  placeholder="资产类型"/> 
                  )}
                </FormItem>
              </Col>
              
              <Col span={12} >
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type='primary' onClick={this.add.bind(this)}>新增</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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
                    <a  href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                  </Dropdown>
              </Col>
            </Row>
          </Form>
          <Table  columns={columns} dataSource={detailList} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
          <Modal
              title="新增资产类型"
              visible={visible}
              confirmLoading={confirmLoading}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Form>
                <Row gutter={24} >
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'资产类型'}>
                      {getFieldDecorator("name",{initialValue:'',rules:[{required:true,message:"请输入资产类型名称"}]})(
                          <Input placeholder="请输入资产类型名称"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          <Modal
              title="编辑资产类型"
              visible={visible1}
              confirmLoading={confirmLoading1}
              onOk={this.handleOk1}
              onCancel={this.handleCancel1}
            >
              <Form>
                <Row gutter={24} >
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'资产类型'}>
                      {getFieldDecorator("name1",{initialValue:catName,rules:[{required:true,message:"请输入资产类型名称"}]})(
                          <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          <Modal
            width={600}
            title="导入"
            visible={visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
            className="import-assetType-modal"
            >
              <Form>
                <Row gutter={24} > 
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'上传附件'}>
                      {getFieldDecorator("excel",{initialValue:'',rules:[{required:true,message:"请上传附件"}]})(
                          <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <p style={{marginLeft:"138px"}}>
                  <a href={getUpload("资产类型导入模板.xls")}>下载模板</a>
                  <span style={{marginLeft:"30px"}}>支持扩展名为.xls及.xlsx的文件</span>
                </p>
                {
                isShow ?<table border="1" className="batch-import-asset-table">
                  <thead>
                    <tr>{ths}<th>提示</th></tr>
                  </thead>
                  <tbody>
                    {tbodys}
                  </tbody>
                </table>:null
              }
              </Form>
            </Modal>
        </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AssetTypes));
