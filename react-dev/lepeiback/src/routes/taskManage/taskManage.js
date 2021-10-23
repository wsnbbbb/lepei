import React, { Component } from 'react';
import { connect } from 'dva';
import {
	Table,
	Button,
	Input,
	Select,
	Form,
	Row,
	Col,
	Icon,
	Breadcrumb,
	Modal,
	message,
	DatePicker,
	Drawer,
	Checkbox,
	Upload,
	Typography
} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { formatDate } from '../../utils/public';
import './style.less';
import moment from 'moment';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

class taskManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			prePage: 20,
			taskList: [], //列表数据
			disabled: true,
			disabled1: true,
			subjectList:[],
		};
	}
	componentDidMount = () => {
		const params = {
			page: 1,
			prePage: 20
		};
		this.getSubject()
		this.getList(params);
	};
	// 获取记录列表
	getList = (params) => {
		this.props.dispatch({
			type: 'jobManage/getTaskList',
			payload: params,
			callback: (res) => {
				console.log(res)
				if (res.code == 200) {
					this.setState({
						taskList: res.data
					});
				}
			}
		});
	};
    //获取学科
	getSubject(){
		let params={'type':'1'}
		this.props.dispatch({
			type: 'jobManage/getAllSubject',
			payload: params,
			callback: (res) => {
				console.log(res)
				if (res.code == 200) {
					this.setState({
						subjectList: res.data
					});
				}
			}
		});
	};

	// 重置
	reset = () => {
		this.props.form.resetFields();
		this.setState({
			disabled: true,
			disabled1: true,
		})
	};

	// 查询
	search = () => {
		this.props.form.validateFields((err, values) => {
			const params = {
				page: 1,
				prePage: this.state.prePage,
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				subjectId: values.subjectId || '',
				classId:values.classId || '',
			};
			console.log(params)
			this.getList(params);
			this.setState({ page: 1 });
		});
	};
	// 删除
	showConfirm = (id) => {
		let me = this;
		confirm({
			title: '提示',
			content: <span>确定要删除这条信息吗？</span>,
			onOk() {
				me.props.dispatch({
					type: 'jobManage/delTaskList',
					payload: { id: id },
					callback: (res) => {
						if (res.code === 200) {
							message.success('删除成功！');
							me.props.form.validateFields((err, values) => {
								const params = {
									page: me.state.page,
									prePage: me.state.prePage,
									gradeType: values.gradeType || '',
				                    gradeId: values.gradeId || '',
				                    subjectId: values.subjectId || '',
				                    classId:values.classId || '',
								};
								me.getList(params);
							});
						}
					}
				});
			},
			onCancel() {}
		});
	};

	// 分页
	onPageChange = (current, size) => {
		this.props.form.validateFields((err, values) => {
			this.setState({ page: current, prePage: size });
			const params = {
				page: current,
				prePage: size,
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				subjectId: values.subjectId || '',
				classId:values.classId || '',
			};
			this.getList(params);
		});
	};
	//跳转详情
	toDetail = (id) => {
		this.props.dispatch(routerRedux.push('/task-detail?id=' + id));
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
		const {commonData,gradeList}=this.props
		const columns = [
			{
				title: '编号',
				dataIndex: 'id',
				width: 100
			},
			{
				title: '发布人',
				dataIndex: 'publisherName',
				width: 100,				
			},
			{
				title: '班级',
				dataIndex: 'className',
				width: 150
			},
			// {
			// 	title: '班级',
			// 	dataIndex: 'className1'
			// },
			{
				title: '学科',
				dataIndex: 'subjectName',
				width: 100,				
			},
			{
				title: '添加时间',
				dataIndex: 'createTime',
				width: 150,	
				render: (record) => {
					return <span>{formatDate(record)}</span>;
				}			
			},
			{
				title: '操作',
				dataIndex: '',
				width: 200,
				fixed: 'right',
				render: (text, record) => (
					<span className="make-box">
						<a  onClick={this.toDetail.bind(this, record.id)}>
							查看&emsp;
						</a>
						<a
							onClick={this.showConfirm.bind(this, record.id)}
							style={{ color: 'red' }}
						>
							删除
						</a>
					</span>
				)
			}
		];
		const {
			taskList,
			subjectList
		} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 17 }
		};

		let options = []
		gradeList && gradeList.length > 0 && gradeList.map(item => {
		  return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
		})
		let classOptions = [];
		commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
		  return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
		})

		let subjectListoptions=[]
        subjectList && subjectList.map(item => {
			return subjectListoptions.push(<Option key={item.subjectId} value={item.subjectId}>{item.subjectName}</Option>)
		  })
		return (
			<div className="visitRegister">
				<div className="content-main">
					<Form className="content-form">
						<Row gutter={24}>
							<Col span={5}>
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
							<Col span={5}>
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
							<Col span={5}>
								<FormItem placeholder="班级">
									{getFieldDecorator('classId')(
										<Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
											{classOptions}
										</Select>
									)}
								</FormItem>
							</Col>

							<Col span={5}>
								<FormItem  placeholder="学科">
									{getFieldDecorator('subjectId', { initialValue: undefined })(
										<Select placeholder="学科" showSearch allowClear>
											{subjectListoptions}
										</Select>
									)}
								</FormItem>
							</Col>

							<Col span={4} style={{ textAlign: 'right', paddingRight: '20px' }}>
								<Button type="primary" onClick={this.search.bind(this)}>
									查询
								</Button>&emsp;
								<Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
							</Col>
						</Row>

					</Form>
					<Table
						className="content-table"
						scroll={{ x: 1000 }}
						columns={columns}
						dataSource={taskList.dataList}
						pagination={false}
					/>
					<PageIndex
						getPage={this.onPageChange.bind(this)}
						total={taskList.totalCount}
						totalPage={taskList.totalPage}
						currentPage={taskList.currentPage}
					/>
				</div>
			
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		commonData: state.user,
        gradeList: state.user.gradeNameData
	};
};
export default connect(mapStateToProps)(Form.create()(taskManage));
