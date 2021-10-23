import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Breadcrumb, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getCardType, getCardStatus} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';
import QueryString from 'qs';
import copy from 'copy-to-clipboard';
import { registerTheme } from 'echarts';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class MonitorList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          data1: {},
          data2: {},
          visible: false,
          visible1: false,
          visible2: false,
          placeId1: '',
          placeDisabled:true,
          data: [],
          deviceNo: '',
          currentDeviceNo: '',
          selectedRowKeys: [],
          currentSn: '',
          currentDevName: ''
        };
    }
    componentDidMount=()=>{
      this.getList({})
      this.props.dispatch({ //获取所有建筑
        type:'user/getAllBuildings'
      })

    }

    searchDev=(params)=>{
      this.props.dispatch({
        type:'monitor/searchDev',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              data2: res.data,
              currentSn: res.data.dataList[0].devSn,
              currentDevName: res.data.dataList[0].devName
            })
          }
        }
      })
    }
    
    createMonitor=(params)=>{

      this.props.dispatch({
        type:'monitor/createMonitor',
        payload: params,
        callback: res=>{
          if(res.code==200){

          }
          this.setState({
            // data2: res.data
          })
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'monitor/getMonitorList',
        payload: params,
        callback: res=>{
          this.setState({
            data: res.data
          })
        }
      })
    }

    delete = (id) => {
      let me=this;
      confirm({
        title: '提示',
        content: '确认删除?',
        onOk() {
          me.props.dispatch({
              type:'monitor/deleteMonitor',
              payload:{
                  id: id
              },
              callback:(res)=>{
                  if(res.code===200){
                     message.success("删除成功！")
                    
                    me.props.form.validateFields((err, values) => {
                      const params={
                        "page":1,
                        "prePage":me.state.prePage,
                        "kw":values.kw||'',
                      }
                      me.getList(params)
                      me.setState({page:1})
                    })
                  }
              }
          })
        },
        onCancel() {
          console.log('Cancel');
        }
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
        this.getList(params)
        this.setState({page:1})
      })
    }

    // 查询
    search2=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "devSn": values.kw2||'',
        }
        this.searchDev(params)
        // this.setState({page:1})
      })
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
        this.getList(params)
      })
    }

    new = () => {
      this.setState({
        visible: true,
        data2: {}
      })
      this.props.form.resetFields(["kw2"]);
    }
 
    edit = (record) => {
      
      this.props.dispatch({
        type:'monitor/getMonitorDetail',
        payload: {id: record.id},
        callback: res=>{
          // this.setState({
          //   data: res.data
          // })
          if(res.code==200){
            this.setState({
              visible2: true,
              "placeId1": res.data.placeId,
              currentId: record.id
            })
            this.props.form.setFieldsValue({
              "devSn1": res.data.devSn,
              "devName1": res.data.devName,
              "expireTime1": res.data.expireTime,
              "buildId1": res.data.buildId,
              
            })
            this.buildChange(res.data.buildId)
          }
        }
      })


    }
    toDetail = (id) => {
      this.props.dispatch(routerRedux.push("/monitor-detail?id="+id))
    }

    handleCancel =()=>{
      this.setState({
        visible: false
      }) 
    }


    handleCancel1 =()=>{
      this.setState({
        visible1: false
      }) 
    }
    handleCancel2 =()=>{
      this.setState({
        visible2: false
      }) 
    }

    savePlace =()=>{
      this.props.form.validateFields(["devName", "expireTime", "devSn"], (err, values) => {
        const params={
          "devName":  values.devName||'',
          "expireTime":  values.expireTime||'',
          "placeId": this.state.placeId||'',
          "devSn":   values.devSn||''
        }
        if(err){
          return
        }
        if(!params.placeId){
          message.warning("请选择场所！")
          return
        }
        
        this.props.dispatch({
          type:'monitor/createMonitor',
          payload: params,
          callback: res=>{
            if(res.code==200){
              message.success("保存成功！")
              this.setState({
                visible: false,
                visible1: false
              })
              this.getList({});
            }
          }
        })
      })
    }


    editInfo =()=>{
      let me = this
      this.props.form.validateFields(["devName1", "expireTime1", "devSn1"], (err, values) => {
        const params={
          "devName":  values.devName1||'',
          "expireTime":  values.expireTime1||'',
          "placeId": me.state.placeId1||'',
          "devSn":   values.devSn1||'',
          "id": me.state.currentId
        }
        if(err){
          return
        }
        if(!params.placeId){
          message.warning("请选择场所！")
          return
        }

        this.props.dispatch({
          type:'monitor/updateMonitor',
          payload: params,
          callback: res=>{
            if(res.code==200){
              message.success("保存成功！")
              this.setState({
                visible2: false
              })
              this.getList();
            }
          }
        })
      })
    }



    buildChange=(val)=>{
        if(val){
          this.props.dispatch({
            type:'user/getAllPlacesByBuild',
            payload:{"buildId":val},
          })
          this.setState({placeId:'',placeDisabled:false})
        }else{
          this.setState({placeId:'',placeDisabled:true})
        }
    }
    
    buildChange1=(val)=>{
      if(val){
        this.props.dispatch({
          type:'user/getAllPlacesByBuild',
          payload:{"buildId":val},
        })
        this.setState({placeId1:'',placeDisabled1:false})
      }else{
        this.setState({placeId1:'',placeDisabled1:true})
      }
  }
  
    placeChange=(val)=>{
        this.setState({placeId:val})
    }
    placeChange1=(val)=>{
      this.setState({placeId1:val})
  }
  
    addDev=()=>{
      this.props.form.resetFields(["devName", "devSn", "expireTime", "buildId"]);
      this.props.form.setFieldsValue({"devSn": this.state.currentSn, "devName": this.state.currentDevName})
      this.setState({visible1: true,  placeId: '', placeDisabled: true})

    }

    // 查询
    search1=()=>{
      this.props.form.validateFields((err, values) => {
          const params={
            "page": 1,
            "prePage": 20,
            "kw": values.kw1||'',
            "devId": getQueryString("id"),
            "personType": 2
          }
          this.getUnAuthList(params)
          this.setState({page1:1})
        })
      }
        // 分页
        onPageChange1=(current,size)=>{
          this.props.form.validateFields((err, values) => {
            this.setState({page1:current, prePage1:size})
            const params={
              "page": current,
              "prePage": size,
              "kw": values.kw||'',
              "devId": getQueryString("id"),
              "personType": 2
            }
            this.getUnAuthList(params)
          })
        }
    
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 12, offset: 0 },
                sm: { span: 17, offset: 1 },
            },
        };
        const { placeDisabled } = this.state;
        const { getFieldDecorator } = this.props.form;
        const {buildingList, placeList} = this.props;
    
        let buildChildren = [];
        buildingList&&buildingList.map(item=>{
            return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
        })
        let placeChildren = [];
        placeList&&placeList.map(item=>{
            return placeChildren.push(<Option key={item.id}>{item.name}</Option>);
        })
        const columns = [{
            title: '序列号',
            dataIndex: 'devSn',
          }, {
            title: '设备名称',
            dataIndex: 'devName',
            render:(record)=>{
            return(<span>{record}</span>)
          }
          },{
            title: '建筑名称',
            dataIndex: 'buildName',
            render:(record)=>{
                return(<span>{record}</span>)
            }
          },{
            title: '场所名称',
            dataIndex: 'placeName',
            render:(record)=>{
                return(<span>{record}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this, record.id)}>按设备授权</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.edit.bind(this, record)}>编辑</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={this.delete.bind(this, record.id)}>删除</a>
              </span>
            )
          }];

          const columns1 = [{
            title: '序列号',
            dataIndex: 'devSn',
          }, {
            title: '设备名称',
            dataIndex: 'devName',
            render:(record)=>{
            return(<span>{record}</span>)
          }
          },{
            title: '加密状态',
            dataIndex: 'isEncrypt',
            render:(record)=>{
                return(<span>{record==0?"未加密":"加密"}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(record) => (
              <span className="make-box">
                {record.isEncrypt==0?<a href="javascript:;" onClick={this.addDev.bind(this, record.isEncrypt)}>添加</a>:null}
              </span>
            )
          }];

        return (
            <div className="content-main ban-card">
              <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="">
                                {getFieldDecorator('kw')(
                                    <Search placeholder="序列号/设备名称"/>
                                )}
                            </FormItem>
                        </Col> 
                        <Col span={8} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)} >查询</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.new.bind(this)} >新建</Button>
                        </Col>
                    </Row>
                </Form>     
              <Table className='content-table'  columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
              <Modal
              width="70%"
                title="添加"
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                footer={[
                  // <Button key="submit" type="primary" onClick={this.handleCancel}>
                  //   确定
                  // </Button>
                ]}
                >
                  <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="">
                                {getFieldDecorator('kw2')(
                                    <Search placeholder="设备序列号"/>
                                )}
                            </FormItem>
                        </Col> 
                        <Col span={8} offset={0}>
                            <Button type='primary' onClick={this.search2.bind(this)} >查询</Button>&nbsp;&nbsp;
                        </Col>
                    </Row>
                  </Form>     
                  <Table className='content-table'  columns={columns1} dataSource={this.state.data2.dataList} pagination={false}/>
               </Modal>
               <Modal
              width="50%"
                title="添加"
                visible={this.state.visible1}
                onOk={this.handleCancel1}
                onCancel={this.handleCancel1}
                footer={[
                  <Button key="submit" type="primary" onClick={this.savePlace}>
                    保存
                  </Button>
                ]}
                >
                  <FormItem {...formItemLayout} label={'设备序列号'}>
                    {getFieldDecorator("devSn",{initialValue: '', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Input disabled placeholder="请输入"/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'设备名称'}>
                    {getFieldDecorator("devName",{initialValue:'', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Input placeholder="请输入"/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'直播链接有效期'}>
                    {getFieldDecorator("expireTime",{initialValue:'300', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Select style={{ width: '86%', marginRight: 10 }}>
                        <Option value="300">300秒</Option>
                        <Option value="600">600秒</Option>
                    </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'建筑'}>
                    {getFieldDecorator("buildId",{initialValue:'', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Select
                          style={{ width: '76%', marginRight: 10 }}
                          placeholder="请选择"
                          optionFilterProp="children"
                          onChange={this.buildChange}
                          showSearch
                          width='200'
                      >
                          <Option  width={200} key='' value=''>全部</Option>
                          {buildChildren}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'场所'}>
                      <Select
                          style={{ width: '76%', marginRight: 10 }}
                          placeholder="请选择"
                          optionFilterProp="children"
                          onChange={this.placeChange}
                          showSearch
                          width={200}
                          value={this.state.placeId}
                          disabled={placeDisabled}
                      >
                          {/* <Option key='' value=''>全部</Option> */}
                          {placeChildren}
                      </Select>
                  </FormItem>
                </Modal>
                <Modal
              width="50%"
                title="编辑"
                visible={this.state.visible2}
                onOk={this.handleCancel2}
                onCancel={this.handleCancel2}
                footer={[
                  <Button key="submit" type="primary" onClick={this.editInfo}>
                    保存
                  </Button>
                ]}
                >
                  <FormItem {...formItemLayout} label={'设备序列号'}>
                    {getFieldDecorator("devSn1",{initialValue: '', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Input disabled placeholder="请输入"/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'设备名称'}>
                    {getFieldDecorator("devName1",{initialValue:'', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Input placeholder="请输入"/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'直播链接有效期'}>
                    {getFieldDecorator("expireTime1",{initialValue:'300', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Select style={{ width: '86%', marginRight: 10 }}>
                        <Option value="300">300秒</Option>
                        <Option value="600">600秒</Option>
                    </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'建筑'}>
                    {getFieldDecorator("buildId1",{initialValue:'', rules: [{
                          required: true,
                          whitespace: true,
                          message: "请输入",
                      }]})(
                      <Select
                          style={{ width: '76%', marginRight: 10 }}
                          placeholder="请选择"
                          optionFilterProp="children"
                          onChange={this.buildChange1}
                          showSearch
                          width='200'
                      >
                          <Option  width={200} key='' value=''>全部</Option>
                          {buildChildren}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'场所'}>
                      <Select
                          style={{ width: '76%', marginRight: 10 }}
                          placeholder="请选择"
                          optionFilterProp="children"
                          onChange={this.placeChange1}
                          showSearch
                          width={200}
                          value={this.state.placeId1}
                          disabled={placeDisabled}
                      >
                          {/* <Option key='' value=''>全部</Option> */}
                          {placeChildren}
                      </Select>
                  </FormItem>
                </Modal>          
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {
    buildingList:state.user.buildingList,
    placeList:state.user.placeList,
  }
}
export default connect(mapStateToProps)(Form.create()(MonitorList));
