import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Breadcrumb,Tag, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import { getQueryString,notSeconds } from '../../utils/public';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import { portUrl } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AuthorizeManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          deviceKey:'',
          deviceName:'',
          applicationName:'',
          authList:{},
          detailList:[],
          exportUrl:'',
          srcDeviceKey:'',
          visible:false,
          confirmLoading:false,
          allDevice:[],
          title:'授权管理'
        };
    }
    componentDidMount=()=>{
      this.deviceDetail()
      const params = {
        "deviceKey":getQueryString("deviceKey"),
        "page":1,
        "prePage":20,
      }
      console.log({params});
      this.getAuthList(params)
      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/facility-manage"
        },
      })
    }

    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
        
  }
    // 获取设备详情
    deviceDetail = (params) =>{
      let id = getQueryString("deviceKey")
      this.props.dispatch({
        type:'faceManage/checkDeviceStatus',
        payload:{"deviceKey":id},
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              deviceKey:res.data.deviceKey,
              deviceName:res.data.deviceName,
              applicationName:res.data.applicationName,
              srcDeviceKey:res.data.deviceName+'-'+res.data.deviceKey
            })
          }
        }
      })
    }
    // 授权记录列表
    getAuthList = (params) => {
      this.props.dispatch({
        type:'faceManage/getAuthList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              authList:res.data,
              detailList:res.data.dataList,
            })
          }
        }
      })
    }

    // 查询
    search = () =>{
      this.props.form.validateFields(["kw","personType","authStatus","headStatus"],(err,values) =>{
        const params = {
          "page":1,
          "prePage":this.state.prePage,
          "deviceKey":this.state.deviceKey,
          "kw":values.kw || '',
          "personType":values.personType || '',
          "authStatus":values.authStatus || '',
          "headStatus":values.headStatus || '',
        }
        this.getAuthList(params)
      })
    } 
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields(["kw","personType","authStatus","headStatus"],(err,values) =>{
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "deviceKey":this.state.deviceKey,
          "kw":values.kw || '',
          "personType":values.personType || '',
          "authStatus":values.authStatus || '',
          "headStatus":values.headStatus || '',
        }
        this.getAuthList(params)
      })
    }
    // 添加
    add = () =>{
      this.props.dispatch(routerRedux.push("/unauth-person?deviceKey="+this.state.deviceKey))
    }
    // 导出
    export=()=>{
      this.props.form.validateFields(["kw","personType","authStatus","headStatus"],(err, values) => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let deviceKey = this.state.deviceKey;
        let kw = values.kw||'';
        let personType = values.personType||'';
        let authStatus = values.authStatus||'';
        let headStatus = values.headStatus||'';
        let url=portUrl("/manager/uface-device/auth-list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&deviceKey="+deviceKey+"&kw="+kw+"&personType="+personType+"&authStatus="+authStatus+"&headStatus="+headStatus)
        this.setState({exportUrl:url})
      })
    }
    // 复制授权
    copyAuth = () =>{
      this.props.dispatch({
        type:'faceManage/getAllDevice',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              allDevice:res.data,
              visible:true
            })
          }
        }
      })
    }
   
    handleOk = () =>{
      this.props.form.validateFields(["destDeviceKeys"],(err, values) => {
        if(!err){
          const params = {
            "srcDeviceKey":this.state.deviceKey,
            "destDeviceKeys":values.destDeviceKeys
          }
          this.props.dispatch({
            type:'faceManage/copyAuth',
            payload:params,
            callback:(res) =>{
              if(res.code === 200){
                message.success("复制授权成功！")
                this.setState({
                  confirmLoading: true,
                })
                setTimeout(() => {
                  this.setState({
                    visible: false,
                    confirmLoading: false,
                  });
                }, 1000);
                this.search()
              }
            }
          })
        }
      })
    }
    handleCancel = () =>{
      this.setState({visible:false})
    }

    render(){
      const { visible, confirmLoading, deviceKey, deviceName, applicationName, authList, detailList, srcDeviceKey,allDevice} = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      },{
        title: '人员类型',
        dataIndex: 'personType',
        render:(record)=>(
          <span>
            {record==1?"学生":(record==2?"教师":(record==3?"职工":''))}
          </span>
        )
      },{
        title: '人员guid',
        dataIndex: 'personGuid'
      },{
        title: '授权结果',
        dataIndex: 'authStatus',
        render:(record)=>(
          <span>
            {record==3?<Tag color="blue">成功</Tag>:(record==4?<Tag color="magenta">失败</Tag>:null)}
          </span>
        )
      },{
        title: '下发时间',
        dataIndex: 'time',
      },{
        title: '说明',
        width:480,
        dataIndex: '',
        render:(record) => (
          <span>
            {record.msg&&record.authStatus!=3?record.msg:(record.authStatus==4?"失败原因："+record.msg:(record.authStatus==1?"等待下发":''))}
          </span>
        )
      }
      ]
      let children = []
      allDevice&&allDevice.map(item =>{
        return children.push(<Option key={item.deviceKey} value={item.deviceKey}>{item.deviceName+'-'+item.deviceKey}</Option>)
      })
        return (
          <div className="authorize-manage">
            {/* <Breadcrumb style={{margin:"10px 0"}}>
              <Breadcrumb.Item><Link to="/facility-manage">设备管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item>授权管理</Breadcrumb.Item>
            </Breadcrumb> */}
            <div className="deviceDetail content-main">
              <p>设备序列号：{deviceKey}</p>
              <p>应用名称：{deviceName}</p>
              <p>
                <span>设备名称：{applicationName}</span>
                <Button type="primary" style={{marginLeft:"40px"}} onClick={this.copyAuth}>复制授权</Button>
              </p>
            </div>
            <div className="content-main">
              <Form className="content-form">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="请输入姓名"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'人员类型'}>
                        {getFieldDecorator("personType",{initialValue:'0'})(
                          <Select>
                            <Option value='0' key='0'>全部</Option>
                            <Option value={1} key='1'>学生</Option>
                            <Option value={2} key='2'>教师</Option>
                            <Option value={3} key='3'>员工</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'授权结果'}>
                        {getFieldDecorator("authStatus",{initialValue:'0'})(
                          <Select>
                            <Option value='0' key='0'>全部</Option>
                            <Option value={3} key='1'>成功</Option>
                            <Option value={4} key='2'>失败</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={5} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={this.add.bind(this)}>添加</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Dropdown overlay={
                        <Menu>
                          <Menu.Item>
                              <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                          </Menu.Item>
                      </Menu>
                    }>
                      <a className="ant-dropdown-link" href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                  </Dropdown>
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={authList.totalCount} totalPage={authList.totalPage} currentPage={authList.currentPage}/>
              <Modal
                title="复制授权"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label="当前设备">
                        <Input disabled value={srcDeviceKey}/>
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label="目标设备">
                          {getFieldDecorator('destDeviceKeys',{rules:[{required:true,message:"目标设备不能为空"}]})(
                            <Select
                              showSearch
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="请选择"
                            >
                              {children}
                            </Select>
                          )}
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row>
                    <Col span={7} style={{textAlign:"right",marginLeft:"8px"}}>
                      <span>说明：</span>
                    </Col>
                    <Col span={14} >
                      <span>可将当前设备上的所有授权人员依次授权到目标设备上，但不影响目标设备上原来的授权人员</span>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </div> 
          </div>        
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AuthorizeManage));
