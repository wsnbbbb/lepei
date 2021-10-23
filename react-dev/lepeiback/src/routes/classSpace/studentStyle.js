import React,{Component} from 'react';

import { connect } from 'dva';
import { Table,Modal,Spin , Checkbox,Divider,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import { routerRedux } from 'dva/router';
import { classList } from '../../services';
import { unwatchFile } from 'fs';
import { getImgOfStyle } from '../../utils/img';
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class studentStyle extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            classList: [],
            classId: null,
            allClassList: [],
            classIdValue: undefined,
            disabled: true,
            visible: false,
            publishers: [],
            gradeId: undefined,
        };
    }

    componentDidMount=()=>{
        this.getAllgrade();
        // this.getAllclasses();
        let params={}
        this.studentStyle(params);
       
    }

    getAllgrade=()=>{
        this.props.dispatch({
            type:'classSpace/getAllgrade',
            payload: {},
            callback:(res)=>{
                if(res.code===200){
                   
                }
              }
        })
    }

    getClassesByGradeId=(params)=>{
        this.props.dispatch({
            type:'classSpace/getClassesByGradeId',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                   
                }
              }
        })
    }

    getAllclasses=()=>{
        this.props.dispatch({
            type:'classSpace/getAllClasses',
            payload: {
                "page": 1,
                "prePage": 10000
            },
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                       "classList": res.data.dataList,
                       "allClassList": res.data.dataList
                   })
                }
              }
        })
    }

   
    handleChange1=(e)=> {
        if(e==0){
            this.setState({
                disabled: true,
                classIdValue: undefined,
                classList: this.state.allClassList
            })
            let params={}
            this.studentStyle(params);
            return
        }
        const params={
            "gradeId": e
        }
        this.setState({
            classIdValue: undefined,
            disabled: false,
            gradeId: e,
        })
        this.getClassesByGradeId(params)
    }

    handleChange2=(value)=> {
        this.setState({
            classIdValue: value
        })
        // this.search(e)
        let params = {
            gradeId: '',
            classId: value,
        }
        this.studentStyle(params)
    }
    search=(e)=>{
        let newClassList=[]
        this.state.allClassList.map((item)=>{
            if(item.classId==e){
                newClassList.push(item)
            }
        })
        this.setState({
            classList: newClassList
        })
    }
   
    toDetailPage = (id) => {
        this.props.dispatch(
            routerRedux.push("/style-detail/" + id)
        )
    }
    publishManage=()=>{
        this.getPublisher();
    }

    getPublisher=()=>{
        this.props.dispatch({
            type:'classSpace/showPublishers',
            payload: {},
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                      visible: true,
                      publishers: res.data.publishers&&res.data.publishers.split(",")
                   })
                }
            }
        })
    }
    studentStyle=(params)=>{
        this.props.dispatch({
            type:'classSpace/studentStyle',
            payload: params,
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                    classList: res.data
                })
                }
            }
        })
    }
    handleDelOk=()=>{
        let newArr = this.state.publishers.filter(item=>item)
        this.setState({
            publishers: newArr
        })
        debugger
        // return
        this.props.dispatch({
            type:'classSpace/setPublishers',
            payload: {
                "publishers": this.state.publishers,
            },
            callback:(res)=>{
                if(res.code===200){
                   this.setState({
                      visible: false
                   })
                }
            }
        })
    }

    handleDelCancel=()=>{
        this.setState({
            visible: false
        })
    }
    onChange=(checkedValues)=> {
        console.log('checked = ', checkedValues);
        this.setState({
            publishers: checkedValues
        })
    }
    // 数据统计
    dataStatistics = (id) => {
        this.props.dispatch(
            routerRedux.push("/style-statistics-list")
        )
    }
    render(){
        const options = [
            { label: '科任老师', value: '1' },
            { label: '副班主任', value: '2' },
            { label: '班主任', value: '3' },
            { label: '导师', value: '4' },
        ];
  
        const {gradeList, classesList} = this.props
        let option1 = gradeList&&gradeList.map(function(item){
            return  <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        let option2 = classesList&&classesList.map(function(item){
            return  <Option value={item.classId} key={item.classId}>{item.className}</Option>
        })
        
        return (
            <div className="content-main content-student">
                <div className="content-box">
                    <div className="content-top">
                        {/* <Breadcrumb>
                            <Breadcrumb.Item>学生风采</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Row className="option-wrap">
                            年级&nbsp;&nbsp;&nbsp;&nbsp;
                            <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    defaultValue={0}
                                    onChange={this.handleChange1}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value={0} key={0}>全部</Option>
                                {option1}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            班级
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择" disabled={this.state.disabled} value={this.state.classIdValue} style={{ width: 200 }} onChange={this.handleChange2}>
                                {option2}
                            </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.publishManage.bind(this)} >发送人管理</Button>&emsp;&emsp;
                            <Button type="primary" onClick={this.dataStatistics.bind(this)} >数据统计</Button>
                        </Row>
                    </div>
                    <Row className="list-wrap">
                        <ul>
                            {
                                this.state.classList.map((item)=>{
                                   return <li className="items" key={item.classId} onClick={this.toDetailPage.bind(this, item.classId)}>
                                            {/* <img src={require('../../assets/bg1.png')} /> */}
                                            <img src={getImgOfStyle(item&&item.imgs)} />
                                            {
                                                
                                            }
                                            <div>
                                                <h3>学生风采</h3>
                                                <h3>{item.gradeName + item.className}</h3>
                                                <p>用于学生风采相关图片的存储，相册不可删除，图片删除后，不可恢复</p>
                                            </div>
                                        </li>
                                })
                            } 
                        </ul>
                    </Row>
                   
                </div>
                <Modal className="publisher-manage"
                    title="发送人管理"
                    visible={this.state.visible}
                    onOk={this.handleDelOk}
                    onCancel={this.handleDelCancel}
                    footer={[
                        <Button key="back" onClick={this.handleDelCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleDelOk}>
                            确定
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>允许发送角色</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CheckboxGroup value={this.state.publishers} options={options} onChange={this.onChange.bind(this)} />
    
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
    gradeList: state.classSpace.gradeList,
    classesList: state.classSpace.classesList
  }
}

export default connect(mapStateToProps)(studentStyle);
