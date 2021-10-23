import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input,Form, Row, Col,Modal,Breadcrumb} from 'antd';
import PageIndex from '../../components/page';
import { portUrl } from '../../utils/img';
import { Link } from "dva/router";
import {getQueryString,dateTime} from '../../utils/public'
import './style.less';
import { log } from 'util';

const Search = Input.Search;

class CoinClassDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          studentName:'',
          exportUrl:'',
          list:{},
          detailList:[],
          visible: false,
          confirmLoading: false,
          orderType:'1',
			    title:"班级详情",
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
        "orderType":'1',
        "classId":getQueryString("id")
      }
      this.classProperty(params)

    //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/beneficial-coin"
      },
      })
    }

    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
      }
    // 获取班级资产明细
    classProperty=(params)=>{
      this.props.dispatch({
        type:'beneficialCoin/classProperty',
        payload:params,
        callback:(res)=>{
          this.setState({
            list:res.data,
            detailList:res.data.dataList
          })
        }
      })
    }

    // 查询
    search=()=>{
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":this.state.studentName||'',
          "classId":getQueryString("id"),
          "orderType":this.state.orderType
        }
        this.classProperty(params)
    }
   
    // 分页
    onPageChange=(current,size)=>{
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":this.state.studentName||'',
          "classId":getQueryString("id"),
          "orderType":this.state.orderType
        }
        this.classProperty(params)
    }
    // 导出
    export=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=this.state.studentName||'';
        let classId = getQueryString("id");
        let orderType = this.state.orderType;
        let url=portUrl("/manager/beneficial-coin/student-list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+"&classId="+classId+"&orderType="+orderType)
        this.setState({exportUrl:url})
    }

    onChange = (e) =>{
        this.setState({studentName:e.target.value})
    }
    // 查看
    detail = (id)=>{
      this.props.dispatch({
        type:'beneficialCoin/propertyRecord',
        payload:{"personId":id},
        callback:(res)=>{
          this.setState({
            visible:true,
            personName:res.data.personName, 
            totalMoney:res.data.totalMoney, 
            coinList:res.data.list
          })
        }
      })
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
          "kw":this.state.studentName||'',
          "classId":getQueryString("id"),
          "orderType":sorter.order=='ascend'?'2':(sorter.order=='descend'?'1':'')
        }
        this.classProperty(params)
      }
    }
    // 返回
    handleCancel = () => {
      this.setState({
        visible: false,
      });
    };
    render(){
      const { confirmLoading, visible, list, detailList, coinList } = this.state;
      const columns = [
          {
            title: '排名',
            dataIndex: 'rowNo',
          }, {
            title: '学生姓名',
            dataIndex: 'personName',
          },{
            title: '学生资产',
            dataIndex: 'totalMoney',
            defaultSortOrder: 'descend',
            sorter: () =>{},
          },{
            title: '操作',
            dataIndex: '',
            width:150,
            fixed:'right',
            render:(text, record) => (
              <span>
                <a href="javascript:;" onClick={this.detail.bind(this,record.personId)}>查看</a>
              </span>
            )
        }
      ];
     
        return (
            <div className="content-main">
               {/* <div className="breadcrumb"> 
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/beneficial-coin">益小币管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>班级详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
              <Form className="fromContent">
                <Row gutter={24}>
                  <Col span={5} style={{marginTop:"5px"}}>
                    <Search onChange={this.onChange.bind(this)} value={this.state.studentName} placeholder="学生姓名"/>
                  </Col>
                  <Col span={10} >
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                    <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
              </Form>              
              <Table scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false} onChange={this.changeSort.bind(this)}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              <Modal
                className="coinModal"
                title="资产明细"
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handleCancel}>返回</Button>}
              >
                <div className="modalContent">
                  <h3 style={{textAlign:"center"}}>
                    <span style={{marginRight:"80px"}}>{this.state.personName}</span>
                    <span>{this.state.totalMoney}</span>
                  </h3>
                  {
                    coinList&&coinList.map((item,index)=>{
                      return <div className="list" key={index}>
                        <div className="title">
                          <h5>{item.date}</h5>
                          <p>
                            <span>收入{item.income}元，</span>
                            <span>支出{item.pay?item.pay:"0.00"}元，</span>
                            <span>共{item.count}笔</span>
                          </p>
                        </div>
                        {
                          item.list&&item.list.map(obj =>{
                            return <div className="detail" key={obj.id}>
                              <div>
                                <h5>{obj.description}</h5>
                                <p>{dateTime(obj.createTime)}</p>
                                {
                                  obj.remark?<p>{obj.remark}</p>:null
                                }
                              </div>
                              <p>{obj.money}</p>
                            </div>
                          })
                        }
                      </div>
                    })
                   
                  }
                </div>
               
              </Modal>
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(CoinClassDetail));
