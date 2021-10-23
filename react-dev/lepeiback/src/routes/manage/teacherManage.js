import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Select,Form,Row,Col,Icon,Menu,Dropdown,Badge,Popover,Modal,message,TreeSelect } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getSexType, formatIdcard} from '../../utils/public';
import { portUrl } from '../../utils/img'
import './style.less';
import { withActivation } from 'react-activation'

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
@withActivation
class TeacherMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          teacherList:{},
          page:1,
          prePage:20,
          treeData:[],
          personIds:[],
          exportUrl:''
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page":1,"prePage":20,"personType":2
       }
       let teacherManageParams = JSON.parse(sessionStorage.getItem('teacherManageParams'))
       console.log(teacherManageParams);
       if(teacherManageParams){
        this.setState({
          page:teacherManageParams.page,
          prePage:teacherManageParams.prePage,
          kw:teacherManageParams.kw,
          departmentId:teacherManageParams.departmentId,
          jobId:teacherManageParams.jobId,
        })
        teacherManageParams.departmentId = teacherManageParams.departmentId ? teacherManageParams.departmentId.substring(teacherManageParams.departmentId.lastIndexOf('-')+1, teacherManageParams.departmentId.length):''
        this.personLists(teacherManageParams)
      }else{
        this.personLists(params)
      }

      this.props.dispatch({
        type:'user/getCommonJobList'
      })
      this.props.dispatch({
      type:'user/getDepartmentList',
      callback:(res)=>{
        if(res.code===200){
            this.setState({treeData:res.data})
        }
      }
      })
    }

    //路由状态返回，组件做些什么处理
      componentDidActivate = () => {
            console.log('AdttendanceDetailsStu: componentDidActivate');
            this.queryCurrentPageList();
     }
      //路由状态前进，组件做些什么处理
      componentWillUnactivate = () => {
        console.log('AdttendanceDetailsStu: componentWillUnactivate')
      }


    // 列表
    personLists=(params)=>{
      let that = this;
      that.props.dispatch({
        type:'person/getPersonList',
        payload:params,
        callback: (res) => {
          if (res.code === 200) {
            sessionStorage.removeItem('teacherManageParams')
            that.setState({
              teacherList:res.data
            })
          }
        }
      })
    }
    //查询
    queryCurrentPageList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        const params={
          "page":that.state.page,
          "prePage":that.state.prePage,
          "personType":2,
          "kw":values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "jobId":values.jobId||''
        }
        that.personLists(params);
      });
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "personType":2,
          "kw":values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "jobId":values.jobId||''
        }
        this.setState({page:1})
        this.personLists(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条教师信息吗？',
        onOk() {
          me.props.dispatch({
            type:'person/deletePerson',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "personType":2,
                    "kw":values.kw||'',
                    "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
                    "jobId":values.jobId||''
                  }
                  me.personLists(params)
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
          "personType":2,
          "kw":values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "jobId":values.jobId||''
        }
        this.personLists(params)
      })
    }
    // 添加/查看
    goToDetail=(type,id)=>{
      if(Number(type)===1){
        this.props.dispatch(routerRedux.push("/teacher-detail?role=2&type="+type))
      }else{
        this.props.form.validateFields((err, values) => {
          let params={
            "page":this.state.page,
            "prePage":this.state.prePage,
            "personType":2,
            "kw":values.kw||'',
            "departmentId":values.departmentId,
            "jobId":values.jobId||''
          }
          sessionStorage.setItem('teacherManageParams',JSON.stringify(params))
        })
        this.props.dispatch(routerRedux.push("/teacher-detail?role=2&type="+type+"&personId="+id))
      }
    }

    toPersonInfo=(id)=>{
        this.props.dispatch(routerRedux.push("/teacher-info-detail?id=" + id))
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-staff?type=1"))
    }
    secondUpload=()=>{
      this.props.dispatch(routerRedux.push("/second-upload-staff?type=1"))
    }
    selectChange=(selectedRowKeys, selectedRows)=>{
      let ids=[];
      selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
        return ids.push(item.personId)
      })
      this.setState({personIds:ids,selectedRowKeys})
    }
    delAll=()=>{
      if(this.state.personIds.length<=0){
        return message.error("请先选择人员",2)
      }
      this.props.dispatch({
        type:'person/delAllPerson',
        payload:{"personId":this.state.personIds},
        callback:(res)=>{
          if(res.code===200){
            message.success('删除成功',2)
            this.setState({selectedRowKeys:[]})
            this.props.form.validateFields((err, values) => {
              const params={
                "page":this.state.page,
                "prePage":this.state.prePage,
                "personType":2,
                "kw":values.kw||'',
                "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
                "jobId":values.jobId||''
              }
              this.personLists(params)
            })
          }
        }
      })
    }
    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })
    // 导出
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let personType = 2;
        let kw=values.kw||'';
        let departmentId = values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length)||'';
        let jobId = values.jobId||'';
        let url=portUrl("/manager/persons/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&personType="+personType+
          "&kw="+kw+"&departmentId="+departmentId+"&jobId="+jobId)
        this.setState({exportUrl:url})
      })
    }
    // 重置
    reset = () => {
      this.props.form.resetFields(["kw", "departmentId", "jobId"])
    }
    render(){
        const columns = [{
            title: '人员ID',
            dataIndex: 'personId',
          },{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
            render:(record)=>{
              return(<span>{formatIdcard(record)}</span>)
            }
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          }, {
            title: '职务',
            dataIndex: 'jobName',
            render:(text, record) => (
              <span>
                {record.jobName&&record.jobName.split(',').length>1?<span>
                <Badge count={record.jobName&&record.jobName.split(',').length} style={{color:'#1890ff',borderColor:'#1890ff',backgroundColor:'#fff',zIndex:'0',marginRight:5}}/>
                <Popover placement="bottom" content={<p>{record.jobName&&record.jobName.split(',').join('|')}</p>} trigger="hover">{record.jobName&&record.jobName.split(',')[0]}</Popover></span>  :
                <span>{record.jobName}</span>
                }
              </span>
            )
          },{
            title: '操作',
            dataIndex: '',
            width: 180,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.personId)}>查看</a>
                {record.isAllowDel==0?null:<a href="javascript:;" onClick={this.showConfirm.bind(this,record.personId)}>删除</a>}
                &nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.toPersonInfo.bind(this, record.personId)}>个人信息</a>
              </span>
            )
          }];
          // rowSelection object indicates the need for row selection
          const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange:this.selectChange,
            getCheckboxProps: record => ({
              disabled: record.isAllowDel==0,
              icCustomerNo:record.icCustomerNo
            }),
          };
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          };

          const {jobList} = this.props;
          let jobData=[];
          jobList&&jobList.length>0&&jobList.map(item=>{
            return jobData.push(<Option value={item.jobId} key={item.jobId}>{item.jobName}</Option>)
          })
          const { teacherList } = this.state;
          if(!teacherList){
            return null;
          }
          let datas=[];
          teacherList&&teacherList.dataList&&teacherList.dataList.map((item,idx)=>{
            datas.push({key:item.personId,...item})
          })
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form teacher-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{initialValue:this.state.kw ? this.state.kw : ''})(
                        <Search placeholder="请输入姓名或证件号" />
                      )}
                    </FormItem>
                  </Col>
                 <Col span={5}>
                    <FormItem {...formItemLayout} label={'部门'}>
                      {getFieldDecorator("departmentId",{initialValue:this.state.departmentId ? this.state.departmentId : ''})(
                        <TreeSelect
                            showSearch
                            dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                        >
                          {this.renderTreeNodes(this.state.treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'职务'}>
                      {getFieldDecorator("jobId",{initialValue:this.state.jobId ? this.state.jobId : ''})(
                        <Select>
                          <Option value="">全部</Option>
                          {jobData}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button onClick={this.reset.bind(this)}>重置</Button>
                  </Col>
                </Row>
                <Row style={{marginBottom:'20px'}}>
                  <Col>
                    <Button type='primary' onClick={this.upload.bind(this)}>导入</Button>&emsp;
                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&emsp;
                    <Button type='primary' onClick={this.delAll.bind(this)}>批量删除</Button>&emsp;
                    <Button type='primary' onClick={this.goToDetail.bind(this, 1)}>添加</Button>&emsp;
                    <Button type='primary' onClick={this.secondUpload.bind(this)}>二次导入</Button>
                  </Col>
                </Row>
              </Form>
              <Table className='content-table' scroll={{ x: 1000 }} rowSelection={rowSelection} columns={columns} dataSource={datas} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={teacherList.totalCount} totalPage={teacherList.totalPage} currentPage={teacherList.currentPage}/>

            </div>
        );
    }

}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    jobList:state.user.commonJobList
  }
}

export default connect(mapStateToProps)(Form.create()(TeacherMange));
