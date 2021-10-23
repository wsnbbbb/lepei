import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Breadcrumb,Radio,message} from 'antd';
import PageIndex from '../../components/page';
import {dateTime} from '../../utils/public';
import { Link } from "dva/router";
import { portUrl } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
class TeacherProperty extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        data:{},
        dataList:[],
        changeVal:'',
        exportUrl:'',
        orderType:'1',
        coinList:[],
        visible: false,
        visible1: false,
        confirmLoading1: false,
        modeValue:'1',
        teacherCount:[],
        selectVal:0,
        count1:"0",
        count2:"0",
        teachersList:[],
        money:'',
        title:"教师资产列表",
      };
  }
  componentDidMount=()=>{
    const params={
      "page":1,
      "prePage":20,
      "orderType":'1'
    }
    this.teacherProperty(params)
    this.teachersList()
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
  // 获取教师资产列表
  teacherProperty=(params)=>{
    this.props.dispatch({
      type:'beneficialCoin/teacherProperty',
      payload:params,
      callback:(res)=>{
        this.setState({
          data:res.data,
          dataList:res.data.dataList
        })
      }
    })
  }

  // 获取所有教师
  teachersList = () =>{
    this.props.dispatch({
      type:'beneficialCoin/teachersList',
      payload: {
        personType: 2,
        status: 1
      },
      callback:(res)=>{
        if(res.code===200){
          this.setState({
            teachersList: res.data
          })
        }
      }
    })
  }

  // 查询
  search=()=>{
      const params={
        "page":1,
        "prePage":this.state.prePage,
        "kw":this.state.changeVal||'',
        "orderType":this.state.orderType
      }
      this.teacherProperty(params)
  }
  
  // 分页
  onPageChange=(current,size)=>{
      this.setState({page:current,prePage:size})
      const params={
        "page":current,
        "prePage":size,
        "kw":this.state.changeVal||'',
        "orderType":this.state.orderType
      }
      this.teacherProperty(params)
  }
  
  // 姓名搜索
  onChange = (e) =>{
    this.setState({changeVal:e.target.value})
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
  // 返回
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 发放
  grant = () =>{
    this.props.dispatch({
      type:'beneficialCoin/teacherCount',
      callback:(res)=>{
        if(res.code===200){
          this.setState({
            visible1: true,
            teacherCount:res.data,
            count1:res.data[0].count
          })
        }
      }
    })
  }
  // 确定操作
  handleOk = ()=>{
    this.props.form.validateFields((err,values)=>{
      if(!err){
        const params = {
          "grantMode":this.state.modeValue,
          "groups":this.state.modeValue=='1'?values.identity+'':values.groups.join(','),
          "money":values.money
        }
        this.props.dispatch({
          type:'beneficialCoin/grantCoin',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success("益小币发放成功")
              this.setState({
                confirmLoading1: true,
              })
              setTimeout(() => {
                this.setState({
                  visible1: false,
                  confirmLoading1: false,
                  modeValue:'1',
                  selectVal:0,
                  money:"0.00",
                  count2:'0'
                });
              }, 500);
              this.props.form.resetFields(["identity","groups","money"])
              this.search()
            }
          }
        })
      }
    })
  }

  handleCancel1 = () => {
    this.setState({
      visible1: false,
      modeValue:'1',
      selectVal:0,
      money:"0.00",
      count2:'0'
    });
    this.props.form.resetFields(["identity","groups","money"])
  };
  
  // 导出
  export=()=>{
    let token=sessionStorage.getItem("token");
    let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
    let userId=sessionStorage.getItem("userId");
    let kw=this.state.changeVal||'';
    let orderType = this.state.orderType;
    let url=portUrl("/manager/beneficial-coin/teacher-list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&kw="+kw+"&orderType="+orderType)
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
        "kw":this.state.changeVal||'',
        "orderType":sorter.order=='ascend'?'2':(sorter.order=='descend'?'1':'')
      }
      this.teacherProperty(params)
    }
  }
  // 发放方式选择
  changeGrantMode = (e)=>{
    this.setState({
      modeValue:e.target.value,
      count2:"0",
      money:'0'
    })
    this.props.form.resetFields(["identity","groups","money"])
  }
  // 选择教师身份
  changeSelect = (value,option) =>{
    this.setState({
      selectVal:option.props.value,
      count1:option.props.count
    })
  }
  // 发放金额
  changeMoney = (e)=>{
    this.setState({
      money:e.target.value
    })
  }
  // 教师多选
  choose = (value)=>{
    console.log(value.length);
    this.setState({
      count2:value.length
    })
  }
  
  render(){
    const { visible,data,dataList,coinList,visible1,confirmLoading1,modeValue,teacherCount,count1,count2,teachersList,money } = this.state;
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
          title: '姓名',
          dataIndex: 'personName',
        },{
          key:'bindTel',
          title: '最后发放金额',
          dataIndex: 'lastDistribute',
        },{
          title: '教师账户',
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
    let options = []
    teacherCount&&teacherCount.map(item =>{
      return options.push(<Select.Option key={item.type} count={item.count} value={item.type}>{item.name}</Select.Option>)
    })
    let children = []
    teachersList&&teachersList.map(item =>{
      return children.push(<Option key={item.personId} value={item.personId}>{item.personName}</Option>)
    })
      return (
          <div className="content-main">
            {/* <div className="breadcrumb"> 
                <Breadcrumb>
                  <Breadcrumb.Item><Link to="/beneficial-Coin">益小币管理</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>教师资产列表</Breadcrumb.Item>
                </Breadcrumb>
            </div> */}
            <Form className="fromContent">
              <Row gutter={24}>
                <Col span={5} style={{marginTop:"5px"}}>
                  <Search onChange={this.onChange.bind(this)} value={this.state.changeVal} placeholder="教师姓名"/>
                </Col>
                <Col span={10} >
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' onClick={this.grant.bind(this)}>发放</Button>&emsp;
                  <Button type='primary'><a  href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                </Col>
              </Row>
            </Form>              
            <Table scroll={{ x: 1000 }} columns={columns} dataSource={dataList} pagination={false} onChange={this.changeSort.bind(this)}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage}/>
            <Modal
              className="coinModal"
              title="资产明细"
              visible={visible}
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
            <Modal
              className="coinModal"
              title="发放益小币"
              visible={visible1}
              onOk={this.handleOk}
              confirmLoading={confirmLoading1} 
              onCancel={this.handleCancel1}
            >
              <Form style={{padding:"20px 0"}}>
                <Row gutter={24}>
                    <Col span={22}>
                      <FormItem {...formItemLayout} label="发放方式">
                        <Radio.Group onChange={this.changeGrantMode.bind(this)} value={modeValue}>
                          <Radio value="1">按身份发放</Radio>
                          <Radio value="2">按教师发放</Radio>
                        </Radio.Group>
                      </FormItem>
                    </Col>
                    {
                      modeValue=='1'?
                      <Col span={22}>
                        <FormItem {...formItemLayout} label="教师身份">
                          {getFieldDecorator('identity',{initialValue:this.state.selectVal})(
                            <Select onChange={this.changeSelect.bind(this)}  showSearch>
                              {options}
                            </Select>
                          )} 
                        </FormItem>
                      </Col> :null
                    }
                    {
                      modeValue=='2'?
                      <Col span={22}>
                          <FormItem {...formItemLayout} label="选择教师">
                              {getFieldDecorator('groups',{rules:[{required:true,message:"请选择教师"}]})(
                                  <Select
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  mode="multiple"
                                  style={{ width: '100%' }}
                                  placeholder="请点击选择多个"
                                  onChange={this.choose.bind(this)}
                                >
                                  {children}
                                </Select>
                              )}
                          </FormItem>
                      </Col> :null
                    } 
                    <Col span={22}>
                        <FormItem {...formItemLayout} label="发放金额">
                            {getFieldDecorator('money',{rules:[{required:true,message:"发放金额不能为空"},{pattern: new RegExp(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/),message: '请输入正确的金额'}]})(
                                <Input placeholder="请输入发放金额" onChange={this.changeMoney.bind(this)}/>
                            )}
                        </FormItem>
                    </Col> 
                </Row>
                <Row >
                  <Col span={20} offset={7}>
                    {
                      modeValue=='1'?
                      <p>共{count1}名教师，合计{money?(money*count1).toFixed(2):'0.00'}元</p>:null
                    }
                    {
                      modeValue=='2'?
                      <p>共{count2}名教师，合计{money?(money*count2).toFixed(2):'0.00'}元</p>:null
                    }
                    
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
}
}

export default connect(mapStateToProps)(Form.create()(TeacherProperty));
