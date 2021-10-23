import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux, Link } from 'dva/router';
import {formatDate} from '../../utils/public';
import {getImg, portUrl} from '../../utils/img';
import {param} from '../../utils/param';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class RepairApplyList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          isShow:false,imgUrl:"img"
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getRepaieApplyList(params)
      this.props.dispatch({
        type:"repair/getAllRepairTypes",
      })
    }
    getRepaieApplyList=(params)=>{
      this.props.dispatch({
        type:'repair/getRepairList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "repairType":values.repairType,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRepaieApplyList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'repair/delRepairApply',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "repairType":values.repairType,
                    "startTime":me.state.startTime||"","endTime":me.state.endTime||""
                  }
                  me.getRepaieApplyList(params)
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
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "repairType":values.repairType,
          "startTime":this.state.startTime||"","endTime":this.state.endTime||""
        }
        this.getRepaieApplyList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/repair-apply-detail?repairId="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';let repairType=values.repairType||'';
        let startTime=this.state.startTime||'';
        let endTime=this.state.endTime||'';
        const url=portUrl("/manager/repair/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
        "&kw="+kw+"&repairType="+repairType+"&startTime="+startTime+"&endTime="+endTime)
        this.setState({exportUrl:url})
      })
    }
    bigImg=(img)=>{
      this.setState({
        isShow:true,imgUrl:img
      })
    }
    closeImg=()=>{
      this.setState({
        isShow:false,imgUrl:""
      })
    }
    render(){
        const columns = [{
            title: '编号',
            dataIndex: 'id',
          }, {
            title: '上报内容',
            className:'description',
            render:(record)=>{
              let img=record.imgs&&record.imgs.indexOf(',')>0?record.imgs.split(',')[0]:record.imgs
              return(
              <span>
                {record.imgs?<img src={getImg(img)} className='des-img' onClick={this.bigImg.bind(this,img)}/>:null}
                <Tooltip placement="top" title={record.description}>
                  <span className="des-content">{record.description}</span>
                </Tooltip>
              </span>
              )
            }
            
          }, {
            title: '报事报修类型',
            dataIndex: 'typeName',
          }, {
            title: '报修人',
            dataIndex: 'applicant',
          }, {
            title: '报修时间',
            dataIndex: 'applyTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '处理人',
            dataIndex: 'handler',
          },{
            title: '处理时间',
            dataIndex: 'dealTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span>{record==1?"待处理":(record==2?"已处理":(record==3?"已评价":"未知"))}</span>)
            }
          },{
            title: '报修地点',
            dataIndex: 'address',
            className:'description',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="des-content">{record}</span>
            </Tooltip>)}
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,record.id)}>查看</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
                  </Menu.Item>
                  </Menu>}><Icon type="ellipsis" />
                </Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {repairList,allTypes} = this.props;
          console.log(allTypes)
          let opts=[];
          allTypes&&allTypes.map(item=>{
            opts.push(<Option value={item.typeId} key={item.typeId}>{item.typeName}</Option>)
          })
          const menu = (
            <Menu>
              <Menu.Item>
                <Link to="repair-type">报事报修类型管理</Link>
              </Menu.Item>
              <Menu.Item>
                <a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
              </Menu.Item>
            </Menu>
          );
          console.log({repairList})
          if(!repairList){
            return null;
          }
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入报修人"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={7}>
                    <FormItem {...formItemLayout} label={'报事报修类型'}>
                      {getFieldDecorator("repairType",{initialValue:''})(
                        <Select showSearch onChange={this.handleChange.bind(this)} >
                          <Option value="">全部</Option>
                          {opts}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={''}>
                      {getFieldDecorator("time",{initialValue:''})(
                        <RangePicker onChange={this.onTimeChange} />
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
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={repairList.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={repairList.totalCount} totalPage={repairList.totalPage} currentPage={repairList.currentPage}/>
              {this.state.isShow?<div className="img-mask"></div>:null}
              {this.state.isShow?<div className="img-box">
                  <Icon type="close-circle" className="mask-close" onClick={this.closeImg.bind(this)}/>
                  <img src={getImg(this.state.imgUrl)} className='mask-img' alt=""/>  
              </div>:null}
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     repairList:state.repair,
     allTypes:state.repair.allTypes
  }
}
export default connect(mapStateToProps)(Form.create()(RepairApplyList));
