import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Form,Row,Col,Select, message } from 'antd';
import { getSexType } from '../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

class AddDepartmentPerson extends Component{
    constructor(props) {
        super(props);
        this.state = {
          selectedRowKeys:[],
          selectedRows:[]
        };
    }
    componentDidMount=()=>{
      // const params={"kw":"","jobStatus":"-1"}
      // this.getList(params)
    }
    getList=(params)=>{
      let {datas} = this.props;
      this.props.dispatch({
        type:'user/getTeachersAndWorks',
        payload:params,
        callback:(res)=>{
          if(res.code===200){
            datas=res.data
          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "kw":values.kw||'',
          "jobStatus":values.jobStatus,
          "status": 1
        }
        this.getList(params)
      })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows,selectedRowKeys});
    }
    selectAll=(selected, selectedRows, changeRows)=>{
      this.setState({ selectedRows});
    }
    personCancel=()=>{
        this.props.getData('cancel')
        this.setState({ selectedRowKeys:[]});
    }
    personSubmit=()=>{
        const {selectedRows} = this.state;
        if(selectedRows.length<=0){
          return message.error("请先选择人员",2)
        }
        let ids=[];
        selectedRows.length>0&&selectedRows.map(item=>{
          return ids.push(item.personId)
        })
        const {data} = this.props;
        this.props.dispatch({
          type:'department/addDepartmentPerson',
          payload:{"personId":ids,"departmentId":data},
          callback:(res)=>{
            if(res.code===200){
              this.props.getData('add')
              this.setState({ selectedRowKeys:[]});
            }
          }
        })
    }
    render(){
        const columns = [{
          title: '姓名',
          dataIndex: 'personName'
        }, {
          title: '性别',
          dataIndex: 'sex',
          render:(text,record)=>(
            <span>{getSexType(record.sex)}</span>
          )
        }, {
            title: '部门',
            dataIndex: 'departmentName',
        }];
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
            onSelectAll: (selected, selectedRows, changeRows) => {
              this.selectAll(selected, selectedRows, changeRows)
            },
          };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        };
        const {datas,departmentName} =this.props;
        if(!datas){
          return null;
        }
        return (
            <div className="content-main">
              <div className="top">添加人员（当前部门：{departmentName}）</div>
              <Form className="content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search  placeholder="请输入姓名或部门"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={12}>
                    <FormItem {...formItemLayout} label='人员有无部门'>
                      {getFieldDecorator('jobStatus',{initialValue:'-1'})(
                        <Select style={{width:120}} placeholder="请选择">
                          <Option value="-1">全部</Option>
                          <Option value="0">无部门</Option>
                          <Option value="1">有部门</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={1}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table style={{paddingBottom:60}} className='content-table' rowSelection={rowSelection} columns={columns} dataSource={datas.data} pagination={false}/>
              <div className="bottom-btns">
                    <Button style={{marginRight:20}} onClick={this.personCancel.bind(this)}>取消</Button>
                    <Button type="primary" onClick={this.personSubmit.bind(this)}>确定</Button>
              </div>
            </div>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    personData:state.user.teacherAndWorksData
  }
}

export default connect(mapStateToProps)(Form.create()(AddDepartmentPerson));
