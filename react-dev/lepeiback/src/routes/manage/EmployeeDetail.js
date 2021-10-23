 /* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Breadcrumb, Upload, Tree, message, Table, Button, Input, Select, Form, Row, Col, Icon, DatePicker, Radio, TreeSelect, Modal } from 'antd';
import StepIndex from '../../components/steps';
import BottomBtns from '../../components/bottom-btns';
import AddClass from '../../components/addClass';
import AddSelect from '../../components/addSelect';
import DepartmentSelect from '../../components/departmentSelect';
import { getQueryString, onlyDate, isBlank } from '../../utils/public';
import { getImg } from '../../utils/img';
import moment from 'moment';
import './style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { TreeNode } = Tree;
const confirm = Modal.confirm;
// const TreeNode = TreeSelect.TreeNode;

class EmployeeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
            jobId: [],
            disabled: false,
            edit: false,
            imgPath: '',
            controlBtn: false,
            formLayout: 'lnline',
            clickEdit:false,
            clickSubmit:true,
            clickCancle:true,
            tagsList:[],
            visible: false,
            tagFlag:true,
            tagName:'',
            tagContent:'',
            editShow:true,
            title:"教师详情",
            title1:"添加教师",
			title3:'职工详情',
			title4:'添加职工'
        };
    }
    
    componentDidMount = () => {
		const type = getQueryString('type');
		const role = getQueryString('role');
        const personId = getQueryString('personId');
        if (Number(type) === 2) {
            this.props.dispatch({ //获取详情
                type: 'person/getPersonDetail',
                payload: { "personId": personId },
                callback: (res) => {
                    if (res.code === 200) {
                        this.setState({
                            textNum:res.data.introduce ? res.data.introduce.length : '0',
                            detailList:res.data,
                            tagsList:eval(res.data.tags),
                            jobId: res.data.jobId, 
                            imgPath: res.data.pic,
                            departmentId: res.data.departmentId ? res.data.departmentName + '-' + res.data.departmentId : "",
                            departmentIdData: res.data.departmentId ? res.data.departmentId : "",
                        })
                    }
                }
            })
            this.setState({ disabled: true,clickEdit:true,clickCancle:false,clickSubmit:false})
        }
        this.props.dispatch({ //获取职务
            type: 'user/getCommonJobList'
        })
       
        sessionStorage.removeItem("qiniuToken");
        this.props.dispatch({ //获取上传图片token
            type: 'user/getPicToken',
            callback: (res) => {
                if (res.code === 200) {
                    sessionStorage.setItem("qiniuToken", res.data.token)
                    this.setState({ qiniuToken: res.data.token })
                }
            }
        })
        if(Number(role)===2){
			if(Number(type)===1){
				//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
				  this.props.dispatch({
					type: 'user/setLastRoute',
					payload: {
					  breadcrumbTitle:this.state.title1,
					  parentRoute:"/teacher-manage"
					},
				  })
			}else if (Number(type)===2){
				this.props.dispatch({
					type: 'user/setLastRoute',
					payload: {
					  breadcrumbTitle:this.state.title,
					  parentRoute:"/teacher-manage"
					},
				  })
			}
		}else if(Number(role)===1){
			if(Number(type)===1){
				//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
				  this.props.dispatch({
					type: 'user/setLastRoute',
					payload: {
					  breadcrumbTitle:this.state.title4,
					  parentRoute:"/employee-manage"
					},
				  })
			}else if (Number(type)===2){
				this.props.dispatch({
					type: 'user/setLastRoute',
					payload: {
					  breadcrumbTitle:this.state.title3,
					  parentRoute:"/employee-manage"
					},
				  })
			}
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
    //生日选择
    onChange = (date, dateString) => {
        const birthday = (new Date(dateString).getTime()) / 1000;
        this.setState({ birthday })
    }
    // 职务选择
    handleChange = (value) => {
        this.setState({ jobId: value })
    }
    
    ref = (ref) => {
        this.child = ref;
    }

    // 部门
    getDepartmentId = (id) => {
        if(id){
            this.setState({ departmentId: id, departmentIdData: id.substring(id.lastIndexOf('-')+1, id.length) })
        }else{
            this.setState({
                departmentId:'',
                departmentIdData:[]
            })
        }
    }
    
    // 头像上传
    onPicChange = (info) => {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({ imgPath: info.file.response.id })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }

    // 返回
    goto = (num) => {
        if (num == 1) {
            this.props.dispatch(routerRedux.push("/department-manage"))
        } else {
            this.props.dispatch(routerRedux.push("/job-manage"))
        }
    }

    // 头像大小限制
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传图片需小于2MB!');
        }
        return isLt2M;
    }

    // 提交
    submitBtn = () =>{
        const type = getQueryString('type');
        const role = getQueryString('role');
        const personId = getQueryString('personId');
        const { tagsList, jobId, birthday, imgPath, departmentIdData,  } = this.state;
       
        this.props.form.validateFields(["name","sex","birthday","idCardNo","usin","introduce","isManager"],(err, values) => {
            if (isBlank(values.idCardNo) && isBlank(values.usin)) {
                return message.error("身份证和其他证件必须选填一项！", 3)
            }
            if(isBlank(departmentIdData)){
                return message.error("请选择所属部门！")
            }
            if (!err) {
                this.setState({ controlBtn: true })
                // 发送请求参数
                const params = {
                    "name": values.name, 
                    "pic": imgPath, 
                    "sex": values.sex, 
                    "birthday": birthday, 
                    "idCardNo": values.idCardNo,
                    "usin": values.usin, 
                    "introduce": values.introduce, 
                    "tags":tagsList && tagsList.length > 0 ? JSON.stringify(tagsList) : "",
                    "personType": role == 1 ? 3 : 2, 
                    "departmentId": departmentIdData,
                    "isManager":values.isManager,
                    "jobId": jobId,
                }
                if (Number(type) === 1) { //添加
                    this.props.dispatch({
                        type: 'person/createPerson',  // 请求type 对应 reduece
                        payload: params,   // 请求参数
                        callback: (res) => { // 请求成功 执行的回调函数
                            if (res.code === 200) {
                                message.success('创建信息成功！', 2)
                                if (role == 1) {
                                    this.props.history.push('/employee-manage')
                                } else {
                                    this.props.history.push('/teacher-manage')
                                }
                            }
                        }
                    })
                } else { //编辑
                    this.props.dispatch({
                        type: 'person/updatePerson', //  请求type 对应 reduece
                        payload: { "personId": personId, ...params },  // 请求参数
                        callback: (res) => {
                            if (res.code === 200) {
                                message.success('修改信息成功！', 2)
                                if (role == 1) {
                                    this.props.history.push('/employee-manage')
                                } else {
                                    this.props.history.push('/teacher-manage')
                                }
                            }
                        }
                    })
                }
            }

        })
    
    }

    // 取消
    cancleBtn =() =>{
        window.history.go(-1)
    }

    // 编辑
    editBtn = () => {
        this.setState({disabled:false,clickEdit:false,clickCancle:true,clickSubmit:true,editShow:false})
    }

    // 标签添加
    addTag = () => {
        this.setState({
            visible:true
        })
    }

    // 标签添加确定
    handleOk = (flag) =>{
        let list = this.state.tagsList
        this.props.form.validateFields(['tagName', 'tagContent'],(err, values) => {
            if(!err) {
                if(flag){
                    list.push({
                        key:list.length,
                        name:values.tagName,
                        content:values.tagContent,
                    })
                }else{
                    list.map((item,index) => {
                        if(index == this.state.tagIndex){
                            item.name = values.tagName
                            item.content = values.tagContent
                        }
                    })
                }
                this.props.form.resetFields(['tagName', 'tagContent'])
                this.setState({
                    tagsList:list,
                    visible:false,
                    tagFlag:true,
                })
            }
        })
    }

    // 标签添加取消
    handleCancel = () => {
        this.props.form.resetFields(['tagName', 'tagContent'])
        this.setState({
          visible: false,
          tagFlag:true,
        }) 
    }

    // 标签删除
    tagDel = (idx) =>{
        let newArr = this.state.tagsList.filter(item => {
            return item.key != idx
        })
        newArr.map((item,index) =>{
            item.key = index
        })
        this.setState({tagsList:newArr})
    }

    // 标签编辑
    tagEdit = (idx) =>{
        let tag = this.state.tagsList.filter(item => item.key == idx)
        this.setState({
            visible:true,
            tagFlag:false,
            tagName:tag[0].name,
            tagContent:tag[0].content,
            tagIndex:idx
        })
    }

    //简介输入字数
    onBlur = (e) => {
        this.setState({textNum:e.target.value.length})
    }
   
    render() {
        const { getFieldDecorator } = this.props.form;
        const type = getQueryString('type');
        const role = getQueryString('role');
        const {  jobList} = this.props;
        const { disabled,detailList, edit, imgPath, controlBtn, tagsList, visible,tagFlag} = this.state;
        let children = [];
        jobList && jobList.length > 0 && jobList.map(item => { //职务列表
            return children.push(<Option key={item.jobId}>{item.jobName}</Option>);
        })
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };
        const qiniuToken = sessionStorage.getItem('qiniuToken');
        const props = {
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
            onChange: this.onPicChange,
            beforeUpload: this.beforeUpload
        };
       
        const columns = [
            {
              title: '序号',
              dataIndex: 'key',
              render:(record) => (
              <span>{ Number(record) + 1}</span>
              )
            },
            {
              title: '标签名称',
              dataIndex: 'name',
            },
            {
              title: '标签内容',
              dataIndex: 'content',
            },
            {
              title: '操作',
              dataIndex: '',
              width: 120,
              render:(text, record) => (
                <span className="make-box">
                  <a href="javascript:;" disabled={disabled} className="check-btn" onClick={this.tagDel.bind(this,record.key)}>删除</a>&emsp; 
                  <a href="javascript:;" disabled={disabled} className="check-btn" onClick={this.tagEdit.bind(this,record.key)}>编辑</a> 
            
                </span>
              )
            }];
        return (
            <div className='detail-main teacher-detail'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={role == 2 ? "/teacher-manage" : "/employee-manage"}>{role == 2 ? '教师管理' : '职工管理'}</Link></Breadcrumb.Item>
                        {type == 1 ? <Breadcrumb.Item>{role == 2 ? '添加教师' : '添加职工'}</Breadcrumb.Item> : <Breadcrumb.Item>{role == 2 ? '教师详情' : '职工详情'}</Breadcrumb.Item>}
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
                            <Row gutter={24} className="first">
                                <Col span={9}>
                                    <FormItem {...formItemLayout} label='姓名' className="personName">
                                        {getFieldDecorator('name', {
                                            initialValue: type == 2 && detailList && detailList.personName || '',
                                            rules: [{ required: true, message: "请输入姓名", whitespace: true, }]
                                        })(
                                            <Input placeholder="请输入姓名" clear='true' disabled={disabled} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem {...formItemLayout} label={'性别'}>
                                        {getFieldDecorator("sex", { initialValue: type == 2 && detailList && detailList.sex || '1', rules: [{ required: true }] })(
                                            <RadioGroup disabled={disabled}>
                                                <Radio  value="1">男</Radio >
                                                <Radio  value="2">女</Radio >
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label={'出生日期'}>
                                        {getFieldDecorator("birthday", { initialValue: type == 2 && detailList && detailList.birthday && detailList.birthday != null ? moment(onlyDate(detailList.birthday)) : null,})(
                                            <DatePicker onChange={this.onChange.bind(this)} disabled={disabled} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} className="labelWidth">
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label='身份证'>
                                        {getFieldDecorator('idCardNo', { initialValue: type == 2 && detailList && detailList.idCardNo || '' })(
                                            <Input maxLength={18} placeholder='请输入身份证号码' disabled={disabled} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12} className="usin">
                                    <FormItem {...formItemLayout} label='其他证件'>
                                        {getFieldDecorator('usin', { initialValue: type == 2 && detailList && detailList.usin || '' })(
                                            <Input maxLength={17} placeholder='请输入其他证件' disabled={disabled} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} className="labelWidth">
                                <Col span={24} className="introduce">
                                    <FormItem {...formItemLayout} label='简介'>
                                        {getFieldDecorator('introduce', { initialValue: type == 2 && detailList && detailList.introduce || '' })(
                                            <TextArea placeholder="请输入简介" maxLength={150} onInput={this.onBlur.bind(this)} autosize={{ minRows: 2, maxRows: 6 }} disabled={disabled} />
                                        )}
                                        <p className="textNum"><span>{this.state.textNum || '0'}</span>/150</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} className="labelWidth">
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label='标签'>
                                        <Button type="primary" onClick={this.addTag.bind(this)} disabled={disabled}>添加</Button>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <div className="tags-list" >
                                        <Table columns={columns} dataSource={tagsList} pagination={false}/>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <div className='department-main' style={{marginBottom:'15px'}}>
                    <div className='department-item'>
                        <h3 className='detail-title'>所属部门</h3>
                        <div className='content'>
                            <Form>
                                <Row gutter={24} style={{margin:'20px 0'}}>
                                    <Col span={5} className="depart-text" style={{textAlign:'right'}}>
                                        <p><span className="star">*</span>部门 :</p>
                                    </Col>
                                    <Col span={9}>
                                        <DepartmentSelect isEdit={disabled} getDepartmentId={this.getDepartmentId.bind(this)} data={this.state.departmentId} />
                                    </Col>
                                    <Col span={5} >
                                        <Button type="primary" onClick={this.goto.bind(this, 1)} disabled={disabled}>部门管理</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={14}>
                                        <FormItem {...formItemLayout} label='管理者'>
                                        {getFieldDecorator('isManager', { initialValue: type == 2 && detailList && detailList.isManager || '0',rules: [{ required: true, whitespace: true}]})(
                                            <RadioGroup disabled={disabled}>
                                                <Radio  value="1">是</Radio >
                                                <Radio  value="0">否</Radio >
                                            </RadioGroup>
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                    <div className='department-item'>
                        <h3 className='detail-title'>担任职务</h3>
                        <div className='content'>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <FormItem {...formItemLayout} label='职务'>
                                        <Select
                                            mode="multiple"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            placeholder="请选择"
                                            value={this.state.jobId}
                                            onChange={this.handleChange.bind(this)}
                                            style={{ width: '100%' }}
                                            disabled={disabled}
                                        >
                                            {children}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <Button type="primary" style={{marginTop:'4px'}} onClick={this.goto.bind(this, 2)} disabled={disabled}>职务管理</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                {Number(type) === 2 && detailList && detailList.operateLogs && detailList.operateLogs.length > 0 ? <div className='step-contents'>
                    <StepIndex data={detailList && detailList.operateLogs} />
                </div> : null}
                {/* <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} edit={edit} controlBtn={controlBtn} /> */}
                <div className="common-bottom-btns">
                    <Col span={24} style={{textAlign:"center"}}>
                        <Button type="primary" onClick={this.submitBtn.bind(this)} className={this.state.clickSubmit ? "inlineblock" : "none"}>提交</Button>
                        <Button onClick={this.cancleBtn.bind(this)} style={{margin:'0 20px'}} className={this.state.clickCancle ? "inlineblock" : "none"}>取消</Button>
                    </Col>
                    {
                        Number(type) === 2 && this.state.editShow ?
                        <Col offset={22} span={2}>
                            <Button type="primary" onClick={this.editBtn.bind(this)} >编辑</Button>
                        </Col> : null
                    }
                </div>
                <Modal
                title={tagFlag ? '添加' : '编辑'}
                visible={visible}
                onOk={this.handleOk.bind(this,tagFlag)}
                onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem {...formItemLayout2} label='标签名称'>
                            {getFieldDecorator("tagName",{initialValue:!tagFlag ? this.state.tagName : '',rules: [{required: true,whitespace: true,message: "请输入标签名称",}]})(
                                <Input placeholder="例：18年度评优" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout2} label='标签内容'>
                            {getFieldDecorator("tagContent",{initialValue:!tagFlag ? this.state.tagContent : '',rules: [{required: true,whitespace: true,message: "请输入标签内容",}]})(
                            <Input placeholder="例：获得2018年度优秀奖"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        jobList: state.user.commonJobList,
        classData: state.user.classByGrade
    }
}

export default connect(mapStateToProps)(Form.create()(EmployeeDetail));

