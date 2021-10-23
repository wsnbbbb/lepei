import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,Steps, Popover,Divider, Menu, Dropdown,Icon,Breadcrumb,Tabs,message,Modal,DatePicker,InputNumber } from 'antd';

import { routerRedux } from 'dva/router';
import {getGradeType, formatDate} from '../../utils/public';
import { getImg } from '../../utils/img';
import ImgPreview from '@/components/imgPreview'
import './style.less';

const Step = Steps.Step;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>步骤 {index+1}</span>}>
    {dot}
  </Popover>
);


class studentLeaveDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          detailData: "",
          licenceUrl:"",
          previewVisible: false,
			    title:"请假详情",
        };
    }
    componentDidMount=()=>{
      
      this.getDetail();
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-leave"
        },
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

    getDetail = ()=>{
      const params={
        "id": this.props.match.params.id,
      }
      this.props.dispatch({
        type:'studentLeave/leaveRecordDetail',
        payload: params,
        callback: (res)=>{
          this.setState({
            "detailData": res.data
          })
        }
      })
    }
 
    generateType = (type, result)=>{
      if(type==0){
        return "申请"
      }else if(type==1){
        if(result==0){
          return "不通过"
        }else if(result==1){
          return "通过"
        }
      }else if(type==2){
        return "撤回"
      }else if(type==3){
        return "删除"
      }else if(type==4){
        return "其他"
      }
    }
   
    render(){
        const detail = this.state.detailData
        const steps = detail.examineRecords&&detail.examineRecords.map((item, index)=>{
          let des = <div>
                      {item.dealer}
                      <br/>
                      {formatDate(item.time)}
                    </div>
          return  <Step title={this.generateType(item.actType, item.result)} description={des} key={index} />
        })

        return (
            <div className="content-main student-leave-detail">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-leave">学生请假管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>请假详情</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
                 
              <Row className="progress-row">
                <Steps current={this.state.detailData&&this.state.detailData.examineRecords.length} progressDot={customDot}>
                   {steps}
                </Steps>
              </Row>
              <div className="detail-info">
                <Row>
                  <Col span={8}>请假人员：{this.state.detailData.studentName}</Col>
                  <Col span={8}>开始日期：{formatDate(this.state.detailData.startTime)}</Col>
                  <Col span={8}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期：{formatDate(this.state.detailData.endTime)}</Col>
                </Row>
                <Row>
                  <Col span={8}>请假类型：{this.state.detailData.typeName}</Col>
                  <Col span={8}>请假时长：{this.state.detailData.days&&parseFloat(this.state.detailData.days)}&nbsp;&nbsp;天</Col>
                  <Col span={8}>请假人手机号：{this.state.detailData.telephone}</Col>
                </Row>
                <Row>
                  <Col span={8}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年级：{this.state.detailData.gradeName}</Col>
                  <Col span={8}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班级：{this.state.detailData.className}</Col>
                </Row>
                <Row>
                  <Col span={24}>请假原因：{this.state.detailData.reason}</Col>
                </Row>
              </div>
              <div className="detail-pic">
                  <ul className="imgs-wrap">
                      {
                        detail.pictures&&detail.pictures.map((i, index)=>{
                          return <li key={index} onClick={this.showImg.bind(this, i)}>
                                  <img src={getImg(i&&i)} className="leave-imgs"/>
                                </li>
                        })
                      }
                  </ul>
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
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
 
  }
}

export default connect(mapStateToProps)(Form.create()(studentLeaveDetail));
