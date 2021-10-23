import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Modal, message } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { getGradeType, getSexType, getResidence, formatIdcard } from '../../utils/public';
import { portUrl } from '../../utils/img'
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class StudentMange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personList:{},
      page: 1,
      prePage: 20,
      visible: false,
      gradeId: '',
      classValue: '',
      personIds: [],
      disabled: true,
      selectedRowKeys: [],
      exportUrl: ''
    };
  }
  componentDidMount = () => {
    // console.log(this.props.match.params.id)//获取参数
    const params = {
      "page": 1, "prePage": 20, "personType": 1,
    }
    this.personLists(params)
    this.props.dispatch({
      type: 'user/getCommonGradeList'
    })
  }
  // 获取列表
  personLists = (params) => {
    let that = this;
    that.props.dispatch({
      type: 'person/getPersonList',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          that.setState({
            personList:res.data
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
        "personType": 1,
        "kw": values.kw || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-') + 1, values.gradeId.length) : '',
        "classId": this.state.classValue ? this.state.classValue.substring(this.state.classValue.lastIndexOf('-') + 1, this.state.classValue.length) : '',
        "inResidence": values.inResidence || 0
      }

      this.personLists(params)
    })
  }
  // 删除
  showConfirm = (id) => {
    let me = this;
    confirm({
      title: '提示',
      content: '确定要删除这条学生信息吗？',
      onOk() {
        me.props.dispatch({
          type: 'person/deletePerson',
          payload: { "personId": id },
          callback: (res) => {
            if (res.code === 200) {
              message.success('删除成功！', 3)
              me.setState({ selectedRowKeys: [] })
              me.props.form.validateFields((err, values) => {
                const params = {
                  "page": me.state.page,
                  "prePage": me.state.prePage,
                  "personType": 1,
                  "kw": values.kw || '',
                  "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-') + 1, values.gradeId.length) : '',
                  "classId": me.state.classValue ? me.state.classValue.substring(me.state.classValue.lastIndexOf('-') + 1, me.state.classValue.length) : '',
                  "inResidence": values.inResidence || 0
                }
                me.personLists(params)
              })
            }
          }
        })
      },
      onCancel() { },
    });
  }
  // 分页
  onPageChange = (current, size) => {
    this.setState({ selectedRowKeys: [] })
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "personType": 1,
        "kw": values.kw || '',
        "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-') + 1, values.gradeId.length) : '',
        "classId": this.state.classValue ? this.state.classValue.substring(this.state.classValue.lastIndexOf('-') + 1, this.state.classValue.length) : '',
        "inResidence": values.inResidence || 0
      }
      this.personLists(params)
    })
  }
  // 添加
  goToDetail = (type, id) => {
    if (Number(type) === 1) {
      this.props.dispatch(routerRedux.push("/student-detail?type=" + type))
    } else {
      this.props.dispatch(routerRedux.push("/student-detail?type=" + type + "&personId=" + id))
    }
  }
  // 重置
  reset = () => {
    this.props.form.resetFields(["kw", "gradeId", "inResidence"])
    this.setState({
      classValue: '',
      disabled:true
   })
  }
  // 导入
  upload = () => {
    this.props.dispatch(routerRedux.push("/upload-student"));
  }
  // 选择
  selectChange = (selectedRowKeys, selectedRows) => {
    let ids = [];
    selectedRows && selectedRows.length > 0 && selectedRows.map(item => {
      return ids.push(item.personId)
    })
    this.setState({ personIds: ids, selectedRowKeys })
  }
  // 批量删除
  delAll = () => {
    if (this.state.personIds.length <= 0) {
      return message.error("请先选择人员", 2)
    }
    this.props.dispatch({
      type: 'person/delAllPerson',
      payload: { "personId": this.state.personIds },
      callback: (res) => {
        if (res.code === 200) {
          message.success('删除成功', 2)
          this.setState({ selectedRowKeys: [] })
          this.props.form.validateFields((err, values) => {
            const params = {
              "page": this.state.page,
              "prePage": this.state.prePage,
              "personType": 1,
              "kw": values.kw || '',
              "gradeId": values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-') + 1, values.gradeId.length) : '',
              "classId": this.state.classValue ? this.state.classValue.substring(this.state.classValue.lastIndexOf('-') + 1, this.state.classValue.length) : '',
              "inResidence": values.inResidence || 0
            }
            this.personLists(params)
          })
        }
      }
    })
  }
  // 年级选择
  gradeChange = (val) => {
    if (val) {
      this.setState({ disabled: false })
      const id = val.substring(val.lastIndexOf('-') + 1, val.length)
      this.props.dispatch({
        type: 'user/getClassName',
        payload: { "gradeId": id || "" },
        callback: (res) => {
          if (res.code === 200) {
            this.setState({ classValue: '' })
          }
        }
      })
    } else {
      this.setState({ classValue: '', disabled: true })
    }
  }
  classChange = (val) => {
    this.setState({ classValue: val })
  }
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let personType = 1;
      let kw = values.kw || '';
      let gradeId = values.gradeId.substring(values.gradeId.lastIndexOf('-') + 1, values.gradeId.length) || '';
      let classId = this.state.classValue.substring(this.state.classValue.lastIndexOf('-') + 1, this.state.classValue.length) || '';
      let inResidence = values.inResidence || 0;
      let url = portUrl("/manager/persons/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&personType=" + personType +
        "&kw=" + kw + "&gradeId=" + gradeId + "&classId=" + classId + "&inResidence=" + inResidence)
      this.setState({ exportUrl: url })

    })
  }
  render() {
    const columns = [{
      title: '人员ID',
      dataIndex: 'personId',
    },{
      title: '姓名',
      dataIndex: 'personName',
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: (record) => {
        return (<span>{getSexType(record)}</span>)
      }
    }, {
      title: '读书形式',
      dataIndex: 'inResidence',
      render: (record) => {
        return (<span>{getResidence(record)}</span>)
      }
    }, {
      title: '身份证',
      dataIndex: 'idCardNo',
      render: (record) => {
        return (<span>{formatIdcard(record)}</span>)
      }
    }, {
      title: '其他证件',
      dataIndex: 'usin',
    }, {
      title: '学业阶段',
      dataIndex: 'gradeType',
      render: (record) => {
        return (<span>{getGradeType(record)}</span>)
      }
    }, {
      title: '年级',
      dataIndex: 'gradeName',
    }, {
      title: '班级',
      dataIndex: 'className',
    }, {
      title: '操作',
      dataIndex: '',
      width: 120,
      fixed: 'right',
      render: (text, record) => (
        <span className="make-box">
          <a href="javascript:;" className="check-btn" onClick={this.goToDetail.bind(this, 2, record.personId)}>查看</a>
          {record.isAllowDel == 0 ? null :
            <a href="javascript:;" onClick={this.showConfirm.bind(this, record.personId)}>删除</a>}
        </span>
      )
    }];
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.selectChange,
      // onSelectAll:this.onSelectAll,
      getCheckboxProps: record => ({
        disabled: record.isAllowDel == 0,
        icCustomerNo: record.icCustomerNo
      }),
    };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };
    const formItemLayout1 = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    };

    const { personList } = this.state;
    if (!personList) {
      return null
    }
    let datas = [];
    personList && personList.dataList && personList.dataList.map((item, idx) => {
      datas.push({ key: item.personId, ...item })
    })
    const {  commonData, gradeList } = this.props;
    console.log({ datas })
    let classOptions = [];
    commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
      return classOptions.push(<Option key={item.classId} value={item.className + '-' + item.classId}>{item.className}</Option>)
    })
    let options = []

    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option key={item.gradeId} value={item.gradeName + '-' + item.gradeId}>{item.gradeName}</Option>)
    })
    return (
      <div className="content-main student-manage">
        <Form className="ant-advanced-search-form content-form">
          <Row gutter={24}>
            <Col span={5}>
              <FormItem label=''>
                {getFieldDecorator('kw')(
                  <Search
                    placeholder="请输入姓名或证件号"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={'年级名称'}>
                {getFieldDecorator("gradeId", { initialValue: '' })(
                  <Select showSearch onChange={this.gradeChange.bind(this)}>
                    <Option value='' key=''>全部</Option>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={'班级'}>
                <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                  <Option value='' key=''>全部</Option>
                  {classOptions}
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout1} label={'读书形式'}>
                {getFieldDecorator("inResidence", { initialValue: '' })(
                  <Select showSearch >
                    <Option value='' >全部</Option>
                    <Option value={1} >住读</Option>
                    <Option value={2} >走读</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
              <Button onClick={this.reset.bind(this)}>重置</Button>
            </Col>
          </Row>
          <Row style={{marginBottom:'20px'}}>
            <Col>
              <Button type='primary' onClick={this.upload.bind(this)}>导入</Button>&emsp;
              <Button type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&emsp;
              <Button type='primary' onClick={this.delAll.bind(this)}>批量删除</Button>&emsp;
              <Button type='primary' onClick={this.goToDetail.bind(this, 1)}>添加</Button>
            </Col>
          </Row>
        </Form>
        <Table className='content-table' rowSelection={rowSelection} columns={columns} dataSource={datas} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={personList.totalCount} totalPage={personList.totalPage} currentPage={personList.currentPage} />

      </div>
    );
  }

}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  console.log(state)
  return {
    commonData: state.user,
    gradeList: state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(StudentMange));
