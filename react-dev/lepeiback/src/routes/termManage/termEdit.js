import React,{Component} from 'react';
import { routerRedux, Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Modal, InputNumber,DatePicker,TimePicker ,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import moment from 'moment';
import {isBlank} from '../../utils/public';
const { RangePicker } = DatePicker;
const format = 'HH:mm';
const dateFormat = 'YYYY/MM/DD';

class TermEdit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            semesterName:"",
            startDate:"",
            endDate:"",
            dataListIndex:2,
            scheduleTimes:[],
            title:'学期编辑'
        }
    }
  

    componentDidMount=()=>{
      console.log(this.props.match.params.semesterId)
      const params={
          "semesterId": this.props.match.params.semesterId
      }
      this.getSemesterDetail(params)
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/term-manage"
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
    // 获取详情
    getSemesterDetail=(params)=>{
      this.props.dispatch({
        type:'term/termDetail',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              scheduleTimes: res.data.scheduleTimes,
              semesterName: res.data.semesterName,
              dataListIndex: res.data.scheduleTimes.length + 1,
              startDate: res.data.startDate,
              endDate: res.data.endDate
            })
          }
        }
      })
    }

    // 学期名称
    nameInput=(e)=>{
        this.setState({
            semesterName: e.target.value
        })
    }

    // 起止时间
    onChangeRange=(date, dateString)=>{
        // console.log(date, dateString)
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        })
    }

    // 时间选择
    onChange = (time, timeString,id, index, type) => {
        console.log(time, timeString, index, type);
        this.state.scheduleTimes.map((item,idx) => {
            item.times.map(val =>{
                if(idx == id){
                    if (val.week == index) {
                        if (type == 1) {
                            val.start = timeString;
                        } else if(type == 2) {
                            val.end = timeString;
                        }
                    }
                    return val;
                }
            })
        })
    }
   
    // 节次
    inputChange = (e,id) => {
        let newList = this.state.scheduleTimes.map((val,index) => {
            if(index == id){
                val.sectionName = e.target.value;
            }
            return val;
        })
        this.setState({ scheduleTimes: newList })
    }
    // 保存
    saveTerm = () => {
        // console.log(this.state.scheduleTimes);
        let flag = true;
        let flag1 = true;
        this.state.scheduleTimes.map(item =>{
            if(item.times[0].start == '' || item.times[0].end == ''){
                flag = false;
            }
            if(item.sectionName == ''){
                flag1 = false;
            }
        })
        if(!flag1){
            return message.error("节次名称不能为空！")
        }
        if(!flag){
            return message.error("请将星期一的上课时间填写完整！")
        }
        
        if (isBlank(this.state.semesterName)) {
            message.error("学期名字不能为空!")
            return
        }
        if (isBlank(this.state.startDate) || isBlank(this.state.endDate)) {
            message.error("学期起止日期不能为空!")
            return 
        }
        const params = {
            "semesterId":this.props.match.params.semesterId,
            "name": this.state.semesterName,
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
            "scheduleTime": this.state.scheduleTimes
        }
        this.props.dispatch({
            type: 'term/updateTerm',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("编辑学期成功！")
                    setTimeout(() => {
                        window.history.go(-1)
                      }, 1000);
                }
            }
        })
    }
   
    // 添加
    addClass = () => {
        let val = this.state.scheduleTimes;
        this.setState({ dataListIndex: this.state.dataListIndex + 1 })
        this.setState({
            scheduleTimes: [...val, {
                sectionName:'',
                times:[
                    {
                        week:"1",
                        start:'',
                        end:''
                    },
                    {
                        week:"2",
                        start:'',
                        end:''
                    },
                    {
                        week:"3",
                        start:'',
                        end:''
                    },
                    {
                        week:"4",
                        start:'',
                        end:''
                    },
                    {
                        week:"5",
                        start:'',
                        end:''
                    },
                    {
                        week:"6",
                        start:'',
                        end:''
                    },
                    {
                        week:"7",
                        start:'',
                        end:''
                    },
                ]
            }]
        })
    }

    // 删除
    delClass = (id, e) => {
        this.setState({
            scheduleTimes: this.state.scheduleTimes.filter((elem, i) => id !== i)
        })
        message.success('删除成功');
    }
 
    render(){
        const { scheduleTimes } = this.state;
      
        return (
            <div className="content-main content-building content-newTerm">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/term-manage"}>学期管理</Link> \ 编辑学期</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Row className="option-wrap">
                        <Row>
                            学期名称 <span className="color-red">*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Input placeholder="学期名称" value={this.state.semesterName} onChange={this.nameInput.bind(this)} />
                            <Button type="primary save-term" onClick={this.saveTerm.bind(this)}>保存</Button>
                        </Row>
                        <Row>
                            起止时间 <span className="color-red">*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <RangePicker onChange={this.onChangeRange} value={[this.state.startDate?moment(this.state.startDate, dateFormat):"", this.state.endDate?moment(this.state.endDate, dateFormat):""]}
                            format={dateFormat}/>
                        </Row>
                    </Row>
                    <p className="title">课表结构</p>
                    <table className="table" border="1">
                        <thead>
                            <tr>
                                <th>节次</th>
                                <th>星期一</th>
                                <th>星期二</th>
                                <th>星期三</th>
                                <th>星期四</th>
                                <th>星期五</th>
                                <th>星期六</th>
                                <th>星期日</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                scheduleTimes && scheduleTimes.map((item,index) => {
                                    return <tr key={index}>
                                        <td>
                                            <Input placeholder="请输入节次" value={item.sectionName} onChange={e => this.inputChange(e,index)} style={{ width: "150px" }} />
                                        </td>
                                        {
                                            item.times && item.times.map((obj) => {
                                                return <td key={obj.week}>
                                                    <TimePicker onChange={(time, timeString) => { this.onChange(time, timeString,index,obj.week,1) }} defaultValue={obj.start!=''? moment(obj.start, format): undefined} format={format} /><br/>
                                                    <TimePicker onChange={(time, timeString) => { this.onChange(time, timeString,index,obj.week,2) }} defaultValue={obj.end!=''? moment(obj.end, format): undefined} format={format} />
                                                </td>
                                            })
                                        }
                                        <td className="operate">
                                            <a href="javascript:;" onClick={this.delClass.bind(this,index)}>删除</a>
                                        </td>
                                    </tr>
                                })
                            }
                            
                        </tbody>
                    </table>
                    <Row>
                        <a href="javascript:;" className="add-btn" onClick={this.addClass.bind(this)}>&nbsp;&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;&nbsp;&nbsp;添加</a>
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
     
  }
}

export default connect(mapStateToProps)(Form.create()(TermEdit));
