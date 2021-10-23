import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Form, Row, Col } from 'antd';
import { getSexType } from '../utils/public';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;

class AddPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: []
    };
  }
  componentDidMount = () => {
    const params = { "kw": '', "status": 1 }
    this.getPersonLists(params)
  }
  getPersonLists = (params) => {
    this.props.dispatch({
      type: 'user/getTeachersAndWorks',
      payload: params
    })
  }
  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "kw": values.kw || '',
        "status": 1
      }
      this.getPersonLists(params)
    })
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows });
  }
  selectAll = (selected, selectedRows, changeRows) => {
    this.setState({ selectedRows });
  }
  personCancel = () => {
    this.props.getData('cancel')
  }
  personSubmit = () => {
    const { selectedRows } = this.state
    this.props.getData('add', selectedRows)
  }
  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'personName'
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: (text, record) => (
        <span>{getSexType(record.sex)}</span>
      )
    }, {
      title: '部门',
      dataIndex: 'departmentName'
    }];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows)
      },
      // onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows);
      //   this.onSelectChange(record, selected, selectedRows)
      // },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.selectAll(selected, selectedRows, changeRows)
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { teacherAndWorksData } = this.props;
    if (!teacherAndWorksData || !teacherAndWorksData.data) {
      return null;
    }
    return (
      <div className="content-main">
        <div className="top">添加人员</div>
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label=''>
                {getFieldDecorator('kw')(
                  <Search placeholder="请输入姓名或部门名称" />
                )}
              </FormItem>
            </Col>
            <Col span={2} offset={1}>
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Form>
        <Table className='content-table' rowSelection={rowSelection} columns={columns} dataSource={teacherAndWorksData.data} pagination={false} />
        <div className="bottom-btns">
          <Button style={{ marginRight: 20 }} onClick={this.personCancel.bind(this)}>取消</Button>
          <Button type="primary" onClick={this.personSubmit.bind(this)}>确定</Button>
        </div>
      </div>
    );
  }

}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    teacherAndWorksData: state.user.teacherAndWorksData
  }
}

export default connect(mapStateToProps)(Form.create()(AddPerson));
