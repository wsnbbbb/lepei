import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Upload, Form, TreeSelect, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import {portUrl, getImg, getPortrait} from '../../utils/img';
import {formatDate, getRegStatus} from '../../utils/public';
import './style.less';
import { readSync } from 'fs';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

class TeacherPortraitReg extends Component{
    constructor(props) {
        super(props);
        this.state = {
          gradeId:'',
          classValue:'',
          personIds:[],
          disabled:false,
          list: [],
          treeData:[]
        };
    }
    componentDidMount=()=>{
       this.search()
       this.props.dispatch({
        type:'user/getDepartmentList',
        callback:(res)=>{
            if(res.code===200){
                this.setState({treeData:res.data})
            }
        }
       })
    }
    headPicList=(params)=>{
      this.props.dispatch({
        type: 'portrait/personHeadPicList',
        payload: params,
        callback: res=>{
            if(res.code===200){
              this.setState({
                list: res.data
              })
            }
        }
      })
    }

    reg =(id)=>{
      let _this = this
      this.props.dispatch({
        type: 'portrait/registerFaces',
        payload: {
          personIds: [id]
        },
        callback: res=>{
            if(res.code===200){
              message.success("注册成功！")
              _this.search()
            }
        }
      })
    }

    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        if(err){
          return
        }
        const params={
          "hasHead": values.hasHead||'',
          "faceStatus": values.faceStatus||'',
          "personType": 2,
          "kw": values.kw||'',
          "departmentId":values.departmentId?values.departmentId.substring(values.departmentId.lastIndexOf('-')+1, values.departmentId.length):'',
        }
        this.headPicList(params)
      })
    }
 
    batchReg=()=>{
      let arr = []
      this.state.list.map(item=>{
        if(item.isAllowRegister===1){
          arr.push(item.personId)
        }
      })
      this.props.dispatch({
        type: 'portrait/registerFaces',
        payload: {
          personIds: arr
        },
        callback: res=>{
            if(res.code===200){
              // message.success("注册成功！")
            }
        }
      })

      document.getElementById('ajaxLoading').style.display = 'none';
      let loading = document.getElementById('ajaxLoading1');
      loading.style.display = 'block';
      let timeSpan = document.getElementById('time');
      let time = 90
      timeSpan.innerHTML = time + " s"
      let timer = setInterval(() => {
        time--
        timeSpan.innerHTML = time + " s"
        if(time==0){
          clearInterval(timer)
          loading.style.display = 'none';
          this.search()
        }
      }, 1000);
    }
    
    renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })
 
    render(){
          const { list } = this.state;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
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
        return (
            <div className="content-main student-score portrait">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search
                          placeholder="请输入教师姓名"
                        />
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={7}>
                    <FormItem {...formItemLayout} label={'部门'}>
                      {getFieldDecorator("departmentId",{initialValue: undefined})(        
                        <TreeSelect
                            showSearch
                            // style={{ width: 300 }}
                            // value={this.state.departmentId}
                            dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                        >
                          {this.renderTreeNodes(this.state.treeData)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'头像状态'}>
                      {getFieldDecorator("hasHead",{initialValue:'-1'})(
                        <Select>
                          <Option value='-1' key='-1'>全部</Option>
                          <Option value='1' key='1'>有头像</Option>
                          <Option value='0' key='0'>无头像</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={'注册状态'}>
                      {getFieldDecorator("faceStatus",{initialValue:'-1'})(
                        <Select>
                          <Option value='-1' key='-1'>全部</Option>
                          <Option value='1' key='1'>已注册</Option>
                          <Option value='0' key='0'>未注册</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4} >
                      <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button disabled={list.length === 0} onClick={this.batchReg.bind(this)}>批量注册</Button>
                  </Col>
                  
                </Row>
              </Form>
              <Row>
                    <ul className="item-ul">
                      {
                        list&&list.map((item, index)=>{
                          return  <li key={index} style={{height: '320px'}}>
                                    <img src={getPortrait(item.pic, item.sex)} className='top-name'/>
                                    <p style={{textAlign: "center"}}>
                                      {
                                        item.sex==2?<svg t="1566459574067" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2935" width="24" height="24"><path d="M 774.987 760.414 l -216.512 0 l 0 -119.588 c 67.915 -9.92716 128.833 -41.7967 175.12 -88.08 c 56.3876 -56.3839 91.3457 -134.45 91.3457 -220.442 c 0 -85.9956 -34.9582 -164.055 -91.3457 -220.449 c -56.3912 -56.3912 -134.45 -91.3385 -220.446 -91.3385 c -85.992 0 -164.055 34.9473 -220.446 91.3385 C 236.308 168.249 201.361 246.311 201.361 332.303 c 0 85.992 34.9473 164.058 91.3421 220.442 c 46.2834 46.2834 107.208 78.1529 175.116 88.08 l 0 119.588 L 251.315 760.414 c -25.0238 0 -45.3297 20.3131 -45.3297 45.3369 c 0 25.0202 20.3059 45.3333 45.3297 45.3333 L 467.819 851.084 l 0 96.9162 c 0 25.0274 20.3131 45.3333 45.3297 45.3333 c 25.0238 0 45.3297 -20.3059 45.3297 -45.3333 l 0 -96.9162 l 216.512 0 c 25.0166 0 45.3333 -20.3131 45.3333 -45.3333 C 820.32 780.727 800.003 760.414 774.987 760.414 Z M 513.149 553.432 c -61.0188 0 -116.362 -24.7962 -156.346 -64.7794 c -39.9832 -39.9832 -64.7794 -95.3339 -64.7794 -156.349 c 0 -61.0188 24.7962 -116.362 64.7794 -156.346 c 39.9832 -39.9868 95.3303 -64.783 156.346 -64.783 s 116.362 24.7962 156.342 64.783 c 39.9832 39.9832 64.7902 95.3303 64.7902 156.346 c 0 61.0152 -24.8034 116.366 -64.7902 156.349 C 629.511 528.636 574.164 553.432 513.149 553.432 Z" p-id="2936" fill="#fe76a4"></path></svg>:<svg t="1566459217687" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2435" width="24" height="24"><path d="M614.725125 60.260157c3.850928-1.130713 6.087067-1.788189 6.939618-2.037451C620.64963 58.515318 617.983603 59.302843 614.725125 60.260157z" p-id="2436" fill="#0ec5f4"></path><path d="M871.234488 313.576067c-99.954336-340.066549 24.210993 82.35061-75.743343-257.705101-7.282805-24.763706-33.289212-38.957229-58.052918-31.678036-66.332774 19.496677-103.563226 30.438947-123.193565 36.208114 0.169788-0.050575 0.3179-0.093925 0.480463-0.1445-14.171848 4.168828-51.593763 15.168899-134.988386 39.679729-24.763706 7.279193-38.953616 33.281987-31.674423 58.049305 7.282805 24.760093 33.281987 38.953616 58.045693 31.678036 103.639088-30.464235 124.956467-36.728314 128.547294-37.786778-0.04335 0.010838 0.032513-0.010838 0.0578-0.01445 0.0867-0.025288 0.2312-0.068638 0.437113-0.126438-0.122825 0.032513-0.2601 0.07225-0.3757 0.104763 0.195075-0.0578 0.343188-0.10115 0.422663-0.126438 0.007225 0 0.007225 0 0.007225 0 0.079475-0.025288 0.0578-0.01445 0.0578-0.01445 1.365526-0.400988 5.360954-1.575051 15.479574-4.548141-96.468271 176.947605 4.631228-6.936005-115.043759 212.407931-105.398377-26.86257-220.265124 2.239752-304.552036 86.530276-58.168518 58.175743-94.224907 138.694814-94.224907 227.388979 0 88.712227 36.060001 169.231299 94.224907 227.396204 58.168518 58.175743 138.687589 94.224907 227.396204 94.224907 88.70139 0 169.220461-36.049164 227.388979-94.224907 58.175743-58.168518 94.224907-138.687589 94.224907-227.396204 0-88.694165-36.049164-169.213236-94.224907-227.388979-19.738714-19.738714-41.12473-36.399577-63.612559-50.047612 150.637748-276.10719-21.898991 38.642941 113.873308-210.269329 5.574092 18.940351 7.109405 24.19293 7.452593 25.341706 0.780301 2.644352 6.459155 21.989304 37.859028 128.832682 7.282805 24.760093 33.289212 38.953616 58.052918 31.678036C864.327383 364.338954 878.513681 338.33616 871.234488 313.576067zM686.639215 673.478868c0 62.944246-25.576519 120.03985-66.820461 161.283793s-98.339547 66.820461-161.276568 66.820461c-62.944246 0-120.032625-25.576519-161.272956-66.820461s-66.820461-98.339547-66.820461-161.283793c0-62.937021 25.580131-120.0254 66.820461-161.265731 41.243943-41.243943 98.32871-66.824074 161.272956-66.824074 62.937021 0 120.032625 25.580131 161.276568 66.824074C661.062697 553.453468 686.639215 610.541847 686.639215 673.478868z" p-id="2437" fill="#0ec5f4"></path><path d="M546.250138 356.882749c-0.755013 0.223975-1.300501 0.382925-1.640076 0.480463C544.985762 357.254837 545.56015 357.085049 546.250138 356.882749z" p-id="2438" fill="#0ec5f4"></path><path d="M547.113526 356.626261c-0.30345 0.090313-0.59245 0.1734-0.863388 0.252875C546.51385 356.806886 546.792013 356.723799 547.113526 356.626261z" p-id="2439" fill="#0ec5f4"></path><path d="M552.452805 355.058435c-0.010838 0-0.018063 0.003613-0.0289 0.007225C552.434742 355.06566 552.441967 355.062048 552.452805 355.058435z" p-id="2440" fill="#0ec5f4"></path><path d="M552.423905 355.06566c-2.286714 0.671925-4.035165 1.188513-5.310379 1.560601C548.731927 356.149411 550.736866 355.564185 552.423905 355.06566z" p-id="2441" fill="#0ec5f4"></path><path d="M544.534199 357.384887c-0.140888 0.039738-0.238425 0.07225-0.307063 0.090313C544.299386 357.453524 544.396924 357.424624 544.534199 357.384887z" p-id="2442" fill="#0ec5f4"></path><path d="M544.610061 357.363212c-0.0289 0.007225-0.050575 0.01445-0.075863 0.021675C544.563099 357.377662 544.581161 357.374049 544.610061 357.363212z" p-id="2443" fill="#0ec5f4"></path><path d="M561.339561 394.770677c-0.007225 0-0.01445 0.003613-0.025288 0.007225 0.01445-0.003613 0.032513-0.007225 0.054188-0.01445C561.357624 394.763452 561.350399 394.767064 561.339561 394.770677 561.317886 394.774289 561.346786 394.767064 561.339561 394.770677z" p-id="2444" fill="#0ec5f4"></path><path d="M544.227136 357.475199C544.111536 357.511324 544.104311 357.511324 544.227136 357.475199L544.227136 357.475199z" p-id="2445" fill="#0ec5f4"></path></svg> 
                                        }
                                      &nbsp;&nbsp;{item.personName}
                                    </p>
                                    <p style={{textAlign: "center"}}>
                                      <Button disabled={item.isAllowRegister==0} onClick={this.reg.bind(this, item.personId)}>注册</Button>
                                    </p>
                                    {
                                      <p>{getRegStatus(item.status)}<br/>{formatDate(item.createTime)}</p>
                                    }
                                  </li>
                        })
                      }
                     
                    </ul>
              </Row>
              </div>
                
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     commonData:state.user,
     gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(TeacherPortraitReg));
