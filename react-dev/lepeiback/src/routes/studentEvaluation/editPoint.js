import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,InputNumber,Breadcrumb,Icon,Tabs,message,TreeSelect,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate, isBlank} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class editPoint extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false,
          inputArr: [],
          pointName: '',
          defaultScore: null,
          maxScore: null,
          treeValue: [],
          material: '',
          teacherId: [],
          label: [],
          assessorType: null,
          treeData1: [],
          parentNode: [],
          title:"编辑要点",

        };
    }
    componentDidMount=()=>{
      const params={
        "pointId": this.props.match.params.id,
      }
      this.getPointDetail(params)
      this.getPointTeacher();
      this.setState({
        "inputArr" :[
          {
            text: undefined,
            selfId: 1
          }
        ],
      })

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
    
    getPointDetail=(params)=>{
      this.props.dispatch({
        type:'evaluation/pointDetail',
        payload: params,
        callback: (res)=>{
          if(res.code==200){
            this.setState({
              inputArr: []
            })
            res.data.label.map((item, index)=>{
              this.state.inputArr.push(
                {
                  text: item,
                  selfId: index+1
                }
              )
            })
            this.setState({
              pointName: res.data.pointName,
              defaultScore: res.data.defaultScore,
              maxScore: res.data.maxScore,
              treeValue: res.data.assessorPersonId,
              material: res.data.material,
              assessorType: res.data.assessorType,
              inputArr: this.state.inputArr
            })
          }
        }
      })
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
    updatePoint = ()=>{
      let _this = this
      if(isBlank(this.state.pointName)){
        message.warning("请填写要点名称！")
        return
      }
      if(this.state.treeValue.length==0){
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
        "pathId": this.props.match.params.id,
        "quotaId": localStorage.getItem("quotaId"),
        "maxScore": this.state.maxScore,
        "defaultScore": this.state.defaultScore,
        "assessorType": this.state.assessorType,
        "teacherId": this.state.treeValue,
        "label": label,
        "material": this.state.material
      }
      
      this.props.dispatch({
        type:'evaluation/updatePoint',
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
      this.setState({
         defaultScore: value
      })
    }

    onChange4 = (value)=> {
      this.setState({
        maxScore: value
     })
    }

    onChange5 = (e)=> {
      console.log(e.target.value)
      this.setState({
        "material": e.target.value
      })
    }
    
    onChange6 = value => {
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
        "treeValue": value
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
      const tProps = {
        disabled: this.state.assessorType==1,
        treeData: this.state.treeData1,
        value: this.state.treeValue,
        onChange: this.onChange6.bind(this),
        treeCheckable: true,
        searchPlaceholder: '请选择老师',
        style: {
          width: 300,
        },
      };
      const {templateList, pointTeacherList} =this.props;
      const children = [];
      for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
      }
      // if(!pointTeacherList){
      //   return null;
      // }
      const options1 = pointTeacherList&&pointTeacherList.map((item)=>{
        return <Option key={item.personId}>{item.name}</Option>
      })
         
        return (
            <div className="content-main content-essential">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>编辑要点</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
      
              <table className="info">
                <thead>
                    <tr>
                        <td>要点</td>
                        <td>星星（上限）</td>
                        <td>默认点亮</td>
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
                          <InputNumber min={1} max={10} value={this.state.maxScore} onChange={this.onChange3} />&nbsp;&nbsp;
                          <Icon type="star" theme="filled" />
                        </td>
                        <td className="input-number-box">
                          <InputNumber min={1} max={10} value={this.state.defaultScore} onChange={this.onChange4} />&nbsp;&nbsp;
                          <Icon type="star" theme="filled" />
                        </td>
                        <td>
                          {/* <Select
                            mode="multiple"
                            style={{ width: '200px' }}
                            placeholder="请选择"
                            value={this.state.treeValue}
                            onChange={this.handleChange}
                          >
                            {options1}
                          </Select> */}
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
                  <Button type="primary" onClick={this.updatePoint.bind(this)}>保存</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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

export default connect(mapStateToProps)(Form.create()(editPoint));
