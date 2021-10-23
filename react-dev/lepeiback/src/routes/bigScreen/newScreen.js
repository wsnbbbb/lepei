import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, Checkbox, Switch, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import { getQueryString } from '../../utils/public';
import './style.less';

const Option = Select.Option;
const FormItem = Form.Item;

class NewScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: {},
          cardInfo: [],
          moduleList: [],
          selModule: [],
          selectedModule: [],
          selModule2: [],
          selectedModule2: [],
          title:"新建"
          
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/screen-list"
        },
      })
      this.getModules()
    }

    componentWillUnmount = () => {
      sessionStorage.removeItem("qiniuToken");
          //组件卸载时，清空手动加入的面包屑
          this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {},
          })
        
    }
    
    getModules=()=>{
      this.props.dispatch({
        type: 'bigScreen/getModules',
        payload: {},
        callback: res=>{
          this.setState({
            moduleList: res.data
          })
        }
      })
    }

    getNavDetail=()=>{
      let params = {
        type: getQueryString("type")
      }
      this.props.dispatch({
        type:'bigScreen/getNavDetail',
        payload: params,
        callback: res=>{
          this.props.form.setFieldsValue({"title": res.data.title, "type": getQueryString("type")})
          if(res.data.navs.length > 1){
            this.props.form.setFieldsValue({"switch": true})
          }
          let navs = []
          let selectMavs = []
          res.data.navs[0].navs.map(item=>{
            navs.push(item.code+'|'+item.name)
            selectMavs.push({
              name: item.code+'|'+item.name,
              order: item.position
            })
          })

          if(res.data.navs.length>1){
            let navs1 = []
            let selectMavs1 = []
            res.data.navs[1].navs.map(item=>{
              navs1.push(item.code+'|'+item.name)
              selectMavs1.push({
                name: item.code+'|'+item.name,
                order: item.position
              })
            })
            this.setState({
              selModule2: selectMavs1,
              selectedModule2: navs1
            })
          }

          console.log(navs)
          this.setState({
            selModule: selectMavs,
            selectedModule: navs,
          })
        }
      })
    }

    handleChange(value) {
      console.log(`selected ${value}`);

      let arr = []
      value.map((item, index)=>{
        arr.push({
          name: item,
          order: index + 1
        })
      })
      this.setState({
        selModule: arr,
        selectedModule: value
      })
    }

    handleChange2(value) {
      console.log(`selected ${value}`);
      let arr = []
      value.map((item, index)=>{
        arr.push({
          name: item,
          order: index + 1
        })
      })
      this.setState({
        selModule2: arr,
        selectedModule2: value
      })
    }

    changeOrder=(index, e)=>{
      let old = this.state.selModule
      if(e.target.value>6){
        return message.warn("次序不能大于6")
      }
      old[index].order = e.target.value
      this.setState({
        selModule: old
      })
      console.log(old)
    }

    changeOrder2=(index, e)=>{
      let old = this.state.selModule2
      if(e.target.value>6){
        return message.warn("次序不能大于6")
      }
      old[index].order = e.target.value
      this.setState({
        selModule2: old
      })
    }

    back=()=>{
      window.history.go(-1)
    }

    save=()=>{
      const { form } = this.props;
      const switchValue = form.getFieldValue('switch')
      let me = this
      let navs = []
      let navs1 = []
      me.state.selModule.map(item=>{
        navs1.push({
          code: item.name.split('|')[0],
          position: item.order
        })
      })
      let navs2 = []
      me.state.selModule2.map(item=>{
        navs2.push({
          code: item.name.split('|')[0],
          position: item.order
        })
      })

      if(switchValue){
        navs = [
          {
            page: 1,
            navs: navs1
          },
          {
            page: 2,
            navs: navs2
          },
        ]
      }else{
        navs = [
          {
            page: 1,
            navs: navs1
          }
        ]
      }
      this.props.form.validateFields((err, values) => {
        const params={
          "type": values.type,
          "title": values.title,
          "navs": navs
        }
        this.props.dispatch({
          type: 'bigScreen/saveNav',
          payload: params,
          callback: res=>{
            if(res.code == 200){
              message.success("保存成功！")
              window.history.go(-1)
            }
          }
        })
      })
    }

    render(){
      const {moduleList, selModule, selModule2, selectedModule, selectedModule2} =this.state;
      const { getFieldDecorator, getFieldValue } = this.props.form;

      const switchValue = getFieldValue('switch');
       console.log("render")
       const formItemLayout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 10 }
      };

      let options=[]
      moduleList&&moduleList.length>0&&moduleList.map((item, index)=>{
        return options.push(<Option key={index} disabled={switchValue&&selectedModule2.includes(item.code+'|'+item.name)} value={item.code+'|'+item.name}>{item.name}({item.size}&times;1)</Option>)
      })
      let options1=[]
      moduleList&&moduleList.length>0&&moduleList.map((item, index)=>{
        return options1.push(<Option key={index} disabled={selectedModule.includes(item.code+'|'+item.name)} value={item.code+'|'+item.name}>{item.name}({item.size}&times;1)</Option>)
      })
        return (
            <div className="content-main ban-card">
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='选择大屏分辨率'>
                      {getFieldDecorator('type',{initialValue:'1'})(
                        <Select onChange={this.typeChange} style={{ width: '200px'}}>
                            <Option value="1">1920*1080</Option>
                            <Option value="2">1920*576</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='标题'>
                      {getFieldDecorator('title',{
                        initialValue:'', 
                        rules: [{
                            required: true,
                            message:"请输入标题",
                            whitespace: true,
                        }],
                        })(
                        <Input placeholder='请输入标题' style={{ width: '200px'}} />
                      )}
                    </FormItem>
                  </Col> 
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                  <FormItem {...formItemLayout} label="是否有第二屏">
                    {getFieldDecorator('switch', { valuePropName: 'checked' })(<Switch />)}
                  </FormItem>
                  </Col> 
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={'模块（第一屏）'}>
                      {getFieldDecorator("select", {initialValue: selectedModule})(
                        <Select showSearch mode="multiple" style={{ width: '200px'}}
                        onChange={this.handleChange.bind(this)}
                        >
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={'排序（第一屏）'}>
                    {
                      selModule.map((item, index)=>{
                        return <Row key={index}>
                                <Col span={20}>
                                    <div>{item.name.split("|")[1]}</div>
                                </Col>
                                <Col span={4}>
                                    <Input placeholder='请输入次序' onChange={this.changeOrder.bind(this, index)} value={item.order} style={{ width: '100px'}} />
                                </Col>
                              </Row>
                      })
                    }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24} style={{display: switchValue?"block":"none"}}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={'模块（第二屏）'}>
                      {getFieldDecorator("select2", {initialValue: selectedModule2})(
                        <Select showSearch mode="multiple" style={{ width: '200px'}}
                        onChange={this.handleChange2.bind(this)}
                        >
                          {options1}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24} style={{display: switchValue?"block":"none"}}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={'排序（第二屏）'}>
                    {
                      selModule2.map((item, index)=>{
                        return <Row key={index}>
                                <Col span={20}>
                                    <div>{item.name.split("|")[1]}</div>
                                </Col>
                                <Col span={4}>
                                  <Input placeholder='请输入次序' onChange={this.changeOrder2.bind(this, index)} value={item.order} style={{ width: '100px'}} />
                                </Col>
                              </Row>
                      })
                    }
                    </FormItem>
                  </Col>
                </Row>
                
              </Form>  

              <Row>
                <Col style={{textAlign: "center"}}>
                      <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.save.bind(this)}>保存</Button>
                  </Col>
              </Row>
         
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(NewScreen));
