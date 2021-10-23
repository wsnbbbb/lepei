import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import {getQueryString} from '../../utils/public';
import {  Breadcrumb , Form,Table,Modal ,Row,Col,Input,Select, message,DatePicker,Tooltip    } from 'antd';
import './style.less';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
class SchoolCalendarManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            startDate:'',
            endDate:'',
            oldDate:"",
            type:"1",
            itemData:"",
            visible: false,
            title:"校历管理",
        }
    }
  

    componentDidMount=()=>{
        const semesterId=getQueryString('semesterId');
        const params={
            "semesterId": semesterId
        }
        this.getCalendarDetail(params)
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/term-manage"
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
    getCalendarDetail=(params)=>{
        this.props.dispatch({
            type:'term/getCalendar',
            payload:params,
            callback:(res)=>{
                if(res.code==200){
                    this.setState({
                        adjustdays:res.data.adjustDays,type:"1"
                    })
                }
            }
        })
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
    showModal = (nowDate,itemData,type) => {
        this.setState({
          visible: true,
          nowDate:nowDate,
          itemData:itemData?itemData:'',
          oldDate:itemData?itemData.oldDate:nowDate,
          type:type
        });
    }
    
    handleOk = (e) => {
        const semesterId=getQueryString('semesterId');
        this.props.form.validateFields((err, values) => {
            const params={
                "currentDate":values.currentDate,"semesterId":semesterId,"type":values.type,
                "oldDate":this.state.oldDate,"remark":values.remark
            }
            if(!err){
                this.props.dispatch({
                    type:'term/addCalendar',
                    payload:params,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success('调整成功',2);
                            this.setState({oldDate:"",type:'1',itemData:"",visible: false,});
                            this.props.form.resetFields(['remark','type']);
                            const params={
                                "semesterId": semesterId
                            }
                            this.getCalendarDetail(params)
                        }
                    }
                })
            }
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,oldDate:"",type:'1',itemData:""
        });
        this.props.form.resetFields(['remark','type']);
    }
    handleChange=(val)=>{
        this.setState({type:val})
    }
    onChange=(date, dateString)=> {
        console.log(dateString)
        this.setState({oldDate:dateString})
    }
    renderTds=(newData,data,startYear,addNum)=>{
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
                    arr.push({month:(item.year+'.'+(Number(item.month)+1)),week:'第'+(num+=1)+'周',...k})
                }else if(lastNum==7&&n==(item.data.length-1)&&item.month==12&&item.data[item.data.length-1].indexOf(1)>=0){
                    arr.push({month:((Number(item.year)+1)+'.1'),week:'第'+(num+=1)+'周',...k})
                }else{
                    arr.push({month:(item.year+'.'+item.month),week:'第'+(num+=1)+'周',...k})
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
        const {calendarDetail} =this.props;
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
    render(){
        const {calendarDetail} =this.props;
        const {itemData,type,nowDate} = this.state;
        const data=[];
        if(calendarDetail){
            let startDate=calendarDetail.startDate;
            let endDate=calendarDetail.endDate;
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
            this.renderTds(newData,data,startYear,addNum)
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
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main content-calendar" >
                {/* <div className="content-box">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/term-manage"}>学期管理</Link> \ 校历管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <div className="tip-box"><span className="normal"></span>正常</div>
                <div className="tip-box"><span className="adjust"></span>调课</div>
                <div className="tip-box"><span className="holiday"></span>放假</div>
                <Table className="calendar-table" columns={columns} bordered dataSource={data} pagination={false}/>
                <Modal
                    title="校历调整"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form">
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'当前日期'}>
                                {getFieldDecorator("currentDate",{initialValue:nowDate})(
                                <Input disabled/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'类型'}>
                                {getFieldDecorator("type",{initialValue:type||"1"})(
                                    <Select onChange={this.handleChange}>
                                        <Option value="1">正常</Option>
                                        <Option value="2">放假</Option>
                                        <Option value="3">补课</Option>
                                    </Select>
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                        {type==3?<Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'原上课时间'}>
                                {getFieldDecorator("oldDate",{initialValue:moment(itemData&&itemData.oldDate||nowDate, dateFormat),rules:[{required:true,message:"请选择时间"}]})(
                                    <DatePicker onChange={this.onChange} format={dateFormat}/>
                                )}
                            </FormItem>
                            </Col>
                        </Row>:null}
                        <Row gutter={24}>
                            <Col span={20}>
                            <FormItem {...formItemLayout} label={'备注'}>
                                {getFieldDecorator("remark",{initialValue:itemData&&itemData.remark||""})(
                                <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                                )}
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>    
                </Modal>
            </div>
        );
    }
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     calendarDetail: state.term.calendarData
  }
}

export default connect(mapStateToProps)(Form.create()(SchoolCalendarManage));
