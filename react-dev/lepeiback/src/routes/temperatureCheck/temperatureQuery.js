import React,{ Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, DatePicker, Alert } from 'antd';
import PageIndex from '../../components/page';
import moment from 'moment';
import { getSexType, formatDate} from '../../utils/public';
import { portUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class TemperatureQuery extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false, 
          confirmLoading: false,
          detail:{},
          statisticsList:{},
          datas:[],
          gradeId:'',
          classValue:'',
          exportUrl:'',
          date:moment().format('YYYY-MM-DD'),
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":this.state.prePage,
        "date":this.state.date,
      }
      this.personTemperature(params)

      let _this = this;
      setInterval(() =>{
        setTimeout(function() {
          _this.search()
        },0)
      },1800000)

      this.props.dispatch({
      type:'user/getCommonGradeList'
      })
    }
    // 获取体温查询列表
    personTemperature=(params)=>{
      this.props.dispatch({
        type:'temperatureCheck/temperatureQuery',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              statisticsList:res.data.statistics,
              datas:res.data.dataList,
              detail:res.data
            })
          }
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "personType":values.personType || '',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "inResidence":values.inResidence || '',
          "status":values.status || '',
          "date":this.state.date ,
        }
        this.personTemperature(params)
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
          "personType":values.personType || '',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "inResidence":values.inResidence || '',
          "status":values.status || '',
          "date":this.state.date ,
        }
        this.personTemperature(params)
      })
    }

     // 导出
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let personType = values.personType || '';
        let kw=values.kw||'';
        let gradeId = values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length)||'';
        let classId = this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length)||'';
        let inResidence = values.inResidence || '';
        let status = values.status||0;
        let date = this.state.date;
        let url=portUrl("/manager/person-temperature/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&personType="+personType+
          "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&inResidence="+inResidence+"&status="+status+"&date="+date)
        this.setState({exportUrl:url})
      })
    }
  
    // 年级选择
    gradeChange=(val)=>{
      console.log({val});
      
      if(val){
        // this.setState({disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:''})
      }
    }
    // 班级选择
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    // 财务入账时间
    onTimeChange = (date, dateString) => {
      this.setState({
        date:dateString
      })
    }
    render(){
      const { detail, statisticsList, datas, } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const formItemLayout1 = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
      };
     
      let timestamp = (new Date()).getTime();
      const columns = [
          {
            title: '姓名',
            dataIndex: 'personName',
          },{
            title: '性别',
            dataIndex: 'personSex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          },{
            title: '类型',
            dataIndex: 'personType',
            render:(record)=>{
              return(
                <span>{record == 1 ? '学生' : (record == 2 ? '教师' : (record == 3 ? '员工' : ''))}</span>
              )
            }
          },{
            title: '年级',
            dataIndex: 'gradeName',
          },{
            title: '班级',
            dataIndex: 'className',
          },{
            title: '读书形式',
            dataIndex: '',
            render:(record)=>{
              return(<span>{record.personType == 2?'':(record.inResidence == 1?'住读':(record.inResidence == 2?'走读':''))}</span>)
            }
          },{
            title: '检测时间',
            dataIndex: 'detectTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '体温是否异常',
            dataIndex: 'status',
            render:(record)=>(
              <span>{record == 1?'正常':(record == 2?'异常':'')}</span>
            )
            
          },{
            title: '体温℃',
            dataIndex: 'temperature',
          },{
            title: '图片',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">{record.picUrl ? <a href={record.picUrl} target="_blank">查看</a> : null}</span>
            )
        }
      ];
      const {commonData,gradeList} = this.props;
      let classOptions=[];
      commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
        return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
      })
      let options=[]
      gradeList&&gradeList.length>0&&gradeList.map(item=>{
        return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
      })
        return (
            <div className="content-main temperature-query">
              <Form>
                <Row gutter={24}>
                  <Col span={3}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入姓名"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={3}>
                    <FormItem {...formItemLayout1} label={'人员类型'}>
                      {getFieldDecorator("personType",{initialValue:''})(
                        <Select>
                          <Option value=''>全部</Option>
                          <Option value='1'>学生</Option>
                          <Option value='2'>教师</Option>
                          <Option value='3'>员工</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout1} label={'读书形式'}>
                    {getFieldDecorator("inResidence",{initialValue:''})(
                        <Select>
                          <Option value='' >全部</Option>
                          <Option value={1} >住读</Option>
                          <Option value={2} >走读</Option>
                        </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout1} label={'是否异常'}>
                    {getFieldDecorator("status",{initialValue:''})(
                        <Select showSearch >
                          <Option value='' >全部</Option>
                          <Option value={1} >正常</Option>
                          <Option value={2} >异常</Option>
                        </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={3} >
                    <FormItem label=''>
                      {getFieldDecorator("date",{initialValue:moment(this.state.date)})(
                        <DatePicker onChange={this.onTimeChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={3} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button><a  href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                  
                </Row>
              </Form>  
              <Alert message="说明：统计情况每30分钟更新一次，相关人员一天内多次测温，任意一次体温超过37.3℃，皆算作体温异常。本统计只展示一天的数据统计（24时清零）" type="warning" showIcon />
              <div className="statistics">
                <div>
                  <p className="title">总人数</p>
                  <p className="number">{statisticsList.totalCount}</p>
                </div>
                <div>
                  <p className="title">已测温人数</p>
                  <p className="number">{statisticsList.detectCount}</p>
                </div>
                <div>
                  <p className="title">未测温人数</p>
                  <p className="number">{statisticsList.unDetectCount}</p>
                </div>
                <div>
                  <p className="title">体温正常人数</p>
                  <p className="number">{statisticsList.normalCount}</p>
                </div>
                <div>
                  <p className="title">体温异常人数</p>
                  <p className="fontRed">{statisticsList.abnormalCount}</p>
                </div>
                <div>
                  <p className="title">体温异常率</p>
                  <p className="number">{statisticsList.abnormalRate}</p>
                </div>
              </div>            
              <Table scroll={{ x: 1000 }} columns={columns} dataSource={datas} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={detail.totalCount} totalPage={detail.totalPage} currentPage={detail.currentPage}/> 
              
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(TemperatureQuery));
