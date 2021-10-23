import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Modal, InputNumber,Tree,Button,Select,message, Breadcrumb ,Input, Form, Row,Tabs , Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { portUrl } from '../../utils/img';

const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class ScheduleQuery extends Component{
    constructor(props) {
        super(props);
        this.state = {
            personId1: '',
            personId1text:'',
            semesterId1: '',
            semesterId1text:'',
            personId2: '',
            personId2text:'',
            semesterId2: '',
            semesterId2text:'',
            classroomId: '',
            classroomIdtext:'',
            semesterId3: '',
            semesterId3text:'',
            tableText: '',
            weeks1:[],
            weeks2:[],
            weeks3:[],
            option5: undefined,
            option6: undefined,
            option7: undefined,
            init:0,
            studentList: [],
            teacherList: [],
            semestersList: [],
            classroomList: [],
            exportUrl1: '',
            exportUrl2: '',
            exportUrl3: ''
        };
    }

    componentDidMount=()=>{
        this.getStudent();
        this.getSemesters();
        this.getTeacher();
        this.getClassRoom();
    }

    componentWillUnmount=()=>{
       console.log("unmount")
       this.props.query
    }

    getStudent=()=>{
        this.props.dispatch({
            type:'schedule/commonPersonList',
            payload:{personType: 1, status: 1},
            callback:(res)=>{
                if(res.code===200){
                  this.setState({
                    studentList: res.data
                  })
                }
            }
        })
    }

    getSemesters=()=>{
        this.props.dispatch({
            type:'schedule/getAllSemesters',
            payload:{},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        semestersList: res.data
                    })
                  }
            }
        })
    }

    getTeacher=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/commonPersonList',
            payload:{personType: 2, status: 1},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        teacherList: res.data
                    })
                  }
            }
        })
    }

    getClassRoom=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/getAllRooms',
            payload:{},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        classroomList: res.data
                    })
                }
            }
        })
    }

    queryStudentSchedule=(params)=>{
        this.props.dispatch({
            type:'schedule/queryStudentSchedule',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        init:1
                    })
                }
            }
        })
    }

    queryTeacherSchedule=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/queryTeacherSchedule',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        init:1
                    })
                }
            }
        })
    }

    queryClassSchedule=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/queryClassSchedule',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        init:1
                    })
                }
            }
        })
    }

    getweeksBySemester1=(params)=>{
        this.props.dispatch({
            type:'schedule/getweeksBySemester',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                  this.setState({
                    "weeks1": res.data,
                    "option5": undefined
                  })
               
                }
            }
        })
    }

    getweeksBySemester2=(params)=>{
        this.props.dispatch({
            type:'schedule/getweeksBySemester',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                  this.setState({
                    "weeks2": res.data,
                    "option6": undefined
                  })
                }
            }
        })
    }

    getweeksBySemester3=(params)=>{
        this.props.dispatch({
            type:'schedule/getweeksBySemester',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                  this.setState({
                    "weeks3": res.data,
                    "option7": undefined
                  })
                }
            }
        })
    }

    // 导出课表
    exportSchedules1 = () =>{
        if(!this.state.personId1){
            message.warning("请选择学生！")
            return;
        }
        if(!this.state.semesterId1){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option5){
            message.warning("请选择周次！")
            return;
        }
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //类型(1:学生课表,2:教师课表,3:教室课表)
        let userId=sessionStorage.getItem("userId");
        let type = 1;
        let id = this.state.personId1
        let semesterId = this.state.semesterId1;
        let startDate = this.state.option5.split("|")[0];
        let endDate = this.state.option5.split("|")[1];
        let url=portUrl("/manager/schedules/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&type="+type+"&id="+id+"&semesterId="+semesterId
        +"&startDate="+startDate+"&endDate="+endDate)
        this.setState({exportUrl1:url})
    }
    // 导出课表
    exportSchedules2 = () =>{
        if(!this.state.personId2){
            message.warning("请选择教师！")
            return;
        }
        if(!this.state.semesterId2){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option6){
            message.warning("请选择周次！")
            return;
        }
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //类型(1:学生课表,2:教师课表,3:教室课表)
        let userId=sessionStorage.getItem("userId");
        let type = 2;
        let id = this.state.personId2
        let semesterId = this.state.semesterId2;
        let startDate = this.state.option6.split("|")[0];
        let endDate = this.state.option6.split("|")[1];
        let url=portUrl("/manager/schedules/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&type="+type+"&id="+id+"&semesterId="+semesterId
        +"&startDate="+startDate+"&endDate="+endDate)
        this.setState({exportUrl2:url})
    }
    // 导出课表
    exportSchedules3 = () =>{
        if(!this.state.classroomId){
            message.warning("请选择教室！")
            return;
        }
        if(!this.state.semesterId3){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option7){
            message.warning("请选择周次！")
            return;
        }
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //类型(1:学生课表,2:教师课表,3:教室课表)
        let userId=sessionStorage.getItem("userId");
        let type = 3;
        let id = this.state.classroomId
        let semesterId = this.state.semesterId3;
        let startDate = this.state.option7.split("|")[0];
        let endDate = this.state.option7.split("|")[1];
        let url=portUrl("/manager/schedules/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&type="+type+"&id="+id+"&semesterId="+semesterId
        +"&startDate="+startDate+"&endDate="+endDate)
        this.setState({exportUrl3:url})
    }

    query1=()=>{
        if(!this.state.personId1){
            message.warning("请选择学生！")
            return;
        }
        if(!this.state.semesterId1){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option5){
            message.warning("请选择周次！")
            return;
        }
        let params={
            "studentId": this.state.personId1,
            "semesterId": this.state.semesterId1,
            "startDate": this.state.option5.split("|")[0],
            "endDate": this.state.option5.split("|")[1]
        }
        this.setState({
            tableText: this.state.personId1text +" "+ this.state.semesterId1text
        })
        
        this.queryStudentSchedule(params);
    }

    query2=()=>{
        if(!this.state.personId2){
            message.warning("请选择教师！")
            return;
        }
        if(!this.state.semesterId2){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option6){
            message.warning("请选择周次！")
            return;
        }
        let params={
            "teacherId": this.state.personId2,
            "semesterId": this.state.semesterId2,
            "startDate": this.state.option6.split("|")[0],
            "endDate": this.state.option6.split("|")[1]
        }
        this.setState({
            tableText: this.state.personId2text +" "+ this.state.semesterId2text
        })
        this.queryTeacherSchedule(params);
    }

    query3=()=>{
        if(!this.state.classroomId){
            message.warning("请选择教室！")
            return;
        }
        if(!this.state.semesterId3){
            message.warning("请选择学期！")
            return;
        }
        if(!this.state.option7){
            message.warning("请选择周次！")
            return;
        }
        let params={
            "classroomId": this.state.classroomId,
            "semesterId": this.state.semesterId3,
            "startDate": this.state.option7.split("|")[0],
            "endDate": this.state.option7.split("|")[1]
        }
        this.setState({
            tableText: this.state.personId3text +" "+ this.state.semesterId3text
        })

        this.queryClassSchedule(params);
    }

    handleBlur=()=> {
        console.log('blur');
      }
      
    handleFocus=()=> {
        console.log('focus');
      }
      
    onChange=(value)=> {
        console.log('changed', value);
    }

     callback=(key)=> {
        console.log(key);
    }
      
    handleChange1=(list, value)=> {
        console.log(`selected ${value}`);
        this.setState({
            personId1: value
        })
        list.map((item)=>{
            if(item.personId==value){
                this.setState({
                    personId1text: item.personName
                })
            }
        })
    }

    handleChange2=(list, value)=> {
        this.setState({
            semesterId1: value
        })
        this.getweeksBySemester1({
            semesterId: value
        })
        list.map((item)=>{
            if(item.semesterId==value){
                this.setState({
                    semesterId1text: item.semesterName
                })
            }
        })
    }

    handleChange3=(list, value)=> {
        console.log(`selected ${value}`);
        this.setState({
            personId2: value
        })
        list.map((item)=>{
            if(item.personId==value){
                this.setState({
                    personId2text: item.personName
                })
            }
        })
    }

    handleChange4=(list, value)=> {
        this.setState({
            semesterId2: value
        })
        this.getweeksBySemester2({
            semesterId: value
        })
        list.map((item)=>{
            if(item.semesterId==value){
                this.setState({
                    semesterId2text: item.semesterName
                })
            }
        })
    }

    handleChange5=(list, value)=> {
        console.log(`selected ${value}`);
        this.setState({
            classroomId: value
        })
        list.map((item)=>{
            if(item.id==value){
                this.setState({
                    personId3text: item.name
                })
            }
        })
    }

    handleChange6=(list, value)=> {
        this.setState({
            semesterId3: value
        })
        this.getweeksBySemester3({
            semesterId: value
        })
        list.map((item)=>{
            if(item.semesterId==value){
                this.setState({
                    semesterId3text: item.semesterName
                })
            }
        })
    }

    handleChange7=(value)=> {
       this.setState({
        "option5": value
        })
    }

    handleChange8=(value)=> {
        this.setState({
         "option6": value
         })
     }

     handleChange9=(value)=> {
        this.setState({
         "option7": value
         })
     }

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }

    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }

    render(){
        const {studentList, teacherList, semestersList, classroomList}=this.state
        const query=this.state.init==1?this.props.query:[]
        const {weeks1, weeks2, weeks3} = this.state

        let option1 = studentList&&studentList.map(function(item){
            return  <Option value={item.personId} key={item.personId}>{item.personName}</Option>
        })

        let option2 = semestersList&&semestersList.map(function(item){
            return  <Option value={item.semesterId} key={item.semesterId}>{item.semesterName}</Option>
        })

        let option3 = teacherList&&teacherList.map(function(item){
            return  <Option value={item.personId} key={item.personId}>{item.personName}</Option>
        })

        let option4 = classroomList&&classroomList.map(function(item){
            return  <Option value={item.id} key={item.id}>{item.name}</Option>
        })

        let option5 = weeks1&&weeks1.map(function(item, index){
            return  <Option value={item.start+"|"+item.end} key={item.start+item.end}>第{index+1}周（{item.start+" ~ "+item.end}）</Option>
        })

        let option6 = weeks2&&weeks2.map(function(item, index){
            return  <Option value={item.start+"|"+item.end} key={item.start+item.end}>第{index+1}周（{item.start+" ~ "+item.end}）</Option>
        })

        let option7 = weeks3&&weeks3.map(function(item, index){
            return  <Option value={item.start+"|"+item.end} key={item.start+item.end}>第{index+1}周（{item.start+" ~ "+item.end}）</Option>
        })


        let colunm = query&&query.map(function(item){
            let node=[]
            for(let key in item.week){
                node.push(<td>{item.week[key].subjectName}</td>)
            }
            return  <tr key={item.sectionName}><td>{item.sectionName}</td>{node}</tr>
        })

        return (
            <div className="content-main content-building content-scheduleq">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/schedule-manage"}>课表管理</Link> / 课表查询</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="学生课表" key="1">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请输入学生姓名"
                                optionFilterProp="children"
                                
                                onChange={this.handleChange1.bind(this, studentList)}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {option1}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择学期" style={{ width: 200 }} onChange={this.handleChange2.bind(this, semestersList)}>
                                {option2}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择学期后再选择周次" value={this.state.option5||undefined} style={{ width: 280 }} onChange={this.handleChange7}>
                                {option5}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.query1}>查询</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary"><a href={this.state.personId1&&this.state.semesterId1&&this.state.option5?this.state.exportUrl1:"javascript:;"} onClick={this.exportSchedules1.bind(this)}>导出</a></Button>
                        </TabPane>
                        <TabPane tab="教师课表" key="2">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请输入教师姓名"
                                optionFilterProp="children"
                                onChange={this.handleChange3.bind(this, teacherList)}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {option3}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select  placeholder="请选择学期" style={{ width: 200 }} onChange={this.handleChange4.bind(this, semestersList)}>
                                {option2}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择学期后再选择周次" value={this.state.option6||undefined} style={{ width: 280 }} onChange={this.handleChange8}>
                                {option6}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.query2}>查询</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary"><a href={this.state.personId2&&this.state.semesterId2&&this.state.option6?this.state.exportUrl2:"javascript:;"} onClick={this.exportSchedules2.bind(this)}>导出</a></Button>
                        </TabPane>
                        <TabPane tab="教室课表" key="3">
                            <Select  placeholder="请选择教室" style={{ width: 200 }} onChange={this.handleChange5.bind(this, classroomList)}>
                              {option4}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select  placeholder="请选择学期" style={{ width: 200 }} onChange={this.handleChange6.bind(this, semestersList)}>
                               {option2}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择学期后再选择周次" value={this.state.option7||undefined} style={{ width: 280 }} onChange={this.handleChange9}>
                                {option7}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.query3}>查询</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary"><a href={this.state.classroomId&&this.state.semesterId3&&this.state.option7?this.state.exportUrl3:"javascript:;"} onClick={this.exportSchedules3.bind(this)}>导出</a></Button>
                        </TabPane>
                    </Tabs>
                    <p>
                        {this.state.tableText} {this.state.tableText?"的课表":""}
                    </p>
                    <Row>
                            <table className="schedule">
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <th>星期一</th>
                                        <th>星期二</th>
                                        <th>星期三</th>
                                        <th>星期四</th>
                                        <th>星期五</th>
                                        <th>星期六</th>
                                        <th>星期日</th>
                                    </tr>
                                   {colunm}
                                </tbody>
                            </table>
                            {/* <p className="tips">
                                <span className="t-red">红色</span>为单周课程，<span className="t-green">绿色</span>为双周课程。
                            </p> */}
                    </Row>
                </div>

            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    semestersList: state.schedule.semesters,
    query: state.schedule.query,
  }
}

export default connect(mapStateToProps)(Form.create()(ScheduleQuery));
