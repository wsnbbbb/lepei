import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Breadcrumb,Select,Checkbox,Form,Row,Col,Icon,Radio,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux, Link} from 'dva/router';
import {getGradeType, dateToTimestamp, formatDate, isBlank, upRecord, downRecord} from '../../utils/public';
import './style.less';
import param from '../../utils/param';
import { RSA_NO_PADDING } from 'constants';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class EditOaTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
			    title:"编辑审批模板",
          controlBtn:false,
          ruleList: [],
          questions: [{
            title: "",
            type: 1,
            isMust: 0,
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
            isMust: 0,
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
            isMust: 0,
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
            isMust: 0,
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
            isMust: 0,
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
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getApprovalRules(params)
      const params1={
        "id": this.props.match.params.id
      }
      this.getOaTemplateDetail(params1)

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/oa-template-list"
        },
        })
    }

    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
      }

    getOaTemplateDetail=(params)=>{
      this.props.dispatch({
        type:'oa/getOaTemplateDetail',
        payload: params,
        callback: res=>{
          if(res.code===200){
            this.setState({
              canModify: res.data.recordsCount == 0 ? true : false,
              questions: res.data.questions,
              status: res.data.status,
              name: res.data.name,
              remark: res.data.remark,
              require: res.data.ruleId!=0?"1":"0",
              ruleId: res.data.ruleId==0?'':res.data.ruleId
            })
          }
        }
      })
    }

    // getOaTemplateDetail
    add =()=>{
      let newData = this.state.questions
      newData.push(
        {
          title: "",
          type: 1,
          isMust: 0,
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
    getApprovalRules=(params)=>{
      this.props.dispatch({
        type:'oa/getApprovalRules',
        payload: params,
        callback: res=>{
          if(res.code===200){
            this.setState({
              ruleList: res.data
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
          "id": this.props.match.params.id,
          "name" : values.name,
          "status": values.status,
          "remark": values.remark||'',
          "ruleId": values.require==1?values.ruleId:0,
          "questions": questions
        }
        this.props.dispatch({
          type:'oa/updateOaTemplate',
          payload: params,
          callback: res=>{
            if(res.code===200){
              message.success("保存成功！")
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

    toAdd = () => {
      this.props.dispatch(
        routerRedux.push("/account-detail/")
      )
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
    onChange5= (index, value) => {
      let newData = this.state.questions
      newData[index].isMust = value
      this.setState({
        questions: newData
      })
  }
    moveUp = (index)=>{
      let oldData = this.state.questions
      upRecord(oldData, index)
      this.setState({
        questions: oldData
      })
    }

    moveDown = (index)=>{
      let oldData = this.state.questions
      downRecord(oldData, index)
      this.setState({
        questions: oldData
      })
    }

    delete = (index)=>{
      let oldData = this.state.questions
      let newData = oldData.filter((item, index1)=>{
        return index1!==index
      })
      this.setState({
        questions: newData
      })
    }
   
  


    render(){
        const {questions, ruleList, name, remark, status, require, ruleId} = this.state;
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout2 = {
          labelCol: { span: 4 },
          wrapperCol: { span: 8}
        };
        let option=[]
        ruleList&&ruleList.length>0&&ruleList.map(item=>{
          option.push(<Option key={item.ruleId}>{item.ruleName}</Option>)
        })

        return (
            <div className="content-main questionnaire">
               {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/oa-template-list">通用oa</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>编辑审批模板</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
              <h3>基础信息</h3>
              <Form {...formItemLayout2} onSubmit={this.handleSubmit}>
                  <Form.Item label="流程名称">
                    {getFieldDecorator('name', {
                      initialValue: name||'',
                      rules: [
                        {
                          required: true,
                          message: '请输入流程名称',
                        },
                      ],
                    })(<Input placeholder="请输入流程名称" maxLength={100} />)}
                  </Form.Item>
                  <Form.Item label="备注">
                    {getFieldDecorator('remark', {
                       initialValue: remark||'',
                    })(<TextArea rows={4} placeholder="请简要描述申请流程的特征" maxLength={100} />)}
                  </Form.Item>
                  <Form.Item label="当前状态">
                    {getFieldDecorator('status', {
                      initialValue: parseInt(status)||'',
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        }
                      ],
                    })(<Radio.Group >
                      <Radio value={1}>启用</Radio>
                      <Radio value={2}>禁用</Radio>
                    </Radio.Group>)}
                  </Form.Item>
                  <Form.Item label="是否指定审批规则">
                    {getFieldDecorator('require', {
                        initialValue: require&&require.toString()||'',
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          }
                        ]
                      })(<Radio.Group >
                        <Radio value="1">是&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
                        <Radio value="0">否</Radio>
                      </Radio.Group>)}
                  </Form.Item>
                  <Form.Item label="审批规则" style={{display: getFieldValue('require')==1?"block":"none"}}>
                    {getFieldDecorator('ruleId', {
                      initialValue: ruleId||'',
                      rules: [
                        {
                          required: getFieldValue('require')==1?true:false,
                          message: '请选择',
                        }
                      ]
                      })(
                      <Select placeholder="请选择审批规则">
                        {option}
                      </Select>
                    )}
                  </Form.Item>
              </Form>

              <h3>模板内容</h3>
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
                                  <Col span={10}>
                                    <Input placeholder="请输入题干" value={item.title} onChange={this.onChange1.bind(this, index)} maxLength={100} style={{ width: '100%', marginRight: 8 }} />
                                  </Col>
                                  <Col span={6} offset={1}>
                                      <span>问题类型：</span>
                                      <Select
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
                                        <Option value="7">图片上传（少于3张）</Option>
                                        <Option value="8">问答题（身份证号）</Option>
                                        <Option value="9">日期与时间</Option>
                                      </Select>
                                  </Col>
                                  <Col span={4}>
                                      <span>必答：</span>
                                      <Select
                                        style={{ width: 60 }}
                                        placeholder="请选择"
                                        value={item.isMust.toString()}
                                        onChange={this.onChange5.bind(this, index)}
                                      >
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                      </Select>
                                  </Col>
                                </Row>
                                {
                                  item.type.toString()=="4"||item.type.toString()=="5"?<Row >
                                  <Col span={9} offset={4}>
                                    {
                                      item.options&&item.options.map((i, index1)=>{
                                        return  <Row key={index1}>
                                                  <Col span={2}>
                                                    <span>{i.item}：&nbsp;&nbsp;</span>
                                                  </Col>
                                                  <Col span={22}>
                                                    <Input value={i.val} maxLength={100} onChange={this.onChange3.bind(this, index, index1)} placeholder="请输入选项" />
                                                  </Col>
                                                </Row>
                                      })
                                    }
                                    
                                  </Col>
                                  <Col span={6} offset={1}>
                                      <span>选项个数：</span>
                                      <Select
                                        style={{ width: "100px" }}
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
                <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '200px' }}>
                  <Icon type="plus" /> 添加问题
                </Button>
              </Row>
              <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
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

export default connect(mapStateToProps)(Form.create()(EditOaTemplate));
