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

class UnitManage extends Component{
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
      };
  }
  componentDidMount=()=>{
    this.getUnitList()
  
  }
  
  // 获取计量单位列表
  getUnitList = (params) =>{
    this.props.dispatch({
      type:'assetsManage/getUnitList',
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

  // 分页
  onPageChange = (current,size) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
        }
        this.getUnitList(params)
  }
  // 添加
  add = () =>{
    this.setState({visible:true})
  }
  // 确定添加
  handleOk = () =>{
    this.props.form.validateFields(["name"],(err,values) =>{
      if(!err){
        const params = {
          "name":values.name
        }
        this.props.dispatch({
          type:'assetsManage/addUnit',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success("计量单位添加成功!")
                this.setState({confirmLoading: true,});
                setTimeout(() => {
                    this.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                }, 500);
                this.getUnitList()
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
  // 修改
  eidt = (id) =>{
    this.props.dispatch({
      type:'assetsManage/unitDetail',
      payload:{id},
      callback:(res)=>{
        if(res.code === 200){
          this.setState({
            name:res.data.name,
            visible1:true,
            unitId:id
          })
        }
      }
    })
   
  }
  // 修改确定
  handleOk1 = () =>{
    this.props.form.validateFields(["name1"],(err,values) =>{
      if(!err){
        const params = {
          "id":this.state.unitId,
          "name":values.name1
        }
        this.props.dispatch({
          type:'assetsManage/editUnit',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success("计量单位修改成功!")
                this.setState({confirmLoading: true,});
                setTimeout(() => {
                    this.setState({
                        visible1: false,
                        confirmLoading1: false,
                    });
                }, 500);
                this.getUnitList()
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
  
  // 删除
  del = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delUnit',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.getUnitList()
              }
            }
          })
        },
        onCancel() {},
      });
  }
  

   

  render(){
    const { list, detailList, name, visible, confirmLoading, visible1, confirmLoading1  } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span:8 },
      wrapperCol: { span: 15 }
    };
  
      const columns = [{
          title: '序号',
          dataIndex: 'id',
        },{
          title: '计量单位',
          dataIndex: 'name',
          
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
      return (
          <div className="content-main unit-manage">
            <Breadcrumb className="Breadcrumb">
              <Breadcrumb.Item><Link to="/asset-info">资产信息</Link></Breadcrumb.Item>
              <Breadcrumb.Item>计量单位管理</Breadcrumb.Item>
            </Breadcrumb>  
            <div style={{margin:"0 0 20px 20px"}}>
              <Button  type='primary' onClick={this.add.bind(this)}>添加</Button>
            </div>
            <Table  columns={columns} dataSource={detailList} pagination={false}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
            <Modal
                title="添加"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24} >
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'计量单位'}>
                        {getFieldDecorator("name",{initialValue:'',rules:[{required:true,message:"请输入计量单位"}]})(
                            <Input placeholder="请输入计量单位"/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            <Modal
                title="修改"
                visible={visible1}
                confirmLoading={confirmLoading1}
                onOk={this.handleOk1}
                onCancel={this.handleCancel1}
              >
                <Form>
                  <Row gutter={24} >
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'计量单位'}>
                        {getFieldDecorator("name1",{initialValue:name,rules:[{required:true,message:"请输入计量单位"}]})(
                            <Input/>
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

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(UnitManage));
