import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Table, Button, Input, Select, Form, Row, Tabs, Col,Modal,Alert,message,Tooltip, Divider} from 'antd';
import PageIndex from '../../components/page';
import {formatDate} from '../../utils/public';
import {portUrl, getSign} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class AssociationClassStatistics extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false,
          visibleDelete: false,
          deleteId: null,
          visibleSet: false,
          visibleImport: false,
          file: null,
          semesterId1: undefined,
          courseType1: undefined,
          courseId1: undefined,
          classCourse: undefined,
          chosenCourseStudent: undefined,
          notChosenCourseStudent: undefined,
          semesterId2: undefined,
          courseId2: undefined,
          gradeId2: undefined,
          classId2: undefined,
          kw2: undefined,
          exportUrl: null,

          semesterId3: undefined,
          courseId3: undefined,
          gradeId3: undefined,
          classId3: undefined,
          kw3: undefined,
          page: 1,
          prePage: 20,
          page2: 1,
          prePage2: 20,
          page3: 1,
          prePage3: 20,
          // visibleSchedule: false,
          classList: []
        };
    }
    componentDidMount=()=>{
      const params={
        // "page":1,
        // "prePage":20,
      }
      this.associationClassList(params)
      this.getAllSemesters()
      this.getAllClassRooms()
      this.getAllgrade()

    }
    
    getClassList=(params)=>{
      this.props.dispatch({
        type:'association/getAllSubject',
        payload: params,
        callback: res=>{
          if(res.code === 200){
            res.data&&res.data.map(item=>{
              if(item.type == 2){
                item.subjectName = `${item.subjectName}???????????????`
              }else if(item.type == 3){
                item.subjectName = `${item.subjectName}???????????????`
              }
            })
            this.setState({
              classList: res.data
            })
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
        type:'association/associationCourseList1',
        payload:params,
        callback: (res)=>{
          if(res.code===200){
            res.data.dataList.map(item=>{
              item.courseTime = [item.week, item.sectionName]
              item.num = [item.personNum, item.limitNum]
            })
            this.setState({
              classCourse: res.data
            })
          }
        }
        
      })
    }
    getChosenCourseStudent=(params)=>{
      this.props.dispatch({
        type:'association/getChosenCourseStudent',
        payload:params,
        callback: (res)=>{
          if(res.code===200){
            // res.data.dataList.map(item=>{
            //   item.courseTime = [item.week, item.sectionName]
            //   item.num = [item.personNum, item.limitNum]
            // })
            this.setState({
              chosenCourseStudent: res.data
            })
          }
        }
        
      })
    }
    getNotChosenCourseStudent=(params)=>{
      this.props.dispatch({
        type:'association/getNotChosenCourseStudent',
        payload:params,
        callback: (res)=>{
          if(res.code===200){
            // res.data.dataList.map(item=>{
            //   item.courseTime = [item.week, item.sectionName]
            //   item.num = [item.personNum, item.limitNum]
            // })
            this.setState({
              notChosenCourseStudent: res.data
            })
          }
        }
        
      })
    }
    getAllClassRooms=()=>{
      this.props.dispatch({
        type:'association/getAllClassRooms',
        payload:{}
      })
    }
    
    getAllgrade=()=>{
      this.props.dispatch({
        type:'association/getAllgrade1',
        payload:{}
      })
    }
    getClassName1=(params)=>{
      this.props.dispatch({
        type:'association/getClassName1',
        payload: params
      })
    }
    getClassName2=(params)=>{
      this.props.dispatch({
        type:'association/getClassName2',
        payload: params
      })
    }
    
    search1=()=>{
      let courseType=''
      if(this.state.courseType1==2){
        courseType=1
      }else if(this.state.courseType1==3){
        courseType=2
      }
      const params={
        page: this.state.page||'',
        prePage: this.state.prePage||'',
        semesterId: this.state.semesterId1||'',
        type: courseType,
        courseId: this.state.courseId1||''
      }
      this.associationClassList(params)
    }
    search2=()=>{
      const params={
        page: this.state.page2,
        prePage: this.state.prePage2,
        semesterId: this.state.semesterId2||'',
        type: this.state.courseType2||'',
        gradeId: this.state.gradeId2||'',
        kw: this.state.kw2||'',
        classId: this.state.classId2||''
      }
      this.getChosenCourseStudent(params)
    }
    search3=()=>{
      const params={
        page: this.state.page3,
        prePage: this.state.prePage3,
        semesterId: this.state.semesterId3||'',
        type: this.state.courseType3||'',
        gradeId: this.state.gradeId3||'',
        kw: this.state.kw3||'',
        classId: this.state.classId3||''
      }
      this.getNotChosenCourseStudent(params)
    }
    // ??????
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "semesterId":values.semesterId||'',
          "courseId":values.courseId||'',
          "type":values.type||'',
          "weekType":values.weekType||'',
          "roomId":values.roomId||'',
          "week":values.week||'',
        }
        this.associationClassList(params)
      })
    }
    // ??????
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        let courseType
        if(this.state.courseType1==2){
          courseType = 1
        }else if(this.state.courseId1==1){
          courseType = 1
        }else{
          courseType = ""
        }
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "type": courseType,
        }
        this.associationClassList(params)
      })
    }
    onPageChange1=(current,size)=>{
        this.setState({page2:current,prePage2:size})
        const params={
          page: current,
          prePage: size,
          semesterId: this.state.semesterId2||'',
          type: this.state.courseType2||'',
          gradeId: this.state.gradeId2||'',
          kw: this.state.kw2||'',
          classId: this.state.classId2||''
        }
        this.getChosenCourseStudent(params)
    }
    onPageChange2=(current,size)=>{
        this.setState({page3:current,prePage3:size})
        const params={
          page: current,
          prePage: size,
          semesterId: this.state.semesterId3||'',
          type: this.state.courseType3||'',
          gradeId: this.state.gradeId3||'',
          kw: this.state.kw3||'',
          classId: this.state.classId3||''
        }
        this.getNotChosenCourseStudent(params)
    }
    toDetail= (id) => {
      let url = window.location.href.substring(0, window.location.href.lastIndexOf("/"))
      window.open(url+"/statistics-detail/"+id);
    }
    delete= (id) => {
      this.setState({
        visibleDelete: true,
        deleteId: id
      })
    }
    setStudent= (id) => {
      this.setState({
        visibleSet: true
      })
    }
    importConfig=(id) => {
      this.setState({
        visibleImport: true,
      })
    }
    
    handleAdd= () => {
      this.props.dispatch(routerRedux.push("/new-association-class-config"))
    }
    handleCancel= () => {
      this.setState({
        visibleNew: false
      })
    }
    handleSetCancel= () => {
      this.setState({
        visibleSet: false
      })
    }
    handleImportCancel= () => {
      this.setState({
        visibleImport: false
      })
    }

    handleDeleteOk = () => {
      this.props.dispatch({
        type:'association/deleteCourse',
        payload:{
          "id": this.state.deleteId
        },
        callback: res=>{
          if(res.code === 200){
            this.setState({
              visibleDelete: false
            })
            message.success("???????????????")
          }
        }
      })
      
    }
    handleDeleteCancel = () => {
      this.setState({
        visibleDelete: false
      })
    }
    generateType = (type) => {
      if(type == 1){
        return "??????"
      }else if(type == 2){
        return "?????????"
      }else if(type == 3){
        return "?????????"
      }
    }
    generateWeek= (week) => {
      if(week == 1){
        return "??????"
      }else if(week == 2){
        return "??????"
      }else if(week == 3){
        return "??????"
      }else if(week == 4){
        return "??????"
      }else if(week == 5){
        return "??????"
      }else if(week == 6){
        return "??????"
      }else if(week == 7){
        return "??????"
      }
    }
    onChange1=(e)=> {
      const file = e.target.files[0]
      this.setState({
          file: file
      })
    }
    handleChange1=(value)=> {
      this.setState({
        semesterId1: value
      })
    }
    handleChange2=(value)=> {
      const params={
        type: value
      }
      this.setState({
        courseType1: value,
        courseId1: undefined,
      })
      this.getClassList(params)
    }
    handleChange3=(value)=> {
      this.setState({
        courseId1: value
      })
    }
    handleChange4=(e)=> {
      this.setState({
        kw2: e.target.value
      })
    }
    handleChange5=(value)=> {
      this.setState({
        semesterId2: value
      })
    }
    handleChange6=(value)=> {
      this.setState({
        courseType2: value
      })
    }
    handleChange7=(value)=> {
      this.setState({
        gradeId2: value,
        classId2: undefined
      })
      const params={
        gradeId: value
      }
      if(!value) return
      this.getClassName1(params)
    }
    handleChange8=(value)=> {
      this.setState({
        classId2: value
      })
    }
    handleChange9=(e)=> {
      this.setState({
        kw3: e.target.value
      })
    }
    handleChange10=(value)=> {
      this.setState({
        semesterId3: value
      })
    }
    handleChange11=(value)=> {
      this.setState({
        courseType3: value
      })
    }
    handleChange12=(value)=> {
      this.setState({
        gradeId3: value,
        classId3: undefined
      })
      const params={
        gradeId: value
      }
      if(!value) return
      this.getClassName2(params)
    }
    handleChange13=(value)=> {
      this.setState({
        classId3: value
      })
    }
    export1=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:????????????,3:APP??????
        let userId=sessionStorage.getItem("userId");
        let semesterId=this.state.semesterId2;
        if(!semesterId){
          message.warn("??????????????????")
          return
        }
        let kw=this.state.kw2||'';
        let type=this.state.courseType2||'';
        let gradeId=this.state.gradeId2||'';
        let classId=this.state.classId2||'';
        let url=portUrl("/manager/course/get-chosen-course-student-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&semesterId="+semesterId+"&kw="+kw+"&type="+type+"&gradeId="+gradeId+"&classId="+classId)
        this.setState({exportUrl:url})
    }
    export2=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:????????????,3:APP??????
        let userId=sessionStorage.getItem("userId");
        let semesterId=this.state.semesterId3;
        if(!semesterId){
          message.warn("??????????????????")
          return
        }
        let kw=this.state.kw3||'';
        let type=this.state.courseType3||'';
        let gradeId=this.state.gradeId3||'';
        let classId=this.state.classId3||'';

        let url=portUrl("/manager/course/get-not-chosen-course-student-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&semesterId="+semesterId+"&kw="+kw+"&type="+type+"&gradeId="+gradeId+"&classId="+classId)
        this.setState({exportUrl:url})
    }

    // ????????????
    createSchedule = () =>{
      this.props.dispatch({
        type:'association/createSchedule',
        callback:(res)=>{
           if(res.code === 200){
               message.success(res.msg)
           }
        }
      })
    }
   
  
    render(){
        const columns = [{
            title: '??????',
            dataIndex: 'courseName',
            key:'courseName'
          },{
            title: '????????????',
            dataIndex: 'teacherName',
            key:'teacherName',
          },{
            title: '????????????',
            dataIndex: 'groupName',
            key:'groupName',
            render:(record)=>{
              return(
                <span>
                  <Tooltip placement="top" title={record}>
                    <span className="des-content">{record}</span>
                  </Tooltip>
                </span>
              )
            }
          },{
            title: '????????????',
            dataIndex: 'courseTime',
            key:'courseTime',
            render:(courseTime) => (
              <span>
                {this.generateWeek(courseTime[0])} {courseTime[1]}
              </span>
            )
          },{
            title: '????????????/??????',
            dataIndex: 'num',
            key:'num',
            render:(num) => (
              <span>
                {num[0]}
              </span>
            )
          },{
            title: '??????',
            dataIndex: "id",
            render:(id) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.toDetail.bind(this, id)}>??????</a>
              </span>
            )
          }];
        const columns1 = [{
          title: '??????',
          dataIndex: 'personName',
          key:'personName'
        },{
          title: '??????',
          dataIndex: 'sex',
          key:'sex',
          render:(sex) => (
            <span>
             {sex==1?"???":"???"}
            </span>
          )
        },{
          title: '??????',
          dataIndex: 'gradeName',
          key:'gradeName',
        },{
          title: '??????',
          dataIndex: 'className',
          key:'className',
        },{
          title: '????????????',
          dataIndex: 'courseName',
          key:'courseName',
        },{
          title: '????????????',
          dataIndex: 'applyTime',
          key:'applyTime',
          render:(applyTime) => (
            <span>
             {formatDate(applyTime)}
            </span>
          )
        }];
        const columns2 = [{
          title: '??????',
          dataIndex: 'personName',
          key:'personName'
        },{
          title: '??????',
          dataIndex: 'sex',
          key:'sex',
          render:(sex) => (
            <span>
             {sex==1?"???":"???"}
            </span>
          )
        },{
          title: '??????',
          dataIndex: 'gradeName',
          key:'gradeName',
        },{
          title: '??????',
          dataIndex: 'className',
          key:'className',
        }
        ]
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {classCourseList, semestersList, classRoomList, gradeList1, classList1, gradeList2, classList2, num} = this.props;
          const {classList} = this.state

          const option = semestersList&&semestersList.map((item)=>{
            return <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
          })
          const option1 = classRoomList&&classRoomList.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          })
          const option2 = classRoomList&&classRoomList.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          })
       
          const option3 = classList&&classList.map((item, index)=>{
            return <Option key={index} value={item.subjectId}>{item.subjectName}</Option>
          })

          const option4 = gradeList1&&gradeList1.map((item, index)=>{
            return <Option key={index} value={item.gradeId}>{item.gradeName}</Option>
          })

          const option5 = classList1&&classList1.map((item, index)=>{
            return <Option key={index} value={item.classId}>{item.className}</Option>
          })

          const option6 = gradeList2&&gradeList2.map((item, index)=>{
            return <Option key={index} value={item.gradeId}>{item.gradeName}</Option>
          })

          const option7 = classList2&&classList2.map((item, index)=>{
            return <Option key={index} value={item.classId}>{item.className}</Option>
          })
          if(!classCourseList){
            return null;
          }
          classCourseList.dataList&&classCourseList.dataList.map(item=>{
            item.startEndTime = [item.startTime, item.endTime]
            item.courseTime = [item.week, item.sectionName]
          })
       
          const schoolId=sessionStorage.getItem("schoolId");
          let url=getSign({schoolId:schoolId},"/other/electives-schedule/create-schedule?")
        return (
            <div className="content-main association association-statistics">
            <Button className="btn-generate" type="primary" onClick={this.createSchedule.bind(this)}>????????????</Button>
            <Tabs defaultActiveKey="1">
              <TabPane tab="????????????" key="1">
                <Row className="row-p10">
                    <Select placeholder="???????????????" value={this.state.semesterId1} onChange={this.handleChange1.bind(this)} style={{ width: 200 }}>
                        <Option value="">??????</Option>
                        {option}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="?????????????????????" value={this.state.courseType1} onChange={this.handleChange2.bind(this)} style={{ width: 200 }} >
                        <Option value="">??????</Option>
                        <Option value="2">?????????</Option>
                        <Option value="3">?????????</Option>
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.courseId1} onChange={this.handleChange3.bind(this)} style={{ width: 200 }} >
                        <Option value="">??????</Option>
                        {option3}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.search1.bind(this)}>??????</Button>
                </Row>
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.classCourse&&this.state.classCourse.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.classCourse&&this.state.classCourse.totalCount} 
                totalPage={this.state.classCourse&&this.state.classCourse.totalPage}
                currentPage={this.state.classCourse&&this.state.classCourse.currentPage}/>
                
              
              </TabPane>
              <TabPane tab="???????????????" key="2">
                <Row className="row-p10">
                    <Search
                      placeholder="???????????????"
                      onSearch={value => console.log(value)}
                      style={{ width: 160 }}
                      value={this.state.kw2}
                      onChange={this.handleChange4}
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.semesterId2} onChange={this.handleChange5.bind(this)} style={{ width: 160 }}>
                        {option}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="?????????????????????" value={this.state.courseType2} onChange={this.handleChange6.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        <Option value="2">?????????</Option>
                        <Option value="3">?????????</Option>
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.gradeId2} onChange={this.handleChange7.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        {option4}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.classId2} onChange={this.handleChange8.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        {option5}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.search2.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary"><a href={this.state.exportUrl} onClick={this.export1.bind(this)}>??????</a></Button>
                </Row>
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns1} dataSource={this.state.chosenCourseStudent&&this.state.chosenCourseStudent.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange1.bind(this)} total={this.state.chosenCourseStudent&&this.state.chosenCourseStudent.totalCount} 
                totalPage={this.state.chosenCourseStudent&&this.state.chosenCourseStudent.totalPage}
                currentPage={this.state.chosenCourseStudent&&this.state.chosenCourseStudent.currentPage}/>
                
              </TabPane>
              <TabPane tab="???????????????" key="3">
                <Row className="row-p10">
                      <Search
                      placeholder="???????????????"
                      onSearch={value => console.log(value)}
                      style={{ width: 160 }}
                      value={this.state.kw3}
                      onChange={this.handleChange9}
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.semesterId3} onChange={this.handleChange10.bind(this)} style={{ width: 160 }}>
                        {option}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="?????????????????????" value={this.state.courseType3} onChange={this.handleChange11.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        <Option value="2">?????????</Option>
                        <Option value="3">?????????</Option>
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.gradeId3} onChange={this.handleChange12.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        {option6}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="???????????????" value={this.state.classId3} onChange={this.handleChange13.bind(this)} style={{ width: 160 }} >
                        <Option value="">??????</Option>
                        {option7}
                    </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.search3.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary"><a href={this.state.exportUrl} onClick={this.export2.bind(this)}>??????</a></Button>
                </Row>
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns2} dataSource={this.state.notChosenCourseStudent&&this.state.notChosenCourseStudent.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange2.bind(this)} total={this.state.notChosenCourseStudent&&this.state.notChosenCourseStudent.totalCount} 
                totalPage={this.state.notChosenCourseStudent&&this.state.notChosenCourseStudent.totalPage}
                currentPage={this.state.notChosenCourseStudent&&this.state.notChosenCourseStudent.currentPage}/>
                
              </TabPane>
            </Tabs>
            {/* <Modal className="schedule-modal" width={700}
                    title={"????????????"}
                    visible={this.state.visibleSchedule}
                    onCancel={this.handleScheduleCancel}
                    footer={null}
                    style={{width:"500px"}}
                    bodyStyle={{minHeight:"240px"}}
                    >
                    <iframe name="myiframe" id="myrame" src={this.state.visibleSchedule?url:""} frameborder="0" align="left" width="200" height="200" scrolling="no">
                        <head>
                        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
                        </head>
                        <p>????????????????????????iframe??????</p>
                    </iframe>
              </Modal>
            */}
            </div>

        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     classList: state.association.dataList,
     classCourseList: state.association,
     semestersList: state.association.semestersList,
     classRoomList: state.association.classRoomList,
     gradeList1: state.association.gradeList1,
     classList1: state.association.classList1,
     gradeList2: state.association.gradeList1,
     classList2: state.association.classList2,
  }
}
export default connect(mapStateToProps)(Form.create()(AssociationClassStatistics));
