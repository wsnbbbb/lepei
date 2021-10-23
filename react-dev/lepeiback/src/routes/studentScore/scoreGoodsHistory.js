import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Breadcrumb, Form, Tooltip, Row, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {portUrl} from '../../utils/img';
import {getQueryString, formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreGoodsHistory extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          exportUrl: '',
          list: {},
          title:"兑换记录",

        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
       const params={
         "page": 1,
         "prePage": 20,
         "goodsId": getQueryString("id")
       }
       this.getList(params)

       this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/score-goods"
        },
      })
    }

    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })    
  }

    getList=(params)=>{
      this.props.dispatch({
        type: 'score/exchangeRecord',
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

    // 分页
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page": current,
          "prePage": size,
          "goodsId": getQueryString("id") 
        }
        this.getList(params)
      })
    }

    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let url=portUrl("/manager/person-score-goods/exchange-record-export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&goodsId=" + getQueryString("id"))
          this.setState({exportUrl:url})
        })
    }

    render(){
        const columns = [{
            title: '商品名称',
            dataIndex: 'goodsName',
            render:(record)=>{
              return( <Tooltip title={record}>
                <span className="tooltip-content">{record}</span>
              </Tooltip>)
            }
          } ,{
            title: '学生姓名',
            dataIndex: 'personName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }, {
            title: '兑换数量',
            dataIndex: 'num',
          }, {
            title: '兑换时间',
            dataIndex: 'exchangeDate'
          }];
          
        const { list } = this.state;
        return (
            <div className="content-main student-score">
              {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/score-goods">积分商城</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>兑换记录</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row style={{paddingBottom: '20px'}}>
                    <Button type='primary' ><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
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

  }
}

export default connect(mapStateToProps)(Form.create()(ScoreGoodsHistory));
