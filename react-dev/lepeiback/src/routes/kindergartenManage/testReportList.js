import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Tooltip, Form, Row, Col, DatePicker, Breadcrumb, Modal, message } from 'antd';
import { Link } from 'dva/router';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { notSeconds, getQueryString } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class TestReportList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			prePage: 20,
			list: {},
			detailList: [],
			startTime: '',
			endTime: '',
			personId: getQueryString('personId'),
			reportType: getQueryString('type'),
			title: '测评报告',
			title1: '成长评估',
			title2: '给宝宝的话'
		};
	}
	componentDidMount = () => {
		const params = {
			personId: this.state.personId,
			reportType: this.state.reportType,
			page: 1,
			prePage: 20
		};
		this.getTestReportList(params);
		if (this.state.reportType == 1) {
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title,
					parentRoute: '/person-info-list'
				}
			});
		}
		if (this.state.reportType == 2) {
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title1,
					parentRoute: '/person-info-list'
				}
			});
		}
		if (this.state.reportType == 3) {
			this.props.dispatch({
				type: 'user/setLastRoute',
				payload: {
					breadcrumbTitle: this.state.title2,
					parentRoute: '/person-info-list'
				}
			});
		}
	};

	// 获取人员列表
	getTestReportList = (params) => {
		this.props.dispatch({
			type: 'kindergartenManage/getTestReportList',
			payload: params,
			callback: (res) => {
				if (res.code === 200) {
					this.setState({
						list: res.data,
						detailList: res.data.dataList
					});
				}
			}
		});
	};

	// 日期选择
	onTimeChange = (date, dateString) => {
		const start = dateString[0] + ' 00:00:00';
		const end = dateString[1] + ' 23:59:59';
		this.setState({
			startTime: new Date(start).getTime() / 1000,
			endTime: new Date(end).getTime() / 1000
		});
	};

	// 查询
	search = () => {
		const params = {
			page: 1,
			prePage: this.state.prePage,
			personId: this.state.personId,
			reportType: this.state.reportType,
			startTime: this.state.startTime,
			endTime: this.state.endTime
		};
		console.log({ params });
		this.getTestReportList(params);
	};

	// 分页
	onPageChange = (current, size) => {
		this.setState({ page: current, prePage: size });
		const params = {
			page: current,
			prePage: size,
			personId: this.state.personId,
			reportType: this.state.reportType,
			startTime: this.state.startTime,
			endTime: this.state.endTime
		};
		this.getTestReportList(params);
	};

	// 详情
	reportDetail = (id, type) => {
		this.props.dispatch(routerRedux.push('/test-report-detail?reportId=' + id + '&type=' + type));
	};

	// 删除
	delReport = (id) => {
		let that = this;
		confirm({
			title: '提示',
			content: <span>确定要删除这条信息吗？</span>,
			onOk() {
				that.props.dispatch({
					type: 'kindergartenManage/delTestReport',
					payload: { id: id },
					callback: (res) => {
						if (res.code === 200) {
							message.success('删除成功！');
							that.search();
						}
					}
				});
			},
			onCancel() {}
		});
	};

	render() {
		const { list, detailList, classData, personId, reportType } = this.state;
		const { getFieldDecorator } = this.props.form;

		const columns = [
			{
				title: '发布者',
				dataIndex: 'publisherName'
			},
			{
				title: '内容',
				dataIndex: 'content',
				onCell: () => {
					return {
						style: {
							maxWidth: 850,
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							display: 'inline-block',
							cursor: 'pointer'
						}
					};
				},
				render: (record) => (
					<Tooltip placement="top" title={record}>
						<span className="text">{record}</span>
					</Tooltip>
				)
			},
			{
				title: '时间',
				dataIndex: 'createTime',
				render: (record) => {
					return <span>{notSeconds(record)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: '',
				width: 150,
				fixed: 'right',
				render: (text, record) => (
					<span>
						<a href="javascript:;" onClick={this.reportDetail.bind(this, record.id, record.type)}>
							详情&emsp;
						</a>
						<a href="javascript:;" onClick={this.delReport.bind(this, record.id)}>
							删除
						</a>
					</span>
				)
			}
		];

		return (
			<div className="test-report-list content-main">
				{/* <Breadcrumb className="Breadcrumb">
					<Breadcrumb.Item>
						<Link to="/person-info-list">测评报告</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						{reportType == 1 ? '测评报告' : reportType == 2 ? '成长评估' : reportType == 3 ? '给宝宝的话' : ''}
					</Breadcrumb.Item>
				</Breadcrumb> */}
				<Form className="content-form">
					<Row gutter={24}>
						<Col span={6}>
							<FormItem>
								{getFieldDecorator('time')(<RangePicker onChange={this.onTimeChange} />)}
							</FormItem>
						</Col>
						<Col span={4}>
							<Button type="primary" onClick={this.search.bind(this)}>
								查询
							</Button>
						</Col>
					</Row>
				</Form>
				<Table
					className="content-table"
					scroll={{ x: 1000 }}
					columns={columns}
					dataSource={detailList}
					pagination={false}
				/>
				<PageIndex
					getPage={this.onPageChange.bind(this)}
					total={list.totalCount}
					totalPage={list.totalPage}
					currentPage={list.currentPage}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps)(Form.create()(TestReportList));
