import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Tag,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import {getGradeType,getSexType,getResidence, formatDate} from '../../utils/public';
import { portUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class StudentBinding extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          disabled:false,
          confirmLoading: false,
          personList:{},
          datas:[],
          gradeId:'',
          classValue:'',
          exportUrl:'',
          personId:'',
          typeVal:''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "personType":1,
      }
      this.getPersonList(params)
      this.props.dispatch({
      type:'user/getCommonGradeList'
      })
    }
    // 获取学生列表
    getPersonList=(params)=>{
      this.props.dispatch({
        type:'userBinding/personList',
        payload:params,
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields(["kw","gradeId","inResidence","bindStatus"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "inResidence":values.inResidence||0,
          "bindStatus":values.bindStatus||0
        }
        this.getPersonList(params)
      })
    }
   
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields(["kw","gradeId","inResidence","bindStatus"],(err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "inResidence":values.inResidence||0,
          "bindStatus":values.bindStatus||0
        }
        this.getPersonList(params)
      })
    }

     // 导出
    export=()=>{
      this.props.form.validateFields(["kw","gradeId","inResidence","bindStatus"],(err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let personType = 1;
        let kw=values.kw||'';
        let gradeId = values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length)||'';
        let classId = this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length)||'';
        let inResidence = values.inResidence||0;
        let bindStatus = values.bindStatus||0
        let url=portUrl("/manager/person-bind/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&personType="+personType+
          "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId+"&inResidence="+inResidence+"&bindStatus="+bindStatus)
        this.setState({exportUrl:url})
      })
    }
  
    // 年级选择
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
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
        this.setState({classValue:'',disabled:true})
      }
    }
    // 班级选择
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    // 操作
    operation = (id) =>{
      this.setState({personId:id})
      this.props.dispatch({
        type:'userBinding/bindDetail',
        payload:{"personId":id},
        callback:(res)=>{
          console.log({res});
          if(res.code===200){
            this.setState({
              visible:true,
              bindTel:res.data.bindTel,
              authTel:res.data.authTel,
              bindTime:res.data.bindTime,
              authTime:res.data.authTime,
            })
          }
        }
      })
    }
    changeVal = (value)=>{
      this.setState({
        typeVal:value
      })
    }
    // 操作确定
    handleOk = () => {
      this.props.form.validateFields(["type","newTel"],(err,values)=>{
        if(!err){
          const params = {
            "personId":this.state.personId,
            "type":values.type,
            "newTel":values.newTel||''
          }
          this.props.dispatch({
            type:'userBinding/updateBind',
            payload:params,
            callback:(res)=>{
              if(res.code === 200){
                message.success("更新成功")
                this.setState({
                  confirmLoading: true,
                })
                setTimeout(() => {
                  this.setState({
                    visible: false,
                    confirmLoading: false,
                    typeVal:''
                  });
                }, 1000);
                this.props.form.resetFields(["type","newTel"])
                this.search()
              }
            }
          })
        }
      })
    }
    // 取消操作
    handleCancel = () => {
      this.setState({
        visible: false,
        typeVal:''
      });
      this.props.form.resetFields(["type","newTel"])
    };
    render(){
      const { confirmLoading, visible,bindTel,authTel,bindTime,authTime,typeVal } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const formItemLayout1 = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
      };
      const formItemLayout2 = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const columns = [
          {
            key:'personName',
            title: '姓名',
            dataIndex: 'personName',
          }, {
            key:'sex',
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            key:'inResidence',
            title: '读书形式',
            dataIndex: 'inResidence',
            render:(record)=>{
              return(<span>{getResidence(record)}</span>)
            }
          },{
            key:'gradeType',
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          },{
            key:'gradeName',
            title: '年级',
            dataIndex: 'gradeName',
          },{
            key:'className',
            title: '班级',
            dataIndex: 'className',
          },{
            key:'status',
            title: '状态',
            dataIndex: 'status',
            render:(record)=>(
              <span>
                {record==1?<Tag color="blue">已绑定</Tag>:(record==2?<Tag color="magenta">未绑定</Tag>:null)}
              </span>
            )
            
          },{
            key:'bindTel',
            title: '绑定手机',
            dataIndex: 'bindTel',
           
          },{
            key:'authTel',
            title: '授权手机',
            dataIndex: 'authTel',
           
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                {record.status==1?<a href="javascript:;" onClick={this.operation.bind(this,record.personId)}>操作</a>:null}
              </span>
            )
        }
      ];
      const {personList,commonData,gradeList} = this.props;
      if(!personList){
        return null
      }
      let datas=[];
      personList&&personList.dataList&&personList.dataList.map((item)=>{
        datas.push({key:item.personId,...item})
      })
     
      let classOptions=[];
      commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
        return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
      })
      let options=[]

      gradeList&&gradeList.length>0&&gradeList.map(item=>{
        return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
      })
        return (
            <div className="content-main student-binding">
              <Form>
                <Row gutter={24}>
                  <Col span={5}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入姓名或完整手机号"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout1} label={'读书形式'}>
                    {getFieldDecorator("inResidence",{initialValue:''})(
                        <Select showSearch >
                          <Option value='' >全部</Option>
                          <Option value={1} >住读</Option>
                          <Option value={2} >走读</Option>
                        </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem {...formItemLayout1} label={'状态'}>
                    {getFieldDecorator("bindStatus",{initialValue:''})(
                        <Select showSearch >
                          <Option value='' >全部</Option>
                          <Option value={1} >已绑定</Option>
                          <Option value={2} >未绑定</Option>
                        </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={3} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                        <Button><a  href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                  
                </Row>
              </Form>              
              <Table scroll={{ x: 1000 }} columns={columns} dataSource={datas} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={personList.totalCount} totalPage={personList.totalPage} currentPage={personList.currentPage}/>
              <Modal
              title="操作"
              width="600px"
              visible={visible}
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
              >
                <div style={{padding:"20px 0"}}>
                  <Row type="flex" justify="center" className="operate">
                    <Col span={4}><span className="bindingUser">绑定人</span></Col>
                    <Col span={5}>{bindTel}</Col>
                    <Col span={7}>{formatDate(bindTime)}</Col>
                  </Row>
                  {authTel?
                    <Row type="flex" justify="center" className="operate" style={{marginBottom:"20px"}}>
                      <Col span={4}><span className="bindingUser">授权人</span></Col>
                      <Col span={5}>{authTel}</Col>
                      <Col span={7}>{formatDate(authTime)}</Col>
                    </Row>:null
                  }
                </div>
                <Form style={{marginBottom:"20px"}}>
                  <Row gutter={24}>
                    <Col span={20}>
                      <FormItem {...formItemLayout2} label={'操作'}>
                      {getFieldDecorator("type",{rules:[{required:true, message:'请选择操作项'}]})(
                          <Select showSearch placeholder="请选择" onChange={this.changeVal}>
                            <Option value={1} >更换手机号【绑定人】</Option>
                            <Option value={2} >解绑【绑定人】</Option>
                            {authTel?
                              <Option value={3} >更换手机号【授权人】</Option>:null
                            }
                            {authTel?
                              <Option value={4} >解绑【授权人】</Option>:null
                            }
                          </Select>
                      )}
                      <p style={{color:"#FF3806"}}>绑定人被解绑后，授权人自动解绑当前授权关系</p>
                      </FormItem>
                    </Col>
                  </Row> 
                  {typeVal==1||typeVal==3?
                    <Row gutter={24}>
                      <Col span={20}>
                        <FormItem {...formItemLayout2} label={'手机号'}>
                        {getFieldDecorator("newTel",{rules:[{required:true, message:'请输入手机号'},{pattern:/^1[3456789]\d{9}$/,message:"请输入正确的手机号"}]})(
                            <Input placeholder="请输入" maxLength={11}/>
                        )}
                        </FormItem>
                      </Col>
                    </Row>:null
                  }    
                </Form>
              </Modal>
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    personList:state.userBinding.savePerson,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(StudentBinding));
