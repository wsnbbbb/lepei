import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Breadcrumb,Select,Checkbox,Form,Row,Col,Icon,Radio,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux, Link} from 'dva/router';
import {getQueryString, dateToTimestamp, formatDate, isBlank, upRecord, downRecord} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class CustomTypeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          title:"添加",
          title1:"编辑",
          projectName:'',
          cate: undefined,
          status:'',
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
          customTypeId:''
        };
    }
    componentDidMount = () =>{
      const id = getQueryString("id")
      const type=getQueryString('type');
      const params = {
        "id": id
      }
      if(id){
        this.getCustomTypeDetail(params)
        this.setState({
          customTypeId : id
        })
      }
      if(Number(type)===1){
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/custom-type-manage"
            },
          })
    }else{
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title1,
              parentRoute:"/custom-type-manage"
  
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
    // 获取详情
    getCustomTypeDetail = (params) => {
      this.props.dispatch({
        type:'teacherDataCollect/customTypeDetail',
        payload: params,
        callback: res =>{
          if(res.code === 200){
            this.setState({
              questions: res.data.questions,
              status: res.data.status,
              projectName: res.data.name,
              cate: res.data.cate,
            })
          }
        }
      })
    }
    // 项目内容 - 添加
    add =()=>{
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
   
  // 项目内容 - 题干
  onChange1= (index, e) => {
      let newData = this.state.questions
      newData[index].title = e.target.value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 问题类型
  onChange2= (index, value) => {
      let newData = this.state.questions
      newData[index].type = value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 选择题选项输入
  onChange3= (index, index1, e) => {
      let newData = this.state.questions
      newData[index].options[index1].val = e.target.value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 选择题选项个数
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
  // 项目内容 - 问题内容是否必答
  onChange5= (index, value) => {
    let newData = this.state.questions
    newData[index].isMust = value
    this.setState({
      questions: newData
    })
  }
  // 向上移动
  moveUp = (index)=>{
    let oldData = this.state.questions
    upRecord(oldData, index)
    this.setState({
      questions: oldData
    })
  }
  // 向下移动
  moveDown = (index)=>{
    let oldData = this.state.questions
    downRecord(oldData, index)
    this.setState({
      questions: oldData
    })
  }
  // 项目内容 - 问题删除
  delete = (index)=>{
    let oldData = this.state.questions
    let newData = oldData.filter((item, index1)=>{
      return index1!== index
    })
    this.setState({
      questions: newData
    })
  }
  // 保存
  save = ()=> {
    this.props.form.validateFields((err, values) => {
      if(err){
        return
      }
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
        return message.error("题干或选项不能为空！")
      }
      const params={
        "name" : values.projectName,
        "status": values.status,
        "cate": values.cate,
        "questions": questions
      }
      console.log({params});
      if(this.state.customTypeId){
        params.id = this.state.customTypeId
        this.props.dispatch({
          type:'teacherDataCollect/editCustomType',
          payload: params,
          callback: res=>{
            if(res.code === 200){
              message.success("编辑成功！")
              setTimeout(() => {
                window.history.go(-1)
              }, 1000);
            }
          }
        })
      }else{
        this.props.dispatch({
          type:'teacherDataCollect/addCustomType',
          payload: params,
          callback: res=>{
            if(res.code === 200){
              message.success("添加成功！")
              setTimeout(() => {
                window.history.go(-1)
              }, 1000);
            }
          }
        })
      }
    })
  }
  // 返回
  back=()=>{
    window.history.go(-1)
  }
  
  render(){
    const {customTypeId, questions, projectName, cate, status} = this.state;
    const { getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8}
    };
   console.log({customTypeId})
    return (
      <div className="customTypeDetail">
        <div className="content-main">
          <h3 className="title">基础信息</h3>
          <Form {...formItemLayout2}>
            <Form.Item label="项目名称">
              {getFieldDecorator('projectName', {initialValue:projectName, rules: [{required: true,message: '请输入项目名称',}],})(
                <Input placeholder="请输入项目名称" maxLength={50} />
              )}
            </Form.Item>
            <Form.Item label="所属类型">
              {getFieldDecorator('cate', {initialValue: cate, rules: [{required: true, message: '请选择',}],})(
                <Select placeholder="请选择所属类型">
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
            </Form.Item>
            <Form.Item label="当前状态">
              {getFieldDecorator('status', {initialValue:Number(status) || 1,rules: [{required: true,message: '请选择',}],})(
                <Radio.Group >
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
          <h3 className="title">项目内容</h3>
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
                                    value={item.isMust}
                                    onChange={this.onChange5.bind(this, index)}
                                  >
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
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
                                    style={{ width: 200 }}
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
                              </Row> : ""
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
      </div>
    );
  }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(Form.create()(CustomTypeDetail));
