import React,{ Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Dropdown, Menu, Icon, Modal,message } from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import { getQueryString, formatDate} from '../../utils/public';
import { portUrl,getUpload } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class StudentManagement extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          datas:{},
          list:[],
          classOptions:[],
          visible:false,
          confirmLoading:false,
          visible1:false,
          confirmLoading1:false,
          visible2:false,
          visible3:false,
          leaders:[],
          teacherIds:[],
          studentName:'',
          choiceStudentId:'',
          classList:[],
          selectedRowKeys:[],
			    title:"查看",
          


        };
    }
    componentDidMount=()=>{
      let classId = getQueryString("id")
      const params={
        "page":1,
        "prePage":this.state.prePage,
        "classId":classId,
      }
      this.getStudentList(params)
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/class-manage-info"
        },
        })
    } 
    
    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
    }

    // 获取所有班级
    getAllClass=()=>{
      this.props.dispatch({
        type: 'leaveSchoolManage/getAllClass',
        callback: res=>{
          if(res.code === 200){
            this.setState({
              classList: res.data
            })
          }
        }
      })
    }

    // 学生列表
    getStudentList = (params) =>{
      this.props.dispatch({
        type:'leaveSchoolManage/getStudentList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              datas:res.data,
              list:res.data.dataList
            })
          }
        }
      })
    }
    
    // 查询
    search=()=>{
      this.props.form.validateFields(["kw",],(err, values) => {
        let classId = getQueryString("id")
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "classId":classId,
        }
        this.getStudentList(params)
      })
    }
   
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields(["kw"],(err, values) => {
        let classId = getQueryString("id")
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "classId":classId,
        }
        this.getStudentList(params)
      })
    }

    // 新建
    add = () =>{
      this.setState({
        visible:true
      })
    }

    // 点击选择按钮
    choice = () =>{
      this.setState({
        visible1:true,
        visible:false
      })
    }

    // 所有学生列表
    getStudentList = (params) =>{
      this.props.dispatch({
        type:'leaveSchoolManage/getStudentList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              datas:res.data,
              list:res.data.dataList
            })
          }
        }
      })
    }
    
    // 查询
    search1 = ()=>{
      this.props.form.validateFields(["kw",],(err, values) => {
        let classId = getQueryString("id")
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "classId":classId,
        }
        this.getStudentList(params)
      })
    }
   
    // 分页
    onPageChange1 = (current,size) => {
      this.props.form.validateFields(["kw"],(err, values) => {
        let classId = getQueryString("id")
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "classId":classId,
        }
        this.getStudentList(params)
      })
    }
    // 选择项
    onSelectChange = (selectedRowKeys, selectedRows) => {
     let choiceStudentId = selectedRows[0].id;
     
      this.setState({ choiceStudentId,selectedRowKeys});
    }
   
    // 新建确定
    handleOk = () =>{
      this.props.form.validateFields(["name","teacherIds"],(err, values) => {
        const params = {
          "name":values.name,
          "teacherIds":values.teacherIds,
        }
        this.props.dispatch({
          type:'leaveSchoolManage/setResponsibleTeacher',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success("添加成功")
              this.setState({confirmLoading: true,});
                // setTimeout(() => {
                  this.setState({
                    visible: false,
                    confirmLoading: false,
                  });
                // }, 500);
              this.props.form.resetFields(["name","teacherIds"])
              this.search()
              this.getLeaveSchool()
            }
          }
        })
      })
    }
  
    // 新建取消
    handleCancel = () =>{
      this.setState({visible1:false})
    }

    handleOk1 = () => {

    }

    handleCancel1 = () =>{
      this.setState({visible1:false})
    }


    // 删除
    delPerson = (id) =>{
      let classId = getQueryString("id")
      let that = this;
      const params = {
        "classId":classId,
        "personId":id,
      }
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'leaveSchoolManage/delLeaveStudent',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.search()
              }
            }
          })
        },
        onCancel() {},
      });
    }
    
    render(){
      const { datas, list, classList, visible,confirmLoading, visible1, confirmLoading1,classData,selectedRowKeys } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      };
      const formItemLayout1 = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      };
      const columns = [
          {
            title: '姓名',
            dataIndex: 'name',
          },{
            title: '身份证号/其他证件号',
            dataIndex: 'number',
          },{
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span>
                <a href="javascript:;" onClick={this.delPerson.bind(this,record.personId)}>删除</a>&emsp;
              </span>
            )
        }
      ];
      const columns1 = [
        {
          title: '姓名',
          dataIndex: 'personName',
        },{
          title: '班级',
          dataIndex: 'className',
        }
      ];
      const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange(selectedRowKeys, selectedRows)
        },
       
      };
      const { commonPersonData } = this.props
      let teacherOption = []
      let superManageOption = []
      commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item => {
        teacherOption.push(<Option key={item.personId} value={item.personId}>{item.personName}</Option>)
        superManageOption.push(<Option key={item.personId} value={item.personId}>{item.personName}</Option>)
      })
      let options = []
      classList&&classList.length>0&&classList.map(item=>{
        return options.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
      })

      
     
      return (
        <div className="content-main temperature-query">
          <Form>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Search placeholder="负责老师"/>
                  )}
                </FormItem>
              </Col> 
              
              <Col span={10} >
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                {/* <Button onClick={this.add.bind(this)}>添加</Button>&emsp; */}
              </Col>
              
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns} dataSource={list} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={datas.totalCount} totalPage={datas.totalPage} currentPage={datas.currentPage}/> 
          <Modal
            width={600}
            title="添加"
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form>
              <Row gutter={24} >
                <Col span={19} style={{paddingLeft:'23px'}}>
                  <FormItem {...formItemLayout1} label={'学生姓名'}>
                    {getFieldDecorator("name",{initialValue:this.state.studentName || '',rules:[{required:true,message:"请选择学生姓名"}]})(
                      <Input placeholder="学生姓名"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label=''>
                   <Button onClick={this.choice} type="primary">选择</Button>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24} >
                <Col span={20}>
                  <FormItem {...formItemLayout1} label={'身份证号/其他证件号'}>
                    {getFieldDecorator("idCard",{initialValue: this.state.teacherIds || []})(
                     <Input disabled/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
          width={800}
            title="选择学生"
            visible={visible1}
            confirmLoading={confirmLoading1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
          >
            <Form>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Search placeholder="请输入学生姓名"/>
                  )}
                </FormItem>
              </Col> 
              
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator("classId",)(
                    <Select 
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch 
                    placeholder="请输入学生姓名">
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} >
                <Button type='primary' onClick={this.search1.bind(this)}>查询</Button>
              </Col>
              
            </Row>
          </Form> 
          {/* <Table scroll={{ x: 1000 }} columns={columns1} dataSource={classList} pagination={false} rowSelection={rowSelection}/>
          <PageIndex getPage={this.onPageChange1.bind(this)} total={classData.totalCount} totalPage={classData.totalPage} currentPage={classData.currentPage}/> */}
          </Modal>
          
        </div>
      );
    }
  
}

const mapStateToProps = (state) => {
  return {
    commonPersonData:state.user.commonPersonData,
  }
}

export default connect(mapStateToProps)(Form.create()(StudentManagement));
