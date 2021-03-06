import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Modal, Checkbox ,Tree,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination, Upload  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { getSign, portUrl, getUpload} from "../../utils/img";
import md5 from 'md5';
import RedBox from 'redbox-react';

const { TreeNode, TreeSelect } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class ScheduleManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            visibleAdd: false,
            visibleEdit: false,
            visibleDel: false,
            visibleDelAll:false,
            // visibleSchedule:false,
            visibleError:false,
            classTree:[],
            options:[],
            schedule:[],
            modalAdd: [
                {
                    classType:'',
                    subjectId:'',
                    teacherIds:''
                }
            ],
            classIds: [],
            classId:'',
            semesterId: '',
            editData:{},
            gradeName:'',
            className:'',
            file: '',
            selectArr:[],
            importErr:"",
            errorSubjects:[],
            errorTeachers:[],
            exportUrl:'',
        };
    }

    componentDidMount=()=>{
       this.getClassTree();
       const params={
        "kw":"",
        "page":1,
        "prePage":20
        } 
        this.getSemesters(params);
        this.getSubject();
        this.getTeacher();
        this.getScheduleConfig();
    }

    getClassTree=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/getClassTree',
            payload:"",
            callback:(res)=>{
                if(res.code===200){
                  if(!res.data) return;
                  let allClassId=[];
                  let result=res.data;
                  result.map(item=>{
                    item.classData.map(i=>{
                        allClassId.push(i.classId)
                    })
                  })
                  
                _this.setState({
                    classTree: res.data,
                    classIds: allClassId
                })
                }
              }
        })
    }

    getSemesters=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/termList',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    _this.setState({
                        options: res.data.dataList
                    })
                }
              }
        })
    }


    // ????????????
    getSchedules=(params)=>{
        let _this = this
        this.props.dispatch({
            type:'schedule/getSchedules',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                   _this.setState({
                        schedule: res.data.schedules,
                        scheduleId: res.data.scheduleId,

                    })
                }
              }
        })
    }

    getSubject=()=>{
        this.props.dispatch({
            type:'schedule/getSubject',
            payload:{
                type: 1
            },
        })
    }

    getTeacher=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/getTeacher',
            payload: {"personType": 2, "status": 1}
        })
    }

    //????????????
    saveSchedules=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/saveSchedules',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                    message.success('???????????????');
                     this.setState({
                        visibleEdit: false,
                        modalAdd: [
                            {
                                classType:'',
                                subjectId:'',
                                teacherIds:''
                            }
                        ],
                    });
                    const params={
                        "classId": this.state.classId,
                        "semesterId": this.state.semesterId,
                    }
                    this.getSchedules(params)
                }
              }
        })
    }

    //????????????
    uploadSchedules=()=>{
        if(!this.state.classId){
            message.warning('?????????????????????????????????');
            return;
        }else if(!this.state.semesterId){
            message.warning('?????????????????????????????????');
            return;
        }else if(!this.state.file){
            message.warning('?????????????????????????????????');
            return;
        }

        let _this=this
        const params = new FormData()
        params.append('excel', this.state.file)
        params.append('classId', this.state.classId)
        params.append('semesterId', this.state.semesterId)
        this.props.dispatch({
            type:'schedule/uploadSchedules',
            payload: params,
            callback:(res)=>{
                this.setState({file: ''})
                this.props.form.resetFields(["excel"])
                if(res.data.hasError){
                    this.setState({
                        visibleError: true,
                        importErr: res.msg,
                        errorSubjects: res.data.errorSubjects,
                        errorTeachers: res.data.errorTeachers,
                        file:''
                    })
                    this.props.form.resetFields(["excel"])
                }else{
                    message.success('??????????????????????????????????????????????????????????????????');
                    const params={
                        "classId": this.state.classId,
                        "semesterId": this.state.semesterId,
                    }
                    this.props.form.resetFields(["excel"])
                    this.getSchedules(params)
                }
              }
        })
    }

     //????????????????????????
     getScheduleConfig=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/getScheduleConfig',
            payload: {},
            callback:(res)=>{
                if(res.code===200){
                    let arr=[];
                    if (!res.data) return;
                    if(res.data.isShowTime==1){
                        arr.push("1")
                    }
                    if(res.data.isShowAddr==1){
                        arr.push("2")
                    }
                    if(res.data.isShowTeacher==1){
                        arr.push("3")
                    }
                    this.setState({
                        selectArr: arr
                    })
                }
              }
        })
    }

    //??????????????????
    setScheduleConfig=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/setScheduleConfig',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                    message.success("?????????????????????")
                }else{
                    message.error("?????????????????????")
                }
              }
        })
    }

    addOption=()=>{
        let newAdd=this.state.modalAdd
        newAdd.push({
            classType:'',
            subjectId:'',
            teacherIds:''
        })
        this.setState({
            modalAdd: newAdd
        })
    }

    minusOption=(index)=>{
        let newAdd=this.state.modalAdd
        newAdd.splice(index,1)
        this.setState({
            modalAdd: newAdd
        })
    }

    editClass=(timeId, week) =>{
        const params = {
         "classId": this.state.classId,
         "semesterId": this.state.semesterId,
         "timeId": timeId,
         "week": week,
        }
         this.props.dispatch({
             type:'schedule/getScheduleDetail',
             payload:params,
             callback:(res)=>{
                 if(res.code === 200){
                     let newAdd = []
                     res.data.schedules && res.data.schedules.map(item =>{
                         newAdd.push({
                             "classType": item.classType,
                             "subjectId": item.subjectId,
                             "teacherIds": item.teacherIds
                         })
                     })
             
                     this.setState({
                         visibleEdit: true,
                         editData:{
                             timeId: timeId,
                             week: week,
                             className: res.data.className,
                             sectionName: res.data.sectionName,
                             sectionTime: res.data.sectionTime,
                             weekName: res.data.weekName,
                         },
                         modalAdd: newAdd
                     })
                 }
             }
         })
     }

    onChange=(value)=> {
        console.log('changed', value);
    }

    onChange1=(e)=> {
        const file = e.target.files[0]
        this.setState({
            file: file
        })
    }
    
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        console.log(info.node.props);
        this.setState({
            gradeName: info.node.props.gradeName,
            className: info.node.props.className
        })
        //????????????this.setState???????????????
        this.setState({
            classId: selectedKeys[0]
        },()=>{
            if(this.state.semesterId&&this.state.classId){
                const params={
                    "classId": this.state.classId,
                    "semesterId": this.state.semesterId,
                }
                this.getSchedules(params)
            }
        })
    }
    
    handleChange1=(value)=> {
        console.log(`selected ${value}`);
        this.setState({
            semesterId: value
        })
        if(!this.state.classId){
            message.warning('??????????????????????????????');
            return
        }
        const params={
            "classId": this.state.classId,
            "semesterId": value,
            }
        this.getSchedules(params)
    }

    handleOption1=(index, value)=>{
        console.log(index, value)
        let newAdd=this.state.modalAdd
        newAdd[index].classType=value
        this.setState(
            {modalAdd: newAdd}
        )
    }

    handleOption2=(index, value)=>{
        let newAdd=this.state.modalAdd
        newAdd[index].subjectId=value
        this.setState(
            {modalAdd: newAdd}
        )
    }

    handleOption3=(index, value)=>{
        let newAdd=this.state.modalAdd
        newAdd[index].teacherIds=value
        this.setState(
            {modalAdd: newAdd}
        )
    }

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }

    placeAdd = () => {
        this.setState({
            visibleAdd: true,
        });
    }
    
    placeDel = () => {
        this.setState({
            visibleDel: true,
        });
    }

       
    placeDelAll = () => {
        this.setState({
            visibleDelAll: true,
        });
    }

    handleAddOk = (e) => {
        console.log(e);
        message.warning('??????????????????')
        return;
        this.setState({
            visibleAdd: false,
        });
    }

    placeEdit = () => {
        this.setState({
            visibleEdit: true,
        });
    }
    
    handleEditOk = (e) => {
        console.log(this.state.modalAdd)
        let classTypeArr=[];
        let subjectIdArr=[];
        let teacherIdArr=[];
        this.state.modalAdd.map(function(item){
            classTypeArr.push(item.classType)
            subjectIdArr.push(item.subjectId)
            teacherIdArr.push(item.teacherIds)
        })
        if(classTypeArr.indexOf("")>-1||subjectIdArr.indexOf("")>-1||teacherIdArr.indexOf("")>-1){
            message.warning("????????????????????????")
            return
        }
    
        const params={
            "classId": this.state.classId,
            "semesterId": this.state.semesterId,
            'timeId': this.state.editData.timeId,
            'week': this.state.editData.week,
            'schedules': this.state.modalAdd
        }
     
        if(classTypeArr.length==2){
            if(classTypeArr.indexOf("1")!=-1){
                message.warning('??????/?????????????????????????????????/???????????????????????????')
                return
            }
            if(classTypeArr.indexOf("2")==-1||classTypeArr.indexOf("3")==-1){
                message.warning('??????/?????????????????????????????????/???????????????????????????')
                return
            }
        }
        this.saveSchedules(params)
        console.log(classTypeArr, subjectIdArr, teacherIdArr)
        
        // this.setState({
        //     visibleEdit: false,
        // });
    }
    
    handleEditCancel = (e) => {
        this.setState({
            visibleEdit: false,
            visibleError: false,
        });
        this.props.form.resetFields(["excel"])
        
    }

    updateWeekSchedule= () => {
        this.props.dispatch({
            type:'schedule/updateWeekSchedule',
            payload: {},
            callback:(res)=>{
               if(res.code === 200){
                   message.success(res.msg)
               }
            }
        })
        
    }
    // showScheduleModal = (num) => {
    //     this.setState({
    //         visibleSchedule: true,num:num
    //     });
    //     console.log(num)
    // }
    // handleScheduleCancel = (e) => {
    //     this.setState({
    //         visibleSchedule: false,
    //     });
    // }

    // ??????????????????
    scheduleSync = () =>{
        this.props.dispatch({
            type:'schedule/scheduleSync',
            callback:(res)=>{
               if(res.code === 200){
                   message.success(res.msg)
               }
            }
        })
    }
    // ??????????????????
    scheduleSync1 = () =>{
        this.props.dispatch({
            type:'schedule/scheduleSync1',
            callback:(res)=>{
               if(res.code === 200){
                   message.success(res.msg)
               }
            }
        })
    }

    handleDelOk = (e) => {
        this.setState({
            visibleDel: false,
        });
    }
    
    handleDelCancel = (e) => {
        console.log(e);
        this.setState({
            visibleDel: false,
        });
    }

    handleDelAllOk = (e) => {
        this.setState({
            visibleDelAll: false,
        });
    }
    
    handleDelAllCancel = (e) => {
        console.log(e);
        this.setState({
            visibleDelAll: false,
        });
    }
    
    handleAddCancel = (e) => {
        console.log(e);
        this.setState({
            visibleAdd: false,
        });
    }

    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    
    newTerm=()=>{
        this.props.dispatch(
            routerRedux.push("/new-term")
        )
    }

    onChange2 = (checkedValues)=> {
        console.log('checked = ', checkedValues);
        this.setState({
            selectArr: checkedValues
        })
        const params={
            isShowTime: checkedValues.indexOf("1")>-1 ? "1" : "0",
            isShowAddr: checkedValues.indexOf("2")>-1 ? "1" : "0",
            isShowTeacher: checkedValues.indexOf("3")>-1 ? "1" : "0",
        }
        this.setScheduleConfig(params)
    }

    // ????????????
    exportSchedules = () =>{
        if(this.state.classId == ''){
            message.warning('???????????????!');
            return;
        }else if(this.state.semesterId == ''){
            message.warning('???????????????!');
            return;
        }
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:????????????,3:APP??????
        let userId=sessionStorage.getItem("userId");
        let classId = this.state.classId;
        let semesterId = this.state.semesterId;
        let url=portUrl("/manager/schedules/class-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&classId="+classId+"&semesterId="+semesterId)
        this.setState({exportUrl:url})
    }
    // ??????????????????
    updateSchedules = () =>{
        if(this.state.classId == ''){
            message.warning('???????????????!');
            return;
        }else if(this.state.semesterId == ''){
            message.warning('???????????????!');
            return;
        }
        const params = {
            "classId":this.state.classId,
            "semesterId":this.state.semesterId,
        }
        this.props.dispatch({
            type:'schedule/updateSchedules',
            payload: params,
            callback:(res)=>{
               if(res.code === 200){
                   message.success(res.msg)
               }
            }
        })

    }

    render(){
        let _this=this;
        const options1 = [
            { label: '????????????', value: '1' },
            { label: '????????????', value: '2' },
            { label: '????????????', value: '3' },
          ];
        const { getFieldDecorator } = this.props.form;
        const {subject, teacher} = this.props
        // debugger
        const {classTree, options, schedule, modalAdd, num}= this.state;
        const tree = classTree.map(function(item){
            return   <TreeNode title={item.gradeName} selectable={false} gradeName={item.gradeName} key={"g_id" + item.gradeId}>
                        {
                            item.classData.map(function(i){
                                return <TreeNode title={i.className} gradeName={item.gradeName} className={i.className} key={i.classId} ></TreeNode>
                            })
                        }
                     </TreeNode>
         })

         const option = options.map(function(item){
            return  <Option key={'option_' + item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
         })

       
         const schedule1 = schedule.map(function(item){
            let items=[]
            let htmlPlate
            for(var key in item.scheduleInfo){
                if(item.scheduleInfo[key].length == 2){
                    htmlPlate = {__html:"<span class=color"+(item.scheduleInfo[key][0].classType == 2?'2':(item.scheduleInfo[key][0].classType == 3?'3':''))+">"+
                    item.scheduleInfo[key][0].subjectName+"-" + item.scheduleInfo[key][0].teacherNames +"</span>"+"</br>"+
                    "<span class=color"+(item.scheduleInfo[key][1].classType == 2?'2':(item.scheduleInfo[key][1].classType == 3?'3':''))+">"+item.scheduleInfo[key][1].subjectName+"-" + item.scheduleInfo[key][1].teacherNames +"</span>"}
                }else if(item.scheduleInfo[key].length == 1){
                    htmlPlate = {__html:"<span class=color"+(item.scheduleInfo[key][0].classType == 2?'2':(item.scheduleInfo[key][0].classType == 3?'3':''))+">"+
                    item.scheduleInfo[key][0].subjectName+"-" + item.scheduleInfo[key][0].teacherNames +"</span>"}
                }else{
                    htmlPlate = {__html:""}
                }

                items.push(<td id={item.scheduleInfo[key].infoId}
                    onDoubleClick={_this.editClass.bind(this, item.timeId, key)} dangerouslySetInnerHTML={htmlPlate}>
                </td>)
            }
            return  <tr key={item.timeId} >
                        <td>
                            {item.sectionName}
                        </td>
                        {items}
                    </tr>
         })

        let option1 = subject&&subject.map(function(item){
            return  <Option key={item.subjectId} value={item.subjectId} >{item.subjectName}</Option>
        })

        let option2 = teacher&&teacher.map(function(item){
            return  <Option key={item.personId} value={item.personId}>{item.personName}</Option>
            // return  <Option value={item.personId}>{item.personName}
            // ???{(!!item.idCardNo)?(item.idCardNo?item.idCardNo.substring(item.idCardNo.length-4):""):(item.usin?item.usin.substring(item.usin.length-4):"")}???</Option>
        })

        const modalAdd1 = modalAdd.map((item, index) =>{
            return   <Row>
                        <Col span={20}>
                            <Select placeholder="?????????" value={item.classType?item.classType:""} onChange={_this.handleOption1.bind(this, index)} style={{ width: 120 }}>
                                <Option value="1">??????</Option>
                                <Option value="2">??????</Option>
                                <Option value="3">??????</Option>
                            </Select>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;?????????</label>
                            <Select placeholder="?????????"
                                showSearch
                                value={item.subjectId?item.subjectId:""}
                                onChange={_this.handleOption2.bind(this, index)}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ width: 220 }} >
                                {option1}
                            </Select>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;?????????</label>
                            <Select placeholder="?????????"
                                showSearch
                                value={item.teacherIds?item.teacherIds:""} 
                                onChange={_this.handleOption3.bind(this, index)}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ width: 160 }} >
                                {option2}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Icon type="minus-circle" theme="twoTone" onClick={_this.minusOption.bind(this, index)} style={{ fontSize: '30px', cursor: "pointer", position: "relative" , top: "5px"}} />
                        </Col>
                    </Row>
         })
         const schoolId=sessionStorage.getItem("schoolId");
         let url='';
         if(num==1){ //????????????
            url=getSign({schoolId:schoolId},"/other/schedule/make-week-schedule?")
         }else if(num==2){ //????????????
            url=getSign({schoolId:schoolId},"/other/changhong/sync-schedules?")
         }else if(num==3){ //????????????
            url=getSign({schoolId:schoolId},"/other/seiue/sync-schedules?")
         }else{ //????????????
            url=getSign({schoolId:schoolId},"/other/t7/sync-schedules?")
         }
         console.log(url)
         return (
            <div className="content-main content-building content-schedule">
                <div className="content-box">
                    <Breadcrumb>
                        {/* <Breadcrumb.Item>????????????</Breadcrumb.Item> */}
                    </Breadcrumb>
                    <Row style={{paddingBottom:20}}>
                            <Col span={4} >
                                <label>?????????????????????????????????</label>
                                <Tree
                                    showLine
                                    onSelect={this.onSelect}
                                >
                                {tree}    
                                </Tree>
                            
                            </Col>
                            <Col span={20} >
                                    <Row>
                                        <Button type="primary" onClick={this.updateWeekSchedule.bind(this,1)}>??????????????????</Button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button type="primary" onClick={this.scheduleSync.bind(this)}>??????????????????</Button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            schoolId==111?null:<Button type="primary" onClick={this.scheduleSync1.bind(this)}>??????????????????</Button>
                                        }
                                        
                                        {/* <Button type="primary" onClick={this.showScheduleModal.bind(this,4)}>??????????????????</Button> */}
                                    </Row>
                                    <Row>
                                        <Select placeholder="???????????????" style={{ width: 200 }} onChange={this.handleChange1}>
                                            {option}
                                        </Select>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button type="primary" onClick={this.uploadSchedules}>????????????</Button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {/* <form style={{display: "inline-block"}}>
                                            <input type="file" name="file" onChange={this.onChange1} />
                                        </form> */}
                                        <Form style={{display: "inline-block"}}>
                                            <FormItem >
                                                {getFieldDecorator("excel",{initialValue:''})(
                                                    <Input style={{border:"none"}} type="file" name="file" onChange={this.onChange1.bind(this)} single="true"/>
                                                )}
                                            </FormItem>
                                        </Form>
                                        <a href={getUpload("??????????????????.xlsx")}>????????????</a>
                                        <Button style={{margin:"0 20px"}} type="primary">
                                            <a href={this.state.classId&&this.state.semesterId?this.state.exportUrl:"javascript:;"} onClick={this.exportSchedules.bind(this)}>????????????</a>
                                        </Button>
                                        <Button type="primary" onClick={this.updateSchedules}>??????????????????</Button>
                                        </Row>
                                        <Row>
                                        <label>??????????????????</label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <CheckboxGroup options={options1} value={this.state.selectArr} onChange={this.onChange2} />

                                    </Row>
                                <table className="schedule">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                            <th>?????????</th>
                                        </tr>
                                    {schedule1}
                                    </tbody>
                                </table>
                                <p className="tips">
                                    ??????<span className="t-red">??????</span>??????????????????<span className="t-green">??????</span>??????????????????<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;???????????????????????????????????????????????????????????????????????????
                                </p>
                            </Col>
                    </Row>
                </div>
                {/* <Modal className="schedule-modal" width={700}
                    title={num==1?"??????????????????":(num==2?"??????????????????":(num==3?"??????????????????":"??????????????????"))}
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
                </Modal> */}
                <Modal className="edit-modal schedule-modal" width={800}
                    title="????????????"
                    visible={this.state.visibleEdit}
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>??????</Button>,
                        <Button key="submit" type="primary" onClick={this.handleEditOk}>
                            ??????
                        </Button>,
                        ]}
                    >
                    <Row>
                        <Col span={12}>?????????{this.state.editData.className}</Col>
                        <Col span={12}>?????????{this.state.editData.weekName}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>?????????{this.state.editData.sectionName}</Col>
                        <Col span={12}>?????????{this.state.editData.sectionTime}</Col>
                    </Row>
                        {modalAdd1}
                    {  
                        _this.state.modalAdd.length<2?
                        <Row>
                            <Col span={4} offset={20}>
                                <Icon type="plus-circle" theme="twoTone" onClick={_this.addOption} style={{ fontSize: '30px', cursor: "pointer", position: "relative" , top: "5px"}} />
                            </Col>
                        </Row>
                        :""
                    }
                </Modal>
                <Modal className="error-modal" width={700}
                    title="??????"
                    visible={this.state.visibleError}
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        // <Button key="back" onClick={this.handleEditCancel}>??????</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleEditCancel}>
                            ????????????
                        </Button>,
                        ]}
                    >
                    <Row>
                        <p style={{display: (_this.state.errorTeachers&&_this.state.errorTeachers.length!=0)?"block":"none"}}>????????????????????? ??????: {_this.state.errorTeachers&&_this.state.errorTeachers.join(" , ")} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to={"/teacher-manage"}>???????????????</Link> </p>
                        <p style={{display: (_this.state.errorSubjects&&_this.state.errorSubjects.length!=0)?"block":"none"}}>????????????????????? ??????: {_this.state.errorSubjects&&_this.state.errorSubjects.join(" , ")} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;??????????????????</p>
                        <p>{_this.state.importErr}</p>
                    </Row>
                        <p style={{textAlign: "right",color: "#929292"}}>????????????/????????????????????????????????????</p>
                </Modal>


            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    subject: state.schedule.subject,
    teacher: state.schedule.teacher
  }
}

export default connect(mapStateToProps)(Form.create()(ScheduleManage));
