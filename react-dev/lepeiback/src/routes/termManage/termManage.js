import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, message, Input, Row, Menu, Dropdown } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import PageIndex from '../../components/page';
const confirm = Modal.confirm;

class TermManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputText:'',
            datas:{},
            
        };
    }
    componentDidMount=()=>{
        const params={
            "kw":"",
            "page":1,
            "prePage":20
        }
        this.getClassData(params)
    }
    
    getClassData=(params)=>{
        this.props.dispatch({
            type:'term/termList',
            payload:params,
            callback:(res) =>{
                if(res.code===200){
                    this.setState({
                        datas:res.data,
                        termList:res.data.dataList
                    })
                }
            }
        })
    }

    onChange=(e)=> {
        this.setState({
            inputText: e.target.value
        })
    }
    // 查询
    search=()=>{
        const params={
            "kw": this.state.inputText,
            "page": 1,
            "prePage": 20
        }
        this.getClassData(params)
    }
    // 分页
    onPageChange=(current,size)=>{
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":this.state.inputText||'',
        }
        this.getClassData(params)
    }
    editSemester=(id)=>{
        this.props.dispatch(
            routerRedux.push(`/term-edit/${id}`)
        )
    }

    delSemester=(id)=>{
        console.log(id)
        let _this=this;
        confirm({
          title: '提示',
          content: '确定删除该学期吗？',
          onOk() {
                _this.props.dispatch({
                type:'term/delTerm',
                payload:{"semesterId": id},
                callback:(res)=>{
                    if(res.code===200){
                        message.success('删除成功！', 3)
                        const params={
                            "kw":"",
                            "page":1,
                            "prePage":20
                        }
                        _this.getClassData(params)
                    }
                }
                })
            }
        })
    }
   
    newTerm=()=>{
        this.props.dispatch(
            routerRedux.push("/new-term")
        )
    }
    calendarManage=(semesterId)=>{
        this.props.dispatch(
            routerRedux.push("/school-calendar-manage?semesterId="+semesterId)
        )
    }
    // 分年级设置
    gradeSet = (semesterId)=>{
        this.props.dispatch(
            routerRedux.push("/grade-setting?semesterId="+semesterId)
        )
    }
    render(){
        const { datas,termList } = this.state;
        // const {termList} =this.props;
        // console.log(termList.dataList)
          const columns = [{
            title: '编号',
            dataIndex: 'semesterId',
            // render: text => <a href="javascript:;">{text}</a>,
          }, {
            title: '学期名称',
            dataIndex: 'semesterName',
          }, {
            title: '开始时间',
            dataIndex: 'startDate',
          }, {
            title: '结束时间',
            dataIndex: 'endDate',
          }, {
            title: '操作',
            width:300,
            fixed:'right',
            render: (text, record) => (
                <span>
                  <a href="javascript:;" onClick={this.calendarManage.bind(this,record.semesterId)}>校历管理</a>&emsp;
                  <a href="javascript:;" onClick={this.gradeSet.bind(this,record.semesterId)}>分年级设置</a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Dropdown overlay={
                      <Menu>
                        <Menu.Item>
                            <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.editSemester.bind(this,record.semesterId)}>编辑</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.delSemester.bind(this,record.semesterId)}>删除</a>
                        </Menu.Item>
                    </Menu>
                  }>
                    <a className="ant-dropdown-link" href="javascript:;" >更多</a>
                </Dropdown>
                </span>
              ),
          }];
          const data = [{
            key: '1',
            name: '第一学期',
            startTime: "2018-10",
            endTime:"2019-6",
          },
          ];

        return (
            <div className="content-main content-building content-termManage">
                <div className="content-box">
                    <Row className="option-wrap" style={{marginBottom:"20px"}}>
                        <Input placeholder="学期名称" onChange={this.onChange.bind(this)} onPressEnter={this.search.bind(this)} />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={this.search.bind(this)} >查询</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={this.newTerm}>+&nbsp;&nbsp;新建学期</Button>
                    </Row>
                    <Table  columns={columns} dataSource={termList}  pagination={false}/>
                    <PageIndex getPage={this.onPageChange.bind(this)} total={datas.totalCount} totalPage={datas.totalPage} currentPage={datas.currentPage}/>
                </div>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // termList: state.term.dataList
  }
}

export default connect(mapStateToProps)(TermManage);
