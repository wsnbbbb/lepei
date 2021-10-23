import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, Form, Row, Col, Select,message,Breadcrumb,TreeSelect, Icon, Radio, Popover  } from 'antd';
import { Link } from 'dva/router';
import SectionTag from '../../components/sectionTag'
import { getQueryString } from '../../utils/public';
import './style.less';
import typeIs from 'type-is';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class ApprovalDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
        ruleId:'',
        visible: false,
        treeData:[],
        process:[], // 审批层级
        ruleName:'',
        synopsis:'',
        single:[],
        teachingRole:[],
        jobId:[],
        departmentId:'',
      };
  }
  componentDidMount=()=>{
    const id =  getQueryString("ruleId")
    console.log({id});
    if(id){ 
     this.getDetail(id)
     this.setState({ruleId: id})
    }
    this.props.dispatch({ // 获取教职工
      type:'user/getCommonPersonList',
      payload:{"personType":'2,3', "status": 1}
    })
    this.props.dispatch({ // 获取职务列表
      type:'user/getCommonJobList'
    })
    this.props.dispatch({ // 获取部门
      type:'user/departmentTree',
      callback:(res)=>{
        if(res.code === 200){
          this.setState({treeData:res.data})
        }
      }
    })
    
  }
  
  // 获取审批详情
  getDetail = (id) =>{
    this.props.dispatch({
      type:'multiRoleApproval/getApprovalDetail',
      payload:{id},
      callback:(res)=>{
        if(res.code === 200){
          res.data.toldPerson && res.data.toldPerson.length > 0 && res.data.toldPerson.map(item => {
            if(item.type == 1 && item.items.length > 0){
              this.setState({
                single: item.items
              })
            }else if(item.type == 2 && item.items.length > 0){
              this.setState({
                teachingRole: item.items
              })
            }else if(item.type == 3 && item.items.length > 0){
              this.setState({
                jobId: item.items
              })
            }else if(item.type == 4 && item.items.length > 0){
              this.setState({
                departmentId: item.items.toString()
              })
            }
          })
          this.setState({
            ruleName:res.data.name,
            synopsis:res.data.synopsis,
            process:res.data.process,
          })
        }
      }
    })
  }
  // 审批层级增加
  add = () => {
    let dataLen = this.state.process.length
    if(dataLen >= 10){
      return message.error("最多添加10个层级！")
    }else{
      this.setState({
        visible: true
      })
    }
  }
  // 审批层级增加确定
  handleOk = () =>{
    this.props.form.validateFields(["approvalType"],(err,values) =>{
      if(!err){
        let arrData = this.state.process
        if(values.approvalType == 1){
          arrData.push({
            type: values.approvalType,
            items: [],
            condition:''
          })
        }else if(values.approvalType == 4){
          arrData.push({
            type: values.approvalType,
            items: [],
            scope:''
          })
        }else{
          arrData.push({
            type: values.approvalType,
            items: []
          })
        }
        this.setState({
          process: arrData,
          visible: false,
        })
        this.props.form.resetFields(["approvalType"])
      }
    })
  }
  // 审批层级增加取消
  handleCancel = () =>{
    this.setState({visible:false})
    this.props.form.resetFields(["approvalType"])
  }
  // 审批层级删除
  del = (index) => {
    let oldData = this.state.process
    let newData = oldData.filter((item, i) => {
      return i !== index
    })
    this.setState({
      process: newData
    })
  }
  // 或签/会签，全员/管理员
  changeRole = (index,type,e) => {
    let dataArr = this.state.process
    if(type == 1){
      dataArr[index].condition = e.target.value
    }else if(type == 4){
      dataArr[index].scope = e.target.value
    }
    this.setState({
      process: dataArr
    })
  }
  // 审批人选择
  changeApprover = (index,val) =>{
    let dataArr = this.state.process
    dataArr[index].items = val
    this.setState({
      process: dataArr
    })
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 保存
  save = () => {
    const id = this.state.ruleId
    this.props.form.validateFields(["ruleName","synopsis","single","teachingRole","jobId","departmentId",],(err,values) =>{
      if(!err){
        let flag = true
        let flag1 = true
        let flag2 = true
        let processArr = this.state.process
        let checkPersons = []
        processArr && processArr.map((item,index) => {
          if(!item.items || item.items.length == 0){
            flag = false
          }
          if(item.type == 1 && !item.condition){
            flag1 = false
          }
          if(item.type == 4 ){
            item.items = [item.items]
            if(!item.scope){
              flag2 = false
            }
          }
        })
        if(!flag){
          return message.error("请选择审批人")
         
        }
        if(!flag1){
          return message.error("类型为个人请选择或签或者会签")
        }
        if(!flag2){
          return message.error("类型为部门请选择全员或者管理员")
        }
        if(values.single && values.single.length > 0){
          checkPersons.push({
            type: 1,
            items: values.single,
          })
        }
        if(values.teachingRole && values.teachingRole.length > 0){
          checkPersons.push({
            type: 2,
            items: values.teachingRole,
          })
        }
        if(values.jobId && values.jobId.length > 0){
          checkPersons.push({
            type: 3,
            items: values.jobId,
          })
        }
        if(values.departmentId){
          checkPersons.push({
            type: 4,
            items: [values.departmentId],
          })
        }
        const params = {
          "name": values.ruleName,
          "synopsis": values.synopsis,
          "process": processArr,
          "toldPerson": checkPersons 
        }
        console.log({params});
        if(id){
          params.id = id
        }
        this.props.dispatch({
          type: id ? 'multiRoleApproval/editApproval' : 'multiRoleApproval/addApproval',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success(id ? "修改成功" : "添加成功")
              window.history.go(-1)
            }
          }
        })
      }
    })
  }
  // 部门选择
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode value={item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode value={item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
  })
  render(){
      const {ruleId, visible, treeData, process, ruleName,synopsis,single,teachingRole,jobId,departmentId}= this.state;
      const {staffData, jobList} = this.props;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
      };
      const formItemLayout2 = {
          labelCol: { span: 7 },
          wrapperCol: { span: 17 }
      };
      // 查看人-个人类型选项
      let handlerPersonOption = [];
      staffData && staffData.length > 0 && staffData.map(item =>{ //教职工列表
          return handlerPersonOption.push(<Option value={item.personId} key={item.personId} >{item.personName}</Option>);
      })
      // 职务选项
      let jobData = [];
      jobList && jobList.length > 0 && jobList.map(item =>{
        return jobData.push(<Option value={item.jobId} key={item.jobId}>{item.jobName}</Option>)
      })
      return (
        <div className="approval-detail">
            <div className="breadcrumb">
                <Breadcrumb>
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/multi-role-approval-list">多角色审批流</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{ruleId ? '编辑' : '添加'}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{ruleId ? '编辑' : '添加'}</h3>
            </div>
            <div className="content-main">
              <SectionTag title="基础资料" />
              <Form>
                <Row gutter={24}>
                  <Col span={10}>
                    <FormItem {...formItemLayout} label={'规则名称'}>
                      {getFieldDecorator("ruleName",{initialValue:ruleName || '',rules:[{required:true,message:"请输入规则名称"}]})(
                        <Input placeholder="请输入规则名称" maxLength={20}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label={'规则简介'}>
                      {getFieldDecorator("synopsis",{initialValue:synopsis || ''})(
                        <TextArea placeholder="请输入规则简介" autosize={{ minRows: 1 }} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
            </Form>  
              <div className="title-box">
                <SectionTag title="审批层级" />&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.add.bind(this)}>增加</Button>     
              </div>
              <Form>
                {
                  process && process.map((item,index) => {
                    if(item.type == 1){
                      return  <Row gutter={24} key={index}>
                                <Col span={7}>
                                  <FormItem {...formItemLayout2} label={'类型'}>
                                    <Input disabled value="个人"/>
                                    <Radio.Group onChange={this.changeRole.bind(this,index,item.type)} value={item.condition}>
                                      <Radio value={"1"}>或签</Radio>
                                      <Popover placement="bottom" content="当前层级任意一人通过，则转到下一级">
                                        <Icon type="question-circle" theme="filled"/>
                                      </Popover>
                                      <Radio style={{marginLeft:'40px'}} value={"2"}>会签</Radio>
                                      <Popover placement="bottom" content="当前层级所有人通过，才转到下一级">
                                        <Icon type="question-circle" theme="filled"/>
                                      </Popover>
                                    </Radio.Group>
                                  </FormItem>
                                </Col>
                                <Col span={15}>
                                  <FormItem {...formItemLayout} label={'审批人'}>
                                    <Select
                                      onChange={this.changeApprover.bind(this,index)}
                                      mode="multiple"
                                      showSearch
                                      allowClear
                                      value={item.items || []}
                                      filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                      placeholder="请选择审批人">
                                        {handlerPersonOption}
                                    </Select>
                                  </FormItem>
                                </Col>
                                <Col span={2} >
                                  <FormItem label=''>
                                    <Icon type="minus-circle" onClick={this.del.bind(this, index)} className="delIcon" />
                                  </FormItem>
                                </Col>
                              </Row>
                    }else if(item.type == 2){
                      return  <Row gutter={24} key={index}>
                                <Col span={7}>
                                  <FormItem {...formItemLayout2} label={'类型'}>
                                    <Input disabled value="教学角色"/>
                                  </FormItem>
                                </Col>
                                <Col span={15}>
                                  <FormItem {...formItemLayout} label={'审批人'}>
                                    <Select
                                      value={item.items || []}
                                      onChange={this.changeApprover.bind(this,index)}
                                      mode="multiple"
                                      placeholder="请选择教学角色"
                                      optionFilterProp="children"
                                    >
                                      <Option value="2">副班主任</Option>
                                      <Option value="3">班主任</Option>
                                      <Option value="4">导师</Option>
                                    </Select>
                                  </FormItem>
                                </Col>
                                <Col span={2} >
                                  <FormItem label=''>
                                    <Icon type="minus-circle" onClick={this.del.bind(this, index)} className="delIcon" />
                                  </FormItem>
                                </Col>
                              </Row>
                    }else if(item.type == 3){
                      return <Row gutter={24} key={index}>
                              <Col span={7}>
                                <FormItem {...formItemLayout2} label={'类型'}>
                                  <Input disabled value="职务"/>
                                </FormItem>
                              </Col>
                              <Col span={15}>
                                <FormItem {...formItemLayout} label={'审批人'}>
                                  <Select
                                    value={item.items || []}
                                    onChange={this.changeApprover.bind(this,index)}
                                    showSearch
                                    mode="multiple"
                                    placeholder="请选择职务"
                                    optionFilterProp="children"
                                  >
                                    {jobData}
                                  </Select>
                                </FormItem>
                              </Col>
                              <Col span={2} >
                                <FormItem label=''>
                                  <Icon type="minus-circle" onClick={this.del.bind(this, index)} className="delIcon" />
                                </FormItem>
                              </Col>
                            </Row>
                    }else if(item.type == 4){
                      return <Row gutter={24} key={index}>
                              <Col span={7}>
                                <FormItem {...formItemLayout2} label={'类型'}>
                                  <Input disabled value="部门"/>
                                  <Radio.Group onChange={this.changeRole.bind(this,index,item.type)} value={item.scope}>
                                    <Radio value={"1"}>全员</Radio>
                                    <Popover placement="bottom" content="部门内任意一人通过，则转到下一级">
                                      <Icon type="question-circle" theme="filled"/>
                                    </Popover>
                                    <Radio style={{marginLeft:'40px'}} value={"2"}>管理员</Radio>
                                    <Popover placement="bottom" content="部门内仅管理员可审批">
                                      <Icon type="question-circle" theme="filled"/>
                                    </Popover>
                                  </Radio.Group>
                                </FormItem>
                              </Col>
                              <Col span={15}>
                                <FormItem {...formItemLayout} label={'审批人'}>
                                  <TreeSelect
                                    value={item.items||''}
                                    onChange={this.changeApprover.bind(this,index)}
                                    dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                                    placeholder="请选择部门"
                                    allowClear
                                    treeDefaultExpandAll
                                  >
                                    {this.renderTreeNodes(treeData)}
                                  </TreeSelect>
                                </FormItem>
                              </Col>
                              <Col span={2} >
                                <FormItem label=''>
                                  <Icon type="minus-circle" onClick={this.del.bind(this, index)} className="delIcon" />
                                </FormItem>
                              </Col>
                            </Row>
                    }
                  })
                }
              </Form> 
              <SectionTag title="查看人" />
              <Form>
                <Row gutter={24}>
                  <Col span={7}>
                    <FormItem {...formItemLayout2} label={'类型'}>
                      <Input disabled value="个人"/>
                    </FormItem>
                  </Col>
                  <Col span={15}>
                    <FormItem {...formItemLayout} label={'查看人'}>
                      {getFieldDecorator("single",{initialValue:single || undefined})(
                        <Select
                          showSearch
                          mode="multiple"
                          placeholder="请选择查看人"
                          optionFilterProp="children"
                        >
                          {handlerPersonOption}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={7}>
                    <FormItem {...formItemLayout2} label={'类型'}>
                      <Input disabled value="教学角色"/>
                    </FormItem>
                  </Col>
                  <Col span={15}>
                    <FormItem {...formItemLayout} label={'查看人'}>
                      {getFieldDecorator("teachingRole",{initialValue: teachingRole || undefined})(
                        <Select
                          mode="multiple"
                          placeholder="请选择教学角色"
                          optionFilterProp="children"
                        >
                          <Option value="2">副班主任</Option>
                          <Option value="3">班主任</Option>
                          <Option value="4">导师</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={7}>
                    <FormItem {...formItemLayout2} label={'类型'}>
                        <Input disabled value="职务"/>
                    </FormItem>
                  </Col>
                  <Col span={15}>
                    <FormItem {...formItemLayout} label={'查看人'}>
                      {getFieldDecorator("jobId",{initialValue: jobId || undefined})(
                        <Select
                          showSearch
                          mode="multiple"
                          placeholder="请选择职务"
                          optionFilterProp="children"
                        >
                          {jobData}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={7}>
                    <FormItem {...formItemLayout2} label={'类型'}>
                        <Input disabled value="部门"/>
                    </FormItem>
                  </Col>
                  <Col span={15}>
                    <FormItem {...formItemLayout} label={'查看人'}>
                      {getFieldDecorator("departmentId",{initialValue: departmentId || undefined})(
                        <TreeSelect
                          dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                          placeholder="请选择部门"
                          allowClear
                          treeDefaultExpandAll
                        >
                        {this.renderTreeNodes(treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>  
              <div className="btn">
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type='primary'  onClick={this.save.bind(this)}>保存</Button>
              </div>
            </div>
            <Modal
              title="增加审批人类型"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Form>
                <Row gutter={24} >
                  <Col span={22}>
                    <FormItem {...formItemLayout} label={'类型'}>
                      {getFieldDecorator("approvalType",{rules:[{required:true,message:"请选择审批人类型"}]})(
                        <Select placeholder="请选择类型">
                          <Option value={1}>个人</Option>
                          <Option value={2}>教学角色</Option>
                          <Option value={3}>职务</Option>
                          <Option value={4}>部门</Option>
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
    staffData:state.user.commonPersonData,
    jobList:state.user.commonJobList
  }
}
export default connect(mapStateToProps)(Form.create()(ApprovalDetail));
