/**
 * 流水记录
 */
 import React,{Component} from 'react';
 import { Form,Table,Input,DatePicker,Select,Row,Col,Button} from 'antd';

 import PageIndex from '../../components/page';
 import { connect } from 'dva';
 import './style.less';

 const {Option} = Select;

class AdttendanceRecords extends Component{
  constructor(props) {
      super(props);
      this.state = {
        stuData:{},
        page:1,
        pageSize:20,
      }
    }

    componentDidMount = () => {
      let {page,pageSize} = this.state;
      this.getPageData({page,pageSize});
    }

    queryList = () => {
      let that = this;
      that.props.form.validateFields().then(values => {
        let pageSize = that.state.pageSize;
        const params = Object.assign({page:1,pageSize},values);
        params.date = params.date ? params.date.format("YYYY-MM-DD") : null;
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
        type: 'attendanceRecord/getAttendanceRecordByPage',
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              stuData: res.data
            })
          }
        }
      })
    }

    onPageChange =  (current, size) => {
      let that = this;
      that.props.form.validateFields().then(values => {
        const params = Object.assign({page:current,pageSize:size},values);
        params.date = params.date ? params.date.format("YYYY-MM-DD") : null;
        that.setState({ page: current, pageSize: size })
        that.getPageData(params);
      })
    }

     render(){
      const {stuData} = this.state;
      const { getFieldDecorator } = this.props.form;
      const dateFormat = 'YYYY年MM月DD日';
      let stuColumns = [{
          title:"人员ID",
          dataIndex:"personId",
        },{
          title:"姓名",
          dataIndex:"personName",
        },{
          title:"人员类型",
          dataIndex:"personType",
          render: (text, record) => (
            <span>
              {record.personType + "" === "1" ? "学生" : "教职工"}
            </span>
          ),
        },{
          title:"数据源",
          dataIndex:"attendType",
          render: (text, record) => {
            let sources = {"1":"门禁考勤", "2":"班牌考勤", "3":"2.4G考勤", "4":"手持设备考勤", "5":"立式班牌考勤"}
            return (
              <span>
                {sources[record.attendType + ""] || ""}
              </span>
          )},
        },{
          title:"方向",
          dataIndex:"direct",
          render: (text, record) => {
            let sources = {"-1":"无", "1":"进", "2":"出"}
            return (
              <span>{sources[record.direct + ""] || ""}</span>
            )
          }
        },{
          title:"关系",
          dataIndex:"relation",
        },{
          title:"家长姓名",
          dataIndex:"parentName",
        },{
          title:"考勤时间",
          dataIndex:"attendTime",
        },
      ];


      let sources = {"1":"门禁考勤", "2":"班牌考勤", "3":"2.4G考勤", "4":"手持设备考勤", "5":"立式班牌考勤"};
      let sourceOptions = [];
      for(let s in sources){
        sourceOptions.push(<Option key={s}>{sources[s]}</Option>)
      }

       return (
         <div className="content-main content-box">
           <div className="stu-statistics">
              <Form>
                <Row className="ant-row-fun" gutter={24}>
                  <Col xl={{ span: 16, offset: 0 }}>
                    <Col xl={{ span: 6, offset: 0 }}>
                      <Form.Item>
                          {getFieldDecorator("search", {
                            initialValue: null,
                          })(<Input style={{width:"220px"}} placeholder="姓名/ID"></Input>)}
                          &emsp;&emsp;
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 6, offset: 0 }}>
                      <Form.Item>
                        {getFieldDecorator("personType")(<Select placeholder="人员类型">
                          <Option value="1">学生</Option>
                          <Option value="2">教职工</Option>
                        </Select>)}
                        &emsp;&emsp;
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 6, offset: 0 }}>
                      <Form.Item>
                        {getFieldDecorator("source", {})(<Select placeholder="数据源">
                          {sourceOptions}
                        </Select>)}
                        &emsp;&emsp;
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 6, offset: 0 }} >
                      <Form.Item>
                        {getFieldDecorator("date")(<DatePicker allowClear={false} placeholder="日期" format={dateFormat} style={{width:"220px"}}></DatePicker>)}
                        &emsp;&emsp;
                      </Form.Item>
                    </Col>
                  </Col>
                  <Col xl={{ span: 8, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                    <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                    <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
                  </Col>
                </Row>
              </Form>
              <Table rowKey="id" columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
              <div className="paginationBox">
                <PageIndex getPage={this.onPageChange.bind(this)} total={stuData.totalCount} totalPage={stuData.totalPage} currentPage={stuData.currentPage} />
              </div>
          </div>
         </div>)
     }
 }

 const mapStateToProps = (state) => {
   return {

   }
 }
 export default connect(mapStateToProps)(Form.create()(AdttendanceRecords));
