import React,{Component} from 'react';
import { connect } from 'dva';
import {Link,routerRedux} from "dva/router";
import { message,Button,Input,Switch,InputNumber, Upload, Select,Form,Col,Row,Icon,Radio,TreeSelect,Breadcrumb,Modal } from 'antd';
import { getQueryString, isPositiveInteger} from '../../utils/public';
import './style.less';
import { stat } from 'fs';
import { log } from 'util';
import {getImg} from '../../utils/img';
import { imgUrl } from '../../config';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;

let id = 0;
class MoralTypeDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            semesterId:'',
            visible: false ,
            typeVal:'',
            dataList: [],
            defaultFullScore: 0,
            imageUrl:'',
            typeDetails: {},
            markArr: ['']

        };
    }
    componentDidMount=()=>{
        const type=getQueryString('type');
        const id=getQueryString('id');
        this.props.dispatch({ //获取所有学期
            type:'user/getAllSemesters',
            callback:(res)=>{
                if(res.code===200){
                    if(type == 2) return
                    res.data.length>0&&res.data.map(item=>{
                        if(item.isCurrent){
                            this.setState({semesterId:item.semesterId})
                        }
                    })
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
        this.props.dispatch({ //获取上学期考评项
            type:'moralEvaluation/getClassScoreType',
            callback:(res)=>{
                if(res.code===200){
                    this.setState({termTypes: res.data})
                }
            }
        })
        this.props.dispatch({ //获取所有学生
            type:'user/getPubStudents'
        })
        
        this.props.dispatch({ //获取教职工
            type:'user/getCommonPersonList',
            payload:{"personType":"2,3", "status": 1}
        })
        this.props.dispatch({ //获取指定学校的所有后台用户
            type:'user/getAllSchoolUser'
        })
        if(type==2&&id){
            this.props.dispatch({ //根据typeId获取考评项详情
                type:'moralEvaluation/getEvaluationDetail',
                payload:{"id":id},
                callback:(res)=>{
                    console.log("res",res);
                    if(res.code===200){
                        this.setState({
                            semesterId: res.data.semesterId.toString(),
                            typeDetails: res.data,
                            markArr: res.data.mark.length==0?['']:res.data.mark,
                            imageUrl: res.data.icon,
                            dataList: res.data.secondTypes,
                            defaultFullScore: res.data.defaultFullScore
                        });
                    }
                }
            })
        }
    }
  
    showModal = () => {
        this.props.form.resetFields();
        this.setState({
          visible: true,
        });
    }
    
    handleOk = (e) => {
        if(!this.state.typeVal){
            message.warning("请选择考评项")
            return
        }
        this.props.dispatch({ //根据typeId获取考评项详情
            type:'moralEvaluation/getTypeDetail',
            payload:{"typeId":this.state.typeVal},
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        visible: false,
                        typeDetails:res.data,
                        dataList: res.data.secondTypes,
                        imageUrl: res.data.icon||'',
                        markArr: res.data.mark
                    });
                }
            }
        })
    }
    addItem = () =>{
        let newData = this.state.dataList
        newData.push({
            typeName: "",
            totalStar: 1,
            totalScore: 0,
            proportion: 0
        })
        this.setState({
            dataList: newData
        })
    }
    removeItem = (index) =>{
        let oldData = this.state.dataList
        let newData = oldData.filter((item, index1)=>{
            return index !== index1
        })
        this.setState({
            dataList: newData
        })
    }
    onChange1 = (index, e) => {
        // console.log('changed', e.target.value, index);
        let newData = this.state.dataList
        newData[index].typeName = e.target.value
        this.setState({
            dataList: newData
        })
    }
    onChange2(index, value) {
        console.log('changed', value);
        let newData = this.state.dataList
        newData[index].totalStar = value
        this.setState({
            dataList: newData
        })
    }
    onChange3(index, e) {
        let newData = this.state.dataList
        newData[index].totalScore = e.target.value
        this.setState({
            dataList: newData
        })
    }
    onChange4(index, e) {
        let newData = this.state.dataList
        newData[index].proportion = e.target.value
        newData[index].totalScore = e.target.value*this.state.typeDetails.totalScore/100
        this.setState({
            dataList: newData
        })
    }
    onChange5(checked) {
        console.log(`switch to ${checked}`);
    }
    onChange6(e) {
      
        let newData = this.state.typeDetails
        newData.totalScore = e.target.value

        let newDataList = this.state.dataList
        newDataList.map(item=>{
            item.totalScore = e.target.value*item.proportion/100
        })
        this.setState({
            typeDetails: newData,
            dataList: newDataList
        })
    }
      
    handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    }
    typeChange=(val)=>{
        this.setState({typeVal:val})
    }
    remove = index => {
        let oldData = this.state.markArr
        if(oldData.length==0) return
        this.setState({
            markArr: oldData.filter((item, idx) => idx!==index)
        })
    };
    
    add = () => {
        let oldData = this.state.markArr
        oldData.push('')
        this.setState({
            markArr: oldData
        })
    };

    inputChange = (index, e) => {
        let oldData = this.state.markArr
        oldData[index] = e.target.value
        this.setState({
            markArr: oldData
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
      };
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
                    if(file.width>60||file.height>60){
                        message.error("图片尺寸不能大于60px*60px")
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

        const type=getQueryString('type');
        const id=getQueryString('id');
   
        this.props.form.validateFields((err, values) => {
            if(!err){
                let flag = true
                let allScore = 0
                this.state.dataList&&this.state.dataList.map(item=>{
                    if(!item.typeName){
                        flag = false
                    }
                    allScore += item.totalScore*item.proportion*0.01
                })
                if(!flag) {
                    message.warn('子项名称输入不完整')
                    return
                }

                const reg=/^\d{1,11}$|^\d{1,11}[.]\d{1,2}$/;
                if(!reg.test(this.state.typeDetails.totalScore)||this.state.typeDetails.totalScore<=0){
                    message.warn('考评项总分输入不合法')
                    return
                }
                let flag1 = true
                this.state.dataList&&this.state.dataList.map(item=>{
                    if(!reg.test(item.proportion)||item.proportion<=0){
                        flag1 = false
                    }
                })

                if(!flag1){
                    message.warn('占比输入不合法')
                    return
                }
                if(values.orderNum&&!isPositiveInteger(values.orderNum)) {
                    message.warn('排序需为正整数！')
                    return
                }

                let markArr = this.state.markArr.filter(item => {
                    return item
                })

                let param = {
                    id: id,
                    semesterId: values.semesterId,
                    typeName: values.typeName,
                    totalScore: this.state.typeDetails.totalScore,
                    totalStar: values.totalStar,
                    orderNum: values.orderNum,
                    defaultFullScore: values.defaultFullScore?1:0,
                    hasSecondTypes: this.state.dataList.length==0?0:1,
                    secondTypes: this.state.dataList,
                    padExaminers: values.padExaminers,
                    teacherExaminers: values.teacherExaminers,
                    studentExaminers: values.studentExaminers,
                    typeId: type==1?"":id,
                    mark: markArr||[],
                    icon: this.state.imageUrl||'',
                    type: this.props.form.getFieldValue("type")

                }

                this.props.dispatch({
                    type:type==1?'moralEvaluation/saveEvaluationType':'moralEvaluation/updateEvaluation',
                    payload: param,
                    callback:(res)=>{
                        if(res.code===200){
                            message.success(type==1?'创建考评项成功':'更新考评项成功',2)
                            this.props.dispatch(routerRedux.push("/moral-index?key=3"))
                        }
                    }
                })
            }
            
        })
    }
    render(){
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const {dataList, defaultFullScore, disabled, markArr, termTypes} = this.state
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
       
        const type=getQueryString('type');
        const formItems = markArr.map((k, index) => (
            <Form.Item
              {...(index === 0 ? formItemLayout3 : formItemLayoutWithOutLabel)}
              label={index === 0 ? '文字备注' : ''}
              required={false}
              key={index}
            >
              <Input placeholder="请输入" maxLength={50} value={k||''} onChange={this.inputChange.bind(this, index)} style={{ width: '60%', marginRight: 8 }} />
              {markArr.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(index)}
                />
              ) : null}
            </Form.Item>
          ));
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
      
        const {allTerms,pubStudents,commonPersonData,allSchoolUsers} = this.props;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })
        let typeChild=[]
        termTypes&&termTypes.length>0&&termTypes.map(item=>{
            typeChild.push(<Option key={item.typeId}>{item.typeName}</Option>)
        })
        let studentChild=[]
        pubStudents&&pubStudents.length>0&&pubStudents.map(item=>{
            studentChild.push(<Option key={item.personId}>{item.personName+'('+item.className+')'}</Option>)
        })
        let staffChild=[]
        commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item=>{
            staffChild.push(<Option key={item.personId}>{item.personName}</Option>)
        })
        let schoolUserChild=[]
        allSchoolUsers&&allSchoolUsers.length>0&&allSchoolUsers.map(item=>{
            schoolUserChild.push(<Option key={item.userId}>{item.userName}</Option>)
        })
        const {semesterId, typeDetails, imageUrl } = this.state
        return (
            <div className='detail-main'>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/moral-index?key=3">班级考评</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{type==1?"添加班级考评":"班级考评详情"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-main information" style={{width:'100%'}}>
                    <Form className="ant-advanced-search-form content-form teacher-form" style={{width:'100%'}}>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='学期'>
                                {getFieldDecorator('semesterId',{initialValue:semesterId,rules:[{required:true,message:"请选择学业阶段"}]})(
                                    <Select disabled={typeDetails&&typeDetails.hasScore&&type==2}  style={{width: "400px"}}>
                                        {termChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={5} offset={2}>
                                <FormItem {...formItemLayout1} label={'考评项'}>
                                {getFieldDecorator("typeName",{initialValue:typeDetails&&typeDetails.typeName||'',rules:[{required:true,message:"请输入考评项"}]})(
                                    // <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} maxLength={20} />
                                    <Input maxLength={20} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem {...formItemLayout1} label={'五星数量'}>
                                {getFieldDecorator("totalStar",{initialValue: typeDetails&&typeDetails.totalStar||1,rules:[{required:true,message:"请选择"}]})(
                                    <InputNumber disabled={typeDetails&&typeDetails.hasScore&&type==2} min={1} max={10} />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem {...formItemLayout1} label={'考评项总分'}>
                                {/* {getFieldDecorator("totalScore",{initialValue: typeDetails&&typeDetails.totalScore||0,rules:[{required:true,message:"请输入"}]})( */}
                                    <Input value={typeDetails&&typeDetails.totalScore} onChange={this.onChange6.bind(this)} 
                                    disabled={typeDetails&&typeDetails.hasScore&&type==2} />
                                {/* )} */}
                                </FormItem>
                            </Col>
                            {
                                typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={3} style={{marginTop:8}} ><a href='javascript:;' onClick={this.showModal}>上学期考评项</a></Col> 
                            }
                            {
                                typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={3} style={{marginTop:8}} ><a href='javascript:;' onClick={this.addItem}>添加二级考评项</a></Col>     
                            }
                            
                        </Row>
                        {
                            dataList&&dataList.map((item, index) =>{
                               return <Row gutter={24} key={index}>
                                        <Col span={5} offset={2}>
                                            <FormItem {...formItemLayout1} label={'子项名称'}>
                                                <Input value={item.typeName} onChange={this.onChange1.bind(this, index)} maxLength={20} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'五星数量'}>
                                                <InputNumber disabled={typeDetails&&typeDetails.hasScore&&type==2} value={item.totalStar} onChange={this.onChange2.bind(this, index)} min={0} max={10} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'占比'}>
                                                <Input disabled={typeDetails&&typeDetails.hasScore&&type==2} maxLength={5} suffix="%" value={item.proportion} onChange={this.onChange4.bind(this, index)} />
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem {...formItemLayout1} label={'子项分数'}>
                                                <Input style={{border: 'none', background: "#fff"}} disabled={true} value={item.totalScore||''} onChange={this.onChange3.bind(this, index)} />
                                            </FormItem>
                                        </Col>
                                        {
                                             typeDetails&&typeDetails.hasScore&&type==2?"":<Col span={2} style={{marginTop:8}} ><a href='javascript:;' onClick={this.removeItem.bind(this, index)}>删除</a></Col> 
                                        } 
                                    </Row>
                            })
                        }
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='评分周期'>
                                    {getFieldDecorator('type', { initialValue: typeDetails.type&&typeDetails.type.toString()||"1", rules:[{required:true,message:"请选择评分周期"}]})
                                    (<Radio.Group disabled={typeDetails&&typeDetails.hasScore&&type==2} >
                                        <Radio value="1">每天</Radio>
                                        <Radio value="2">每周</Radio>
                                        <Radio value="3">每月</Radio>
                                    </Radio.Group>)
                                    }
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='默认满分'>
                                    {getFieldDecorator('defaultFullScore', { initialValue: defaultFullScore==1, valuePropName: 'checked' })(<Switch />)}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='考评项图标'>
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
                                 <p>尺寸大小不超过60px*60px</p>
                                {imageUrl ? <Button onClick={this.deleteImg.bind(this)} >清空</Button>: null}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                {formItems}
                                {
                                markArr.length < 20 ? ( <Form.Item {...formItemLayoutWithOutLabel} label=''>
                                     <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                         <Icon type="plus" />新增
                                     </Button>
                                 </Form.Item>):null
                                }
                               
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='排序' >
                                {getFieldDecorator('orderNum',{initialValue:typeDetails&&typeDetails.orderNum||''})(
                                    <Input clear='true' style={{width: '100px'}} />
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='pad考评人'>
                                {getFieldDecorator('padExaminers',{initialValue:typeDetails&&typeDetails.padExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {schoolUserChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col> 
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='APP教师/员工考评人'>
                                {getFieldDecorator('teacherExaminers',{initialValue:typeDetails&&typeDetails.teacherExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {staffChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row gutter={24}>
                            <Col span={18}>
                                <FormItem {...formItemLayout} label='APP学生考评人'>
                                {getFieldDecorator('studentExaminers',{initialValue:typeDetails&&typeDetails.studentExaminers||[]})(
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: '90%' }}
                                    >
                                        {studentChild}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                        </Row>
                        <Row style={{marginTop:20}}>
                            <Col span={2} offset={10}>
                                <Button><Link to='/moral-index?key=3'>返回</Link></Button>
                            </Col>
                            <Col span={2} offset={0}>
                                <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                            </Col>
                        </Row>
                    </Form> 
                </div>
                <Modal
                    title="选择考评项"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Select onChange={this.typeChange} style={{width:'60%',marginLeft:'20%'}} placeholder='请选择'>
                        {typeChild}
                    </Select>
                </Modal>
            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    allTerms:state.user.allTerms,
    pubStudents:state.user.pubStudents,
    commonPersonData:state.user.commonPersonData,
    allSchoolUsers:state.user.allSchoolUsers
  }
}

export default connect(mapStateToProps)(Form.create()(MoralTypeDetail));
