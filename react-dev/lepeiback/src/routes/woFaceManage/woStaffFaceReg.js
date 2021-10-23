import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Upload,Tag, Form, Row, Col, Icon,Menu, Dropdown,Modal,message, TreeSelect} from 'antd';
import { getPortrait } from '../../utils/img';
import { notSeconds, } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;

class WoStaffFaceReg extends Component{
    constructor(props) {
        super(props);
        this.state = {
          faceRegList:[],
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          curPersonId:'',
          visible:false,
          imageUrl: '',
          curName: '',
          treeData:[],
          qiniuToken:''
        };
    }
    componentDidMount=()=>{
      this.search()
      this.props.dispatch({
        type:'user/getDepartmentList',
        callback:(res)=>{
            if(res.code===200){
              this.setState({treeData:res.data})
            }
        }
      })
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
    // 获取人脸注册列表
    faceRegList = (params) =>{
      this.props.dispatch({
        type:'woFaceManage/faceRegList',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            res.data&&res.data.map((item,index) =>{
              item.key = index
            })
            this.setState({faceRegList:res.data})
          }
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
          const params={
            "personType": 3,
            "kw": values.kw||'',
            "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):0,
            "headStatus": values.headStatus||'',
            "faceStatus": values.faceStatus||'',
            "cardStatus": values.cardStatus||'',
          }
          this.faceRegList(params)
      })
    }

    // 注册
    reg =(id)=>{
      let _this = this
      this.props.dispatch({
        type: 'woFaceManage/personFaceReg',
        payload: {"personId": id},
        callback: res=>{
          if(res.code===200){
            message.success("注册成功！")
            _this.search()
          }else{
            _this.search()
          }
        }
      })
    }

    // 注销人员
    cancel = (id) =>{
      let _this = this
      this.props.dispatch({
        type: 'woFaceManage/personFaceCancel',
        payload: {"personId": id},
        callback: res=>{
          if(res.code===200){
            message.success("人员注销成功！")
            _this.search()
          }
        }
      })
    }
    
