import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Steps, Upload, Popover,Divider, Menu, Dropdown,Icon,Breadcrumb,Tabs,message,Modal,DatePicker,InputNumber } from 'antd';

import { routerRedux } from 'dva/router';
import { getQueryString,formatDate,toTimestamp, isCorrectMoney } from '../../utils/public';
import { getImg } from '../../utils/img';
import ImgPreview from '@/components/imgPreview'
import {imgUrl} from '../../config'

import './style.less';

const FormItem = Form.Item;
const Step = Steps.Step;
const { RangePicker } = DatePicker;
import moment from 'moment';

const customDot = (dot, { status, index }) => (
  <Popover content={<span>步骤 {index+1}</span>}>
    {dot}
  </Popover>
);


class editTeacherDataCheck extends Component{
    constructor(props) {
        super(props);
        this.state = {
          questionList: [],
          itemContents: [{
            questionId: 1,
            answer: []
          }],
          currentIdx: '',
          examineRecords: [],
          applyContent: {}
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({ //获取上传图片token
          type:'user/getPicToken',
          callback:(res)=>{
              if(res.code===200){
                  sessionStorage.setItem("qiniuToken",res.data.token)
                  this.setState({qiniuToken:res.data.token})
              }
          }
      })
      
      this.getDetail();
    }

    getDetail = ()=>{
      const params={
        "id": getQueryString("id"),
      }
      let me = this
      this.props.dispatch({
        type:'teacherDataCollect/getTeacherHonorPersonnelRecordsDetail',
        payload: params,
        callback: (res)=>{
          if(res.code == 200){
            this.setState({
              examineRecords: res.data.examineRecords,
              applyContent: res.data.applyContent
            })

            let arr = []
            res.data.itemContents.map((i, index)=>{
              if(Array.isArray(i.answers)){
                let answer = []
                i.answers.map(item=>{
                  answer.push({
                    name: item.fileName,
                    hash: item.hash
                  })
                })
                arr.push({
                  questionId: i.questionId,
                  answer: answer
                })
              }else{
                arr.push({
                  questionId: i.questionId,
                  answer: i.answers.length>0?i.answers.split(','):[]
                })
              }
            })

            this.setState({
              itemContents: arr,
              questionList: res.data.itemContents
            })

            this.props.form.setFieldsValue({
              "issueCertDate": moment(res.data.applyContent.issueCertDate, "YYYY-MM-DD "),
              "cate": res.data.applyContent.cate,
              "grade": res.data.applyContent.grade?res.data.applyContent.grade+"":undefined,
              "level": res.data.applyContent.level?res.data.applyContent.level+"":undefined,
              "itemId": res.data.applyContent.itemId,
            })
            me.getItemSelect(res.data.applyContent.cate)
          }
        }
      })
    }

    getItemSelect = (value) => {
      if (value) {
        this.setState({ disabled: false })
        this.props.dispatch({
          type: 'teacherDataCollect/getListByCate',
          payload: { "cate": value },
          callback: (res) => {
            if (res.code === 200) {
              this.setState({ projectList: res.data})
            }
          }
        })
      } else {
        this.props.form.resetFields(["itemId"])
        this.setState({ disabled: true })
      }
    }

    // 所属类型选择
    cateSelect = (value) => {
      if (value) {
        this.setState({ disabled: false })
        this.props.dispatch({
          type: 'teacherDataCollect/getListByCate',
          payload: { "cate": value },
          callback: (res) => {
            if (res.code === 200) {
              this.setState({ projectList: res.data})
            }
          }
        })
      } else {
        this.props.form.resetFields(["itemId"])
        this.setState({ disabled: true })
      }
    }

    // 项目选择
    itemSelect = (value) => {
      if (value) {
        this.setState({ disabled: false })
        this.props.dispatch({
          type: 'teacherDataCollect/getItemQuestions',
          payload: { "itemId": value },
          callback: (res) => {
            if (res.code === 200) {
              let arr = []
              res.data.map((i, index)=>{
                arr.push({
                  questionId: i.id,
                  answer: []
                })
              })
              this.setState({ 
                questionList: res.data,
                itemContents: arr
              })
            }
          }
        })
      } else {
        this.props.form.resetFields(["itemId"])
        this.setState({ disabled: true })
      }
    }


    beforeUpload (file) {
        const isFileType = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
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

    handleChange =  ({file, fileList}) => {
      console.log({fileList});

      let qustionId = this.state.currentQuestionId
      let arr = []
      let arr1 = this.state.itemContents.filter(i=>{
        return i.questionId == qustionId
      })
      arr = arr1[0].answer

      if(file.status == 'done'){
        let obj = {
          name: file.name, 
          hash: file.response&&file.response.id||''
        }
        arr.push(obj)
      }
  
      let newContens = this.state.itemContents

      newContens.map((i, index)=>{
        if(i.questionId == qustionId){
          newContens[index]={
            questionId: qustionId,
            answer: arr
          }
        }
      })
      this.setState({
        itemContents: newContens
      })

    };


    onTimeChange = (id, date, dateString) => {
      let newContens = this.state.itemContents
      newContens.map((i, index)=>{
        if(i.questionId == id){
          newContens[index]={
            questionId: id,
            answer: [dateString]
          }
        }
      })
      this.setState({
        itemContents: newContens
      })
      
    }

    changeInput=(id, e)=>{

      let newContens = this.state.itemContents
      newContens.map((i, index)=>{
        if(i.questionId == id){
          newContens[index]={
            questionId: id,
            answer: [e.target.value]
          }
        }
      })
      this.setState({
        itemContents: newContens
      })
    }

    goBack = ()=>{
      window.history.go(-1)
    }

    onChange1 = (id, value)=> {
      let newContens = this.state.itemContents
      newContens.map((i, index)=>{
        if(i.questionId == id){
          newContens[index]={
            questionId: id,
            answer: value
          }
        }
      })
      this.setState({
        itemContents: newContens
      })
    }

    save = (type)=>{
      let newItemContents1 = this.state.itemContents
      let newItemContents = JSON.parse(JSON.stringify(newItemContents1))
      newItemContents.map(i=>{
        if(Array.isArray(i.answer)){
          i.answer.map((j, idx)=>{
            if(Object.prototype.toString.call(j) === '[object Object]'){
              i.answer[idx]= j.hash
            }
          })
          i.answer = i.answer.join(",")||''
        }
      })

      this.props.form.validateFields(["itemId", "issueCertDate", ""],(err, values) => {
        if(!err){
          const params={
            "id": getQueryString('id'),
            "issueCertDate": this.props.form.getFieldValue("issueCertDate").format('YYYY-MM-DD'),
            "level": this.props.form.getFieldValue("level")||'',
            "grade": this.props.form.getFieldValue("grade")||'',
            "type": type,
            "itemContents": newItemContents,
          }
          this.props.dispatch({
            type:'teacherDataCollect/modifyTeacherHonorPersonnelRecords',
            payload: params,
            callback: (res)=>{
              if(res.code == 200){
                if(type == 1){
                  message.success("暂存成功")
                }else if(type == 2){
                  message.success("成功")
                }
                setTimeout(() => {
                  window.history.go(-1)
                }, 2000);
              }
            }
          }) 
        }
        
    })

  }

    upload = (id)=>{
      this.setState({
        currentQuestionId: id
      })
    }

    preview = (hash)=>{
      window.open(`${imgUrl}/${hash}`, '_blank',);
    }


    remove = (id, idx)=>{
      let arr  = this.state.itemContents
      let newArr = []
      arr.map(i=>{
        if(i.questionId == id){
          let arr1 = i.answer.filter((e, index)=>{
            return index!=idx
          })
          newArr.push({
            questionId: i.questionId,
            answer: arr1
          })
        }else{
          newArr.push(i)
        }
      })

      this.setState({
        itemContents: newArr
      }, ()=>{
        console.log(this.state.itemContents)
      })

    }
    generateType = (type, result)=>{
      if(type==1){
        return "申请"
      }else if(type==2){
        return "审批"
      }else if(type==3){
        return "撤回"
      }else if(type==4){
        return "变更"
      }else if(type==5){
        return "编辑"
      }
    }
   
    render(){
        const { getFieldDecorator } = this.props.form;
        const { projectList , questionList} = this.state
        const qiniuToken = sessionStorage.getItem('qiniuToken');
        const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            multiple: true,
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
        
        const detail = this.state.examineRecords
        const steps = detail.map((item, index)=>{
          let des = <div>
                      {item.dealer}
                      <br/>
                      {formatDate(item.time)}
                    </div>
          return <Step title={this.generateType(item.actType, item.result)} description={des} key={index} />
        })

        let options = []
        projectList && projectList.map(item => {
          return options.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
        })

        return (
            <div className="content-main teacher-data-audit">
              <div className="breadcrumb">
                <Breadcrumb>
                  <Breadcrumb.Item>教师数据收集管理</Breadcrumb.Item>
                  <Breadcrumb.Item>教师数据审核</Breadcrumb.Item>
                </Breadcrumb>
                <h3>教师荣誉申请</h3>
              </div>
                 
              <Row className="progress-row">
                <Steps current={detail&&detail.length} progressDot={customDot}>
                   {steps}
                </Steps>
              </Row>
          
              <h2>申请内容</h2>
              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>

                  <Col span={5} offset={2}>
                    <FormItem label={'所属类型'}>
                      {getFieldDecorator("cate", {rules: [{
                            required: true,
                            message:"请选择所属类型",
                            whitespace: true,
                        }]})(
                        <Select disabled placeholder="所属类型" onChange={this.cateSelect.bind(this)}>
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
                  <Col span={5} offset={2}>
                    <FormItem label={'项目名称'}>
                      {getFieldDecorator("itemId", {rules: [{
                            required: true,
                            message:"请选择项目名称",
                            whitespace: true,
                        }]})(
                        <Select disabled placeholder="项目名称" showSearch onChange={this.itemSelect.bind(this)}>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={5} offset={2}>
                    <FormItem label={'颁证时间'}>
                      {getFieldDecorator("issueCertDate",  {rules: [{
                            required: true,
                            message:"请选择颁证时间",
                        }]})(
                        <DatePicker
                          format="YYYY-MM-DD"
                          placeholder={'颁证时间'}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={5} offset={2}>
                    <FormItem label={'级别'}>
                      {getFieldDecorator("level")(
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
                  <Col span={5} offset={2}>
                    <FormItem label={'等级'}>
                      {getFieldDecorator("grade")(
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
              <h2>项目内容</h2>

              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>

                  {
                    questionList.map((i, idx)=>{
                      if(i.type == 1){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                      <Input onChange={this.changeInput.bind(this, i.questionId)} value={this.state.itemContents[idx].answer[0]||""} placeholder={`请输入`+i.title} maxLength={10} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(i.type == 2){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                      <Input onChange={this.changeInput.bind(this, i.questionId)} value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer[0]||""} placeholder={`请输入`+i.title} maxLength={50} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(i.type == 3){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                    <Input onChange={this.changeInput.bind(this, i.questionId)} value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer[0]||''} placeholder={`请输入`} maxLength={11} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(i.type == 4){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                   
                                      <Select value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer[0]||undefined} onChange={this.onChange1.bind(this, i.questionId)} placeholder={`请选择${i.title}`} >
                                        {
                                          i.answerOptions.map((i, index)=>{
                                            return <Option value={i.item} key={i.item}>{i.val}</Option>
                                          })
                                        }                                
                                      </Select>
                                  </FormItem>
                                </Col>
                      }else if(i.type == 5){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                      <Select mode="multiple" value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer} allowClear placeholder={`请选择${i.title}`} onChange={this.onChange1.bind(this, i.questionId)}>
                                        {
                                          i.answerOptions.map((i, index)=>{
                                            return <Option value={i.item} key={i.item}>{i.val}</Option>
                                          })
                                        }                                
                                      </Select>
                                  </FormItem>
                                </Col>
                      }else if(i.type == 6){
                        return  <Col span={5} offset={2}> 
                                  <FormItem label={i.title}>
                                    <Upload
                                      // fileList={this.state.itemContents[idx].answer||[]}
                                      showUploadList={false}
                                    {...props }
                                    >
                                        <Button disabled={this.state.itemContents[idx]&&this.state.itemContents[idx].answer.length >= 1} onClick={this.upload.bind(this, i.questionId)}>
                                            <Icon type="upload" /> 上传图片
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                    <ul>
                                      {
                                        this.state.itemContents[idx]&&this.state.itemContents[idx].answer.map((item, idx)=>{
                                          return  <li className="fileList-li" key={idx}><Icon type="link" />  <span>{item.name}</span>   <Icon type="eye" onClick={this.preview.bind(this, item.hash)}/>  <Icon type="close" onClick={this.remove.bind(this, i.questionId, idx)}/></li>
                                        })
                                      }
                                    </ul>
                                  </FormItem>
                                </Col>
                      }else if(i.type == 7){
                        return  <Col span={5} offset={2}> 
                                  <FormItem label={i.title}>
                                    <Upload
                                      // fileList={this.state.itemContents[idx].answer||[]}
                                      showUploadList={false}
                                    {...props }
                                    >
                                        <Button disabled={this.state.itemContents[idx]&&this.state.itemContents[idx].answer.length >= 3} onClick={this.upload.bind(this, i.questionId)}>
                                            <Icon type="upload" /> 上传图片
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                    <ul>
                                        {
                                          this.state.itemContents[idx]&&this.state.itemContents[idx].answer.map((item, idx)=>{
                                            return  <li className="fileList-li" key={idx}><Icon type="link" />  <span>{item.name}</span>   <Icon type="eye" onClick={this.preview.bind(this, item.hash)}/>  <Icon type="close" onClick={this.remove.bind(this, i.questionId, idx)}/></li>
                                          })
                                        }
                                      </ul>
                                  </FormItem>
                                </Col>
                      }else if(i.type == 8){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                    <Input onChange={this.changeInput.bind(this, i.questionId)} value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer[0]} placeholder={`请输入`} maxLength={18} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(i.type == 9){
                        return  <Col span={5} offset={2}>
                                  <FormItem label={i.title}>
                                    <DatePicker showTime format={'YYYY-MM-DD HH:mm:ss'} value={this.state.itemContents[idx]&&this.state.itemContents[idx].answer[0]&&moment(this.state.itemContents[idx].answer[0], 'YYYY-MM-DD HH:mm:ss')} onChange={this.onTimeChange.bind(this, i.questionId)}/>
                                  </FormItem>
                                </Col>
                      }
                    })
                  }
                 

                
                </Row>
              </Form>

              <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                <Button onClick={this.goBack.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.save.bind(this, 1)}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.save.bind(this, 2)}>提交</Button>
              </Row>

           
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
 
  }
}

export default connect(mapStateToProps)(Form.create()(editTeacherDataCheck));
