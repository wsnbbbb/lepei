import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Tooltip,Select,Divider, Upload, Form,Row,Col,Icon,Menu,Dropdown,message,Modal,DatePicker } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import {Encrypt, Decrypt} from '../../utils/secret'
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getOaStatus, dateToTimestamp, formatDate, isBlank, addKeys} from '../../utils/public';
import { portUrl, questionUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class OaRecordList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          page:1,
          prePage:20,
          list: [],
          exportUrl: '',
          fileList: [],
          imgs: [],
          previewVisible: false
        };
    }
    componentDidMount=()=>{
      const params={
        "page":this.state.page,
        "prePage":this.state.prePage,
      }
      this.getList(params)
      sessionStorage.removeItem("qiniuToken");
      this.props.dispatch({ //获取上传图片token
          type:'user/getPicToken',
          callback:(res)=>{
              if(res.code===200){
                  sessionStorage.setItem("qiniuToken",res.data.token)
                  this.setState({qiniuToken:res.data.token})
              }
          }
      })
     
    }
    getList=(params)=>{
      this.props.dispatch({
        type:'oa/getOaRecordList',
        payload: params,
        callback: res=>{
          if(res.code===200){
            addKeys(res.data.dataList)
            this.setState({
              list: res.data
            })
          }
        }
      })
    }
    showModal = (id) => {
      this.setState({
        currentId: id,
        visible: true,
      });
    }
    toDetail = (id) => {
        this.props.dispatch(
          routerRedux.push("/oa-record-detail/" + id)
        )
    }
    getBase64=(file)=> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    beforeUpload = (file)=> {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('上传图片需小于2MB!');
        return new Promise((resolve, reject)=>{
            reject(file)
        })
      }
    }
   
    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
  };

  handleImgsChange = ({ fileList }) => {
    console.log(fileList.length)
    this.setState({ fileList })
    let imgs=[]
    fileList.length>0&&fileList.map(item=>{
      if(item.response&&item.response.success){
        imgs.push(item.response.id)
      }
    })
    this.setState({imgs})
    console.log(imgs)
  };

  handleCancelPreView=()=>{
    this.setState({
      previewVisible: false
    })
  }
   
    export=(id)=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let url=portUrl("/manager/questionnaire/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&id="+id)
        this.setState({exportUrl:url})
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "status": values.status||'',
          "applyStartTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[0])):'',
          "applyEndTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[1])):'',
          "agreeStartTime": values.passTime?parseInt(dateToTimestamp(values.passTime[0])):'',
          "agreeEndTime": values.passTime?parseInt(dateToTimestamp(values.passTime[1])):'',
        }
        this.getList(params)
      })
    }


    handleOk =()=>{
      let me = this
      let params = {
        id: this.state.currentId, 
        reason: this.props.form.getFieldValue("reason")||'',
        images: this.state.imgs
      }
      this.props.dispatch({
        type:'oa/endOaRecord',
        payload: params,
        callback: res=>{
          if(res.code===200){
            message.success("操作成功！")
            this.props.form.resetFields(['reason']);
            this.setState({
              visible: false,
              imgs: [],
              fileList: []
            })
            me.props.form.validateFields((err, values) => {
              const params={
                "page" :me.state.page,
                "prePage": me.state.prePage,
                "kw": values.kw||'',
                "status": values.status||'',
                "applyStartTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[0])):'',
                "applyEndTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[1])):'',
                "agreeStartTime": values.passTime?parseInt(dateToTimestamp(values.passTime[0])):'',
                "agreeEndTime": values.passTime?parseInt(dateToTimestamp(values.passTime[1])):'',
              }
              me.getList(params)
            })
          }
        }
      })
    }
    handleCancel =()=>{
      this.props.form.resetFields(['reason']);
      this.setState({
        visible: false,
        imgs: [],
        fileList: []
      }) 
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk() {
          me.props.dispatch({
            type: 'oa/deleteOaRecord',
            payload: {"id": id},
            callback: (res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page" :me.state.page,
                    "prePage": me.state.prePage,
                    "kw": values.kw||'',
                    "status": values.status||'',
                    "applyStartTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[0])):'',
                    "applyEndTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[1])):'',
                    "agreeStartTime": values.passTime?parseInt(dateToTimestamp(values.passTime[0])):'',
                    "agreeEndTime": values.passTime?parseInt(dateToTimestamp(values.passTime[1])):'',
                  }
                  me.getList(params)
                })
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
          "kw": values.kw||'',
          "status": values.status||'',
          "applyStartTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[0])):'',
          "applyEndTime": values.applyTime?parseInt(dateToTimestamp(values.applyTime[1])):'',
          "agreeStartTime": values.passTime?parseInt(dateToTimestamp(values.passTime[0])):'',
          "agreeEndTime": values.passTime?parseInt(dateToTimestamp(values.passTime[1])):'',
        }
        this.getList(params)
      })
    }
    toAdd = () => {
      this.props.dispatch(
        routerRedux.push("/new-OaTemplate")
      )
    }

    onChange1 = (e)=>{
      this.setState({
        userName: e.target.value
      })
    }
    onChange2 = (e)=>{
      this.setState({
        realName: e.target.value
      })
    }
    onChange3 = (e)=>{
      this.setState({
        password: e.target.value
      })
    }
    onChange4 = (e)=>{
      this.setState({
        checkPassword: e.target.value
      })
    }
    export=()=>{
      this.props.form.validateFields((err, values) => {
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let kw=values.kw||'';
        let status=values.status||'';
        let applyStartTime=values.applyTime?parseInt(dateToTimestamp(values.applyTime[0])):'';
        let applyEndTime=values.applyTime?parseInt(dateToTimestamp(values.applyTime[1])):'';
        let agreeStartTime=values.passTime?parseInt(dateToTimestamp(values.passTime[0])):'';
        let agreeEndTime=values.passTime?parseInt(dateToTimestamp(values.passTime[1])):'';
        let url=portUrl("/manager/general-oa-records/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
          "&kw="+kw+"&status="+status+"&applyStartTime="+applyStartTime+"&applyEndTime="+applyEndTime+"&agreeStartTime="+agreeStartTime+"&agreeEndTime="+agreeEndTime)
        this.setState({exportUrl:url})
      })
    }
    render(){

        const {list, fileList, previewVisible, previewImage} = this.state;
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const columns = [{
            title: '流程名称',
            dataIndex: 'processName',
            render:(record)=>{
              return( <Tooltip placement="top" title={record}>
              <span className="grade-content">{record}</span>
            </Tooltip>)
            }
          }, {
            title: '当前状态',
            dataIndex: 'status',
            render:(record)=>{
              return( 
                <span>{getOaStatus(record)}</span>
              )
            }
          }, {
            title: '申请人',
            dataIndex: 'applicant',
          },{
            title: '申请时间',
            dataIndex: 'applyTime',
            render:(record)=>{
              return( 
                <span>{formatDate(record)}</span>
              )
            }
          },{
            title: '通过时间',
            dataIndex: 'agreeTime',
            render:(record)=>{
              return( 
                <span>{formatDate(record)}</span>
              )
            }
          },{
            title: '操作',
            dataIndex: '',
            width:200,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.toDetail.bind(this,record.id)}>查看</a> <Divider type="vertical" />
                {record.status==3?<a href="javascript:;" onClick={this.showModal.bind(this, record.id)}>操作</a>:null}
                {record.status==3?<Divider type="vertical" />:null}
                <Dropdown overlay={ 
                  <Menu>
                    <Menu.Item>
                    <span onClick={this.showConfirm.bind(this, record.id)}>删除</span>
                    </Menu.Item>
                  </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout1 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18}
          };
          const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16}
          };
          const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const dataSource = [
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
          ];
          
          const columns1 = [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address',
            },
          ];
        return (
            <div className="content-main questionnaire">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Input placeholder="请输入流程名称" />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'当前状态'}>
                      {getFieldDecorator("status",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="1">待审批</Option>
                          <Option value="2">审批中</Option>
                          <Option value="3">已通过</Option>
                          <Option value="4">未通过</Option>
                          <Option value="5">已结束</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10} >
                      <FormItem {...formItemLayout1} label={'申请时间'}>
                        {getFieldDecorator("applyTime", {})(
                           <RangePicker style={{ width: 380 }}
                           showTime={{ format: 'HH:mm:ss' }}
                           format="YYYY-MM-DD HH:mm:ss"
                           placeholder={['开始时间', '结束时间']}/>
                        )}
                      </FormItem>
                  </Col>
                  <Col span={6}>
                      &nbsp;&nbsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;
                      <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6} >
                        <FormItem {...formItemLayout1} label={'通过时间'}>
                          {getFieldDecorator("passTime", {})(
                            <RangePicker style={{ width: 380 }}
                            showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder={['开始时间', '结束时间']}/>
                          )}
                        </FormItem>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 800 }} columns={columns} dataSource={list.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
              <Modal
                className="modal-oaManage"
                title="操作"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                  <Form {...formItemLayout2} onSubmit={this.handleSubmit}>
                    <Form.Item label="操作">
                        {getFieldDecorator('option', {
                          initialValue: "",
                        })(
                          <Select disabled={true}>
                              <Option value="">结束</Option>
                          </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('reason', {
                          initialValue: "",
                          rules: [
                            {
                              required: false,
                              message: '',
                            },
                          ],
                        })(
                          <TextArea rows={4} placeholder="请输入备注" />
                      )}
                    </Form.Item>
                    <FormItem {...formItemLayout2} label={'图片'}>
                      <Upload
                            action="https://upload.qiniup.com/"
                            accept="image/jpg,image/jpeg,image/png"
                            listType="picture-card"
                            fileList={fileList}
                            multiple={true}
                            beforeUpload={this.beforeUpload}
                            onPreview={this.handlePreview}
                            onChange={this.handleImgsChange}
                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                        >
                            {fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreView}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </FormItem>
                    <FormItem {...formItemLayout2} label={'提示'}>
                        <p>最大2MB，支持JPG/PNG格式</p>
                    </FormItem>
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

  }
}

export default connect(mapStateToProps)(Form.create()(OaRecordList));
