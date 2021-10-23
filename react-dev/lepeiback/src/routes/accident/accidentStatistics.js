import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Radio, DatePicker, Select } from 'antd';
import { getDays, onlyDate, toTimestamp, getCategory } from '../../utils/public';
import echarts from 'echarts';
import moment from 'moment';
import './style.less';
import { log } from 'util';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class accidentStatistics extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disabled: true,
			disabled1: true,
			typeId: '',
			accidentTypesList: [],
			data: []
		};
	}
	componentDidMount = () => {
		// this.props.dispatch({
		// 	type: 'user/getCommonGradeList'
		// });
		const params = {
			typeId: this.state.typeId
		};
		const pieParams = {
			startTime: '',
			endTime: '',
			gradeId: '',
			classIds: ''
		};
		this.getAllListByCategory();
		this.getBarData(params);
		this.getPieData(pieParams);
	};

	//获取事件类型
	getAllListByCategory = () => {
		let params = { id: 1 };
		this.props.dispatch({
			type: 'accidentStatistics/getAllListByCategory',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code == 200) {
					this.setState({
						accidentTypesList: res.data
					});
				}
			}
		});
	};

	// 获取柱状图
	getBarData = (params) => {
		this.props.dispatch({
			type: 'accidentStatistics/getMonthlyEvents',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code === 200) {
					let xData = [];
					let yData = [];
					res.data &&
						res.data.length > 0 &&
						res.data.map((item) => {
							xData.push(item.time);
							yData.push(item.count);
						});
					const myChart = echarts.init(document.getElementById('barCharts'));
					myChart.setOption({
						title: {
							text: '事件总数'
						},
						color: [ '#3398DB' ],
						tooltip: {
							formatter: '{a} ：{c}<br/>{b}'
						},
						// legend: {
						// 	type: 'plain'
						// },
						xAxis: {
							name: '月份',
							data: xData,
							axisTick: {
								alignWithLabel: true
							}
						},
						yAxis: {
							name: '次数'
						},
						series: [
							{
								name: '次数',
								type: 'bar',
								data: yData
							}
						]
					});
				}
			}
		});
	};
	// 获取饼状图
	getPieData = (params) => {
		this.props.dispatch({
			type: 'accidentStatistics/getEventsBySearch',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code == 200) {
					this.setState({
						data: res.data
					});

					res.data &&
						res.data.map((item, index) => {
							let newdata = [];
							item.types.map((j) => {
								let a = {};
								a.value = j.count;
								a.name = j.name;
								newdata.push(a);
							});
							let series = [];
							let b = { type: 'pie', radius: '50%' };
							b.name = getCategory(item.category);
							b.data = newdata;
							b.label = {
								normal: {
									formatter: '{b} {d}%'
								}
							};
							series.push(b);
							// console.log(series)
							let color = [];
							if (index === 0) {
								color = [ '#8ec060', '#47A474', '#008D89', '#006D94', '#73c0de', '#3ba272' ];
							}
							if (index === 1) {
								color = [ '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272' ];
							}
							if (index === 2) {
								color = [ '#fc8452', '#9a60b4', '#ea7ccc', '#ff4d4f', '#ff7a45', '#d46b08' ];
							}
							if (index === 3) {
								color = [ '#a0d911', '#73d13d', '#36cfc9', '#1890ff', '#597ef7', '#9254de' ];
							}
							if (index === 4) {
								color = [ '#9254de', '#f759ab', '#ff7a45', '#d46b08', '#ffc53d', '#fadb14' ];
							}
							if (index === 5) {
								color = [ '#3ba272', '#8ec060', '#fac858', '#ea7ccc', '#73d13d', '#f759ab' ];
							}
							const myChart = echarts.init(document.getElementById(`pieCharts${index}`));
							myChart.setOption({
								title: {
									text: getCategory(item.category),
									left: 'center'
								},
								tooltip: {
									formatter: '{a} <br/>{b}: {c} ({d}%)'
								},
								legend: {
									orient: 'vertical',
									left: 'right'
								},
								series: series,
								color: color
							});
						});
				}
			}
		});
	};

	handleChange2 = (value) => {
		console.log(value);
		const params = {
			typeId: value
		};
		this.getBarData(params);
	};

	// 查询
	search = () => {
		this.props.form.validateFields((err, values) => {
			console.log(values);
			const params = {
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				classIds: (values.classId && values.classId.toString()) || '',
				startTime:
					(values.time && values.time[0] && toTimestamp(moment(values.time[0]).format('YYYY-MM-DD'), true)) ||
					'',
				endTime:
					(values.time && values.time[1] && toTimestamp(moment(values.time[1]).format('YYYY-MM-DD'))) || ''
			};
			console.log(params);
			this.getPieData(params);
		});
	};
	// 重置
	reset = () => {
		this.props.form.resetFields();
		this.setState({
			disabled: true
		});
	};
	  //学业阶段选择
	  handleChange1=(value)=>{
		if (value) {
		  this.setState({ disabled1: false })
		  this.props.dispatch({
			type: 'user/getGradeName',
			payload: { "type": value },
		  })
		  this.props.form.resetFields(["gradeId","classId"])
		} else {
		  this.setState({
			disabled1: true,
		  })
		}
		
		this.setState({
		  classValue: '',
		  classId: '',
		  disabled: true,
		})
		
	  }
	  //年级选择
	  gradeChange=(val)=>{
		if (val) {
		  this.setState({ disabled: false })
		  const id = val
		  this.props.dispatch({
			type: 'user/getClassName',
			payload: { "gradeId": id },
			callback: (res) => {
			  if (res.code === 200) {
				this.setState({ classId: '' })
			  }
			}
		  })
		this.props.form.resetFields(["classId"])
		} else {
			this.setState({ classId: '', disabled: true })
		}
	  }

	render() {
		const { getFieldDecorator } = this.props.form;
		const { disabled, accidentTypesList, data } = this.state;
		const {commonData,gradeList}=this.props
		let options1 = [];
		accidentTypesList &&
			accidentTypesList.map((item) => {
				return options1.push(
					<Option key={item.id} value={item.id}>
						{item.name}
					</Option>
				);
			});

			let options = []
			gradeList && gradeList.length > 0 && gradeList.map(item => {
			  return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
			})
			let classOptions = [];
			commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
			  return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
			})

		let charts = [];
		data &&
			data.length > 0 &&
			data.map((item, index) => {
				charts.push(<div id={'pieCharts' + index} style={{ width: '30%', height: '50%' }} />);
			});
		return (
			<div className="leave-main content-main">
				<Form className="ant-advanced-search-form content-form">
					<Row gutter={24}>
						<Col offset={18} span={5}>
							<FormItem>
								{getFieldDecorator('typeId', { initialValue: undefined })(
									<Select
										showSearch
										placeholder="全部(请选择事件类型)"
										onChange={this.handleChange2.bind(this)}
										allowClear
									>
										{/* <Option value="" key="">
											全部(请选择事件类型)
										</Option> */}
										{options1}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>

				<div id="barCharts" style={{ width: '96%', height: 400 }} />

				<Form className="ant-advanced-search-form content-form">
					<Row gutter={24}>
						<Col span={7}>
							<FormItem>
								{getFieldDecorator('time')(<RangePicker allowClear format={'YYYY/MM/DD'} />)}
							</FormItem>
						</Col>
						<Col span={4}>
								<FormItem  placeholder="学业阶段">
									{getFieldDecorator('gradeType', { initialValue: undefined })(
										<Select placeholder="学业阶段" onChange={this.handleChange1.bind(this)} allowClear> 
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
								<FormItem  placeholder="年级">
									{getFieldDecorator('gradeId', { initialValue: undefined })(
										<Select
											showSearch
											placeholder="年级"
											onChange={this.gradeChange.bind(this)}
											disabled={this.state.disabled1}
											allowClear
										>
											{/* <Option value='' key=''>全部</Option> */}
											{options}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem placeholder="班级">
									{getFieldDecorator('classId')(
										<Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
											{classOptions}
										</Select>
									)}
								</FormItem>
							</Col>
						<Col span={5}>
							<Button type="primary" onClick={this.search.bind(this)}>
								查询
							</Button>&emsp;
							<Button onClick={this.reset.bind(this)}>重置</Button>
						</Col>
					</Row>
				</Form>
				<div className="charts-box">{charts}</div>
			</div>
		);
	}
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
	return {
		commonData: state.user,
        gradeList: state.user.gradeNameData
	};
};
export default connect(mapStateToProps)(Form.create()(accidentStatistics));
