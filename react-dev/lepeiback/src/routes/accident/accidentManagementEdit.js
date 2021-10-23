/**
 * 意外事件管理-编辑
 */
import React, { Component } from "react";
import { Table,  Form,  Row,  Col,  Button,  Select,  DatePicker,  Input,InputNumber,  Modal, Typography,Drawer, message } from "antd";
import { connect } from "dva";
import "./style.less";
import moment from "moment";
import { getQueryString} from '../../utils/public';

const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;

class AccidentManagementEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:"",
      mode:"add",
      history: require("history/createHashHistory"),
      formData: {},
      allTypesArrs: [],
      typesKeys: {
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        data5: [],
        data6: [],
      },
      teachPersons:[],
      drawerVisible:false,
      searchContent:"",
      stuDatas:[],
      searchDatas:[],
      chooseStus:[],
    };
  }

  componentDidMount = async () => {
    await this.getAllAccidentTypes();
    await this.getAllPersons();
    const id = getQueryString("id");
    const mode = getQueryString("mode") || "add";

    this.setState({
      id,mode
    })
    let title = "新增事件";
    if(mode === "qry") title = "查看事件"
    else if(mode === "mod") title = "编辑事件"
    //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:title,
        parentRoute:"/accident-management"
      },
    })

    if(id){
      setTimeout(() => {
        this.getAccidentDetail();
      },300);
    }
  };

  componentWillUnmount = () =>{
    //组件卸载时，清空手动加入的面包屑
    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {},
    })
  }

  getAccidentDetail = () => {
    let params = {id:this.state.id};

    this.props.dispatch({
      type: "accidentManagement/getAccidentDetail",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let formData = res.data;
          formData.principals = formData.principals.map(ele => ele.personId + "");
          formData.typeId = formData.typeId + "";
          formData.activityId = formData.activityId + "";
          formData.addrId = formData.addrId + "";
          formData.hurtId = formData.hurtId + "";
          formData.methodId = formData.methodId + "";
          formData.statusId = formData.statusId + "";
          let chooseStus = formData.participants;
          this.setState({
            formData,chooseStus,
          });
        }
      },
    });
  }

  getAllStudent = () => {
    let searchContent = this.state.searchContent;
    if(!searchContent){
      this.setState({searchDatas:[]})
      return;
    }
    let params = {
      status:"1",
      page:1,
      prePage:200,
      kw:searchContent
    }
    this.props.dispatch({
      type: "accidentManagement/getAllPubStudents",
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          let searchDatas = res.data.dataList;
          this.setState({
            searchDatas,
          });
        }
      },
    });
  }

  getAllPersons = () => {
    let that = this;
    that.props.dispatch({
      type: "accidentManagement/getAllPersons",
      payload: {personType:"2"},
      callback: (res) => {
        if (res.code === 200) {
          that.setState({
            teachPersons: res.data,
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
          allTypesArrs.forEach((ele) => {
            typesKeys["data" + ele.category] = ele.types;
          });
          that.setState({
            allTypesArrs,
            typesKeys,
          });
        }
      },
    });
  };

  handleEdit = () => {
    this.setState({mode:"mod"});

    this.props.dispatch({
      type: 'user/setLastRoute',
      payload: {
        breadcrumbTitle:"编辑事件",
        parentRoute:"/accident-management"
      },
    })
  }

  handleSave = (e) => {
    let that = this;
    if(that.state.chooseStus.length < 1){
      message.error("请选择学生",3);
      return;
    }
    that.props.form.validateFields().then(values => {
    // that.props.form.validateFields((err, values) => {
      let params = {...values};
      params.participantIds = that.state.chooseStus.map(ele => ele.personId + "");
      params.happenedTime = params.happenedTime.unix();
      let types = "accidentManagement/addAccidentRecord";
      if(that.state.id){
        params.id = that.state.id;
        types = "accidentManagement/modAccidentRecord";
      }
      this.props.dispatch({
        type: types,
        payload: params,
        callback: (res) => {
          if (res.code === 200) {
            that.handleCancel();
          }
        }
      });
    });
  }

  handleCancel = () =>{
    let formData = {};
    this.setState({
      formData,
      id:"",
      category:"",
    })
    this.props.form.resetFields();
    this.state.history().goBack();
  }

  addAccStu = () => {
    this.setState({
      drawerVisible:true,
    })
  }

  onDrawerClose = () => {
    this.setState({
      drawerVisible:false,
    })
  }

  searchPerson = () => {
    let searchContent = this.state.searchContent;
    if(!searchContent){
      this.setState({searchDatas:[]})
      return;
    }
    this.getAllStudent();
  }

  reSearchPerson = () => {
    this.setState({
      searchContent:"",
      searchDatas:[],
    })
  }

  searchChange = (e) => {
    this.setState({
      searchContent:e.target.value
    })
  }

  ruleTempDelete = (record) => {
    let chooseStus = this.state.chooseStus;
    let indx = chooseStus.findIndex(ele => ele.personId === record.personId);
    chooseStus.splice(indx,1);
    this.setState({
      chooseStus
    })
  }

  ruleTempAdd = (record) => {
     let chooseStus = this.state.chooseStus;
     if(chooseStus.findIndex(ele => ele.personId + "" === record.personId) === -1){
      chooseStus.push(record)
      this.setState({
       chooseStus
      })
     }

  }

  handleChooseSave = () => {
    this.setState({
      searchContent:"",
      searchDatas:[],
      drawerVisible:false,
    })
  }

  render() {
    const { formData, typesKeys,drawerVisible,searchDatas,chooseStus,searchContent,teachPersons,mode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const dayFormat = "YYYY年MM月DD日 HH:mm";
    let typesOptions = {};
    Object.keys(typesKeys).forEach(ele => {
      typesOptions[ele] = [];
      typesKeys[ele].forEach(ty => {
        typesOptions[ele].push(<Option key={ty.id}>{ty.name}</Option>)
      })
    })

    const disabled = mode === "qry";

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const stuColumns = [
      {
        title:"班级",
        dataIndex:"className",
      },
      {
        title:"姓名",
        dataIndex:"personName",
      },
      {
        title:"性别",
        dataIndex:"sex",
        render: (text, record) => {
          let desc = "保密";
          if(record.sex + "" === "1") desc = "男"
          else if(record.sex + "" === "2") desc = "女"
          return (
            <span>{desc}</span>
        )}
      },
      {
        title:"年龄",
        dataIndex:"age",
      },
      {
        title: "操作",
        width: 120,
        render: (text, record) => {
          if(disabled) return null
          else return(
          <span>
            <a onClick={this.ruleTempDelete.bind(this, record)}>删除</a>
          </span>
        )}
      },
    ];
    const stuColumns1 = [
      {
        title:"班级",
        dataIndex:"className",
      },
      {
        title:"姓名",
        dataIndex:"personName",
      },
      {
        title:"性别",
        dataIndex:"sex",
        render: (text, record) => {
          let desc = "保密";
          if(record.sex + "" === "1") desc = "男"
          else if(record.sex + "" === "2") desc = "女"
          return (
            <span>{desc}</span>
        )}
      },
      {
        title:"年龄",
        dataIndex:"age",
      },
      {
        title: "操作",
        width: 100,
        render: (text, record) => (
          <span>
            <a onClick={this.ruleTempAdd.bind(this, record)}>添加</a>
          </span>
        )
      },
    ];

    let teachOptions = teachPersons.map(ele => {
      return (<Option key={ele.personId}>{ele.personName}</Option>)
    })

    return (
      <div className="content-main content-box">
        <div>
          <Title level={4}>基础信息</Title>
          <Row>
            <Table rowKey="personId" size="small" columns={stuColumns} dataSource={chooseStus} pagination={false} />
          </Row>
          {
              disabled ? null : (<Row style={{marginTop:"10px",textAlign:"center"}}>
              <Button ghost type="primary" onClick={this.addAccStu}>添加学生</Button>&emsp;
            </Row>)
          }
        </div>
        <div className="edit-accident">
          <Title level={4}>事件详情</Title>
          <Form {...formItemLayout} style={{maxWidth:800}} onSubmit={this.handleSave}>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="发生时间">
                  {getFieldDecorator("happenedTime", {
                    initialValue: formData.happenedTime ? moment(formData.happenedTime * 1000) : null,
                    rules: [{ required: true, message: "请选择发生时间" },],
                  })(<DatePicker style={{width:"220px"}} showTime placeholder="请选择发生时间" format={dayFormat} disabled={disabled} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="责任人">
                  {getFieldDecorator("principalIds", {
                    initialValue: formData.principals || [],
                    rules: [{ required: true, message: "请选择责任人" },],
                  })(<Select placeholder="责任人" mode="tags" showSearch optionFilterProp="children" disabled={disabled}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {teachOptions}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="伤害类型">
                  {getFieldDecorator("typeId", {
                    initialValue: formData.typeId,
                    rules: [{ required: true, message: "请选择伤害类型" },],
                  })(<Select placeholder="请选择伤害类型" disabled={disabled}>
                    {typesOptions["data1"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="发生地点">
                  {getFieldDecorator("addrId", {
                    initialValue: formData.addrId,
                    rules: [{ required: true, message: "请选择发生地点" },],
                  })(<Select placeholder="请选择发生地点" disabled={disabled}>
                    {typesOptions["data2"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="伤害发生时活动">
                  {getFieldDecorator("activityId", {
                    initialValue: formData.activityId,
                    rules: [{ required: true, message: "请选择伤害发生时活动" },],
                  })(<Select placeholder="请选择伤害发生时活动" disabled={disabled}>
                    {typesOptions["data3"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="伤害发生时和谁一起">
                  {getFieldDecorator("hurtId", {
                    initialValue: formData.hurtId,
                    rules: [{ required: true, message: "请选择伤害发生时和谁一起" },],
                  })(<Select placeholder="请选择伤害发生时和谁一起" disabled={disabled}>
                    {typesOptions["data4"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="受伤后处理方式">
                  {getFieldDecorator("methodId", {
                    initialValue: formData.methodId,
                    rules: [{ required: true, message: "请选择受伤后处理方式" },],
                  })(<Select placeholder="请选择受伤后处理方式" disabled={disabled}>
                    {typesOptions["data5"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="因伤休息时长">
                  {getFieldDecorator("restDays", {
                    initialValue: formData.restDays,
                    rules: [{ required: true, message: "请输入因伤休息时长" },],
                  })(<InputNumber style={{width:120}} placeholder="请输入休息时长" min={0} max={999} step={0.1} precision={1} disabled={disabled}/>)}
                  <span>天</span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="转归">
                  {getFieldDecorator("statusId", {
                    initialValue: formData.statusId,
                    rules: [{ required: true, message: "请选择转归" },],
                  })(<Select placeholder="请选择转归" disabled={disabled}>
                    {typesOptions["data6"]}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="简述意外事件">
                  {getFieldDecorator("remark", {
                    initialValue: formData.remark || "",
                  })(<Input placeholder="简述意外发生经过（对损伤过程做综合描述）" maxLength={300} disabled={disabled} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24} style={{textAlign:"center"}}>
              <Col span={22}>
                { disabled ? (<Button type="primary" onClick={this.handleEdit.bind(this)}>编辑</Button>)
                : (<Button type="primary" onClick={this.handleSave.bind(this)}>保存</Button>)}&emsp;
                <Button type="primary" ghost onClick={this.handleCancel.bind(this)}>取消</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Drawer
          title="选择学生"
          placement="right"
          closable={false}
          width={800}
          onClose={this.onDrawerClose}
          visible={drawerVisible}
        >
          <Row gutter={24} style={{marginBottom:20}}>
            <Col span={22}>
              <Input style={{width:170,marginRight:20}} value={searchContent} placeholder="请输入姓名" maxLength={30} onChange={this.searchChange} />
              <Button type='primary' onClick={this.searchPerson.bind(this)}>搜索</Button>&emsp;
              {/* <Button type='primary' onClick={this.reSearchPerson.bind(this)}>重置</Button>&emsp; */}
            </Col>
          </Row>
          <Row gutter={24} className="tables">
            <Col span={23}>
              <Table
                rowKey="personId"
                columns={stuColumns1}
                dataSource={searchDatas}
                pagination={false}
              />
            </Col>
          </Row>
          <Row gutter={24} style={{textAlign:"center"}}>
            <Col span={22}>
              <Button type="primary" onClick={this.handleChooseSave.bind(this)}>确定</Button>&emsp;
              <Button type="primary" ghost onClick={this.handleChooseSave.bind(this)}>取消</Button>
            </Col>
          </Row>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Form.create()(AccidentManagementEdit));
