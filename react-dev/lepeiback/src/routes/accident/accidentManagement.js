/**
 * 意外事件管理
 */
 import React,{Component} from 'react';
 import { Table,Form,Row, Col,Button,Select,DatePicker,Input,Modal,Icon } from 'antd';
 import PageIndex from '../../components/page';
 import { connect } from 'dva';
 import './style.less';
 import moment from 'moment';
 import { routerRedux } from 'dva/router';
 import { withActivation } from 'react-activation'

 import { portUrl } from '../../utils/img';

 const { Option  } = Select;
 const { confirm  } = Modal;

 @withActivation
 class AccidentManagement extends Component{
   constructor(props) {
       super(props);
       this.state = {
        flag:false,
         stuData:{},
         page:1,
         pageSize:20,
         classDataArrs: [],
         gradeDataArrs:[],
         allGradeDataArrs:[],
        exportUrl:"",
        allTypesArrs:[],
        typesKeys:{
          data1:[],
          data2:[],
          data3:[],
          data4:[],
          data5:[],
          data6:[],
        }
       }
     }

     componentDidMount = () => {
      this.getGradeNameAll();
       this.getAllAccidentTypes();
       let {page,pageSize} = this.state;
       this.getPageData({page,pageSize});
     }

     //路由状态返回，组件做些什么处理
     componentDidActivate = () => {
       this.queryCurrentPageList();
     }
     //路由状态前进，组件做些什么处理
     componentWillUnactivate = () => {

     }

     getGradeNameAll = () => {
      let that = this;
      that.props.dispatch({
        type: "accidentManagement/getGradeName",
        payload: {},
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              allGradeDataArrs: res.data,
            });
          }
        },
      });
    };

     getAllAccidentTypes = () => {
       let that = this;
       that.props.dispatch({
         type: "accidentManagement/getAllAccidentTypes",
         payload: {},
         callback: (res) => {
           if (res.code === 200) {
             let allTypesArrs = res.data;
             let typesKeys = {};
             allTypesArrs.forEach(ele => {
              typesKeys["data" + ele.category] = ele.types
             })
             that.setState({
               allTypesArrs,typesKeys
             });
           }
         },
       });
     };

     toggle = () =>{
      this.setState({flag: !this.state.flag});
    }

     queryList = () => {
       let that = this;
       that.props.form.validateFields().then(values => {
         let pageSize = that.state.pageSize;
         const params = Object.assign({page:1,pageSize},values);
         params.happenedStartTime = params.happenedStartTime ? params.happenedStartTime.format("YYYY-MM-DD") : null;
         params.happenedEndTime = params.happenedEndTime ? params.happenedEndTime.format("YYYY-MM-DD") : null;
         that.getPageData(params);
         that.setState({
           page:1
         })
       })
     }
     queryCurrentPageList = () => {
       let that = this;
       that.props.form.validateFields().then(values => {
         let pageSize = that.state.pageSize;
         let page = that.state.page;
         const params = Object.assign({page,pageSize},values);
         params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
         that.getPageData(params);
       });
     }

     resetQuery = () => {
       let that = this;
       let pageSize = that.state.pageSize;
       that.props.form.resetFields();
       that.getPageData({page:1,pageSize});
       that.setState({
         page:1
       })
     }

     getPageData = (params) =>{
       let that = this;
       let keys = Object.keys(params);
       keys.forEach(ele => {
         if(!params[ele]){
           delete params[ele];
         }
       })
       this.props.dispatch({
         type: 'accidentManagement/getAccidentListByPage',
         payload: params,
         callback: (res) => {
           if (res.code === 200) {
             that.setState({
               stuData: res.data
             })
           }
         }
       })
     }

     onPageChange =  (current, size) => {
       let that = this;
       that.props.form.validateFields().then(values => {
         const params = Object.assign({page:current,pageSize:size},values);
         params.day = params.day ? params.day.format("YYYY-MM-DD") : null;
         that.setState({ page: current, pageSize: size })
         that.getPageData(params);
       })
     }

     toDetail = (record) => {
       this.props.dispatch(routerRedux.push(`/accident-management-edit?id=${record.id}&mode=qry`))
     }

     addAccident = (id) => {
       let url = "/accident-management-edit";
       if(id){
        url = url + "?id="+id
       }
      this.props.dispatch(routerRedux.push(url));
     }
     // 导出
     export=()=>{
       let that = this;
       that.props.form.validateFields().then(values => {
        let token = sessionStorage.getItem("token");
        let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
        let userId = sessionStorage.getItem("userId");

        let params = {...values};
        let keys = Object.keys(params);
        keys.forEach(ele => {
          if(!params[ele]){
            delete params[ele];
          }
        })

        params.token = token;
        params.userType = userType;
        params.userId = userId;
        let pUrl = "/manager/accident/records/export?";
        let pStr = Object.keys(params).map(ele => ele + "=" + params[ele] || "").join("&");
        let url = portUrl(pUrl + pStr);
        that.setState({exportUrl:url});
      });
    }

    ruleDelete = (id) => {
      let that = this;
      confirm({
        title: "提示",
        content: "确定要删除吗？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk() {
          let params = { id: id };
          that.props.dispatch({
            type: "accidentManagement/deleteAccidentRecord",
            payload: params,
            callback: (res) => {
              if (res.code === 200) {
                that.queryCurrentPageList();
              }
            },
          });
        },
        onCancel() {},
      });
    };


    stageChange = (val) => {
      if(val){
        let academicStage = val;
        let gradeDataArrs = this.state.allGradeDataArrs;
        gradeDataArrs = gradeDataArrs.filter(ty => ty.type + "" === academicStage);
        this.setState({gradeDataArrs})
      }else{
        this.setState({gradeDataArrs:[]})
      }
      this.props.form.resetFields(["gradeId","classId"]);
    }

    gradeChange = (val) => {
      if(val){
        let that = this;
        let gradeId = val;
        this.props.dispatch({
          type: 'accidentManagement/getClassName',
          payload: {gradeId},
          callback: (res) => {
            if (res.code === 200) {
              that.setState({
                classDataArrs: res.data
              })
            }
          }
        })
      }else{
        this.setState({classDataArrs:[]})
      }
      this.props.form.resetFields(["classId"]);
    }

     render(){
       const {stuData,classDataArrs,gradeDataArrs,typesKeys,flag} = this.state;
       const { getFieldDecorator } = this.props.form;
       const dayFormat = 'YYYY年MM月DD日';
       let stuColumns = [
         {
           title:"序号",
           dataIndex:"id",
         },
         {
           title:"类型",
           dataIndex:"type",
         },
         {
           title:"班级/姓名",
           dataIndex:"participants",
         },
         {
           title:"发生时间",
           dataIndex:"happenedTime",
           render: (text, record) => {
             let happenedTime = record.happenedTime ? moment(record.happenedTime * 1000).format("YYYY年MM月DD日 HH:mm") : "";
             return (<span>{happenedTime}</span>)
           }
         },
         {
           title:"责任人",
           dataIndex:"principals",
         },
         {
           title:"地点",
           dataIndex:"addr",
         },
         {
           title:"活动",
           dataIndex:"activity",
         },
         {
           title:"伤害同行",
           dataIndex:"hurt",
         },
         {
           title:"处理方式",
           dataIndex:"method",
         },
         {
           title:"转归",
           dataIndex:"status",
         },
         {
           title:"填表人",
           dataIndex:"publisherName",
         },
         {
           title:"创建时间",
           dataIndex:"createTime",
           render: (text, record) => {
             let createTime = record.createTime ? moment(record.createTime * 1000).format("YYYY年MM月DD日 HH:mm") : "";
             return (<span>{createTime}</span>)
           }
         },
         {
           title: '操作',
           width: 120,
           render: (text, record) => (
             <span>
               <a href="javascript:;" onClick={this.toDetail.bind(this,record)}>查看</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
               <a href="javascript:;" onClick={this.ruleDelete.bind(this,record.id)}>删除</a>
             </span>
           ),
         }
       ];

       let classArrs = [];
       classDataArrs.forEach((ele) => {
         classArrs.push(<Option key={ele.classId}>{ele.className}</Option>);
       });

       let gradeArrs = [];
       gradeDataArrs.forEach((ele) => {
         gradeArrs.push(<Option key={ele.gradeId}>{ele.gradeName}</Option>);
       });

       let typesOptions = {};
       Object.keys(typesKeys).forEach(ele => {
        typesOptions[ele] = [];
        typesKeys[ele].forEach(ty => {
          typesOptions[ele].push(<Option key={ty.id}>{ty.name}</Option>)
        })
       })

       return (
        <div className="content-main content-box">
          <div className="stu-statistics">
            <Form>
              <Row className="ant-row-fun" gutter={24}>
                <Col xl={{ span: 18, offset: 0 }}>
                  <Col xl={{ span: 6, offset: 0 }}>
                    <Form.Item>
                        {getFieldDecorator("kw", {
                          initialValue: null,
                        })(<Input style={{width:"220px"}} placeholder="姓名/ID"></Input>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("academicStage")(<Select placeholder="学业阶段" onChange={this.stageChange}>
                          <Option key="1">幼儿园</Option>
                          <Option key="2">小学</Option>
                          <Option key="3">初中</Option>
                          <Option key="4">高中</Option>
                          <Option key="5">大学</Option>
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("gradeId")(<Select placeholder="年级" onChange={this.gradeChange} showSearch optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                        {gradeArrs}
                      </Select>)}
                      &emsp;&emsp;
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("classId", {})(<Select placeholder="班级" showSearch optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                        {classArrs}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 7, offset: 0 }} style={{ display: flag ? 'block' : 'none' }}>
                    <Form.Item>
                      {getFieldDecorator("happenedStartTime", {
                      })(<DatePicker placeholder="发生开始时间" format={dayFormat} style={{width:"140px"}}></DatePicker>)}
                      <span> - </span>
                      {getFieldDecorator("happenedEndTime", {
                      })(<DatePicker placeholder="发生结束时间" format={dayFormat} style={{width:"140px"}}></DatePicker>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("typeId")(<Select placeholder="类型">
                        {typesOptions["data1"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} >
                    <Form.Item>
                      {getFieldDecorator("addrId")(<Select placeholder="地点">
                        {typesOptions["data2"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }}>
                    <Form.Item>
                      {getFieldDecorator("activityId")(<Select placeholder="活动">
                        {typesOptions["data3"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("hurtId")(<Select placeholder="伤害同行">
                        {typesOptions["data4"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("methodId")(<Select placeholder="处理方式">
                        {typesOptions["data5"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Form.Item>
                      {getFieldDecorator("statusId")(<Select placeholder="转归">
                        {typesOptions["data6"]}
                      </Select>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 4, offset: 0 }} style={{ display: flag ? 'block' : 'none' }} >
                    <Button type='primary' href={this.state.exportUrl} onClick={this.export.bind(this)} >导出班表</Button>&emsp;
                  </Col>
                </Col>
                <Col xl={{ span: 6, offset: 0 }} style={{textAlign:"right",paddingRight:"20px"}}>
                  <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                  <Button type='primary' onClick={this.addAccident.bind(this,null)}>添加</Button>&emsp;
                  <Button type='primary' ghost onClick={this.resetQuery.bind(this)}>重置</Button>&emsp;
                  <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} style={{marginLeft:"5px"}} /></span>
                </Col>
              </Row>
            </Form>
            <Table rowKey="id" columns={stuColumns} dataSource={stuData.dataList} pagination={false} />
            <div className="paginationBox">
              <PageIndex getPage={this.onPageChange.bind(this)} total={stuData.totalCount} totalPage={stuData.totalPage} currentPage={stuData.currentPage} />
            </div>
        </div>
      </div>)
    }
}

 const mapStateToProps = (state) => {
   return {

   }
 }
 export default connect(mapStateToProps)(Form.create()(AccidentManagement));
