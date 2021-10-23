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
import { formatDate, getSexType, getGradeType, defaultDate, getHealthStatus } from '../../utils/public';
import './style.less';
import moment from 'moment';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

class dailyHealthStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			prePage: 20,
			flag: false, //展开收起开关
			healthList: [], //列表数据
            Visible: false,//抽屉
			disabled: true,
			disabled1: true,
			subjectList: [],
            status:'',
			defaultDate1: defaultDate(new Date()),
            date:'',
            personId:''
		};
	}
	componentDidMount = () => {
		console.log(defaultDate(new Date()));
		const params = {
			page: 1,
			prePage: 20,
			date: defaultDate(new Date())
		};
		this.getList(params);
	};
	// 获取列表
	getList = (params) => {
		this.props.dispatch({
			type: 'dailyHealthStatus/getHealthStatusList',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code == 200) {
					this.setState({
						healthList: res.data
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
			console.log(values);
			const params = {
				page: 1,
				prePage: this.state.prePage,
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				classId: values.classId || '',
				date: (values.date && values.date.format('YYYY-MM-DD')) || '',
				healthStatus: values.healthStatus || '',
				kw: values.kw || ''
			};
			console.log(params);
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
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				classId: values.classId || '',
				date: (values.date && values.date.format('YYYY-MM-DD')) || '',
				healthStatus: values.healthStatus || '',
				kw: values.kw || ''
			};
			this.getList(params);
		});
	};
	//详情 编辑
	toDetail = (id, date) => {
        let params={
            "date":date,
            "personId":id
        }
        this.props.dispatch({
            type:'dailyHealthStatus/getHealthStatusDetail',
            payload: params,
            callback:(res) =>{
               console.log(res)
              if(res.code == 200) {
                this.setState({
                  status:res.data,
                  Visible:true,
                  date:date,
                  personId:id
                })
              }
            }
          })
    };

	//学业阶段选择
	handleChange1 = (value) => {
		if (value) {
			this.setState({ disabled1: false });
			this.props.dispatch({
				type: 'user/getGradeName',
				payload: { type: value }
			});
		} else {
			this.setState({
				disabled1: true
			});
		}
		this.props.form.resetFields([ 'gradeId', 'classId' ]);
		this.setState({
			classValue: '',
			classId: '',
			disabled: true
		});
	};
	//年级选择
	gradeChange = (val) => {
		if (val) {
			this.setState({ disabled: false });
			const id = val;
			this.props.dispatch({
				type: 'user/getClassName',
				payload: { gradeId: id },
				callback: (res) => {
					if (res.code === 200) {
						this.setState({ classId: '' });
					}
				}
			});
		} else {
			this.setState({ classId: '', disabled: true });
		}
		this.props.form.resetFields([ 'classId' ]);
	};

	// 展开/收起
	toggle = () => {
		this.setState(
			{
				flag: !this.state.flag
			},
			function() {
				if (this.state.flag) {
					this.setState({
						isShow: true
					});
				} else {
					this.setState({
						isShow: false
					});
				}
			}
		);
	};

  // 关闭抽屉
  onClose = () => {
    this.setState({
      Visible: false,
      fileList:[]
    })
    this.props.form.resetFields()
  };

      // 保存
      save = () =>{
        this.props.form.validateFields((err, values) => {
          if(values.status.length==0){
              message.error('请勾选健康状态')
          }else{
              const params={
                "date":this.state.date||'',
                "personId":this.state.personId || '',
                'status':values.status || []
              }
               console.log(params)
               this.props.dispatch({
                  type:'dailyHealthStatus/saveHealthStatus',
                  payload:params,
                  callback:(res) =>{
                      console.log(res)
                    if(res.code == 200) {
                        message.success('保存成功')
                        this.setState({
                          Visible: false,
						  status:''
                        })
                        this.props.form.resetFields(["status"])
						const params = {
							page: this.state.page,
							prePage: this.state.prePage,
							gradeType: values.gradeType || '',
							gradeId: values.gradeId || '',
							classId: values.classId || '',
							date: (values.date && values.date.format('YYYY-MM-DD')) || '',
							healthStatus: values.healthStatus || '',
							kw: values.kw || ''
						};
						console.log(params);
						this.getList(params);
                    }
                  }
                })
          }
        })
      }

	render() {
		const { commonData, gradeList } = this.props;
		const columns = [
			{
				title: '姓名',
				dataIndex: 'personName',
				width: 100
			},
			{
				title: '性别',
				dataIndex: 'sex',
				width: 100,
				render: (record) => {
					return <span>{getSexType(record)}</span>;
				}
			},
			{
				title: '学业阶段',
				dataIndex: 'gradeType',
				width: 150,
				render: (record) => {
					return <span>{getGradeType(record)}</span>;
				}
			},
			{
				title: '年级',
				dataIndex: 'gradeName',
                width: 150
			},
			{
				title: '班级',
				dataIndex: 'className',
				width: 150
			},
			{
				title: '健康状况',
				dataIndex: 'healthStatus',
				width: 150,
			},
			{
				title: '日期',
				dataIndex: 'date',
				width: 150
			},
			{
				title: '操作',
				dataIndex: '',
				width: 100,
				fixed: 'right',
				render: (text, record) => (
					<span className="make-box">
						<a onClick={this.toDetail.bind(this, record.personId, record.date)}>编辑&emsp;</a>
					</span>
				)
			}
		];
		const { healthList, subjectList, flag, isShow, defaultDate1 ,status} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		};

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
			<div className="visitRegister">
				<div className="content-main">
					<Form className="content-form">
						<Row gutter={24}>
							<Col span={5}>
								<FormItem label="">
									{getFieldDecorator('kw')(<Search allowClear placeholder="请输入姓名" />)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem placeholder="学业阶段">
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
								<FormItem placeholder="年级">
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

							<Col span={7} style={{ textAlign: 'right', paddingRight: '20px' }}>
								<Button type="primary" onClick={this.search.bind(this)}>
									查询
								</Button>&emsp;
								<Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
								<span className="cursor ftColor" onClick={this.toggle.bind(this)}>
									{this.state.flag ? '收起 ' : '展开 '}
									<Icon type={flag ? 'up' : 'down'} />
								</span>
							</Col>
						</Row>
						<Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
							<Col span={5}>
								<FormItem placeholder="健康状况">
									{getFieldDecorator('healthStatus')(
										<Select placeholder="健康状况" allowClear>
											{/* <Option value="">全部</Option> */}
											<Option value="1">健康</Option>
											<Option value="2">吃药</Option>
											<Option value="3">肠胃不适</Option>
											<Option value="4">外伤</Option>
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={5}>
								<FormItem placeholder="日期">
									{getFieldDecorator('date', { initialValue: moment(defaultDate1, 'YYYY/MM/DD') })(
										<DatePicker allowClear={false} placeholder="日期" format={'YYYY/MM/DD'} />
									)}
								</FormItem>
							</Col>
						</Row>
					</Form>
					<Table
						className="content-table"
						scroll={{ x: 1000 }}
						columns={columns}
						dataSource={healthList.dataList}
						pagination={false}
					/>
					<PageIndex
						getPage={this.onPageChange.bind(this)}
						total={healthList.totalCount}
						totalPage={healthList.totalPage}
						currentPage={healthList.currentPage}
					/>
				</div>
				<Drawer
					title="编辑"
					placement="right"
					width="600"
					onClose={this.onClose}
					visible={this.state.Visible}
					className="consult-drawer"
				>
					<Form>
						<Row gutter={24}>
							<Col span={24}>
								<Form.Item {...formItemLayout} label="每日健康状况">
									{getFieldDecorator('status', { initialValue: status })(
										<Checkbox.Group style={{ width: '100%' }} className="Checkbox">
											<Row>
												<Col span={10}>
													<Checkbox value={1}>健康</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox value={2}>吃药</Checkbox>
												</Col>
											</Row>
											<Row>
												<Col span={10}>
													<Checkbox value={3}>肠胃不适</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox value={4}>外伤</Checkbox>
												</Col>
											</Row>
										</Checkbox.Group>
									)}
								</Form.Item>
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
	return {
		commonData: state.user,
		gradeList: state.user.gradeNameData
	};
};
export default connect(mapStateToProps)(Form.create()(dailyHealthStatus));
