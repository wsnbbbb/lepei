import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Breadcrumb,Select,Checkbox,Form,Row,Col,Icon,Radio,Upload,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux, Link} from 'dva/router';
import {getQueryString, dateToTimestamp, formatDate, isBlank, upRecord, downRecord} from '../../utils/public';
import SectionTag from '../../components/sectionTag'
import './style.less';
import { getImg } from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class OutsideApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          projectName:'',
          approvalRuleId: '',
          remark:'',
          status:'1',
          require: 0,
          questions: [
            {
            title: "",
            type: 1,
            isMust: "0",
            options: [
              {
                item: "A",
                val: ""
              },
              {
                item: "B",
                val: ""
              },{
                item: "C",
                val: ""
              },
              {
                item: "D",
                val: ""
              }
            ]
            },
            {
              title: "",
              type: 1,
              isMust: "0",
              options: [
                {
                  item: "A",
                  val: ""
                },
                {
                  item: "B",
                  val: ""
                },{
                  item: "C",
                  val: ""
                },
                {
                  item: "D",
                  val: ""
                }
              ]
            },
            {
              title: "",
              type: 1,
              isMust: "0",
              options: [
                {
                  item: "A",
                  val: ""
                },
                {
                  item: "B",
                  val: ""
                },{
                  item: "C",
                  val: ""
                },
                {
                  item: "D",
                  val: ""
                }
              ]
            },
            {
              title: "",
              type: 1,
              isMust: "0",
              options: [
                {
                  item: "A",
                  val: ""
                },
                {
                  item: "B",
                  val: ""
                },{
                  item: "C",
                  val: ""
                },
                {
                  item: "D",
                  val: ""
                }
              ]
            },
            {
              title: "",
              type: 1,
              isMust: "0",
              options: [
                {
                  item: "A",
                  val: ""
                },
                {
                  item: "B",
                  val: ""
                },{
                  item: "C",
                  val: ""
                },
                {
                  item: "D",
                  val: ""
                }
              ]
            }
          ],
          typeId:'',
          ruleList:[],
          imgPath:'',
        };
    }
  componentDidMount = () =>{
    const id = getQueryString("id")
    if(id){
      this.getDetail(id)
      this.setState({ typeId: id })
    }
    sessionStorage.removeItem("qiniuToken");
    this.props.dispatch({   //??????????????????token
      type:'user/getPicToken',
      callback: res =>{
        if(res.code === 200){
          sessionStorage.setItem("qiniuToken",res.data.token)
          this.setState({qiniuToken:res.data.token})
        }
      }
    })
    this.props.dispatch({ // ????????????????????????
      type:'outsideApply/getPubApprovalRules',
      callback: res=>{
        if(res.code == 200){
          this.setState({
            ruleList: res.data
          })
        }
      }
    })
    
  }
  // ????????????
  getDetail = (id) => {
    this.props.dispatch({
      type:'outsideApply/getOutsideApplyDetail',
      payload: {id},
      callback: res =>{
        if(res.code === 200){
          this.setState({
            questions: res.data.questions,
            projectName: res.data.name,
            status: res.data.status,
            imgPath: res.data.icon,
            remark: res.data.remark,
            require: res.data.approvalRuleId == 0 ? 0 : 1,
            approvalRuleId: res.data.approvalRuleId != 0 ? String(res.data.approvalRuleId) : undefined,
          })
        }
      }
    })
  }
  // ??????????????????
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('?????????????????????2MB!');
    }
    return isLt2M;
  }
  // ????????????
  handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} ???????????????`);
      this.setState({imgPath:info.file.response.id})
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  
  // ???????????? - ??????
  add = () => {
    let newData = this.state.questions
    newData.push(
      {
        title: "",
        type: 1,
        isMust: "0",
        sort: 1,
        options: [
          {
            item: "A",
            val: ""
          },
          {
            item: "B",
            val: ""
          },
          {
            item: "C",
            val: ""
          },
          {
            item: "D",
            val: ""
          }
        ]
    })
    this.setState({
      questions: newData
    })
  }
   
  // ???????????? - ??????
  onChange1 = (index, e) => {
      let newData = this.state.questions
      newData[index].title = e.target.value
      this.setState({
        questions: newData
      })
  }
  // ???????????? - ????????????
  onChange2 = (index, value) => {
      let newData = this.state.questions
      newData[index].type = value
      this.setState({
        questions: newData
      })
  }
  // ???????????? - ?????????????????????
  onChange3 = (index, index1, e) => {
      let newData = this.state.questions
      newData[index].options[index1].val = e.target.value
      this.setState({
        questions: newData
      })
  }
  // ???????????? - ?????????????????????
  onChange4 = (index, value) => {
    let newData = this.state.questions
    let options = []
    if(value==2){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        }
      ]
    }else if(value == 3){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        }
      ]
    }else if(value==4){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        },
        {
          item: "D",
          val: ""
        }
      ]
    }else if(value==5){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        },
        {
          item: "D",
          val: ""
        },
        {
          item: "E",
          val: ""
        }
      ]
    }else if(value==6){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        },
        {
          item: "D",
          val: ""
        },
        {
          item: "E",
          val: ""
        },
        {
          item: "F",
          val: ""
        }
      ]
    }else if(value == 7){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        },
        {
          item: "D",
          val: ""
        },
        {
          item: "E",
          val: ""
        },
        {
          item: "F",
          val: ""
        },{
          item: "G",
          val: ""
        }
      ]
    }else if(value == 8){
      options = [
        {
          item: "A",
          val: ""
        },
        {
          item: "B",
          val: ""
        },
        {
          item: "C",
          val: ""
        },
        {
          item: "D",
          val: ""
        },
        {
          item: "E",
          val: ""
        },
        {
          item: "F",
          val: ""
        },{
          item: "G",
          val: ""
        },{
          item: "H",
          val: ""
        }
      ]
    }
    newData[index].options = options
    this.setState({
      questions: newData
    })
  }
  // ???????????? - ????????????????????????
  onChange5 = (index, value) => {
    let newData = this.state.questions
    newData[index].isMust = value
    this.setState({
      questions: newData
    })
  }
  // ????????????
  moveUp = (index)=>{
    let oldData = this.state.questions
    upRecord(oldData, index)
    this.setState({
      questions: oldData
    })
  }
  // ????????????
  moveDown = (index)=>{
    let oldData = this.state.questions
    downRecord(oldData, index)
    this.setState({
      questions: oldData
    })
  }
  // ???????????? - ????????????
  delete = (index)=>{
    let oldData = this.state.questions
    let newData = oldData.filter((item, index1)=>{
      return index1!== index
    })
    this.setState({
      questions: newData
    })
  }
  // ??????
  save = ()=> {
    this.props.form.validateFields((err, values) => {
      if(!err){
        let questions = this.state.questions
        let flag = true
        questions && questions.map(item =>{
          if(isBlank(item.title)){
            flag = false
          }
          if(item.type == 4 || item.type == 5){
            item.options.map(i =>{
              if(isBlank(i.val)){
                flag = false
              }
            })
          }else{
            item.options = []
          }
        })
        if(!flag){
          return message.error("??????????????????????????????")
        }
        const params={
          "name" : values.projectName,
          "status": values.status,
          "remark": values.remark,
          "icon": this.state.imgPath || '',
          "questions": questions
        }
        values.require == 1 ? params.approvalRuleId = values.approvalRuleId : params.approvalRuleId = 0
        console.log({params});
        if(this.state.typeId){
          params.id = this.state.typeId
        }
        this.props.dispatch({
          type:this.state.typeId ? 'outsideApply/editOutsideApply' : 'outsideApply/addOutsideApply',
          payload: params,
          callback: res=>{
            if(res.code === 200){
              message.success(this.state.typeId ? "???????????????" : "???????????????")
              setTimeout(() => {
                window.history.go(-1)
              }, 500);
            }
          }
        })
      }
    })
  }
  // ??????
  back = () => {
    window.history.go(-1)
  }
  
  render(){
    const {typeId, questions, projectName, remark, approvalRuleId, status, ruleList, imgPath, require} = this.state;
    const { getFieldDecorator, getFieldValue} = this.props.form;
    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18}
    };
    const props = {
      name: 'file',
      action: 'https://upload.qiniup.com/',
      accept: "image/jpg,image/jpeg,image/png",
      headers: {
        authorization: 'authorization-text',
        "Content-Disposition":'form-data; name="file";'
      },
      data: {
        token: qiniuToken ? qiniuToken : this.state.qiniuToken,
      },
      showUploadList: false,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload
    }
    let option = []
    ruleList && ruleList.length > 0 && ruleList.map(item => {
      option.push(<Option key={item.ruleId}>{item.ruleName}</Option>)
    })
    return (
      <div className="specialCase-detail">
        <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>????????????</Breadcrumb.Item>
            <Breadcrumb.Item>????????????</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/outside-apply-list">??????????????????</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{typeId ? "??????" : "??????"}</Breadcrumb.Item>
          </Breadcrumb>
          <h3>{typeId ? "??????" : "??????"}</h3>
        </div>
        <div className="content-main">
          <SectionTag title="????????????" />
          <Form {...formItemLayout}>
            <div className="baseInfo">
              <div className="left">
                <Form.Item label="????????????">
                {getFieldDecorator('projectName', {initialValue:projectName || '', rules: [{required: true,message: '?????????????????????',}],})(
                  <Input placeholder="?????????????????????" maxLength={30} />
                )}
              </Form.Item>
                <Form.Item label="??????">
                  {getFieldDecorator('remark', {initialValue:remark || '',})(
                    <TextArea rows={4} placeholder="???????????????" maxLength={100} />
                  )}
                </Form.Item>
                <Form.Item label="????????????????????????">
                  {getFieldDecorator('require', {initialValue: Number(require),rules: [{required: true,message: '?????????'}]})(
                    <Radio.Group>
                      <Radio value={1}>???&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
                      <Radio value={0}>???</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="????????????" style={{display: getFieldValue('require') == 1 ? "block" : "none"}}>
                  {getFieldDecorator('approvalRuleId', {initialValue: approvalRuleId || undefined, rules: [{ required: getFieldValue('require')==1?true:false,message: '?????????',}]})(
                    <Select placeholder="?????????????????????">
                      {option}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <div className="right">
                <Form.Item label="????????????">
                  {getFieldDecorator('status', {initialValue:Number(status) || 1,rules: [{required: true,message: '?????????',}],})(
                    <Radio.Group>
                      <Radio value={1}>??????</Radio>
                      <Radio value={2}>??????</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="??????" className="upload">
                  {imgPath ? 
                    <div className="img-box">
                      <img src={getImg(imgPath)} />
                    </div>: null
                  }
                  <Upload {...props}>
                    <Button><Icon type="upload" />????????????</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            
          </Form>
          <SectionTag title="????????????" />
          <div className="main-content">
            <ul>
              {
                questions && questions.map((item, index)=>{
                  return <li key={index}>
                            <Row>
                              <Col span={2}>
                                <Icon type="up-circle" onClick={this.moveUp.bind(this, index)}/>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Icon type="down-circle" onClick={this.moveDown.bind(this, index)} />&nbsp;&nbsp;&nbsp;&nbsp;
                                <Icon type="close-circle" onClick={this.delete.bind(this, index)} />
                              </Col>
                              <Col span={1}>
                                <span>{index + 1}:</span>
                              </Col>
                              <Col span={10}>
                                <Input placeholder="???????????????" value={item.title} onChange={this.onChange1.bind(this, index)} maxLength={100} style={{ width: '100%', marginRight: 8 }} />
                              </Col>
                              <Col span={6} offset={1}>
                                  <span>???????????????</span>
                                  <Select
                                    style={{ width: 200 }}
                                    placeholder="?????????"
                                    value={item.type.toString()}
                                    onChange={this.onChange2.bind(this, index)}
                                  >
                                    <Option value="1">??????????????????10??????</Option>
                                    <Option value="2">??????????????????50??????</Option>
                                    <Option value="3">????????????????????????</Option>
                                    <Option value="4">?????????????????????</Option>
                                    <Option value="5">?????????????????????</Option>
                                    <Option value="6">????????????????????????</Option>
                                    <Option value="7">?????????????????????3??????</Option>
                                    <Option value="8">???????????????????????????</Option>
                                    <Option value="9">???????????????</Option>
                                  </Select>
                              </Col>
                              <Col span={4}>
                                  <span>?????????</span>
                                  <Select
                                    style={{ width: 60 }}
                                    placeholder="?????????"
                                    value={item.isMust}
                                    onChange={this.onChange5.bind(this, index)}
                                  >
                                    <Option value="1">???</Option>
                                    <Option value="0">???</Option>
                                  </Select>
                              </Col>
                            </Row>
                            {
                              item.type.toString() == "4" || item.type.toString() == "5" ? <Row >
                              <Col span={9} offset={4}>
                                {
                                  item.options&&item.options.map((i, index1)=>{
                                    return  <Row key={index1}>
                                              <Col span={2}>
                                                <span>{i.item}???&nbsp;&nbsp;</span>
                                              </Col>
                                              <Col span={22}>
                                                <Input value={i.val} maxLength={100} onChange={this.onChange3.bind(this, index, index1)} placeholder="???????????????" />
                                              </Col>
                                            </Row>
                                  })
                                }
                                
                              </Col>
                              <Col span={6} offset={1}>
                                  <span>???????????????</span>
                                  <Select
                                    style={{ width: 200 }}
                                    placeholder="?????????"
                                    value={item.options.length.toString()}
                                    onChange={this.onChange4.bind(this, index)}
                                  >
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                    <Option value="5">5</Option>
                                    <Option value="6">6</Option>
                                    <Option value="7">7</Option>
                                    <Option value="8">8</Option>
                                  </Select>
                                </Col>
                              </Row> : ""
                            }
                          </li>
              
              })
            }
            </ul>
          </div>
          <Row style={{textAlign: "center"}}>
            <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '200px' }}>
              <Icon type="plus" /> ????????????
            </Button>
          </Row>
          <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
            <Button onClick={this.back.bind(this)}>??????</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.save.bind(this)}>??????</Button>
          </Row>
        </div>
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(Form.create()(OutsideApplyDetail));
