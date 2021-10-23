import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Upload,message,Button,Input,Select,Form,Row,Col,Icon,DatePicker,Radio,TreeSelect,Breadcrumb} from 'antd';
import BottomBtns from '../../components/bottom-btns';
import StepIndex from '../../components/steps';
import AddSelect from '../../components/addSelect';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {getQueryString,onlyDate,isBlank} from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;
class StudentDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            num:1,
            imgPath:'',
            tagTitle:[],
            tagContent:[],
            tagData:[],
            value: [],
            classId:'',
            jobName:[],
            jobId:[],
            disabled:false,
            controlBtn:false,
            title:"学生详情",
            title1:"添加学生",
        };
    }
    componentDidMount=()=>{
        const type=getQueryString('type');
        const personId=getQueryString('personId');
        if(Number(type)===2){
            this.props.dispatch({ //获取详情
                type:'person/getPersonDetail',
                payload:{"personId":personId},
                callback:(res)=>{
                    console.log({res});
                    
                    if(res.code===200){
                        this.setState({
                            classData:res.data.classId?res.data.classId:"",classCadreId:res.data.classCadreId?res.data.classCadreId:'',
                            classId:res.data.classId?res.data.className+'-'+res.data.classId:"",
                            tagData:res.data.tags,birthday:res.data.birthday,
                            oldTag:res.data.tags?res.data.tags:[],imgPath:res.data.pic
                        })
                    }
                }
            })
            this.setState({disabled:true})
        }
        this.props.dispatch({ //获取班级
            type:'user/getClassByGrade',
            // payload:{}
        })
        this.props.dispatch({ //获取班干部列表
            type:'user/getClassLeaderList'
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
        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/student-manage"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/student-manage"
                },
              })
        }
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
            //组件卸载时，清空手动加入的面包屑
            this.props.dispatch({
              type: 'user/setLastRoute',
              payload: {},
            })
          
    }
    onChange=(date, dateString)=> {
        const birthday=(new Date(dateString).getTime())/1000;
        this.setState({birthday})
    }
    ref=(ref)=>{
        this.child=ref;
    }
    getBtnDate=(data)=>{
        const type=getQueryString('type');
        const personId=getQueryString('personId');
        if(data==='edit'){
            this.setState({disabled:false})
        }else if(data==='cancel'){
            this.props.history.push('/student-manage')
        }else if(data==='submit'){
            const tagData=this.child.handleSubmit();
            if(tagData[1]==false){
                return message.error("请将标签填完",2)
            }
            let tag='';
            if(tagData&&tagData[0].length>0){
                if(typeof tagData[0]=="string"){
                    tag=tagData[0]
                }else{
                    tag=JSON.stringify(tagData[0])
                }
            }
            this.props.form.validateFields((err, values) => {
                if(isBlank(values.idCardNo)&&isBlank(values.usin)){
                    return message.error("身份证和其他证件必须选填一项！",3)
                }
                if(!err){
                    this.setState({controlBtn:true})
                    const params={
                        "pic":this.state.imgPath,"name":values.personName,"sex":values.sex,"birthday":this.state.birthday,"idCardNo":values.idCardNo,"usin":values.usin,
                        "personType":1,"classId":this.state.classData,"classCadreId":this.state.classCadreId,"inResidence":values.inResidence,
                        "introduce":values.introduce,"tags":tag
                    }
                    console.log({tagData});
                    console.log({params});
                    if(Number(type)===1){ //添加
                        this.props.dispatch({
                            type:'person/createPerson',
                            payload:params,
                            callback:(res)=>{
                                if(res.code===200){
                                    message.success('创建学生成功！',2)
                                    this.props.history.push('/student-manage')
                                }
                                this.setState({controlBtn:false})
                            }
                        })
                    }else{ //编辑
                        this.props.dispatch({
                            type:'person/updatePerson',
                            payload:{"personId":personId,...params},
                            callback:(res)=>{
                                if(res.code===200){
                                    message.success('修改学生信息成功！',2)
                                    this.props.history.push('/student-manage')
                                }
                                this.setState({controlBtn:false})
                            }
                        })
                    }
                }
            })
        }
    }
    onSelectChange = (value) => {
        const classData=value.substring(value.lastIndexOf('-')+1, value.length);
        this.setState({ classId:value,classData: classData });
    }
    handleChange=(value)=>{
        console.log(value)
        this.setState({classCadreId:value})
    }
    goto=(num)=>{
        if(num===1){
            this.props.dispatch(routerRedux.push("/class-manage"))
        }else{
            this.props.dispatch(routerRedux.push("/class-leader"))
        }
    }
    onPicChange=(info)=>{
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    beforeUpload =(file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {edit,disabled,imgPath,classId,controlBtn} =this.state;
        const type=getQueryString('type');
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 4 },
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
            onChange:this.onPicChange,
            beforeUpload:this.beforeUpload
        };
        const {classData,classLeaders,personDetail} = this.props;
        let children = [];
        classLeaders&&classLeaders.length>0&&classLeaders.map(item=>{ //职务列表
            return children.push(<Option key={item.id} value={item.id}>{item.name}</Option>);
        })
        // let treeData=[];
        // classData&&classData.length>0&&classData.map(item=>{ //行政班班级
        //     let itemChild=[];
        //     item.classData&&item.classData.length>0&&item.classData.map(n=>{
        //         itemChild.push({
        //             title:n.className,
        //             value:n.classId,
        //             key:n.classId,
        //         })
        //     })
        //     treeData.push({
        //         title:item.gradeName,
        //         value:item.gradeId,
        //         key:item.gradeId,
        //         children:itemChild
        //     })
        // })
        let options=[]
        classData&&classData.length>0&&classData.map(item=>{
            let classChildren=[];
            if(item.classData&&item.classData.length>0){
                item.classData.map(n=>{
                    return classChildren.push(<TreeNode value={n.className+'-'+n.classId} title={n.className} key={n.classId} />)
                })
            }
            return options.push(<TreeNode selectable={false} value={item.gradeName+'-'+item.gradeId} title={item.gradeName} key={item.gradeId}>{classChildren}</TreeNode>)
        })
        return (
            <div className='detail-main'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/student-manage">学生管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{type==1?"添加学生":"学生详情"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <h3 className='detail-title'>基础资料</h3>
                <div className="content-main information">
                    <div className='information-left'>
                        <img className="person-img" src={getImg(imgPath)} />
                        <Upload {...props} showUploadList={false}>
                            <Button disabled={disabled}>
                            <Icon type="upload" /> 更换头像
                            </Button>
                        </Upload>
                    </div>
                    <div className='information-right'>
                        <Form className="ant-advanced-search-form content-form teacher-form">
                            <Row gutter={24}>
                                <Col span={9}>
                                    <FormItem {...formItemLayout} label='姓名'>
                                    {getFieldDecorator('personName',{initialValue:Number(type)===2&&personDetail&&personDetail.personName||'',
                                    rules:[{required:true,message:"请输入姓名",whitespace: true}]})(
                                        <Input placeholder="" clear='true' disabled={disabled}/>
                                    )}
                                    </FormItem>
                                </Col> 
                                <Col span={7}>
                                    <FormItem {...formItemLayout} label={'性别'}>
                                    {getFieldDecorator("sex",{initialValue:Number(type)===2&&personDetail&&personDetail.sex||'1',rules:[{required:true}]})(
                                        <RadioGroup disabled={disabled}>
                                            <RadioButton value="1">男</RadioButton>
                                            <RadioButton value="2">女</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'出生日期'}>
                                    {getFieldDecorator("birthday",{initialValue:Number(type)===2&&personDetail&&personDetail.birthday&&personDetail.birthday!=null?moment(onlyDate(personDetail.birthday)):null})(
                                        <DatePicker onChange={this.onChange.bind(this)} disabled={disabled}/>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={19}>
                                    <FormItem {...formItemLayout2} label='证件号码'>
                                    {getFieldDecorator('idCardNo',{initialValue:Number(type)===2&&personDetail&&personDetail.idCardNo||''})(
                                        <Input addonBefore="身份证" maxLength={18} placeholder='请输入号码' disabled={disabled} />
                                    )}
                                    </FormItem>
                                </Col> 
                                <Col span={19} offset={3}>
                                    <FormItem {...formItemLayout2} label=''>
                                    {getFieldDecorator('usin',{initialValue:Number(type)===2&&personDetail&&personDetail.usin||''})(
                                        <Input addonBefore="其他证件" maxLength={17} placeholder='请输入号码' disabled={disabled} />
                                    )}
                                    </FormItem>
                                </Col>                                                                                                                                                                                                                                                                                                                                                                                        
                            </Row>
                            <Row gutter={24}>
                                <Col span={19}>
                                    <FormItem {...formItemLayout2} label={'读书形式'}>
                                    {getFieldDecorator("inResidence",{initialValue:Number(type)===2&&personDetail&&personDetail.inResidence||'1',rules:[{required:true}]})(
                                        <RadioGroup disabled={disabled}>
                                            <RadioButton value="1">住读</RadioButton>
                                            <RadioButton value="2">走读</RadioButton>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={19}>
                                    <FormItem {...formItemLayout2} label='简介'>
                                    {getFieldDecorator('introduce',{initialValue:Number(type)===2&&personDetail&&personDetail.introduce||''})(
                                        <TextArea placeholder="请输入简介" autosize={{ minRows: 2, maxRows: 6 }} disabled={disabled} />
                                    )}
                                    </FormItem>
                                </Col> 
                            </Row>
                            {/* {tagsArr} */}
                            <AddSelect onRef={this.ref.bind(this)} data={this.state.oldTag} type={type} isEdit={disabled}/>
                            {/* <span className='add-tab' onClick={this.addTag.bind(this)}>+ 增加标签</span> */}
                        </Form>          
                    </div>
                </div>
                <div className='department-main'>
                    <div className='department-item'>
                        <h3 className='detail-title'>所属班级（行政班）</h3>
                        <div className='department-content'>
                            <div style={{marginBottom:10}}>当前班级：</div>
                            <TreeSelect
                                style={{ width: 300 }}
                                value={this.state.classId}
                                dropdownStyle={{ maxHeight: 170, overflow: 'auto',zIndex:'10000' }}
                                placeholder="请选择"
                                onChange={this.onSelectChange}
                                treeCheckable={false} 
                                disabled={disabled}
                                showSearch
                            >
                                {options}
                            </TreeSelect><br />
                            <div className='go-manage'>未找到对应班级？<span className='last' style={{cursor:'pointer'}} onClick={this.goto.bind(this,1)}>前往班级管理</span></div>
                        </div>
                    </div>
                    <div className='department-item'>
                        <h3 className='detail-title'>担任职务</h3>
                        <div className='department-content'>
                            <div style={{marginBottom:10}}>当前职务：</div>
                            <Select
                                mode="tags"
                                placeholder="请选择"
                                value={this.state.classCadreId}
                                onChange={this.handleChange.bind(this)}
                                style={{ width: '100%' }}
                                disabled={(classId&&!disabled?false:true)}
                                >
                                {children}
                            </Select>
                            <div className='go-manage'>未找到对应职务？<span className='last' style={{cursor:'pointer'}} onClick={this.goto.bind(this,2)}>前往班干部管理</span></div>
                        </div>
                    </div>
                    {/* <div className='department-item'>
                        <h3 className='detail-title'>所属班级（教学班）</h3>
                        <div className='department-content'>    
                            <div>当前班级：</div>
                            <TreeSelect {...tProps} /> 
                            <div className='go-manage'>未找到对应班级？<span className='last'>前往班级管理>></span></div>
                        </div>
                    </div> */}
                </div>
                {Number(type)===2&&personDetail&&personDetail.operateLogs&&personDetail.operateLogs.length>0?<div className='step-contents'>
                    <StepIndex data={personDetail&&personDetail.operateLogs} />
                </div>:null}
                <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} edit={edit} controlBtn={controlBtn}/>
            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     classData:state.user.classByGrade,
     classLeaders:state.user.commonClassLeader,
     personDetail:state.person.personDetail
  }
}

export default connect(mapStateToProps)(Form.create()(StudentDetail));
