import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Input, Select, Form, Row, Col, Checkbox,Breadcrumb, Modal,message} from 'antd';
import { getQueryString } from '../../utils/public'
import { routerRedux, Link } from 'dva/router';
import './style.less';
import { log } from 'util';

const Option = Select.Option;
const FormItem = Form.Item;

class EvaluationTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          indeterminate: false,
          checkAll: false,
          gradeList:[],
          checkedList:[],
          title:'添加',
          title1:'编辑'
        };
    }
    componentDidMount=()=>{
      const id = getQueryString('templateId')
      this.props.dispatch({
        type: 'user/getAllSemesters',
      })
      this.getALLGrade()
      if(id){
        this.evaTemplateDetail()
      }
      if(id){
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title1,
              parentRoute:"/evaluation-template"
            },
          })
       }else{
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/evaluation-template"
            },
          })
    }
    }

    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
      }
    // 模板详情
    evaTemplateDetail = () =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/evaTemplateDetail',
        payload:{"templateId":getQueryString('templateId')},
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              templateName:res.data.templateName,
              semesterId:res.data.semesterId+'',
              checkedList:res.data.gradeIds
            })
          }
        }
      })
    }
    
    // 获取全部年级
    getALLGrade = () =>{
      this.props.dispatch({
        type: 'user/getCommonGradeList',
        callback:(res) =>{
          if(res.code === 200){
            let allGrade = []
            res.data&&res.data.map(item =>{
              allGrade.push(item.gradeId)
            })
            this.setState({
              gradeList:res.data,
              allGrade
            })
          }
        }
      })
    }
    // 选择全部
    onCheckAllChange = e => {
      console.log(e.target.checked,this.state.indeterminate);
      this.setState({
        checkedList: e.target.checked ? this.state.allGrade : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    };
    // 选择年级
    checkedVal = (checkedValues) =>{
      console.log({checkedValues});
      console.log(this.state.allGrade.length);
      
      this.setState({
        checkedList:checkedValues,
        indeterminate: !!this.state.checkedList.length && this.state.checkedList.length < this.state.allGrade.length,
        checkAll: this.state.checkedList.length === this.state.allGrade.length?true:false,
      })
    }
    // 保存
    save = () =>{
      const id = getQueryString('templateId')
      this.props.form.validateFields((err, values) => {
        let params
        if(!err){
          if(id){
            params = {
              "templateId":id,
              "templateName":values.kw,
              "semesterId":values.semesterId,
              "gradeIds":this.state.checkedList
            }
          }else{
            params = {
              "templateName":values.kw,
              "semesterId":values.semesterId,
              "gradeIds":this.state.checkedList
            }
          }
          this.props.dispatch({
            type:id?'synthesizeEvaluation/templateEdit':'synthesizeEvaluation/addTemplate',
            payload:params,
            callback:(res) =>{
              if(res.code === 200){
                message.success(id?"修改成功":"添加成功！")
                window.history.go(-1)
              }
            }
          })
        }
      })
    }
    // 返回
    cancel = () =>{
      this.props.dispatch(routerRedux.push("/evaluation-template"))
    }
    
   
    render(){
      const { indeterminate, checkAll, gradeList,checkedList, templateName, semesterId} = this.state;
      const { getFieldDecorator } = this.props.form;
      const id = getQueryString('templateId')
      const formItemLayout = {
        labelCol: { span:9 },
        wrapperCol: { span: 12 }
      };
      
      const {allTerms, commonData } = this.props;
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
        <div className="content-main add-evaluation-template">
          {/* <Breadcrumb style={{padding:"15px"}}>
            <Breadcrumb.Item><Link to="/evaluation-template">评价模板</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{id?"编辑":"添加"}</Breadcrumb.Item>
          </Breadcrumb> */}
            <Form className="content-form form">
              <Row gutter={24}>
                  <Col span={10}>
                    <FormItem {...formItemLayout} label='模板名称' >
                      {getFieldDecorator('kw',{initialValue:templateName,rules:[{required:true,message:"模板名称不能为空"}]})(
                        <Input placeholder="模板名称"/>
                      )}
                    </FormItem>
                  </Col> 
              </Row>
              <Row gutter={24}>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={'学期'}>
                    {getFieldDecorator('semesterId',{initialValue:semesterId,rules:[{required:true,message:"请选择学期"}]})(
                      <Select placeholder="学期" disabled={id?true:false}>
                        {termChild}
                      </Select>
                    )}
                  </FormItem>
                </Col> 
              </Row>
              <Row gutter={24}>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={'适用年级'}>
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={this.onCheckAllChange}
                      checked={checkAll}
                    >
                      全部
                    </Checkbox>
                  </FormItem>
                </Col> 
              </Row>
              <Row gutter={24}>
                <Col span={15} className="allGrade">
                  <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={this.checkedVal.bind(this)}>
                    <Row gutter={24}>
                      {
                        gradeList&&gradeList.map(item =>{
                          return <Col span={6} key={item.gradeId} className="grade">
                                    <Checkbox value={item.gradeId}>{item.gradeName}</Checkbox>
                                </Col>
                        })
                      }
                    </Row>
                  </Checkbox.Group>
                </Col> 
              </Row>
              <Row gutter={24}>
                <Col span={17} style={{textAlign:"right"}} className="btn">
                  <Button type="primary" style={{marginRight:20}} onClick={this.save.bind(this)}>保存</Button>
                  <Button onClick={this.cancel.bind(this)}>返回</Button>
                </Col>
              </Row>
            </Form>
        </div>     
      );
    }
  
}

const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
  }
}

export default connect(mapStateToProps)(Form.create()(EvaluationTemplate));
