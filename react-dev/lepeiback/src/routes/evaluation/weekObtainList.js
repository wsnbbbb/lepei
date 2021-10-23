import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';
import {getImg} from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class weekObtainList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          groupData: [],
          startDate:'',
          endDate:'',
          oldDate:"",
          type:"1",
          itemData:"",
          visible: false,
          calendarDetail: {}

        };
    }
    componentDidMount=()=>{
      this.props.dispatch({ //获取所有学期
          type:'user/getAllSemesters',
      })
    }

    semesterChange=(val)=>{
        if(!val) return
        let params = {
          semesterId: val
        }
        this.props.form.resetFields(["groupId"])
        this.getEvaluationGroupList(params)
    }

    getMonthDays=(year,month)=>{
        let days='';
        //判断2月份天数
        if(month==2){
            days= (year%4==0)&&(year%100!=0)||(year%400==0)? 29:28;
        }else {
                //1-7月 单数月为31日 
            if(month<7){
                days= month%2===1?31:30;
            }else if(month==7){
                days=31;
            }else{
                //8-12月 双月为31日
                days = month%2===1?30:31;
            }
        }
        return days;
    }

    renderTds=(newData,data,startYear,addNum, obtains)=>{
      newData.map((item,idx)=>{
          if(addNum[idx]!=0){
              let need=[];
              for(var i=0;i<addNum[idx];i++){
                  need.push('');
              }
              item.data=need.concat(item.data)
          }
          let dd=[]
          for(var i=0;i<item.data.length;i+=7){
              dd.push(item.data.slice(i,i+7));
          }
          item.data=dd
      })
      let num=0
      newData.map((item,idx)=>{
          const lastNum=item.data[item.data.length-1].length;
          if(idx!=0){
              item.data=item.data.slice(1)
          }
          let a;
          if(lastNum==7){a=7}else{a=7-lastNum}
          if(lastNum<=7&&idx!=newData.length-1){
              let newArr=[]
              for(var i=0;i<a;i++){
                  newArr.push(i+1)
              }
              if(lastNum==7){
                  item.data.push(newArr)
              }else{
                  item.data[item.data.length-1].push(...newArr)
              }
          }
          let arr=[]
          item.data.map((k,n)=>{
              if(lastNum==7&&n==(item.data.length-1)&&item.month<12&&item.data[item.data.length-1].indexOf(1)>=0){
                  arr.push({month:(item.year+'.'+(Number(item.month)+1)),week:'第'+(num+=1)+'周', weekIndex: num, status: obtains.includes(num), ...k})
              }else if(lastNum==7&&n==(item.data.length-1)&&item.month==12&&item.data[item.data.length-1].indexOf(1)>=0){
                  arr.push({ month:((Number(item.year)+1)+'.1'), week:'第'+(num+=1)+'周', weekIndex: num, status: obtains.includes(num), ...k})
              }else{
                  arr.push({month: (item.year+'.'+item.month), week:'第'+(num+=1)+'周', weekIndex: num, status: obtains.includes(num), ...k})
              }
          })
          data.push(...arr)
      })
    }
    renderItem=(text,record)=>{
        const arr=record.month.split('.');
        let month;
        let date=text<10?'0'+text:text;
        let newArr=[];
        let nowDate;
        for(var i in record) {
            newArr.push(record[i])
        }
        if((newArr.indexOf(1)>=0&&newArr.indexOf(31)>=0)||(newArr.indexOf(1)>=0&&newArr.indexOf(30)>=0)||(newArr.indexOf(1)>=0&&newArr.indexOf(28)>=0)||(newArr.indexOf(1)>=0&&newArr.indexOf(29)>=0)){
            if(text<=7&&arr[1]<12){
                month=Number(arr[1])+1<10?'0'+(Number(arr[1])+1):Number(arr[1])+1;
                nowDate=arr[0]+'-'+month+'-'+date;
            }else if(text<=7&&arr[1]==12){
                month='01';
                nowDate=(Number(arr[0])+1)+'-'+month+'-'+date;
            }else{
                month=arr[1]<10?'0'+arr[1]:arr[1];
                nowDate=arr[0]+'-'+month+'-'+date;
            }
            
        }else{
            month=arr[1]<10?'0'+arr[1]:arr[1];
            nowDate=arr[0]+'-'+month+'-'+date;
        }
        const {calendarDetail} =this.state;
        let startDate=calendarDetail.startDate;
        let endDate=calendarDetail.endDate;
        const {adjustdays} = this.state;
        let content;
        let itemData;
        let type;
        adjustdays&&adjustdays.map(item=>{
            if(item.currentDate==nowDate){
                content=item.remark;itemData=item;type=item.type;
            }
        })
        if(nowDate<startDate||nowDate>endDate){
            return(
                <span className="td-disabled"><span className="tool-tip">{text}</span></span>
            )
        }else{
            return(<span className={type==3?"td-adjustment":(type==2?"td-holiday":"td-normal")} 
            onDoubleClick={this.showModal.bind(this,nowDate,itemData,type)} 
            >
                {type==3?<Tooltip title={content}><span className="tool-tip">{text}<br />补{itemData&&itemData.oldDate}课</span></Tooltip>:
                <Tooltip title={content}><span className="tool-tip">{text}</span></Tooltip>}
            </span>)
        }
    }



    getEvaluationGroupList=(params)=>{
      this.props.dispatch({
        type:'evaluate/getEvaluationGroupList',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              groupData: res.data
            })
          }
        }
      })
    }
    showDetail=(record)=>{

      this.props.form.validateFields((err, values) => {
        this.props.dispatch(routerRedux.push("/obtain-flag-detail?semesterId="+values.semesterId+"&groupId="+values.groupId+"&week="+record.weekIndex))
      })

    }

    obtainFlag=(params)=>{
      this.props.dispatch({
        type:'evaluate/obtainFlag',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           
          }
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'evaluate/weekObtainList',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
            calendarDetail: res.data
           })
          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if(err) return
        const params={
          "semesterId": values.semesterId||'',
          "groupId": values.groupId||''
        }
        this.getList(params)
      })
    }

  
    toMenuManage=()=>{
      this.props.dispatch(routerRedux.push("/material-menu-manage"))
    }

    // 重置
    reset = () => {
        this.props.form.resetFields(["semesterId", "groupId"])
        this.setState({ groupData: []})
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
    }

    render(){

      const {calendarDetail} = this.state;
      const data=[];
      if(calendarDetail){

          let startDate=calendarDetail.startDate;
          let endDate=calendarDetail.endDate;
          let obtains = calendarDetail.obtains;
          let startYear=new Date(startDate).getFullYear();
          let startMonth=new Date(startDate).getMonth()+1;
          let startDay=new Date(startDate).getDate();
          let endYear=new Date(endDate).getFullYear();
          let endMonth=new Date(endDate).getMonth()+1;
          let endDay=new Date(endDate).getDate();
          let totalDays=[];
          let monthData=[];
          let newData=[]
          let addNum=[];
          if(startYear==endYear){
              const months=endMonth-startMonth+1;
              let firstDay;
              for(var i=0;i<months;i++){
                  const monthDays=this.getMonthDays(startYear,startMonth+i)//一个月有多少天
                  if(i==0){
                      firstDay=new Date(startYear,startMonth+i-1,startDay).getDay();
                  }else{
                      firstDay=new Date(startYear,startMonth+i-1,1).getDay();
                  }
                  let num;
                  if(firstDay==0){
                      num=6
                  }else{
                      num=firstDay-1
                  }
                  monthData.push(monthDays)
                  addNum.push(num)
              }
              monthData.map((item,idx)=>{
                  let everyMonth=[]
                  if(monthData.length==1){
                      for(var k=startDay-1;k<endDay;k++){
                          totalDays.push(k+1);
                          everyMonth.push(k+1)
                      }
                      return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                  }else{
                      if(idx==0){
                          for(var k=startDay-1;k<item;k++){
                              totalDays.push(k+1);
                              everyMonth.push(k+1)
                          }
                          return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                          
                      }else if(idx==monthData.length-1){
                          for(var k=0;k<endDay;k++){
                              totalDays.push(k+1);
                              everyMonth.push(k+1)
                          }
                          return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                      }else{
                          for(var k=0;k<item;k++){
                              totalDays.push(k+1);
                              everyMonth.push(k+1)
                          }
                          return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                      }
                  }
                  
              })
          }
          else if(startYear!=endYear){
              const firstMonths=12-startMonth+1;
              const lastMonths=endMonth;
              let firstMonthData=[];
              let lastMonthData=[];
              let firstNum=[];
              let lastNum=[];
              for(var i=0;i<firstMonths;i++){
                  const monthDays=this.getMonthDays(startYear,startMonth+i)
                  let firstDay;
                  if(i==0){
                      firstDay=new Date(startYear,startMonth+i-1,startDay).getDay();
                  }else{
                      firstDay=new Date(startYear,startMonth+i-1,1).getDay();
                  }
                  let num;
                  if(firstDay==0){
                      num=6
                  }else{
                      num=firstDay-1
                  }
                  firstMonthData.push(monthDays)
                  firstNum.push(num)
              }
              for(var i=0;i<lastMonths;i++){
                  const lastMonthDays=this.getMonthDays(endYear,i+1)
                  const lastFirstDay=new Date(endYear,i,1).getDay();
                  let num;
                  if(lastFirstDay==0){
                      num=6
                  }else{
                      num=lastFirstDay-1
                  }
                  lastMonthData.push(lastMonthDays)
                  lastNum.push(num)
              }
              addNum.push(...firstNum,...lastNum);
              monthData.push(...firstMonthData,...lastMonthData)
              monthData.map((item,idx)=>{
                  let everyMonth=[]
                  if(idx==0){
                      for(var k=startDay-1;k<item;k++){
                          totalDays.push(k+1);
                          everyMonth.push(k+1)
                      }
                      if(startMonth+idx>12){
                          return newData.push({year:endYear,month:idx-(12-startMonth),data:everyMonth})
                      }else{
                           return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                      }
                  }
                  else if(idx==monthData.length-1){
                      for(var k=0;k<endDay;k++){
                          totalDays.push(k+1);
                          everyMonth.push(k+1)
                      }
                      if(startMonth+idx>12){
                          return newData.push({year:endYear,month:idx-(12-startMonth),data:everyMonth})
                      }else{
                          return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                      }
                  }else{
                      for(var k=0;k<item;k++){
                          totalDays.push(k+1);
                          everyMonth.push(k+1)
                      }
                      if(startMonth+idx>12){
                          return newData.push({year:endYear,month:idx-(12-startMonth),data:everyMonth})
                      }else{
                           return newData.push({year:startYear,month:startMonth+idx,data:everyMonth})
                      }
                  }
              })
                  
          }
  
          this.renderTds(newData,data,startYear,addNum, obtains)
      }
      const columns = [{
          title: '月份',
          dataIndex: 'month',
          key: 'month',
        }, {
          title: '周次',
          dataIndex: 'week',
          key: 'week',
        }, {
          title: '周一',
          dataIndex: '0',
          key: '0',
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周二',
          key: '1',
          dataIndex: '1',
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周三',
          key: '2',
          dataIndex: '2',
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周四',
          key: '3',
          dataIndex: '3',
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周五',
          key: '4',
          dataIndex: '4',
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周六',
          key: '5',
          dataIndex: '5',
          className:"weekday",
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '周日',
          key: '6',
          dataIndex: '6',
          className:"weekday",
          render:(text, record) => (
              this.renderItem(text,record)
          )
        }, {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          render:(record) => (
            <span style={{color: record ? "#3492e9": "red"}}>{record?"已颁发":(record == false?"未颁发":'')}</span>
          )
        }, {
          title: '操作',
          key: 'weekIndex',
          dataIndex: 'weekIndex',
          render:(text, record) => (
            <a href="javascript:;" style={{color: "#3492e9"}} onClick={this.showDetail.bind(this, record)}>{record.status?"查看":(record.status == false?"颁发":'')}</a>
          )
        }];


        const { previewVisible, previewImage, fileList } = this.state;
     

     
          const qiniuToken=sessionStorage.getItem('qiniuToken');
      
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const {getHandlers,approvalRules} = this.props;
          const {appointData, groupData} = this.state;
        //   console.log(getHandlers)
          const {allTerms, commonGradeData, classNameData, } = this.props;
          let termChild=[]
          allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
          })
          let groupChild=[]
          groupData&&groupData.length>0&&groupData.map(item=>{
              groupChild.push(<Option key={item.id}>{item.groupName}</Option>)
          })
          
          const {classDisabled,classValue} = this.state;
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                        {getFieldDecorator('semesterId',{rules: [{
                            required: true,
                            message:"请选择学期",
                            whitespace: true,
                        }]})(
                          <Select placeholder="请选择学期" onChange={this.semesterChange}>
                              {termChild}
                          </Select>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                      <FormItem >
                      {getFieldDecorator("groupId",{rules: [{
                            required: true,
                            message:"请选择年级组",
                            whitespace: true,
                        }]})(
                          <Select placeholder="请选择年级组" optionFilterProp="children">
                              {groupChild}
                          </Select>
                      )}
                      </FormItem>
                  </Col>
                  <Col span={6} offset={10}>
                      <Button onClick={this.reset.bind(this)}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>     

              <Table className="calendar-table" columns={columns} bordered dataSource={data} pagination={false}/>         
              {/* <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.tableData.dataList} pagination={false}/> */}
              {/* <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.tableData.totalCount} totalPage={this.state.tableData.totalPage} currentPage={this.state.tableData.currentPage}/> */}
       
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     roomList:state.room,
    //  getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules,
     allTerms:state.user.allTerms,
     commonGradeData:state.user.commonGradeData,
     classNameData:state.user.classNameData,
  }
}
export default connect(mapStateToProps)(Form.create()(weekObtainList));
