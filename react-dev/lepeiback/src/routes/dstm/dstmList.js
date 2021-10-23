import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Icon, Row, Col, Tag, Tabs, Radio, Upload,TreeSelect, Divider,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl, getImg} from '../../utils/img';
import {getGradeType, getSexType, getResidence, formatDate, getActivityType, isBlank, scrollTop} from '../../utils/public';
import './style.less';
import ImgPreview from '../../components/imgPreview';

const { TabPane } = Tabs
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

class DstmList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          visible: false,
          visible2: false,
          visible4: false,
          teacherList: [],
          list: [],
          typesList: [],
          previewVisible: false,
          licenceUrl: '',
          publisherIds: [],
          roleList: [{
              id: undefined,
              selfId: 1,
              name: undefined
          }],
          types: [
            {
              id: 1,
              name: '',
              selfId: 1,
              approvers: ['233'],
              files: [{
                uid: '3',
                name: 'zzz.png',
                status: 'done',
                hash: ''
              },
              {
                uid: '4',
                name: 'zzz.png',
                status: 'done',
                hash: ''
              }]
            }
          ]
         
        };
    }
    componentDidMount=()=>{
       const params={
         "page": 1,
         "prePage": 20,
       }

       this.getList(params)
       this.getTeacher()
       this.getTypesList()
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
   
    getTypesList=()=>{
      this.props.dispatch({
        type: 'dstm/dstmTypesList',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                typesList: res.data.types
              })
            }
        }
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

    new=()=>{
      this.props.dispatch(routerRedux.push("/new-dstm"))
    }

    dstmTypesList=()=>{
      this.props.dispatch({
        type: 'dstm/dstmTypesList',
        payload: {},
        callback: res=>{
            if(res.code===200){
              let list = []
              res.data.types&&res.data.types.map((item, index)=>{
                let files = []
                item.files.map((item, index)=>{
                  files.push({
                    uid: index,
                    name: item.fileName,
                    status: 'done',
                    hash: item.hash
                  })
                })
                list.push({
                  id: item.id,
                  name: item.name,
                  selfId: index,
                  approvers: item.approvers,
                  files: files
                })
              })
              this.setState({
                types: list,
                // list: res.data
                visible4: true
              })
            }
        }
      })
    }

    saveDstmTypes=()=>{
      this.state.types
      console.log(this.state.types)
      let arr =[]
      this.state.types.map(item=>{
        let files = []
        item.files.map(i=>{
          if(i.response&&i.response.success){
            files.push(i.response.id)
          }else{
            files.push(i.hash)
          }
        })
        arr.push({
          id: item.id,
          name: item.name,
          approvers: item.approvers,
          files: files
        })
      })

      if(arr.some(item=>{
        return isBlank(item.name)
      })){
        return message.error("类型名字输入不合法！")
      }
      if(arr.some(item=>{
        return item.approvers.length==0
      })){
        return message.error("审核人不能为空！")
      }
      console.log(arr)
      this.props.dispatch({
        type: 'dstm/saveDstmTypes',
        payload: {
          types: arr
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                visible4: false
              })
            }
        }
      })
    }
    
    getList=(params)=>{
      this.props.dispatch({
        type: 'dstm/getDstmList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }
    getRoleList=()=>{
      this.props.dispatch({
        type: 'dstm/dstmRoles',
        payload: {},
        callback: res=>{
            if(res.code===200){
              res.data.roles.map((item, index)=>{
                item.selfId = index
              })
              this.setState({
                visible3: true,
                roleList: res.data.roles
              })
            }
        }
      })
    }
    addLabel=()=>{
      if(this.state.roleList.length==0){
        this.state.roleList.push({
            id: '',
            selfId: 1,
            name: undefined
        })
      }else{
        let selfId = Number(this.state.roleList[this.state.roleList.length-1].selfId) + 1
        this.state.roleList.push({
            id: '',
            selfId: selfId,
            name: undefined
        })
      }
      this.setState({roleList: this.state.roleList})
    }
    addLabel1=()=>{
      if(this.state.types.length==0){
        this.state.types.push({
            id: '',
            selfId: 1,
            name: undefined,
            approvers: [],
            files: []
        })
      }else{
        let selfId = Number(this.state.types[this.state.types.length-1].selfId) + 1
        this.state.types.push({
            id: '',
            selfId: selfId,
            name: undefined,
            approvers: [],
            files: []
        })
      }
      this.setState({roleList: this.state.roleList})
    }
    deleteLabel=(selfId)=>{
      this.setState({ roleList: this.state.roleList.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.roleList);
      });
    }
    deleteLabel1=(selfId)=>{
      this.setState({ types: this.state.types.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.types);
      });
    }
    onChange3 = (id, e)=> {
      this.state.roleList.map(item=>{
        if(item.selfId == id){
          item.name = e.target.value
        }
      })
      console.log(this.state.roleList)
      this.setState({roleList: this.state.roleList})
    }
    onChange4 = (id, e)=> {
      this.state.types.map(item=>{
        if(item.selfId == id){
          item.name = e.target.value
        }
      })
      console.log(this.state.types)
      this.setState({roleList: this.state.types})
    }
    onChange5 = (id, value)=> {
      this.state.types.map(item=>{
        if(item.selfId == id){
          item.approvers = value
        }
      })
      console.log(this.state.types)
      this.setState({types: this.state.types})
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "typeId": values.typeId||'',
          "publisherType": values.publisherType||'',
          "status": values.status||''
        }
        this.getList(params)
      })
    }

    delete=(id, type)=> {
      let me=this;
      this.setState({
        currentType: type
      })
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type:'dstm/delete',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.search()
              }
            }
          })
        },
        onCancel() {},
      });
    }
    //归档
    guidang=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要将它归档吗？',
        onOk() {
          me.props.dispatch({
            type:'dstm/dstmActivityFile',
            payload:{"activityId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('归档成功！',3)
                me.search()
              }
            }
          })
        },
        onCancel() {},
      });
    }
     //取消归档
     cancelGuidang=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要将它取消归档吗？',
        onOk() {
          me.props.dispatch({
            type:'dstm/unfileDstmActivity',
            payload:{"activityId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('取消归档成功！',3)
                me.search()
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
          "typeId": values.typeId||'',
          "publisherType": values.publisherType||'',
          "status": values.status||''
        }
        this.getList(params)
        scrollTop()
      })
    }
    
    getTeacher=(id, type)=>{
      this.props.dispatch({
        type: 'dstm/commonPersonList',
        payload: {
          personType: 2,
          status: 1
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                teacherList: res.data
              })
            }
        }
      })
    }

    getDstmHandler=(id, type)=>{
      this.props.dispatch({
        type: 'dstm/getDstmHandler',
        payload: {},
        callback: res=>{
            if(res.code===200){
              // this.props.form.setFieldsValue({"reason1": res.data.reason, "handler": res.data.handler})
              this.setState({
                visible2: true,
                publisherIds: res.data.publisherIds
              })
            }
        }
      })
    }

    handleCancel2=()=>{
      this.props.form.resetFields(['publisherIds'])
      this.setState({
        visible2: false
      })
    }
    handleCancel3=()=>{
      this.setState({
        visible3: false,
        visible4: false
      })
    }

    handleOk2=()=>{
      this.props.form.validateFields((err, values) => {
          if(err) return
          this.props.dispatch({
            type: 'dstm/saveDstmHandler',
            payload: {
              publisherIds: values.publisherIds
            },
            callback: res=>{
                if(res.code===200){
                  this.setState({
                    visible2: false
                  })
                }
            }
        })
      })
    }

    handleOk3=()=>{
      let arr = []
      this.state.roleList.map(item=>{
        arr.push({
          id: item.id,
          name: item.name
        })
      })
      this.props.dispatch({
          type: 'dstm/saveDstmRoles',
          payload: {
            roles: arr
          },
          callback: res=>{
              if(res.code===200){
                this.setState({
                  visible3: false
                })
              }
          }
      })

    }

    handleOk4=()=>{
      console.log(this.state.types)

    }

    // saveDstmHandler
    showModalPerson=(id, type)=>{
      this.props.dispatch({
        type: 'filePersons/showFiledReason',
        payload: {
          personId: id
        },
        callback: res=>{
            if(res.code===200){
              this.props.form.setFieldsValue({"reason1": res.data.reason, "handler": res.data.handler})
              this.setState({
                visible1: true
              })
            }
        }
      // this.setState({
      //   visible1: true, 
      //   currentPersonId: id,
      //   currentType: type
      })
    }
    goToRule=()=>{
        this.props.dispatch(routerRedux.push("/score-rule"))
    }
 
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-student"));
    }

    toDetail=(id, status)=>{
      if(status==1){
        this.props.dispatch(routerRedux.push("/edit-dstm?id="+id))
      }else{
        this.props.dispatch(routerRedux.push("/dstm-detail?id="+id))
      }
    }

    handleCancel =()=>{
      this.props.form.resetFields(['type', 'reason', 'selGradeId', 'selClassId'])
      this.setState({
        visible: false
      }) 
    }

    handleOk =()=>{
      let checkArr = []
      let me = this
      if(this.props.form.getFieldValue("type") == 2){
        checkArr = ['selGradeId']
      }else if(this.props.form.getFieldValue("type") == 3){
        checkArr = ['selClassId']
      }
      this.props.form.validateFields(checkArr, (err, values) => {
        if(!err){
            let params = {
              type: me.props.form.getFieldValue("type"), 
              groupId: me.props.form.getFieldValue("type")==2?me.props.form.getFieldValue("selGradeId"):me.props.form.getFieldValue("selClassId"),
            }
            this.props.dispatch({
              type: 'filePersons/unfileGroup',
              payload: params,
              callback: res=>{
                if(res.code===200){
                  message.success("操作成功！")
                  this.setState({
                    visible: false,
                  })
               
                  // me.search()
                }
              }
            })
        }
      })
    }

    onChange10(selfId, info) {
      // debugger

      this.state.types.map(item=>{
        if(item.selfId == selfId){
          item.files = info.fileList
        }
      })
      console.log(this.state.types)
      this.setState({types: this.state.types})

      if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }


    render(){
          const { list, list1, typesList , gradeList, teacherList, classList, classNameData, departmentList, jobList, batchGradeList, batchClassList} = this.state;
          const { getFieldDecorator, getFieldValue } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16}
          };
          const option2 = teacherList&&teacherList.map((item)=>{
            return <Option key={item.personId} value={item.personId}>{item.personName}</Option>
          })
          console.log({option2})
          let classOptions=[];
          classNameData&&classNameData.length>0&&classNameData.map(item=>{
            return classOptions.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let allClass=[];
          classList&&classList.length>0&&classList.map(item=>{
            return allClass.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.groupId} value={item.groupId}>{item.groupName}</Option>)
          })
          let options1=[]
          typesList&&typesList.length>0&&typesList.map(item=>{
            return options1.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
          })

     
   
  
          const qiniuToken=sessionStorage.getItem('qiniuToken');
          const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
              token:qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            // onChange(info) {
            //   if (info.file.status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            //   }
            //   if (info.file.status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully`);
            //   } else if (info.file.status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            //   }
            // },
          };
     
        return (
            <div className="content-main dstm-main">
        
                  <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                      <Col span={4}>
                        <FormItem label=''>
                          {getFieldDecorator('kw')(
                            <Search
                              placeholder="请输入活动标题、创建人"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={3}>
                        <FormItem {...formItemLayout} label={'类型'}>
                          {getFieldDecorator("typeId",{initialValue:''})(
                            <Select>
                              <Option value='' key=''>全部</Option>
                              {options1}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={3}>
                        <FormItem {...formItemLayout} label={'发布人'}>
                          {getFieldDecorator("publisherType",{initialValue:''})(
                            <Select>
                              <Option value='' key=''>全部</Option>
                              <Option value='1' key='1'>学生</Option>
                              <Option value='2' key='2'>教师</Option>
                              <Option value='3' key='3'>平台发布</Option>
                              {options}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={3}>
                        <FormItem {...formItemLayout} label={'状态'}>
                        {getFieldDecorator("status",{initialValue:''})(
                            <Select>
                              <Option value='' key=''>全部</Option>
                              <Option value='1' key='1'>待审核</Option>
                              <Option value='3' key='3'>已发布</Option>
                              <Option value='5' key='5'>已归档</Option>
                            </Select>
                        )}
                        </FormItem>
                      </Col>
                      <Col span={11} >
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.new.bind(this)}>新增</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.getDstmHandler.bind(this)}>发布人设置</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.dstmTypesList.bind(this)}>类型管理</Button>&nbsp;&nbsp;
                            <Button type='primary' onClick={this.getRoleList.bind(this)}>学生角色管理</Button>&nbsp;&nbsp;
                      </Col>
                    </Row>
                </Form>              
               {
                 Array.isArray(list.dataList)&&list.dataList.map((item, index)=>{
                   
                  return    <section className="row-item" key={index}>
                              <div className="i-title">
                                <h1>{item.activityName}</h1>
                                <Button type="" onClick={this.toDetail.bind(this, item.activityId, item.status)}>详情</Button>
                                <Button type="link" onClick={this.delete.bind(this, item.activityId)}>删除</Button>
                              </div>
                              <Tag>{item.typeName}</Tag><Tag color="#f50">{getActivityType(item.status)}</Tag>
                              <div className="i-background">
                                <h4>活动背景</h4>
                                {
                                  item.background.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this, i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}

                                      </div> 
                                  })
                                }
                                
                                
                              </div>
                              <div className="i-background">
                                <h4>活动目的</h4>
                                {
                                  item.purpose.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this, i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}

                                      </div> 
                                  })
                                }
                              </div>
                              <div className="pub-info">
                                <img src={getImg(item.publisherPic)} onClick={this.showImg.bind(this, item.publisherPic)} className='logo-school'/>
                                <div>
                                  <p className="i-top">
                                    <span className="i-name">{item.publisherName}</span> 创建&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {item.leaderNames}负责&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(item.createTime)}
                                  </p>
                                </div>
                              </div>
                              <div className="pub-bottom">
                                <Icon type="eye" />&nbsp;&nbsp;<span>{item.readNum}</span>&nbsp;&nbsp;<Divider type="vertical" />
                                <Icon type="message" />&nbsp;&nbsp;<span>{item.commentNum}</span>&nbsp;&nbsp;<Divider type="vertical" />
                                <Icon type="heart" />&nbsp;&nbsp;<span>{item.likesNum}</span>&nbsp;&nbsp;<Divider type="vertical" />
                                <Icon type="star" />&nbsp;&nbsp;<span>{item.collectNum}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {
                                  item.status!=5?(<span style={{cursor: "pointer"}} onClick={this.guidang.bind(this, item.activityId)}><Icon type="file" />&nbsp;&nbsp;<span>归档</span>&nbsp;&nbsp;&nbsp;&nbsp;</span>):
                                  (<span style={{cursor: "pointer"}} onClick={this.cancelGuidang.bind(this, item.activityId)}><Icon type="file-zip" />&nbsp;&nbsp;<span>已归档</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <span>{item.filePersonName}归档&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(item.fileTime)}</span></span>)
                                
                                }
                              
                              </div>
                            </section>

                 })
               }
         

                <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>

                <Modal
                title="归档原因"
                visible={this.state.visible1}
                onOk={this.handleCancel1}
                onCancel={this.handleCancel1}
                footer={[
                  <Button key="submit" type="primary" onClick={this.handleCancel1}>
                    确定
                  </Button>
                ]}
                >
                  <Form {...formItemLayout2}>
                    <Form.Item label="归档原因">
                        {getFieldDecorator('reason1')(
                          <TextArea rows={4} disabled maxLength={200}/>
                      )}
                    </Form.Item>
                    <Form.Item label="操作人">
                        {getFieldDecorator('handler')(
                          <Input disabled maxLength={20}  />
                      )}
                    </Form.Item>
                    </Form>
                </Modal>

                <Modal
                title="发布人"
                visible={this.state.visible2}
                onOk={this.handleOk2}
                onCancel={this.handleCancel2}
                footer={[
                  <Button key="submit" type="primary" onClick={this.handleOk2}>
                    确定
                  </Button>
                ]}
                >
                  <Form {...formItemLayout2}>
                    <Form.Item label="发布人">
                        {getFieldDecorator('publisherIds', {initialValue: this.state.publisherIds||[],
                           rules: [{
                              required: true,
                              message:"请选择发布人",
                          }]
                        })(
                          <Select
                          placeholder="请选择发布人" 
                          mode="multiple"
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '200' }} >
                          <Option value='1' key='1'>科任老师</Option>
                          <Option value='2' key='2'>副班主任</Option>
                          <Option value='3' key='3'>班主任</Option>
                          <Option value='4' key='4'>导师</Option>
                        </Select>
                      )}
                    </Form.Item>
                    </Form>
                </Modal>

                <Modal
                title="学生角色管理"
                visible={this.state.visible3}
                onOk={this.handleOk3}
                onCancel={this.handleCancel3}
                footer={[
                  <Button key="submit" type="primary" onClick={this.handleOk3}>
                    确定
                  </Button>
                ]}
                >
                  {
                    this.state.roleList.map((item, index)=>{
                      return  <div key={index} style={{marginBottom: '10px'}}>
                                <Input placeholder="请输入" onChange={this.onChange3.bind(this, item.selfId)} style={{width: '200px'}} maxLength={20} value={item.name} />&nbsp;&nbsp;
                                <Icon type="close" onClick={this.deleteLabel.bind(this, item.selfId)} />
                              </div>
                    })
                  }
                  <Button type="dashed" onClick={this.addLabel.bind(this)}>新增</Button>                
                </Modal>


                <Modal
                width={800}
                title="类型管理"
                visible={this.state.visible4}
                onOk={this.handleOk3}
                onCancel={this.handleCancel3}
                footer={[
                  <Button key="submit" type="primary" onClick={this.saveDstmTypes}>
                    确定
                  </Button>
                ]}
                >
                  <ul className='dstm-list-modal-ul'>
                    <li className='type'>类型</li>
                    <li className='check'>审核人</li>
                    <li className='file'>附件</li>
                  </ul>
                  {
                    this.state.types.map((item, index)=>{
                      return  <div key={index} style={{marginBottom: '10px'}}>
                                <Input placeholder="请输入" onChange={this.onChange4.bind(this, item.selfId)} style={{width: '200px'}} maxLength={20} value={item.name} />&nbsp;&nbsp;
                                <Select
                                  placeholder="请选择发布人" 
                                  mode="multiple"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  value={item.approvers}
                                  onChange={this.onChange5.bind(this, item.selfId)}
                                  style={{ width: '200px' }} >
                                  {option2}
                                </Select>
                                &nbsp;&nbsp;
                                <div style={{display: "inline-block", verticalAlign: 'top', width: '300px'}}>
                                  <Upload {...props} defaultFileList={item.files} onChange={this.onChange10.bind(this, item.selfId)} >
                                    <Button>
                                      <Icon type="upload" />上传
                                    </Button>
                                  </Upload>
                                </div>
                                &nbsp;&nbsp;
                                <Icon type="close" onClick={this.deleteLabel1.bind(this, item.selfId)} />
                              </div>
                    })
                  }
                  <Button type="dashed" onClick={this.addLabel1.bind(this)}>新增</Button>                
                </Modal>
                <ImgPreview
                    visible={this.state.previewVisible}  // 是否可见
                    onClose={this.closePreview} // 关闭事件
                    src={this.state.licenceUrl} // 图片url
                    picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                    isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                    isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                >
                </ImgPreview>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     commonData:state.user,
     gradeList:state.user.commonGradeData,
     jobList:state.user.commonJobList
  }
}

export default connect(mapStateToProps)(Form.create()(DstmList));
