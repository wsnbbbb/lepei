import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux ,Link} from 'dva/router';
import {portUrl} from '../../utils/img';
import {isPositiveInteger} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreRule extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          selectedRowKeys:[],
          exportUrl: '',
          option: [],
          rules: [
            // {
            //   code: "",
            //   scorePerTime: "",
            //   maxScorePerDay: ""
            // },
            // {
            //   code: "",
            //   scorePerTime: "",
            //   maxScorePerDay: ""
            // }
          ],
          title:"积分规则",

        };
    }
    componentDidMount=()=>{
       this.getRuleList()
       this.getRuleItems()

       this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-score"
        },
      })
    }

    componentWillUnmount = () => {
      //组件卸载时，清空手动加入的面包屑
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {},
      })    
  }
    onChange1=(index, value)=>{
      let oldData = this.state.rules
      oldData[index].code = value
      this.setState({
        rules: oldData
      })
    }
    onChange2=(index, e)=>{
      let oldData = this.state.rules
      oldData[index].scorePerTime = e.target.value
      this.setState({
        rules: oldData
      })
    }
    onChange3=(index, e)=>{
      let oldData = this.state.rules
      oldData[index].maxScorePerDay = e.target.value
      this.setState({
        rules: oldData
      })
    }
    add=()=>{
      let oldData = this.state.rules
      oldData.push(
        {
          code: "",
          scorePerTime: "",
          maxScorePerDay: ""
        }
      )
      this.setState({
        rules: oldData
      })
    }
    delete=(index)=>{
      let oldData = this.state.rules
      let newData = oldData.filter((item, i)=>{
        return i!==index
      })
      this.setState({
        rules: newData
      })
    }
    back=()=>{
      window.history.go(-1)
    }

    getRuleItems=()=>{
      this.props.dispatch({
        type: 'score/getRuleItems',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                option: res.data
              })
            }
        }
      })

    }
    
    getRuleList=()=>{
      this.props.dispatch({
        type: 'score/getRuleList',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                rules: res.data
              })
            }
        }
      })
    }

    save=()=>{
      let flag = this.state.rules.some(item=>{
        return !isPositiveInteger(item.scorePerTime)||!isPositiveInteger(item.maxScorePerDay)
      })
      if(flag){
        message.error("可获积分和每日上限必须为正整数！")
        return
      }
      this.props.dispatch({
        type: 'score/saveRule',
        payload: {
          rules: this.state.rules
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
        const {option, rules} = this.state
        const options1 = option&&option.map((item)=>{
          return <Option key={item.code}>{item.name}</Option>
        })

        return (
            <div className="content-main student-score">
                {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-score">学生积分</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>积分规则</Breadcrumb.Item>
                  </Breadcrumb>
                </div>    */}
                <Row className="row-item">
                  <Col span={6}>
                    <div>积分来源</div>
                  </Col>
                  <Col span={6}>
                    <div>可获积分</div>
                  </Col>
                  <Col span={6}>
                    <div>每日上限</div>
                  </Col>
                </Row>
                {
                  rules&&rules.map((item, index)=>{
                    return <Row key={index} className="row-item">
                            <Col span={6}>
                                <Select  placeholder="请选择" showSearch onChange={this.onChange1.bind(this, index)} value={item.code||undefined} style={{ width: 120 }}>
                                    {options1}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange2.bind(this, index)} value={item.scorePerTime||undefined} style={{ width: 120 }}/>
                            </Col>
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange3.bind(this, index)} value={item.maxScorePerDay||undefined} style={{ width: 120 }}/>
                            </Col>
                            <Col span={2}>
                                <Button type="danger" onClick={this.delete.bind(this, index)} className="score-rule">删除</Button>
                            </Col>
                          </Row>
                  })
                }
                
                <Row className="row-item" style={{textAlign: "center"}}>
                  <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '200px' }}>
                    <Icon type="plus" />添加
                  </Button>
                </Row>

                <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                  <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
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

export default connect(mapStateToProps)(Form.create()(ScoreRule));
