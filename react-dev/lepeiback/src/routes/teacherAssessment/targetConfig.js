import React,{Component} from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import { Button,Input,Form,Tag,Row,Col,Icon,Modal,message,Tree,Breadcrumb, Radio } from 'antd';
import { getQueryString, isCorrectMoney, isBlank, arrIsRepeat} from '../../utils/public';
import { Decrypt} from '../../utils/secret';
import './style.less';

const confirm = Modal.confirm;
const TextArea = Input.TextArea;
const { TreeNode } = Tree;
const FormItem = Form.Item;

class TargetConfig extends Component{
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],//部门结构数据
      id:1,
      expandedFlag:false,
      selectedRows:[],
      expandedKeys:['0'],
      itemId:'',
      type:'',
      id:'',
      targetName:'',
      targetId:'',
      idNum:'',
      targetLevel:0,
      questions:[],
      firstTargetScore:'',
      title:"指标配置"
    };
  }
  componentDidMount = () => {
    const itemId = getQueryString("id")
    const quotaName = Decrypt(getQueryString("quotaName"))
    itemId && this.getTargetList(itemId)
    itemId && this.setState({
      itemId,
      quotaName
    })
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/assess-configuration"
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
  // 获取指标配置结构
  getTargetList = (id) => {
    this.props.dispatch({
      type:'teacherAssessment/assessmentQuotas',
      payload:{"itemId":id},
      callback:(res) => {
        if(res.code === 200){
          this.setState({
            treeData:res.data,
          })
        }
      }
    })
  }

  // 点击指标
  clickTargetName = (data) => {
    this.setState({targetId:data.id})
    if(data.id == 0){
      this.setState({targetLevel:0})
    }else{
      if(Number(data.pid) > 0){ // 二级指标
        this.secondTarget(data.id)
      }else{ // 一级指标
        this.firstTarget(data.id)
      }
    }
  }
  // 获取一级指标项分值
  firstTarget = (id) => {
    this.props.dispatch({
      type:'teacherAssessment/getFirstTargetScore',
      payload:{id},
      callback:(res) => {
        if(res.code === 200){
          this.setState({
            targetLevel:1,
            firstTargetScore:res.data.score,
            remark:res.data.remark,
            currentId:id
          },function(){
            this.props.form.setFieldsValue({
              "firstTargetScore": res.data.score,
              "remark": res.data.remark,
            })
          })
         
        }
      }
    })
  }
  // 获取二级指标项分值
  secondTarget = (id) => {
    this.props.dispatch({
      type:'teacherAssessment/getSecondTargetScore',
      payload:{id},
      callback:(res) => {
        if(res.code === 200){
          this.setState({
            currentId:id,
            targetLevel:2,
            questions:res.data
          })
        }
      }
    })
  }
  // 节点展开/收起
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      expandedFlag:true,
    });
  }
  // 指标添加/编辑/删除
  targetClick = (data,type,e) => {
    e.stopPropagation(); 
    if(type == 'add'){
      let id = this.state.id;
      let newId = id + 1;
      this.setState({
        type:1,
        id:newId,
        targetName:`新增指标${id}`,
        targetId:data.id
      })
      this.props.dispatch({
        type:'teacherAssessment/addAssessTarget',
        payload:{"name":`新增指标${id}`,"pid":data.id,"itemId":this.state.itemId},
        callback:(res) =>{
          if(res.code === 200){
            message.success('指标新增成功！')
            this.getTargetList(this.state.itemId)
            this.setState({
              expandedKeys:this.state.expandedKeys.concat([`${data.id}`])
            })
          }
        }
      })
    }else if(type == 'edit'){
      this.setState({
        edit:true,
        type:2,
        idNum:data.id,
        targetName:data.name,
        targetId:data.id
      })
    }else if(type == 'del'){
      let me = this;
      confirm({
        title: '提示',
        content: "确定删除该指标吗？",
        onOk() {
          me.props.dispatch({
            type:'teacherAssessment/delAssessTarget',
            payload:{ "id":data.id },
            callback:(res) =>{
              if(res.code === 200){
                message.success('删除成功！')
                me.getTargetList(me.state.itemId)
              }
            }
          })
        },
        onCancel() {},
      });
    }
  }
  // 指标修改确定
  handleSubmit = (pid) => {
    this.props.form.validateFields(["targetName"],(err, values) => {
      this.props.dispatch({
        type:'teacherAssessment/updateAssessTarget',
        payload:{"name":values.targetName,"id":this.state.idNum},
        callback:(res)=>{
          if(res.code === 200){
            this.setState({edit:false})
            message.success('修改成功！')
            this.getTargetList(this.state.itemId)
            if(Number(pid) > 0){ // 二级指标
              this.secondTarget(this.state.idNum)
            }else{ // 一级指标
              this.firstTarget(this.state.idNum)
            }
          }
        }
      })
    })
  }
  // 指标修改取消
  handleCancel = () => {
    this.setState({edit:false})
  }
  // 保存一级指标分值
  save = () => {
    this.props.form.validateFields(["firstTargetScore","remark"],(err, values) => {
      if(!err){
        if(!isCorrectMoney(values.firstTargetScore) || Number(values.firstTargetScore) >= 1001){
          return message.error("分值设置不正确")
        }
        const params = {
          "id":this.state.currentId,
          "score":values.firstTargetScore,
          "remark":values.remark,
        }
        this.props.dispatch({
          type:'teacherAssessment/saveFirstTargetScore',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success('保存成功！')
              this.firstTarget(this.state.currentId);
            }
          }
        })
      }
    })
  }
  // 添加选择题/图片
  addQuestion = (type) =>{
    let newData = this.state.questions
    if(type == 1){ // 添加选择题
      newData.push({
        title:'',
        type: 1,
        isMust: 0,
        isRelateMaterial: 0,
        options:[
          {
            item:'',
            score:'',
            scoreType: 1,
          },
          {
            item:'',
            score:'',
            scoreType: 1,
          },
        ]
      })
    }else{ // 添加图片上传
      newData.push({
        title:'',
        type: 3,
        isMust: 0,
      })
    }
    this.setState({
      questions:newData
    })
  }
  // 添加选项
  addOption = (index) =>{
    let newData = this.state.questions
    newData.map((item,idx) =>{
      if(index == idx){
        item.options.push({
          item:'',
          score:'',
          scoreType: 1,
        })
      }
    })
    this.setState({questions:newData})
  }
  // 删除选项
  delOption = (index,index1) =>{
    let newData = this.state.questions
    newData.map((item,idx) =>{
      if(index == idx){
        let arr = item.options.filter((v,i) =>{
          return index1 !== i
        })
       item.options = arr
      }
    })
    this.setState({questions:newData})
  }
  // 复制问题
  copyQuestion = (index) =>{
    let newData = this.state.questions
    newData.map((item,idx) =>{
      if(index == idx){
        newData.push(JSON.parse(JSON.stringify(item)))
      }
    })
    this.setState({questions:newData})
  }
  // 删除问题
  delQuestion = (index) =>{
    let oldData = this.state.questions
    let newData = oldData.filter((item,idx) =>{
      return index !== idx
    })
    this.setState({questions:newData})
  }
  // 是否必答
  isMustChange = (index,e) =>{
    let newData = this.state.questions
    newData[index].isMust = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 题干输入
  titleChange = (index,e) =>{
    let newData = this.state.questions
    newData[index].title = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 类型选择
  typeChange = (index,e) =>{
    let newData = this.state.questions
    newData[index].type = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 资料拉取
  isGetMaterial = (index,e) =>{
    let newData = this.state.questions
    newData[index].isRelateMaterial = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 选项内容
  optionTitle = (index1,index2,e) =>{
    let newData = this.state.questions
    newData[index1].options[index2].item = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 选项分值
  optionScore = (index1,index2,e) =>{
    let newData = this.state.questions
    newData[index1].options[index2].score = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 分值类型
  optionScoreType = (index1,index2,e) =>{
    let newData = this.state.questions
    newData[index1].options[index2].scoreType = e.target.value
    this.setState({
      questions: newData
    })
  }
  // 问题提交
  submit = () =>{
    let questions = this.state.questions
    let flag = true
    let check = true
    let checkNum = true
    let isRepeat = true
    questions && questions.map(item =>{
      let optionName = []
      if(isBlank(item.title)){
        flag = false
      }
      if(item.type != 3){
        item.options && item.options.map(v =>{
          if(isBlank(v.item)){
            flag = false
          }
          if(v.scoreType == 1 && !v.score){
            check = false
          }
          if(v.scoreType == 1 && !isCorrectMoney(v.score) || v.scoreType == 1 && Number(v.score) >= 1001){
            checkNum = false
          }
          optionName.push(v.item)
        })
      }
      if(arrIsRepeat(optionName)){
        isRepeat = false
      }
    })
    if(!flag){
      return message.error("题干或选项不能为空！")
    }
    if(!isRepeat){
      return message.error("选项名称不能重复！")
    }
    if(!check){
      return message.error("分值不能为空！")
    }
    if(!checkNum){
      return message.error("分值设置不正确")
    }
    let params = {
      "id":this.state.targetId,
      "questions":questions
    }
    console.log({params});
    this.props.dispatch({
      type:'teacherAssessment/saveSecondTargetScore',
      payload:params,
      callback:(res) => {
        if(res.code === 200){
          message.success('保存成功！')
          this.secondTarget(this.state.targetId)
        }
      }
    })
  }
  // 指标配置数据结构
  renderTreeNodes = data => data.map((item) => {
    const { getFieldDecorator } = this.props.form;
    if (item.children) {
      return (
        <TreeNode 
          title={<span className='node-title'>
            {this.state.type == 2 && this.state.edit && this.state.idNum == item.id ? 
            <span>
              <Form>
                <FormItem style={{display:'inline-block',width:'50%'}}>
                {getFieldDecorator('targetName',{initialValue:item.name,rules:[{required:true,message:'请输入指标名称',whitespace: true,}]})(
                  <Input placeholder="" />
                )}
                </FormItem>
                <Button type='primary' size='small' onClick={this.handleSubmit.bind(this, item.pid)}>确定</Button>
                <Button size='small' onClick={this.handleCancel}>取消</Button>
              </Form>
            </span>:
            <span className='node-title'>
              <span className={item.id == this.state.targetId ? "active" : ""} onClick={this.clickTargetName.bind(this,item)}>{item.name}</span>
              {item.id == 0 ? null : <Icon type="edit" onClick={this.targetClick.bind(this,item,'edit')} />}
              {Number(item.pid) > 0 ? null : <Icon type="plus-circle" onClick={this.targetClick.bind(this,item,'add')} />}
              {item.id == 0 ? null : <Icon type="minus-circle" onClick={this.targetClick.bind(this,item,'del')} />}
            </span>
              } 
            </span>}
          key={item.id} dataRef={item}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode 
    title={<span className='node-title'>
      {this.state.type == 2 && this.state.edit && this.state.idNum == item.id ? 
        <span>
          <Form>
            <FormItem style={{display:'inline-block',width:'50%'}}>
            {getFieldDecorator('targetName',{initialValue:item.name})(
              <Input placeholder="" />
            )}
            </FormItem>
            <Button type='primary' size='small' onClick={this.handleSubmit.bind(this, item.pid)}>确定</Button>
            <Button size='small' onClick={this.handleCancel}>取消</Button>
          </Form>
        </span>:
        <span className='node-title'>
          <span className={item.id == this.state.targetId ? "active" : ""} onClick={this.clickTargetName.bind(this,item)}>{item.name}</span>
          {item.id == 0 ? null : <Icon type="edit" onClick={this.targetClick.bind(this,item,'edit')} />}
          {Number(item.pid) > 0 ? null : <Icon type="plus-circle" onClick={this.targetClick.bind(this,item,'add')} />}
          {item.id == 0 ? null : <Icon type="minus-circle" onClick={this.targetClick.bind(this,item,'del')} />}
        </span>
      }
      </span>}
    key={item.id} dataRef={item} />;
  })
  render(){
    const { getFieldDecorator } = this.props.form;
    const { targetLevel, treeData,expandedFlag, expandedKeys,firstTargetScore,remark,questions,quotaName} = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 }
    };
    const formItemLayout1 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };
    const formItemLayout2 = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const formItemLayout3 = {
      labelCol: { span: 11 },
      wrapperCol: { span: 12 }
    };
    return (
      <div className="target-config">  
        <div className="content-main">
          <div className="target-name">
            考核名称：<Tag>{quotaName}</Tag>
          </div>
          <div className="main-box">
            <div className='left-box'>
              <Tree showLine expandedKeys={expandedFlag ? expandedKeys : ['0']} onExpand={this.onExpand}>
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div> 
            <div className='right-box'>
              {targetLevel == 1 ?
                <Form>
                  <Row gutter={24}>
                    <Col span={9}>
                      <Form.Item {...formItemLayout1} label="考核分值">
                        {getFieldDecorator("firstTargetScore",{initialValue:firstTargetScore,rules: [{ required: true,message: '考核分值不能为空'}]})(
                          <Input placeholder="考核分值"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <span className="remark">请设置一级指标项分值，分值为非负数，最多保留两位小数<span>设置后，请保存</span></span>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={20}>
                      <FormItem {...formItemLayout} label={'备注'}>
                        {getFieldDecorator("remark",{initialValue:remark || ''})(
                          <TextArea placeholder="限制输入50个汉字" maxLength={50} autosize={{ minRows: 2, maxRows: 3 }}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col offset={3} span={20}><Button type='primary' onClick={this.save.bind(this)}>保存</Button></Col>
                  </Row>
                </Form> : (targetLevel == 2 ? 
                <div>
                  <Row gutter={24}>
                    <Col span={24} offset={1}>
                      <Button type='primary' onClick={this.addQuestion.bind(this,1)}>添加选择题</Button>&emsp;
                      <Button type='primary' onClick={this.addQuestion.bind(this,2)}>添加图片上传</Button>
                    </Col>
                  </Row>
                  <div className="questionsBox">
                    <Form>
                      {
                        questions && questions.map((item,index) => {
                          if(item.type == 3){
                            return  <div className="questions" key={index}>
                                      <Row gutter={24} >
                                        <Col span={23}>
                                          <Form.Item {...formItemLayout3} label="必答">
                                            <Radio.Group onChange={this.isMustChange.bind(this,index)} value={item.isMust}>
                                              <Radio value={1}>是</Radio>
                                              <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Row gutter={24}>
                                        <Col span={21} offset={1}>
                                          <TextArea onChange={this.titleChange.bind(this,index)} value={item.title} placeholder="请输入题干，限制500个汉字" autosize={{ minRows: 3, maxRows: 5 }}/>
                                        </Col>
                                      </Row>
                                      <Row gutter={24}>
                                        <Col span={22} className="copy">
                                          <Button type='primary' onClick={this.copyQuestion.bind(this,index)}>复制问题</Button>&emsp;
                                          <Button type="danger" onClick={this.delQuestion.bind(this,index)}>删除问题</Button>
                                        </Col>
                                      </Row>
                                    </div>
                          }else{
                            return  <div className="questions" key={index}>
                                      <Row gutter={24}>
                                        <Col span={9}>
                                          <Form.Item {...formItemLayout2} label="类型">
                                            <Radio.Group value={item.type} onChange={this.typeChange.bind(this,index)}>
                                              <Radio value={1}>单选</Radio>
                                              <Radio value={2}>多选</Radio>
                                            </Radio.Group>
                                          </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                          <Form.Item {...formItemLayout2} label="必答">
                                            <Radio.Group onChange={this.isMustChange.bind(this,index)} value={item.isMust}>
                                              <Radio value={1}>是</Radio>
                                              <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                          </Form.Item>
                                        </Col>
                                        <Col span={7}>
                                          <Form.Item {...formItemLayout2} label="资料拉取">
                                            <Radio.Group onChange={this.isGetMaterial.bind(this,index)} value={item.isRelateMaterial}>
                                              <Radio value={1}>是</Radio>
                                              <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Row gutter={24}>
                                        <Col span={21} offset={1}>
                                          <TextArea onChange={this.titleChange.bind(this,index)} value={item.title} placeholder="请输入题干，限制500个汉字" autosize={{ minRows: 3, maxRows: 5 }}/>
                                        </Col>
                                      </Row>
                                      {item.options.map((v,i) => {
                                          return  <div key={i}>
                                                    <Row gutter={24}>
                                                      <Col span={12} offset={1}>
                                                        <TextArea onChange={this.optionTitle.bind(this,index,i)} value={v.item} placeholder="请输入选项，限制200个汉字" autosize={{ minRows: 2, maxRows: 3 }}/>
                                                      </Col>
                                                      <div className="options">
                                                        {v.scoreType == 1 && (<Form.Item {...formItemLayout1} label="分值">
                                                          <Input value={v.score} onChange={this.optionScore.bind(this,index,i)}/>
                                                        </Form.Item>)}
                                                        <Radio.Group onChange={this.optionScoreType.bind(this,index,i)} value={v.scoreType}>
                                                          <Radio value={1}>指定分值</Radio>
                                                          <Radio value={2}>用户填写</Radio>
                                                        </Radio.Group>
                                                        {item.options.length > 1 ? <Icon className="icon" type="minus-circle" onClick={this.delOption.bind(this,index,i)}/> : null}
                                                      </div>
                                                    </Row>
                                                  </div>
                                      })}
                                      <div className="add-btn">
                                        <Button type="dashed" onClick={this.addOption.bind(this,index)} style={{ width: '40%' }}><Icon type="plus" /> 添加选项</Button>
                                      </div>
                                      <Row gutter={24}>
                                        <Col span={22} className="copy">
                                          <Button type='primary' onClick={this.copyQuestion.bind(this,index)}>复制问题</Button>&emsp;
                                          <Button type="danger" onClick={this.delQuestion.bind(this,index)}>删除问题</Button>
                                        </Col>
                                      </Row>
                                    </div>
                          }
                        })
                      }
                    </Form>
                  </div>
                  <Row gutter={24} style={{marginTop:'20px'}}>
                    <Col span={24} offset={1}>
                      <Button type='primary' onClick={this.submit.bind(this)}>保存</Button>
                    </Col>
                  </Row>
                </div> : null)
              }
            </div>
          </div>
        </div>  
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(Form.create()(TargetConfig));
