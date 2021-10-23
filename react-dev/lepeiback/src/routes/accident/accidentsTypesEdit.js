/**
 * 意外事件类型-route
 */
 import React, { Component } from "react";
 import { Input, Form,  Row, Col, Button, Radio, } from "antd";

 import { connect } from "dva";
 import "./style.less";
 import { getQueryString} from '../../utils/public';

 class AccidentsTypesEdit extends Component {
   constructor(props) {
     super(props);
     this.state = {
       history: require("history/createHashHistory"),
       id:"",
       category:"",
       title:"",
       formData: {},
     };
   }

   componentDidMount = () => {
     let that = this;
     const id = getQueryString("id");
     const category = getQueryString("category");
     let typeTabs = ["伤害类型","发生地点类型","伤害发生时活动类型","伤害同行类型","处理类型","转归类型"];
     let title = "添加";
     if(id){
       title = "修改";
     }
     title = title + " - " + typeTabs[category - 1];
     that.setState({id:id || "",category,title});
     if(id){
      setTimeout(() => {
        that.getTempData(id);
      },300);
     }

     //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
     this.props.dispatch({
       type: 'user/setLastRoute',
       payload: {
         breadcrumbTitle:title,
         parentRoute:"/accident-types"
       },
     })
   };

  componentWillUnmount = () =>{
    //组件卸载时，清空手动加入的面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {},
    })
  }

   getTempData = (id) => {
     let that = this;
     this.props.dispatch({
       type: "accidentsTypes/getAccidentTypesDetail",
       payload: {id:id},
       callback: (res) => {
         if (res.code === 200) {
           if(res.data.isOpenedDesc) res.data.isOpenedDesc = res.data.isOpenedDesc + "";
           that.setState({
             formData: res.data,
           });
         }
       },
     });
   }

   handleSave = (e) => {
     let that = this;
     that.props.form.validateFields().then(values => {
       let params = {...values};
       params.category = that.state.category;
       let types = "accidentsTypes/addAccidentTypes";
       if(that.state.id){
         params.id = that.state.id;
         types = "accidentsTypes/modAccidentTypes";
       }
       this.props.dispatch({
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
     this.setState({
       formData,
       id:"",
       category:"",
     })
     this.props.form.resetFields();
     this.state.history().goBack();
   }

   isRemarkChange = (e) => {
     let value = e.target.value;
     let {formData} = this.state;
     formData.isOpenedDesc = value;
     this.setState({formData})
   }

   render() {
     const { formData,title } = this.state;
     const { getFieldDecorator } = this.props.form;
     const formItemLayout = {
       labelCol: { span: 6 },
       wrapperCol: { span: 18 },
     };

     return (
       <div className="content-main content-box">
         <Form {...formItemLayout} style={{maxWidth:800}} onSubmit={this.handleSave}>
           <Row gutter={24}>
             <Col span={22}>
               <Form.Item label="类型名称">
                 {getFieldDecorator("name", {
                   initialValue: formData.name || "",
                   rules: [{ required: true, message: "请输入类型名称" },],
                 })(<Input placeholder="请输入类型名称" maxLength={10} />)}
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={24}>
             <Col span={22}>
               <Form.Item {...formItemLayout} label="是否开通描述">
                 {getFieldDecorator("isOpenedDesc", {
                   initialValue:
                   formData.isOpenedDesc || "0",
                 })(
                   <Radio.Group name="isOpenedDesc" onChange={this.isRemarkChange}>
                     <Radio value="0">否</Radio>
                     <Radio value="1">是</Radio>
                   </Radio.Group>
                 )}
               </Form.Item>
             </Col>
           </Row>
           { formData.isOpenedDesc === "1" ? (<Row gutter={24}>
             <Col span={22}>
               <Form.Item label="备注">
                 {getFieldDecorator("remark", {
                   initialValue: formData.remark || "",
                 })(<Input placeholder="请输入备注详情" maxLength={50} />)}
               </Form.Item>
             </Col>
           </Row>) : null }

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
 export default connect(mapStateToProps)(Form.create()(AccidentsTypesEdit));
