import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button , Form ,Modal,message,Breadcrumb } from 'antd';
import { routerRedux, Link } from 'dva/router';
import PageIndex from '../../components/page';
import './style.less';
import { withActivation } from 'react-activation'


const confirm = Modal.confirm;
@withActivation
class doorList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          data:{},
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getList(params)

    }
      //路由状态返回，组件做些什么处理
      componentDidActivate = () => {
          console.log('AdttendanceDetailsStu: componentDidActivate');
          this.queryCurrentPageList();
      }
      //路由状态前进，组件做些什么处理
    componentWillUnactivate = () => {
      console.log('AdttendanceDetailsStu: componentWillUnactivate')
    }


      queryCurrentPageList = () => {
        let that = this;
        that.props.form.validateFields().then(values => {
          let pageSize = that.state.pageSize;
          let page = that.state.page;
          const params = Object.assign({page,pageSize});
          that.getList(params);
        });
      }
    getList=(params)=>{
      this.props.dispatch({
        type:'doorList/doorList',
        payload: params,
        callback: res=>{
          this.setState({
            data: res.data
          })
        }
      })
    }
     // 删除
     delete = (id) => {
      let me=this;
  // const id=getQueryString('id')
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
              type:'doorList/doorDelete',
              payload:{
                  "applyLeaveId": id
              },
              callback:(res)=>{
                  if(res.code===200){
                     message.success("删除成功！")
                    me.props.form.validateFields((err, values) => {
                      const params={
                        "kw":values.kw || '',
                        "page": me.state.page,
                        "prePage": me.state.prePage,
                      }
                      me.getList(params)
                    })
                  }
              }
          })
        },
        onCancel() {
         
        }
      })

    }
    // 点击详情，添加
    detail=(type,id)=>{
      if(Number(type)===1){
        this.props.dispatch(routerRedux.push("/door-new?type="+type))
      }else{
        this.props.dispatch(routerRedux.push("/door-new?id="+id + "&type=" + type))
      }
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
        }
        this.getList(params)
      })
    }
    
    render(){
        const columns = [{
            title: '设备',
            dataIndex: 'devNames',
            width:200,
        }
            ,{
            title: '人员',
            dataIndex: 'personNames',
            width: 200,
            
          },{
            title: '操作',
            dataIndex: '',
            width: 150,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.detail.bind(this,2, record.id)}>编辑</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={this.delete.bind(this,record.id)}>删除</a>
              </span>
            )
          }];
        
        return (
            <div className="content-main ban-card">
              <Button type='primary' onClick={this.detail.bind(this,1)}>添加</Button>         
              <Table className='content-table' persons columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    
  }
}
export default connect(mapStateToProps)(Form.create()(doorList));
