import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, DatePicker, Upload, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux ,Link} from 'dva/router';
import {portUrl, getImg} from '../../utils/img';
import moment from 'moment';

import {getGradeType,getSexType,getQueryString, getResidence, formatIdcard} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ScoreHistory extends Component{
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
            {
              id: '',
              startScore: '',
              endScore: '',
              title: '',
              level: "",
              icon: ""
            },
            {
              id: '',
              startScore: '',
              endScore: '',
              title: '',
              level: "",
              icon: ""
            }
          ],
          imageUrl: '',
          imgPath:'',
          list: [],
          title:"积分历史",
        };
    }
    componentDidMount=()=>{

    moment().format("YYYY");

      let params = {
        personId: getQueryString("personId"),
        year: moment().format("YYYY"),
        month: ''
      }
       this.getPersonScoreLog(params)


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
    onChange=(index, e)=>{
      let oldData = this.state.levels
      oldData[index].startScore = e.target.value
      this.setState({
        levels: oldData
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
    
    getPersonScoreLog=(params)=>{
      this.props.dispatch({
        type: 'score/getPersonScoreLog',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }

    save=()=>{
      this.props.dispatch({
        type: 'score/saveRule',
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
          "year": values.year,
          "month": values.month,
          personId: getQueryString("personId")
        }
        this.getPersonScoreLog(params)
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
          // this.setState({imgPath: info.file.response.id})
          // this.setState({imageUrl: info.file.response.id})
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
        const {option, levels, imgPath, list} = this.state
        const { imageUrl } = this.state;
        const options1 = option&&option.map((item)=>{
          return <Option key={item.code}>{item.name}</Option>
        })
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
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
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="content-main student-score">
                {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-score">学生积分</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>积分历史</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
                <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={16}>
                    <FormItem label=''>
                      {getFieldDecorator('year', { initialValue: moment().format("YYYY")})(
                        <Select
                          style={{width: "120px"}}
                          placeholder="请选择年"
                        >
                        <Option value="2019">2019</Option>
                        <Option value="2020">2020</Option>
                        <Option value="2021">2021</Option>
                        <Option value="2022">2022</Option>
                        <Option value="2023">2023</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                        <Option value="2027">2027</Option>
                        <Option value="2028">2028</Option>
                        <Option value="2029">2029</Option>
                        <Option value="2030">2030</Option>
                      </Select>
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {getFieldDecorator('month', { initialValue: '' })(
                        <Select
                          style={{width: "120px"}}
                          placeholder="请选择月份"
                        >
                        <Option value="">全部</Option>
                        <Option value="01">1月</Option>
                        <Option value="02">2月</Option>
                        <Option value="03">3月</Option>
                        <Option value="04">4月</Option>
                        <Option value="05">5月</Option>
                        <Option value="06">6月</Option>
                        <Option value="07">7月</Option>
                        <Option value="08">8月</Option>
                        <Option value="09">9月</Option>
                        <Option value="10">10月</Option>
                        <Option value="11">11月</Option>
                        <Option value="12">12月</Option>
                      </Select>
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form> 
                {
                  list&&list.map((item, index)=>{
                    return  <div key={index} style={{padding: "20px 0"}}>
                            <Row style={{fontSize: "16px", paddingBottom: "10px"}}>
                              <Col span={4} style={{background: "#ccc", paddingLeft: "5px"}}>{item.month}</Col>
                              <Col span={2} style={{background: "#ccc"}}>获取：{item.getScore}</Col>
                              <Col span={2} style={{textAlign: "right", background: "#ccc", paddingRight: "5px"}}>使用：{item.useScore}</Col>
                            </Row>
                              {
                                item.list&&item.list.map((i, idx)=>{
                                  return  <Row style={{padding: "5px 0"}} key={idx}> 
                                            <Col span={4} style={{paddingLeft: "5px"}}>{i.title}</Col>
                                            <Col span={2}>{i.date}</Col>
                                            <Col span={2} style={{textAlign: "right", paddingRight: "5px"}}>{i.changeScore}</Col>
                                          </Row>
                                })
                              }
                             
                           </div>
                  })
                }
                <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                  <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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

export default connect(mapStateToProps)(Form.create()(ScoreHistory));
