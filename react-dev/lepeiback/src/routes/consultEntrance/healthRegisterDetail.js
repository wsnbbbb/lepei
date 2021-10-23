import React, { Component } from 'react';
import { connect } from 'dva';
// import {Link} from 'dva/router';
import { Table, Button, Input, Form, Row, Col, Steps, Icon, Modal, message, Tree, Breadcrumb, Divider } from 'antd';

import { getQueryString, getSexType,onlyDate } from '../../utils/public';
import './style.less';
import { portUrl, getImg} from '../../utils/img';
import ImgPreview from '../../components/imgPreview';
import { Link } from 'dva/router';
import { topdf } from '../../utils/topdf';

const confirm = Modal.confirm;
// const { TextArea } = Input;
const TextArea = Input.TextArea;
// const TreeNode = TreeSelect.TreeNode;

class healthRegisterDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			detail: {},
			diseases: [],
			relateInfo: [],
			previewVisible: false,
			title:'详情'
		};
	}
	componentDidMount = () => {
		this.getDetail();
		console.log(getQueryString('id'));
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
	//获取详情
	getDetail = () => {
		this.props.dispatch({
			type: 'consultEntrance/healthRegisterDetail',
			payload: { id: getQueryString('id') },
			callback: (res) => {
				console.log(res);
				if (res.code === 200) {
					this.setState({
						detail: res.data,
						diseases: res.data.diseases,
						relateInfo: res.data.relateInfo,
						id: res.data.id
					});
				}
			}
		});
	};

	//导出pdf
	topdf = () => {
		const title = this.state.detail.childName + '健康状况登记表';
		topdf(title, '#printBox', '.whole-node', 250);
	};
	
	closePreview = () => {
		this.setState({
			previewVisible: false
		});
	};

	showImg = (url) => {
		this.setState({
			previewVisible: true,
			licenceUrl: getImg(url)
		});
		// console.log(licenceUrl);
	};

	render() {
		const { value, detail, relateInfo, diseases } = this.state;
		return (
			<div className="visit-detail">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/health-register">幼儿健康情况登记表</Link>
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
									<p className="item-key">性别</p>
									<p className="item-value">{detail.sex == 1 ? '男' : detail.sex == 2 ? '女' : ''}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">家长姓名</p>
									<p className="item-value">{detail.emergencyContact}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">与孩子关系</p>
									<p className="item-value">{detail.emergencyRelation}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">家庭电话</p>
									<p className="item-value">{detail.homeNumber}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">移动电话</p>
									<p className="item-value">{detail.mobileNumber}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">填写日期</p>
									<p className="item-value">{onlyDate(detail.submitTime)}</p>
								</div>
								<div className="basicData-item  ">
									<p className="item-key">确认日期</p>
									<p className="item-value">{onlyDate(detail.confirmTime)}</p>
								</div>
								<div className="basicData-item  " />
								<div className="basicData-item">
									<p className="item-key">家长签字（首次）</p>
									<img
										src={detail.parentSign && getImg(detail.parentSign)}
										onClick={this.showImg.bind(this, detail.parentSign)}
										className="img-preview parentSign"
										alt=""
									/>
								</div>
                                <div className="basicData-item">
									<p className="item-key">家长签字（第二次）</p>
									{detail.parentSecondSign && <img
										src={detail.parentSecondSign && getImg(detail.parentSecondSign)}
										onClick={this.showImg.bind(this, detail.parentSecondSign)}
										className="img-preview parentSign"
										alt=""
									/>}
								</div>
                                <div className="basicData-item  " />
							</div>
						</div>
						<div className="whole-node">
							<h3>既往病史</h3>
							<div>
								<div className="basicData1">
									{diseases &&
										diseases.map((item) => {
											return (
												<div className="basicData-item">
													<p className="item-key">{item.name}</p>
													<p className="item-value">{item.remark}</p>
												</div>
											);
										})}
								</div>
							</div>
						</div>
						<div>
							<h3>相关信息</h3>
							<div>
								<div className="basicData1">
									{relateInfo &&
										relateInfo.map((item) => {
											if (item.type !== 7 && item.type !== 6 && item.type !== 11) {
												return (
													<div className="basicData-item whole-node">
														<p className="item-key">{item.title}</p>
														{item.answers &&
															item.answers.map((msg) => {
																return <p className="item-value">{msg}</p>;
															})}
													</div>
												);
											}
											if (item.type == 11) {
												return (
													<div className="basicData-item"></div>
												);
											}
										})}
								</div>
								<div className="basicData1">
									{relateInfo &&
										relateInfo.map((item) => {
											if (item.type == 7 || item.type == 6) {
												return (
													<div className="basicData-item basicData-item2">
														<p className="item-key">{item.title}</p>
														{item.answers &&
															item.answers.map((i, index) => {
																return (
																	<img
																		src={getImg(i)}
																		onClick={this.showImg.bind(this, i)}
																		className="img-preview whole-node"
																		alt=""
																	/>
																);
															})}
													</div>
												);
											}
										})}
								</div>
							</div>
						</div>
					</div>
				</div>

				<ImgPreview
					visible={this.state.previewVisible} // 是否可见
					onClose={this.closePreview} // 关闭事件
					src={this.state.licenceUrl} // 图片url
					picKey={'currentKey'} // 下载需要的key，根据自己需要决定
					isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
					isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps)(Form.create()(healthRegisterDetail));
