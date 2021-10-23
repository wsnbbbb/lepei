/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,DatePicker,Button } from 'antd';
// import PageIndex from '../../components/page';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { getQueryString} from '../../utils/public';

const {MonthPicker} = DatePicker;

class DepartmentAttendanceStatisticsStuDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
        history: require("history").createHashHistory,
        stuData:{},
        id:"",
        // page:1,
        // pageSize:20,
      }
    }

    componentDidMount = () => {
      let that = this;
      let id = getQueryString("id");
      that.setState({
        id:id || ""
      });
      setTimeout(() => {
        that.getPageData({month:moment().format("YYYY-MM")});
      },300);

      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:"班级考勤详情",
          parentRoute:"/department-attendance-statistics"
        },
      })
    }

    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
    }

    queryList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        const params = {...values};
        params.month = params.month ? params.month.format("YYYY-MM") : null;
        that.getPageData(params);
      })
    }

    getPageData = (params) =>{
      let that = this;
      let id = that.state.id;
      let keys = Object.keys(params);
      keys.forEach(ele => {
        if(!params[ele]){
          delete params[ele];
        }
      })
      this.props.dispatch({
        type: 'departmentAttenStatistics/getGroupDailySurverByPage',
        payload: Object.assign({type:"1",id},params),
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              stuData: res.data
            })
          }
        }
      })
    }

    goback = () => {
      this.state.history().goBack();
    }

    render(){
      const { getFieldDecorator } = this.props.form;
      let stuData = this.state.stuData;
      const monthFormat = 'YYYY年MM月';
      let stuColumns = [
        {
          title:"日期",
          dataIndex:"date",
        },
        {
          title:"应到人数",
          dataIndex:"dueNumber",
        },
        {
          title:"实到人数",
          dataIndex:"actualNumber",
        },
        {
          title:"出勤率",
          dataIndex:"attendRate",
          render:(text,record) => {
            return (<span>{text*100}%</span>)
          }
        },
        {
          title:"病假率",
          dataIndex:"sickLeaveRate",
          render:(text,record) => {
            return (<span>{text*100}%</span>)
          }
        },
        {
          title:"事假率",
          dataIndex:"absenceLeaveRate",
          render:(text,record) => {
            return (<span>{text*100}%</span>)
          }
        }];

      return (
        <div className="content-main content-box">
        <div className="stu-statistics">
            <Form>
              <Row className="ant-row-fun" gutter={24}>
                <Col xl={{ span: 16, offset: 0 }}>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("month", {
                        initialValue: moment(),
                      })(<MonthPicker placeholder="考勤日期" format={monthFormat} style={{width:"220px"}}></MonthPicker>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                </Col>
                <Col xl={{ span: 8, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                  <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' onClick={this.goback.bind(this)}>返回</Button>&emsp;
                </Col>
              </Row>
            </Form>
          <Table rowKey="id" columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
          {/* <div className="paginationBox">
            <PageIndex getPage={this.onPageChange.bind(this)} total={stuData.totalCount} totalPage={stuData.totalPage} currentPage={stuData.currentPage} />
          </div> */}
        </div>
      </div>)
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(DepartmentAttendanceStatisticsStuDetail));
