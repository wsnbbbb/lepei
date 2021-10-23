import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,TreeSelect } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {formatDate,getSexType,getGradeType} from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

class TeacherCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,disabled:true,
          personName:'',
          personId:'',treeData:[]
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "personType":2
      }
      this.getTeacherCardList(params)
      this.props.dispatch({
        type:'user/getDepartmentList',
        callback:(res)=>{
            if(res.code===200){
                this.setState({treeData:res.data})
            }
        }
      })
    }
    getTeacherCardList=(params)=>{
      this.props.dispatch({
        type:'card/getPersonCard',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              teacherCards:res.data
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
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "personType":2,
          "status":values.status||""
        }
        this.getTeacherCardList(params)
        this.setState({page:1})
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
            "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
            "personType":2,
            "status":values.status||""
        }
        this.getTeacherCardList(params)
      })
    }
    goToDetail=()=>{
      this.props.dispatch(routerRedux.push("/upload-card?type=2"))
    }
   
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let departmentId=values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'';
        let status=values.status||'';
        const url=portUrl("/manager/person-card/export?personType=2&userId="+userId+"&userType="+userType+"&accessToken="+token+
        "&kw="+kw+"&departmentId="+departmentId+"&status="+status)
        this.setState({exportUrl:url})
      })
    }
    openCard = (id,name) => {
        this.setState({
          visible: true,
          personId:id,
          personName:name
        });
    }
    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
          if(!values.icChipNo){
            return message.error("请输入物理卡号",2)
          }
          if(values.icChipNo.length!=8){
            return message.error("物理卡号应该是8位数",2)
          }
            let reg=/^[0-9a-fA-F]+$/
            if(!reg.test(values.icChipNo)){
              return message.error("卡号格式不正确(8位数字、A-F(a-f)字母组成)",3)
            }
            if(!err){
                this.props.dispatch({
                    type:'card/openPersonCard',
                    payload:{
                        "personId":this.state.personId,
                        "icChipNo":values.icChipNo
                    },
                    callback:(res)=>{
                        if(res.code===200){
                            message.success("开卡成功",2)
                            const params={
                                "page":this.state.page,
                                "prePage":this.state.prePage,
                                "kw":values.kw||'',
                                "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
                                "personType":2,
                                "status":values.status||""
                            }
                            this.getTeacherCardList(params)
                            this.setState({personId:'',personName:'',visible:false})
                            this.props.form.resetFields(["icChipNo"]);
                        }
                    }
                })
            }
        })
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
          personId:'',
          personName:''
        });
        this.props.form.resetFields(["icChipNo"]);
    }
    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex:'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '部门',
            dataIndex: 'departmentName',
          },{
            title: '校验码',
            dataIndex: 'activeCode',
          },{
            title: '逻辑卡号',
            dataIndex: 'icCardNo',
          },{
            title: '物理卡号',
            dataIndex: 'icChipNo',
          },{
            title: '开卡时间',
            dataIndex: 'openCardTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.icCardNo?null:<a href="javascript:;" className="check-btn" onClick={this.openCard.bind(this,record.personId,record.personName)}>开卡</a> }
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {teacherCards} = this.state;
          if(!teacherCards){
            return null
          }
          const menu = (
            <Menu>
              <Menu.Item>
                <a href='javascript:;' onClick={this.goToDetail.bind(this)}>批量开卡</a>
              </Menu.Item>
              <Menu.Item>
                <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
              </Menu.Item>
            </Menu>
          );
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入姓名或证件号"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'部门'}>
                      {getFieldDecorator("departmentId",{initialValue:''})(        
                        <TreeSelect
                            showSearch
                            // style={{ width: 300 }}
                            // value={this.state.departmentId}
                            dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                        >
                          {this.renderTreeNodes(this.state.treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option value=''>全部</Option>
                          <Option value='1'>已开卡</Option>
                          <Option value='2'>未开卡</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={teacherCards.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={teacherCards.totalCount} totalPage={teacherCards.totalPage} currentPage={teacherCards.currentPage}/>
              <Modal
                title="开卡"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={16}>
                    <FormItem {...formItemLayout} label={'姓名'}>
                      {getFieldDecorator("name",{initialValue:this.state.personName})(
                        <Input disabled/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16}>
                    <FormItem {...formItemLayout} label={'物理卡号'}>
                      {getFieldDecorator("icChipNo",{initialValue:''})(
                        <Input maxLength='8' autoFocus="autofocus"/>
                      )}
                    </FormItem>
                  </Col>
                  
                </Row>
              </Form>  
              <p style={{color:'#f00',textAlign:'center'}}>请将输入法切换为英文格式！</p>                     
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     
  }
}
export default connect(mapStateToProps)(Form.create()(TeacherCard));
