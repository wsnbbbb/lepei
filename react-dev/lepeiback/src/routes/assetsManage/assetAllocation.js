import React,{Component} from 'react';
import { connect } from 'dva';
import { Select, Button,Input, Breadcrumb, Form, Row, Col,message} from 'antd';
import { Link } from 'dva/router';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

class AssetAllocation extends Component{
  constructor(props) {
      super(props);
      this.state = {
        assetsTypeList:[],
        assetList:[],
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
  
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 保存
  save = () =>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        const params = {
          "propertyId":values.propertyId,
          "personId":values.personId,
          "num":values.num,
        }
        this.props.dispatch({
          type:'assetsManage/allcatedAsset',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success("资产分配成功") 
              window.history.go(-1)
            }
          }
        })
      }
    })
  }
  
  render(){
    const { assetsTypeList, assetList } = this.state;
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
    commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item => {
      option3.push(<Option key={item.personId}>{item.personName}</Option>)
    })
    return (
        <div className="content-main asset-transfer">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/assets-list">资产管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>资产分配</Breadcrumb.Item>
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
                <FormItem {...formItemLayout} label='使用人'>
                {getFieldDecorator("personId",{rules:[{required:true,message:"请选择使用人"}]})(
                  <Select
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择使用人">
                      {option3}
                  </Select>
                )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label={'数量'}>
                  {getFieldDecorator("num",{initialValue:'',rules:[{required:true,message:"请输入转移数量"}]})(
                    <Input placeholder="请输入数量"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              
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

export default connect(mapStateToProps)(Form.create()(AssetAllocation));
