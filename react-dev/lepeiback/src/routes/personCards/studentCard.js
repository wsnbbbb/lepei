import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {formatDate,getSexType,getGradeType} from '../../utils/public';
import {portUrl} from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class StudentCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,disabled:true,personName:'',
          gradeId:'',classValue:'',personId:''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "personType":1
      }
      this.getStudentCardList(params)
      this.props.dispatch({
        type:'user/getCommonGradeList'
      })
    }
    getStudentCardList=(params)=>{
      this.props.dispatch({
        type:'card/getPersonCard',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              studentCards:res.data
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
          "gradeId":values.gradeId||'',"personType":1,
          "classId":this.state.classValue||"","status":values.status||""
        }
        this.getStudentCardList(params)
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
            "gradeId":values.gradeId||'',"personType":1,
            "classId":this.state.classValue||"","status":values.status||""
        }
        this.getStudentCardList(params)
      })
    }
    goToDetail=()=>{
      this.props.dispatch(routerRedux.push("/upload-card?type=1"))
    }
    gradeChange=(val)=>{
        console.log(val)
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
        console.log(val)
        this.setState({classValue:val})
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let gradeId=values.gradeId||'';
        let classId=this.state.classValue||'';
        let status=values.status||''
        const url=portUrl("/manager/person-card/export?personType=1&userId="+userId+"&userType="+userType+"&accessToken="+token+
        "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&status="+status)
        this.setState({exportUrl:url})
      })
    }
    openCard = (id,name) => {
        this.setState({
          visible: true,
          personId:id,
          personName:name
        }
        // ,()=>{
        //   this.input.focus()
        // }
        );
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
                                "gradeId":values.gradeId||'',"personType":1,
                                "classId":this.state.classValue||"","status":values.status||""
                            }
                            this.props.form.resetFields(["icChipNo"]);
                            this.getStudentCardList(params)
                            this.setState({personId:'',personName:'',visible:false})
                        }
                    }
                })
            }
        })
    }
    handleCancel = (e) => {
        this.props.form.resetFields(["icChipNo"]);
        this.setState({
          visible: false,
          personId:'',
          personName:''
        },()=>{
          this.input.focus()
        });
    }
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
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          },{
            title: '班级',
            dataIndex: 'className',
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
          const {commonData,gradeList} = this.props;
          const {studentCards} = this.state;
          if(!studentCards){
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
          if(!studentCards){
            return null;
          }
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
                    <FormItem {...formItemLayout} label={'年级名称'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)} optionFilterProp="children">
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'} optionFilterProp="children">
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                        {/* {getFieldDecorator("classId",{initialValue:this.state.classValue})(
                            <Select showSearch onChange={this.classChange.bind(this)} optionFilterProp="children" disabled={this.state.disabled}>
                            <Option value='' key=''>全部</Option>
                            {classOptions}
                            </Select>
                        )} */}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select showSearch>
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={studentCards.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={studentCards.totalCount} totalPage={studentCards.totalPage} currentPage={studentCards.currentPage}/>
              <Modal
                title="开卡"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" onClick={this.handleCancel}>取消</Button>,
                  <Button type="primary" htmlType="submit" onClick={this.handleOk}>
                    确定
                  </Button>,
                ]}
              >
                <Form className="ant-advanced-search-form content-form" onSubmit={this.handleOk.bind(this)}>
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
                        <Input ref={refs=> this.input=refs} id="cardInput" maxLength={8} autoFocus="autofocus"/>
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
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}
export default connect(mapStateToProps)(Form.create()(StudentCard));
