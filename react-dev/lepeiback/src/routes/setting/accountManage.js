import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Select,Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate, isBlank} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class AccountManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getAccount(params)
    }
    getAccount=(params)=>{
      this.props.dispatch({
        type:'setting/getAccount',
        payload: params
      })
    }
    showModal = () => {
      this.setState({
        visible: true,
        userName:'',
        realName:'',
        password:'',
        checkPassword:'',
      });
    }
    toDetail = (userId) => {
      this.props.dispatch(
        routerRedux.push("/account-detail/" + userId)
      )
    }
    //添加账户
    handleOk = () => {
      const {password,controlBtn,startDate,endDate} = this.state;
      console.log(startDate,endDate)
          if(isBlank(this.state.userName)||isBlank(this.state.password)||isBlank(this.state.checkPassword)){
            message.warning("信息输入不完整！")
            return
          }
          if(md5(this.state.password)!==md5(this.state.checkPassword)){
            message.warning("密码输入不一致！")
            return
          }
          this.props.dispatch({
            type:'setting/addAccount',
            payload:{
              "userName": this.state.userName,
              "realName": this.state.realName,
              "password": md5(this.state.password),
              "checkPassword": md5(this.state.checkPassword)
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('创建成功！',3)
                // this.props.form.resetFields();
                this.setState({
                  visible: false,
                  "userName": '',
                  "realName": '',
                  "password": '',
                  "checkPassword": ''
                });
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  // "kw":values.kw||'',
                  // "status":values.status||''
                }
                this.getAccount(params)
              }
              // this.setState({controlBtn:false})
            }
          })
        // }
      // })
    }
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
      });
    }
    onTimeChange=(date,dateString)=> {
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "status":values.status||''
        }
        this.getAccount(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type: 'setting/deleteAccount',
            payload: {"userId": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||''
                  }
                  me.getAccount(params)
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
          "status":values.status||''
        }
        this.getAccount(params)
      })
    }

    onChange1 = (e)=>{
      this.setState({
        userName: e.target.value
      })
    }
    onChange2 = (e)=>{
      this.setState({
        realName: e.target.value
      })
    }
    onChange3 = (e)=>{
      this.setState({
        password: e.target.value
      })
    }
    onChange4 = (e)=>{
      this.setState({
        checkPassword: e.target.value
      })
    }
    render(){
        const {accountList} =this.props;
        const {userName,realName,password,checkPassword} = this.state;
        if(!accountList){
          return null;
        }
        const columns = [{
            title: '账户名',
            dataIndex: 'userName',
          }, {
            title: '所有人',
            dataIndex: 'realName',
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
                return record==1 ? <span>启用</span> : <span className="red">禁用</span>
            }
          }, {
            title: '绑定关系',
            dataIndex: 'bindrelationship',
          }, {
            title: '最后登录',
            dataIndex: 'lastLoginTime',
            render:(record)=>{
                return formatDate(record)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this,record.userId)}>修改</a> 
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.userId)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main account-manage">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Input placeholder="帐户名或所有人" />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'当前状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">启用</Option>
                          <Option value="2">禁用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={1}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                        <Button onClick={this.showModal.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={accountList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={accountList.totalCount} totalPage={accountList.totalPage} currentPage={accountList.currentPage}/>
              <Modal
                title="添加账户"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                  <div className="add-account-modal">
                    <Row style={{ padding: '10px 0' }} >
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label><span style={{ color: '#F5333D' }}>*</span>账户名：</label>
                        <Input value={this.state.userName} style={{ width: '200px' }} placeholder="请输入账户名" onChange={this.onChange1.bind(this)}/>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label>所有人：</label>
                        <Input value={this.state.realName} style={{ width: '200px' }}  placeholder="请输入账户所有人" onChange={this.onChange2.bind(this)}/>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label><span style={{ color: '#F5333D' }}>*</span>密码：</label>
                        <Input type="password" value={this.state.password} style={{ width: '200px' }}  placeholder="请输入密码" onChange={this.onChange3.bind(this)}/>
                    </Row>
                    <Row style={{ padding: '10px 0' }}>
                        &nbsp;
                        <label><span style={{ color: '#F5333D' }}>*</span>确认密码：</label>
                        <Input type="password" value={this.state.checkPassword} style={{ width: '200px' }}  placeholder="请输入密码" onChange={this.onChange4.bind(this)}/>
                    </Row>
                  </div>
              </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    accountList:state.setting.accountData
  }
}

export default connect(mapStateToProps)(Form.create()(AccountManage));
