import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Tooltip,Select,Divider, Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import {Encrypt, Decrypt} from '../../utils/secret'
import copy from 'copy-to-clipboard';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, dateToTimestamp, formatDate, isBlank} from '../../utils/public';
import { portUrl, questionUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class QuestionnaireList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false,
          list: [],
          exportUrl: ''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getQuestionnaireList(params)
     
    }
    getQuestionnaireList=(params)=>{
      this.props.dispatch({
        type:'questionnaire/getQuestionnaireList',
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
    showModal = () => {
      this.setState({
        visible: true,
        userName:'',
        realName:'',
        password:'',
        checkPassword:'',
      });
    }
    toDetail = (id) => {
      this.props.dispatch(
        routerRedux.push("/edit-questionnaire/" + id)
      )
    }
    //添加账户
    handleOk = () => {
      const {password,controlBtn,startDate,endDate} = this.state;
      console.log(startDate,endDate)
          if(isBlank(this.state.userName)||isBlank(this.state.password)||isBlank(this.state.checkPassword)){
            message.warning("信息输入不完整！")
            return
          }
          if(md5(this.state.password)!==md5(this.state.checkPassword)){
            message.warning("密码输入不一致！")
            return
          }
          this.props.dispatch({
            type:'setting/addAccount',
            payload:{
              "userName": this.state.userName,
              "realName": this.state.realName,
              "password": md5(this.state.password),
              "checkPassword": md5(this.state.checkPassword)
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('创建成功！',3)
                // this.props.form.resetFields();
                this.setState({
                  visible: false,
                  "userName": '',
                  "realName": '',
                  "password": '',
                  "checkPassword": ''
                });
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  // "kw":values.kw||'',
                  // "status":values.status||''
                }
                this.getQuestionnaireList(params)
              }
              // this.setState({controlBtn:false})
            }
          })
        // }
      // })
    }
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
      });
    }
    // onTimeChange=(date, dateString)=>{
    //   const start=dateString[0]+" 00:00:00";
    //   const end=dateString[1]+" 23:59:59";
    //   this.setState({
    //     attendTime:start+' ~ '+end
    //   })
    // }
    onChangeRange=(date, dateString)=>{
      this.setState({
          startTime: dateToTimestamp(dateString[0]),
          endTime: dateToTimestamp(dateString[1])
      })
      console.log(dateString)
    }
    export=(id)=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let url=portUrl("/manager/questionnaire/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&id="+id)
        this.setState({exportUrl:url})
    }
    // onTimeChange=(date,dateString)=> {
    //   this.setState({
    //     startDate:dateString[0],
    //     endDate:dateString[1]
    //   })
    // }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "channel": values.channel||'',
          "startTime": this.state.startTime||'',
          "endTime": this.state.endTime||''
        }
        this.getQuestionnaireList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type: 'questionnaire/deleteQuestionnaire',
            payload: {"id": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "channel": values.channel||'',
                    "startTime": me.state.startTime||'',
                    "endTime": me.state.endTime||''
                  }
                  me.getQuestionnaireList(params)
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
          "kw": values.kw||'',
          "channel": values.channel||'',
          "startTime": this.state.startTime||'',
          "endTime": this.state.endTime||''
        }
        this.getQuestionnaireList(params)
      })
    }
    toAdd = () => {
      this.props.dispatch(
        routerRedux.push("/new-questionnaire")
      )
    }
    copy = () => {
      if(copy(`${questionUrl}?id=${Encrypt(sessionStorage.getItem("schoolId"))}`)){
          console.log("复制成功");
          message.success("复制成功")
          console.log(Encrypt(sessionStorage.getItem("schoolId")))
      }else{
          console.log("复制失败")
      }
    }
    onChange1 = (e)=>{
      this.setState({
        userName: e.target.value
      })
    }
    onChange2 = (e)=>{
      this.setState({
        realName: e.target.value
      })
    }
    onChange3 = (e)=>{
      this.setState({
        password: e.target.value
      })
    }
    onChange4 = (e)=>{
      this.setState({
        checkPassword: e.target.value
      })
    }
    render(){

        const {list} = this.state;
 
        const columns = [{
            title: '问卷名称',
            dataIndex: 'title',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="grade-content">{record}</span>
            </Tooltip>)
            }
          }, {
            title: '采集渠道',
            dataIndex: 'channel',
          }, {
            title: '发布人',
            dataIndex: 'publisherName',
          }, {
            title: '样本数量',
            dataIndex: 'recordsCount',
          },{
            title: '截止时间',
            dataIndex: 'endTime',
          },{
            title: '操作',
            dataIndex: '',
            width:200,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this,record.id)}>编辑</a> <Divider type="vertical" />
                <a href={this.state.exportUrl} onClick={this.export.bind(this, record.id)}>导出结果</a><Divider type="vertical" />
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this, record.id)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout1 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20}
          };
        return (
            <div className="content-main questionnaire">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Input placeholder="请输入问卷调查名称" />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'采集渠道'}>
                      {getFieldDecorator("channel",{initialValue:'0'})(
                        <Select>
                          <Option value="0">全部</Option>
                          <Option value="1">家长端</Option>
                          <Option value="2">教师端</Option>
                          {/* <Option value="3">班牌端</Option> */}
                          <Option value="4">H5</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} >
                      <FormItem {...formItemLayout1} label={''}>
                        {getFieldDecorator("time", {})(
                           <RangePicker style={{ width: 380 }}
                           showTime={{ format: 'HH:mm:ss' }}
                           format="YYYY-MM-DD HH:mm:ss"
                           placeholder={['开始时间', '结束时间']}
                           onChange={this.onChangeRange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={6} offset={2}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                        <Button onClick={this.toAdd.bind(this)}>添加</Button>&nbsp;&nbsp;
                        <Button onClick={this.copy.bind(this)}>H5链接</Button>
           
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // accountList:state.setting.accountData
  }
}

export default connect(mapStateToProps)(Form.create()(QuestionnaireList));
