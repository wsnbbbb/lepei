import React,{Component} from 'react';
import { DatePicker } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router'
import { Table,Modal,Spin , Popover, InputNumber,Divider,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { classList } from '../../services';
import { getImg } from '../../utils/img';
import { toTimestamp } from '../../utils/public';
import PageIndex from '../../components/page';
import {formatDate} from '../../utils/public';
import ImgPreview from '@/components/imgPreview'

const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class styleDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataList:[],
            previewVisible: false,
            licenceUrl:"",
            visibleDel: false,
            deleteId: "",
            totalSize: 0,
            dateRange: null,
            pagiState: "block",
            currentPage: 0,
            totalPage: 0,
			title:"风采详情",

        };
    }

    componentDidMount=()=>{
        const params={
            "classId":this.props.match.params.id,
            "page": 1,
            "prePage": 20
        }
        this.getStyleDetail(params);
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/student-style"
            },
            })
    }

    componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }


    getStyleDetail=(params)=>{
        this.props.dispatch({
            type:'classSpace/getStyleDetail',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                       dataList: res.data.dataList,
                       totalSize: res.data.totalCount,
                       currentPage: res.data.currentPage,
                       totalPage: res.data.totalPage,
                   })
                }
              }
        })
    }

    deleteStyle=(params)=>{
        this.props.dispatch({
            type:'classSpace/deleteStyle',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                   message.success("删除成功！")
                   this.setState({
                        visibleDel: false
                   })
                   const params={
                        "classId":this.props.match.params.id,
                        "page": 1,
                        "prePage": 20
                    }
                    this.getStyleDetail(params);
                }else{
                    message.error("删除失败！")
                }
              }
        })
    }

    showImg=(url)=>{
        this.setState({
            previewVisible: true,
            licenceUrl: getImg(url)
        })
    }

    onChange=(date, dateString)=> {
        console.log(date, dateString);
        this.setState({
            dateRange: dateString
        })
    }

    onChangeSize=(page, pageSize)=> {
        console.log(page, pageSize);
        const params={
            "classId": this.props.match.params.id,
            "page": page,
            "prePage": pageSize
        }
        this.getStyleDetail(params);
    }
   
    handleDelOk=()=>{
        const params={
            "studentStyleId": this.state.deleteId
        }
        this.deleteStyle(params)
    }

    handleDelCancel=()=>{
        this.setState({
            visibleDel: false
        })
    }
   
    search=()=>{
        if((!this.state.dateRange)||(!this.state.dateRange[0])||(!this.state.dateRange[1])){
            const params={
                "classId": this.props.match.params.id,
                "page": 1,
                "prePage": 20
            }
            this.getStyleDetail(params);
            this.setState({
                "pagiState": "block"
            })
        }else{
            const params={
                "classId": this.props.match.params.id,
                "startTime": toTimestamp(this.state.dateRange[0],true),
                "endTime": toTimestamp(this.state.dateRange[1])
            }
            this.getStyleDetail(params);
            this.setState({
                "pagiState": "none"
            })
        }
    }
   
    del=(id)=>{
        console.log(id)
        this.setState({
            visibleDel: true,
            deleteId: id
        })
    }

    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    }
   
    render(){
    
        const {gradeList, classesList} = this.props
        let option1 = gradeList&&gradeList.map(function(item){
            return  <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        let option2 = classesList&&classesList.map(function(item){
            return  <Option value={item.classId} key={item.classId}>{item.className}</Option>
        })
        const menu1 = id=>(
            <Menu onClick={this.del.bind(this, id)}>
              <Menu.Item>
                <a target="" rel="noopener noreferrer" href="javascript:;" >删除</a>
              </Menu.Item>
            </Menu>
          );
        
        return (
            <div className="content-main content-student">
                <div className="content-box">
                    <div className="content-top">
                        {/* <Breadcrumb>
                            <Breadcrumb.Item><Link to={"/student-style"}>学生风采</Link> \ 风采详情</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Row className="option-wrap">
                            <RangePicker onChange={this.onChange} />
                            <Button type="primary" className="search-btn" onClick={this.search.bind(this)} >查询</Button>
                        </Row>
                    </div>
                    {/* 图片预览组件 */}
                    <ImgPreview
                    visible={this.state.previewVisible}  // 是否可见
                    onClose={this.closePreview} // 关闭事件
                    src={this.state.licenceUrl} // 图片url
                    picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                    isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                    isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                    />
                    <Row className="list-wrap">
                        <ul>
                            {
                                this.state.dataList.map((item)=>{
                                    return  <li className="item" key={item.id}>
                                                <div className="item-top">
                                                    <Row>
                                                        <Col span={6}>
                                                            <img src={getImg(item.portrait)}/>
                                                            <div>
                                                                <h4>{item.publishName}</h4>
                                                                <p>{formatDate(item.createTime)}</p>
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div>
                                                                <h4>发布班级</h4>
                                                                <Popover content={ 
                                                                    <div>
                                                                        {item.classes.map((i)=>{
                                                                            return <p key={i.classId}>{i.className}</p>
                                                                        })}
                                                                    </div>
                                                                    } title="发布班级">
                                                                    <p>{item.classes[0].className}等{item.classes.length}个班级 <Icon type="down" /></p>
                                                                </Popover>
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div>
                                                                <h4>权限</h4>
                                                                <Popover content={
                                                                    <div>
                                                                        <p>查看权限&nbsp;&nbsp;&nbsp;&nbsp;{item.viewAuth==0?"不限制":"仅选定班级"}</p>
                                                                        <p>评论权限&nbsp;&nbsp;&nbsp;&nbsp;{item.commentAuth==0?"不限制":"限制"}</p>
                                                                        <p>转发权限&nbsp;&nbsp;&nbsp;&nbsp;{item.forwardAuth==0?"不限制":"限制"}</p>
                                                                        <p>点赞权限&nbsp;&nbsp;&nbsp;&nbsp;{item.likeAuth==0?"不限制":"限制"}</p>
                                                                    </div>
                                                                } title="权限">
                                                                    <p>查看权限&nbsp;&nbsp;&nbsp;&nbsp;{item.viewAuth==0?"不限制":"仅选定班级"} <Icon type="down" /></p>
                                                                </Popover>
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="option">
                                                                <a href="javascript:;">操作</a>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                                <Dropdown overlay={menu1(item.id)} >
                                                                    <a className="ant-dropdown-link" href="javascript:;" >
                                                                        <Icon type="ellipsis" />
                                                                    </a>
                                                                </Dropdown>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="item-bottom">
                                                    <div className="bottom-left">
                                                        <ul>
                                                            {
                                                                item.imgs.split(",").map((i)=>{
                                                                   return   <li key={i} onClick={this.showImg.bind(this, i)}>
                                                                                <img src={getImg(i)} />
                                                                            </li>
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="bottom-right">
                                                        <div className="right-title">
                                                            <h3>摘要</h3>
                                                            <p>{item.desc}</p>
                                                        </div>
                                                        <div className="right-title">
                                                            <h3>点赞</h3>
                                                            <p>{item.likes}</p>
                                                        </div>
                                                        <div className="right-title">
                                                            <h3>评论</h3>
                                                            {
                                                                item.content.map((i)=>{
                                                                    return <p key={i.name}>{i.name + "：" + i.content}</p>
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                })
                            }
                        </ul>
                    </Row>
                    <div className="pagination-box" style={{"display":this.state.pagiState}}>
                        {/* <p>共12条记录 第1/10页</p> */}
                        {/* <Pagination style={{"display":this.state.pagiState}}  showTotal={total => `共 ${total} 条记录`} total={this.state.totalSize} onChange={this.onChangeSize} pageSize={10} hideOnSinglePage={false}  showQuickJumper /> */}
                        <PageIndex getPage={this.onChangeSize.bind(this)} total={this.state.totalSize} totalPage={this.state.totalPage} currentPage={this.state.currentPage}/>
                    </div>
             
                </div>

                <Modal className="del-modal"
                    title="删除"
                    visible={this.state.visibleDel}
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
    gradeList: state.classSpace.gradeList,
    classesList: state.classSpace.classesList
  }
}

export default connect(mapStateToProps)(styleDetail);
