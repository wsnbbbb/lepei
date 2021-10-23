import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { getUpload, portUrl } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class SubjectScore extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          disabled1:false,
          classValue:'',
          classValue1:'',
          defaultVal:'',
          applicationName:'',
          list:{},
          detailList:[],
          visible:false,
          confirmLoading:false,
          visible1:false,
          confirmLoading1:false,
          personName:'',
          personId:'',
          subjectId:'',
          exportUrl:'',
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
        type: 'user/getCommonGradeList'
      })
      this.getSubjects()
      this.getAllSemesters()

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
                // const params = {
                //   "page": 1,
                //   "prePage": 20,
                //   "semesterId": item.semesterId
                // }
                // that.getSubjectScore(params)
              }
            })
          }
        }
      })
    }
    // 获取科目
    getSubjects = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/getSubjects',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              subjectList:res.data
            })
          }
        }
      })
    }
    // 获取列表
    getSubjectScore = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/getSubjectScore',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            let scoreList = res.data.dataList[0].scores
            res.data.dataList&&res.data.dataList.map(item =>{
              item.gradeClass = item.gradeName + item.className
              if(item.scores.length == 1){
                this.setState({subjectId:item.scores[0].subjectId})
              }
              item.scores.map(v =>{
                item[v.subjectId] = v.score
              })
            })
            let arr = []
            scoreList&&scoreList.map(v => {
              this.state.subjectList&&this.state.subjectList.map(obj =>{
                if(v.subjectId == obj.subjectId){
                  arr.push({
                      title: obj.subjectName,
                      dataIndex: v.subjectId.toString(),
                  })
                }
              })
            })
           
            this.setState({
              list:res.data,
              detailList:res.data.dataList,
              arr:arr
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
      console.log({value});
      
      this.setState({
        semesterId:value
      })
    }
    // 科目选择
    changeSubject = (val) =>{
      this.setState({subjectId:val})
    }
    // 查询
    search = () =>{
      this.props.form.validateFields(["kw","semesterId","gradeId","classId","subjectId"],(err,values) =>{
        if(!err){
          const params = {
            "page":1,
            "prePage":this.state.prePage,
            "kw":values.kw || '',
            "semesterId":values.semesterId,
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
            "subjectId":values.subjectId || '',
          }
          this.getSubjectScore(params)
        }
      })
    } 
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields(["kw","semesterId","gradeId","classId","subjectId"],(err,values) =>{
        this.setState({page:current,prePage:size})
        if(!err){
          const params = {
            "page":current,
            "prePage":size,
            "kw":values.kw || '',
            "semesterId":values.semesterId,
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
            "subjectId":values.subjectId || '',
          }
          this.getSubjectScore(params)
        }
      })
    }
    // 导入成绩
    importScore = () =>{
      this.setState({visible:true})
    }
    // 文件上传
    changeFile=(e)=> {
      this.setState({file: e.target.files[0]})
    }
    // 确定导入成绩
    handleOk = () =>{
      this.props.form.validateFields(["semesterId1","classId1","gradeId1","excel"],(err,values) =>{
        if(!err){
          const params = new FormData();
          params.append('excel', this.state.file)
          params.append('semesterId', values.semesterId1)
          params.append('classId', values.classId1)
          this.props.dispatch({
            type:'synthesizeEvaluation/importScore',
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
                  message.success("成绩导入成功")
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
    // 编辑
    editScore = (id) =>{
      this.setState({personId:id})
      const params = {
        "personId":id,
        "semesterId":this.state.semesterId
      }
      this.props.dispatch({
        type:'synthesizeEvaluation/getScore',
        payload:params,
        callback:(res)=>{
          if(res.code === 200){
            this.setState({
              visible1:true,
              scores:res.data,
            })
          }
        }
      })
      
    }
    changeScore = (id,e) =>{
      let scores = this.state.scores
      scores&&scores.map(item =>{
        if(item.subjectId == id){
          item.score = e.target.value
        }
      })
      this.setState({scores})

    }
    // 提交编辑
    handleOk1 = () =>{
      let that = this
      const params = {
        "scores":this.state.scores,
        "personId":this.state.personId,
        "semesterId":this.state.semesterId,
      }
      console.log({params});
      this.props.dispatch({
        type:'synthesizeEvaluation/editScore',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            message.success("成绩修改成功")
            that.setState({
             confirmLoading1: true,
           })
           setTimeout(() => {
            that.setState({
               visible1: false,
               confirmLoading1: false,
             });
           }, 1000);
           that.search()
         }
        }
      })
    }
   // 取消  
    handleCancel = () =>{
      this.setState({visible:false})
      this.props.form.resetFields(["semesterId1","classId1","gradeId1","excel"])
    }
    
    handleCancel1 = () =>{
      this.setState({
        visible1:false,
      })
    }
   
    // 导出
    export = () =>{
      this.props.form.validateFields((err, values) => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let kw = values.kw||'';
        let semesterId = values.semesterId||'';
        let classId = values.classId||'';
        let gradeId = values.gradeId||'';
        let subjectId = values.subjectId||'';
        let url = portUrl("/manager/quality-subject-score/score-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+"&classId="+classId+"&semesterId="+
        semesterId+"&gradeId="+gradeId+"&subjectId="+subjectId)
        this.setState({exportUrl:url})
      })
    }

    test=(id)=>{
      let rst = this.state.subjectList&&this.state.subjectList.find((current) =>{
        return current.subjectId === id
      })
      return rst.subjectName
    }
    render(){
      const { visible, confirmLoading, arr, confirmLoading1, visible1, subjectList,scoreDetail, subjectId, list, detailList, defaultVal,scores} = this.state;
     
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:7 },
        wrapperCol: { span: 17 }
      };
      const formItemLayout1 = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      let columns = [{
        title: '学期',
        dataIndex: 'semesterName',
      },{
        title: '姓名',
        dataIndex: 'personName',
      },
      {
        title: '年级班级',
        dataIndex: 'gradeClass',
      },
     
    ]
      let columns1 = [
        {
          title: '操作',
          align:'right',
          width:100,
          dataIndex: '',
          render:(record) => (
            <span>
              {record.scores.length>0?<a href="javascript:;" onClick={this.editScore.bind(this, record.personId)}>编辑</a>:null}
            </span>
          )
        }
      ]
      if(arr){
        columns = [...columns, ...arr, ...columns1]
        console.log({columns})
      }
        const {allTerms, commonData, gradeList } = this.props;
        let termChild = []
        allTerms&&allTerms.length>0&&allTerms.map(item => {
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
        let subjectOptions = []
        subjectList&&subjectList.length>0&&subjectList.map(item => {
          return subjectOptions.push(<Option key={item.subjectId} value={item.subjectId}>{item.subjectName}</Option>)
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
                          <Select onChange={this.termSelect.bind(this)}>
                              {termChild}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={3}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{rules:[{required:true,message:"请选择年级"}]})(
                        <Select showSearch placeholder="请选择年级" onChange={this.gradeChange.bind(this)}>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      {getFieldDecorator("classId",{initialValue:''})(
                        <Select showSearch placeholder="请选择" disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'科目'}>
                      {getFieldDecorator("subjectId",{initialValue:''})(
                        <Select showSearch onChange={this.changeSubject.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {subjectOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                    <Col span={5} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.importScore.bind(this)}>导入</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                    </Col>
                </Row>
              </Form>
              
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              <Modal
                title="导入成绩"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout1} label={'学期'}>
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
                      <FormItem {...formItemLayout1} label={'年级'}>
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
                    <FormItem {...formItemLayout1} label={'班级'}>
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
                      <FormItem {...formItemLayout1} label={'上传附件'}>
                        {getFieldDecorator("excel",{initialValue:''})(
                            <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <p style={{marginLeft:"138px"}}>
                    <a href={getUpload("成绩导入模版.xlsx")}>下载模板</a>
                    <span style={{marginLeft:"30px"}}>支持扩展名为.xls及.xlsx的文件</span>
                  </p>
                </Form>
              </Modal>
              <Modal
                className="modal-editScore"
                title="编辑成绩"
                visible={visible1}
                confirmLoading={confirmLoading1}
                onOk={this.handleOk1}
                onCancel={this.handleCancel1}
              >
                <Form>
                  {
                    scores&&scores.map((item,index) =>{
                      return  subjectId == ''|| subjectId == item.subjectId?<Row gutter={24} key={item.subjectId}>
                              <Col span={22}>
                                <FormItem {...formItemLayout1} label={this.test(item.subjectId)}>
                                    <Input value={item.score} onChange={this.changeScore.bind(this,item.subjectId)} placeholder="请输入"/>
                                </FormItem>
                              </Col> 
                          </Row>:null
                    })
                  }
                </Form>

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

export default connect(mapStateToProps)(Form.create()(SubjectScore));
