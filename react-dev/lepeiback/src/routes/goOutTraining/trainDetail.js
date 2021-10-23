import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button,  } from 'antd';
import { getQueryString, onlyDate, formatDate, getTrainLevel} from '../../utils/public';
import ImgPreview from '../../components/imgPreview';
import { Link } from 'dva/router';
import { log } from 'util';
import './style.less';


class TrainDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            personName: "",
            trainLevel: "",
            days: "",
            trainTime: "",
            organizer: "",
            trainTopic: "",
            submitTime: "",
            trainStyle: "",
            trainPlace: "",
            trainFeelings: "",
            pictures: [], //图片列表
            previewVisible:false,
            licenceUrl:'',
            title:'培训详情'
        }
         
    }
    componentDidMount=()=>{
        const id=getQueryString('id');
        this.props.dispatch({ //获取培训详情
            type:'train/getTrainDetail',
            payload:{id},
            callback:(res)=>{ 
                console.log({res});
                if(res.code === 200){ 
                    this.setState({
                        personName:res.data.personName,
                        trainLevel:res.data.trainLevel,
                        days:res.data.days,
                        trainTime:onlyDate(res.data.trainTime),
                        organizer:res.data.organizer,
                        pictures:res.data.pictures,
                        trainTopic:res.data.trainTopic,
                        submitTime:formatDate(res.data.submitTime),
                        trainStyle:res.data.trainStyle,
                        trainPlace:res.data.trainPlace,
                        trainFeelings:res.data.trainFeelings,
                    })
                }
            }
        })

        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/goOut-training"
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
            licenceUrl: url
        })
    }
    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    } 
    render(){
      const {personName, trainLevel, days, trainTime, organizer, trainTopic, submitTime, trainStyle, trainPlace, trainFeelings, pictures} = this.state
     
        return (
            <div className="train-detail">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/goOut-training">外出培训明细</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>培训详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <h3 className="title">基础信息</h3>
                <div className="content-main info">
                    <p>参培者：<span>{personName}</span></p>
                    <p>培训日期：<span>{trainTime}</span></p>
                    <p>提交时间：<span >{submitTime}</span></p>
                </div>
                <h3 className="title">培训摘要</h3>
                <div className="content-main info">
                    <p>培训等级：<span>{getTrainLevel(trainLevel)}</span></p>
                    <p>培训时长：<span>{days}&nbsp;天</span></p>
                    <p>培训形式：<span>{trainStyle}</span></p>
                    <p>主办单位：<span>{organizer}</span></p>
                    <p>培训地点：<span>{trainPlace}</span></p>
                </div>
                <h3 className="title">培训内容</h3>
                <div className="content-main" style={{marginBottom:"80px"}}>
                    <div className="main">
                        <p>培训主题：<span>{trainTopic}</span></p>
                        <div className="theme">
                            <p>培训心得：</p>
                            <p>{trainFeelings}</p>
                        </div>
                    
                        <div className="pic">
                            <span>图片：</span>
                            <div className="imgs">
                                {
                                    pictures&&pictures.map((item,index) =>{
                                        return <img key={index} src={item.url} alt="" onClick={this.showImg.bind(this,item.url)}/>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-main btn">
                    <Button type="primary" style={{marginRight:'30px'}}><Link to="/goOut-training">返回</Link></Button>
                </div>
                <ImgPreview
                    visible={this.state.previewVisible}  // 是否可见
                    onClose={this.closePreview} // 关闭事件
                    src={this.state.licenceUrl} // 图片url
                    picKey={"currentKey"} // 下载需要的key，根据自己需要决定
                    isAlwaysCenterZoom={false} // 是否总是中心缩放，默认false，若为true，每次缩放图片都先将图片重置回屏幕中间
                    isAlwaysShowRatioTips={false} // 是否总提示缩放倍数信息，默认false，只在点击按钮时提示，若为true，每次缩放图片都会提示
                >
                </ImgPreview>
            </div>
        )  
    }
}

const mapStateToProps = (state) => {
  return {
     
  }
}
export default connect(mapStateToProps)(TrainDetail);
