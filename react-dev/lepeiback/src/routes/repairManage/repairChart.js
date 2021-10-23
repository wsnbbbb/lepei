import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Radio,DatePicker,Table  } from 'antd';
import echarts from 'echarts';
import PageIndex from '../../components/page';
import './style.less';
import { stat } from 'fs';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class RepairCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          size:'6',
          page:1,prePage:20,
          addPage:1,addPrePage:20
        };
    }
    componentDidMount=()=>{
      const params={
        "quickSearch":"6","startDate":"","endDate":""
      }
      this.getBarData(params);
      this.getPieData(params);
      this.getRepairApplicant(params);
      this.getRepairAddress(params);
    }
    // 获取柱状图
    getBarData=(params)=>{
      this.props.dispatch({
        type:'repair/getRepairBarData',
        payload:params,
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            let xData=[];let yData=[];
            res.data&&res.data.length>0&&res.data.map(item=>{
              xData.push(item.time);
              yData.push(item.count)
            })
            const myChart = echarts.init(document.getElementById('barCharts'));
            myChart.setOption({
              title: {
                  text: '报事报修事件数'
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
        type:'repair/getRepairPieData',
        payload:params,
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            let pieDatas=[];let names=[]
            res.data&&res.data.length>0&&res.data.map(item=>{
              pieDatas.push({value:item.count,name:item.typeName})
              names.push(item.typeName)
            })
            const myChart = echarts.init(document.getElementById('pieCharts'));
            myChart.setOption({
              title: {
                text: '报事报修类型占比（次）'
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
                      name:'类型占比',
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
    // 获取报事报修申请次数
    getRepairApplicant=(params)=>{
      this.props.dispatch({
        type:'repair/getRepairApplicant',
        payload:{"page":this.state.page,"prePage":this.state.prePage,...params}
      })
    }
    // 获取报事报修地点
    getRepairAddress=(params)=>{
      this.props.dispatch({
        type:'repair/getRepairAddress',
        payload:{"page":this.state.addPage,"prePage":this.state.addPrePage,...params}
      })
    }
    // 查询
    search=()=>{
      const {startDate,endDate} = this.state;
      const params={
        "quickSearch":this.state.size==9?0:this.state.size,"startDate":startDate||"","endDate":endDate||""
      }
      this.getBarData(params);
      this.getPieData(params);
      this.getRepairApplicant({"page":1,"prePage":this.state.prePage,...params});
      this.getRepairAddress({"page":1,"prePage":this.state.addPrePage,...params});
      this.setState({page:1,addPage:1})
    }
    handleSizeChange=(e)=>{
      this.setState({size:e.target.value})
      const params={
        "quickSearch":e.target.value,
        // "startDate":this.state.startDate||"","endDate":this.state.endDate||""
      }
      if(e.target.value!=9){
        this.getBarData(params);
        this.getPieData(params);
        this.getRepairApplicant({"page":1,"prePage":this.state.prePage,...params});
        this.getRepairAddress({"page":1,"prePage":this.state.addPrePage,...params});
        this.setState({page:1,addPage:1,startDate:'',endDate:''})
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
          "quickSearch":this.state.size,
          "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getRepairApplicant(params)
      })
    }
    onAddressPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({addPage:current,addPrePage:size})
        const params={
          "page":current,
          "prePage":size,
          "quickSearch":this.state.size,
          "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getRepairAddress(params)
      })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {size} = this.state;
        const {applicantDatas,addressDatas} = this.props;
        const columns = [{
          title: '排序',
          dataIndex: 'rank',
          render:(record)=>{
            return(
              <span className={record<4?"apply-rank-top":"apply-rank-last"}>{record}</span>
            )
          }
        }, {
          title: '申请人',
          dataIndex: 'applicant',
        }, {
          title: '次数',
          dataIndex: 'count',
        }];
        const addressColumns = [{
          title: '排序',
          dataIndex: 'rank',
          render:(record)=>{
            return(
              <span className={record<4?"apply-rank-top":"apply-rank-last"}>{record}</span>
            )
          }
        }, {
          title: '功能室/教室',
          dataIndex: 'address',
        }, {
          title: '次数',
          dataIndex: 'count',
        }];
        return (
            <div className="leave-main content-main">
                
                <Form className="ant-advanced-search-form content-form">
                    <Row gutter={24}>
                        <Col span={10}>
                          <Radio.Group value={size} onChange={this.handleSizeChange}>
                            <Radio.Button value="6">近一周</Radio.Button>
                            <Radio.Button value="7">近一月</Radio.Button>
                            <Radio.Button value="8">近一年</Radio.Button>
                            <Radio.Button value="9">自定义时间</Radio.Button>
                          </Radio.Group>
                        </Col>
                        {size==9?<Col span={8}>
                            <FormItem label=''>
                            {getFieldDecorator('kw')(
                               <RangePicker onChange={this.onTimeChange} />
                            )}
                            </FormItem>
                        </Col> :null}
                        <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>    
                <div id="barCharts" style={{ width: "96%", height: 500 }}></div>     
                <div id="pieCharts" style={{ width: "96%", height: 500 }}></div>      
                <div className="apply-main">
                    <p className="apply-name">报事报修申请次数</p>
                    <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={applicantDatas&&applicantDatas.dataList} pagination={false}/>
                    <PageIndex getPage={this.onPageChange.bind(this)} total={applicantDatas&&applicantDatas.totalCount} totalPage={applicantDatas&&applicantDatas.totalPage} currentPage={applicantDatas&&applicantDatas.currentPage}/>
                </div>
                <div className="apply-main">
                    <p className="apply-name">报事报修地点</p>
                    <Table className='content-table' scroll={{ x: 1000 }} columns={addressColumns} dataSource={addressDatas&&addressDatas.dataList} pagination={false}/>
                    <PageIndex getPage={this.onAddressPageChange.bind(this)} total={addressDatas&&addressDatas.totalCount} totalPage={addressDatas&&addressDatas.totalPage} currentPage={addressDatas&&addressDatas.currentPage}/>
                </div>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    applicantDatas:state.repair.applicantDatas,
    addressDatas:state.repair.addressDatas
  }
}
export default connect(mapStateToProps)(Form.create()(RepairCharts));
