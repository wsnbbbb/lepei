import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Icon,Breadcrumb,Modal,message,DatePicker,Drawer,Checkbox,Upload,Typography} from 'antd';
import PageIndex from '../../components/page';
import { getImg } from '../../utils/img';
import {getWeek,onlyDate,toTimestamp} from '../../utils/public';
import { portUrl } from '../../utils/img';
import { consultRegisterUrl } from '../../config'
import { Encrypt } from '../../utils/secret'
import moment from 'moment'
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Paragraph } = Typography;
const {  RangePicker } = DatePicker;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class consultRegister extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          consultList:[],//列表数据
          reset: false,
          flag: false,//展开收起开关
          Visible: false,//抽屉
          fileList: [],//上传文件列表
          imgs:[],//上传图片
          previewVisible: false,//图片预览弹窗
          previewImage: '',//预览图片地址
          exportUrl: '',//导出地址
          openWeeks:'',
          schoolId:''
        };
    }
    componentDidMount=()=>{
      const params = {
        "page":1,
        "prePage":20
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
     const schoolId=Encrypt(sessionStorage.getItem("schoolId"))
     console.log(schoolId)
     this.setState({schoolId})
    }
    // 获取记录列表
    getList = (params) =>{
      this.props.dispatch({
        type:'consultEntrance/getConsultList',
        payload:params,
        callback:(res) =>{
          if(res.code == 200) {
            this.setState({
              consultList:res.data
            })
          }
        }
      })
    }
    // 重置
    reset = () => {
      this.props.form.resetFields()
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
          "sex":values.sex||'',
          "visitWeeks":values.visitWeeks||'',
          "submitStartTime": values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
          "submitEndTime": values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
        }
        this.getList(params)
        this.setState({page:1})
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'consultEntrance/delConsultList',
            payload:{"id":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！')
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "sex":values.sex||'',
                    "visitWeeks":values.visitWeeks||'',
                    "submitStartTime": values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
                    "submitEndTime": values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
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
    //配置
    configure=()=>{
      this.props.dispatch({
        type:'consultEntrance/configDetail',
        callback:(res) =>{
          if(res.code == 200) {
            let imgData = []
            let hashArr = []
            res.data.imgs.length > 0 && res.data.imgs.map((item,index)=>{
              imgData.push({
                uid: index + '~' + item,
                name: 'xxx.png',
                status: 'done',
                url: getImg(item),
              })
              hashArr.push(item)
            })
            this.setState({
              fileList: imgData,
              imgs:hashArr,
              openWeeks:res.data.openWeeks,
              Visible:true
            })
          }
        }
      })
    }
    // 分页
    onPageChange = (current,size) =>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "visitWeeks":values.visitWeeks||'',
          "submitStartTime": values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
          "submitEndTime": values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
          "sex":values.sex||'',
        }
        this.getList(params)
      })
    }

    // 关闭抽屉
  onClose = () => {
    this.setState({
      Visible: false,
      fileList:[]
    })
    this.props.form.resetFields()
  };

    // 导出
    export = () => {
      this.props.form.validateFields((err, values) => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let kw = values.kw || '';
        let sex = values.sex || '';
        let visitWeeks = values.visitWeeks&&(values.visitWeeks).toString() || '';
        let submitStartTime=values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||''
        let submitEndTime=values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||""
        let url = portUrl("/manager/enrolment/consult/records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + 
          "&kw=" + kw + "&sex=" + sex + "&visitWeeks=" + visitWeeks + "&submitStartTime=" + submitStartTime+"&submitEndTime=" + submitEndTime)
        this.setState({ exportUrl: url })
      })
    }

  // 图片上传
  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    let imgs = []
    fileList.length > 0 && fileList.map(item =>{
      if(item.response && item.response.success){
        imgs.push(item.response.id)
      }else{
        const uid = item.uid.split('~')[1]
        imgs.push(uid)
      }
    })
    this.setState({imgs})
  }

    // 图片上传限制
    beforeUpload =(file)=> {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('上传图片不能大于2MB!');
        return new Promise((resolve, reject)=>{
          reject(file)
        })
      }
    }

  // 关闭图片预览
  handleCancel = () => this.setState({ previewVisible: false });
  // 图片预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

    // 保存
    save = () =>{
      this.props.form.validateFields((err, values) => {
        const params={
          "openWeeks":values.openWeeks||[],
          "imgs":this.state.imgs || []
        }
         console.log(params)
         this.props.dispatch({
            type:'consultEntrance/saveConfigConfigure',
            payload:params,
            callback:(res) =>{
              if(res.code == 200) {
                  message.success('配置成功')
                  this.setState({
                    Visible: false,
                    fileList: [],
                    imgs:[],
                  })
                  this.props.form.resetFields()
              }
            }
          })
      })
    }

  render(){

    const columns = [{
      title: '幼儿姓名',
      dataIndex: 'childName',
    }, {
      title: '性别',
      dataIndex: 'sex',
      width:70,
      render:(record)=>{
        return(<span>{record==1?"男":(record==2?"女":"")}</span>)
      }
    }, {
      title: '出生日期',
      dataIndex: 'birthday',
    }, {
      title: '家长联系电话',
      dataIndex: 'parentPhone',
    }, {
      title: '关系',
      dataIndex: 'parentRelation',
    },{
      title: '期望参观日期',
      dataIndex: 'visitWeek',
      render:(record)=>{
         return(<span>{getWeek(record)}</span>)
      }
    },{
      title: '家庭地址',
      dataIndex: 'address'
    },{
      title: '提交时间',
      dataIndex: 'submitTime',
      render:(record)=>{
        return(<span>{onlyDate(record)}</span>)
     }
    },{
      title: '操作',
      dataIndex: '',
      width:120,
      fixed:'right',
      render:(text, record) => (
        <span className="make-box">
          <a href="javascript:;" onClick={this.showConfirm.bind(this,record.id)}>删除</a> 
        </span>
      )
    }];
    const { fileList,previewVisible, previewImage,flag, isShow,consultList,openWeeks,schoolId } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const props = {
      name: 'file',
      action: 'https://upload.qiniup.com/',
      accept:"image/jpg,image/jpeg,image/png",
      headers: {
        authorization: 'authorization-text',
        "Content-Disposition":'form-data; name="file";'
      },
      data:{
        token:qiniuToken?qiniuToken:this.state.qiniuToken,
      },
      onChange:this.handleChange,
      beforeUpload:this.beforeUpload,
      onPreview:this.handlePreview
    };

    return (
      <div className='consultRegister'>
        {/* <div className="breadcrumb">
           <Breadcrumb>
            <Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
            <Breadcrumb.Item>咨询登记</Breadcrumb.Item>
          </Breadcrumb>
          <h3>咨询登记</h3>
        </div> */}
        <div className="content-main">
        <Form className="content-form">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="姓名/电话/家庭住址"/>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("sex")(
                    <Select allowClear placeholder="性别">
                        <Option  value=''>全部</Option>
                        <Option  value={1}>男</Option>
                        <Option  value={2}>女</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("visitWeeks")(
                    <Select allowClear placeholder="参观日期" mode="multiple">
                      {/* <Option value="">全部</Option> */}
                      <Option value="1">工作日(周一)</Option>
                      <Option value="2">工作日(周二)</Option>
                      <Option value="3">工作日(周三)</Option>
                      <Option value="4">工作日(周四)</Option>
                      <Option value="5">工作日(周五)</Option>
                      <Option value="6">休息日(周六)</Option>
                      <Option value="7">休息日(周日)</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col span={7}>
                <FormItem>
                {getFieldDecorator("time")(
                    <RangePicker allowClear
                     format={'YYYY/MM/DD'}
                   />
                  )}
                </FormItem>
              </Col>
              
              
              <Col span={5} style={{ textAlign: 'right',paddingRight:'20px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起 ' : '展开 '}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col style={{ paddingTop: '10px',paddingBottom: '10px' }}>
                <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&emsp;
                <Button type='primary' onClick={this.configure.bind(this)}>配置</Button>
              </Col>
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={consultList.dataList} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={consultList.totalCount} totalPage={consultList.totalPage} currentPage={consultList.currentPage}/>
        </div>
        <Drawer
          title='配置'
          placement="right"
          width="600"
          onClose={this.onClose}
          visible={this.state.Visible}
          className="consult-drawer"
          >
          <Form>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="开放日期">
                {getFieldDecorator("openWeeks",{initialValue: openWeeks})(
                  <Checkbox.Group style={{ width: '100%' }} className="Checkbox">
                    <Row>
                      <Col span={10}>
                        <Checkbox value={1}>工作日（周一）</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={6}>休息日（周六）</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <Checkbox value={2}>工作日（周二）</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value={7}>休息日（周日）</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Checkbox value={3}>工作日（周三）</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Checkbox value={4}>工作日（周四）</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Checkbox value={5}>工作日（周五）</Checkbox>
                      </Col>
                    </Row>
          
                  </Checkbox.Group>
                )}
                </Form.Item>
              </Col>

              <Col span={24} >
                <FormItem {...formItemLayout} label="图片">
                  <Upload
                    {...props}
                    listType="picture-card"
                    fileList={fileList}
                  >
                    { fileList.length >= 9 ? null : <div><Icon type="plus" /></div> }
                  </Upload> 
                </FormItem>
              </Col>

              <Col span={24} >
                <FormItem {...formItemLayout} label="访问链接">
                {getFieldDecorator("link")(
                   <Paragraph copyable>{consultRegisterUrl+schoolId}</Paragraph>
                )}
                </FormItem>
              </Col>
              
            </Row>
          </Form>
          <div className="btns">
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.save} type="primary">保存</Button>
          </div>
        </Drawer>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    
  }
}
export default connect(mapStateToProps)(Form.create()(consultRegister));