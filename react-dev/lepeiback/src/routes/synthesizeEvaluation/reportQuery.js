import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Upload,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import './style.less';
import { previewUrl } from '@/config'
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ReportQuery extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          disabled1:false,
          classValue:'',
          classValue1:'',
          allReport:{},
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
     this.allReport()
    }
    // 获取报告列表
    allReport = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/allReport',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              allReport:res.data,
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
    // 查询
    Search = () =>{
      this.props.form.validateFields(["kw","gradeId","classId"],(err,values) =>{
        const params = {
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw || '',
          "gradeId":values.gradeId || '',
          "classId":values.classId || '',
        }
        this.allReport(params)
      })
    }
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields(["kw","gradeId","classId"],(err,values) =>{
        this.setState({page:current,prePage:size})
        if(!err){
          const params = {
            "page":current,
            "prePage":size,
            "kw":values.kw || '',
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
          }
          this.allReport(params)
        }
      })
    }
    
    // 进度查询
    checkProgress = () =>{
      this.props.dispatch(routerRedux.push("/check-progress"))
    }
    // 批量下载
    download = () =>{
      this.props.dispatch({
        type: 'user/getAllSemesters',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              visible:true
            })
          }
        }
      })
    }
    handleOk =() =>{
      
    }
    handleCancel =() =>{
      this.props.form.resetFields(["semesterId","classId1","gradeId1"])
      this.setState({visible:false})
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
              }
            })
          }
        }
      })
    }
    // 学期选择
    termSelect = (value) =>{
      this.setState({
        semesterId:value
      })
    }
    // 预览
    toPreview = (id) =>{
      let url = previewUrl+"?personId="+id+"&studentId="+id 
      window.open(url)
    }
    
    render(){
      const { confirmLoading, allReport, detailList,visible, templateList, quotasList} = this.state;
      const { getFieldDecorator } = this.props.form;
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
        title: '操作',
        width:200,
        dataIndex: '',
        render:(record) => (
          <span>
              <a herf="javascript:;" onClick={this.toPreview.bind(this,record.id)}>预览</a>
          </span>
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
        return (
          <div className="content-main term-message">     
              <Form className="content-form">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="姓名"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={5}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value="">全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      {getFieldDecorator("classId",{initialValue:''})(
                        <Select showSearch disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                    <Col span={10} >
                        <Button type='primary' onClick={this.Search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.checkProgress.bind(this)}>进度查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.download.bind(this)}>批量下载</Button>
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={allReport.totalCount} totalPage={allReport.totalPage} currentPage={allReport.currentPage}/>
              <Modal
                title="批量下载"
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label={'学期'}>
                          {getFieldDecorator('semesterId',{rules:[{required:true,message:"请选择"}]})(
                            <Select placeholder="请选择模板">
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

export default connect(mapStateToProps)(Form.create()(ReportQuery));
