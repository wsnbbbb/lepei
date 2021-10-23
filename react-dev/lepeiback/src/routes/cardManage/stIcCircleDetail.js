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

class StIcCircleDetail extends Component{
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
        const id=getQueryString('id')
        const params={
            "page":1,
            "prePage":20,
            "cardNo":id,
            "searchType":'00',
            "startTime":this.state.startTime,
            "endTime":this.state.endTime
        }
        this.getStIcCircleDetail(params)
    }
    getStIcCircleDetail=(params)=>{
      this.props.dispatch({
        type:'card/getStIcCircleDetail',
        payload:params
      })
    }
    getStIcCircleByTimesDetail=(params)=>{
      this.props.dispatch({
        type:'card/getStIcCircleByTimesDetail',
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
          "cardNo":values.cardNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        if(this.state.type==1){
          this.getStIcCircleDetail(params)
        }else{
          this.getStIcCircleByTimesDetail(params)
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
          "searchType":values.searchType||'00',
          "cardNo":values.cardNo||'',
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        if(this.state.type==1){
          this.getStIcCircleDetail(params)
        }else{
          this.getStIcCircleByTimesDetail(params)
        }
        this.getStIcCircleDetail(params)
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
        let searchType=values.searchType||'00';
        let url;
        if(this.state.type==1){
          url=portUrl("/manager/st-card/card-circle-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&cardNo="+cardNo+"&startTime="+startTime+"&endTime="+endTime+"&searchType="+searchType)
        }else{
          url=portUrl("/manager/st-card/card-circle-by-times-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&cardNo="+cardNo+"&startTime="+startTime+"&endTime="+endTime+"&searchType="+searchType)
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
            title: '交易卡号',
            dataIndex: 'Cardno',
          }, {
            title: '交易时间',
            dataIndex: 'Trdate',
          }, {
            title: '平台流水',
            dataIndex: 'Plserial',
          }, {
            title: '渠道流水',
            dataIndex: 'Qplseria',
          }, {
            title: '机构名称',
            dataIndex: 'Trbranch',
          }, {
            title: '交易前金额（元）',
            dataIndex: 'Samount',
          }, {
            title: '交易金额（元）',
            dataIndex: 'Tramount',
          }, {
            title: '交易标志',
            dataIndex: 'Trflag',
          }, {
            title: '交易状态',
            dataIndex: 'Trstatus',
          }, {
            title: '写卡状态',
            dataIndex: 'Wrstatus',
          }];
          const { getFieldDecorator } = this.props.form;
          const {stIcCircleDetail} = this.props;
          console.log(stIcCircleDetail)
          if(!stIcCircleDetail){
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
                      <Breadcrumb.Item>商通卡号圈存查询</Breadcrumb.Item>
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
                      {getFieldDecorator('type',{initialValue:'1'})(
                        <Select onChange={this.typeChange}>
                            <Option value="1">金额圈存查询</Option>
                            <Option value="2">计次圈存查询</Option>
                        </Select>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={stIcCircleDetail.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={stIcCircleDetail.totalCount} totalPage={stIcCircleDetail.totalPage} currentPage={stIcCircleDetail.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    stIcCircleDetail:state.card.stIcCircleDetail
  }
}
export default connect(mapStateToProps)(Form.create()(StIcCircleDetail));