    // 批量注册
    personBatchReg=()=>{
      let _this = this
      _this.props.form.validateFields((err, values) => {
        const params={
          "personType": 3,
          "kw": values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):0,
          "headStatus": values.headStatus||'',
          "faceStatus": values.faceStatus||'',
          "cardStatus": values.cardStatus||'',
        }
        _this.props.dispatch({
          type: 'woFaceManage/personBatchReg',
          payload:params,
          callback: res=>{
            if(res.code===200){
            }
          }
        })
        document.getElementById('ajaxLoading').style.display = 'none';
        let loading = document.getElementById('ajaxLoading2');
        loading.style.display = 'block';
        let timeSpan = document.getElementById('time1');
        let time = 90
        timeSpan.innerHTML = "注册中，请稍后..." +  time + " s"
        let timer = setInterval(() => {
          time--
          timeSpan.innerHTML = "注册中，请稍后..." +  time + " s"
          if(time == 0){
            clearInterval(timer)
            loading.style.display = 'none';
            _this.search()
          }
        }, 1000);
      })
    }
    
    // 批量注销
    batchCancel = ()=>{
      let _this = this
      _this.props.form.validateFields((err, values) => {
        const params={
          "personType": 3,
          "kw": values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):0,
          "headStatus": values.headStatus||'',
          "faceStatus": values.faceStatus||'',
          "cardStatus": values.cardStatus||'',
        }
        _this.props.dispatch({
          type: 'woFaceManage/personBatchCancel',
          payload:params,
          callback: res=>{
          }
        })
        document.getElementById('ajaxLoading').style.display = 'none';
        let loading = document.getElementById('ajaxLoading2');
        loading.style.display = 'block';
        let timeSpan = document.getElementById('time1');
        let time = 90
        timeSpan.innerHTML = "注销中，请稍后..." +  time + " s"
        let timer = setInterval(() => {
          time--
          timeSpan.innerHTML = "注销中，请稍后..." +  time + " s"
          if(time == 0){
            clearInterval(timer)
            loading.style.display = 'none';
            _this.search()
          }
        }, 1000);
      })
    }

    handleChange = info => {
      if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          this.setState({imageUrl: info.file.response.id})
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
      }
    };

    beforeUpload = (file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片格式仅支持JPG/PNG');
      }
      const isLt400K = file.size / 1024 < 400;
      if (!isLt400K) {
        message.error('图片不能大于400kB!');
      }
      return isJpgOrPng && isLt400K;
    }

    // 头像管理
    changeHeadr = (id) =>{
      this.setState({
        curPersonId: id
      })
      this.props.dispatch({
        type: 'woFaceManage/changeHeadr',
        payload: {
          personId: id
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                curName: res.data.personName,
                visible: true,
                imageUrl: res.data.pic,
                curPersonalId:res.data.personId
              })
            }
        }
      })
    }
    // 确认修改
    handleOk=()=>{
      this.props.dispatch({
        type: 'woFaceManage/updateHeadr',
        payload: {
          pics: [
            {
              personId: this.state.curPersonId,
              pic: this.state.imageUrl
            }
          ]
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                visible: false,
              })
              this.search()
              message.success("头像修改成功！")
            }
        }
      })
    }
    // 取消修改
    handleCancel=()=>{
      this.setState({
        visible: false,
      })
    }
    // 删除头像
    delHeader = () =>{
      let that = this;
      confirm({
        title: '提示',
        content: '确定要删除该头像吗？',
        onOk() {
          that.setState({
            imageUrl:''
          },function(){
            that.handleOk()
          })
        },
        onCancel() {},
      });
    }
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
      const qiniuToken=sessionStorage.getItem('qiniuToken');
      const { getFieldDecorator } = this.props.form;
      const { faceRegList, imageUrl } = this.state;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const formItemLayout1 = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      };
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const props = {
        name: 'file',
        action: 'https://upload.qiniup.com/',
        accept: "image/jpg,image/jpeg,image/png",
        headers: {
          authorization: 'authorization-text',
          "Content-Disposition":'form-data; name="file";'
        },
        data: {
            token: qiniuToken?qiniuToken:this.state.qiniuToken,
        },
        showUploadList: false,
        onChange: this.handleChange,
        beforeUpload: this.beforeUpload
      };
       
        const columns = [{
            title: '姓名',
            dataIndex: 'personName',
          },{
            title: '头像',
            dataIndex: '',
            render:(record)=>{
              return(<span onDoubleClick={this.changeHeadr.bind(this,record.personId)}>{record?<img src={getPortrait(record.pic, record.sex)} style={{width:80,height:80}} alt=""/>:null}</span>)
            }
          },{
            title: '注册状态',
            dataIndex: 'faceStatus',
            render:(record)=>(
              <span>
                {record==2?<Tag color="blue">已注册</Tag>:(record==1?<Tag color="magenta">未注册</Tag>:null)}
              </span>
            )
          },{
            title: '说明',
            width:480,
            dataIndex: '',
            render:(text, record) => (
              <div>
                {record.personGuid?<p style={{marginBottom:"8px"}}>人员guid：{record.personGuid}</p> : null}
                {record.faceGuid?<p style={{margin:"8px 0"}}>照片guid：{record.faceGuid}</p> : null}
                {record.msg?<p style={{color:record.isAllowRegister==1?"red":""}}>原因：{record.msg}</p>:null}
              </div>
            )
          },{
            title: '注册时间',
            dataIndex: 'createTime',
            render:(record)=>{
              return(<span>{notSeconds(record)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width:180,
            fixed:'right',
            render:(text, record) => (
              <span>
                {record.isAllowRegister==1?<a href="javascript:;" onClick={this.reg.bind(this,record.personId)}>注册&emsp;</a> :null}
                {record.isAllowDel==1?<a href="javascript:;" onClick={this.cancel.bind(this,record.personId)}>注销人员</a>: null}
              </span>
            )
          }
        ]
        return (
            <div className="content-main student-face-reg">
              <Form className="content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入教师姓名"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={5}>
                  <FormItem {...formItemLayout} label={'部门'}>
                      {getFieldDecorator("departmentId",{initialValue:''})(        
                        <TreeSelect
                            showSearch
                            dropdownStyle={{ maxHeight:200,overflow: 'auto' }}
                            allowClear
                            treeDefaultExpandAll
                        >
                          <TreeNode value="" title="全部" key={-1}/>
                          {this.renderTreeNodes(this.state.treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'头像状态'}>
                      {getFieldDecorator("headStatus",{initialValue:'0'})(
                        <Select>
                          <Option value='0' key='0'>全部</Option>
                          <Option value='2' key='2'>有头像</Option>
                          <Option value='1' key='1'>无头像</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'开卡状态'}>
                      {getFieldDecorator("cardStatus",{initialValue:'0'})(
                        <Select>
                          <Option value='0' key='0'>全部</Option>
                          <Option value='2' key='2'>已开卡</Option>
                          <Option value='1' key='1'>未开卡</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  
                  <Col span={5} >
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button onClick={this.personBatchReg.bind(this)}>批量注册</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Dropdown overlay={
                      <Menu>
                        <Menu.Item>
                            <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.batchCancel.bind(this)}>批量注销</a>
                        </Menu.Item>
                    </Menu>
                  }>
                    <a className="ant-dropdown-link" href="javascript:;" >展开&nbsp;&nbsp;<Icon type="down"/></a>
                </Dropdown>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'注册状态'}>
                      {getFieldDecorator("faceStatus",{initialValue:'0'})(
                        <Select>
                          <Option value='0' key='0'>全部</Option>
                          <Option value='2' key='2'>已注册</Option>
                          <Option value='1' key='1'>未注册</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Table  columns={columns} dataSource={faceRegList} pagination={false}/>
              <Modal
                 title="头像管理"
                 visible={this.state.visible}
                 onOk={this.handleOk.bind(this)}
                 onCancel={this.handleCancel.bind(this)}
               >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label={'姓名'}>
                      <Input value={this.state.curName||''} disabled />
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label={'头像'}>
                    <Upload
                            action="https://upload.qiniup.com/"
                            accept="image/jpg,image/jpeg,image/png"
                            listType="picture-card"
                            showUploadList={false}
                            multiple={true}
                            {...props}
                        >
                            {imageUrl ? <img src={getPortrait(imageUrl)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                        {imageUrl ? <p><Button onClick={this.delHeader.bind(this,this.state.curPersonId)}>删除头像</Button></p>:null}
                      <p>支持扩展名：支持JPG/PNG</p>
                      <p>图片大小：不超过400kB</p>
                    </FormItem>
                  </Col>
                </Row>
              </Form>    
               </Modal>

             
            </div> 
                
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(WoStaffFaceReg));
