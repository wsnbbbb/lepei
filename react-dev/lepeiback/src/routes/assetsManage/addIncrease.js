import React,{Component} from 'react';
import { connect } from 'dva';
import { Select,DatePicker, Button,Input, Breadcrumb, Form, Row, Col,message,TreeSelect} from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { getQueryString,dateToTimestamp, isCorrectMoney, formatDate } from '../../utils/public';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const dateFormat = 'YYYY-MM-DD';

class AddIncrease extends Component{
  constructor(props) {
      super(props);
      this.state = {
        assetsTypeList:[],
        assetList:[],
        assetUserList:[],
        treeData:[],
        catId:'',
        currentTime:new Date().getTime()
      };
  }
  componentDidMount=()=>{
    console.log(this.state.currentTime);
    this.getAssetsType()
    const id = getQueryString("id")
    if(id){
      let params = {"id":id}
      this.getDetail(params)
    }
    this.props.dispatch({
      type:'user/getDepartmentList',
      callback:(res)=>{
        if(res.code===200){
          this.setState({treeData:res.data})
        }
      }
    })
  }
  // 获取详情
  getDetail = (params) =>{
    this.props.dispatch({
      type:'assetsManage/stockDetail',
      payload:params,
      callback:(res)=>{
        if(res.code===200){
          this.changeAssetType(res.data.catId)
          this.setState({
            num:res.data.num,
            proCode:res.data.proCode,
            financialTime:formatDate(res.data.financialTime),
            price:res.data.price,
            supplier:res.data.supplier,
            getTime:formatDate(res.data.getTime),
            buyOrgType:res.data.buyOrgType,
            catName:res.data.catName,
            proValue:res.data.proValue,
            getType:res.data.getType,
            accountType:res.data.accountType,
            valueType:res.data.valueType,
            unit:res.data.unit,
            specification:res.data.specification,
            useStatus:res.data.useStatus,
            usage:res.data.usage,
            manageDepartment:res.data.manageDepartment && res.data.manageDid ? res.data.manageDepartment + '-' + res.data.manageDid : undefined,
            expireTime:res.data.expireTime,
            financialStatus:res.data.financialStatus,
            storePlace:res.data.storePlace,
            discountStatus:res.data.discountStatus,
            remark:res.data.remark,
            propertyName:res.data.propertyId,
          })
        }
      }
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
          this.setState({ 
            assetList:res.data,
          })
        }
      }
    })
  }
  // 选择资产名称
  changePropertyName = (val) =>{
    const propertyName = val.substring(0, val.lastIndexOf('-'))
    const unit = val.substring(val.lastIndexOf('-')+1, val.length)
    this.setState({
      propertyName: propertyName,
      unit: unit
    })
    console.log(val);
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 数量
  changeNum = (e) =>{
    this.setState({
      num:e.target.value
    })
  }
  // 价格
  changePrice = (e) =>{
    this.setState({
      price:e.target.value
    })
  }
  // 取得日期
  onTimeChange = (date, dateString) => {
    this.setState({
      getTime:dateString
    })
  }
  // 入账时间
  onTimeChange1 = (date, dateString) => {
    this.setState({
      financialTime:dateString
    })
  }
  // 保存
  save = () =>{
    const id = getQueryString("id")
    const currentDate = Math.round(new Date().getTime()/1000).toString()
    this.props.form.validateFields((err, values) => {
      let params
      if(!err){
        if(values.price&&!isCorrectMoney(values.price)){
          message.warn("请输入正确的金额")
            return
        }
        if(id){
          params = {
            "id":id,
            "propertyId":this.state.propertyName,
            "financialTime":dateToTimestamp(this.state.financialTime) || currentDate,
            "proCode":values.proCode,
            "buyOrgType":values.buyOrgType||'',
            "getTime":dateToTimestamp(this.state.getTime) || currentDate,
            "getType":values.getType||'',
            "accountType":values.accountType||'',
            "valueType":values.valueType||'',
            "num":values.num,
            "price":values.price||'',
            "specification":values.specification||'',
            "useStatus":values.useStatus||'',
            "usage":values.usage||'',
            "expireTime":values.expireTime||'',
            "financialStatus":values.financialStatus||'',
            "storePlace":values.storePlace||'',
            "discountStatus":values.discountStatus||'',
            "remark":values.remark||'',
            "supplier":values.supplier||'',
            "departmentId":this.state.departmentId||'',
          }
        }else{
          params = {
            "propertyId":this.state.propertyName,
            "financialTime":dateToTimestamp(this.state.financialTime) || currentDate,
            "proCode":values.proCode,
            "buyOrgType":values.buyOrgType||'',
            "getTime":dateToTimestamp(this.state.getTime) || currentDate,
            "getType":values.getType||'',
            "accountType":values.accountType||'',
            "valueType":values.valueType||'',
            "num":values.num,
            "price":values.price||'',
            "specification":values.specification||'',
            "useStatus":values.useStatus||'',
            "usage":values.usage||'',
            "expireTime":values.expireTime||'',
            "financialStatus":values.financialStatus||'',
            "storePlace":values.storePlace||'',
            "discountStatus":values.discountStatus||'',
            "remark":values.remark||'',
            "supplier":values.supplier||'',
            "departmentId":this.state.departmentId||'',
          }
        }
        this.props.dispatch({
          type:id?'assetsManage/editAddIncrease':'assetsManage/saveAddIncrease',
          payload:params,
          callback:(res) =>{
            if(res.code === 200){
              message.success(id?"资产增提修改成功":"资产增提添加成功") 
              window.history.go(-1)
            }
          }
        })
      }
    })
  }
  changeDepartment = (val) =>{
    const id = val.substring(val.lastIndexOf('-')+1, val.length)
    this.setState({
      departmentId: id,
    })
  }
  // 部门子选项
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
  render(){
    const { assetsTypeList, assetList , catName,num, proCode,financialTime,price,supplier,getTime,buyOrgType,proValue,getType,accountType,valueType,
      unit,specification,useStatus,expireTime,financialStatus,storePlace,discountStatus,remark,propertyName,manageDepartment,usage,manageDid, currentTime} = this.state;
    const { getFieldDecorator } = this.props.form;
    let appliedNum = getQueryString("appliedNum")
    let id = getQueryString("id")
    let propertyId = propertyName+'-'+unit
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
    assetList && assetList.map(item =>{
      option2.push(<Option key={item.id} value={item.id+'-'+item.unit}>{item.name}</Option>)
    })
   
    return (
        <div className="content-main add-crease">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/assets-list">资产管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/asset-increase">资产增提</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{id?"编辑":"增提"}</Breadcrumb.Item>
          </Breadcrumb> 
          <Form>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='资产类型'>
                {getFieldDecorator("assetType",{initialValue:catName,rules:[{required:true,message:"请选择资产类型"}]})(
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
                {getFieldDecorator("propertyId",{initialValue:propertyName?propertyId:'',rules:[{required:true,message:"请选择资产名称"}]})(
                  <Select
                    onChange={this.changePropertyName.bind(this)}
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
                <FormItem {...formItemLayout} label='资产编号'>
                  {getFieldDecorator("proCode",{initialValue:proCode,rules:[{required:true,message:"请输入资产编号"}]})(
                   <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='采购组织形式'>
                  {getFieldDecorator("buyOrgType",{initialValue:buyOrgType})(
                   <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='取得方式'>
                  {getFieldDecorator("getType",{initialValue:getType})(
                    <Select
                      allowClear
                      placeholder="请选择取得方式">
                        <Option value='新购' key='1'>新购</Option>
                        <Option value='调拨' key='2'>调拨</Option>
                        <Option value='接受捐赠' key='3'>接受捐赠</Option>
                        <Option value='自建' key='4'>自建</Option>
                        <Option value='置换' key='5'>置换</Option>
                        <Option value='盘盈' key='6'>盘盈</Option>
                        <Option value='租赁' key='7'>租赁</Option>
                        <Option value='其他' key='8'>其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label={'取得日期'}>
                  {getFieldDecorator("getTime",{initialValue:getTime?moment(getTime,'YYYY-MM-DD'):moment(currentTime)})(
                    <DatePicker format={'YYYY-MM-DD'}  onChange={this.onTimeChange}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label={'入账形式'}>
                  {getFieldDecorator("accountType",{initialValue:accountType})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='价值类型'>
                  {getFieldDecorator("valueType",{initialValue:valueType})(
                    <Select
                      allowClear
                      placeholder="请选择价值类型">
                        <Option value='原值' key='1'>原值</Option>
                        <Option value='暂估值' key='2'>暂估值</Option>
                        <Option value='重置值' key='3'>重置值</Option>
                        <Option value='无价值' key='4'>无价值</Option>
                        <Option value='评估值' key='5'>评估值</Option>
                        <Option value='名义金额' key='6'>名义金额</Option>
                        <Option value='其他' key='7'>其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='数量'>
                  {getFieldDecorator("num",{initialValue:num,rules:[{required:true,message:"请输入数量"}]})(
                   <Input disabled={id&&appliedNum&&appliedNum == 0?true:false} onChange={this.changeNum.bind(this)}/>
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='单价'>
                  {getFieldDecorator("price",{initialValue:price})(
                   <Input onChange={this.changePrice.bind(this)}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='价值'>
                  {getFieldDecorator("proValue",{initialValue:num&&price?num*price:''})(
                   <Input disabled/>
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='计量单位'>
                  {getFieldDecorator("unit",{initialValue:unit})(
                   <Input disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
            <Col span={9} >
                <FormItem {...formItemLayout} label={'规格'}>
                  {getFieldDecorator("specification",{initialValue:specification})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='使用状态'>
                  {getFieldDecorator("useStatus",{initialValue:useStatus})(
                    <Select
                      allowClear
                      placeholder="请选择使用状态">
                        <Option value='再用' key='1'>在用</Option>
                        <Option value='闲置' key='2'>闲置</Option>
                        <Option value='损毁待报废' key='3'>损毁待报废</Option>
                        <Option value='其他' key='4'>其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='使用方向'>
                  {getFieldDecorator("usage",{initialValue:usage})(
                   <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='预计使用年限'>
                  {getFieldDecorator("expireTime",{initialValue:expireTime})(
                   <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='财务入账状态'>
                  {getFieldDecorator("financialStatus",{initialValue:financialStatus})(
                   <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='财务入账时间'>
                  {getFieldDecorator("financialTime",{initialValue:financialTime?moment(financialTime,'YYYY-MM-DD'):moment(currentTime)})(
                    <DatePicker format={'YYYY-MM-DD'}  onChange={this.onTimeChange1}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='存放地点'>
                  {getFieldDecorator("storePlace",{initialValue:storePlace})(
                   <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='折旧状态'>
                  {getFieldDecorator("discountStatus",{initialValue:discountStatus})(
                   <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='管理部门'>
                  {getFieldDecorator("departmentId",{initialValue:manageDepartment})(
                    <TreeSelect
                      onChange={this.changeDepartment.bind(this)}
                      showSearch
                      dropdownMatchSelectWidth
                      dropdownStyle={{ maxHeight:200,overflow: 'auto' }}
                      allowClear
                      treeDefaultExpandAll>
                        <TreeNode value="" title="全部" key={-1}/>
                        {this.renderTreeNodes(this.state.treeData)}
                    </TreeSelect>
                  )}  
                </FormItem>
              </Col>
              <Col span={9} >
                <FormItem {...formItemLayout} label='备注'>
                  {getFieldDecorator("remark",{initialValue:remark})(
                   <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='供应商'>
                  {getFieldDecorator("supplier",{initialValue:supplier})(
                   <Input />
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

export default connect(mapStateToProps)(Form.create()(AddIncrease));
