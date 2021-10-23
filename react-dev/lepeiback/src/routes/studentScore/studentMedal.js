import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl, getImg} from '../../utils/img';
import {getGradeType,getSexType,getResidence, formatIdcard} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class StudentMedal extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          list: []
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page":1,"prePage":20
       }
       this.getScoreList(params)
       this.props.dispatch({
        type: 'user/getCommonGradeList'
       })
       this.props.dispatch({
        type: 'score/getRuleItems',
        payload: params,
        callback: res=>{
            if(res.data===200){

            }
        }
       })
    }
    getScoreList=(params)=>{
      this.props.dispatch({
        type: 'score/personScoreMedal',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
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
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getScoreList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条学生信息吗？',
        onOk() {
          me.props.dispatch({
            type:'person/deletePerson',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "personType":1,
                    "kw":values.kw||'',
                    "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
                    "classId":me.state.classValue?me.state.classValue.substring(me.state.classValue.lastIndexOf('-')+1, me.state.classValue.length):''
                  }
                  me.getScoreList(params)
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
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getScoreList(params)
      })
    }
    goToHistory=(id)=>{
        this.props.dispatch(routerRedux.push("/score-history?&personId="+id))
    }
    goToRule=()=>{
        this.props.dispatch(routerRedux.push("/score-rule"))
    }
    goToManage=()=>{
      this.props.dispatch(routerRedux.push("/medal-manage"))
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-student"));
    }
    selectChange=(selectedRowKeys, selectedRows)=>{
      let ids=[];
      selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
        return ids.push(item.personId)
      })
      this.setState({personIds:ids,selectedRowKeys})
    }
    delAll=()=>{
      if(this.state.personIds.length<=0){
        return message.error("请先选择人员",2)
      }
      this.props.dispatch({
        type:'person/delAllPerson',
        payload:{"personId":this.state.personIds},
        callback:(res)=>{
          if(res.code===200){
            message.success('删除成功',2)
            this.setState({selectedRowKeys:[]})
            this.props.form.validateFields((err, values) => {
              const params={
                "page":this.state.page,
                "prePage":this.state.prePage,
                "personType":1,
                "kw":values.kw||'',
                "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
                "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
              }
              this.getScoreList(params)
            })
          }
        }
      })
    }
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
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let url=portUrl("/manager/person-score/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId)
          this.setState({exportUrl:url})
        })
      }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
            width:100,
            fixed:'left'
          } ,{
            title: '年级班级',
            dataIndex: 'className',
          }, {
            title: '获得勋章',
            dataIndex: 'medalTitle',
            render:(record) => (
              <span>
                {record}
                {/* <img src={getImg(record.medalIcon)} className='medal-img'/> */}
              </span>
            )
          }, 
          ];

          const { list } = this.state;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        
          const {commonData, gradeList} = this.props;
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main student-score">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入学生姓名"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'年级名称'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={8} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                        <Button type='primary' onClick={this.goToManage.bind(this)}>勋章管理</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
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

export default connect(mapStateToProps)(Form.create()(StudentMedal));
