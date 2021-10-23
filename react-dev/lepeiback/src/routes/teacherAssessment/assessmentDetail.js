import React,{Component} from 'react';
import { connect } from 'dva';
// import {Link} from 'dva/router';
import { Table,Button,Input,Form, Row, Col, Select, Steps, DatePicker,Icon,Modal,message,Tree,Breadcrumb,Upload, TreeSelect , Badge, Popover } from 'antd';
import AddDepartmentPerson from '../../components/addDepartmentPerson';
import PageIndex from '../../components/page';
import { getScoreLevel, getQueryString, formatDate} from '../../utils/public';
import './style.less';
import {portUrl, getImg} from '../../utils/img';
import ImgPreview from '../../components/imgPreview';
import { Link } from 'dva/router';
import moment from 'moment';

const Step = Steps.Step;
const confirm = Modal.confirm;
// const { TextArea } = Input;
const TextArea = Input.TextArea;
const { TreeNode } = Tree;
const FormItem = Form.Item;
// const TreeNode = TreeSelect.TreeNode;

class assessmentDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,  
          step:1,
          id:1,
          flag:false,
          expandedFlag:false,
          expandedKeys:['0'],
          examineRecords: [],
          detail: {},
          quotas: [],
          scoreData: {},
          visibleDetail: false,
          applyContent: {}, 
          itemContents: [],
          isShow: false,
          status: '',
          licenceUrl:"",
          previewVisible: false,
          title:"查看"

        };
    }
    componentDidMount = () => {
      this.getDetail()
    // 面包屑导航
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/assessment-record"
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
    showImg=(url)=>{
      this.setState({
          previewVisible: true,
          licenceUrl: getImg(url)
      })
    }
    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    } 
 

    getDetail = () => {
      this.props.dispatch({
        type: 'teacherAssessment/getAssessmentRecordDetail',
        payload: {id: getQueryString("id")},
        callback:(res) => {
          if(res.code === 200){
            this.setState({
              examineRecords: res.data.examineRecords,
              detail: res.data,
              quotas: res.data.quotas,
              status:  res.data.status
            })
          }
        }
      })
    }

    getNodeDetail = (id) => {
      this.props.dispatch({
        type: 'teacherAssessment/getAssessmentScoreDetail',
        payload: {
          recordId: getQueryString('id'),
          quotaId: id
        },
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              scoreData: res.data,
              isShow: true
            })
          }
        }
      })
    }

    back = () =>{
      window.history.go(-1)
    }

    save = () =>{
      window.history.go(-1)
    }

    reject = () =>{
      this.setState({
        visible: true
      })
    }

    // 节点展开/收起
    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        expandedFlag:true,
        // autoExpandParent: false,
      });
    }

    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode 
            title={<span className='node-title'>
              {
              <span className='node-title'>
                <span className={item.quotaId == this.state.quotaId ? "active" : ""} onClick={this.getNodeDetail.bind(this, item.quotaId)}>{item.quotaName}</span>
              </span>
               } 
             </span>}
            key={item.quotaId} dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode 
              title={<span className='node-title'>
                {
                  <span className='node-title'>
                    <span className={item.quotaId == this.state.quotaId ? "active" : ""} onClick={this.getNodeDetail.bind(this, item.quotaId)}>{item.quotaName}</span>
                  </span>
                  }
                </span>}
              key={item.quotaId} dataRef={item} />;
            })

    offsetChange = (num) =>{
      if(num%3 == 0){
         return 0
      }else{
        return 3
      }
    }

    reset = () => {
      this.props.form.resetFields(["kw","departmentName1"])
    }

    // 删除
    showConfirm=()=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定通过审核？',
        onOk() {
          me.props.dispatch({
            type:'teacherAssessment/assessmentRecordsApprove',
            payload:{"id": getQueryString('id')},
            callback:(res)=>{
              if(res.code===200){
                message.success('操作成功！',3)
                setTimeout(() => {
                  window.history.go(-1)
                }, 2000);
              }
            }
          })
        },
        onCancel() {},
      });
    }


    toSee = (id)=>{
      let params = {
        "id": id,
      }
      this.props.dispatch({
        type: 'teacherAssessment/getMaterial',
        payload: params,
        callback:res =>{
          if(res.code == 200){
           this.setState({
            applyContent: res.data, 
            itemContents: res.data.itemContents,
            visibleDetail: true
           })
          }
        }
      })
    }
    handleOk1 = () =>{
        this.props.form.validateFields(["reason"],(err, values) => {
          if(err) return
          let params = {
            "id": getQueryString("id"),
            "reason": values.reason||''
          }
          this.props.dispatch({
            type: 'teacherAssessment/assessmentRecordsReject',
            payload: params,
            callback:res =>{
              if(res.code == 200){
                message.success("退回成功")
                this.setState({
                  visible: false
                })
                this.props.form.resetFields(["reason"])
                setTimeout(() => {
                  window.history.go(-1)
                }, 2000);
              }
            }
          })         
      })

        
    }

    modalCancel1 = () =>{
      this.props.form.resetFields(["reason"])
      this.setState({
        visible: false,
      })
    }

    modalCancel2 = () =>{
      this.setState({
        visibleDetail: false,
      })
    }

    render(){
      
      const { examineRecords , status, detail, quotas, scoreData, visibleDetail, applyContent, itemContents, isShow} = this.state;
      let steps=[];
      examineRecords.map((item, index)=>{
          let title=item.actType==1?"申请":(item.actType==2?"审批通过":"退回")
          steps.push(
              <Step key={index} title={title} description={<span>{item&&item.dealer}<br/>{formatDate(item&&item.time)}<br/>{item.reason}</span>} />
          )
      })
      const { getFieldDecorator } = this.props.form;
      const {visible} = this.state;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };

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
      }
     
      return (
        <div className="content-main teacher-assessment">
          <Row>
            <Steps progressDot current={examineRecords&&examineRecords.length} className="leave-steps">
                {steps}
            </Steps>
          </Row>
          <div style={{padding: '20px 10px'}}>
              <Row>
                  <Col span={24}>考核名称：{detail.itemName}</Col>
              </Row>
              <Row>
                  <Col span={8}>姓名：{detail.personName}</Col>
                  <Col span={8}>部门：{detail.departmentName}</Col>
                  <Col span={8}>考核年度：{detail.checkYear}</Col>
              </Row>
              <Row>
                  <Col span={8}>类型一：{detail.typeOne}</Col>
                  <Col span={8}>类型二：{detail.typeTwo}</Col>
              </Row>
          </div> 
          <div className="score-box" style={{padding: '10px', color: "#6fbcfd",backgroundColor: "#cae5f5"}}>
              <Row style={{textAlign: 'center'}}>
                  考核分数：{detail.score} &nbsp;&nbsp;&nbsp;&nbsp;考核结果：{getScoreLevel(detail.scoreLevel)}
              </Row>
          </div>
          <Row className="btn">
            <Button onClick={this.back.bind(this)}>返回</Button>&emsp;&emsp;
            {status==0?<Button type="danger" onClick={this.reject.bind(this)}>退回</Button>:null}&emsp;&emsp;
            {status==0?<Button type="primary" onClick={this.showConfirm.bind(this)}>通过审核</Button>:null}
          </Row>

          <Row>
              <Col span={8} style={{paddingRight: '10px'}}> 
                <Tree style={{backgroundColor: '#f2f2f2'}} defaultExpandAll={true} showLine autoExpandParent={true}>
                  {this.renderTreeNodes(quotas)}
                </Tree>
              </Col>
              <Col span={16} style={{display: isShow?'block':'none'}}>
                {
                          scoreData&&scoreData.type == 1? <Row className="tip-name">
                          <Col span={12}>
                            <div>{scoreData&&scoreData.name}</div>
                          </Col>
                          <Col span={12} style={{textAlign: 'right'}}>
                            总分：{scoreData&&scoreData.totalScore}分/实得分：{scoreData&&scoreData.getScore}分
                          </Col>
                        </Row>: <Row className="tip-name tip-name2">
                          <Col span={12}>
                            <div>{scoreData&&scoreData.name}</div>
                          </Col>
                          <Col span={12} style={{textAlign: 'right'}}>
                            得分：{scoreData&&scoreData.getScore}分
                          </Col>
                        </Row>
                }
                {
                  scoreData&&scoreData.type == 2?scoreData&&scoreData.qAs.map((i, index)=>{
                    return <div className="score-item">
                            <h4 style={{textAlign: 'right'}}>得分：{i.getScore}分</h4>
                             <div>
                              <Row style={{padding: '5px 0'}}>
                                  <TextArea value={i.title} disabled maxLength={50} autosize={{ minRows: 2, maxRows: 2 }} />
                              </Row>
                              {
                                i.type!=3&&i.answers.map((i, idx)=>{
                                  return  <Row style={{padding: '5px 0'}}>
                                            <Col span={16}>
                                              <TextArea value={i.item} disabled maxLength={50} autosize={{ minRows: 2, maxRows: 2 }} />
                                            </Col>
                                            <Col span={8}>
                                              <FormItem {...formItemLayout} label='分值'>
                                                  <Input value={i.score} disabled placeholder=""/>
                                              </FormItem>
                                            </Col>
                                          </Row>
                                })
                              }
                              {
                                i.type !=3?  <Row style={{padding: '5px 0'}}>
                                  {
                                    i.relateMaterials.map((i, idx)=>{
                                      return  <span><Button onClick={this.toSee.bind(this, i)}>资料{idx+1}</Button>&nbsp;&nbsp;</span>
                                    })
                                  }
                                </Row>:null
                              }
                              <Row style={{padding: '5px 0'}}>
                              {
                                i.type==3&&i.answers.map((i, idx)=>{
                                   return <img src={getImg(i)} onClick={this.showImg.bind(this,i)} className='img-preview' alt=""/>
                                })
                              }
                              </Row>
                            </div>
                  </div>}):null
                }
              </Col>
          </Row>
   
          <Modal
            width={400}
            title="退回原因"
            visible={visible}
            onOk={this.handleOk1}
            onCancel={this.modalCancel1}
            className="batchAdd-modal"
          >
            <Form>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label=''>
                    {getFieldDecorator('reason', {initialValue:'', rules:[{required: false}]})(
                      <TextArea maxLength={20} autosize={{minRows: 4,maxRows:4}}placeholder="请输入退回原因，不超过20字"/>
                    )}
                  </FormItem>
                </Col> 
              </Row>
            </Form>
           </Modal>

           <Modal
            width={"90%"}
            title="资料详情"
            visible={visibleDetail}
            footer={null}
            onCancel={this.modalCancel2}
            className="batchAdd-modal"
          >
             <Form className="applyForm">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label={'所属类型'}>
                      {getFieldDecorator("cate", {initialValue: applyContent.cate})(
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
                        disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label={'级别'}>
                      {getFieldDecorator("level",{initialValue: applyContent.level || undefined})(
                        <Select disabled placeholder="请选择级别">
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
                      {getFieldDecorator("grade",{initialValue: applyContent.grade || undefined})(
                        <Select disabled placeholder="请选择等级">
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
              <h3 className="title">项目内容1</h3>
              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>
                  {
                    itemContents && itemContents.map((item, idx)=>{
                      if(item.type == 1){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input disabled value={item.answers} placeholder={`请输入`+item.title} maxLength={10} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 2){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                      <Input disabled value={item.answers} placeholder={`请输入`+item.title} maxLength={50} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 3){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input disabled value={item.answers} placeholder={`请输入`+item.title} maxLength={11} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 4){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                      <Select disabled value={item.answers ? item.answers : undefined} placeholder="请选择"  >
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
                                      <Select disabled mode="multiple" value={item.answers ? item.answers : []}  placeholder="请选择">
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
                                        <Button disabled={item.answers.length >= 1} >
                                            <Icon type="upload" /> 上传文件
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                        <ul>
                                          {
                                            item.answers.map((v, idx)=>{
                                              return  <li className="fileList-li" key={idx}><Icon type="link" /><span style={{cursor:'pointer'}} >{v.fileName}</span> </li>
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
                                        <Button disabled={item.answers.length >= 3} >
                                          <Icon type="upload" /> 上传文件
                                        </Button>
                                        <p style={{color:"#BFBFBF",marginTop:"10px"}}>支持jpg、png、jpeg格式</p>
                                    </Upload>
                                    <ul>
                                      {
                                        item.answers.map((v, idx)=>{
                                          return  <li className="fileList-li" key={idx}><span style={{cursor:'pointer'}} >{v.fileName}</span> </li>
                                        })
                                      }
                                    </ul>
                                  </FormItem>
                                </Col>
                      }else if(item.type == 8){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <Input disabled value={item.answers} placeholder={`请输入` + item.title} maxLength={18} style={{ width: '100%', marginRight: 8 }} />
                                  </FormItem>
                                </Col>
                      }else if(item.type == 9){
                        return  <Col span={5} className="itemCol" offset={this.offsetChange(idx)} key={item.questionId}>
                                  <FormItem label={item.title}>
                                    <DatePicker 
                                    disabled
                                    showTime  
                                    format="YYYY-MM-DD HH:mm:ss" 
                                    value={item.answers ? moment(item.answers, 'YYYY-MM-DD HH:mm:ss') : undefined} 
                                    
                                    />
                                  </FormItem>
                                </Col>
                      }
                    })
                  }
                </Row>
              </Form>
           </Modal>

           <ImgPreview
                visible={this.state.previewVisible}  // 是否可见
                onClose={this.closePreview} // 关闭事件
                src={this.state.licenceUrl} // 图片url
                picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
            />
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

export default connect(mapStateToProps)(Form.create()(assessmentDetail));
