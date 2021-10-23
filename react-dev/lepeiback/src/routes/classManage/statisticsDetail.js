import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message,Tooltip} from 'antd';
import PageIndex from '../../components/page';
import {formatDate} from '../../utils/public';
import {portUrl, getUpload} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class StatisticsDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false,
          kw: undefined,
          
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "courseListId": this.props.match.params.id
      }
      // this.associationClassList(params)
      this.getAllgrade()
      this.getChosenStudent(params)
    }
    getChosenStudent=(params)=>{
      this.props.dispatch({
        type:'association/getChosenStudent',
        payload: params
      })
    }
    getAllgrade=()=>{
      this.props.dispatch({
        type:'association/getAllgrade1',
        payload:{}
      })
    }
    getClassName=(params)=>{
      this.props.dispatch({
        type:'association/getClassName1',
        payload: params
      })
    }
    handleChange=(e)=> {
      this.setState({
        kw: e.target.value
      })
    }
    handleChange1=(value)=> {
      this.setState({
        gradeId: value,
        classId: undefined
      })
      const params={
        gradeId: value
      }
      if(!value) return
      this.getClassName(params)
    }
    handleChange2=(value)=> {
      this.setState({
        classId: value
      })
    }
    associationClassList=(params)=>{
      this.props.dispatch({
        type:'association/associationClassList',
        payload:params
      })
    }
    // 查询
    search=()=>{
        const params={
          "page":1,
          "prePage": this.state.prePage,
          "kw": this.state.kw||'',
          "courseListId": this.props.match.params.id,
          "gradeId": this.state.gradeId||"",
          "classId": this.state.classId||"",
        }
        this.getChosenStudent(params)
    }
    // 分页
    onPageChange=(current,size)=>{
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw": this.state.kw||'',
          "courseListId": this.props.match.params.id,
          "gradeId": this.state.gradeId||"",
          "classId": this.state.classId||"",
        }
        this.getChosenStudent(params)
    }

    generateType = (type) => {
       if(type == 2){
         return "社团课"
       }else if(type == 3){
         return "延时课"
       }
    }

    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw= this.state.kw||'';
        let courseListId= this.props.match.params.id;
        let gradeId= this.state.gradeId||'';
        let classId= this.state.classId||'';

        let url=portUrl("/manager/course/get-chosen-student-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&kw="+kw+"&courseListId="+courseListId+"&gradeId="+gradeId+"&classId="+classId
          )
        this.setState({exportUrl:url})
      })
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            key:'personName'
          }, {
            title: '性别',
            dataIndex: 'sex',
            key:'sex',
            width: 100,
            render:(sex) => (
              <span>
               {sex==1?"男":"女"}
              </span>
            )
          }, {
            title: '年级',
            dataIndex: 'gradeName',
            key:'gradeName',
            width: 200,
            
          }, {
            title: '班级',
            dataIndex: 'className',
            key:'className',
            width: 200,
            
          }, {
            title: '所选课程',
            dataIndex: 'courseName',
            key:'courseName',
            width: 200,
          },{
            title: '报名时间',
            dataIndex: 'applyTime',
            key:'applyTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          }];
          const { getFieldDecorator } = this.props.form;
          const {chosenStudentData,} = this.props;
         
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {classList,visitDetail, gradeList1, classList1} = this.props;
          if(!classList){
            return null;
          }
          const option1 = gradeList1&&gradeList1.map((item, index)=>{
            return <Option key={index} value={item.gradeId}>{item.gradeName}</Option>
          })
          const option2 = classList1&&classList1.map((item, index)=>{
            return <Option key={index} value={item.classId}>{item.className}</Option>
          })
          console.log(visitDetail)
        return (
            <div className="content-main statistics-detail">
               <Input
                placeholder="请输入姓名"
                // onSearch={value => console.log(value)}
                style={{ width: 160 }}
                value={this.state.kw}
                onChange={this.handleChange}
              />&nbsp;&nbsp;&nbsp;&nbsp;
              <Select placeholder="请选择年级" value={this.state.gradeId} onChange={this.handleChange1.bind(this)} style={{ width: 160 }} >
                  <Option value="">全部</Option>
                  {option1}
              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
              <Select placeholder="请选择班级" value={this.state.classId} onChange={this.handleChange2.bind(this)} style={{ width: 160 }} >
                  <Option value="">全部</Option>
                  {option2}
              </Select>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                    
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={chosenStudentData&&chosenStudentData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={chosenStudentData&&chosenStudentData.totalCount} totalPage={chosenStudentData&&chosenStudentData.totalPage} currentPage={chosenStudentData&&chosenStudentData.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     classList: state.association,
     gradeList1: state.association.gradeList1,
     classList1: state.association.classList1,
     chosenStudentData: state.association.chosenStudentData,
  }
}
export default connect(mapStateToProps)(Form.create()(StatisticsDetail));
