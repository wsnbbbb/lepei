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

class SalaryMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false,
          startTime:'',
          endTime:''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
        "status":-1
      }
      this.getSalary(params)
    }
    getSalary=(params)=>{
      this.props.dispatch({
        type:'salary/getSalaryList',
        payload: params
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
        content: '确定要删除这则工资条吗？',
        onOk() {
          me.props.dispatch({
            type:'salary/delSalary',
            payload:{"salaryId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
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
    addSalary=()=>{
      this.props.dispatch(routerRedux.push("/add-salary"))
    }
    edit=(id)=>{
      this.props.dispatch(routerRedux.push("/salary-detail?id="+id))
    }
    render(){
        const {salaryList} =this.props;
        if(!salaryList){
          return null;
        }
        const columns = [{
            title: '名称',
            dataIndex: 'title',
          }, {
            title: '总人数',
            dataIndex: 'personNum',
          }, {
            title: '实发金额',
            dataIndex: 'totalMoney',
            render:(record)=>{
                return(<span>{record?"￥"+record:""}</span>)
            }
          }, {
            title: '发布日期',
            dataIndex: 'publishTime',
            render:(record)=>{
                return(<span>{record?onlyDate(record):""}</span>)
            }
          }, {
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span>{(record==0?<span style={{color:"#f00"}}>未发布</span>:"已发布")}</span>)
            }
          }, {
            title: '发布人',
            dataIndex: 'publishName',
          }, {
            title: '操作',
            dataIndex: '',
            width:130,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.status==0?<a href="javascript:;" className="check-btn"  onClick={this.pubShowConfirm.bind(this,record.id)}>发布</a>:null}
                <a href="javascript:;" className="check-btn" onClick={this.edit.bind(this,record.id)} >编辑</a> 
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
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
                    <Col span={8}>
                        <FormItem {...formItemLayout} label=''>
                            {getFieldDecorator("time")(
                                <RangePicker onChange={this.onTimeChange} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label={'状态'}>
                        {getFieldDecorator("status",{initialValue:'-1'})(
                            <Select>
                                <Option value="-1">全部</Option>
                                <Option value="0">未发布</Option>
                                <Option value="1">已发布</Option>
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={2} offset={1}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </Col>
                    <Col span={2}>
                      <Button onClick={this.addSalary.bind(this)}>添加</Button>
                    </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={salaryList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={salaryList.totalCount} totalPage={salaryList.totalPage} currentPage={salaryList.currentPage}/>
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

export default connect(mapStateToProps)(Form.create()(SalaryMange));
