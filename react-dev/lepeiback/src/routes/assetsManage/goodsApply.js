import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, DatePicker,Tooltip, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
import { portUrl, getUpload } from '../../utils/img';
import { formatDate, assetStatus } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;

class GoodsApply extends Component{
  constructor(props) {
      super(props);
      this.state = {
        page:1,
        prePage:20,
        assetsTypeList:[],
        applyList:{},
        detailList:[],
        exportUrl:'',
        selectedRowKeys:[],
        ids:[]
      };
  }
  componentDidMount=()=>{
    this.goodsApply()
   
  }
  // 物品申领列表
  goodsApply = (params) =>{
    this.props.dispatch({
      type:'assetsManage/goodsApply',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            applyList:res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }
  // 起止时间
  onTimeChange = (date, dateString) => {
    const start = dateString[0];
    const end = dateString[1];
    this.setState({
      applyTime:start + ' ~ ' + end
    })
  }
  // 查询
  search=()=>{
    this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw": values.kw||'',
          "status": values.status||'',
          "applyTime": this.state.applyTime||'',
        }
        this.goodsApply(params)
    })
  }
  // 分页
  onPageChange = (current,size) =>{
    this.props.form.validateFields((err,values) =>{
      this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw": values.kw||'',
          "status": values.status||'',
          "applyTime": this.state.applyTime||'',
        }
        this.goodsApply(params)
    })
  }
  // 选择项
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let ids=[];
    selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
      return ids.push(item.id)
    })
    
    this.setState({ ids,selectedRowKeys});
  }
  // 全选
  selectAll=(selected, selectedRows, changeRows)=>{
    let id = [];
    if(selected === true){
      selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
        return id.push(item.id)
      })
      this.setState({ ids:id});
    }else{
      this.setState({ ids:[]});
    }
  }
  // 导出
  export=()=>{
    this.props.form.validateFields((err, values) => {
      let token=sessionStorage.getItem("token");
      let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId=sessionStorage.getItem("userId");
      let kw = values.kw||'';
      let status = values.status||'';
      let applyTime = this.state.applyTime||'';
      let url=portUrl("/manager/property-get-apply/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&status="+status+"&kw="+kw+"&applyTime="+applyTime)
      this.setState({exportUrl:url})
    })
  }
  // 批量删除
  batchesDel = () =>{
      if(this.state.ids.length == 0){
        return message.error("请先选择内容，再进行删除！")
      }
      let that = this;
      confirm({
        title: '提示',
        content: <span>请选择要删除的内容？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/batchesDelApply',
            payload:{"ids":that.state.ids},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功')
                that.search()
                that.setState({
                  ids:[],
                  selectedRowKeys:[]
                })
              }
            }
          })
        },
        onCancel() {},
      });
  }
  // 删除
  del = (id) =>{
    let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'assetsManage/delApply',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                that.search()
              }
            }
          })
        },
        onCancel() {},
      });
  }
  // 处理人设置
  handlerSet = () =>{
    this.props.dispatch(routerRedux.push("/handler-set"))
  }
 
  // 查看
  gotoDetail = (id) =>{
    this.props.dispatch(routerRedux.push("/assets-apply-detail?id="+id))
  }
  
  render(){
    const { applyList, detailList, selectedRowKeys, } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.selectAll(selected, selectedRows, changeRows)
      },
    };
    
    const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        title: '申领人',
        dataIndex: 'applyName',
        
      },{
        title: '物品名称',
        dataIndex: 'propertyNames',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span className="text">{record}</span>
          </Tooltip>
          )
      },{
        title: '申领用途',
        dataIndex: 'applyUse',
        render:(record)=>(
          <Tooltip placement="top" title={record}>
            <span className="text">{record}</span>
          </Tooltip>
        )
      },{
        title: '申请时间',
        dataIndex: 'applyTime',
        render:( record) => (
          <span>{formatDate(record)}</span>
        )
        
      },{
        title: '审批状态',
        dataIndex: 'status',
        render:( record) => (
          <span>{assetStatus(record)}</span>
        )
      },{
        title: '操作',
        dataIndex: '',
        width:180,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.gotoDetail.bind(this,record.id)}>查看&emsp;</a>
            {record.status != 6 ? <a href="javascript:;" onClick={this.del.bind(this,record.id)}>删除</a>:null}
          </span>
        )
      }
    ]
      return (
          <div className="content-main goods-apply">
            <Form className="content-form">
              <Row gutter={24}>
                <Col span={4}>
                    <FormItem>
                    {getFieldDecorator('kw')(
                        <Search placeholder="申领人"/>
                    )}
                    </FormItem>
                </Col> 
                <Col span={4}>
                <FormItem>
                    {getFieldDecorator("status")(
                      <Select allowClear placeholder="请选择审批状态">
                        <Option value="1">待审批</Option>
                        <Option value="2">审批中</Option>
                        <Option value="3">已通过</Option>
                        <Option value="4">未通过</Option>
                        <Option value="5">待领取</Option>
                        <Option value="6">已发放</Option>
                      </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} >
                    <FormItem>
                      {getFieldDecorator("applyTime",{initialValue:''})(
                          <RangePicker onChange={this.onTimeChange}/>
                      )}
                    </FormItem>
                </Col>
                <Col span={6} >
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type='primary' onClick={this.handlerSet.bind(this)}>处理人设置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Dropdown overlay={
                    <Menu>
                      <Menu.Item>
                          <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a>
                      </Menu.Item>
                      <Menu.Item>
                          <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.batchesDel.bind(this)}>批量删除</a>
                      </Menu.Item>
                    </Menu>
                  }>
                    <a  href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                  </Dropdown>
                </Col>
              </Row>
            </Form>
            <Table  columns={columns} dataSource={detailList} pagination={false} rowSelection={rowSelection}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={applyList.totalCount} totalPage={applyList.totalPage} currentPage={applyList.currentPage}/>
           
          </div> 
              
      );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(GoodsApply));
