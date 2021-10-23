import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Divider,Breadcrumb,Tabs,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class essentialList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          title:"个性化要点",
        };
    }
    componentDidMount=()=>{
      const params={
        "templateId": this.props.match.params.id,
        "page": this.state.page,
        "prePage": this.state.prePage
      }
      this.getEssentialList(params)

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-evaluation"
        },
      })
    }
    
    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })    
    }

    getEssentialList=(params)=>{
      this.props.dispatch({
        type:'evaluation/essentialList',
        payload: params
      })
    }
    showModal = () => {
      this.props.form.resetFields();
      this.setState({
        visible: true,
        userName:'',
        realName:'',
        password:'',
        checkPassword:'',
      });
    }
    editPoint = (id,quotaId) => {
      localStorage.setItem("quotaId", quotaId)
      this.props.dispatch(
        routerRedux.push("/edit-point/" + id)
      )
    }
  
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
      });
    }
    onTimeChange=(date,dateString)=> {
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
      })
    }

    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定删除改评价要点？',
        onOk() {
          me.props.dispatch({
            type: 'evaluation/deletePoint',
            payload: {"pointId": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                const params={
                  "templateId": me.props.match.params.id,
                }
                me.getEssentialList(params)
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "templateId": this.props.match.params.id,
        }
        this.getEssentialList(params)
      })
    }
    render(){
        const {templateList} =this.props;
        if(!templateList){
          return null;
        }
        const columns = [{
          title: '一级指标',
          dataIndex: 'quotaName',
        },{
            title: '要点',
            dataIndex: 'pointName',
          }, {
            title: '星星/分数',
            dataIndex: 'maxScore',
          }, {
            title: '默认星星/分数',
            dataIndex: 'defaultScore',
          },{
            title: '创建人',
            dataIndex: 'createName',
          },{
            title: '适用年级班级',
            dataIndex: 'className',
          },{
            title: '创建时间',
            dataIndex: 'createTime',
            render:(record)=>{
                return formatDate(record)
            }
          },{
            title: '状态',
            dataIndex: 'status',
            render:(record)=>{
                return record==0 ? <span className="color-green">已删除</span> : <span>使用中</span>
            }
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" onClick={this.editPoint.bind(this,record.pointId, record.quotaId)}>编辑</a>
                  <Divider type="vertical" />
                <a href="javascript:;"  onClick={this.showConfirm.bind(this,record.pointId)}>删除</a>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main content-essential">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>个性化要点</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
                 
                  <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={templateList.dataList} pagination={false}/>
                  <PageIndex getPage={this.onPageChange.bind(this)} total={templateList.totalCount} totalPage={templateList.totalPage} currentPage={templateList.currentPage}/>
                
        
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    templateList: state.evaluation.essentialData
  }
}

export default connect(mapStateToProps)(Form.create()(essentialList));
