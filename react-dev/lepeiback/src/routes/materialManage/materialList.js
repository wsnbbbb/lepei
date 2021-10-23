import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class MaterialList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          reset:false,
          classDisabled:true,
          materialData: {},
          classValue:'',
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getMaterialList(params)
      // this.props.dispatch({ //获取所有审批规则
      //   type:'user/getApprovalRules',
      // })
      // 查看审批规则
      // this.props.dispatch({
      //   type:'room/getApplyHandlers',
      // })
      this.props.dispatch({ //获取所有学期
          type:'user/getAllSemesters',
      })
      this.props.dispatch({ //获取所有年级
          type:'user/getCommonGradeList',
      })
    }
    gradeChange=(val)=>{
          if(val){
            this.props.dispatch({
              type:'user/getClassName',
              payload:{"gradeId":val},
              callback:(res)=>{
                if(res.code===200){
                  this.setState({classValue:'',classDisabled:false})
                }
              }
            })
          }else{
            this.setState({classValue:'',classDisabled:true})
          }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    getMaterialList=(params)=>{
      this.props.dispatch({
        type:'material/getMaterialList',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            res.data&&res.data.dataList.map(item=>{
              item.name = item.gradeName + item.className
            })
           this.setState({
             materialData: res.data
           })
          }
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
          "semesterId":values.semesterId||'',
          "gradeId":values.gradeId||'',
          "classId":this.state.classValue,
        }
        this.getMaterialList(params)
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
            type:'room/delRoomApply',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "status":values.status,
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getMaterialList(params)
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
          "semesterId":values.semesterId||'',
          "gradeId":values.gradeId||'',
          "classId":this.state.classValue,
        }
        this.getMaterialList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/material-detail/"+id))
    }
    toMenuManage=()=>{
      this.props.dispatch(routerRedux.push("/material-menu-manage"))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    
    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
          console.log(values)
          this.props.dispatch({
            type:'room/setApplyHandlers',
            payload:{"ruleId":values.ruleId},
            callback:(res)=>{
              if(res.code===200){
                message.success('设置成功！',2)
                // 查看处理人
                this.props.dispatch({
                  type:'room/getApplyHandlers',
                })
                this.props.form.resetFields();
                this.setState({
                  visible: false,reset:true
                });
              }
            }
          })
        })
        
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,reset:true
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const columns = [{
            title: '学生姓名',
            dataIndex: 'personName',
          }, {
            title: '年级班级',
            dataIndex: 'name',
            className:'name',
            render:(record)=>{
              return(
                <span>{record}</span>
              )
            }
          }, {
            title: '最近更新时间',
            dataIndex: 'updateTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record.personId)}>查看</a> 
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const {getHandlers,approvalRules} = this.props;
          console.log(getHandlers)
          const {allTerms, commonGradeData, classNameData} = this.props;
          let termChild=[]
          allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
          })
          let gradeChild=[]
          commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
              gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
          })
          let classChild=[]
          classNameData&&classNameData.length>0&&classNameData.map(item=>{
              classChild.push(<Option key={item.classId}>{item.className}</Option>)
          })
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
          const {classDisabled,classValue} = this.state;
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入学生姓名"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={5}>
                    <FormItem label=''>
                        {getFieldDecorator('semesterId')(
                          <Select placeholder="请选择学期">
                              <Option value=''>全部</Option>
                              {termChild}
                          </Select>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                      <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                          <Select showSearch onChange={this.gradeChange} optionFilterProp="children">
                              <Option value='' key=''>全部</Option>
                              {gradeChild}
                          </Select>
                      )}
                      </FormItem>
                  </Col>  
                  <Col span={5}>
                      <FormItem {...formItemLayout} label={'班级'} optionFilterProp="children">
                          <Select showSearch value={classValue} onChange={this.classChange} disabled={classDisabled}>
                          <Option value='' key=''>全部</Option>
                          {classChild}
                          </Select>
                      </FormItem>
                  </Col> 
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.toMenuManage.bind(this)}>栏目管理</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.materialData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.materialData.totalCount} totalPage={this.state.materialData.totalPage} currentPage={this.state.materialData.currentPage}/>
              <Modal
                title="审批规则设置"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
              
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
     roomList:state.room,
    //  getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules,
     allTerms:state.user.allTerms,
     commonGradeData:state.user.commonGradeData,
     classNameData:state.user.classNameData,
  }
}
export default connect(mapStateToProps)(Form.create()(MaterialList));
