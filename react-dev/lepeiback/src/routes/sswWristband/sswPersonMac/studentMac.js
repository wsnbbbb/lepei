import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType,getSexType,getResidence, formatIdcard,formatDate} from '../../../utils/public';
import {portUrl} from '../../../utils/img';
import '../style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;


class StudentMac extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,prePage:20,visible: false,gradeId:'',classValue:'',
          disabled:false,
        };
    }
    componentDidMount=()=>{
       const params={
         "page":1,"prePage":20,"personType":1
       }
       this.personMacLists(params)
       this.props.dispatch({
        type:'user/getCommonGradeList'
       })
    }
    personMacLists=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getSswPersonMacList',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({studentMacList:res.data})
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
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId,
          "classId":this.state.classValue,
          "sendStatus":values.sendStatus,"status":values.status
        }
        this.personMacLists(params)
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId,
          "classId":this.state.classValue,
          "sendStatus":values.sendStatus,"status":values.status
        }
        this.personMacLists(params)
      })
    }
    goToDetail=(type,id)=>{
        this.props.dispatch(routerRedux.push("/bind-student-mac"))
    }
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":val},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    showModal = (record) => {
      this.props.form.resetFields(['personName','macId']);
      this.props.dispatch({
        type:'sswWristband/sswPersonMacDetail',
        payload:{"personId":record.personId},
        callback:(res)=>{
          if(res.code===200){
            this.setState({personMacDetail:res.data})
          }
        }
      })
      this.setState({
        visible: true,personId:record.personId,itemData:record
      });
    }
  
    handleOk = (e) => {
      this.props.form.validateFields((err, values) => {
        if(!values.macId){
          return message.error("请输入手环MAC",2)
        }
        if(values.macId.length!=12){
          return message.error("手环MAC应该是12位数",2)
        }
        let reg=/^[0-9a-fA-F]+$/
        if(!reg.test(values.macId)){
          return message.error("手环MAC格式不正确(12位数字、A-F(a-f)字母组成)",3)
        }
        if(!err){
          this.props.dispatch({
            type:'sswWristband/updateSswPersonMac',
            payload:{"personId":this.state.personId,"macId":values.macId},
            callback:(res)=>{
              if(res.code===200){
                this.setState({visible:false})
                message.success('修改成功',2)
                const params={
                  "page":this.state.page,"prePage":this.state.prePage,"personType":1
                }
                this.personMacLists(params)
                this.props.form.resetFields(['personName','macId']);
              }
            }
          })
        }
      })
      
    }
  
    handleCancel = (e) => {
      this.props.form.resetFields(['personName','macId']);
      this.setState({
        visible: false,
      });
    }
    setUserInfo=(record)=>{
      this.props.dispatch({
        type:'sswWristband/setSswPersonMacInfo',
        payload:{"personId":record.personId},
        callback:(res)=>{
          if(res.code===200){
            message.success('操作成功',2)
            const params={
              "page":this.state.page,"prePage":this.state.prePage,"personType":1
            }
            this.personMacLists(params)
          }
        }
      })
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let gradeId=values.gradeId||'';let classId=this.state.classValue||'';
        let status=values.status;let sendStatus=values.sendStatus;
        const url=portUrl("/manager/shunshiwei-person-mac/export?personType=1&userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&status="+status+"&sendStatus="+sendStatus)
        this.setState({exportUrl:url})
      })
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            // width:100,
            // fixed:'left'
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
            render:(record)=>{
              return(<span>{formatIdcard(record)}</span>)
            }
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }, {
            title: '手环mac',
            dataIndex: 'macId',
          }, {
            title: '绑定时间',
            dataIndex: 'bindTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '下发状态',
            dataIndex: 'sendStatus',
            render:(record)=>{
              return(<span style={{color:record==0?"#f00":""}}>{(record==0?"失败":(record==1?"成功":""))}</span>)
            }
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.icCardNo?<a href="javascript:;" className="check-btn" onClick={this.showModal.bind(this,record)}>修改</a> :null}
                {record.sendStatus==0?<a href="javascript:;" className="check-btn" onClick={this.setUserInfo.bind(this,record)}>重试</a> :null}
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const menu = (
            <Menu>
              <Menu.Item>
                <span onClick={this.goToDetail}>批量绑定</span>
              </Menu.Item>
              <Menu.Item>
              <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
              </Menu.Item>
            </Menu>
          );
          const {commonData,gradeList} = this.props;
          const {studentMacList,personMacDetail} =this.state;
          if(!studentMacList){
            return null
          }
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId}>{item.className}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入姓名或证件号"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch optionFilterProp="children" onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch optionFilterProp="children" value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'绑定状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option key='0'>全部</Option>
                          <Option key='1'>已绑定</Option>
                          <Option key='2'>未绑定</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'下发状态'}>
                      {getFieldDecorator("sendStatus",{initialValue:''})(
                        <Select>
                          <Option key='-1'>全部</Option>
                          <Option key='0'>失败</Option>
                          <Option key='1'>成功</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={1}>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={studentMacList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={studentMacList.totalCount} totalPage={studentMacList.totalPage} currentPage={studentMacList.currentPage}/>
              <Modal
                title="修改"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                 <Form className="ant-advanced-search-form content-form">
                  <Row gutter={24}>
                    <Col span={16}>
                      <FormItem {...formItemLayout} label='姓名'>
                        {getFieldDecorator('personName',{initialValue:personMacDetail&&personMacDetail.personName||this.state.itemData&&this.state.itemData.personName})(
                          <Input disabled/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={16}>
                      <FormItem {...formItemLayout} label={'手环MAC'}>
                        {getFieldDecorator("macId",{initialValue:personMacDetail&&personMacDetail.macId||'',rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入",
                        }],})(
                          <Input autoFocus='autoFocus'/>
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
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(StudentMac));
