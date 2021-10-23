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
import {  onlyDate ,toTimestamp} from '../../utils/public';
import { portUrl } from '../../utils/img';
import { visitRegisterUrl } from '../../config';
import { Encrypt } from '../../utils/secret';
import './style.less';
import moment from 'moment'

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

class entranceApply extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			prePage: 20,
			applyList: [], //列表数据
			reset: false,
			flag: false, //展开收起开关
			Visible: false, //抽屉
			exportUrl: '', //导出地址
			itemList:[],//关联表格数据
			itemListId:[],//关联表格id
			formId:'',//关联表格id
			schoolId:''
		};
	}
	componentDidMount = () => {
		const params = {
			page: 1,
			prePage: 20
		};
		this.getList(params);
		this.getItemList()
		const schoolId=Encrypt(sessionStorage.getItem("schoolId"))
		console.log(schoolId)
		this.setState({schoolId})
	};
	// 获取记录列表
	getList = (params) => {
		this.props.dispatch({
			type: 'consultEntrance/entranceApplyList',
			payload: params,
			callback: (res) => {
				if (res.code == 200) {
					this.setState({
						applyList: res.data
					});
				}
			}
		});
	};
	//获取配置项
	getItemList=(params)=>{
		this.props.dispatch({
			type: 'consultEntrance/configurationList',
			payload: params,
			callback: (res) => {
				if (res.code == 200) {
					const itemListId=[]
					res.data.forEach(element => {
						itemListId.push(element.id)
					});
					console.log(itemListId)
					this.setState({
						itemList: res.data,
						itemListId:itemListId
					});
				}
			}
		});
	}
	// 重置
	reset = () => {
		this.props.form.resetFields();
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
	// 查询
	search = () => {
		this.props.form.validateFields((err, values) => {
			const params = {
				page: 1,
				prePage: this.state.prePage,
				kw: values.kw || '',
				status: values.status || '',
				submitStartTime: values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
				submitEndTime: values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
			};
			this.getList(params);
			this.setState({ page: 1 });
		});
	};
  // 删除
  showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'consultEntrance/delApplyList',
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
                    "submitStartTime":values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
                    "submitEndTime":values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
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
	//配置
	configure = () => {
		this.setState({ Visible: true });
		const params={type:3}
		this.props.dispatch({
			type: 'consultEntrance/configurationDetail',
			payload: params,
			callback: (res) => {
				if (res.code == 200) {
					this.setState({
						formId: res.data.formId
					});
				}
			}
		});
	};
  // 分页
  onPageChange = (current,size) =>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params = {
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "status":values.status||'',
          "submitStartTime":values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||'',
          "submitEndTime":values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||"",
        }
        this.getList(params)
      })
  }
	//跳转详情
	toDetail = (id) => {
		this.props.dispatch(routerRedux.push('/entranceApply-detail?id='+id));
	};

	// 关闭抽屉
	onClose = () => {
		this.setState({
			Visible: false,
			fileList: []
		});
		this.props.form.resetFields();
	};

  // 导出
  export = () => {
      this.props.form.validateFields((err, values) => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");
        let kw = values.kw || '';
        let status = values.status || '';
        let submitStartTime= values.time&&values.time[0]&&toTimestamp(moment(values.time[0]).format("YYYY-MM-DD"),true)||''
        let submitEndTime=values.time&&values.time[1]&&toTimestamp(moment(values.time[1]).format("YYYY-MM-DD"))||""
        let url = portUrl("/manager/enrolment/admission/records/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + 
          "&kw=" + kw +  "&status=" + status + "&submitStartTime=" + submitStartTime+"&submitEndTime=" + submitEndTime)
        this.setState({ exportUrl: url })
      })
  }

	// 保存
	save = () => {
		this.props.form.validateFields((err, values) => {
			const params = {
				type: 3,
				formId: values.formId || 0
			};
			console.log(params);
			this.props.dispatch({
				type: 'consultEntrance/saveConfigurationDetail',
				payload: params,
				callback: (res) => {
					if (res.code == 200) {
						message.success('配置成功');
						this.setState({
							Visible: false,
						});
						this.props.form.resetFields();
						this.search();
					}
				}
			});
		});
	};

	//配置项模糊查询
	filterOption(input, option){
		if(option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0){
			return true
		}
	 }


	render() {
		const columns = [
			{
				title: '幼儿姓名',
				dataIndex: 'childName',
				width: 100
			},
			{
				title: '性别',
				dataIndex: 'sex',
				width: 100,
				render: (record) => {
					return <span>{record == 1 ? '男' : record == 2 ? '女' : ''}</span>;
				}
			},
            
			{
				title: '出生日期',
				dataIndex: 'birthday',
				width: 150
			},
            {
				title: '申请状态',
				dataIndex: 'status',
				render: (record) => {
					return <span>{record == 1 ? '待审核' : record == 2 ? '已完成' : ''}</span>;
				}
			},
			{
				title: '分班信息',
				dataIndex: 'classInfo'
			},
			{
				title: '申请日期',
				dataIndex: 'submitTime',
				width: 150,
				render: (record) => {
					return <span>{onlyDate(record)}</span>;
				}
			},
            {
				title: '缴费日期',
				dataIndex: 'payDate',
				width: 150,
			},
			{
				title: '操作',
				dataIndex: '',
				width: 200,
				fixed: 'right',
				render: (text, record) => (
					<span className="make-box">
						<a href="javascript:;" onClick={this.toDetail.bind(this, record.id)}>
							查看&emsp;
						</a>
						<a
							href="javascript:;"
							onClick={this.showConfirm.bind(this, record.id)}
							style={{ color: 'red' }}
						>
							删除
						</a>
					</span>
				)
			}
		];
		const {previewVisible, previewImage, flag, isShow, applyList,itemList,formId,itemListId,schoolId } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		};
		let itemOptions = []
		itemList && itemList.length > 0 && itemList.map(item => {
		  return itemOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
		})
		return (
			<div className="entranceApply">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
						<Breadcrumb.Item>入学申请书</Breadcrumb.Item>
					</Breadcrumb>
					<h3>入学申请书</h3>
				</div> */}
				<div className="content-main">
					<Form className="content-form">
						<Row gutter={24}>
							<Col span={6}>
								<FormItem label="">
									{getFieldDecorator('kw')(<Input allowClear placeholder="幼儿姓名" />)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem>
									{getFieldDecorator('status')(
										<Select allowClear placeholder="申请状态">
											<Option value="">全部</Option>
											<Option value={1}>待审核</Option>
											<Option value={2}>已完成</Option>
										</Select>
									)}
								</FormItem>
							</Col>

							<Col span={8}>
								<FormItem>
									{getFieldDecorator('time')(<RangePicker allowClear format={'YYYY/MM/DD'}  onChange={this.onTimeChange}/>)}
								</FormItem>
							</Col>

							<Col span={6} style={{ textAlign: 'right', paddingRight: '20px' }}>
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
							<Col style={{ paddingTop: '10px', paddingBottom: '10px' }}>
								<Button type="primary">
									<a href={this.state.exportUrl} onClick={this.export.bind(this)}>
										导出
									</a>
								</Button>&emsp;
								<Button type="primary" onClick={this.configure.bind(this)}>
									配置
								</Button>
							</Col>
						</Row>
					</Form>
					<Table
						className="content-table"
						scroll={{ x: 1000 }}
						columns={columns}
						dataSource={applyList.dataList}
						pagination={false}
					/>
					<PageIndex
						getPage={this.onPageChange.bind(this)}
						total={applyList.totalCount}
						totalPage={applyList.totalPage}
						currentPage={applyList.currentPage}
					/>
				</div>
				<Drawer
					title="配置"
					placement="right"
					width="600"
					onClose={this.onClose}
					visible={this.state.Visible}
					className="visit-drawer"
				>
					<Form>
						<Row gutter={24}>
							<Col span={24}>
								<Form.Item {...formItemLayout} label="请选择关联表格">
								    {getFieldDecorator('formId', { initialValue: itemListId.indexOf(formId.toString())>-1?formId.toString():'' })(
										<Select allowClear placeholder="不选择" showSearch filterOption={this.filterOption}>
											<Option key={0} value="">不选择</Option>
											{itemOptions}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label="访问链接">
								{getFieldDecorator('link')(
									<Paragraph copyable>{visitRegisterUrl + schoolId}</Paragraph>
								)}
							</FormItem>
						</Col>
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
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};
export default connect(mapStateToProps)(Form.create()(entranceApply));
