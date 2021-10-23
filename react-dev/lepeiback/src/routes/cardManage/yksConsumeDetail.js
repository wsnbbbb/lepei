import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col,Modal,DatePicker,Breadcrumb } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString,getMonthTime} from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class YKSCustomerConsumeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          startDate:'',
          endDate:'',
        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "icCustomerNo":id,
            "startDate":this.state.startDate,
            "endDate":this.state.endDate
        }
        this.getYksCustomerConsumeDetail(params)
    }
    getYksCustomerConsumeDetail=(params)=>{
      this.props.dispatch({
        type:'card/yksCustomerConsumeDetail',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "icCustomerNo":values.icCustomerNo||'',
          "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getYksCustomerConsumeDetail(params)
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
          "icCustomerNo":values.icCustomerNo||'',
          "startDate":this.state.startDate||"",
          "endDate":this.state.endDate||""
        }
        this.getYksCustomerConsumeDetail(params)
      })
    }
    onTimeChange=(date, dateString)=>{
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
      })
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let icCustomerNo=values.icCustomerNo||'';
        let startDate=this.state.startDate||''
        let endDate=this.state.endDate||'';
        let url;
        url=portUrl("/manager/yqsh-card/customer-consume-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
        "&icCustomerNo="+icCustomerNo+"&startDate="+startDate+"&endDate="+endDate)
        
        this.setState({exportUrl:url})
      })
    }
    goback=()=>{
      const kw=getQueryString('kw')
      this.props.dispatch(routerRedux.push(encodeURI(encodeURI("/card-manage?kw="+decodeURI(kw)))))
    }
    render(){
        const columns = [{ 
          title: '交易流水号',
          dataIndex: 'tradeNo',
          key:'tradeNo',
        }, { 
          title: '账号',
          dataIndex: 'accountId',
          key:'accountId',
        }, { 
          title: '学工号',
          dataIndex: 'custNo',
          key:'custNo',
        }, {
          title: '姓名',
          dataIndex: 'custName',
          key:'custName',
        }, {
          title: '卡号',
          dataIndex: 'cardNo',
          key:'cardNo',
        }, {
          title: '交易时间',
          dataIndex: 'tradeTime',
          key:'tradeTime',
        }, {
          title: '原余额（元）',
          dataIndex: 'preBalance',
          key:'preBalance',
        }, {
          title: '交易金额（元）',
          dataIndex: 'amount',
          key:'amount',
        }, {
          title: '现余额（元）',
          dataIndex: 'curBalance',
          key:'curBalance',
        }, {
          title: '交易编码',
          dataIndex: 'tradeCode',
          key:'tradeCode',
        }, {
          title: '交易类型',
          dataIndex: 'tradeType',
          key:'tradeType',
        }, {
          title: '交易终端机号',
          dataIndex: 'termNo',
          key:'termNo',
        }, {
          title: '交易终端名称',
          dataIndex: 'termName',
          key:'termName',
        }, {
          title: '交易地点',
          dataIndex: 'tradeAdd',
          key:'tradeAdd',
        }, {
          title: '钱包类型',
          dataIndex: 'qtype',
          key:'qtype',
        }, {
          title: '交易餐次',
          dataIndex: 'mealtime',
          key:'mealtime',
        }];
          const { getFieldDecorator } = this.props.form;
          const {yksCustomerConsumeDetail} = this.props;
          console.log(yksCustomerConsumeDetail)
          if(!yksCustomerConsumeDetail){
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
                      <Breadcrumb.Item>易科士客户号消费查询</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('icCustomerNo',{initialValue:id})(
                        <Search placeholder="请输入客户号"/>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={yksCustomerConsumeDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={yksCustomerConsumeDetail.totalCount} totalPage={yksCustomerConsumeDetail.totalPage} currentPage={yksCustomerConsumeDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    yksCustomerConsumeDetail:state.card.yksCustomerConsumeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(YKSCustomerConsumeDetail));
