import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { getUpload } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;

class TermMessage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          disabled1:false,
          classValue:'',
          classValue1:'',
          termName:'',
          applicationName:'',
          messageList:{},
          detailList:[],
          visible:false,
          confirmLoading:false,
          visible1:false,
          confirmLoading1:false,
          visible2:false,
          qiniuToken:'',
          personName:'',
          teacherMessage:'',
          num:0,
          name:'',
          msgList:[]
        };
    }
    componentDidMount=()=>{
     this.getAllSemesters()
      this.props.dispatch({
        type: 'user/getCommonGradeList'
      })
      
    }
     // 获取所有学期
     getAllSemesters = () =>{
      let that = this
      this.props.dispatch({
        type: 'user/getAllSemesters',
        callback:(res) =>{
          if(res.code === 200){
            res.data&&res.data.map(item =>{
              if(item.isCurrent === true){
                this.setState({
                  defaultVal:item.semesterId,
                  semesterId:item.semesterId
                })
                const params = {
                  "page":1,
                  "prePage":20,
                  "semesterId":item.semesterId
                }
                that.getMessageList(params)
              }
            })
          }
        }
      })
    }
    // 获取学期寄语列表
    getMessageList = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/getMessageList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              messageList:res.data,
              detailList:res.data.dataList
            })
          }
        }
      })
    }
     // 年级
     gradeChange = (val)=>{
      if(val){
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":val},
          callback:(res)=>{
            if(res.code===200){
                this.setState({
                  disabled:false
                })
            }
          }
        })
      }else{
        this.setState({
          disabled:true,
        })
      }
    }
    
    // 学期选择
    termSelect = (value) =>{
      this.setState({
        semesterId:value
      })
      
    }
    // 查询
    search = () =>{
      this.props.form.validateFields(["kw","semesterId","gradeId","classId"],(err,values) =>{
        if(!err){
          const params = {
            "page":1,
            "prePage":this.state.prePage,
            "kw":values.kw || '',
            "semesterId":values.semesterId,
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
          }
          this.getMessageList(params)
        }
      })
    } 
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields(["kw","semesterId","gradeId","classId"],(err,values) =>{
        this.setState({page:current,prePage:size})
        if(!err){
          const params = {
            "page":current,
            "prePage":size,
            "kw":values.kw || '',
            "semesterId":values.semesterId,
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
          }
          this.getMessageList(params)
        }
      })
    }
    // 导入寄语
    importMessage = () =>{
      this.setState({visible:true})
    }
    // 文件上传
    changeFile=(e)=> {
      this.setState({file: e.target.files[0]})
    }
    // 确定导入寄语
    handleOk = () =>{
      this.props.form.validateFields(["semesterId1","classId1","gradeId1","excel"],(err,values) =>{
        if(!err){
          if(this.state.file == ''){
            message.error("请上传教师评语表格再提交")
          }
          const params = new FormData();
          params.append('excel', this.state.file)
          params.append('semesterId', values.semesterId1,)
          params.append('classId', values.classId1)
         console.log({params});
          this.props.dispatch({
            type:'synthesizeEvaluation/importMessage',
            payload:params,
            callback:(res)=>{
              this.setState({file: ''})
              this.props.form.resetFields(["excel"])
              if(res.code===200){
                if(res.data.hasError===true){
                  if(res.data.header&&res.data.sheetData){
                      this.setState({visible:true,header:res.data.header,sheetData:res.data.sheetData})
                  }
                  message.error(res.msg)
              }else{
                  message.success("寄语导入成功")
                  this.setState({visible:false})
                  this.props.form.resetFields(["semesterId1","classId1","gradeId1","excel"])
                  this.search()
              }
              }
            }
          })
        }
      })
    }
    // 教师寄语
    sendWord = (id,name) =>{
      this.setState({
        visible1:true,
        personId:id,
        personName:name
      })
    }
    changeText = (e) =>{
      this.setState({
        teacherMessage:e.target.value,
        num:e.target.value.length
      })
    }
    handleOk1 = () =>{
      if(this.state.teacherMessage === ''){
        message.error("请输入寄语")
      }
      const params = {
        "personId":this.state.personId,
        "semesterId":this.state.semesterId,
        "content":this.state.teacherMessage,
      }
      console.log({params});
      this.props.dispatch({
        type:'synthesizeEvaluation/sendWord',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
             message.success("评价成功")
             this.setState({
              confirmLoading1: true,
            })
            setTimeout(() => {
              this.setState({
                visible1: false,
                confirmLoading1: false,
                teacherMessage:''
              });
            }, 1000);
            this.search()
          }
        }
      })
    }
    // 查看
    check = (id,name) =>{
      const params = {
        "semesterId":this.state.semesterId,
        "personId":id
      }
      this.props.dispatch({
        type:'synthesizeEvaluation/teacherMsgDetail',
        payload:params,
        callback:(res)=>{
          if(res.code === 200){
            this.setState({
              name,
              visible2:true,
              msgList:res.data
            })
          }
        }
      })
    }
    
    handleCancel = () =>{
      this.setState({visible:false})
      this.props.form.resetFields(["semesterId1","classId1","gradeId1","excel"])
    }
    
    handleCancel1 = () =>{
      this.setState({
        visible1:false,
        teacherMessage:''
      })
    }
    handleCancel2 = () =>{
      this.setState({
        visible2:false,
      })
    }
    // 删除
    del = (id) => {
      const params = {
        "semesterId":this.state.semesterId,
        "personId":id
      }
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
          type:'synthesizeEvaluation/delTeacherMsg',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success('删除成功！')
              me.search()
            }
          }
        })
        },
        onCancel() {},
      });
    }
    render(){
      const { defaultVal, visible, confirmLoading, visible1, confirmLoading1, visible2, teacherMessage, num, personName, messageList, detailList, msgList,allDevice} = this.state;
      const { getFieldDecorator } = this.props.form;
      const placeholder = "请输入对" + personName + "的寄语"
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const columns = [{
        title: '学期',
        dataIndex: 'semesterName',
      },{
        title: '年级班级',
        dataIndex: '',
        render:(record)=>(
        <span>{record.gradeName}{record.className}</span>
        )
      },{
        title: '姓名',
        dataIndex: 'personName',
      },{
        title: '评价状态',
        dataIndex: 'status',
        render:(record) =>(
        <span>{record==1?"已评价":(record==0?"未评价":'')}</span>
        )
      },{
        title: '操作',
        width:200,
        dataIndex: '',
        render:(record) => (
          <span>
            <a href="javascript:;" onClick={this.sendWord.bind(this, record.personId,record.personName)}>教师寄语</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="javascript:;" onClick={this.check.bind(this, record.personId,record.personName)}>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;
            {record.status==1?<a href="javascript:;" onClick={this.del.bind(this, record.personId)}>删除</a>:null}
            
          </span>
        )
      }
      ]
        const {allTerms, commonData, gradeList } = this.props;
        let termChild = []
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
          termChild.push(<Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>)
        })
        let classOptions = [];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
        })
        let options = []
        gradeList&&gradeList.length>0&&gradeList.map(item => {
          return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })
        return (
          <div className="content-main term-message">
              <Form className="content-form">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="请输入姓名"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'学期'}>
                        {getFieldDecorator('semesterId',{initialValue:defaultVal,rules:[{required:true,message:"请选择学期"}]})(
                          <Select placeholder="请选择学期" onChange={this.termSelect.bind(this)}>
                              {termChild}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={5}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch placeholder="请选择" onChange={this.gradeChange.bind(this)}>
                          <Option value="">全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      {getFieldDecorator("classId",{initialValue:''})(
                        <Select showSearch placeholder="请选择" disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                    <Col span={5} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.importMessage.bind(this)}>导入寄语</Button>
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={messageList.totalCount} totalPage={messageList.totalPage} currentPage={messageList.currentPage}/>
             <Modal
                title="寄语导入"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'学期'}>
                          {getFieldDecorator('semesterId1',{rules:[{required:true,message:"请选择学期"}]})(
                            <Select placeholder="请选择学期" >
                                {termChild}
                            </Select>
                          )}
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'年级'}>
                        {getFieldDecorator("gradeId1",{rules:[{required:true,message:"请选择年级"}]})(
                          <Select showSearch placeholder="请选择" onChange={this.gradeChange.bind(this)}>
                            {options}
                          </Select>
                        )}
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24}>
                    <Col span={22}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      {getFieldDecorator("classId1",{rules:[{required:true,message:"请选择班级"}]})(
                        <Select showSearch placeholder="请选择" disabled={this.state.disabled}>
                          {classOptions}
                        </Select>
                      )}
                    </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24} >
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'上传附件'}>
                        {getFieldDecorator("excel",{initialValue:''})(
                            <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <p style={{marginLeft:"138px"}}>
                    <a href={getUpload("教师评语导入模版.xlsx")}>下载模板</a>
                    <span style={{marginLeft:"30px"}}>支持扩展名为.xls及.xlsx的文件</span>
                  </p>
                </Form>
              </Modal>
              <Modal
                width={600}
                className="modal-message"
                title="教师寄语"
                visible={visible1}
                confirmLoading={confirmLoading1}
                onOk={this.handleOk1}
                onCancel={this.handleCancel1}
              >
                <TextArea
                  onChange={this.changeText.bind(this)}
                  value={teacherMessage}
                  placeholder={placeholder}
                  maxLength={1000}
                  autosize={{minRows: 10,maxRows:10}}
                />
                  <p className="num">{num}/1000</p>
              </Modal>
              <Modal
                width={600}
                className="modal-message"
                title="评价详情"
                visible={visible2}
                footer={<Button type="primary" key="back" onClick={this.handleCancel2}>返回</Button>}
              >
                <div>
                  {msgList&&msgList.map((item,index) =>{
                    return <div className="msgDedail" key={index}>
                              <h4 className="title">{this.state.name}的{item.commentType == 1?"自我评价":(item.commentType == 2?"家长寄语":(item.commentType == 3?"教师寄语":null))}</h4>
                              <p>{item.content}</p>
                            </div>
                  })
                    
                  }
                  
                </div>
              </Modal>
          </div>     
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(TermMessage));
