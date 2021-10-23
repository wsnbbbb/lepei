import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Upload,Tag, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, Card} from 'antd';
import { getQueryString,notSeconds } from '../../utils/public';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { portUrl } from '../../utils/img';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class WoUnauthPerson extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          unauthList:{},
          detailList:[],
          selectedRowKeys: [],
          selectedRowIds:[],
          isAll:0
        };
    }
    componentDidMount=()=>{
      const params = {
        "deviceKey":getQueryString("deviceKey"),
        "page":1,
        "prePage":20,
      }
      this.unauthPerson(params)
    }
    // 获取未授权人员列表
    unauthPerson = (params) =>{
      let id = getQueryString("deviceKey")
      this.props.dispatch({
        type:'woFaceManage/unauthPerson',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            res.data.dataList&&res.data.dataList.map(item =>{
              item.key = item.personId
            })
            this.setState({
             unauthList:res.data,
             detailList:res.data.dataList
            })
          }
        }
      })
    }
   
    // 查询
    search = () =>{
      this.props.form.validateFields((err,values) =>{
        const params = {
          "deviceKey":getQueryString("deviceKey"),
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw || '',
          "personType":values.personType || '',
        }
        this.unauthPerson(params)
      })
    } 
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields((err,values) =>{
        this.setState({page:current,prePage:size})
        const params = {
          "deviceKey":getQueryString("deviceKey"),
          "page":current,
          "prePage":size,
          "kw":values.kw || '',
          "personType":values.personType || '',
        }
        this.unauthPerson(params)
      })
    }
    
    onSelectChange = selectedRowKeys => {
      this.setState({ 
        selectedRowKeys,
        selectedRowIds : selectedRowKeys.map(Number) 
      },function(){console.log(this.state.selectedRowIds)});
    };
   
    // 选择全部
    selectAll = () =>{
      this.setState({
        isAll:1
      })
      const {detailList,selectedRowKeys,selectedRowIds} = this.state;
        detailList.map(item =>{
          selectedRowKeys.push(item.key)
          selectedRowIds.push(item.key)
      })
    }
    
    // 取消选择
    cancelSelect = () =>{
      this.setState({
        isAll:0,
        selectedRowKeys:[],
        selectedRowIds:[]
      })
    }
    // 返回
    cancel = () =>{
      window.history.go(-1)
    }
    // 确定
    submit = () =>{
      this.props.form.validateFields((err,values) =>{
        const params = {
          "personType":values.personType || '',
          "kw":values.kw || '',
          "deviceKey":getQueryString("deviceKey"),
          "isAll":this.state.isAll,
          "personIds":this.state.isAll==1?[]:this.state.selectedRowIds,
        }
        console.log({params});
        this.props.dispatch({
          type:'woFaceManage/submitAuth',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("授权成功")
              this.setState({
                selectedRowKeys:[],
                selectedRowIds:[],
                isAll:0
              })
              window.history.go(-1)
            }
          }
        })
        
      })
    }
    render(){
      const { unauthList, detailList,selectedRowKeys, selectedRowIds, isAll } = this.state;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 15 }
      };
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps:(record) =>({
          disabled: this.state.isAll == 1
        })
      };
      const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      },{
        title: '人员类型',
        dataIndex: 'personType',
        render:(record)=>(
          <span>
            {record==1?"学生":(record==2?"教师":(record==3?"职工":''))}
          </span>
        )
      },{
        title: '人员guid',
        dataIndex: 'personGuid'  
      },{
        title: '授权状态',
        dataIndex: '',
        render:(record)=>(
          <span>
            <Tag color="magenta">未授权</Tag>
          </span>
        )
      }]
     
        return (
          <div className="unauthPerson">
            <Card title="管理设备授权人员" className="cardBox">
              <Form className="content-form pd24">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="请输入姓名"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={5}>
                      <FormItem {...formItemLayout} label={'人员类型'}>
                        {getFieldDecorator("personType",{initialValue:'0'})(
                          <Select>
                            <Option value='0' key='0'>全部</Option>
                            <Option value={1} key='1'>学生</Option>
                            <Option value={2} key='2'>教师</Option>
                            <Option value={3} key='3'>员工</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={14} style={{textAlign:"right"}}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </Col>
                </Row>
              </Form>
              <p style={{marginBottom:"20px"}} className="pd24">
                {
                  selectedRowIds.length>0?<span>已选择{isAll==1?unauthList.totalCount:selectedRowIds.length}/{unauthList.totalCount}条记录&emsp;</span>:
                  <span>共{unauthList.totalCount}条记录&emsp;</span>
                }
                {unauthList.totalCount>0&&isAll==0?<a style={{margin:"0 15px"}} href="javascript:;" onClick={this.selectAll.bind(this)}>选择全部</a>:null}
                {selectedRowIds.length>0?<a href="javascript:;" onClick={this.cancelSelect.bind(this)}>取消选择&emsp;</a>:null}
              </p>
              <Table className="pd24" rowSelection={rowSelection}  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={unauthList.totalCount} totalPage={unauthList.totalPage} currentPage={unauthList.currentPage}/>
              <div className="footBtn">
                <Button className="btn" type='primary' onClick={this.cancel.bind(this)}>返回</Button>
                <Button className="btn" type='primary' onClick={this.submit.bind(this)}>提交</Button>
              </div>
            </Card>  
          </div>        
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(WoUnauthPerson));
