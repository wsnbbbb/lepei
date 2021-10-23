import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Breadcrumb } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class RepairTypeList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
      }
      this.getRepaieTypeList(params)
      this.props.dispatch({ //获取教师
        type:'user/getCommonPersonList',
        payload:{"personType":'2,3'}
      })
    }
    getRepaieTypeList=(params)=>{
      this.props.dispatch({
        type:'repair/getRepairTypeList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
        }
        this.getRepaieTypeList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'repair/delRepairType',
            payload:{"typeId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                  }
                  me.getRepaieTypeList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
        }
        this.getRepaieTypeList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/room-apply-detail?repairId="+id))
    }
    
    showModal = () => {
        this.setState({
          visible: true,
          edit:false,
          typeId:''
        });
    }
    showEditModal = (record) => {
      this.props.form.resetFields();
      this.props.dispatch({
        type:"repair/getRepairTypeDetail",
        payload:{"typeId":record.typeId},
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            this.setState({
              handlerIds:res.data.handlers||[],
              viewerIds:res.data.viewers||[],
              typeName:res.data.typeName||'',
            })
          }
        }
      })
      this.setState({
        visible: true,
        typeId:record.typeId,
        edit:true
      });
    }
    
    handleOk = (e) => {
      const {handlerIds,viewerIds,edit,typeId} = this.state;
      this.props.form.validateFields((err, values) => {
        if(!err){
          this.props.dispatch({
            type:edit?'repair/editRepairType':'repair/addRepairType',
            payload:{"typeName":values.typeName,"handlers":handlerIds,"viewers":viewerIds,"typeId":typeId},
            callback:(res)=>{
              if(res.code===200){
                message.success(edit?"修改报事报修类型成功":"添加报事报修类型成功",2)
                this.props.form.resetFields();
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  "kw":values.kw||'',
                }
                this.getRepaieTypeList(params)
                this.setState({
                  visible: false,
                });
              }
            }
          })
        }
      })
    }
    
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({visible:false})
    }
    handleChange=(value)=>{
      console.log(value)
      this.setState({handlerIds:value})
    }
    handleViewChange=(value)=>{
        console.log(value);
        this.setState({viewerIds:value})
    }
    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'typeId',
          }, {
            title: '报事报修类型',
            dataIndex: 'typeName',
          }, {
            title: '处理人',
            dataIndex: 'handlers',
          },{
            title: '查看人',
            dataIndex: 'viewers',
            width:220
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showEditModal.bind(this,record)}>编辑</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.typeId)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {repairTypeList,staffData} = this.props;
          const {edit,typeName,viewerIds,handlerIds} = this.state;
          let children = [];
          staffData&&staffData.length>0&&staffData.map(item=>{ //教职工列表
                return children.push(<Option key={item.personId} >{item.personName}</Option>);
          })
          console.log(repairTypeList)
          if(!repairTypeList){
            return null;
          }
        return (
            <div className="content-main">
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>后勤管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/repair-manage">报事报修管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>报事报修类型管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入报修报修名称"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                        <Button type='primary' onClick={this.showModal.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={repairTypeList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={repairTypeList.totalCount} totalPage={repairTypeList.totalPage} currentPage={repairTypeList.currentPage}/>
              <Modal
                title="报事报修类型"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={20}>
                    <FormItem {...formItemLayout} label={'报事报修类型'}>
                      {getFieldDecorator("typeName",{initialValue:edit?typeName:'',rules:[{required:true,message:"请输入名称"}]})(
                        <Input placeholder="请输入名称" />
                      )}
                    </FormItem>
                  </Col>                  
                </Row>
                <Row gutter={24}>
                  <Col span={20}>
                    <FormItem {...formItemLayout} label={'处理人'}>
                      {getFieldDecorator("handlers",{initialValue:edit?handlerIds:[],rules:[{required:true,message:"请选择处理人"}]})(
                       <Select
                            mode="multiple"
                            placeholder="请选择"
                            onChange={this.handleChange.bind(this)}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                        >
                            {children}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20}>
                    <FormItem {...formItemLayout} label={'查看人'}>
                      {getFieldDecorator("viewers",{initialValue:edit?viewerIds:[]})(
                        <Select
                            mode="multiple"
                            placeholder="请选择"
                            onChange={this.handleViewChange.bind(this)}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                        >
                            {children}
                        </Select>
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
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     repairTypeList:state.repair.typeList,
     staffData:state.user.commonPersonData
  }
}
export default connect(mapStateToProps)(Form.create()(RepairTypeList));
