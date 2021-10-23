import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col, Select,message,Breadcrumb} from 'antd';
import { Link, routerRedux } from 'dva/router';
import { getQueryString } from '../../utils/public';
import './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class ApprovalDetail extends Component{
  constructor(props) {
      super(props);
      this.state = {
        id:'',
        visible: false,
        devices:[],
        persons:[],
        title:"添加",
        title1:"编辑",

        
      };
  }
  componentDidMount=()=>{
    const id =  getQueryString("id")
    const type=getQueryString('type');
    if(id){ 
     this.getDetail(id)
     this.setState({id: id})
    }
    this.props.dispatch({ // 获取人员
      type:'user/getCommonPersonList',
      payload:{"personType":'2,3', "status": 1}
    })
    this.props.dispatch({ // 获取设备列表
      type:'user/pubEntryDevicesList'
    })
     // 面包屑导航
     if(Number(type)===1){
      this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/door-list"
        },
      })
     }else if(Number(type)===2){
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title1,
          parentRoute:"/door-list"
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
  // 获取详情
getDetail = ()=>{
  const id=getQueryString('id')
  this.props.dispatch({
      type:"doorList/doorDetail",     
      payload:{"id":id},
      callback: res=>{
          if(res.code === 200){
              this.setState({
                devices: res.data.devices,
                persons: res.data.persons
              })
          }
      }
  })
}

  // 返回
  back = () =>{
    this.props.history.goBack()
  }
  
  // 保存
  save=()=>{
    const id=getQueryString('id')
    this.props.form.validateFields((err, values) => {
        if(!err){
          const params = {
                    "devSns":values.devSns,
                    "personIds": values.personIds,
                  }
            if(id){
                    params.id = id
            }
            
            this.props.dispatch({
                type:id?'doorList/doorUpdate': 'doorList/doorNew',
                payload:params,
                callback:(res)=>{
                    if(res.code===200){
                        message.success(id?"修改成功":"添加成功",2)
                          this.props.dispatch(routerRedux.push("/door-list"))
                    }
                }
            })
        }
    })
}

  render(){
      const {id,devices,persons}= this.state;
      const {personData, devicesList} = this.props;
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
      };
      // 人员
      let handlerPersonOption = [];
      personData && personData.length > 0 && personData.map(item =>{ //人员列表
          return handlerPersonOption.push(<Option value={item.personId} key={item.personId} >{item.personName}</Option>);
      })
      // 设备
      let devData = [];
      devicesList && devicesList.length > 0 && devicesList.map(item =>{ //设备列表
          return devData.push(<Option value={item.devSn} key={item.devSn} >{item.devName}</Option>);
      })

      // 根据设备id映射设备名
      let devSn=[]
      devices.forEach(element => {
         devSn.push(element.devSn)
      });

      // 根据人员id映射出人员名
      let personid=[]
      persons.forEach(element => {
        personid.push(element.personId+'')
     });
      return (
        <div className="approval-detail">
            <div className="content-main">
              <Form>
                <Row gutter={24}>
                  <Col span={15}>
                  <FormItem {...formItemLayout} label={'设备'}>
                  {getFieldDecorator("devSns",{ initialValue: devSn})(
                    <Select
                      showSearch
                      mode="multiple"
                      style={{ width: '400px' }}
                      placeholder="请选择设备"
                    >
                      {devData}
                    </Select>
                  )}
                </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={15}>
                    <FormItem {...formItemLayout} label={'人员'}>
                    {getFieldDecorator("personIds",{ initialValue: personid})(
                        <Select
                          showSearch
                          mode="multiple"
                          style={{ width: '400px' }}
                          placeholder="请选择人员"
                        >
                          {handlerPersonOption}
                        </Select> 
                    )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>  
              <div className="btn">
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type='primary'  onClick={this.save.bind(this)}>保存</Button>
              </div>
            </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => {
  return {
    personData:state.user.commonPersonData,
    devicesList:state.user.pubEntryDevicesList,
  }
}
export default connect(mapStateToProps)(Form.create()(ApprovalDetail));