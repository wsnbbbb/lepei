import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Steps  } from 'antd';
import {Link} from "dva/router";
import ImgPreview from '../../components/imgPreview';
import {getQueryString, formatDate, formatPhone} from '../../utils/public';
import {getImg} from '../../utils/img';
import "./style.less";

const Step = Steps.Step;

class HonorDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            honorDetails: {},
            title:"荣誉详情",

        };
    }
    componentDidMount=()=>{ 
        const id=getQueryString("id");
        this.props.dispatch({
            type:"honor/personHonorRecordsDetail",
            payload:{"id":id},
            callback: res=>{
                if(res.code ===200){
                    this.setState({
                        honorDetails: res.data
                    })
                }
            }
        })
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/student-honor"
            },
          })
    }

    componentWillUnmount = () => {
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
    render(){
        // const {honorDetails} = this.props;
        const {honorDetails} = this.state;
        if(!honorDetails){return null;}
        let steps=[];
        // honorDetails&&honorDetails.dealerPerson.map((item,index)=>{
        //     let title=item.actType==1&&!item.dealStatus?"发起申请":(item.dealStatus==1?"通过":"不通过")
        //     steps.push(
        //         <Step key={index} title={title} description={<span>{item&&item.dealerName}<br/>{formatDate(item&&item.createTime)}<br/>{item.reason}</span>} />
        //     )
        // })
        const imgs=honorDetails&&honorDetails.imgs||[]
        let imgData=[]
        imgs.length>0&&imgs.map(item=>{
            imgData.push(<img src={getImg(item)} className='des-img' onClick={this.showImg.bind(this,item)}/>)
        })
        return (
            <div className="content-main student-honor">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-honor">学生荣誉</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>荣誉详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Steps progressDot current={honorDetails.dealerPerson&&honorDetails.dealerPerson.length} className="leave-steps">
                    {/* {steps} */}
                    {/* {honorDetails&&honorDetails.dealerPerson.length==1?<Step title="待审核" />:null} */}
                </Steps>
                <div className="honor-detail-row">
                    <Row>
                        学生姓名：{honorDetails&&honorDetails.students}
                    </Row>
                    <Row>
                        班级：{honorDetails&&honorDetails.classNames}
                    </Row>
                    <Row>
                        奖项名称：{honorDetails&&honorDetails.title}
                    </Row>
                    <Row>
                        颁奖单位：{honorDetails&&honorDetails.awardOrg}
                    </Row>
                    <Row>
                        奖项等级：{honorDetails&&honorDetails.levelTitle}
                    </Row>
                    <Row>
                        奖项类别：{honorDetails&&honorDetails.typeName}
                    </Row>
                    <Row>
                        获奖时间：{honorDetails&&honorDetails.awardDate}
                    </Row>
                    <Row>
                        上传人：{honorDetails.publisherType&&(honorDetails.publisherType==1?formatPhone(honorDetails.publisherName):honorDetails.publisherName+'老师')}
                    </Row>
                    <Row>
                        上传时间：{honorDetails&&formatDate(honorDetails.createTime)}
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
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    //   honorDetails:state.leave.honorDetails
  }
}
export default connect(mapStateToProps)(HonorDetail);
