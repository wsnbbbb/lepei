/**
 * 幼儿活动模板编辑-route
 */
import React, { Component } from "react";
import { Input,InputNumber, Form, Row, Col, Button, Radio,Tag,Upload,Select,Icon,message,TreeSelect } from "antd";

import { connect } from "dva";
import "./style.less";
import { getQueryString} from '../../utils/public';
import { getImg } from "../../utils/img";

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;


class ChildrensActivitiesTempEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: require("history/createHashHistory"),
      id:"",
      title:"",
      allClassArr:[],
      formData: {typeContent:[],statusContent:[],isType:"1",isStatus:"1"},
      imgPath:"",
      qiniuToken:"",
      fileList:[],
      uploading:false,
      typeTags:{
        inputValue:"",
        inputVisible:false
      },
      stateTags:{
        inputValue:"",
        inputVisible:false
      }
    };
  }

  componentDidMount = async () => {
    const id = getQueryString("id");
    let title = "添加模板";
    if(id){
      title = "修改模板";
    }

    //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:title,
        parentRoute:"/childrens-activities"
      },
    })
    let that = this;
    that.setState({id:id || "",title});
    await that.getAllClass();
    setTimeout(() => {
      if(id){
        that.getTempData(id);
      }
    },300);


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
  };

  componentWillUnmount = () =>{
    //组件卸载时，清空手动加入的面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {},
    })
  }

  getAllClass = () => {
    this.props.dispatch({
      // type: "childrensActivities/getAllClass",
      type:'user/getClassByGrade',
      payload: {},
      callback: (res) => {
        if (res.code === 200) {
          let allClassArr = res.data;
          allClassArr.forEach(ele => {
            ele.key = ele.gradeId+"-1";
            ele.value = ele.gradeId+"-1";
            ele.title = ele.gradeName;
            ele.disabled = true;
            ele.disableCheckbox = true;
            if(ele.classData && ele.classData.length > 0){
              this.getGradeClassChild(ele);
            }
          })
          this.setState({
            allClassArr
          });
        }
      },
    });
  }

  getGradeClassChild = (ele) =>{
    ele.children = ele.classData;
    ele.children.forEach(ty => {
      ty.key = ty.classId;
      ty.value = ty.classId;
      ty.title = ele.gradeName+ty.className;
      ty.isLeaf = true;
      if(ty.classData && ty.classData.length > 0){
        this.getGradeClassChild(ty);
      }
    })
  }

  getTempData = (id) => {
    let that = this;
    that.props.dispatch({
      type: "childrensActivities/getChildActivityTemplateDetail",
      payload: {id:id},
      callback: (res) => {
        if (res.code === 200) {
          let classIds = res.data.classes.map(ele => ele.classId);
          res.data.classIds = classIds;
          if(!res.data.typeContent) res.data.typeContent = [];
          if(!res.data.statusContent) res.data.statusContent = [];
          Object.keys(res.data).forEach(ele => {
            if(typeof res.data[ele] === "number"){
              res.data[ele] = res.data[ele] + "";
            }
          });
          let fileList = [];
          if(res.data.logo){
            let logo = getImg(res.data.logo);
            fileList.push({
              uid: '-1',
              name:"",
              status: 'done',
              url: logo,
            });
          }
          that.setState({
            formData: res.data,
            imgPath:res.data.logo || "",
            fileList
          });
        }
      },
    });
  }

  handleSave = (e) => {
    let that = this;
    that.props.form.validateFields().then(values => {
      if(that.state.uploading){
        message("正在上传logo，请等待上传完成。",3);
        return false;
      }
      let params = {...values};
      if(that.state.imgPath){
        params.logo = that.state.imgPath;
      }else {
        return false;
      }
      params.typeContent = that.state.formData.typeContent;
      params.statusContent = that.state.formData.statusContent;
      if(params.isType && !params.typeContent){
        message.error("请添加类型",3);
        return false;
      }
      if(params.isStatus && !params.statusContent){
        message.error("请添加状态",3);
        return false;
      }
      let types = "childrensActivities/addChildActivityTemplate";
      if(that.state.id){
        params.id = that.state.id;
        types = "childrensActivities/modChildActivityTemplate";
      }
      that.props.dispatch({
        type: types,
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.handleCancel();
          }
        }
      });
    });
  }

  handleCancel = () =>{
    let formData = {};
    formData.typeContent = [];
    formData.statusContent = [];
    formData.isType = "1";
    formData.isStatus = "1";
    this.setState({
      formData,
      id:"",
      fileList:[]
    })
    this.props.form.resetFields();
    this.state.history().goBack();
  }

  removeTypeTag = (tag) => {
    let formData = this.state.formData;
    let tags = formData.typeContent.filter(ele => ele !== tag);
    formData.typeContent = tags;
    this.setState({
      formData
    })
  }
  removeStateTag = (tag) => {
    let formData = this.state.formData;
    let tags = formData.statusContent.filter(ele => ele !== tag);
    formData.statusContent = tags;
    this.setState({
      formData
    })
  }

  saveTypeInputRef = input => (this.typeInput = input);

  saveStateInputRef = input => (this.stateInput = input);

  showTypeInput = () => {
    let {typeTags} = this.state;
    typeTags.inputVisible = true;
    this.setState({ typeTags }, () => {this.typeInput.focus()});
  };

  showStateInput = () => {
    let {stateTags} = this.state;
    stateTags.inputVisible = true;
    this.setState({ stateTags }, () => {this.stateInput.focus()});
  };

  handleTypeInputChange = e => {
    let {typeTags} = this.state;
    typeTags.inputValue = e.target.value;
    this.setState({ typeTags });
  };
  handleStateInputChange = e => {
    let {stateTags} = this.state;
    stateTags.inputValue = e.target.value;
    this.setState({ stateTags });
  };

  handleTypeInputConfirm = () => {
    const { typeTags } = this.state;
    let formData = this.state.formData;
    if (typeTags.inputValue && formData.typeContent.indexOf(typeTags.inputValue) === -1) {
      formData.typeContent = [...formData.typeContent, typeTags.inputValue];
    }
    typeTags.inputValue = "";
    typeTags.inputVisible = false;

    this.setState({
      formData,typeTags
    });
  };

  handleStateInputConfirm = () => {
    let stateTags = this.state.stateTags;
    let formData = this.state.formData;
    if (stateTags.inputValue && formData.statusContent.indexOf(stateTags.inputValue) === -1) {
      formData.statusContent = [...formData.statusContent, stateTags.inputValue];
    }

    stateTags.inputValue = "";
    stateTags.inputVisible = false;

    this.setState({
      formData,stateTags
    });
  };

  isTypeChange = (e) => {
    let value = e.target.value;
    let {formData} = this.state;
    formData.isType = value;
    this.setState({formData})
  }
  isStateChange = (e) => {
    let value = e.target.value;
    let {formData} = this.state;
    formData.isStatus = value;
    this.setState({formData})
  }

  render() {
    const { formData,allClassArr,fileList,typeTags,stateTags } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    // let classOptions = [];
    // allClassArr.forEach(ele => {
    //   classOptions.push(<Option key={ele.classId + ""}>{ele.className}</Option>)
    // });

    const tProps = {
      treeData:allClassArr,
      treeDefaultExpandAll:true,
      // value: this.state.value,
      // onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择适用班级',
      filterTreeNode:function(inputValue,treeNode){
        // let filterStr = treeNode.props.gradeName || "" + treeNode.props.className || "";
        return treeNode.props.title.indexOf(inputValue) !== -1
      },
      style: {
        width: '100%',
      },
    };

    let typeTagOption = formData.typeContent && formData.typeContent.map((tag, index) => {
      const tagElem = (
        <Tag key={"type"+index} closable={true} onClose={this.removeTypeTag.bind(this,tag)}>
          {tag}
        </Tag>
      );
      return (tagElem);
    })
    let typeNewTag = (typeTags.inputVisible && (
      <Input
        ref={this.saveTypeInputRef}
        type="text"
        size="small"
        style={{ width: 78 }}
        maxLength={10}
        value={typeTags.inputValue}
        onChange={this.handleTypeInputChange}
        onBlur={this.handleTypeInputConfirm}
        onPressEnter={this.handleTypeInputConfirm}
      />
    ));

    let typeNewTag1 = (!typeTags.inputVisible && (
      <Tag onClick={this.showTypeInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
        <Icon type="plus" /> 添加类型
      </Tag>
    ))

    let stateTagOption = formData.statusContent.map((tag, index) => {
      const tagElem = (
        <Tag key={"state"+index} closable={true} onClose={this.removeStateTag.bind(this,tag)}>
          {tag}
        </Tag>
      );
      return (tagElem);
    })
    let stateNewTag = (stateTags.inputVisible && (
      <Input
        ref={this.saveStateInputRef}
        type="text"
        size="small"
        style={{ width: 78 }}
        maxLength={10}
        value={stateTags.inputValue}
        onChange={this.handleStateInputChange}
        onBlur={this.handleStateInputConfirm}
        onPressEnter={this.handleStateInputConfirm}
      />
    ));

    let stateNewTag1 = (!stateTags.inputVisible && (
      <Tag onClick={this.showStateInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
        <Icon type="plus" /> 添加状态
      </Tag>
    ))

    const uploadButton = (
      <div className="temp-edit-upload">
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const uploadProps = {
      name: 'file',
      action: 'https://upload.qiniup.com/',
      accept:"image/jpg,image/jpeg,image/png",
      headers: {
        authorization: 'authorization-text',
        "Content-Disposition":'form-data; name="file";'
      },
      data:{
          token:qiniuToken?qiniuToken:this.state.qiniuToken,
      },
      onChange: ( info ) => {
        if(!info) return;
        if(info.file.status === "uploading"){
          this.setState({uploading:true})
        }
        else if (info.file.status === 'done') {
          message.success(`上传成功！`);
          this.setState({imgPath:info.file.response.id,uploading:false})
        } else if (info.file.status === 'error') {
          message.error(`上传失败！`);
        }
      },
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
            imgPath:"",
          };
        });
      },
      beforeUpload: file => {
        let names = file.name.split(".");
        let suffix = names[names.length - 1];
        let canSuffix = ["png","jpg","jpeg"];
        if(canSuffix.includes(suffix)){
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
        }else{
          message.error("请上传png，jpg的扩展名文件",3);
          this.setState({
            fileList: [],
          });
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
          this.setState({
            fileList: [],
          });
        }
        return isLt2M;
      },
      listType:"picture",
      fileList,
    };

    return (
      <div className="content-main content-box">
        <Form {...formItemLayout} style={{maxWidth:800}} onSubmit={this.handleSave}>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item label="活动名称">
                {getFieldDecorator("activityName", {
                  initialValue: formData.activityName || "",
                  rules: [{ required: true, message: "请输入活动名称" },],
                })(<Input placeholder="请输入活动名称" maxLength={10} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="选择班级">
                {getFieldDecorator("classIds", {
                  initialValue:
                  formData.classIds || [],
                  rules: [{ required: true, message: "请选择适用班级" }],
                })(
                  // <Select mode="tags" placeholder="请选择适用班级">
                  //   {classOptions}
                  // </Select>
                  <TreeSelect {...tProps}></TreeSelect>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="时间">
                {getFieldDecorator("timeType", {
                  initialValue:
                  formData.timeType || "1",
                })(
                  <Radio.Group name="timeType">
                    <Radio value="0">时间点</Radio>
                    <Radio value="1">时间段</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="是否输入体温">
                {getFieldDecorator("isTemperature", {
                  initialValue:
                  formData.isTemperature || "1",
                })(
                  <Radio.Group name="isTemperature">
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="类型">
                {getFieldDecorator("isType", {
                  initialValue:
                  formData.isType || "1",
                })(
                  <Radio.Group name="isType" onChange={this.isTypeChange}>
                    <Radio value="1">启用</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          {
            formData.isType === "1" ? (
            <Row gutter={24}>
              <Col span={5}></Col>
              <Col span={19}>
                <Form.Item {...formItemLayout}>
                  {typeTagOption}{typeNewTag}{typeNewTag1}
                </Form.Item>
              </Col>
            </Row>) : null
          }
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator("isStatus", {
                  initialValue:
                  formData.isStatus || "1",
                })(
                  <Radio.Group name="isStatus" onChange={this.isStateChange}>
                    <Radio value="1">启用</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          {
            formData.isStatus === "1" ? (
              <Row gutter={24}>
                <Col span={5}></Col>
                <Col span={19}>
                  <Form.Item {...formItemLayout} label="">
                    {stateTagOption}{stateNewTag}{stateNewTag1}
                  </Form.Item>
                </Col>
              </Row>) : null
          }
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="上传logo">
                {getFieldDecorator("logo", {
                  initialValue:
                  formData.logo || "",
                  rules: [{ required: true, message: "请上传logo" },],
                })(
                  <Upload {...uploadProps}>
                      {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator("isRemark", {
                  initialValue:
                  formData.isRemark || "1",
                })(
                  <Radio.Group name="isRemark">
                    <Radio value="1">启用</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item {...formItemLayout} label="图片">
                {getFieldDecorator("isPic", {
                  initialValue:
                  formData.isPic || "1",
                })(
                  <Radio.Group name="isPic">
                    <Radio value="1">启用</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={22}>
              <Form.Item label="排序">
                {getFieldDecorator("sort", {
                  initialValue: formData.sort,
                  rules: [{ required: true, message: "请输入排序" },],
                })(<InputNumber placeholder="请输入排序" step={1} precision={0} min={0} max={1000000} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} style={{textAlign:"center"}}>
            <Col span={22}>
              <Button type="primary" onClick={this.handleSave.bind(this)}>保存</Button>&emsp;
              <Button type="primary" ghost onClick={this.handleCancel.bind(this)}>取消</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(ChildrensActivitiesTempEdit));
