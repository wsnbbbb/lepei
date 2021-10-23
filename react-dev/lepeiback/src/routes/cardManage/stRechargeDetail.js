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

class STRechargeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          startTime:getMonthTime(),
          endTime:Math.round(new Date().getTime()/1000).toString(),
        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "icCustomerNo":id,
            "searchType":'00',
            "startTime":this.state.startTime,
            "endTime":this.state.endTime
        }
        this.getStRechargeDetail(params)
    }
    getStRechargeDetail=(params)=>{
      this.props.dispatch({
        type:'card/getStRechargeDetail',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "searchType":values.searchType||'00',
          "icCustomerNo":values.icCustomerNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getStRechargeDetail(params)
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
          "searchType":values.searchType||'00',
          "icCustomerNo":values.icCustomerNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getStRechargeDetail(params)
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
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let icCustomerNo=values.icCustomerNo||'';
        let startTime=this.state.startTime||''
        let endTime=this.state.endTime||'';
        let searchType=values.searchType||'00';
        let url=portUrl("/manager/st-card/customer-recharge-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&icCustomerNo="+icCustomerNo+"&startTime="+startTime+"&endTime="+endTime+"&searchType="+searchType)
        this.setState({exportUrl:url})
      })
    }
    goback=()=>{
      const kw=getQueryString('kw')
      this.props.dispatch(routerRedux.push(encodeURI(encodeURI("/card-manage?kw="+decodeURI(kw)))))
    }
    render(){
          const columns = [{ //商通一卡通充值查询
            title: '交易卡号',
            dataIndex: 'Cardno',
          }, {
            title: '交易日期',
            dataIndex: 'Trdate',
          }, {
            title: '渠道名称',
            dataIndex: 'ChName',
          }, {
            title: '渠道流水',
            dataIndex: 'Qplseria',
          }, {
            title: '交易前金额',
            dataIndex: 'Samount',
          }, {
            title: '交易金额',
            dataIndex: 'Tramount',
          }, {
            title: '交易标志',
            dataIndex: 'Trflag',
          }, {
            title: '交易状态',
            dataIndex: 'Trstatus',
          }];
          const { getFieldDecorator } = this.props.form;
          const {stRechargeDetail} = this.props;
          console.log(stRechargeDetail)
          if(!stRechargeDetail){
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
                      <Breadcrumb.Item>商通客户号充值查询</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('icCustomerNo',{initialValue:id||''})(
                        <Search placeholder="请输入客户号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label='查询类型'>
                      {getFieldDecorator('searchType',{initialValue:'00'})(
                        <Select>
                            <Option value="00">所有圈存交易</Option>
                            <Option value="08">销卡退卡</Option>
                            <Option value="20">现金充值</Option>
                            <Option value="21">指定账户圈存</Option>
                            <Option value="22">充值激活</Option>
                            <Option value="23">APP充值</Option>
                            <Option value="24">现金充值撤销</Option>
                            <Option value="25">APP充值撤销</Option>
                            <Option value="26">充值纠错</Option>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={stRechargeDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={stRechargeDetail.totalCount} totalPage={stRechargeDetail.totalPage} currentPage={stRechargeDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    stRechargeDetail:state.card.stRechargeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(STRechargeDetail));
