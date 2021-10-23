import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Tabs, Button, Input, Select , Form, Row, Col, Tooltip,Modal,DatePicker } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import { onlyDate, getTrainLevel } from '../../utils/public';
import { portUrl } from '../../utils/img';
import TrainCharts from './trainCharts';
import { log } from 'util';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

class Train extends Component{
    constructor(props) {
        super(props);
        this.state = {
          currentTab:'1',
          page:1,
          prePage:20,
          List:[],
          dataList:[],
          startTime:'',
          endTime:'',
          exportUrl:'',
          
        };
    }
    componentDidMount=()=>{
        const params={
            "page":1,
            "prePage":20
          }
        this.getTrainList(params)
    }
    getTrainList = (params)=>{ //获取外出培训列表
        this.props.dispatch({
            type:'train/getTrainList',
            payload:params,
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        List:res.data,
                        dataList:res.data.dataList
                    })
                }
            }
        })
    }
    changeTab = (value)=>{
        this.setState({
            currentTab:value
        })
    }
    onTimeChange=(date, dateString)=>{
        this.setState({
          startTime:dateString[0],
          endTime:dateString[1]
        })
    }
    // 查询
    search =()=>{
        this.props.form.validateFields((err, values) => {
            const params={
              "page":1,
              "prePage":this.state.prePage,
              "kw":values.kw||'',
              "trainLevel":values.trainLevel||'',
              "startDate":this.state.startTime||'',
              "endDate":this.state.endTime||''
            }
            this.getTrainList(params)
        })
    }
   
    // 分页
    onPageChange =(current,size)=>{
        this.props.form.validateFields((err, values) => {
            this.setState({page:current,prePage:size})
            const params={
              "page":current,
              "prePage":size,
              "kw":values.kw||'',
              "trainLevel":values.trainLevel||'',
              "startDate":this.state.startTime,
              "endDate":this.state.endTime
            }
            this.getTrainList(params)
        })
    }
    
    // 导出
    derive = ()=>{
        this.props.form.validateFields((err, values) => {
            let token = sessionStorage.getItem("token");
            let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
            let userId = sessionStorage.getItem("userId");
            let kw = values.kw||'';
            let trainLevel = values.trainLevel||'';
            let startDate = this.state.startTime||'';
            let endDate = this.state.endTime||'';
            let url = portUrl("/manager/out-train/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+
            "&trainLevel="+trainLevel+"&startDate="+startDate+"&endDate="+endDate)
            this.setState({exportUrl:url})
            
        })
    }
    // 查看
    goToDetail =(id)=>{
        this.props.dispatch(routerRedux.push("/train-detail?id="+id))
    }

    render(){
        const {List,dataList,currentTab} = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
        };
        const columns = [
            {
                title: '参培者',
                dataIndex: 'personName',
            },{
                title: '培训等级',
                dataIndex: 'trainLevel',
                render:(record)=>{
                    return(<span>{getTrainLevel(record)}</span>)
                  }
            },{
                title: '时长',
                dataIndex: '',
                render:(record)=>{
                  return(<span>{record.days}&nbsp;天</span>)
                }
            },{
                title: '培训日期',
                dataIndex: 'trainTime',
                render:(record)=>{
                  return(<span>{onlyDate(record)}</span>)
                }
            },{
                title: '培训单位',
                dataIndex: 'organizer',
                render:(record)=>{
                    return(
                    <Tooltip placement="top" title={record}>
                      <span className="text">{record}</span>
                    </Tooltip>)
                }
            },{
                title: '培训主题',
                dataIndex: 'trainTopic',
                render:(record)=>{
                    return(
                    <Tooltip placement="top" title={record}>
                      <span className="text">{record}</span>
                    </Tooltip>)
                }
            },{
                title: '提交时间',
                dataIndex: 'submitTime',
                render:(record)=>{
                    return(<span>{onlyDate(record)}</span>)
                }
            },{
                title: '操作',
                dataIndex: '',
                width:100,
                fixed:'right',
                render:(text, record) => (
                  <span><a href="javascript:;"  onClick={this.goToDetail.bind(this,record.id)}>查看</a></span>
                )
            },
        ]
        return (
            <div className="content-main goOut-train">
                <Tabs defaultActiveKey="1" activeKey={currentTab} onChange={this.changeTab} >
                    <TabPane tab="明细" key="1" className="content-form">
                        <Form>
                            <Row gutter={24}>
                                <Col span={5}>
                                    <FormItem label=''>
                                    {getFieldDecorator('kw')(
                                        <Search placeholder="参培者姓名或培训单位或培训主题"/>
                                    )}
                                    </FormItem>
                                </Col> 
                                <Col span={5}>
                                <FormItem {...formItemLayout} label={'培训等级'}>
                                    {getFieldDecorator("trainLevel",{initialValue:''})(
                                        <Select>
                                            <Option value="">全部</Option>
                                            <Option value="1">国家级</Option>
                                            <Option value="2">省级</Option>
                                            <Option value="3">市级</Option>
                                            <Option value="4">区县级</Option>
                                            <Option value="5">校级</Option>
                                            <Option value="6">其他</Option>
                                        </Select>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={7} >
                                    <FormItem {...formItemLayout} label={'培训日期'}>
                                        {getFieldDecorator("time",{initialValue:''})(
                                        <RangePicker onChange={this.onTimeChange} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} offset={1}>
                                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                                    <Button><a href={this.state.exportUrl} onClick={this.derive.bind(this)}>导出</a></Button>
                                </Col>
                                
                            </Row>
                        </Form>
                        <Table scroll={{ x: 800 }} columns={columns} dataSource={dataList} pagination={false}/>
                        <PageIndex getPage={this.onPageChange.bind(this)} total={List.totalCount} totalPage={List.totalPage} currentPage={List.currentPage}/>
                                   
                    </TabPane>
                    <TabPane tab="概况" key="2">
                       <TrainCharts/>
                    </TabPane>
                </Tabs>
            </div>
        )  
    }
}

const mapStateToProps = (state) => {
  return {
     
  }
}
export default connect(mapStateToProps)(Form.create()(Train));
