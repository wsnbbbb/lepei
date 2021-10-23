import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate} from '../../utils/public';
import './style.less';
import {getImg} from '../../utils/img';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class evaluateRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
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
          classNameData: [],
          currentScoreType: '',
          detailScore: {}


        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20
      }
      this.getList(params)
 
      this.props.dispatch({ //获取所有学期
          type:'user/getAllSemesters',
      })
      this.props.dispatch({ //获取所有年级
          type:'user/getCommonGradeList',
      })

      sessionStorage.removeItem("qiniuToken");
      this.props.dispatch({ //获取上传图片token
          type:'user/getPicToken',
          callback:(res)=>{
              if(res.code===200){
                  sessionStorage.setItem("qiniuToken",res.data.token)
                  this.setState({qiniuToken:res.data.token})
              }
          }
      })

    }

    semesterChange=(val)=>{
        if(!val) return
        this.props.form.validateFields((err, values) => {
          if(values.gradeId){
            this.props.form.resetFields(["typeId"])
            let params = {
              semesterId: val,
              gradeId: values.gradeId
            }
            this.getApointBySemesterIdAndGradeId(params)
          }
        })
    }

    gradeChange=(val)=>{
          if(val){
            this.props.dispatch({
              type:'user/getClassName',
              payload:{"gradeId":val},
              callback:(res)=>{
                if(res.code===200){
                  
                  this.setState({classValue: undefined, classDisabled:false, classNameData: res.data})
                }
              }
            })
          }else{
            this.setState({classValue:'',classDisabled:true})
          }

          if(!val) return
          this.props.form.validateFields((err, values) => {
            if(values.semesterId){
              this.props.form.resetFields(["typeId"])
              let params = {
                semesterId: values.semesterId,
                gradeId: val
              }
             
              this.getApointBySemesterIdAndGradeId(params)
            }
          })
    }

    getApointBySemesterIdAndGradeId=(params)=>{
      this.props.dispatch({
        type:'evaluate/getApointBySemesterIdAndGradeId',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              appointData: res.data
            })
          }
        }
      })
    }

    classChange=(val)=>{
        this.setState({classValue: val})
    }
    getList=(params)=>{
      this.props.dispatch({
        type:'evaluate/getEvaluationRecords',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            res.data&&res.data.dataList.map(item=>{
              item.name = item.gradeName + item.className
            })
           this.setState({
             tableData: res.data
           })
          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page": 1,
          "prePage": this.state.prePage,
          "typeId": values.typeId||'',
          "semesterId": values.semesterId||'',
          "gradeId": values.gradeId||'',
          "classId": this.state.classValue||'',
          "startDate": values.timeRange&&values.timeRange[0]&&values.timeRange[0].format('YYYY-MM-DD')||'',
          "endDate": values.timeRange&&values.timeRange[1]&&values.timeRange[1].format('YYYY-MM-DD')||'',
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
          "typeId": values.typeId||'',
          "semesterId": values.semesterId||'',
          "gradeId": values.gradeId||'',
          "classId": this.state.classValue||'',
          "startDate": values.timeRange&&values.timeRange[0]&&values.timeRange[0].format('YYYY-MM-DD')||'',
          "endDate": values.timeRange&&values.timeRange[1]&&values.timeRange[1].format('YYYY-MM-DD')||'',
        }
        this.getList(params)
      })
    }
    getDetail=(record)=>{
      const params={
        "classId": record.classId||'',
        "typeId": record.typeId||'',
        "date": record.date||''
      }
      this.setState({
        currentClassId: record.classId||'',
        currentTypeId: record.typeId||'',
        currentDate: record.date||'',
      })
      this.props.dispatch({
        type:'evaluate/getEvaluationRecordsDetail',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
              currentScoreType: res.data.scoreType,
              detailScore: res.data
            })
            let imgData=[];
            res.data.pic.length>0&&res.data.pic.map((item,index)=>{
              imgData.push({
                uid: index+'~'+item,
                name: 'xxx.png',
                status: 'done',
                url: getImg(item),
              })
            })
            this.setState({
              newTitle: `考评详情（${res.data.date} ${res.data.week}) ${res.data.typeName}`
            })
           this.setState({
             visible: true,
             typeName: res.data.typeName,
             scoreType: res.data.scoreType,
             fileList: imgData
           })
          
          if(res.data.scoreType==3){
            let score =((res.data.totalScore-res.data.score)/res.data.reduceScore).toFixed(0)
            this.props.form.setFieldsValue({
              "score": score
            })
          }else if(res.data.scoreType==2){
            let score = Math.round((Number(res.data.totalScore)-Number(res.data.score)) * 100) / 100
            this.props.form.setFieldsValue({
              "score": score
            })
          }else{
              this.props.form.setFieldsValue({
                  "score": Number(res.data.score),
                  "mark": res.data.mark,
              });
           }
          }
        }
      })
      this.props.dispatch({
        type:'evaluate/getEvaluationLogs',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
            this.setState({
                logs: res.data
            })
          }
        }
      })
    }
    toMenuManage=()=>{
      this.props.dispatch(routerRedux.push("/material-menu-manage"))
    }

    handleCancel1 = () => this.setState({ previewVisible: false });

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
        this.props.form.resetFields(["semesterId", "gradeId", "timeRange", "typeId"])
        this.setState({ placeDisabled: true,  appointData: [], classValue: undefined, classNameData: []})
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
    
    handleOk = (e) => {
        let me = this
        
        this.props.form.validateFields((err, values) => {
          console.log(values)
          if(err) return
          let score
          if(me.state.currentScoreType==2){
            score = Number(me.state.detailScore.totalScore)-(Number(values.score))
          }else if(me.state.currentScoreType==3){
            score = Number(me.state.detailScore.totalScore)-(Number(values.score)*Number(me.state.detailScore.reduceScore))
          }else{
            score = Number(values.score)
          }
          if(score<0) return message.error("分数输入错误")
          this.props.dispatch({
            type:'evaluate/updateEvaluationRecords',
            payload: {
              "classId": this.state.currentClassId,
              "typeId": this.state.currentTypeId,
              "date": this.state.currentDate,
              "score": score.toFixed(2),
              "pic": this.state.imgs.length>0?this.state.imgs:this.state.oldImgs,
              "mark": values.mark
            },
            callback:(res)=>{
              if(res.code===200){
                message.success('设置成功！',2)

                this.setState({
                  visible: false
                });


                this.props.form.validateFields((err, values) => {
                  const params={
                    "page": this.state.page,
                    "prePage": this.state.prePage,
                    "typeId": values.typeId||'',
                    "semesterId": values.semesterId||'',
                    "gradeId": values.gradeId||'',
                    "classId": this.state.classValue||'',
                    "startDate": values.timeRange&&values.timeRange[0]&&values.timeRange[0].format('YYYY-MM-DD')||'',
                    "endDate": values.timeRange&&values.timeRange[1]&&values.timeRange[1].format('YYYY-MM-DD')||'',
                  }
                  me.getList(params)
                })
              }
            }
          })
        })
        
    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const columns = [{
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className'
          },{
            title: '一级考评项',
            dataIndex: 'cateName'
          },{
            title: '二级考评项',
            dataIndex: 'typeName'
          },{
            title: '时间',
            render:(record)=>{
              return(<span>{record.date}（{record.week}）</span>)
            }
          },{
            title: '得分',
            dataIndex: 'score'
          },{
            title: '考评人',
            dataIndex: 'scorePersonName'
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.getDetail.bind(this, record)}>查看</a> 
              </span>
            )
          }];

          const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
            );
          const qiniuToken=sessionStorage.getItem('qiniuToken');
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const formItemLayout3 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
          const {getHandlers,approvalRules} = this.props;
          const {appointData, classNameData} = this.state;
        //   console.log(getHandlers)
          const {allTerms, commonGradeData} = this.props;
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
          const {classDisabled,classValue} = this.state;
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={3}>
                    <FormItem label=''>
                        {getFieldDecorator('semesterId')(
                          <Select placeholder="请选择学期" onChange={this.semesterChange}>
                              {termChild}
                          </Select>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={3}>
                      <FormItem >
                      {getFieldDecorator("gradeId")(
                          <Select placeholder="请选择年级" showSearch onChange={this.gradeChange} optionFilterProp="children">
                              {/* <Option value='' key=''>全部</Option> */}
                              {gradeChild}
                          </Select>
                      )}
                      </FormItem>
                  </Col>  
                  <Col span={3}>
                      <FormItem optionFilterProp="children">
                          <Select placeholder="请选择班级" showSearch value={classValue} onChange={this.classChange} disabled={classDisabled}>
                          {/* <Option value='' key=''>全部</Option> */}
                          {classChild}
                          </Select>
                      </FormItem>
                  </Col>
                  <Col span={3}>
                      <FormItem>
                      {getFieldDecorator("typeId")(
                          <Select placeholder="请选择考评项" showSearch disabled={classDisabled}>
                          {appointList}
                          </Select>
                      )}
                      </FormItem>
                  </Col>

                  <Col span={6}>
                    <FormItem >
                        {getFieldDecorator("timeRange")(
                            <RangePicker />
                        )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={0}>
                      <Button onClick={this.reset.bind(this)}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.tableData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.tableData.totalCount} totalPage={this.state.tableData.totalPage} currentPage={this.state.tableData.currentPage}/>
              <Modal
                title={this.state.newTitle}
                visible={this.state.visible}
                width={800}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                
                  <div className="modal-box">

                      <h4>{this.state.scoreType==1?"得分信息":(this.state.scoreType==2?"扣分值信息":this.state.scoreType==3?"扣分点信息":'')}</h4>
                      <Form {...formItemLayout3}>
                        {
                          this.state.scoreType==3?
                          <FormItem label={this.state.typeName||''}>
                            {getFieldDecorator('score', {
                              rules: [{
                                  required: true,
                                  pattern: /^[0-9]+$/,
                                  message: '只能输入正整数' 
                              }]
                            })(
                              <Input placeholder="" />
                            )}
                        </FormItem>:<FormItem label={this.state.typeName||''}>
                            {getFieldDecorator('score', {
                              rules: [{
                                  required: true,
                                  pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/,
                                  message: '最多保留两位小数' 
                              }]
                            })(
                              <Input placeholder="" />
                            )}
                        </FormItem>
                        }
                        <FormItem label='备注'>
                            {getFieldDecorator('mark')(
                              <TextArea autosize={{ minRows: 3, maxRows: 8 }}  placeholder="备注"/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout2} label={'图片'}>
                          {/* {getFieldDecorator("imgs",{initialValue:''})( */}
                            <Upload
                                action="https://upload.qiniup.com/"
                                accept="image/jpg,image/jpeg,image/png"
                                listType="picture-card"
                                fileList={fileList}
                                multiple={true}
                                beforeUpload={this.beforeUpload}
                                onPreview={this.handlePreview}
                                onChange={this.handleImgsChange}
                                data={{token:qiniuToken?qiniuToken:this.state.qiniuToken}}
                            >
                                {fileList.length >= 9 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          {/* )} */}
                        </FormItem>
                          

                    </Form>

                    <h4>打分记录</h4>
                    <div className="timeline-box">
                      <Timeline>
                        {this.state.logs.map((item, index)=>{
                          return <Timeline.Item  key={index}>
                            {item.examiner}&nbsp;&nbsp;&nbsp;&nbsp;
                            {item.score}&nbsp;&nbsp;&nbsp;&nbsp;
                            {item.sourceType==1?"app":(item.sourceType==2?"电子班牌":(item.sourceType==3?'Pad':(item.sourceType==4?"学校后台":'')))}&nbsp;&nbsp;&nbsp;&nbsp;
                            {formatDate(item.createTime)}
                          </Timeline.Item>
                        })}
                        
                      </Timeline>
                    </div>
                   

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
     allTerms: state.user.allTerms,
     commonGradeData: state.user.commonGradeData,
  }
}
export default connect(mapStateToProps)(Form.create()(evaluateRecord));
