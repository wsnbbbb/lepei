import React,{Component} from 'react';
import { connect } from 'dva';
import { Select, Button,Input, Breadcrumb, Form, Row, Col,message} from 'antd';
import { Link } from 'dva/router';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
class AssetTransfer extends Component{
  constructor(props) {
      super(props);
      this.state = {
        assetsTypeList:[],
        assetList:[],
        assetUserList:[],
      };
  }
  componentDidMount=()=>{
    this.getAssetsType()
    this.props.dispatch({ //获取教职工
      type:'user/getCommonPersonList',
      payload:{"personType":"2,3", "status": 1}
    })
  }
  // 获取资产类型列表
  getAssetsType = () =>{
    this.props.dispatch({
      type:'assetsManage/assetsType',
      callback:(res) =>{
        if(res.code === 200){
          this.setState({ assetsTypeList:res.data})
        }
      }
    })
  }
  // 选择资产类型
  changeAssetType = (val) =>{
    this.props.dispatch({
      type:'assetsManage/getAssetByTypes',
      payload:{"catId":val},
      callback:(res) =>{
        if(res.code === 200){
          this.setState({ assetList:res.data})
        }
      }
    })
  }
  // 选择资产名称
  propertyName = (val) =>{
    this.props.dispatch({
      type:'assetsManage/getAssetUser',
      payload:{"propertyId":val},
      callback:(res) =>{
        if(res.code === 200){
          this.setState({ assetUserList:res.data})
        }
      }
    })
  }
  getNum = (val) =>{
    const oldPersonId = val.substring(0, val.lastIndexOf('-'))
    const oldNum = val.substring(val.lastIndexOf('-')+1, val.length)
    this.setState({
      oldPersonId: oldPersonId,
      oldNum: oldNum
    })
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 保存
  save = () =>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        if(parseInt(values.num) > parseInt(this.state.oldNum)){
          return message.error("转移数量不能大于原始用人持有数量！")
        }
        const params = {
          "propertyId":values.propertyId,
          "oldPersonId":this.state.oldPersonId,
          "newPersonId":values.newPersonId,
          "num":values.num,
        }
        this.props.dispatch({
          type:'assetsManage/setAssetTransfer',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("资产转移成功") 
              window.history.go(-1)
            }
          }
        })
      }
    })
  }
  
  render(){
    const { assetsTypeList, assetList , assetUserList} = this.state;
    const { getFieldDecorator } = this.props.form;
    const { commonPersonData } = this.props
    const formItemLayout = {
      labelCol: { span:9 },
      wrapperCol: { span: 15 }
    };
    let option1 = []
    assetsTypeList&&assetsTypeList.map(item =>{
      option1.push(<Option key={item.id} value={item.id}>{item.catName}</Option>)
    })
    let option2 = []
    assetList&&assetList.map(item =>{
      option2.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
    })
    let option3 = []
    assetUserList&&assetUserList.map(item =>{
      option3.push(<Option key={item.personId} value={item.personId+'-'+item.num}>{item.personName}</Option>)
    })
    let option4 = []
    commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item => {
      option4.push(<Option key={item.personId}>{item.personName}</Option>)
    })
    return (
        <div className="content-main asset-transfer">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/assets-list">资产管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>资产转移</Breadcrumb.Item>
          </Breadcrumb> 
          <Form>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='资产类型'>
                {getFieldDecorator("assetType",{rules:[{required:true,message:"请选择资产类型"}]})(
                  <Select
                    onChange={this.changeAssetType.bind(this)}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择资产类型">
                      {option1}
                  </Select>
                )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='资产名称'>
                {getFieldDecorator("propertyId",{rules:[{required:true,message:"请选择资产名称"}]})(
                  <Select
                    onChange={this.propertyName.bind(this)}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择资产名称">
                      {option2}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='原使用人'>
                  {getFieldDecorator("oldPersonId",{rules:[{required:true,message:"请选择原使用人"}]})(
                    <Select
                      showSearch
                      allowClear
                      onChange={this.getNum.bind(this)}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="请选择原使用人">
                        {option3}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='新使用人'>
                {getFieldDecorator("newPersonId",{rules:[{required:true,message:"请选择新使用人"}]})(
                  <Select
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择新使用人">
                      {option4}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label={'数量'}>
                  {getFieldDecorator("num",{initialValue:'',rules:[{required:true,message:"请输入转移数量"}]})(
                    <Input placeholder="请输入数量"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="btn">
            <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='primary' onClick={this.save.bind(this)}>保存</Button>
          </div>
        
        </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    commonPersonData:state.user.commonPersonData,
  }
}

export default connect(mapStateToProps)(Form.create()(AssetTransfer));
