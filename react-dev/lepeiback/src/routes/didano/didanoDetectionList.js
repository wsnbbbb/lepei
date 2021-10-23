import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select , Form, Row, Col, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus, formatDate, dateToTimestamp, getSexType, getGradeType, getResidence, getCheckType} from '../../utils/public';
import './style.less';
import RedBox from 'redbox-react';
import TextArea from 'antd/lib/input/TextArea';
import { getImg } from '../../utils/img';
import moment from 'moment';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class DidanoDetectionList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible: false,
          visibleView: false,
          reset:false,
          data: {},
          deviceNo: '',
          remark: '',
          currentDeviceNo: '',
          previewImg: '',
          classValue:'',
          startTime: '',
          endTime: ''
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
      }
      this.getList(params)
      this.props.dispatch({
        type:'user/getCommonGradeList'
      })
    }
  
    getList=(params)=>{
      this.props.dispatch({
        type:'didano/didanoDetectionRecords',
        payload:params,
        callback: res=>{
          this.setState({
            data: res.data
          })
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
          "gradeId": values.gradeId||'',
          "classId": this.state.classValue||'',
          "startTime": this.state.startTime || '',
          "endTime": this.state.endTime  || ''
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
          "gradeId": values.gradeId||'',
          "classId": this.state.classValue||'',
          "startTime": this.state.startTime || '',
          "endTime": this.state.endTime  || ''
        }
        this.getList(params)
      })
    }

    handleChange=(value)=>{
      console.log(value)
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    showImgModal = (pic) => {
      this.setState({
        previewImg: pic,
        visibleView: true
      }) 
    }
  

    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId":id},
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

    handleOk = (e) => {
      this.setState({
        visibleView: false
      });   
    }
    
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
          visible: false,reset:true,
          visibleView: false
        });
    }
    handlerRef=(ref)=>{
      this.handlerChild=ref;
    }
    onChangeRange=(date, dateString)=>{
      console.log({dateString});
      this.setState({
        startTime: dateToTimestamp(dateString[0]),
        endTime: dateToTimestamp(dateString[1]),
      })
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'childName',
          }, {
            title: '性别',
            dataIndex: 'sex',
            render:(record)=>{
              return(<span>{getSexType(record)}</span>)
            }
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }, {
            title: '读书形式',
            dataIndex: 'inResidence',
            render:(record)=>{
              return(<span>{getResidence(record)}</span>)
            }
          }, {
            title: '晨检时间',
            dataIndex: 'checkTime',
            render:(record)=>{
              return(<span>{formatDate(record)}</span>)
            }
          }, {
            title: '身高cm',
            dataIndex: 'bodyHeight',
            render:(record)=>{
              return(<span>{(record/10).toFixed(1)}</span>)
            }
          }, {
            title: '体重kg',
            dataIndex: 'bodyWeight',
            render:(record)=>{
              return(<span>{(record/1000).toFixed(1)}</span>)
            }
          }, {
            title: '体温℃',
            dataIndex: 'temperature',
          }, {
            title: '类别',
            dataIndex: 'checkType',
            render:(record)=>{
              return(<span>{getCheckType(record)}</span>)
            }
          },{
            title: '图片',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              record.pictureUrl?<span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showImgModal.bind(this,record.pictureUrl)}>查看</a> 
              </span>
              :""
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          };
          const {roomList,getHandlers,approvalRules, commonData, gradeList} = this.props;
          // const {personData,commonData,gradeList} =this.props;
          console.log(getHandlers)
          if(!roomList){
            // return null;
          }
          let children = [];
          approvalRules&&approvalRules.length>0&&approvalRules.map(item=>{ //教职工列表
              return children.push(<Option key={item.ruleId} >{item.ruleName}</Option>);
          })
          let options=[]
          gradeList&&gradeList.length>0&&gradeList.map(item=>{
            return options.push(<Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>)
          })
          let classOptions=[];
          commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
            return classOptions.push(<Option key={item.classId} value={item.classId}>{item.className}</Option>)
          })
        return (
            <div className="content-main didano">
              <Form className="ant-advanced-search-form content-form ">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw',{})(
                        <Search placeholder="请输入学生姓名"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'年级'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'班级'}>
                        <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                          <Option value='' key=''>全部</Option>
                          {classOptions}
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span={8} >
                      <FormItem {...formItemLayout} label={''}>
                        {getFieldDecorator("time")(
                           <RangePicker style={{ width: 380 }}
                           showTime={{ format: 'HH:mm:ss' }}
                           format="YYYY-MM-DD HH:mm:ss"
                           placeholder={['开始时间', '结束时间']}
                           onChange={this.onChangeRange} />
                        )}
                      </FormItem>
                  </Col>
                  <Col span={2} offset={1}>
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage}/>

              <Modal
                title="查看图片"
                visible={this.state.visibleView}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                    <img src={this.state.previewImg} className='didano-img-preview'/>
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
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}
export default connect(mapStateToProps)(Form.create()(DidanoDetectionList));
