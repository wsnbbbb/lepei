import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Col, Row, Input, Button ,Tooltip,Breadcrumb} from 'antd';
import PageIndex from '../../components/page';
import {Link,routerRedux} from "dva/router";
import { getQueryString ,addKeys} from '../../utils/public';
import { onlyDate } from '../../utils/public';
import { portUrl } from '../../utils/img'
import './style.less';

const FormItem = Form.Item;
const Search = Input.Search;

class StatisticsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            prePage: 20,
            data:[],
            arr:[],
            exportUrl:'',
            title:"详情",
            

        }
    }
    componentDidMount = () => {
        const id = getQueryString('id')
        const params = {
            "kw": "",
            "page": this.state.page,
            "prePage": this.state.prePage,
            "valuationId": id
        }
        this.getDetailList(params)
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/evaluation-statistics"
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
    // 获取统计详情
    getDetailList = (params) => {
        this.props.dispatch({
            type: 'teacherEvaluation/getDetailList',
            payload: params,
            callback: (res) => {
                console.log("res:", res.data.dataList);
                if (res.code === 200) {
                   
                    res.data.dataList.map(item =>{
                        item.topQuotas.map(v =>{
                            item[v.quotasId] = v.score
                        })
                    })
                    let arr = []
                    res.data.dataList&&res.data.dataList[0].topQuotas.map(v=>{
                        arr.push({
                            title: v.name,
                            dataIndex: v.quotasId.toString(),
                        })
                    })
                    addKeys(res.data.dataList)
                    this.setState({
                        data: res.data,
                        arr: arr
                    })
                }
            }
        })
    }
    // 分页
    onPageChange = (current, size) => {
        const id = getQueryString('id')
        this.props.form.validateFields((err, values) => {
            this.setState({ page: current, prePage: size })
            const params = {
                "page": current,
                "prePage": size,
                "kw": values.kw || '',
                "valuationId": id

            }
            this.getDetailList(params)
        })
    }
    // 查询
    search = () => {
        const id = getQueryString('id')
        this.props.form.validateFields((err, values) => {
            const params = {
                "page": 1,
                "prePage": this.state.prePage,
                "kw": values.kw || '',
                "valuationId": id
            }
            this.getDetailList(params)
        })

    }
    // 导出
    export = ()=>{
        let id = getQueryString('id')
        this.props.form.validateFields((err, values) => {
            let token = sessionStorage.getItem("token");
            let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
            let userId = sessionStorage.getItem("userId");
            let kw = values.kw||'';
            let url = portUrl("/manager/course-valuation-records/export-record-detail-list?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&valuationId="+id)
            this.setState({exportUrl:url})
            // console.log("id",id);
            
        })
    }
  
    render() {
        const { data, arr } = this.state
        const { getFieldDecorator } = this.props.form;
       
        let columns = [
            {
                title: '序号',
                dataIndex: 'id',
            },
            {
                title: '评价人',
                dataIndex: 'teacherName',
            },
            {
                title: '评课分数',
                dataIndex: 'totalScore',
            },
        ]
        let columns1 = [
            {
                title: '文字评课',
                width:300,
                dataIndex: 'valuation',
                render:(record)=>{
                    return(
                    <Tooltip placement="top" title={record}>
                      <span className="text">{record}</span>
                    </Tooltip>
                    )
                }
            },
        ]
     
        if(arr){
            columns = [...columns, ...arr, ...columns1]
        }
        
        return (
            <div className="content-main">
                 {/* <Breadcrumb style={{marginBottom:"20px"}}>
                    <Breadcrumb.Item><Link to="/evaluation-statistics">评课统计</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb> */}
                <Form>
                    <Row gutter={24}>
                        <Col span={4}>
                            <FormItem label="">
                                {getFieldDecorator('kw')(
                                    <Search placeholder="评价人姓名" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} offset={0}>
                            <Button type='primary' onClick={this.search.bind(this)} className="marginTop">查询</Button>
                            <Button type='primary' style={{ margin: '5px 10px 0 10px' }}><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                        </Col>

                    </Row>
                </Form>
                <Table scroll={{ x: 800 }} columns={columns} dataSource={data&&data.dataList} pagination={false} />
                <PageIndex getPage={this.onPageChange.bind(this)} total={data&&data.totalCount} totalPage={data&&data.totalPage} currentPage={data&&data.currentPage} />
                
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps)(Form.create()(StatisticsDetail));