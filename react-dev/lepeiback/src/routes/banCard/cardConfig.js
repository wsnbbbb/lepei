import React,{Component} from 'react';
import { connect } from 'dva';
import {  Button, TimePicker, Checkbox , Form, Row, Radio ,Modal,message,DatePicker } from 'antd';
import {getQueryString, judgeTimeDiffer} from '../../utils/public';
import './style.less';
import moment from 'moment';

const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class CardConfig extends Component{
  constructor(props) {
      super(props);
      this.state = {
        title:"配置",
        data: {},
        selectedRowKeys: [],
        cardInfo: [],
        configData: [
          {
            week:1,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:2,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:3,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:4,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:5,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:6,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          },
          {
            week:7,
            times: [
              ["",""],
              ["",""],
              ["",""],
            ]
          }
        ],
        selectweek: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false
        },
        modelSetData:[
          { 
            attendType:1,
            times: ["",""],
          },
          { 
            attendType:1,
            times: ["",""],
          },
          { 
            attendType:1,
            times: ["",""],
          },
          { 
            attendType:1,
            times: ["",""],
          },
          { 
            attendType:1,
            times: ["",""],
          },
        ]
      };
  }
  componentDidMount=()=>{
    const params={
      "ids": getQueryString("id")
    }
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/card-list"
      },
    })
    this.getCardInfo(params)
  }

  componentWillUnmount = () => {
    sessionStorage.removeItem("qiniuToken");
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })
      
  }
  getCardInfo=(params)=>{
    this.props.dispatch({
      type:'banCard/getCardInfo',
      payload:params,
      callback: res=>{
        let arr = []
        res.data&&res.data.map(item=>{
          arr.push({
            name: item.devSn + ' ' + item.appVersion + ' ' + (item.type==1?"横版":"竖版")
          })
        })
        this.setState({
          cardInfo: arr,
        })
        if(res.data.length === 1){
          let newData = this.state.configData
          let newDataSelect = this.state.selectweek
          res.data[0].timeSections.map(item=>{
              newData.map(i=>{
                if(item.week==i.week){
                  i.times[0] = item.times[0]||["",""]
                  i.times[1] = item.times[1]||["",""]
                  i.times[2] = item.times[2]||["",""]
                  if(item.times[0]&&item.times[0][0]&&item.times[0][1]){
                    newDataSelect[i.week] = true
                  }
                }
              })
          })
          this.setState({
            configData: newData,
            selectweek: newDataSelect,
            modelSetData: res.data[0].inOutSchoolTimes.length > 0 ? res.data[0].inOutSchoolTimes : this.state.modelSetData
          })
        }
        // console.log(this.state.configData)
      }
    })
  }

  onChange=(week, e)=> {
    // console.log(`checked = ${e.target.checked}`);
    week = week.toString()
    let newData = this.state.selectweek
    newData[week]= e.target.checked
    this.setState({
      selectweek: newData
    })
  }
  // 开关机时间选择
  onChange1=(index1, index2, index3, time, timeString)=> {
    // console.log(time, timeString);
    this.state.configData[index1].times[index2][index3] = timeString
    this.setState({
      configData: this.state.configData
    })
    // console.log(this.state.configData)
  }
  
  
  // 进出校时间选择
  changeTime = (index1, index2, time, timeString) => {
    console.log(time, timeString);
    let newArr = this.state.modelSetData
    newArr[index1].times[index2] = timeString
    this.setState({
      modelSetData: newArr
    })
  }

  // 入园离园状态选择
  changeStatus = (index,e) =>{
    console.log(e.target.value);
    let newArr = this.state.modelSetData
    newArr[index].attendType = e.target.value
    this.setState({
      modelSetData: newArr
    })
    console.log(this.state.modelSetData);
  }

  // 保存
  save = ()=>{
    let timeSections = []
    let check = true 
    let checkAll = true
    let check1 = true 
    let checkAll1 = true
    let checkTime = true
    let startTimeArr = [];  
    let endTimeArr = [];
    let flag = true
    // 自动开关机时间条件验证
    this.state.configData.map((item, index)=>{
      let obj = {}
      obj.week = item.week
      let timesArr = []
      if(item.times[0][1]&&item.times[1][0]){
        if(item.times[0][1]>item.times[1][0]){
          // debugger
        }
      }
      item.times.map(i=>{
        if(i[0]&&i[1]){
          if(i[0]>i[1]){
            check = false
          }else{
            timesArr.push(i)
          }
        }
        if(i[0]||i[1]){
          if(!(i[0]&&i[1])){
            checkAll = false
          }
        }
      })
      if(!judgeTimeDiffer(item.times[0][1], item.times[1][0])||!judgeTimeDiffer(item.times[1][1], item.times[2][0])||!judgeTimeDiffer(item.times[0][1], item.times[2][0])){
        checkTime = false
      }
      obj.times = timesArr
      if(index==0&&this.state.selectweek["1"]){
        timeSections.push(obj)
      }else if(index==1&&this.state.selectweek["2"]){
        timeSections.push(obj)
      }else if(index==2&&this.state.selectweek["3"]){
        timeSections.push(obj)
      }else if(index==3&&this.state.selectweek["4"]){
        timeSections.push(obj)
      }else if(index==4&&this.state.selectweek["5"]){
        timeSections.push(obj)
      }else if(index==5&&this.state.selectweek["6"]){
        timeSections.push(obj)
      }else if(index==6&&this.state.selectweek["7"]){
        timeSections.push(obj)
      }
    })
    // 模式设置条件验证
    this.state.modelSetData.map(item =>{
      startTimeArr.push(item.times[0])
      endTimeArr.push(item.times[1])
      if(item.times[0] && item.times[1] && item.times[0] > item.times[1]){
        check1 = false
      }
      if(item.times[0] || item.times[1]){
        if(!(item.times[0] && item.times[1])){
          checkAll1 = false
        }
      }
    })
    let begin = startTimeArr.sort();
    let end = endTimeArr.sort();
    for(let i = 1; i < begin.length; i++){
      if(begin[i] < end[i-1]){
        flag = false
      }
    }
    if(!checkAll){
      return message.error('自动开关机设置，时间段必须成对出现',2)
    }
    if(!check){
      return message.error('自动开关机设置，开始时间不能大于结束时间',2)
    }
    if(!checkTime){
      return message.error('自动开关机设置，时间间隔必须大于20分钟',2)
    }
    // if(timeSections.length == 0){
    //   return message.error('自动开关机设置，请至少配置一天的数据',2)
    // }
    if(!checkAll1){
      return message.error('模式设置，时间段必须成对出现',2)
    }
    if(!check1){
      return message.error('模式设置，开始时间不能大于结束时间',2)
    }
    if(!flag){
      return message.error('模式设置时间有重叠,请检查!!');
    }
   
    let params = {
      ids: getQueryString("id").split(","),
      timeSections: timeSections,
      inOutSchoolTimes:this.state.modelSetData
    }
    console.log({params});
    this.props.dispatch({
      type:'banCard/setTimeSections',
      payload:params,
      callback: res=>{
        if(res.code ==200){
          message.success("保存成功",2)
          window.history.go(-1)
        }
      }
    })
  }

  // 返回
  cancel = ()=>{
    window.history.go(-1)
  }

  render(){
    console.log("render")
    const { configData, selectweek,modelSetData } = this.state;
    return (
      <div className="content-main ban-card">
        <h3>班牌</h3>
        <div className="card-list">
          {
            this.state.cardInfo.map((item, index)=>{
              return <span key={index} className="card-tag">{item.name}</span>
            })
          }
        </div>
        <h3>自动开关机设置</h3>
        <div className="config-main">
          <Row>
            <Checkbox onChange={this.onChange.bind(this,1)} checked={selectweek["1"]}>星期一</Checkbox>
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,0, 0, 0)} value={configData[0].times[0][0]?moment(configData[0].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,0, 0, 1)} value={configData[0].times[0][1]?moment(configData[0].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,0, 1, 0)} value={configData[0].times[1][0]?moment(configData[0].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,0, 1, 1)} value={configData[0].times[1][1]?moment(configData[0].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,0, 2, 0)} value={configData[0].times[2][0]?moment(configData[0].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["1"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,0, 2, 1)} value={configData[0].times[2][1]?moment(configData[0].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,2)} checked={selectweek["2"]}>星期二</Checkbox>
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,1, 0, 0)} value={configData[1].times[0][0]?moment(configData[1].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,1, 0, 1)} value={configData[1].times[0][1]?moment(configData[1].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,1, 1, 0)} value={configData[1].times[1][0]?moment(configData[1].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,1, 1, 1)} value={configData[1].times[1][1]?moment(configData[1].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this,1, 2, 0)} value={configData[1].times[2][0]?moment(configData[1].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["2"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this,1, 2, 1)} value={configData[1].times[2][1]?moment(configData[1].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,3)} checked={selectweek["3"]}>星期三</Checkbox>
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 2, 0, 0)} value={configData[2].times[0][0]?moment(configData[2].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 2, 0, 1)} value={configData[2].times[0][1]?moment(configData[2].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 2, 1, 0)} value={configData[2].times[1][0]?moment(configData[2].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 2, 1, 1)} value={configData[2].times[1][1]?moment(configData[2].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 2, 2, 0)} value={configData[2].times[2][0]?moment(configData[2].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["3"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 2, 2, 1)} value={configData[2].times[2][1]?moment(configData[2].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,4)} checked={selectweek["4"]}>星期四</Checkbox>
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 3, 0, 0)} value={configData[3].times[0][0]?moment(configData[3].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 3, 0, 1)} value={configData[3].times[0][1]?moment(configData[3].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 3, 1, 0)} value={configData[3].times[1][0]?moment(configData[3].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 3, 1, 1)} value={configData[3].times[1][1]?moment(configData[3].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 3, 2, 0)} value={configData[3].times[2][0]?moment(configData[3].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["4"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 3, 2, 1)} value={configData[3].times[2][1]?moment(configData[3].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,5)} checked={selectweek["5"]}>星期五</Checkbox>
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 4, 0, 0)} value={configData[4].times[0][0]?moment(configData[4].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 4, 0, 1)} value={configData[4].times[0][1]?moment(configData[4].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 4, 1, 0)} value={configData[4].times[1][0]?moment(configData[4].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 4, 1, 1)} value={configData[4].times[1][1]?moment(configData[4].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 4, 2, 0)} value={configData[4].times[2][0]?moment(configData[4].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["5"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 4, 2, 1)} value={configData[4].times[2][1]?moment(configData[4].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,6)} checked={selectweek["6"]}>星期六</Checkbox>
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 5, 0, 0)} value={configData[5].times[0][0]?moment(configData[5].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 5, 0, 1)} value={configData[5].times[0][1]?moment(configData[5].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 5, 1, 0)} value={configData[5].times[1][0]?moment(configData[5].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 5, 1, 1)} value={configData[5].times[1][1]?moment(configData[5].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 5, 2, 0)} value={configData[5].times[2][0]?moment(configData[5].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["6"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 5, 2, 1)} value={configData[5].times[2][1]?moment(configData[5].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
          <Row>
            <Checkbox onChange={this.onChange.bind(this,7)} checked={selectweek["7"]}>星期日</Checkbox>
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 6, 0, 0)} value={configData[6].times[0][0]?moment(configData[6].times[0][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 6, 0, 1)} value={configData[6].times[0][1]?moment(configData[6].times[0][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 6, 1, 0)} value={configData[6].times[1][0]?moment(configData[6].times[1][0], 'HH:mm:ss'): undefined} />-&nbsp;
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 6, 1, 1)} value={configData[6].times[1][1]?moment(configData[6].times[1][1], 'HH:mm:ss'): undefined} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="开始时间" onChange={this.onChange1.bind(this, 6, 2, 0)} value={configData[6].times[2][0]?moment(configData[6].times[2][0], 'HH:mm:ss'): undefined}/>-&nbsp;
            <TimePicker disabled={!selectweek["7"]} style={{width: 110}} placeholder="结束时间" onChange={this.onChange1.bind(this, 6, 2, 1)} value={configData[6].times[2][1]?moment(configData[6].times[2][1], 'HH:mm:ss'): undefined}/>
          </Row>
        </div>
        <h3>模式设置</h3>
        <div className="modelSet">
          <Row>
            <TimePicker style={{width: 110}} placeholder="开始时间" onChange={this.changeTime.bind(this, 0, 0)} value={modelSetData[0].times[0]?moment(modelSetData[0].times[0], 'HH:mm:ss'): undefined} /><span className="line">-</span>
            <TimePicker style={{width: 110}} placeholder="结束时间" onChange={this.changeTime.bind(this, 0, 1)} value={modelSetData[0].times[1]?moment(modelSetData[0].times[1], 'HH:mm:ss'): undefined} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Radio.Group onChange={this.changeStatus.bind(this,0)} value={modelSetData[0].attendType}>
              <Radio value={1}>入园</Radio>
              <Radio value={2}>离园</Radio>
            </Radio.Group>
          </Row>
          <Row>
            <TimePicker style={{width: 110}} placeholder="开始时间" onChange={this.changeTime.bind(this, 1, 0)} value={modelSetData[1].times[0]?moment(modelSetData[1].times[0], 'HH:mm:ss'): undefined} /><span className="line">-</span>
            <TimePicker style={{width: 110}} placeholder="结束时间" onChange={this.changeTime.bind(this, 1, 1)} value={modelSetData[1].times[1]?moment(modelSetData[1].times[1], 'HH:mm:ss'): undefined} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Radio.Group onChange={this.changeStatus.bind(this,1)} value={modelSetData[1].attendType}>
              <Radio value={1}>入园</Radio>
              <Radio value={2}>离园</Radio>
            </Radio.Group>
          </Row>
          <Row>
            <TimePicker style={{width: 110}} placeholder="开始时间" onChange={this.changeTime.bind(this, 2, 0)} value={modelSetData[2].times[0]?moment(modelSetData[2].times[0], 'HH:mm:ss'): undefined} /><span className="line">-</span>
            <TimePicker style={{width: 110}} placeholder="结束时间" onChange={this.changeTime.bind(this, 2, 1)} value={modelSetData[2].times[1]?moment(modelSetData[2].times[1], 'HH:mm:ss'): undefined} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Radio.Group onChange={this.changeStatus.bind(this,2)} value={modelSetData[2].attendType}>
              <Radio value={1}>入园</Radio>
              <Radio value={2}>离园</Radio>
            </Radio.Group>
          </Row>
          <Row>
            <TimePicker style={{width: 110}} placeholder="开始时间" onChange={this.changeTime.bind(this, 3, 0)} value={modelSetData[3].times[0]?moment(modelSetData[3].times[0], 'HH:mm:ss'): undefined} /><span className="line">-</span>
            <TimePicker style={{width: 110}} placeholder="结束时间" onChange={this.changeTime.bind(this, 3, 1)} value={modelSetData[3].times[1]?moment(modelSetData[3].times[1], 'HH:mm:ss'): undefined} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Radio.Group onChange={this.changeStatus.bind(this,3)} value={modelSetData[3].attendType}>
              <Radio value={1}>入园</Radio>
              <Radio value={2}>离园</Radio>
            </Radio.Group>
          </Row>
          <Row>
            <TimePicker style={{width: 110}} placeholder="开始时间" onChange={this.changeTime.bind(this, 4, 0)} value={modelSetData[4].times[0]?moment(modelSetData[4].times[0], 'HH:mm:ss'): undefined} /><span className="line">-</span>
            <TimePicker style={{width: 110}} placeholder="结束时间" onChange={this.changeTime.bind(this, 4, 1)} value={modelSetData[4].times[1]?moment(modelSetData[4].times[1], 'HH:mm:ss'): undefined} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Radio.Group onChange={this.changeStatus.bind(this,4)} value={modelSetData[4].attendType}>
              <Radio value={1}>入园</Radio>
              <Radio value={2}>离园</Radio>
            </Radio.Group>
          </Row>
         
        </div>
        <div className="buttons">
          <Button style={{marginRight:20}} onClick={this.cancel.bind(this)}>返回</Button>
          {
            getQueryString("status")==1? <Button type="primary"  onClick={this.save.bind(this)}>确定</Button>:""
          }
              
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(CardConfig));
