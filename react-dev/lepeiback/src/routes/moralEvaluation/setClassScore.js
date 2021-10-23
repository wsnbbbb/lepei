import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class SetClassScore extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getClassScoreType(params)
      this.props.dispatch({
        type:'user/getAllSemesters'
      })
    }
    getClassScoreType=(params)=>{
      this.props.dispatch({
        type:'moralEvaluation/getEvaluationType',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              classScoreList:res.data
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
          "semesterId":values.semesterId||''
        }
        this.getClassScoreType(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>删除后将清除该考评项所有的评分记录，确定删除？</span>,
        onOk() {
          me.props.dispatch({
            type:'moralEvaluation/deleteEvaluationType',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "semesterId":values.semesterId||""
                  }
                  me.getClassScoreType(params)
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
          "kw":values.kw||'',
          "semesterId":values.semesterId||""
        }
        this.getClassScoreType(params)
      })
    }
    setClassNotice = (type,id) => {
      if(type==1){
        this.props.dispatch(routerRedux.push("/moral-type-detail?type=1"))
      }else{
        this.props.dispatch(routerRedux.push("/moral-type-detail?type=2&id="+id))
      }
    }
    setFlag = () => {
      let semesterId
      this.props.allTerms&&this.props.allTerms.map(item=>{
        if(item.isCurrent){
          semesterId = item.semesterId
        }
      })
      if(!semesterId) return
      this.props.dispatch(routerRedux.push("/set-flag?semesterId="+semesterId))
    }
    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'typeId',
            key:'typeId'
          }, {
            title: '学期',
            dataIndex: 'semesterName',
            key:'semesterName',
          }, {
            title: '考评项目',
            dataIndex: 'typeName',
            key:'typeName',
          }, {
            title: '分值',
            dataIndex: 'totalScore',
            key:'totalScore',
          }, {
            title: '排序',
            dataIndex: 'orderNum',
            key:'orderNum',
          }, {
            title: '平板考评人',
            dataIndex: 'padExaminers',
            key:'padExaminers',
            className:'examiners',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="examiner-content">{record}</span>
              </Tooltip>)
            }
          }, {
            title: 'APP考评人',
            dataIndex: 'appExaminers',
            key:'appExaminers',
            className:'examiners',
            render:(record)=>{
                return( <Tooltip placement="top" title={record}>
                <span className="examiner-content">{record}</span>
              </Tooltip>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.setClassNotice.bind(this,2,record.typeId)}>编辑</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.typeId)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const {classScoreList} = this.state;
          const {allTerms} = this.props;
          let termChild=[]
          allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
          })
          if(!classScoreList){
            return null;
          }
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="考评项目"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('semesterId')(
                        <Select placeholder="请选择学期">
                            <Option value=''>全部</Option>
                            {termChild}
                        </Select>
                      )}
                    </FormItem>
                      
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.setClassNotice.bind(this,1)}>添加</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.setFlag.bind(this)}>流动红旗设置</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={classScoreList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={classScoreList.totalCount} totalPage={classScoreList.totalPage} currentPage={classScoreList.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms
  }
}
export default connect(mapStateToProps)(Form.create()(SetClassScore));
