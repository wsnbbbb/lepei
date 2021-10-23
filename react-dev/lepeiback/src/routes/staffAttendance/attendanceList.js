import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, DatePicker,TimePicker , Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect,Calendar, Badge } from 'antd';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
import moment from 'moment';
import { portUrl, getUpload } from '../../utils/img';
import { toTimestamp, assetStatus,onlyDate } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const format = 'HH:mm';
class AttendanceList extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        attendList:{},
        detailList:[],
        exportUrl:'',
        date:moment().format('YYYY-MM-DD'),
        visible:false,
        confirmLoading:false,
        visible1:false,
        confirmLoading1:false,
        leavesRecords:[],
      };
  }
  componentDidMount=()=>{
      const params = {
        "page":1,
        "prePage":20,
        "date":this.state.date,
      }
      this.staffAttendList(params)
  }
  // 获取教职工考勤列表
  staffAttendList = (params) =>{
    this.props.dispatch({
      type:'staffAttendance/staffAttendList',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            attendList:res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }
  // 获取个人考勤
  personAttendance = (params) =>{
    this.props.dispatch({
      type:'staffAttendance/personAttendance',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          res.data.attends.map(item =>{
            if(item.date == this.state.date){
              this.setState({queryDate:item.date})
            }
          })
          if(res.data.personName){
            this.setState({
              attends:res.data.attends
            })
          }else{
            confirm({
              title: '提示',
              content: <span>未查询到相关信息</span>,
              onCancel() {},
            });
            this.setState({
              attends:[]
            })
          }
        }
      }
    })
  }
 
  // 日期
  onTimeChange = (date, dateString) => {
    this.setState({date:dateString})
  }
  // 查询
  search=()=>{
    this.props.form.validateFields(["kw","date","status","isLeave","isOverTime"],(err, values) => {
      let params
      if(values.kw){
        params = {
        "kw":values.kw,
        "date": this.state.date,
        "status": values.status||'',
        "isLeave": values.isLeave||'',
        "isOverTime": values.isOverTime||'',
        }
        this.personAttendance(params)
      }else{
        params={
          "page":1,
          "prePage":this.state.prePage,
          "date": this.state.date,
          "status": values.status||'',
          "isLeave": values.isLeave||'',
          "isOverTime": values.isOverTime||'',
        }
        this.setState({attends:undefined})
        this.staffAttendList(params)
      }
    })
  }
  // 分页
  onPageChange = (current,size) =>{
    this.props.form.validateFields(["date","status","isLeave","isOverTime"],(err,values) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "date": this.state.date,
          "status": values.status||'',
          "isLeave": values.isLeave||'',
          "isOverTime": values.isOverTime||'',
        }
        this.staffAttendList(params)
    })
  }
  
  // 导出
  export=()=>{
    this.props.form.validateFields(["kw","date","status","isLeave","isOverTime"],(err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let kw = values.kw||'';
      let date = this.state.date;
      let url=portUrl("/manager/teacher-attend-records/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+"&date="+date)
      this.setState({exportUrl:url})
    })
  }
 
  // 上下班时间设置
  timeSet = () =>{
    this.props.dispatch({
      type:'staffAttendance/attendanceTime',
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            startTime:res.data.startTime,
            endTime:res.data.endTime,
            overTime:res.data.overTime,
          })
        }
      }
    })
    this.setState({visible:true})
  }
  handleOk = () =>{
    this.props.form.validateFields(["startTime","endTime","overTime"],(err, values) => {
      if(!err){
        const params = {
          "startTime":this.state.startTime,
          "endTime":this.state.endTime,
          "overTime":this.state.overTime||'',
        }
        this.props.dispatch({
          type:'staffAttendance/setAttendance',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("上下班时间设置成功")
              this.setState({
                confirmLoading: true,
              })
              setTimeout(() => {
                this.setState({
                  visible: false,
                  confirmLoading: false,
                });
              }, 500);
              this.search()
            }
          }
        })
      }
    })
  }
  handleCancel = () =>{
    this.setState({visible:false})
  }
  // 上午时间
  changeAm = (time, timeString) =>{
    this.setState({startTime:timeString})
  }
  // 下午时间
  changePm = (time, timeString) =>{
    this.setState({endTime:timeString})
  }
  // 加班时间
  setOverTime = (time, timeString) =>{
    this.setState({overTime:timeString})
  }
  // 详情
  attendanceRecord = (id) =>{
    const params = {
      "personId":id,
      "date":this.state.date
    }
    this.props.dispatch({
      type:'staffAttendance/attendanceRecord',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            visible1:true,
            personName:res.data.personName,
            firstTime:res.data.firstTime,
            lastTime:res.data.lastTime,
            late:res.data.late,
            leave:res.data.leave,
            overTime:res.data.overTime,
            leavesRecords:res.data.leavesRecords
          })
        }
      }
    })
  }

  handleCancel1 = () =>{
    this.setState({visible1:false})
  }

  // 个人考勤
  getListData = (value) =>{
    let listData;
    for (let i = 0; i < this.state.attends.length; i++) {
      let date = this.state.attends[i].date.split("-");
      if(value.month()+1 == date[1]){
        if (value.date() == date[2]){
          listData = this.state.attends[i]
        }
      }
    }
    return listData || {};
  }
  dateCellRender = (value) =>{
    const listData = this.getListData(value);
    return (
        <div style={{textAlign:"center"}}>
         <p style={{color:listData.signInStatus != 0?"#f00":''}}>{listData.signIn}</p>
         <p style={{color:listData.signOffStatus != 0?"#f00":''}}>{listData.signOff}</p>
         {listData.overTime?<p className="tagStyle overTime-style" style={{margin:"0 auto"}}>{listData.overTime}</p>:null}
         {listData.leaveStatus == 1?<p className="tagStyle leave-style" style={{margin:"5px auto"}}>请假</p>:null}
        </div>
    );
  }
  
  render(){
    const { attendList, detailList,visible,confirmLoading,visible1,confirmLoading1,personName,firstTime,lastTime,late,leave,overTime,leavesRecords,
      attends ,startTime,endTime} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span:5 },
      wrapperCol: { span: 19 }
    };
    const formItemLayout1 = {
      labelCol: { span:7 },
      wrapperCol: { span: 17 }
    };
    const formItemLayout2 = {
      labelCol: { span:9 },
      wrapperCol: { span: 15 }
    };
    let timestamp = (new Date()).getTime();
    
    const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      },{
        title: '签到',
        dataIndex: '',
        render:(record)=>(
          <span style={{color:record.signInStatus == 0?'#000':'#f00'}}>{record.signIn}</span>
        )
      },{
        title: '签退',
        dataIndex: '',
        render:(record)=>(
          <span style={{color:record.signOffStatus == 0?'#000':'#f00'}}>{record.signOff}</span>
        )
      },{
        title: '加班',
        width:250,
        dataIndex: 'overTime',
        render:(record)=>(
          record?<div className="tagStyle overTime-style">{record}</div>:null
        )
      },{
        title: '请假',
        width:250,
        dataIndex: 'leaveStatus',
        render:(record)=>(
          record == 1?<div className="tagStyle leave-style">请假</div>:null
        )
      },{
        title: '操作',
        dataIndex: '',
        width:150,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.attendanceRecord.bind(this,record.personId)}>详情</a>
          </span>
        )
      }
    ]
    
    // function getMonthData(value) {
    //   if (value.month() === 8) {
    //     return 1394;
    //   }
    // }
    // function monthCellRender(value) {
    //   const num = getMonthData(value);
    //   return num ? (
    //     <div className="notes-month">
    //       <section>{num}</section>
    //       <span>Backlog number</span>
    //     </div>
    //   ) : null;
    // }
    
    return (
      <div className="content-main attendance-list">
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={4}>
                <FormItem>
                {getFieldDecorator('kw')(
                  <Search placeholder="请输入姓名"/>
                )}
                </FormItem>
            </Col> 
            <Col span={4}>
              <FormItem {...formItemLayout1} label='签到签退'>
                {getFieldDecorator("status",{initialValue:0})(
                  <Select >
                      <Option value={0} key={0}>全部</Option>
                      <Option value={1} key={1}>未签到</Option>
                      <Option value={2} key={2}>未签退</Option>
                  </Select>
                )}  
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label='加班'>
                {getFieldDecorator("isOverTime",{initialValue:0})(
                  <Select >
                    <Option value={0}>全部</Option>
                    <Option value={1}>加班</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label='请假'>
                {getFieldDecorator("isLeave",{initialValue:0})(
                  <Select >
                    <Option value={0}>全部</Option>
                    <Option value={1}>请假</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} >
                <FormItem {...formItemLayout} label='日期'>
                  {getFieldDecorator("date",{initialValue:moment(timestamp)})(
                      <DatePicker onChange={this.onTimeChange} />
                  )}
                </FormItem>
            </Col>
            <Col span={4} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={
                <Menu>
                  <Menu.Item>
                      <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.timeSet.bind(this)}>上下班时间设置</a>
                  </Menu.Item>
                  <Menu.Item>
                      <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                  </Menu.Item>
                </Menu>
              }>
                <a href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
              </Dropdown>
            </Col>
          </Row>
        </Form>
        {
          attends?<div className="attendance-sheet">
            <Calendar dateCellRender={this.dateCellRender}  value={moment(this.state.queryDate, 'YYYY-MM-DD')}/>,
          </div>:
          <div>
            <Table  columns={columns} dataSource={detailList} pagination={false} />
            <PageIndex getPage={this.onPageChange.bind(this)} total={attendList.totalCount} totalPage={attendList.totalPage} currentPage={attendList.currentPage}/>
          </div>
        }
        <Modal
        width={600}
        title="上下班时间设置"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
          <Form>
            <Row gutter={24} >
              <Col span={12} offset={2} style={{paddingRight:0}}>
                <FormItem {...formItemLayout2} label={'上午时间'}>
                  {getFieldDecorator("startTime",{initialValue:startTime?moment(startTime, format):undefined,rules:[{required:true,message:"请选择上午时间"}]})(
                    <TimePicker onChange={this.changeAm.bind(this)} format={format} />
                  )}
                  <span style={{marginLeft:"10px"}}>----</span>
                </FormItem>
              </Col>
              <Col span={8} style={{paddingLeft:0}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator("startTimeEnd",{initialValue:moment('12:00', format)})(
                    <TimePicker format={format} disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={12} offset={2} style={{paddingRight:0}}>
                <FormItem {...formItemLayout2} label={'下午时间'}>
                  {getFieldDecorator("endTimeStart",{initialValue:moment('12:00', format),rules:[{required:true,message:"请选择下午时间"}]})(
                    <TimePicker format={format} disabled/>
                  )}
                  <span style={{marginLeft:"10px"}}>----</span>
                </FormItem>
              </Col>
              <Col span={8} style={{paddingLeft:0}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator("endTime",{initialValue:endTime?moment(endTime, format):undefined,rules:[{required:true,message:"请选择下午时间"}]})(
                    <TimePicker format={format} onChange={this.changePm.bind(this)}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={12} offset={2} style={{paddingRight:0}}>
                <FormItem {...formItemLayout2} label={'加班时间'}>
                  {getFieldDecorator("overTime",{initialValue:overTime?moment(overTime, format):undefined})(
                    <TimePicker onChange={this.setOverTime.bind(this)} format={format} />
                  )}
                  <span style={{marginLeft:"10px"}}>----</span>
                </FormItem>
              </Col>
              <Col span={8} style={{paddingLeft:0}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator("endOverTime",{initialValue:moment('00:00', format)})(
                    <TimePicker format={format} disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
        width={600}
        title="详情"
        visible={visible1}
        confirmLoading={confirmLoading1}
        onCancel={this.handleCancel1}
        className="attendance-detail-modal"
        footer={<Button type="primary" onClick={this.handleCancel1}>返回</Button>}
        >
          <div>
            <h4 className="title">{personName}</h4>
            <Row gutter={24} className="item-style">
              <Col span={5}>首次打卡</Col>
              <Col span={19}> {firstTime?firstTime:"-"} </Col>
            </Row>
            <Row gutter={24} className="item-style">
              <Col span={5}>末次打卡</Col>
              <Col span={19}> {lastTime?lastTime:"-"} </Col>
            </Row>
            {
              late?
              <Row gutter={24} className="item-style">
                <Col span={5}>迟到</Col>
                <Col span={19}>{late} </Col>
              </Row>:null
            }
            {
              leave?
              <Row gutter={24} className="item-style">
                <Col span={5}>早退</Col>
                <Col span={19}>{leave} </Col>
              </Row>:null
            }
            {
              overTime?
              <Row gutter={24} className="item-style">
                <Col span={5}>加班</Col>
                <Col span={19}>{overTime} </Col>
              </Row>:null
            }
            {leavesRecords&&leavesRecords.map((item,index) =>{
              return <div key={index}>
                  <Row gutter={24} className="item-style">
                    <Col span={5}>请假类型</Col>
                    <Col span={19}> {item.typeName}</Col>
                  </Row>
                  <Row gutter={24} className="item-style">
                    <Col span={5}>请假开始</Col>
                    <Col span={19}>{item.startTime} </Col>
                  </Row>
                  <Row gutter={24} className="item-style">
                    <Col span={5}>请假结束</Col>
                    <Col span={19}>{item.endTime} </Col>
                  </Row>
                  <Row gutter={24} className="item-style">
                    <Col span={5}>请假原因</Col>
                    <Col span={19}>{item.reason} </Col>
                  </Row>
                </div>
              })
            }
            
          </div>
        </Modal>
      </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(AttendanceList));
