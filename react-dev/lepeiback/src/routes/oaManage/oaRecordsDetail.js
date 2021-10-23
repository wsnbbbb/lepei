import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb, Row,Col,Steps , Button, Upload, Icon, Modal, Form, Select, Input, message } from 'antd';
import {Link} from "dva/router";
import ImgPreview from '../../components/imgPreview';
import {getQueryString,onlyDate,formatDate} from '../../utils/public';
import {getImg} from '../../utils/img';
import "./style.less";

const { TextArea } = Input;
const Step = Steps.Step;
const FormItem = Form.Item;
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
class OaRecordsDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            previewVisible: false,
            list: [],
            fileList: [],
            imgs: [],
            resultDetails: '',
			title:"通用OA申请详情",

        };
    }
    componentDidMount=()=>{ 
        this.getDetail()
        sessionStorage.removeItem("qiniuToken");
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res)=>{
                if(res.code===200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/oa-record-list"
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

    getDetail = ()=>{
        const id = this.props.match.params.id
        this.props.dispatch({
            type:"oa/getOaRecordsDetail",
            payload:{"id":id},
            callback: res=>{
                if(res.code === 200){
                    this.setState({
                        resultDetails: res.data
                    })
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
    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
          return new Promise((resolve, reject)=>{
              reject(file)
          })
        }
    
    }
    handleImgsChange = ({ fileList }) => {
        console.log(fileList.length)
        this.setState({ fileList })
        let imgs=[]
        fileList.length>0&&fileList.map(item=>{
          if(item.response&&item.response.success){
            imgs.push(item.response.id)
          }
        })
        this.setState({imgs})
        console.log(imgs)
    };
    
    handleCancelPreView=()=>{
        this.setState({
        previewVisible: false
        })
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
    };
    handleCancel =()=>{
        this.props.form.resetFields(['reason']);
        this.setState({
          visible: false,
          imgs: [],
          fileList: []
        }) 
    }
    handleOk =()=>{
        let params = {
          id: this.props.match.params.id, 
          reason: this.props.form.getFieldValue("reason")||'',
          images: this.state.imgs
        }
        this.props.dispatch({
          type:'oa/endOaRecord',
          payload: params,
          callback: res=>{
            if(res.code===200){
              message.success("操作成功！")
              this.props.form.resetFields(['reason']);
              this.setState({
                visible: false,
                imgs: [],
                fileList: []
              })
              this.getDetail()
            }
          }
        })
      }
    closePreview=()=>{
        this.setState({
            previewVisible: false
        })
    }
    back=()=>{
        window.history.go(-1)
    }
    save=()=>{
        window.history.go(-1)
    }
    showModal=()=>{
        this.setState({
            visible: true
        })
    }
    render(){
        const {list, fileList, previewVisible, previewImage} = this.state;
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const { getFieldDecorator } = this.props.form;
        const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16}
        };
        // const { getFieldDecorator } = this.props.form;
        const {resultDetails} = this.state;
        if(!resultDetails){return null;}
        let steps=[];
        resultDetails&&resultDetails.examineRecords.map((item,index)=>{
          
            let title=item.actType==1&&!item.dealStatus?"发起申请":(item.result==1?"通过":item.result==2?"通过":item.result==0?"结束":"")
            
            steps.push(
                <Step key={index} title={title} description={
                <span>
                    {item&&item.dealer}<br/>
                    {formatDate(item&&item.time)}<br/>
                    {item.reason}<br/>
                    {
                        item.images&&item.images.split(",").map((i, idx)=>{
                            return  <div className="img-div" key={idx}>
                                        <img src={getImg(i)} onClick={this.showImg.bind(this,i)}/><br/>
                                    </div>
                        })
                    }
                    
                </span>} />
            )
        })
        const imgs=resultDetails&&resultDetails.pics?resultDetails.pics.split(','):[]
        let imgData=[]
        imgs.length>0&&imgs.map(item=>{
            imgData.push(<img src={getImg(item)} className='des-img' onClick={this.showImg.bind(this,item)}/>)
        })
        
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        return (
            <div className="content-main questionnaire">
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/oa-record-list">OA申请记录</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>通用OA申请详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Steps style={{padding: "30px 0"}} progressDot current={resultDetails.examineRecords&&resultDetails.examineRecords.length} className="leave-steps">
                    {steps}
                    {/* {resultDetails&&resultDetails.dealerPerson.length==1?<Step title="待审核" />:null} */}
                </Steps>

                <h3>基础信息</h3>
                <div style={{padding: "20px 10px 20px 100px"}}>
                    <Row style={{padding: '10px 0'}}>
                        <Col span={8}>流程名称：{resultDetails&&resultDetails.processName}</Col>
                    </Row>
                    <Row style={{padding: '10px 0'}}>
                        <Col span={8}>&nbsp;&nbsp;&nbsp;&nbsp;申请人：{resultDetails&&resultDetails.applicant}</Col>
                    </Row>
                </div>
                 
                <h3>申请内容</h3>
                <div style={{padding: "20px 10px 20px 100px"}}>
                    {
                        resultDetails&&resultDetails.applyContents.map((item, index)=>{
                            return <Row style={{paddingBottom: '30px'}} key={index}>
                                <h4>{index+1}：{item.title}</h4>
                                {
                                    item.type!=6&&item.type!=7?item.answers&&item.answers.map((i, idx)=>{
                                        return <p key={i} style={{padding: "10px 0"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回答：{i}</p>
                                    }):null
                                }
                                 {
                                    (item.type==6||item.type==7)?item.answers&&item.answers.map((i, idx)=>{
                                        return  <div key={idx} className="img-box">
                                                    <img src={getImg(i)} onClick={this.showImg.bind(this, i)}/>
                                                </div>
                                    }):null
                                }
                                {/* <p> &nbsp;&nbsp;&nbsp;&nbsp;回答：34343434</p>
                                <p> &nbsp;&nbsp;&nbsp;&nbsp;回答：34343434</p> */}
                            </Row>
                        })
                    }
                   
                    {/* <Row>
                       <h4>1：wrwrwrw推推</h4>
                       <p> &nbsp;&nbsp;&nbsp;&nbsp;回答：34343434</p>
                       <p> &nbsp;&nbsp;&nbsp;&nbsp;回答：34343434</p>
                    </Row> */}
                 

                    <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                        <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button style={{display: resultDetails&&resultDetails.status==3?"inline-block":"none"}} type="primary" onClick={this.showModal.bind(this)}>操作</Button>
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
                <Modal
                className="modal-oaManage"
                title="操作"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                  <Form {...formItemLayout2} onSubmit={this.handleSubmit}>
                    <Form.Item label="操作">
                        {getFieldDecorator('option', {
                          initialValue: "",
                        })(
                          <Select disabled={true}>
                              <Option value="">结束</Option>
                          </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('reason', {
                          initialValue: "",
                          rules: [
                            {
                              required: false,
                              message: '',
                            },
                          ],
                        })(
                          <TextArea rows={4} placeholder="请输入备注" />
                      )}
                    </Form.Item>
                    <FormItem {...formItemLayout2} label={'图片'}>
                      <Upload
                            action="https://upload.qiniup.com/"
                            accept="image/jpg,image/jpeg,image/png"
                            listType="picture-card"
                            fileList={fileList}
                            multiple={true}
                            beforeUpload={this.beforeUpload}
                            onPreview={this.handlePreview}
                            onChange={this.handleImgsChange}
                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                        >
                            {fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreView}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                       
                    </FormItem>
                    <FormItem {...formItemLayout2} label={'提示'}>
                        <p>最大2MB，支持JPG/PNG格式</p>
                    </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    //   resultDetails:state.leave.resultDetails
  }
}
export default connect(mapStateToProps)(Form.create()(OaRecordsDetail));
