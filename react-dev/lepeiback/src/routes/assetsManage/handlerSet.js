import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Input, Select, Breadcrumb, Form, Row, Col, Icon, message } from 'antd';
import { Link } from 'dva/router';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;

class HandlerSet extends Component{
  constructor(props) {
      super(props);
      this.state = {
        firstExaminerData:[{channelName:'',personIds:[]}],
        secondExaminer:[],
        propertyManager:[],
        showPersons:[]
      };
  }
  componentDidMount=()=>{
    this.props.dispatch({ //获取教职工
      type:'user/getCommonPersonList',
      payload:{"personType":"2,3", "status": 1}
    })
    this.getHandlerDetail()
  }
  
  // 获取处理人设置详情
  getHandlerDetail = () =>{
    this.props.dispatch({
      type:'assetsManage/getHandlerDetail',
      callback:(res) =>{
        if(res.code === 200){
          let firstExaminerData = []
          res.data.personIds.firstExaminer&&res.data.personIds.firstExaminer.map(item => {
            res.data.channels&&res.data.channels.map(obj => {
              if(item.channelId == obj.id){
                firstExaminerData.push({
                  channelName:obj.channelName,
                  personIds:item.personIds,
                  channelId:item.channelId
                })
              }
            })
          })
          this.setState({
            firstExaminerData:firstExaminerData.length>0?firstExaminerData:[{channelName:'',personIds:[]}],
            secondExaminer:res.data.personIds.secondExaminer,
            propertyManager:res.data.personIds.propertyManager,
            showPersons:res.data.personIds.showPersons,
          })
        }
      }
    })
  }
  // 第一审批人添加
  add = () => {
    let examinerData = this.state.firstExaminerData
    examinerData.push({
      channelName: '',
      personIds: []
    })
    this.setState({ firstExaminerData: examinerData })
  }
  // 通道名称
  changeName = (index,e) =>{
    let examinerData = this.state.firstExaminerData
    examinerData[index].channelName = e.target.value
    this.setState({
      firstExaminerData:examinerData
    })
  }
  // 第一审批人选择
  changeApprover = (index,val) =>{
    let examinerData = this.state.firstExaminerData
      examinerData[index].personIds = val
      this.setState({
        firstExaminerData: examinerData,
      })
  }
  //  第一审批人删除
  del = (index) =>{
      let oldData = this.state.firstExaminerData
      let newData = oldData.filter((item, i) => {
          return i !== index
      })
      if (oldData.length === 1) {
          return
      }
      this.setState({
        firstExaminerData: newData
      })
  }
  // 第二审批人选择，抄送人选择，查看人选择
  changeApprover1 = (type,val) =>{
    console.log({ val})
    if(type == 1){
      this.setState({
        secondExaminer: val,
      })
    }else if(type == 2){
      this.setState({
        propertyManager: val,
      })
    }else if(type == 3){
      this.setState({
        showPersons: val,
      })
    }
  }
  // 返回
  back = () =>{
    window.history.go(-1)
  }
  // 保存
  save = () =>{
    let flag = true
    this.state.firstExaminerData.map((item,index) =>{
      if(item.personIds.length === 0){
        message.error("请选择第一审批人！")
        flag = false
      }
    })
    if(!flag){
      return
    }
    const params = {
      firstExaminer:this.state.firstExaminerData,
      secondExaminer:this.state.secondExaminer,
      propertyManager:this.state.propertyManager,
      showPersons:this.state.showPersons,
    }
    console.log({params})
    this.props.dispatch({
      type:'assetsManage/saveHandlerSet',
      payload:params,
      callback:(res) =>{
        if(res.code === 200){
          window.history.go(-1)
        }
      }

    })
  }
  
  render(){
    const { firstExaminerData, secondExaminer, propertyManager, showPersons } = this.state;
    const { commonPersonData } = this.props
    const formItemLayout = {
      labelCol: { span:8 },
      wrapperCol: { span: 15 }
    };
    let options = []
    commonPersonData&&commonPersonData.length>0&&commonPersonData.map(item => {
      options.push(<Option key={item.personId}>{item.personName}</Option>)
    })
    return (
        <div className="content-main handler-set">
          <Breadcrumb className="Breadcrumb">
            <Breadcrumb.Item><Link to="/goods-apply">物品申领</Link></Breadcrumb.Item>
            <Breadcrumb.Item>处理人设置</Breadcrumb.Item>
          </Breadcrumb>  
          <Row gutter={24} style={{marginBottom:"20px"}}>
            <Col span={7} offset={4}>通道名称</Col>
            <Col span={6}>审批人</Col>
          </Row>
          <Form className="form">
            {
                firstExaminerData && firstExaminerData.map((item, index) => {
                    return   <Row gutter={24} key={index}>
                    {
                      index == 0?<Col span={9}>
                        <FormItem {...formItemLayout} label='第一审批人'>
                          <Input placeholder="通道名称" value={item.channelName||''} onChange={this.changeName.bind(this,index)}/>
                        </FormItem>
                      </Col>:
                      <Col offset={3} span={6} className="nameInput">
                        <Input placeholder="通道名称" value={item.channelName||''} onChange={this.changeName.bind(this,index)}/>
                      </Col>
                    }
                    <Col span={6} className="paddingTop5">
                        <Select
                          onChange={this.changeApprover.bind(this,index)}
                          mode="multiple"
                          showSearch
                          allowClear
                          value={item.personIds||[]}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="请选择审批人">
                            {options}
                        </Select>
                    </Col>
                    {
                      firstExaminerData.length>1?
                      <Col span={2} >
                          <FormItem label=''>
                              <Icon type="minus-circle" onClick={this.del.bind(this, index)} className="delIcon" />
                          </FormItem>
                      </Col>:null
                    }
                  </Row>
                })
             }
            <Row gutter={24}>
              <Col span={2} style={{marginLeft:"12%",marginBottom:"20px"}}>
                <Icon type="plus-circle" onClick={this.add.bind(this)} style={{ color: '#39A7E1', fontSize: '30px' }} />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='第二审批人'>
                  <Select
                    onChange={this.changeApprover1.bind(this,1)}
                    mode="multiple"
                    showSearch
                    allowClear
                    value={secondExaminer}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择第二审批人">
                      {options}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='抄送人（物资管理员）'>
                  <Select
                    onChange={this.changeApprover1.bind(this,2)}
                    mode="multiple"
                    showSearch
                    allowClear
                    value={propertyManager}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择抄送人">
                      {options}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9} >
                <FormItem {...formItemLayout} label='查看人'>
                  <Select
                    onChange={this.changeApprover1.bind(this,3)}
                    mode="multiple"
                    showSearch
                    allowClear
                    value={showPersons}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择查看人">
                      {options}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="btn">
            <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='primary'  onClick={this.save.bind(this)}>保存</Button>
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

export default connect(mapStateToProps)(Form.create()(HandlerSet));
