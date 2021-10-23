import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Upload,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class StudentReport extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          disabled1:false,
          classValue:'',
          classValue1:'',
          reportList:{},
          detailList:[],
          visible:false,
          confirmLoading:false,
          qiniuToken:'',
          personName:'',
          name:'',
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
        type: 'user/getCommonGradeList'
      })
      this.getAllSemesters()
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
                that.getReportList(params)
              }
            })
          }
        }
      })
    }
    // 获取所有模板
    allTemplate = () =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/allTemplate',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({templateList:res.data,visible:true})
          }
        }
      })
    }
    // 获取所有一级指标
    allTopQuotas = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/allTopQuotas',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({quotasList:res.data})
          }
        }
      })
    }
    // 获取学生报告列表
    getReportList = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/getReportList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              reportList:res.data,
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
        const params = {
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw || '',
          "semesterId":values.semesterId,
          "gradeId":values.gradeId || '',
          "classId":values.classId || '',
        }
        this.getReportList(params)
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
          this.getReportList(params)
        }
      })
    }
    // 上传报告
    importReport = () =>{
      this.allTemplate()
    }
    // 模板选择
    selectTemplate = (val) =>{
      const params={"templateId":val}
      this.allTopQuotas(params)
    }
    // 附件上传
    beforeUpload (file) {
      const isFileType = file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'application/msword'|| file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'|| 
      file.type === 'application/pdf'||file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      const maxFileSize = 10;
      const isLtMax = file.size / 1024 / 1024 < maxFileSize;
      if (!isFileType) {
          message.error('仅支持扩展名为.jpg/.png/.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf等文件的上传！');
      }
      if (!isLtMax) {
          message.error('文件不能超过10M!');
      }
      return new Promise((resolve, reject) => {
        if(!isLtMax||!isFileType) {
          reject(file);
        } else {
          resolve(file);
        }
      });
    };
    handleChange =  ({ fileList }) => {
      console.log({fileList});
      this.setState({ fileList })
      let files = []
      fileList.length>0&&fileList.map(item =>{
        let str = item.name
          let start = str.indexOf("【")
          let end = str.indexOf("】")
          if(item.response&&item.response.success){
              files.push({
                hash:item.response.id,
                personName:str.substring(start+1,end)
              })
            }else{
              const uid=item.uid.split('~')[1]
              files.push({
                hash:uid,
                personName:str.substr(start,end)
              })
        }
      })
      this.setState({files})
    };
    // 确定导入
    handleOk = () =>{
      let that = this
      this.props.form.validateFields(["template","quotasId","gradeId1","classId1"],(err,values) =>{
        if(!err){
          if(this.state.files == []){
            message.error("请选择文件再提交")
          }
          const params = {
            "quotasId":values.quotasId,
            "files":this.state.files,
            "classId":values.classId1
          }
          that.props.dispatch({
            type:'synthesizeEvaluation/importReport',
            payload:params,
            callback:(res)=>{
              if(res.code===200){
                message.success("报告导入成功")
                this.setState({
                  confirmLoading: true,
                })
                setTimeout(() => {
                  that.setState({
                    visible: false,
                    confirmLoading: false,
                    files:[],
                    fileList:[]
                  });
                }, 1000);
                that.props.form.resetFields(["template","classId1","gradeId1","quotasId"])
                that.search()
              }
            }
          })
        }
      })
    }
   
    handleCancel = () =>{
      this.setState({visible:false, files:[],fileList:[]})
      this.props.form.resetFields(["template","classId1","gradeId1","quotasId"])
    }
   
    // 删除文档
    delFile = (hash,id) =>{
      const params = {
        "hash":hash,
        "personId":id
      }
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除该报告吗？</span>,
        onOk() {
          me.props.dispatch({
          type:'synthesizeEvaluation/delFile',
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
      const { visible, confirmLoading, reportList, detailList,defaultVal,templateList, quotasList} = this.state;
      const { getFieldDecorator } = this.props.form;
      const qiniuToken=sessionStorage.getItem('qiniuToken');
      const props = {
        name: 'file',
        action: 'https://upload.qiniup.com/',
        multiple: true,
        headers: {
          authorization: 'authorization-text',
          "Content-Disposition":'form-data; name="file";'
        },
        data:{
            token:qiniuToken?qiniuToken:this.state.qiniuToken,
        },
        beforeUpload:this.beforeUpload,
        onChange: this.handleChange,
        fileList:this.state.fileList
    }
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const columns = [{
        title: '序号',
        dataIndex: 'id',
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
        title: '学期',
        dataIndex: 'semesterName',
      },{
        title: '操作',
        width:350,
        dataIndex: '',
        render:(record) => (
          record.files&&record.files.map((item,index) =>{
            return <div key={index}>
              <span><Icon type="paper-clip" /></span>
              <span>{item.fileName}</span>
              <span style={{margin:"0 15px",cursor:"pointer"}} onClick={this.delFile.bind(this,item.hash,record.id)}><Icon type="close" /></span>
              <a style={{fontSize:"16px"}} href={item.url} download={item.fileName}><Icon type="download" /></a>
            </div>
          })
        )
      }
      ]
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
        let templateOption = []
        templateList&&templateList.length>0&&templateList.map(item => {
          return templateOption.push(<Option key={item.id} value={item.id}>{item.templateName}</Option>)
        })
        let quotasOption = []
        quotasList&&quotasList.length>0&&quotasList.map(item => {
          return quotasOption.push(<Option key={item.quotasId} value={item.quotasId}>{item.name}</Option>)
        })
        return (
          <div className="content-main term-message">     
              <Form className="content-form">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="学生姓名"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'学期'}>
                        {getFieldDecorator('semesterId',{initialValue:defaultVal})(
                          <Select onChange={this.termSelect.bind(this)}>
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
                        <Button type='primary' onClick={this.importReport.bind(this)}>上传</Button>
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={reportList.totalCount} totalPage={reportList.totalPage} currentPage={reportList.currentPage}/>
             <Modal
                title="报告导入"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'模板'}>
                          {getFieldDecorator('template',{rules:[{required:true,message:"请选择模板"}]})(
                            <Select placeholder="请选择模板" onChange={this.selectTemplate.bind(this)}>
                                {templateOption}
                            </Select>
                          )}
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'一级指标'}>
                          {getFieldDecorator('quotasId',{rules:[{required:true,message:"请选择一级指标"}]})(
                            <Select placeholder="请选择一级指标" >
                                {quotasOption}
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
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'上传附件'}>
                        <Upload 
                          {...props}
                        >
                          <Button>
                            <Icon type="upload" /> 上传文件
                          </Button>
                        </Upload>
                      </FormItem>
                    </Col> 
                  </Row>
                  <div style={{paddingLeft:"70px"}}>
                    <p style={{color:"#BFBFBF"}}>文件支持jpg、png、doc、docx、ppt、pptx、xls、xlsx、pdf格式</p>
                    <p style={{color:"#BFBFBF"}}>文件命名规则：【xxx】体检报告、【xxx】心理报告</p>
                  </div>
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

export default connect(mapStateToProps)(Form.create()(StudentReport));
