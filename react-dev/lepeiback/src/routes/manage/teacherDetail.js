/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {
	Breadcrumb,
	Upload,
	Tree,
	message,
	Table,
	Button,
	Input,
	Select,
	Form,
	Row,
	Col,
	Icon,
	DatePicker,
	Radio,
	TreeSelect,
	Modal
} from 'antd';
import StepIndex from '../../components/steps';
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

class TeacherDetail extends Component {
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
			clickEdit: false,
			clickSubmit: true,
			clickCancle: true,
			tagsList: [{
				"name": '',
				"content": ''
			}],
			birthday:'',
			visible: false,
			tagFlag: true,
			tagName: '',
			tagContent: '',
			editShow: true,
			// disabled1: true,
			// disabled2: true,
			subjectList: [],
			teachingInfo: [
				{
					classId: '',
					type: '',
					gradeType:'',
					gradeId:'',
					courseIds: []
				}
			],

			title:"教师详情",
            title1:"添加教师",
			title3:'职工详情',
			title4:'添加职工'
		};
	}

	componentDidMount = () => {
		this.getSubject();
		const type = getQueryString('type');
		const role = getQueryString('role');
		const personId = getQueryString('personId');
		if (Number(type) === 2) {
			this.props.dispatch({
				//获取详情
				type: 'person/getPersonDetail',
				payload: { personId: personId },
				callback: (res) => {
					console.log(res)
					if (res.code === 200) {
						this.setState({
							textNum: res.data.introduce ? res.data.introduce.length : '0',
							detailList: res.data,
							tagsList: JSON.parse(res.data.tags),
							jobId: res.data.jobId,
							imgPath: res.data.pic,
							departmentId: res.data.departmentId
								? res.data.departmentName + '-' + res.data.departmentId
								: '',
							departmentIdData: res.data.departmentId ? res.data.departmentId : '',
							teachingInfo:res.data.teachingInfo,
							birthday:res.data.birthday
						});
						console.log(this.state.tagsList,res.data)
						res.data.teachingInfo.map((item,index)=>{
							this.handleChange1(index,item.gradeType)
							this.gradeChange(index,item.gradeId)
						})
					}
				}
			});
			this.setState({ disabled: true, clickEdit: true, clickCancle: false, clickSubmit: false });
		}
		this.props.dispatch({
			//获取职务
			type: 'user/getCommonJobList'
		});

		sessionStorage.removeItem('qiniuToken');
		this.props.dispatch({
			//获取上传图片token
			type: 'user/getPicToken',
			callback: (res) => {
				if (res.code === 200) {
					sessionStorage.setItem('qiniuToken', res.data.token);
					this.setState({ qiniuToken: res.data.token });
				}
			}
		});
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
	};
	componentWillUnmount = () => {
		sessionStorage.removeItem('qiniuToken');
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
			type: 'user/setLastRoute',
			payload: {},
		  })
	};


	//获取学科
	getSubject() {
		let params = { type: '1' };
		this.props.dispatch({
			type: 'person/getAllSubject',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code == 200) {
					this.setState({
						subjectList: res.data
					});
				}
			}
		});
	}
	//生日选择
	onChange = (date, dateString) => {
		const birthday = new Date(dateString).getTime() / 1000;
		this.setState({ birthday });
	};
	// 职务选择
	handleChange = (value) => {
		this.setState({ jobId: value });
	};

	ref = (ref) => {
		this.child = ref;
	};

	// 部门
	getDepartmentId = (id) => {
		if (id) {
			this.setState({ departmentId: id, departmentIdData: id.substring(id.lastIndexOf('-') + 1, id.length) });
		} else {
			this.setState({
				departmentId: '',
				departmentIdData: []
			});
		}
	};

	// 头像上传
	onPicChange = (info) => {
		if (info.file.status !== 'uploading') {
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} 上传成功！`);
			this.setState({ imgPath: info.file.response.id });
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} 上传失败.`);
		}
	};

	// 返回
	goto = (num) => {
		if (num == 1) {
			this.props.dispatch(routerRedux.push('/department-manage'));
		} else {
			this.props.dispatch(routerRedux.push('/job-manage'));
		}
	};

	// 头像大小限制
	beforeUpload = (file) => {
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('上传图片需小于2MB!');
		}
		return isLt2M;
	};

	// 提交
	submitBtn = () => {
		const type = getQueryString('type');
		const role = getQueryString('role');
		const personId = getQueryString('personId');
		const { tagsList, jobId, birthday, imgPath, departmentIdData,teachingInfo } = this.state;
		console.log(this.state.birthday)
        let flag=true
		this.props.form.validateFields(
			[ 'name', 'sex', 'birthday', 'idCardNo', 'usin', 'introduce', 'isManager' ],
			(err, values) => {
				if (isBlank(values.idCardNo) && isBlank(values.usin)) {
					return message.error('身份证和其他证件必须选填一项！', 3);
				}
				if (isBlank(departmentIdData)) {
					return message.error('请选择所属部门！');
				}
                teachingInfo.map(item=>{
					console.log(item)
					if(item.classId===''){
						flag=false
						return message.error('请选择班级');
					}
					if(item.courseIds.length===0||item.courseIds==undefined||item.courseIds==''){
						flag=false
						return message.error('请选择学科');
					}
					if(item.type===''){
						flag=false
						return message.error('请选择班级职务');
					}
				})
				if (!err&&flag) {
					this.setState({ controlBtn: true });
					// 发送请求参数
					const params = {
						name: values.name,
						pic: imgPath,
						sex: values.sex,
						birthday: birthday,
						idCardNo: values.idCardNo,
						usin: values.usin,
						introduce: values.introduce,
						tags: tagsList && tagsList.length > 0 ? JSON.stringify(tagsList) : '',
						personType: role == 1 ? 3 : 2,
						departmentId: departmentIdData,
						isManager: values.isManager,
						jobId: jobId,
						teachingInfo:teachingInfo
					};
					console.log(params);
					if (Number(type) === 1) {
						//添加
						this.props.dispatch({
							type: 'person/createPerson', // 请求type 对应 reduece
							payload: params, // 请求参数
							callback: (res) => {
								// 请求成功 执行的回调函数
								if (res.code === 200) {
									message.success('创建信息成功！', 2);
									if (role == 1) {
										this.props.history.push('/employee-manage');
									} else {
										this.props.history.push('/teacher-manage');
									}
								}
							}
						});
					} else {
						//编辑
						this.props.dispatch({
							type: 'person/updatePerson', //  请求type 对应 reduece
							payload: { personId: personId, ...params }, // 请求参数
							callback: (res) => {
								if (res.code === 200) {
									message.success('修改信息成功！', 2);
									if (role == 1) {
										this.props.history.push('/employee-manage');
									} else {
										this.props.history.push('/teacher-manage');
									}
								}
							}
						});
					}
				}
			}
		);
	};

	// 取消
	cancleBtn = () => {
		// window.history.go(-1);
		const role = getQueryString('role');
		if (role == 1) {
			this.props.history.push('/employee-manage');
		} else {
			this.props.history.push('/teacher-manage');
		}
	};

	// 编辑
	editBtn = () => {
		this.setState({ disabled: false, clickEdit: false, clickCancle: true, clickSubmit: true, editShow: false });
	};

	//简介输入字数
	onBlur = (e) => {
		this.setState({ textNum: e.target.value.length });
	};

	//学业阶段选择
	handleChange1 = (index,value) => {
		// console.log(index,value)
		if (value) {
			// this.setState({ disabled1: false });
			this.props.dispatch({
				type: 'user/getGradeName',
				payload: { type: value }
			});
			let newData = this.state.teachingInfo
		    newData[index].gradeType = value
            this.setState({
				teachingInfo:newData,
			})

		} else {
			this.setState({

			});
		}
    let fields = [ `gradeId${index}`, "classId",[] ];
    console.log(fields)
    console.log(this.props.form.getFieldsValue(fields))
		this.props.form.resetFields(fields);
    console.log(this.props.form.getFieldsValue(fields))
		this.setState({
			classValue: '',
			classId: '',
			// disabled2: true,
		});
	};


	//年级选择
	gradeChange = (index,val) => {
		// console.log(index,val)
		if (val) {
			// this.setState({ disabled2: false });
			const id = val;
			this.props.dispatch({
				type: 'user/getClassName',
				payload: { gradeId: id },
				callback: (res) => {
					if (res.code === 200) {
						// this.setState({ classId: '' });
					}
				}
			});
			let newData = this.state.teachingInfo
			newData[index].gradeId = val
			this.setState({
				teachingInfo: newData
			})
		} else {
			this.setState();
		}
		this.props.form.resetFields([ `classId[${index}]` ]);
	};

	//增加班级
	add = () => {
		let newdata = this.state.teachingInfo;
		console.log(newdata)
		newdata.push({
			classId: '',
			type: '',
			gradeType:'',
			gradeId:'',
			courseIds: []
		});
		this.setState({
			teachingInfo: newdata
		});
		console.log(this.state.teachingInfo)
	};

	//增加标签
	addtags = () => {
		let newdata = this.state.tagsList;
		newdata.push({
			"name": '',
			"content": ''
		});
		console.log(newdata)
		this.setState({
			tagsList: newdata
		});
	};


	//班级删除
	delete = (index) => {
		let oldData = this.state.teachingInfo;
		let newData = oldData.filter((item, index1) => {
			return index1 !== index;
		});
		this.setState({
			teachingInfo: newData
		});
	};

    //标签删除
	removetags = (index) => {
		// debugger
		console.log(index)
		let oldData =this.state.tagsList
		console.log(oldData)
		let newData = oldData.filter((item, index1) => {
			return index1 !== index;
		});
		// oldData.splice(index,1)
		console.log(newData)
		this.setState({
			tagsList:newData
		},()=>{
			console.log(this.state.tagsList)
		})
		// const { tagsList } = this.state;
		// tagsList.splice(index, 1);
		// this.setState((prevState)=>{
		// 	   delete prevState.tagsList;
		// 	   return prevState;
		// })
		// this.setState({tagsList});



	}

	//班级选择
	classChange = (index, e) => {
		console.log(index,e)
		let newData = this.state.teachingInfo
		newData[index].classId = e
		this.setState({
			teachingInfo: newData
		})
	}

	//班级职务选择
	classJobChange = (index, e) => {
		console.log(index,e)
		let newData = this.state.teachingInfo
		newData[index].type = e
		this.setState({
			teachingInfo: newData
		})
	}

	//学科选择
	courseIdsChange= (index, e) => {
		console.log(index,e)
		let newData = this.state.teachingInfo
		newData[index].courseIds = e
		this.setState({
			teachingInfo: newData
		})
	}
    //标签名字修改
	tagnamechange=(index,e)=>{
		console.log(index,e.target.value)
		let newData = this.state.tagsList
		newData[index].name = e.target.value
		this.setState({
			tagsList: newData
		})
		console.log(this.state.tagsList)
	}

	//标签内容修改
	tagcontentchange=(index,e)=>{
		console.log(index,e.target.value)
		let newData = this.state.tagsList
		newData[index].content = e.target.value
		this.setState({
			tagsList: newData
		})
		console.log(this.state.tagsList)
	}
	//配置项模糊查询
	filterOption(input, option) {
		if (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
			return true;
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const type = getQueryString('type');
		const role = getQueryString('role');
		const { jobList } = this.props;
		const {
			disabled,
			detailList,
			imgPath,
			tagsList,
			subjectList,
			teachingInfo
		} = this.state;
		let children = [];
		jobList &&
			jobList.length > 0 &&
			jobList.map((item) => {
				//职务列表
				return children.push(<Option key={item.jobId}>{item.jobName}</Option>);
			});
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 15 }
		};
		const formItemLayout3 = {
			labelCol: { span: 3 },
			wrapperCol: { span: 20 }
		};
		const formItemLayout4 = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		};
		const formItemLayout5 = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		};
		const formItemLayout6 = {
			labelCol: { span: 3 },
			wrapperCol: { span: 19 }
		};
		const qiniuToken = sessionStorage.getItem('qiniuToken');
		const props = {
			name: 'file',
			action: 'https://upload.qiniup.com/',
			accept: 'image/jpg,image/jpeg,image/png',
			headers: {
				authorization: 'authorization-text',
				'Content-Disposition': 'form-data; name="file";'
			},
			data: {
				token: qiniuToken ? qiniuToken : this.state.qiniuToken
			},
			onChange: this.onPicChange,
			beforeUpload: this.beforeUpload
		};
		const { commonData, gradeList } = this.props;
		let options = [];
		gradeList &&
			gradeList.length > 0 &&
			gradeList.map((item) => {
				return options.push(
					<Option key={item.gradeId} value={item.gradeId}>
						{item.gradeName}
					</Option>
				);
			});
		let classOptions = [];
		commonData &&
			commonData.classNameData &&
			commonData.classNameData.length > 0 &&
			commonData.classNameData.map((item) => {
				return classOptions.push(
					<Option key={item.classId} value={item.classId}>
						{item.className}
					</Option>
				);
			});

		let subjectListoptions = [];
		subjectList &&
			subjectList.map((item) => {
				return subjectListoptions.push(
					<Option key={item.subjectId} value={item.subjectId}>
						{item.subjectName}
					</Option>
				);
			});

		return (
			<div className="detail-main teacher-detail">
				<h3 className="detail-title">基础资料</h3>
				<div className="content-main information">
					<div className="information-right">
						<Form className="ant-advanced-search-form content-form teacher-form">
							<Row gutter={24} className="first">
								<Col span={15}>
									<FormItem {...formItemLayout} label="姓名" className="personName">
										{getFieldDecorator('name', {
											initialValue: (type == 2 && detailList && detailList.personName) || '',
											rules: [ { required: true, message: '请输入姓名', whitespace: true } ]
										})(<Input placeholder="请输入姓名" clear="true" disabled={disabled} />)}
									</FormItem>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={15}>
									<FormItem {...formItemLayout} label={'性别'}>
										{getFieldDecorator('sex', {
											initialValue: (type == 2 && detailList && detailList.sex) || '1',
											rules: [ { required: true } ]
										})(
											<RadioGroup disabled={disabled}>
												<Radio value="1">男</Radio>
												<Radio value="2">女</Radio>
											</RadioGroup>
										)}
									</FormItem>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={15}>
									<FormItem {...formItemLayout} label={'出生日期'}>
										{getFieldDecorator('birthday', {
											initialValue:
												type == 2 &&
												detailList &&
												detailList.birthday &&
												detailList.birthday != null
													? moment(onlyDate(detailList.birthday))
													: null,
											rules: [ { required: true,message: '请选择出生日期' } ]
										})(<DatePicker onChange={this.onChange.bind(this)} disabled={disabled} />)}
									</FormItem>
								</Col>
							</Row>
							<Row gutter={24} className="labelWidth">
								<Col span={15}>
									<FormItem {...formItemLayout} label="证件号码" required>
										{getFieldDecorator('idCardNo', {
											initialValue: (type == 2 && detailList && detailList.idCardNo) || ''
										})(<Input maxLength={18} placeholder="请输入证件号码" disabled={disabled} />)}
									</FormItem>
								</Col>
							</Row>
							<Row gutter={24} className="labelWidth">
								<Col span={15} offset={3}>
									<FormItem {...formItemLayout}>
										{getFieldDecorator('usin', {
											initialValue: (type == 2 && detailList && detailList.usin) || ''
										})(<Input maxLength={17} placeholder="请输入其他证件" disabled={disabled} />)}
									</FormItem>
								</Col>
							</Row>

							<Row gutter={24} className="labelWidth">
								<Col span={24}>
									<FormItem label="简介" {...formItemLayout3}>
										{getFieldDecorator('introduce', {
											initialValue: (type == 2 && detailList && detailList.introduce) || ''
										})(
											<TextArea
												placeholder="请输入简介"
												maxLength={150}
												onInput={this.onBlur.bind(this)}
												autosize={{ minRows: 3, maxRows: 6 }}
												disabled={disabled}
											/>
										)}
										<p className="textNum">
											<span>{this.state.textNum || '0'}</span>/150
										</p>
									</FormItem>
								</Col>
							</Row>
							<Row gutter={24} className="labelWidth">
								<Col span={24}>
								 <FormItem {...formItemLayout3} label="标签">
									{this.state.tagsList&&this.state.tagsList.map((item,index)=>{
                                          return <Row  gutter={24} key={index}>
										  <Col span={9}>
											  <FormItem required={false}>
												  {getFieldDecorator(`title[${index}]`, {
													  validateTrigger: [ 'onChange', 'onBlur' ],
													  initialValue: item.name === ''?undefined: item.name,
													  rules: [
														  {
															  required: true,
															  whitespace: true,
															  message: '请输入'
														  }
													  ]
												  })(
													  <Input
														  placeholder="请输入标签名称 例：18年度评优"
														  style={{ width: '100%', marginRight: 8 }}
														  onChange={this.tagnamechange.bind(this,index)}
														  disabled={disabled}
														//   value={item.name}
													  />
												  )}
											  </FormItem>
										  </Col>
										  <Col span={12}>
											  <FormItem  required={false}>
												  {getFieldDecorator(`content[${index}]`, {
													  validateTrigger: [ 'onChange', 'onBlur' ],
													  initialValue: item.content === ''? undefined: item.content ,
													  rules: [
														  {
															  required: true,
															  whitespace: true,
															  message: '请输入'
														  }
													  ]
												  })(
													  <Input
														  placeholder="请输入标签内容 例：获得2018年度优秀奖"
														  style={{ width: '90%', marginRight: 8 }}
                                                          onChange={this.tagcontentchange.bind(this,index)}
														  disabled={disabled}
														//   value={item.content}
													  />
												  )}
												  <Icon
													  className="dynamic-delete-button"
													  type="minus-circle-o"
													  disabled={disabled}
													  onClick={this.removetags.bind(this,index)}
												  />
											  </FormItem>
										  </Col>
										  </Row>
									})}
                                    <Button
									    disabled={disabled}
									    type="dashed"
									    onClick={this.addtags.bind(this)}
									    style={{ width: '80%' }}
											>
										<Icon type="plus" /> 增加标签
									</Button>
									</FormItem>
								</Col>
							</Row>
						</Form>
					</div>
					<div className="information-left">
						<img className="person-img" src={getImg(imgPath)} />
						<Upload {...props} showUploadList={false}>
							<Button disabled={disabled}>
								<Icon type="upload" /> 更换头像
							</Button>
						</Upload>
					</div>
				</div>
				<div className="department-main" style={{ marginBottom: '15px' }}>
					<div className="department-item2">
						<h3 className="detail-title">班级信息</h3>
						<div className="item-con">
							<Form>
								<Row gutter={24}>
									{/* <Col span={3} className="depart-text" style={{ textAlign: 'right' }}>
										<p>
											<span className="star">*</span>部门 :
										</p>
									</Col> */}
                                    <Col span={14}>
                                       <FormItem {...formItemLayout5} label="部门" required={true}>
									   <DepartmentSelect
											isEdit={disabled}
											getDepartmentId={this.getDepartmentId.bind(this)}
											data={this.state.departmentId}
										/>
										</FormItem>
									</Col>
									<Col span={5}>
										<Button type="primary" onClick={this.goto.bind(this, 1)} disabled={disabled}>
											部门管理
										</Button>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={15}>
										<FormItem {...formItemLayout5} label="管理者">
											{getFieldDecorator('isManager', {
												initialValue: (type == 2 && detailList && detailList.isManager) || '0',
												rules: [ { required: true, whitespace: true } ]
											})(
												<RadioGroup disabled={disabled}>
													<Radio value="1">是</Radio>
													<Radio value="0">否</Radio>
												</RadioGroup>
											)}
										</FormItem>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={14}>
										<FormItem {...formItemLayout5} label="担任职务">
											<Select
												mode="multiple"
												filterOption={(input, option) =>
													option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
													0}
												placeholder="请选择"
												value={this.state.jobId}
												onChange={this.handleChange.bind(this)}
												style={{ width: '100%' }}
												disabled={disabled}
												allowClear
											>
												{children}
											</Select>
										</FormItem>
									</Col>
									<Col span={8}>
										<Button
											type="primary"
											style={{ marginTop: '4px' }}
											onClick={this.goto.bind(this, 2)}
											disabled={disabled}
										>
											职务管理
										</Button>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={24}>
										<FormItem {...formItemLayout6} label="所属班级" required>
											{teachingInfo &&
												teachingInfo.map((item, index) => {
													return (
														<Row className="belongClass">
														 <Col span={4}>
										                 <FormItem>
														  {getFieldDecorator(`gradeType[${index}]`,{ initialValue: item.gradeType===''?undefined :item.gradeType+''})(
															<Select
																placeholder="学业阶段"
																disabled={disabled}
																onChange={this.handleChange1.bind(this,index)}
																// allowClear
															>
																{/* <Option value="">全部</Option> */}
																<Option value="1">幼儿园</Option>
																<Option value="2">小学</Option>
																<Option value="3">初中</Option>
																<Option value="4">高中</Option>
															</Select>
															)}
															</FormItem>
							                             </Col>
														 <Col span={4}>
										                 <FormItem>
                                                          {getFieldDecorator(`gradeId${index}`, { initialValue: item.gradeId===''?undefined :item.gradeId+''})(
															<Select
																// showSearch
																placeholder="年级"
																// value={item.gradeId}
																// disabled={this.state[`disabled1${index}`]}
																disabled={disabled}
																onChange={this.gradeChange.bind(this,index)}
																// disabled={this.state.disabled1}
																// allowClear
															>
																{/* <Option value='' key=''>全部</Option> */}
																{options}
															</Select>
								                        	)}
															</FormItem>
							                             </Col>
														 <Col span={4}>
										                 <FormItem>
															{getFieldDecorator(`classId[${index}]`, { initialValue: item.classId===''?undefined :item.classId+'',
															})(
																<Select
																	// allowClear
																	placeholder="班级"
																	// showSearch
																    disabled={disabled}
																	// disabled={this.state.disabled2}
																	// value={item.classId?'':undefined}
																	onChange={this.classChange.bind(this,index)}
																>
																	{classOptions}
																</Select>
															)}
															</FormItem>
							                             </Col>
														 <Col span={4}>
										                 <FormItem>
                                                            {getFieldDecorator(`type[${index}]`,{ initialValue: item.type===''?undefined :item.type+'',
															})(
																<Select
																	placeholder="班级职务"
																	onChange={this.classJobChange.bind(this,index)}
																	style={{ width: '100%' }}
																	disabled={disabled}
																	// value={item.type?'':undefined}
																	allowClear
																>
																	<Option value="1">科任老师</Option>
																	<Option value="2">副班主任</Option>
																	<Option value="3">班主任</Option>
																	<Option value="4">导师</Option>
																</Select>
															)}
															</FormItem>
							                             </Col>
														 <Col span={4}>
										                 <FormItem>
															 {getFieldDecorator(`courseIds[${index}]`,{ initialValue:item.courseIds===[]?undefined :item.courseIds.map(String),
															 })(
															<Select
																mode="multiple"
																placeholder="学科"
																disabled={disabled}
																// showSearch
																allowClear
																// value={item.courseIds?'':undefined}
																onChange={this.courseIdsChange.bind(this,index)}
																filterOption={this.filterOption}
															>
																{subjectListoptions}
															</Select>
															)}
															</FormItem>
							                            </Col>

															<Icon
																onClick={!disabled&&this.delete.bind(this, index)}
																className="del-icon"
																type="minus-circle-o"
															/>
														</Row>
													);
												})}
											<Button
												disabled={disabled}
												type="dashed"
												onClick={this.add.bind(this)}
												style={{ width: '80%' }}
											>
												<Icon type="plus" /> 增加班级
											</Button>
										</FormItem>
									</Col>
								</Row>
							</Form>
						</div>
					</div>
				</div>
				{Number(type) === 2 && detailList && detailList.operateLogs && detailList.operateLogs.length > 0 ? (
					<div className="step-contents">
						<StepIndex data={detailList && detailList.operateLogs} />
					</div>
				) : null}
				{/* <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} edit={edit} controlBtn={controlBtn} /> */}
				<div className="common-bottom-btns">
					<Col span={24} style={{ textAlign: 'center' }}>
						<Button
							type="primary"
							onClick={this.submitBtn.bind(this)}
							className={this.state.clickSubmit ? 'inlineblock' : 'none'}
						>
							提交
						</Button>
						<Button
							onClick={this.cancleBtn.bind(this)}
							style={{ margin: '0 20px' }}
							className={this.state.clickCancle ? 'inlineblock' : 'none'}
						>
							取消
						</Button>
					</Col>
					{Number(type) === 2 && this.state.editShow ? (
						<Col offset={22} span={2}>
							<Button type="primary" onClick={this.editBtn.bind(this)}>
								编辑
							</Button>
						</Col>
					) : null}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		jobList: state.user.commonJobList,
		classData: state.user.classByGrade,
		commonData: state.user,
		gradeList: state.user.gradeNameData
	};
};

export default connect(mapStateToProps)(Form.create()(TeacherDetail));
