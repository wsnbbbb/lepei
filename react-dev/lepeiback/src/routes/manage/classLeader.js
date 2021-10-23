import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Form,Row,Col,Icon,Menu,Dropdown,Modal,message } from 'antd';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class ClassLeaderMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          controlBtn:false
        };
    }
    componentDidMount=()=>{
      this.getClassLeaderList()
    }
    getClassLeaderList=(params)=>{
      this.props.dispatch({
        type:'classLeader/getClassLeaderList',
        payload:params
      })
    }
    showModal = () => {
      this.props.form.resetFields(['name','intro']);
      this.setState({
        visible: true,
        name:'',
        intro:'',
        edit:false
      });
    }
    showEditModal = (record) => {
      this.props.form.resetFields(['name','intro']);
      this.setState({
        visible: true,
        name:record.name,
        intro:record.intro,
        id:record.id,
        edit:true
      });
    }
  
    //添加年级
    handleOk = () => {
      const {edit,controlBtn} = this.state;
      this.props.form.validateFields((err, values) => {
        if(!err&&!controlBtn){
          this.props.dispatch({
            type:edit?'classLeader/updateClassLeader':'classLeader/addClassLeader',
            payload:{
              "name":values.name,
              "intro":values.intro,
              "id":this.state.id
            },
            callback:(res)=>{
              if(res.code===200){
                message.success(edit?'编辑成功！':'创建成功！',3)
                this.props.form.resetFields(['name','intro']);
                this.setState({
                  visible: false,controlBtn:true
                });
                const params={
                  "kw":values.kw||'',
                }
                this.getClassLeaderList(params)
              }
              this.setState({controlBtn:false})
            }
          })
        }
      })
    }
  
    handleCancel = () => {
      this.props.form.resetFields(['name','intro']);
      this.setState({
        visible: false,
      });
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "kw":values.kw||'',
        }
        this.getClassLeaderList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条班干部信息吗？',
        onOk() {
          me.props.dispatch({
            type:'classLeader/delClassLeader',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "kw":values.kw||'',
                  }
                  me.getClassLeaderList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    render(){
        const {classLeaderData} =this.props;
        const {name,intro} = this.state;
        if(!classLeaderData){
          return null;
        }
        const columns = [{
            title: '班干部名称',
            dataIndex: 'name',
          }, {
            title: '班干部简介',
            dataIndex: 'intro',
            width:'60%'
          }, {
            title: '操作',
            dataIndex: '',
            width:100,
            render:(text, record) => {
              return(
              <span className="make-box">
                {record.schoolId==0?null:<a href="javascript:;" className="check-btn" onClick={this.showEditModal.bind(this,record)}>编辑</a>}
                {record.schoolId==0?null:<Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this,record.id)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>}
              </span>
              )
              
            }
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入班干部名称"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={2} offset={1}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} >
                        <Button onClick={this.showModal}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' columns={columns} dataSource={classLeaderData.data} pagination={false}/>
              <Modal
                title="添加班干部"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col span={20}>
                      <FormItem {...formItemLayout} label={'班干部名称'}>
                        {getFieldDecorator("name",{initialValue:''||name,rules:[{required:true,message:'请输入班干部名称',whitespace: true,}]})(
                          <Input placeholder='请输入班干部名称'/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={20}>
                      <FormItem {...formItemLayout} label={'班干部简介'}>
                        {getFieldDecorator("intro",{initialValue:''||intro})(
                          <TextArea placeholder="请输入班干部简介" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>    
              </Modal>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     classLeaderData:state.classLeader
  }
}

export default connect(mapStateToProps)(Form.create()(ClassLeaderMange));
