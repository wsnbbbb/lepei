import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, TreeSelect, Button, Input, Select , Form, Row, Col, Breadcrumb,Modal,DatePicker } from 'antd';
import PageIndex from '../../components/page';
import { formatDate, dateToTimestamp, getSexType} from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';

const TreeNode = TreeSelect.TreeNode;
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class BluetoothTeacherRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          data: {},
          classValue:'',
          startTime: '',
          endTime: '',
          exportUrl: '',
          treeData: []
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
      }
      this.getList(params)
      this.props.dispatch({
        type:'user/getCommonGradeList'
      })
      this.props.dispatch({
        type:'user/getDepartmentList',
        callback:(res)=>{
            if(res.code===200){
                this.setState({treeData:res.data})
            }
        }
      })
    }
  
    getList=(params)=>{
      this.props.dispatch({
        type:'bluetooth/bluetoothTeacherRecord',
        payload:params,
        callback: res=>{
          this.setState({
            data: res.data
          })
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "startTime": this.state.startTime || '',
          "endTime": this.state.endTime  || ''
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
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
          "startTime": this.state.startTime || '',
          "endTime": this.state.endTime  || ''
        }
        this.getList(params)
      })
    }
    // 时间选择
    onChangeRange=(date, dateString)=>{
      console.log({dateString});
      this.setState({
        startTime: dateToTimestamp(dateString[0]),
        endTime: dateToTimestamp(dateString[1]),
      })
    }
    // 导出
    export = () => {
      this.props.form.validateFields((err, values) => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let kw = values.kw || '';
        let departmentId = values.departmentId ? values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length) : '';
        let startTime = this.state.startTime || '';
        let endTime = this.state.endTime || '';
        console.log(departmentId)
        let url = portUrl("/manager/bluetooth-entry-data/teacher-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
          "&departmentId=" + departmentId + "&startTime=" + startTime + "&endTime=" + endTime)
        this.setState({ exportUrl: url })
      })
    }
    // 部门选择
    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })

    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          },{
            key:'departmentName',
            title: '部门',
            dataIndex: 'departmentName',
          }, {
            title: '出入时间',
            dataIndex: 'entryTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          },  {
            title: '地点',
            dataIndex: 'place'
          } ,{
            title: '出入方式',
            dataIndex: 'entryType',
            render:(record)=>{
              return(<span>{record==1?"入":"出"}</span>)
            }
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }
          
          ];
          const { getFieldDecorator } = this.props.form;
          const {treeData } = this.state;
        return (
          <div className="blue-tooth">
            <div className="content-main didano">
              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{})(
                        <Search placeholder="请输入教师姓名"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem>
                      {getFieldDecorator("departmentId")(
                        <TreeSelect
                          placeholder="请选择部门"
                          showSearch
                          dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                          allowClear
                          treeDefaultExpandAll
                        >
                        {this.renderTreeNodes(treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} >
                      <FormItem>
                        {getFieldDecorator("time")(
                           <RangePicker style={{ width: 380 }}
                           showTime={{ format: 'HH:mm:ss' }}
                           format="YYYY-MM-DD HH:mm:ss"
                           placeholder={['开始时间', '结束时间']}
                           onChange={this.onChangeRange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={4} >
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
            </div>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(BluetoothTeacherRecord));
