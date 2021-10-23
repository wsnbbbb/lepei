import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Breadcrumb, Radio,Modal,message} from 'antd';
import { getQueryString } from '../../utils/public';
import { Link } from 'dva/router';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AddAssetsType extends Component{
    constructor(props) {
        super(props);
        this.state = {
          assetsTypeList:[],
          unitList:[],
          isConsumable:0,
          title:"新增",
          title1:"编辑",
        };
    }
    componentDidMount=()=>{
      const id = getQueryString("id")
      const type=getQueryString('type');
      this.getAssetsType()
      this.propertyUnit()
      if(id){
        this.assetsDetail()
      }
      if(Number(type)===1){
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/asset-info"
            },
          })
    }else{
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title1,
              parentRoute:"/asset-info"

            },
          })
     }
    }
    componentWillUnmount = () => {
      sessionStorage.removeItem("qiniuToken");
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
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
    // 获取计量单位列表
    propertyUnit = () =>{
      this.props.dispatch({
        type:'assetsManage/propertyUnit',
        callback:(res) =>{
          if(res.code === 200){
            this.setState({unitList:res.data})
          }
        }
      })
    }
    // 获取详情
    assetsDetail = () =>{
      const id = getQueryString("id")
      this.props.dispatch({
        type:'assetsManage/assetsDetail',
        payload:{id},
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
              detailList:res.data,
              unit:res.data.unit,
              catId:res.data.catId+'',
              name:res.data.name,
              isConsumable:res.data.isConsumable,
            })
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
      const id = getQueryString("id")
      let params
      this.props.form.validateFields((err, values) => {
        if(!err){
          if(id){
            params = {
              "id":id,
              "name": values.name||'',
              "catId": values.catId||'',
              "unit": values.unit||'',
              "isConsumable": values.isConsumable,
            }
          }else{
            params = {
              "name": values.name||'',
              "catId": values.catId||'',
              "unit": values.unit||'',
              "isConsumable": values.isConsumable,
            }
          }
          console.log({params})
          this.props.dispatch({
            type:id?'assetsManage/editAssetsInfo':'assetsManage/addAssetsInfo',
            payload:params,
            callback:(res) =>{
              if(res.code === 200){
                message.success(id?"修改成功！":"新增成功！")
                window.history.go(-1)
              }
            }
          })
        }
    })
    }
    render(){
      const { assetsTypeList, unitList, unit,catId, name, isConsumable} = this.state;
      const { getFieldDecorator } = this.props.form;
      const id = getQueryString("id")
      const formItemLayout = {
        labelCol: { span:8 },
        wrapperCol: { span: 13 }
      };
      let options = []
      assetsTypeList&&assetsTypeList.map(item =>{
        options.push(<Option key={item.id} value={item.id}>{item.catName}</Option>)
      })
      let unitOption = []
      unitList && unitList.map(item =>{
        unitOption.push(<Option key={item.id} value={item.name}>{item.name}</Option>)
      })
      return (
        <div className="content-main add-assetsType">   
          <Form>
            <Row gutter={24}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='资产类型'>
                    {getFieldDecorator('catId',{initialValue:catId,rules:[{required:true,message:"资产类型不能为空"}]})(
                      <Select  >
                        {options}
                      </Select>
                    )}
                  </FormItem>
                </Col> 
                <Col span={8} >
                  <FormItem {...formItemLayout} label='资产名称'>
                    {getFieldDecorator("name",{initialValue:name,rules:[{required:true,message:"资产名称不能为空"}]})(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
            <Row gutter={24}>
              <Col span={8} >
                <FormItem {...formItemLayout} label='计量单位'>
                  {getFieldDecorator("unit",{initialValue:unit,rules:[{required:true,message:"计量单位不能为空"}]})(
                    <Select >
                      {unitOption}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label='是否易消耗品'>
                  {getFieldDecorator("isConsumable",{initialValue:isConsumable})(
                    <Radio.Group>
                    <Radio value={1} style={{margin:"0 15px"}}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className="btn">
              <Button onClick={this.back.bind(this)}>返回</Button>&emsp;&emsp;
              <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            </Row>
          </Form>
            
        </div>     
      );
    }
  
}

const mapStateToProps = (state) => {
  return {
   
  }
}

export default connect(mapStateToProps)(Form.create()(AddAssetsType));
