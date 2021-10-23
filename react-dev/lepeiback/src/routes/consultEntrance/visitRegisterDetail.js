import React, { Component } from 'react';
import { connect } from 'dva';
// import {Link} from 'dva/router';
import { Table, Button, Input, Form, Row, Col, Steps, Icon, Modal, message, Tree, Breadcrumb, Divider } from 'antd';

import { getQueryString,getSexType } from '../../utils/public';
import './style.less';
import { portUrl, getImg } from '../../utils/img';
import ImgPreview from '../../components/imgPreview';
import { Link } from 'dva/router';
import { topdf } from '../../utils/topdf';

const confirm = Modal.confirm;
// const { TextArea } = Input;
const TextArea = Input.TextArea;
// const TreeNode = TreeSelect.TreeNode;

class visitRegisterDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			detail: {},
			fatherInfo: {},
			motherInfo: {},
			siblingsInfo: [],
			relateInfo: [],
			value: '',
			previewVisible: false,
			title:'详情'
		};
	}
	componentDidMount = () => {
		this.getDetail();
		console.log(getQueryString('id'))
		this.props.dispatch({
			type: 'user/setLastRoute',
			payload: {
			  breadcrumbTitle:this.state.title,
			  parentRoute:"/visit-register"
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
			type: 'consultEntrance/visitDetail',
			payload: { id: getQueryString('id') },
			callback: (res) => {
				if (res.code === 200) {
					this.setState({
						detail: res.data,
						fatherInfo: res.data.fatherInfo,
						motherInfo: res.data.motherInfo,
						siblingsInfo: res.data.siblingsInfo,
						relateInfo: res.data.relateInfo,
						id:res.data.id,
						value:res.data.feedback
					});
				}
			}
		});
	};

	//导出pdf
	topdf = () => {
		const title=this.state.detail.childName+'参观登记表'
		topdf(title, '#printBox', '.whole-node', 250);
	};
	//意见反馈输入
	onTextChange = ({ target: { value } }) => {
		this.setState({ value });
	};
	//保存
	save = () => {
		console.log(this.state.value);
		const params={
			"id":this.state.id||'',
			"feedback":this.state.value || ''
		  }
		this.props.dispatch({
            type:'consultEntrance/saveVisitFeedback',
            payload:params,
            callback:(res) =>{
              if(res.code == 200) {
                  message.success('保存成功')
                  this.setState({
                     
                  })
              }
            }
          })
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
		// console.log(licenceUrl)
	};

	render() {
		const { value, detail, fatherInfo, motherInfo, siblingsInfo, relateInfo } = this.state;
		return (
			<div className="visit-detail">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>咨询与入学</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to="/visit-register">参观登记表</Link>
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
									<p className="item-value">{detail.sex==1?'男':'女'}</p>
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
								<div className="basicData-item  " />
								<div className="basicData-item  " />
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
										<div className="basicData-item  " />
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
										<div className="basicData-item  " />
									</div>
								</div>
								{siblingsInfo && siblingsInfo.map((item) => {
										return (
											<div className="whole-node">
												<Divider className="">兄弟姐妹</Divider>
												<div className="basicData paddingTop">
													<div className="basicData-item  ">
														<p className="item-key">姓名</p>
														<p className="item-value">{item.name}</p>
													</div>
													<div className="basicData-item  ">
														<p className="item-key">性别</p>
														<p className="item-value">{item.sex==1?'男':'女'}</p>
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
						<div>
							<h3>相关信息</h3>
							<div>
							   <div className="basicData1">
								{relateInfo && relateInfo.map((item) => {
										if (item.type !== 7&&item.type !== 6 && item.type !== 11) {
											return (
												<div className="basicData-item whole-node">
													<p className="item-key">{item.title}</p>
													{item.answers&&item.answers.map((msg)=>{
														return (<p className="item-value">{msg}</p>)
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
							   <div className="basicData1 whole-node">
								{relateInfo && relateInfo.map((item) => {
										if (item.type == 7||item.type == 6) {
											return (
												<div className="basicData-item basicData-item2">
													<p className="item-key">{item.title}</p>
													{item.answers&&item.answers.map((i,index)=>{
														return (<img
														   src={getImg(i)} 
														   onClick={this.showImg.bind(this,i)}
														   className="img-preview"
														   alt=""
													   />)
													})
													}
												</div>
											);
										}
								})}
							   </div>
							</div>
						</div>
					</div>
					<div className="advice">
						<h3>意见反馈</h3>
						<TextArea
							rows={4}
							placeholder="请输入参观反馈"
							className="feedback"
							value={value}
							onChange={this.onTextChange.bind(this)}
							maxLength={500}
						/>
					</div>
					<Row className="btn">
						<Button type="primary" onClick={this.save.bind(this)}>
							保存
						</Button>
					</Row>
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

export default connect(mapStateToProps)(Form.create()(visitRegisterDetail));
