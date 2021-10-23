import React,{Component} from 'react';
import { connect } from 'dva';
import {Link,routerRedux} from "dva/router";
import { message,Button,Input,Switch,InputNumber, Upload, Select,Form,Col,Row,Icon,Radio,TreeSelect,Breadcrumb,Modal } from 'antd';
import { getQueryString, isBlank} from '../../utils/public';
import './style.less';
import { stat } from 'fs';
import { log } from 'util';
import {getImg} from '../../utils/img';
import { imgUrl } from '../../config';
// import { promises } from 'dns';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;

let id = 0;
class SetFlag extends Component{
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            detail: {},
            type: [],
            scoreTypes: [
                {
                    typeId: '',
                    score: ''
                }
            ]
        };
    }
    componentDidMount=()=>{
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
        this.getDetail()
        this.getClassScoreType()
    }
    getDetail = () => {
        this.props.dispatch({
            type:'moralEvaluation/flagDetail',
            payload:{},
            callback:(res)=>{
                console.log("res",res);
                if(res.code===200){
                    this.setState({
                        imageUrl: res.data.icon,
                        detail: res.data
                    })
                    if(res.data.type==4){
                        this.setState({
                            scoreTypes: res.data.scoreType
                        })
                    }
                }
            }
        })
    }

    getClassScoreType = () => {
        this.props.dispatch({
            type:'moralEvaluation/getClassScoreType',
            payload:{
                semesterId: getQueryString("semesterId"),
                type: 1
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        type: res.data
                    });
                }
            }
        })
    }
    
    
    
    addItem = () =>{
        let newData = this.state.scoreTypes
        newData.push({
            typeId: '',
            score: ''
        })
        this.setState({
            scoreTypes: newData
        })
    }
    removeItem = (index) =>{
        let oldData = this.state.scoreTypes
        let newData = oldData.filter((item, index1)=>{
            return index !== index1
        })
        this.setState({
            scoreTypes: newData
        })
    }
 
   
    changeSelect = (index, e) => {
        let newData = this.state.scoreTypes
        newData[index].typeId = e
        this.setState({
            scoreTypes: newData
        })
    }
    changeNumberInput = (index, e) => {
        let newData = this.state.scoreTypes
        newData[index].score = e
        this.setState({
            scoreTypes: newData
        })
    }

    handleChangeImg = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imageUrl: info.file.response.id})
            
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }
    }
    deleteImg=()=>{
        this.setState({imageUrl: ''})
    }
    beforeUpload =(file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
          return new Promise((resolve, reject)=>{
              reject(file)
          })
        }
        return this.checkImageWH(file)
    }

     //返回一个 promise：检测通过则返回resolve；失败则返回reject，并阻止图片上传
    checkImageWH(file) {
        return new Promise(function(resolve, reject) {
            let filereader = new FileReader();
            filereader.onload = e => {
                let src = e.target.result;
                const image = new Image();
                image.onload = function() {
                    // 获取图片的宽高，并存放到file对象中
                    console.log('file width :' + this.width);
                    console.log('file height :' + this.height);
                    file.width = this.width;
                    file.height = this.height;
                    if(file.width>210||file.height>210){
                        message.error("图片尺寸不能大于210px*210px")
                        reject()
                    }else{
                        resolve();
                    }
                };
                image.onerror = reject;
                image.src = src;
            };
            filereader.readAsDataURL(file);
        });
    }

    submit=()=>{
        let flag = false
        this.state.scoreTypes&&this.state.scoreTypes.map(item=>{
            if(!item.typeId||!item.score){
                flag = true
                return
            }
        })
        if(this.props.form.getFieldValue('type')==4&&flag){
            return message.error("请输入完整！")
        }
     
        let val = this.props.form.getFieldValue('type')==1||this.props.form.getFieldValue('type')==2?this.props.form.getFieldValue('number'):(this.props.form.getFieldValue('type')==3?this.props.form.getFieldValue('number1'):'')
        if(this.props.form.getFieldValue('type')!=4&&!val){
            return message.error("请输入完整！")
        }
        if(!this.state.imageUrl){
            return message.error("请上传流动红旗！")
        }
        let param = {
            type:  this.props.form.getFieldValue('type'),
            value: val,
            scoreTypes: this.props.form.getFieldValue('type')==4?this.state.scoreTypes:'',
            icon: this.state.imageUrl||''
        }
        this.props.dispatch({
            type: 'moralEvaluation/setFlag',
            payload: param,
            callback:(res)=>{
                if(res.code===200){
                    message.success('保存成功！')
                    this.props.dispatch(routerRedux.push("/moral-index?key=3"))
                }
            }
        })
    }
    render(){
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const { scoreTypes } = this.state
        const { type } = this.state
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
                token: qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            beforeUpload: this.beforeUpload
        };
        const formItemLayout3 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 14  ,offset: 6}
        };
    
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传</div>
            </div>
        );
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayout1 = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        const formItemLayout2 = {
            wrapperCol: { span: 18 , offset: 6}
        };

        let typeChild=[]
        type&&type.map(item=>{
            typeChild.push(<Option key={item.typeId}>{item.typeName}</Option>)
        })
    
        const {detail, imageUrl } = this.state
        return (
            <div className='detail-main'>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/moral-index?key=3">班级考评</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>流动红旗设置</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-main information" style={{width:'100%'}}>
                    <Form className="ant-advanced-search-form content-form teacher-form" style={{width:'100%'}}>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='流动红旗设置'>
                                    {getFieldDecorator('type', { initialValue: detail.type&&detail.type.toString(), rules:[{required:true,message:"请选择评分周期"}]})
                                    (<Radio.Group>
                                        <Radio value="1">学校排名</Radio>
                                        <Radio value="2">班级排名</Radio>
                                        <Radio value="3">每周成绩</Radio>
                                        <Radio value="4">按考评项</Radio>
                                    </Radio.Group>)
                                    }
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24} style={{display: (getFieldValue('type')==1||getFieldValue('type')==2) ? "block" : "none"}}>
                            <Col span={18}>
                                <FormItem {...formItemLayout2} label=''>
                                   点亮学校{getFieldValue('type')==2?"每个年级":''}排名前&nbsp;&nbsp;
                                   {getFieldDecorator("number",{initialValue: detail.value&&detail.value})(
                                   <InputNumber min={1} />
                                   )}&nbsp;&nbsp;
                                   的班级
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24} style={{display: getFieldValue('type')==3 ? "block" : "none"}}>
                            <Col span={18}>
                                <FormItem {...formItemLayout2} label=''>
                                   点亮每周总分大于等于&nbsp;&nbsp;
                                   {getFieldDecorator("number1",{initialValue: detail.value&&detail.value})(
                                   <InputNumber min={0} step={0.5} />
                                   )}&nbsp;&nbsp;
                                   分的班级
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        {
                            scoreTypes&&scoreTypes.map((item, index)=>{
                                return (
                                    <Row gutter={24} style={{display: getFieldValue('type')==4 ? "block" : "none"}} key={index} >
                                        <Col span={18}>
                                            <FormItem {...formItemLayout2} label=''>
                                                <Select placeholder='请选择'style={{width: 120}} onChange={this.changeSelect.bind(this, index)} value={item.typeId} >
                                                    {typeChild}
                                                </Select>
                                                &nbsp;&nbsp;
                                                点亮每周总分大于等于&nbsp;&nbsp;
                                            <InputNumber min={0} step={0.5} value={item.score} onChange={this.changeNumberInput.bind(this, index)} />
                                            &nbsp;&nbsp;
                                            分的班级&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="minus-circle" style={{display: scoreTypes.length>1?"inline-block":"none"}} onClick={this.removeItem.bind(this, index)} />
                                            </FormItem>
                                        </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                                    </Row>
                                )
                            })
                        }
                       
                        <Row gutter={24} style={{display: getFieldValue('type')==4 ? "block" : "none"}}>
                            <Col span={18}>
                                <FormItem {...formItemLayout2} label=''>
                                <Icon type="plus-circle" onClick={this.addItem.bind(this)}/>
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        
                        
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='流动红旗'>
                                {getFieldDecorator("logo",{initialValue:''})(
                                    <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    onChange={this.handleChangeImg.bind(this)}
                                    {...props}
                                    >
                                    {imageUrl ? <img src={getImg(imageUrl)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>
                                )}
                                <p>尺寸大小不超过210px*210px</p>
                                {imageUrl ? <Button onClick={this.deleteImg.bind(this)} >清空</Button>: null}
                                </FormItem>
                            </Col>
                        </Row>
                       
                        <Row style={{marginTop:20}}>
                            <Col span={2} offset={10}>
                                <Button ><Link to='/moral-index?key=3'>返回</Link></Button>
                            </Col>
                            <Col span={2} offset={0}>
                                <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                            </Col>
                        </Row>
                    </Form> 
                </div>
             
            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    // termTypes:state.classScore.termTypes,
    pubStudents:state.user.pubStudents,
    commonPersonData:state.user.commonPersonData,
    allSchoolUsers:state.user.allSchoolUsers
  }
}

export default connect(mapStateToProps)(Form.create()(SetFlag));
