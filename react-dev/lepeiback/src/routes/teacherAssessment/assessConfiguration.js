import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Form, Row, Col, Select,DatePicker, Tag, Upload, Icon,Modal,message,Breadcrumb,Drawer } from 'antd';
import moment from 'moment';
import { routerRedux, Link} from 'dva/router';
import { onlyDate, toTimestamp} from '../../utils/public';
import { getImg } from '../../utils/img';
import PageIndex from '../../components/page';
import { Encrypt} from '../../utils/secret';
import './style.less';

const Search = Input.Search;
const TextArea = Input.TextArea;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class AssessConfiguration extends Component{
  constructor(props) {
      super(props);
      this.state = {
        kw:'',
        page: 1,
        prePage: 20,
        data:{},
        detailList:[],
        assessId:'',
        addVisible:false,
        firstTags:[],
        secondTags:[],
        inputVisible: false,
        inputValue: '',
        inputVisible1: false,
        inputValue1: '',
        fileList: [],
        imgs:[],
        previewVisible: false,
        previewImage: '',
        scoreLevel:[
          {
            startScore:'',
            endScore:'',
            levelType: '1'
          },
          {
            startScore:'',
            endScore:'',
            levelType: '2'
          },
          {
            startScore:'',
            endScore:'',
            levelType: '3'
          },
          {
            startScore:'',
            endScore:'',
            levelType: '4'
          },
        ],
        submitStartTime:'',
        submitEndTime:'',
        awardsStartTime:'',
        awardsEndTime:'',
        pics:[],
        remark:'',
        checkName:'',
        checkYear:'',
        status:'',
        hasApplyRecords:0,
      };
  }
  componentDidMount=()=>{
    const params = {
      "page": 1,
      "prePage": 20,
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
  // 获取列表
  getList = (params) =>{
    this.props.dispatch({
      type:'teacherAssessment/assessmentList',
      payload:params,
      callback:res =>{
        if(res.code===200){
          this.setState({
            data: res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }
  // 搜索框
  searchKey = (e) =>{
    this.setState({kw:e.target.value})
  }
  // 查询
  search = () =>{
    const params = {
      "kw":this.state.kw,
      "page": 1,
      "prePage": this.state.prePage,
    }
    this.getList(params)
    this.setState({ page: 1 })
  }
  // 分页
  onPageChange = (current, size) => {
    this.setState({ page: current, prePage: size })
    const params = {
      "page": current,
      "prePage": size,
      "kw":this.state.kw,
    }
    this.getList(params)
  }
  // 删除
  showConfirm = (id) => {
    let me = this;
    confirm({
      title: '提示',
      content: "确定要删除这条信息吗？",
      onOk() {
        me.props.dispatch({
          type:'teacherAssessment/delAssessConfig',
          payload:{ id },
          callback:(res) =>{
            if(res.code === 200){
              message.success('删除成功！')
              const params = {
                "kw":me.state.kw,
                "page": me.state.page,
                "prePage": me.state.prePage,
              }
              me.getList(params)
            }
          }
        })
      },
      onCancel() {},
    });
  }
  // 添加/编辑
  addAssess = (id) =>{
    if(id){
      this.props.dispatch({
        type:'teacherAssessment/getAssessDetail',
        payload:{id},
        callback:res =>{
          if(res.code === 200){
            let imgData = []
            let hashArr = []
            res.data.pics.length > 0 && res.data.pics.map((item,index)=>{
              imgData.push({
                uid: index + '~' + item,
                name: 'xxx.png',
                status: 'done',
                url: getImg(item),
              })
              hashArr.push(item)
            })
            this.setState({
              assessId:id,
              checkName: res.data.name,
              checkYear: res.data.checkYear,
              status: res.data.status,
              submitStartTime: onlyDate(res.data.submitStartTime),
              submitEndTime: onlyDate(res.data.submitEndTime),
              awardsStartTime: onlyDate(res.data.awardsStartTime),
              awardsEndTime: onlyDate(res.data.awardsEndTime),
              scoreLevel: res.data.scoreLevel,
              firstTags: res.data.typeOneList,
              secondTags: res.data.typeTwoList,
              fileList: imgData,
              remark: res.data.remark,
              addVisible:true,
              hasApplyRecords:res.data.hasApplyRecords,
              imgs:hashArr
            })
          }
        }
      })
    }else{
      this.setState({addVisible:true})
    }
  }
  // 关闭
  onClose = () => {
    this.setState({
      addVisible: false,
      assessId:'',
      submitStartTime:'',
      submitEndTime:'',
      awardsStartTime:'',
      awardsEndTime:'',
      scoreLevel:[
        {
          startScore:'',
          endScore:'',
          levelType: '1'
        },
        {
          startScore:'',
          endScore:'',
          levelType: '2'
        },
        {
          startScore:'',
          endScore:'',
          levelType: '3'
        },
        {
          startScore:'',
          endScore:'',
          levelType: '4'
        },
      ],
      firstTags:[],
      secondTags:[],
      fileList:[]
    })
    this.props.form.resetFields()
  };
  // 提交考核时间
  onTimeChange = (date, dateString) => {
    const start = dateString[0];
    const end = dateString[1];
    this.setState({
      submitStartTime:start,
      submitEndTime:end,
    })
  }
  // 奖项有效时间
  onTimeChange1 = (date, dateString) => {
    const start = dateString[0];
    const end = dateString[1];
    this.setState({
      awardsStartTime:start,
      awardsEndTime:end,
    })
  }
  // 考核等级设置
  changeScore = (index,i,e) => {
    let arr = this.state.scoreLevel
    arr.map((item,idx) =>{
      if(idx == index){
        if(i == 0){
          item.startScore = e.target.value
        }else if(i == 1){
          item.endScore = e.target.value
        }
      }
    })
    this.setState({
      scoreLevel:arr
    })
  }
  // 删除类型一的标签
  handleClose = removedTag => {
    const firstTags = this.state.firstTags.filter(tag => tag !== removedTag);
    console.log(firstTags);
    this.setState({ firstTags });
  };
  // 添加标签
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  // 输入标签名
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  // 输入标签名
  handleInputConfirm = () => {
    let { inputValue,firstTags } = this.state;
    // 去重
    if (inputValue && firstTags.indexOf(inputValue) === -1) {
      firstTags = [...firstTags, inputValue];
    }
    console.log(firstTags);
    this.setState({
      firstTags,
      inputVisible: false,
      inputValue: '',
    });
  };
  // 保存标签名
  saveInputRef = input => (this.input = input);
  // 删除类型二的标签
  handleClose1 = removedTag => {
    const secondTags = this.state.secondTags.filter(tag => tag !== removedTag);
    console.log(secondTags);
    this.setState({ secondTags });
  };
  // 添加类型二的标签
  showInput1 = () => {
    this.setState({ inputVisible1: true }, () => this.input.focus());
  };
  // 输入类型二标签名
  handleInputChange1 = e => {
    this.setState({ inputValue1: e.target.value });
  };
  // 输入类型二标签名
  handleInputConfirm1 = () => {
    let { inputValue1,secondTags } = this.state;
    // 去重
    if (inputValue1 && secondTags.indexOf(inputValue1) === -1) {
      secondTags = [...secondTags, inputValue1];
    }
    console.log(secondTags);
    this.setState({
      secondTags,
      inputVisible1: false,
      inputValue1: '',
    });
  };
  // 保存类型二标签名
  saveInputRef1 = input => (this.input = input);

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
  // 图片上传
  handleChange = ({ fileList }) => {
    console.log(fileList)
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
  // 保存
  save = () =>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        let id = this.state.assessId
        let levelList = this.state.scoreLevel
        let checkEmpty = true  // 非空验证
        let check = true  // 开始数值不能大于结束数值
        let flag = true  // 重叠验证
        let startArr = []  
        let endArr = []  
        levelList.map((item,index) => {
          if(item.startScore && item.endScore){
            if(Number(item.startScore) >= Number(item.endScore)){
              check = false
            }
          }else{
            checkEmpty = false
          }
          startArr.push(Number(item.startScore))
          endArr.push(Number(item.endScore))
        })
        // let begin = this.bubbleSort(startArr);
        // let end = this.bubbleSort(endArr);
        let begin = startArr.sort(function(a,b){
          return a - b
        });
        let end = endArr.sort(function(a,b){
          return a - b
        });
        // let end = this.bubbleSort(endArr);
        for(let i = 1; i < begin.length; i++){
          if(begin[i] < end[i-1]){
            flag = false
          }
        }
        if(!checkEmpty){
          return message.error("请将考核结果填写完整")
        }
        if(!check){
          return message.error("结束数值必须大于开始数值")
        }
        if(!flag){
          return message.error("分值不能重叠")
        }
        const params = {
          "name":values.checkName,
          "checkYear":values.checkYear,
          "status":values.status,
          "remark":values.remark,
          "submitStartTime": toTimestamp(this.state.submitStartTime,true),
          "submitEndTime": toTimestamp(this.state.submitEndTime),
          "awardsStartTime": toTimestamp(this.state.awardsStartTime,true),
          "awardsEndTime": toTimestamp(this.state.awardsEndTime),
          "scoreLevel": this.state.scoreLevel,
          "typeOneList": this.state.firstTags,
          "typeTwoList": this.state.secondTags,
          "pics":this.state.imgs || []
        }
        if(id){
          params.id = id
        } 
        console.log({params})
        this.props.dispatch({
          type: id ? 'teacherAssessment/updateAssessConfig' : 'teacherAssessment/addAssessConfig',
          payload:params,
          callback:(res)=>{
            if(res.code === 200){
              message.success(id ? "编辑成功" : "创建成功")
              this.setState({
                addVisible: false,
                assessId:'',
                submitStartTime:'',
                submitEndTime:'',
                awardsStartTime:'',
                awardsEndTime:'',
                scoreLevel:[
                  {
                    startScore:'',
                    endScore:'',
                    levelType: '1'
                  },
                  {
                    startScore:'',
                    endScore:'',
                    levelType: '2'
                  },
                  {
                    startScore:'',
                    endScore:'',
                    levelType: '3'
                  },
                  {
                    startScore:'',
                    endScore:'',
                    levelType: '4'
                  },
                ],
                typeOneList:[],
                typeTwoList:[],
                firstTags:[],
                secondTags:[],
                imgs:[],
                fileList:[]
              })
              this.props.form.resetFields()
              this.search()
            }
          }
        })
       
      }
    })
  }
  // 排序
  bubbleSort (arr){
    let len = arr.length
    for(let i = 0; i < len; i++){
      for(let j = 0;j < len - 1; j++){
        if(arr[j] > arr[j + 1]){
          let temp = arr[j + 1]
          arr[j + 1] = arr[j]
          arr[j] = temp
        }
      }
    }
    return arr;
  };
  
  // 指标配置
  targetConfig = (id,name) =>{
    this.props.dispatch(routerRedux.push("/target-config?id=" + id + "&quotaName=" + Encrypt(name)));
  }
  // 考核等级
  level = (type) => {
    switch(type){
      case "1":
        return "优秀";
      case "2":
        return "良好";
      case "3":
        return "合格";
      case "4":
        return "不合格";
      default:
        return ""
    }
  }
  render(){
    const { data,detailList,assessId, firstTags, secondTags,inputVisible, inputValue, inputVisible1, inputValue1, fileList,hasApplyRecords,
      previewVisible, previewImage, scoreLevel,checkName,checkYear,status,submitStartTime,submitEndTime,awardsStartTime,awardsEndTime,remark  } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const formItemLayout1 = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
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
    const columns = [{
        title: '考核名称',
        dataIndex: 'name',
      }, {
        title: '考核年度',
        dataIndex: 'checkYear',
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (record) => {
          return (<span>{record == 1 ? '启用' : '禁用'}</span>)
        }
      },{
        title: '开始与结束时间',
        dataIndex: '',
        render: (record) => {
          return (<span>{onlyDate(record.submitStartTime) + '~' + onlyDate(record.submitEndTime)}</span>)
        }
      },{
        title: '操作',
        dataIndex: '',
        width:200,
        fixed:'right',
        render:(text, record) => (
          <span className="make-box">
            <a href="javascript:;" className="check-btn" onClick={this.addAssess.bind(this,record.id)}>编辑</a>&nbsp;&nbsp;
            <a href="javascript:;" className="check-btn" onClick={this.targetConfig.bind(this,record.id,record.name)}>指标配置</a>&nbsp;&nbsp;
            <a href="javascript:;" className="check-btn"  onClick={this.showConfirm.bind(this,record.id)}>删除</a> 
          </span>
        )
    }];
    return (
      <div className="assess-config">
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form">
            <Row gutter={24}>
              <Col span={5}>
                <FormItem>
                  <Search onChange={this.searchKey.bind(this)} placeholder="考核名称"/>
                </FormItem>
              </Col> 
              <Col span={19} >
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button type='primary' onClick={this.addAssess.bind(this,null)}>添加</Button>
              </Col>
            </Row>
          </Form>              
          <Table rowKey={record=>record.id} className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false}/>
          <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage} />
        </div>
        <Drawer
          title={assessId ? '编辑' : '添加'}
          placement="right"
          width="600"
          onClose={this.onClose}
          visible={this.state.addVisible}
          className="add-assess-drawer"
          >
          <Form>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="考核名称">
                  {getFieldDecorator('checkName', {initialValue:assessId ? checkName : '',
                  rules: [{ required: true, message: '请输入考核名称' }],})(
                    <Input maxLength={50} placeholder="请输入考核名称" />
                  )}
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item {...formItemLayout1} label="考核年度">
                  {getFieldDecorator("checkYear",{initialValue: assessId ? checkYear : undefined,
                    rules: [{ required: true, message: '请选择考核年度' }]})(
                      <Select placeholder="请选择" allowClear >
                        <Option value="2020">2020</Option>
                        <Option value="2021">2021</Option>
                        <Option value="2022">2022</Option>
                        <Option value="2023">2023</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                        <Option value="2027">2027</Option>
                        <Option value="2028">2028</Option>
                        <Option value="2029">2029</Option>
                        <Option value="2030">2030</Option>
                      </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator("status",{initialValue: assessId ? status : 1})(
                    <Select placeholder="请选择">
                      <Option value={1}>启用</Option>
                      <Option value={2}>禁用</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24} >
                <FormItem {...formItemLayout} label="提交考核时间">
                  {getFieldDecorator("submitTime",{initialValue:submitStartTime && submitEndTime ? [moment(submitStartTime), moment(submitEndTime)] : undefined, 
                  rules: [{ required: true, message: '考核时间不能为空' }]})(
                    <RangePicker onChange={this.onTimeChange} allowClear/>
                  )}
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem {...formItemLayout} label="奖项有效时间">
                  {getFieldDecorator("awardsTime",{initialValue:[awardsStartTime ? moment(awardsStartTime) : undefined, awardsEndTime ? moment(awardsEndTime) : undefined]})(
                    <RangePicker onChange={this.onTimeChange1} allowClear/>
                  )}
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem {...formItemLayout} label="考核结果">
                  <div>
                    {scoreLevel.map((item,index) => (
                      <Row gutter={24} key={index}>
                        <Col span={5}>
                          <Input onChange={this.changeScore.bind(this,index,0)} value={item.startScore} placeholder="包含"/>
                        </Col>
                        <Col className="linkLine" span={2}>至</Col>
                        <Col span={5}>
                          <Input onChange={this.changeScore.bind(this,index,1)} value={item.endScore} placeholder={index == 0 ? "包含" : "不包含"}/>
                        </Col>
                        <Col span={12}>考核结果为：{this.level(item.levelType)}</Col>
                      </Row>
                    ))}
                  </div>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem {...formItemLayout} label="类型一">
                  <div className="types">
                    {firstTags.map((tag, index) => {
                      return  <Tag key={tag} closable={assessId && hasApplyRecords == 1 ? false : true} onClose={() => this.handleClose(tag)}>{tag}</Tag>
                    })}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        maxLength={10}
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {hasApplyRecords == 0 && !inputVisible && firstTags.length < 10 && (
                      <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}><Icon type="plus" />添加</Tag>
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem {...formItemLayout} label="类型二">
                  <div className="types">
                    {secondTags.map((tag, index) => {
                      return  <Tag key={tag} closable={assessId && hasApplyRecords == 1 ? false : true} onClose={() => this.handleClose1(tag)}>{tag}</Tag>
                    })}
                    {inputVisible1 && (
                      <Input
                        ref={this.saveInputRef1}
                        type="text"
                        maxLength={10}
                        style={{ width: 78 }}
                        value={inputValue1}
                        onChange={this.handleInputChange1}
                        onBlur={this.handleInputConfirm1}
                        onPressEnter={this.handleInputConfirm1}
                      />
                    )}
                    {hasApplyRecords == 0 && !inputVisible1 && secondTags.length < 10 && (
                      <Tag onClick={this.showInput1} style={{ background: '#fff', borderStyle: 'dashed' }}><Icon type="plus" />添加</Tag>
                    )}
                  </div>
                </FormItem>
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
              <Col span={24}>
                <FormItem {...formItemLayout} label={'说明'}>
                  {getFieldDecorator("remark",{initialValue:assessId ? remark : ''})(
                    <TextArea placeholder="限制输入500个汉字" maxLength={500} autosize={{ minRows: 5, maxRows: 8 }}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="btns">
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.save} type="primary">确定</Button>
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
export default connect(mapStateToProps)(Form.create()(AssessConfiguration));
