import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col,DatePicker ,Breadcrumb} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString,getMonthTime} from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class StIcConsumeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          startTime:getMonthTime(),
          endTime:Math.round(new Date().getTime()/1000).toString(),
          type:'1'
        };
    }
    componentDidMount=()=>{
      console.log(this.state.startTime,this.state.endTime)
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "cardNo":id,
            "startTime":this.state.startTime,//默认给90天的时间
            "endTime":this.state.endTime
        }
        this.getStIcConsumeDetail(params)
    }
    getStIcConsumeDetail=(params)=>{
      this.props.dispatch({
        type:'card/getStIcConsumeDetail',
        payload:params
      })
    }
    getStIcConsumeByTimesDetail=(params)=>{
      this.props.dispatch({
        type:'card/getStIcConsumeByTimesDetail',
        payload:params
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "cardNo":values.cardNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        if(this.state.type==1){
          this.getStIcConsumeDetail(params)
        }else{
          this.getStIcConsumeByTimesDetail(params)
        }
        this.setState({page:1})
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "cardNo":values.cardNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        if(this.state.type==1){
          this.getStIcConsumeDetail(params)
        }else{
          this.getStIcConsumeByTimesDetail(params)
        }
      })
    }
    onTimeChange=(date, dateString)=>{
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    typeChange=(val)=>{
      this.setState({type:val})
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let cardNo=values.cardNo||'';
        let startTime=this.state.startTime||''
        let endTime=this.state.endTime||'';
        let url;
        if(this.state.type==1){
          url=portUrl("/manager/st-card/card-consume-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&cardNo="+cardNo+"&startTime="+startTime+"&endTime="+endTime)
        }else{
          url=portUrl("/manager/st-card/card-consume--by-times-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&cardNo="+cardNo+"&startTime="+startTime+"&endTime="+endTime)
        }
        
        this.setState({exportUrl:url})
      })
    }
    goback=()=>{
      const kw=getQueryString('kw')
      this.props.dispatch(routerRedux.push(encodeURI(encodeURI("/card-manage?kw="+decodeURI(kw)))))
    }
    render(){
          const columns = [{ 
            title: '清算日期',
            dataIndex: 'Cldate',
          }, {
            title: '消费类型',
            dataIndex: 'Trtype',
          }, {
            title: '交易卡号',
            dataIndex: 'Cardno',
          }, {
            title: '班级信息',
            dataIndex: 'ClassName',
          }, {
            title: '姓名',
            dataIndex: 'Name',
          }, {
            title: '证件号',
            dataIndex: 'Number',
          }, {
            title: '消费日期',
            dataIndex: 'Trdate',
          }, {
            title: '交易金额（元）',
            dataIndex: 'Tamount',
          }, {
            title: '交易状态',
            dataIndex: 'Status',
          }, {
            title: '终端号',
            dataIndex: 'Key41',
          }, {
            title: '商户号',
            dataIndex: 'Key42',
          }, {
            title: '商户名称',
            dataIndex: 'Key43',
          }];
          const { getFieldDecorator } = this.props.form;
          const {stIcConsumeDetail} = this.props;
          console.log(stIcConsumeDetail)
          if(!stIcConsumeDetail){
            return null;
          }
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const id=getQueryString('id')
        return (
            <div className="content-main">
              <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item>后勤管理</Breadcrumb.Item>
                      <Breadcrumb.Item>一卡通管理</Breadcrumb.Item>
                      <Breadcrumb.Item onClick={this.goback}><a href="javascript:;">卡片管理</a></Breadcrumb.Item>
                      <Breadcrumb.Item>商通卡号消费查询</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('cardNo',{initialValue:id})(
                        <Search placeholder="请输入卡号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label='查询方式'>
                      {getFieldDecorator('searchType',{initialValue:'1'})(
                        <Select onChange={this.typeChange}>
                            <Option value="1">金额消费查询</Option>
                            <Option value="2">计次消费查询</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={8} >
                      <FormItem {...formItemLayout} label={''}>
                        {getFieldDecorator("time")(
                          <RangePicker onChange={this.onTimeChange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={stIcConsumeDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={stIcConsumeDetail.totalCount} totalPage={stIcConsumeDetail.totalPage} currentPage={stIcConsumeDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    stIcConsumeDetail:state.card.stIcConsumeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(StIcConsumeDetail));
