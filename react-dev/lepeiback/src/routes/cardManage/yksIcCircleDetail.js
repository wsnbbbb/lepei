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

class YksIcCircleDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          startDate:'',
          endDate:'',
          type:'1'
        };
    }
    componentDidMount=()=>{
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "cardNo":id,
            "startDate":this.state.startDate,
            "endDate":this.state.endDate
        }
        this.getYksIcCircleDetail(params)
    }
    getYksIcCircleDetail=(params)=>{
      this.props.dispatch({
        type:'card/yksIcCircleDetail',
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
          "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getYksIcCircleDetail(params)
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
          "startDate":this.state.startDate||"","endDate":this.state.endDate||""
        }
        this.getYksIcCircleDetail(params)
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
        let cardNo=values.cardNo||'';
        let startDate=this.state.startDate||''
        let endDate=this.state.endDate||'';
        let url;
        url=portUrl("/manager/yqsh-card/card-circle-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
        "&cardNo="+cardNo+"&startDate="+startDate+"&endDate="+endDate)
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
          const {yksIcCircleDetail} = this.props;
          console.log(yksIcCircleDetail)
          if(!yksIcCircleDetail){
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
                      <Breadcrumb.Item>易科士卡号圈存查询</Breadcrumb.Item>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={yksIcCircleDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={yksIcCircleDetail.totalCount} totalPage={yksIcCircleDetail.totalPage} currentPage={yksIcCircleDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    yksIcCircleDetail:state.card.yksIcCircleDetail
  }
}
export default connect(mapStateToProps)(Form.create()(YksIcCircleDetail));
