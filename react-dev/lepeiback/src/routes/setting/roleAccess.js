import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Select,Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class roleAccess extends Component{
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
        "type": 1
      }
      this.accessList(params)
      this.getjobList();
    }
    accessList=(params)=>{
      this.props.dispatch({
        type:'setting/accessList',
        payload: params
      })
    }
    getjobList=()=>{
      this.props.dispatch({
        type:'setting/getjobList',
        payload: {}
      })
    }
    showModal = () => {
      this.props.form.resetFields();
      this.setState({
        visible: true,
        userName:'',
        realName:'',
        password:'',
        checkPassword:'',
      });
    }
    toDetail = (jobId) => {
      this.props.dispatch(
        routerRedux.push("/access-detail/" + jobId)
      )
    }
    addJob = () => {
      this.props.dispatch(
        routerRedux.push("/job-detail?type=1")
      )
    }
    //添加年级
    handleOk = () => {
      // this.setState({controlBtn:true})
      const {password,controlBtn,startDate,endDate} = this.state;
      console.log(startDate,endDate)
      this.props.form.validateFields((err, values) => {
        // if(!password||!endDate){
        //   return message.error('请选择时间',2)
        // }
        if(!err){
          this.props.dispatch({
            type:'setting/addAccount',
            payload:{
              "userName": values.userName,
              "realName": this.state.realName,
              "password": md5(this.state.password),
              "checkPassword": md5(this.state.checkPassword)
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('创建成功！',3)
                this.props.form.resetFields();
                this.setState({
                  visible: false,controlBtn:true
                });
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  "kw":values.kw||'',
                  "status":values.status||'',
                  "type": 1
                }
                this.accessList(params)
              }
              this.setState({controlBtn:false})
            }
          })
        }
      })
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
          "kw":values.job||'',
          "status":values.status||'',
          "type": 1
        }
        this.accessList(params)
      })
    }
  
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.job||'',
          "status":values.status||'',
          "type": 1
        }
        this.accessList(params)
      })
    }
    render(){
        const {accessList, jobList} = this.props;
        const {userName,realName,password,checkPassword} = this.state;
        const jobOption = jobList&&jobList.map((item)=>{
          return <Option value={item.jobName} key={item.jobId}>{item.jobName}</Option>
        })
        if(!accessList){
          return null;
        }
        const columns = [{
            title: '职务名称',
            dataIndex: 'jobName',
          }, {
            title: '功能权限',
            dataIndex: 'accessCount',
            render:(record)=>{
              return record==0 ? <span>无</span> : <span>{record}个权限</span>
          }
          }, {
            title: '数据权限',
            dataIndex: 'dataAuthType',
            render:(record)=>{
                if(record==0) return "无"
                if(record==1) return "全校"
                if(record==2) return "年级"
                if(record==3) return "班级"
            }
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
              return record==1 ? <span>启用</span> : <span className="red">禁用</span>
          }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
               <span>
                <a href="javascript:;" onClick={this.toDetail.bind(this,record.jobId)}>授权</a>
               </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={5}>
                  <FormItem {...formItemLayout} label={'职务名称'}>
                      {getFieldDecorator("job",{initialValue:''})(
                        <Select>
                          <Option value="" key="">全部</Option>
                          {jobOption}
                        </Select>
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
                        <Button onClick={this.addJob}>添加职务</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={accessList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={accessList.totalCount} totalPage={accessList.totalPage} currentPage={accessList.currentPage}/>
             
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    accessList:state.setting.accessData,
    jobList:state.setting.jobData,
  }
}

export default connect(mapStateToProps)(Form.create()(roleAccess));
