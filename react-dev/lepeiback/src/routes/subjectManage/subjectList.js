import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,Select  } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {getImg} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class SubjectList extends Component{
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
      this.getSubjectList(params)
    }
    getSubjectList=(params)=>{
      this.props.dispatch({
        type:'subject/getSubjectList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "type":values.type||'',
        }
        this.getSubjectList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'subject/delSubject',
            payload:{"subjectId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "type":values.type||'',
                  }
                  me.getSubjectList(params)
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
          "type":values.type||'',
        }
        this.getSubjectList(params)
      })
    }
    addCanteenMenu = () => {
      this.props.dispatch(routerRedux.push("/add-subject"))
    }
    editCanteenMenu=(id)=>{
        this.props.dispatch(routerRedux.push("/add-subject?id="+id))
    }
    render(){
        const columns = [{
            title: '序号',
            dataIndex: 'subjectId',
          }, {
            title: '学科名称',
            dataIndex: 'subjectName',
          }, {
            title: '课程类型',
            dataIndex: 'type',
            render:(record)=>{
              return(<span>{record==1?"基础课":(record==2?"社团课":(record==3?"延时课":"--"))}</span>)
            }
          }, {
            title: '图标',
            dataIndex: 'pic',
            render:(record)=>{
              return(<span>{record?<img src={getImg(record)} style={{width:50,height:50}}/>:null}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.editCanteenMenu.bind(this,record.subjectId)}>编辑</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.subjectId)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const {subjectList} = this.props;
          console.log(subjectList)
          if(!subjectList){
            return null;
          }
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入学科名称"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={'课程类型'}>
                      {getFieldDecorator("type",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">基础课</Option>
                          <Option value="2">社团课</Option>
                          <Option value="3">延时课</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                      <Button type='primary' onClick={this.addCanteenMenu.bind(this)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' columns={columns} dataSource={subjectList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={subjectList.totalCount} totalPage={subjectList.totalPage} currentPage={subjectList.currentPage}/>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    subjectList:state.subject
  }
}
export default connect(mapStateToProps)(Form.create()(SubjectList));
