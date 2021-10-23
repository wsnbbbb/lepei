import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Tag,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import {getGradeType,getSexType,getResidence, formatDate} from '../../utils/public';
import { routerRedux } from 'dva/router';
import { portUrl } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class CoinManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          disabled:false,
          confirmLoading: false,
          data:{},
          cionList:[],
          gradeValue:'',
          classValue:undefined,
          exportUrl:'',
          orderType:'1',
          rate:'',
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "orderType":'1'
      }
      this.getCions(params)
      this.props.dispatch({
      type:'user/getCommonGradeList'
      })
      this.getAllCions()
    }
    // 获取总益小币
    getAllCions=()=>{
      this.props.dispatch({
        type:'beneficialCoin/getAllCions',
        callback:(res)=>{
          this.setState({
            total:res.data.total
          })
        }
      })
    }
    // 获取益小币列表
    getCions=(params)=>{
      this.props.dispatch({
        type:'beneficialCoin/getCions',
        payload:params,
        callback:(res)=>{
          this.setState({
            data:res.data,
            cionList:res.data.dataList
          })
        }
      })
    }

    // 查询
    search = () =>{
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "gradeId":this.state.gradeValue?this.state.gradeValue.substring(this.state.gradeValue.lastIndexOf('-')+1, this.state.gradeValue.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "orderType":this.state.orderType
        }
        this.getCions(params)
    }
   
    // 分页
    onPageChange = (current,size) =>{
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "gradeId":this.state.gradeValue?this.state.gradeValue.substring(this.state.gradeValue.lastIndexOf('-')+1, this.state.gradeValue.length):'',
          "classId": this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "orderType":this.state.orderType
        }
        this.getCions(params)
    }
   
    // 发放益小币
    giveOut = ()=>{
      this.props.dispatch(routerRedux.push("/teacher-property"))
    }
  
    // 年级选择
    gradeChange = (val) =>{
      if(val){
        this.setState({gradeValue:val,disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:undefined})
            }    
          }
        })
      }else{
        this.setState({
          classValue:undefined,
          disabled:true,
          gradeValue:''
        })
      }
    }
    // 班级选择
    classChange = (val) =>{
      this.setState({classValue:val})
    }
     
    // 利率详情
    set = ()=>{
      this.props.dispatch({
        type:'beneficialCoin/rateDetail',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              visible:true,
              rate:res.data.rate
            })
          }    
        }
      })
    }
    // 设置
    handleOk = () => {
      this.props.form.validateFields((err,values)=>{
        if(!err){
          this.props.dispatch({
            type:'beneficialCoin/setRate',
            payload:{"rate":values.rate},
            callback:(res)=>{
              if(res.code === 200){
                message.success("年利率设置成功")
                this.setState({
                  confirmLoading: true,
                })
                setTimeout(() => {
                  this.setState({
                    visible: false,
                    confirmLoading: false,
                  });
                }, 1000);
                this.props.form.resetFields(["rate"])
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
      });
      this.props.form.resetFields(["rate"])
    };
    // 查看
    gotoDetail = (id)=>{
      this.props.dispatch(routerRedux.push("/coin-classDetail?id="+id))
    }
     // 导出
     export=()=>{
       debugger
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let gradeId = this.state.gradeValue.substring(this.state.gradeValue.lastIndexOf('-')+1, this.state.gradeValue.length)||'';
        let classId = this.state.classValue&&this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length)||'';
        let orderType = this.state.orderType;
        let url=portUrl("/manager/beneficial-coin/class-list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&gradeId="+gradeId+"&classId="+classId+"&orderType="+orderType)
        this.setState({exportUrl:url})
    }
    // 排序
    changeSort = (pagination, filters,sorter) =>{
      if(sorter.order == 'ascend'){
        this.setState({orderType:"2"})
      }else if(sorter.order == 'descend'){
        this.setState({orderType:"1"})
      }else if(sorter.order == undefined){
        this.setState({orderType:"1"})
      }
      if(sorter.order != undefined){
        const params={
          "page":this.state.page,
          "prePage":this.state.prePage,
          "gradeId":this.state.gradeValue?this.state.gradeValue.substring(this.state.gradeValue.lastIndexOf('-')+1, this.state.gradeValue.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):'',
          "orderType":sorter.order=='ascend'?'2':(sorter.order=='descend'?'1':'')
        }
        this.getCions(params)
      }
    }
    render(){
      const { confirmLoading, visible,data,cionList,total } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const columns = [
          {
            title: '排名',
            dataIndex: 'rowNo',
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          },{
            title: '班级',
            dataIndex: '',
            render:(record) =>{
              return <span>{record.gradeName}{record.className}</span>
            }
           
          },{
            title: '总资产',
            dataIndex: 'totalMoney',
            defaultSortOrder: 'descend',
            sorter: () =>{},
          },{
            title: '贡献人数',
            dataIndex: 'totalPersons',
          },{
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span>
                <a href="javascript:;" onClick={this.gotoDetail.bind(this,record.classId)}>查看</a>
              </span>
            )
        }
      ];
      const {commonData,gradeList} = this.props;
      let classOptions=[];
      commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
        return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
      })
      let options=[]
      gradeList&&gradeList.length>0&&gradeList.map(item=>{
        return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
      })
        return (
            <div className="content-main coinManage">
              <Form>
                <Row gutter={24}>
                  <Col span={4} style={{marginTop:"5px"}}>
                    <Select showSearch allowClear onChange={this.gradeChange.bind(this)} placeholder="年级">
                      {options}
                    </Select>
                  </Col>
                  <Col span={4} style={{marginTop:"5px"}}>
                    <Select showSearch allowClear value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled} placeholder="班级">
                      {classOptions}
                    </Select>
                  </Col>
                  <Col span={10} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button type='primary' onClick={this.set.bind(this)}>设置</Button>&emsp;
                    <Button type='primary' onClick={this.giveOut.bind(this)}>发放益小币</Button>&emsp;
                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
              </Form>
              <h3 className="total">总资产：<span>{total}</span></h3>            
              <Table scroll={{ x: 800 }} columns={columns} dataSource={cionList} pagination={false} onChange={this.changeSort.bind(this)}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage}/>
              <Modal
                className="coinModal"
                width="400px"
                title="年利率"
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
              >
                <Form>
                  <Row gutter={24}>
                      <Col span={22}>
                          <FormItem {...formItemLayout} label="年利率%">
                              {getFieldDecorator('rate',{initialValue:this.state.rate,rules:[{required:true,message:"年利率不能为空"},{pattern: new RegExp(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/),message: '请输入正确的利率'}]})(
                                  <Input placeholder="年利率"/>
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

const mapStateToProps = (state) => {
  return {
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(CoinManage));
