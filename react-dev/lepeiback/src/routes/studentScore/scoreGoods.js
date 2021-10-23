import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Divider, Form, Row, Col, Tooltip,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl} from '../../utils/img';
import {getGradeType,getSexType,getResidence, formatDate, formatIdcard} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreGoods extends Component{
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
       this.getGoodsList(params)
    
    }
    getGoodsList=(params)=>{
      this.props.dispatch({
        type: 'score/personScoreGoods',
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
          "kw":values.kw||''
        }
        this.getGoodsList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条信息吗？',
        onOk() {
          me.props.dispatch({
            type:'score/personScoreGoodsDelete',
            payload:{"id": id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page": me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||''
                  }
                  me.getGoodsList(params)
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
        this.getGoodsList(params)
      })
    }
    goToHistory=(id)=>{
        this.props.dispatch(routerRedux.push("/score-history?&personId="+id))
    }
    goToRule=()=>{
        this.props.dispatch(routerRedux.push("/score-rule"))
    }
    goToAdd=()=>{
      this.props.dispatch(routerRedux.push("/add-goods"))
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-student"));
    }
    edit=(id)=>{
      this.props.dispatch(routerRedux.push("/edit-goods?id="+id));
    }
    toHistory=(id)=>{
      this.props.dispatch(routerRedux.push("/score-goods-histroy?id="+id));
    }
    delete=(id)=>{
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
              this.getGoodsList(params)
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
            title: '商品名称',
            dataIndex: 'name',
            render:(record)=>{
              return( <Tooltip title={record}>
                <span className="tooltip-content">{record}</span>
              </Tooltip>)
            }
          } ,{
            title: '兑换价',
            dataIndex: 'price',
          }, {
            title: '可兑换数量',
            dataIndex: 'stock',
          }, {
            title: '有效期',
            dataIndex: 'levelTitle',
            render:(text, record) => (
              <span>{formatDate(record.startTime)} - {formatDate(record.endTime)}</span>
            )
          }, {
            title: '操作',
            dataIndex: '',
            width: 220,
            fixed: 'right',
            render: (text, record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.edit.bind(this, record.id)}>编辑</a>
                  <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showConfirm.bind(this, record.id)}>删除</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.toHistory.bind(this, record.id)}>兑换记录</a>
              </span>
            )
          }];
          
          const { list } = this.state;
          const { getFieldDecorator } = this.props.form;

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
                          placeholder="请输入商品名称"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={8} >
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                        <Button type='primary' onClick={this.goToAdd.bind(this)}>新增商品</Button>
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

export default connect(mapStateToProps)(Form.create()(ScoreGoods));
