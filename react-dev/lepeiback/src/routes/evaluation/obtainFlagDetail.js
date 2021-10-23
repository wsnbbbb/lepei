import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,Breadcrumb, DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
// import SetClassScore from './setClassScore';
import { getDays,getAllDays,formatDate, isNumber, getDateData,toDecimal2, getQueryString,defaultDate,getMonthDays } from '../../utils/public';
import echarts from 'echarts';
import PageIndex from '../../components/page';
import ImgPreview from '../../components/imgPreview';
import {getImg,portUrl} from '../../utils/img';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import "./style.less";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;
const Step = Steps.Step;
const confirm = Modal.confirm;

class obtainFlagDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classScoreDetails: '',
            tbodyData: '',
            title:"流动红旗配置",

        };
    }
    componentDidMount=()=>{
        this.flagObtainDetail()
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/week-obtain-list"
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

    flagObtainDetail=(e)=>{
        this.props.dispatch({
            type:'evaluate/flagObtainDetail',
            payload: {
                semesterId: getQueryString("semesterId"),
                groupId: getQueryString("groupId"),
                week: getQueryString("week"),
            },
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                        classScoreDetails: res.data,
                        thData: res.data.header
                   })
                   let tbodyData = res.data.classData
                   tbodyData.forEach(grade => {
                        let gradeData = [];
                        grade.classList.forEach(cls => {
                            let flag = false
                            if(cls.flags.length==0){
                                flag = true
                            }else if(cls.flags.length>0){
                                flag = cls.flags.some(i=>{
                                    return i.typeId == 0
                                })
                            }
                            cls.cates.map(i=>{
                                let arr = []
                                cls.typeRecords.map(j=>{
                                    if(j.typeId==i.typeId){
                                        arr.push(j)
                                    }
                                })
                                i.td=arr
                                cls.typeCalculate.map(k=>{
                                    if(k.typeId==i.typeId){
                                        i.td1=k
                                    }
                                })
                                if(flag){
                                    i.merge = true
                                    let arr = cls.flags.filter(e=>{
                                        return e.typeId == 0
                                    })
                                    if(arr.length==1){
                                        i.iconData=arr[0]
                                    }else{
                                        i.iconData={
                                            blank: true
                                        }
                                    }
                                }else{
                                    i.merge = false
                                    let arr = cls.flags.filter(e=>{
                                        return e.typeId == i.typeId
                                    })
                                    if(arr.length==1){
                                        i.iconData=arr[0]
                                    }else{
                                        i.iconData={
                                            blank: true
                                        }
                                    }
                                }
                            })
                        })
                        gradeData.push(grade.classList)
                    })
                    this.setState({
                        tbodyData: tbodyData
                    })
                    console.log({tbodyData})
                }
            }
        })
    }

    cancel=(id)=>{
        let me = this
        confirm({
            title: '提示',
            content: '你确定要取消颁发吗?',
            onOk() {
                me.props.dispatch({
                    type:'evaluate/obtainFlag',
                    payload:{"id": id},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("操作成功！")
                            setTimeout(() => {
                                me.flagObtainDetail()
                            }, 500);
                        }
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    obtain=(id)=>{
        let me = this
        confirm({
            title: '提示',
            content: '你确定要颁发吗?',
            onOk() {
                me.props.dispatch({
                    type:'evaluate/obtainFlag',
                    payload:{"id": id},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("操作成功！")
                            setTimeout(() => {
                                me.flagObtainDetail()
                            }, 500);
                        }
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render(){
        const { tbodyData, classScoreDetails} = this.state;
        return (
            <div className="content-main">
               {/* <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/week-obtain-list">流动红旗颁发</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>流动红旗配置</Breadcrumb.Item>
                </Breadcrumb> */}
                    
                <table border="1" className="class-score-table" style={{margin:'10px 10px 50px 10px' }}>
                    <thead>
                        <tr>
                            <th>年级</th><th>班级</th><th>考评项</th>
                            {
                                classScoreDetails&&classScoreDetails.header.map((item,i)=>
                                <th>
                                    {item.headerBottom.substring(5)}<br/>
                                    ({item.headerTop})
                                </th>
                            )
                            }
                            <th>单项总分</th>
                            <th>单项平均分</th>
                            <th>总分</th><th>平均分年级排名</th><th>总分年级排名</th><th>操作</th>                                    
                        </tr>
                    </thead>
                    <tbody>
                        {tbodyData&&tbodyData.length!=0&&tbodyData.map((i, idx) =>
                            i.classList.map((j, index)=>
                                j.cates.map((h, hIndx)=>
                                    <tr key={hIndx}>
                                        {index === 0 && hIndx === 0 ? <td rowSpan={i.classList.length * j.cates.length}>{i.gradeName}</td> : null}
                                        {hIndx==0?<td rowSpan={j.cates.length}>{j.className}</td> :null}
                                        <td>{h.cateName}</td>
                                        {classScoreDetails&&classScoreDetails.header.map((item,i)=>{
                                            let score = ''
                                            h.td.map((e, eIndex)=>{
                                                if(item.date==e.date){
                                                    score = e.score
                                                }
                                            })
                                            return <td key={i}>{score?score:"-"}</td>
                                            }
                                        )}
                                        <td>{h.td1&&h.td1.typeTotalScore?h.td1.typeTotalScore:""}</td>
                                        <td>{h.td1&&h.td1.typeAverageScore?h.td1.typeAverageScore:''}</td>
                                        {hIndx==0?<td rowSpan={j.cates.length}>{j.totalScore}</td> :null}
                                        {hIndx==0?<td rowSpan={j.cates.length}>{j.rank}</td> :null}
                                        {hIndx==0?<td rowSpan={j.cates.length}>{j.rank}</td> :null}
                                        {hIndx==0&&h.merge&&h.iconData.isObtain==0&&h.iconData.typeId==0?<td rowSpan={j.cates.length}><a href="javascript:;" onClick={this.obtain.bind(this, h.iconData.id)}>颁发</a></td> :null}
                                        {hIndx==0&&h.merge&&h.iconData.isObtain==1&&h.iconData.typeId==0?<td rowSpan={j.cates.length}><img className="flag-icon" src={getImg(h.iconData.flagIcon)} />&nbsp;&nbsp;<a href="javascript:;" onClick={this.cancel.bind(this, h.iconData.id)}>取消</a></td> :null}
                                        {hIndx==0&&h.merge&&h.iconData.blank?<td rowSpan={j.cates.length}></td>:null}
                                        {!h.merge&&h.iconData.blank?<td></td>:null}
                                        {!h.merge&&h.iconData.isObtain==0?<td><a href="javascript:;" onClick={this.obtain.bind(this, h.iconData.id)}>颁发</a></td> :null}
                                        {!h.merge&&h.iconData.isObtain==1?<td><img className="flag-icon" src={getImg(h.iconData.flagIcon)} />&nbsp;&nbsp;<a href="javascript:;" onClick={this.cancel.bind(this, h.iconData.id)}>取消</a></td> :null}
                                    </tr>   
                                )   
                            )
                        )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps)(Form.create()(obtainFlagDetail));
