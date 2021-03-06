import React,{ Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Dropdown, Menu, Icon, Modal,message,Tag } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { getUpload } from '../../utils/img';
import { duplicateRemoveArr } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ClassManageInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          page1:1,
          prePage1:20,
          page2:1,
          prePage2:20,
          page3:1,
          prePage3:20,
          datas:{},
          list:[],
          classOptions:[],
          visible:false,
          confirmLoading:false,
          visible1:false,
          confirmLoading1:false,
          confirmLoading2:false,
          confirmLoading3:false,
          confirmLoading4:false,
          confirmLoading5:false,
          confirmLoading6:false,
          confirmLoading7:false,
          visible2:false,
          visible3:false,
          visible4:false,
          visible5:false,
          visible6:false,
          visible7:false,
          leaders:[],
          teacherIds:[],
          className:'',
          classFile:'',
          isShow:false,
          showErr:false,
          teacherData:{},
          teachersList:[],
          teacherData1:{},
          teachersList1:[],
          teacherData2:{},
          teachersList2:[],
          selectedRowKeys:[],
          selectedRowKeys1:[],
          selectedRows:[],
          teachers:'',
          currentIndex: 0,
          groupItem: [
            {
              selectIds: [],
              key: []
            }
          ],
          groupItem1: {
            selectIds: [],
            key: []
          },
          name:'',
          groupItem2: {
            selectIds: [],
            key: []
          },
          name1:'',
         
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":this.state.prePage,
      }
      this.getLeaveSchool()
      this.leaveSchoolList(params)
     
    } 
    
    // ????????????
    getLeaveSchool = () =>{
      this.props.dispatch({
        type:'leaveSchoolManage/getLeaveSchool',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              classOptions:res.data
            })
          }
        }
      })
    }
    
    // ????????????????????????
    leaveSchoolList=(params)=>{
      this.props.dispatch({
        type:'leaveSchoolManage/leaveSchoolList',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              datas:res.data,
              list:res.data.dataList,
            })
          }
        }
      })
    }

    // ??????
    search=()=>{
      this.props.form.validateFields(["kw","classId"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "classId":values.classId||'',
        }
        this.leaveSchoolList(params)
      })
    }
   
    // ??????
    onPageChange=(current,size)=>{
      this.props.form.validateFields(["kw","classId"],(err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "classId":values.classId||'',
        }
        this.leaveSchoolList(params)
      })
    }

    // ???????????????????????????
    add = () =>{
      this.setState({
        visible:true
      })
    }

    // ????????????
    handleOk = () =>{
      this.props.form.validateFields(["name"],(err, values) => {
        const params = {
          "name":values.name,
          "teacherIds":this.state.groupItem1.key,
        }
        console.log(this.state.groupItem1.key);
        
        if(!err){
          if(this.state.groupItem1.key == []){
            return message.warning("?????????????????????")
          }
          this.props.dispatch({
            type:'leaveSchoolManage/setResponsibleTeacher',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                message.success("????????????")
                this.setState({confirmLoading: true,});
                  setTimeout(() => {
                    this.setState({
                      visible: false,
                      confirmLoading: false,
                      groupItem1: {
                        selectIds: [],
                        key: []
                      },
                    });
                  }, 500);
                this.props.form.resetFields(["name"])
                this.search()
                this.getLeaveSchool()
              }
            }
          })
        }
      })
    }

    // ????????????
    handleCancel = () =>{
      this.setState({
        visible:false,
        groupItem1: {
          selectIds: [],
          key: []
        },
      })
      this.props.form.resetFields(["name"])
    }

    // ?????????????????????
    getTeacherList1 = (params) =>{
      this.props.dispatch({ 
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code === 200){
            res.data.dataList&&res.data.dataList.map(item=>{
              item.key = item.personId
            })
            this.setState({
              teachersList1: res.data.dataList,
              teacherData1: res.data,
            })
          }
        }
      })
    }

    // ????????????????????????
    removeItem1 = (personId, e)=> {
      let oldData = this.state.groupItem1
      oldData.selectIds = oldData.selectIds.filter(item=>{
        return item.personId != personId
      })
      oldData.key = oldData.key.filter(item=>{
        return item != personId
      })
      this.setState({
        groupItem1: oldData
      })
      e.preventDefault();
    }

    // ??????????????????
    chossePerson1 = () =>{
      let params = {
        "personType":2,
        "status":1,
        "page":1,
        "prePage":20,
      }
      this.props.dispatch({
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code == 200){
            res.data.dataList && res.data.dataList.map(item => {
              item.key = item.personId
            })
            this.setState({
              teachersList1: res.data.dataList,
              teacherData1: res.data,
              visible5:true,
              visible:false,
            })
          }
        }
      })
    }

    // ?????????
    onSelectChange1 = (selectedRowKeys, selectedRows) => {
      let oldData = this.state.groupItem1
      oldData.selectIds = duplicateRemoveArr(oldData.selectIds.concat(selectedRows))
      oldData.key = selectedRowKeys
      this.setState({
        groupItem1: oldData,
        selectedRowKeys1:selectedRowKeys
      })
      
    }
    onSelect1 = (record, selected, selectedRows) => {
      let oldData = this.state.groupItem1
      let flag = oldData.selectIds.some(item => {
        return item.personId == record.personId
      })
      if(selected){
        if(!flag){
          oldData.selectIds.push(record)
          oldData.key.push(record.personId)
        }
      }else{
        if(flag){
          oldData.key = oldData.key.filter(item=>{
            return item.personId != record.personId
          })
          oldData.selectIds = oldData.selectIds.filter(item=>{
            return item.personId != record.personId
          })
        }
      }
      oldData.selectIds = Object.assign([], oldData.selectIds)
      this.setState({
        groupItem1: oldData
      })
    }
    // ??????
    selectAll1 = (selected, selectedRows, changeRows)=>{
      let oldData = this.state.groupItem1
      if(!selected){
        let arr = []
        changeRows.map(item => {
          arr.push(item.personId)
        })
        oldData.selectIds = oldData.selectIds.filter(item=>{
          return !arr.includes(item.personId)
        })
      }
      this.setState({
        groupItem1: oldData
      })
    }

    handleOk5 = () =>{
      this.setState({
        visible5:false,
        visible:true,
      })
    }
    handleCancel5 = () =>{
      this.setState({
        visible5:false,
        visible:true,
      })
    }
    // ??????????????????
    search2 = () =>{
      this.props.form.validateFields(["teacherName1"],(err, values) => {
        const params={
          "personType":2,
          "status":1,
          "page":1,
          "prePage":this.state.prePage2,
          "kw":values.teacherName1||'',
        }
        this.getTeacherList1(params)
      })
    }
     // ??????????????????
     onPageChange2 = (current,size) =>{
      this.props.form.validateFields(["teacherName1"],(err, values) => {
        this.setState({page2:current,prePage2:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.teacherName1||'',
          "personType":2,
          "status":1,
        }
        this.getTeacherList1(params)
      })
    }

    // ???????????????????????????
    edit = (id) =>{
      this.props.dispatch({
        type:'leaveSchoolManage/getResponsibleTeacher',
        payload:{id},
        callback:(res)=>{
          if(res.code===200){
            let oldData = this.state.groupItem2
            res.data.teachers && res.data.teachers.map(item =>{
              oldData.selectIds.push({
                personId:item.personId,
                personName:item.personName,
                key:item.personId
              })
              oldData.key.push(item.personId)
            })
            this.setState({
              leaveSchoolClassId:id,
              groupItem2: oldData,
              name1:res.data.name,
              visible6:true
            });
          }
        }
      })
    }

    // ????????????
    handleOk6 = () =>{
      this.props.form.validateFields(["name1"],(err, values) => {
        const params = {
          "classId":this.state.leaveSchoolClassId,
          "name":values.name1,
          "teacherIds":this.state.groupItem2.key,
        }
        if(!err){
          if(this.state.groupItem2.key == []){
            return message.warning("?????????????????????")
          }
          this.props.dispatch({
            type:'leaveSchoolManage/editResponsibleTeacher',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                message.success("????????????")
                this.setState({confirmLoading6: true,});
                  setTimeout(() => {
                    this.setState({
                      visible6: false,
                      confirmLoading6: false,
                      groupItem2: {
                        selectIds: [],
                        key: []
                      },
                    });
                  }, 500);
                this.props.form.resetFields(["name1"])
                this.search()
                this.getLeaveSchool()
              }
            }
          })
        }
      })
    }

    // ????????????
    handleCancel6 = () =>{
      this.setState({
        visible6:false,
        groupItem2: {
          selectIds: [],
          key: []
        },
      })
      this.props.form.resetFields(["name1"])
    }

    // ?????????????????????
    getTeacherList2 = (params) =>{
      this.props.dispatch({ 
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code === 200){
            res.data.dataList&&res.data.dataList.map(item=>{
              item.key = item.personId
            })
            this.setState({
              teachersList2: res.data.dataList,
              teacherData2: res.data,
            })
          }
        }
      })
    }

    // ????????????????????????
    removeItem2 = (personId, e)=> {
      let oldData = this.state.groupItem2
      oldData.selectIds = oldData.selectIds.filter(item=>{
        return item.personId != personId
      })
      oldData.key = oldData.key.filter(item=>{
        return item != personId
      })
      this.setState({
        groupItem2: oldData
      })
      e.preventDefault();
    }

    // ??????????????????
    chossePerson2 = () =>{
      let params = {
        "personType":2,
        "status":1,
        "page":1,
        "prePage":20,
      }
      this.props.dispatch({
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code == 200){
            res.data.dataList && res.data.dataList.map(item => {
              item.key = item.personId
            })
            this.setState({
              teachersList2: res.data.dataList,
              teacherData2: res.data,
              visible7:true,
              visible6:false,
            })
          }
        }
      })
    }

    // ?????????
    onSelectChange2 = (selectedRowKeys, selectedRows) => {
      let oldData = this.state.groupItem2
      oldData.selectIds = duplicateRemoveArr(oldData.selectIds.concat(selectedRows))
      oldData.key = selectedRowKeys
      this.setState({
        groupItem2: oldData,
        // selectedRowKeys1:selectedRowKeys
      })
      
    }
    onSelect2 = (record, selected, selectedRows) => {
      let oldData = this.state.groupItem2
      let flag = oldData.selectIds.some(item => {
        return item.personId == record.personId
      })
      if(selected){
        if(!flag){
          oldData.selectIds.push(record)
          oldData.key.push(record.personId)
        }
      }else{
        if(flag){
          oldData.key = oldData.key.filter(item=>{
            return item.personId != record.personId
          })
          oldData.selectIds = oldData.selectIds.filter(item=>{
            return item.personId != record.personId
          })
        }
      }
      oldData.selectIds = Object.assign([], oldData.selectIds)
      this.setState({
        groupItem2: oldData
      })
    }
    // ??????
    selectAll2 = (selected, selectedRows, changeRows)=>{
      let oldData = this.state.groupItem2
      if(!selected){
        let arr = []
        changeRows.map(item => {
          arr.push(item.personId)
        })
        oldData.selectIds = oldData.selectIds.filter(item=>{
          return !arr.includes(item.personId)
        })
      }
      this.setState({
        groupItem2: oldData
      })
    }

    handleOk7 = () =>{
      this.setState({
        visible7:false,
        visible6:true,
      })
    }
    handleCancel7 = () =>{
      this.setState({
        visible7:false,
        visible6:true,
      })
    }
    // ??????????????????
    search3 = () =>{
      this.props.form.validateFields(["teacherName2"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage3,
          "kw":values.teacherName2||'',
          "personType":2,
          "status":1,
        }
        this.getTeacherList2(params)
      })
    }
     // ??????????????????
     onPageChange3 = (current,size) =>{
      this.props.form.validateFields(["teacherName2"],(err, values) => {
        this.setState({page3:current,prePage3:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.teacherName2||'',
          "personType":2,
          "status":1,
        }
        this.getTeacherList2(params)
      })
    }



    // ???????????????
    superManage = () =>{
      this.props.dispatch({
        type:'leaveSchoolManage/getAdmins',
        callback:(res)=>{
          if(res.code===200){
            let index = this.state.currentIndex
            let oldData = this.state.groupItem
            res.data.admin && res.data.admin.map(item =>{
              oldData[index].selectIds.push({
                personId:item.personId,
                personName:item.personName,
                key:item.personId
              })
              oldData[index].key.push(item.personId)
            })
            this.setState({
              groupItem: oldData,
              visible1:true
            });
          }
        }
      })
    }
    // ?????????????????????
    handleOk1 = () =>{
      if(this.state.groupItem[0].key = []){
        return message.warning("???????????????")
      }
      this.props.dispatch({
        type:'leaveSchoolManage/setAdmin',
        payload:{"leaders":this.state.groupItem[0].key},
        callback:(res)=>{
          if(res.code===200){
            message.success("???????????????????????????")
            this.setState({confirmLoading1: true,});
              setTimeout(() => {
                this.setState({
                  visible1: false,
                  confirmLoading1: false,
                  groupItem: [
                    {
                      selectIds: [],
                      key: []
                    }
                  ],
                });
              }, 500);
            this.search()
          }
        }
      })
    }
     // ????????????
     handleCancel1 = () =>{
      this.setState({
        visible1:false,
        groupItem: [
          {
            selectIds: [],
            key: []
          }
        ],
      })
    }

    // ?????????????????????
    getTeacherList = (params) =>{
      this.props.dispatch({ 
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code === 200){
            res.data.dataList&&res.data.dataList.map(item=>{
              item.key = item.personId
            })
            this.setState({
              teachersList: res.data.dataList,
              teacherData: res.data,
            })
          }
        }
      })
    }
    // ???????????????????????????
    removeItem=(index, personId, e) => {

      let oldData = this.state.groupItem
      oldData[index].selectIds = oldData[index].selectIds.filter(item =>{
        return item.personId != personId
      })
      oldData[index].key = oldData[index].key.filter(item =>{
        return item != personId
      })
      this.setState({
        groupItem: oldData
      })
      e.preventDefault();
    }

    // ??????????????????
    chossePerson = (index) =>{
      let params = {
        "personType":2,
        "status":1,
        "page":1,
        "prePage":20,
      }
      this.props.dispatch({
        type:'leaveSchoolManage/getTeachersList',
        payload:params,
        callback: res=>{
          if(res.code == 200){
            res.data.dataList&&res.data.dataList.map(item => {
              item.key = item.personId
            })
            this.setState({
              teachersList: res.data.dataList,
              teacherData: res.data,
              visible4:true,
              visible1:false,
              currentIndex: index
            })
          }
        }
      })
    }
     // ?????????
     onSelectChange = (selectedRowKeys, selectedRows) => {
      let index = this.state.currentIndex
      let oldData = this.state.groupItem
      
      oldData[index].selectIds = duplicateRemoveArr(oldData[index].selectIds.concat(selectedRows))
      oldData[index].key = selectedRowKeys
      this.setState({
        groupItem: oldData
      })
      
    }
    onSelect = (record, selected, selectedRows) => {
      let index = this.state.currentIndex
      let oldData = this.state.groupItem
      let flag = oldData[index].selectIds.some(item => {
        return item.personId == record.personId
      })
      if(selected){
        if(!flag){
          oldData[index].selectIds.push(record)
          oldData[index].key.push(record.personId)
        }
      }else{
        if(flag){
          oldData[index].key = oldData[index].key.filter(item=>{
            return item.personId!=record.personId
          })
          oldData[index].selectIds = oldData[index].selectIds.filter(item=>{
            return item.personId!=record.personId
          })
        }
      }
      oldData[index].selectIds = Object.assign([], oldData[index].selectIds)
      this.setState({
        groupItem: oldData
      })
    }
    // ??????
    selectAll=(selected, selectedRows, changeRows)=>{
      let index = this.state.currentIndex
      let oldData = this.state.groupItem
      if(!selected){
        let arr = []
        changeRows.map(item=>{
          arr.push(item.personId)
        })
        oldData[index].selectIds = oldData[index].selectIds.filter(item=>{
          return !arr.includes(item.personId)
        })
      }else{

      }
      this.setState({
        groupItem: oldData
      })
    }
    // ??????????????????
    search1 = () =>{
      this.props.form.validateFields(["teacherName"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage1,
          "kw":values.teacherName||'',
        }
        this.getTeacherList(params)
      })
    }
    handleOk4 = () =>{
      this.setState({
        visible4:false,
        visible1:true,
      })
    }
    handleCancel4 = () =>{
      this.setState({
        visible4:false,
        visible1:true,
      })
    }
    // ??????????????????
    onPageChange1 = (current,size) =>{
      this.props.form.validateFields(["teacherName"],(err, values) => {
        this.setState({page1:current,prePage1:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.teacherName||'',
        }
        this.getTeacherList(params)
      })
    }
    
   
    // ????????????
    importClass = () =>{
      this.setState({visible2:true})
    }

    // ????????????
    changeFile=(e)=> {
      this.setState({classFile: e.target.files[0]})
      console.log(e.target.files[0]);
      
    }
  
    // ??????????????????
    handleOk2 = () =>{
      this.props.form.validateFields(["excel"],(err,values) =>{
        if(!err){
          const params = new FormData();
          params.append('excel', this.state.classFile)
        console.log({params});
          this.props.dispatch({
            type:'leaveSchoolManage/importClassFile',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                if(res.data.error===false){
                  if(res.data.header&&res.data.sheetData){
                    // res.data.sheetData.map(item =>{
                      message.error(res.msg)
                    // })
                    this.setState({
                      visible2:true,
                      header:res.data.header,
                      sheetData:res.data.sheetData,
                      isShow:true
                    })
                  }
              }else{
                message.success("??????????????????")
                this.setState({
                  visible2:false,
                  isShow:false
                })
                this.props.form.resetFields(["excel"])
                this.search()
              }
              }
            }
          })
        }
      })
    }
    // ??????????????????
    handleCancel2 = () =>{
      this.setState({
        visible2:false,
        isShow:false
      })
      this.props.form.resetFields(["excel"])
    }
    // ????????????
    impotrStudent = (id) =>{
      this.setState({
        visible3:true,
        classId:id
      })
    }

    // ????????????
    changeFile=(e)=> {
      this.setState({studentFile: e.target.files[0]})
      
    }
  
    // ??????????????????
    handleOk3 = () =>{
      this.props.form.validateFields(["excel1"],(err,values) =>{
        if(!err){
          const params = new FormData();
          params.append('excel', this.state.studentFile)
          params.append('classId', this.state.classId)
        console.log({params});
          this.props.dispatch({
            type:'leaveSchoolManage/importStudentFile',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                if(res.data.error===false){
                  if(res.data.header&&res.data.sheetData){
                    message.error(res.msg)
                    this.setState({
                      visible3:true,
                      header:res.data.header,
                      sheetData:res.data.sheetData,
                      showErr:true
                    })
                  }else{
                    message.error(res.msg)
                  }
                }else{
                  message.success("??????????????????")
                  this.setState({
                    visible3:false,
                    showErr:false
                  })
                  this.props.form.resetFields(["excel1"])
                  this.search()
                }
             
              }
            }
          })
        }
      })
    }
    // ??????????????????
    handleCancel3 = () =>{
      this.setState({
        visible3:false,
        showErr:false
      })
      this.props.form.resetFields(["excel1"])
    }
    
    // ??????
    delRcord = (id) =>{
      let that = this;
      confirm({
        title: '??????',
        content: <span>?????????????????????????????????</span>,
        onOk() {
          that.props.dispatch({
            type:'leaveSchoolManage/delLeaveSchool',
            payload:{id},
            callback:(res)=>{
              if(res.code===200){
                message.success('???????????????')
                that.search()
              }
            }
          })
        },
        onCancel() {},
      });
    }
    
    // ??????
    check = (id) =>{
      this.props.dispatch(routerRedux.push("/student-management?id="+id))
    }
    
    render(){
      const { datas, list, classOptions, visible,confirmLoading, visible1,confirmLoading1,visible2,visible4,confirmLoading4,
        header, sheetData,isShow ,visible3,showErr,teachersList,teacherData,groupItem1,visible5,confirmLoading5, teachersList1,teacherData1,
        groupItem2,visible6,confirmLoading6,visible7,confirmLoading7, teachersList2,teacherData2} = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
     
      const columns = [
          {
            title: '??????',
            dataIndex: 'classId',
          },{
            title: '????????????',
            dataIndex: 'className',
          },{
            title: '????????????',
            dataIndex: 'teacherNames',
          },{
            title: '????????????',
            dataIndex: 'count',
          },{
            title: '??????',
            dataIndex: '',
            width:250,
            fixed:'right',
            render:(text, record) => (
              <span>
                <a href="javascript:;" onClick={this.delRcord.bind(this,record.classId)}>??????</a>&emsp;
                <a href="javascript:;" onClick={this.check.bind(this,record.classId)}>??????</a>&emsp;
                <a href="javascript:;" onClick={this.edit.bind(this,record.classId)}>??????</a>&emsp;
                <a href="javascript:;" onClick={this.impotrStudent.bind(this,record.classId)}>????????????</a>
              </span>
            )
        }
      ];
      const columns1 = [
        {
          title: '??????',
          dataIndex: 'personId',
        },{
          title: '??????',
          dataIndex: 'personName',
        }
      ];
      const rowSelection = {
        selectedRowKeys:this.state.groupItem[this.state.currentIndex]&&this.state.groupItem[this.state.currentIndex].key||[],
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange(selectedRowKeys, selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          this.onSelect(record, selected, selectedRows)
          // console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectAll(selected, selectedRows, changeRows)
        },
      };
      const rowSelection1 = {
        selectedRowKeys:this.state.groupItem1.key,
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange1(selectedRowKeys, selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          this.onSelect1(record, selected, selectedRows)
          // console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectAll1(selected, selectedRows, changeRows)
        },
      };
      const rowSelection2 = {
        selectedRowKeys:this.state.groupItem2.key,
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange2(selectedRowKeys, selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          this.onSelect2(record, selected, selectedRows)
          // console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectAll2(selected, selectedRows, changeRows)
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
      classOptions&&classOptions.length>0&&classOptions.map(item=>{
        return options.push(<Option key={item.classId} value={item.classId}>{item.name}</Option>)
      })

      let ths=[];
      if(header){
        for (var i in header){
          ths.push(<th key={i}>{header[i]}</th>)
        }
      }
      let tbodys=[]
      if(sheetData){
        sheetData.map((item,idx)=>{
          let tds=[]
          for(var i in item){
            tds.push(<td key={i} style={{color:item.error?"#f00":""}}>{item[i]?item[i]:"???"}</td>)
          }
          return tbodys.push(<tr key={idx}>{tds}</tr>)
        })
      }
     
      return (
        <div className="content-main class-manage-info">
          <Form>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Search placeholder="????????????"/>
                  )}
                </FormItem>
              </Col> 
              
              <Col span={5}>
                <FormItem {...formItemLayout} label='????????????'>
                  {getFieldDecorator("classId",{initialValue:''})(
                    <Select showSearch >
                      <Option value='' key=''>??????</Option>
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} >
                <Button type='primary' onClick={this.search.bind(this)}>??????</Button>&emsp;
                <Button onClick={this.add.bind(this)}>??????</Button>&emsp;
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href="javascript:;"  onClick={this.importClass.bind(this)}>????????????</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.superManage.bind(this)}>???????????????</a>
                    </Menu.Item>
                  </Menu>
                  }>
                  <a  href="javascript:;" >??????&nbsp;&nbsp;<Icon type="down"/></a>
                </Dropdown>
              </Col>
              
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns} dataSource={list} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={datas.totalCount} totalPage={datas.totalPage} currentPage={datas.currentPage}/> 
          {/* ??????????????????????????? */}
          <Modal
            width={600}
            title="??????"
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            className="addTeachers-modal"
          >
            <Form>
              <Row gutter={24} >
                <Col span={19}>
                  <FormItem {...formItemLayout} label={'????????????'}>
                    {getFieldDecorator("name",{initialValue:this.state.name || '',rules:[{required:true,message:"?????????????????????"}]})(
                      <Input placeholder="?????????????????????" maxLength={40} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div style={{display: 'block',marginLeft:'56px'}}>
              <span>???????????????</span>
              <div className="teachers-box" >
              {
                groupItem1.selectIds && groupItem1.selectIds.map((item, idx)=>{
                  return  <Tag key={idx} closable onClose={this.removeItem1.bind(this, item.personId)}>{item.personName}</Tag>
                })
              }
              </div>&emsp;
              <Button type="primary" onClick={this.chossePerson1.bind(this)}>??????</Button>
            </div>
          </Modal>
          <Modal
            width={900}
            className="choiceTeacher-modal"
            title="????????????"
            visible={visible5}
            confirmLoading={confirmLoading5}
            onOk={this.handleOk5}
            onCancel={this.handleCancel5}
          >
            <Form>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label=''>
                  {getFieldDecorator('teacherName1')(
                    <Search placeholder="?????????????????????"/>
                  )}
                </FormItem>
              </Col> 
              <Col span={10} >
                <FormItem label=''>
                  <Button type='primary' onClick={this.search2.bind(this)}>??????</Button>
                </FormItem>
              </Col> 
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns1} dataSource={teachersList1} pagination={false} rowSelection={rowSelection1}/>
          <PageIndex getPage={this.onPageChange2.bind(this)} total={teacherData1.totalCount} totalPage={teacherData1.totalPage} currentPage={teacherData1.currentPage}/>
          </Modal>
          {/* ??????????????????????????? */}
          <Modal
            width={600}
            title="??????"
            visible={visible6}
            onOk={this.handleOk6}
            onCancel={this.handleCancel6}
            className="addTeachers-modal"
          >
            <Form>
              <Row gutter={24} >
                <Col span={19}>
                  <FormItem {...formItemLayout} label={'????????????'}>
                    {getFieldDecorator("name1",{initialValue:this.state.name1 || '',rules:[{required:true,message:"?????????????????????"}]})(
                      <Input placeholder="?????????????????????" maxLength={40} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div style={{display: 'block',marginLeft:'56px'}}>
              <span>???????????????</span>
              <div className="teachers-box" >
              {
                groupItem2.selectIds && groupItem2.selectIds.map((item, idx)=>{
                  return  <Tag key={idx} closable onClose={this.removeItem2.bind(this, item.personId)}>{item.personName}</Tag>
                })
              }
              </div>&emsp;
              <Button type="primary" onClick={this.chossePerson2.bind(this)}>??????</Button>
            </div>
          </Modal>
          <Modal
            width={900}
            className="choiceTeacher-modal"
            title="????????????"
            visible={visible7}
            confirmLoading={confirmLoading7}
            onOk={this.handleOk7}
            onCancel={this.handleCancel7}
          >
            <Form>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label=''>
                  {getFieldDecorator('teacherName2')(
                    <Search placeholder="?????????????????????"/>
                  )}
                </FormItem>
              </Col> 
              <Col span={10} >
                <FormItem label=''>
                  <Button type='primary' onClick={this.search3.bind(this)}>??????</Button>
                </FormItem>
              </Col> 
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns1} dataSource={teachersList2} pagination={false} rowSelection={rowSelection2}/>
          <PageIndex getPage={this.onPageChange3.bind(this)} total={teacherData2.totalCount} totalPage={teacherData2.totalPage} currentPage={teacherData2.currentPage}/>
          </Modal>
          {/* ??????????????? */}
          <Modal
           width={600}
            title="??????"
            visible={visible1}
            confirmLoading={confirmLoading1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            className="setAdmins-modal"
          >
            <div >
              {
                this.state.groupItem.map((item, index)=>{
                  return <span key={index} style={{display: 'block'}}>
                          <div className="teachers-box" >
                          {
                            item.selectIds&&item.selectIds.map((item, idx)=>{
                              return  <Tag key={idx} closable onClose={this.removeItem.bind(this, index, item.personId)}>{item.personName}</Tag>
                            })
                          }
                          </div>&emsp;
                          <Button type="primary" onClick={this.chossePerson.bind(this, index)}>??????</Button>
                          
                        </span>
                })
              }
            </div>
          </Modal>
          <Modal
            width={900}
            className="choiceTeacher-modal"
            title="????????????"
            visible={visible4}
            confirmLoading={confirmLoading4}
            onOk={this.handleOk4}
            onCancel={this.handleCancel4}
          >
            <Form>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label=''>
                  {getFieldDecorator('teacherName')(
                    <Search placeholder="?????????????????????"/>
                  )}
                </FormItem>
              </Col> 
             
              <Col span={10} >
                <FormItem label=''>
                  <Button type='primary' onClick={this.search1.bind(this)}>??????</Button>
                </FormItem>
              </Col> 
              
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns1} dataSource={teachersList} pagination={false} rowSelection={rowSelection}/>
          <PageIndex getPage={this.onPageChange1.bind(this)} total={teacherData.totalCount} totalPage={teacherData.totalPage} currentPage={teacherData.currentPage}/>
          </Modal>

          <Modal
            title="????????????"
            visible={visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
            className="importClass"
          >
            <Form>
              <Row gutter={24} >
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'????????????'}>
                    {getFieldDecorator("excel",{initialValue:'',rules:[{required:true,message:"???????????????"}]})(
                        <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <p style={{marginLeft:"138px"}}>
                <span >??????????????????.xls???.xlsx?????????</span>
                <a style={{marginLeft:"30px"}} href={getUpload("??????????????????.xlsx")} download="??????????????????.xlsx">????????????</a>
              </p>
              {
                isShow ?<table border="1" className="batch-import-asset-table">
                  <thead>
                    <tr>{ths}<th>??????</th></tr>
                  </thead>
                  <tbody>
                    {tbodys}
                  </tbody>
                </table>:null
              }
            </Form>
          </Modal>
          <Modal
            title="????????????"
            visible={visible3}
            onOk={this.handleOk3}
            onCancel={this.handleCancel3}
            className="importClass"
          >
            <Form>
              <Row gutter={24} >
                <Col span={22}>
                  <FormItem {...formItemLayout} label={'????????????'}>
                    {getFieldDecorator("excel1",{initialValue:'',rules:[{required:true,message:"???????????????"}]})(
                        <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <p style={{marginLeft:"138px"}}>
                <span >??????????????????.xls???.xlsx?????????</span>
                <a style={{marginLeft:"30px"}} href={getUpload("??????????????????.xlsx")} download="??????????????????.xlsx">????????????</a>
              </p>
              {
                showErr ?<table border="1" className="batch-import-asset-table">
                  <thead>
                    <tr>{ths}<th>??????</th></tr>
                  </thead>
                  <tbody>
                    {tbodys}
                  </tbody>
                </table>:null
              }
            </Form>
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

export default connect(mapStateToProps)(Form.create()(ClassManageInfo));
