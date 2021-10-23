import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, Select, Form, Divider, Row, Col, DatePicker, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {portUrl} from '../../utils/img';
import {getGradeType,getSexType,getResidence, formatDate} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class personHonorRecords extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          list: [],
          honorTypes: [],
          title:"荣誉统计",

        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page":1,"prePage":20
       }
       this.getList(params)
       this.props.dispatch({
        type: 'user/getCommonGradeList'
       })
       this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-honor"
        },
      })
    }

    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })    
  }

    getList=(params)=>{
      this.props.dispatch({
        type: 'honor/personStatistics',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })

    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "gradeId": values.gradeId?values.gradeId:'',
          "classId": this.state.classValue?this.state.classValue:'',
          "startDate": values.time[0]&&values.time[0].format("YYYY-MM-DD")||'',
          "endDate": values.time[1]&&values.time[1].format("YYYY-MM-DD")||'',
        }
        this.getList(params)
      })
    }
   
    // 分页
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "gradeId": values.gradeId?values.gradeId:'',
          "classId": this.state.classValue?this.state.classValue:'',
          "startDate": values.time[0]&&values.time[0].format("YYYY-MM-DD")||'',
          "endDate": values.time[1]&&values.time[1].format("YYYY-MM-DD")||'',
        }
        this.getList(params)
      })
    }
 
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":id},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let startDate = values.time[0]&&values.time[0].format("YYYY-MM-DD")||''
          let endDate = values.time[1]&&values.time[1].format("YYYY-MM-DD")||''
          let url=portUrl("/manager/person-honor-records/export-person-statistics?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&startDate="+startDate+"&endDate="+endDate)
          this.setState({exportUrl:url})
          console.log(url)
        })
      }
    render(){
        const columns = [{
            title: '学生姓名',
            dataIndex: 'personName',
            width:100,
            fixed:'left'
          } ,{
            title: '年级班级',
            dataIndex: 'className',
          },{
            title: '获奖次数',
            dataIndex: 'awardTimes',
          }, {
            title: '累计得分',
            dataIndex: 'totalScore',
          }];
          
          const { list , honorTypes} = this.state;
          let typeOptions=[];
          honorTypes&&honorTypes.map(item=>{
              return typeOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
          })
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        
          const {commonData, gradeList} = this.props;
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main student-honor">
               {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-honor">学生荣誉</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>荣誉统计</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入学生姓名"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem  label={''}>
                      {getFieldDecorator("time",{initialValue:''})(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={4} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                  </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }}  columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(personHonorRecords));
