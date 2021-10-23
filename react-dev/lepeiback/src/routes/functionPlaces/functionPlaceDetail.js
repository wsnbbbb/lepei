import React, { Component } from 'react';
import { connect } from 'dva';
import {
	Breadcrumb,
	Tag,
	Tooltip,
	Row,
	TimePicker,
	Col,
	Button,
	Select,
	DatePicker,
	Form,
	Input,
	message,
	Radio,
	Upload,
	Icon,
	Modal
} from 'antd';
import { Link, routerRedux } from 'dva/router';
import { getQueryString, dateToTimestamp } from '../../utils/public';
import { getImg } from '../../utils/img';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './style.less';
import ImgCutter from '../../components/imgCutter';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
class functionPlaceDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: BraftEditor.createEditorState(null),
			imgPath: '',
			previewVisible: false,
			previewImage: '',
			fileList: [],
			imgs: [],
			oldImgs: [],
			cropVisible: false,
			imgPath1: '',
			schoolBrief: {},
			placeId: undefined,
			placeDisabled: true,
			ruleList: [],
			tags: [],
			inputVisible: false,
			inputValue: '',
			startTime: undefined,
			endTime: undefined,
			title: '功能室添加',
			title1: '功能室编辑'
		};
	}
	componentDidMount = () => {
		this.props.dispatch({
			type: 'user/getAllBuildings'
		});

		this.getApprovalRules();

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
		getQueryString('id') && this.getDetail();
		if (getQueryString('id')) {
			//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title1,
					parentRoute: '/place-list'
				}
			});
		} else {
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title,
					parentRoute: '/place-list'
				}
			});
		}
	};
	componentWillUnmount = () => {
		sessionStorage.removeItem('qiniuToken');
    this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	};

	getDetail = () => {
		this.props.dispatch({
			type: 'functionPlaces/getFunctionPlaceDetail',
			payload: {
				id: getQueryString('id')
			},
			callback: (res) => {
				if (res.code === 200) {
					let imgData = [];
					res.data.imgs.length > 0 &&
						res.data.imgs.map((item, index) => {
							imgData.push({
								uid: index + '~' + item,
								name: 'xxx.png',
								status: 'done',
								url: getImg(item)
							});
						});
					this.setState({
						oldImgs: res.data.imgs,
						fileList: imgData,
						tags: res.data.tags,
						placeId: res.data.placeId,
						startTime: res.data.availableStartTime,
						endTime: res.data.availableEndTime,
						placeDisabled: false
					});

					this.buildChange(res.data.buildId, 1);
					this.props.form.setFieldsValue({
						name: res.data.name,
						buildId: res.data.buildId,
						startTime: moment(res.data.availableStartTime, 'HH:mm:ss'),
						endTime: moment(res.data.availableEndTime, 'HH:mm:ss'),
						approvalRuleId:
							res.data.approvalRuleId && res.data.approvalRuleId != '0' ? res.data.approvalRuleId : '',
						needApproval:
							res.data.approvalRuleId == '' || res.data.approvalRuleId == '0' || !res.data.approvalRuleId
								? '1'
								: '0'
					});
				}
			}
		});
	};

	handleClose = (removedTag) => {
		const tags = this.state.tags.filter((tag) => tag !== removedTag);
		console.log(tags);
		this.setState({ tags });
	};

	showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	};

	handleInputChange = (e) => {
		this.setState({ inputValue: e.target.value });
	};

	handleInputConfirm = () => {
		const { inputValue } = this.state;
		let { tags } = this.state;
		if (inputValue && tags.indexOf(inputValue) === -1) {
			tags = [ ...tags, inputValue ];
		}
		console.log(tags);
		this.setState({
			tags,
			inputVisible: false,
			inputValue: ''
		});
	};

	saveInputRef = (input) => (this.input = input);

	getApprovalRules = () => {
		this.props.dispatch({
			type: 'functionPlaces/getPubApprovalRules',
			payload: {},
			callback: (res) => {
				if (res.code == 200) {
					this.setState({
						ruleList: res.data
					});
				}
			}
		});
	};

	buildChange = (val, type) => {
		if (type == 1) {
			this.props.dispatch({
				type: 'user/getAllPlacesByBuild',
				payload: { buildId: val }
			});
			return;
		}
		if (val) {
			this.props.dispatch({
				type: 'user/getAllPlacesByBuild',
				payload: { buildId: val }
			});
			this.setState({ placeId: undefined, placeDisabled: false });
		} else {
			this.setState({ placeId: undefined, placeDisabled: true });
		}
	};
	placeChange = (val) => {
		this.setState({ placeId: val });
	};

	back = () => {
		window.history.go(-1);
	};

	// 裁剪
	handleOk1 = (dataUrl) => {
		this.setState({
			cropVisible: false
		});
		this.blob = dataUrl;
	};
	// 裁剪取消
	handleCropCancel1 = () => {
		this.setState({
			cropVisible: false
		});
	};

	submit = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const params = {
					name: values.name,
					availableStartTime: values.startTime.format('HH:mm:ss'),
					availableEndTime: values.endTime.format('HH:mm:ss'),
					buildId: values.buildId,
					placeId: this.state.placeId,
					imgs: this.state.imgs.length > 0 ? this.state.imgs : this.state.oldImgs,
					tags: this.state.tags
				};
				if (
					values.approvalRuleId &&
					values.approvalRuleId != '0' &&
					this.props.form.getFieldValue('needApproval') == 0
				) {
					params.approvalRuleId = values.approvalRuleId;
				}
				if (getQueryString('id')) {
					params.id = getQueryString('id');
					this.props.dispatch({
						type: 'functionPlaces/updateFunctionPlaceDetail',
						payload: params,
						callback: (res) => {
							if (res.code === 200) {
								message.success('修改成功', 2);
								setTimeout(() => {
									window.history.go(-1);
								}, 1000);
							}
						}
					});
					return;
				}
				this.props.dispatch({
					type: 'functionPlaces/addFunctionPlaces',
					payload: params,
					callback: (res) => {
						if (res.code === 200) {
							message.success('添加成功', 2);
							setTimeout(() => {
								window.history.go(-1);
							}, 1000);
						}
					}
				});
			}
		});
	};

	beforeUpload = (file) => {
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
	};
	handleChange = (info) => {
		console.log(info);
		if (info.file.status !== 'uploading') {
			// console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} 上传成功！`);
			this.setState({ imgPath: info.file.response.id });
			console.log(info.file.response.id);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

	// 时间选择
	onChangeRange = (date, dateString) => {
		console.log({ dateString });
		this.setState({
			startTime: dateToTimestamp(dateString[0]),
			endTime: dateToTimestamp(dateString[1])
		});
	};

	myUploadFn = (param) => {
		const serverURL = 'https://upload.qiniup.com/';
		const xhr = new XMLHttpRequest();
		const fd = new FormData();

		const successFn = (response) => {
			// 假设服务端直接返回文件上传后的地址
			// 上传成功后调用param.success并传入上传后的文件地址
			param.success({
				url: getImg(JSON.parse(response.target.response).id),
				meta: {
					alt: '图片',
					loop: true, // 指定音视频是否循环播放
					autoPlay: true, // 指定音视频是否自动播放
					controls: true // 指定音视频是否显示控制栏
					// poster: 'http://xxx/xx.png', // 指定视频播放器的封面
				}
			});
		};

		const progressFn = (event) => {
			// 上传进度发生变化时调用param.progress
			param.progress(event.loaded / event.total * 100);
		};

		const errorFn = (response) => {
			// 上传发生错误时调用param.error
			param.error({
				msg: '上传失败.'
			});
		};

		xhr.upload.addEventListener('progress', progressFn, false);
		xhr.addEventListener('load', successFn, false);
		xhr.addEventListener('error', errorFn, false);
		xhr.addEventListener('abort', errorFn, false);

		const qiniuToken = sessionStorage.getItem('qiniuToken');
		fd.append('file', param.file);
		fd.append('token', qiniuToken);
		xhr.open('POST', serverURL, true);
		xhr.send(fd);
	};
	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true
		});
	};

	handleImgsChange = ({ fileList }) => {
		console.log(fileList);
		this.setState({ fileList });
		let imgs = [];
		fileList.length > 0 &&
			fileList.map((item) => {
				if (item.response && item.response.success) {
					imgs.push(item.response.id);
				} else {
					const uid = item.uid.split('~')[1];
					imgs.push(uid);
				}
			});
		this.setState({ imgs });
		console.log(imgs);
	};
	render() {
		const { placeDisabled, ruleList, tags, inputVisible, inputValue, startTime, endTime } = this.state;
		const { placeList } = this.props;

		const { getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 9 },
			wrapperCol: { span: 15 }
		};
		const formItemLayout2 = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 }
		};
		const { previewVisible, previewImage, fileList, cropVisible, cropSrc } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传</div>
			</div>
		);

		const { buildingList } = this.props;

		const ruleChildren = [];
		ruleList &&
			ruleList.map((item) => {
				return ruleChildren.push(<Select.Option key={item.ruleId}>{item.ruleName}</Select.Option>);
			});

		const buildChildren = [];
		buildingList &&
			buildingList.map((item) => {
				return buildChildren.push(<Select.Option key={item.id}>{item.name}</Select.Option>);
			});

		let placeChildren = [];
		placeList &&
			placeList.map((item) => {
				return placeChildren.push(<Select.Option key={item.id}>{item.name}</Select.Option>);
			});

		const qiniuToken = sessionStorage.getItem('qiniuToken');

		return (
			<div className="brief-main">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>功能室申请</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/place-list">功能室配置</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>功能室{getQueryString('id') ? '编辑' : '添加'}</Breadcrumb.Item>
					</Breadcrumb>
					<h3>功能室{getQueryString('id') ? '编辑' : '添加'}</h3>
				</div> */}
				<Form className="ant-advanced-search-form content-form">
					<Row gutter={24}>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'功能室名称'}>
								{getFieldDecorator('name', {
									rules: [ { required: true, message: '请输入功能室名称', whitespace: true } ]
								})(<Input maxLength={30} placeholder="功能室名称" />)}
							</FormItem>
						</Col>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'可使用开始时间'}>
								{getFieldDecorator('startTime', { rules: [ { required: true, message: '请选择开始时间' } ] })(
									<TimePicker placeholder="开始时间" />
								)}
							</FormItem>
						</Col>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'可使用结束时间'}>
								{getFieldDecorator('endTime', { rules: [ { required: true, message: '请选择结束时间' } ] })(
									<TimePicker placeholder="结束时间" />
								)}
							</FormItem>
						</Col>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'所属建筑'}>
								{getFieldDecorator('buildId', {
									rules: [
										{
											required: true,
											message: '请选择建筑',
											whitespace: true
										}
									]
								})(
									<Select
										placeholder="请选择建筑"
										optionFilterProp="children"
										onChange={this.buildChange}
										showSearch
									>
										{buildChildren}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'场所名称'}>
								<Select
									placeholder="请选择场所"
									optionFilterProp="children"
									onChange={this.placeChange}
									showSearch
									value={this.state.placeId}
									disabled={placeDisabled}
								>
									{placeChildren}
								</Select>
							</FormItem>
						</Col>
						<Col span={14}>
							<FormItem {...formItemLayout} label={'需要审批'}>
								{getFieldDecorator('needApproval', {
									initialValue: '1',
									rules: [ { required: true, message: '请选择', whitespace: true } ]
								})(
									<Radio.Group>
										<Radio value="0">是</Radio>
										<Radio value="1">否</Radio>
									</Radio.Group>
								)}
							</FormItem>
						</Col>

						<Col span={14} style={{ display: getFieldValue('needApproval') == 1 ? 'none' : 'block' }}>
							<FormItem {...formItemLayout} label={'审批规则'}>
								{getFieldDecorator('approvalRuleId', {
									rules: [
										{
											required: getFieldValue('needApproval') == 0,
											message: '请选择审批规则',
											whitespace: true
										}
									]
								})(
									<Select placeholder="请选择审批规则" optionFilterProp="children" showSearch>
										{ruleChildren}
									</Select>
								)}
							</FormItem>
						</Col>

						<Col span={20}>
							<FormItem {...formItemLayout2} label={'图片'}>
								{/* {getFieldDecorator("imgs",{initialValue:''})( */}
								<Upload
									action="https://upload.qiniup.com/"
									accept="image/jpg,image/jpeg,image/png"
									listType="picture-card"
									fileList={fileList}
									multiple={true}
									beforeUpload={this.beforeUpload}
									onPreview={this.handlePreview}
									onChange={this.handleImgsChange}
									data={{ token: qiniuToken ? qiniuToken : this.state.qiniuToken }}
								>
									{fileList.length >= 5 ? null : uploadButton}
								</Upload>
								<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="example" style={{ width: '100%' }} src={previewImage} />
								</Modal>
								{/* )} */}
							</FormItem>
						</Col>

						<Col span={20}>
							<FormItem {...formItemLayout2} label={'特点'}>
								<div>
									{tags.map((tag, index) => {
										const isLongTag = tag.length > 10;
										const tagElem = (
											<Tag key={tag} closable onClose={() => this.handleClose(tag)}>
												{isLongTag ? `${tag.slice(0, 20)}...` : tag}
											</Tag>
										);
										return isLongTag ? (
											<Tooltip title={tag} key={tag}>
												{tagElem}
											</Tooltip>
										) : (
											tagElem
										);
									})}
									{inputVisible && (
										<Input
											ref={this.saveInputRef}
											type="text"
											size="small"
											maxLength={10}
											style={{ width: 78 }}
											value={inputValue}
											onChange={this.handleInputChange}
											onBlur={this.handleInputConfirm}
											onPressEnter={this.handleInputConfirm}
										/>
									)}
									{!inputVisible &&
									tags.length < 10 && (
										<Tag
											onClick={this.showInput}
											style={{ background: '#fff', borderStyle: 'dashed' }}
										>
											<Icon type="plus" />新增
										</Tag>
									)}
								</div>
							</FormItem>
						</Col>
					</Row>

					<Row style={{ marginTop: 20 }}>
						<Col span={4} offset={10}>
							<Button onClick={this.back.bind(this)}>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
							<Button type="primary" onClick={this.submit.bind(this)}>
								确定
							</Button>
						</Col>
					</Row>
				</Form>
				<Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel1} width={600}>
					<ImgCutter aspectRatio={434 / 309} src={cropSrc} onOk={this.handleOk1} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		buildingList: state.user.buildingList,
		placeList: state.user.placeList
	};
};
export default connect(mapStateToProps)(Form.create()(functionPlaceDetail));
