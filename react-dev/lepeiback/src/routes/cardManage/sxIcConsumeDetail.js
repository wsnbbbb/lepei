import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Row, Col,DatePicker,Breadcrumb } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getQueryString,getAttendTime} from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SxIcConsumeDetail extends Component{
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
            "cardNo":id,
            "attendTime":this.state.attendTime
        }
        this.getSxIcConsumeDetail(params)
    }
    getSxIcConsumeDetail=(params)=>{
      this.props.dispatch({
        type:'card/getSxIcConsumeDetail',
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
          "attendTime":this.state.attendTime
        }
        this.getSxIcConsumeDetail(params)
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
          "attendTime":this.state.attendTime
        }
        this.getSxIcConsumeDetail(params)
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
        let cardNo=values.cardNo||'';
        let attendTime=this.state.attendTime||'';
        let url=portUrl("/manager/sx-card/ic-consume-query-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&cardNo="+cardNo+"&attendTime="+attendTime)
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
            title: '金额',
            dataIndex: 'OpMoney',
          }, {
            title: '消费类型',
            dataIndex: 'OpType',
          }, {
            title: '餐时类型',
            dataIndex: 'MealID',
          }, {
            title: '设备号',
            dataIndex: 'DeviceNO',
          }, {
            title: '设备地点',
            dataIndex: 'DeviceName',
          }, {
            title: '消费时间',
            dataIndex: 'OpTime',
          }, {
            title: '消费状态',
            dataIndex: 'OpState',
          }];
          const { getFieldDecorator } = this.props.form;
          const {sxIcConsumeDetail} = this.props;
          console.log(sxIcConsumeDetail)
          if(!sxIcConsumeDetail){
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
                      <Breadcrumb.Item>淞幸卡号消费查询</Breadcrumb.Item>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={sxIcConsumeDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={sxIcConsumeDetail.totalCount} totalPage={sxIcConsumeDetail.totalPage} currentPage={sxIcConsumeDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    sxIcConsumeDetail:state.card.sxIcConsumeDetail
  }
}
export default connect(mapStateToProps)(Form.create()(SxIcConsumeDetail));
