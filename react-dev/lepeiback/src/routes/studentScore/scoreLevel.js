import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, Upload, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux ,Link} from 'dva/router';
import {portUrl, getImg} from '../../utils/img';

import { isPositiveInteger, isBlank} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreLevel extends Component{
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
          levels: [],
          imageUrl: '',
          imgPath:'',
          title:"积分等级",

        };
    }
    componentDidMount=()=>{
        this.getLevelList()
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res)=>{
                if(res.code===200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })

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
    onChange1=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].startScore = e.target.value
      this.setState({
        levels: oldData
      })
    }
    onChange2=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].endScore = e.target.value
      this.setState({
        levels: oldData
      })
    }
    onChange3=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].title = e.target.value
      this.setState({
        levels: oldData
      })
    }
    onChange4=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].level = e.target.value
      this.setState({
        levels: oldData
      })
    }
    add=()=>{
      let oldData = this.state.levels
      oldData.push(
        {
          id: '',
          startScore: '',
          endScore: '',
          title: '',
          level: "",
          icon: ""
        }
      )
      this.setState({
        levels: oldData
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
    back=()=>{
      window.history.go(-1)
    }
    
    getLevelList=()=>{
      this.props.dispatch({
        type: 'score/getLevelList',
        payload: {},
        callback: res=>{
            if(res.code===200){
              this.setState({
                levels: res.data
              })
            }
        }
      })
    }
    sortNumber = (a,b)=> { 
      return a - b 
    } 
    
    save=()=>{
      let arr = []
      let originArr = []
      this.state.levels.map(item=>{
        arr.push(item.startScore)
        arr.push(item.endScore)
        originArr.push(item.startScore)
        originArr.push(item.endScore)
      })
      
      let blank = this.state.levels.some(item=>{
        return isBlank(item.title)||isBlank(item.level)||isBlank(item.icon)
      })

      let varifyLevel = this.state.levels.some(item=>{
        return !isPositiveInteger(item.level)
      })

      let isNotOk = arr.some(item=>{
        return !isPositiveInteger(parseFloat(item))
      })

      if(blank){
        message.error("所有都是必填项！")
        return
      }

      if(varifyLevel){
        message.error("等级输入不合法")
        return
      }
     
      if(isNotOk){
        message.error("分数输入不合法！")
        return
      }
      if(originArr.toString() !== arr.sort(this.sortNumber).toString()){
        message.error("积分范围冲突！")
        return
      }
      
      this.props.dispatch({
        type: 'score/saveLevel',
        payload: {
          levels: this.state.levels
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
    handleChangeImg = (index, info) => {
      if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
          let oldData = this.state.levels
          oldData[index].icon = info.file.response.id
          this.setState({
            levels: oldData
          })
          
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
      }
    };
    beforeUpload=(file)=> {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片格式仅支持JPG/PNG');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片不能大于2MB!');
      }
      return isJpgOrPng && isLt2M;
    }
    render(){
        const {option, levels, imgPath} = this.state
        const { imageUrl } = this.state;
        const options1 = option&&option.map((item)=>{
          return <Option key={item.code}>{item.name}</Option>
        })
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">上传</div>
          </div>
        );
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const props = {
            // name="avatar",
            // listType="picture-card",
            // className="avatar-uploader",
            // showUploadList={false},
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76",
            // beforeUpload={this.exportbeforeUpload},
            // onChange={this.handleChangeImg},
            name: 'file',
            action: 'https://upload.qiniup.com/',
            accept:"image/jpg,image/jpeg,image/png",
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
                token: qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            // onChange: this.handleChangeImg,
            beforeUpload: this.beforeUpload
        };
    
        return (
            <div className="content-main student-score">
                {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-score">学生积分</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>积分等级</Breadcrumb.Item>
                  </Breadcrumb>
                </div>    */}
                <Row className="row-item">
                  <Col span={6}>
                    <div>积分范围</div>
                  </Col>
                  <Col span={6}>
                    <div>头衔</div>
                  </Col>
                  <Col span={6}>
                    <div>等级</div>
                  </Col>
                  <Col span={6}>
                    <div>头衔图标</div>
                  </Col>
                </Row>
                {
                  levels&&levels.map((item, index)=>{
                    return <Row key={index} className="row-item">
                            <Col span={6}>
                                <Input placeholder="请输入" maxLength={11} onChange={this.onChange1.bind(this, index)} value={item.startScore||undefined} style={{ width: 80 }}/>&nbsp;&nbsp;-&nbsp;&nbsp; 
                                <Input placeholder="请输入" maxLength={11} onChange={this.onChange2.bind(this, index)} value={item.endScore||undefined} style={{ width: 80 }}/>
                            </Col>
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange3.bind(this, index)} value={item.title||undefined} style={{ width: 120 }}/>
                            </Col>
                            <Col span={6}>
                                <Input placeholder="请输入" onChange={this.onChange4.bind(this, index)} value={item.level||undefined} style={{ width: 120 }}/>
                            </Col>
                            <Col span={4}>
                              <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                onChange={this.handleChangeImg.bind(this, index)}
                                {...props}
                              >
                                {/* <img className="person-img" src={getImg(imgPath)} /> */}
                                {item.icon ? <img src={getImg(item.icon)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                              </Upload>
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

export default connect(mapStateToProps)(Form.create()(ScoreLevel));
