import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Switch ,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { formatDate } from '../../utils/public'
import { routerRedux } from 'dva/router';
import './style.less';
import { log } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AddTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          disabled:false,
          disabled1:false,
          classValue:'',
          classValue1:'',
          allReport:{},
          detailList:[],
          visible:false,
          confirmLoading:false,
          qiniuToken:'',
          personName:'',
          name:'',
        };
    }
    componentDidMount=()=>{
      
     this.qualityTemplate()
    }
    // 获取评价模板列表
    qualityTemplate = (params) =>{
      this.props.dispatch({
        type:'synthesizeEvaluation/qualityTemplate',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              allReport:res.data,
              detailList:res.data.dataList
            })
          }
        }
      })
    }
    
    // 查询
    Search = () =>{
      this.props.form.validateFields((err,values) =>{
        const params = {
          "kw":values.kw || '',
          "page":1,
          "prePage":this.state.prePage
        }
        this.qualityTemplate(params)
      })
    }
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields((err,values) =>{
        this.setState({page:current,prePage:size})
          const params = {
            "page":current,
            "prePage":size,
            "kw":values.kw || '',
          }
          this.qualityTemplate(params)
      })
    }
    // 开关状态
    changeStatus = (id,status) =>{
      console.log(id,status);
      let that = this;
      confirm({
          title: '提示',
          content: <span>确定要{status==1?"停用":"开启"}吗？</span>,
          onOk() {
              that.props.dispatch({
              type:'synthesizeEvaluation/switchStatus',
              payload:{"templateId":id},
              callback:(res)=>{
                if(res.code===200){
                  message.success('状态修改成功！')
                  that.Search()
                }
              }
            })
          },
          onCancel() {},
      });
    }

    // 新建
    add = (type,id) =>{
      if(type === 1){
        this.props.dispatch(routerRedux.push("/add-template"))
      }else{
        this.props.dispatch(routerRedux.push("/add-template?templateId="+id))
      }
    }
    // 等级设置
    levelSet = (id) =>{
      this.props.dispatch(routerRedux.push("/level-set?templateId="+id))
    }
    // 删除评价模板
    delTemplate = (id) =>{
      let that = this;
      confirm({
          title: '提示',
          content: <span>确定要删除这条信息吗？</span>,
          onOk() {
              that.props.dispatch({
              type:'synthesizeEvaluation/delTemplate',
              payload:{"templateId":id},
              callback:(res)=>{
                if(res.code===200){
                  message.success('删除成功！')
                  that.Search()
                }
              }
            })
          },
          onCancel() {},
      });
    }
    // 模板管理
    templateManage =(id) =>{
      this.props.dispatch(routerRedux.push("/evaluation-template-manage?templateId="+id))
    }
    render(){
      const { allReport, detailList} = this.state;
      const { getFieldDecorator } = this.props.form;
      const columns = [{
        title: '序号',
        dataIndex: 'id',
      },{
        title: '模板名称',
        dataIndex: 'templateName',
      },{
        title: '是否启用',
        dataIndex: '',
        render:(record) => (
          <span><Switch checked={record.status == 1?true:(record.status == 0?false:'')} onChange={this.changeStatus.bind(this,record.id,record.status)} /></span>
        )
      },{
        title: '学期',
        dataIndex: 'semesterName',
      },{
        title: '创建时间',
        dataIndex: 'createTime',
        render:(record) => (
          <span>{formatDate(record)}</span>
        )
      },{
        title: '操作',
        width:300,
        dataIndex: '',
        render:(record) => (
          <span>
              <a href="javascript:;" onClick={this.add.bind(this,2,record.id)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.delTemplate.bind(this,record.id)}>删除</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.templateManage.bind(this,record.id)}>模板管理</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.levelSet.bind(this,record.id)}>等级设置</a>
          </span>
        )
      }
      ]
        const {allTerms, commonData, gradeList } = this.props;
        let termChild = []
        allTerms&&allTerms.length>0&&allTerms.map(item => {
          termChild.push(<Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>)
        })
        let classOptions = [];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
        })
        let options = []
        gradeList&&gradeList.length>0&&gradeList.map(item => {
          return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
        })
        return (
          <div className="content-main eva-template">     
              <Form className="content-form">
                <Row gutter={24}>
                    <Col span={4}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search placeholder="模板名称"/>
                        )}
                      </FormItem>
                    </Col> 
                    <Col span={10} >
                        <Button type='primary' onClick={this.Search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='primary' onClick={this.add.bind(this,1)}>新建</Button>
                       
                    </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={detailList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={allReport.totalCount} totalPage={allReport.totalPage} currentPage={allReport.currentPage}/>
              
          </div>     
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(AddTemplate));
