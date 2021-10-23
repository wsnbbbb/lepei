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
          size:'1',
          page:1,
          prePage:20,
          pubPage:1,pubPrePage:20
        };
    }
    componentDidMount=()=>{
      const params={
        "selectType":"1",
        "startTime":"","endTime":""
      }
      this.getBarData(params);
      this.getRoomNum(params);
      this.getPublisherData(params);
    }
    // 获取柱状图
    getBarData=(params)=>{
      this.props.dispatch({
        type:'classNotice/classNoticeBarData',
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
                  text: '班级通知发布趋势图'
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
                  type: 'line',
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
            type:"classNotice/classNoticeList",
            payload:{"page":this.state.page,"prePage":this.state.prePage,...params},
        })
    }
    // 获取班级通知发布排行
    getPublisherData=(params)=>{
      this.props.dispatch({
        type:"classNotice/classNoticePublisher",
        payload:{"page":this.state.pubPage,"prePage":this.state.pubPrePage,...params},
      })
    }
    // 查询
    search=()=>{
      const {startTime,endTime} = this.state;
      const params={
        "selectType":this.state.size==4?1:this.state.size,
        "startTime":startTime||"","endTime":endTime||""
      }
      this.getBarData(params);
      this.getRoomNum({"page":1,"prePage":this.state.prePage,...params});
      this.getPublisherData({"page":1,"prePage":this.state.pubPrePage,...params})
      this.setState({page:1,pubPage:1})
    }
    handleSizeChange=(e)=>{
      this.setState({size:e.target.value})
      const params={
        "selectType":e.target.value,
        // "startTime":this.state.startTime||'',"endTime":this.state.endTime||""
      }
      if(e.target.value!=4){
        this.getBarData(params);
        this.getRoomNum({"page":1,"prePage":this.state.prePage,...params});
        this.getPublisherData({"page":1,"prePage":this.state.pubPrePage,...params})
        this.setState({page:1,pubPage:1,startTime:'',endTime:''})
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
          "selectType":this.state.size,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRoomNum(params)
      })
    }
    onPublishPageChange=(current,size)=>{
      this.setState({pubPage:current,pubPrePage:size})
        const params={
          "page":current,
          "prePage":size,
          "selectType":this.state.size,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getPublisherData(params)
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {size} = this.state;
        const {classNoticeList,classNoticePublisher} = this.props;
        classNoticeList&&classNoticeList.dataList.map((item,index)=>{
          item.rank=index+1
        })
        const columns = [
        // {
        //   title: '排名',
        //   dataIndex: 'rank',
        //   key:'rank'
        // }, 
        {
          title: '年级班级',
          dataIndex: 'className',
          key:'className'
        }, {
          title: '班级通知数',
          dataIndex: 'sum',
          key:'sum'
        }];
        const columnsPublish = [{
          title: '排序',
          dataIndex: 'rank',
          key:'rank',
          render:(record)=>{
            return(
              <span className={record<4?"apply-rank-top":"apply-rank-last"}>{record}</span>
            )
          }
        }, {
          title: '发布人',
          dataIndex: 'publisherName',
          key:'publisherName'
        }, {
          title: '次数',
          dataIndex: 'count',
          key:'count'
        }];
        return (
          <div>
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
                <p className="apply-name">班级通知列表</p>
                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={classNoticeList&&classNoticeList.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={classNoticeList&&classNoticeList.totalCount} totalPage={classNoticeList&&classNoticeList.totalPage} currentPage={classNoticeList&&classNoticeList.currentPage}/>
            </div>
            <div className="apply-main">
                <p className="apply-name">班级通知发布排行</p>
                <Table className='content-table' scroll={{ x: 1000 }} columns={columnsPublish} dataSource={classNoticePublisher&&classNoticePublisher.dataList} pagination={false}/>
                <PageIndex getPage={this.onPublishPageChange.bind(this)} total={classNoticePublisher&&classNoticePublisher.totalCount} totalPage={classNoticePublisher&&classNoticePublisher.totalPage} currentPage={classNoticePublisher&&classNoticePublisher.currentPage}/>
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
    classNoticeList:state.classNotice.classNoticeList,
    classNoticePublisher:state.classNotice.classNoticePublisher,
  }
}
export default connect(mapStateToProps)(Form.create()(RoomCharts));
