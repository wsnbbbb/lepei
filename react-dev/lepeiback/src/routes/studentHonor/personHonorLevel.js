import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux ,Link} from 'dva/router';
import {portUrl} from '../../utils/img';
import {getGradeType,getSexType,getResidence, formatIdcard} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class PersonHonorLevel extends Component{
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
          levels: [
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
          types: [
            {
              id: "",
              name: ""
            }
          ],
          title:"荣誉等级类型",

        };
    }
    componentDidMount=()=>{
       this.getLevelTypList()
       this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-honor"
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
      let oldData = this.state.levels
      oldData[index].code = value
      this.setState({
        levels: oldData
      })
    }
    onChange2=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].title = e.target.value
      this.setState({
        levels: oldData
      })
    }
    onChange3=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].score = e.target.value
      this.setState({
        levels: oldData
      })
    }
    onChange4=(index, e)=>{
      let oldData = this.state.types
      oldData[index].name = e.target.value
      this.setState({
        types: oldData
      })
    }
    add=()=>{
      let oldData = this.state.levels
      oldData.push(
        {
          id: "",
          title: "",
          score: ""
        }
      )
      this.setState({
        levels: oldData
      })
    }
    add1=()=>{
      let oldData = this.state.types
      oldData.push(
        {
          id: "",
          name: ""
        }
      )
      this.setState({
        types: oldData
      })
    }
    delete=(index)=>{
      let oldData = this.state.levels
      let newData = oldData.filter((item, i)=>{
        return i!==index
      })
      this.setState({
        levels: newData
      })
    }
    delete1=(index)=>{
      let oldData = this.state.types
      let newData = oldData.filter((item, i)=>{
        return i!==index
      })
      this.setState({
        types: newData
      })
    }
    back=()=>{
      window.history.go(-1)
    }
    
    getLevelTypList=()=>{
      this.props.dispatch({
        type: 'honor/levelTypList',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                levels: res.data.levels,
                types: res.data.types
              })
            }
        }
      })
    }

    save=()=>{
      let flag = true
      this.state.levels.map(item=>{
        if(item.score&&!(/(^[1-9]\d*$)/.test(item.score))){
          flag = false
        }
      })
      if(!flag){
        message.warning("输入的分数不合理，应为1-999的整数")
        return
      }
      this.props.dispatch({
        type: 'honor/saveHonorLevel',
        payload: {
          levels: this.state.levels,
          types: this.state.types
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

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getScoreList(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: '确定要删除这条学生信息吗？',
        onOk() {
          me.props.dispatch({
            type:'person/deletePerson',
            payload:{"personId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.setState({selectedRowKeys:[]})
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "personType":1,
                    "kw":values.kw||'',
                    "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
                    "classId":me.state.classValue?me.state.classValue.substring(me.state.classValue.lastIndexOf('-')+1, me.state.classValue.length):''
                  }
                  me.getScoreList(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    // 分页
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getScoreList(params)
      })
    }
    goToDetail=(type,id)=>{
      if(Number(type)===1){
        this.props.dispatch(routerRedux.push("/student-detail?type="+type))
      }else{
        this.props.dispatch(routerRedux.push("/student-detail?type="+type+"&personId="+id))
      }
    }
    upload=()=>{
      this.props.dispatch(routerRedux.push("/upload-student"));
    }
    selectChange=(selectedRowKeys, selectedRows)=>{
      let ids=[];
      selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
        return ids.push(item.personId)
      })
      this.setState({personIds:ids,selectedRowKeys})
    }
    delAll=()=>{
      if(this.state.personIds.length<=0){
        return message.error("请先选择人员",2)
      }
      this.props.dispatch({
        type:'person/delAllPerson',
        payload:{"personId":this.state.personIds},
        callback:(res)=>{
          if(res.code===200){
            message.success('删除成功',2)
            this.setState({selectedRowKeys:[]})
            this.props.form.validateFields((err, values) => {
              const params={
                "page":this.state.page,
                "prePage":this.state.prePage,
                "personType":1,
                "kw":values.kw||'',
                "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
                "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
              }
              this.getScoreList(params)
            })
          }
        }
      })
    }
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    export=()=>{
        this.props.form.validateFields((err, values) => {
          let token=sessionStorage.getItem("token");
          let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
          let userId=sessionStorage.getItem("userId");
          let kw=values.kw||'';
          let gradeId = values.gradeId||'';
          let classId = this.state.classValue||'';
          let url=portUrl("/manager/person-score/export?userId="+userId+"&userType="+userType+"&accessToken="+token+
            "&kw="+kw+"&gradeId="+gradeId+"&classId="+classId)
          this.setState({exportUrl:url})
        })
      }
    render(){
        const {option, levels, types} = this.state

        const options1 = option&&option.map((item)=>{
        return <Option key={item.code}>{item.name}</Option>
      })
    
    
        return (
            <div className="content-main student-honor">
                {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-honor">学生荣誉</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>荣誉等级类型</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
                <Row className="row-item">
                  <h3>荣誉等级</h3>
                </Row>
                <Row className="row-item">
                  <Col span={6}>
                    <div>级别等级</div>
                  </Col>
                  <Col span={6}>
                    <div>分值</div>
                  </Col>
                </Row>
                {
                  levels&&levels.map((item, index)=>{
                    return <Row key={index} className="row-item">
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange2.bind(this, index)} value={item.title||undefined} style={{ width: 120 }}/>
                            </Col>
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange3.bind(this, index)} maxLength={3} value={item.score||undefined} style={{ width: 120 }}/>
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

                <Row className="row-item">
                  <h3>荣誉类型</h3>
                </Row>

                {
                  types&&types.map((item, index)=>{
                    return <Row key={index} className="row-item">
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange4.bind(this, index)} value={item.name||undefined} style={{ width: 120 }}/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="danger" onClick={this.delete1.bind(this, index)} className="score-rule">删除</Button>
                            </Col>
                          </Row>
                  })
                }         
                <Row className="row-item" style={{textAlign: "center"}}>
                  <Button type="dashed" onClick={this.add1.bind(this)} style={{ width: '200px' }}>
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

// ExamplePage.proplevels = {
// };
const mapStateToProps = (state) => {
  return {
    
  }
}

export default connect(mapStateToProps)(Form.create()(PersonHonorLevel));
