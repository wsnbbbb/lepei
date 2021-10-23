import React, { Component } from 'react';
import { DatePicker } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
	Table,
	Modal,
	Button,
	Select,
	message,
	Breadcrumb,
	Input,
	Form,
	Row,
    Dropdown,
	Col,
    Icon,Menu
} from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { classList } from '../../services';
import { getImg } from '../../utils/img';
import { toTimestamp } from '../../utils/public';
import PageIndex from '../../components/page';
import { formatDate, getQueryString } from '../../utils/public';
import ImgPreview from '@/components/imgPreview';

const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class studentAlbumDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			previewVisible: false,
			licenceUrl: '',
			visibleDel: false,
			deleteId: '',
			totalSize: 0,
			dateRange: null,
			pagiState: 'block',
			currentPage: 0,
			totalPage: 0,
			title:"相册详情",
		};
	}

	componentDidMount = () => {
		console.log(getQueryString('id'));
		const params = {
			personId: getQueryString('id'),
			page: 1,
			prePage: 20
		};
		this.getAlbumDetail(params);

		  //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		  this.props.dispatch({
			type: 'user/setLastRoute',
			payload: {
			  breadcrumbTitle:this.state.title,
			  parentRoute:"/student-album"
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

	getAlbumDetail = (params) => {
		this.props.dispatch({
			type: 'studentAlbum/studentAlbumDetail',
			payload: params,
			callback: (res) => {
				console.log(res);
				if (res.code === 200) {
					this.setState({
						dataList: res.data.dataList,
						totalSize: res.data.totalCount,
						currentPage: res.data.currentPage,
						totalPage: res.data.totalPage
					});
				}
			}
		});
	};

	deleteAlbum = (params) => {
        console.log(params)
		this.props.dispatch({
			type: 'studentAlbum/delStudentAlbum',
			payload: params,
			callback: (res) => {
				if (res.code === 200) {
					message.success('删除成功！');
					this.setState({
						visibleDel: false
					});
					const params = {
						personId: getQueryString('id'),
			            page: 1,
			            prePage: 20
					};
					this.getAlbumDetail(params);
				} else {
					message.error('删除失败！');
				}
			}
		});
	};

	showImg = (url) => {
		this.setState({
			previewVisible: true,
			licenceUrl: getImg(url)
		});
	};

	onChange = (date, dateString) => {
		console.log(date, dateString);
		this.setState({
			dateRange: dateString
		});
	};

	onChangeSize = (page, pageSize) => {
		console.log(page, pageSize);
		const params = {
			personId: getQueryString('id'),
			page: page,
			prePage: pageSize,
			// startTime: this.state.dateRange&&toTimestamp(this.state.dateRange[0], true)||'',
			// endTime: this.state.dateRange&&toTimestamp(this.state.dateRange[1])||''
		};
		this.getAlbumDetail(params);
	};

	handleDelOk = () => {
		const params = {
			"recordId": this.state.deleteId
		};
		this.deleteAlbum(params);
	};

	handleDelCancel = () => {
		this.setState({
			visibleDel: false
		});
	};

	search = () => {
		if (!this.state.dateRange || !this.state.dateRange[0] || !this.state.dateRange[1]) {
			const params = {
				personId: getQueryString('id'),
				page: 1,
				prePage: 20
			};
			this.getAlbumDetail(params);
			this.setState({
				pagiState: 'block'
			});
		} else {
			const params = {
				personId: getQueryString('id'),
				startTime: toTimestamp(this.state.dateRange[0], true),
				endTime: toTimestamp(this.state.dateRange[1])
			};
			this.getAlbumDetail(params);
			this.setState({
				pagiState: 'block'
			});
		}
	};

	del = (id) => {
		console.log(id);
		this.setState({
			visibleDel: true,
			deleteId: id
		});
	};

	closePreview = () => {
		this.setState({
			previewVisible: false
		});
	};

	goBack() {
		this.props.dispatch(routerRedux.push('/student-album'));
	}

	render() {
        const menu1 = id=>(
            <Menu onClick={this.del.bind(this, id)}>
              <Menu.Item>
                <a target="" rel="noopener noreferrer" href="javascript:;" >删除</a>
              </Menu.Item>
            </Menu>
          );
		return (
			<div className=" content-student">
				<div className="content-box">
					{/* <div className="breadcrumb">
						<Breadcrumb>
							<Breadcrumb.Item>
								<Link to={'/student-album'}>学生相册</Link>{' '}
							</Breadcrumb.Item>
							<Breadcrumb.Item>相册详情</Breadcrumb.Item>
						</Breadcrumb>
					</div> */}
					<div className="content-main">
						<Row className="option-wrap">
							<RangePicker onChange={this.onChange} />
							<Button type="primary" className="search-btn" onClick={this.search.bind(this)}>
								查询
							</Button>
							<Button className="search-btn" onClick={this.goBack.bind(this)}>
								返回
							</Button>
						</Row>
						{/* 图片预览组件 */}
						<ImgPreview
							visible={this.state.previewVisible} // 是否可见
							onClose={this.closePreview} // 关闭事件
							src={this.state.licenceUrl} // 图片url
							picKey={'currentKey'} // 下载需要的key，根据自己需要决定
							isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
							isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
						/>
						<Row className="list-wrap">
							<ul>
								{this.state.dataList.map((item)=>{
									return (
										<li className="item" key={item.id}>
											<div className="item-top">
												<Row>
													<Col span={6}>
														<img src={getImg(item.publisherPic)} />
														<div>
															<h4>{item.publisherName}</h4>
															<p>{formatDate(item.createTime)}</p>
														</div>
													</Col>

                                                    <Col span={6}>
                                                            <div className="option">
                                                            <Dropdown overlay={menu1(item.id)} >
                                                                    <a className="ant-dropdown-link" href="javascript:;" >
                                                                        <Icon type="ellipsis" />
                                                                    </a>
                                                                </Dropdown>
                                                            </div>
                                                    </Col>
												</Row>
												<div className="description"><pre>{item.description}</pre></div>
											</div>
											<div className="item-bottom">
												<div className="bottom-left">
													<ul>
														{item.photos.map((i, index) => {
															return (
																<li key={index} onClick={this.showImg.bind(this, i)}>
																	<img src={getImg(i)} />
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</Row>
						<div className="pagination-box" style={{ display: this.state.pagiState }}>
							{/* <p>共12条记录 第1/10页</p> */}
							{/* <Pagination style={{"display":this.state.pagiState}}  showTotal={total => `共 ${total} 条记录`} total={this.state.totalSize} onChange={this.onChangeSize} pageSize={10} hideOnSinglePage={false}  showQuickJumper /> */}
							<PageIndex
								getPage={this.onChangeSize.bind(this)}
								total={this.state.totalSize}
								totalPage={this.state.totalPage}
								currentPage={this.state.currentPage}
							/>
						</div>
					</div>
				</div>

				<Modal
					className="del-modal"
					title="删除"
					visible={this.state.visibleDel}
					onOk={this.handleDelOk}
					onCancel={this.handleDelCancel}
					footer={[
						<Button key="back" onClick={this.handleDelCancel}>
							取消
						</Button>,
						<Button key="submit" type="primary" onClick={this.handleDelOk}>
							确定
						</Button>
					]}
				>
					<Row>
						<label>是否删除该条数据？</label>
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
		// gradeList: state.classSpace.gradeList,
		// classesList: state.classSpace.classesList
	};
};

export default connect(mapStateToProps)(studentAlbumDetail);
