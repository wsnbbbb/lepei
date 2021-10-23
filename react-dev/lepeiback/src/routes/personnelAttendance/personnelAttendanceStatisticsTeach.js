/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Table,Form,Row, Col,Button,Input,DatePicker,TreeSelect } from 'antd';

import PageIndex from '../../components/page';
import { connect } from 'dva';
import './style.less';
import moment from 'moment';
import { portUrl } from '../../utils/img';

const {MonthPicker} = DatePicker;

class PersonnelAttendanceStatisticsTeach extends Component{
  constructor(props) {
      super(props);
      this.state = {
        teachData:{},
        page:1,
        pageSize:20,
        deptDataArrs: [],
      }
    }

    componentDidMount = () => {
      this.getAllDept();
      let {page,pageSize} = this.state;
      this.getPageData({page,pageSize});
    }

    getAllDept = () => {
      let that = this;
      that.props.dispatch({
        type: "personAttenStatistics/getDepartmentTree",
        payload: {},
        callback: (res) => {
          if (res.code === 200) {
            let deptDataArrs = res.data;
            deptDataArrs.forEach((ele) => {
              ele.title = ele.departmentName;
              ele.value = ele.departmentId;
              ele.key = ele.departmentId;
              if(ele.children && ele.children.length > 0){
                that.getTreeChild(ele.children)
              }
            });
            that.setState({
              deptDataArrs
            });
          }
        },
      });
    };

    queryList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let pageSize = that.state.pageSize;
        const params = Object.assign({page:1,pageSize},values);
        params.month = params.month ? params.month.format("YYYY-MM") : null;
        that.getPageData(params);
        that.setState({
          page:1
        })
      })
    }

    resetQuery = () => {
      let that = this;
      let pageSize = that.state.pageSize;
      that.props.form.resetFields();
      that.getPageData({page:1,pageSize});
      that.setState({
        page:1
      })
    }

    getPageData = (params) =>{
      let that = this;
      let keys = Object.keys(params);
      keys.forEach(ele => {
        if(!params[ele]){
          delete params[ele];
        }
      })
      this.props.dispatch({
        type: 'personAttenStatistics/getTeachingMonthlyByPage',
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              teachData: res.data
            })
          }
        }
      })
    }

    export = () => {
      this.props.form.validateFields().then(values => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        const params = {...values};
        params.month = params.month ? params.month.format("YYYY-MM") : null;
        let departmentId = params.departmentId || '';
        let month = params.month || '';
        let person = params.person || '';
        let url = portUrl("/manager/attendance/record/teaching-staff-monthly-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&departmentId=" + departmentId + "&month=" + month + "&person=" + person)
        window.open(url,"_blank")
      })
    }

    onPageChange =  (current, size) => {
      let that = this;
      that.props.form.validateFields().then(values => {
        const params = Object.assign({page:current,pageSize:size},values);
        params.month = params.month ? params.month.format("YYYY-MM") : null;
        that.setState({ page: current, pageSize: size })
        that.getPageData(params);
      })
    }

    getTreeChild(childs){
      let that = this;
      childs.forEach(ele => {
        ele.title = ele.departmentName;
        ele.value = ele.departmentId;
        ele.key = ele.departmentId;
        if(ele.children && ele.children.length > 0){
          that.getTreeChild(ele.children);
        }
      })
    }

    render(){
      const {teachData,deptDataArrs} = this.state;
      const { getFieldDecorator } = this.props.form;
      const monthFormat = 'YYYY年MM月';
      let teachColumns = [
        {
          title:"人员ID",
          dataIndex:"personId",
        },
        {
          title:"姓名",
          dataIndex:"personName",
        },
        {
          title:"部门",
          dataIndex:"departmentName",
        },
        {
          title:"应到天数",
          dataIndex:"dueDays",
        },
        {
          title:"实到天数",
          dataIndex:"actualDays",
        },
        {
          title:"病假时长（小时）",
          dataIndex:"sickLeaveTime",
        },
        {
          title:"事假时长（小时）",
          dataIndex:"absenceLeaveTime",
        },
      ];

      return (
        <div className="stu-statistics">
            <Form>
              <Row className="ant-row-fun" gutter={24}>
                <Col xl={{ span: 16, offset: 0 }}>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                        {getFieldDecorator("person", {
                          initialValue: null,
                        })(<Input style={{width:"220px"}} placeholder="姓名/ID"></Input>)}
                        &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("departmentId")(
                        <TreeSelect placeholder="部门" treeData={deptDataArrs} allowClear treeDefaultExpandAll dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}>
                        </TreeSelect>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("month", {
                        initialValue: moment(),
                      })(<MonthPicker placeholder="年月" allowClear={false} format={monthFormat} style={{width:"220px"}}></MonthPicker>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                </Col>
                <Col xl={{ span: 8, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                  <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
                  <Button type='primary' onClick={this.export.bind(this)}>导出</Button>&emsp;&emsp;
                </Col>
              </Row>
            </Form>
            <Table rowKey="personId" columns={teachColumns} dataSource={teachData.dataList} pagination={false} />
            <div className="paginationBox">
              <PageIndex getPage={this.onPageChange.bind(this)} total={teachData.totalCount} totalPage={teachData.totalPage} currentPage={teachData.currentPage} />
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(PersonnelAttendanceStatisticsTeach));
