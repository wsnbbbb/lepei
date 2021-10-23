import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,DatePicker,Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import { getDays,getAllDays,formatDate, getDateData,toDecimal2, getQueryString,defaultDate,getMonthDays } from '../../utils/public';
import echarts from 'echarts';
import PageIndex from '../../components/page';
import {portUrl} from '../../utils/img';
import moment from 'moment';
import "./style.less";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;
const Step = Steps.Step;

class SwipeCards extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabData:'1',
            size:'2',
            page:1,
            prePage:20,
            sort:'1',
            classDisabled:true,
            classValue:'',
            gradeId:'',
        };
    }
    componentDidMount=()=>{
        
        // 初始化图表
        const params={
            "quickSearch":this.state.size
        }
        this.getBarData(params,this.state.sort);//获取柱状图
        this.getSwipeCardList(params); //获取考评统计列表
        this.props.dispatch({ //获取所有年级
            type:'user/getCommonGradeList',
        })
        const key=getQueryString("key")
        if(key){
            this.setState({tabData:key})
        }
        var now = new Date();                    //当前日期      
        var nowDay = now.getDate();              //当前日     
        var nowMonth = now.getMonth();           //当前月     
        var nowYear = now.getFullYear();             //当前年 
        var nowDayOfWeek = now.getDay()==0?6:now.getDay()-1;         //今天本周的第几天     
        if(this.state.size==2){ //本周
            const startData=new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
            const endData= new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
            this.setState({startDate:defaultDate(startData),endDate:defaultDate(endData)})
        }
    }
    tabChange=(value)=>{
        this.setState({tabData:value})
    }
    // 获取柱状图
    getBarData=(params,id)=>{
        this.props.dispatch({
          type:id==1?'swipeCard/getClassStatistics':'swipeCard/getGradeStatistics',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              let xData=[];let yData=[];
              res.data&&res.data.length>0&&res.data.map(item=>{
                if(id==1){
                  xData.push(item.className);
                  yData.push(item.averageCount)
                }else{
                  xData.push(item.gradeName);
                  yData.push(item.averageCount)
                }
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
                    name: '平均刷卡次数',
                    type: 'bar',
                    data: yData
                }]
              });
            }
            
          }
        })
    }
    // 获取考评统计列表
    getSwipeCardList=(params)=>{
        this.props.dispatch({
          type:"swipeCard/getSwipeCardList",
          payload:{"page":this.state.page,"prePage":this.state.prePage,...params},
        })
    }
    // 查询
    search=()=>{
        const {startDate,endDate,size,sort} = this.state;
        this.props.form.validateFields((err, values) => {
          const params={
            "quickSearch":size==6?0:size,"startDate":startDate||'',"endDate":endDate||''
          }
          this.getBarData(params,sort);
          this.getSwipeCardList({"page":1,"prePage":this.state.prePage,...params})
          this.setState({page:1})
        })
    }
    handleChange=(e)=>{
        this.setState({sort:e.target.value})
        this.props.form.validateFields((err, values) => {
        const params={
            "quickSearch":this.state.size==6?0:this.state.size,
            "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getBarData(params,e.target.value)
        })
    }    
  
    handleSizeChange=(e)=>{
        this.setState({size:e.target.value})
        this.props.form.validateFields((err, values) => {
          const params={
            "quickSearch":e.target.value==6?0:e.target.value
            // "startDate":this.state.startDate||'',"endDate":this.state.endDate||""
          }
          if(e.target.value!=6){
            this.getBarData(params,this.state.sort);
            this.getSwipeCardList({"page":1,"prePage":this.state.prePage,...params})
            this.setState({page:1,startDate:'',endDate:''})
          }
        })
        var now = new Date();                    //当前日期     
        var nowDayOfWeek = now.getDay()==0?6:now.getDay()-1;         //今天本周的第几天     
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
        if(e.target.value!=6){
            this.setState({startDate:defaultDate(startData),endDate:defaultDate(endData)})
        }
    }
    onTimeChange=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startDate:start,
          endDate:end
        })
    }
    // 分页
    onPageChange=(current,size)=>{
        this.props.form.validateFields((err, values) => {
          this.setState({page:current,prePage:size})
          const params={
            "page":current,
            "prePage":size,
            "typeId":values.typeId||'',
            "quickSearch":this.state.size==6?0:this.state.size,
            "startDate":this.state.startDate||"","endDate":this.state.endDate||""
          }
          this.getSwipeCardList(params)
        })
    }
    goToDetail=(record)=>{
        this.setState({
           gradeId:record.gradeId,classValue:record.classId,tabData:'2'
        })
        this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":record.gradeId},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({classValue:record.classId,classDisabled:false})
                }
            }
        })
        const {startDate,endDate} = this.state;
        if(startDate&&endDate){
            this.setState({
                startTime:startDate,endTime:endDate
            })
        }
        const params={
            "gradeId":record.gradeId,
            "classId":record.classId,
            "startDate":startDate||'',
            "endDate":endDate||''
        }
        this.getSwipeCardDetail(params)
    }
