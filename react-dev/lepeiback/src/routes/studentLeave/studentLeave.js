import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Radio,Divider,Tooltip as Atooltip, Menu, Dropdown,Icon,Breadcrumb,Tabs,message,Modal,DatePicker,InputNumber } from 'antd';
import { portUrl } from '../../utils/img'
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate, toTimestamp} from '../../utils/public';
import './style.less';
import { Chart, Tooltip, Axis, Bar, Legend, Coord, Guide, Pie, Line, Point } from 'viser-react';
// import { DataSet } from 'antv/data-set';
const DataSet = require('@antv/data-set');

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class studentLeave extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          applyPerson: '',
          gradeId: "0",
          gradeId1: "0",
          classId: "0",
          classId1: "0",
          typeId: "0",
          status: "5",
          leaveData: undefined,
          grahpData1: [],
          grahpData2: [],
          radioGroup: 6,
          date: [],
          date1: [],
          visible: false,
          exportUrl:'',
          applyType: ''
        };
    }
    componentDidMount=()=>{
      this.getGrade();
      this.getGrade1();
      this.getType();
      const params={
        "page": 1,
        "prePage": 20
      }
      this.init(params);
      this.check();
    }

    getGrade = ()=>{
      this.props.dispatch({
        type:'studentLeave/commonGradeList'
      })
    }

    getClass = (params)=>{
      this.props.dispatch({
        type:'studentLeave/getClassesByGradeId',
        payload: params
      })
    }

    getGrade1 = ()=>{
      this.props.dispatch({
        type:'studentLeave/commonGradeList1'
      })
    }

    getClass1 = (params)=>{
      this.props.dispatch({
        type:'studentLeave/getClassesByGradeId1',
        payload: params
      })
    }

    getType = ()=>{
      this.props.dispatch({
        type:'studentLeave/studenLeaveType'
      })
    }

    recordsStatistics = (params)=>{
      this.props.dispatch({
        type:'studentLeave/recordsStatistics',
        payload: params,
        callback: (res)=>{
          if(res.code==200){
            var arr=[]
            res.data&&res.data.map(item=>{
              let timeArr = item.time.split("-")
              let str = timeArr[0]+"年"+timeArr[1]+"月"
              if(!!timeArr[2]){
                str+=timeArr[2]+"日"
              }
              arr.push({
                "次数": item.count,
                "time": str
              })
            })
            this.setState({
              "grahpData1": arr
            })
          }
          
        }
      })
    }
    
    recordsTypeStatistics = (params)=>{
      this.props.dispatch({
        type:'studentLeave/recordsTypeStatistics',
        payload: params,
        callback: (res)=>{
          this.setState({
            "grahpData2": res.data
          })
        }
      })
    }

    check = ()=>{
      if(this.state.radioGroup === 9){
        if(this.state.date1.length == 0|| this.state.date1[0]==''|| this.state.date1[1]==''){
          message.warning("请选择时间！")
          return
        }
      }
      const params={
        "quickSearch": this.state.radioGroup==9?"0":this.state.radioGroup,
        "classId": this.state.classId1||'',
        "gradeId": this.state.gradeId1||'',
        "startTime": this.state.radioGroup==9?toTimestamp(this.state.date1[0], true):'',
        "endTime": this.state.radioGroup==9?toTimestamp(this.state.date1[1]):'',
      }
      this.recordsStatistics(params);
      this.recordsTypeStatistics(params);
      this.setState({
        visible: true
      })
    }

    init = (params)=>{
      this.props.dispatch({
        type:'studentLeave/studentLeaveList',
        payload: params,
        callback: (res)=>{
          res.data.dataList.map((item)=>{
            item.key=item.id
          })
          this.setState({
            "leaveData": res.data
          })
        }
      })
    }

    search = ()=>{
      const params={
        "page": 1,
        "prePage": 20,
        "kw": this.state.applyPerson||"",
        "gradeId": this.state.gradeId!="0"?(!!this.state.gradeId?this.state.gradeId:""):"",
        "classId": this.state.classId!="0"?(!!this.state.classId?this.state.classId:""):"",
        "applyType": this.state.applyType||"",
        "typeId": this.state.typeId!=0?this.state.typeId:"",
        "status": this.state.status!="5"?this.state.status:"",
        "startTime": toTimestamp(this.state.date[0], true)||"",
        "endTime": toTimestamp(this.state.date[1])||"",
      }
      this.props.dispatch({
        type:'studentLeave/studentLeaveList',
        payload: params,
        callback: (res)=>{
          res.data.dataList.map((item)=>{
            item.key=item.id
          })
          this.setState({
            "leaveData": res.data
          })
        }
      })
    }
   
    onPageChange=(current,size)=>{
        this.setState({
          page:current,
          prePage:size
        })
        const params={
          "page":current,
          "prePage":size,
          "kw": this.state.applyPerson||"",
          "gradeId": this.state.gradeId!="0"?(!!this.state.gradeId?this.state.gradeId:""):"",
          "classId": this.state.classId!="0"?(!!this.state.classId?this.state.classId:""):"",
          "applyType": this.state.applyType||"",
          "typeId": this.state.typeId!=0?this.state.typeId:"",
          "status": this.state.status!="5"?this.state.status:"",
          "startTime": toTimestamp(this.state.date[0], true)||"",
          "endTime": toTimestamp(this.state.date[1])||"",
        }
        this.init(params)
    }

    onChange1 = (e) =>{
      this.setState({
        applyPerson: e.target.value
      })
    }

    onChange2 = (value) =>{
      console.log(value)
      this.setState({
        classId: undefined,
        gradeId: value
      })
      if(value=="0") return
      const params={
        gradeId: value
      }
      this.getClass(params)
    }

    onChange3 = (value) =>{
      console.log(value)
      this.setState({
        classId: value
      })
    }

    onChange11 = (value) =>{
      console.log(value)
      this.setState({
        applyType: value
      })
    }


    onChange4 = (value) =>{
      console.log(value)
      this.setState({
        typeId: value
      })
    }
    onChange5 = (value) =>{
      console.log(value)
      this.setState({
        status: value
      })
    }

    onChange6 = (date, dateString) =>{
      console.log(date, dateString);
      this.setState({
        date: dateString
      })
    }

    onChange7 =(date, dateString) =>{
      console.log(date, dateString);
      this.setState({
        date1: dateString
      }) 
    }
    onChange8 = (value) =>{
      console.log(value)
      this.setState({
        gradeId1: value,
        classId1: undefined
      })
      if(value=="0") return
      const params={
        gradeId: value
      }
      this.getClass1(params)
    }
    onChange9 = (value) =>{
      console.log(value)
      this.setState({
        classId1: value
      })
    }
    onChange10 = (e) =>{
      console.log(e.target.value)
      // if(e.target.value!=9){
      //   this.setState({
      //     date1: []
      //   })
      // }
      this.setState({
        radioGroup: e.target.value
      })
    }

    showConfirm = (id)=>{
      console.log(id)
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'studentLeave/deleteLeaveRecord',
            payload:{"id": id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                  me.search()
              }
            }
          })
        },
        onCancel() {},
      });
    }

    toDetail = (id) =>{
      console.log(id);
      this.props.dispatch(
        routerRedux.push("/student-leave-detail/" + id)
      )
    }

    renderStatus = (status)=>{
      if(status==0){
        return <span className="status-0">取消申请</span>
      }else if(status==1){
        return <span className="status-1">待审批</span>
      }else if(status==2){
        return <span className="status-2">审批中</span>
      }else if(status==3){
        return <span className="status-3">通过</span>
      }else if(status==4){
        return <span className="status-4">未通过</span>
      }
    }
     // 导出
     export=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw = this.state.applyPerson||"";
        let gradeId = this.state.gradeId!="0"?(!!this.state.gradeId?this.state.gradeId:""):"";
        let classId = this.state.classId!="0"?(!!this.state.classId?this.state.classId:""):"";
        let typeId = this.state.typeId!=0?this.state.typeId:"";
        let applyType = this.state.applyType||"";
        let status = this.state.status!="5"?this.state.status:"";
        let startTime = toTimestamp(this.state.date[0], true)||"";
        let endTime = toTimestamp(this.state.date[1])||"";
        let url=portUrl("/manager/student-leave/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+
          "&gradeId="+gradeId+"&classId="+classId+"&typeId="+typeId+"&applyType="+applyType+"&status="+status+"&startTime="+startTime+"&endTime="+endTime)
        this.setState({exportUrl:url})
       
    }
   
    render(){
      const {gradesData, classesList, leaveTypeList, leaveData, gradesData1, classesList1 } = this.props

      const options1 = gradesData&&gradesData.map((item)=>{
        return <Option key={item.gradeId}>{item.gradeName}</Option>
      })
      const options2 = classesList&&classesList.map((item)=>{
        return <Option key={item.classId}>{item.className}</Option>
      })
      const options3 = leaveTypeList&&leaveTypeList.map((item)=>{
        return <Option key={item.typeId}>{item.typeName}</Option>
      })
      const options4 = gradesData1&&gradesData1.map((item)=>{
        return <Option key={item.gradeId}>{item.gradeName}</Option>
      })
      const options5 = classesList1&&classesList1.map((item)=>{
        return <Option key={item.classId}>{item.className}</Option>
      })

      // const data = [
      //   { time: '2019年4月5号', value: 3 },
      //   { time: '2019年5月6号', value: 4 },
      //   // { year: '1993', value: 3.5 },
      //   // { year: '1994', value: 5 },
      //   // { year: '1995', value: 4.9 },
      //   // { year: '1996', value: 6 },
      //   // { year: '1997', value: 7 },
      //   // { year: '1998', value: 9 },
      //   // { year: '1999', value: 13 },
      // ];
      const data = this.state.grahpData1
      console.log(data)
      const scale = [{
        dataKey: 'value',
        tickInterval: 5,
      }];

      // const sourceData = [
      //   { item: '事例一', count: 40 },
      //   { item: '事例二', count: 21 },
      //   { item: '事例三', count: 17 },
      //   { item: '事例四', count: 13 },
      //   { item: '事例五', count: 9 }
      // ];
      // const sourceData = [{"typeId":"1","typeName":"病假","count":4},{"typeId":"11","typeName":"病2假","count":45}]
      const sourceData = this.state.grahpData2
      const scale1 = [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%',
      }];
      
      const dv = new DataSet.View().source(sourceData);
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'typeName',
        as: 'percent'
      });
      const data1 = dv.rows;

      const menu = (
        <Menu>
          <Menu.Item>
            <Link to="type-manage">请假类型管理</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="approver-setting">审批人设置</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="relateEntry-setting">联动门禁设置</Link>
          </Menu.Item>
          {/* <Menu.Item>
            <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.gangedEntry.bind(this)}>联动门禁设置</a>
          </Menu.Item> */}
          <Menu.Item>
            <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
          </Menu.Item>
        </Menu>
      );

        const columns = [{
            title: '发起人',
            dataIndex: 'applyType',
            key: 'applyType',
            render: (record)=>{
              return <span>{(record==1?"家长":"教师")}</span>
            }
          },
          {
          title: '请假人员',
          dataIndex: 'studentName',
          key: 'studentName',
        }, {
          title: '年级',
          dataIndex: 'gradeName',
          key: 'gradeName',
        }, {
          title: '班级',
          dataIndex: 'className',
          key: 'className',
        }, {
          title: '请假类型',
          dataIndex: 'typeName',
          key: 'typeName',
        }, {
          title: '请假天数',
          dataIndex: 'days',
          key: 'days',
          render: (record)=>{
            return <span>
                      {parseFloat(record)}&nbsp;&nbsp;天
                   </span>
          }
        }, {
          title: '审批状态',
          dataIndex: 'status',
          key: 'status',
          render: (record)=>{
            return <span>
                      {this.renderStatus(record)}
                   </span>
          }
        },{
          title: '申请时间',
          key: 'applyTime',
          dataIndex: 'applyTime',
          render: (record)=>{
            return <span>
                      {formatDate(record)}
                   </span>
          }
        }, {
          title: '请假原因',
          key: 'reason',
          dataIndex: 'reason',
          render:(record)=>{
            return(
               <Atooltip placement="top" title={record}>
               <span className="reason-content">{record}</span>
             </Atooltip>
            )
          }

        }, {
          title: '操作',
          key: 'id',
          dataIndex: 'id',
          render: (record) => (
            <span>
              <a href="javascript:;" onClick={this.toDetail.bind(this, record)}>查看</a>
              <Divider type="vertical" />
              <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this, record)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
              </Dropdown>
            </span>
          ),
        }];
       
        return (
            <div className="content-main student-leave">
              <div className="breadcrumb">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-leave">学生请假管理</Link></Breadcrumb.Item>
                    </Breadcrumb> */}
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane tab="明细" key="1">
                <Row>
                  <Input placeholder="请输入申请人" maxLength={30} value={this.state.applyPerson} onChange={this.onChange1.bind(this)} style={{ width: 200 }}  />
                  &nbsp;&nbsp;&nbsp;&nbsp;年级：
                  <Select style={{ width: 120 }} value={this.state.gradeId} placeholder="请选择年级" onChange={this.onChange2.bind(this)}>
                    <Option value="0">全部</Option>
                    {options1}
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;班级：
                  <Select value={this.state.classId} style={{ width: 120 }} placeholder="请选择班级" onChange={this.onChange3.bind(this)}>
                    <Option value="0">全部</Option>
                    {options2}
                  </Select>  
                </Row>
                <Row className="select-row">
                  发起人：
                  <Select  value={this.state.applyType} placeholder="请选择发起人" style={{ width: 120 }} onChange={this.onChange11.bind(this)}>
                    <Option value="">全部</Option>
                    <Option value="1">家长</Option>
                    <Option value="2">教师</Option>
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  请假类型：
                  <Select  value={this.state.typeId} placeholder="请选择请假类型" style={{ width: 120 }} onChange={this.onChange4.bind(this)}>
                    <Option value="0">全部</Option>
                    {options3}
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;审批状态：
                  <Select value={this.state.status} placeholder="请选择状态" style={{ width: 120 }} onChange={this.onChange5.bind(this)}>
                    <Option value="5">全部</Option>
                    <Option value="0">取消申请</Option>
                    <Option value="1">待审批</Option>
                    <Option value="2">审批中</Option>
                    <Option value="3">通过</Option>
                    <Option value="4">未通过</Option>
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <RangePicker onChange={this.onChange6.bind(this)} />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={this.search.bind(this)} >查询</Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="javascript:;">
                      展开<Icon type="down" />
                    </a>
                  </Dropdown>
                </Row>

                <Row className="table-content">
                  <Table columns={columns} pagination={false} dataSource={this.state.leaveData&&this.state.leaveData.dataList} />
                  <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.leaveData&&this.state.leaveData.totalCount} totalPage={this.state.leaveData&&this.state.leaveData.totalPage} currentPage={this.state.leaveData&&this.state.leaveData.currentPage}/>
            
                </Row>
                </TabPane>
                <TabPane tab="概况" key="2">
                  <Row className="select-row">
                      &nbsp;&nbsp;&nbsp;&nbsp;年级：
                      <Select style={{ width: 120 }}  value={this.state.gradeId1} placeholder="请选择年级" onChange={this.onChange8.bind(this)}>
                        <Option key="0">全部</Option>
                        {options4}
                      </Select>
                      &nbsp;&nbsp;&nbsp;&nbsp;班级：
                      <Select value={this.state.classId1} style={{ width: 120 }} placeholder="请选择班级" onChange={this.onChange9.bind(this)}>
                        <Option key="0">全部</Option>
                        {options5}
                      </Select>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Radio.Group value={this.state.radioGroup} onChange={this.onChange10.bind(this)} buttonStyle="solid">
                        <Radio.Button value={6}>近一周</Radio.Button>
                        <Radio.Button value={7}>近一月</Radio.Button>
                        <Radio.Button value={8}>近一年</Radio.Button>
                        <Radio.Button value={9}>自定义时间</Radio.Button>
                      </Radio.Group>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <RangePicker style={{visibility: this.state.radioGroup == 9 ? "visible" : "hidden"}} onChange={this.onChange7.bind(this)} />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type="primary" onClick={this.check.bind(this)} >查询</Button>
                  </Row>
                  <div style={{display: this.state.visible?"block":"none"}}>
                      <Row className="select-row">
                        <h2 style={{paddingLeft: "20px"}}>请假走势（次）</h2>
                        <div style={{textAlign: "center"}}>
                          <Chart forceFit height={400} data={data} scale={scale}>
                            <Tooltip />
                            <Axis />
                            <Line position="time*次数" />
                            <Point position="time*次数" shape="circle"/>
                          </Chart>
                        </div>
                      </Row>
                      <Row className="select-row">
                        <h2 style={{paddingLeft: "20px"}}>请假类别占比（次）</h2>
                        <div style={{textAlign: "center"}}>
                            <Chart forceFit height={600} data={data1} scale={scale1}>
                              <Tooltip showTitle={false} />
                              <Axis />
                              <Legend dataKey="typeName" />
                              <Coord type="theta" radius={0.75} innerRadius={0.6} />
                              <Pie position="percent" color="typeName" style={{ stroke: '#fff', lineWidth: 1 }}
                                label={['percent', {
                                  formatter: (val, item) => {
                                    return item.point.typeName + ': ' + val + "，共" + item.point.count + "次";
                                  }
                                }]}
                              />
                            </Chart>
                        </div>
                      </Row>
                  </div>
                </TabPane>
              </Tabs>
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    gradesData: state.studentLeave.gradesData,
    classesList: state.studentLeave.classesList,
    leaveTypeList: state.studentLeave.leaveTypeList,
    gradesData1: state.studentLeave.gradesData1,
    classesList1: state.studentLeave.classesList1,
  }
}

export default connect(mapStateToProps)(Form.create()(studentLeave));
