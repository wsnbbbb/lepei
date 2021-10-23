import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Select,Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
import {onlyDate} from '../../utils/public';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class ScoreMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false,
          startTime:'',
          endTime:'',
          scoreData: []
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
        "status":-1
      }
      this.getStudentScore()
    }
    getSalary=(params)=>{
      this.props.dispatch({
        type:'salary/getSalaryList',
        payload: params
      })
    }
    getStudentScore=()=>{
      this.props.dispatch({
        type:'studentScore/getStudentScore',
        payload: {},
        callback: (res)=>{
          if(res.code==200){
            this.setState({
              scoreData: res.data
            })
          }
        }

      })
    }
    onTimeChange=(date,dateString)=> {
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "status":values.status||-1,
          "startTime":this.state.startTime||'',
          "endTime":this.state.endTime||''
        }
        this.getSalary(params)
      })
    }
    //发布工资条
    pubShowConfirm=(id)=>{
        let me=this;
        confirm({
            title: '提示',
            content: '确定要发布这则工资条吗？',
            onOk() {
                me.props.dispatch({
                    type:'salary/publishSalary',
                    payload:{"salaryId":id},
                    callback:(res)=>{
                    if(res.code===200){
                        message.success('发布成功！',3)
                        me.props.form.validateFields((err, values) => {
                        const params={
                            "page":me.state.page,
                            "prePage":me.state.prePage,
                            "status":values.status||-1,
                            "startTime":me.state.startTime||'',
                            "endTime":me.state.endTime||''
                        }
                        me.getSalary(params)
                        })
                    }
                    }
                })
            },
            onCancel() {},
        });
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条数据吗？',
        onOk() {
          me.props.dispatch({
            type:'studentScore/deleteStudentScore',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.getStudentScore()
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
            "page":current,
            "prePage":size,
            "status":values.status||-1,
            "startTime":this.state.startTime,
            "endTime":this.state.endTime
        }
        this.getSalary(params)
      })
    }
    addScore=()=>{
      this.props.dispatch(routerRedux.push("/add-studentScore"))
    }
    edit=(id)=>{
      this.props.dispatch(routerRedux.push("/score-detail?id="+id))
    }
    render(){
        const {salaryList} =this.props;
        // if(!salaryList){
        //   return null;
        // }
        const columns = [{
            title: '名称',
            dataIndex: 'title',
          }, {
            title: '总人数',
            dataIndex: 'personCount',
          }, {
            title: '操作',
            dataIndex: '',
            width:130,
            render:(text, record) => (
              <span className="make-box">
                {record.status==0?<a href="javascript:;" className="check-btn"  onClick={this.pubShowConfirm.bind(this,record.scoreId)}>发布</a>:null}
                <a href="javascript:;" className="check-btn" onClick={this.edit.bind(this,record.scoreId)} >编辑</a> 
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.scoreId)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span:6 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                    <Col span={2}>
                      <Button type="primary" onClick={this.addScore.bind(this)}>添加</Button>
                    </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={this.state.scoreData} pagination={false}/>
              {/* <PageIndex getPage={this.onPageChange.bind(this)} total={salaryList.totalCount} totalPage={salaryList.totalPage} currentPage={salaryList.currentPage}/> */}
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    salaryList:state.salary
  }
}

export default connect(mapStateToProps)(Form.create()(ScoreMange));
