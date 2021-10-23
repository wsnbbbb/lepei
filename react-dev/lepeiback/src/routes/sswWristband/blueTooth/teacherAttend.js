import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message,Menu,Icon,Dropdown,Tooltip,DatePicker} from 'antd';
import PageIndex from '../../../components/page';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import {getSexType,getBeforeDate} from '../../../utils/public';
import {portUrl} from '../../../utils/img';
import '../style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class TeacherAttend extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          placeDisabled:true,
          placeId:'',
          startDate:'',
          endDate:''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "personType":2,
        "startDate":getBeforeDate(0),
        "endDate":getBeforeDate(0)
      }
      this.getBlueAttendLists(params)
      this.props.dispatch({ //获取所有建筑
        type:'user/getAllBuildings'
      })
      this.props.dispatch({ //获取当前学期的所有节次
        type:'user/getCurrentSemesterSections'
      })
      this.setState({startDate:getBeforeDate(0),endDate:getBeforeDate(0)})
    }
    getBlueAttendLists=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getBlueToothAttendList',
        payload:params,
        callback:(res)=>{
            if(res.code===200){
                this.setState({attendData:res.data})
            }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if(!this.state.startDate&&!this.state.endDate){
          return message.error('请选择起止时间',2)
        }
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "personType":2,
          "status":values.status,
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "sectionId":values.sectionId,
          "roomId":this.state.placeId,
          "buildId":values.buildId
        }
        this.getBlueAttendLists(params)
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
          "kw":values.kw||'',
          "personType":2,
          "status":values.status,
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "sectionId":values.sectionId,
          "roomId":this.state.placeId,
          "buildId":values.buildId
        }
        this.getBlueAttendLists(params)
      })
    }
    buildChange=(val)=>{
        if(val){
          this.props.dispatch({
            type:'user/getAllPlacesByBuild',
            payload:{"buildId":val},
          })
          this.setState({placeId:'',placeDisabled:false})
        }else{
          this.setState({placeId:'',placeDisabled:true})
        }
    }
    placeChange=(val)=>{
        this.setState({placeId:val})
    }
    onTimeChange=(date, dateString)=> {
        const start=dateString[0];
        const end=dateString[1];
        this.setState({
          startDate:start,
          endDate:end
        })
    }
    export=()=>{
      if(!this.state.startDate&&!this.state.endDate){
        this.setState({exportUrl:''}) 
        return message.error('请选择起止时间',2)
      }
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let status=values.status;
        let startDate=this.state.startDate;
        let endDate=this.state.endDate;
        let sectionId=values.sectionId||'';
        let roomId=this.state.placeId||'';
        let buildId=values.buildId||'';
        let url=portUrl("/manager/attend-records/export?personType=2&userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&kw="+kw+"&buildId="+buildId+"&status="+status+"&startDate="+startDate+"&endDate="+endDate+"&sectionId="+sectionId+"&roomId="+roomId)
        this.setState({exportUrl:url}) 
      })
    }
    disabledDate=(current)=> {
      return current && current > moment().endOf('day');
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render:(record)=>(
              <span>{getSexType(record)}</span>
            )
          }, {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
          }, {
            title: '日期',
            dataIndex: 'day',         
            key: 'day',   
          }, {
            title: '节次',
            dataIndex: 'sectionName',         
            key: 'sectionName',   
          }, {
            title: '课程类型',
            dataIndex: 'courseType',         
            key: 'courseType',   
            render:(record)=>(
              <span>{record==1?"基础课":(record==2?"社团课":(record==3?"延时课":""))}</span>
            )
          }, {
            title: '课程名称',
            dataIndex: 'courseName',         
            key: 'courseName', 
          }, {
            title: '建筑',
            dataIndex: 'buildName',         
            key: 'buildName',   
          }, {
            title: '场所',
            dataIndex: 'roomName',         
            key: 'roomName',   
          }, {
            title: '考勤状态',
            dataIndex: 'status',         
            key: 'status',   
            render:(record)=>(
                <span style={{color:record==3?"#f00":""}}>{record==3?"缺勤":(record==1?"正常":"")}</span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24}
          };
          const {attendData,placeDisabled,startDate,endDate} = this.state;
          const {buildingList,placeList,currentSections} = this.props;
          if(!attendData){
            return null;
          }
          let buildChildren = [];
          buildingList&&buildingList.map(item=>{
              return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
          }) 
          let placeChildren = [];
          placeList&&placeList.map(item=>{
              return placeChildren.push(<Option key={item.id}>{item.name}</Option>);
          }) 
          let sectionsChildren=[];
          currentSections&&currentSections.map(item=>{
            return sectionsChildren.push(<Option key={item.sectionId}>{item.sectionName}</Option>);
          }) 
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                    <Col span={6}>
                        <FormItem label='' {...formItemLayout2}>
                        {getFieldDecorator('kw')(
                            <Search placeholder="姓名/课程名"/>
                        )}
                        </FormItem>
                    </Col> 
                    <Col span={6}>
                      <FormItem {...formItemLayout} label={'建筑'}>
                        {getFieldDecorator("buildId",{initialValue:''})(
                          <Select
                              placeholder="请选择"
                              optionFilterProp="children"
                              onChange={this.buildChange}
                              showSearch
                          >
                              <Option key='' value=''>全部</Option>
                              {buildChildren}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem {...formItemLayout} label={'场所'}>
                          <Select
                              placeholder="请选择"
                              optionFilterProp="children"
                              onChange={this.placeChange}
                              showSearch
                              value={this.state.placeId}
                              disabled={placeDisabled}
                          >
                              <Option key='' value=''>全部</Option>
                              {placeChildren}
                          </Select>
                      </FormItem>
                    </Col> 
                    <Col span={6}>
                        <FormItem {...formItemLayout} label={'节次'} >
                            {getFieldDecorator("sectionId",{initialValue:''})(
                                <Select>
                                    <Option value='' key=''>全部</Option>
                                    {sectionsChildren}
                                </Select>
                            )}
                        </FormItem>
                    </Col> 
                    <Col span={6}>
                        <FormItem {...formItemLayout2} label=''>
                          <RangePicker onChange={this.onTimeChange} disabledDate={this.disabledDate} defaultValue={[moment(startDate||''), moment(endDate||'')]}/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem {...formItemLayout} label={'状态'}>
                            {getFieldDecorator("status",{initialValue:''})(
                                <Select placeholder="请选择" >
                                    <Option key='0' value='0'>全部</Option>
                                    <Option key='1' value='1'>正常</Option>
                                    <Option key='3' value='3'>缺勤</Option>
                                </Select>
                            )}
                      </FormItem>
                    </Col> 
                    <Col span={2} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </Col>
                    <Col span={2} offset={0}>
                    <Button type='primary'><a href={this.state.exportUrl?this.state.exportUrl:'javascript:;'} onClick={this.export.bind(this)}>导出</a></Button>
                    </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={attendData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={attendData.totalCount} totalPage={attendData.totalPage} currentPage={attendData.currentPage}/>
              
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    buildingList:state.user.buildingList,
    placeList:state.user.placeList,
    currentSections:state.user.currentSections
  }
}
export default connect(mapStateToProps)(Form.create()(TeacherAttend));
