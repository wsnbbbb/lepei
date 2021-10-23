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
import QueryString from 'qs';
import copy from 'copy-to-clipboard';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class ScreenList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleAdd: false,
          reset:false,
          data: [],
          deviceNo: '',
          remark: '',
          currentDeviceNo: '',
          selectedRowKeys: []
        };
    }
    componentDidMount=()=>{
      this.getList()

    }
    getList=()=>{
      this.props.dispatch({
        type:'bigScreen/screenTypelist',
        payload: {},
        callback: res=>{
          this.setState({
            data: res.data
          })
        }
      })
    }

    copy = () => {
      // if(copy(`${questionUrl}?id=${Encrypt(sessionStorage.getItem("schoolId"))}`)){
      //     console.log("复制成功");
          message.success("复制成功")
      //     console.log(Encrypt(sessionStorage.getItem("schoolId")))
      // }else{
      //     console.log("复制失败")
      // }

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

    new = () => {
      this.props.dispatch(routerRedux.push("/new-screen"))
    }
 
    toConfig = (type) => {
      this.props.dispatch(routerRedux.push("/set-screen?type="+type))
    }
    
    render(){
        const columns = [{
            title: '屏数',
            dataIndex: 'screenNum',
          }, {
            title: '分辨率',
            dataIndex: 'type',
            render:(record)=>{
            return(<span>{record==1 ? "1920*1080" : "1920*576"}</span>)
          }
          },{
            title: '创建时间',
            dataIndex: 'createTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 200,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toConfig.bind(this, record.type)}>编辑</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={this.copy.bind(this)}>复制地址</a>
              </span>
            )
          }];

        return (
            <div className="content-main ban-card">
              <Button type='primary' onClick={this.new.bind(this)}>新建</Button>         
              <Table className='content-table'  columns={columns} dataSource={this.state.data} pagination={false}/>
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
export default connect(mapStateToProps)(Form.create()(ScreenList));
