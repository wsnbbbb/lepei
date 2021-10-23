import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row, Col, Button,Form, Input, message, Radio, Upload, Icon } from 'antd';
import { Link, routerRedux } from 'dva/router';
import { getQueryString, formatDate } from '../../utils/public';
import { getImg } from '../../utils/img';
import 'braft-editor/dist/index.css';
import './style.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class TaskDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: '',
			title:"作业详情",
		};
	}

	componentDidMount = () => {
		this.getDetail();
		console.log(getQueryString('id'));
		//组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		this.props.dispatch({
		type: 'user/setLastRoute',
		payload: {
		  breadcrumbTitle:this.state.title,
		  parentRoute:"/task-manage"
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
			type: 'jobManage/taskDetail',
			payload: { id: getQueryString('id') },
			callback: (res) => {
				console.log(res);
				if (res.code === 200) {
					this.setState({
						detail: res.data,
					});
				}
			}
		});
	};

   //返回
    goBack(){
        this.props.dispatch(routerRedux.push('/task-manage'));
    }

	render() {

		const { detail ,description} = this.state;
		return (
			<div className="content-main">
				{/* <div className="breadcrumb">
					<Breadcrumb>
						<Breadcrumb.Item>
							<Link to="/task-manage">作业管理</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>查看详情</Breadcrumb.Item>
					</Breadcrumb>
				</div> */}
				<div className="detail">
					<Row gutter={24}>
						<Col span={3}>发布时间</Col>
						<Col span={21}>{formatDate(detail.createTime)}</Col>
					</Row>
					<Row gutter={24}>
						<Col span={3}>发布人</Col>
						<Col span={21}>{detail.publisherName}</Col>
					</Row>
					<Row gutter={24}>
						<Col span={3}>作业科目</Col>
						<Col span={21}>{detail.subjectName}</Col>
					</Row>
					<Row gutter={24}>
						<Col span={3}>作业内容</Col>
						<Col span={21} className='description'>{detail.description}</Col>
					</Row>
					 <Row gutter={24}>
						<Col span={3}>作业图片</Col>
						<Col span={21}>
							{detail.pics &&
								detail.pics.map((i, index) => {
									return <img src={getImg(i)} className="img-preview" alt="" />;
								})}
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={3}>视频</Col>
						<Col span={21}>
							{detail.videos &&
								detail.videos.map((i, index) => {
									return(
                                        <video width="320" height="240" controlslist="nodownload" controls>
                                            <source src={getImg(i.hash)} type="video/mp4" />
                                        </video>
                                        ) 
								})}
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={3}>音频</Col>
						<Col span={21}>
							{detail.voices &&
								detail.voices.map((i, index) => {
									return (
										<audio controls controlslist="nodownload">
											<source src={getImg(i.hash)} type="audio/mpeg" />
										</audio>
									);
								})}
						</Col>
					</Row>
				</div>
                <Row className='btn'>
				    <Button type="primary" onClick={this.goBack.bind(this)}>返回</Button>
			    </Row>
			</div>
		);
	}
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
	return {};
};
export default connect(mapStateToProps)(Form.create()(TaskDetail));
