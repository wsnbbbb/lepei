import React,{ Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Dropdown, Menu, Icon, Modal,message,DatePicker } from 'antd';
import PageIndex from '../../components/page';
import { portUrl } from '../../utils/img';
import { formatDate } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class LeaveSchocolRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          datas:{},
          list:[],
          classList:[],
          time:'',
          exportUrl:'',
          selectedRowKeys:[],
          ids:[]
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":this.state.prePage,
      }
      this.getAllClass()
      this.leaveSchoolList(params)
     
    } 
    // 获取所有班级
    getAllClass=()=>{
      this.props.dispatch({
        type: 'leaveSchoolManage/getAllClass',
        callback: res=>{
          if(res.code === 200){
            this.setState({
              classList: res.data
            })
          }
        }
      })
    }
   
    // 获取放学班级列表
    leaveSchoolList=(params)=>{
      this.props.dispatch({
        type:'leaveSchoolManage/leaveSchoolClasses',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              datas:res.data,
              list:res.data.dataList,
            })
          }
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields(["kw","classId","time"],(err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "classId":values.classId||'',
          "time":this.state.time||'',
        }
        console.log({params});
        
        this.leaveSchoolList(params)
      })
    }
   
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields(["kw","classId","time"],(err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "classId":values.classId||'',
          "time":this.state.time||'',
        }
        this.leaveSchoolList(params)
      })
    }

    // 日期选择
    onTimeChange = (date, dateString) => {
      const start = dateString[0];
      const end = dateString[1];
      this.setState({
        time:start + ' ~ ' + end
      })
    }
  
    // 导出
    export = () =>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let classId = values.classId||'';
        let kw = values.kw||'';
        let time = this.state.time||'';
        let url=portUrl("/manager/leave-school-records/list-export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&classId="+classId+"&kw="+kw+"&time="+time)
        this.setState({exportUrl:url})
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
      let allIds = [];
      if(selected === true){
        selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
          return allIds.push(item.id)
        })
        this.setState({ ids:allIds});
      }else{
        this.setState({ ids:[]});
      }
    }
    // 批量删除
    batchDel = () =>{
      if(this.state.ids.length == 0){
        return message.error("请先选择内容，再进行删除！")
      }
      let that = this;
      confirm({
        title: '提示',
        content: <span>确定删除所选内容？</span>,
        onOk() {
          that.props.dispatch({
            type:'leaveSchoolManage/batchDelRecord',
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
    delRcord = (id) =>{
      let that = this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          that.props.dispatch({
            type:'leaveSchoolManage/delLeaveSchool',
            payload:{id},
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
   
    render(){
      const { datas, list, classList,selectedRowKeys} = this.state;
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
      const columns = [
          {
            title: '编号',
            dataIndex: 'id',
          },{
            title: '学生姓名',
            dataIndex: 'studentName',
          },{
            title: '年级班级',
            dataIndex: 'className',
          },{
            title: '放学老师',
            dataIndex: 'teacherName',
          },{
            title: '出校时间',
            dataIndex: 'leaveTime',
            render:(record) => (
              <span>{formatDate(record)}</span>
            )
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span>
                <a href="javascript:;" onClick={this.delRcord.bind(this,record.classId)}>删除</a>
              </span>
            )
        }
      ];
      
      let options = []
      classList&&classList.length>0&&classList.map(item=>{
        return options.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
      })

      return (
        <div className="content-main">
          <Form>
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Search placeholder="学生姓名"/>
                  )}
                </FormItem>
              </Col> 
              
              <Col span={5}>
                <FormItem  label=''>
                  {getFieldDecorator("classId")(
                    <Select 
                    placeholder="班级"
                    showSearch 
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                      {options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem >
                  {getFieldDecorator("time")(
                    <RangePicker onChange={this.onTimeChange} />
                  )}
                </FormItem>
              </Col>
              <Col span={6} >
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href={this.state.exportUrl}  onClick={this.export.bind(this)}>导出</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.batchDel.bind(this)}>批量删除</a>
                    </Menu.Item>
                  </Menu>
                  }>
                  <a  href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                </Dropdown>
              </Col>
              
            </Row>
          </Form> 
          <Table scroll={{ x: 1000 }} columns={columns} dataSource={list} pagination={false} rowSelection={rowSelection}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={datas.totalCount} totalPage={datas.totalPage} currentPage={datas.currentPage}/> 
          
         
        </div>
      );
    }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(LeaveSchocolRecord));
