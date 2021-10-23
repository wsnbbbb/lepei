import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Upload,message,Button,Input,Select,Form,Modal,Col,Row,Icon,Radio,TreeSelect,Table,Breadcrumb } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import StepIndex from '../../components/steps';
import PageIndex from '../../components/page';
import { getSexType,getQueryString,getResidence,getGradeType, formatIdcard } from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';

const FormItem = Form.Item;
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;

class ClassDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            imgPath:'',
            tableData:[],
            placeDisabled:true,
            gradeId:'',
            teacherData:[{
                "teacherId":'',
                "teacherType":'',
                "subjectIds":[]
            }],
            classTags:[
                {"title":'',"content":''}
            ],
            page:1,
            prePage:20,
            classDisabled:true,
            visible:false,
            selectedRowKeys:[],
            selectedRows:[],
            studentList:{},
            dataList:[],
            title:"班级详情",
            title1:"添加班级",
        };
    }
   
    componentDidMount = () =>{
        const type = getQueryString('type');
        const classId = getQueryString('classId');
        sessionStorage.removeItem("qiniuToken");
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res) =>{
                if(res.code === 200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })
        this.props.dispatch({ //获取建筑列表
            type:'user/getAllBuildings',
        })
        this.props.dispatch({ //获取教师
            type:'user/getCommonPersonList',
            payload:{"personType": 2, "status": 1}
        })
        this.props.dispatch({ //获取科目
            type: 'user/getAllSubject',
            callback: res => {
                if(res.code == 200){
                    this.setState({
                        subjects: res.data
                    })
                }
            }
        })
        if(Number(type) == 2){
            this.props.dispatch({
                type:'class/getClassDetail',
                payload:{"classId":classId},
                callback:(res)=>{
                    if(res.code === 200){
                        this.props.dispatch({ // 获取学业阶段对应年级
                            type:'user/getGradeName',
                            payload:{"type":res.data.gradeType}
                        })
                        if(res.data.buildId){
                            this.props.dispatch({ //获取建筑下面的场所
                                type:'user/getAllPlacesByBuild',
                                payload:{"buildId":res.data.buildId}
                            })
                            this.setState({placeDisabled:false})
                        }else{
                            this.setState({placeDisabled:true})
                        }
                        res.data.students && res.data.students.map(item =>{
                            item.key = item.personId
                        })
                        res.data.teachers && res.data.teachers.map(item =>{
                            if(item.subjectIds){
                                item.subjectIds = item.subjectIds.split(",") 
                            }
                        })
                        this.setState({
                            classTags:res.data.tags ? eval(res.data.tags) : [{"title":'',"content":''}],
                            imgPath:res.data.pic || '',
                            tableData:res.data.students ? res.data.students : [],
                            teacherData:res.data.teachers || [{"teacherId":'',"teacherType":'',"subjectIds":[]}],
                            placeId:res.data.classroomId,
                            editorState: BraftEditor.createEditorState(res.data.intro)
                        })
                    }
                }
            })
        }else{
            this.props.dispatch({
                type:'user/getGradeName',
                payload:{"type":"5"} 
            })
        }

        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/class-manage"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/class-manage"
                },
              })
        }
    }

    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {},
          })
    }
    // 根据学业阶段获取年级
    getGradeId = (e) =>{
        this.props.dispatch({
            type:'user/getGradeName',
            payload:{"type":e.target.value}
        })
        this.props.form.resetFields(["gradeName"])
    }

    // 年级选择
    handleChange = (value) => {
        this.setState({gradeId:value})
    }
     // 建筑选择
     buildChange = (val) =>{
        if(val){
            this.props.dispatch({ //获取建筑下面的场所
                type:'user/getAllPlacesByBuild',
                payload:{"buildId":val}
            })
            this.setState({buildId:val,placeId:'',placeDisabled:false})
        }else{
            this.setState({buildId:'',placeId:'',placeDisabled:true})
        }
    }

    // 场所选择
    placeChange = (val) =>{
        this.setState({placeId:val})
    }

    // 富文本编辑器
    handleEditorChange = (editorState)=>{
        this.setState({ editorState })
    }

    // 富文本编辑器
    myUploadFn = (param) => {
        const serverURL = 'https://upload.qiniup.com/'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
        const successFn = (response) => {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          param.success({
            url: getImg(JSON.parse(response.target.response).id),
            meta: {
              alt: '图片',
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
            }
          })
        }
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          param.progress(event.loaded / event.total * 100)
        }
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          param.error({
            msg: '上传失败.'
          })
        }
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        fd.append('file', param.file)
        fd.append('token', qiniuToken)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
    }

    // 关联老师-添加
    addTeachers = () => {
        let datas = this.state.teacherData
        datas.push({
            "teacherId":'',
            "teacherType":'',
            "subjectIds":[]
        })
        this.setState({teacherData:datas})
    }
    // 关联教师-移除
    remove = (index) => {
        let oldData = this.state.teacherData
        let newData = oldData.filter((item,idx) =>{
            return idx != index
        })
        this.setState({teacherData:newData})
    }
    // 教师选择
    selectTeacher = (index,val) =>{
        let data = this.state.teacherData
        data[index].teacherId = val
        this.setState({teacherData:data})
    }
    // 教师身份选择
    selectTeacherType = (index,val) =>{
        let data = this.state.teacherData
        data[index].teacherType = val
        this.setState({teacherData:data})
    }
    // 教师任教科目选择
    selectSubject = (index,val) =>{
        let data = this.state.teacherData
        data[index].subjectIds = val
        this.setState({teacherData:data})
    }
    // 班级标签-添加
    addClassTag = () => {
        let datas = this.state.classTags
        datas.push({
            "title":'',
            "content":'',
        })
        this.setState({classTags:datas})
    }
    // 标签标题
    changeTagTitle = (index,e) =>{
        let data = this.state.classTags
        data[index].title = e.target.value
        this.setState({classTags:data})
    }
    // 标签内容
    changeTagContent = (index,e) =>{
        let data = this.state.classTags
        data[index].content = e.target.value
        this.setState({classTags:data})
    }
    // 标签移除
    removeTag = (index) => {
        let oldData = this.state.classTags
        let newData = oldData.filter((item,idx) =>{
            return idx != index
        })
        this.setState({classTags:newData})
    }

    // 获取学生列表
    getStudentList = (params) =>{
        this.props.dispatch({
            type:'user/getPersonList',
            payload:params,
            callback:(res) =>{
                if(res.code === 200){
                    this.setState({
                        visible:true,
                        studentList:res.data,
                        dataList:res.data.dataList
                    })
                }
            }
        })
    }
    // 添加学生
    addStudent = () =>{
        this.props.dispatch({
            type:'user/getCommonGradeList'
        })
        const params = {"page":1,"prePage":20,"personType":1}
        this.getStudentList(params)
    }
    // 添加学生-年级选择
    gradeChange = (val) =>{
        if(val){
            this.props.dispatch({
                type:'user/getClassName',
                payload:{"gradeId": val},
                callback:(res) =>{
                  if(res.code === 200){
                    this.setState({classDisabled:false})
                  }
                }
              })
        }else{
            this.setState({classDisabled:true})
        }
        this.props.form.resetFields(["classId"])
    }
    // 学生列表-查询
    search = () =>{
        this.props.form.validateFields(["kw","gradeId","classId"],(err, values) => {
            this.setState({selectedRowKeys:[]})
            const params = {
              "page": 1,
              "prePage": 20,
              "personType":1,
              "kw": values.kw || '',
              "status": 1,
              "gradeId":values.gradeId || '',
              "classId":values.classId || '',
            }
            this.getStudentList(params)
        })
    }
    // 学生列表-分页
    onPageChange = (current,size) =>{
        this.setState({selectedRowKeys:[]})
        this.props.form.validateFields(["kw","gradeId","classId"],(err, values) => {
          this.setState({page:current,prePage:size})
          const params = {
            "page":current,
            "prePage":size,
            "personType":1,
            "kw":values.kw||'',
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
          }
          this.getStudentList(params)
        })
    }
    // 添加学生-确定
    handleOk = () =>{
        const { tableData } = this.state;
        tableData.push(...this.state.selectedRows);
        let result = [];
        let obj = {};
        tableData.map((item)=>{
            if(!obj[item.personId]){
                result.push(item);
                obj[item.personId] = true;
            }
        })
        this.setState({
            tableData:result,
            visible:false,
            selectedRowKeys:[]
        })
    }

    // 添加学生-取消
    handleCancel = () =>{
        this.setState({
            visible:false,
            selectedRowKeys:[]
        })
    }
    // 学生列表-人员选择
    selectChange = (selectedRowKeys, selectedRows) =>{
        this.setState({selectedRowKeys,selectedRows})
    }
   
    // 关联学生列表-移除
    delTable = (data) =>{
        const {tableData} = this.state;
        let arr = [];
        tableData.map(item =>{
            if(item.personId !== data.personId){
                arr.push(item)
            }
        })
        this.setState({tableData:arr})
    }
    // 上传班徽
    onPicChange=(info)=>{
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    // 图片上传大小限制
    beforeUpload =(file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
    }

    // 保存
    save =  () => {
        const type = getQueryString('type');
        const classId = getQueryString('classId');
        let teacherData = this.state.teacherData
        let classTags = this.state.classTags
        let teachers = []
        console.log({teacherData});
        let flag = true
        teacherData && teacherData.map((item,index) =>{
            if(!item.teacherId){
                message.error("请选择关联老师");
                flag = false
            }
            if(!item.teacherType){
                message.error("请选择教师身份");
                flag = false
            }
            if(!item.subjectIds || item.subjectIds.length == 0){
                message.error("请选择任教科目");
                flag = false
            }
            if(flag){
                teachers.push({
                    "teacherId":item.teacherId,
                    "teacherType":item.teacherType,
                    "subjectIds":item.subjectIds.toString(),
                })
            }
        })
        if(!flag){
            return
        }
        classTags && classTags.map(item =>{
            if(!item.title){
                message.error("请填写班级标签标题");
                flag = false
            }
            if(!item.content){
                message.error("请填写班级标签内容");
                flag = false
            }
        })
        if(!flag){
            return
        }
        let studentIds = [];
        this.state.tableData && this.state.tableData.length > 0 && this.state.tableData.map(item =>{
            return studentIds.push(item.personId)
        })
        this.props.form.validateFields((err, values) => {
            if(!err){
                let params = {
                    "gradeId":values.gradeName,
                    "className":values.className,
                    "classroomId":this.state.placeId||'',
                    "sort":values.sort || '',
                    "intro":this.state.editorState.toHTML(),
                    "pic":this.state.imgPath ||'',
                    "teachers": teachers || [],
                    "tags":JSON.stringify(classTags) || '',
                    "studentId":studentIds || [],
                }
                if(Number(type) === 1){  //添加
                    this.props.dispatch({
                        type:'class/addClass',
                        payload:params,
                        callback:(res) =>{
                            if(res.code === 200){
                                message.success('班级创建成功！')
                                this.props.history.push('/class-manage')
                            }
                        }
                    })
                }else{ //编辑
                    this.props.dispatch({
                        type:'class/updateClass',
                        payload:{"classId":classId,...params},
                        callback:(res)=>{
                            if(res.code===200){
                                message.success('修改班级成功！')
                                this.props.history.push('/class-manage')
                            }
                        }
                    })
                }
            }
        })
    }
    // 返回
    back =  () => {
        this.props.history.push('/class-manage')
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { teacherData, subjects,classTags,imgPath,placeDisabled, editorState,selectedRowKeys,studentList,dataList } = this.state;
        const {classDetail,gradeNameData,buildingList,placeList,allTeachers,commonData,gradeList} = this.props;
        const type=getQueryString('type');
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const rowSelection = {
            selectedRowKeys:selectedRowKeys, 
            onChange: this.selectChange,
        };
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            accept:"image/jpg,image/jpeg,image/png",
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
                token:qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            onChange:this.onPicChange,
            beforeUpload:this.beforeUpload
        };
        const columns = [{
            title: '姓名',
            dataIndex: 'personName'
        }, {
            title: '性别',
            dataIndex: 'sex',
            render:(text,record)=>(
              <span>{getSexType(record.sex)}</span>
            )
        }, {
              title: '读书形式',
              dataIndex: 'inResidence',
              render:(record)=>{
                return(<span>{getResidence(record)}</span>)
              }
        }, {
              title: '身份证',
              dataIndex: 'idCardNo',
              render:(record)=>{
                return(<span>{formatIdcard(record)}</span>)
              }
        }, {
            title: '其他证件',
            dataIndex: 'usin',
        }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span>
                <Button className="check-btn" onClick={this.delTable.bind(this,record)}>删除</Button> 
              </span>
            )
        }];
        const columns1 = [{
            width:150,
            title: '姓名',
            dataIndex: 'personName'
        }, {
            title: '性别',
            width:100,
            dataIndex: 'sex',
            render:(text,record)=>(
              <span>{getSexType(record.sex)}</span>
            )
        }, {
            width:100,
              title: '读书形式',
              dataIndex: 'inResidence',
              render:(record)=>{
                return(<span>{getResidence(record)}</span>)
              }
        }, {
            width:200,
              title: '身份证',
              dataIndex: 'idCardNo',
              render:(record)=>{
                return(<span>{formatIdcard(record)}</span>)
              }
        }, {
            width:200,
            title: '其他证件',
            dataIndex: 'usin',
        }, {
            width:100,
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
        }, {
            width:150,
            title: '年级',
            dataIndex: 'gradeName',
        }, {
            width:150,  
            title: '班级',
            dataIndex: 'className',
        }];
        
        const subjectOption = []
        subjects && subjects.map(item =>{
            return subjectOption.push(<Option value={item.subjectId} key={item.subjectId}>{item.subjectName}</Option>) 
        })
        const gradeOption = [];
        gradeNameData && gradeNameData.map(item =>{
            return gradeOption.push(<Option key={item.gradeId}>{item.gradeName}</Option>);
        }) 
        const buildChildren = [];
        buildingList && buildingList.map(item =>{
            return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
        }) 
        const placeChildren = [];
        placeList && placeList.map(item =>{
            return placeChildren.push(<Option key={item.id}>{item.name}</Option>);
        }) 
        const teacherOption = [];
        allTeachers && allTeachers.map(item =>{
            return teacherOption.push(<Option key={item.personId}>{item.personName}</Option>);
        })
        let classOptions = [];
        commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item =>{
          return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
        })
        let gradeOptions = []
        gradeList && gradeList.length > 0 && gradeList.map(item =>{
          return gradeOptions.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })
        return (
            <div className='detail-main class-detail'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/class-manage">班级管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{type == 1 ? "添加班级" : "班级详情"}</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>{type==1?"添加班级":"班级详情"}</h3>
                </div> */}
                <div className="content-main">
                    <Form>
                        <h3 className='detail-title'>基础资料</h3>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='学业阶段'>
                                        {getFieldDecorator('gradeType',{initialValue:Number(type) === 2 && classDetail && Number(classDetail.gradeType) || 5,rules:[{required:true,message:"请选择学业阶段"}]})(
                                            <RadioGroup onChange={this.getGradeId.bind(this)}>
                                                <RadioButton value={5}>大学</RadioButton>
                                                <RadioButton value={4}>高中</RadioButton>
                                                <RadioButton value={3}>初中</RadioButton>
                                                <RadioButton value={2}>小学</RadioButton>
                                                <RadioButton value={1}>幼儿园</RadioButton>
                                            </RadioGroup>
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='班级名称'>
                                        {getFieldDecorator('className',{initialValue:Number(type) === 2 && classDetail && classDetail.className||'',
                                        rules:[{required:true,message:"请输入班级名称",whitespace: true,}]})(
                                            <Input allowClear placeholder='请输入班级名称，例："1班"，"一班"' clear='true'/>
                                        )}
                                        </FormItem>
                                    </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                                </Row>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='建筑'>
                                        {getFieldDecorator('build',{initialValue:Number(type) === 2 && classDetail && classDetail.buildId || undefined})(
                                            <Select
                                                placeholder="请选择建筑"
                                                optionFilterProp="children"
                                                onChange={this.buildChange}
                                                showSearch
                                                allowClear
                                            >
                                                {buildChildren}
                                            </Select>
                                        )}
                                        </FormItem>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='班级排序'>
                                        {getFieldDecorator('sort',{initialValue:Number(type) === 2 && classDetail && classDetail.sort || ''})(
                                            <Input allowClear placeholder='' type='number' clear='true' maxLength={5}/>
                                        )}
                                        </FormItem>
                                    </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='年级名称'>
                                        {getFieldDecorator('gradeName',{initialValue:Number(type) === 2 && classDetail && classDetail.gradeId || undefined,rules:[{required:true,message:"请选择年级名称"}]})(
                                            <Select showSearch allowClear 
                                            placeholder="请选择年级" 
                                            onChange={this.handleChange}>{gradeOption}</Select>
                                        )}
                                        </FormItem>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label={'班级类型'}>
                                        {getFieldDecorator("classType",{initialValue:'a',rules:[{required:true,message:"请选择班级类型"}]})(
                                            <RadioGroup>
                                                <RadioButton value="a">行政班</RadioButton>
                                                <RadioButton value="b">教学班</RadioButton>
                                            </RadioGroup>
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormItem {...formItemLayout} label='场所'>
                                            <Select
                                                placeholder="请选择场所"
                                                optionFilterProp="children"
                                                disabled={placeDisabled}
                                                onChange={this.placeChange.bind(this)}
                                                value={this.state.placeId || undefined}
                                                showSearch
                                                allowClear
                                            >
                                                {placeChildren}
                                            </Select>
                                        </FormItem>
                                    </Col> 
                                </Row>
                            </Col>
                            <Col span={8}>
                                <div className="upload-box">
                                    <img className="person-img" src={getImg(imgPath)} />
                                    <Upload {...props} showUploadList={false}>
                                        <Button><Icon type="upload" /> 班徽</Button>
                                    </Upload>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={22} className="class-intro">
                            <Col span={3} className="intro-title">班级简介：</Col>
                            <Col span={21} style={{paddingLeft:0}}>
                                <BraftEditor
                                    initialFrameHeight={300}
                                    height={0}
                                    value={editorState}
                                    onChange={this.handleEditorChange}
                                    media={{uploadFn: this.myUploadFn}}
                                />
                            </Col>
                        </Row>
                        <div className="margin30">
                            <h3 className='detail-title'>关联老师</h3><Button type="primary" className="addBtn" onClick={this.addTeachers.bind(this)}>添加</Button>
                            {
                                teacherData && teacherData.map((item,index) => {
                                    return  <Row gutter={24} key={index}>
                                        <Col span={8}>
                                            <FormItem {...formItemLayout} label={'关联老师'}>
                                                <Select value={item.teacherId || undefined} showSearch allowClear placeholder="请选择关联老师"
                                                onChange={this.selectTeacher.bind(this,index)}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }>
                                                    {teacherOption}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...formItemLayout} label={'教师身份'}>
                                                <Select showSearch allowClear value={Number(item.teacherType) || undefined} placeholder="请选择教师身份" onChange={this.selectTeacherType.bind(this,index)}>
                                                    <Option value={1}>科任老师</Option>
                                                    <Option value={2}>副班主任</Option>
                                                    <Option value={3}>班主任</Option>
                                                    <Option value={4}>导师</Option>
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...formItemLayout} label={'任教科目'}>
                                                <Select showSearch allowClear mode="multiple"  value={item.subjectIds || []}
                                                placeholder="请选择任教科目"
                                                onChange={this.selectSubject.bind(this,index)}
                                                filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: '86%', marginRight: 10 }}>
                                                {subjectOption}
                                                </Select>
                                                <Icon
                                                    className="dynamic-delete-button"
                                                    type="minus-circle-o"
                                                    onClick={this.remove.bind(this,index)}
                                                />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                })
                            }
                        </div>
                        <div className="margin30">
                            <h3 className='detail-title'>班级标签</h3><Button type="primary" className="addBtn" onClick={this.addClassTag.bind(this)}>添加</Button>
                            {
                                classTags && classTags.map((item,index) => {
                                    return  <Row gutter={24} key={index}>
                                        <Col span={8}>
                                            <FormItem {...formItemLayout} label={'标签标题'}>
                                                <Input allowClear placeholder="例：18年度评优" value={item.title||''} onChange={this.changeTagTitle.bind(this,index)}/>
                                            </FormItem>
                                        </Col>
                                        <Col span={16} className="classTags">
                                            <FormItem {...formItemLayout} label={'标签内容'}>
                                                <Input allowClear placeholder="例：获得2018年度优秀奖" value={item.content||''} 
                                                style={{width:'94%',marginRight:'10px'}}
                                                onChange={this.changeTagContent.bind(this,index)}/>
                                                <Icon
                                                    className="dynamic-delete-button"
                                                    type="minus-circle-o"
                                                    onClick={this.removeTag.bind(this,index)}
                                                />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                })
                            }
                        </div>
                        <div className="margin30">
                            <h3 className='detail-title'>关联学生</h3><Button type="primary" className="addBtn" onClick={this.addStudent.bind(this)}>添加</Button>
                            <Table className='content-table' columns={columns} dataSource={this.state.tableData} pagination={false}/>
                        </div>
                    </Form>
                </div>
                <div>
                    {Number(type) === 2 && classDetail && classDetail.operateLogs && classDetail.operateLogs.length > 0 ? <div className='step-contents'>
                        <StepIndex data={classDetail && classDetail.operateLogs} />
                    </div> : null}
                </div>
                <div className="btn">
                    <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='primary'  onClick={this.save.bind(this)}>保存</Button>
                </div>
                <Modal
                    title="添加学生"
                    width={1200}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Form className="ant-advanced-search-form content-form">
                        <Row gutter={24}>
                            <Col span={6}>
                                <FormItem>
                                {getFieldDecorator('kw')(
                                    <Search  placeholder="请输入姓名"/>
                                )}
                                </FormItem>
                            </Col> 
                            <Col span={6}>
                                <FormItem>
                                {getFieldDecorator("gradeId")(
                                    <Select placeholder="请选择年级" allowClear showSearch onChange={this.gradeChange.bind(this)}>{gradeOptions}</Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem>
                                {getFieldDecorator("classId")(
                                    <Select allowClear showSearch placeholder="请选择班级" disabled={this.state.classDisabled}>
                                        {classOptions}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={2} offset={1}>
                                <FormItem>
                                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>  
                    <Row>
                        <Table  rowSelection={rowSelection} scroll={{y: 450 }} columns={columns1} dataSource={dataList} pagination={false}/>
                        <PageIndex getPage={this.onPageChange.bind(this)} total={studentList.totalCount} totalPage={studentList.totalPage} currentPage={studentList.currentPage}/>
                    </Row>
                </Modal>
            </div>
            
        );
    }
}

const mapStateToProps = (state) => {
  return {
    classDetail:state.class.classDetail,
    gradeNameData:state.user.gradeNameData,
    buildingList:state.user.buildingList,
    placeList:state.user.placeList,
    allTeachers:state.user.commonPersonData,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(ClassDetail));
