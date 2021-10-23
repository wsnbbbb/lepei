import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Select,Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, getFileType} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class GradeMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          controlBtn:false
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getGrade(params)
    }
    getGrade=(params)=>{
      this.props.dispatch({
        type:'user/getGradeList',
        payload: params
      })
    }
    showModal = () => {
      this.props.form.resetFields(['gradeType','gradeName','sort','date']);
      this.setState({
        visible: true,
        gradeType:'',
        gradeName:'',
        gradeId:'',
        startDate:'',
        endDate:'',
        sort:'',
        edit:false
      });
    }
    showEditModal = (record) => {
      this.props.form.resetFields(['gradeType','gradeName','sort','date']);
      this.setState({
        visible: true,
        gradeType:record.type,
        gradeName:record.gradeName,
        gradeId:record.gradeId,
        startDate:record.startDate,
        endDate:record.endDate,
        gradeId:record.gradeId,
        sort:record.sort,
        edit:true
      });
    }
    //添加年级
    handleOk = () => {
      // this.setState({controlBtn:true})
      const {edit,controlBtn,startDate,endDate} = this.state;
      console.log(startDate,endDate)
      this.props.form.validateFields((err, values) => {
        if(!startDate||!endDate){
          return message.error('请选择时间',2)
        }
        if(!err&&!controlBtn){
          this.props.dispatch({
            type:edit?'grade/updateGrade':'grade/addGrade',
            payload:{
              "type":values.gradeType,
              "gradeName":values.gradeName,
              "startDate":this.state.startDate,
              "endDate":this.state.endDate,
              "gradeId":this.state.gradeId,
              "sort":values.sort
            },
            callback:(res)=>{
              if(res.code===200){
                message.success(edit?'编辑成功！':'创建成功！',3)
                this.props.form.resetFields(['gradeType','gradeName','sort','date']);
                this.setState({
                  visible: false,controlBtn:true
                });
                const params={
                  "page":this.state.page,
                  "prePage":this.state.prePage,
                  "kw":values.kw||'',
                  "type":values.type||''
                }
                this.getGrade(params)
              }
              this.setState({controlBtn:false})
            }
          })
        }
      })
    }
    handleCancel = () => {
      this.props.form.resetFields(['gradeType','gradeName','sort','date']);
      this.setState({
        visible: false,
      });
    }
    onTimeChange=(date,dateString)=> {
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
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
          "status":values.status||'',
        }
        this.getGrade(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条年级信息吗？',
        onOk() {
          me.props.dispatch({
            type:'grade/delGrade',
            payload:{"gradeId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "type":values.type||'',
                    "status":values.status||'',
                  }
                  me.getGrade(params)
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
          "status":values.status||'',
        }
        this.getGrade(params)
      })
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-grade"));
    }
    render(){
        const {gradeList} =this.props;
        const {gradeName,gradeType,startDate,endDate,sort} = this.state;
        if(!gradeList){
          return null;
        }
        const columns = [{
            title: '学业阶段',
            dataIndex: 'type',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级名称',
            dataIndex: 'gradeName',
          }, {
            title: '入学时间',
            dataIndex: 'startDate',
          }, {
            title: '毕业时间',
            dataIndex: 'endDate',
          },{
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span>{getFileType(record)}</span>)
            }
          },{
            title: '排序',
            dataIndex: 'sort',
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showEditModal.bind(this,record)}>编辑</a> 
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.gradeId)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const menu = (
            <Menu>
              <Menu.Item>
                <a href="javascript:;" onClick={this.upload.bind(this)}>导入</a>
              </Menu.Item>
              {/* <Menu.Item>
                <a rel="noopener noreferrer" href="">导出</a>
              </Menu.Item> */}
            </Menu>
          );
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入年级名称" />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'学业阶段'}>
                      {getFieldDecorator("type",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">幼儿园</Option>
                          <Option value="2">小学</Option>
                          <Option value="3">初中</Option>
                          <Option value="4">高中</Option>
                          <Option value="5">大学</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">正常</Option>
                          <Option value="2">已归档</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={1}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2}>
                        <Button onClick={this.showModal}>添加</Button>
                  </Col>
                  <Col span={2}>
                    <Dropdown overlay={menu} >
                      <a className="ant-dropdown-link" style={{marginTop:10,display:'inline-block'}}>
                        展开 <Icon type="down" />
                      </a>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={gradeList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={gradeList.totalCount} totalPage={gradeList.totalPage} currentPage={gradeList.currentPage}/>
              <Modal
                title="添加年级"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'学业阶段'}>
                        {getFieldDecorator("gradeType",{initialValue:''||gradeType,rules:[{required:true,message:'请选择学业阶段'}]})(
                          <Select>
                            <Option value="1">幼儿园</Option>
                            <Option value="2">小学</Option>
                            <Option value="3">初中</Option>
                            <Option value="4">高中</Option>
                            <Option value="5">大学</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'年级名称'}>
                        {getFieldDecorator("gradeName",{initialValue:''||gradeName,rules:[{required:true,message:'请输入年级名称',whitespace: true}]})(
                          <Input placeholder='请输入年级名称'/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'排序'}>
                        {getFieldDecorator("sort",{initialValue:''||sort})(
                          <Input type='number' maxLength='5'/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'起止时间'}>
                        {getFieldDecorator("date",{initialValue:[startDate?moment(startDate):'', endDate?moment(endDate):''],rules:[{required:true,message:"请选择时间"}]})(
                          <RangePicker onChange={this.onTimeChange} />
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
    gradeList:state.user.gradeData
  }
}

export default connect(mapStateToProps)(Form.create()(GradeMange));
