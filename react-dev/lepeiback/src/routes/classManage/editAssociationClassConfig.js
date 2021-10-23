import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message,Tooltip, Divider, Breadcrumb, DatePicker, Radio, InputNumber, Icon} from 'antd';
import { routerRedux,Link } from 'dva/router';
import PageIndex from '../../components/page';
import {formatDate, dateToTimestamp, arrIsRepeat, getQueryString} from '../../utils/public';
import moment from 'moment';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

class NewAssociationClassConfig extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false,
          visibleNew: true,
          courseId: undefined,
          teacherId: undefined,
          semesterId: undefined,
          weeks: [],
          startNum: undefined,
          endNum: undefined,
          week: undefined,
          timeId: undefined,
          buildingId: undefined,
          roomId: undefined,
          startTime: "",
          endTime: undefined,
          weekType: undefined,
          applyGroup: 1,
          sex: 0,
          itemId1: undefined,
          itemId2: undefined,
          num1: 1,
          num2: 1,
          inputArr: [{
            id: undefined,
            selfId: 1,
            num: 1
          }],
          inputArr1: [{
            id: undefined,
            selfId: 1,
            num: 1
          }],
          placeList: [],
          title:'编辑选课配置'
        };
    }
    componentDidMount=()=>{
      const params={

      }
      this.associationClassList(params)
      this.getAllSemesters()
      this.getTeacherStaffs()
      this.getBulidingList()
      this.getAllgrade()
      this.getAllSubject()
      this.getCourseDetail()
      this.getAllClass()

      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/association-class-config"
        },
      })
    }

    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
  }

    
    getCourseDetail=()=>{
      let _this=this
      this.props.dispatch({
        type:'association/courseDetail',
        payload:{
          courseListId: this.props.match.params.id
        },
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              courseId: res.data.courseId,
              roomId: res.data.classroomId,
              teacherId: res.data.teacherId,
              semesterId: res.data.semesterId,
              weekType: res.data.weekType,
              sex: res.data.sex,
              applyGroup: res.data.applyGroup,
              timeId: res.data.timeId,
              week: res.data.week,
              buildingId: res.data.buildId,
              startNum: parseInt(res.data.startWeek),
              endNum: parseInt(res.data.endWeek),
              startTime: formatDate(res.data.applyStartTime),
              endTime: formatDate(res.data.applyEndTime),
            

            })

            if(res.data.applyGroup==1){
              this.setState({
                itemId1: res.data.groupId,
                num1: res.data.limitNum
              })
            }else if(res.data.applyGroup==2){
              let arr=[]
              res.data.groupId.map((item, index)=>{
                arr.push({
                  id: item,
                  selfId: index+1,
                  num: res.data.groupLimitNum[index]
                })
              })
              this.setState({
                inputArr: arr
              })
            }else if(res.data.applyGroup==3){
              this.setState({
                itemId2: res.data.groupId,
                num2: res.data.limitNum
              })
            }else if(res.data.applyGroup==4){
              let arr=[]
              res.data.groupId.map((item, index)=>{
                arr.push({
                  id: item,
                  selfId: index+1,
                  num: res.data.groupLimitNum[index]
                })
              })
              this.setState({
                inputArr1: arr
              })
            }

            _this.onChange23(res.data.semesterId)
            _this.onChange22(res.data.buildId)
          }
        }
      })
    }
    getAllSemesters=()=>{
      this.props.dispatch({
        type:'association/getAllSemesters',
        payload:{}
      })
    }
    associationClassList=(params)=>{
      this.props.dispatch({
        type:'association/associationClassList',
        payload:params
      })
    }
    getAllClassRooms=()=>{
      this.props.dispatch({
        type:'association/getAllClassRooms',
        payload:{}
      })
    }
    getTeacherStaffs=()=>{
      this.props.dispatch({
        type:'association/getTeacherStaffs',
        payload:{}
      })
    }

    getweeksBySemester=(params)=>{
      this.props.dispatch({
          type:'schedule/getweeksBySemester',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              this.setState({
                "weeks": res.data,
              })
            }
        }
      })
    }

    getTimeIdBySemesterId=(id)=>{
      this.props.dispatch({
        type:'association/termDetail',
        payload: {
          semesterId: id
        },
        callback:(res)=>{
        if(res.code===200){
          this.setState({
            "scheduleTimeList": res.data.scheduleTimes
          })
        }
    }
      })
    }
    getBulidingList=()=>{
      this.props.dispatch({
        type:'association/buildingList',
        payload:{}
      })
    }
    getPlaceList=(id)=>{
      this.props.dispatch({
        type:'association/getAllPlacesByBuild',
        payload: {
          buildId: id
        },
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              "placeList": res.data
            })
          }
        }
      })
    }
    getAllgrade=()=>{
      this.props.dispatch({
        type:'association/getAllgrade',
        payload:{}
      })
    }

    getAllClass=()=>{
      this.props.dispatch({
        type: 'association/getAllClass',
        payload: {},
        callback: res=>{
          if(res.code === 200){
            this.setState({
              classList: res.data
            })
          }
        }
      })
    }
    
    getAllSubject=()=>{
      this.props.dispatch({
        type:'association/getAllSubject',
        payload: {type: '2,3'},
        callback: res=>{
          if(res.code === 200){
            res.data&&res.data.map(item=>{
              if(item.type == 2){
                item.subjectName = `${item.subjectName}【社团课】`
              }else if(item.type == 3){
                item.subjectName = `${item.subjectName}【延时课】`
              }
            })
            this.setState({
              classCourseList: res.data
            })

          }
        }
      })
    }
    back=()=>{
      // window.history.go(-1)
      this.props.dispatch(routerRedux.push("/association-class-config?page="+getQueryString("page")+'&prePage='+getQueryString("prePage")))
    }

    create=()=>{
      if(!this.state.courseId){
        message.warning("请选择课程！")
        return
      }
      if(!this.state.teacherId||(this.state.teacherId.length<=0)){
        message.warning("请选择授课老师！")
        return
      }
      if(!this.state.semesterId){
        message.warning("请选择学期！")
        return
      }
      if(!this.state.startNum||!this.state.endNum){
        message.warning("请选择上课周期！")
        return
      }
      if(!this.state.week){
        message.warning("请选择上课时间！")
        return
      }
      if(!this.state.timeId){
        message.warning("请选择上课节次！")
        return
      }
      if(!this.state.roomId){
        message.warning("请选择上课场所！")
        return
      }
      if(!this.state.startTime||!this.state.endTime){
        message.warning("请选择报名起止时间！")
        return
      }
      let itemIdArr = []
      let numArr = []

      if(this.state.applyGroup==1){
        itemIdArr = this.state.itemId1
        if(!this.state.num1){
          message.warn("")
          return
        }
        this.state.itemId1.map(item=>{
          numArr.push(this.state.num1)
        })
      }else if(this.state.applyGroup==2){
        this.state.inputArr.map(item=>{
          itemIdArr.push(item.id)
          numArr.push(item.num)
        })
      }else if(this.state.applyGroup==3){
        itemIdArr = this.state.itemId2
        if(!this.state.num2){
          message.warn("请输入限额！")
          return
        }
        this.state.itemId2.map(item=>{
          numArr.push(this.state.num2)
        })
      }else if(this.state.applyGroup==4){
        this.state.inputArr1.map(item=>{
          itemIdArr.push(item.id)
          numArr.push(item.num)
        })
      }
      if(arrIsRepeat(itemIdArr)){
        message.warn("所选年级或班级重复！")
        return
      }
      itemIdArr.map(item=>{
        if(!item){
          message.warn("请选择年级或班级！")
          return
        }
      })
      const params = {
        "id": this.props.match.params.id,
        "roomId": this.state.roomId,
        "courseId": this.state.courseId,
        "semesterId": this.state.semesterId,
        "startTime": dateToTimestamp(this.state.startTime),
        "endTime": dateToTimestamp(this.state.endTime),
        "weekType": this.state.weekType,
        "startWeek": this.state.startNum,
        "endWeek": this.state.endNum,
        "sex": this.state.sex,
        "applyGroup": this.state.applyGroup,
        "itemId": itemIdArr,
        "num": numArr,
        "teacherId": this.state.teacherId,
        "week": this.state.week,
        "timeId": this.state.timeId,
      }
      this.props.dispatch({
        type:'association/updateCourse',
        payload: params,
        callback: (res)=>{
          if(res.code === 200){
            message.success("编辑成功！")
            setTimeout(() => {
              // window.history.go(-1)
              this.props.dispatch(routerRedux.push("/association-class-config?page="+getQueryString("page")+'&prePage='+getQueryString("prePage")))
            }, 2000);
          }
        }
      })
    }

    onChange1 = (value)=> {
      this.setState({
        courseId: value
      })
    }
    onChange2 = (value)=> {
      this.setState({
        teacherId: value
      })
    }
    onChange3 = (value)=> {
      this.getweeksBySemester({
        semesterId: value
      })
      this.setState({
        semesterId: value,
        startNum: undefined,
        endNum: undefined
      })
      this.getTimeIdBySemesterId(value)
    }
    onChange4 = (value)=> {
      this.setState({
        startNum: value
      })
    }
    onChange5 = (value)=> {
      this.setState({
        endNum: value
      })
    }
    onChange6 = (value)=> {
      this.setState({
        week: value,
        timeId: undefined,
      })
    }
    onChange7 = (value)=> {
      this.setState({
        timeId: value
      })
    }
    onChange8 = (value)=> {
      this.setState({
        buildingId: value,
        roomId: undefined
      })
      this.getPlaceList(value)
    }
    onChange9 = (value)=> {
      this.setState({
        roomId: value
      })
    }
    onChange10 = (value, dateString)=> {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.setState({
        startTime: dateString&&dateString[0],
        endTime: dateString&&dateString[1]
      })
    }
    onChange11 = (e)=> {
      console.log('radio checked', e.target.value)
      this.setState({
        weekType: e.target.value,
      })
    }
    onChange12 = (e)=> {
      console.log('radio checked', e.target.value)
      this.setState({
        applyGroup: e.target.value,
      })
    }
    onChange13 = (e)=> {
      console.log('radio checked', e.target.value)
      this.setState({
        sex: e.target.value,
      })
    }
    onChange14 = (value)=> {
      console.log('radio checked', value)
      this.setState({
        itemId1: value,
      })
    }
    onChange15 = (value)=> {
      this.setState({
        num1: value,
      })
    }
    onChange16 = (id, value)=> {
      this.state.inputArr.map(item=>{
        if(item.selfId == id){
          item.id = value
        }
      })
      console.log(this.state.inputArr)
      this.setState({inputArr: this.state.inputArr})
    }
    onChange17 = (id, value)=> {
      this.state.inputArr.map(item=>{
        if(item.selfId == id){
          item.num = value
        }
      })
      console.log(this.state.inputArr)
      this.setState({inputArr: this.state.inputArr})
    }
    onChange18 = (value)=> {
      console.log('radio checked', value)
      this.setState({
        itemId2: value,
      })
    }
    onChange19 = (value)=> {
      this.setState({
        num2: value,
      })
    }

    onChange20 = (id, value)=> {
      this.state.inputArr1.map(item=>{
        if(item.selfId == id){
          item.id = value
        }
      })
      console.log(this.state.inputArr1)
      this.setState({inputArr1: this.state.inputArr1})
    }

    onChange21 = (id, value)=> {
      this.state.inputArr1.map(item=>{
        if(item.selfId == id){
          item.num = value
        }
      })
      console.log(this.state.inputArr1)
      this.setState({inputArr1: this.state.inputArr1})
    }

    onChange22 = (value)=> {
      this.getPlaceList(value)
    }

    onChange23 = (value)=> {
      this.getweeksBySemester({
        semesterId: value
      })
      this.getTimeIdBySemesterId(value)
    }

    addLabel=()=>{
      if(this.state.inputArr.length==0){
        this.state.inputArr.push({
            id: undefined,
            selfId: 1,
            num: 1
        })
      }else{
        let selfId = Number(this.state.inputArr[this.state.inputArr.length-1].selfId) + 1
        this.state.inputArr.push({
            id: undefined,
            selfId: selfId,
            num: 1
        })
      }
      this.setState({inputArr: this.state.inputArr})
    }

    deleteLabel=(selfId)=>{
      this.setState({ inputArr: this.state.inputArr.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.inputArr);
      });
    }

    addLabel1=()=>{
      if(this.state.inputArr1.length==0){
        this.state.inputArr1.push({
            id: undefined,
            selfId: 1,
            num: 1
        })
      }else{
        let selfId = Number(this.state.inputArr1[this.state.inputArr1.length-1].selfId) + 1
        this.state.inputArr1.push({
            id: undefined,
            selfId: selfId,
            num: 1
        })
      }
      this.setState({inputArr1: this.state.inputArr1})
    }

    deleteLabel1=(selfId)=>{
      this.setState({ inputArr1: this.state.inputArr1.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.inputArr1);
      });
    }
  
    render(){
          const {classCourseList, classList, placeList} = this.state
          const {semestersList, classRoomList, teacherList, weeks,
            buildingList, gradeList
          } = this.props;
      
          const option = semestersList&&semestersList.map((item)=>{
            return <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
          })

          if(!classCourseList){
            return null;
          }
    
          const option1 = classCourseList&&classCourseList.map((item)=>{
            return <Option key={item.subjectId} value={item.subjectId}>{item.subjectName}</Option>
          })
          const option2 = teacherList&&teacherList.map((item)=>{
            return <Option key={item.personId} value={item.personId}>{item.personName}</Option>
          })
          const option3 = semestersList&&semestersList.map((item)=>{
            return <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
          })
          const option4 = this.state.weeks&&this.state.weeks.map((item, index)=>{
            return <Option key={index} value={index+1}>第{index+1}周（{item.start}~{item.end}）</Option>
          })
          const option5 = this.state.scheduleTimeList&&this.state.scheduleTimeList.map((item, index)=>{
            return <Option key={item.sectionId} value={item.sectionId}>{item.sectionName}</Option>
          })
          const option6 = buildingList&&buildingList.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          })
          const option7 = placeList&&placeList.map((item, index)=>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          })
          const option8 = gradeList&&gradeList.map((item, index)=>{
            return <Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>
          })
          const option9 = classList&&classList.map((item, index)=>{
            return <Option key={item.classId} value={item.classId}>{item.className}</Option>
          })
          
        return (
            <div className="content-main association new-association-config edit-association-config">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/association-class-config">选课配置</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>编辑选课配置</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <div>
                <Row>
                    <Col span={12}>
                        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课程名称&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Select placeholder="请选择" 
                        value = {this.state.courseId}
                        onChange={this.onChange1.bind(this)}
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                         style={{ width: 200 }} >
                         {option1}
                        </Select>
                      </Col>
                      <Col span={12}>
                        <label>授课老师&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Select onChange={this.onChange2.bind(this)}
                            placeholder="请选择老师" 
                            mode="multiple"
                            showSearch
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={this.state.teacherId}
                            style={{ width: 200 }} >
                            {option2}
                        </Select>
                      </Col>
                  </Row>
                      <Row>
                        <Col span={12}>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上课学期&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择学期" value={this.state.semesterId} onChange={this.onChange3.bind(this)} style={{ width: 200 }} >
                                {option3}
                            </Select>
                          </Col>
                          <Col span={12}>
                            <label>上课周期&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择" value={this.state.startNum} onChange={this.onChange4.bind(this)} style={{ width: 200 }} >
                                {option4}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择" value={this.state.endNum} onChange={this.onChange5.bind(this)} style={{ width: 200 }} >
                                {option4}
                            </Select>
                          </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上课时间&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择星期" value={this.state.week} onChange={this.onChange6.bind(this)} style={{ width: 120 }} >
                                <Option value="1">周一</Option>
                                <Option value="2">周二</Option>
                                <Option value="3">周三</Option>
                                <Option value="4">周四</Option>
                                <Option value="5">周五</Option>
                                <Option value="6">周六</Option>
                                <Option value="7">周日</Option>
                            </Select>
                           &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择节次" 
                                mode="multiple"
                                value={this.state.timeId}
                                onChange={this.onChange7.bind(this)}
                                style={{ width: 120 }} >
                                {option5}
                            </Select>
                        </Col>
                        
                      </Row>
                      <Row>
                        <Col span={12}>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上课建筑&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择建筑" value={this.state.buildingId} onChange={this.onChange8.bind(this)} style={{ width: 200 }} >
                              {option6}
                            </Select>
                          </Col>
                          <Col span={12}>
                            <label>上课场所&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择场所" value={this.state.roomId} onChange={this.onChange9.bind(this)} style={{ width: 200 }} >
                              {option7}
                            </Select>
                          </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                            <label>&nbsp;报名起止日期&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <RangePicker
                              showTime={{ format: 'HH:mm' }}
                              format="YYYY-MM-DD HH:mm"
                              value={[moment(this.state.startTime, "YYYY-MM-DD HH:mm")||undefined, moment(this.state.endTime, "YYYY-MM-DD HH:mm")]}
                              placeholder={['开始时间', '截止时间']}
                              onChange={this.onChange10.bind(this)}
                            />
                          </Col>
                          <Col span={12}>
                            <label>单双周&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>&nbsp;&nbsp;
                            <RadioGroup onChange={this.onChange11.bind(this)} value={this.state.weekType}>
                              <Radio value="1">不限</Radio>
                              <Radio value="2">单周</Radio>
                              <Radio value="3">双周</Radio>
                            </RadioGroup>
                          </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选课群体&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <RadioGroup onChange={this.onChange12.bind(this)} value={this.state.applyGroup}>
                              <Radio value="1">年级范围</Radio>
                              <Radio value="2">分年级</Radio>
                              <Radio value="3">班级范围</Radio>
                              <Radio value="4">分班级</Radio>
                            </RadioGroup>
                          </Col>
                          <Col span={12}>
                            <label>学生性别&nbsp;&nbsp;&nbsp;&nbsp;</label>&nbsp;&nbsp;
                            <RadioGroup onChange={this.onChange13.bind(this)} value={this.state.sex}>
                              <Radio value="0">不限</Radio>
                              <Radio value="1">男</Radio>
                              <Radio value="2">女</Radio>
                            </RadioGroup>
                          </Col>
                      </Row>
                      <Row style={{"display": this.state.applyGroup==1?"block":"none"}}>
                          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年级&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Select placeholder="请选择年级" 
                              mode="multiple"
                              value={this.state.itemId1}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={this.onChange14.bind(this)}
                              style={{ width: 200 }} >
                              {option8}
                          </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限额&nbsp;&nbsp;&nbsp;&nbsp;
                          <InputNumber min={1} value={this.state.num1} onChange={this.onChange15.bind(this)} />
                      </Row>
                      <Row style={{"display": this.state.applyGroup==2?"block":"none"}}>
                        {this.state.inputArr.map((item)=>{
                          return <div className="grade-items" key={item.selfId}>
                                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年级&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Select placeholder="请选择年级" 
                                        value={item.id}
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={this.onChange16.bind(this, item.selfId)}
                                        style={{ width: 200 }} >
                                        {option8}
                                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限额&nbsp;&nbsp;&nbsp;&nbsp;
                                    <InputNumber min={1} value={item.num} onChange={this.onChange17.bind(this, item.selfId)} />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Icon type="close" onClick={this.deleteLabel.bind(this, item.selfId)} />
                                </div>
                          })
                        }
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button type="dashed" onClick={this.addLabel.bind(this)} >新增</Button>
                      </Row>
                      <Row style={{"display": this.state.applyGroup==3?"block":"none"}}>
                          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班级&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Select placeholder="请选择班级" 
                              mode="multiple"
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              value={this.state.itemId2}
                              onChange={this.onChange18.bind(this)}
                              style={{ width: 200 }} >
                              {option9}
                          </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限额&nbsp;&nbsp;&nbsp;&nbsp;
                          <InputNumber min={1} value={this.state.num2} onChange={this.onChange19.bind(this)} />
                      </Row>
                      <Row style={{"display": this.state.applyGroup==4?"block":"none"}}>
                        {this.state.inputArr1.map((item)=>{
                          return <div className="grade-items" key={item.selfId}>
                                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班级&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Select placeholder="请选择班级" 
                                        value={item.id}
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={this.onChange20.bind(this, item.selfId)}
                                        style={{ width: 200 }} >
                                        {option9}
                                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限额&nbsp;&nbsp;&nbsp;&nbsp;
                                    <InputNumber min={1} value={item.num} onChange={this.onChange21.bind(this, item.selfId)} />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Icon type="close" onClick={this.deleteLabel1.bind(this, item.selfId)} />
                                </div>
                          })
                        }
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button type="dashed" onClick={this.addLabel1.bind(this)} >新增</Button>
                      </Row>
                </div>
                <div className="btn-group">
                  <Row>
                    <Button onClick={this.back.bind(this)}>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.create.bind(this)}>确定</Button>
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
     classCourseList: state.association,
     semestersList: state.association.semestersList,
     classRoomList: state.association.classRoomList,
     teacherList: state.association.teacherList,
     buildingList: state.association.buildingList,
     placeList: state.association.placeList,
     gradeList: state.association.gradeList,
  }
}
export default connect(mapStateToProps)(Form.create()(NewAssociationClassConfig));
