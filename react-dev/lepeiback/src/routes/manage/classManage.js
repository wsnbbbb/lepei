import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Breadcrumb, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, getFileType} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ClassMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          gradeDisabled:true,
          reset: false,
          flag: false,
          historyParam:{}
        };
    }
    componentDidMount=()=>{
      const params = {
        "page":1,
        "prePage":20
      }
      let historyParam = JSON.parse(sessionStorage.getItem('historyParam'))
      if(historyParam){
        if(historyParam.gradeType){
          this.props.dispatch({
            type:'user/getGradeName',
            payload:{"type": historyParam.gradeType},
          })
          this.setState({
            gradeDisabled:false
          })
        }
        this.setState({
          historyParam,
          page:historyParam.page,
          prePage:historyParam.prePage,
        })
        this.getClassData(historyParam)
        sessionStorage.removeItem('historyParam')
      }else{
        this.getClassData(params)
      }
    }
    // 获取班级
    getClassData = (params) =>{
      this.props.dispatch({
        type:'class/getClassList',
        payload:params
      })
    }
    // 重置
    reset = () => {
      this.props.form.resetFields()
      this.setState({historyParam:{}})
    }
    // 展开/收起
    toggle = () => {
      this.setState({
        flag: !this.state.flag
      }, function () {
        if (this.state.flag) {
          this.setState({
            isShow: true,
          })
        } else {
          this.setState({
            isShow: false,
          })
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "status":values.status||'',
          "gradeType":values.gradeType||'',
          "gradeId":values.gradeId || ''
        }
        this.getClassData(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条班级信息吗？<br/><span style={{color:"#f00"}}>删除班级后，班级相关信息将不可恢复。<br/>例：班级作业、班级考评等</span></span>,
        onOk() {
          me.props.dispatch({
            type:'class/delClass',
            payload:{"classId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "gradeType":values.gradeType || '',
                    "status":values.status||'',
                    "gradeId":values.gradeId || ''
                  }
                  me.getClassData(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "gradeType":values.gradeType || '',
          "status":values.status||'',
          "gradeId":values.gradeId || ''
        }
        this.getClassData(params)
      })
    }

    // 班级添加/编辑
    goToDetail = (type,id) =>{
      if(Number(type) === 1){
        this.props.dispatch(routerRedux.push("/class-detail?type="+type))
      }else{
        this.props.form.validateFields((err, values) => {
          let curParams = {
            "page":this.state.page,
            "prePage":this.state.prePage,
            "kw":values.kw,
            "gradeType":values.gradeType,
            "status":values.status,
            "gradeId":values.gradeId
          }
          sessionStorage.setItem('historyParam',JSON.stringify(curParams))
        })
        this.props.dispatch(routerRedux.push("/class-detail?type="+type+"&classId="+id))
      }
    }
   
  // 学业阶段选择
  changeGradeType = (value) =>{
    if(value){
      this.props.dispatch({
        type:'user/getGradeName',
        payload:{"type": value},
      })
      this.setState({
        gradeDisabled:false
      })
    }else{
      this.setState({
        gradeDisabled:true
      })
    }
    this.props.form.resetFields(["gradeId"])
  }

  upload=()=>{
    this.props.dispatch(routerRedux.push("/upload-classes"));
  }
  uploadTeacher=()=>{
    this.props.dispatch(routerRedux.push("/upload-teacher"));
  }

  render(){
    const columns = [{
      title: '学业阶段',
      dataIndex: 'gradeType',
      render:(record)=>{
        return(<span>{getGradeType(record)}</span>)
      }
    }, {
      title: '年级名称',
      dataIndex: 'gradeName',
    }, {
      title: '班级名称',
      dataIndex: 'className',
    }, {
      title: '班级类型',
      dataIndex: 'classType',
      render:(record)=>{
        return(<span>行政班</span>)
      }
    }, {
      title: '班主任',
      dataIndex: 'teacherName',
    },{
      title: '学生人数',
      dataIndex: 'personNum',
    },{
      title: '状态',
      dataIndex: 'status',
      render:(record)=>{
        return(<span>{getFileType(record)}</span>)
      }
    },{
      title: '排序',
      dataIndex: 'sort',
    },{
      title: '操作',
      dataIndex: '',
      width:120,
      fixed:'right',
      render:(text, record) => (
        <span className="make-box">
          <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this,2,record.classId)}>编辑</a>
          <a href="javascript:;" onClick={this.showConfirm.bind(this,record.classId)}>删除</a> 
        </span>
      )
    }];
    const { getFieldDecorator } = this.props.form;
    const { flag, isShow, historyParam } = this.state;
    const {classList,gradeList} = this.props;
    if(!classList){
      return null;
    }
    let options = []
    gradeList && gradeList.length > 0 && gradeList.map(item =>{
      return options.push(<Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>)
    })
    return (
      <div className="class-manage">
        <div className="content-main">
          <Form className="content-form">
            <Row gutter={24}>
              <Col span={4}>
                {getFieldDecorator('kw',{initialValue:historyParam && historyParam.kw || ''})(
                  <Search placeholder="请输入班级名称"/>
                )}
              </Col> 
              <Col span={4}>
                {getFieldDecorator("gradeType",{initialValue:historyParam && historyParam.gradeType || undefined})(
                  <Select allowClear placeholder="学业阶段" onChange={this.changeGradeType.bind(this)}>
                    <Option value="1">幼儿园</Option>
                    <Option value="2">小学</Option>
                    <Option value="3">初中</Option>
                    <Option value="4">高中</Option>
                    <Option value="5">大学</Option>
                  </Select>
                )}
              </Col>
              <Col span={4}>
                {getFieldDecorator("gradeId",{initialValue:historyParam && historyParam.gradeId || undefined})(
                  <Select allowClear placeholder="年级" showSearch disabled={this.state.gradeDisabled}>
                    {options}
                  </Select>
                )}
              </Col>
              <Col span={4}>
                {getFieldDecorator("status",{initialValue:historyParam && historyParam.status || undefined})(
                  <Select placeholder="状态">
                    <Option value="1">正常</Option>
                    <Option value="2">已归档</Option>
                  </Select>
                )}
              </Col>
              <Col span={8} style={{ textAlign: 'right',paddingRight:'15px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none',paddingTop:'10px' }}>
              <Col>
                <Button type="primary" onClick={this.goToDetail.bind(this,1)}>添加</Button>&emsp;
                <Button type="primary" onClick={this.upload.bind(this)}><a href="javascript:;">导入班级</a></Button>&emsp;
                <Button type="primary" onClick={this.uploadTeacher.bind(this)}><a href="javascript:;">导入教师</a></Button>&emsp;
              </Col>
            </Row>
          </Form>              
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={classList.dataList} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={classList.totalCount} totalPage={classList.totalPage} currentPage={classList.currentPage}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
     classList:state.class,
     gradeList:state.user.gradeNameData
  }
}
export default connect(mapStateToProps)(Form.create()(ClassMange));
