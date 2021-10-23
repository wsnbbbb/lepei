import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Drawer, TimePicker, Select , Breadcrumb, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {formatDate, onlyDate} from '../../utils/public';
import './style.less';


const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class BranchList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,

          data2: {},
          visible: false,
          visible1: false,
          data: [],

          branchList: [],
          branchList1: [],
          personList: []
        };
    }
    componentDidMount=()=>{
      this.getList({})
      this.getBranchList({})
      this.getBranchPersons()
    }

    getBranchList=(params)=>{
      this.props.dispatch({
        type:'performance/getBranchList',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              branchList: res.data,
            })
          }
        }
      })
    }

    getBranchPersons=(params)=>{
      this.props.dispatch({
        type:'performance/getBranchPersons',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              personList: res.data,
            })
          }
        }
      })
    }


    getAchievementList=()=>{
      this.props.dispatch({
        type:'performance/getBranchList',
        payload: {},
        callback: res=>{
          if(res.code == 200){
            this.setState({
              visible1: true,
              branchList1: res.data,
              branchList: res.data,
            })
          }
        }
      })
    }

    changeBranchName=(index, e)=>{
        let oldData = this.state.branchList1
        oldData[index].branchName = e.target.value
        this.setState({
          branchList1: oldData
        })
    }

    changePerson=(index, e)=>{
      let oldData = this.state.branchList1
      oldData[index].personId = e
      this.setState({
        branchList1: oldData
      })
  }
    

  
    onClose = () => {
      this.setState({
        visible1: false,
      });
    };

    addItem = ()=>{
      let old = this.state.branchList1
      old.push({
        branchId: undefined,
        branchName: undefined,
        personId: undefined,
        personName: undefined
      })
      this.setState({
        branchList1: old
      })
    }

    saveBranch = (index) =>{
      let me = this
      let obj = this.state.branchList1[index]
      let params = {
          branchId: obj.branchId,
          personId: obj.personId,
          branchName: obj.branchName
      }
      if(!params.personId||!params.branchName){
        return message.warning("信息填写不完整")
      }
      this.props.dispatch({
        type: params.branchId?'performance/updateBranch':'performance/addBranch',
        payload: params,
        callback: res=>{
          if(res.code==200){
            message.success("成功！")
            me.getAchievementList()
          }
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'performance/getAchievementTemplateList',
        payload: params,
        callback: res=>{
          if(res.code == 200){
            this.setState({
              data: res.data
            })
          }
          
        }
      })
    }

    deleteBranch = (index) => {
      let me=this;
      let obj = this.state.branchList1[index]
      let params = {
          branchId: obj.branchId,
      }
      confirm({
        title: '提示',
        content: '确认删除?',
        onOk() {
          me.props.dispatch({
            type: 'performance/deleteBranch',
            payload: params,
            callback: res=>{
              if(res.code==200){
                message.success("成功！")
                me.getAchievementList()
              }
            }
          })
        },
        onCancel() {
          console.log('Cancel');
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
              type:'performance/deleteTemplate',
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
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "isPublished": values.isPublished||'',
          "startTime": values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
          "endTime": values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
        }
        this.getList(params)
        this.setState({page:1})
      })
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page": current,
          "prePage": size,
          "kw": values.kw||'',
          "isPublished": values.isPublished||'',
          "startTime": values.date&&values.date.length==2&&values.date[0].format('YYYY-MM-DD')||'',
          "endTime": values.date&&values.date.length==2&&values.date[1].format('YYYY-MM-DD')||'',
        }
        this.getList(params)
      })
    }

    new = () => {
      this.props.form.resetFields(["createTime", "templateName", "branchIds"])
      this.setState({
        visible: true,
        data2: {}
      })

    }
 
  
    toDetail = (id) => {
      this.props.dispatch(routerRedux.push("/branch-achievement-detail?id="+id))
    }

    handleCancel =()=>{
      this.props.form.resetFields(["createTime", "templateName", "branchIds"])
      this.setState({
        visible: false
      })

    }


    add =()=>{
      this.props.form.validateFields(["templateName", "createTime", "branchIds"], (err, values) => {
        if(err){
          return
        }
        const params={
          "templateName": values.templateName,
          "createTime": values.createTime.format('YYYY-MM-DD'),
          "branchIds": values.branchIds
        }
        this.props.dispatch({
          type:'performance/addAchievementTemplate',
          payload: params,
          callback: res=>{
            if(res.code==200){
              message.success("保存成功！")
              this.setState({
                visible: false,
              })
              this.getList()
            }
          }
        })
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
        const formItemLayout1 = {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        };
   

        const { branchList, personList, branchList1 } = this.state;
        const { getFieldDecorator } = this.props.form;
        const {buildingList, placeList} = this.props;
    
        const branchChildren = [];
        branchList&&branchList.map(item=>{
            return branchChildren.push(<Select.Option key={item.branchId}>{item.branchName}</Select.Option>);
        })

        const options = [];
        personList&&personList.map(item=>{
            return options.push(<Select.Option key={item.personId}>{item.username}</Select.Option>);
        })

        let buildChildren = [];
        buildingList&&buildingList.map(item=>{
            return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
        })
        let placeChildren = [];
        placeList&&placeList.map(item=>{
            return placeChildren.push(<Option key={item.id}>{item.name}</Option>);
        })
        const columns = [{
            title: '序号',
            dataIndex: 'templateId',
            render: (text, record, index)=>`${index+1}`,
          }, {
            title: '名称',
            dataIndex: 'templateName'
          }, {
            title: '总人数',
            dataIndex: 'totalPersonNum'
          }, {
            title: '实发金额',
            dataIndex: 'realMoney'
          }, {
            title: '上传状态',
            dataIndex: 'uploadProcess',
            width: 150,
            render:(record)=>{
              let ele = []
              let title = ''
              Array.isArray(record)&&record.map((i, idx)=>{
                  if(record.length<5){
                    ele.push(<p style={{color: i.isUpload==0?"red":""}} key={idx}>{i.branchName}{i.isUpload==0?" 未上传":" 已上传"}</p>)
                  }else{
                    if(idx<3||idx==record.length-1){
                      ele.push(<p style={{color: i.isUpload==0?"red":""}} key={idx}>{i.branchName}{i.isUpload==0?" 未上传":" 已上传"}</p>)
                    }
                    if(idx == 3){
                      ele.push(<p style={{color: i.isUpload==0?"red":""}} key={idx}>...</p>)
                    }
                  }
                  title += (i.branchName+(i.isUpload==0?" 未上传":" 已上传")+", ")
                })
                return <Tooltip placement="top" title={title}>
                          {ele}
                      </Tooltip>
            }
            
          },{
            title: '创建日期',
            dataIndex: 'createTime',
            render:( record) => (
              <span>{onlyDate(record)}</span>
            )
          },{
            title: '发布日期',
            dataIndex: 'publishTime',
            render:( record) => (
              <span>{onlyDate(record)}</span>
            )
          },{
            title: '发布状态',
            dataIndex: 'isPublished',
            render:(record)=>{
                return(<span style={{color: record==0?"red":""}}>{record==0?"未发布":"已发布"}</span>)
            }
          },{
            title: '发布人',
            dataIndex: 'publishedName',
            render:(record)=>{
                return(<span>{record}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this, record.templateId)}>查看</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={this.delete.bind(this, record.templateId)}>删除</a>
              </span>
            )
          }];


        return (
            <div className="content-main performance">
              <Form>
                    <Row gutter={24}>
                        <Col span={4}>
                            <FormItem label="">
                                {getFieldDecorator('kw')(
                                    <Search placeholder="名称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem {...formItemLayout} label={''}>
                              {getFieldDecorator("isPublished",{})(
                                <Select allowClear placeholder="发布状态">
                                  <Option value="1">已发布</Option>
                                  <Option value="0">未发布</Option>
                                </Select>
                              )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                           <FormItem >
                                {getFieldDecorator("date", {rules: [{
                                    required: false,
                                    message:"请选择日期"
                                }]})(
                                <RangePicker style={{ width: 380 }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始日期', '结束日期']}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)} >查询</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.getAchievementList.bind(this)} >部门管理</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.new.bind(this)} >创建</Button>
                        </Col>
                    </Row>
                </Form>     
              <Table className='content-table'  columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
              <Modal
                width="60%"
                title="添加"
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="submit" type="primary" onClick={this.add}>
                    确定
                  </Button>
                ]}
                >
                  <Form>
                    <Row gutter={24}>
                        <Col span={18}>
                            <FormItem {...formItemLayout1} label="创建时间">
                              {getFieldDecorator("createTime", {rules:[{required: true, message:'请选择创建时间'}]})(
                                <DatePicker />
                              )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={18}>
                            <FormItem {...formItemLayout1} label="名称">
                              {getFieldDecorator('templateName',{
                                rules: [{ required: true, message: '请输入名称' }],
                              })(
                                <Input maxLength={20} allowClear placeholder="请输入名称，不超过20个字" />
                              )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={18}>
                            <FormItem {...formItemLayout1} label={'部门'}>
                              {getFieldDecorator("branchIds",{rules:[{required:true,message:"请选择部门"}]})(
                                <Select mode="multiple" placeholder="请选择部门" >
                                  {branchChildren}
                                </Select>
                              )}
                            </FormItem>
                        </Col>
                    </Row>
                  </Form>     
                </Modal>

                <Drawer
                  title="部门设置"
                  placement="right"
                  closable={true}
                  maskClosable={false}
                  onClose={this.onClose}
                  width={600}
                  className="performance-drawer"
                  visible={this.state.visible1}
                >
                 {branchList1.map((i, index)=>{
                     return <Row gutter={24} key={index}>
                        <Col span={8}>
                            <FormItem {...formItemLayout1} label="部门">
                              <Input maxLength={10} onChange={this.changeBranchName.bind(this, index)} placeholder="请输入"  value={i.branchName} style={{ width: '100%', marginRight: 8 }} />  
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout1} label="人员">
                              <Select
                                 showSearch
                                 filterOption={(input, option) =>
                                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                 }
                                onChange={this.changePerson.bind(this, index)}
                                value={i.personId}
                                placeholder="请选择人员"> 
                                  {options}
                              </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="">
                              <Button onClick={this.saveBranch.bind(this, index)} type="primary">保存</Button>&nbsp;&nbsp;
                              <Button onClick={this.deleteBranch.bind(this, index)} disabled={!i.branchId}>删除</Button>
                            </FormItem>
                        </Col>
                    </Row>
                 })}

                <div style={{textAlign: 'center'}}>
                  <Button type="dashed" onClick={this.addItem.bind(this)}>添加</Button>
                </div>
                
                </Drawer>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(BranchList));
