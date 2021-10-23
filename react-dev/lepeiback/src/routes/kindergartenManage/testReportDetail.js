import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Breadcrumb, Form, Row, Col} from 'antd';
import { getImg } from '../../utils/img';
import { getQueryString, notSeconds } from '../../utils/public';
import './style.less';
import ImgPreview from '@/components/imgPreview'


class TestReportDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
        publisherName:'',
        createTime:'',
        pics:[],
        previewVisible: false,
        licenceUrl:"",
      };
  }
  componentDidMount=()=>{
    this.getTestReportDetail()
  
  }
  
  // 详情列表
  getTestReportDetail = (params) =>{
    let reportId = getQueryString("reportId")
    this.props.dispatch({
      type:'kindergartenManage/getTestReportDetail',
      payload:{"id":reportId},
      callback:(res) =>{
        if(res.code === 200){
          this.setState({
            publisherName:res.data.publisherName,
            content:res.data.content,
            createTime:notSeconds(res.data.createTime),
            pics:res.data.pics,
          })
        }
      }
    })
  }

  // 图片预览
  showImg = (url) => {
    this.setState({
      previewVisible: true,
      licenceUrl: getImg(url)
    })
  }

  // 关闭预览
  closePreview = () => {
    this.setState({
      previewVisible: false
    })
  }
  // 返回
  goBack = () =>{
    window.history.go(-1)
  }
  
  render(){
    const { publisherName , content, createTime, pics} = this.state;
    let reportType = getQueryString("type")
    return (
      <div className="content-main test-report-detail">
        <Breadcrumb className="Breadcrumb">
          <Breadcrumb.Item><a onClick={this.goBack.bind(this)}>{reportType == 1 ? "测评报告" : (reportType == 2 ? "成长评估" : (reportType == 3 ? "给宝宝的话" : ''))}</a></Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb> 
        <div className="detailList">
          <Row gutter={24} >
            <Col span={10}>发布者：{publisherName}</Col>
            <Col span={10}>时间：{createTime}</Col>
          </Row>
          <Row gutter={24} className="content">
            <Col span={2} className="title">内容：</Col>
            <Col span={20}>{content}
              <div className="imgs">
                {
                  pics && pics.length > 0 && pics.map(item =>{
                    return <div key={item} className="imgBox" onClick={this.showImg.bind(this,item)}><img src={getImg(item)} alt=""/></div>
                  })
                }
              </div>
            </Col>
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
        <div className="btn">
          <Button type="primary" onClick={this.goBack.bind(this)}>返回</Button>
        </div>
      </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(TestReportDetail));
