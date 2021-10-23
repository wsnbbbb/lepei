import React, { Component } from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Popover, Button, Input, Select, Form, Steps, Row, Col, Icon, Breadcrumb, TreeSelect, Modal, message, DatePicker, Upload } from 'antd';
import { getQueryString, belongType, formatDate} from '../../utils/public';
import './style.less';
import moment from 'moment';
import {imgUrl} from '../../config'

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const Step = Steps.Step;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>步骤 {index+1}</span>}>
    {dot}
  </Popover>
);
class SingleDataAudit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId : '',
      flag: false,
      flag1: true,
      applyContent:{},
      examineRecords:[], // 流程记录
      personInfo:{}, // 个人信息
      applyContent:{}, // 申请内容
      itemContents:[], // 项目内容
      data: {},
      isShow: false,
      isShow1: true,
      teachingStartAge:'',
      teachingEndAge:'',
      issueCertStartDate:'',
      issueCertEndDate:'',
      applyStartDate:'',
      applyEndDate:'',
      visible:false,
      cate:'',
      currentQuestionId:'',
      title:"审核",
    };
  }
  componentDidMount = () => {
    // this.offsetChange(6)
    const id = getQueryString("id")
    const params = {
      "id": id
    }
    if (id) {
      this.getDetail(params)
    }
    this.setState({
      recordId : id
    })
    this.props.dispatch({ //获取上传图片token
      type:'user/getPicToken',
      callback:(res)=>{
          if(res.code===200){
              sessionStorage.setItem("qiniuToken",res.data.token)
              this.setState({qiniuToken:res.data.token})
          }
      }
    })
    // 导航面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/teacher-data-audit"
      },
    })
  }

  componentWillUnmount = () => {
    sessionStorage.removeItem("qiniuToken");
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })
      
}
  // 获取数据详情
  getDetail = (params) => {
    this.props.dispatch({
      type: 'teacherDataCollect/dataAuditDetail',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          res.data.itemContents && res.data.itemContents.map(item => {
            if(item.type == 5){
              item.answers = item.answers ? item.answers.split(",") : []
            }
          })
          this.setState({
            issueCertDate: res.data.applyContent.issueCertDate,
            applyContent: res.data.applyContent,
            examineRecords: res.data.examineRecords,
            itemContents: res.data.itemContents,
            personInfo: res.data.personInfo
          })
        }
      }
    })
  }
  // 展开/收起
  toggle = () => {
    this.setState({
      flag: !this.state.flag
    }, function () {
      console.log(this.state.flag);
      if (this.state.flag) {
        this.setState({
          isShow: true,
        })
      } else {
        this.setState({
          isShow: false,
        })
      }
    })
  }
  // 展开/收起
  toggle1 = () => {
    this.setState({
      flag1: !this.state.flag1
    }, function () {
      if (this.state.flag1) {
        this.setState({
          isShow1: true,
        })
      } else {
        this.setState({
          isShow1: false,
        })
      }
    })
  }
  
  // 退回
  sendBack = () =>{
    this.setState({visible:true})
  }
  // 确定退回
  handleOk = () =>{
    this.props.form.validateFields(["reason"],(err,values) =>{
      if(!err){
        const params = {
          "id":this.state.recordId,
          "reason":values.reason
        }
        this.props.dispatch({
          type: 'teacherDataCollect/auditSendBack',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success("已退回!")
              this.setState({
                visible: false,
              });
              this.props.form.resetFields(["reason"])
              window.history.go(-1)
            }
          }
        })
      }
    })
  }
  // 取消退回
  handleCancel = () =>{
    this.setState({visible:false})
    this.props.form.resetFields(["reason"])
  }

  // 返回
  back = () =>{
    window.history.go(-1)
  }
  
  // 审批状态
  statusType = (type, result)=>{
    if(type == 1){
      return "申请"
    }else if(type == 2){
      if(result == 1){
        return "通过"
      }else if(result == 2){
        return "不通过"
      }
    }else if(type == 3){
      return "撤回"
    }else if(type == 4){
      return "变更"
    }else if(type == 5){
      return "编辑"
    }
  }
  // 现任岗位
  sexType = (type) =>{ //性别
    const types = type + ''
    switch(types){
      case "0":
        return "保密";
      case "1":
        return "男";
      case "2":
        return "女";
      default:
        return ""
    }
  }
  // 现任岗位
  dutyType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "管理岗位";
      case "2":
        return "专业技术岗-教师";
      case "3":
        return "专业技术岗-中层干部";
      case "4":
        return "专业技术岗-副校长";
      case "5":
        return "专业技术岗-校长";
      case "6":
        return "工勤岗位";
      default:
        return ""
    }
  }
  // 教师资格证
  certType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "幼儿园";
      case "2":
        return "小学";
      case "3":
        return "初级中学";
      case "4":
        return "高级中学";
      case "5":
        return "中等职业技术学校";
      case "6":
        return "中等职业学校实习指导";
      case "7":
        return "高等学校";
      default:
        return ""
    }
  }
  // 普通话等级
  chineseLevel = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "一级甲等";
      case "2":
        return "一级乙等";
      case "3":
        return "二级甲等";
      case "4":
        return "二级乙等";
      case "5":
        return "三级甲等";
      case "6":
        return "三级乙等";
      default:
        return ""
    }
  }
  // 现任职称
  currentTitleType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "0":
        return "暂无";
      case "1":
        return "中小学高级教师（正高）";
      case "2":
        return "中小学高级教师（副高）";
      case "3":
        return "中小学一级教师";
      case "4":
        return "中小学二级教师";
      default:
        return ""
    }
  }
  // 现任职级
  currentPositionType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "0":
        return "暂无";
      case "1":
        return "专业技术岗位四级";
      case "2":
        return "专业技术岗位五级";
      case "3":
        return "专业技术岗位六级";
      case "4":
        return "专业技术岗位七级";
      case "5":
        return "专业技术岗位八级";
      case "6":
        return "专业技术岗位九级";
      case "7":
        return "专业技术岗位十级";
      case "8":
        return "专业技术岗位十一级";
      case "9":
        return "专业技术岗位十二级";
      case "10":
        return "未定级";
      default:
        return ""
    }
  }
  // 学历
  education = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "高中";
      case "2":
        return "专科";
      case "3":
        return "本科";
      case "4":
        return "硕士";
      case "5":
        return "博士";
      default:
        return ""
    }
  }
  // 学位
  degree = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "学士";
      case "2":
        return "硕士";
      case "3":
        return "博士";
      default:
        return ""
    }
  }
  // 政治面貌
  politicalType = (type) => {
    const types = type && type.toString()
    switch(types){
      case "1":
        return "群众";
      case "2":
        return "中共党员";
      case "3":
        return "中共预备党员";
      case "4":
        return "共青团员";
      case "5":
        return "民革党员";
      case "6":
        return "民盟盟员";
      case "7":
        return "民建会员";
      case "8":
        return "民进会员";
      case "9":
        return "农工党党员";
      case "10":
        return "致公党党员";
      case "11":
        return "九三学社社员";
      case "12":
        return "台盟盟员";
      case "13":
        return "无党派人士";
      default:
        return ""
    }
  }

  // 项目内容-问题修改
  changeInput = (id, e) =>{
    let newContens = this.state.itemContents
    newContens.map((item, index)=>{
      if(item.questionId == id){
       item.answers = e.target.value
      }
    })
    this.setState({
      itemContents: newContens
    })
  }
  // 选择题
  choiceQuestion = (id,val) => {
    let newContens = this.state.itemContents
    newContens.map((item, index)=>{
      if(item.questionId == id){
       item.answers = val
      }
    })
    this.setState({
      itemContents: newContens
    })
  }
   // 颁证时间选择
   onChangeTime = (date, dateString) => {
    console.log({ dateString });
    this.setState({
      issueCertDate: dateString
    })
  }
  // 项目内容-时间选择
  onTimeChange = (id, date, dateString) => {
    let newContens = this.state.itemContents
    newContens.map((item, index)=>{
      if(item.questionId == id){
       item.answers = dateString
      }
    })
    this.setState({
      itemContents: newContens
    })
  }
  
  // 文件上传
  upload = (id) => {
    this.setState({
      currentQuestionId: id
    })
  }
  // 文件上传限制
  beforeUpload (file) {
    const isFileType = file.type === 'image/jpeg' || file.type === 'image/png';
    const maxFileSize = 5;
    const isLtMax = file.size / 1024 / 1024 < maxFileSize;
    if (!isFileType) {
        message.error('仅支持jpg、png、jpeg格式文件的上传！');
    }
    if (!isLtMax) {
        message.error('文件不能超过5M!');
    }
    return new Promise((resolve, reject) => {
      if(!isLtMax||!isFileType) {
        reject(file);
      } else {
        resolve(file);
      }
    });
  };

  // 上传
  handleChange =  ({file, fileList}) => {
    let questionId = this.state.currentQuestionId
    let newContens = this.state.itemContents
    newContens.map((item, index)=>{
      if(item.questionId == questionId){
        if(file.status == 'done'){
          item.answers.push({
            fileName:file.name,
            hash: file.response && file.response.id
          })
        }
      }
    })
    this.setState({
      itemContents: newContens
    })
  };

  // 文件移除
  remove = (id,index)=>{
    let newContens  = this.state.itemContents
    newContens.map(item =>{
      if(item.questionId == id){
        let arr = item.answers.filter((v, idx)=>{
          return idx != index
        })
        item.answers = arr
      }
    })
    this.setState({
      itemContents: newContens
    }) 
  }

  // 审核通过
  save = () =>{
    let _this = this;
    _this.props.form.validateFields(["issueCertDate","level","grade"],(err, values) => {
      if(!err){
        let answerList = []
        _this.state.itemContents.map(item => {
          if (item.type == 5) {
            answerList.push({
              questionId: item.questionId,
              answer: (item.answers).toString()
            })
          } else if (item.type == 6){
            answerList.push({
              questionId: item.questionId,
              answer: item.answers.length != 0 ? item.answers[0].hash : ''
            })
          } else if (item.type == 7 || item.type == 10){
            let fileHash = []
            item.answers && item.answers.map(v =>{
              fileHash.push(v.hash)
            })
            answerList.push({
              questionId: item.questionId,
              answer: fileHash.toString()
            })
          } else {
            answerList.push({
              questionId: item.questionId,
              answer: item.answers
            })
          }
        })
        const params = {
          "id": _this.state.recordId,
          "issueCertDate": _this.state.issueCertDate,
          "level": values.level || '',
          "grade": values.grade || '',
          "itemContents": answerList,
        }
        confirm({
          title: '提示',
          content: '是否审核通过该信息',
          onOk() {
            _this.props.dispatch({
              type: 'teacherDataCollect/auditApprove',
              payload: params,
              callback: (res)=>{
                if(res.code === 200){
                  message.success('审核通过')
                  setTimeout(()=>{
                    window.history.go(-1)
                  },500)
                }
              }
            })
          },
          onCancel() {},
        });
      }
    })
  }
  // offset
  offsetChange = (num) =>{
    if(num%3 == 0){
       return 0
    }else{
      return 3
    }
   
  }
  preview = (hash)=>{
    window.open(`${imgUrl}/${hash}`, '_blank',);
  }
  render() {
    const { applyContent, examineRecords, itemContents, personInfo,flag, isShow, flag1, isShow1, visible,cate} = this.state;
    const { getFieldDecorator } = this.props.form;
    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const props = {
        name: 'file',
        action: 'https://upload.qiniup.com/',
        accept: ".jpg,.png,.jpeg",
        headers: {
          authorization: 'authorization-text',
          "Content-Disposition":'form-data; name="file";'
        },
        data:{
          token: qiniuToken ? qiniuToken : this.state.qiniuToken,
        },
        beforeUpload: this.beforeUpload,
        onChange: this.handleChange
    }
    const formItemLayout = {
      labelCol: { span:5 },
      wrapperCol: { span: 18 }
    };
    const steps = examineRecords && examineRecords.map((item, index)=>{
      let des = <div>
                  <div>{item.dealer}</div>
                  <div>{formatDate(item.time)}</div>
                  {item.reason ? <div className="reasons">{'原因：' + item.reason}</div> : null}
                </div>
      return  <Step title={this.statusType(item.actType, item.result)} description={des} key={index} />
    })

    return (
      <div className="single-data-audit">
        <div className="content-main auditProgress">
          <h3 className="title">流程进度</h3>
          <Steps current={examineRecords && examineRecords.length} progressDot={customDot}>
            {steps}
          </Steps>
        </div>
        {/* 个人信息 */}
        <div className="content-main detail personInfo">
            <div className="titleBox">
              <h3 className="title">个人信息</h3>
              <span className="unfold" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'double-right'} /></span>
            </div>
            <div className="infoBox" style={{ display: isShow ? 'block' : 'none' }}>
              <h4 className="infoTitle">基础信息</h4>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>姓名：</span>{personInfo.name}</Col>
                <Col span={6}><span>性别：</span>{this.sexType(personInfo.sex)} </Col>
                <Col span={6}><span>民族：</span>{personInfo.nation} </Col>
                <Col span={6}><span>年龄：</span>{personInfo.age} </Col>
              </Row>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>教龄：</span>{personInfo.teachingAge}</Col>
                <Col span={6}><span>现任岗位：</span>{this.dutyType(personInfo.currentDuty)} </Col>
              </Row>
              <h4 className="infoTitle">教资信息</h4>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>教师资格证类型：</span>{this.certType(personInfo.teacherCertType)}</Col>
                <Col span={6}><span>教资取得时间：</span>{personInfo.teacherCertGetDate} </Col>
                <Col span={6}><span>普通话等级：</span>{this.chineseLevel(personInfo.mandarinChineseLevel)} </Col>
              </Row>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>普通话等级取得时间：</span>{personInfo.mandarinChineseLevelGetDate} </Col>
              </Row>
              <h4 className="infoTitle">职级信息</h4>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>现任职称：</span>{this.currentTitleType(personInfo.currentTitle)}</Col>
                <Col span={6}><span>取得资格证时间：</span>{personInfo.currentTitleGetDate} </Col>
                <Col span={6}><span>职称聘任时间：</span>{personInfo.currentTitleAppointDate} </Col>
              </Row>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>现任职级：</span>{this.currentTitleType(personInfo.currentPosition)}</Col>
                <Col span={6}><span>职级聘任时间：</span>{personInfo.currentPositionAppointDate} </Col>
              </Row>
              <h4 className="infoTitle">学位学历信息</h4>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>最高学历：</span>{this.education(personInfo.topEducation)}</Col>
                <Col span={6}><span>最高学位：</span>{this.degree(personInfo.topDegree)} </Col>
                <Col span={6}><span>毕业院校：</span>{personInfo.graduatedSchool} </Col>
                <Col span={6}><span>所学专业：</span>{personInfo.major} </Col>
              </Row>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>学位取得时间：</span>{personInfo.degreeGetDate}</Col>
                <Col span={6}><span>学历取得时间：</span>{personInfo.educationGetDate} </Col>
              </Row>
              <h4 className="infoTitle">政治面貌信息</h4>
              <Row gutter={24} className="margin10">
                <Col span={6}><span>政治面貌：</span>{this.politicalType(personInfo.politicalFace)}</Col>
                <Col span={6}><span>取得时间：</span>{personInfo.politicsGetDate} </Col>
              </Row>
            </div>
        </div>
        {/* 申请内容 */}
        <div className="content-main detail personInfo">
            <div className="titleBox">
              <h3 className="title">申请内容</h3>
              <span className="unfold" onClick={this.toggle1.bind(this)}>{this.state.flag1 ? '收起 ' : '展开 '}<Icon type={flag1 ? 'up' : 'double-right'} /></span>
            </div>
            <div style={{ display: isShow1 ? 'block' : 'none' }}>
              <Form className="applyForm">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label={'所属类型'}>
                      {getFieldDecorator("cate", {initialValue:applyContent.cate})(
                        <Select disabled>
                          <Option value="1">师德师风</Option>
                          <Option value="2">荣誉称号</Option>
                          <Option value="3">教育教学</Option>
                          <Option value="4">科研创新</Option>
                          <Option value="5">支教扶薄</Option>
                          <Option value="6">培养教师</Option>
                          <Option value="7">指导学生</Option>
                          <Option value="8">其他兼职</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5} offset={3}>
                    <FormItem label={'项目名称'}>
                      {getFieldDecorator("itemName", {initialValue:applyContent.itemName})(
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5} offset={3}>
                    <FormItem label={'颁证时间'}>
                      {getFieldDecorator("issueCertDate", {initialValue: applyContent.issueCertDate ? moment(applyContent.issueCertDate,'YYYY-MM-DD') : null, rules: [{required: true,message:"请选择颁证时间",}]})(
                        <DatePicker
                        format="YYYY-MM-DD"
                        placeholder={'颁证时间'}
                        onChange={this.onChangeTime}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label={'级别'}>
                      {getFieldDecorator("level",{initialValue:applyContent.level || undefined})(
                        <Select allowClear placeholder="请选择级别">
                          <Option value="1">国家级</Option>
                          <Option value="2">省级</Option>
                          <Option value="3">市级</Option>
                          <Option value="4">区级</Option>
                          <Option value="5">校级</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5} offset={3}>
                    <FormItem label={'等级'}>
                      {getFieldDecorator("grade",{initialValue:applyContent.grade || undefined})(
                        <Select allowClear placeholder="请选择等级">
                          <Option value="1">特等奖</Option>
                          <Option value="2">一等奖</Option>
                          <Option value="3">二等奖</Option>
                          <Option value="4">三等奖</Option>
                          <Option value="5">优秀奖</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <h3 className="title">项目内容</h3>
              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>
                  {
                    itemContents && itemContents.map((item, idx)=>{
                      if(item.type == 1){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input allowClear onChange={this.changeInput.bind(this, item.questionId)} value={item.answers} placeholder={`请输入`+item.title} maxLength={10} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 2){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                      <Input allowClear onChange={this.changeInput.bind(this, item.questionId)} value={item.answers} placeholder={`请输入`+item.title} maxLength={50} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 3){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input allowClear onChange={this.changeInput.bind(this, item.questionId)} value={item.answers} placeholder={`请输入`+item.title} maxLength={11} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 4){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                      <Select allowClear value={item.answers ? item.answers : undefined} placeholder="请选择" onChange={this.choiceQuestion.bind(this, item.questionId)} >
                                        {
                                          item.answerOptions.map(v =>{
                                            return <Option value={v.item} key={v.item}>{v.val}</Option>
                                          })
                                        }                               
                                      </Select>
                                  </FormItem>
                                </Col>
                      }else if(item.type == 5){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                      <Select allowClear mode="multiple" value={item.answers ? item.answers : []} allowClear placeholder="请选择" onChange={this.choiceQuestion.bind(this, item.questionId)}>
                                        {
                                          item.answerOptions.map(v =>{
                                            return <Option value={v.item} key={v.item}>{v.val}</Option>
                                          })
                                        }                                
                                      </Select>
                                  </FormItem>
                                </Col>
                      }else if(item.type == 6){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}> 
                                  <FormItem label={item.title}>
                                    <Upload
                                      showUploadList={false}
                                    {...props }
                                    >
                                        <Button disabled={item.answers.length >= 1} onClick={this.upload.bind(this,item.questionId)}>
                                            <Icon type="upload" /> 上传文件
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                        <ul>
                                          {
                                            item.answers.map((v, idx)=>{
                                              return  <li className="fileList-li" key={idx}><Icon type="link" /><span style={{cursor:'pointer'}} onClick={this.preview.bind(this, v.hash)}>{v.fileName}</span> <Icon className="close" type="close" onClick={this.remove.bind(this, item.questionId, idx)}/></li>
                                            })
                                          }
                                        </ul>
                                  </FormItem>
                                </Col>
                      }else if(item.type == 7){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}> 
                                  <FormItem label={item.title}>
                                    <Upload
                                      showUploadList={false}
                                    {...props }
                                    >
                                        <Button disabled={item.answers.length >= 3} onClick={this.upload.bind(this, item.questionId)}>
                                          <Icon type="upload" /> 上传文件
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                    <ul>
                                      {
                                        item.answers.map((v, idx)=>{
                                          return  <li className="fileList-li" key={idx}><Icon type="link" /><span style={{cursor:'pointer'}} onClick={this.preview.bind(this, v.hash)}>{v.fileName}</span> <Icon className="close" type="close" onClick={this.remove.bind(this, item.questionId, idx)}/></li>
                                        })
                                      }
                                    </ul>
                                  </FormItem>
                                </Col>
                      }else if(item.type == 8){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input allowClear onChange={this.changeInput.bind(this, item.questionId)} value={item.answers} placeholder={`请输入` + item.title} maxLength={18} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 9){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <DatePicker 
                                    allowClear
                                    showTime  
                                    format="YYYY-MM-DD HH:mm:ss" 
                                    value={item.answers ? moment(item.answers, 'YYYY-MM-DD HH:mm:ss') : undefined} 
                                    onChange={this.onTimeChange.bind(this, item.questionId)}
                                    />
                                  </FormItem>
                                </Col>
                      }
                    })
                  }
                </Row>
              </Form>
            </div>
            <div style={{ textAlign: 'center',marginTop:'20px' }}>
              <Button onClick={this.back.bind(this)}>返回</Button>&emsp;&emsp;
              <Button type="danger" onClick={this.sendBack.bind(this)}>退回</Button>&emsp;&emsp;
              <Button type="primary" onClick={this.save.bind(this)}>审核通过</Button>
            </div>
        </div>
        <Modal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form className="reasonForm">
            <Row gutter={24} >
              <Col span={24}>
                <FormItem {...formItemLayout} label={'退回原因：'}>
                  {getFieldDecorator("reason",{initialValue:'',rules:[{required:true,message:"请输入退回原因"}]})(
                      <Input maxLength={20} placeholder="请输入退回原因，不超过20个字"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(SingleDataAudit));
