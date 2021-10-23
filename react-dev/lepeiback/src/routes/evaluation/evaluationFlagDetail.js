import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, TreeSelect, Tag, InputNumber, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getScoreType, getCycleType, getSexType, getGradeType, getQueryString} from '../../utils/public';
import './style.less';
import {getImg} from '../../utils/img';
import iconStar from '../../assets/icon-star.png';

import { getPortrait } from '../../utils/img';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { TreeNode } = TreeSelect;


class evaluationFlagDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          imageUrl: '',
          ruleTypeVal: '',
       
          typeList: [],
          rule: [{
            typeId: undefined,
            icon: '',
            ruleType: undefined,
            value: undefined
          }],
          scoringType: 2,
          appointList: [],
          rule1: [
            {
              typeId: undefined,
              value: undefined
            }
          ],
          isEdit: false,
          title:"编辑流动红旗规则",
        };
    }
    componentDidMount=()=>{
      this.getDetail()
      this.getApointGroup()
      this.props.form.getFieldValue('ruleType')
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
          parentRoute:"/class-evaluation-group-list"
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

    getApointGroup=()=>{
      this.props.dispatch({
        type:'evaluate/getApointGroup',
        payload: {groupId: getQueryString('id'), cycleType: 1},
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              appointList: res.data
           })
          }
        }
      })
    }
    getDetail=()=>{
      this.props.dispatch({
        type:'evaluate/getEvaluationFlagDetail',
        payload: {groupId: getQueryString('id')},
        callback:(res)=>{
          if(res.code===200){
            if(res.data){
              this.setState({
                isEdit: true
              })
              this.props.form.setFieldsValue({
                "scoringType": res.data.scoringType
              })
              if(res.data.scoringType==1){
                this.props.form.setFieldsValue({
                  "icon": res.data.icon,
                  "awardMethod1": res.data.awardMethod,
                  "ruleType": res.data.ruleType==0?undefined:res.data.ruleType
                })
                this.setState({
                  imageUrl: res.data.icon,
                  scoringType: res.data.scoringType,
                })
                if(res.data.ruleType==4){
                  this.setState({
                    ruleTypeVal: undefined
                  })
                }else{
                  this.setState({
                    ruleTypeVal: res.data.rule
                  })
                }
                if(Array.isArray(res.data.rule)){
                  this.setState({
                    rule1: res.data.rule
                  })
                }
              }else if(res.data.scoringType==2){
                this.props.form.setFieldsValue({
                  "awardMethod": res.data.awardMethod,
                })
                this.setState({
                  rule: res.data.rule
                })
              }

             
            }else{
              this.setState({
                visible: true
              })
            }
            

          }
        }
      })
    }

    handleChange = info => {
      if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          this.setState({imageUrl: info.file.response.id})
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
      }
    };

    beforeUpload = (file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片格式仅支持JPG/PNG');
      }
      const isLt400K = file.size / 1024 < 400;
      if (!isLt400K) {
        message.error('图片不能大于400kB!');
      }
      return isJpgOrPng && isLt400K;
    }


 

    changeRuleType=(index, value)=>{
      let newData = this.state.rule
      newData[index].ruleType =  value
      this.setState({
        rule: newData
      })
    }

    changeTypeId=(index, value)=>{
      let newData = this.state.rule
      newData[index].typeId =  value
      this.setState({
        rule: newData
      })
    }

    changeRankValue=(index, value)=>{
      let newData = this.state.rule
      newData[index].value =  value
      this.setState({
        rule: newData
      })
    }


    changeRankValue1=(value)=>{
      this.setState({
        ruleTypeVal: value
      })
    }

    handleImgsChange = (index, info) => {
      if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          let oldData = this.state.rule
          oldData[index].icon = info.file.response.id
          this.setState({
            rule: oldData
          })
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
      }
    };

    changeTypeId1=(index, value)=>{
      let newData = this.state.rule1
      newData[index].typeId =  value
      this.setState({
        rule1: newData
      })
    }

    changeNumberInput = (index, e) => {
      let newData = this.state.rule1
      newData[index].value = e
      this.setState({
        rule1: newData
      })
    }

    addItem = ()=>{
      this.state.rule.push({
        typeId: undefined,
        icon: '',
        ruleType: undefined,
        value: undefined
      })
      this.setState({
        rule: this.state.rule
      })
    }

    addItem1 = ()=>{
      this.state.rule1.push({
        typeId: undefined,
        value: undefined
      })
      this.setState({
        rule1: this.state.rule1
      })
    }
    // 返回
    back = () =>{
      window.history.go(-1)
    }

    typeChange=(val)=>{
      this.setState({
        scoringType: val
      })
    }
    comfirm = ()=>{
      this.props.form.validateFields(['scoringType1'], (err, values) => {
        if(err) return
        this.props.form.setFieldsValue({
          scoringType: values.scoringType1
        })

        this.setState({
          visible: false,
          scoringType: values.scoringType1
        })
      })
    }

    save = () =>{
      this.props.form.validateFields(['scoringType', 'awardMethod', 'awardMethod1', "ruleType"], (err, values) => {
        if(err) return
        let params = {}
        if(values.scoringType==1){
          if(!this.state.imageUrl) return message.error("请上传流动红旗后再试！")
          let rule
          if(this.props.form.getFieldValue("ruleType")==4){
            rule = this.state.rule1
            if(Array.isArray(rule)&&rule.length==0){
              return message.error("请填完考评项后再试！")
            }
            if(Array.isArray(rule)&&rule.length>0&&this.props.form.getFieldValue("awardMethod1")==1){
              let flag = true
              rule.map(i=>{
                if(!i.typeId||!i.value){
                  flag = false
                }
              })
              if(!flag) return message.error("请填完考评项后再试！")
            }
          }else{
            if(!this.state.ruleTypeVal) return message.error("请填完规则后再试！")
            rule = this.state.ruleTypeVal+""
          }
          params = {
            scoringType: 1,
            awardMethod: values.awardMethod1||'',
            groupId: getQueryString('id'),
            icon: this.state.imageUrl||'',
            ruleType: values.awardMethod1==1?this.props.form.getFieldValue("ruleType"):null,
            rule: values.awardMethod1==1?rule:null

          }
        }

        if(values.scoringType==2){
          let rule = this.state.rule
          if(Array.isArray(rule)&&rule.length==0){
            return message.error("请填完考评项后再试！")
          }
          if(Array.isArray(rule)&&rule.length>0){
            let flag = true
            rule.map(i=>{
              if(!i.typeId||!i.icon){
                flag = false
              }
            })
            if(values.awardMethod==1){
              rule.map(i=>{
                if(!i.value||!i.ruleType){
                  flag = false
                }
              })
            }
            if(!flag) return message.error("请填完考评项后再试！")
          }

          params = {
            scoringType: 2,
            awardMethod: values.awardMethod||'',
            groupId: getQueryString('id'),
            rule: this.state.rule
          }
        }

        this.props.dispatch({
          type:'evaluate/setEvaluationFlag',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              message.success("设置成功")
            }
          }
        })
      })
    }

    deleteItem =(index)=>{
      let newArr = this.state.rule.filter((i, idx)=>{
        return idx!=index
      })
      this.setState({
        rule: newArr
      })
    }

    deleteType =(index)=>{
      let newArr = this.state.rule1.filter((i, idx)=>{
        return idx!=index
      })
      this.setState({
        rule1: newArr
      })
    }
      
    render(){

        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const { getFieldDecorator } = this.props.form;
        const { typeList, imageUrl, scoringType, appointList} = this.state;
        const formItemLayout = {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        };

        const formItemLayout1 = {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        };
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        const props = {
          name: 'file',
          action: 'https://upload.qiniup.com/',
          accept: "image/jpg,image/jpeg,image/png",
          headers: {
            authorization: 'authorization-text',
            "Content-Disposition":'form-data; name="file";'
          },
          data: {
              token: qiniuToken?qiniuToken:this.state.qiniuToken,
          },
          showUploadList: false,
          onChange: this.handleChange,
          beforeUpload: this.beforeUpload
        };
        const props1 = {
          name: 'file',
          action: 'https://upload.qiniup.com/',
          accept: "image/jpg,image/jpeg,image/png",
          headers: {
            authorization: 'authorization-text',
            "Content-Disposition":'form-data; name="file";'
          },
          data: {
              token: qiniuToken?qiniuToken:this.state.qiniuToken,
          },
          showUploadList: false,
          beforeUpload: this.beforeUpload
        };
        let appointChild = []
        appointList&&appointList.length>0&&appointList.map(item=>{
          appointChild.push(<Option key={item.id}>{item.name}</Option>)
        })
     
        return (
            <div className="content-main">
                {/* <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/class-evaluation-group-list">年级组管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.isEdit?"编辑":"新增"}流动红旗规则</Breadcrumb.Item>
                </Breadcrumb> */}
              <Form>
          
                  <Row gutter={24}>
                      <Col span={10}>
                        <Form.Item {...formItemLayout1} label="记分类型">
                          {getFieldDecorator('scoringType', {
                            rules: [{ required: true, message: '请选择' }],
                          })(
                            <Select disabled placeholder="请选择" onChange={this.typeChange.bind(this)}>
                              <Option value="1">周总分发一面</Option>
                              <Option value="2">每项周总分发多面</Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>

                          {
                            <div style={{display: this.props.form.getFieldValue("scoringType")==1?"block": "none"}}>
                                              <Row gutter={24}>
                                                  <Col span={10}>
                                                      <Form.Item {...formItemLayout1} label="流动红旗图标">
                                                        <Upload
                                                          action="https://upload.qiniup.com/"
                                                          accept="image/jpg,image/jpeg,image/png"
                                                          listType="picture-card"
                                                          showUploadList={false}
                                                          multiple={true}
                                                          {...props}
                                                        >
                                                          {imageUrl ? <img src={getPortrait(imageUrl)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                                        </Upload>
                                                      </Form.Item>
                                                  </Col>
                                                  <Col span={14}>
                                                      <p>尺寸大小不超过210px*210px</p>
                                                  </Col>
                                              </Row>

                                              <Row gutter={24}>
                                                  <Col span={10}>
                                                    <Form.Item {...formItemLayout1} label="颁发方式">
                                                      {getFieldDecorator('awardMethod1', {
                                                        rules: [{ required: this.props.form.getFieldValue("scoringType")==1, message: '请选择' }],
                                                      })(
                                                        <Select placeholder="请选择">
                                                          <Option value="1">自动颁发</Option>
                                                          <Option value="2">手动颁发</Option>
                                                        </Select>,
                                                      )}
                                                    </Form.Item>
                                                  </Col>
                                              </Row>
                                              <Row gutter={24}  style={{display: this.props.form.getFieldValue('awardMethod1')==1?"block":'none'}}>
                                                  <Col span={10}>
                                                    <Form.Item {...formItemLayout1} label="规则类型">
                                                      {getFieldDecorator('ruleType', {
                                                        rules: [{ required: this.props.form.getFieldValue('awardMethod1')==1, message: '请选择' }],
                                                      })(
                                                        <Select placeholder="请选择">
                                                          <Option value="1">组内排名</Option>
                                                          <Option value="2">年级排名</Option>
                                                          <Option value="3">每周成绩</Option>
                                                          <Option value="4">按考评项</Option>
                                                        </Select>,
                                                      )}
                                                    </Form.Item>
                                                  </Col>
                                              </Row>

                                              <Row gutter={24} style={{display: this.props.form.getFieldValue('awardMethod1')==1&&this.props.form.getFieldValue('ruleType')&&this.props.form.getFieldValue('ruleType')!=4?"block":'none'}}>
                                                  <Col span={10}>
                                                    <Form.Item {...formItemLayout1} label="规则">
                                                    每个{this.props.form.getFieldValue('ruleType')==1?"组内排名前":null}{this.props.form.getFieldValue('ruleType')==2?"年级排名前":null}{this.props.form.getFieldValue('ruleType')==3?"每周得分大于":null}{this.props.form.getFieldValue('ruleType')==4?"年级排名前":null}&nbsp;&nbsp;
                                                        <InputNumber min={1} value={this.state.ruleTypeVal} placeholder="请输入" max={10000} onChange={this.changeRankValue1.bind(this)} />
                                                      &nbsp;&nbsp;的班级
                                                    </Form.Item>
                                                  </Col>
                                              </Row>

                                              {
                                                this.props.form.getFieldValue('awardMethod1')==1&&this.props.form.getFieldValue('ruleType')==4?
                                                this.state.rule1.map((i, index)=>{
                                                  return <Row gutter={24} key={index}>
                                                            <Col span={10}>
                                                              <Form.Item {...formItemLayout1} label="考评项">
                                                                  <Select placeholder="请选择" value={i.typeId} onChange={this.changeTypeId1.bind(this, index)}>
                                                                    {appointChild}
                                                                  </Select>
                                                              </Form.Item>
                                                            </Col>
                                                            <Col span={10}>
                                                              点亮每周总分大于等于
                                                              <InputNumber min={0} step={0.5} value={i.value} onChange={this.changeNumberInput.bind(this, index)} /> &nbsp;&nbsp;分的班级
                                                              <Button type="link" onClick={this.deleteType.bind(this, index)}>删除</Button>
                                                            </Col>
                                                        </Row>
                                                })
                                                :null
                                              }

                                              {
                                                  this.props.form.getFieldValue('awardMethod1')==1&&this.props.form.getFieldValue('ruleType')==4?<Row gutter={24} style={{textAlign: 'center'}}>
                                                    <Col span={10}>
                                                      <Button type='primary' onClick={this.addItem1.bind(this)}>添加</Button>
                                                    </Col>
                                                  </Row>:null
                                              }
                                              

                            </div>
                          }

                          {
                            scoringType==2?<div>
                                  <Row gutter={24}>
                                      <Col span={10}>
                                        <Form.Item {...formItemLayout1} label="颁发方式">
                                          {getFieldDecorator('awardMethod', {
                                            rules: [{ required: this.props.form.getFieldValue("scoringType")==2, message: '请选择' }],
                                          })(
                                            <Select placeholder="请选择">
                                              <Option value="1">自动颁发</Option>
                                              <Option value="2">手动颁发</Option>
                                            </Select>,
                                          )}
                                        </Form.Item>
                                      </Col>
                                  </Row>
                              {
                                Array.isArray(this.state.rule)&&this.state.rule.map((i, index)=>{
                                  return <div key={index} className="item">
                                   

                                  <Row gutter={24}>
                                      <Col span={10}>
                                        <Form.Item {...formItemLayout1} label="考评项">
                                            <Select placeholder="请选择" value={i.typeId} onChange={this.changeTypeId.bind(this, index)}>
                                              {appointChild}
                                            </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={10}>
                                        <Button type="link" onClick={this.deleteItem.bind(this, index)}>删除</Button>
                                      </Col>
                                  </Row>

                                  <Row gutter={24}>
                                      <Col span={10}>
                                          <Form.Item {...formItemLayout1} label="流动红旗图标">
                                            <Upload
                                              action="https://upload.qiniup.com/"
                                              accept="image/jpg,image/jpeg,image/png"
                                              listType="picture-card"
                                              showUploadList={false}
                                              multiple={true}
                                              {...props1}
                                              onChange={this.handleImgsChange.bind(this, index)}
                                             
                                            >
                                              {i.icon ? <img src={getPortrait(i.icon)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                            </Upload>
                                          </Form.Item>
                                      </Col>
                                      <Col span={14}>
                                          <p>尺寸大小不超过210px*210px</p>
                                      </Col>
                                  </Row>
                                  <div style={{display: this.props.form.getFieldValue('awardMethod')==2?'none':'block'}}>
                                    <Row gutter={24} >
                                        <Col span={10}>
                                          <Form.Item {...formItemLayout1} label="规则类型">
                                              <Select placeholder="请选择"  value={i.ruleType} onChange={this.changeRuleType.bind(this, index)}>
                                                <Option value="1">组内排名</Option>
                                                <Option value="2">年级排名</Option>
                                                <Option value="3">每周成绩</Option>
                                              </Select>
                                          </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{display: i.ruleType&&i.ruleType!=4?'block':'none'}}>
                                        <Col span={10}>
                                          <Form.Item {...formItemLayout1} label="规则">
                                          每个{i.ruleType==1?"组内排名前":null}{i.ruleType==2?"年级排名前":null}{i.ruleType==3?"每周得分大于":null}{i.ruleType==4?"年级排名前":null}&nbsp;&nbsp;
                                              <InputNumber min={1} value={i.value} placeholder="请输入" max={10000} onChange={this.changeRankValue.bind(this, index)} />
                                            &nbsp;&nbsp;的班级
                                          </Form.Item>
                                        </Col>
                                    </Row>
                                   </div>
                                 
                                  </div>
                                  
                                })
                              }
                              <Row gutter={24} style={{textAlign: 'center'}}>
                                <Col span={10}>
                                  <Button type='primary' onClick={this.addItem.bind(this)}>添加</Button>
                                </Col>
                              </Row>
                               
                            </div>:null
                          }
             
            

              </Form>   

              <div className="btn">
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.save.bind(this)}>保存</Button>
              </div>

              <Modal
                title="请选择记分方式"
                visible={this.state.visible}
                onOk={this.handleOk}
                footer={<Button type="primary" onClick={this.comfirm.bind(this)}>确定</Button>}
                closable={false}
              >
                   <Form>
                      <Row gutter={24}>
                          <Col span={18}>
                            <Form.Item {...formItemLayout} label="记分类型">
                              {getFieldDecorator('scoringType1', {
                                rules: [{ required: true, message: '请选择记分方式' }],
                              })(
                                <Select placeholder="请选择记分方式">
                                  <Option value="1">周总分发一面</Option>
                                  <Option value="2">每项周总分发多面</Option>
                                </Select>,
                              )}
                            </Form.Item>
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
    gradeList: state.user.commonGradeData
  }
}
export default connect(mapStateToProps)(Form.create()(evaluationFlagDetail));
