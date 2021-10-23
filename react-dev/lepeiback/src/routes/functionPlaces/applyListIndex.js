import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from "dva/router";
import { Tabs,Button,Input,Select,Breadcrumb, Form,Col,Row,DatePicker,Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import { getDays,getAllDays,formatDate, dateToTimestamp, toTimestamp, getDateData,toDecimal2, getQueryString,defaultDate,getMonthDays } from '../../utils/public';
import echarts from 'echarts';
import FunctionPlaceApplyList from './functionPlaceApplyList'

import PageIndex from '../../components/page';
import moment from 'moment';
import "./style.less";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;
const Step = Steps.Step;

class applyListIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabData:'1',
            size: '4',
            page:1,
            prePage:20,
            sort: '1',
            singleClassScore: {},
            isFirst: true
        };
    }
    componentDidMount=()=>{
        const key=getQueryString("key")
        if(key){
            this.setState({tabData:key})
        }
        var now = new Date();                    //当前日期      
        var nowDay = now.getDate();              //当前日     
        var nowMonth = now.getMonth();           //当前月     
        var nowYear = now.getFullYear();             //当前年 
        if(this.state.size==1){ //今日
            const startData=new Date(nowYear, nowMonth, nowDay)
            const endData= new Date(nowYear, nowMonth, nowDay)
            this.setState({startDate:defaultDate(startData),endDate:defaultDate(endData)})
        }
    }

    tabChange=(value)=>{
        this.setState({tabData: value})
        if(value == 2&&this.state.isFirst){
            const params={
                "quickSearch": 4,
            }
            this.getBarData(params);
            this.getApplicantStatistics(params);
            this.setState({
                isFirst: false
            })
        }
    }
    // 获取柱状图
    getBarData = (params)=>{
        this.props.dispatch({
          type: 'functionPlaces/getPlaceStatistics',
          payload: params,
          callback: (res)=>{
            if(res.code===200){
              let xData=[];let yData=[];
              res.data&&res.data.length>0&&res.data.map(item=>{
                  xData.push(item.placeName);
                  yData.push(item.count)
              })

              const myChart = echarts.init(document.getElementById('barCharts'));
              myChart.setOption({
                title: {
                    text: ''
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

    getApplicantStatistics=(params)=>{
        this.props.dispatch({
          type:"functionPlaces/getApplicantStatistics",
          payload:{"page":this.state.page,"prePage":this.state.prePage,...params},
          callback: res=>{
              if(res.code == 200){
                  this.setState({
                      statisticsList: res.data
                  })
              }
          }
        })
    }
    // 查询
    search=()=>{
        const {startDate,endDate,size,sort} = this.state;
        this.props.form.validateFields((err, values) => {
          const params={
            "quickSearch":size==7?0:size,
            "startTime": startDate||'',"endTime":endDate||''
          }
          this.getBarData(params,sort);
          this.getApplicantStatistics({"page":1,"prePage":this.state.prePage,...params})
          this.setState({page:1})
        })
    }

  
    handleSizeChange=(e)=>{
        this.setState({size:e.target.value})
        this.props.form.validateFields((err, values) => {
          const params={
            "quickSearch":e.target.value==7?0:e.target.value
            // "startDate":this.state.startDate||'',"endDate":this.state.endDate||""
          }
          if(e.target.value!=7){
            this.getBarData(params, this.state.sort);
            this.getApplicantStatistics({"page":1,"prePage": this.state.prePage,...params})
            this.setState({page:1,startDate:'',endDate:''})
          }
        })
        var now = new Date();                    //当前日期     
        var nowDayOfWeek = now.getDay()==0?7:now.getDay()-1;         //今天本周的第几天     
        var nowDay = now.getDate();              //当前日     
        var nowMonth = now.getMonth();           //当前月     
        var nowYear = now.getYear();             //当前年     
        nowYear += (nowYear < 2000) ? 1900 : 0;  //    
        console.log( nowDay , nowDayOfWeek)
        var lastMonthDate = new Date();  //上月日期  
        lastMonthDate.setDate(1);  
        lastMonthDate.setMonth(lastMonthDate.getMonth()-1);  
        var lastYear = lastMonthDate.getYear();  
        var lastMonth = lastMonthDate.getMonth();  
        let startData;let endData;
        if(e.target.value==1){ //今日
            startData=new Date(nowYear, nowMonth, nowDay)
            endData= new Date(nowYear, nowMonth, nowDay)
        }else if(e.target.value==2){ //本周
            startData=new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
            endData= new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
        }else if(e.target.value==4){
            startData = new Date(nowYear, nowMonth, 1);     
            endData = new Date(nowYear, nowMonth, nowDay);  
        }else if(e.target.value==3){ //上周
            startData=new Date(nowYear, nowMonth, nowDay - nowDayOfWeek-7)
            endData= new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)-7) 
        }else if(e.target.value==5){ //上月
            startData = new Date(nowYear, lastMonth, 1);  
            endData = new Date(nowYear, lastMonth, getMonthDays(nowYear,lastMonth)); 
        }
        if(e.target.value!=7){
            // this.setState({startDate: defaultDate(startData), endDate: defaultDate(endData)})
        }
    }
    onTimeChange=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startDate: toTimestamp(dateString[0], true),
          endDate: toTimestamp(dateString[1]),
        })
        debugger
    }
    // 分页
    onPageChange=(current,size)=>{
        this.props.form.validateFields((err, values) => {
          this.setState({page:current,prePage:size})
          const params={
            "page":current,
            "prePage":size,
            "quickSearch":this.state.size==7?0:this.state.size,
            "startTime":this.state.startDate||"","endTime":this.state.endDate||""
          }
          this.getClassScoreData(params)
        })
    }



    render(){
        const { statisticsList } = this.state;
        const { getFieldDecorator } = this.props.form;
        const {size} = this.state;
 
        const columns = [{
            title: '排序',
            dataIndex: 'rank',
            key:'rank'
        }, {
            title: '申请人',
            dataIndex: 'applicant',
            key:'applicant'
        }, {
            title: '次数',
            dataIndex: 'count',
            key:'className'
        }];

        const {classScoreLog} = this.props;
        const {tabData} = this.state;
        
        let steps=[];
        classScoreLog&&classScoreLog.dataList.length>0&&classScoreLog.dataList.map(item=>{
            return steps.push(<Step description={<span>{item.examiner}&nbsp;&nbsp;{item.score}&nbsp;&nbsp;{item.source==1?"app":(item.source==2?"电子班牌":(item.source==3?"Pad":(item.source==4?"学校后台":"")))}&nbsp;&nbsp;{formatDate(item.createTime)}</span>}/>)
        })
        return (
            <div className="score-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>功能室申请</Breadcrumb.Item>
                        <Breadcrumb.Item>功能室申请记录</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>功能室申请记录</h3>
                </div> */}

              <Tabs defaultActiveKey='1' activeKey={tabData} onChange={this.tabChange}>
                    <TabPane tab="申请记录" key="1">
                        <FunctionPlaceApplyList />
                    </TabPane>

                  <TabPane tab="统计" key="2">
                    <div className="socre-main content-main">
                            <Form className="ant-advanced-search-form content-form">
                                <Row gutter={24}>
                                    <Col span={9}>
                                        <FormItem label=''>
                                            {getFieldDecorator('size',{initialValue:size})(
                                                <Radio.Group onChange={this.handleSizeChange}>
                                                    <Radio.Button value="2">近一周</Radio.Button>
                                                    <Radio.Button value="4">近一月</Radio.Button>
                                                    <Radio.Button value="8">近一年</Radio.Button>
                                                    <Radio.Button value="7">自定义时间</Radio.Button>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {size==7?<Col span={5}>
                                        <FormItem label=''>
                                        {getFieldDecorator('date')(
                                        <RangePicker onChange={this.onTimeChange} />
                                        )}
                                        </FormItem>
                                    </Col> :null}

                                    <Col span={2}>
                                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <h2 className="apply-name">功能室使用次数（次）</h2>
                            <div className="chart-main">
                                <div id="barCharts" style={{ width: "95%", height: 500, display:"inline-block" }}></div>     
                                <div className="apply-main">
                                    <h2 className="apply-name">功能室申请次数</h2>
                                    <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={statisticsList&&statisticsList.dataList} pagination={false}/>
                                    <PageIndex getPage={this.onPageChange.bind(this)} total={statisticsList&&statisticsList.totalCount} totalPage={statisticsList&&statisticsList.totalPage} currentPage={statisticsList&&statisticsList.currentPage}/>
                                </div>
                            </div>  
                        </div>
                    </TabPane>
              </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(applyListIndex));
