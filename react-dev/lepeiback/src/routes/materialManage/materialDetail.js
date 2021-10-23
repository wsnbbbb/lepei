import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Upload, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';
import { runInThisContext } from 'vm';
import { portUrl } from '../../utils/img';
import moment from 'moment';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class MaterialDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          reset:false,
          classDisabled:true,
          materialData: {},
          classValue:'',
          labelMaterials: [],
          uploadFileList: [],
          mode: ['month', 'month'],
          value: [],
          currentLabelId: "",
          visibleDelete: false,
          deleteId: null,
          LabelsData: [],
          visibleEdit: false,
          editData: {}
        };
    }
    componentDidMount=()=>{
      const params={
        "semesterId":1,
        "personId": this.props.match.params.id
      }
      this.getLabelsByPid()
      this.props.dispatch({ //获取所有学期
          type:'user/getAllSemesters',
      })
      this.props.dispatch({ //获取所有年级
          type:'user/getCommonGradeList',
      })
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
    }

    getLabelsByPid=()=>{
      this.props.dispatch({
        type:'material/getLabelsByPid',
        payload:{},
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              LabelsData: res.data
            })
          }
        }
      })
    }

    getStudentMaterials=(id)=>{
      this.props.dispatch({
        type:'material/getStudentMaterials',
        payload:{
          id: id
        },
        callback:(res)=>{
          if(res.code===200){
            let arr = []
            res.data.files&&res.data.files.map((item, index)=>{
              arr.push({
                name: item.fileName,
                selfId: index,
                token: item.hash
              })
            })

            this.setState({
              visibleEdit: true,
              uploadFileList: arr,
              editData: res.data

            })

          }
        }
      })
    }

    edit=(id)=>{
      this.setState({
        currentLabelId: id
      })
      this.getStudentMaterials(id)
    }

    
    gradeChange=(val)=>{
          if(val){
            this.props.dispatch({
              type:'user/getClassName',
              payload:{"gradeId":val},
              callback:(res)=>{
                if(res.code===200){
                  this.setState({classValue:'',classDisabled:false})
                }
              }
            })
          }else{
            this.setState({classValue:'',classDisabled:true})
          }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    getMaterialDetail=(params)=>{
      this.props.dispatch({
        type:'material/getMaterialDetail',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              labelMaterials: res.data.labelMaterials
            })
          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const params={
          "semesterId":values.semesterId,
          "personId": this.props.match.params.id,
          "labelId": values.labelId||'',
          "startTime": values.time[0]||'',
          "endTime": values.time[1]||''
        }
        this.getMaterialDetail(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'room/delRoomApply',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "status":values.status,
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getMaterialList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "semesterId":values.semesterId||'',
          "gradeId":values.gradeId||'',
          "classId":this.state.classValue,
        }
        this.getMaterialList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/material-detail?id="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    toggle = (e) => {
      if(e.target.parentNode.parentNode.className == 'item-box'){
        e.target.parentNode.parentNode.className += ' active'
      }else{
        e.target.parentNode.parentNode.className = 'item-box'
      }
    }
    handleDelete = () => {
      let _this = this
      if(!this.state.deleteId){
        return
      }
      let param = {
        id: this.state.deleteId
      }
      this.props.dispatch({
        type:'material/deleteMaterial',
        payload: param,
        callback:(res)=>{
          if(res.code===200){
            message.success('删除成功！',2)
            this.setState({
              visibleDelete: false
            })
            this.props.form.validateFields((err, values) => {
              const params={
                "semesterId":values.semesterId||'',
                "personId": this.props.match.params.id
              }
              this.getMaterialDetail(params)
              this.setState({page:1})
            })
            // 查看处理人
            // this.props.dispatch({
            //   type:'room/getApplyHandlers',
            // })
            // this.props.form.resetFields();
            // this.setState({
            //   visible: false,reset:true
            // });
          }
        }
      })
    }
    handleDeleteCancel = () => {
      this.setState({
        visibleDelete: false,
      });
    }

    // updateStudentMaterials
    updateStudentMaterials = (e) => {
      this.props.form.validateFields((err, values) => {
        console.log(values)
        if(!values.semesterId){
          message.warn("请选择学期！")
          return
        }
        if(this.state.uploadFileList.length==0){
          message.warn("请上传文件！")
          return
        }
        let files=[]
        this.state.uploadFileList.map(item=>{
          files.push(item.token)
        })
        let param = {
       
          id: this.state.currentLabelId,
          startTime: values.time1[0].format('YYYY-MM'),
          endTime: values.time1[1].format('YYYY-MM'),
          description: values.description||"",
          files: files
        }
        this.props.dispatch({
          type:'material/updateStudentMaterials',
          payload: param,
          callback:(res)=>{
            if(res.code===200){
              message.success('更新成功！',2)
              this.setState({
                visibleEdit: false
              })
              this.props.form.resetFields(["time1", "description"]);
              this.setState({
                uploadFileList: []
              })
              this.props.form.validateFields((err, values) => {
                const params={
                  "semesterId":values.semesterId||'',
                  "personId": this.props.match.params.id
                }
                this.getMaterialDetail(params)
                this.setState({page:1})
              })
            }
          }
        })
      })
  }

    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
          console.log(values)
          if(!values.semesterId){
            message.warn("请选择学期！")
            return
          }
          if(this.state.uploadFileList.length==0){
            message.warn("请上传文件！")
            return
          }
          let files=[]
          this.state.uploadFileList.map(item=>{
            files.push(item.token)
          })
          let param = {
            personId: this.props.match.params.id,
            semesterId: values.semesterId,
            labelId: this.state.currentLabelId,
            startTime: values.time1[0].format('YYYY-MM'),
            endTime: values.time1[1].format('YYYY-MM'),
            description: values.description||"",
            files: files
          }
          this.props.dispatch({
            type:'material/createMaterial',
            payload: param,
            callback:(res)=>{
              if(res.code===200){
                message.success('创建成功！',2)
                this.setState({
                  visible: false
                })
                this.props.form.resetFields(["time1", "description"]);
                this.setState({
                  uploadFileList: []
                })
                this.props.form.validateFields((err, values) => {
                  const params={
                    "semesterId":values.semesterId||'',
                    "personId": this.props.match.params.id
                  }
                  this.getMaterialDetail(params)
                  this.setState({page:1})
                })
              }
            }
          })
        })
    }

    deleteLabel=(selfId)=>{
      this.setState({ uploadFileList: this.state.uploadFileList.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.uploadFileList);
      });
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields(["time1", "description"]);
        this.setState({
          visible: false,
          reset:true,
          uploadFileList: []
        });
    }
    handleCancelEdit = (e) => {
      this.setState({
        visibleEdit: false,
        uploadFileList: [],
        editData: {}
      });
      this.props.form.resetFields(["description"]);
   }
    add = (id) => {
      console.log(id)
      this.setState({
        visible: true,
        currentLabelId: id

      });
    }
    delete = (id) => {
      console.log(id)
      this.props.dispatch({ //获取上传图片token
        type:'material/deleteMaterial',
        callback:(res)=>{
            if(res.code===200){
              message.success("删除成功！")
            }
        }
    })
    }
    handleChange1 = value => {
      this.setState({ value });
    };
    
    showDeleteModal = (id) => {
      console.log(id)
      this.setState({ 
        visibleDelete: true,
        deleteId: id
       });
    };
    uploadFile= (e) => {
      const file = e.target.files[0]
      // this.setState({
        //     file: file
        // })
      console.log(file)
      console.log(file.name)
      const serverURL = 'https://upload.qiniup.com/'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
      
        const successFn = (response) => {
          message.success('上传成功！',2)
          document.getElementById("file").value=""
          console.log(response)
          let selfId = 0
          if(this.state.uploadFileList.length!=0){
            selfId = Number(this.state.uploadFileList[this.state.uploadFileList.length-1].selfId) + 1
          }
          this.state.uploadFileList.push({
              selfId: selfId,
              name: file.name,
              token: JSON.parse(response.target.response).id
          })
          this.setState({uploadFileList: this.state.uploadFileList})
          // this.state.uploadFileList.push({
          //   name: file.name,
          //   token: JSON.parse(response.target.response).id
          // })
          console.log(this.state.uploadFileList)
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          // param.success({
          //   url: getImg(JSON.parse(response.target.response).id),
          //   meta: {
          //     alt: '图片',
          //     loop: true, // 指定音视频是否循环播放
          //     autoPlay: true, // 指定音视频是否自动播放
          //     controls: true, // 指定音视频是否显示控制栏
          //     // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          //   }
          // })
        }
      
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          // param.progress(event.loaded / event.total * 100)
        }
      
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          // param.error({
          //   msg: '上传失败.'
          // })
        }
      
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        fd.append('file', file)
        fd.append('token', qiniuToken)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
    }
    export=()=>{
     
      this.props.form.validateFields((err, values) => {
        if(err){
          return
        }
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId =sessionStorage.getItem("userId");
        let personId = this.props.match.params.id;
        let semesterId = values.semesterId;
        let labelId = values.labelId||'';
        let startTime = parseInt(values.time[0]/1000)||'';
        let endTime = parseInt(values.time[1]/1000)||''
        let url=portUrl("/manager/student-materials/export-files?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&personId="+personId+"&semesterId="+semesterId+"&labelId="+labelId+"&startTime="+startTime+"&endTime="+endTime)
        this.setState({exportUrl:url})

        
      })
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const { value, mode } = this.state;

          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const formItemLayout3 = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
          };
          const {getHandlers,approvalRules} = this.props;
          const {LabelsData} = this.state;
          console.log(getHandlers)
          const {allTerms, commonGradeData, classNameData} = this.props;
          let termChild=[]
          allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
          })
          let gradeChild=[]
          commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
              gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
          })
          let classChild=[]
          classNameData&&classNameData.length>0&&classNameData.map(item=>{
              classChild.push(<Option key={item.classId}>{item.className}</Option>)
          })
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
          let labelsChild=[]
          LabelsData&&LabelsData.length>0&&LabelsData.map(item=>{
            labelsChild.push(<Option key={item.id}>{item.label}</Option>)
          })
          const {classDisabled,classValue} = this.state;
        return (
            
            <div className="content-main meterial">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('semesterId' ,{
                        rules: [{
                            required: true,
                            message: "请选择学期",
                        }],
                        })(
                        <Select placeholder="请选择学期">
                            {termChild}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('labelId')(
                        <Select placeholder="请选择">
                            <Option value=''>全部</Option>
                            {labelsChild}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
               
                  <Col span={10}>
                    <FormItem {...formItemLayout} label={''}>
                      {getFieldDecorator("time",{initialValue:''})(
                        <RangePicker onChange={this.onTimeChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary'>
                        <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                      </Button>
                  </Col>
                </Row>
              </Form>
              <Row>
              {
                this.state.labelMaterials&&this.state.labelMaterials.map(item=>{
                    return <div className="item-box">
                              <p className="item-title">
                                <Icon type="caret-down" />
                                <span onClick={(e)=>{this.toggle(e)}}>{item.label}</span>
                              </p>
                              <div className="item-main">
                                {/* {
                                  item.children?"":<label><p className='item-name'>{j.label}</p>
                                                      <a href='javascript:;' onClick={this.add.bind(this, j.labelId)}>添加</a>
                                                  </label>
                                } */}
                                {
                                  item.materials&&item.materials.map(j=>{
                                    return <div> 
                                         
                                            <Row>
                                              <p>{j.startTime} - {j.endTime}
                                              <label className="label-btn">
                                                <a href="javascript:;" onClick={this.edit.bind(this, j.id)}>编辑</a>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <a href="javascript:;" onClick={this.showDeleteModal.bind(this, j.id)}>删除</a>
                                              </label>
                                              </p>j
                                              <p>相关说明：{j.description}</p>
                                              <p>相关材料：</p>
                                              {
                                                j.files&&j.files.map(k=>{
                                                  return <div>
                                                          <Icon type="link" /><a href={k.downloadUrl} >{k.fileName}</a>
                                                        </div>
                                                })
                                              }
                                              <p className="update-time">上传时间：{formatDate(j.updateTime)}</p>
                                            </Row>
                                          </div>
                                  })
                                }
                                {
                                  item.children&&item.children.map(i=>{
                                    return   <div> 
                                              <p className="item-name">{i.label}</p>
                                              <a href="javascript:;" onClick={this.add.bind(this, i.labelId)}>添加</a>
                                              {
                                                i.materials&&i.materials.map(j=>{
                                                  return <Row>
                                                          <p>{j.startTime} - {j.endTime}
                                                            <label className="label-btn">
                                                              <a href="javascript:;" onClick={this.edit.bind(this, j.id)}>编辑</a>
                                                              &nbsp;&nbsp;&nbsp;&nbsp;
                                                              <a href="javascript:;" onClick={this.showDeleteModal.bind(this, j.id)}>删除</a>
                                                            </label>
                                                          </p>
                                                          <p>相关说明：{j.description}</p>
                                                          <p>相关材料：</p>
                                                          {
                                                            j.files&&j.files.map(k=>{
                                                              return <div>
                                                                      <Icon type="link" /><a href={k.downloadUrl} >{k.fileName}</a>
                                                                    </div>
                                                            })
                                                          }
                                                          <p className="update-time">上传时间：{formatDate(j.updateTime)}</p>
                                                        </Row>
                                                })
                                              }
                                              
                                            </div>
                                  })
                                }
                              </div>
                          </div>
                  })
                }
              </Row>            
             <Modal
                title="新建"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className="material-model"
              >
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout3} label={'起止时间'}>
                      {getFieldDecorator("time1",{initialValue:''})(
                        <RangePicker 
                        placeholder={['开始月份', '结束月份']}
                        format="YYYY-MM"
                        // value={value}
                        // mode={mode}
                        // onChange={this.handleChange1}
                         />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout3} label={'材料说明'}>
                      {getFieldDecorator("description",{initialValue:''})(
                        <TextArea rows={4} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col className="file-title" span={5}>
                      <label>选择文件：</label>
                    </Col>
                    <Col span={19}>
                    <form style={{display: "inline-block"}}>
                        <input id="file" type="file" name="file" onChange={this.uploadFile} />
                    </form>
                    <div>
                      <label>支持的扩展名：.rar .zip .doc .docx .pdf .jpg...</label>
                    </div>
                  </Col>
                </Row>
                {
                  this.state.uploadFileList&&this.state.uploadFileList.map(item=>{
                    return  <Row>
                              <Col span={5}>
                              </Col>
                              <Col span={19}>
                              <p className="upload-file">
                                <Icon type="link" />&nbsp;&nbsp;&nbsp;&nbsp;
                                <label>{item.name}</label>
                                <Icon className="file-close" onClick={this.deleteLabel.bind(this, item.selfId) } type="close" />
                              </p>
                              </Col>
                            </Row>
                  })
                }
                <Row className="material-tip-row">
                    <Col span={5}>
                    </Col>
                    <Col span={19}>
                      <label>注：填写的时间为材料编写时间或获得奖励时间</label>
                  </Col>
                </Row>
              </Modal>
              <Modal
                title="编辑"
                visible={this.state.visibleEdit}
                onOk={this.updateStudentMaterials}
                onCancel={this.handleCancelEdit}
                className="material-model"
              >
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout3} label={'起止时间'}>
                      {getFieldDecorator("time1",{initialValue:[moment(this.state.editData.startTime, "YYYY-MM"),
                      moment(this.state.editData.endTime, "YYYY-MM")]})(
                        <RangePicker 
                        placeholder={['开始月份', '结束月份']}
                        format="YYYY-MM"
                        // value={value}
                        // mode={mode}
                        // onChange={this.handleChange1}
                         />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout3} label={'材料说明'}>
                      {getFieldDecorator("description",{initialValue: this.state.editData.description})(
                        <TextArea rows={4} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col className="file-title" span={5}>
                      <label>选择文件：</label>
                    </Col>
                    <Col span={19}>
                    <form style={{display: "inline-block"}}>
                        <input id="file" type="file" name="file" onChange={this.uploadFile} />
                    </form>
                    <div>
                      <label>支持的扩展名：.rar .zip .doc .docx .pdf .jpg...</label>
                    </div>
                  </Col>
                </Row>
                {
                  this.state.uploadFileList&&this.state.uploadFileList.map(item=>{
                    return  <Row>
                              <Col span={5}>
                              </Col>
                              <Col span={19}>
                              <p className="upload-file">
                                <Icon type="link" />&nbsp;&nbsp;&nbsp;&nbsp;
                                <label>{item.name}</label>
                                <Icon className="file-close" onClick={this.deleteLabel.bind(this, item.selfId) } type="close" />
                              </p>
                              </Col>
                            </Row>
                  })
                }
                <Row className="material-tip-row">
                    <Col span={5}>
                    </Col>
                    <Col span={19}>
                      <label>注：填写的时间为材料编写时间或获得奖励时间</label>
                  </Col>
                </Row>
              </Modal>
              <Modal
                title="删除"
                visible={this.state.visibleDelete}
                onOk={this.handleDelete}
                onCancel={this.handleDeleteCancel}
                className="material-model"
              >
                <Row>
                  <label>确认删除该条信息？</label>
                </Row>
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     roomList:state.room,
    //  getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules,
     allTerms:state.user.allTerms,
     commonGradeData:state.user.commonGradeData,
     classNameData:state.user.classNameData,
  }
}
export default connect(mapStateToProps)(Form.create()(MaterialDetail));
