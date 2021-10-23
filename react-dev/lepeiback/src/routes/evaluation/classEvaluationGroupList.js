import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getScoreType} from '../../utils/public';
import './style.less';
import icon1 from '../../assets/icon-1.png';
import icon2 from '../../assets/icon-2.png';
import icon3 from '../../assets/icon-3.png';
import icon4 from '../../assets/icon-4.png';
import icon5 from '../../assets/icon-5.png';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class classEvaluationGroupList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visible1: false,
          reset:false,
          classDisabled:true,
          tableData: {},
          classValue: undefined,
          appointData: [],
          typeName: '',
          scoreType: '',
          logs: [],
          previewVisible: false,
          previewImage: '',
          fileList: [],
          imgs:[],
          oldImgs:[],
          cropVisible: false,
          newTitle: '',
          currentClassId: '',
          currentTypeId: '',
          currentDate: '',
          gradeTree: [],
          currentId: '',
          tableData1: [],
          currentGroupId: '',
          copyGroupId: '',
          currentScoreType: '',
          currentSemesterId: '',
          selectedRowKeys: []

        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getList(params)

      this.getGradeTree()

      this.props.dispatch({ //获取所有学期
          type:'user/getAllSemesters',
      })
    }
    
    getGradeTree=()=>{
      this.props.dispatch({
        type:'evaluate/getGradeTree',
        payload: {},
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              gradeTree: res.data
           })
          }
        }
      })
    }

    getList=(params)=>{
      this.props.dispatch({
        type:'evaluate/getEvaluationGroup',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
             tableData: res.data
           })
          }
        }
      })
    }

    search1=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "semesterId": values.semesterId2||'',
          "groupId": this.state.currentGroupId
        }
        this.props.dispatch({
          type:'evaluate/getSameScoreTypeGroup',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              this.setState({
                tableData1: res.data
              })
            }
          }
        })
      })
    }
      
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw||'',
          "semesterId": values.semesterId1||''
        }
        this.getList(params)
        this.setState({page:1})
      })
    }

    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "semesterId":values.semesterId||''
        }
        this.getList(params)
      })
    }

    copyGroup=(record)=>{
      const params={
        "groupId": record.id||''
      }
      this.props.form.resetFields(["semesterId2"])
      this.setState({
        "currentGroupId": record.id||'',
        selectedRowKeys: [],
        currentSemesterId: record.semesterId||''
      })
      this.props.dispatch({
        type:'evaluate/getSameScoreTypeGroup',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              visible1: true,
              tableData1: res.data
           })
          }
        }
      })
    }

    getDetail=(record)=>{
      const params={
        "id": record.id||'',
      }
      this.setState({
        currentId: record.id
      })
      this.props.dispatch({
        type:'evaluate/getEvaluationGroupDetail',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              visible: true
           })
           this.props.form.setFieldsValue({
            "semesterId": res.data.semesterId,
            "groupName": res.data.groupName,
            "grades": res.data.grades,
            "scoreType": res.data.scoreType,
            "icon": res.data.icon,
          })
          }
        }
      })
    }
    toMenuManage=()=>{
      this.props.dispatch(routerRedux.push("/material-menu-manage"))
    }
    toFlagDetail=(record)=>{
      this.props.dispatch(routerRedux.push("/evaluation-flag-detail?id="+record.id))
    }
    toSetting=(record)=>{
      this.props.dispatch(routerRedux.push("/class-evaluation-type-list?semesterId="+record.semesterId+"&groupId="+record.id+"&scoreType="+record.scoreType))
    }

    handleCancel1 = () => this.setState({ visible1: false, copyGroupId: ''});
    handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        });
    };

    handleImgsChange = ({ fileList }) => {
      console.log(fileList)
      this.setState({ fileList })
      let imgs=[]
      fileList.length>0&&fileList.map(item=>{
        if(item.response&&item.response.success){
          imgs.push(item.response.id)
        }else{
          const uid=item.uid.split('~')[1]
          imgs.push(uid)
        }
      })
      this.setState({imgs})
      console.log(imgs)
    };

    // 重置
    reset = () => {
        this.props.form.resetFields()
        this.setState({ placeDisabled: true,  appointData: [], classValue: undefined})
    }

    beforeUpload=(file)=> {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片需小于2MB!');
        }
        return isLt2M;
        // return isJPG && isLt2M;
    }
    handleChange = (info) => {
      console.log(info)
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
            console.log(info.file.response.id)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    onTimeChange=(date, dateString)=>{
      console.log(date, dateString)
      this.setState({
        startTime: dateString[0]?dateString[0]:'',
        endTime: dateString[1]?dateString[1]:''
      })
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }

    new = ()=>{
      this.props.dispatch(routerRedux.push("/add-group"))
    }
    
    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
          console.log(values)
          if(err) return
          this.props.dispatch({
            type:'evaluate/modifyClassEvaluationGroup',
            payload: {
              "id": this.state.currentId,
              "groupName": values.groupName,
              "scoreType": values.scoreType,
              "icon": values.icon,
              "gradeIds": values.grades
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('修改成功！',2)
                this.props.form.resetFields();
                this.setState({
                  visible: false
                });
              }
            }
          })
        })
    }

    handleOk1 = (e) => {
      if(!this.state.copyGroupId||!this.state.currentGroupId){
        return message.warn('请选择一项！')
      }
      this.props.dispatch({
        type:'evaluate/copyClassEvaluationGroup',
        payload: {
          "copyGroupId": this.state.copyGroupId,
          "groupId": this.state.currentGroupId,
        },
        callback:(res)=>{
          if(res.code===200){
            message.success('复制成功！',2)
            setTimeout(() => {
              this.props.dispatch(routerRedux.push("/class-evaluation-type-list?semesterId="+this.state.currentSemesterId+"&groupId="+this.state.currentGroupId+"&scoreType="+this.state.currentScoreType))
            }, 1000);
          }
        }
      })
  }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,
          reset:true
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const {gradeTree} = this.state;
        const columns = [{
            title: '学期',
            dataIndex: 'semesterName',
          }, {
            title: '组名称',
            dataIndex: 'groupName'
          },{
            title: '打分方式',
            render:(record)=>{
              return(<span>{getScoreType(record.scoreType)}</span>)
            }
          },{
            title: '年级组',
            dataIndex: 'gradeNames',
            render:(record)=>{
              return( <Tooltip title={record}>
                        <span>{record}</span>
                      </Tooltip>)
            }
          },{
            title: '创建时间',
            render:(record)=>{
              return(<span>{formatDate(record.createTime)}</span>)
            }
          },{
            title: '操作',
            dataIndex: '',
            width: 360,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.getDetail.bind(this, record)}>查看</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.toSetting.bind(this, record)}>考评项设置</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.toFlagDetail.bind(this, record)}>流动红旗规则</a>&nbsp;&nbsp;
                <a href="javascript:;" className="check-btn" onClick={this.copyGroup.bind(this, record)}>复制历史考评项</a> 
              </span>
            )
          }];

          const columns1 = [{
            title: '学期',
            dataIndex: 'semesterName',
            width: 120,
          }, {
            title: '年级组',
            dataIndex: 'groupName',
            width: 100,
          },{
            title: '打分方式',
            width: 100,
            render:(record)=>{
              return(<span>{getScoreType(record.scoreType)}</span>)
            }
          },{
            title: '分值',
            dataIndex: 'score',
            width: 60,
          }];

          const rowSelection = {
            type: "radio",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({
                selectedRowKeys: selectedRowKeys,
                copyGroupId: selectedRows[0].id,
                currentScoreType: selectedRows[0].scoreType,
              })
            },
          };

          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
          const {getHandlers,approvalRules} = this.props;
          const {appointData} = this.state;
        //   console.log(getHandlers)
          const {allTerms, commonGradeData, classNameData} = this.props;
          let termChild=[]
          allTerms&&allTerms.length>0&&allTerms.map(item=>{
            termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
          })
          let gradeChild=[]
          commonGradeData&&commonGradeData.length>0&&commonGradeData.map(item=>{
              gradeChild.push(<Option key={item.gradeId}>{item.gradeName}</Option>)
          })
          let classChild=[]
          classNameData&&classNameData.length>0&&classNameData.map(item=>{
              classChild.push(<Option key={item.classId}>{item.className}</Option>)
          })
          let appointList=[]
          appointData&&appointData.length>0&&appointData.map(item=>{
            appointList.push(<Option key={item.id}>{item.name}</Option>)
          })
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
        
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                        {getFieldDecorator('semesterId1', {
                        rules: [{
                            required: false
                        }],
                        } )(
                          <Select placeholder="请选择学期">
                              {termChild}
                          </Select>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem >
                        {getFieldDecorator("kw",
                        {
                          rules: [{
                              required: false,
                          }],
                          })(
                            <Input placeholder="请输入名称" />
                        )}
                    </FormItem>
                  </Col>
                  <Col span={8} offset={8}>
                      <Button onClick={this.reset.bind(this)}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.new.bind(this)}>新建</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.tableData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.tableData.totalCount} totalPage={this.state.tableData.totalPage} currentPage={this.state.tableData.currentPage}/>
              <Modal
                title="年级组管理"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                  <div className="modal-box">
                      <Form {...formItemLayout}>
                        <FormItem label='学期'>
                            {getFieldDecorator('semesterId', {
                              rules: [{
                                  required: true,
                                  message: "请选择学期",
                              }],
                            })(
                              <Select disabled placeholder="请选择学期">
                                  {termChild}
                              </Select>
                            )}
                        </FormItem>
                        <FormItem label='名称'>
                            {getFieldDecorator('groupName', {
                              rules: [{
                                  required: true,
                                  message: "请输入名称",
                              }],
                            })(
                              <Input placeholder="请输入名称"/>
                            )}
                        </FormItem>
                        <FormItem label='打分方式'>
                            {getFieldDecorator('scoreType', {
                              rules: [{
                                  required: true,
                                  message: "请选择打分方式",
                              }],
                            })(
                              <Select disabled>
                                  <Option value="1">得分值</Option>
                                  <Option value="2">扣分值</Option>
                                  <Option value="3">扣分点</Option>
                              </Select>
                            )}
                        </FormItem>
                        <FormItem label='图标'>
                            {getFieldDecorator('icon', {
                              rules: [{
                                  required: true,
                                  message: "请选择图标",
                              }],
                            })(
                               <Select>
                                  <Option value="1">
                                    <img src={icon1} style={{ height: '20px' }} />
                                  </Option>
                                  <Option value="2">
                                    <img src={icon2} style={{ height: '20px' }} />
                                  </Option>
                                  <Option value="3">
                                    <img src={icon3} style={{ height: '20px' }} />
                                  </Option>
                                  <Option value="4">
                                    <img src={icon4} style={{ height: '20px' }} />
                                  </Option>
                                  <Option value="5">
                                    <img src={icon5} style={{ height: '20px' }} />
                                  </Option>
                              </Select>
                            )}
                        </FormItem>
                        <FormItem label='年级'>
                            {getFieldDecorator('grades', {
                              rules: [{
                                  required: true,
                                  message: "请选择年级",
                              }],
                            })(
                               <Select
                                  mode="multiple"
                                  style={{ width: '100%' }}
                                  placeholder="请选择年级"
                                >
                                  {gradeTree.map((item, index)=>{
                                    return  <OptGroup key={index} label={item.gradeType}>
                                              {item.grades.map((i, idx)=>{
                                                return  <Option key={idx} value={i.gradeId}>{i.gradeName}</Option>
                                              })}
                                            </OptGroup>
                                  })}
                               </Select>
                            )}
                        </FormItem>
                    </Form>
                  </div>
              </Modal>

              <Modal
                title="复制历史考评项"
                width={800}
                visible={this.state.visible1}
                onOk={this.handleOk1}
                onCancel={this.handleCancel1}
              >
                  <div className="modal-box">
                      <Form>
                          <Row gutter={24}>
                            <Col span={8}>
                              <FormItem label=''>
                                  {getFieldDecorator('semesterId2')(
                                    <Select placeholder="请选择学期">
                                        {termChild}
                                    </Select>
                                  )}
                              </FormItem>
                            </Col>
                            <Col span={8} offset={8}>
                                <Button type='primary' onClick={this.search1.bind(this)}>查询</Button>
                            </Col>
                          </Row>
                      </Form>

                    <Table rowSelection={rowSelection} columns={columns1} dataSource={this.state.tableData1} pagination={false}/>


                  </div>
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     roomList:state.room,
    //  getHandlers:state.room.saveHanders,
     approvalRules:state.user.approvalRules,
     allTerms:state.user.allTerms,
     commonGradeData:state.user.commonGradeData,
     classNameData:state.user.classNameData,
  }
}
export default connect(mapStateToProps)(Form.create()(classEvaluationGroupList));
