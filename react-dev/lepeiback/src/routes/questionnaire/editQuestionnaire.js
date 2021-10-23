import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Select,Checkbox,Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, dateToTimestamp, formatDate, isBlank, upRecord, downRecord} from '../../utils/public';
import './style.less';
import TextArea from 'antd/lib/input/TextArea';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class editQuestionnaire extends Component{
    constructor(props) {
        super(props);
        this.state = {
          canModify: true,
          endTime:'',
          title: '',
          intro: '',
          channel: [],
          questions: []
        };
    }
    componentDidMount=()=>{
      const params={
        "id": this.props.match.params.id
      }
      this.getQuestionnaireDetail(params)
    }
    add =()=>{
      let newData = this.state.questions
      newData.push(
        {
          title: "",
          type: 1,
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
    getQuestionnaireDetail=(params)=>{
      this.props.dispatch({
        type:'questionnaire/getQuestionnaireDetail',
        payload: params,
        callback: res=>{
          if(res.code===200){
            this.setState({
              canModify: res.data.recordsCount == 0 ? true : false,
              questions: res.data.questions,
              channel: res.data.channel,
              title: res.data.title,
              intro: res.data.intro,
              endTime: res.data.endTime
            })
          }
        }
      })
    }

    save = ()=> {
      let me = this
      this.props.form.validateFields((err, values) => {
        if(err){
          return
        }
        let questions = me.state.questions
        let flag = true
        questions&&questions.map(item=>{
          if(isBlank(item.title)){
            flag = false
          }
          if(item.type == 4||item.type == 5){
            item.options.map(i=>{
              if(isBlank(i.val)){
                flag = false
              }
            })
          }else{
            item.options=[]
          }
        })
        if(!flag){
          return message.error("题干或选项不能为空！")
        }
        const params={
          "title" : values.title,
          "intro": values.intro,
          "channel": values.channel,
          "endTime": dateToTimestamp(values.endTime.format('YYYY-MM-DD HH:mm:ss')),
          "questions": questions,
          "id": this.props.match.params.id
        }
        this.props.dispatch({
          type:'questionnaire/updateQuestionnaire',
          payload: params,
          callback: res=>{
            if(res.code===200){
              message.success("更新成功！")
              setTimeout(() => {
                window.history.go(-1)
              }, 1000);
            }
          }
        })
      })
    }

    back=()=>{
      window.history.go(-1)
    }
   
    onChange1= (index, e) => {
        let newData = this.state.questions
        newData[index].title = e.target.value
        this.setState({
          questions: newData
        })
    }
    onChange2= (index, value) => {
        let newData = this.state.questions
        newData[index].type = value
        this.setState({
          questions: newData
        })
    }
    onChange3= (index, index1, e) => {
        let newData = this.state.questions
        newData[index].options[index1].val = e.target.value
        this.setState({
          questions: newData
        })
    }
    onChange4= (index, value) => {
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
      }else if(value==3){
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
      }else if(value==7){
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
      }else if(value==8){
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

    moveUp = (index)=>{
      if(!this.state.canModify) return
      let oldData = this.state.questions
      upRecord(oldData, index)
      this.setState({
        questions: oldData
      })
    }

    moveDown = (index)=>{
      if(!this.state.canModify) return
      let oldData = this.state.questions
      downRecord(oldData, index)
      this.setState({
        questions: oldData
      })
    }

    delete = (index)=>{
      if(!this.state.canModify) return
      let oldData = this.state.questions
      let newData = oldData.filter((item, index1)=>{
        return index1!==index
      })
      this.setState({
        questions: newData
      })
    }

    render(){

        const {questions, title, channel, endTime, intro} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout2 = {
          labelCol: { span: 4 },
          wrapperCol: { span: 8}
        };
        return (
            <div className="content-main questionnaire">
              <h3>基础信息</h3>
              <Form {...formItemLayout2} onSubmit={this.handleSubmit}>
                  <Form.Item label="问卷名称">
                    {getFieldDecorator('title', {
                      initialValue: title||'',
                      rules: [
                        {
                          required: true,
                          message: '请输入问卷名称',
                        },
                      ],
                    })(<Input placeholder="请输入问卷名称" maxLength={100}/>)}
                  </Form.Item>
                  <Form.Item label="问卷收集截止时间">
                    {getFieldDecorator('endTime', {
                      initialValue: moment(formatDate(endTime),'YYYY-MM-DD HH:mm:ss')||'',
                      rules: [
                        {
                          required: true,
                          message: '请输入问卷收集截止时间',
                        }
                      ],
                    })(<DatePicker placeholder="请输入截止时间" showTime />)}
                  </Form.Item>
                  <Form.Item label="采集渠道">
                    {getFieldDecorator('channel', {
                      initialValue: channel||'',
                      rules: [
                        {
                          required: true,
                          message: '请选择采集渠道',
                        }
                      ],
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                            <Checkbox value="1">家长端</Checkbox>
                            <Checkbox value="2">教师端</Checkbox>
                            {/* <Checkbox value="3">班牌端</Checkbox> */}
                            <Checkbox value="4">H5</Checkbox>
                        </Row>
                      </Checkbox.Group>,
                    )}
                  </Form.Item>
                  <Form.Item label="问卷简介">
                    {getFieldDecorator('intro', {
                      initialValue: intro||'',
                      rules: [
                        {
                          required: false,
                          message: '请输入问卷简介',
                        },
                      ],
                    })(<TextArea rows={4} placeholder="请输入简介信息" maxLength={1000} />)}
                  </Form.Item>
              </Form>

              <h3>问卷内容</h3>
              <div className="main-content">
                <ul>
                  {
                    questions&&questions.map((item, index)=>{
                      return <li key={index}>
                                <Row>
                                  <Col span={2}>
                                    <Icon type="up-circle" onClick={this.moveUp.bind(this, index)}/>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Icon type="down-circle" onClick={this.moveDown.bind(this, index)} />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Icon type="close-circle" onClick={this.delete.bind(this, index)} />
                                  </Col>
                                  <Col span={1}>
                                    <span>{index+1}:</span>
                                  </Col>
                                  <Col span={12}>
                                    <Input placeholder="请输入题干" disabled={!this.state.canModify} value={item.title} onChange={this.onChange1.bind(this, index)} style={{ width: '100%', marginRight: 8 }} maxLength={100} />
                                  </Col>
                                  <Col span={6} offset={1}>
                                      <span>问题类型：</span>
                                      <Select
                                        disabled={!this.state.canModify}
                                        style={{ width: 200 }}
                                        placeholder="请选择"
                                        value={item.type.toString()}
                                        onChange={this.onChange2.bind(this, index)}
                                      >
                                        <Option value="1">问答题（结果10字）</Option>
                                        <Option value="2">问答题（结果50字）</Option>
                                        <Option value="3">问答题（手机号）</Option>
                                        <Option value="4">选择题（单选）</Option>
                                        <Option value="5">选择题（多选）</Option>
                                        <Option value="6">图片上传（单张）</Option>
                                      </Select>
                                  </Col>
                                </Row>
                                {
                                  item.type.toString()=="4"||item.type.toString()=="5"?<Row >
                                  <Col span={12} offset={6}>
                                    {
                                      item.options&&item.options.map((i, index1)=>{
                                        return  <Row key={index1}>
                                                  <Col span={2}>
                                                    <span>{i.item}：&nbsp;&nbsp;</span>
                                                  </Col>
                                                  <Col span={18}>
                                                    <Input value={i.val} disabled={!this.state.canModify} onChange={this.onChange3.bind(this, index, index1)} placeholder="请输入选项" maxLength={100} />
                                                  </Col>
                                                </Row>
                                      })
                                    }
                                    
                                  </Col>
                                  <Col span={6}>
                                      <span>选项个数：</span>
                                      <Select
                                        disabled={!this.state.canModify}
                                        style={{ width: 100 }}
                                        placeholder="请选择"
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
                              </Row>:""
                                }
                              </li>  
                  })
                }
                </ul>
              </div>
              <Row style={{textAlign: "center"}}>
                <Button type="dashed" disabled={!this.state.canModify} onClick={this.add.bind(this)} style={{ width: '200px' }}>
                  <Icon type="plus" /> 添加问题
                </Button>
              </Row>
              <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.save.bind(this)}>更新</Button>
              </Row>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // accountList:state.setting.accountData
  }
}

export default connect(mapStateToProps)(Form.create()(editQuestionnaire));
