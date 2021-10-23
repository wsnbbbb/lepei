import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getCardType, getCardStatus} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class CardList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleAdd: false,
          reset:false,
          data: {},
          deviceNo: '',
          remark: '',
          currentDeviceNo: '',
          selectedRowKeys: []
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getList(params)
      
    }
    getList=(params)=>{
      this.props.dispatch({
        type:'banCard/cardlist',
        payload:params,
        callback: res=>{
          res.data.dataList&&res.data.dataList.map(item=>{
            item.key = item.id
          })
          this.setState({
            data: res.data
          })
        }
      })
    }
    configBatch = ()=>{
      this.props.dispatch(routerRedux.push("/card-config?id="+this.state.selectedRowKeys.join(",")+"&status=1"))
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "type":values.type||'',
          "status":values.status||''
        }
        this.getList(params)
        this.setState({page:1})
      })
    }
  
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "type":values.type||'',
          "status":values.status||''
        }
        this.getList(params)
      })
    }
    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/room-apply-detail?id="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
   
    showModal = () => {
        this.setState({
          visible: true,
        });
    }

    toConfig = (id, status) => {
      this.props.dispatch(routerRedux.push("/card-config?id="+id+"&status="+status))
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,reset:true,
          visibleAdd: false
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows,selectedRowKeys});
    }
    selectAll=(selected, selectedRows, changeRows)=>{
      this.setState({ selectedRows});
    }
    render(){
        const columns = [{
            title: '班牌MAC',
            dataIndex: 'devSn',
          }, {
            title: '软件版本',
            dataIndex: 'appVersion',
          },{
            title: '固件版本',
            dataIndex: 'firmwareVersion',
          },{
            title: '类型',
            dataIndex: 'type',
            render:(record)=>{
              return(<span>{getCardType(record)}</span>)
            }
          },{
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
              return(<span style={{color: record==0?"red":""}}>{getCardStatus(record)}</span>)
            }
          },{
            title: '当前IP（内网）',
            dataIndex: 'ip',
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toConfig.bind(this, record.id, record.status)}>配置</a> 
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const { selectedRowKeys } = this.state;
          const rowSelection = {
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectChange(selectedRowKeys, selectedRows)
              },
              // onSelect: (record, selected, selectedRows) => {
              //   console.log(record, selected, selectedRows);
              //   this.onSelectChange(record, selected, selectedRows)
              // },
              // onSelectAll: (selected, selectedRows, changeRows) => {
              //   this.selectAll(selected, selectedRows, changeRows)
              // },
              getCheckboxProps: record => ({
                disabled: record.status == 0, // Column configuration not to be checked
                stauts: record.stauts,
              }),
            };
      
        return (
            <div className="content-main ban-card">
             
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="班牌MAC/IP地址/固件版本/软件版本"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label='类型'>
                      {getFieldDecorator('type', {initialValue: ''})(
                        <Select>
                            <Option value="">全部</Option>
                            <Option value="1">横版</Option>
                            <Option value="2">竖版</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label='状态'>
                      {getFieldDecorator('status', {initialValue: ''})(
                        <Select>
                            <Option value="">全部</Option>
                            <Option value="1">在线</Option>
                            <Option value="0">离线</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' disabled={this.state.selectedRowKeys.length==0} onClick={this.configBatch.bind(this)}>批量配置</Button>
                  </Col>
                </Row>
             
              </Form>              
              <Table rowSelection={rowSelection} className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
     
              
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
export default connect(mapStateToProps)(Form.create()(CardList));
