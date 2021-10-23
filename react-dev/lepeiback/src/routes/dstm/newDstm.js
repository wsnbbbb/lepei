import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Icon,Form,Row,Col,Checkbox , Tag,Upload,TreeSelect,Radio , Tree,Breadcrumb,Switch,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {isBlank, formatDate, duplicateRemoveArr} from '../../utils/public';
import './style.less';
import { runInThisContext } from 'vm';

const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;

const defaultCheckedList = [];
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class NewDstm extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          currentIndex: 0,
          typeList: [],
          gradeIds: [],
          classIds: [],
          teacherList: [],
          leaders: [],
          selectedRowKeys:[],
          roleList: [],
          selectedRows:[],
          typeId: undefined,
          studentList: [],
          groupType: 1,
          fileList: [],
          groupItem: [
            {
              selfId: 1,
              roleId: undefined,
              selectIds: [],
              key: []
            }
          ],
          background: [{
            selfId: 1,
            content: '',
            images: []
          }],
          purpose: [{
            selfId: 1,
            content: '',
            images: []
          }],
          prepare: [{
            selfId: 1,
            content: '',
            images: []
          }],
          plan: [{
            selfId: 1,
            content: '',
            images: []
          }],
          process: [{
            selfId: 1,
            content: '',
            images: []
          }],
          report: [{
            selfId: 1,
            content: '',
            images: []
          }],
          title:'创建活动'

        };
    }
    componentDidMount=()=>{
      const params={
        "templateId": this.props.match.params.id,
      }
      this.getAllTemplate()
      this.getAllSemesters()
      this.getGrade()
      this.dstmTypes()
      this.getTeacher()
      this.dstmRoles()
      // this.getAllPubStudents()
      this.props.dispatch({
        type:'user/getCommonGradeList'
      })
      this.props.dispatch({ //获取班级
        type:'user/getClassByGrade'
      })

      this.props.dispatch({ //获取所有学生
          type:'user/getPubStudents',
          payload: {
            status: 1
          }
      })

      sessionStorage.removeItem("qiniuToken");
      this.props.dispatch({ //获取上传图片token
          type:'user/getPicToken',
          callback:(res)=>{
              if(res.code===200){
                  sessionStorage.setItem("qiniuToken",res.data.token)
                  this.setState({qiniuToken:res.data.token})
              }
          }
      })

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/dstm-list"
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

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": 20,
          "kw": values.kw||'',
          "status": 1
        }
        this.getAllPubStudents(params)
      })
    }

      
    chossePerson=(index)=> {
      // this.setState({selectedRowKeys: this.state.groupItem[index].selectIds})
      this.props.dispatch({
        type:'dstm/getAllPubStudents',
        payload: {
          status: 1,
          page: 1,
          pageSize: 20
        },
        callback: res=>{
          if(res.code==200){
            res.data.dataList&&res.data.dataList.map(item=>{
              item.key = item.personId
            })
            this.setState({
              studentList: res.data,
              visible: true,
              currentIndex: index
            })
          }
        }
      })
    }

    
    dstmRoles=()=>{
      this.props.dispatch({
        type:'dstm/dstmRoles',
        payload: {},
        callback: res=>{
          if(res.code==200){
            this.setState({
              roleList: res.data.roles
            })
          }
        }
      })
    }
    getAllPubStudents=(params)=>{
      this.props.dispatch({
        type:'dstm/getAllPubStudents',
        payload: params,
        callback: res=>{
          if(res.code==200){
            res.data.dataList&&res.data.dataList.map(item=>{
              item.key = item.personId
            })
            this.setState({
              studentList: res.data
            })
          }
        }
      })
    }
    // getAllPubStudents
    dstmTypes=()=>{
      this.props.dispatch({
        type:'dstm/dstmTypes',
        payload: {},
        callback: res=>{
          if(res.code==200){
            this.setState({
              typeList: res.data.types
            })
          }
        }
      })
    }
        
    getTeacher=(id, type)=>{
      this.props.dispatch({
        type: 'dstm/commonPersonList',
        payload: {
          personType: 2,
          status: 1
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                teacherList: res.data
              })
            }
        }
      })
    }

    getAllTemplate=()=>{
      this.props.dispatch({
        type:'evaluation/getAllTemplate',
        payload: {}
      })
    }
    getAllSemesters=()=>{
      this.props.dispatch({
        type:'evaluation/getAllSemesters',
        payload: {},
      })
    }
    getGrade=()=>{
      this.props.dispatch({
        type:'evaluation/commonGradeList',
        payload: {},
        callback: (res)=>{
          if(res.code===200){
            let optionArr=[]
            let allplainArr=[]
            res.data.map((item)=>{
              optionArr.push({
                "label": item.gradeName,
                "value": item.gradeId
              })
              allplainArr.push(item.gradeId)
            })
            this.setState({
              plainOptions: optionArr,
              allplain: allplainArr
            })
          }
        }
      })
    }
 
    create=()=>{
    
      if(isBlank(this.state.name)){
        message.warning("活动名称不能为空！")
        return
      }
      if(isBlank(this.state.typeId)){
        message.warning("请选择活动类型！")
        return
      }
      if(this.state.leaders.length<=0){
        message.warning("请选择负责老师！")
        return
      }
      if(this.state.groupType==2&&this.state.gradeIds.length==0){
        message.warning("请选择年级！")
        return
      }
      if(this.state.groupType==3&&this.state.classIds.length==0){
        message.warning("请选择班级！")
        return
      }
      let groupIds = []
      if(this.state.groupType==1){
        groupIds=[]
      }
      if(this.state.groupType==2){
        groupIds=this.state.gradeIds
      }
      if(this.state.groupType==3){
        groupIds=this.state.classIds
      }
      if(this.state.groupType==4){
        let result = this.state.groupItem.some(item=>{
          return !item.key||item.key.length==0
        })
        if(result){
          message.warning("请选择小组成员！")
          return
        }
        let arr = []
        this.state.groupItem.map(item=>{
          item.key.map(i=>{
            arr.push({
              roleId: item.roleId||'0',
              personId: i
            })
          })
        })
        groupIds = arr
      }

      function formatParam(arr) {
        let array = []
        arr&&arr.map(item=>{
          let imgs = []
          item.images.length>0&&item.images.map(it=>{
            if(it.response&&it.response.success){
              imgs.push(it.response.id)
            }
          })
          array.push({
            content: item.content,
            images: imgs
          })
        })
        return array
      }
      let background = formatParam(this.state.background)
   
      const params={
        "name": this.state.name,
        "typeId": this.state.typeId,
        "groupType": this.state.groupType,
        "groupIds": groupIds,
        "leaders": this.state.leaders,
        "background": formatParam(this.state.background),
        "purpose": formatParam(this.state.purpose),
        "prepare": formatParam(this.state.prepare),
        "plan": formatParam(this.state.plan),
        "process": formatParam(this.state.process),
        "report": formatParam(this.state.report)
      }
      let _this=this
      this.props.dispatch({
        type:'dstm/addDstm',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            message.success("创建活动成功！")
            setTimeout(function(){
              _this.back();
            }, 3000);
          }
        }
      })
  }

    back=()=>{
      window.history.go(-1)
    }
    handleOk = () => {
      this.setState({
        visible: false,
      });
    }



    handleCancel = () => this.setState({ visible: false });

    handleCancel1 = () => this.setState({ previewVisible: false });

    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
        tempName: undefined
      });
    }
    onChange = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
        groupType: e.target.value,
      });
    }
    inputOnchange= (e) => {
      this.setState({
        name: e.target.value,
      });
    }
    onChange1 = (checkedList) => {
      console.log(checkedList)
      this.setState({
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
        checkAll: checkedList.length === this.state.plainOptions.length,
      });
    }
    onChange2 = (e) => {
      this.setState({
        commentCycle: e.target.value,
      });
    }
    handleChange2=(value)=>{
      this.setState({
        gradeIds: value
      })
    }
    handleChange3=(value)=>{
      this.setState({
        classIds: value
      })
    }
  
    onChange3=(checked)=> {
      console.log(`switch to ${checked}`);
      if(checked==true){
        this.setState({
          isAllowCustomize: 1
        })
      }else{
        this.setState({
          isAllowCustomize: 0
        })
      }
    }

    beforeUpload=(file)=> {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
        // return isJPG && isLt2M;
    }

    handleImgsChange = (index, {fileList}) => {
      // debugger
      // console.log(fileList)
      // this.setState({ fileList })

      let oldData = this.state.background
      oldData[index].images = fileList
      this.setState({
        background: oldData
      })
      console.log(this.state.background)
      // let imgs=[]
      // fileList.length>0&&fileList.map(item=>{
      //   if(item.response&&item.response.success){
      //     imgs.push(item.response.id)
      //   }else{
      //     const uid=item.uid.split('~')[1]
      //     imgs.push(uid)
      //   }
      // })
      // this.setState({imgs})
      // console.log(imgs)
    };

    handleImgsChange1 = (index, {fileList}) => {
      let oldData = this.state.purpose
      oldData[index].images = fileList
      this.setState({
        purpose: oldData
      })
    };
    handleImgsChange2 = (index, {fileList}) => {
      let oldData = this.state.prepare
      oldData[index].images = fileList
      this.setState({
        prepare: oldData
      })
    };
    handleImgsChange3 = (index, {fileList}) => {
      let oldData = this.state.plan
      oldData[index].images = fileList
      this.setState({
        plan: oldData
      })
    };
    handleImgsChange4 = (index, {fileList}) => {
      let oldData = this.state.process
      oldData[index].images = fileList
      this.setState({
        process: oldData
      })
    };
    handleImgsChange5 = (index, {fileList}) => {
      let oldData = this.state.report
      oldData[index].images = fileList
      this.setState({
        report: oldData
      })
    };
    handlePreview = async file => {
      if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
  };

    onChange4=(checked)=> {
      console.log(`switch to ${checked}`);
      if(checked==true){
        this.setState({
          isShowPercent: 1
        })
      }else{
        this.setState({
          isShowPercent: 0
        })
      }
    }


    addLabel=()=>{
      if(this.state.background.length==0){
        this.state.background.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.background[this.state.background.length-1].selfId) + 1
        this.state.background.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({background: this.state.background})

    }

    deleteLabel=(selfId)=>{
      this.setState({ background: this.state.background.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.background);
      });
    }
    deleteLabel1=(selfId)=>{
      this.setState({ purpose: this.state.purpose.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.purpose);
      });
    }
    deleteLabel2=(selfId)=>{
      this.setState({ prepare: this.state.prepare.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.prepare);
      });
    }
    deleteLabel3=(selfId)=>{
      this.setState({ plan: this.state.plan.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.plan);
      });
    }
    deleteLabel4=(selfId)=>{
      this.setState({ process: this.state.process.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.process);
      });
    }
    deleteLabel5=(selfId)=>{
      this.setState({ report: this.state.report.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.report);
      });
    }

    addLabel1=()=>{
      if(this.state.purpose.length==0){
        this.state.purpose.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.purpose[this.state.purpose.length-1].selfId) + 1
        this.state.purpose.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({purpose: this.state.purpose})
    }

    addLabel2=()=>{
      if(this.state.prepare.length==0){
        this.state.prepare.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.prepare[this.state.prepare.length-1].selfId) + 1
        this.state.prepare.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({prepare: this.state.prepare})
    }
    addLabel3=()=>{
      if(this.state.plan.length==0){
        this.state.plan.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.plan[this.state.plan.length-1].selfId) + 1
        this.state.plan.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({plan: this.state.plan})
    }
    addLabel4=()=>{
      if(this.state.process.length==0){
        this.state.process.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.process[this.state.process.length-1].selfId) + 1
        this.state.process.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({process: this.state.process})
    }
    addLabel5=()=>{
      if(this.state.report.length==0){
        this.state.report.push({
            selfId: 1,
            content: '',
            images: []
        })
      }else{
        let selfId = Number(this.state.report[this.state.report.length-1].selfId) + 1
        this.state.report.push({
            selfId: selfId,
            content: '',
            images: []
        })
      }
      this.setState({report: this.state.report})
    }


    deleteLabel1=(selfId)=>{
      this.setState({ purpose: this.state.purpose.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.purpose);
      });
    }
    
    onCheckAllChange = (e) => {
      console.log(e)
      this.setState({
        checkedList: e.target.checked ? this.state.allplain : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    }

    changeBackground=(index, e)=>{
      let oldData = this.state.background
      oldData[index].content = e.target.value
      this.setState({
        background: oldData
      })
    }

    changePurpose=(index, e)=>{
      let oldData = this.state.purpose
      oldData[index].content = e.target.value
      this.setState({
        purpose: oldData
      })
    }

    changePrepare=(index, e)=>{
      let oldData = this.state.prepare
      oldData[index].content = e.target.value
      this.setState({
        prepare: oldData
      })
    }

    changePlan=(index, e)=>{
      let oldData = this.state.plan
      oldData[index].content = e.target.value
      this.setState({
        plan: oldData
      })
    }

    changeProcess=(index, e)=>{
      let oldData = this.state.process
      oldData[index].content = e.target.value
      this.setState({
        process: oldData
      })
    }

    changeReport=(index, e)=>{
      let oldData = this.state.report
      oldData[index].content = e.target.value
      this.setState({
        report: oldData
      })
    }

    chosse=()=>{
      this.setState({
        visible: true,
      })
    }

    handleChange=(value)=> {
      console.log(`selected ${value}`);
      this.setState({
        curTemId: value
      })
    }
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
      let flag = oldData[index].selectIds.some(item=>{
        return item.personId==record.personId
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
      // oldData[index].selectIds = Object.assign([], oldData[index].selectIds)
      
      this.setState({
        groupItem: oldData
      })
    }
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
      console.log(this.state.groupItem)
    }
    handleChange1=(value)=> {
      console.log(`selected ${value}`);
      this.setState({
        typeId: value
      })
    }

    changeRole = (index, value) => {
      let oldData = this.state.groupItem
      oldData[index].roleId = value
      this.setState({
        groupItem: oldData
      })
    };

    deleteRole= (selfId) => {
      this.setState({ groupItem: this.state.groupItem.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.groupItem);
      });
    };

    addRole=()=>{
      if(this.state.groupItem.length==0){
        this.state.groupItem.push({
            selfId: 1,
            roleId: undefined,
            selectIds: []
        })
      }else{
        let selfId = Number(this.state.groupItem[this.state.groupItem.length-1].selfId) + 1
        this.state.groupItem.push({
            selfId: selfId,
            roleId: undefined,
            selectIds: []
        })
      }
      this.setState({groupItem: this.state.groupItem})
    }

    handleChange4=(value)=> {
      console.log(`selected ${value}`);
      this.setState({
        leaders: value
      })
    }

    removeItem=(index, personId, e)=> {

      let oldData = this.state.groupItem
      oldData[index].selectIds = oldData[index].selectIds.filter(item=>{
        return item.personId!=personId
      })
      oldData[index].key = oldData[index].key.filter(item=>{
        return item!=personId
      })
      this.setState({
        groupItem: oldData
      })
      e.preventDefault();
    }


    // 分页
    onPageChange2=(current,size)=>{
      // this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "status":1,
          "kw": values.kw||''
        }
        this.getAllPubStudents(params)
      })
    }
    render(){

      const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      } , {
        title: '班级',
        dataIndex: 'className',
      }]

      const { selectedRowKeys } = this.state;
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const rowSelection = {
          selectedRowKeys: this.state.groupItem[this.state.currentIndex].key,
          onChange: (selectedRowKeys, selectedRows) => {

            this.onSelectChange(selectedRowKeys, selectedRows)

          },
    
          onSelect: (record, selected, selectedRows) => {
            this.onSelect(record, selected, selectedRows)
            console.log(record, selected, selectedRows);
            // this.onSelectChange(record, selected, selectedRows)
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            // debugger
            this.selectAll(selected, selectedRows, changeRows)
          },
        };

        const {templateList,  gradeList, classData, pubStudents} =this.props;
        const {userName,realName,password,typeList, teacherList, previewVisible, previewImage, studentList, background, purpose, prepare,plan, process, report, roleList } = this.state;
        const options = templateList&&templateList.map((item)=>{
          return <Option value={item.id} key={item.id}>{item.name}</Option>
        })
        const options1 = typeList&&typeList.map((item)=>{
          return <Option value={item.id} key={item.id}>{item.name}</Option>
        })

        let options2=[]
        gradeList&&gradeList.length>0&&gradeList.map(item=>{
          return options2.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })


        let options3=[]
        classData&&classData.length>0&&classData.map(item=>{
            let children=[];
            if(item.classData&&item.classData.length>0){
                item.classData.map(n=>{
                    return children.push(<TreeNode value={n.classId} title={n.className+'('+`${item.gradeName}`+')'} key={n.classId} />)
                })
            }
            return options3.push(<TreeNode selectable={false} value={item.gradeName+'-'+item.gradeId} title={item.gradeName} key={item.gradeId}>{children}</TreeNode>)
        })


        let options4=[]
        pubStudents&&pubStudents.length>0&&pubStudents.map(item=>{
          return options4.push(<Option key={item.personId} value={item.personId}>{item.personName + item.className}</Option>)
        })

        const options5 = teacherList&&teacherList.map((item)=>{
          return <Option key={item.personId} value={item.personId}>{item.personName}</Option>
        })

        let options6=[]
        roleList&&roleList.length>0&&roleList.map(item=>{
          return options6.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
        })


        

        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
          </div>
          );
        return (
            <div className="content-main dstm-main">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/dstm-list">数字科技馆</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>创建活动</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
              <div className="main">
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动名称：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input style={{width:380}} maxLength={20} value={this.state.name} placeholder="请输入名称" onChange={this.inputOnchange.bind(this)} />&nbsp;&nbsp;

                  </Row>
                  <Row>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动类型：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select placeholder="请选择活动类型" value={this.state.typeId} style={{ width: 380 }} onChange={this.handleChange1}>
                         {options1}
                      </Select>
                  </Row>
                  <Row>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;负责老师：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select 
                          placeholder="请选择老师" 
                          value={this.state.leaders} 
                          style={{ width: 380 }}
                          mode="multiple"
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={this.handleChange4}>
                         {options5}
                      </Select>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;参与群体：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <RadioGroup onChange={this.onChange} value={this.state.groupType}>
                        <Radio value={1}>全校</Radio>
                        <Radio value={2}>年级</Radio>
                        <Radio value={3}>班级</Radio>
                        <Radio value={4}>小组</Radio>
                      </RadioGroup>
                  </Row>
                  <Row style={{display: this.state.groupType==2?"block":"none"}}>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年级：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select 
                          placeholder="请选择年级"
                          showSearch mode="multiple"
                          style={{width: 300}}
                          onChange={this.handleChange2.bind(this)}
                          value={this.state.gradeIds}
                          >
                          {options2}
                        </Select>
                  </Row> 
                  <Row style={{display: this.state.groupType==3?"block":"none"}}>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班级：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <TreeSelect
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 170, overflow: 'auto' }}
                                placeholder="请选择班级"
                                multiple
                                value={this.state.classIds}
                                onChange={this.handleChange3.bind(this)}
                                treeCheckable={false} 
                                showSearch
                            >
                                {options3}
                            </TreeSelect>
                    </Row>
                    <Row style={{display: this.state.groupType==4?"block":"none"}}>
                      <div style={{marginLeft: '127px', paddingBottom: '10px'}}>
                        {
                          this.state.groupItem.map((item, index)=>{
                            return <span key={index} style={{display: 'block'}}>
                                      <div style={{overflow: 'auto', padding: '2px 3px',marginBottom: '20px',verticalAlign: 'middle', display: 'inline-block',width: '380px', height: '100px',border: '1px solid #d9d9d9', borderRadius: '4px'}}>
                                      {
                                        item.selectIds&&item.selectIds.map((item, idx)=>{
                                          return  <Tag key={idx} closable onClose={this.removeItem.bind(this, index, item.personId)}>{item.personName}</Tag>
                                        })
                                      }
                                      </div>&nbsp;&nbsp;
                                      <Button onClick={this.chossePerson.bind(this, index)}>选择</Button>&nbsp;&nbsp;
                                      <Select placeholder="请选择角色"
                                      value={item.roleId}
                                      onChange={this.changeRole.bind(this, index)}
                                      style={{width: 200}}>
                                        {options6}
                                      </Select>
                                      <Button type="link" style={{display: index==0?"none":"inline-block"}} onClick={this.deleteRole.bind(this, item.selfId)}>删除</Button>
                                    </span>
                          })
                        }
                        </div>
                        <div>
                          <Button type="link" onClick={this.addRole.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                        </div>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动背景：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      
                      {
                        background&&background.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入背景"
                                    onChange={this.changeBackground.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.background[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.background[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动目的：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        purpose&&purpose.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入活动目的"
                                    onChange={this.changePurpose.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel1.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.purpose[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange1.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.purpose[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel1.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动准备：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        prepare&&prepare.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入活动准备"
                                    onChange={this.changePrepare.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel2.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.prepare[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange2.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.prepare[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel2.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动计划：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        plan&&plan.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入活动计划"
                                    onChange={this.changePlan.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel3.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.plan[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange3.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.plan[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel3.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动过程：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        process&&process.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入活动过程"
                                    onChange={this.changeProcess.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel4.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.process[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange4.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.process[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel4.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
                    <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动报告：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        report&&report.map((item, index)=>{
                          return  <span key={index}>
                                    <TextArea rows={4} vlaue={item.content}  
                                    placeholder="请输入活动报告"
                                    onChange={this.changeReport.bind(this, index)}
                                    style={{width: '380px', verticalAlign: 'top', marginLeft: index!=0?'127px':''}} />
                                    <Button type="danger" onClick={this.deleteLabel5.bind(this, item.selfId)} style={{marginLeft: '10px', display: index!=0?"inline-block":"none"}}>删除</Button>
                                    <div className="dstm-upload">
                                      <Upload
                                            action="https://upload.qiniup.com/"
                                            accept="image/jpg,image/jpeg,image/png"
                                            listType="picture-card"
                                            fileList={this.state.report[index].images}
                                            multiple={true}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleImgsChange5.bind(this, index)}
                                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                                        >
                                            {this.state.report[index].images.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                  </span>
                        })
                      }
                      <Button type="link" onClick={this.addLabel5.bind(this)} style={{marginLeft: '127px'}}>添加行</Button>
                    </Row>
             
                  <Row>
                    <div className="btn-wrap" style={{textAlign: "center", marginTop: '50px', marginBottom: '50px'}}>
                      <Button onClick={this.back.bind(this)}>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type="primary" onClick={this.create.bind(this)}>确定</Button>
                    </div>
                  </Row>
                </div>

                  
              <Modal
                title="选择学生"
                width={800}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >

                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={6}>
                        <FormItem label=''>
                          {getFieldDecorator('kw')(
                            <Search
                              placeholder="请输入学生姓名"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6} >
                            <Button type='primary' style={{marginTop: "4px"}} onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                      </Col>
                    </Row>
                </Form>  
                  <Row>
                    <Table className='content-table' rowSelection={rowSelection} scroll={{ x: 1000 }} columns={columns} dataSource={studentList.dataList} pagination={false}/>
                    <PageIndex getPage={this.onPageChange2.bind(this)} total={studentList.totalCount} totalPage={studentList.totalPage} currentPage={studentList.currentPage}/>
                  </Row>
              </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    pubStudents:state.user.pubStudents,
    gradeList:state.user.commonGradeData,
    classData:state.user.classByGrade
  }
}

export default connect(mapStateToProps)(Form.create()(NewDstm));
