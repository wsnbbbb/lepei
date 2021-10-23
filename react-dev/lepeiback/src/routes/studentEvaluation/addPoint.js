import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Switch, InputNumber,Breadcrumb,Icon,Tabs,message,Modal,DatePicker,TreeSelect } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate, isBlank} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class addPoint extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false,
          inputArr: [],
          pointName: '',
          defaultScore: 10,
          maxScore: 100,
          inputMaxScore: 0,
          pointTeacher: [],
          material: '',
          teacherId: [],
          label: [],
          assessorType: 1,
          treeData: [],
          treeData1: [],
          parentQuotaId: null,
          treeValue: [],
          parentNode: []
        };
    }
    componentWillMount=()=>{
      console.log("willmount")
      this.setState({
        "commentType": sessionStorage.getItem("commentType"),
        "inputMaxScore": sessionStorage.getItem("commentType")==1?10:100,
        "defaultScore": sessionStorage.getItem("commentType")==1?10:100,
        "maxScore": sessionStorage.getItem("commentType")==1?10:100,
        "inputArr" :[
          {
            text: undefined,
            selfId: 1
          }
        ]
      })
    }
    componentDidMount=()=>{
      console.log("didMount")
      const params={
        "templateId": this.props.match.params.id,
      }
      this.getPointTeacher();
      this.getQuotas(params);
    }
    
    getPointTeacher=(params)=>{
      this.props.dispatch({
        type:'evaluation/getPointTeacher',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            let arr= []
            res.data.map(item=>{
              arr.push(item.key)
            })
            this.setState({
              treeData1: res.data,
              parentNode: arr
            })
            
          }
        }
      })
    }
    getQuotas=(params)=>{
      this.props.dispatch({
        type:'evaluation/getQuotas',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            function parseJson(arr) {
                arr = arr.slice()
                function toParse(arr) {
                    arr.forEach(function (item) {
                        if (item._child && Array.isArray(item._child)) {
                            item['children'] = item._child
                            toParse(item['children'])
                        }
                        item['title'] = item.name
                        item["key"] = item.quota_id
                        item['value'] = item.quota_id
                        delete item.pid
                        delete item._child
                    })
                    return arr
                }
                return toParse(arr)
            }
            console.log(parseJson(res.data))
            this.setState({
              treeData: parseJson(res.data),
            })
          }
        }
      })
    }
    addPoint = ()=>{
      let _this = this
      
      if(!this.state.parentQuotaId){
        message.warning("请选择上级指标！")
        return
      }
      if(isBlank(this.state.pointName)){
        message.warning("请填写要点名称！")
        return
      }
      if(!Number.isInteger(this.state.maxScore)||!Number.isInteger(this.state.defaultScore)){
        message.warning("星星数只能是整数！")
        return
      }
      if(this.state.maxScore < this.state.defaultScore){
        message.warning("默认数不能大于上限")
        return
      }
      if(this.state.assessorType==3&&this.state.treeValue.length==0){
        message.warning("请选择评价人！")
        return
      }
      let filterArr = this.state.inputArr.filter(item=> item.text)
      let label=[]
      filterArr.map((item)=>{
        label.push(item.text)
      })
      const params={
        "name": this.state.pointName,
        "quotaId": this.state.parentQuotaId,
        "maxScore": this.state.maxScore,
        "defaultScore": this.state.defaultScore,
        "assessorType": this.state.assessorType,
        "teacherId": this.state.assessorType==1?[]:this.state.treeValue,
        "label": label,
        "material": this.state.material
      }
      
      this.props.dispatch({
        type:'evaluation/addPoint',
        payload: params,
        callback: (res)=>{
          if(res.code==200){
            if(res.code===200){
              message.success("保存成功！")
              setTimeout(function(){
                window.history.go(-1)
              }, 2000);
            }
          }
        }
      })
    }
    
    cancel = () => {
      this.props.dispatch(
        routerRedux.push("/student-evaluation")
      )
    }

   
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "status":values.status||''
        }
        this.getEssentialList(params)
      })
    }
   
    onChange = (value)=> {
      console.log('changed', value);
    }

    onChange1 = (e)=> {
      this.setState({
        pointName: e.target.value
      })
    }

    onChange2 = (selfId, e)=> {
      this.state.inputArr.map(item=>{
        if(item.selfId== selfId){
          item.text=e.target.value
        }
      })
      this.setState({
        inputArr: this.state.inputArr
      })
    }

    onChange3 = (value)=> {
      console.log("hahaww")
      console.log(value)
      
      this.setState({
        maxScore: value
      })
    }

    onChange4 = (value)=> {
      this.setState({
        defaultScore: value
      })
    }

    onChange5 = (e)=> {
      console.log(e.target.value)
      this.setState({
        "material": e.target.value
      })
    }

    onChange6 = (value) => {
      console.log(value);
      this.setState({
        "parentQuotaId": value,
      })
    }

    onChange7 = (value)=> {
      console.log(`switch to ${value}`);
      this.setState({
        assessorType: value,
        pointTeacher: []
      })
    }
    onChange8 = value => {
      console.log('onChange ', value);
      // let arr=[]
      let arr = value.filter(item=>{
        return !this.state.parentNode.includes(item)
      })
      this.setState({ 
        treeValue: arr
      });
    };
    handleChange=(value)=> {
      console.log(`selected1 ${value}`);
      this.setState({
        "pointTeacher": value
      })
    }
    
    addLabel=()=>{
      if(this.state.inputArr.length==0){
        this.state.inputArr.push(
          {
            text: undefined,
            selfId: 1
          }
        )
      }else{
        let selfId = Number(this.state.inputArr[this.state.inputArr.length-1].selfId) + 1
        this.state.inputArr.push(
          {
            text: undefined,
            selfId: selfId
          }
        )
      }
      
      this.setState({
        inputArr: this.state.inputArr
      })
    }

    deleteLabel=(selfId)=>{
      this.setState({ inputArr: this.state.inputArr.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.inputArr);
      });
    }

    render(){

      const {templateList, pointTeacherList} =this.props;
      const children = [];
      for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
      }
      const tProps = {
        disabled: this.state.assessorType==1,
        treeData: this.state.treeData1,
        value: this.state.treeValue,
        onChange: this.onChange8.bind(this),
        treeCheckable: true,
        searchPlaceholder: '请选择老师',
        style: {
          width: 300,
        },
      };
      // if(!pointTeacherList){
      //   return null;
      // }
      const options1 = pointTeacherList&&pointTeacherList.map((item)=>{
        return <Option key={item.personId}>{item.name}</Option>
      })
         
        return (
            <div className="content-main content-essential">
              <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>添加要点</Breadcrumb.Item>
                    </Breadcrumb>
              </div>
              <Row>
                    <label>上级指标：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                     <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.parentQuotaId}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择指标"
                        onChange={this.onChange6.bind(this)}
                      />
                </Row>
      
              <table className="info">
                <thead>
                    <tr>
                        <td>要点</td>
                        <td>{this.state.commentType==1?"星数（上限）":"分数"}</td>
                        <td>{this.state.commentType==1?"默认点亮":"默认分数"}</td>
                        <td>评价人类型</td>
                        <td>评价人</td>
                        <td>文字评价</td>
                        <td>实证材料</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                          <Input placeholder="请输入要点名称，30字以内" maxLength={30} value={this.state.pointName} onChange={this.onChange1.bind(this)} style={{ width: 200 }}  />
                        </td>
                        <td className="input-number-box">
                          <InputNumber min={1} max={this.state.inputMaxScore} value={this.state.maxScore} onChange={this.onChange3} />&nbsp;&nbsp;
                          {
                            this.state.commentType==1?<Icon type="star" theme="filled" />:""
                          }
                        </td>
                        <td className="input-number-box">
                          <InputNumber min={0} max={this.state.inputMaxScore} value={this.state.defaultScore} onChange={this.onChange4} />&nbsp;&nbsp;
                          {
                            this.state.commentType==1?<Icon type="star" theme="filled" />:""
                          }
                        </td>
                        <td>
                          <Select defaultValue="1" style={{ width: 120 }} onChange={this.onChange7.bind(this)}>
                            <Option value="1">全校</Option>
                            <Option value="3">单独选择老师</Option>
                          </Select>
                        </td>
                        <td>
                          <TreeSelect {...tProps} />
                        </td>
                        <td>
                         {
                           this.state.inputArr.map((item)=>{
                              return  <div className="input-group" key={item.selfId}>
                                        <Input placeholder="请输入" value={item.text} maxLength={20} onChange={this.onChange2.bind(this, item.selfId)}/>
                                        <Icon type="close" onClick={this.deleteLabel.bind(this, item.selfId)} />
                                      </div>
                           })
                         }
                          <Button type="dashed" onClick={this.addLabel.bind(this)}
                           style={{display: this.state.inputArr.length>=4?"none":"block"}}>新增</Button>
                        </td>
                        <td>
                          <TextArea rows={4} style={{ width: 200 }} value={this.state.material} maxLength={200} onChange={this.onChange5.bind(this)} placeholder="相关说明，200字以内"/>
                        </td>
                    </tr>
                </tbody>
              </table>
              <Row>
                <div className="btn-wrap">
                  <Button type="primary" onClick={this.addPoint.bind(this)}>保存</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button onClick={this.cancel.bind(this)}>取消</Button>
                </div>
              </Row>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    templateList: state.evaluation.essentialData,
    pointTeacherList: state.evaluation.pointTeacherData,
  }
}

export default connect(mapStateToProps)(Form.create()(addPoint));
