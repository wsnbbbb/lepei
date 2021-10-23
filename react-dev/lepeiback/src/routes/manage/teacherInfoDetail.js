/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Breadcrumb, Upload, Tree, message, Table, Button, Input, Select, Form, Row, Col, Icon, DatePicker, Radio, TreeSelect, Modal } from 'antd';
import StepIndex from '../../components/steps';
import BottomBtns from '../../components/bottom-btns';
import AddClass from '../../components/addClass';
import AddSelect from '../../components/addSelect';
import DepartmentSelect from '../../components/departmentSelect';
import { getQueryString, onlyDate, isBlank } from '../../utils/public';
import { getImg } from '../../utils/img';
import moment from 'moment';
import './style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { TreeNode } = Tree;
const confirm = Modal.confirm;
// const TreeNode = TreeSelect.TreeNode;

class TeacherInfoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:"教师个人信息",
            
        };
    }
    
    componentDidMount = () => {
        this.getDetail()
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/teacher-manage"
            },
          })
    }

    getDetail=()=>{
        this.props.dispatch({
            type: 'person/getTeacherPersonnelInfo',
            payload: { "id": getQueryString("id") },
            callback: (res) => {
                if (res.code === 200) {
                    this.props.form.setFieldsValue({
                        "name": res.data.name||undefined, 
                        "sex": res.data.sex||undefined,
                        "idCardNo": res.data.idCardNo||undefined,
                        "usin": res.data.usin||undefined,
                        "major": res.data.major||undefined,
                        "nation": res.data.nation||undefined,
                        "startTeachingDate": res.data.startTeachingDate&&moment(res.data.startTeachingDate, 'YYYY-MM-DD')||undefined,
                        "currentDuty": res.data.currentDuty==null?undefined: String(res.data.currentDuty),
                        "teacherCertType": res.data.teacherCertType==null?undefined: String(res.data.teacherCertType),
                        "teacherCertGetDate": res.data.teacherCertGetDate&&moment(res.data.teacherCertGetDate, 'YYYY-MM-DD')||undefined,
                        "mandarinChineseLevel": res.data.mandarinChineseLevel==null?undefined: String(res.data.mandarinChineseLevel),
                        "mandarinChineseLevelGetDate": res.data.mandarinChineseLevelGetDate&&moment(res.data.mandarinChineseLevelGetDate, 'YYYY-MM-DD')||undefined,
                        "topEducation": res.data.topEducation==null?undefined: String(res.data.topEducation),
                        "topDegree": res.data.topDegree==null?undefined: String(res.data.topDegree),
                        "graduatedSchool": res.data.graduatedSchool==null?undefined: String(res.data.graduatedSchool),
                        "major": res.data.major==null?undefined: String(res.data.major),
                        "educationGetDate": res.data.educationGetDate&&moment(res.data.educationGetDate, 'YYYY-MM-DD')||undefined,
                        "degreeGetDate": res.data.degreeGetDate&&moment(res.data.degreeGetDate, 'YYYY-MM-DD')||undefined ,
                        "politicalFace": res.data.politicalFace&&res.data.politicalFace+""||undefined,
                        "politicsGetDate": res.data.politicsGetDate&&moment(res.data.politicsGetDate, 'YYYY-MM-DD')||undefined,
                        "yearlyExamines": res.data.yearlyExamines||undefined,
                        "currentTitle": res.data.currentTitle==null?undefined: String(res.data.currentTitle),
                        "currentTitleGetDate": res.data.currentTitleGetDate&&moment(res.data.currentTitleGetDate, 'YYYY-MM-DD')||undefined,
                        "currentTitleAppointDate": res.data.currentTitleAppointDate&&moment(res.data.currentTitleAppointDate, 'YYYY-MM-DD')||undefined,
                        "currentPosition": res.data.currentPosition==null?undefined: String(res.data.currentPosition),
                        "currentPositionAppointDate": res.data.currentPositionAppointDate&&moment(res.data.currentPositionAppointDate, 'YYYY-MM-DD')||undefined,
                    })

                }
            }
        })
    }

    // 提交
    save = () =>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = {
                    "id": getQueryString("id"),
                    "nation": values.nation||'',
                    "startTeachingDate": values.startTeachingDate&&values.startTeachingDate.format('YYYY-MM-DD')||'',
                    "currentDuty": values.currentDuty||'',
                    "teacherCertType": values.teacherCertType||'',
                    "teacherCertGetDate": values.teacherCertGetDate&&values.teacherCertGetDate.format('YYYY-MM-DD')||'',
                    "mandarinChineseLevel": values.mandarinChineseLevel||'',
                    "mandarinChineseLevelGetDate": values.mandarinChineseLevelGetDate&&values.mandarinChineseLevelGetDate.format('YYYY-MM-DD')||'',
                    "topEducation": values.topEducation||'',
                    "topDegree": values.topDegree||'',
                    "graduatedSchool": values.graduatedSchool||'',
                    "major": values.major||'',
                    "educationGetDate": values.educationGetDate&&values.educationGetDate.format('YYYY-MM-DD')||'',
                    "degreeGetDate": values.degreeGetDate&&values.degreeGetDate.format('YYYY-MM-DD')||'',
                    "politicalFace": values.politicalFace||'',
                    "politicsGetDate": values.politicsGetDate&&values.politicsGetDate.format('YYYY-MM-DD')||'',
                    "yearlyExamines": values.yearlyExamines||'',
                    "currentTitle": values.currentTitle||'',
                    "currentTitleGetDate": values.currentTitleGetDate&&values.currentTitleGetDate.format('YYYY-MM-DD')||'',
                    "currentTitleAppointDate": values.currentTitleAppointDate&&values.currentTitleAppointDate.format('YYYY-MM-DD')||'',
                    "currentPosition": values.currentPosition||'',
                    "currentPositionAppointDate": values.currentPositionAppointDate&&values.currentPositionAppointDate.format('YYYY-MM-DD')||'',
                }

                this.props.dispatch({
                    type: 'person/updateTeacherPersonnelInfo',
                    payload: params,   // 请求参数
                    callback: (res) => { // 请求成功 执行的回调函数
                        if (res.code === 200) {
                            message.success('保存成功！', 2)
                        }
                    }
                })
            }
        })
    }

    back=()=>{
        window.history.go(-1)
    }

    //简介输入字数
    onBlur = (e) => {
        this.setState({textNum:e.target.value.length})
    }
   
    render() {
        const { getFieldDecorator } = this.props.form;
        const { disabled,detailList, edit, imgPath, controlBtn, tagsList, visible,tagFlag} = this.state;
        const dateFormat = 'YYYY-MM-DD';
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16}
        };
        const formItemLayout2 = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
   
        return (
            <div className='detail-main teacher-detail-info'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/teacher-manage">教师管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>教师个人信息</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>教师个人信息</h3>
                </div> */}
                <h3 className='detail-title'>基础资料</h3>
                <div className="content-main information">

                        <Form className="ant-advanced-search-form " style={{width: "100%"}}>
                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label='姓名' className="personName">
                                        {getFieldDecorator('name', {
                                            rules: [{ required: true, message: "请输入姓名", whitespace: true, }]
                                        })(
                                            <Input placeholder="请输入姓名" disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'性别'}>
                                        {getFieldDecorator("sex", { 
                                                rules: [{ required: true }] })(
                                            <RadioGroup disabled>
                                                <Radio value={1}>男</Radio >
                                                <Radio value={2}>女</Radio >
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                          

                            <Row gutter={24} className="labelWidth">
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label='其他证件'>
                                        {getFieldDecorator('usin', {

                                        })(
                                            <Input maxLength={17} placeholder='请输入其他证件' />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='现任岗位'>
                                        {getFieldDecorator('currentDuty', { 

                                        })(
                                            <Select placeholder="请选择现任岗位" allowClear>
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >管理岗位</Option>
                                                <Option value='2' >专业技术岗-教师</Option>
                                                {/* <Option value='3' >专业技术岗-中层干部</Option>
                                                <Option value='4' >专业技术岗-副校长</Option>
                                                <Option value='5' >专业技术岗-校长</Option> */}
                                                <Option value='6' >工勤岗位</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'参加教育日期'}>
                                        {getFieldDecorator("startTeachingDate", { 
                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='民族'>
                                        {getFieldDecorator('nation', { 
                                        })(
                                            <Input maxLength={17} placeholder='请输入民族' />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'教师资格证类型'}>
                                        {getFieldDecorator("teacherCertType", {

                                        })(
                                             <Select placeholder="请选择教师资格类型">
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >幼儿园</Option>
                                                <Option value='2' >小学</Option>
                                                <Option value='3' >初级中学</Option>
                                                <Option value='4' >高级中学</Option>
                                                <Option value='5' >中等职业技术学校</Option>
                                                <Option value='6' >中等职业学校实习指导</Option>
                                                <Option value='7' >高等学校</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='教资取得日期'>
                                        {getFieldDecorator('teacherCertGetDate', { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'普通话等级信息'}>
                                        {getFieldDecorator("mandarinChineseLevel", { 

                                        })(
                                             <Select placeholder="请选择普通话等级信息">
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >一级甲等</Option>
                                                <Option value='2' >一级乙等</Option>
                                                <Option value='3' >二级甲等</Option>
                                                <Option value='4' >二级乙等</Option>
                                                <Option value='5' >三级甲等</Option>
                                                <Option value='6' >三级乙等</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='普通话等级取得日期'>
                                        {getFieldDecorator('mandarinChineseLevelGetDate', { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'现任职称'}>
                                        {getFieldDecorator("currentTitle", { 

                                        })(
                                             <Select placeholder="请选择现任职称" allowClear>
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >中小学高级教师（正高）</Option>
                                                <Option value='2' >中小学高级教师（副高）</Option>
                                                <Option value='3' >中小学一级教师</Option>
                                                <Option value='4' >中小学二级教师</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='取得职称时间'>
                                        {getFieldDecorator('currentTitleGetDate', { initialValue: detailList && detailList.usin || '' })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'现任职级聘任日期'}>
                                        {getFieldDecorator("currentTitleAppointDate", { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='现任职级'>
                                        {getFieldDecorator('currentPosition', { initialValue: detailList && detailList.usin || '' })(
                                            <Select placeholder="请选择现任职级" allowClear>
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >专业技术岗位四级</Option>
                                                <Option value='2' >专业技术岗位五级</Option>
                                                <Option value='3' >专业技术岗位六级</Option>
                                                <Option value='4' >专业技术岗位七级</Option>
                                                <Option value='5' >专业技术岗位八级</Option>
                                                <Option value='6' >专业技术岗位九级</Option>
                                                <Option value='7' >专业技术岗位十级</Option>
                                                <Option value='8' >专业技术岗位十一级</Option>
                                                <Option value='9' >专业技术岗位十二级</Option>
                                                <Option value='10' >未定级</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'职称聘任日期'}>
                                        {getFieldDecorator("currentPositionAppointDate", { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='最高学历'>
                                        {getFieldDecorator('topEducation', {

                                        })(
                                            <Select placeholder="请选择">
                                                <Option value='1' >高中</Option>
                                                <Option value='2' >专科</Option>
                                                <Option value='3' >本科</Option>
                                                <Option value='4' >硕士</Option>
                                                <Option value='5' >博士</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'最高学位'}>
                                        {getFieldDecorator("topDegree", { 

                                        })(
                                              <Select placeholder="请选择">
                                                <Option value='0' >暂无</Option>
                                                <Option value='1' >学士</Option>
                                                <Option value='2' >硕士</Option>
                                                <Option value='3' >博士</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='最高学历毕业院校'>
                                        {getFieldDecorator('graduatedSchool', {

                                        })(
                                            <Input maxLength={60} placeholder='请输入毕业院校' />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label='学位取得时间'>
                                        {getFieldDecorator('degreeGetDate', { 

                                        })(
                                             <DatePicker format={dateFormat} />
                                            
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'学历取得时间'}>
                                        {getFieldDecorator("educationGetDate", { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label='政治面貌'>
                                        {getFieldDecorator('politicalFace', { 
                                            
                                        })(
                                            <Select placeholder="请选择">
                                                <Option value='1' >群众</Option>
                                                <Option value='2' >中共党员</Option>
                                                <Option value='3' >中共预备党员</Option>
                                                <Option value='4' >共青团员</Option>
                                                <Option value='5' >民革党员</Option>
                                                <Option value='6' >民盟盟员</Option>
                                                <Option value='7' >民建会员</Option>
                                                <Option value='8' >民进会员</Option>
                                                <Option value='9' >农工党党员</Option>
                                                <Option value='10' >致公党党员</Option>
                                                <Option value='11' >九三学社社员</Option>
                                                <Option value='12' >台盟盟员</Option>
                                                <Option value='13' >无党派人士</Option>
                                            </Select>
                                            
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'取得政治面貌时间'}>
                                        {getFieldDecorator("politicsGetDate", { 

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                {/* <Col span={16}>
                                    <FormItem {...formItemLayout2} label={'出生日期'}>
                                        {getFieldDecorator("birthday", {

                                        })(
                                            <DatePicker format={dateFormat} />
                                        )}
                                    </FormItem>
                                </Col> */}
                                <Col span={16}>
                                    <FormItem {...formItemLayout2} label='最高学历所学专业'>
                                        {getFieldDecorator('major', {

                                         })(
                                            <Input maxLength={18} placeholder='请输入所学专业' />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>


                            <Row gutter={24} className="bottom-row">
                                <Col span={16} className="introduce">
                                    <FormItem {...formItemLayout2} label='年度考核优秀次数、年份（近三年）'>
                                        {getFieldDecorator('yearlyExamines', { 

                                        })(
                                            <TextArea placeholder="格式为： 2018年“优秀或合格”， 2019年“优秀或合格” ，2020年“优秀或合格”" maxLength={200} onInput={this.onBlur.bind(this)} autosize={{ minRows: 3, maxRows: 6 }} />
                                        )}
                                        {/* <p className="textNum"><span>{this.state.textNum || '0'}</span>/200</p> */}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
                            </Row>
                           
                        </Form>

                 

                </div>
               
          
              
            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        jobList: state.user.commonJobList,
        classData: state.user.classByGrade
    }
}

export default connect(mapStateToProps)(Form.create()(TeacherInfoDetail));
