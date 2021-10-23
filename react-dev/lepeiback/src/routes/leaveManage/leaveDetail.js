import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Steps ,Button } from 'antd';
import {Link} from "dva/router";
import ImgPreview from '../../components/imgPreview';
import {getQueryString,onlyDate,formatDate} from '../../utils/public';
import { getImg,portUrl } from '../../utils/img';
import "./style.less";

const Step = Steps.Step;

class LeaveDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            exportUrl:'',
            title:'请假详情',
        };
    }
    componentDidMount=()=>{ 
        const id = getQueryString("leaveId");
        this.props.dispatch({
            type:"leave/leaveDetail",
            payload:{"id":id}
        })

        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/leave-manage"
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
    showImg=(url)=>{
        this.setState({
            previewVisible: true,
            licenceUrl: getImg(url)
        })
    }
  
    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    }
    cancel = () =>{
        window.history.go(-1)
    }
    // 导出
    export=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let recordId = getQueryString("leaveId");
        let url=portUrl("/manager/apply-leave/export-detail?userId="+userId+"&userType="+userType+"&accessToken="+token+"&recordId="+recordId)
        this.setState({exportUrl:url})
    }
    render(){
        const {leaveDetails} = this.props;
        if(!leaveDetails){return null;}
        let steps=[];
        leaveDetails&&leaveDetails.dealerPerson.map((item,index)=>{
            let title=item.actType==1&&!item.dealStatus?"发起申请":(item.dealStatus==1?"通过":"不通过")
            steps.push(
                <Step key={index} title={title} description={<span>{item&&item.dealerName}<br/>{formatDate(item&&item.createTime)}<br/>{item.reason}</span>} />
            )
        })
        const imgs=leaveDetails&&leaveDetails.pics?leaveDetails.pics.split(','):[]
        let imgData=[]
        imgs.length>0&&imgs.map((item,index)=>{
            imgData.push(<img key={index} src={getImg(item)} className='des-img' onClick={this.showImg.bind(this,item)}/>)
        })
        return (
            <div className="leave-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/leave-manage">教职工请假管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>请假详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Steps progressDot current={leaveDetails.dealerPerson&&leaveDetails.dealerPerson.length} className="leave-steps">
                    {steps}
                    {/* {leaveDetails&&leaveDetails.dealerPerson.length==1?<Step title="待审核" />:null} */}
                </Steps>
                <div className="leave-card">
                    <Row>
                        <Col span={8}>申请人：{leaveDetails&&leaveDetails.personName}</Col>
                        <Col span={8}>开始日期：{formatDate(leaveDetails&&leaveDetails.startTime)}</Col>
                        <Col span={8}>结束日期：{formatDate(leaveDetails&&leaveDetails.endTime)}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>抄送人：{leaveDetails&&leaveDetails.approveName}</Col>
                        <Col span={8}>请假类型：{leaveDetails&&leaveDetails.applyTypeName}</Col>
                        <Col span={8}>请假时长：{leaveDetails?leaveDetails.days:0}天{leaveDetails?leaveDetails.hours:0}小时</Col>
                    </Row>
                    <Row>
                        <Col span={24}>请假原因：{leaveDetails&&leaveDetails.reason}</Col>
                    </Row>
                    <Row>
                    {imgData?<Col span={24}>图片：{imgData}</Col>:null}
                    </Row>
                </div>
               
                <ImgPreview
                    visible={this.state.previewVisible}  // 是否可见
                    onClose={this.closePreview} // 关闭事件
                    src={this.state.licenceUrl} // 图片url
                    picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                    isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                    isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                />
                <div className="btn-box">
                    <Button className="btn-cancel" onClick={this.cancel.bind(this)}>返回</Button>
                    <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}>
                        <Button className="btn-submit" onClick={this.export.bind(this)} type="primary">导出</Button>
                    </a>
                </div>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
      leaveDetails:state.leave.leaveDetails
  }
}
export default connect(mapStateToProps)(LeaveDetail);
