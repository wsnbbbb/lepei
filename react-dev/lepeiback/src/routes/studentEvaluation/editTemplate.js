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

class editTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          checkedList: defaultCheckedList,
          indeterminate: false,
          checkAll: false,
          tempName: undefined,
          name: undefined,
          semesterId:'',
          plainOptions:[],
          allplain: [],
          commentType: '',
          isAllowCustomize: 0,
          isShowPercent: 0,
          commentCycle: 1,
          title:"编辑模板",

        };
    }
    componentDidMount=()=>{
      const params={
        "templateId": this.props.match.params.id,
      }
      this.getAllSemesters()
      this.getGrade()
      this.getTemplateDetail()

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

    getTemplateDetail=()=>{
      this.props.dispatch({
        type:'evaluation/studentTemplateDetail',
        payload: {templateId: this.props.match.params.id},
        callback: (res)=>{
          if(res.code===200){
            this.setState({
              name: res.data.name,
              semesterId: res.data.semesterId+'',
              commentType: res.data.commentType,
              commentCycle: res.data.commentCycle,
              isAllowCustomize: res.data.isAllowCustomize,
              isShowPercent: res.data.isShowPercent,
              checkedList: res.data.gradeIds
            })
          }
        }
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
 
    editTemplate=()=>{
      if(isBlank(this.state.name)){
        message.warning("模板名称不能为空！")
        return
      }
      const params={
        "templateId": this.props.match.params.id,
        "name": this.state.name,
        "semesterId": this.state.semesterId,
        "commentType": this.state.commentType,
        "isAllowCustomize": this.state.isAllowCustomize,
        "isShowPercent": this.state.isShowPercent,
        "gradeId": this.state.checkedList,
        "commentCycle": this.state.commentCycle
      }
      let _this=this
      this.props.dispatch({
        type:'evaluation/editTemplate',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            message.success("更新模板成功！")
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
        name: this.state.tempName
      });
     
    }

    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
        tempName: undefined
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
    
    onCheckAllChange = (e) => {
      console.log(e)
      this.setState({
        checkedList: e.target.checked ? this.state.allplain : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    }
    
    render(){
        const {semestersList} =this.props;
        const options1 = semestersList&&semestersList.map((item)=>{
          return <Option value={item.semesterId} key={item.semesterId}>{item.semesterName}</Option>
        })

        return (
            <div className="content-main evaluation">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>编辑模板</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
              <div className="main">
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;模板名称：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input style={{width:380}} maxLength={40} value={this.state.name} placeholder="请输入名称" onChange={this.inputOnchange.bind(this)} />&nbsp;&nbsp;
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学期：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Select placeholder="请选择学期" value={this.state.semesterId} disabled style={{ width: 380 }}>
                         {options1}
                      </Select>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价方式：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <RadioGroup disabled value={this.state.commentType}>
                        <Radio value={1}>点星</Radio>
                        <Radio value={2}>打分</Radio>
                      </RadioGroup>
                  </Row>
                  <Row>
                      <label>教师自定义要点：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Switch checkedChildren="开" disabled unCheckedChildren="关" checked={this.state.isAllowCustomize==1} />
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;百分制显示：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Switch checkedChildren="是" disabled unCheckedChildren="否" checked={this.state.isShowPercent==1} />
                  </Row>
                  <Row>
                      <label className="checkbox-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;适用年级：</label>
                      <div className="checkbox-wrap">
                        <Checkbox
                          indeterminate={this.state.indeterminate}
                          onChange={this.onCheckAllChange}
                          checked={this.state.checkAll}

                          disabled 
                        >
                          所有年级
                        </Checkbox>
                        <br />
                        <br />
                        <CheckboxGroup options={this.state.plainOptions} disabled value={this.state.checkedList} onChange={this.onChange1} />
                      </div>
                  </Row>
                  <Row>
                      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价周期：</label>&nbsp;&nbsp;&nbsp;&nbsp;
                      <RadioGroup onChange={this.onChange2} disabled value={this.state.commentCycle}>
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
                      <Button type="primary" onClick={this.editTemplate.bind(this)}>保存</Button>
                    </div>
                  </Row>
                </div>

                  
             
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    semestersList: state.evaluation.semestersData,
  }
}

export default connect(mapStateToProps)(Form.create()(editTemplate));
