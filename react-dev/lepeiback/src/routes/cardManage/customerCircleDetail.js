import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Row, Col,DatePicker,Breadcrumb } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString,getAttendTime} from '../../utils/public';
import {portUrl} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class CustomerCircleDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          attendTime:getAttendTime(),
        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "customerId":id,
            "attendTime":this.state.attendTime
        }
        this.getCustomerCircleDetail(params)
    }
    getCustomerCircleDetail=(params)=>{
      this.props.dispatch({
        type:'card/getCustomerCircleDetail',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "customerId":values.customerId||'',
          "attendTime":this.state.attendTime
        }
        this.getCustomerCircleDetail(params)
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
          "customerId":values.customerId||'',
          "attendTime":this.state.attendTime
        }
        this.getCustomerCircleDetail(params)
      })
    }
    onTimeChange=(date, dateString)=>{
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        attendTime:start+' ~ '+end
      })
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let customerId=values.customerId||'';
        let attendTime=this.state.attendTime||'';
        let url=portUrl("/manager/sx-card/person-circle-query-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&customerId="+customerId+"&attendTime="+attendTime)
        this.setState({exportUrl:url})
      })
    }
    goback=()=>{
      const kw=getQueryString('kw')
      this.props.dispatch(routerRedux.push(encodeURI(encodeURI("/card-manage?kw="+decodeURI(kw)))))
    }
    render(){
          const columns = [{ 
            title: '卡号',
            dataIndex: 'CardNO',
          }, {
            title: '圈存金额',
            dataIndex: 'QCMoney',
          }, {
            title: '圈存类型',
            dataIndex: 'QCType',
          }, {
            title: '圈存时间',
            dataIndex: 'OpTime',
          }, {
            title: '圈存状态',
            dataIndex: 'QCState',
          }];
          const { getFieldDecorator } = this.props.form;
          const {customerCircleDetail} = this.props;
          console.log(customerCircleDetail)
          if(!customerCircleDetail){
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
                      <Breadcrumb.Item>淞幸客户号圈存查询</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('customerId',{initialValue:id})(
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={customerCircleDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={customerCircleDetail.totalCount} totalPage={customerCircleDetail.totalPage} currentPage={customerCircleDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    customerCircleDetail:state.card.customerCircleDetail
  }
}
export default connect(mapStateToProps)(Form.create()(CustomerCircleDetail));
