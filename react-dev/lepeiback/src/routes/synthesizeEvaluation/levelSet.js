import React,{Component} from 'react';
import { connect } from 'dva';
import { Icon, Button, Input, Select, Form, Row, Col, Breadcrumb, message} from 'antd';
import { getQueryString, isBlank } from '../../utils/public';
import { Link } from 'dva/router';
import './style.less';
import { log } from 'util';

const Option = Select.Option;

class LevelSet extends Component{
    constructor(props) {
        super(props);
        this.state = {
          levelList:[],
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          option: [],
          levels: [],
          imageUrl: '',
          imgPath:'',
			    title:"等级设置",

        };
    }
    componentDidMount=()=>{
      this.scoreLevelList()
      //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
		  this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:this.state.title,
        parentRoute:"/evaluation-template"
      },
      })
    }
    componentWillUnmount = () =>{
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })
      }
    // 等级列表
    scoreLevelList = () =>{
      const id = getQueryString('templateId')
      this.props.dispatch({
        type:'synthesizeEvaluation/scoreLevelList',
        payload:{"templateId":id},
        callback:(res) =>{
          if(res.code === 200){
            this.setState({
             levelList:res.data
            })
          }
        }
      })
    }
    onChange1=(index, e)=>{
      let oldData = this.state.levelList
      oldData[index].startOrignalData = e.target.value
      this.setState({
        levelList: oldData
      })
    }
    onChange2=(index, e)=>{
      let oldData = this.state.levelList
      oldData[index].endOrignalData = e.target.value
      this.setState({
        levelList: oldData
      })
    }
    onChange3=(index, e)=>{
      let oldData = this.state.levelList
      oldData[index].levelName = e.target.value
      this.setState({
        levelList: oldData
      })
    }
    changeSelect1 = (index,e) =>{
      let oldData = this.state.levelList
      oldData[index].startOrignal = e.props.value
      console.log({oldData})
      this.setState({
        levelList: oldData
      })
    }
    changeSelect2 = (index,e) =>{
      console.log(index,e)
      let oldData = this.state.levelList
      oldData[index].endOrignal = e.props.value
      console.log({oldData})
      this.setState({
        levelList: oldData
      })
    }
   
    // 添加
    add=()=>{
      let oldData = this.state.levelList
      console.log(oldData.length+1)
      oldData.push(
        {
          id: oldData.length + 1,
          startOrignalData: '',
          endOrignalData: '',
          levelName: '',
          startOrignal: 1,
          endOrignal: 1
        }
      )
      this.setState({
        levelList: oldData
      })
    }

    // 删除
    delete=(index)=>{
      let oldData = this.state.levelList
      let newData = oldData.filter((item, i)=>{
        return i!==index
      })
      this.setState({
        levelList: newData
      })
    }
    // 返回
    back=()=>{
      window.history.go(-1)
    }
    sortNumber = (a,b)=> { 
      return a - b 
    } 
    positive = (val) =>{
      if(!(/(^(0|[1-9][0-9]*)(\.\d+)?$)/.test(val))){
        return false
      }
      return true
    }
    
    // 保存
    save=()=>{
      let arr = []
      let originArr = []
      let levels = []
      this.state.levelList.map(item=>{
        arr.push(item.startOrignalData)
        arr.push(item.endOrignalData)
        originArr.push(item.startOrignalData)
        originArr.push(item.endOrignalData)
        levels.push({
          levelName:item.levelName,
          start:item.startOrignalData,
          end:item.endOrignalData,
          startOrignal:item.startOrignal,
          endOrignal:item.endOrignal,
        })
      })
      
      let blank = levels.some(item=>{
        return isBlank(item.levelName)||isBlank(item.start)||isBlank(item.end)
      })
      let isNotOk = arr.some(item=>{
        return !this.positive(item)
      })
      if(blank){
        message.error("所有都是必填项！")
        return
      }
      if(isNotOk){
        message.error("分数输入不合法！")
        return
      }
      // if(originArr.toString() !== arr.sort(this.sortNumber).toString()){
      //   message.error("分数范围冲突！")
      //   return
      // }
      this.props.dispatch({
        type:'synthesizeEvaluation/saveLevels',
        payload: {
          "levels": levels,
          "templateId":getQueryString('templateId')
        },
        callback: res=>{
          if(res.code===200){
            message.success("保存成功！")
            setTimeout(() => {
              window.history.go(-1)
            }, 1000);
          }
        }
      })
    }

   
    render(){
      const { levelList } = this.state
      return (
          <div className="content-main score-level-list"> 
              {/* <div style={{padding:"15px"}}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to="/evaluation-template">评价模板</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>等级设置</Breadcrumb.Item>
                </Breadcrumb>
              </div>  */}
              <Form className="content-form form">
                {
                  levelList&&levelList.map((item,index) =>{
                    return  <Row gutter={18} key={item.id} style={{margin:"20px 0"}}>
                              <Col span={2} className="text text-right">
                                  <span>得分率：</span>
                              </Col> 
                              <Col span={3} className="inputPadding">
                                  <Input placeholder="百分比" onChange={this.onChange1.bind(this, index)} value={item.startOrignalData||undefined}/>
                              </Col> 
                              <Col span={2} className="select-width">
                                <Select onChange={this.changeSelect1} defaultValue={item.startOrignal}>
                                  <Option value={1}>含</Option>
                                  <Option value={0}>不含</Option>
                                </Select>
                              </Col>
                              <Col span={1} className="text" style={{width:"10px"}}>
                                  <span>~</span>
                              </Col> 
                              <Col span={3}>
                                  <Input placeholder="百分比" onChange={this.onChange2.bind(this, index)} value={item.endOrignalData}/>
                              </Col> 
                              <Col span={2} className="select-width">
                                <Select onChange={this.changeSelect2} defaultValue={item.endOrignal}>
                                  <Option value={1}>含</Option>
                                  <Option value={0}>不含</Option>
                                </Select>
                              </Col>
                              <Col span={1} className="text text-right" >
                                  <span>等级：</span>
                              </Col> 
                              <Col span={3} className="inputPadding">
                                  <Input placeholder="等级" onChange={this.onChange3.bind(this, index)} value={item.levelName||undefined}/>
                              </Col> 
                              <Col span={1} className="text">
                                <Icon type="minus-circle" className="icon" onClick={this.delete.bind(this, index)}/>
                              </Col> 
                          </Row>
                  })
                }
                <Row className="row-item">
                  <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '200px' }}>
                    <Icon type="plus" />添加
                  </Button>
                </Row>
              </Form>
              <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
              </Row>
          </div>
      );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(LevelSet));
