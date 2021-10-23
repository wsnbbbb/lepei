import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Table, Button, Input, Select, Form, Row, Col, Modal, Transfer, Alert, message, Tooltip, Divider } from 'antd';
import PageIndex from '../../components/page';
import { formatDate, getQueryString } from '../../utils/public';
import { portUrl, getUpload } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class AssociationClassConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      visible: false,
      visibleDelete: false,
      defaultPageSize: 20,
      deleteId: null,
      visibleSet: false,
      visibleImport: false,
      visibleImport1: false,
      file: null,
      courseListId: null,
      mockData: [],
      targetKeys: [],
      exportUrl: null,
      importData: {},
      studentsData: {},
      sheetData: [],
      studentFile: null
    };
  }
  componentDidMount = () => {
    const params = {
      "page": getQueryString('page')||1,
      "prePage": getQueryString('prePage')||20,
    }
    this.setState({
      page: getQueryString('page')||1,
      prePage: getQueryString('prePage')||20,
      defaultPageSize: Number(getQueryString('prePage'))||20,
    })
    this.associationClassList(params)
    this.getAllSemesters()
    this.getAllClassRooms()
  }

  getAllSemesters = () => {
    this.props.dispatch({
      type: 'association/getAllSemesters',
      payload: {}
    })
  }
  associationClassList = (params) => {
    this.props.dispatch({
      type: 'association/associationCourseList',
      payload: params,
      callback: (res) => {
        this.setState({
          classCourseList: res.data
        })
      }
    })
  }
  getAllClassRooms = () => {
    this.props.dispatch({
      type: 'association/getAllClassRooms',
      payload: {}
    })
  }
  getPreStudent = (params) => {
    this.props.dispatch({
      type: 'association/getPreStudent',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          let mockDataArr = []
          res.data.student && res.data.student.map(item => {
            mockDataArr.push({
              key: item.personId,
              title: item.personName
            })
          })
          this.setState({
            visibleSet: true,
            mockData: mockDataArr,
            targetKeys: res.data.preSetStudent
          })

        }
      }
    })
  }
  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        "semesterId": values.semesterId || '',
        "courseId": values.courseId || '',
        "type": values.type || '',
        "weekType": values.weekType || '',
        "roomId": values.roomId || '',
        "week": values.week || '',
      }
      this.associationClassList(params)
    })
  }
  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "kw": values.kw || '',
        "semesterId": values.semesterId || '',
        "courseId": values.courseId || '',
        "type": values.type || '',
        "weekType": values.weekType || '',
        "roomId": values.roomId || '',
        "week": values.week || '',
      }
      this.associationClassList(params)
    })
  }
  edit = (id) => {
    this.props.dispatch(routerRedux.push("/edit-association-class-config/" + id + '?page='+this.state.page + '&prePage='+this.state.prePage))
  }
  delete = (id) => {
    this.setState({
      visibleDelete: true,
      deleteId: id
    })
  }
  setStudent = (id) => {
    const params = {
      courseListId: id
    }
    this.setState({
      courseListId: id,
      mockData: [],
      targetKeys: []
    })
    this.getPreStudent(params)

  }
  importConfig = (id) => {
    this.setState({
      visibleImport: true,
    })
  }

  handleAdd = () => {
    this.props.dispatch(routerRedux.push("/new-association-class-config"))
  }
  handleCancel = () => {
    this.setState({
      visibleNew: false
    })
  }
  handleSetCancel = () => {
    this.setState({
      visibleSet: false
    })
  }
  handleImportCancel = () => {
    document.getElementById("upload-file").value = ""
    this.setState({
      visibleImport: false,
      file: null,
      importData: {}
    })
  }

  handleDeleteOk = () => {
    let _this = this
    this.props.dispatch({
      type: 'association/deleteCourse',
      payload: {
        "id": this.state.deleteId
      },
      callback: res => {
        if (res.code === 200) {
          this.setState({
            visibleDelete: false
          })
          message.success("删除成功！")
          _this.search()

        }
      }
    })

  }

  handleSetOk = () => {
    let _this = this
    let params = {
      courseListId: this.state.courseListId,
      studentId: this.state.targetKeys
    }
    this.props.dispatch({
      type: 'association/preSetStudent',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          this.setState({
            visibleSet: false,
            targetKeys: [],
            mockData: []
          })
          message.success("设置成功！")
          _this.search()
        }
      }
    })

  }
  handleDeleteCancel = () => {
    this.setState({
      visibleDelete: false
    })
  }
  generateType = (type) => {
    if (type == 1) {
      return "全部"
    } else if (type == 2) {
      return "社团课"
    } else if (type == 3) {
      return "延时课"
    }
  }
  generateWeekType = (type) => {
    if (type == '') {
      return "全部"
    } else if (type == 1) {
      return "不限"
    } else if (type == 2) {
      return "单周"
    } else if (type == 3) {
      return "双周"
    }
  }
  generateWeek = (week) => {
    if (week == 1) {
      return "周一"
    } else if (week == 2) {
      return "周二"
    } else if (week == 3) {
      return "周三"
    } else if (week == 4) {
      return "周四"
    } else if (week == 5) {
      return "周五"
    } else if (week == 6) {
      return "周六"
    } else if (week == 7) {
      return "周日"
    }
  }
  onChange1 = (e) => {
    const file = e.target.files[0]
    this.setState({
      file: file
    })
  }

  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1
  }

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };
  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  // 课程配置导入确定
  handleImportOk = () => {
    if (!this.state.file) {
      message.warning('请先选择文件，再导入！');
      return;
    }
    const params = new FormData()
    params.append('excel', this.state.file)
    this.props.dispatch({
      type: 'association/courseImport',
      payload: params,
      callback: (res) => {
        this.setState({ file: '' })
        this.props.form.resetFields(["excel"])
        if (res.data.hasError == false) {
          message.success('导入成功！');
          this.search()
          this.setState({
            visibleImport: false
          })
        } else {
          message.warn(res.msg);
          if (res.data.header && res.data.sheetData) {
            let headerArr = []
            let sheetDataArr = []
            for (let index in res.data.header) {
              headerArr.push(res.data.header[index])
            }
            headerArr.push("提示")
            res.data.headerArr = headerArr
            res.data.sheetData.map(item => {
              let sheetDataArrItem = []
              for (let index in item) {
                sheetDataArrItem.push(item[index])
              }
              sheetDataArr.push(sheetDataArrItem)
            })

            res.data.sheetDataArr = sheetDataArr
            this.setState({
              importData: res.data
            })
          }
        }
      }
    })

  };

  // 预设学生导入
  importStudent = (id) => {
    this.setState({
      courseListId: id,
      visibleImport1: true,
    })
  }
  // 文件上传
  changeFile = (e) => {
    const file = e.target.files[0]
    this.setState({
      studentFile: file
    })
  }

  // 预设学生导入确定
  importStudentOk = () => {
    if(Object.keys(this.state.studentsData).length != 0){
      return message.error('请重新选择正确的导入文件');
    }
    if (!this.state.studentFile) {
      message.warning('请先选择文件，再导入！');
      return;
    }
    let params = new FormData()
    params.append('excel', this.state.studentFile)
    params.append('courseListId', this.state.courseListId)
    this.props.dispatch({
      type: 'association/importStudent',
      payload: params,
      callback: (res) => {
        this.setState({ studentFile: '' })
        if (!res.data.hasError) {
          message.success('预设学生导入成功！');
          document.getElementById("upload-studentFile").value = ""
          this.search()
          this.setState({
            visibleImport1: false
          })
        } else {
          message.warn(res.msg);
          if (res.data.header && res.data.sheetData) {
            let headerArr = []
            let sheetDataArr = []
            for (let index in res.data.header) {
              headerArr.push(res.data.header[index])
            }
            headerArr.push("提示")
            res.data.headerArr = headerArr
            res.data.sheetData.map(item => {
              if(!item.error){
               item.err = "无"
              }
            })
            this.setState({
              studentsData: res.data,
              sheetData:res.data.sheetData,
            })

            
          }
        }
      }
    })

  };

  // 预设学生导入取消
  importStudentCancel = () => {
    document.getElementById("upload-studentFile").value = ""
    this.setState({
      visibleImport1: false,
      studentFile: null,
      studentsData: {},
      sheetData:[]
    })
  }
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let kw = values.kw || '';
      let semesterId = values.semesterId || '';
      let type = values.type || '';
      let weekType = values.weekType || '';
      let roomId = values.roomId || '';
      let week = values.week || '';
      let url = portUrl("/manager/course/course-list-export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token +
        "&kw=" + kw + "&semesterId=" + semesterId + "&type=" + type
        + "&weekType=" + weekType + "&roomId=" + roomId + "&week=" + week)
      this.setState({ exportUrl: url })
    })
  }

  render() {
    const { sheetData } = this.state;
    const columns = [{
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName'
    }, {
      title: '授课老师',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (record) => {
        return (
          <span>
            <Tooltip placement="top" title={record}>
              <span className="des-content">{record}</span>
            </Tooltip>
          </span>
        )
      }
    }, {
      title: '上课年级',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (record) => {
        return (
          <span>
            <Tooltip placement="top" title={record}>
              <span className="des-content">{record}</span>
            </Tooltip>
          </span>
        )
      }
    }, {
      title: '上课时间',
      dataIndex: 'courseTime',
      key: 'courseTime',
      render: (courseTime) => {
        return (
          <span>
            {this.generateWeek(courseTime[0])}{courseTime[1]}
          </span>
        )
      }
    }, {
      title: '上课地点',
      dataIndex: 'classroomName',
      key: 'classroomName'
    }, {
      title: '单双周',
      dataIndex: 'weekType',
      key: 'weekType',
      width: 100,
      render: (weekType) => {
        return (
          <span>{this.generateWeekType(weekType)}</span>
        )
      }
    }, {
      title: '报名起止时间',
      dataIndex: 'startEndTime',
      key: 'startEndTime',
      render: (startEndTime) => {
        return (
          <span>
            {formatDate(startEndTime[0])} ~
            {formatDate(startEndTime[1])}
          </span>
        )
      }
    }, {
      title: '报名/限额',
      dataIndex: 'personNum',
      key: 'personNum'
    }, {
      title: '操作',
      dataIndex: "id",
      render: (id) => (
        <span className="make-box">
          <a href="javascript:;" onClick={this.edit.bind(this, id)}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.delete.bind(this, id)}>删除</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.setStudent.bind(this, id)}>预设学生</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.importStudent.bind(this, id)}>导入</a>
        </span>
      )
    }];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    };
    const { semestersList, classRoomList } = this.props;

    const option = semestersList && semestersList.map((item) => {
      return <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
    })
    const option1 = classRoomList && classRoomList.map((item) => {
      return <Option key={item.id} value={item.id}>{item.name}</Option>
    })


    if (!this.state.classCourseList) {
      return null;
    }
    this.state.classCourseList.dataList && this.state.classCourseList.dataList.map(item => {
      item.startEndTime = [item.startTime, item.endTime]
      item.courseTime = [item.week, item.sectionName]
    })

    let tbodys=[]
    if(sheetData){
      sheetData.map((item,idx)=>{
        let tds=[]
        for(var p in item){
            tds.push(<td key={p} style={{color:item.error?"#f00":"#666"}}>{item[p]?item[p]:"无"}</td>)
        }
        return tbodys.push(<tr key={idx}>{tds}</tr>)
      })
    }
    return (
      <div className="content-main association association-config">
        <Form className="ant-advanced-search-form content-form">
          <Row gutter={24}>
            <Col span={6}>
              <FormItem label=''>
                {getFieldDecorator('kw')(
                  <Search placeholder="课程名称/上课老师" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'选择学期'}>
                {getFieldDecorator("semesterId", { initialValue: '' })(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    {option}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'课程类型'}>
                {getFieldDecorator("type", { initialValue: '' })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="1">社团课</Option>
                    <Option value="2">延时课</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'上课地点'}>
                {getFieldDecorator("roomId", { initialValue: '' })(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    {option1}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'上课星期'}>
                {getFieldDecorator("week", { initialValue: '' })(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value="1">周一</Option>
                    <Option value="2">周二</Option>
                    <Option value="3">周三</Option>
                    <Option value="4">周四</Option>
                    <Option value="5">周五</Option>
                    <Option value="6">周六</Option>
                    <Option value="7">周日</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'单双周'}>
                {getFieldDecorator("weekType", { initialValue: "" })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="1">不限</Option>
                    <Option value="2">单周</Option>
                    <Option value="3">双周</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={2} offset={0}>
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
            </Col>
            <Col span={2} offset={0}>
              <Button type='primary' onClick={this.handleAdd.bind(this)}>新增</Button>
            </Col>
            <Col span={2} offset={0}>
              <Button type='primary' onClick={this.importConfig.bind(this)}>导入</Button>
            </Col>
            <Col span={2} offset={0}>
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>
            </Col>

          </Row>
        </Form>
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.classCourseList.dataList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.classCourseList.totalCount} totalPage={this.state.classCourseList.totalPage} defaultPageSize={this.state.defaultPageSize} currentPage={this.state.classCourseList.currentPage} />

        <Modal
          title="删除"
          visible={this.state.visibleDelete}
          onOk={this.handleDeleteOk.bind(this)}
          onCancel={this.handleDeleteCancel.bind(this)}
        >
          <label>是否删除该条信息？</label>
        </Modal>

        <Modal
          className="pre-set-config-modal"
          title="预设学生"
          visible={this.state.visibleSet}
          onOk={this.handleSetOk.bind(this)}
          onCancel={this.handleSetCancel.bind(this)}
        >
          <Row className="row-pb10">
            <Col span={12}>学生列表</Col>
            <Col span={12}>预设学生</Col>
          </Row>
          <Transfer
            dataSource={this.state.mockData}
            showSearch
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            onSearch={this.handleSearch}
            render={item => item.title}
          />
        </Modal>

        <Modal
          className="import-config-modal"
          title="导入课程配置"
          width={800}
          visible={this.state.visibleImport}
          onOk={this.handleImportOk.bind(this)}
          onCancel={this.handleImportCancel.bind(this)}
        >
          <label>课程配置：</label>
          <form style={{ display: "inline-block" }}>
            <input type="file" id="upload-file" name="file" onChange={this.onChange1.bind(this)} />
          </form>
          <a href={getUpload("课程配置模板.xlsx")}>下载模板</a>
          <p className="tips">支持扩展名：.xls,.xlsx, excel表中红色字段为必填。</p>
          <div className="table-box">
            {
              <table border="1" className="import-table">
                <thead>
                  <tr>
                    {
                      (this.state.importData.hasError) && this.state.importData.headerArr.map(item => {
                        return <th>{item}</th>
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    (this.state.importData.hasError) && this.state.importData.sheetDataArr.map(item => {
                      return <tr >
                        {item.map(i => {
                          return <td>{i}</td>
                        })}
                      </tr>
                    })
                  }
                </tbody>
              </table>
            }
          </div>
        </Modal>

        <Modal
          className="import-config-modal"
          title="导入预设学生"
          width={800}
          visible={this.state.visibleImport1}
          onOk={this.importStudentOk.bind(this)}
          onCancel={this.importStudentCancel.bind(this)}
        >
          <label>预设学生：</label>
          <form style={{ display: "inline-block" }}>
            <input type="file" id="upload-studentFile" name="file" onChange={this.changeFile.bind(this)} />
          </form>
          <a href={getUpload("选修课学生导入模板.xls")}>下载模板</a>
          <p className="tips">支持扩展名：.xls,.xlsx, excel表中红色字段为必填。</p>
          <div className="table-box">
              <table border="1" className="import-table">
                <thead>
                  <tr>
                    {
                      (this.state.studentsData.error == false) && this.state.studentsData.headerArr.map(item => {
                        return <th>{item}</th>
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {tbodys}  
                </tbody>
              </table>
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
    //  classCourseList: state.association,
    semestersList: state.association.semestersList,
    classRoomList: state.association.classRoomList,
  }
}
export default connect(mapStateToProps)(Form.create()(AssociationClassConfig));
