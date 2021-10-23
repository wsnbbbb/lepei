import React, { Component } from 'react';
import { connect } from 'dva';
// import {Link} from 'dva/router';
import moment from 'moment';
import {
	Table,
	Button,
	Input,
	Form,
	Row,
	Col,
	Steps,
	Icon,
	Modal,
	DatePicker,
	message,
	Tree,
	Breadcrumb,
	Divider,
	Select
} from 'antd';

import { getQueryString,onlyDate } from '../../utils/public';
import './style.less';
import { Link } from 'dva/router';
import { topdf } from '../../utils/topdf';

const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;
// const { TextArea } = Input;
const TextArea = Input.TextArea;
const { RangePicker } = DatePicker;
// const TreeNode = TreeSelect.TreeNode;

class visitRegisterDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			detail: {},
			fatherInfo: {},//父亲信息
			motherInfo: {},//母亲信息
			siblingsInfo: [],//兄弟姐妹信息
			relateInfo: [],//相关信息
			academicBackground: [],//学业背景
			previewVisible: false,
			payDate:'',//缴费时间
			title:'详情'
		};
	}
	componentDidMount = () => {
		this.getDetail();
		this.props.dispatch({
			type: 'user/setLastRoute',
			payload: {
			  breadcrumbTitle:this.state.title,
			  parentRoute:"/entrance-apply"
			},
		})
	};

	componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }
	//获取详情
	getDetail = () => {
		this.props.dispatch({
			type: 'consultEntrance/entranceApplyDetail',
			payload: { id: getQueryString('id') },
			callback: (res) => {
				if (res.code === 200) {
					this.setState({
						detail: res.data,
						fatherInfo: res.data.fatherInfo,
						motherInfo: res.data.motherInfo,
						siblingsInfo: res.data.siblingsInfo,
						relateInfo: res.data.relateInfo,
						id: res.data.id,
						academicBackground: res.data.academicBackground
					});
				}
			}
		});
	};

	//导出pdf
	topdf = () => {
		const title=this.state.detail.childName+'入学申请表'
		topdf(title, '#printBox', '.whole-node', 250);
	};
	//意见反馈输入
	onTextChange = ({ target: { value } }) => {
		this.setState({ value });
	};
	//保存
	save = () => {
		this.props.form.validateFields((err, values) => {
			console.log(values.payDate)
			const params={
			  "id":this.state.id||'',
			  "classInfo":values.classInfo,
			  "applicationNo":values.applicationNo,
			  "payDate":values.payDate && values.payDate.format('YYYY-MM-DD') || '',
			  "status":values.status,
			  "remark":values.remark,
			}
			 this.props.dispatch({
				type:'consultEntrance/saveTeacherHandle',
				payload:params,
				callback:(res) =>{
				  if(res.code == 200) {
					  message.success('保存成功')
				  }
				}
			  })
		  })
	};



	render() {
		const { value, detail, fatherInfo, motherInfo, siblingsInfo, relateInfo, academicBackground } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 15 },
			colon: false
		};
		const payDate= detail.payDate?moment(detail.payDate, "YYYY-MM-DD"):''
		return (
			<div className="entranceApplyDetail">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/entrance-apply">入学申请书</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>详情</Breadcrumb.Item>
					</Breadcrumb>
					<h3>详情</h3>
				</div> */}
				<div className="content-main">
					<Button type="primary" onClick={this.topdf.bind(this)}>
						生成PDF文件
					</Button>
					<div id="printBox">
						<div>
							<h3 className=" ">基础资料</h3>
							<div className="basicData">
								<div className="basicData-item  ">
									<p className="item-key">幼儿姓名</p>
									<p className="item-value">{detail.childName}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">昵称/英文名</p>
									<p className="item-value">{detail.nickName}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">性别</p>
									<p className="item-value">{detail.sex == 1 ?  '男' : detail.sex == 2 ? '女':''}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">出生日期</p>
									<p className="item-value">{detail.birthday}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">国籍</p>
									<p className="item-value">{detail.nationality}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">母语</p>
									<p className="item-value">{detail.motherTongue}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">家庭地址</p>
									<p className="item-value">{detail.homeAddress}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">身份证号码</p>
									<p className="item-value">{detail.idCardNo}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">联系电话</p>
									<p className="item-value">{detail.contactPhone}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">户籍类型</p>
									<p className="item-value">
										{detail.householdRegisterType == 1 ? (
											'本市户籍'
										) : detail.householdRegisterType == 2 ? (
											'非本市户籍'
										) : (
											''
										)}
									</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">户籍地址</p>
									<p className="item-value">{detail.householdRegisterAddress}</p>
								</div>
								{detail.householdRegisterType == 2 && (
									<div className="basicData-item  ">
										<p className="item-key">居住证号码</p>
										<p className="item-value">{detail.residencePermitNo}</p>
									</div>
								)}
								{detail.householdRegisterType == 1 && <div class="basicData-item  " />}
							</div>
						</div>
						<div>
							<h3 className="">家庭与监护人资料</h3>
							<div>
								<div>
									<Divider className=" ">父 亲</Divider>
									<div className="basicData paddingTop">
										<div className="basicData-item  ">
											<p className="item-key">姓名</p>
											<p className="item-value">{fatherInfo.name}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">国籍</p>
											<p className="item-value">{fatherInfo.nationality}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">出生日期</p>
											<p className="item-value">{fatherInfo.birthday}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">身份证号</p>
											<p className="item-value">{fatherInfo.idCardNo}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">联系电话</p>
											<p className="item-value">{fatherInfo.phone}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">母语</p>
											<p className="item-value">{fatherInfo.motherTongue}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">在家惯用语种</p>
											<p className="item-value">{fatherInfo.homeLanguage}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">电子邮件</p>
											<p className="item-value">{fatherInfo.email}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">在职单位与职位</p>
											<p className="item-value">{fatherInfo.currentWork}</p>
										</div>
									</div>
								</div>
								<div>
									<Divider className=" ">母 亲</Divider>
									<div className="basicData paddingTop">
										<div className="basicData-item  ">
											<p className="item-key">姓名</p>
											<p className="item-value">{motherInfo.name}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">国籍</p>
											<p className="item-value">{motherInfo.nationality}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">出生日期</p>
											<p className="item-value">{motherInfo.birthday}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">身份证号</p>
											<p className="item-value">{motherInfo.idCardNo}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">联系电话</p>
											<p className="item-value">{motherInfo.phone}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">母语</p>
											<p className="item-value">{motherInfo.motherTongue}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">在家惯用语种</p>
											<p className="item-value">{motherInfo.homeLanguage}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">电子邮件</p>
											<p className="item-value">{motherInfo.email}</p>
										</div>
										<div className="basicData-item  ">
											<p className="item-key">在职单位与职位</p>
											<p className="item-value">{motherInfo.currentWork}</p>
										</div>
									</div>
								</div>
								{siblingsInfo &&
									siblingsInfo.map((item) => {
										return (
											<div className="whole-node">
												<Divider className=" ">兄弟姐妹</Divider>
												<div className="basicData paddingTop">
													<div className="basicData-item  ">
														<p className="item-key">姓名</p>
														<p className="item-value">{item.name}</p>
													</div>
													<div className="basicData-item  ">
														<p className="item-key">性别</p>
														<p className="item-value">{item.sex == 1 ? '男' : '女'}</p>
													</div>
													<div className="basicData-item  ">
														<p className="item-key">年龄（周岁）</p>
														<p className="item-value">{item.age}</p>
													</div>
													<div className="basicData-item  ">
														<p className="item-key">就读学校</p>
														<p className="item-value">{item.school}</p>
													</div>
													<div className="basicData-item  ">
														<p className="item-key">备注说明</p>
														<p className="item-value">{item.remark}</p>
													</div>
													<div className="basicData-item " />
												</div>
											</div>
										);
									})}
							</div>
						</div>
						{academicBackground && (
							<div>
								<h3 className="">学业背景</h3>
								<div>
									{academicBackground && academicBackground.map((item) => {
											return (
												<div className='whole-node'>
													<Divider className=" ">学业背景</Divider>
													<div className="basicData paddingTop">
														<div className="basicData-item  ">
															<p className="item-key">起止时间</p>
															<p className="item-value">{item.startDate}~{item.endDate}</p>
														</div>
														<div className="basicData-item  ">
															<p className="item-key">就读早教/学校</p>
															<p className="item-value">{item.school}</p>
														</div>
														<div className="basicData-item  ">
															<p className="item-key">班级及授课语言</p>
															<p className="item-value">{item.teachingInfo}</p>
														</div>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						)}
					</div>
					<div className="teacher-op">
						<h3>教师操作</h3>
						<div className="operation">
							<Form className="content-form handle-form">
								<Row gutter={24}>
									<Col span={8}>
										<FormItem label="申请时间" {...formItemLayout}>
											{onlyDate(detail.submitTime)}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem label="分班信息" {...formItemLayout}>
											{getFieldDecorator('classInfo',{initialValue: detail.classInfo})(
												<Input allowClear placeholder="请填写" maxLength={30} />
											)}
										</FormItem>
									</Col>

									<Col span={8}>
										<FormItem label="申请编号" {...formItemLayout}>
											{getFieldDecorator('applicationNo',{initialValue: detail.applicationNo})(
												<Input allowClear placeholder="请填写" maxLength={30} />
											)}
										</FormItem>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={8}>
										<FormItem label="缴费日期" {...formItemLayout}>
											{getFieldDecorator('payDate',{initialValue: payDate})(<DatePicker allowClear format={'YYYY/MM/DD'}/>)}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem label="状态" {...formItemLayout}>
											{getFieldDecorator('status',{initialValue: detail.status})(
												<Select allowClear placeholder="待审核/已完成">
													<Option value={1}>待审核</Option>
													<Option value={2}>已完成</Option>
												</Select>
											)}
										</FormItem>
									</Col>
								</Row>
								<Row gutter={24}>
									{getFieldDecorator('remark',{initialValue: detail.remark})(
										<TextArea
											rows={4}
											placeholder="请输入参观反馈"
											className="feedback2"
											maxLength={500}
										/>
									)}
								</Row>
							</Form>
						</div>
					</div>
					<Row className="btn">
						<Button type="primary" onClick={this.save.bind(this)}>
							保存
						</Button>
					</Row>
				</div>
			</div>
		);
	}
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps)(Form.create()(visitRegisterDetail));
