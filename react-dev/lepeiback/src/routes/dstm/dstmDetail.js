import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Breadcrumb, Icon, Rate, Row, Col, Tag, Tabs, Radio, TreeSelect, Divider,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux , Link} from 'dva/router';
import {portUrl, getImg} from '../../utils/img';
import {getGradeType, getSexType, getQueryString, formatDate, getActivityType} from '../../utils/public';
import './style.less';
import ImgPreview from '../../components/imgPreview';

const { TabPane } = Tabs
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

class DstmDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          visible: false,
          teacherList: [],
          previewVisible: false,
          licenceUrl: '',
          list: {},
          currentType: '',
          roleList: [{
              id: undefined,
              selfId: 1,
              name: undefined
          }],
          item: {},
          title:'详情'

         
        };
    }
    componentDidMount=()=>{
       const params={
         "page": 1,
         "prePage": 20,
       }
      this.getDstmDetail({id: getQueryString("id")})

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/dstm-list"
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
   
    
    getDstmDetail=(params)=>{
      this.props.dispatch({
        type: 'dstm/getDstmDetail',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                item: res.data
              })
            }
        }
      })
    }

    deleteComment=(id, type)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type:'dstm/deldstmComment',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                if(type==1){
                  me.getDstmDetail({id: getQueryString("id")})
                }else{

                }
              }
            }
          })
        },
        onCancel() {},
      });
    }
  
    getMore=(type)=>{
      this.setState({
        currentType: type
      })
      let params= {
        "page": 1,
        "prePage": this.state.prePage,
        "activityId": getQueryString("id"),
        "type": type
      }
      this.props.dispatch({
        type: 'dstm/dstmActivityComment',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                visible: true,
                list: res.data
              })
            }
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type: 'dstm/dstmActivityComment',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                visible: true,
                list: res.data
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
 

    onChange3 = (id, e)=> {
      this.state.roleList.map(item=>{
        if(item.selfId == id){
          item.name = e.target.value
        }
      })
      console.log(this.state.roleList)
      this.setState({roleList: this.state.roleList})
  }
    // 查询
    search=()=>{
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "activityId": getQueryString("id"),
          "type": this.state.type
        }
        this.getList(params)
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
                message.success('撤销成功！',3)
              
                  if(me.state.currentType==1){
                    me.search()
                  }else if(me.state.currentType==2){
                    me.search1()
                  }else if(me.state.currentType==3){
                    me.search2()
                  }
             
              }
            }
          })
        },
        onCancel() {},
      });
    }


   
    
    // 撤销
    showConfirm=(id, type)=> {
      let me=this;
      this.setState({
        currentType: type
      })
      confirm({
        title: '提示',
        content: '确定要撤销归档吗？',
        onOk() {
          me.props.dispatch({
            type:'filePersons/unfileOne',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('撤销成功！',3)
              
                  if(me.state.currentType==1){
                    me.search()
                  }else if(me.state.currentType==2){
                    me.search1()
                  }else if(me.state.currentType==3){
                    me.search2()
                  }
             
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
        this.setState({page:current,prePage:size})
        const params={
          "page": current,
          "prePage": size,
          "type": this.state.currentType,
          "activityId": getQueryString("id")
        }
        this.getList(params)
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
                visible2: true
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
        visible3: false
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

      })
    }


    handleCancel =()=>{
      this.setState({
        visible: false
      }) 
    }

    //归档
    guidang=()=> {
        let me=this;
        confirm({
          title: '提示',
          content: '确定要将它归档吗？',
          onOk() {
            me.props.dispatch({
              type:'dstm/dstmActivityFile',
              payload:{"activityId": getQueryString("id")},
              callback:(res)=>{
                if(res.code===200){
                  message.success('归档成功！',3)
                  me.getDstmDetail({id: getQueryString("id")})
                }
              }
            })
          },
          onCancel() {},
        });
    }

     //取消归档
     cancelGuidang=()=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要将它取消归档吗？',
        onOk() {
          me.props.dispatch({
            type:'dstm/unfileDstmActivity',
            payload:{"activityId": getQueryString("id")},
            callback:(res)=>{
              if(res.code===200){
                message.success('取消归档成功！',3)
                me.getDstmDetail({id: getQueryString("id")})
              }
            }
          })
        },
        onCancel() {},
      });
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


    render(){
      
        const { item, list} = this.state;
        return (
            <div className="content-main dstm-main">
               {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/dstm-list">数字科技馆</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                      <section className="row-item" style={{border: "none"}}>
                              <div className="i-title">
                                <h1>{item.activityName}</h1>
                              </div>
                              <Tag>{item.typeName}</Tag>
                              <div className="pub-info" style={{paddingTop: '10px'}}>
                                <img src={getImg(item.publisherPic)} className='logo-school'/>
                                <div className="p-i-right">
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
                                  item.status!=5?(<span style={{cursor: "pointer"}}  onClick={this.guidang.bind(this)}><Icon type="file" />&nbsp;&nbsp;<span>归档</span>&nbsp;&nbsp;&nbsp;&nbsp;</span>):
                                  (<span style={{cursor: "pointer"}} onClick={this.cancelGuidang.bind(this)}><Icon type="file-zip" />&nbsp;&nbsp;<span>已归档</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <span>{item.filePersonName}归档&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(item.fileTime)}</span></span>)
                                }
                              
                              </div>
                              <div className="i-background">
                                <h4>活动背景</h4>
                                {
                                  item.background&&item.background.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                 {
                                  item.background&&item.background.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                                
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.background&&item.background.comments.length!=0?<span onClick={this.getMore.bind(this, 1)} className="b-more-span">查看更多</span>:null
                                  }
                                  
                              </div>
                              <div className="i-background">
                                <h4>活动目的</h4>
                                {
                                  item.purpose&&item.purpose.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                {
                                  item.purpose&&item.purpose.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.purpose&&item.purpose.comments.length!=0?<span onClick={this.getMore.bind(this, 2)} className="b-more-span">查看更多</span>:null
                                  }
                              </div>
                              <div className="i-background">
                                <h4>活动准备</h4>
                                {
                                  item.prepare&&item.prepare.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                {
                                  item.prepare&&item.prepare.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.prepare&&item.prepare.comments.length!=0?<span onClick={this.getMore.bind(this, 3)} className="b-more-span">查看更多</span>:null
                                  }
                              </div>
                              <div className="i-background">
                                <h4>活动计划</h4>
                                {
                                  item.plan&&item.plan.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)}  style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                {
                                  item.plan&&item.plan.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.plan&&item.plan.comments.length!=0?<span onClick={this.getMore.bind(this, 4)} className="b-more-span">查看更多</span>:null
                                  }
                              </div>
                              <div className="i-background">
                                <h4>活动过程</h4>
                                {
                                  item.process&&item.process.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                {
                                  item.process&&item.process.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.process&&item.process.comments.length!=0?<span onClick={this.getMore.bind(this, 5)} className="b-more-span">查看更多</span>:null
                                  }
                              </div>
                              <div className="i-background">
                                <h4>活动报告</h4>
                                {
                                  item.report&&item.report.description.map((i, index)=>{
                                      return <div key={index}>
                                        <p>{i.content}</p>
                                            {i.images&&i.images.map((i, idx)=>
                                              <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:70,height:70,margin:'0px 10px 10px 0px'}}/>
                                            )}
                                      </div> 
                                  })
                                }
                                {
                                  item.report&&item.report.comments.map((i, index)=>{
                                    if(index>=3) return
                                    return <span key={index}> 
                                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId, 1)}>
                                                <img src={getImg(i.personHeadImg)} className='logo-school'/>
                                                <div className="p-i-r">
                                                  <div>
                                                    {i.personName}
                                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                                    {i.personScore?i.personScore+"分":null}
                                                  </div>
                                                  <p>{i.className}</p>
                                                </div>
                                              </div>
                                              <div style={{paddingLeft: "40px"}}>
                                                <div>
                                                    <p>{i.content}</p>
                                                      {i.images&&i.images.map((i, idx)=>
                                                        <img key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                                      )}
                                                </div>
                                              </div>
                                          </span>     
                                    })
                                  }
                                  {
                                    item.report&&item.report.comments.length!=0?<span onClick={this.getMore.bind(this, 6)} className="b-more-span">查看更多</span>:null
                                  }
                              </div>
                            </section>


                {/* <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/> */}

                <Modal
                className="dstm-modal"
                title="评价详情"
                width={800}
                visible={this.state.visible}
                onOk={this.handleOk3}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="submit" type="primary" onClick={this.handleOk3}>
                    确定
                  </Button>
                ]}
                >
                {
                  list.dataList&&list.dataList.map((i, index)=>{
                    return <span key={index}> 
                              <div className="pub-info" onDoubleClick={this.deleteComment.bind(this, i.commentId)}>
                                <img src={getImg(i.personHeadImg)} onClick={this.showImg.bind(this,i.personHeadImg)} className='logo-school'/>
                                <div className="p-i-r">
                                  <div>
                                    {i.personName}
                                    {i.personScore?<Rate style={{paddingLeft: "30px"}} disabled allowHalf defaultValue={Math.round(i.personScore)} />:null}
                                    {i.personScore?i.personScore+"分":null}
                                  </div>
                                  <p>{i.className}</p>
                                </div>
                              </div>
                              <div style={{paddingLeft: "40px"}}>
                                <div>
                                    <p>{i.content}</p>
                                      {i.images&&i.images.map((i, idx)=>
                                        <img className="dstm-modal-img" key={idx} src={getImg(i)} onClick={this.showImg.bind(this,i)} style={{width:100,height:70,margin:'0px 10px 10px 0px'}}/>
                                      )}
                                </div>
                              </div>
                          </span>     
                    })
                  }
                  <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>

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

export default connect(mapStateToProps)(Form.create()(DstmDetail));
