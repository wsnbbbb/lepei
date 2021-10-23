import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Steps ,Button } from 'antd';
import {Link} from "dva/router";
import ImgPreview from '../../components/imgPreview';
import {getQueryString, getApplyType, formatDate} from '../../utils/public';
import { getImg,portUrl } from '../../utils/img';
import "./style.less";

const Step = Steps.Step;

class applyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            applyDetails: '',
			title:"功能室申请详情",

        };
    }
    componentDidMount=()=>{ 
        this.getDeatail()
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/apply-list-index"
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
    getDeatail=()=>{
        this.props.dispatch({
            type:"functionPlaces/getFunctionPlacesApplyDetail",
            payload:{"id": getQueryString("id")},
            callback: res=>{
                this.setState({
                    applyDetails: res.data
                })
            }
        })
    }

    cancel = () =>{
        window.history.go(-1)
    }

    fomatStatus=(status)=>{
        switch(status){
            case "0":
              return "待审批";
            case "1":
              return "通过";
            case "2":
              return "驳回";
            case "3":
              return "拒绝";
            default:
              return ""
          }
    }
    render(){
        const {applyDetails} = this.state;
        if(!applyDetails){return null;}
        let steps=[];
        applyDetails&&applyDetails.processRecords.map((item,index)=>{
            let title=item.actType==0?"申请": this.fomatStatus(item.result)
            steps.push(
                <Step key={index} title={title} description={<span>{item&&item.dealer}<br/>{formatDate(item&&item.time)}<br/>{item.reason}</span>} />
            )
        })

        return (
            <div className="content-main apply-main">
                <div className="breadcrumb">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item>功能室申请</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/apply-list-index">功能室申请记录</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>功能室申请详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>功能室申请详情</h3> */}
                </div>
                <Steps progressDot current={applyDetails.dealerPerson&&applyDetails.dealerPerson.length} className="leave-steps">
                    {steps}
                </Steps>
                <div className="content-div">
                    <Row>
                        <Col span={8}>申请人：{applyDetails&&applyDetails.applicant}</Col>
                        <Col span={8}>申请时间段：{applyDetails&&formatDate(applyDetails.startTime)}-{applyDetails&&formatDate(applyDetails.endTime)}</Col>
                        <Col span={8}>申请时间：{formatDate(applyDetails&&applyDetails.applyTime)}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>功能室名称：{applyDetails&&applyDetails.placeName}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>申请原因：{applyDetails&&applyDetails.reason}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>参会人员：{applyDetails&&applyDetails.participants}</Col>
                    </Row>
                </div>
                <div className="btn-box">
                    <Button className="btn-cancel" onClick={this.cancel.bind(this)}>返回</Button>
                </div>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(applyDetail);
