import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Steps,Button  } from 'antd';
import {Link} from "dva/router";
import {getQueryString,formatDate,getApplyStatus} from '../../utils/public';
import "./style.less";

const Step = Steps.Step;

class RoomApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title:'教室申请详情'
        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString("id");
        this.props.dispatch({
            type:"room/getRoomApplyDetail",
            payload:{"id":id}
        })

        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/room-manage"
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
    
    render(){
        const {roomDetails} = this.props;
        if(!roomDetails){return null;}
        let steps=[];
        roomDetails&&roomDetails.examineRecords.map((item,index)=>{
            let title=item.actType==2?(item.result==1?"通过":"不通过"):(item.actType==0?"发起申请":(item.actType==1?"撤销":(item.actType==3?"结束使用":"")))
            steps.push(
                <Step key={index} title={title} description={<span>{item&&item.dealer}<br/>{formatDate(item&&item.time)}<br/>{item.reason}</span>} />
            )
        })
        
        return (
            <div className="room-main">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/room-manage">教室申请</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>教室申请详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Steps progressDot current={roomDetails.examineRecords&&roomDetails.examineRecords.length} className="leave-steps">
                    {steps}
                    {/* {roomDetails&&roomDetails.examineRecords.length<=1?<Step title="待审核" />:null} */}
                </Steps>
                <div className="leave-card">
                    <Row>
                        <Col span={12}>申请人：{roomDetails&&roomDetails.applicant}</Col>
                        <Col span={12}>功能室/教室：{roomDetails&&roomDetails.roomName}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>申请时间：{formatDate(roomDetails&&roomDetails.applyTime)}</Col>
                        <Col span={12}>审批状态：{getApplyStatus(roomDetails&&roomDetails.status)}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>开始时间：{formatDate(roomDetails&&roomDetails.startTime)}</Col>
                        <Col span={12}>结束时间：{formatDate(roomDetails&&roomDetails.endTime)}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>申请事由：{roomDetails&&roomDetails.reason}</Col>
                    </Row>
                    <Row style={{marginTop:80}}>
                        <Col span={2} offset={10}><Button><Link to="/room-manage">返回</Link></Button></Col>
                    </Row>
                </div>
            </div> 
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
      roomDetails:state.room.saveDetails
  }
}
export default connect(mapStateToProps)(RoomApplyDetail);
