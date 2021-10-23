import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Radio,DatePicker  } from 'antd';
import echarts from 'echarts';
import './style.less';
import { updateItemScore } from '../../services';
import { log } from 'util';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class TrainCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          size:6,
          startDate:'',
          endDate:''
        };
    }
    componentDidMount=()=>{
      const params={
        "quickSearch":this.state.size,
        "startDate":"",
        "endDate":""
      }
      const pieParams={
        "quickSearch":this.state.size,
        "startDate":"","endDate":""
      }
      this.getBarData(params);
      this.getPieData(pieParams);
    }
    // 获取柱状图
    getBarData=(params)=>{
      this.props.dispatch({
        type:'train/getBarData',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            let xData=[];let yData=[];
            res.data&&res.data.length>0&&res.data.map(item=>{
              xData.push(item.time);
              yData.push(item.count)
            })
            const myChart = echarts.init(document.getElementById('barCharts'));
            myChart.setOption({
              title: {
                  text: '外出培训（人次）'
              },
              color: ['#3398DB'],
              tooltip: {},
              xAxis: {
                  data: xData,
                  axisTick: {
                    alignWithLabel: true
                  }
              },
              yAxis: {},
              series: [{
                  name: '培训次数',
                  type: 'bar',
                  barWidth: '12%',
                  data: yData
              }]
            });
          }
          
        }
      })
    }
    // 获取饼状图
    getPieData=(params)=>{
      this.props.dispatch({
        type:'train/getPieData',
        payload:params,
        callback:(res)=>{
          console.log({res})
          if(res.code===200){
            let pieDatas=[];
            let allCount = 0
            res.data&&res.data.length>0&&res.data.map(item=>{
              pieDatas.push({value:item.count,name:item.levelName})
              allCount += Number(item.count)
            })
            console.log({allCount});
            const myChart = echarts.init(document.getElementById('pieCharts'));
            myChart.setOption({
              title: [{
                  text: '培训类别占比（次）'
                },
                {
                  text: '参培总人次',
                  subtext:allCount,
                  textStyle:{
                      fontSize:16,
                      color:"#A9A9A9"
                  },
                  subtextStyle: {
                    fontSize: 20,
                    color: 'black'
                  },
                  textAlign:"center",
                  x: '50%',
                  y: '44%',
                }
              ],
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}次 ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'right',
                  y:'center',
                  data: ['国家级', '省级', '市级', '区县级', '校级','其他'],
                icon:"circle",
                formatter:function(name){
                  let target;
                  res.data&&res.data.map(item =>{
                    if(item.levelName == name){
                      target = item.count
                    }
                    console.log({target});
                    
                  })
                  
                  let arr=[name+'  ' +target]
                  return arr.join("\n")

                },
              },
              
              series: [
                  {
                      name:'类别占比',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      data:pieDatas
                  }
              ]
            })
          }
        }
      })
    }
    // 查询
    chartSearch=()=>{
      const {startDate,endDate} = this.state;
      const params={
        "quickSearch":this.state.size==9?'':this.state.size,"startDate":startDate||"","endDate":endDate||""
      }
      // const pieParams={
      //   "startDate":startDate||"","endDate":endDate||""
      // }
      this.getBarData(params);
      this.getPieData(params);
    }
    handleSizeChange=(e)=>{
      this.setState({size:e.target.value})
      const params={
        "quickSearch":e.target.value,
        "startDate":this.state.startTime,
        "endDate":this.state.endTime
      }
      if(e.target.value!=9){
        this.getBarData(params);
        this.getPieData(params);
        this.setState({startDate:'',endDate:''})
      }
    }
    onTimeChange=(date, dateString)=> {
      
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
      })
    }
    render(){
        const {size} = this.state;
        return (
            <div className="content-main">
                <Form className="content-form">
                    <Row gutter={24}>
                        <Col span={10}>
                        <Radio.Group  value={size} onChange={this.handleSizeChange}>
                            <Radio.Button value={6}>近一周</Radio.Button>
                            <Radio.Button value={7}>近一月</Radio.Button>
                            <Radio.Button value={8}>近一年</Radio.Button>
                            <Radio.Button value={9}>自定义时间</Radio.Button>
                        </Radio.Group>
                        </Col>
                        {size==9?<Col span={8}>
                            <FormItem label=''>
                            <RangePicker onChange={this.onTimeChange} />
                            </FormItem>
                        </Col>:null} 
                        <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.chartSearch.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>  
                <div id="barCharts" style={{ width: "96%", height: 500 }}></div>     
                <div id="pieCharts" style={{ width: "96%", height: 500 }}></div>      
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(TrainCharts));
