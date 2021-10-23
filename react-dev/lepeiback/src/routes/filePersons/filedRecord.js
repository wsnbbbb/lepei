import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Tabs, Radio, TreeSelect, Divider,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl} from '../../utils/img';
import {getGradeType, getSexType, getResidence, formatDate,} from '../../utils/public';
import './style.less';

const { TabPane } = Tabs
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

class FiledRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          page1: 1,
          prePage1: 20,
          page2: 1,
          prePage2: 20,
          visible: false,
          visible1: false,
          gradeId: '',
          classValue: '',
          personIds: [],
          disabled: false,
          selectedRowKeys: [],
          exportUrl: '',
          list: [],
          list1: [],
          list2: [],
          treeData: [],
          getMore1: true,
          getMore2: true,
          currentPersonId: '',
          currentType: '',
          gradeList: []
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page": 1,
         "prePage": 20,
         "personType": 1
       }
       this.getAllClass()
       this.getList(params)
       this.getGradeList()
       this.getDepartmentList()
       this.getJobList()
       this.getBatchGradeList()
       this.getBatchClassList()
    }
    getGradeList=()=>{
      this.props.dispatch({
        type: 'filePersons/getFiledPersonGroup',
        payload: {
          type: 2
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                gradeList: res.data
              })
            }
        }
      })
    }
    getDepartmentList=()=>{
      this.props.dispatch({
        type: 'filePersons/getFiledPersonGroup',
        payload: {
          type: 4
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                departmentList: res.data
              })
            }
        }
      })
    }
    getJobList=()=>{
      this.props.dispatch({
        type: 'filePersons/getFiledPersonGroup',
        payload: {
          type: 5
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                jobList: res.data
              })
            }
        }
      })
    }
    getBatchGradeList=()=>{
      this.props.dispatch({
        type: 'filePersons/getFiledGroup',
        payload: {
          type: 2
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                batchGradeList: res.data
              })
            }
        }
      })
    }
    getBatchClassList=()=>{
      this.props.dispatch({
        type: 'filePersons/getFiledGroup',
        payload: {
          type: 3
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                batchClassList: res.data
              })
            }
        }
      })
    }
    getAllClass=()=>{
      this.props.dispatch({
        type: 'filePersons/getAllClass',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                classList: res.data
              })
            }
        }
      })
    }
    getList=(params)=>{
      this.props.dispatch({
        type: 'filePersons/filedList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }
    getList1=(params)=>{
      this.props.dispatch({
        type: 'filePersons/filedList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list1: res.data
              })
            }
        }
      })
    }
    getList2=(params)=>{
      this.props.dispatch({
        type: 'filePersons/filedList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list2: res.data
              })
            }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw1||'',
          "personType": 1,
          "gradeId": values.gradeId||'',
          "classId": this.state.classValue||''
        }
        this.getList(params)
      })
    }
    // 查询
    search1=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage1,
          "kw": values.kw2||'',
          "personType": 2,
          "departmentId": values.departmentId||'',
          "jobId": values.jobId||''
        }
        this.getList1(params)
      })
    }
    // 查询
    search2=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage2,
          "kw": values.kw3||'',
          "personType": 3,
          "departmentId": values.departmentId1||'',
          "jobId": values.jobId1||''
        }
        this.getList2(params)
      })
    }
    changeTab = (key)=>{
      console.log(key)
      if(key == 2){
        if(!this.state.getMore1) return
        this.props.form.validateFields((err, values) => {
          const params={
            "page": 1,
            "prePage": this.state.prePage1,
            "kw": values.kw||'',
            "personType": 2,
            "departmentId": values.departmentId||'',
            "jobId": values.jobId||''
          }
          this.getList1(params)
          this.setState({
            getMore1: false
          })
        })
      }else if(key == 3){
        if(!this.state.getMore2) return
        this.props.form.validateFields((err, values) => {
          const params={
            "page": 1,
            "prePage": this.state.prePage1,
            "kw": values.kw||'',
            "personType": 3,
            "departmentId": values.departmentId||'',
            "jobId": values.jobId||''
          }
          this.getList2(params)
          this.setState({
            getMore2: false
          })
        })
      }
      
    }
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
   
    // 撤销
    showConfirm=(id, type)=> {
      let me=this;
      this.setState({
        currentType: type
      })
      confirm({
        title: '提示',
        content: '确定要撤销归档吗？',
        onOk() {
          me.props.dispatch({
            type:'filePersons/unfileOne',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('撤销成功！',3)
              
                  if(me.state.currentType==1){
                    me.search()
                  }else if(me.state.currentType==2){
                    me.search1()
                  }else if(me.state.currentType==3){
                    me.search2()
                  }
             
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId||'',
          "classId":this.state.classValue||''
        }
        this.getList(params)
      })
    }
    // 分页
    onPageChange1=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page1:current,prePage1:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "personType": 2,
          "departmentId": values.departmentId||'',
          "jobId": values.jobId||''
        }
        this.getList1(params)
      })
    }
    // 分页
    onPageChange2=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page2:current,prePage2:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "personType": 3,
          "departmentId": values.departmentId||'',
          "jobId": values.jobId||''
        }
        this.getList2(params)
      })
    }
    showModalPerson=(id, type)=>{
      this.props.dispatch({
        type: 'filePersons/showFiledReason',
        payload: {
          personId: id
        },
        callback: res=>{
            if(res.code===200){
              this.props.form.setFieldsValue({"reason1": res.data.reason, "handler": res.data.handler})
              this.setState({
                visible1: true
              })
            }
        }
      // this.setState({
      //   visible1: true, 
      //   currentPersonId: id,
      //   currentType: type
      })
    }
    goToRule=()=>{
        this.props.dispatch(routerRedux.push("/score-rule"))
    }
    showModalBatch=()=>{
      this.props.form.resetFields(['selGradeId', 'selClassId']);
      this.setState({
        visible: true
      })
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-student"));
    }
    selectChange=(selectedRowKeys, selectedRows)=>{
      let ids=[];
      selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
        return ids.push(item.personId)
      })
      this.setState({personIds:ids,selectedRowKeys})
    }

    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val
        this.props.dispatch({
          type:'filePersons/getFiledPersonGroup',
          payload:{
            type: 3,
            pid: id
          },
          callback:(res)=>{
            if(res.code===200){
              this.setState({
              classValue: '',
              classNameData: res.data
            })
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    handleCancel =()=>{
      this.props.form.resetFields(['type', 'reason', 'selGradeId', 'selClassId'])
      this.setState({
        visible: false
      }) 
    }
    handleCancel1 =()=>{
      this.props.form.resetFields(['reason1'])
      this.setState({
        visible1: false
      }) 
    }
    handleOk =()=>{
      let checkArr = []
      let me = this
      if(this.props.form.getFieldValue("type") == 2){
        checkArr = ['selGradeId']
      }else if(this.props.form.getFieldValue("type") == 3){
        checkArr = ['selClassId']
      }
      this.props.form.validateFields(checkArr, (err, values) => {
        if(!err){
            let params = {
              type: me.props.form.getFieldValue("type"), 
              groupId: me.props.form.getFieldValue("type")==2?me.props.form.getFieldValue("selGradeId"):me.props.form.getFieldValue("selClassId"),
            }
            this.props.dispatch({
              type: 'filePersons/unfileGroup',
              payload: params,
              callback: res=>{
                if(res.code===200){
                  message.success("操作成功！")
                  this.setState({
                    visible: false,
                  })
                  me.getBatchGradeList()
                  me.getBatchClassList()
                  me.search()
                }
              }
            })
        }
      })
    }
    handleOk1 =()=>{
      let me = this
      this.props.form.validateFields(['reason1'], (err, values) => {
        if(!err){
            let params = {
              personId: me.state.currentPersonId, 
              reason: values.reason1||'',
            }
            this.props.dispatch({
              type: 'filePersons/fileOne',
              payload: params,
              callback: res=>{
                if(res.code===200){
                  message.success("操作成功！")
                  this.props.form.resetFields(['reason1']);
                  this.setState({
                    visible1: false,
                  })
                  if(me.state.currentType==1){
                    me.search()
                  }else if(me.state.currentType==2){
                    me.search1()
                  }else if(me.state.currentType==3){
                    me.search2()
                  }
              
                }
              }
            })
        }
      })
    }
    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let url=portUrl("/manager/person-score/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId)
          this.setState({exportUrl:url})
        })
      }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            width:100,
            fixed:'left'
          } ,{
            title: '性别',
            dataIndex: 'sex',
            render:(record) => (
              <span>
                {getSexType(record)} 
              </span>
            )
          }, {
            title: '读书形式',
            dataIndex: 'inResidence',
            render:(record) => (
              <span>
                {getResidence(record)} 
              </span>
            )
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record) => (
              <span>
                {getGradeType(record)} 
              </span>
            )
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          },{
            title: '归档时间',
            dataIndex: 'filedTime',
            render:(record) => (
              <span>
                {formatDate(record)} 
              </span>
            )
          },{
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showModalPerson.bind(this, record.personId, 1)}>归档原因</a><Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.personId, 1)} >撤销</a>
              </span>
            )
          }];
          const columns1 = [{
            title: '姓名',
            dataIndex: 'personName',
            width:100,
            fixed:'left'
          } ,{
            title: '性别',
            dataIndex: 'sex',
            render:(record) => (
              <span>
                {getSexType(record)} 
              </span>
            )
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          }, {
            title: '职务',
            dataIndex: 'jobName',
          }, {
            title: '归档时间',
            dataIndex: 'filedTime',
            render:(record) => (
              <span>
                {formatDate(record)} 
              </span>
            )
          },{
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showModalPerson.bind(this, record.personId, 2)}>归档原因</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.personId, 2)}>撤销</a>
              </span>
            )
          }];
          const columns2 = [{
            title: '姓名',
            dataIndex: 'personName',
            width:100,
            fixed:'left'
          } ,{
            title: '性别',
            dataIndex: 'sex',
            render:(record) => (
              <span>
                {getSexType(record)} 
              </span>
            )
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          }, {
            title: '职务',
            dataIndex: 'jobName',
          }, {
            title: '归档时间',
            dataIndex: 'filedTime',
            render:(record) => (
              <span>
                {formatDate(record)} 
              </span>
            )
          }, {
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showModalPerson.bind(this, record.personId, 3)}>归档原因</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.personId, 3)}>撤销</a>
              </span>
            )
          }];
          
          const { list, list1, list2 , gradeList, classList, classNameData, departmentList, jobList, batchGradeList, batchClassList} = this.state;
          const { getFieldDecorator, getFieldValue } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16}
          };
          
          let classOptions=[];
          classNameData&&classNameData.length>0&&classNameData.map(item=>{
            return classOptions.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let allClass=[];
          classList&&classList.length>0&&classList.map(item=>{
            return allClass.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })

          let batchGradeOptions=[]
          batchGradeList&&batchGradeList.length>0&&batchGradeList.map(item=>{
            return batchGradeOptions.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          
          let batchClassOptions=[]
          batchClassList&&batchClassList.length>0&&batchClassList.map(item=>{
            return batchClassOptions.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let departmentOptions=[];
          departmentList&&departmentList.length>0&&departmentList.map(item=>{
            return departmentOptions.push(<Option value={item.groupId}>{item.groupName}</Option>)
          })
          let jobData=[];
          jobList&&jobList.length>0&&jobList.map(item=>{
            return jobData.push(<Option value={item.groupId}>{item.groupName}</Option>)
          })
     
        return (
            <div className="content-main student-score">
               <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                <TabPane tab="学生归档" key="1">
                  <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={4}>
                        <FormItem label=''>
                          {getFieldDecorator('kw1')(
                            <Search
                              placeholder="请输入学生姓名或证件号"
                            />
                          )}
                        </FormItem>
                      </Col> 
                      <Col span={6}>
                        <FormItem {...formItemLayout} label={'年级名称'}>
                          {getFieldDecorator("gradeId",{initialValue:''})(
                            <Select showSearch onChange={this.gradeChange.bind(this)}>
                              <Option value='' key=''>全部</Option>
                              {options}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem {...formItemLayout} label={'班级'}>
                            <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                              <Option value='' key=''>全部</Option>
                              {classOptions}
                            </Select>
                        </FormItem>
                      </Col>
                      <Col span={6} >
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                            <Button onClick={this.showModalBatch.bind(this)}>批量撤销</Button>
                      </Col>
                    </Row>
                </Form>              
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={list.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              
                </TabPane>
                <TabPane tab="教师归档" key="2">
                  <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={4}>
                        <FormItem label=''>
                          {getFieldDecorator('kw2')(
                            <Search
                              placeholder="请输入姓名或证件号"
                            />
                          )}
                        </FormItem>
                      </Col> 
                      <Col span={6}>
                        <FormItem {...formItemLayout} label={'部门'}>
                          {getFieldDecorator("departmentId",{initialValue:''})(        
                            <Select>
                                <Option value="">全部</Option>
                                {departmentOptions}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem {...formItemLayout} label={'职务'}>
                          {getFieldDecorator("jobId",{initialValue:''})(
                            <Select>
                              <Option value="">全部</Option>
                              {jobData}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} >
                            <Button type='primary' onClick={this.search1.bind(this)}>查询</Button>&nbsp;&nbsp;
                      </Col>
                    </Row>
                </Form>              
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns1} dataSource={list1.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange1.bind(this)} total={list1.totalCount} totalPage={list1.totalPage} currentPage={list1.currentPage}/>
              

                </TabPane>
                <TabPane tab="职工归档" key="3">
                  <Form className="ant-advanced-search-form content-form">
                      <Row gutter={24}>
                        <Col span={4}>
                          <FormItem label=''>
                            {getFieldDecorator('kw3')(
                              <Search
                                placeholder="请输入姓名或证件号"
                              />
                            )}
                          </FormItem>
                        </Col> 
                        <Col span={6}>
                          <FormItem {...formItemLayout} label={'部门'}>
                            {getFieldDecorator("departmentId1",{initialValue:''})(        
                                <Select>
                                    <Option value="">全部</Option>
                                    {departmentOptions}
                                </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem {...formItemLayout} label={'职务'}>
                            {getFieldDecorator("jobId1",{initialValue:''})(
                              <Select>
                                <Option value="">全部</Option>
                                {jobData}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={2} >
                              <Button type='primary' onClick={this.search2.bind(this)}>查询</Button>&nbsp;&nbsp;
                        </Col>
                      </Row>
                  </Form>              
                  <Table className='content-table' scroll={{ x: 1000 }} columns={columns2} dataSource={list2.dataList} pagination={false}/>
                  <PageIndex getPage={this.onPageChange2.bind(this)} total={list2.totalCount} totalPage={list2.totalPage} currentPage={list2.currentPage}/>
                
                </TabPane>
              </Tabs>
              <Modal
                title="批量撤销"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                  <Form {...formItemLayout2}>
                    <Form.Item label="类型">
                      {getFieldDecorator('type', {
                        initialValue: '2',
                        rules: [{ required: true, message: '请选择' }]
                      })(
                        <Radio.Group>
                          <Radio.Button value="2">按年级</Radio.Button>
                          <Radio.Button value="3">按班级</Radio.Button>
                        </Radio.Group>
                      )}
                      
                    </Form.Item>

                    <Form.Item style={{display: getFieldValue("type")==2?"block":'none'}} label="年级">
                      {getFieldDecorator('selGradeId', {
                        rules: [{ required: true, message: '请选择年级' }],
                      })(
                        <Select placeholder="请选择年级">
                          {batchGradeOptions}
                        </Select>
                      )}
                    </Form.Item>
                   
                    <Form.Item style={{display: getFieldValue("type")==3?"block":'none'}} label="班级">
                      {getFieldDecorator('selClassId', {
                        rules: [{ required: true, message: '请选择班级' }],
                      })(
                        <Select placeholder="请选择班级">
                          {batchClassOptions}
                        </Select>
                      )}
                    </Form.Item>
                    </Form>
                </Modal>
                <Modal
                title="归档原因"
                visible={this.state.visible1}
                onOk={this.handleCancel1}
                onCancel={this.handleCancel1}
                footer={[
                  <Button key="submit" type="primary" onClick={this.handleCancel1}>
                    确定
                  </Button>
                ]}
                >
                  <Form {...formItemLayout2}>
                    <Form.Item label="归档原因">
                        {getFieldDecorator('reason1')(
                          <TextArea rows={4} disabled maxLength={20} />
                      )}
                    </Form.Item>
                    <Form.Item label="操作人">
                        {getFieldDecorator('handler')(
                          <Input disabled maxLength={20}  />
                      )}
                    </Form.Item>
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
     commonData:state.user,
     gradeList:state.user.commonGradeData,
     jobList:state.user.commonJobList
  }
}

export default connect(mapStateToProps)(Form.create()(FiledRecord));
