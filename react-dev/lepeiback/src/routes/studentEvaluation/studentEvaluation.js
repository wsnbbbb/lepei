import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Divider,Breadcrumb,Tabs,message,Modal,DatePicker,Icon,Tooltip } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate} from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';
import echarts from 'echarts';
import ImgPreview from '@/components/imgPreview'

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker, MonthPicker, WeekPicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class studentEvaluation extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          previewVisible: false,
          licenceUrl:"",
          page:1,
          prePage:20,
          controlBtn:false,
          semesterId1:undefined,
          gradeId1:undefined,
          classId:null,
          startDate1:null,
          endDate1:null,
          scoreDetail:[],
          classPointDetail: [],
          detailDateStr: '',
          classPointRank: [],
          personScore: null,
          titleGrade: undefined,
          titleClass: undefined,
          title: undefined,
          semesterId2:undefined,
          gradeId2:undefined,
          classId2:undefined,
          startDate2:null,
          endDate2:null,
          scoreDetail1:[],
          personRecordDetail: [],
          personName:null,
          avgScore: null,
          personNum: null,
          showPersonName: undefined,
          personPie: undefined,
          personRankData: undefined,
          maxScore:undefined,
          avgScore:undefined,
          semesterId3:undefined,
          gradeId3:undefined,
          classId3:undefined,
          startDate3:null,
          endDate3:null,
          scoreDetail2:[],
          groupPie: {},
          personRankData1: []
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getTemplate(params)
      this.termList()
      this.gradeList()
      this.getPointTeacher()
   
    }
    handleEnterKey = (e) => {
      if(e.keyCode === 13){ //????????????????????????????????????????????????keyCode??????
           this.search()
      }
  }
    getTemplate=(params)=>{
      this.props.dispatch({
        type:'evaluation/templateList', 
        payload: params,
        
      })
    }
    termList=()=>{
      this.props.dispatch({
        type:'evaluation/termList',
        payload: {}
      })
    }
    gradeList=()=>{
      this.props.dispatch({
        type:'evaluation/allGrades',
        payload: {status: 1}
      })
    }
    classList=(params)=>{
      this.props.dispatch({
        type:'evaluation/getClassList',
        payload: params
      })
    }
    getPointTeacher=()=>{
      this.props.dispatch({
        type:'evaluation/getPointTeacher1',
        payload: { status: 1}
      })
    }
 
    closePreview=()=>{
      this.setState({
          previewVisible: false
      })
    }

    showImg=(url)=>{
      this.setState({
          previewVisible: true,
          licenceUrl: getImg(url)
      })
    }

    checkDetail=(pointId)=>{
      this.setState({
        classPointDetail: []
      })
      const params={
        "pointId": pointId,
        "classId":this.state.classId1,
        "startDate":this.state.startDate1,
        "endDate":this.state.endDate1,
      }
      this.props.dispatch({
        type:'evaluation/classPointDetail',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              classPointDetail: res.data.dataList,
              detailDateStr: this.state.startDate1 + "~" + this.state.endDate1
            })
          }
        }
      })
    }

    checkDetail1=(personId, personName)=>{
      this.setState({
        personRecordDetail: []
      })
      const params={
        "studentId": personId,
        "teacherId": this.state.teacherId2,
        "gradeId": this.state.gradeId2,
        "classId":this.state.classId2,
        "startDate":this.state.startDate2,
        "endDate":this.state.endDate2,
        "semesterId":this.state.semesterId2,
      }
      
      this.props.dispatch({
        type:'evaluation/personRecordDetail',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personRecordDetail: res.data.dataList,
              showPersonName: personName
              // detailDateStr: this.state.startDate1 + "~" + this.state.endDate1
            })
          }
        }
      })


      const params1={
        "studentId": personId,
        "teacherId": this.state.teacherId2,
        "gradeId": this.state.gradeId2,
        "classId":this.state.classId2,
        "startDate":this.state.startDate2,
        "endDate":this.state.endDate2,
        "semesterId":this.state.semesterId2,
      }

      this.props.dispatch({
        type:'evaluation/personPieData',
        payload: params1,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personPie: res.data
            })
            const myChart = echarts.init(document.getElementById('circle-box-left-graph1'));
            let option = {
              
               legend: {
                   orient: 'vertical',
                   x: 'left',
                   data:['????????????','']
               },
               color:['#1890FF', '#B7DDFF'],
               series: [
                   {
                       name:'????????????',
                       type:'pie',
                       radius: ['50%', '70%'],
                       avoidLabelOverlap: false,
                       label: {
                           normal: {
                               show: false,
                               position: 'center'
                           },
                           emphasis: {
                               show: true,
                               textStyle: {
                                   fontSize: '30',
                                   fontWeight: 'bold'
                               }
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data:[
                           {value: parseFloat(this.state.personPie.totalScore), name:'????????????'},
                           {value: parseFloat(this.state.personPie.maxScore), name:''},
                          
                       ]
                   }
               ]
           };
           
             myChart.setOption(option);

          }
        }
      })

      const params2={
        "studentId": personId,
        "teacherId": this.state.teacherId2,
        "gradeId": this.state.gradeId2,
        "startDate":this.state.startDate2,
        "endDate":this.state.endDate2,
        "semesterId":this.state.semesterId2,
      }

      this.props.dispatch({
        type:'evaluation/studentPointRank',
        payload: params2,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personRankData: res.data.dataList
            })
          }
        }
      })

    }
    
    checkDetail2=(id, personName, maxScore, defaultScore, averageScore)=>{
      let data = {
        maxScore: maxScore,
        defaultScore: defaultScore,
        averageScore: averageScore
      }
      this.setState({
        personRecordDetail: [],
        groupPie: data
      })
      const params={
        "teacherId": this.state.teacherId3,
        "gradeId": this.state.gradeId3,
        "classId":this.state.classId3,
        "startDate":this.state.startDate3,
        "endDate":this.state.endDate3,
        "semesterId":this.state.semesterId3,
        "groupId": id
      }
      
      this.props.dispatch({
        type:'evaluation/groupRecordDetail',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personRecordDetail: res.data.dataList,
              showPersonName: personName
              // detailDateStr: this.state.startDate1 + "~" + this.state.endDate1
            })
          }
        }
      })

      const params1={
        "studentId": id,
        "teacherId": this.state.teacherId3,
        "gradeId": this.state.gradeId3,
        "classId":this.state.classId3,
        "startDate":this.state.startDate3,
        "endDate":this.state.endDate3,
        "semesterId":this.state.semesterId3,
      }

      // this.props.dispatch({
      //   type:'evaluation/personPieData',
      //   payload: params1,
      //   callback: (res)=>{
      //     if(res.code===200){
      //       this.setState({
      //         personPie: res.data
      //       })
            const myChart = echarts.init(document.getElementById('circle-box-left-graph2'));
            let option = {
              
               legend: {
                   orient: 'vertical',
                   x: 'left',
                   data:['????????????','']
               },
               color:['#1890FF', '#B7DDFF'],
               series: [
                   {
                       name:'????????????',
                       type:'pie',
                       radius: ['50%', '70%'],
                       avoidLabelOverlap: false,
                       label: {
                           normal: {
                               show: false,
                               position: 'center'
                           },
                           emphasis: {
                               show: true,
                               textStyle: {
                                   fontSize: '30',
                                   fontWeight: 'bold'
                               }
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data:[
                           {value: parseFloat(maxScore), name:'????????????'},
                           {value: parseFloat(defaultScore), name:''},
                          
                       ]
                   }
               ]
           };
           
             myChart.setOption(option);

      //     }
      //   }
      // })

      const params2={
        "groupId": id,
        "teacherId": this.state.teacherId3,
        "startDate":this.state.startDate3,
        "endDate":this.state.endDate3,
        "semesterId":this.state.semesterId3,
      }

      this.props.dispatch({
        type:'evaluation/groupPointRank',
        payload: params2,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personRankData1: res.data.dataList
            })
          }
        }
      })

    }
    classScoreDetail=(params)=>{
      this.props.dispatch({
        type:'evaluation/classScoreDetail',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            res.data.dataList.map((item)=>{
              item.key=item.pointId
              item.record= [item.addScore, item.lessScore, item.pointId]
            })
            console.log(res.data.dataList)
            this.setState({
              scoreDetail: res.data.dataList
            })
          }
        }
      })
    }

    personScoredetail=(params)=>{
      this.setState({
        scoreDetail1: []
      })
      this.props.dispatch({
        type:'evaluation/personScoredetail',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            res.data.dataList.map((item)=>{
              item.key=parseInt(item.personId)
              item.record= [item.addScore, item.lessScore, parseInt(item.personId), item.personName]
            })
            // console.log(res.data.dataList)
            this.setState({
              scoreDetail1: res.data.dataList
            })
          }
        }
      })
    }

    groupList=(params)=>{
      this.setState({
        scoreDetail2: []
      })
      this.props.dispatch({
        type:'evaluation/groupList',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            res.data.dataList.map((item)=>{
              item.key=parseInt(item.personId)
              item.record= [item.addScore, item.lessScore, item.totalScore?item.totalScore:"", item.id, item.name, item.maxScore, item.defaultScore, item.averageScore]
            })
            // console.log(res.data.dataList)
            this.setState({
              scoreDetail2: res.data.dataList
            })
          }
        }
      })
    }

    personScore=(params)=>{
      this.props.dispatch({
        type:'evaluation/personScore',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              personScore: res.data,
              avgScore: res.data.avgScore,
              personNum: res.data.personNum,
              maxScore: res.data.maxScore,
              avgScore: res.data.avgScore

            })

           const myChart = echarts.init(document.getElementById('circle-box-left-graph'));
           let option = {
             
              legend: {
                  orient: 'vertical',
                  x: 'left',
                  data:['????????????','']
              },
              color:['#1890FF', '#B7DDFF'],
              series: [
                  {
                      name:'????????????',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      label: {
                          normal: {
                              show: false,
                              position: 'center'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '30',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:[
                          {value: parseFloat(this.state.avgScore), name:'????????????'},
                          {value: parseFloat(this.state.maxScore), name:''},
                         
                      ]
                  }
              ]
          };
          
            myChart.setOption(option);
          }
        }
      })
    }

    classPointRank=(params)=>{
      this.props.dispatch({
        type:'evaluation/classPointRank',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              classPointRank: res.data.dataList
            })
          }
        }
      })
    }

    checkClassScoreDetail=()=>{
      if(!this.state.semesterId1){
        message.warning("??????????????????")
        return
      }
      if(!this.state.gradeId1){
        message.warning("??????????????????")
        return
      }
      if(!this.state.classId1){
        message.warning("??????????????????")
        return
      }
      if(!this.state.startDate1){
        message.warning("????????????????????????")
        return
      }
      if(!this.state.endDate1){
        message.warning("????????????????????????")
        return
      }
      
      this.setState({
        scoreDetail: [],
        classPointRank: [],
        classScoreDetail:[],
        personScore: null,
        avgScore: null,
        personNum: null,
      })
      this.setState({
        title: this.state.titleGrade + ' ' + this.state.titleClass
      })
      const params={
        "semesterId":this.state.semesterId1,
        "gradeId":this.state.gradeId1,
        "classId":this.state.classId1,
        "startDate":this.state.startDate1,
        "endDate":this.state.endDate1,
        "prePage": 1000,
        "page":1
      }
      this.classScoreDetail(params)
      this.classPointRank(params)
      this.personScore(params)
    }

    checkPersonScoreDetail=()=>{
      if(!this.state.semesterId2){
        message.warning("??????????????????")
        return
      }
      if(!this.state.gradeId2){
        message.warning("??????????????????")
        return
      }
      if(!this.state.classId2){
        message.warning("??????????????????")
        return
      }
      if(!this.state.teacherId2){
        message.warning("??????????????????")
        return
      }
      if(!this.state.startDate2){
        message.warning("????????????????????????")
        return
      }
      if(!this.state.endDate2){
        message.warning("????????????????????????")
        return
      }
      this.setState({
        personRecordDetail: [],
      })
      const params={
        "semesterId":this.state.semesterId2,
        "gradeId":this.state.gradeId2,
        "classId":this.state.classId2,
        "teacherId":this.state.teacherId2,
        "startDate":this.state.startDate2,
        "endDate":this.state.endDate2,
      }
      this.personScoredetail(params)
    }

    checkGroupScoreDetail=()=>{
      if(!this.state.semesterId3){
        message.warning("??????????????????")
        return
      }
      if(!this.state.gradeId3){
        message.warning("??????????????????")
        return
      }
      if(!this.state.classId3){
        message.warning("??????????????????")
        return
      }
      if(!this.state.teacherId3){
        message.warning("??????????????????")
        return
      }
      if(!this.state.startDate3){
        message.warning("????????????????????????")
        return
      }
      if(!this.state.endDate3){
        message.warning("????????????????????????")
        return
      }
      this.setState({
        personRecordDetail: [],
      })
      const params={
        "semesterId":this.state.semesterId3,
        "gradeId":this.state.gradeId3,
        "classId":this.state.classId3,
        "teacherId":this.state.teacherId3,
        "startDate":this.state.startDate3,
        "endDate":this.state.endDate3,
      }
      this.groupList(params)
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
    toDetail = (id) => {
      this.props.dispatch(
        routerRedux.push("/essential-list/" + id)
      )
    }
    toManage = (id, commentType) => {
      sessionStorage.setItem("commentType", commentType)
      this.props.dispatch(
        routerRedux.push("/essential-manage/" + id)
      )
    }
    toEdit = (id) => {
      this.props.dispatch(
        routerRedux.push("/edit-template/" + id)
      )
    }
    newTemplate = () => {
      this.props.dispatch(
        routerRedux.push("/new-template")
      )
    }

    handleChange = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        semesterId1: value
      })
    }
    handleChange1 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.gradeList.filter(item=>{
        return item.gradeId == value
      })
      this.setState({
        classId1: undefined,
        gradeId1: value,
        titleGrade: currentItem[0].gradeName||""
      })
      this.classList({"gradeId": value, "status": 1})
    }
    handleChange2 = (value)=> {

      console.log(`selected ${value}`);
      let currentItem = this.props.classList.filter(item=>{
        return item.classId == value
      })
      this.setState({
        classId1: value,
        titleClass: currentItem[0].className||""
      })
    }
    handleChange3 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.pointTeacherList.filter(item=>{
        return item.personId == value
      })
      this.setState({
        teacherId2: value,
        titleClass: currentItem[0].name||""
      })
    }
    
    handleChange4 = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        semesterId2: value
      })
    }
    handleChange5 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.gradeList.filter(item=>{
        return item.gradeId == value
      })
      this.setState({
        classId2: undefined,
        gradeId2: value,
        titleGrade1: currentItem[0].gradeName||""
      })
      this.classList({"gradeId": value})
    }
    handleChange6 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.classList.filter(item=>{
        return item.classId == value
      })
      this.setState({
        classId2: value,
        titleClass1: currentItem[0].className||""
      })
    }

    handleChange7 = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        semesterId3: value
      })
    }

    handleChange8 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.gradeList.filter(item=>{
        return item.gradeId == value
      })
      this.setState({
        classId3: undefined,
        gradeId3: value,
        titleGrade1: currentItem[0].gradeName||""
      })
      this.classList({"gradeId": value})
    }
    handleChange9 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.classList.filter(item=>{
        return item.classId == value
      })
      this.setState({
        classId3: value,
        titleClass1: currentItem[0].className||""
      })
    }

    handleChange10 = (value)=> {
      console.log(`selected ${value}`);
      let currentItem = this.props.pointTeacherList.filter(item=>{
        return item.personId == value
      })
      this.setState({
        teacherId3: value,
        titleClass: currentItem[0].name||""
      })
    }

    onChange = (date, dateString)=> {
      console.log(date, dateString);
      this.setState({
        startDate1: dateString[0],
        endDate1: dateString[1]
      })
    }
    onChange1 = (date, dateString)=> {
      console.log(date, dateString);
      this.setState({
        startDate2: dateString[0],
        endDate2: dateString[1]
      })
    }
    onChange2 = (date, dateString)=> {
      console.log(date, dateString);
      this.setState({
        startDate3: dateString[0],
        endDate3: dateString[1]
      })
    }
    //????????????
    handleOk = () => {
      // this.setState({controlBtn:true})
      const {password,controlBtn,startDate,endDate} = this.state;
      console.log(startDate,endDate)
      this.props.form.validateFields((err, values) => {
        // if(!password||!endDate){
        //   return message.error('???????????????',2)
        // }
        if(!err){
          this.props.dispatch({
            type:'evaluation/addAccount',
            payload:{
              "userName": values.userName,
              "realName": this.state.realName,
              "password": md5(this.state.password),
              "checkPassword": md5(this.state.checkPassword)
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('???????????????',3)
                this.props.form.resetFields();
                this.setState({
                  visible: false,controlBtn:true
                });
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  "kw":values.kw||'',
                }
                this.getTemplate(params)
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
    // ??????
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
        }
        this.getTemplate(params)
      })
    }
    // ??????
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '??????',
        content: '?????????????????????',
        onOk() {
          me.props.dispatch({
            type: 'evaluation/deleteTemplate',
            payload: {"templateId": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('???????????????',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||''
                  }
                  me.getTemplate(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // ??????
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "status":values.status||''
        }
        this.getTemplate(params)
      })
    }
    render(){
        const {templateList, termList, gradeList, classList, termList1, gradeList1, classList1, pointTeacherList} =this.props;
        const {userName,realName,password,checkPassword} = this.state;
        if(!templateList){
          return null;
        }
        if(!termList){
          return null;
        }
        if(!gradeList){
          return null;
        }
        const options1 = termList&&termList.map((item)=>{
          return <Option value={item.semesterId} key={item.semesterId}>{item.semesterName}</Option>
        })
        const options2 = gradeList&&gradeList.map((item)=>{
          return <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        const options3 = classList&&classList.map((item)=>{
          return <Option value={item.classId} key={item.classId}>{item.className}</Option>
        })
        const options4 = pointTeacherList&&pointTeacherList.map((item)=>{
          return <Option key={item.personId}>{item.personName}</Option>
        })
        const options5 = termList1&&termList1.map((item)=>{
          return <Option value={item.semesterId} key={item.semesterId}>{item.semesterName}</Option>
        })
        const options6 = gradeList1&&gradeList1.map((item)=>{
          return <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        const options7 = classList1&&classList1.map((item)=>{
          return <Option value={item.classId} key={item.classId}>{item.className}</Option>
        })
        const columns = [{
          title: '??????',
          dataIndex: 'id',
        },{
            title: '????????????',
            dataIndex: 'name',
          }, {
            title: '??????',
            dataIndex: 'semesterName',
            
          }, {
            title: '????????????',
            dataIndex: 'gradeName',
            width: 200,
            render:(record)=>{
              return <span>
                      <Tooltip placement="top" title={record.join(",")}>
                        <span className="des-content">{record.join(",")}</span>
                      </Tooltip>
                    </span>
            },

          },{
            title: '????????????',
            dataIndex: 'commentType',
            render:(record)=>{
                return record==1 ? <span>??????</span> : <span>??????</span>
            }
          },{
            title: '????????????',
            dataIndex: 'createTime',
            render:(record)=>{
                return formatDate(record)
            }
          },{
            title: '??????',
            dataIndex: '',
            width: 275,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.toManage.bind(this, record.id, record.commentType)}>????????????</a>
                  <Divider type="vertical" />
                <a href="javascript:;" onClick={this.toEdit.bind(this, record.id)}>??????</a>
                  <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.id)}>??????</a>
                  <Divider type="vertical" />
                <a href="javascript:;" onClick={this.toDetail.bind(this, record.id)}>???????????????</a>
              </span>
            )
          }];
          
          const columns1 = [{
            title: '????????????',
            dataIndex: 'pointName',
            key: 'name',
            width: 160
          }, {
            title: '??????',
            dataIndex: 'record',
            key: 'age',
            render: record => (
              <span>
                  +{record[0]}<Icon type="star" theme="filled" />
                  <Divider type="vertical" />{record[1]}<Icon type="star" theme="filled" /><Divider type="vertical" />
                  <a href="javascript:;" onClick={this.checkDetail.bind(this, record[2])}>??????</a>
              </span>
            ),
          }];
          const columns2 = [{
            title: '??????',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '??????',
            dataIndex: 'record',
            key: 'record',
            render: record => (
              <span>
                  +{record[0]}<Icon type="star" theme="filled" />
                  <Divider type="vertical" />{record[1]}<Icon type="star" theme="filled" /><Divider type="vertical" />
                  <a href="javascript:;" onClick={this.checkDetail1.bind(this, record[2], record[3])}>??????</a>
              </span>
            ),
          },
          {
            title: '??????',
            dataIndex: 'totalScore',
            key: 'totalScore',
          }];
          
          const columns3 = [{
            title: '??????',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '??????',
            dataIndex: 'record',
            key: 'record',
            render: record => (
              <span>
                  +{record[0]}<Icon type="star" theme="filled" />
                  <Divider type="vertical" />{record[1]}<Icon type="star" theme="filled" /><Divider type="vertical" />{record[2]}
                  <a href="javascript:;" onClick={this.checkDetail2.bind(this, record[3], record[4], record[5], record[6], record[7],)}>??????</a>
              </span>
            ),
          }
         ];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main student-evaluation">
              {/* <div className="breadcrumb"> */}
                    {/* <Breadcrumb> */}
                        {/* <Breadcrumb.Item><Link to="/account-manage">??????????????????</Link></Breadcrumb.Item> */}
                        {/* <Breadcrumb.Item>??????????????????</Breadcrumb.Item> */}
                    {/* </Breadcrumb> */}
              {/* </div> */}
              <Tabs defaultActiveKey="1">
                  <TabPane tab="????????????" key="1">
                    <Form className="ant-advanced-search-form content-form">
                      <Row gutter={24}>
                        <Col span={5}>
                          <FormItem label=''>
                            {getFieldDecorator('kw')(
                              <Input placeholder="????????????" onPressEnter={this.search.bind(this)} />
                            )}
                          </FormItem>
                        </Col> 
                        <Col span={6}>
                              <Button type='primary' onClick={this.search.bind(this)}>??????</Button>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <Button onClick={this.newTemplate}>??????</Button>
                        </Col>
                      </Row>
                    </Form>              
                    <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={templateList.dataList} pagination={false}/>
                    <PageIndex getPage={this.onPageChange.bind(this)} total={templateList.totalCount} totalPage={templateList.totalPage} currentPage={templateList.currentPage}/>
                  </TabPane>
                  <TabPane tab="????????????" key="2">
                  
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="??????" key="1">
                          <Row>
                              <Select style={{ width: 200 }} value={this.state.semesterId1} onChange={this.handleChange} placeholder="??????">
                                {options1}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }} value={this.state.gradeId1} onChange={this.handleChange1.bind(this)} placeholder="??????">
                                {options2}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }} value={this.state.classId1} onChange={this.handleChange2} placeholder="??????">
                                {options3}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <RangePicker onChange={this.onChange.bind(this)} />
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary" onClick={this.checkClassScoreDetail.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary">??????</Button>
                          </Row>
                          <Row>
                            <div className="point-wrap">
                              <div className="point-box">
                                <Table dataSource={this.state.scoreDetail} columns={columns1} />
                              </div>
                              <div className="point-detail">
                                  <p className="title"><span>????????????</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                 {this.state.detailDateStr}
                                  </p>
                                  <ul>
                                   {
                                     this.state.classPointDetail&&this.state.classPointDetail.map((item, index)=>{
                                       return  <li key={index}>
                                                <h4>{item.pointName + (parseFloat(item.changeScore)>0 ? "+" + item.changeScore:item.changeScore)}</h4>
                                                <h4 className="arr-wrap">{item.comment}</h4>
                                                <ul className="imgs-wrap">
                                                  {
                                                    item.imgs&&item.imgs.map((i, index)=>{
                                                      return <li key={index} onClick={this.showImg.bind(this, i)}>
                                                              <img src={getImg(i&&i)} className="comment-imgs"/>
                                                            </li>
                                                    })
                                                      
                                                  }
                                                
                                                </ul>
                                                <p>{formatDate(item.crateTime)}&nbsp;&nbsp;&nbsp;&nbsp;{item.teacherName}??????{item.studentName}</p>
                                              </li>
                                     })
                                   }
                                   
                                  </ul>
                              </div>
                              <div className="graph-wrap">
                                <p className="title"><span>{this.state.title}??????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                <div className="circle-box">
                                  <div className="circle-box-left" >
                                      <div className="circle-box-left-graph" id="circle-box-left-graph">

                                      </div>
                                      {/* <Row>
                                        <h2>???????????????88???</h2>
                                        <h2>?????????????????????88</h2>
                                      </Row> */}
                                      <Row>
                                          <Col span={12}>
                                              ????????????<br/>{this.state.avgScore&&this.state.avgScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              ??????????????????<br/>{this.state.personNum&&this.state.personNum}
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col span={12}>
                                              ??????<br/>+{this.state.personScore&&this.state.personScore.addScore}??????/<Icon type="star" theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              ?????????<br/>{this.state.personScore&&this.state.personScore.lessScore}??????/<Icon type="star" theme="filled" />???
                                          </Col>
                                      </Row>
                                  </div>
                                  <div className="circle-box-right">
                                    <h4>????????????</h4>
                                    <ul>
                                      {
                                        this.state.personScore&&this.state.personScore.topPerson.map((item)=>{
                                          return  <li key={item.personId}>
                                                      <img src={getImg(item.pic&&item.pic)} d-src={item.pic&&item.pic[0]} className="head-img"/>
                                                      <p>{item.personName}</p>
                                                  </li>
                                        })
                                      }
                                     
                                    
                                    </ul>
                                  </div>
                                </div>
                               
                                <div className="rank-wrap">
                                    <p className="title"><span>????????????????????????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                    <ul>
                                      {
                                        this.state.classPointRank&&this.state.classPointRank.map((item, index)=>{
                                          return <li key={item.pointName}>
                                                    <Row>
                                                      <Col span={4}><span className="index-icon">{index+1}</span></Col>
                                                      <Col span={6}>{item.pointName}</Col>
                                                      <Col span={14}>{item.num}???</Col>
                                                    </Row>
                                                </li>
                                        })
                                      }
                                    </ul>
                                </div>
                              </div>

                            </div>


                          </Row>
                        </TabPane>
                        <TabPane tab="??????" key="2">
                        <Row>
                              <Select style={{ width: 200 }} value={this.state.semesterId2} onChange={this.handleChange4} placeholder="??????">
                                {options5}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }}  value={this.state.gradeId2} onChange={this.handleChange5} placeholder="??????">
                                {options6}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }}  value={this.state.classId2} onChange={this.handleChange6} placeholder="??????">
                                {options7}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select
                                showSearch
                                style={{ width: 150 }} 
                                value={this.state.teacherId2} 
                                onChange={this.handleChange3} 
                                placeholder="????????????"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {options4}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <RangePicker onChange={this.onChange1.bind(this)} />&nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary" onClick={this.checkPersonScoreDetail.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary">??????</Button>
                          </Row>
                          <Row>
                            <div className="point-wrap">
                              <div className="point-box">
                                <Table dataSource={this.state.scoreDetail1} columns={columns2} />
                              </div>
                              <div className="point-detail">
                                  <p className="title"><span>????????????</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                 {/* {this.state.detailDateStr} */}
                                  </p>
                                  <ul>
                                   {
                                     this.state.personRecordDetail&&this.state.personRecordDetail.map((item, index)=>{
                                       return <li key={index}>
                                                {
                                                  item.pointName&&item.pointName.map((item1, index1)=>{
                                                    return <h4 key={index1}>{item1 + (parseFloat(item.changeScore[index1])>0 ? "+" +
                                                              item.changeScore[index1]:item.changeScore[index1])}
                                                          </h4>
                                              
                                                  })
                                                }
                                                {/* <h4>{item.pointName[index] + (parseFloat(item.changeScore[index])>0 ? "+" + item.changeScore:item.changeScore[index])}</h4> */}
                                              
                                                <p>{formatDate(item.createTime)}&nbsp;&nbsp;&nbsp;&nbsp;{item.teacherName}??????{this.state.showPersonName}</p>
                                              </li>
                                     })
                                   }
                                   
                                  </ul>
                              </div>
                              <div className="graph-wrap">
                                <p className="title"><span>{this.state.showPersonName}??????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                <div className="circle-box">
                                  <div className="circle-box-left" >
                                      <div className="circle-box-left-graph" id="circle-box-left-graph1">

                                      </div>
                                      <Row>
                                          <Col span={12}>
                                              ????????????<br/>{this.state.personPie&&this.state.personPie.totalScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col span={12}>
                                              ??????<br/>+{this.state.personPie&&this.state.personPie.addScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              ?????????<br/>{this.state.personPie&&this.state.personPie.lessScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                      </Row>
                                  </div>
                                  <div className="circle-box-right circle-box-right1">
                                    <p>????????????<br/>
                                      {this.state.personPie&&this.state.personPie.avgScore}??????/<Icon type="star"  theme="filled" />???
                                    </p>
                                  </div>
                                </div>
                               
                                <div className="rank-wrap">
                                    <p className="title"><span>????????????????????????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                    <ul>
                                      {
                                        this.state.personRankData&&this.state.personRankData.map((item, index)=>{
                                          return <li key={item.pointName}>
                                                    <Row>
                                                      <Col span={4}><span className="index-icon">{index+1}</span></Col>
                                                      <Col span={6}>{item.pointName}</Col>
                                                      <Col span={14}>{item.num}???</Col>
                                                    </Row>
                                                </li>
                                        })
                                      }
                                    </ul>
                                </div>
                              </div>
                            </div>
                          </Row>
                        </TabPane>
                        <TabPane tab="??????" key="3">
                          <Row>
                              <Select style={{ width: 200 }} value={this.state.semesterId3} onChange={this.handleChange7} placeholder="??????">
                                {options5}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }}  value={this.state.gradeId3} onChange={this.handleChange8} placeholder="??????">
                                {options6}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select style={{ width: 150 }}  value={this.state.classId3} onChange={this.handleChange9} placeholder="??????">
                                {options7}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Select
                                showSearch
                                style={{ width: 150 }} 
                                value={this.state.teacherId3} 
                                onChange={this.handleChange10} 
                                placeholder="????????????"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {options4}
                              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
                              <RangePicker onChange={this.onChange2.bind(this)} />&nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary" onClick={this.checkGroupScoreDetail.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Button type="primary">??????</Button>
                          </Row>
                          <Row>
                            <div className="point-wrap">
                              <div className="point-box">
                                <Table dataSource={this.state.scoreDetail2} columns={columns3} />
                              </div>
                              <div className="point-detail">
                                  <p className="title"><span>????????????</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                 {/* {this.state.detailDateStr} */}
                                  </p>
                                  <ul>
                                   {
                                     this.state.personRecordDetail&&this.state.personRecordDetail.map((item, index)=>{
                                       return <li key={index}>
                                                {
                                                  item.pointName&&item.pointName.map((item1, index1)=>{
                                                    return <h4 key={index1}>{item1 + (parseFloat(item.changeScore[index1])>0 ? "+" +
                                                              item.changeScore[index1]:item.changeScore[index1])}
                                                          </h4>
                                              
                                                  })
                                                }
                                                {/* <h4>{item.pointName[index] + (parseFloat(item.changeScore[index])>0 ? "+" + item.changeScore:item.changeScore[index])}</h4> */}
                                              
                                                <p>{formatDate(item.createTime)}&nbsp;&nbsp;&nbsp;&nbsp;{item.teacherName}??????{this.state.showPersonName}</p>
                                              </li>
                                     })
                                   }
                                   
                                  </ul>
                              </div>
                              <div className="graph-wrap">
                                <p className="title"><span>{this.state.showPersonName}??????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                <div className="circle-box">
                                  <div className="circle-box-left" >
                                      <div className="circle-box-left-graph" id="circle-box-left-graph2">

                                      </div>
                                      <Row>
                                          <Col span={12}>
                                              ????????????<br/>{this.state.groupPie&&this.state.groupPie.totalScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col span={12}>
                                              ??????<br/>+{this.state.groupPie&&this.state.groupPie.averageScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                          <Col span={12}>
                                              ?????????<br/>{this.state.groupPie&&this.state.groupPie.defaultScore}??????/<Icon type="star"  theme="filled" />???
                                          </Col>
                                      </Row>
                                  </div>
                                  <div className="circle-box-right circle-box-right1">
                                    <p>????????????<br/>
                                      {this.state.personRankData1[0]&&this.state.personRankData1[0].pointName} 
                                      {this.state.personRankData1[0]&&this.state.personRankData1[0].num}(???)
                                    </p>
                                  </div>
                                </div>
                               
                                <div className="rank-wrap">
                                    <p className="title"><span>????????????????????????</span>&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                    <ul>
                                      {
                                        this.state.personRankData1&&this.state.personRankData1.map((item, index)=>{
                                          return <li key={item.pointName}>
                                                    <Row>
                                                      <Col span={4}><span className="index-icon">{index+1}</span></Col>
                                                      <Col span={6}>{item.pointName}</Col>
                                                      <Col span={14}>{item.num}???</Col>
                                                    </Row>
                                                </li>
                                        })
                                      }
                                    </ul>
                                </div>
                              </div>
                            </div>
                          </Row>
                        </TabPane>
                      </Tabs>
                  </TabPane>
              </Tabs>
                  <Modal
                title="????????????"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
               
                 
              </Modal>
               {/* ?????????????????? */}
               <ImgPreview
                    visible={this.state.previewVisible}  // ????????????
                    onClose={this.closePreview} // ????????????
                    src={this.state.licenceUrl} // ??????url
                    picKey={"currentKey"} // ???????????????key???????????????????????????
                    isAlwaysCenterZoom={false} // ?????????????????????????????????false?????????true?????????????????????????????????????????????????????????
                    isAlwaysShowRatioTips={false} // ??????????????????????????????????????????false???????????????????????????????????????true?????????????????????????????????
                    />
            </div>
        );
    }
  

}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    templateList: state.evaluation.templateData,
    termList: state.evaluation.termList,
    gradeList: state.evaluation.gradeData,
    classList: state.evaluation.classData,
    pointTeacherList: state.evaluation.pointTeacherData,
    termList1: state.evaluation.termList,
    gradeList1: state.evaluation.gradeData,
    classList1: state.evaluation.classData,
  }
}

export default connect(mapStateToProps)(Form.create()(studentEvaluation));
