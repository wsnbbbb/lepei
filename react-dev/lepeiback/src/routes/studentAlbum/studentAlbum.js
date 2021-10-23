import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Modal, message, Icon, Breadcrumb ,Checkbox} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { getGradeType, getSexType, getResidence, formatIdcard } from '../../utils/public';
import { portUrl } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;


class StudentAlbum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			personList: [],
			page: 1,
			prePage: 20,
			visible: false,
			gradeId: '',
			classValue: '',
			flag: false, //展开收起开关
			personIds: [],
			disabled: true,
			selectedRowKeys: [],
			exportUrl: '',
            publishers:[],
			disabled: true,
			disabled1: true,
		};
	}
	componentDidMount = () => {
		// console.log(this.props.match.params.id)//获取参数
		const params = {
			page: 1,
			prePage: 20,
			personType:1
		};
		this.personLists(params);
		// this.props.dispatch({
		// 	type: 'user/getCommonGradeList'
		// });
	};
	// 获取列表
	personLists = (params) => {
		let that = this;
		that.props.dispatch({
			type: 'studentAlbum/personList',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code === 200) {
					that.setState({
						personList: res.data
					});
				}
			}
		});
	};
    //跳转详情
	toDetail = (id) => {
		this.props.dispatch(routerRedux.push('/student-album-detail?id=' + id));
	};
	// 查询
	search = () => {
		this.props.form.validateFields((err, values) => {
			const params = {
				page: 1,
				prePage: this.state.prePage,
				personType: 1,
				kw: values.kw || '',
                gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				classId:values.classId || '',
				inResidence: values.inResidence || 0
			};
            console.log(params)
			this.personLists(params);
		});
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

	// 分页
	onPageChange = (current, size) => {
		this.setState({ selectedRowKeys: [] });
		this.props.form.validateFields((err, values) => {
			this.setState({ page: current, prePage: size });
			const params = {
				page: current,
				prePage: size,
				personType: 1,
				kw: values.kw || '',
				gradeType: values.gradeType || '',
				gradeId: values.gradeId || '',
				classId:values.classId || '',
				inResidence: values.inResidence || 0
			};
			this.personLists(params);
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


	  //学业阶段选择
	  handleChange1=(value)=>{
		if (value) {
		  this.setState({ disabled1: false })
		  this.props.dispatch({
			type: 'user/getGradeName',
			payload: { "type": value },
		  })
		} else {
		  this.setState({
			disabled1: true,
		  })
		}
		this.props.form.resetFields(["gradeId","classId"])
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
		} else {
			this.setState({ classId: '', disabled: true })
		}
		this.props.form.resetFields(["classId"])
	  }
    //发布人配置详情
    publishManage=()=>{
        console.log('asas')
        this.props.dispatch({
            type:'studentAlbum/albumsPublishers',
            payload: {},
            callback:(res)=>{
                console.log(res)
                if(res.code===200){
                   this.setState({
                      visible: true,
                      publishers: res.data
                   })
                }
            }
        })
    }
   //保存配置
    handleDelOk=()=>{
        let newArr = this.state.publishers.filter(item=>item)
        this.setState({
            publishers: newArr
        })
        // debugger
        // return
        this.props.dispatch({
            type:'studentAlbum/savePublishers',
            payload: {
                "publishers": this.state.publishers,
            },
            callback:(res)=>{
                if(res.code===200){
                    message.success('保存成功')
                   this.setState({
                      visible: false
                   })
                }
            }
        })
    }

    handleDelCancel=()=>{
        this.setState({
            visible: false
        })
    }

    onChange=(checkedValues)=> {
        console.log('checked = ', checkedValues);
        this.setState({
            publishers: checkedValues
        })
    }

	render() {
		const columns = [
			{
				title: '姓名',
				dataIndex: 'personName'
			},
			{
				title: '性别',
				dataIndex: 'sex',
				render: (record) => {
					return <span>{getSexType(record)}</span>;
				}
			},
			{
				title: '读书形式',
				dataIndex: 'inResidence',
				render: (record) => {
					return <span>{getResidence(record)}</span>;
				}
			},
			{
				title: '学业阶段',
				dataIndex: 'gradeType',
				render: (record) => {
					return <span>{getGradeType(record)}</span>;
				}
			},
			{
				title: '年级',
				dataIndex: 'gradeName'
			},
			{
				title: '班级',
				dataIndex: 'className'
			},
			{
				title: '操作',
				dataIndex: '',
				width: 120,
				fixed: 'right',
				render: (text, record) => (
					<span className="make-box">
						<a href="javascript:;" className="check-btn"  onClick={this.toDetail.bind(this, record.personId)}>
							详情
						</a>
					</span>
				)
			}
		];
		const { getFieldDecorator } = this.props.form;
		const { personList, flag, isShow } = this.state;
		if (!personList) {
			return null;
		}
		const { commonData, gradeList } = this.props;

		let options = []
		gradeList && gradeList.length > 0 && gradeList.map(item => {
		  return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
		})
		let classOptions = [];
		commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
		  return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
		})
            const checkOptions = [
                { label: '科任老师', value:1 },
                { label: '副班主任', value:2 },
                { label: '班主任', value: 3 },
                { label: '导师', value: 4 },
            ];
		return (
			<div>
				<div className="content-main student-manage">
					<Form className="ant-advanced-search-form content-form">
						<Row gutter={24}>
							<Col span={5}>
								<FormItem label="">
									{getFieldDecorator('kw')(<Search allowClear placeholder="请输入姓名或证件号" />)}
								</FormItem>
							</Col>
							<Col span={3}>
								<FormItem  placeholder="学业阶段">
									{getFieldDecorator('gradeType', { initialValue: undefined })(
										<Select placeholder="学业阶段" onChange={this.handleChange1.bind(this)} allowClear> 
											{/* <Option value="">全部</Option> */}
											<Option value="1">幼儿园</Option>
											<Option value="2">小学</Option>
											<Option value="3">初中</Option>
											<Option value="4">高中</Option>
											<Option value="5">大学</Option>
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
								<FormItem placeholder="班级" >
									{getFieldDecorator('classId')(
										<Select allowClear placeholder="班级" showSearch disabled={this.state.disabled}>
											{classOptions}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={3}>
								<FormItem>
									{getFieldDecorator('inResidence')(
										<Select showSearch allowClear  placeholder="读书形式">
											{/* <Option value="">全部</Option> */}
											<Option value={1}>住读</Option>
											<Option value={2}>走读</Option>
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={5}>
								<Button type="primary" onClick={this.search.bind(this)}>
									查询
								</Button>&emsp;
								<Button onClick={this.reset.bind(this)}>重置</Button>
								<span className="cursor ftColor" onClick={this.toggle.bind(this)}>
									{this.state.flag ? '收起 ' : '展开 '}
									<Icon type={flag ? 'up' : 'down'} />
								</span>
							</Col>
						</Row>
						<Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
							<Col style={{ paddingTop: '10px', paddingBottom: '10px' }}>
								<Button type="primary" onClick={this.publishManage.bind(this)}>发送人管理</Button>
							</Col>
						</Row>
					</Form>
					<Table
						className="content-table"
						scroll={{ x: 1000 }}
						columns={columns}
						dataSource={personList.dataList}
						pagination={false}
					/>
					<PageIndex
						getPage={this.onPageChange.bind(this)}
						total={personList.totalCount}
						totalPage={personList.totalPage}
						currentPage={personList.currentPage}
					/>
				</div>
                <Modal className="publisher-manage"
                    title="发送人管理"
                    visible={this.state.visible}
                    onOk={this.handleDelOk}
                    onCancel={this.handleDelCancel}
                    footer={[
                        <Button key="back" onClick={this.handleDelCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleDelOk}>
                            确定
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>允许发送角色</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CheckboxGroup value={this.state.publishers} options={checkOptions} onChange={this.onChange.bind(this)} />
                    </Row>
                   
                </Modal>
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

export default connect(mapStateToProps)(Form.create()(StudentAlbum));
