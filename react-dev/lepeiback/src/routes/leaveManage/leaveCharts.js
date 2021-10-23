import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Radio,DatePicker  } from 'antd';
import echarts from 'echarts';
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class LeaveCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          size:'1'
        };
    }
    componentDidMount=()=>{
      const params={
        "selectType":"1","startTime":"","endTime":""
      }
      const pieParams={
        "startTime":"","endTime":""
      }
      this.getBarData(params);
      this.getPieData(pieParams);
    }
    // 获取柱状图
    getBarData=(params)=>{
      this.props.dispatch({
        type:'leave/getLeaveBarData',
        payload:params,
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            let xData=[];let yData=[];
            res.data&&res.data.length>0&&res.data.map(item=>{
              xData.push(item.date);
              yData.push(item.num)
            })
            const myChart = echarts.init(document.getElementById('barCharts'));
            myChart.setOption({
              title: {
                  text: '请假走势（次）'
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
                  name: '次数',
                  type: 'bar',
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
        type:'leave/getLeavePieData',
        payload:params,
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            let pieDatas=[];let names=[]
            res.data&&res.data.length>0&&res.data.map(item=>{
              pieDatas.push({value:item.typeNum,name:item.applyTypeName})
              names.push(item.applyTypeName)
            })
            const myChart = echarts.init(document.getElementById('pieCharts'));
            myChart.setOption({
              title: {
                text: '请假类别占比（次）'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'right',
                  y:'center',
                  data:names
              },
              series: [
                  {
                      name:'类别占比',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      label: {
                          normal: {
                              show: false,
                              position: 'center'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '30',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:pieDatas
                  }
              ]
            })
          }
        }
      })
    }
    // 查询
    search=()=>{
      const {startTime,endTime} = this.state;
      const params={
        "selectType":this.state.size==4?1:this.state.size,"startTime":startTime||"","endTime":endTime||""
      }
      const pieParams={
        "startTime":startTime||"","endTime":endTime||""
      }
      this.getBarData(params);
      this.getPieData(pieParams);
    }
    handleSizeChange=(e)=>{
      
      this.setState({size:e.target.value})
      const params={
        "selectType":e.target.value==4?1:e.target.value,
        // "startTime":this.state.startTime,"endTime":this.state.endTime
      }
      if(e.target.value!=4){
        this.getBarData(params);
        this.setState({startTime:'',endTime:''})
      }
    }
    onTimeChange=(date, dateString)=> {
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {size} = this.state;
        return (
            <div className="leave-main content-main">
                
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                        <Col span={10}>
                          <Radio.Group value={size} onChange={this.handleSizeChange}>
                            <Radio.Button value="1">近一周</Radio.Button>
                            <Radio.Button value="2">近一月</Radio.Button>
                            <Radio.Button value="3">近一年</Radio.Button>
                            <Radio.Button value="4">自定义时间</Radio.Button>
                          </Radio.Group>
                        </Col>
                        {size==4?<Col span={8}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                               <RangePicker onChange={this.onTimeChange} />
                            )}
                            </FormItem>
                        </Col>:null} 
                        <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>    
                <div id="barCharts" style={{ width: "96%", height: 500 }}></div>     
                <div id="pieCharts" style={{ width: "96%", height: 500 }}></div>      
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
export default connect(mapStateToProps)(Form.create()(LeaveCharts));
