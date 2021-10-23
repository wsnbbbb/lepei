import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Checkbox ,Radio ,Breadcrumb,Switch,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {isBlank, formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const defaultCheckedList = [];

class newTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          checkedList: defaultCheckedList,
          indeterminate: false,
          checkAll: false,
          tempName: undefined,
          curTemId: undefined,
          name: undefined,
          semesterId:'',
          plainOptions:[],
          allplain: [],
          commentType: 1,
          isAllowCustomize: 0,
          isShowPercent: 0,
          commentCycle: 1,
          title:'新建模板'
        };
    }
    componentDidMount=()=>{
      const params={
        "templateId": this.props.match.params.id,
      }
      this.getAllTemplate()
      this.getAllSemesters()
      this.getGrade()
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-evaluation"
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
    getAllTemplate=()=>{
      this.props.dispatch({
        type:'evaluation/getAllTemplate',
        payload: {}
      })
    }
    getAllSemesters=()=>{
      this.props.dispatch({
        type:'evaluation/getAllSemesters',
        payload: {},
      })
    }
    getGrade=()=>{
      this.props.dispatch({
        type:'evaluation/commonGradeList',
        payload: {},
        callback: (res)=>{
          if(res.code===200){
            let optionArr=[]
            let allplainArr=[]
            res.data.map((item)=>{
              optionArr.push({
                "label": item.gradeName,
                "value": item.gradeId
              })
              allplainArr.push(item.gradeId)
            })
            this.setState({
              plainOptions: optionArr,
              allplain: allplainArr
            })
          }
        }
      })
    }
 
    create=()=>{
      if(isBlank(this.state.name)){
        message.warning("模板名称不能为空！")
        return
      }
      if(isBlank(this.state.semesterId)){
        message.warning("请选择学期！")
        return
      }
      if(this.state.checkedList.length==0&&(this.state.checkAll==false)){
        message.warning("请选择适用年级！")
        return
      }
      const params={
        "name": this.state.name,
        "semesterId": this.state.semesterId,
        "commentType": this.state.commentType,
        "isAllowCustomize": this.state.isAllowCustomize,
        "isShowPercent": this.state.isShowPercent,
        "gradeId": this.state.checkAll?this.state.allplain:this.state.checkedList,
        "commentCycle": this.state.commentCycle
      }
      let _this=this
      this.props.dispatch({
        type:'evaluation/createTemplate',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            message.success("创建模板成功！")
            setTimeout(function(){
              _this.back();
            }, 3000);
          }
        }
      })
  }

    back = () => {
      this.props.dispatch(
        routerRedux.push("/student-evaluation")
      )
    }
    
    handleOk = () => {
      this.setState({
        visible: false,
        name: this.state.tempName,
      });
     this.studentTemplateDetail();

    }

    studentTemplateDetail=()=>{
      this.props.dispatch({
        type:'evaluation/studentTemplateDetail',
        payload: {
          "templateId": this.state.curTemId
        },
        callback: (res)=>{
         if(res.code==200){
           this.setState({
              commentType: parseInt(res.data.commentType),
              isAllowCustomize: res.data.isAllowCustomize,
              isShowPercent: res.data.isShowPercent,
              commentCycle: res.data.commentCycle,
              name: res.data.name,
              semesterId: res.data.semesterId+'',
              checkedList: res.data.gradeIds
           })
         }
        }
      })
    }



    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
        tempName: undefined
      });
    }
    onChange = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
        commentType: e.target.value,
      });
    }
    inputOnchange= (e) => {
      this.setState({
        name: e.target.value,
      });
    }
    onChange1 = (checkedList) => {
      console.log(checkedList)
      this.setState({
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
        checkAll: checkedList.length === this.state.plainOptions.length,
      });
    }
    onChange2 = (e) => {
      this.setState({
        commentCycle: e.target.value,
      });
    }
  
    onChange3=(checked)=> {
      console.log(`switch to ${checked}`);
      if(checked==true){
        this.setState({
          isAllowCustomize: 1
        })
      }else{
        this.setState({
          isAllowCustomize: 0
        })
      }
    }

    onChange4=(checked)=> {
      console.log(`switch to ${checked}`);
      if(checked==true){
        this.setState({
          isShowPercent: 1
        })
      }else{
        this.setState({
          isShowPercent: 0
        })
      }
    }
    
    onCheckAllChange = (e) => {
      console.log(e)
      this.setState({
        checkedList: e.target.checked ? this.state.allplain : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    }

    chosse=()=>{
      this.setState({
        visible: true,
      })
    }

    handleChange=(value)=> {
      console.log(`selected ${value}`);
      this.setState({
        curTemId: value
      })
    }

    handleChange1=(value)=> {
      console.log(`selected ${value}`);
      this.setState({
        semesterId: value
      })
    }
    
    render(){
        const {templateList, semestersList} =this.props;
        const {userName,realName,password,checkPassword} = this.state;
        const options = templateList&&templateList.map((item)=>{
          return <Option value={item.id} key={item.id}>{item.name}</Option>
        })
        const options1 = semestersList&&semestersList.map((item)=>{
          return <Option value={item.semesterId} key={item.semesterId}>{item.semesterName}</Option>
        })

        return (
            <div className="content-main evaluation">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>新建模板</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
              <div className="main">
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;模板名称：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input style={{width:380}} maxLength={40} value={this.state.name} placeholder="请输入名称" onChange={this.inputOnchange.bind(this)} />&nbsp;&nbsp;
                      <label><a href="javascript:;" onClick={this.chosse.bind(this)}>选择现有模板</a></label>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学期：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select placeholder="请选择学期" value={this.state.semesterId} style={{ width: 380 }} onChange={this.handleChange1}>
                         {options1}
                      </Select>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价方式：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <RadioGroup onChange={this.onChange} value={this.state.commentType}>
                        <Radio value={1}>点星</Radio>
                        <Radio value={2}>打分</Radio>
                      </RadioGroup>
                  </Row>
                  <Row>
                      <label>教师自定义要点：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.onChange3.bind(this)} />
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;百分制显示：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onChange4.bind(this)} />
                  </Row>
                  <Row>
                      <label className="checkbox-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;适用年级：</label>
                      <div className="checkbox-wrap">
                        <Checkbox
                          indeterminate={this.state.indeterminate}
                          onChange={this.onCheckAllChange}
                          checked={this.state.checkAll}
                        >
                          所有年级
                        </Checkbox>
                        <br />
                        <br />
                        <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange1} />
                      </div>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价周期：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <RadioGroup onChange={this.onChange2} value={this.state.commentCycle}>
                        <Radio value={1}>按天</Radio>
                        <Radio value={2}>按周</Radio>
                        <Radio value={3}>按月</Radio>
                      </RadioGroup>
                      <br/>
                      <p className="tips">注：评价周期为记分周期</p>
                  </Row>

                  <Row>
                    <div className="btn-wrap">
                      <Button onClick={this.back.bind(this)}>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type="primary" onClick={this.create.bind(this)}>确定</Button>
                    </div>
                  </Row>
                </div>

                  
              <Modal
                title="选择现有模板"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                  <Row>
                      <label>选择模板：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select placeholder="请选择模板" value={this.state.curTemId} style={{ width: 300 }} onChange={this.handleChange.bind(this)} >
                        {options}
                      </Select>
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
    templateList: state.evaluation.allTemplateData,
    semestersList: state.evaluation.semestersData,
  }
}

export default connect(mapStateToProps)(Form.create()(newTemplate));