// 考评明细tab
    gradeChange=(val)=>{
        if(val){
          this.setState({gradeId:val})
          this.props.dispatch({
            type:'user/getClassName',
            payload:{"gradeId":val},
            callback:(res)=>{
              if(res.code===200){
                this.setState({classValue:'',classDisabled:false})
              }
            }
          })
        }else{
          this.setState({classValue:'',classDisabled:true,gradeId:''})
        }
    }
    classChange=(val)=>{
        this.setState({classValue:val})
    }
    onTimeChange2=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startTime:start,
          endTime:end
        })
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!this.state.startTime||!this.state.endTime){
                return message.error("请选择时间",2)
            }
            const params={
                "gradeId":this.state.gradeId,
                "classId":this.state.classValue,
                "startDate":this.state.startTime,
                "endDate":this.state.endTime
            }
            this.getSwipeCardDetail(params)
        })
    }
    getSwipeCardDetail=(params)=>{
        this.props.dispatch({
            type:'swipeCard/getSwipeCardDetail',
            payload:params,
        })
    }
    exportList=()=>{
        const {gradeId,classValue,startTime,endTime} = this.state;
        if(!startTime||!endTime){
            this.setState({exportUrl:''})
            return message.error("请选择时间",2)
        }
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        const gId=gradeId||0;
        const cId=classValue||0;
        let url=portUrl("/manager/student-attend-statistics/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&gradeId="+gId+"&classId="+cId+"&startDate="+startTime+"&endDate="+endTime)
        this.setState({exportUrl:url})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {size,sort,scoreTypeBySemester,scoreChartTypeBySemester,defauleSemesters} = this.state;
        const {swipeCardList,swipeCardDetail} = this.props;
        
        const columns = [{
            title: '班级',
            dataIndex: 'className',
            key:'className'
          }, {
              title: '累积刷卡次数',
              dataIndex: 'totalCount',
              key:'totalCount'
          }, {
            title: '平均刷卡（次/人）',
            dataIndex: 'averageCount',
            key:'averageCount'
          },{
              title: '操作',
              dataIndex: '',
              width:100,
              fixed:'right',
              render:(text, record) => (
                <span className="make-box">
                  <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record)}>查看</a> 
                </span>
              )
        }];
        const columns2 = [{
            title: '姓名',
            dataIndex: 'personName',
            key:'personName'
          }, {
            title: '班级',
            dataIndex: 'className',
            key:'className'
          }, {
              title: '累积刷卡次数',
              dataIndex: 'totalCount',
              key:'totalCount'
          }, {
            title: '平均刷卡（次/天）',
            dataIndex: 'averageCount',
            key:'averageCount'
          }];
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const formItemLayout2 = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const {commonGradeData,classNameData} = this.props;
        let gradeChild=[]
        commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
            gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
        })
        let classChild=[]
        classNameData&&classNameData.length>0&&classNameData.map(item=>{
            classChild.push(<Option key={item.classId}>{item.className}</Option>)
        })
        const {classDisabled,classValue,gradeId,startTime,endTime,tabData} = this.state;
        
        return (
            <div className="score-main">
              <Tabs defaultActiveKey='1' activeKey={tabData} onChange={this.tabChange}>
                  <TabPane tab="概况" key="1">
                  <div className="socre-main content-main">
                        <Form className="ant-advanced-search-form content-form">
                            <Row gutter={24}>
                                <Col span={8}>
                                <FormItem {...formItemLayout} label=''>
                                    {getFieldDecorator('sort',{initialValue:sort})(
                                    <Radio.Group onChange={this.handleChange}>
                                        <Radio.Button value="1">班级排行</Radio.Button>
                                        <Radio.Button value="2">年级排行</Radio.Button>
                                        </Radio.Group>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                <FormItem label=''>
                                    {getFieldDecorator('size',{initialValue:size})(
                                    <Radio.Group onChange={this.handleSizeChange}>
                                        <Radio.Button value="2">本周</Radio.Button>
                                        <Radio.Button value="3">上周</Radio.Button>
                                        <Radio.Button value="4">本月</Radio.Button>
                                        {/* <Radio.Button value="9">本学期</Radio.Button> */}
                                        <Radio.Button value="6">自定义时间</Radio.Button>
                                        </Radio.Group>
                                    )}
                                    </FormItem>
                                </Col>
                                {size==6?<Col span={6}>
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
                        <div className="chart-main">
                        <div id="barCharts" style={{ width: "95%", height: 500,display:"inline-block" }}></div>     
                        <div className="apply-main">
                            {/* <p className="apply-name"></p> */}
                            <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={swipeCardList&&swipeCardList.dataList} pagination={false}/>
                            <PageIndex getPage={this.onPageChange.bind(this)} total={swipeCardList&&swipeCardList.totalCount} totalPage={swipeCardList&&swipeCardList.totalPage} currentPage={swipeCardList&&swipeCardList.currentPage}/>
                        </div>
                        </div>  
                    </div>
                  </TabPane>
                  <TabPane tab="明细" key="2">
                        <div className='socre-table-main content-main'>
                        <Form className="ant-advanced-search-form content-form">
                            <Row gutter={24}>
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label={'年级'}>
                                        <Select showSearch value={gradeId} onChange={this.gradeChange} optionFilterProp="children">
                                            <Option value='' key=''>全部</Option>
                                            {gradeChild}
                                        </Select>
                                    </FormItem>
                                </Col>  
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label={'班级'} >
                                        <Select showSearch value={classValue} optionFilterProp="children" onChange={this.classChange} disabled={classDisabled}>
                                            <Option value='' key=''>全部</Option>
                                            {classChild}
                                        </Select>
                                    </FormItem>
                                </Col>   
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='时间'>
                                        <RangePicker onChange={this.onTimeChange2} value={[startTime?moment(startTime):'', endTime?moment(endTime):'']} />
                                    </FormItem>
                                </Col> 
                                <Col span={2}>
                                    <Button type='primary' onClick={this.submit}>查询</Button>
                                </Col>
                                <Col span={2}>
                                    <Button type='primary'><a href={this.state.exportUrl?this.state.exportUrl:'javascript:;'} onClick={this.exportList.bind(this)}>导出</a></Button>
                                </Col>
                            </Row>
                        </Form> 
                        <Table className='content-table' scroll={{ x: 1000 }} columns={columns2} dataSource={swipeCardDetail&&swipeCardDetail.dataList} pagination={false}/>
                        <PageIndex getPage={this.onPageChange.bind(this)} total={swipeCardDetail&&swipeCardDetail.totalCount} totalPage={swipeCardDetail&&swipeCardDetail.totalPage} currentPage={swipeCardDetail&&swipeCardDetail.currentPage}/>
                    </div>
                  </TabPane>
              </Tabs>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    commonGradeData:state.user.commonGradeData,
    classNameData:state.user.classNameData,
    swipeCardList:state.swipeCard,
    swipeCardDetail:state.swipeCard.swipeCardDetail
  }
}
export default connect(mapStateToProps)(Form.create()(SwipeCards));
