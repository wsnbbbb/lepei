import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Tooltip, Input, Select, Form, Divider, Row, Col, DatePicker, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl} from '../../utils/img';
import {getGradeType,getSexType,getResidence, formatDate, formatPhone} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class StudentHonor extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          list: [],
          honorTypes: [],
          rule: [],
          resultData: {}
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page":1,"prePage":20
       }
       this.getList(params)
       this.props.dispatch({
        type: 'user/getCommonGradeList'
       })
       this.getHonorTypes()
       this.getApprovalRules()
    }
    getHonorTypes=()=>{
      this.props.dispatch({
        type: 'honor/getHonorTypes',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                honorTypes: res.data.types
              })
            
            }
        }
       })

    }
    getList=(params)=>{
      this.props.dispatch({
        type: 'honor/personHonorRecords',
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

    getApprovalRules=(params)=>{
      this.props.dispatch({
        type: 'honor/getApprovalRules',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                
                rule: res.data
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
          "kw": values.kw||'',
          "gradeId": values.gradeId?values.gradeId:'',
          "classId": this.state.classValue?this.state.classValue:'',
          "typeId": values.typeId||'',
          "startDate": values.time[0]&&values.time[0].format("YYYY-MM-DD")||'',
          "endDate": values.time[1]&&values.time[1].format("YYYY-MM-DD")||'',
        }
        this.getList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条信息吗？',
        onOk() {
          me.props.dispatch({
            type:'honor/deletePersonHonorRecords',
            payload:{"id": id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "gradeId":values.gradeId?values.gradeId:'',
                    "classId":me.state.classValue?me.state.classValue:'',
                    "startDate": values.time[0]&&values.time[0].format("YYYY-MM-DD")||'',
                    "endDate": values.time[1]&&values.time[1].format("YYYY-MM-DD")||'',
                  }
                  me.getList(params)
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
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId:'',
          "classId": this.state.classValue?this.state.classValue:'',
          "startDate": values.time[0]&&values.time[0].format("YYYY-MM-DD")||'',
          "endDate": values.time[1]&&values.time[1].format("YYYY-MM-DD")||'',
        }
        this.getList(params)
      })
    }
    goToDetail=(id)=>{
        this.props.dispatch(routerRedux.push("/honor-detail?&id="+id))
    }
    setPublisher=()=>{
      this.props.form.resetFields(["ruleId" , "publisherIds"]);
      this.props.dispatch({
        type:'honor/getPersonHonorHandler',
        payload:{},
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              resultData: res.data,
              visible: true
            })
          }
        }
      })
    }
    goToLevel=()=>{
      this.props.dispatch(routerRedux.push("/person-honor-level"))
    }
    goToRecord=()=>{
      this.props.dispatch(routerRedux.push("/person-honor-records"))
    }

    handleCancel=()=>{
      this.props.form.resetFields(["ruleId" , "publisherIds"]);
      this.setState({
        visible: false
      })
    }
    handleOk=()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({
            type:'honor/savePersonHonorHandler',
            payload:{
              ruleId: values.ruleId||'',
              publisherIds: values.publisherIds||''
            },
            callback:(res)=>{
              if(res.code===200){
                this.props.form.resetFields();
                this.setState({
                  visible: false
                })
              }
            }
          })
        }
      });
    }

    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":id},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
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
    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let typeId=values.typeId||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let startDate = values.time[0]&&values.time[0].format("YYYY-MM-DD")||''
          let endDate = values.time[1]&&values.time[1].format("YYYY-MM-DD")||''
          let url=portUrl("/manager/person-honor-records/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&typeId="+typeId+"&gradeId="+gradeId+"&classId="+classId+"&startDate="+startDate+"&endDate="+endDate)
          this.setState({exportUrl:url})
          console.log(url)
        })
      }
    render(){
        const columns = [{
            title: '学生姓名',
            dataIndex: 'students',
            width:100,
            fixed:'left',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="tooltip-content">{record}</span>
            </Tooltip>)}
          } ,{
            title: '年级班级',
            dataIndex: 'classNames',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="tooltip-content">{record}</span>
            </Tooltip>)}
          },{
            title: '奖项名称',
            dataIndex: 'title',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="tooltip-content">{record}</span>
            </Tooltip>)}
          },{
            title: '颁奖单位',
            dataIndex: 'awardOrg',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="tooltip-content">{record}</span>
            </Tooltip>)}
          }, {
            title: '荣誉类型',
            dataIndex: 'typeName',
          }, {
            title: '上传人',
            dataIndex: 'publisherName',
            render:(text, record) => (
              <span>
                {(record.publisherType==1?formatPhone(record.publisherName):record.publisherName+"老师")}
              </span>
            )
          }, {
            title: '上传时间',
            dataIndex: 'createTime',
            render:(text, record) => (
              <span>
                {formatDate(record.createTime)}
              </span>
            )
          }, {
            title: '状态',
            dataIndex: 'status',
            render:(text, record) => (
              <span>
                {record.status==0?"待审核":(record.status==1?"已通过":"未通过")}
              </span>
            )
          }, {
            title: '加分',
            dataIndex: 'score',
          },
          {
            title: '操作',
            dataIndex: '',
            width:120,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.goToDetail.bind(this, record.id)}>查看</a>
                  <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.id)}>删除</a> 
              </span>
            )
          }];
          
          const { list , honorTypes, rule, resultData} = this.state;
          let typeOptions=[];
          honorTypes&&honorTypes.map(item=>{
              return typeOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
          })
          let ruleOptions=[];
          rule&&rule.map(item=>{
              return ruleOptions.push(<Option key={item.ruleId} value={item.ruleId}>{item.ruleName}</Option>)
          })
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout1 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
          };
        
          const {commonData, gradeList} = this.props;
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main student-honor">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入学生姓名/发布教师姓名"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem  label={''}>
                      {getFieldDecorator("time",{initialValue:''})(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'荣誉类型'}>
                      {getFieldDecorator("typeId",{initialValue:''})(
                        <Select showSearch>
                          <Option value='' key=''>全部</Option>
                          {typeOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={2} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  </Row>
                  <Row style={{paddingBottom: '20px'}}>
                    <Col span={12} >
                          <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button type='primary' onClick={this.goToLevel.bind(this)}>荣誉等级类型</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button type='primary' onClick={this.setPublisher.bind(this)}>处理人</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button type='primary' onClick={this.goToRecord.bind(this)}>荣誉统计</Button>
                    </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }}  columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              <Modal width={500}
                    title={"处理人"}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    style={{width:"500px"}}
                    bodyStyle={{minHeight:"240px"}}
                    >
                    <Form {...formItemLayout1}>
                        <FormItem label='选择审批规则'>
                        {getFieldDecorator('ruleId', { initialValue: resultData.ruleId||'',
                         rules: [
                          {
                            required: true,
                            message: '请选择审批规则',
                          }
                        ]})(
                            <Select showSearch placeholder="请选择">
                              {ruleOptions}
                            </Select>
                          )}
                        </FormItem>
                    </Form>
                    <Form {...formItemLayout1}>
                        <FormItem label='发布人'>
                          {getFieldDecorator('publisherIds', { initialValue: resultData.publisherIds||'',
                           rules: [
                            {
                              required: true,
                              message: '请选择发布人',
                            }
                          ]})(
                            <Select showSearch  mode="multiple" placeholder="请选择">
                              <Option value='1' key='1'>科任老师</Option>
                              <Option value='2' key='2'>副班主任</Option>
                              <Option value='3' key='3'>班主任</Option>
                              <Option value='4' key='4'>导师</Option>
                            </Select>
                          )}
                        </FormItem>
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
     gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(StudentHonor));
