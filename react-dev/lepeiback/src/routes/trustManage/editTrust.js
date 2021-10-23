import React,{Component} from 'react';
import { routerRedux, Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Radio, InputNumber,Checkbox, DatePicker,TimePicker ,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import moment from 'moment';
import {isBlank, dateToTimestamp, formatDate, isCorrectMoney} from '../../utils/public';

const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


const defaultCheckedList = [{ label: '111', value: '1' },{ label: '222', value: '2' },];

class EditTrust extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            name: undefined,
            startDate:"",
            endDate:"",
            enrolStartTime:"",
            enrolEndTime:"",
            trustStartTime:"",
            trustEndTime:"",
            gradeList: [],
            dataList: [{
                key: 1,
                name: '第一节',
                startTime: '',
                endTime:"",
            }],
            checkedList: defaultCheckedList,
            indeterminate: false,
            checkAll: false,
            checkedList: defaultCheckedList,
            plainOptions:[],
            allplain: [],
            inputArr: [{
                id: undefined,
                selfId: 1,
                phone: undefined
            }],
            fee: undefined,
            description: undefined,
            isCharge:'',
            title:'编辑托管'
        }
    }

    componentDidMount=()=>{
        this.getGrade()
        this.getTeachersAndWorks()
        this.trustDetail()
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/trust-manage"
            },
        })
    }

    componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	}
    trustDetail=()=>{
        this.props.dispatch({
          type:'trustManage/trustDetail',
          payload: {
            trustId: this.props.match.params.id
          },
          callback: (res)=>{
            if(res.code===200){
                let arr=[]
                res.data.personId.map((item, index)=>{
                    arr.push({
                        id: item,
                        selfId: index,
                        phone: res.data.phone[index]
                    })
                })
                this.setState({
                    name: res.data.name,
                    fee: res.data.fee,
                    isCharge: Number(res.data.isCharge),
                    description: res.data.description,
                    checkedList: res.data.gradeId,
                    inputArr: arr,
                    enrolStartTime: formatDate(res.data.enrolStartTime),
                    enrolEndTime: formatDate(res.data.enrolEndTime),
                    trustStartTime: formatDate(res.data.trustStartTime),
                    trustEndTime: formatDate(res.data.trustEndTime),
                })
            }
          }
        })
    }
    getGrade=()=>{
        this.props.dispatch({
          type:'trustManage/commonGradeList',
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
    getTeachersAndWorks=()=>{
        this.props.dispatch({
          type:'trustManage/getTeachersAndWorks',
          payload: {},
        })
    }
    feeInput=(e)=>{
        // console.log(e.target.value);
        this.setState({
            fee: e.target.value
        })
    }
    nameInput=(e)=>{
        // console.log(e.target.value);
        this.setState({
            name: e.target.value
        })
    }

    onChange=(time, timeString, index, type)=> {
        // console.log(time, timeString, index, type);
        let newList = this.state.dataList.map((val) =>{
            if(val.key == index){
                if(type==1){
                    val.startTime=timeString;
                }else{
                    val.endTime=timeString;
                }
            }
            return val;
        })
        // console.log(newList)
        this.setState({dataList: newList})
    }

    onChangeRange=(date, dateString)=>{
        // console.log(date, dateString)
        this.setState({
            enrolStartTime: dateString[0],
            enrolEndTime: dateString[1]
        })
    }
    onChangeRange1=(date, dateString)=>{
        // console.log(date, dateString)
        this.setState({
            trustStartTime: dateString[0],
            trustEndTime: dateString[1]
        })
    }
    onChange1 = checkedList => {
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && checkedList.length < this.state.plainOptions.length,
          checkAll: checkedList.length === this.state.plainOptions.length,
        });
    }
  
    onCheckAllChange = (e) => {
        console.log(e)
        this.setState({
          checkedList: e.target.checked ? this.state.allplain : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      }


    inputChange=(e, index)=>{
        let newList = this.state.dataList.map((val) =>{
            if(val.key == index){
                val.name=e.target.value;
            }
            return val;
        })
        // console.log(newList)
        this.setState({dataList: newList})
    }

   
    timeBlur=(value)=>{
        console.log(value);
        debugger;
    }
 


    setData=(e)=>{
        let val=e.target.value;
        let data = Object.assign({}, this.state.dataList, { name: val })
        this.setState({
            dataList: data
        })
    }

    delClass=(index,e)=>{
        this.setState({
            dataList: this.state.dataList.filter((elem, i) => index !== elem.key)
        })
        message.info('删除成功');
    }
 
    onChange2 = (id, value)=> {
        this.state.inputArr.map(item=>{
          if(item.selfId == id){
            item.id = value
          }
        })
        console.log(this.state.inputArr)
        this.setState({inputArr: this.state.inputArr})
    }
    onChange3 = (id, e)=> {
        this.state.inputArr.map(item=>{
          if(item.selfId == id){
            item.phone = e.target.value
          }
        })
        console.log(this.state.inputArr)
        this.setState({inputArr: this.state.inputArr})
    }
    onChange4 = (e)=> {
        this.setState({
            description: e.target.value
        })
    }

    deleteLabel=(selfId)=>{
        this.setState({ inputArr: this.state.inputArr.filter(item => item.selfId !== selfId) }, () => {
          console.log('delete', this.state.inputArr);
        });
      }
    addLabel=()=>{
        if(this.state.inputArr.length==0){
          this.state.inputArr.push({
              id: undefined,
              selfId: 1,
              phone: undefined
          })
        }else{
          let selfId = Number(this.state.inputArr[this.state.inputArr.length-1].selfId) + 1
          this.state.inputArr.push({
              id: undefined,
              selfId: selfId,
              phone: undefined
          })
        }
        this.setState({inputArr: this.state.inputArr})
    }
     // 是否收费
     changeRadio = (e) =>{
        this.setState({
            isCharge: e.target.value,
        });
    }
    back=()=>{
        window.history.go(-1)
    }
    updateTrust=()=>{
        if(isBlank(this.state.name)){
            message.warn("请输入托管名称！")
            return
        }
        if((!this.state.enrolStartTime)||(!this.state.enrolEndTime)||(!this.state.trustStartTime)||(!this.state.trustEndTime)){
            message.warn("时间选择不完整！")
            return
        }
        if(this.state.checkedList.length==0){
            message.warn("请选择年级")
            return
        }
        if(this.state.isCharge == 1 && !isCorrectMoney(this.state.fee)){
            message.warn("请输入正确的金额")
            return
        }
        if(this.state.isCharge == 1 && parseFloat(this.state.fee)<=0){
            message.warn("收费金额必须大于零")
            return
        }
        let teacherIdArr=[]
        let phoneArr=[]
        let filterArr= this.state.inputArr.filter(item=>{
            return (!!item.id)&&(!!item.phone)
        })
        if(filterArr.length<1){
            message.warn("托管老师信息填写不完整")
            return
        }
        filterArr&&filterArr.map(item=>{
            teacherIdArr.push(item.id);
            phoneArr.push(item.phone)
        })
        const params={
            "trustId": this.props.match.params.id,
            "isCharge": this.state.isCharge,
            "fee": this.state.fee,
            "name": this.state.name,
            "enrolStartTime": dateToTimestamp(this.state.enrolStartTime),
            "enrolEndTime": dateToTimestamp(this.state.enrolEndTime),
            "trustStartTime": dateToTimestamp(this.state.trustStartTime),
            "trustEndTime": dateToTimestamp(this.state.trustEndTime),
            "gradeId": this.state.checkedList,
            "teacherId": teacherIdArr,
            "phone": phoneArr,
            "description": this.state.description
        }
        this.props.dispatch({
            type:'trustManage/updateTrust',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                   message.success("编辑成功！")
                   setTimeout(() => {
                       window.history.go(-1)
                   }, 2000);
                }
              }
        })
    }
    render(){
        const {teacherList} =this.props;
        const option1 = teacherList&&teacherList.map((item)=>{
          return <Option value={item.personId} key={item.personId}>{item.personName}</Option>
        })
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.placeDel}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.placeDel}>删除</a>
                </Menu.Item>
            </Menu>
          );

        return (
            <div className="content-main content-newTrust content-building content-termManage edit-trust">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/trust-manage"}>学生托管</Link> \ 编辑托管</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Row className="option-wrap">
                        <Row>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;托管名称：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Input placeholder="请输入名称，30字以内" value={this.state.name} style={{ width: 300 }} maxLength={30} onChange={this.nameInput.bind(this)} />
                        </Row>
                        <Row>
                            家长报名时间：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <RangePicker style={{ width: 300 }}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                value={[moment(this.state.enrolStartTime, "YYYY-MM-DD HH:mm")||undefined, moment(this.state.enrolEndTime, "YYYY-MM-DD HH:mm")]}
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChangeRange} />
                        </Row>
                        <Row>
                            托管起止时间：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <RangePicker style={{ width: 300 }}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                value={[moment(this.state.trustStartTime, "YYYY-MM-DD HH:mm")||undefined, moment(this.state.trustEndTime, "YYYY-MM-DD HH:mm")]}
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChangeRange1} />
                        </Row>
                        <Row>
                            <label className="checkbox-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;适用年级：</label>
                            <div className="checkbox-wrap">
                                <Checkbox
                                disabled
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                                >
                                所有年级
                                </Checkbox>
                                <br />
                                <br />
                                <CheckboxGroup disabled options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange1} />
                            </div>
                        </Row>
                        <Row>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否收费：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio.Group onChange={this.changeRadio} value={this.state.isCharge}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Row>
                        { 
                            this.state.isCharge == 1 ? 
                            <Row>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;托管费用：
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Input placeholder="请输入金额" value={this.state.fee} width={100} maxLength={30} onChange={this.feeInput.bind(this)} />&nbsp;&nbsp;&nbsp;&nbsp;元
                            </Row> : null
                         }
                        <Row className="teacher-row">
                            托管老师姓名：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="teacher-box">
                              {this.state.inputArr.map((item)=>{
                                return <div className="teacher-items" key={item.selfId}>
                                            <Select placeholder="请选择老师"
                                                showSearch
                                                value={item.id}
                                                onChange={this.onChange2.bind(this, item.selfId)}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                style={{ width: 200 }} >
                                                {option1}
                                            </Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;托管老师电话：&nbsp;&nbsp;
                                            <Input placeholder="请输入电话" maxLength={11} value={item.phone} onChange={this.onChange3.bind(this, item.selfId)} />&nbsp;&nbsp;&nbsp;&nbsp;
                                            <Icon type="close" onClick={this.deleteLabel.bind(this, item.selfId)} />
                                        </div>
                                })
                                }
                                <Button type="dashed" onClick={this.addLabel.bind(this)} >新增</Button>
                            </div>
                          </Row>
                          <Row>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他说明：
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="teacher-box">
                                <TextArea placeholder="请输入说明，200字以内" value={this.state.description} onChange={this.onChange4.bind(this)} maxLength={200} style={{ width: 300 }} rows={4} />
                            </div>
                          </Row>
                        
                    </Row>
                <div className="btn-group">
                  <Row>
                    <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.updateTrust.bind(this)}>确定</Button>
                 
                  </Row>
                </div>
                   
                </div>
               
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    teacherList: state.trustManage.teacherList
  }
}

export default connect(mapStateToProps)(Form.create()(EditTrust));
