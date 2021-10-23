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

class YKSCustomerCircleDetail extends Component{
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
        this.getYksCustomerCircleDetail(params)
    }
    getYksCustomerCircleDetail=(params)=>{
      this.props.dispatch({
        type:'card/yksCustomerCircleDetail',
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
          "startDate":this.state.startDate||"",
          "endDate":this.state.endDate||""
        }
        this.getYksCustomerCircleDetail(params)
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
        this.getYksCustomerCircleDetail(params)
      })
    }
    onTimeChange=(date, dateString)=>{
        console.log(dateString)
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
        url=portUrl("/manager/yqsh-card/customer-circle-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
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
            title: '姓名',
            dataIndex: 'name',
            key:'name',
          }, {
            title: '卡号',
            dataIndex: 'cardNo',
            key:'cardNo',
          }, {
            title: '交易金额（元）',
            dataIndex: 'money',
            key:'money',
          }, {
            title: '交易时间',
            dataIndex: 'tradeTime',
            key:'tradeTime',
          }, {
            title: '交易状态',
            dataIndex: 'tradeState',
            key:'tradeState',
            render:(record)=>{
                return( <span >{record==0?"未到账":(record==1?"已到账":"")}</span>)
            }
          }, {
            title: '对账状态',
            dataIndex: 'checkState',
            key:'checkState',
            render:(record)=>{
                return( <span >{record==0?"未对账":(record==2?"正常对账":(record==3?"对账补账":""))}</span>)
            }
          }, {
            title: '对账时间',
            dataIndex: 'checkTime',
            key:'checkTime',
          }];
          const { getFieldDecorator } = this.props.form;
          const {yksCustomerCircleDetail} = this.props;
          console.log(yksCustomerCircleDetail)
          if(!yksCustomerCircleDetail){
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
                      <Breadcrumb.Item>易科士客户号圈存查询</Breadcrumb.Item>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={yksCustomerCircleDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={yksCustomerCircleDetail.totalCount} totalPage={yksCustomerCircleDetail.totalPage} currentPage={yksCustomerCircleDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    yksCustomerCircleDetail:state.card.yksCustomerCircleDetail
  }
}
export default connect(mapStateToProps)(Form.create()(YKSCustomerCircleDetail));
