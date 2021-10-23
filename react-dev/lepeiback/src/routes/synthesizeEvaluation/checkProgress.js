import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Select, Form, Row, Col, Progress, Modal, message} from 'antd';
import PageIndex from '../../components/page';
import './style.less';
import { log } from 'util';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class CheckProgress extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          progressList:{},
          detailList:[],
		    	title:"进度查询",
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
        type: 'user/getCommonGradeList'
      })
      this.getAllSemesters()
      		//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/report-query"
      },
      })
    }
    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
      }
    // 获取所有学期
    getAllSemesters = () =>{
      let that = this
      this.props.dispatch({
        type: 'user/getAllSemesters',
        callback:(res) =>{
          if(res.code === 200){
            res.data&&res.data.map(item =>{
              if(item.isCurrent === true){
                this.setState({
                  defaultVal:item.semesterId,
                  semesterId:item.semesterId
                })
                const params = {
                  "page":1,
                  "prePage":20,
                  "semesterId":item.semesterId
                }
                that.progressList(params)
              }
            })
          }
        }
      })
    }
   
    // 获取进度列表
    progressList = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/progressList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              progressList:res.data,
              detailList:res.data.dataList
            })
          }
        }
      })
    }
     // 年级
     gradeChange = (val)=>{
      if(val){
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":val},
          callback:(res)=>{
            if(res.code===200){
                this.setState({
                  disabled:false
                })
            }
          }
        })
      }else{
        this.setState({
          disabled:true,
        })
      }
    }
    
    // 学期选择
    termSelect = (value) =>{
      this.setState({
        semesterId:value
      })
    }
    // 查询
    search = () =>{
      this.props.form.validateFields((err,values) =>{
        const params = {
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw || '',
          "semesterId":values.semesterId,
          "gradeId":values.gradeId || '',
          "classId":values.classId || '',
        }
        this.progressList(params)
      })
    } 
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields((err,values) =>{
        this.setState({page:current,prePage:size})
        if(!err){
          const params = {
            "page":current,
            "prePage":size,
            "kw":values.kw || '',
            "semesterId":values.semesterId,
            "gradeId":values.gradeId || '',
            "classId":values.classId || '',
          }
          this.progressList(params)
        }
      })
    }
    // 一键提醒
    remind = (id) =>{
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要推送吗？</span>,
        onOk() {
          me.props.dispatch({
          type:'synthesizeEvaluation/remind',
          payload:{"classId":id},
          callback:(res)=>{
            if(res.code===200){
              message.success('推送成功！')
            }
          }
        })
        },
        onCancel() {},
      });
    }
    render(){
      const { progressList, detailList,defaultVal,} = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:6 },
        wrapperCol: { span: 18 }
      };
      const columns = [{
        title: '学期',
        dataIndex: 'semesterName',
      },{
        title: '年级',
        dataIndex: 'gradeName',
      },{
        title: '班级',
        dataIndex: 'className',
      },{
        title: '进度',
        width:300,
        dataIndex: 'percent',
        render:(record) =>(
          <div style={{width:200}}>
            <Progress percent={record}/>
          </div>
        )
      },{
        title: '操作',
        width:200,
        dataIndex: '',
        render:(record) => (
          <span>
            <a href="javascript:;" onClick={this.remind.bind(this,record.classId)}>一键提醒</a>
          </span>
        )
      }
      ]
        const {allTerms, commonData, gradeList } = this.props;
        let termChild = []
        allTerms&&allTerms.length>0&&allTerms.map(item => {
          termChild.push(<Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>)
        })
        let classOptions = [];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
        })
        let options = []
        gradeList&&gradeList.length>0&&gradeList.map(item => {
          return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })
        return (
          <div className="content-main">     
              <Form style={{padding:"10px 0"}}>
                <Row gutter={24}>
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'学期'}>
                        {getFieldDecorator('semesterId',{initialValue:defaultVal})(
                          <Select onChange={this.termSelect.bind(this)}>
                              {termChild}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch placeholder="请选择" onChange={this.gradeChange.bind(this)}>
                          <Option value="">全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      {getFieldDecorator("classId",{initialValue:''})(
                        <Select showSearch placeholder="请选择" disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                    <Col span={5} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={progressList.totalCount} totalPage={progressList.totalPage} currentPage={progressList.currentPage}/>
          </div>     
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(CheckProgress));
