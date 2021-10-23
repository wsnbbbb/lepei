import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { DatePicker,Modal, Table, Checkbox ,Tabs, Tree,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination, Upload  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { getSign, portUrl, getUpload} from "../../utils/img";
import md5 from 'md5';
import RedBox from 'redbox-react';
import moment from 'moment';
import PageIndex from '../../components/page';
import {getApplyStatus, onlyDate, formatDate, getGradeType, getSexType} from '../../utils/public';

const { TreeNode, TreeSelect } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;



class SportStatistics extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classTree:[],
            schedule:[],
            classIds: [],
            classId:'',
            semesterId: '',
            gradeName:'',
            className:'',
            exportUrl:'',
            currentDay: "",
            dataList: [],
            defaultGoal: 0,
            totalCount: 0,
            unReachCount: 0,
            isShowTableTitle: false,
            personList: {},
            dateValue1: '',
            dateValue2: '',

        };
    }


    componentDidMount=()=>{
       this.getClassTree();
       const params={
        "date": moment().format('YYYY-MM-DD'),
        "page": 1,
        "prePage": 20
        } 
        this.getSubject();
        this.getUnReachPersons(params)
        this.setState({
            dateValue1: moment().format('YYYY-MM-DD'),
            dateValue2: moment().format('YYYY-MM-DD')
        })
    }

    getClassTree=()=>{
        let _this=this
        this.props.dispatch({
            type:'schedule/getClassTree',
            payload:"",
            callback:(res)=>{
                if(res.code===200){
                  if(!res.data) return;
                  let allClassId=[];
                  let result=res.data;
                  result.map(item=>{
                    item.classData.map(i=>{
                        allClassId.push(i.classId)
                    })
                  })
                  
                _this.setState({
                    classTree: res.data,
                    classIds: allClassId
                })
                }
              }
        })
    }

    getStepInfoByClass=(params)=>{
        let _this = this
        this.props.dispatch({
            type: 'lepayHealth/getStepInfoByClass',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    _this.setState({
                        dataList: res.data.list,
                        defaultGoal: res.data.defaultGoal,
                        totalCount: res.data.totalCount,
                        unReachCount: res.data.unReachCount,
                        isShowTableTitle: true
                    })
                }
              }
        })
    }

    getUnReachPersons=(params)=>{
        this.props.dispatch({
            type: 'lepayHealth/getUnReachPersons',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    this.setState({
                       personList: res.data
                    })
                }
              }
        })
    }

    getSubject=()=>{
        this.props.dispatch({
            type:'schedule/getSubject',
            payload:{
                type: 1
            },
        })
    }

    onChange=(value)=> {
        console.log('changed', value);
    }

    
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        console.log(info.node.props);
        this.setState({
            gradeName: info.node.props.gradeName,
            className: info.node.props.className
        })
        //回调解决this.setState异步的问题
        this.setState({
            classId: selectedKeys[0]
        },()=>{
            if(this.state.dateValue1&&this.state.classId){
                const params={
                    "classId": this.state.classId,
                    "date": this.state.dateValue1,
                }
                this.getStepInfoByClass(params)
            }
        })
    }
    

    // 分页
    onPageChange=(current,size)=>{
        this.setState({page:current, prePage:size})
        const params={
            "date": this.state.dateValue2,
            "page": current,
            "prePage": size,
        }
        this.getUnReachPersons(params)
    }


    onChange3 = (date, dateString)=>{
        console.log(date, dateString);
        this.setState({
            dateValue1: dateString
        })
        if(this.state.classId == ''){
            message.warning('请选择班级!');
            return;
        }
        if(!dateString) return
        let params = {
            classId: this.state.classId,
            date: dateString
        }
        this.getStepInfoByClass(params)
    }

    onChange4 = (date, dateString)=>{
        console.log(date, dateString);
        this.setState({
            dateValue2: dateString
        })
        if(!dateString) return
        this.setState({ page:1})
        const params={
            "date": dateString,
            "page": 1,
            "prePage": 20,
        }
        this.getUnReachPersons(params)
    }

    // 导出
    export1 = () =>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let date = this.state.dateValue2;
        let url=portUrl("/manager/bracelet/sports/export-step-un-reach-persons?userId="+userId+"&userType="+userType+"&accessToken="+token+"&date="+date)
        this.setState({exportUrl:url})
    }

    disabledDate = (current)=> {
        return current && current > moment().endOf('day');
    }

    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(text,record)=>(
                <span>{getSexType(record.sex)}</span>
              )
          }, {
            title: '步数/里程/卡路里',
            dataIndex: 'applyTypeName',
            render:(text,record)=>(
                <span>{record.steps?record.steps:'-'}步/{record.distances?record.distances/1000:'-'}km/{record.calories?record.calories:'-'}卡</span>
              )
          }, {
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span style={{color:record==1?"green":(record==4?"red":"")}}>{record==0?"-":(record==1?"未达标":"已达标")}</span>)
            }
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName'
          }, {
            title: '班级',
            dataIndex: 'className'
          },{
            title: '更新时间',
            dataIndex: 'updateTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }];

        const { getFieldDecorator } = this.props.form;
        const { personList } = this.state;
        
        const dateFormat = 'YYYY-MM-DD';
        const {classTree }= this.state;
        const tree = classTree.map(function(item){
            return   <TreeNode title={item.gradeName} selectable={false} gradeName={item.gradeName} key={"g_id" + item.gradeId}>
                        {
                            item.classData.map(function(i){
                                return <TreeNode title={i.className} gradeName={item.gradeName} className={i.className} key={i.classId} ></TreeNode>
                            })
                        }
                     </TreeNode>
         })

         return (
            <div className="content-main content-building content-schedule">
                <div className="content-box">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="统计" key="1">
                            <Row style={{paddingBottom:20}}>
                                <Col span={4} >
                                    <label>请先选择班级，再查看统计</label>
                                    <Tree
                                        showLine
                                        onSelect={this.onSelect}
                                    >
                                    {tree}    
                                    </Tree>
                                </Col>
                                <Col span={20} >
                                        <Row>
                                            <DatePicker defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)} disabledDate={this.disabledDate} format={dateFormat} onChange={this.onChange3} />&nbsp;&nbsp;&nbsp;&nbsp;
                                        </Row>
                                        <Row>
                                            <div className="table-box">
                                                {this.state.isShowTableTitle?<span>总人数 <h2>{this.state.totalCount}</h2> 人/未达标 <h2>{this.state.unReachCount}</h2> 人（当前目标值：{this.state.defaultGoal}步）</span>:null}
                                                
                                                <ul>
                                                    {this.state.dataList.map((i, index)=>{
                                                        return  <li key={index} style={{backgroundColor: i.status==0?'#ccc':''}}>
                                                                    <h3>{i.personName}</h3>
                                                                    {i.status==0?<h3>无</h3>:(i.status==1?<h3 style={{color: 'red'}}>未达标</h3>:<h3>已达标</h3>)}
                                                                    {i.status==0?"":<h3>{i.steps}步</h3>}
                                                                </li>
                                                    })}
                                                </ul>
                                            </div>
                                        </Row>
                                </Col>
                        </Row>
                        </TabPane>
                        <TabPane tab="未达标人员" key="2">
                            <Row>
                                <DatePicker defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)} disabledDate={this.disabledDate} format={dateFormat} onChange={this.onChange4} />&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export1.bind(this)}>导出</a></Button>
                            </Row>
                            <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={personList.dataList} pagination={false}/>
                            <PageIndex getPage={this.onPageChange.bind(this)} total={personList.totalCount} totalPage={personList.totalPage} currentPage={personList.currentPage}/>
                        </TabPane>
                       
                    </Tabs>
                    
                </div>
   

            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    subject: state.schedule.subject
  }
}

export default connect(mapStateToProps)(Form.create()(SportStatistics));
