import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType,getSexType,getResidence, formatIdcard} from '../../utils/public';
import { portUrl } from '../../utils/img'
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ParentMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          visible: false,
          gradeId: '',
          classValue: '',
          personIds: [],
          disabled: false,
          selectedRowKeys: [],
          exportUrl: '',
          personList: [],
          visible1: false,
          visible2: false,
          datas1: [],
          currentPersonId: ''
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page": 1,
         "prePage": 20,
         "status": 0
       }
       this.parentLists(params)
       this.props.dispatch({
        type:'user/getCommonGradeList'
       })
    }

    // getParentsDetail
    parentLists=(params)=>{
      this.props.dispatch({
        type:'parent/getParentList',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              personList: res.data
            })

          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "status":values.status||0
        }

        console.log({params});
        
        this.parentLists(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条学生信息吗？',
        onOk() {
          me.props.dispatch({
            type:'person/deletePerson',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
                    "classId":me.state.classValue?me.state.classValue.substring(me.state.classValue.lastIndexOf('-')+1, me.state.classValue.length):'',
                    "status":values.status||0
                  }
                  me.parentLists(params)
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
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "status":values.status||0
        }
        this.parentLists(params)
      })
    }
    goToDetail=(type,id)=>{
      if(Number(type)===1){
        this.props.dispatch(routerRedux.push("/student-detail?type="+type))
      }else{
        this.props.dispatch(routerRedux.push("/student-detail?type="+type+"&personId="+id))
      }
    }
    edit=(id)=>{
      
      this.props.dispatch({
        type:'parent/getParentsDetail',
        payload:{personId: id},
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              visible1: true,
              datas1: res.data,
              currentPersonId: id
            })
            
          }
        }
      })
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-parent"));
    }

    delete=(id)=>{
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条关系吗？',
        onOk() {
          me.props.dispatch({
            type:'parent/deleteRelation',
            payload:{"personId": me.state.currentPersonId, parentId: id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.dispatch({
                  type:'parent/getParentsDetail',
                  payload:{personId: me.state.currentPersonId},
                  callback:(res)=>{
                    if(res.code===200){
                      me.setState({
                        datas1: res.data
                      })
                    }
                  }
                })
                me.refreshList()
              }
            }
          })
        },
        onCancel() {},
      });


    }
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)

        this.props.dispatch({
          type: 'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    handleCancel1 =()=>{
      this.setState({
        visible1: false
      }) 
    }
    handleCancel2 =()=>{
      this.props.form.resetFields(['parentName', 'relation'])
      this.setState({
        visible2: false
      }) 
    }
    add = ()=>{
      this.setState({
        visible2: true
      })
    }
    handleOk = (e) => {
        this.setState({
          visible1: false,
      });
    }

    refreshList = ()=>{
      let me = this
      //刷新列表页
      me.props.form.validateFields((err, values) => {
        const params={
          "page": me.state.page,
          "prePage": me.state.prePage,
          "kw": values.kw||'',
          "gradeId": values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId": me.state.classValue?me.state.classValue.substring(me.state.classValue.lastIndexOf('-')+1, me.state.classValue.length):'',
          "status": values.status||0
        }        
        me.parentLists(params)
    })
    }
  handleOk1 = (e) => {
    let me = this
    this.props.form.validateFields((err, values) => {
      if(!err){
        const params={
          "personId":me.state.currentPersonId,
          "parentName":values.parentName||'',
          "relation":values.relation||''
        }
        me.props.dispatch({
        type:'parent/parentsAdd',
        payload: params,
        callback:(res)=>{
            if(res.code===200){
                me.props.form.resetFields(['parentName', 'relation'])
                this.setState({
                    visible2: false,
                });
                this.props.dispatch({
                  type:'parent/getParentsDetail',
                  payload:{personId: this.state.currentPersonId},
                  callback:(res)=>{
                    if(res.code===200){
                      this.setState({
                        datas1: res.data
                      })
                    }
                  }
                })

                me.refreshList()
            
            }
        }
    })
      }
    })

}
    // 导出
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let gradeId = values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length)||'';
        let classId = this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length)||'';
        let status = values.status||0;
        let url=portUrl("/manager/parents/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&status="+status)
        this.setState({exportUrl:url})
       
      })
    }
    render(){
        const columns = [{
            title: '学生姓名',
            dataIndex: 'personName',
            // width:100,
            // fixed:'left'
          },
          {
            title: '读书形式',
            dataIndex: 'inResidence',
            render:(record)=>{
              return(<span>{getResidence(record)}</span>)
            }
          },  {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          },{
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }, 
          {
            title: '1家长姓名',
            dataIndex: 'parentName1',
          },
          {
            title: '关系',
            dataIndex: 'parentRelation1',
          },
          {
            title: '2家长姓名',
            dataIndex: 'parentName2',
          },
          {
            title: '关系',
            dataIndex: 'parentRelation2',
          },
          {
            title: '3家长姓名',
            dataIndex: 'parentName3',
          },
          {
            title: '关系',
            dataIndex: 'parentRelation3',
          },
          {
            title: '4家长姓名',
            dataIndex: 'parentName4',
          },
          {
            title: '关系',
            dataIndex: 'parentRelation4',
          },
          {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.edit.bind(this,record.personId)}>编辑</a> 
                {/* {record.isAllowDel==0?null:<Dropdown overlay={<Menu>
                  <Menu.Item><span onClick={this.showConfirm.bind(this,record.personId)}>删除</span></Menu.Item>
                </Menu>}><Icon type="ellipsis" /></Dropdown>} */}
              </span>
            )
          }];
          const columns1 = [
          {
            title: '家长姓名',
            dataIndex: 'parentName',
            width: 60,
          },
          {
            title: '关系',
            dataIndex: 'relation',
            width: 60,
          },
          {
            title: '操作',
            dataIndex: '',
            width: 100,

            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.delete.bind(this,record.parentId)}>删除</a> 
          
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          };
          const formItemLayout1 = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
          const menu = (
            <Menu>
              <Menu.Item>
                <a href="javascript:;" onClick={this.upload.bind(this)}>导入</a>
              </Menu.Item>
              <Menu.Item>
                <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
              </Menu.Item>
            </Menu>
          );
          const {commonData,gradeList} = this.props;
          const {personList, visible1, visible2, datas1} = this.state;
          if(!personList){
            return null
          }
          let datas=[];
          personList&&personList.dataList&&personList.dataList.map((item,idx)=>{
            datas.push({key:item.personId,...item})
          })
          console.log({datas})

      
          // personList&&personList.dataList&&personList.dataList.map((item,idx)=>{
          //   datas1.push({key:item.personId,...item})
          // })
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
          })
          let options=[]

          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入学生或家长姓名"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'年级名称'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout1} label={'状态'}>
                    {getFieldDecorator("status",{initialValue: 0})(
                        <Select showSearch >
                          <Option value={0} >全部</Option>
                          <Option value={1} >有家长</Option>
                          <Option value={2} >无家长</Option>
                        </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={5} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button type='primary' onClick={this.upload.bind(this)}>导入</Button>&emsp;
                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={datas} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={personList.totalCount} totalPage={personList.totalPage} currentPage={personList.currentPage}/>
            <Modal
              title="编辑"
              visible={visible1}
              onOk={this.handleOk}
              onCancel={this.handleCancel1}
              footer={null}
            >
              <Button type='primary' disabled={datas1.length>=4?"disabled":false} onClick={this.add.bind(this)}>添加</Button>&nbsp;&nbsp;<span>最多添加4位家长</span>
              <Table columns={columns1} dataSource={datas1} pagination={false}/>
            </Modal>
            <Modal
              title="添加"
              visible={visible2}
              onOk={this.handleOk1}
              onCancel={this.handleCancel2}
            >

              <FormItem {...formItemLayout2} label='家长姓名'>
                {getFieldDecorator("parentName",{initialValue:"",rules:[{required:true,message:"请输入家长姓名"}]})(
                  <Input maxLength={10} />
                )}
              </FormItem>

              <FormItem {...formItemLayout2} label='关系'>
                {getFieldDecorator("relation",{initialValue:"",rules:[{required:false}]})(
                  <Input maxLength={5}/>
                )}
              </FormItem>
             
            </Modal>
            </div>

            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    //  personList:state.person,
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(ParentMange));
