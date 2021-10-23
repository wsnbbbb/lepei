import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, TreeSelect, Tag, InputNumber, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getScoreType, getCycleType, getSexType, getGradeType, getQueryString} from '../../utils/public';
import './style.less';
import {getImg} from '../../utils/img';
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
const { TreeNode } = TreeSelect;

class addGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {

          currentGroupId: '',
          copyGroupId: '',
          marks: [],
          secondTypes: [
            {
              name: '',
              totalScore: '',
              totalIcon: undefined,
              iconArr: [],
              defaultScore: '',
              deducteScore: ''
            }
          ],
          inputVisible: false,
          inputValue: '',
          padExaminerList: [],
          teacherExaminerList: [],
          visible: false,
          classValue: '',
          disabled: '',
          tableData: {},
          typeList: [],
          classTree: [],
          page:1,
          prePage:20,
          selectedRows: [],
          selectedRowKeys: [],
          allRows: [],
          studentExaminers: [],
          totalScore: '',
          gradeTree: [],
          title:"添加年级组",

        };
    }
    componentDidMount=()=>{
      this.props.dispatch({ //获取所有学期
        type:'user/getAllSemesters',
      })
      this.getGradeTree()
      this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/class-evaluation-group-list"
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

    // 返回
    back = () =>{
      window.history.go(-1)
    }

    save = () =>{
      this.props.form.validateFields((err, values) => {
        if(err) return
        let params = {
          semesterId: values.semesterId||'',
          groupName: values.groupName||'',
          scoreType: values.scoreType||'',
          icon: values.icon||'',
          gradeIds: values.gradeIds||[],
        }
        this.props.dispatch({
          type:'evaluate/addClassEvaluationGroup',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              message.success("保存成功")
              setTimeout(() => {
                window.history.go(-1)
              }, 2000);
            }
          }
        })
      })
    }
      
    render(){
        const {gradeTree} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {classTree } = this.state;
        
        const formItemLayout = {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        };
        const formItemLayout1 = {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        };
   

        const {commonData, gradeList} = this.props;
        let classOptions=[];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
        })
        let options=[]
        gradeList&&gradeList.length>0&&gradeList.map(item=>{
          return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
        })
      
        const {allTerms} = this.props;
        let termChild=[]
        allTerms&&allTerms.length>0&&allTerms.map(item=>{
          termChild.push(<Option key={item.semesterId}>{item.semesterName}</Option>)
        })

        return (
            <div className="content-main">
                {/* <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/class-evaluation-group-list">年级组管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>添加年级组</Breadcrumb.Item>
                </Breadcrumb> */}
              <Form>
                  <Row gutter={24}>
                      <Col span={12}>
                        <FormItem {...formItemLayout1} label='学期'>
                        {getFieldDecorator('semesterId', {
                            rules: [
                              {
                                required: true,
                                message: '请选择学期',
                              },
                            ],
                          })(
                          <Select placeholder="请选择学期" onChange={this.semesterChange}>
                              {termChild}
                          </Select>
                        )}
                    </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout1} label="名称">
                          {getFieldDecorator('groupName', {
                            rules: [
                              {
                                required: true,
                                message: '请输入名称',
                              },
                            ],
                          })(<Input maxLength={30} placeholder="请输入名称" />)}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout1} label="打分方式">
                          {getFieldDecorator('scoreType', {
                            rules: [{ required: true, message: '请选择打分方式' }],
                          })(
                            <Select placeholder="请选择打分方式">
                              <Option value="1">得分值</Option>
                              <Option value="2">扣分值</Option>
                              <Option value="3">扣分点</Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout1} label="图标">
                          {getFieldDecorator('icon', {
                            rules: [{ required: true, message: '请选择图标' }],
                          })(
                            <Select placeholder="请选择图标">
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
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout1} label="年级">
                          {getFieldDecorator('gradeIds', {
                            rules: [{ required: true, message: '请选择年级' }],
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
                          </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
   
                 
              </Form>   

              <div className="btn">
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.save.bind(this)}>保存</Button>
              </div>

    
         </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    gradeList: state.user.commonGradeData,
    allTerms: state.user.allTerms,
  }
}
export default connect(mapStateToProps)(Form.create()(addGroup));
