import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Button,Form,Input,Checkbox, InputNumber, Select, message,Radio,Upload,Icon,Modal, DatePicker  } from 'antd';
import {Link,routerRedux} from "dva/router";
import {getQueryString, isPositiveInteger} from '../../utils/public';
import {getImg} from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.less";
import ImgCutter from '../../components/imgCutter'
import SectionTag from '../../components/sectionTag'
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
class VoteDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            imgPath:'',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            imgs:[],
            oldImgs:[],
            cropVisible: false,
            startTime: '',
            endTime: '',
            currentIdx: '',
            options: [
              {
                name: '',
                coverImg: ''
              }
            ],
            isAddNew: ''
        };
    }
    componentDidMount=()=>{ 
        this.setState({
          isAddNew: getQueryString('type')==1 ? false: true
        })
        if(getQueryString('type')==1){
          this.getDetail()
        }
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
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
    }

    getDetail = ()=>{
        this.props.dispatch({ //获取简介详情
          type:'vote/getVotingDetail',
          payload: {id: getQueryString("id")},
          callback:(res)=>{
          if(res.code===200){
              this.props.form.setFieldsValue({
                "title": res.data.title,
                "votingLimitTimes": res.data.votingLimitTimes,
                "votingLimitType": res.data.votingLimitType,
                "votingGroup": res.data.votingGroup,
                "time": [moment(res.data.startTime*1000), moment(res.data.endTime*1000)]
              })
              this.setState({
                imgPath:res.data.coverImg,
                options:res.data.options,
                editorState: BraftEditor.createEditorState(res.data.description),
              })
          }
          }
      })
    }

    addItem = ()=>{
      let arr = [...this.state.options, { name: '',coverImg: ''}]
      this.setState({
        options: arr
      })
    }
    inputChange=(index, value)=>{
      let oldData = this.state.options
      oldData[index].name = value.target.value
      this.setState({
        options: oldData
      })
    }

    up = (idx)=>{
      this.setState({
        currentIdx: idx
      })
    }
    deleteItem=(index)=>{
      let oldData = this.state.options
      let newData = oldData.filter((item, i)=>{
        return i!==index
      })
      this.setState({
        options: newData
      })
    }

    back = ()=>{
      window.history.go(-1)
    }
      // 时间选择
    onChangeRange = (date, dateString) => {
      console.log({ dateString });
      this.setState({
        startTime: dateToTimestamp(dateString[0]),
        endTime: dateToTimestamp(dateString[1]),
      })
    }

    handleChange1 = (info) => {
      if (info.file.status === 'done') {
        let oldData = this.state.options
        oldData[this.state.currentIdx].coverImg = info.file.response.id
        this.setState({
          options: oldData
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  
    // 裁剪
    handleOk1 = (dataUrl) => {
      this.setState({
        cropVisible: false
      });
      this.blob = dataUrl;
    }
    // 裁剪取消
    handleCropCancel1 = () => {
      this.setState({
        cropVisible: false
      });
    }
  
      // 上传图片
    beforeUpload1 = (file) => {
      // console.log({ file });
      let imageType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      let isImage = imageType.findIndex(o => o === file.type) !== -1;
      if (!isImage) {
        message.error('请选择正确的图片类型!');
        return false;
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error('图片大小不能超过2M!');
      //   return false;
      // }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let _this = this;
      reader.onload = (e) => {
        _this.setState({
          cropSrc: e.target.result,
          cropVisible: true,
        })
      }
      return new Promise((resolve, reject) => {
        let index = setInterval(() => {
          if (this.blob) {  // 监听裁剪是否完成
            window.clearInterval(index);
            this.blob.uid = file.uid;   // 需要给裁剪后的blob对象设置uid，否则会报错！
            this.blob.name = file.name
            resolve(this.blob);   // 执行后续的上传操作
          }
        }, 100);
      });
    }
    submit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){

                if(!isPositiveInteger(values.votingLimitTimes)){
                  return message.error("票数必须为大于0的正整数！")
                }
                if(this.state.options.length==0){
                  return message.error("请填写选项！")
                }
                let isOK = true
                this.state.options.map(i=>{
                  if(!i.name||!i.coverImg){
                    isOK = false
                  }
                })
                if(!isOK){
                  return message.error("选项填写不完整！")
                }
                const params={
                    "title": values.title,
                    "description": this.state.editorState.toHTML(),
                }
                if(this.state.isAddNew){
                  params.startTime =  Math.round(moment(values.time[0]).valueOf()/1000)
                  params.endTime =  Math.round(moment(values.time[1]).valueOf()/1000)
                  params.votingGroup = values.votingGroup?1:''
                  params.votingLimitTimes = values.votingLimitTimes
                  params.votingLimitType = values.votingLimitType
                  params.coverImg = this.state.imgPath||''
                  params.options = this.state.options
                }else{
                  params.id = getQueryString('id')
                }
                this.props.dispatch({
                    type: this.state.isAddNew?'vote/votingAdd':'vote/votingModify',
                    payload: params,
                    callback:(res)=>{
                        if(res.code===200){
                            if(this.state.isAddNew){
                              message.success("新增成功", 2)
                              setTimeout(() => {
                                window.history.go(-1)
                              }, 2000);
                            }else{
                              message.success("修改成功", 2)
                            }
                        }
                    }
                })
            }
        })
    }
    async componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        // const htmlContent = await fetchEditorContent()
        // // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
        // this.setState({
        //   editorState: BraftEditor.createEditorState(htmlContent)
        // })
    }
    
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        // const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
    }
    
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    beforeUpload=(file)=> {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
        // return isJPG && isLt2M;
    }
    handleChange = (info) => {
      console.log(info)
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
            console.log(info.file.response.id)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    myUploadFn = (param) => {
        const serverURL = 'https://upload.qiniup.com/'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
      
        const successFn = (response) => {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          param.success({
            url: getImg(JSON.parse(response.target.response).id),
            meta: {
              alt: '图片',
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            }
          })
        }
      
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          param.progress(event.loaded / event.total * 100)
        }
      
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          param.error({
            msg: '上传失败.'
          })
        }
      
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
  
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        fd.append('file', param.file)
        fd.append('token', qiniuToken)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
      
    }
    handleCancel = () => this.setState({ previewVisible: false });

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
      console.log(fileList)
      this.setState({ fileList })
      let imgs=[]
      fileList.length>0&&fileList.map(item=>{
        if(item.response&&item.response.success){
          imgs.push(item.response.id)
        }else{
          const uid=item.uid.split('~')[1]
          imgs.push(uid)
        }
      })
      this.setState({imgs})
      console.log(imgs)
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        const {editorState,imgPath, cropVisible, cropSrc, options, isAddNew}=this.state;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const qiniuToken=sessionStorage.getItem('qiniuToken');
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
            beforeUpload:this.beforeUpload
        };
        // const { imgPath, points, cropVisible, cropSrc, treeData ,devSns} = this.state
        // const qiniuToken = sessionStorage.getItem('qiniuToken');
        const props1 = {
          name: 'file',
          action: 'https://upload.qiniup.com/',
          accept: "image/jpg,image/jpeg,image/png",
          headers: {
            authorization: 'authorization-text',
            "Content-Disposition": 'form-data; name="file";'
          },
          data: {
            token: qiniuToken ? qiniuToken : this.state.qiniuToken,
          },
          onChange: this.handleChange1,
          beforeUpload: this.beforeUpload
        };

        const afterSelector = getFieldDecorator('votingLimitType', {
          initialValue: '1',
        })(
          <Select disabled={ isAddNew ? false : true} style={{ width: 100 }}>
            <Select.Option value="1">票/天/ID</Select.Option>
            <Select.Option value="2">票/ID</Select.Option>
          </Select>,
        );

        return (
            <div className="brief-main">
                <div className="breadcrumb">
                  <h3>{getQueryString('type')==1?"详情":"新增"}</h3>
                </div>
                <SectionTag title="基本信息" />
                <Form className="ant-advanced-search-form content-form">
                  <Row gutter={24}>
                    <Col span={14}>
                      <FormItem {...formItemLayout} label={'名称'}>
                        {getFieldDecorator("title",{initialValue: '',
                          rules:[{required:true, message:'请输入名称',whitespace: true}]}
                        )(
                          <Input maxLength={15} placeholder='请输入名称'/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={14}>
                        <FormItem {...formItemLayout} label={'时间'}>
                          {getFieldDecorator("time", {
                           rules:[{required: true, message:'请选择时间'}]
                          })(
                            <RangePicker disabled={ isAddNew ? false : true} style={{ width: 380 }}
                              showTime={{ format: 'HH:mm:ss' }}
                              // format="YYYY-MM-DD HH:mm:ss"
                              placeholder={['开始时间', '结束时间']}
                              />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={14}>
                      <FormItem {...formItemLayout} label={'对象'}>
                        {getFieldDecorator('votingGroup', {
                          valuePropName: 'checked',
                          initialValue: false,
                        })(<Checkbox disabled={ isAddNew ? false : true}>家长端</Checkbox>)}
                      </FormItem>
                    </Col>
                    <Col span={14}>
                      <FormItem {...formItemLayout} label={'限制'}>
                        {getFieldDecorator('votingLimitTimes', {
                          initialValue: 1,
                          rules:[{required: true, message:'请填写'}]
                        })(<Input maxLength={3} disabled={ isAddNew ? false : true} style={{width: '180px'}} addonAfter={afterSelector} />)}
                      </FormItem>
                    </Col>
                    <Col span={14}>
                      <FormItem {...formItemLayout} label={'封面'}>
                        {getFieldDecorator("coverImg",{initialValue: ''})(
                          <span>
                          {imgPath?<img className="school-logo" src={getImg(imgPath)} />:null}
                          <Upload {...props} showUploadList={false}>
                              <Button disabled={ isAddNew ? false : true}>
                                <Icon type="upload" />上传封面
                              </Button>
                          </Upload></span>
                        )}
                      </FormItem>
                    </Col>

                    <Col span={14}>
                      <FormItem {...formItemLayout} label={'选项'}>
                        {
                            options.map((i, idx)=>{
                              return  <div className="item-list" key={idx}>
                                          <Row><Input disabled={ isAddNew ? false : true} maxLength={15} placeholder='请输入' onChange={this.inputChange.bind(this, idx)} value={i.name} style={{width: '200px'}} />&nbsp;&nbsp;&nbsp;&nbsp;
                                          <Button disabled={options.length<=1||!isAddNew ? true: false} onClick={this.deleteItem.bind(this, idx)}>删除</Button></Row>
                                          {i.coverImg?<img className="school-logo" src={getImg(i.coverImg)} />:null}
                                          <Upload {...props1} showUploadList={false}>
                                              <Button disabled={ isAddNew ? false : true} onClick={this.up.bind(this, idx)} >
                                                点击上传
                                              </Button>
                                          </Upload>
                                      </div>
                            })
                        }
                          <Button type="dashed" disabled={ isAddNew ? false : true} block onClick={this.addItem.bind(this)}>添加选项</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              <SectionTag title="规则" paddingBottom={30} />
              <Row>
                  <Col span={5} style={{textAlign:'right',marginRight:5}}><label>投票方式与奖品说明：</label></Col>
                  <Col span={17}>
                      <BraftEditor
                          value={editorState}
                          onChange={this.handleEditorChange}
                          onSave={this.submitContent}
                          media={{uploadFn: this.myUploadFn}}
                      />
                  </Col>
              </Row>
              <Row style={{marginTop:20}}>
                  <Col span={6} offset={10}>
                      <Button onClick={this.back.bind(this)}>取消</Button>&nbsp;&nbsp;
                      <Button type='primary' onClick={this.submit.bind(this)}>保存</Button>
                  </Col>
              </Row>
              <Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel1} width={600}>
                <ImgCutter aspectRatio={434 / 309} src={cropSrc} onOk={this.handleOk1} />
              </Modal>
            </div> 
        );
    }
}
// VoteDetail.propTypes = {
// };
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(VoteDetail));
