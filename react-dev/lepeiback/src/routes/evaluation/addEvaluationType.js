import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Breadcrumb, TreeSelect, Tag, InputNumber, Input, Select , Form, Row, Col, Timeline, Upload, Icon,Menu, Dropdown,Modal,message,DatePicker,Tooltip } from 'antd';
import PageIndex from '../../components/page';
import SetHandlers from '../../components/setHandlers';
import { routerRedux, Link } from 'dva/router';
import {getApplyStatus,formatDate, getScoreType, getCycleType, getSexType, getGradeType, getQueryString} from '../../utils/public';
import './style.less';
import {getImg} from '../../utils/img';
import iconStar from '../../assets/icon-star.png';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { TreeNode } = TreeSelect;

class addEvaluationType extends Component{
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
          studentExaminerList: []
        };
    }
    componentDidMount=()=>{
      this.getAllSchoolUser()
      this.teacherExaminers()
      this.studentExaminers()
      this.props.dispatch({
        type: 'user/getCommonGradeList'
      })
      this.getClassesTree()
    }
    getClassEvaluationTypeDetail=(id)=>{
      this.props.dispatch({
        type:'evaluate/getClassEvaluationTypeDetail',
        payload: {
          id: id
        },
        callback:(res)=>{
          if(res.code===200){
            this.props.form.setFieldsValue({
              "sort": res.data.sort,
              "cycleType": res.data.cycleType,
              "name": res.data.name,
              "padExaminers": res.data.padExaminers,
              "studentExaminers": res.data.studentExaminers,
              "teacherExaminers": res.data.teacherExaminers,
              "totalScore": res.data.totalScore
            })
            res.data.secondTypes.map(i=>{
              i.iconArr= this.generateItem(i.totalScore)
            })
       
            let arr = []
            this.state.studentExaminerList.map(i=>{
              res.data.studentExaminers.map(e=>{
                if(e==i.personId){
                  arr.push({
                    personName: i.personName,
                    personId: i.personId
                  })
                }
              })
            })
            this.setState({
              marks: res.data.mark,
              secondTypes: res.data.secondTypes,
              totalScore: res.data.totalScore,
              selectedRowKeys: res.data.studentExaminers,
              studentExaminers: arr
            })
          }
        }
      })
    }

    getClassesTree=()=>{
      this.props.dispatch({
        type:'evaluate/getClassesTree',
        payload: {},
        callback:(res)=>{
          if(res.code===200){
           this.setState({
            classTree: res.data
           })
          }
        }
      })
    }

    getAllSchoolUser=()=>{
      this.props.dispatch({
        type:'evaluate/getAllSchoolUser',
        payload: {},
        callback:(res)=>{
          if(res.code===200){
           this.setState({
              padExaminerList: res.data
           })
          }
        }
      })
    }

    teacherExaminers=()=>{
      this.props.dispatch({
        type:'evaluate/teacherExaminers',
        payload: {
          personType: "2,3",
          status: 1
        },
        callback:(res)=>{
          if(res.code===200){
           this.setState({
            teacherExaminerList: res.data
           })
          }
        }
      })
    }

    studentExaminers=()=>{
      this.props.dispatch({
        type:'evaluate/studentExaminers',
        payload: {
          personType: "1",
          status: 1
        },
        callback:(res)=>{
          if(res.code===200){
           this.setState({
            studentExaminerList: res.data
           })

          if(getQueryString("id")&&getQueryString("id")){
            this.getClassEvaluationTypeDetail(getQueryString("id"))
          }
          }
        }
      })
    }

    generateItem=(number)=>{
      number = 100*number
      let arr = []
      for(let i=1; i<=number; i++){
        if(number%(2*i)==0){
          arr.push(i)
        }
      }
      let arr1 = arr.filter(i=>{
        return i<=10
      })
      return arr1
    }

    changeName=(index,e)=>{
      let newData = this.state.secondTypes
      newData[index].name =  e.target.value
      this.setState({
        secondTypes: newData
      })
    }

    changeScore=(index,e)=>{
      let val = e.target.value.toString()
      let newData = this.state.secondTypes
      newData[index].totalIcon =  undefined
      newData[index].totalScore =  val
      newData[index].iconArr =  this.generateItem(e.target.value)
      this.setState({
        secondTypes: newData
      })


      let totalScore = 0
      newData.map(i=>{
        if(typeof i.totalScore){
          if(!i.totalScore) return
          totalScore += parseInt(i.totalScore)
        }
      })
      this.setState({
        totalScore: totalScore
      })
      this.props.form.setFieldsValue({"totalScore": totalScore})
    }

    handleClose = removedTag => {
      const marks = this.state.marks.filter(mark => mark !== removedTag);
      console.log(marks);
      this.setState({ marks });
    };
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    };
  
    handleInputChange = e => {
      this.setState({ inputValue: e.target.value });
    };
  
    handleInputConfirm = () => {
      const { inputValue } = this.state;
      let { marks } = this.state;
      if (inputValue && marks.indexOf(inputValue) === -1) {
        marks = [...marks, inputValue];
      }
      console.log(marks);
      this.setState({
        marks,
        inputVisible: false,
        inputValue: '',
      });
    };
  
    saveInputRef = input => (this.input = input);


    changeTotalIcon=(index, value)=>{
      let newData = this.state.secondTypes
      newData[index].totalIcon =  value
      this.setState({
        secondTypes: newData
      })
    }

    changeDefaultScore=(index,e)=>{
      let val = e.target.value.toString()
      let newData = this.state.secondTypes
      newData[index].defaultScore =  val
      this.setState({
        secondTypes: newData
      })
    }

    // 返回
    back = () =>{
      window.history.go(-1)
    }

    save = () =>{
      this.props.form.validateFields(['sort', 'cycleType', 'name', 'totalScore', 'marks', 'padExaminers', 'teacherExaminers', "studentExaminers"], (err, values) => {
        if(err) return
        let secondTypes = this.state.secondTypes
        let flag = false
        secondTypes.map(i=>{
          if(!i.totalIcon||!i.defaultScore||!i.name||!i.totalScore){
            flag = true
          }
        })
        if(flag) return message.error("请填写完整")
        let studentExaminers = []
        this.state.studentExaminers.map(i=>{
          studentExaminers.push(i.personId)
        })
        let params = {
          groupId: getQueryString('groupId'),
          name: values.name||'',
          sort: values.sort||'',
          cycleType: values.cycleType||'',
          totalScore: this.state.totalScore,
          mark: this.state.marks||[],
          padExaminers: values.padExaminers||[],
          teacherExaminers: values.teacherExaminers||[],
          studentExaminers: studentExaminers||[],
          secondTypes: secondTypes
        }



        if(getQueryString("id")){
          params.id = getQueryString("id")
          this.props.dispatch({
            type:'evaluate/updateClassEvaluationType',
            payload: params,
            callback:(res)=>{
              if(res.code===200){
                message.success("修改成功")
                setTimeout(() => {
                  window.history.go(-1)
                }, 1000);
              }
            }
          })
        }else{
          this.props.dispatch({
            type:'evaluate/addClassEvaluationType',
            payload: params,
            callback:(res)=>{
              if(res.code===200){
                message.success("保存成功")
                setTimeout(() => {
                  window.history.go(-1)
                }, 1000);
              }
            }
          })
        }
      })
    }

    onPageChange=(current,size)=>{

      this.setState({page:current, prePage:size})
      this.props.form.validateFields(['kw', 'typeId'], (err, values) => {
        let arr = []
        let params={}
        if(values.typeId){
          arr = values.typeId.split("~")
          if(arr[0]=='0'){
            params={
              "kw": values.kw||'',
              "gradeType":arr[1],
              "page":current,
              "prePage":size,
            }
          }else if(arr[0]=='1'){
            params={
              "kw": values.kw||'',
              "gradeId":arr[1],
              "page":current,
              "prePage":size,
            }
          }else if(arr[0]=='2'){
            params={
              "kw": values.kw||'',
              "classId":arr[1],
              "page":current,
              "prePage":size,
            }
          }
        }else{
          params={
            "kw": values.kw||'',
            "page":current,
            "prePage":size,
          }
        }
        
        this.props.dispatch({
          type:'evaluate/getStudents',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
              this.setState({
                  tableData: res.data
              })
              // this.setState({
              //   allRows: this.state.allRows.concat(res.data.dataList)
              // })

              let newArr = this.state.allRows.concat(res.data.dataList)

              let arr1 = []
              newArr.map(j=>{
                let flag = true
                arr1.map(k=>{
                  if(k.personId==j.personId){
                    flag = false
                  }
                })
                if(flag){
                  arr1.push(j)
                }
              })

              this.setState({
                allRows: arr1
              })


              // let arr = this.state.allRows.filter(i=>{
              //   return this.state.selectedRowKeys.includes(i.personId)
              // })

              // this.setState({
              //   studentExaminers: arr
              // })

            }
          }
        })
      })
    }

    reset=()=>{
      this.props.form.resetFields(["kw", "typeId"])
    }

    search=()=>{
      this.props.form.validateFields(['kw', 'typeId'], (err, values) => {
        let arr = []
        let params={}
        if(values.typeId){
          arr = values.typeId.split("~")
          if(arr[0]=='0'){
            params={
              "kw": values.kw||'',
              "gradeType":arr[1],
              "page": 1,
              "prePage": this.state.prePage,
            }
          }else if(arr[0]=='1'){
            params={
              "kw": values.kw||'',
              "gradeId":arr[1],
              "page": 1,
              "prePage": this.state.prePage,
            }
          }else if(arr[0]=='2'){
            params={
              "kw": values.kw||'',
              "classId":arr[1],
              "page": 1,
              "prePage": this.state.prePage,
            }
          }
        }else{
          params={
            "kw": values.kw||'',
            "page": 1,
            "prePage": this.state.prePage,
          }
        }
        
        this.props.dispatch({
          type:'evaluate/getStudents',
          payload: params,
          callback:(res)=>{
            if(res.code===200){
             this.setState({
                tableData: res.data
             })

             this.setState({
               allRows: this.state.allRows.concat(res.data.dataList)
             })


             let newArr = this.state.allRows.concat(res.data.dataList)

             let arr1 = []
             newArr.map(j=>{
               let flag = true
               arr1.map(k=>{
                 if(k.personId==j.personId){
                   flag = false
                 }
               })
               if(flag){
                 arr1.push(j)
               }
             })

             this.setState({
               allRows: arr1
             })

            // let arr = this.state.allRows.filter(i=>{
            //   return this.state.selectedRowKeys.includes(i.personId)
            // })

            // this.setState({
            //   studentExaminers: arr
            // })


            }
          }
        })
      })
    }

    removePerson =(id)=> {
      console.log(id)

      let newArr = this.state.studentExaminers.filter(i=>{
        return i.personId!=id
      })

      this.setState({
        studentExaminers: newArr
      })
      
      let arr = this.state.selectedRows.filter(i=>{return i.personId!=id})
      this.setState({selectedRows: arr
        },function(){
        console.log( this.state.selectedRows)
      })
      let arr1 = this.state.selectedRowKeys.filter(i=>{return i!=id})
      this.setState({selectedRowKeys: arr1
        },function(){
        console.log( this.state.selectedRowKeys)
      })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
      let arr =this.state.studentExaminerList.filter(i=>{
        return selectedRowKeys.includes(i.personId)
      })
      this.setState({
        studentExaminers: arr
      })
      this.setState({ selectedRowKeys,selectedRows });
    }
    selectAll = (selected, selectedRows, changeRows) => {
      // this.setState({ selectedRows });
    }
    add=()=>{
      this.setState({
        visible: true,
        tableData: {}
      })
      this.props.form.resetFields(["typeId","kw"])
    }
    handleCancel=()=>{
      this.setState({
        visible: false
      })
    }

    addType=()=>{
      this.state.secondTypes.push({
        name: '',
        totalScore: '',
        totalIcon: undefined,
        iconArr: [],
        defaultScore: '',
        deducteScore: ''
      })
      this.setState({
        secondTypes: this.state.secondTypes
      })
    }
    back=()=>{
      window.history.go(-1)
    }

    remove = (index) => {
      let newArr = this.state.secondTypes.filter((i, idx)=>{
        return idx!=index
      })
      this.setState({
        secondTypes: newArr
      })
    };
    getList=(params)=>{
      this.props.dispatch({
        type:'evaluate/getClassEvaluationType',
        payload: params,
        callback:(res)=>{
          if(res.code===200){
           this.setState({

           })
          }
        }
      })
    }
      
    render(){
        const { getFieldDecorator } = this.props.form;
        const { visible, marks, inputVisible, inputValue, secondTypes, padExaminerList, teacherExaminerList, tableData , typeList, classTree,
          studentExaminers} = this.state;
        
        const formItemLayout = {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        };
        const formItemLayout1 = {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
          labelCol: { span: 2 },
          wrapperCol: { span: 13 },
        };
        let padChild=[]
        padExaminerList&&padExaminerList.length>0&&padExaminerList.map(item=>{
          padChild.push(<Option key={item.userId}>{item.userName}</Option>)
        })

        let teacherChild = []
        teacherExaminerList&&teacherExaminerList.length>0&&teacherExaminerList.map(item=>{
          teacherChild.push(<Option key={item.personId}>{item.personName}</Option>)
        })

        const {commonData, gradeList} = this.props;
        let classOptions=[];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
        })
        let options=[]
        gradeList&&gradeList.length>0&&gradeList.map(item=>{
          return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
        })
        let options1=[]
        typeList&&typeList.length>0&&typeList.map(item=>{
          return options1.push(<Option key={item.typeId} value={item.typeId}>{item.typeName}</Option>)
        })

        const tree = classTree.map(function(item){
          return   <TreeNode title={item.gradeTypeName} value={'0~'+item.gradeType} key={'gradeType-'+item.gradeType}>
                      {
                          item.grades.map(function(i){
                              return <TreeNode title={i.gradeName} value={'1~'+i.gradeId} key={'gradeId-'+i.gradeId} >
                                {
                                  i.classData.map(k=>{
                                    return <TreeNode title={k.className} value={'2~'+k.classId} key={'classId-'+k.classId} ></TreeNode>
                                  })
                                }
                              </TreeNode>
                          })
                      }
                   </TreeNode>
       })

       const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange(selectedRowKeys, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectAll(selected, selectedRows, changeRows)
        },
        selectedRowKeys: this.state.selectedRowKeys
      };
        const columns = [{
          title: '姓名',
          dataIndex: 'personName',
          width:60,
        } ,{
          title: '性别',
          dataIndex: 'sex',
          width:60,
          render:(text,record)=>(
            <span>{getSexType(record.sex)}</span>
          )
        },{
          title: '年级',
          dataIndex: 'gradeName',
          width:100,
        },{
          title: '班级',
          dataIndex: 'className',
          width:100,
        }, {
          title: '学业阶段',
          dataIndex: 'gradeType',
          width:100,
          render:(record) => (
            <span>{getGradeType(record)}</span>
          )
        }, 
        ];

        return (
            <div className="content-main">
                <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>数字德育</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/class-evaluation-group-list">年级组管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item ><a onClick={this.back.bind(this)}>考评项管理</a></Breadcrumb.Item>
                    <Breadcrumb.Item>{getQueryString("id")?"编辑":"添加"}考评项</Breadcrumb.Item>
                </Breadcrumb>
              <Form>
                  <Row gutter={24}>
                      <Col span={5}>
                        <Form.Item {...formItemLayout1} label="排序">
                          {getFieldDecorator('sort', {
                            rules: [
                              {
                                required: true,
                                message: '请输入',
                              },
                            ],
                          })(<InputNumber min={1} max={1000} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={5}>
                        <Form.Item {...formItemLayout1} label="评分周期">
                          {getFieldDecorator('cycleType', {
                            rules: [{ required: true, message: '请选择' }],
                          })(
                            <Select disabled={getQueryString("id")?"disabled":false} placeholder="请选择">
                              <Option value="1">日</Option>
                              <Option value="2">周</Option>
                              <Option value="3">月</Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>

                  <Row gutter={24}>
                      <Col span={5}>
                          <Form.Item {...formItemLayout1} label="考评项">
                            {getFieldDecorator('name', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入',
                                },
                              ],
                            })(<Input placeholder="请输入" />)}
                          </Form.Item>
                      </Col>
                      <Col span={5}>
                          <Form.Item {...formItemLayout1} label="分值">
                            {getFieldDecorator('totalScore', {
                              rules: [
                                {
                                  required: false,
                                  message: '',
                                },
                              ],
                            })(<Input placeholder="" disabled />)}
                          </Form.Item>
                      </Col>
                      <Col span={4} offset={10}>
                        {!getQueryString("id")?<Button type="link" onClick={this.addType.bind(this)}>添加二级考评项</Button>:null}
                      </Col>
                </Row>
                {
                    secondTypes.map((i, index)=>{
                      return <Row gutter={24} key={index}>
                                <Col span={5}>
                                    <Form.Item {...formItemLayout1} label="二级考评项">
                                      <Input maxLength={30} placeholder="请输入" value={i.name} onChange={this.changeName.bind(this, index)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item {...formItemLayout1} label="分值">
                                      <Input placeholder="请输入" maxLength={5} disabled={getQueryString("id")?"disabled":false} value={i.totalScore} onChange={this.changeScore.bind(this, index)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item {...formItemLayout1} label="图标个数" >
                                      <Select placeholder="请选择" disabled={getQueryString("id")?"disabled":false} value={i.totalIcon} onChange={this.changeTotalIcon.bind(this, index)}>
                                        {
                                          i.iconArr&&i.iconArr.map((i, index)=>{
                                            return <Option key={index} value={i}>{i}个</Option>
                                          })
                                        }
                                      </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item {...formItemLayout1} label="默认分" >
                                      <Input maxLength={5} placeholder="请输入"  disabled={getQueryString("id")?"disabled":false} value={i.defaultScore} onChange={this.changeDefaultScore.bind(this, index)}/>
                                    </Form.Item>
                                </Col>
                                {!getQueryString("id")? <Col span={4}>
                                    <Button type="link" onClick={this.remove.bind(this, index)}>删除</Button>
                                </Col>:null}
                               
                          </Row>
                    })
                  }
                   <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formItemLayout} label="快速备注标签">
                          {getFieldDecorator('marks', {
                            rules: [{ required: false, message: '请选择' }],
                          })(
                            <div>
                                {marks.map((mark, index) => {
                                          const isLongTag = mark.length > 20;
                                          const markElem = (
                                            <Tag key={mark} closable onClose={() => this.handleClose(mark)}>
                                              {isLongTag ? `${mark.slice(0, 10)}...` : mark}
                                            </Tag>
                                          );
                                          return isLongTag ? (
                                            <Tooltip title={mark} key={mark}>
                                              {markElem}
                                            </Tooltip>
                                          ) : (
                                            markElem
                                          );
                                        })}
                                        {inputVisible && (
                                          <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            maxLength={10}
                                            style={{ width: 78 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                          />
                                        )}
                                        {!inputVisible && (
                                          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                            <Icon type="plus" /> 添加
                                          </Tag>
                                        )}
                            </div>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
                  <h4 className='title'>考评人</h4>
                  <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formItemLayout2} label="pad">
                          {getFieldDecorator('padExaminers', {
                            rules: [{ required: false, message: '请选择' }],
                          })(
                            <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="请选择"
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                            {padChild}
                          </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formItemLayout2} label="app(教师、员工)">
                          {getFieldDecorator('teacherExaminers', {
                            rules: [{ required: false, message: '请选择' }],
                          })(
                            <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="请选择"
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                            {teacherChild}
                          </Select>,
                          )}
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formItemLayout2} label="app(学生)">
                          <Button type="primary" onClick={this.add.bind(this)}>添加</Button>
                            <div>
                              {
                                studentExaminers.map(i=>{
                                  return <Tag key={i.personId} closable onClose={this.removePerson.bind(this, i.personId)}>{i.personName}</Tag>
                                })
                              }
                             </div>
                        </Form.Item>
                      </Col>
                  </Row>
              </Form>   

              <div className="btn">
                <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.save.bind(this)}>保存</Button>
              </div>

              <Modal
                title=""
                visible={visible}
                onOk={this.handleCancel}
                width={900}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                  <Row gutter={24}>
                    <Col span={6}>
                      <FormItem label=''>
                        {getFieldDecorator('kw')(
                          <Search
                            placeholder="请输入学生姓名"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem {...formItemLayout} label={''}>
                        {getFieldDecorator("typeId")(
                          <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择"
                          >
                            {tree}
                          </TreeSelect>
                        )}
                      </FormItem>
                    </Col>
                   
                    <Col span={6} >
                        <FormItem {...formItemLayout} label={''}>
                          <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button onClick={this.reset.bind(this)}>重置</Button>
                        </FormItem>
                    </Col>
                  </Row>
                </Form>              
                <Table rowKey={record=>record.personId} columns={columns} rowSelection={rowSelection} dataSource={tableData.dataList} pagination={false}/>
                <PageIndex getPage={this.onPageChange.bind(this)} total={tableData.totalCount} totalPage={tableData.totalPage} currentPage={tableData.currentPage}/>
              </Modal>   
         </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    gradeList: state.user.commonGradeData
  }
}
export default connect(mapStateToProps)(Form.create()(addEvaluationType));
