import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Col,Row,Rate, Button,Icon } from 'antd';
import { Link } from 'dva/router';
import {getQueryString,formatDate} from '../../utils/public';
import ImgPreview from '../../components/imgPreview';
import {getImg} from '../../utils/img';
import { portUrl } from '../../utils/img';
import "./style.less";

class RepairApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            licenceUrl:"",
            previewVisible: false,
            exportUrl:''
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString("repairId")
        this.props.dispatch({
            type:'repair/getRepairApplyDetail',
            payload:{"repairId":id}
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
    export=()=>{
        let token=sessionStorage.getItem("token");
        let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId=sessionStorage.getItem("userId");
        let repairId=getQueryString('repairId')
        let url=portUrl("/manager/repair/export-detail?userId="+userId+"&userType="+userType+"&accessToken="+token+"&repairId="+repairId)
        this.setState({exportUrl:url})
    }
   
    render(){
        const {applyDetail} = this.props;
        if(!applyDetail){
            return null 
        }
        let imgsArr=[];
        if(applyDetail&&applyDetail.imgs){
            if(applyDetail.imgs.indexOf(',')>0){
                let arr=applyDetail.imgs.split(',')
                arr.map(item=>{
                    imgsArr.push(<img src={getImg(item)} className='des-img' onClick={this.showImg.bind(this,item)} alt=""/>)
                })
            }else{
                imgsArr.push(<img src={getImg(applyDetail.imgs)} className='des-img' onClick={this.showImg.bind(this,applyDetail.imgs)} alt=""/>)
            }
        }
        
        return (
            <div className="apply-detail-main">
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>后勤管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/repair-manage">报事报修管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>报事报修详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="apply-detail-content" id="detail-content">
                        <Row>
                            <Col span={4} className="detail-title">上报内容</Col><Col span={18}>{applyDetail.description||'--'}<br/>{imgsArr}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">报事报修类型</Col><Col span={18}>{applyDetail.typeName||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">报修人</Col><Col span={18}>{applyDetail.applicant||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">报修时间</Col><Col span={18}>{formatDate(applyDetail.applyTime)||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">保修地点</Col><Col span={18}>{applyDetail.address||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">处理人</Col><Col span={18}>{applyDetail.handler||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">处理时间</Col><Col span={18}>{formatDate(applyDetail.dealTime)||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">反馈内容</Col><Col span={18}>{applyDetail.dealReply||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">评分</Col><Col span={18}><Rate allowHalf disabled value={Number(applyDetail.score)} /><span className="score">{applyDetail.score}</span>&nbsp;&nbsp;分</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">评价内容</Col><Col span={18}>{applyDetail.comment||'--'}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">状态</Col><Col span={18}>{applyDetail.status==1?"待处理":(applyDetail.status==2?"已处理":(applyDetail.status==3?"已评价":"未知"))}</Col>
                        </Row>
                        <Row>
                            <Col span={4} className="detail-title">查看人意见</Col><Col span={18}>{applyDetail.cpComment||'--'}</Col>
                        </Row>
                    </div>
                    <div className="detail-btn">
                        <Button><Link to="/repair-manage">返回</Link></Button>
                        <Button type='primary' style={{marginLeft:30}} ><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
                    </div>
                </div>
                <ImgPreview
                    visible={this.state.previewVisible}  // 是否可见
                    onClose={this.closePreview} // 关闭事件
                    src={this.state.licenceUrl} // 图片url
                    picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                    isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                    isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                />
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    applyDetail:state.repair.applyDetail
  }
}
export default connect(mapStateToProps)(RepairApplyDetail);
