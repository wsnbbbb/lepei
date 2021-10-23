import React, { Component } from 'react';
import { routerRedux, Link } from 'dva/router'
import { connect } from 'dva';
import { DatePicker, TimePicker, Button, message, Breadcrumb, Input, Form, Row, Col, Icon, Menu, Dropdown, Pagination } from 'antd';
import './style.less';
import moment from 'moment';
import { getQueryString } from '../../utils/public';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const format = 'HH:mm';

class GradeSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            semesterName: "",
            startDate: "",
            endDate: "",
            dataListIndex: 0,
            dataList: [],
            scheduleTimes: [],
            mode: 'inline',
            theme: 'light',
            gradeId:'',
            title:"分年级设置",
        }
    }


    componentDidMount = () => {
      this.props.dispatch({
        type:'term/getCommonGradeList',
        callback:(res) => {
            if(res.code == 200) {
                this.setState({
                    gradeList:res.data,
                    gradeId:res.data[0].gradeId,
                })
               
            }
            let params = {
                "semesterId": getQueryString('semesterId'),
                "gradeId":res.data[0].gradeId
            }
            this.getSemesterDetail(params)
        }
      })

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

    getSemesterDetail = (params) => {
        this.props.dispatch({
            type: 'term/termDetail',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    this.setState({
                        semesterName: res.data.semesterName,
                        startDate: res.data.startDate,
                        endDate: res.data.endDate,
                        scheduleTimes: res.data.scheduleTimes, 
                    })
                }
            }
        })
    }
   
    // 时间选择
    onChange = (time, timeString,id, index, type) => {
        console.log({id});
        console.log({index});
        this.state.scheduleTimes.map((item,idx) => {
            console.log({idx});
            item.times.map(val =>{
                if(idx == id){
                    if (val.week == index) {
                        if (type == 1) {
                            val.start = timeString;
                            this.setState({
                                start:timeString
                            })
                        } else if(type == 2) {
                            val.end = timeString;
                            this.setState({
                                end:timeString
                            })
                        }
                    }
                    return val;
                }
            })
        })
        console.log("111",this.state.scheduleTimes);
        
    }
   
    // 保存
    saveGradeSet = () => {
        // console.log(this.state.scheduleTimes);
        let flag = true;
        this.state.scheduleTimes.map(item =>{
            item.times.map(val =>{
                if(val.start == null||''){
                    flag = false;
                }
                if(val.end == null||''){
                    flag = false;
                }
            })
        })
        if(!flag){
            return message.error("上课时间不能为空！")
        }
        let that = this
        const params = {
            "semesterId": getQueryString('semesterId'),
            "gradeId":this.state.gradeId,
            "name": this.state.semesterName,
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
            "scheduleTime": this.state.scheduleTimes
        }
        that.props.dispatch({
            type: 'term/updateTerm',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("设置成功！")
                    const params = {
                        "semesterId": getQueryString('semesterId'),
                        "gradeId": that.state.gradeId
                    }
                    that.getSemesterDetail(params)
                }
            }
        })
    }

    // 删除
    delClass = (id, e) => {
        console.log({id});
        let newArr =  this.state.scheduleTimes.filter((elem, i) =>{
            return id !== elem.sectionId
        })
        this.setState({
            scheduleTimes:newArr
        })
        message.success('删除成功');
    }

    // 据年级设置
    clickGrade = (id) =>{
      this.setState({gradeId:id})
      const params = {
        "semesterId":getQueryString('semesterId'),
        "gradeId":id
      }
      this.getSemesterDetail(params)
      console.log(this.state.scheduleTimes);
      
    }
    render() {
        const { gradeList,scheduleTimes } = this.state;
        // const { gradeList } = this.props;
        // console.log({gradeList});
        return (
            <div className="content-main content-building grade-set">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/term-manage"}>学期管理</Link> \ 分年级设置</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Row className="option-wrap">
                        <Row style={{marginBottom:"15px"}}>
                            学期名称 <span className="color-red">*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Input placeholder="学期名称" value={this.state.semesterName} disabled/>
                            
                        </Row>
                        <Row>
                            起止时间 <span className="color-red">*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <RangePicker value={[this.state.startDate ? moment(this.state.startDate, dateFormat) : "", this.state.endDate ? moment(this.state.endDate, dateFormat) : ""]}
                                format={dateFormat} disabled/>
                        </Row>
                    </Row>
                      <div className="grad-schedule">
                        <div className="left">
                          <Menu
                            selectedKeys={[this.state.gradeId]}
                            mode={this.state.mode}
                            theme={this.state.theme} 
                          >
                            {
                              gradeList&&gradeList.map(item =>{
                              return <Menu.Item key={item.gradeId} onClick={this.clickGrade.bind(this,item.gradeId)}>{item.gradeName}</Menu.Item>
                              })
                            }
                          </Menu>
                        </div>
                        <table className="table tableBox" border="1">
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
                                              <Input placeholder="请输入节次" value={item.sectionName} style={{ width: "150px" }} disabled/>
                                            </td>
                                            {
                                              item.times && item.times.map((obj) => {
                                                  return <td key={obj.week}>
                                                      <TimePicker onChange={(time, timeString) => { this.onChange(time, timeString,index,obj.week,1) }} value={obj.start!=''? moment(obj.start, format): this.state.start} format={format} /><br/>
                                                      <TimePicker onChange={(time, timeString) => { this.onChange(time, timeString,index,obj.week,2) }} value={obj.end!=''? moment(obj.end, format): this.state.end} format={format} />
                                                  </td>
                                              })
                                            }
                                            <td className="operate">
                                              <a href="javascript:;" onClick={this.delClass.bind(this,item.sectionId)}>删除</a>
                                            </td>
                                        </tr>
                                    })
                                }

                            </tbody>
                        </table>
                      </div>
                      <div style={{width:"100%"}}>
                        <Button type="primary" style={{marginLeft:"50%"}} onClick={this.saveGradeSet.bind(this)}>保存</Button>
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
    //   gradeList:state.user.commonGradeData,
    }
}

export default connect(mapStateToProps)(Form.create()(GradeSet));
