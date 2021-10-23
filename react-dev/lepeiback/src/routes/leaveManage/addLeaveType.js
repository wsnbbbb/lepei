import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col, Checkbox, message, Breadcrumb, Tooltip, Icon, Radio } from 'antd';
import { routerRedux, Link } from 'dva/router';
import BottomBtns from '../../components/bottom-btns';
import LeaveRule from '../../components/leaveRule';
import { getQueryString } from '../../utils/public';
import './style.less';
import param from '../../utils/param';

const FormItem = Form.Item;
const { TextArea } = Input;

class AddLeaveType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false,
			disabled: true,
			category: 0,
			title: '添加请假类型',
			title1: '编辑请假类型'
		};
	}
	componentDidMount = () => {
		const type = getQueryString('type');
		if (type == 2) {
			const id = getQueryString('id');
			this.props.dispatch({
				type: 'leave/getLeaveTypeDetail',
				payload: { id: id },
				callback: (res) => {
					console.log(res);
					if (res.code === 200) {
						this.setState({ category: res.data.category });
						if (res.data && res.data.approval_rules && JSON.parse(res.data.approval_rules).length > 0) {
							this.setState({ checked: true });
						} else {
							this.setState({ checked: false });
						}
					}
				}
			});
		} else {
			this.setState({ disabled: false });
		}

		if (type == 2) {
			//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title1,
					parentRoute: '/leave-manage'
				}
			});
		} else {
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title,
					parentRoute: '/leave-manage'
				}
			});
		}
	};

  componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }

	goto = (id) => {
		this.props.dispatch(routerRedux.push('/examine-rules'));
	};
	onChange = (e) => {
		this.setState({ checked: e.target.checked });
		console.log(`checked = ${e.target.checked}`);
	};
	getBtnDate = (data) => {
		console.log(data);
		const type = getQueryString('type');
		if (data === 'edit') {
			this.setState({ disabled: false });
		} else if (data === 'cancel') {
			this.props.history.push('/leave-type');
		} else if (data === 'submit') {
			const id = getQueryString('id');
			this.props.form.validateFields((err, values) => {
				if (!values.name) {
					return message.error('请输入类型名称', 2);
				}
				if (this.state.checked) {
					const rulesData = this.handlerChild.handleSubmit();
					console.log(rulesData);
					// if(rulesData&&rulesData[0].length>0&&rulesData[0][0].start!='0'){
					//   return message.error("假期长度的起始时间是0",2)
					// }
					if (rulesData && rulesData[0].length > 0) {
						let flag = true;
						rulesData[0].map((item) => {
							if (Number(item.start) > Number(item.end)) {
								return (flag = false);
							}
						});
						if (!flag) {
							return message.error('假期结束时间应大于开始时间', 3);
						}
					}
					if (rulesData && rulesData[0].length > 1) {
						for (var i = 0; i <= rulesData[0].length; i++) {
							if (i != rulesData[0].length - 1 && i != rulesData[0].length) {
								if (rulesData[0][i].end != rulesData[0][i + 1].start) {
									return message.error('上一个假期长度的结束时间是下一个假期长度的开始时间', 4);
								}
							}
						}
					}

					if (rulesData[1]) {
						const params = {
							name: values.name,
							intro: values.intro,
							approvalRules: rulesData[0] || '',
							category: this.state.category
						};
						console.log(params);
						this.props.dispatch({
							type: type == 1 ? 'leave/addLeaveType' : 'leave/updateLeaveType',
							payload: type == 1 ? params : { typeId: id, ...params },
							callback: (res) => {
								console.log(res);
								if (res.code === 200) {
									const text = type == 1 ? '创建请假类型成功' : '更新请假类型成功';
									message.success(text, 2);
									this.props.dispatch(routerRedux.push('/leave-type'));
								}
							}
						});
					}
				} else {
					const params = { name: values.name, intro: values.intro, category: this.state.category };
					this.props.dispatch({
						type: type == 1 ? 'leave/addLeaveType' : 'leave/updateLeaveType',
						payload: type == 1 ? params : { typeId: id, ...params },
						callback: (res) => {
							console.log(res);
							if (res.code === 200) {
								const text = type == 1 ? '创建请假类型成功' : '更新请假类型成功';
								message.success(text, 2);
								this.props.dispatch(routerRedux.push('/leave-type'));
							}
						}
					});
				}
			});
		}
	};
	handlerRef = (ref) => {
		this.handlerChild = ref;
	};

	editIsIll = (e) => {
		this.setState({
			category: e.target.value
		});
	};

	render() {
		const type = getQueryString('type');
		const { checked, disabled } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 9 },
			wrapperCol: { span: 15 }
		};
		const { leaveTypeDetail } = this.props;
		// console.log(this.props.leaveTypeDetail)
		return (
			<div className="leave-main content-main">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>学校管理</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/leave-type">请假类型管理</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>{type == 1 ? '添加请假类型' : '查看请假类型'}</Breadcrumb.Item>
					</Breadcrumb>
				</div> */}
				<p className="tip">基础资料</p>
				<Form className="ant-advanced-search-form content-form">
					<Row gutter={24}>
						<Col span={12}>
							<FormItem {...formItemLayout} label={'类型名称'}>
								{getFieldDecorator('name', {
									initialValue: (type == 2 && leaveTypeDetail && leaveTypeDetail.name) || '',
									rules: [ { required: true, message: '请输入类型名称' } ]
								})(<Input disabled={disabled} placeholder="请输入类型名称" maxLength="20" />)}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<FormItem {...formItemLayout} label={'类型简介'}>
								{getFieldDecorator('intro', {
									initialValue: (type == 2 && leaveTypeDetail && leaveTypeDetail.intro) || ''
								})(<TextArea disabled={disabled} placeholder="请输入类型简介" autosize={{ minRows: 3 }} />)}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<FormItem {...formItemLayout} label={'所属分类'}>
								<Radio.Group
									value={this.state.category}
									disabled={disabled}
									onChange={this.editIsIll.bind(this)}
								>
									<Radio value={1}>病假</Radio>
									<Radio value={0}>事假</Radio>
									<Radio value={2}>其他</Radio>
								</Radio.Group>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<p className="tip" style={{ marginBottom: 20 }}>
					审批规则&nbsp;&nbsp;&nbsp;&nbsp;{' '}
					<Checkbox disabled={disabled} checked={this.state.checked} onChange={this.onChange}>
						指定审批规则
					</Checkbox>
					{checked ? null : (
						<Tooltip placement="bottom" title="未指定规则，审批人由申请人指定">
							<Icon type="question-circle" />
						</Tooltip>
					)}
				</p>
				{checked ? (
					<div>
						<LeaveRule onHandlerRef={this.handlerRef.bind(this)} disabled={disabled} />
						<div className="go-manage">
							未找到审批规则？<span className="last" style={{ cursor: 'pointer' }} onClick={this.goto.bind(this)}>
								前往审批规则管理>>
							</span>
						</div>
						<p style={{ color: '#f00' }}>注：上一个假期长度的结束时间是下一个假期长度的开始时间</p>
					</div>
				) : null}
				<BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} />
			</div>
		);
	}
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
	return {
		leaveTypeDetail: state.leave.leaveTypeDetail
	};
};
export default connect(mapStateToProps)(Form.create()(AddLeaveType));
