import React,{Component} from 'react';

import { connect } from 'dva';
import { Table,Modal,Spin ,Tooltip, DatePicker, InputNumber,Divider,Tabs, Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import {formatDate, toTimestamp, isBlank} from '../../utils/public';
import PageIndex from '../../components/page';
import {portUrl} from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class TrustManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputText:'',
            trustListData: {},
            enrolStatus: "",
            trustRecordsData: {},
            classId: undefined,
            gradeId: undefined,
            gradeList: [],
            classList: [],
            trustStartTime: undefined,
            trustEndTime: undefined,
            page: 1,
            prePage: 20,
            page1: 1,
            prePage1: 20,
            visibleRefund: false,
            reason: undefined,
            orderNo: null,
            kw: undefined,
            kw1: undefined,
            // loading: state.loading.models.users,
        };
    }

    componentDidMount=()=>{
        const params={
            "kw":"",
            "page":1,
            "prePage":20
        }
        this.trustList(params)
        this.trustRecords(params)
        this.commonGradeList()
    }
        
    commonGradeList=()=>{
        this.props.dispatch({
            type:'trustManage/commonGradeList',
            payload:{},
            callback: res=>{
                if(res.code==200){
                    this.setState({
                        gradeList: res.data
                    })
                }
            }
        })
    }

    getClassName=(id)=>{
        this.props.dispatch({
            type:'trustManage/getClassName',
            payload:{
                gradeId: id
            },
            callback: res=>{
                if(res.code==200){
                    this.setState({
                        classList: res.data
                    })
                }
            }
        })
    }


    trustList=(params)=>{
        this.props.dispatch({
            type:'trustManage/trustList',
            payload:params,
            callback: res=>{
                if(res.code==200){
                    res.data&&res.data.dataList.map(item=>{
                        item.time1=[item.enrolStartTime, item.enrolEndTime]
                        item.time2=[item.trustStartTime, item.trustEndTime]
                    })
                    this.setState({
                        trustListData: res.data
                    })
                }
            }
        })

    }

    trustRecords=(params)=>{
        this.props.dispatch({
            type:'trustManage/trustRecords',
            payload:params,
            callback: res=>{
                if(res.code==200){
                    res.data&&res.data.dataList.map(item=>{
                        item.time=[item.enrolStatus, item.enrolTime, item.cancelTime]
                    })
                    this.setState({
                        trustRecordsData: res.data
                    })
                }
            }
        })

    }
  

    onChange=(e)=> {
        this.setState({
            kw: e.target.value
        })
    }

    onChange1=(e)=> {
        this.setState({
            kw1: e.target.value,
            classList: undefined
        })
    }

    onChange2=(value)=> {
        this.setState({
            gradeId: value,
            classList: [],
            classId: undefined
        })
        if(value){
            this.getClassName(value)
        }else{
            this.setState({
                classId: ''
            })
        }
    }

    onChange3=(value)=> {
        this.setState({
            classId: value
        })
    }

    onChange4=(value)=> {
        this.setState({
            enrolStatus: value
        })
    }
    onChange5=(e)=> {
        this.setState({
            reason: e.target.value
        })
    }
    search=()=>{
        const params={
            "kw": this.state.kw||'',
            "page": 1,
            "prePage": 20,
            "trustStartTime": toTimestamp(this.state.trustStartTime,true)||"",
            "trustEndTime": toTimestamp(this.state.trustEndTime)||""
        }
        this.trustList(params)
    }
    search1=()=>{
        const params={
            "kw": this.state.kw1||'',
            "enrolStatus": this.state.enrolStatus||'',
            "classId": this.state.classId||'',
            "gradeId": this.state.gradeId||'',
            "page": 1,
            "prePage": 20
        }
        this.trustRecords(params)
    }

    // ??????
    onPageChange=(current,size)=>{
        this.setState({page:current,prePage:size})
        const params={
            "page":current,
            "prePage":size,
            "kw": this.state.kw||'',
            "trustStartTime": toTimestamp(this.state.trustStartTime,true)||"",
            "trustEndTime": toTimestamp(this.state.trustEndTime)||""
        }
        this.trustList(params)
    }
    // ??????
    onPageChange1=(current,size)=>{
        this.setState({page1:current,prePage1:size})
        const params={
            "page":current,
            "prePage":size,
            "kw": this.state.kw1||'',
            "enrolStatus": this.state.enrolStatus||'',
            "classId": this.state.classId||'',
            "gradeId": this.state.gradeId||'',
        }
        this.trustRecords(params)
    }

    editSemester=(id)=>{
        this.props.dispatch(
            routerRedux.push(`/edit-term/${id}`)
        )
    }

    delSemester=(id)=>{
        let _this=this;
        confirm({
          title: '??????',
          content: '???????????????????????????',
          onOk() {
                _this.props.dispatch({
                type:'term/delTerm',
                payload:{"semesterId": id},
                callback:(res)=>{
                    if(res.code===200){
                        message.success('???????????????', 3)
                        const params={
                            "kw":"",
                            "page":1,
                            "prePage":20
                        }
                        _this.getClassData(params)
                    }
                }
                })
            }
        })
    }
    onChangeRange1=(date, dateString)=>{
        this.setState({
            trustStartTime: dateString[0],
            trustEndTime: dateString[1]
        })
    }
    newTerm=()=>{
        this.props.dispatch(
            routerRedux.push("/new-trust")
        )
    }
    calendarManage=(id)=>{
        this.props.dispatch(
            routerRedux.push("/edit-trust/"+id)
        )
    }
  
    deleteTrust=(id)=>{
        let me=this;
        confirm({
          title: '????????????',
          content: '?????????????????????????????????????????????????????????????????????????????????????',
          onOk() {
            me.props.dispatch({
                type:'trustManage/deleteTrust',
                payload:{
                    trustId: id
                },
                callback:(res)=>{
                    if(res.code===200){
                       message.success("???????????????")
                       const params={
                        "page": me.state.page,
                        "prePage": me.state.prePage,
                        "kw": me.state.kw||'',
                      }
                      me.trustList(params)
                    }
                }
            })
          },
          onCancel() {
            console.log('Cancel');
          }
        })
    }
    handleRefundOk=()=>{
        if(isBlank(this.state.reason)){
            message.warn("?????????????????????")
            return
        }
        this.props.dispatch({
            type:'trustManage/refund',
            payload:{
                orderNo: this.state.orderNo,
                reason: this.state.reason
            },
            callback: res=>{
                if(res.code==200){
                    message.success("???????????????")
                    this.setState({
                        visibleRefund: false,
                        reason: undefined,
                    })
                    const params={
                        "page": this.state.page1,
                        "prePage": this.state.prePage1,
                        "kw": this.state.kw1||'',
                        "enrolStatus": this.state.enrolStatus||'',
                        "classId": this.state.classId||'',
                        "gradeId": this.state.gradeId||'',
                    }
                    this.trustRecords(params)
                }
            }
        })
    }
    handleRefundCancel=()=>{
      this.setState({
          visibleRefund: false,
          reason: undefined,
      })
    }
    toDetail= (trustId,studentId) => {
        let url = window.location.href.substring(0, window.location.href.lastIndexOf("/"))
        console.log({url});
        window.open(url+"/record-detail?trustId=" + trustId + '&studentId=' + studentId);
        // routerRedux.push("/edit-trust/"+id)
    }
    refund=(id)=>{
        this.setState({
            orderNo: id,
            visibleRefund: true,
        })
    }
    export=()=>{
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:????????????,3:APP??????
          let userId=sessionStorage.getItem("userId");
          let kw=this.state.kw1||'';
          let gradeId=this.state.gradeId||'';
          let classId=this.state.classId||'';
          let enrolStatus=this.state.enrolStatus||'';
          let url=portUrl("/manager/trust/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&enrolStatus="+enrolStatus)
          this.setState({exportUrl:url})
      }
    render(){
        const {termList} =this.props;
          const columns = [{
            title: '??????',
            dataIndex: 'id',
          }, {
            title: '????????????',
            dataIndex: 'name',
          }, {
            title: '??????',
            dataIndex: 'gradeName',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="des-content">{record}</span>
              </Tooltip>)
              }
          } ,{
            title: '????????????',
            dataIndex: 'teacherName',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="des-content">{record}</span>
              </Tooltip>)
            }
          } ,{
            title: '????????????',
            dataIndex: 'time1',
            render:(time1)=>{
                return(<span>{formatDate(time1[0])}~<br/>{formatDate(time1[1])}</span>)
            }
          }, {
            title: '????????????',
            dataIndex: 'time2',
            render:(time2)=>{
                return(<span>{formatDate(time2[0])}~<br/>{formatDate(time2[1])}</span>)
            }
          }, {
            title: '??????',
            dataIndex: 'isCharge',
            render:(record)=>{
                return(<span>{record == 0 ? '???' : (record == 1 ? '???' : '')}</span>)
            }
          }, {
            title: '??????',
            dataIndex: '',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.calendarManage.bind(this, record.id)}>??????</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={this.deleteTrust.bind(this, record.id)}>??????</a>
                </span>
            ),
          }]
          const columns1 = [{
            title: '????????????',
            dataIndex: 'name',
          },{
            title: '????????????',
            dataIndex: 'isCharge',
            render:(record)=>{
                return(<span>{record == 0 ? '???' : (record == 1 ? '???' : '')}</span>)
            }
          },{
            title: '????????????',
            dataIndex: 'studentName',
          },{
            title: '????????????',
            dataIndex: 'gradeName',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="des-content">{record}</span>
              </Tooltip>)
              }
          },{
            title: '????????????',
            dataIndex: 'sex',
            render:(record)=>{
                return( <span>
                    {record==1?"???":"???"}
                </span>)
              }
          },{
            title: '????????????',
            dataIndex: 'phone',
          },{
            title: '??????',
            dataIndex: 'enrolStatus',
            render:(record)=>{
                return( <span>{record == 1 ? "?????????" : "?????????"}</span>)
            }
          },{
            title: '??????',
            dataIndex: 'time',
            render:(time)=>{
                return( <span>{formatDate(time[0] == 1 ? time[1] : time[2])}</span>)
            }
          },{
            title: '??????',
            dataIndex: 'fee',
          }, {
            title: '??????',
            width:100,
            render: (record) => (
                <span>
                    <a href="javascript:;" onClick={this.toDetail.bind(this, record.trustId,record.studentId)}>??????</a>
                    {
                        // record.isCharge == 1 && record.fee != '0.00' && record.enrolStatus == 1 ? (<span><Divider type="vertical" /><a href="javascript:;" onClick={this.refund.bind(this, record.orderNo)}>??????</a></span>):""
                    }
                   
                </span>
            ),
          }]
          const option1 = this.state.gradeList&&this.state.gradeList.map((item, index)=>{
            return <Option key={index} value={item.gradeId}>{item.gradeName}</Option>
          })
          const option2 = this.state.classList&&this.state.classList.map((item, index)=>{
            return <Option key={index} value={item.classId}>{item.className}</Option>
          })
        return (
           
            <div className="content-main content-building content-termManage content-trust">
                <div className="content-box">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item>????????????</Breadcrumb.Item>
                    </Breadcrumb> */}
                     <Tabs defaultActiveKey="1">
                        <TabPane tab="????????????" key="1">
                            <Row>
                                <Input style={{ width: 200 }} placeholder="????????????" value={this.state.kw} onChange={this.onChange.bind(this)} onPressEnter={this.search.bind(this)} />
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <RangePicker
                                format={"YYYY/MM/DD"}
                                placeholder={['??????????????????', '??????????????????']}
                                onChange={this.onChangeRange1}
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={this.search.bind(this)} >??????</Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={this.newTerm}>??????</Button>
                            </Row>
                            <Row>
                                <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.trustListData.dataList} pagination={false}/>
                                <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.trustListData.totalCount} totalPage={this.state.trustListData.totalPage} currentPage={this.state.trustListData.currentPage}/>
                            </Row>
                        </TabPane>
                        <TabPane tab="????????????" key="2">
                            <Row>
                                <Input style={{ width: 200 }} placeholder="????????????/???????????????/????????????" value={this.state.kw1} onChange={this.onChange1.bind(this)} style={{ width: 200 }} />
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select value={this.state.gradeId} placeholder="???????????????" onChange={this.onChange2.bind(this)} style={{ width: 120 }} >
                                    <Option value=''>??????</Option>
                                    {option1}
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select value={this.state.classId} placeholder="???????????????" onChange={this.onChange3.bind(this)} style={{ width: 120 }} >
                                    <Option value=''>??????</Option>
                                    {option2}
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select value={this.state.enrolStatus} onChange={this.onChange4.bind(this)} style={{ width: 120 }} >
                                    <Option value="">??????</Option>
                                    <Option value="1">?????????</Option>
                                    <Option value="2">?????????</Option>
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={this.search1.bind(this)} >??????</Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>??????</a></Button>
                            </Row>
                            <Row>
                                <Table className='content-table' scroll={{ x: 1000 }} columns={columns1} dataSource={this.state.trustRecordsData.dataList} pagination={false}/>
                                <PageIndex getPage={this.onPageChange1.bind(this)} total={this.state.trustRecordsData.totalCount} totalPage={this.state.trustRecordsData.totalPage} currentPage={this.state.trustRecordsData.currentPage}/>
                            </Row>
                        </TabPane>
                       
                    </Tabs>
                  
                </div>
                <Modal
                    title="????????????"
                    visible={this.state.visibleRefund}
                    onOk={this.handleRefundOk.bind(this)}
                    onCancel={this.handleRefundCancel.bind(this)}
                >
                     <Row>
                        <label><span style={{color: "red"}}>*</span>???????????????</label>
                        <TextArea className="text-area-refuse" placeholder="????????????????????????200?????????" value={this.state.reason} onChange={this.onChange5.bind(this)} maxLength="200" style={{ width: 300 }} rows={4} />
                    </Row>
                    <Row>
                        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            ????????????????????????????????????????????????</label>
                    </Row>
              </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // termList: state.term.dataList
  }
}

export default connect(mapStateToProps)(TrustManage);
