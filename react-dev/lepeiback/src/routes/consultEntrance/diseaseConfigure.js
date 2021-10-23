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
    Radio,
	Typography
} from 'antd';
import PageIndex from '../../components/page';
import { Link } from 'dva/router';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;
const TextArea = Input.TextArea;


class diseaseConfigure extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			prePage: 20,
			diseasesList: [], //列表数据
			Visible: false, //抽屉
			assessId: '',//数据id
			detail:{//抽屉表单默认数据
				isAllowedRemark:1,
				additionalPrompt:'',
				name:'',
				status:1
			},
			title:'既往病史配置'
		};
	}
	componentDidMount = () => {
		const params = {
			page: 1,
			prePage: 20
		};
		this.getList(params);
		this.props.dispatch({
			type: 'user/setLastRoute',
			payload: {
			  breadcrumbTitle:this.state.title,
			  parentRoute:"/health-register"
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
	// 获取列表
	getList = (params) => {
		this.props.dispatch({
			type: 'consultEntrance/getDiseasesList',
			payload: params,
			callback: (res) => {
				if (res.code == 200) {
					this.setState({
						diseasesList: res.data
					});
				}
			}
		});
	};
	// 重置
	reset = () => {
		this.props.form.resetFields();
	};
	// 查询
	search = () => {
		this.props.form.validateFields((err, values) => {
			const params = {
				page: 1,
				prePage: this.state.prePage,
				kw: values.kw || '',
				status: values.status || ''
			};
			this.getList(params);
			this.setState({ page: 1 });
		});
	};

	// 分页
	onPageChange = (current, size) => {
		this.props.form.validateFields((err, values) => {
			this.setState({ page: current, prePage: size });
			const params = {
				page: current,
				prePage: size,
				kw: values.kw || '',
				status: values.status || ''
			};
			this.getList(params);
		});
	};

	// 关闭抽屉
	onClose = () => {
		this.setState({
			Visible: false,
			detail:{
				isAllowedRemark:1,
				additionalPrompt:'',
				name:'',
				status:1
			},
			assessId:''
		});
		this.props.form.resetFields();
	};

	// 保存
	save = () => {
			this.props.form.validateFields((err, values) => {
				if(values.name !==''){
					const params = {
						name:values.name||'',
						status:values.status1||'',
						isAllowedRemark:values.isRemark,
						additionalPrompt:values.remark||'',
					};
					const params1 = {
						page: 1,
						prePage: 20
					};
					if(this.state.assessId){
						params.id = this.state.assessId
					}
					this.props.dispatch({
						type: this.state.assessId ?'consultEntrance/editDiseasesDetailSave':'consultEntrance/addDiseases',
						payload: params,
						callback: (res) => {
							if (res.code == 200) {
								message.success('保存成功');
								this.setState({
									Visible: false,
									detail:{
										isAllowedRemark:1,
										additionalPrompt:'',
										name:'',
										status:1
									},
									assessId:''
								});
								this.getList(params1)
								this.props.form.resetFields();
							}
						}
					});
				}
			});
	};

	//添加。编辑
	add = (id) => {
		if (id) {
			this.props.dispatch({
				type: 'consultEntrance/diseasesDetail',
				payload: { id },
				callback: (res) => {
					if (res.code === 200) {
						this.setState({
							assessId: id,
							detail:res.data,
							Visible: true
						});
					}
				}
			});
		}
		else{
			this.setState({ 
				Visible: true ,
			    detail:{
					isAllowedRemark:0,
					additionalPrompt:'',
					name:'',
					status:1
				}
			});
		}
	};

	  // 删除
	showConfirm=(id)=> {
		let me=this;
		confirm({
		  title: '提示',
		  content: <span>确定要删除这条信息吗？</span>,
		  onOk() {
			me.props.dispatch({
			  type:'consultEntrance/delDiseasesList',
			  payload:{"id":id},
			  callback:(res)=>{
				if(res.code===200){
				  message.success('删除成功！')
				  me.props.form.validateFields((err, values) => {
					const params={
					  "page":me.state.page,
					  "prePage":me.state.prePage,
					  "kw":values.kw||'',
					  "status":values.status||'',
					}
					me.getList(params)
				  })
				}
			  }
			})
		  },
		  onCancel() {},
		});
	}

	render() {
		const columns = [
			{
				title: '疾病名称',
				dataIndex: 'name'
			},
			{
				title: '补充信息',
				dataIndex: 'additionalPrompt'
			},
			{
				title: '状态',
				dataIndex: 'status',
				render: (record) => {
					return <span style={{ color: record == 2 ? '#f00' : '' }}>{record == 1 ? '启用' : '禁用'}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: '',
				width: 120,
				fixed: 'right',
				render: (text, record) => (
					<span className="make-box">
						<a href="javascript:;" onClick={this.add.bind(this,record.id)}>编辑&emsp;</a>
						<a href="javascript:;" onClick={this.showConfirm.bind(this,record.id)}>删除</a>
					</span>
				)
			}
		];
		const {
			diseasesList,
			detail,
			assessId
		} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		};

		return (
			<div className="consultRegister">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/health-register">幼儿健康情况登记表</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>既往病史配置</Breadcrumb.Item>
					</Breadcrumb>
					<h3>既往病史配置</h3>
				</div> */}
				<div className="content-main">
					<Form className="content-form">
						<Row gutter={24}>
							<Col span={5}>
								<FormItem label="">
									{getFieldDecorator('kw')(<Input allowClear placeholder="疾病名称" />)}
								</FormItem>
							</Col>
							<Col span={5}>
							    <FormItem>
									{getFieldDecorator('status')(
										<Select allowClear placeholder="状态">
											<Option value="">全部</Option>
											<Option value={1}>启用</Option>
											<Option value={2}>禁用</Option>
										</Select>
									)}
								</FormItem>
							</Col>

							<Col span={13} style={{ textAlign: 'right' }}>
								<Button type="primary" onClick={this.search.bind(this)}>
									查询
								</Button>&emsp;
								<Button onClick={this.add.bind(this,'')}>添加</Button>
							</Col>
						</Row>
					</Form>
					<Table
						className="content-table"
						scroll={{ x: 1000 }}
						columns={columns}
						dataSource={diseasesList.dataList}
						pagination={false}
					/>
					<PageIndex
						getPage={this.onPageChange.bind(this)}
						total={diseasesList.totalCount}
						totalPage={diseasesList.totalPage}
						currentPage={diseasesList.currentPage}
					/>
				</div>
				<Drawer
					title={ assessId ? '编辑' : '添加'}
					placement="right"
					width="600"
					onClose={this.onClose}
					visible={this.state.Visible}
					className="consult-drawer"
				>
					<Form>
						<Row gutter={24}>
							<Col span={24}>
								<FormItem {...formItemLayout} label="名称">
									{getFieldDecorator('name', {
										initialValue: detail.name,
										rules: [ { required: true, message: '请输入名称' } ]
									})(<Input allowClear placeholder="请输入名称" maxLength={30}/>)}
								</FormItem>
							</Col>
							<Col span={24}>
								<FormItem {...formItemLayout} label="补充内容">
									{getFieldDecorator('isRemark', { initialValue: detail.isAllowedRemark==null?0:detail.isAllowedRemark })(
									  <Radio.Group >
                                        <Radio value={0}>不需要</Radio>
                                        <Radio value={1}>需要</Radio>
                                      </Radio.Group>
									)}
								</FormItem>
							</Col>
                            <Col span={24} offset={5}>
								<FormItem {...formItemLayout}>
									{getFieldDecorator('remark', { initialValue: detail.additionalPrompt })(
									   <TextArea
                                       rows={4}
                                       placeholder="请输入补充内容"
                                       className="feedback"
                                       maxLength={100}
                                      />
									)}
								</FormItem>
							</Col>
                            <Col span={24}>
								<FormItem {...formItemLayout} label="状态">
									{getFieldDecorator('status1', { initialValue: detail.status })(
									  <Radio.Group >
                                        <Radio value={1}>启用</Radio>
                                        <Radio value={2}>禁用</Radio>
                                      </Radio.Group>
									)}
								</FormItem>
							</Col>
						</Row>
					</Form>
					<div className="btns">
						<Button onClick={this.onClose} style={{ marginRight: 8 }}>
							取消
						</Button>
						<Button onClick={this.save} type="primary">
							保存
						</Button>
					</div>
				</Drawer>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};
export default connect(mapStateToProps)(Form.create()(diseaseConfigure));
