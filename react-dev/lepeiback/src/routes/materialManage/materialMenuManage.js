import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Breadcrumb, Upload, Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, isBlank} from '../../utils/public';
import './style.less';
import { runInThisContext } from 'vm';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class MaterialMenuManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          reset:false,
          classDisabled:true,
          materialData: {},
          classValue:'',
          labelMaterials: [],
          uploadFileList: [],
          mode: ['month', 'month'],
          value: [],
          currentLabelId: "",
          visibleDelete: false,
          deleteId: null,
          labelData: []
        };
    }
    componentDidMount=()=>{
      this.getLabels()
    }

    classChange=(val)=>{
        this.setState({classValue:val})
    }
    getLabels=(params)=>{
      this.props.dispatch({
        type:'material/getLabels',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              labelData: res.data.labels
            })
            // if(res.data.labels.length==0){
            //   this.setState({
            //     labelData: [{
            //       "isUsed": 0,
            //       "id": "0",
            //       "label": "",
            //       "pid": "1",
            //       "children": []
            //     }]
            //   })
            // }
          }
        }
      })
    }


    goToDetail=(id)=>{
      this.props.dispatch(routerRedux.push("/material-detail?id="+id))
    }
    handleChange=(value)=>{
      console.log(value)
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      const start=dateString[0]+" 00:00:00";
      const end=dateString[1]+" 23:59:59";
      this.setState({
        startTime:(new Date(start).getTime())/1000,
        endTime:(new Date(end).getTime())/1000
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
   
    handleDeleteCancel = () => {
      this.setState({
        visibleDelete: false,
      });
    }
 
    deleteLabel1 = (id, pid, e) => {
      if(pid!=0){
        return
      }
      let data = this.state.labelData
      let newData = data.filter(i=>{
        return i.id !=id
      })
      this.setState({
        labelData: newData
      })
    }

    deleteLabel2 = (id, pid, e) => {
      console.log(id)
      console.log(pid)
      let data = this.state.labelData
      data.map(item=>{
        if(item.id == pid){
          item.children = item.children.filter(i=>{
            return i.id != id
          })
        }
      })
      this.setState({
        labelData: data
      })
    }

    input1 = (id, pid, e) => {
      console.log(id)
      console.log(pid)
      console.log(e.target.value)
      let data= this.state.labelData
      if(pid==0){
        data.map(item=>{
          if(item.id==id){
            item.label=e.target.value
          }
        })
      }else{
        data.map(item=>{
          if(item.id==pid){
            item.children&&item.children.map(i=>{
              if(i.id==id){
                i.label=e.target.value
              }
            })
          }
        })
      }

      this.setState({
        labelData: data
      })

    }

    getNewLabelId = ()=>{
      let arr = []
      this.state.labelData&&this.state.labelData.map(item=>{
        arr.push(item.id)
        item.children&&item.children.map(i=>{
          arr.push(i.id)
        })
      })
      
      console.log(arr)
      let max = Math.max.apply(null, arr);
      console.log(max);
      return max+1
    }

    addLabel= (id, pid, e) => {
      let data = this.state.labelData
      data&&data.map(item=>{
        if(item.id == id){
          if(item.children){
            if(item.children.length>=10){
              message.warn("最多能只添加10个二级栏目！")
              return
            }
            item.children.push({
              id: this.getNewLabelId()+'',
              isUsed: 0,
              label: undefined,
              pid: id
            })
          }else{
            item.children =[{
              id: this.getNewLabelId()+'',
              isUsed: 0,
              label: undefined,
              pid: id
            }]
          }
        }
      })
      this.setState({
        labelData: data
      })
    }

    deleteLabel=(selfId)=>{
      this.setState({ uploadFileList: this.state.uploadFileList.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.uploadFileList);
      });
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields(["time1", "descirption"]);
        this.setState({
          visible: false,
          reset:true,
          uploadFileList: []
        });
    }
    add = (id) => {
      console.log(id)
      this.setState({
        visible: true,
        currentLabelId: id
      });
    }
    addColumn= () => {
      let id = 1
      if(this.state.labelData.length!=0){
        id = this.getNewLabelId()+''
      }
      this.state.labelData.push({
          id: id,
          isUsed: 0,
          label: undefined,
          pid: "0"
      })
      this.setState({
        labelData: this.state.labelData
      })
    }
    delete = (id) => {
      console.log(id)
      this.props.dispatch({ //获取上传图片token
        type:'material/deleteMaterial',
        callback:(res)=>{
            if(res.code===200){
              message.success("删除成功！")
            }
        }
      })
    }
    save = ()=>{
      let flag = false
      this.state.labelData.map(item=>{
        if(isBlank(item.label)){
          flag = true
        }
        item.children&&item.children.map(i=>{
          if(isBlank(i.label)){
            flag = true
          }
        })
      })
      if(flag){
        message.warn("信息填写不完整")
        return
      }
      let params = {
        labels: this.state.labelData
      }
      
      this.props.dispatch({
        type:'material/updateLabels',
        payload: params,
        callback:(res)=>{
            if(res.code===200){
              message.success("保存成功！")
            }
        }
      })
    }
    handleChange1 = value => {
      this.setState({ value });
    };
    
    showDeleteModal = (id) => {
      console.log(id)
      this.setState({ 
        visibleDelete: true,
        deleteId: id
       });
    };
  
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
       
        return (
            <div className="content-main meterial meterial-menu">
              <div className="breadcrumb">
                <Breadcrumb>
                    {/* <Breadcrumb.Item>学生资料管理</Breadcrumb.Item> */}
                    <Breadcrumb.Item><Link to="/material-list">学生资料管理</Link></Breadcrumb.Item>
                    {/* <Breadcrumb.Item>审批规则管理</Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
              <Row className="row-top">
                <Button type="primary" onClick={this.addColumn.bind(this)}> + 添加栏目</Button>
              </Row>
              <div className="meterial-menu-main">
                {
                  this.state.labelData&&this.state.labelData.map((item, index)=>{
                    return <Row className="menu-item" key={index}>
                            <span className="menu-item-label">
                              <Input className="input1" disabled={ item.isUsed == 1 ? true : false} type="text" value={item.label} onInput={this.input1.bind(this, item.id, item.pid)} placeholder="请输入" />
                              {
                                item.isUsed==1?"":
                                <Icon className="close-circle" theme="filled" onClick={this.deleteLabel1.bind(this, item.id, item.pid)} type="close-circle" />
                              }
                            </span>
                            <Row>
                              {
                                item.children&&item.children.map((i, index)=>{
                                  return  <span key={index} className="menu-item-label menu-item-label1">
                                            <Input className="input2" disabled={i.isUsed == 1 ? true : false} type="text" value={i.label} onInput={this.input1.bind(this, i.id, i.pid)} placeholder="请输入"  />
                                            {
                                              i.isUsed==1?"":
                                              <Icon className="close-circle" theme="filled" onClick={this.deleteLabel2.bind(this, i.id, i.pid)} type="close-circle" />
                                            }
                                          </span>
                                })
                              }
                              <Button type="dashed" onClick={this.addLabel.bind(this, item.id, item.pid)}> + 新增</Button>
                            </Row>
                          </Row>
                  })
                }
              </div>
              <Row className="btn-row">
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
     roomList:state.room,
     approvalRules:state.user.approvalRules,
     allTerms:state.user.allTerms,
     commonGradeData:state.user.commonGradeData,
     classNameData:state.user.classNameData,
  }
}
export default connect(mapStateToProps)(Form.create()(MaterialMenuManage));
