import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { DatePicker,Modal, Table, Checkbox ,Tabs, Tree,Button,Select,message ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination, Upload  } from 'antd';
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



class healthStatistics extends Component{
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
            abnormalCount: 0,
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
        this.props.dispatch({
            type: 'lepayHealth/getInfoByClass',
            payload: params,
            callback: (res)=>{
                if(res.code===200){
                    this.setState({
                        dataList: res.data.list,
                        defaultGoal: res.data.defaultGoal,
                        totalCount: res.data.totalCount,
                        abnormalCount: res.data.abnormalCount,
                        isShowTableTitle: true
                    })
                }
              }
        })
    }

    getUnReachPersons=(params)=>{
        this.props.dispatch({
            type: 'lepayHealth/getAbnormalPersons',
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
            if(this.state.classId){
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
    export = () =>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let date = this.state.dateValue2;
        let url=portUrl("/manager/bracelet/temperature/export-abnormal-persons?userId="+userId+"&userType="+userType+"&accessToken="+token+"&date="+date)
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
            title: '早间',
            dataIndex: 'morning',
            render:(record)=>{
                return(<span>{record>37.3?<span style={{color: "red"}}>{record}</span>:record}</span>)
            }
          }, {
            title: '午间',
            dataIndex: 'noon',
            render:(record)=>{
                return(<span>{record>37.3?<span style={{color: "red"}}>{record}</span>:record}</span>)
            }
          }, {
            title: '晚间',
            dataIndex: 'night',
            render:(record)=>{
                return(<span>{record>37.3?<span style={{color: "red"}}>{record}</span>:record}</span>)
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
                                    <div className="tree-box">
                                        <Tree
                                            showLine
                                            onSelect={this.onSelect}
                                            >
                                        {tree}    
                                        </Tree>
                                    </div>
                                </Col>
                                <Col span={20} >
                                        <Row>
                                            <DatePicker defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)} disabledDate={this.disabledDate} format={dateFormat} onChange={this.onChange3} />&nbsp;&nbsp;&nbsp;&nbsp;
                                        </Row>
                                        <Row>
                                            <p className="tip-text">异常：体温超过37.3，在表格中以红字标明<br/>
                                            数据缺失：未获取到当前时段的体温数据，或手环不支持测温功能<br/>
                                            测量范围：体温数据测量分为3个时间段，早间（7：00-9：30）、午间（12：00-14：00）、晚间（16：00-20：00）
                                            </p>
                                        </Row>
                                        <Row>
                                            <div className="table-box">
                                                {this.state.isShowTableTitle?<span>总人数 <h2>{this.state.totalCount}</h2> 人/异常体温 <h2>{this.state.abnormalCount}</h2> 人</span>:null}
                                                
                                                <ul>
                                                    {this.state.dataList.map((i, index)=>{
                                                        return  <li key={index}>
                                                                    <h3>{i.personName}</h3>
                                                                    {i.status==2?<h3 style={{color: 'red'}}>异常</h3>:(i.status==0?<h3>数据缺失</h3>:<h3>正常</h3>)}
                                                                    {/* {i.status==0?"":<h3>{i.steps}步</h3>} */}
                                                                    <h3>
                                                                        <span style={{color: i.temperatures.morning>37.3?'red':''}}>{i.temperatures.morning?i.temperatures.morning:"-"}</span>/
                                                                        <span style={{color: i.temperatures.noon>37.3?'red':''}}>{i.temperatures.noon?i.temperatures.noon:'-'}</span>/
                                                                        <span style={{color: i.temperatures.night>37.3?'red':''}}>{i.temperatures.night?i.temperatures.night:'-'}</span>
                                                                    </h3>
                                                                </li>
                                                    })}
                                                </ul>
                                            </div>
                                        </Row>
                                </Col>
                        </Row>
                        </TabPane>
                        <TabPane tab="异常人员" key="2">
                            <Row>
                                <DatePicker defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)} disabledDate={this.disabledDate} format={dateFormat} onChange={this.onChange4} />&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
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

export default connect(mapStateToProps)(Form.create()(healthStatistics));
