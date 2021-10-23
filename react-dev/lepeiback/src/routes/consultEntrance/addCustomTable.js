import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Breadcrumb,Select,Checkbox,Form,Row,Col,Icon,Radio,Upload,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux, Link} from 'dva/router';
import {getQueryString, isBlank, upRecord, downRecord} from '../../utils/public';
import SectionTag from '../../components/sectionTag'
import './style.less';
import { getImg } from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class CustomTableDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          projectName:'',//表单名称
          remark:'',//备注
          status:'1',//状态
          require: 0,
          title:'添加',
          title1:'编辑',
          questions: [
            {
            title: "",
            type: 1,
            isMust: "0",
            options: [
              {
                item: "A",
                val: "",
                isNeedFill:'0',
                prompt:''
              },
              {
                item: "B",
                val: "",
                isNeedFill:'0',
                prompt:''
              },{
                item: "C",
                val: "",
                isNeedFill:'0',
                prompt:''
              },
              {
                item: "D",
                val: "",
                isNeedFill:'0',
                prompt:''
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
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "B",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },{
                  item: "C",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "D",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
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
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "B",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },{
                  item: "C",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "D",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
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
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "B",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },{
                  item: "C",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "D",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
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
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "B",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },{
                  item: "C",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                },
                {
                  item: "D",
                  val: "",
                  isNeedFill:'0',
                  prompt:''
                }
              ]
            }
          ],
          typeId:'',
          ruleList:[],
          imgPath:'',//图标路径
        };
    }
  componentDidMount = () =>{
    const id = getQueryString("id")
    if(id){
      this.getDetail(id)
      this.setState({ typeId: id })
    }
    sessionStorage.removeItem("qiniuToken");
    this.props.dispatch({   //获取上传图片token
      type:'user/getPicToken',
      callback: res =>{
        if(res.code === 200){
          sessionStorage.setItem("qiniuToken",res.data.token)
          this.setState({qiniuToken:res.data.token})
        }
      }
    })
    this.props.dispatch({ // 获取审批规则列表
      type:'infantSpecialCase/getPubApprovalRules',
      callback: res=>{
        if(res.code == 200){
          this.setState({
            ruleList: res.data
          })
        }
      }
    })

    if(id){
      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title1,
            parentRoute:"/custom-table"
          },
        })
     }else{
      this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {
            breadcrumbTitle:this.state.title,
            parentRoute:"/custom-table"
          },
        })
  }
    
  }
  // 获取详情
  getDetail = (id) => {
    this.props.dispatch({
      type:'consultEntrance/editCustomTableList',
      payload: {id},
      callback: res =>{
        if(res.code === 200){
          this.setState({
            questions: res.data.questions,
            projectName: res.data.name,
            status: res.data.status,
            imgPath: res.data.icon,
            remark: res.data.remark,
          })
        }
      }
    })
  }
  // 图片上传限制
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传图片需小于2MB!');
    }
    return isLt2M;
  }
  // 图片上传
  handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功！`);
      this.setState({imgPath:info.file.response.id})
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  
  // 项目内容 - 添加
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
            val: "",
            isNeedFill:'0',
            prompt:''
          },
          {
            item: "B",
            val: "",
            isNeedFill:'0',
            prompt:''
          },
          {
            item: "C",
            val: "",
            isNeedFill:'0',
            prompt:''
          },
          {
            item: "D",
            val: "",
            isNeedFill:'0',
            prompt:''
          }
        ]
    })
    this.setState({
      questions: newData
    })
  }
   
  // 项目内容 - 题干
  onChange1 = (index, e) => {
      let newData = this.state.questions
      newData[index].title = e.target.value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 问题类型
  onChange2 = (index, value) => {
      let newData = this.state.questions
      newData[index].type = value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 选择题选项输入
  onChange3 = (index, index1, e) => {
      let newData = this.state.questions
      newData[index].options[index1].val = e.target.value
      this.setState({
        questions: newData
      })
  }
  // 项目内容 - 选择题选项个数
  onChange4 = (index, value) => {
    let newData = this.state.questions
    let options = []
    if(value==2){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value == 3){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value==4){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "D",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value==5){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "D",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "E",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value==6){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "D",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "E",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "F",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value == 7){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "D",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "E",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "F",
          val: "",
          isNeedFill:'0',
          prompt:''
        },{
          item: "G",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }else if(value == 8){
      options = [
        {
          item: "A",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "B",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "C",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "D",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "E",
          val: "",
          isNeedFill:'0',
          prompt:''
        },
        {
          item: "F",
          val: "",
          isNeedFill:'0',
          prompt:''
        },{
          item: "G",
          val: "",
          isNeedFill:'0',
          prompt:''
        },{
          item: "H",
          val: "",
          isNeedFill:'0',
          prompt:''
        }
      ]
    }
    newData[index].options = options
    this.setState({
      questions: newData
    })
  }
  // 项目内容 - 问题内容是否必答
  onChange5 = (index, value) => {
    let newData = this.state.questions
    newData[index].isMust = value
    this.setState({
      questions: newData
    })
  }
  //是否需要填空
  onChange6 = (index, index1, e) => {
     let newData = this.state.questions
     if(e.target.checked==true){
        newData[index].options[index1].isNeedFill='1'
     }else if(e.target.checked==false){
        newData[index].options[index1].isNeedFill='0'
     }
      this.setState({
        questions: newData
      })
  }
    // 项目内容 - 单选/多选需填空内容
    onChange7 = (index, index1, e) => {
        let newData = this.state.questions
        newData[index].options[index1].prompt = e.target.value
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
      if(!err){
        let questions = this.state.questions
        let flag = true
        let flag2=true
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
          item.options.map(i=>{
              if(i.isNeedFill=='1'){
                if(isBlank(i.prompt)){
                    flag2 = false
                }
              }
          })
        })
        if(!flag){
          return message.error("题干或选项不能为空！")
        }
        if(!flag2){
            return message.error("需填空内容不能为空！")
          }
        const params={
          "name" : values.projectName,
          "status": values.status,
          "remark": values.remark,
          "icon": this.state.imgPath || '',
          "questions": questions
        }
        if(this.state.typeId){
            params.id = this.state.typeId
        }
        this.props.dispatch({
          type:this.state.typeId ? 'consultEntrance/editCustomTableListSave' : 'consultEntrance/addCustomTableList',
          payload: params,
          callback: res=>{
            if(res.code === 200){
              message.success(this.state.typeId ? "编辑成功！" : "添加成功！")
              setTimeout(() => {
                window.history.go(-1)
              }, 500);
            }
          }
        })
      }
    })
  }
  // 返回
  back = () => {
    window.history.go(-1)
  }
  
  render(){
    const {typeId, questions, projectName, remark,status, ruleList, imgPath} = this.state;
    const { getFieldDecorator} = this.props.form;
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
      option.push(<Option value={item.ruleId} key={item.ruleId}>{item.ruleName}</Option>)
    })
    return (
      <div className="CustomTableDetail">
        {/* <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/custom-table">自定义表格管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{typeId ? "编辑" : "添加"}</Breadcrumb.Item>
          </Breadcrumb>
          <h3>{typeId ? "编辑" : "添加"}</h3>
        </div> */}
        <div className="content-main">
          <SectionTag title="基础资料" />
          <Form {...formItemLayout}>
            <div className="baseInfo">
              <div className="left">
                <Form.Item label="表单名称">
                {getFieldDecorator('projectName', {initialValue:projectName || '', rules: [{required: true,message: '表单名称不能为空/长度不能超过30个汉字',}],})(
                  <Input placeholder="请输入表单名称" maxLength={30} />
                )}
              </Form.Item>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {initialValue:remark || '',})(
                    <TextArea rows={4} placeholder="请输入备注" maxLength={100} />
                  )}
                </Form.Item>
              </div>
              <div className="right">
                <Form.Item label="当前状态">
                  {getFieldDecorator('status', {initialValue:Number(status) || 1,rules: [{required: true,message: '请选择',}],})(
                    <Radio.Group>
                      <Radio value={1}>启用</Radio>
                      <Radio value={2}>禁用</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="图标" className="upload">
                  {imgPath ? 
                    <div className="img-box">
                      <img src={getImg(imgPath)} />
                    </div>: null
                  }
                  <Upload {...props}>
                    <Button><Icon type="upload" />上传图标</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            
          </Form>
          <SectionTag title="模板内容" />
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
                                    <Option value="10">时间</Option>
                                    <Option value="11">占位内容</Option>
                                  </Select>
                              </Col>
                              {item.type.toString()!=='11'&&<Col span={4}>
                                  <span>必答：</span>
                                  <Select
                                    style={{ width: 60 }}
                                    placeholder="请选择"
                                    value={item.isMust.toString()}
                                    onChange={this.onChange5.bind(this, index)}
                                  >
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>
                                  </Select>
                              </Col>}
                            </Row>
                            {
                              item.type.toString() == "4" || item.type.toString() == "5" ? <Row >
                              <Col span={6} offset={14}>
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

                              <Col span={22} offset={2}>
                                {
                                  item.options&&item.options.map((i, index1)=>{
                                    return  <Row key={index1}>
                                              <Col span={1}>
                                                <span>{i.item}：&nbsp;&nbsp;</span>
                                              </Col>
                                              <Col span={11}>
                                                <Input value={i.val} maxLength={100} onChange={this.onChange3.bind(this, index, index1)} placeholder="请输入选项" />
                                              </Col>
                                              <Col span={2} offset={1} className='Checkbox'>
                                                 <Checkbox checked={i.isNeedFill=='0'?false:true} onChange={this.onChange6.bind(this, index, index1)}>需填空</Checkbox>
                                              </Col>
                                              {i.isNeedFill=='1'&&<Col span={7}>
                                                 <Input value={i.prompt} maxLength={100} onChange={this.onChange7.bind(this, index, index1)} placeholder="请输入提示信息" />
                                              </Col>}
                                            </Row>
                                  })
                                }
                                
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
            <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
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

export default connect(mapStateToProps)(Form.create()(CustomTableDetail));
