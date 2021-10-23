import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Table,Button,Input,Select,Form,Row,Col,TreeSelect,Icon,Breadcrumb,Tabs,message,Modal,DatePicker,InputNumber } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {getGradeType, formatDate, isBlank} from '../../utils/public';
import './style.less';
import { debug } from 'util';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class essentialList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          visibleDelete: false,
          visibleDeletePoint: false,
          visibleEditQuataName: false,
          visibleEditMaxscore: false,
          visibleEditDefaultscore: false,
          visibleEditAssessorName: false,
          visibleEditMaterial: false,
          visibleEditLabel: false,
          page:1,
          prePage:20,
          controlBtn:false,
          detailData:'',
          inputArr:[
            {
              text: undefined,
              selfId: 1
            }
          ],
          inputArr1:[
            {
              text: undefined,
              selfId: 1
            }
          ],
          addPid: undefined,
          deletePid: undefined,
          value: undefined,
          treeData: [],
          treeData1: [],
          parentQuotaId: undefined,
          deletePointId: undefined,
          commentType: '',
          editQuataName: undefined,
          editQuataId: undefined,
          editMaxscore: undefined,
          eidtdefaultscore: undefined,
          eidtAssessorName: undefined,
          treeValue: [],
          editMaterial: undefined,
          editPid: undefined,
          editAssessorType: undefined,
          totalScore: 0,
          treeData2: [],
          title:"要点管理",

        };
    }
    componentDidMount=()=>{
      this.setState({
        "commentType": sessionStorage.getItem("commentType")
      })
      const params={
        "templateId": this.props.match.params.id,
      }
      this.getTemplateDetail(params)
      this.getQuotas(params)
      this.getPointTeacher();

      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/student-evaluation"
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

    getTemplateDetail=(params)=>{
      this.props.dispatch({
        type:'evaluation/templateDetail',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           
            var arrData=[]

            res.data.map(i=>{
              let quotaName=[]
              if(i._child && Array.isArray(i._child)){
                i._child.map(j=>{
                  if(j._child && Array.isArray(j._child)){
                    j._child.map(k=>{
                      if(k._child && Array.isArray(k._child)){
                        k._child.map(m=>{
                          if(m._child && Array.isArray(m._child)){
                          }else{
                            quotaName.push([i.name,j.name,k.name,m.name])
                          }
                        })
                      }else{
                        quotaName.push([i.name,j.name,k.name,''])
                      }
                    })
                  }else{
                    quotaName.push([i.name,j.name,'',''])
                  }
                })
              }else{
                quotaName.push([i.name,'','',''])
              }
              quotaName.map(item=>{
                arrData.push(item)
              })
            })
            console.log(arrData)


            function parseJson(arr) {
              arr = arr.slice()
              var arr1 = []

              function toParse(arr) {
                
                arr.forEach(function (item, index) {
                      if (item._child && Array.isArray(item._child)) {
                          item._child.map(j=>{
                            if((!j._child) || (!Array.isArray(j._child))){
                              arr1.push({
                                "assessorName": j.assessorName,
                                "assessorId": j.assessorId,
                                "defaultScore": j.defaultScore,
                                "quotaName": j.quotaName,
                                "label": j.label,
                                "material": j.material,
                                "maxScore": j.maxScore,
                                "pid": j.pid,
                                "quota_id": j.quota_id,
                                "pid": j.pid
                              })
                            }else{
                              toParse(j['_child'])

                            }
                          })
                      }else{
                        arr1.push({
                          "assessorName": item.assessorName,
                          "assessorId": item.assessorId,
                          "defaultScore": item.defaultScore,
                          "quotaName": item.quotaName,
                          "label": item.label,
                          "material": item.material,
                          "maxScore": item.maxScore,
                          "pid": item.pid,
                          "quota_id": item.quota_id,
                          "pid": item.pid
                        })
                      }
                     
                  })
                  return arr1
              }
              return toParse(arr)
            }

            // parseJson(res.data)
            console.log(parseJson(res.data))
            let parseData = parseJson(res.data)
           

            if(parseData.length===arrData.length){
              parseData.map((item, index)=>{
                item.quotaName1 = arrData[index][0]
                item.quotaName2 = arrData[index][1]
                item.quotaName3 = arrData[index][2]
                item.quotaName4 = arrData[index][3]
              })
            }else{
              // alert("层级数据错误")
            }

            console.log(parseData)
            this.setState({
              detailData: parseData
            },()=>{
              let totalScore=0
              this.state.detailData.map(item=>{
                if(item.maxScore){
                  totalScore+=parseFloat(item.maxScore)
                }
              })
              this.setState({
                totalScore: totalScore
              })
            })

          }
        }
      })
    }
    getQuotas=(params)=>{
      this.props.dispatch({
        type:'evaluation/getQuotas',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            let data1 = res.data
            let data2 = JSON.parse(JSON.stringify(res.data))
            function parseJson(arr) {
                arr = arr.slice()
                function toParse(arr) {
                    arr.forEach(function (item) {
                        if (item._child && Array.isArray(item._child)) {
                            item['children'] = item._child
                            toParse(item['children'])
                        }
                        item['title'] = item.name
                        item["key"] = item.quota_id
                        item['value'] = item.quota_id
                        delete item.pid
                        delete item._child
                    })
                    return arr
                }
                return toParse(arr)
            }
            function parseJson1(arr) {
              arr = arr.slice()
              function toParse(arr) {
                  arr.forEach(function (item) {
                      if (item._child && Array.isArray(item._child)) {
                          item['children'] = item._child
                          item['disabled'] = true
                          toParse(item['children'])
                      }
                      item['title'] = item.name
                      item["key"] = item.quota_id
                      item['value'] = item.quota_id
                      delete item.pid
                      delete item._child
                  })
                  return arr
              }
              return toParse(arr)
          }
            console.log(parseJson(res.data))
            this.setState({
              treeData: parseJson(data1),
              treeData1: parseJson1(data2)
            })
          }
        }
      })
    }
    getPointTeacher=(params)=>{
      this.props.dispatch({
        type:'evaluation/getPointTeacher',
        payload: params,
        callback: (res)=>{
          if(res.code===200){
            let arr= []
            res.data.map(item=>{
              arr.push(item.key)
            })
            this.setState({
              treeData2: res.data,
              parentNode: arr
            })
            
          }
        }
      })
    }
    showAddQuotas = () => {
      this.setState({
        visible: true,
      });
    }
    showDeleteQuotas =()=>{
      this.setState({
        visibleDelete: true,
      });
    }
    showDeletePoint =()=>{
      this.setState({
        visibleDeletePoint: true,
      });
    }
    handleCancelDelete =()=>{
      this.setState({
        visibleDelete: false,
      })
    }
    handleCancelDeletePoint=()=>{
      this.setState({
        visibleDeletePoint: false,
      })
    }
    handleCancelEditQuataName=()=>{
      this.setState({
        visibleEditQuataName: false,
      })
    }
    handleCancelEditMaxscore=()=>{
      this.setState({
        visibleEditMaxscore: false,
      })
    }
    handleCancelEditDefaultscore=()=>{
      this.setState({
        visibleEditDefaultscore: false,
      })
    }
    handleCancelEditAssessorName=()=>{
      this.setState({
        visibleEditAssessorName: false,
        treeValue: []
      })
    }
    handleCancelEditLabel=()=>{
      this.setState({
        visibleEditLabel: false,
        // treeValue: []
      })
    }
    handleCancelEditMaterial=()=>{
      this.setState({
        visibleEditMaterial: false,
        editMaterial: undefined
      })
    }
    handleChange = (value)=> {
      console.log('changed', value);
      this.setState({
        "addPid": value
      })
    }
    handleChange1 = (value)=> {
      console.log('changed', value);
      this.setState({
        "deletePointId": value
      })
    }

    addQuotas=()=>{
      if(this.state.inputArr.length>=20){
        message.warning("最多添加20个一级指标！")
        return
      } 
      if(this.state.inputArr.length==0){
        this.state.inputArr.push(
          {
            text: undefined,
            selfId: 1
          }
        )
      }else{
        let selfId = Number(this.state.inputArr[this.state.inputArr.length-1].selfId) + 1
        this.state.inputArr.push(
          {
            text: undefined,
            selfId: selfId
          }
        )
      }
      
      this.setState({
        inputArr: this.state.inputArr
      })
    }
    addQuotas1=()=>{
      if(this.state.inputArr1.length>=4){
        message.warning("最多添加4个文字标签！")
        return
      } 
      if(this.state.inputArr1.length==0){
        this.state.inputArr1.push(
          {
            text: undefined,
            selfId: 1
          }
        )
      }else{
        let selfId = Number(this.state.inputArr1[this.state.inputArr1.length-1].selfId) + 1
        this.state.inputArr1.push(
          {
            text: undefined,
            selfId: selfId
          }
        )
      }
      
      this.setState({
        inputArr1: this.state.inputArr1
      })
    }

    deleteQuotas=(selfId)=>{
      this.setState({ inputArr: this.state.inputArr.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.inputArr);
      });
    }

    deleteQuotas1=(selfId)=>{
      this.setState({ inputArr1: this.state.inputArr1.filter(item => item.selfId !== selfId) }, () => {
        console.log('delete', this.state.inputArr1);
      });
    }

    onChange = (value) => {
      console.log(value);
      this.setState({ value });
      this.setState({
        "addPid": value
      })
    }

    onChange1 = (value) => {
      console.log(value);
      this.setState({
        "deletePid": value
      })
    }

    onChange2 = (selfId, e)=> {
      this.state.inputArr.map(item=>{
        if(item.selfId== selfId){
          item.text=e.target.value
        }
      })
      this.setState({
        inputArr: this.state.inputArr
      })
    }

    onChange21 = (selfId, e)=> {
      this.state.inputArr1.map(item=>{
        if(item.selfId== selfId){
          item.text=e.target.value
        }
      })
      this.setState({
        inputArr1: this.state.inputArr1
      })
    }
    onChange3 = (e)=> {
      this.setState({
        editQuataName: e.target.value
      })
    }
    onChange4 = (value)=> {
      this.setState({
        editMaxscore: value
      })
    }
    onChange5 = (value)=> {
      this.setState({
        eidtdefaultscore: value
      })
    }
    onChange6 = (e)=> {
      this.setState({
        editMaterial: e.target.value
      })
    }
    
    onChange7 = (value) => {
      console.log(value);
      this.setState({
        "parentQuotaId": value,
        "deletePointId": undefined
      },()=>{
          const params={
            "quotaId": this.state.parentQuotaId,
          }
          this.props.dispatch({
            type:'evaluation/getPointByQuota',
            payload: params,
          })
        }
      )
    }

    onChange8 = (value)=> {
      console.log(`switch to ${value}`);
      this.setState({
        assessorType: value,
        editAssessorType: value,
        treeValue: []
      })
    }
    handleChange6=(value)=> {
      console.log(`selected1 ${value}`);
      this.setState({
        "treeValue": value
      })
    }
    showModalEditName = (name, quota_id, pid) => {
      this.setState({
        visibleEditQuataName: true,
        editQuataName: name,
        editQuataId: quota_id,
        editPid: pid
      });
    }

    showModalEditMaxscore = (maxScore,quota_id, pid, defaultScore) => {
      this.setState({
        visibleEditMaxscore: true,
        editMaxscore: maxScore,
        editQuataId: quota_id,
        editPid: pid,
        eidtdefaultscore: defaultScore
      });
    }

    showModalEditDefaultscore = (maxScore,quota_id, pid, defaultScore) => {
      this.setState({
        visibleEditDefaultscore: true,
        editMaxscore: maxScore,
        editQuataId: quota_id,
        editPid: pid,
        eidtdefaultscore: defaultScore,
      });
    }

    showModalEditAssessorName = (nameArr,quota_id, pid) => {
      console.log(nameArr)

      this.setState({
        visibleEditAssessorName: true,
        eidtAssessorName: nameArr,
        editQuataId: quota_id,
        treeValue: nameArr,
        editPid: pid,
        editAssessorType: nameArr.length===0 ? 1 : 3
      });
    }

    showModalEditLabel = (label,quota_id, pid) => {
      console.log(label)
      this.setState({
        inputArr1:[
          {
            text: undefined,
            selfId: 1
          }
        ]
      })
      let arr=[]
      label&&label.map((item, index)=>{
          arr.push(
            {
              text: item,
              selfId: index
            }
          )
          this.setState({
            inputArr1: arr
          })
      })
      console.log(arr)
      this.setState({
        visibleEditLabel: true,
        editQuataId: quota_id,
        // treeValue: nameArr,
        editPid: pid,
        // editAssessorType: nameArr.length===0 ? 1 : 3
      });

    }

    showModalEditMaterial = (editMaterial, quota_id, pid) => {
      this.setState({
        visibleEditMaterial: true,
        editMaterial: editMaterial,
        editQuataId: quota_id,
        editPid: pid
      });
    }

    addPoint = () => {
      let id = this.props.match.params.id
      this.props.dispatch(
        routerRedux.push("/addPoint/" + id)
      )
    }
 
    handleCancel = () => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
        addPid: undefined,
        inputArr:[
          {
            text: undefined,
            selfId: 1
          }
        ]
      });
    }
    onTimeChange=(date,dateString)=> {
      this.setState({
        startDate:dateString[0],
        endDate:dateString[1]
      })
    }
    //添加指标
    handleAddQuotas=()=> {
      let _this=this
      let data=[]
      this.state.inputArr.map(item=>{
        if(!isBlank(item.text)){
          data.push({
            "name": item.text,
            "pid": this.state.addPid?this.state.addPid:0,
            "templateId": this.props.match.params.id
          })
        }
        console.log("22")
      })
      const params = {
        data: data
      }
      this.props.dispatch({
        type:'evaluation/addQuotas',
        payload: params,
        callback: (res) => {
          if(res.code==200){
            message.success("添加成功！")
            this.setState({
              visible: false,
              addPid: undefined,
              inputArr:[
                {
                  text: undefined,
                  selfId: 1
                }
              ]
            })
            const params={
              "templateId": this.props.match.params.id,
            }
            _this.getQuotas(params)
            _this.getTemplateDetail(params)
          }
        }
      })

    }
    //删除指标
    handleDeleteQuotas=()=>{
      let _this = this
      if(!this.state.deletePid){
        message.warning("请选择要删除的指标！")
        return
      }
      const params={
        "quotaId": this.state.deletePid,
      }
      this.props.dispatch({
        type:'evaluation/deleteQuotas',
        payload: params,
        callback: (res) => {
          if(res.code==200){
            message.success("删除成功！")
            this.setState({
              visibleDelete: false,
              deletePid: undefined,
            })
            const params={
              "templateId": this.props.match.params.id,
            }
            _this.getQuotas(params)
            _this.getTemplateDetail(params)
          }
        }
      })
    }
     //编辑要点
     handleEditQuotas=(type)=>{
      // type 1-修改要点名称 2-修改分数 3-修改默认分数 4-修改评价人 5-修改文字评价 6-修改实证材料
      if(type==2&&(!Number.isInteger(parseFloat(this.state.editMaxscore)))){
        message.warning("分数不能为小数！")
        return
      }
      if(type==3&&(!Number.isInteger(parseFloat(this.state.eidtdefaultscore)))){
        message.warning("分数不能为小数！")
        return
      }
      if((type==2||type==3)&&this.state.editMaxscore<this.state.eidtdefaultscore){
        message.warning("最大分数不能小于默认分数！")
        return
      }
      if(type==4&&this.state.editAssessorType==3&&this.state.treeValue.length==0){
        message.warning("请选择评价人！")
        return
      }
      let labelArr=[]
      if(type==5){
        this.state.inputArr1.map(item=>{
          if(!!item.text&&!isBlank(item.text)){
            labelArr.push(item.text)
          }
        })
      }
      let arr=this.state.detailData.filter(item=>{
        return item.quota_id== this.state.editQuataId
      })
      if(arr.length!=1) return
      let _this = this
      let pathId=this.state.editQuataId.replace("p-",'')
      const params={
        "name": type==1?this.state.editQuataName:arr[0].quotaName,
        "pathId": pathId,
        "maxScore": type==2?this.state.editMaxscore:arr[0].maxScore,
        "defaultScore": type==3?this.state.eidtdefaultscore:arr[0].defaultScore,
        "assessorType": type==4?this.state.editAssessorType:(arr[0].assessorId.length>0?3:1),
        "teacherId": type==4?this.state.treeValue:arr[0].assessorId,
        "label": type==5?labelArr:(arr[0].label?arr[0].label:[]),
        "material": type==6?this.state.editMaterial:arr[0].material,
        "quotaId": this.state.editPid
      }

      this.props.dispatch({
        type:'evaluation/editQuota',
        payload: params,
        callback: (res) => {
          if(res.code==200){
            message.success("保存成功！")
            this.setState({
              visibleEditQuataName: false,
              visibleEditMaxscore: false,
              visibleEditDefaultscore: false,
              visibleEditAssessorName: false,
              visibleEditLabel: false,
              visibleEditMaterial: false,
              editQuataId: undefined,
            })
            const params={
              "templateId": this.props.match.params.id,
            }
            _this.getTemplateDetail(params)
          }
        }
      })
    }
    //删除要点
    handleDeletePoint=()=>{
      let _this = this
      if(!this.state.deletePointId){
        message.warning("请选择要删除的要点！")
        return
      }
      const params={
        "pointId": this.state.deletePointId,
      }
      this.props.dispatch({
        type:'evaluation/deletePoint',
        payload: params,
        callback: (res) => {
          if(res.code==200){
            message.success("删除成功！")
            this.setState({
              visibleDeletePoint: false,
              deletePointId: undefined,
              parentQuotaId: undefined
            })
            const params={
              "templateId": this.props.match.params.id,
            }
            _this.getQuotas(params)
            _this.getTemplateDetail(params)
          }
        }
      })
    }

    onChange9 = value => {
      console.log('onChange ', value);
      // let arr=[]
      let arr = value.filter(item=>{
        return !this.state.parentNode.includes(item)
      })
      this.setState({ 
        treeValue: arr
      });
    };
   

    render(){
      const tProps = {
        disabled: this.state.assessorType==1,
        treeData: this.state.treeData2,
        value: this.state.treeValue,
        onChange: this.onChange9.bind(this),
        treeCheckable: true,
        searchPlaceholder: '请选择老师',
        style: {
          width: 300,
        },
      };
      const {quotasList, pointList, pointTeacherList} =this.props;
      const options = quotasList&&quotasList.map((item)=>{
        return <Option value={item.quota_id} key={item.quota_id}>{item.name}</Option>
      })

      const options1 = pointList&&pointList.map((item)=>{
        return <Option value={item.pointId} key={item.pointId}>{item.name}</Option>
      })

      const options2 = pointTeacherList&&pointTeacherList.map((item)=>{
        return <Option key={item.personId}>{item.name}</Option>
      })
        return (
            <div className="content-main essential-manage">
              {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/student-evaluation">学生过程评价</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>要点管理</Breadcrumb.Item>
                    </Breadcrumb>
              </div> */}
                 
              <div className="btn-box1">
                <Button type="primary" onClick={this.showAddQuotas.bind(this)}>添加指标</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.addPoint.bind(this)}>添加要点</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.showDeleteQuotas.bind(this)}>删除指标</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.showDeletePoint.bind(this)}>删除要点</Button>
              </div>
              <Row>
                <p className="total-star">
                  {this.state.commentType==1?"总星数：":"总分："} {this.state.totalScore}{this.state.commentType==1?<Icon type="star" theme="filled" />:"分"}
                </p>
              </Row>
              <div className="table-content">
                <table className="table-wrap">
                      <thead>
                          <tr className="info">
                            <td>一级指标</td>
                            <td>二级指标</td>
                            <td>三级指标</td>
                            <td>四级指标</td>
                            <td>要点</td>
                            <td>{this.state.commentType==1?"星数（上限）":"分数"}</td>
                            <td>{this.state.commentType==1?"默认点亮":"默认分数"}</td>
                            <td>评价人</td>
                            <td>文字评价</td>
                            <td>实证材料</td>
                          </tr>
                      </thead>
                      <tbody>
                          {
                            this.state.detailData&&this.state.detailData.map((item,index)=>{
                              return  <tr key={index}>
                                        <td>{item.quotaName1}</td>
                                        <td>{item.quotaName2}</td>
                                        <td>{item.quotaName3}</td>
                                        <td>{item.quotaName4}</td>
                                        <td onDoubleClick={this.showModalEditName.bind(this, item.quotaName, item.quota_id, item.pid)}>
                                            {item.quotaName}
                                        </td>
                                        <td onDoubleClick={this.showModalEditMaxscore.bind(this, item.maxScore, item.quota_id, item.pid, item.defaultScore)}>
                                            {item.maxScore&&parseFloat(item.maxScore)}&nbsp;{this.state.commentType==1&&item.quotaName?<Icon type="star" theme="filled" />:""}
                                        </td>
                                        <td onDoubleClick={this.showModalEditDefaultscore.bind(this, item.maxScore, item.quota_id, item.pid, item.defaultScore)}>
                                            {item.defaultScore&&parseFloat(item.defaultScore)}&nbsp;{this.state.commentType==1&&item.quotaName?<Icon type="star" theme="filled" />:""}
                                        </td>
                                        <td onDoubleClick={this.showModalEditAssessorName.bind(this, item.assessorId, item.quota_id, item.pid)}>
                                            {item.assessorName&&(item.assessorName.length==0&&item.quotaName)?"全校":item.assessorName&&item.assessorName.join(", ")}
                                        </td>
                                        <td onDoubleClick={this.showModalEditLabel.bind(this, item.label, item.quota_id, item.pid)}>
                                            {item.label&&item.label.join(", ")}
                                        </td>
                                        <td onDoubleClick={this.showModalEditMaterial.bind(this, item.material, item.quota_id, item.pid)}>
                                            {item.material}
                                        </td>
                                      </tr>
                            })
                          }
                      </tbody>
                  </table>
              </div>

              <Modal
                title="添加指标"
                visible={this.state.visible}
                onOk={this.handleAddQuotas}
                onCancel={this.handleCancel}
              >
                <Row>
                    <label>上级指标：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                     <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.addPid}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择上级指标"
                        onChange={this.onChange.bind(this)}
                      />
                </Row>
                <Row>
                    <label>本级指标：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="input-box essential-box">
                      {
                        this.state.inputArr.map((item)=>{
                          return  <div className="input-item" key={item.selfId}>
                                    <Input placeholder="请输入指标名称" value={item.text} maxLength={20} onChange={this.onChange2.bind(this, item.selfId)} style={{ width: 300}} />&nbsp;&nbsp;
                                    <Icon type="plus-circle" onClick={this.addQuotas.bind(this)}/>&nbsp;&nbsp;
                                    <Icon type="minus-circle" style={{visibility: this.state.inputArr.length<=1?"hidden":"visible"}} 
                                    onClick={this.deleteQuotas.bind(this, item.selfId)}/>
                                  </div>
                        })
                    }
                    </div>
                </Row>
                 
              </Modal>
              <Modal
                title="删除指标"
                visible={this.state.visibleDelete}
                onOk={this.handleDeleteQuotas}
                onCancel={this.handleCancelDelete}
              >
                <Row>
                    <label>选择指标：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                     <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.deletePid}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择指标"
                        onChange={this.onChange1.bind(this)}
                      />
                </Row>
              </Modal>
              <Modal
                title="删除要点"
                visible={this.state.visibleDeletePoint}
                onOk={this.handleDeletePoint}
                onCancel={this.handleCancelDeletePoint}
              >
                <Row>
                    <label>指标：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                     <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.parentQuotaId}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData1}
                        placeholder="请选择指标"
                        onChange={this.onChange7.bind(this)}
                      />
                </Row>
                <Row>
                    <label>要点：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select value={this.state.deletePointId} style={{ width: 300 }} placeholder="请先选择指标再选择要点" onChange={this.handleChange1.bind(this)}>
                      {options1}
                    </Select>
                </Row>
              </Modal>

              <Modal
                title="编辑要点"
                visible={this.state.visibleEditQuataName}
                onOk={this.handleEditQuotas.bind(this, 1)}
                onCancel={this.handleCancelEditQuataName}
              >
                <Row>
                    <label>要点名称：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="请输入要点名称" value={this.state.editQuataName} maxLength={20} onChange={this.onChange3.bind(this)} style={{ width: 300}} />&nbsp;&nbsp;
                </Row>
              </Modal>

              <Modal
                title="编辑要点"
                visible={this.state.visibleEditMaxscore}
                onOk={this.handleEditQuotas.bind(this, 2)}
                onCancel={this.handleCancelEditMaxscore}
              >
                <Row>
                    <label>分数：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <InputNumber min={0} max={10} value={this.state.editMaxscore} onChange={this.onChange4.bind(this)} />             
                </Row>
              </Modal>

              <Modal
                title="编辑要点"
                visible={this.state.visibleEditDefaultscore}
                onOk={this.handleEditQuotas.bind(this, 3)}
                onCancel={this.handleCancelEditDefaultscore}
              >
                <Row>
                    <label>默认分数：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <InputNumber min={0} max={10} value={this.state.eidtdefaultscore} onChange={this.onChange5.bind(this)} />             
                </Row>
              </Modal>

              <Modal
                title="编辑要点"
                visible={this.state.visibleEditAssessorName}
                onOk={this.handleEditQuotas.bind(this, 4)}
                onCancel={this.handleCancelEditAssessorName}
              >
                <Row>
                    <label>评价人类型：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select value={this.state.editAssessorType} style={{ width: 120 }} onChange={this.onChange8.bind(this)}>
                      <Option value={1}>全校</Option>
                      <Option value={3}>单独选择老师</Option>
                    </Select>
                </Row>
                <Row>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价人：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    {/* <Select
                            mode="multiple"
                            style={{ width: '200px' }}
                            placeholder="请选择"
                            value={this.state.treeValue}
                            onChange={this.handleChange6}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={this.state.editAssessorType==1}
                          >
                            {options2}
                          </Select> */}
                          <TreeSelect {...tProps} />
                </Row>
              </Modal>
              <Modal
                title="编辑要点"
                visible={this.state.visibleEditLabel}
                onOk={this.handleEditQuotas.bind(this, 5)}
                onCancel={this.handleCancelEditLabel}
              >
                <Row>
                    <label>文字评价：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="input-box essential-box">
                      {
                        this.state.inputArr1.map((item)=>{
                          return  <div className="input-item" key={item.selfId}>
                                    <Input placeholder="请输入" value={item.text} maxLength={20} onChange={this.onChange21.bind(this, item.selfId)} style={{ width: 300}} />&nbsp;&nbsp;
                                    <Icon type="plus-circle" onClick={this.addQuotas1.bind(this)}/>&nbsp;&nbsp;
                                    <Icon type="minus-circle" style={{visibility: this.state.inputArr1.length<=1?"hidden":"visible"}} 
                                    onClick={this.deleteQuotas1.bind(this, item.selfId)}/>
                                  </div>
                        })
                    }
                    </div>
                </Row>
              </Modal>

              <Modal
                title="编辑要点"
                visible={this.state.visibleEditMaterial}
                onOk={this.handleEditQuotas.bind(this, 6)}
                onCancel={this.handleCancelEditMaterial}
              >
                <Row className="edit-box">
                    <label>实证材料：&nbsp;&nbsp;</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <TextArea rows={4} rows={4} style={{ width: 360 }} value={this.state.editMaterial} maxLength={200} onChange={this.onChange6.bind(this)} placeholder="相关说明，200字以内"/>
                </Row>
              </Modal>

              
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    quotasList: state.evaluation.quotasData,
    pointList: state.evaluation.pointData,
    pointTeacherList: state.evaluation.pointTeacherData,
  }
}

export default connect(mapStateToProps)(Form.create()(essentialList));
