import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Radio,DatePicker ,Table } from 'antd';
import echarts from 'echarts';
import PageIndex from '../../components/page';
import './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class RoomCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          size:'6',
          page:1,
          prePage:20
        };
    }
    componentDidMount=()=>{
      const params={
        "quickSearch":"6",
        "startTime":"","endTime":""
      }
      this.getBarData(params);
      this.getRoomNum(params)
    }
    // 获取柱状图
    getBarData=(params)=>{
      this.props.dispatch({
        type:'room/getRoomBarData',
        payload:params,
        callback:(res)=>{
          console.log(res)
          if(res.code===200){
            let xData=[];let yData=[];
            res.data&&res.data.length>0&&res.data.map(item=>{
              xData.push(item.roomName);
              yData.push(item.count)
            })
            const myChart = echarts.init(document.getElementById('barCharts'));
            myChart.setOption({
              title: {
                  text: '功能室使用次数（次）'
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
    // 获取教师申请次数
    getRoomNum=(params)=>{
        this.props.dispatch({
            type:"room/getRoomApplyNum",
            payload:{"page":this.state.page,"prePage":this.state.prePage,...params},
        })
    }
    // 查询
    search=()=>{
      const {startTime,endTime} = this.state;
      const params={
        "quickSearch":this.state.size==9?0:this.state.size,
        "startTime":startTime||"","endTime":endTime||""
      }
      this.getBarData(params);
      this.getRoomNum(params);
    }
    handleSizeChange=(e)=>{
      this.setState({size:e.target.value})
      const params={
        "quickSearch":e.target.value,
        // "startTime":this.state.startTime||'',"endTime":this.state.endTime||""
      }
      if(e.target.value!=9){
        this.getBarData(params);
        this.getRoomNum(params);
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
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "quickSearch":this.state.size,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomNum(params)
      })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {size} = this.state;
        const {roomNums} = this.props;
        console.log(roomNums)
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
                            {getFieldDecorator('time')(
                               <RangePicker onChange={this.onTimeChange} />
                            )}
                          </FormItem>
                        </Col> :null}
                        <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>  
                <div className="chart-main">
                <div id="barCharts" style={{ width: "95%", height: 500,display:"inline-block" }}></div>     
                <div className="apply-main">
                    <p className="apply-name">功能室申请次数</p>
                    <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={roomNums&&roomNums.dataList} pagination={false}/>
                    <PageIndex getPage={this.onPageChange.bind(this)} total={roomNums&&roomNums.totalCount} totalPage={roomNums&&roomNums.totalPage} currentPage={roomNums&&roomNums.currentPage}/>
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
      roomNums:state.room.roomNums
  }
}
export default connect(mapStateToProps)(Form.create()(RoomCharts));
