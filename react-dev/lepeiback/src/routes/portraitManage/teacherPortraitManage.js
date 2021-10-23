import React,{Component} from 'react';
import { connect } from 'dva';
import {  Button, Input, Select, TreeSelect, Upload, Form, Row, Col, Icon,Modal,message} from 'antd';
import { getPortrait} from '../../utils/img';
import ImgCutter from '../../components/imgCutter'
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class TeacherPortraitManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleUpload: false,
          previewVisible: false,
          previewImage: '',
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          list: [],
          loading: false,
          imageUrl: '',
          curPersonId: '',
          curName: '',
          fileList: [],
          pics: [],
          treeData:[],
          cropVisible: false,
          cropSrc:''
        };
    }
    componentDidMount=()=>{
       const params={
         "page":1,"prePage":20
       }
       this.search()

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
          type:'user/getDepartmentList',
          callback:(res)=>{
              if(res.code===200){
                  this.setState({treeData:res.data})
              }
          }
         })
    }
    headPicList=(params)=>{
      this.props.dispatch({
        type: 'portrait/headPicList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }
    getBase64=(file)=> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    getScoreList=(params)=>{
      this.props.dispatch({
        type: 'score/getScoreList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }
    checkImg = (file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        // message.error('图片格式仅支持JPG/PNG');
      }
      const isLt2M = file.size / 1024 < 400;
      if (!isLt2M) {
        // message.error('图片不能大于2MB!');
      }
      return isJpgOrPng && isLt2M;
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
    
    beforeUpload = (file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片格式仅支持JPG/PNG');
      }
      const isLt2M = file.size / 1024 < 400;
      if (!isLt2M) {
        message.error('图片不能大于400kB!');
        return false;
      }
      let reader = new FileReader();
        reader.readAsDataURL(file); 
        let _this = this;
        reader.onload = (e) => {
          _this.blob = undefined
          console.log(_this.blob)
          _this.setState({
            cropSrc: e.target.result,
            cropVisible: true,
          })
        }
        return new Promise((resolve, reject) => {
          let index = setInterval(() => {
            if(this.blob){  // 监听裁剪是否完成
              window.clearInterval(index);
              this.blob.uid = file.uid;   // 需要给裁剪后的blob对象设置uid，否则会报错！
              this.blob.name = file.name
              resolve(this.blob);   // 执行后续的上传操作
            }
          },100);
      });
    }

    beforeUpload1 = (file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片格式仅支持JPG/PNG');
      }
      const isLt2M = file.size / 1024 < 400;
      if (!isLt2M) {
        message.error('图片不能大于400kB!');
      }
      return isJpgOrPng && isLt2M;
    }

    handleChange = info => {
      if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          this.setState({imageUrl: info.file.response.id})
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
      }
    };
    
    // 裁剪
    handleOkCrop = (dataUrl) =>{
      this.setState({
        cropVisible: false
      });
      this.blob= dataUrl;
    }
    handleCropCancel = ()=>{
        this.setState({
          cropVisible: false
        });
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if(err){
          return
        }
        const params={
          "hasHead": values.hasHead||'',
          "personType": 2,
          "kw": values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
        }
        this.headPicList(params)
      })
    }

   
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    handleCancel=()=>{
      this.setState({
        visible: false,
        visibleUpload: false

      })
    }
    handleCancelPreView=()=>{
      this.setState({
        previewVisible: false
      })
    }
    handleOk=()=>{
      this.props.dispatch({
        type: 'portrait/updateHeadPics',
        payload: {
            pics: [
              {
                personId: this.state.curPersonId,
                pic: this.state.imageUrl
              }
            ]
        },
        callback: res=>{
            if(res.code===200){
              let oldData = this.state.list
              oldData.map(item=>{
                if(item.personId == this.state.curPersonId){
                  item.pic = this.state.imageUrl
                }
              })
              this.setState({
                visible: false,
                list: oldData
              })
              message.success("保存成功！")
            }
        }
      })
    }
    handleOk1=()=>{
      this.props.dispatch({
        type: 'portrait/updateHeadPics',
        payload: {
            pics: this.state.pics
        },
        callback: res=>{
            if(res.code===200){
              let oldData = this.state.list
              this.state.pics.map(i=>{
                oldData.map(item=>{
                  if(item.personId == i.personId){
                    item.pic =i.pic
                  }
                })
              })
              this.setState({
                visibleUpload: false,
                list: oldData
              })
              message.success("保存成功！")
            }
        }
      })
    }
    getInfo=(personId)=>{
      this.setState({
        curPersonId: personId
      })
      this.props.dispatch({
        type: 'portrait/getHeadPic',
        payload: {
          personId: personId
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                curName: res.data.personName,
                visible: true,
                imageUrl: res.data.pic
              })
            }
        }
      })
    }
    handleImgsChange = ({ fileList }) => {
      console.log(fileList.length)
      let imgs=[]
      let arr = []
      fileList.length>0&&fileList.map(item=>{
        if(item.response&&item.response.success){
          imgs.push({
            hash: item.response.id,
            name: item.name.replace(/(.*\/)*([^.]+).*/ig,"$2")
          })
        }
        this.state.list.map(i=>{
          if(i.personName == item.name.replace(/(.*\/)*([^.]+).*/ig,"$2")){
            let flag = false
            arr.map(j=>{
              if(j.name == item.name){
                flag = true
              }
            })
            if(!flag){
              if(this.checkImg(item)){
                arr.push(item)
              }
            }
          }
        })
      })
      let pics = []
      imgs.map(item=>{
        this.state.list.map(i=>{
          if(item.name == i.personName){
            pics.push({
              personId: i.personId,
              pic: item.hash
            })
          }
        })
      })
      this.setState({
        pics: pics
      })
      this.setState({ fileList: arr })
      this.setState({imgs})
      
      console.log(imgs)
      console.log(pics)
    };

    showUpload=()=>{
      this.setState({
        visibleUpload: true, 
        fileList: [],
        pics: []
      })
    }

    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })
    // 删除头像
    delPortrait = (id)=>{
      let that = this;
      confirm({
        title: '提示',
        content: '确定要删除该头像吗？',
        onOk() {
          that.setState({
            imageUrl:''
          },function(){
            that.handleOk()
          })
        },
        onCancel() {},
      });
    }
    render(){
          const qiniuToken=sessionStorage.getItem('qiniuToken');
          const props = {
              name: 'file',
              action: 'https://upload.qiniup.com/',
              accept: "image/jpg,image/jpeg,image/png",
              headers: {
                authorization: 'authorization-text',
                "Content-Disposition":'form-data; name="file";'
              },
              data: {
                  token: qiniuToken?qiniuToken:this.state.qiniuToken,
              },
              onChange: this.handleChange,
              beforeUpload: this.beforeUpload
          };
          const props1 = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            accept: "image/jpg,image/jpeg,image/png",
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data: {
                token: qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            showUploadList: false,
            onChange: this.handleChange,
            beforeUpload: this.beforeUpload
        };
          const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { list , imageUrl, fileList, previewVisible, previewImage, cropVisible, cropSrc} = this.state;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout1 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
          };
          const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
          };
          const {commonData, gradeList} = this.props;
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
          })
        return (
            <div className="content-main student-score portrait">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入教师姓名"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={7}>
                    <FormItem {...formItemLayout} label={'部门'}>
                      {getFieldDecorator("departmentId",{initialValue: undefined})(        
                        <TreeSelect
                            showSearch
                            dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                        >
                          {this.renderTreeNodes(this.state.treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                 
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'头像状态'}>
                      {getFieldDecorator("hasHead",{initialValue:''})(
                        <Select>
                          <Option value='' key=''>全部</Option>
                          <Option value='1' key='1'>有头像</Option>
                          <Option value='0' key='0'>无头像</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} >
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} >
                      <Button disabled={list.length === 0} onClick={this.showUpload.bind(this)}>批量上传头像</Button>
                  </Col>
                </Row>
              </Form>
              <Row>
                    <ul className="item-ul">
                      {
                        list&&list.map((item, index)=>{
                          return  <li key={index} onDoubleClick={this.getInfo.bind(this, item.personId)}>
                                    <img src={getPortrait(item.pic, item.sex)} className='top-name'/>
                                    <p style={{textAlign: "center"}}>
                                      {
                                        item.sex==2?<svg t="1566459574067" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2935" width="24" height="24"><path d="M 774.987 760.414 l -216.512 0 l 0 -119.588 c 67.915 -9.92716 128.833 -41.7967 175.12 -88.08 c 56.3876 -56.3839 91.3457 -134.45 91.3457 -220.442 c 0 -85.9956 -34.9582 -164.055 -91.3457 -220.449 c -56.3912 -56.3912 -134.45 -91.3385 -220.446 -91.3385 c -85.992 0 -164.055 34.9473 -220.446 91.3385 C 236.308 168.249 201.361 246.311 201.361 332.303 c 0 85.992 34.9473 164.058 91.3421 220.442 c 46.2834 46.2834 107.208 78.1529 175.116 88.08 l 0 119.588 L 251.315 760.414 c -25.0238 0 -45.3297 20.3131 -45.3297 45.3369 c 0 25.0202 20.3059 45.3333 45.3297 45.3333 L 467.819 851.084 l 0 96.9162 c 0 25.0274 20.3131 45.3333 45.3297 45.3333 c 25.0238 0 45.3297 -20.3059 45.3297 -45.3333 l 0 -96.9162 l 216.512 0 c 25.0166 0 45.3333 -20.3131 45.3333 -45.3333 C 820.32 780.727 800.003 760.414 774.987 760.414 Z M 513.149 553.432 c -61.0188 0 -116.362 -24.7962 -156.346 -64.7794 c -39.9832 -39.9832 -64.7794 -95.3339 -64.7794 -156.349 c 0 -61.0188 24.7962 -116.362 64.7794 -156.346 c 39.9832 -39.9868 95.3303 -64.783 156.346 -64.783 s 116.362 24.7962 156.342 64.783 c 39.9832 39.9832 64.7902 95.3303 64.7902 156.346 c 0 61.0152 -24.8034 116.366 -64.7902 156.349 C 629.511 528.636 574.164 553.432 513.149 553.432 Z" p-id="2936" fill="#fe76a4"></path></svg>:<svg t="1566459217687" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2435" width="24" height="24"><path d="M614.725125 60.260157c3.850928-1.130713 6.087067-1.788189 6.939618-2.037451C620.64963 58.515318 617.983603 59.302843 614.725125 60.260157z" p-id="2436" fill="#0ec5f4"></path><path d="M871.234488 313.576067c-99.954336-340.066549 24.210993 82.35061-75.743343-257.705101-7.282805-24.763706-33.289212-38.957229-58.052918-31.678036-66.332774 19.496677-103.563226 30.438947-123.193565 36.208114 0.169788-0.050575 0.3179-0.093925 0.480463-0.1445-14.171848 4.168828-51.593763 15.168899-134.988386 39.679729-24.763706 7.279193-38.953616 33.281987-31.674423 58.049305 7.282805 24.760093 33.281987 38.953616 58.045693 31.678036 103.639088-30.464235 124.956467-36.728314 128.547294-37.786778-0.04335 0.010838 0.032513-0.010838 0.0578-0.01445 0.0867-0.025288 0.2312-0.068638 0.437113-0.126438-0.122825 0.032513-0.2601 0.07225-0.3757 0.104763 0.195075-0.0578 0.343188-0.10115 0.422663-0.126438 0.007225 0 0.007225 0 0.007225 0 0.079475-0.025288 0.0578-0.01445 0.0578-0.01445 1.365526-0.400988 5.360954-1.575051 15.479574-4.548141-96.468271 176.947605 4.631228-6.936005-115.043759 212.407931-105.398377-26.86257-220.265124 2.239752-304.552036 86.530276-58.168518 58.175743-94.224907 138.694814-94.224907 227.388979 0 88.712227 36.060001 169.231299 94.224907 227.396204 58.168518 58.175743 138.687589 94.224907 227.396204 94.224907 88.70139 0 169.220461-36.049164 227.388979-94.224907 58.175743-58.168518 94.224907-138.687589 94.224907-227.396204 0-88.694165-36.049164-169.213236-94.224907-227.388979-19.738714-19.738714-41.12473-36.399577-63.612559-50.047612 150.637748-276.10719-21.898991 38.642941 113.873308-210.269329 5.574092 18.940351 7.109405 24.19293 7.452593 25.341706 0.780301 2.644352 6.459155 21.989304 37.859028 128.832682 7.282805 24.760093 33.289212 38.953616 58.052918 31.678036C864.327383 364.338954 878.513681 338.33616 871.234488 313.576067zM686.639215 673.478868c0 62.944246-25.576519 120.03985-66.820461 161.283793s-98.339547 66.820461-161.276568 66.820461c-62.944246 0-120.032625-25.576519-161.272956-66.820461s-66.820461-98.339547-66.820461-161.283793c0-62.937021 25.580131-120.0254 66.820461-161.265731 41.243943-41.243943 98.32871-66.824074 161.272956-66.824074 62.937021 0 120.032625 25.580131 161.276568 66.824074C661.062697 553.453468 686.639215 610.541847 686.639215 673.478868z" p-id="2437" fill="#0ec5f4"></path><path d="M546.250138 356.882749c-0.755013 0.223975-1.300501 0.382925-1.640076 0.480463C544.985762 357.254837 545.56015 357.085049 546.250138 356.882749z" p-id="2438" fill="#0ec5f4"></path><path d="M547.113526 356.626261c-0.30345 0.090313-0.59245 0.1734-0.863388 0.252875C546.51385 356.806886 546.792013 356.723799 547.113526 356.626261z" p-id="2439" fill="#0ec5f4"></path><path d="M552.452805 355.058435c-0.010838 0-0.018063 0.003613-0.0289 0.007225C552.434742 355.06566 552.441967 355.062048 552.452805 355.058435z" p-id="2440" fill="#0ec5f4"></path><path d="M552.423905 355.06566c-2.286714 0.671925-4.035165 1.188513-5.310379 1.560601C548.731927 356.149411 550.736866 355.564185 552.423905 355.06566z" p-id="2441" fill="#0ec5f4"></path><path d="M544.534199 357.384887c-0.140888 0.039738-0.238425 0.07225-0.307063 0.090313C544.299386 357.453524 544.396924 357.424624 544.534199 357.384887z" p-id="2442" fill="#0ec5f4"></path><path d="M544.610061 357.363212c-0.0289 0.007225-0.050575 0.01445-0.075863 0.021675C544.563099 357.377662 544.581161 357.374049 544.610061 357.363212z" p-id="2443" fill="#0ec5f4"></path><path d="M561.339561 394.770677c-0.007225 0-0.01445 0.003613-0.025288 0.007225 0.01445-0.003613 0.032513-0.007225 0.054188-0.01445C561.357624 394.763452 561.350399 394.767064 561.339561 394.770677 561.317886 394.774289 561.346786 394.767064 561.339561 394.770677z" p-id="2444" fill="#0ec5f4"></path><path d="M544.227136 357.475199C544.111536 357.511324 544.104311 357.511324 544.227136 357.475199L544.227136 357.475199z" p-id="2445" fill="#0ec5f4"></path></svg> 
                                        }
                                      &nbsp;&nbsp;{item.personName}
                                    </p>
                                  </li>
                        })
                      }
                     
                    </ul>
              </Row>
              <Modal
                 title="头像管理"
                 visible={this.state.visible}
                 onOk={this.handleOk.bind(this)}
                 onCancel={this.handleCancel.bind(this)}
               >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label={'姓名'}>
                      {/* {getFieldDecorator("deviceNo",{rules:[{required:true, message:'请输入设备号',whitespace: true}]})( */}
                        <Input value={this.state.curName||''} disabled />
                      {/* )} */}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout1} label={'头像'}>
                    <Upload
                      action="https://upload.qiniup.com/"
                      accept="image/jpg,image/jpeg,image/png"
                      listType="picture-card"
                      showUploadList={false}
                      multiple={true}
                      {...props1}
                    >
                      {imageUrl ? <img src={getPortrait(imageUrl)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                      {imageUrl ? <p><Button onClick={this.delPortrait.bind(this,this.state.curPersonId)}>删除头像</Button></p>:null}
                      支持扩展名：支持JPG/PNG<br/>
                      图片大小：不超过400kB
                    </FormItem>
                  </Col>
                </Row>
              </Form>    
               </Modal>

               <Modal
                 className="upload-imgs-modal"
                 title="批量上传头像"
                 visible={this.state.visibleUpload}
                 onOk={this.handleOk1.bind(this)}
                 onCancel={this.handleCancel.bind(this)}
               >
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem {...formItemLayout2} label={'头像'}>
                      <Upload
                            action="https://upload.qiniup.com/"
                            accept="image/jpg,image/jpeg,image/png"
                            listType="picture-card"
                            fileList={fileList}
                            multiple={true}
                            beforeUpload={this.beforeUpload1}
                            onPreview={this.handlePreview}
                            onChange={this.handleImgsChange}
                            data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                        >
                            {fileList.length >= 24 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreView}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      支持扩展名：支持JPG/PNG<br/>
                      图片大小：不超过400kB
                    </FormItem>
                  </Col>
                </Row>
              </Form>    
              </Modal> 
              <Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel} width={500}>
                <ImgCutter aspectRatio={16/16} src={cropSrc} onOk={this.handleOkCrop} />
              </Modal>
              </div>  
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(TeacherPortraitManage));
