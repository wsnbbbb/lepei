import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Drawer, Radio, Form, Row, Col, Icon, Breadcrumb, Dropdown, Modal, message, DatePicker, Tooltip } from 'antd';
import PageIndex from '../../components/page';
import { formatDate } from '../../utils/public';
import './style.less';
import { portUrl } from '../../utils/img';
import { routerRedux, Link } from 'dva/router';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class PlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      reset: false,
      data: {},
      isShow: false,
      flag: false,
      visible: false
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getList(params)
    this.props.dispatch({
      type:'user/getAllBuildings'
    })
  }

  // 获取记录列表
  getList = (params) => {
    this.props.dispatch({
      type: 'functionPlaces/getFunctionPlaces',
      payload: params,
      callback: res => {
        if(res.code == 200){
          this.setState({
            data: res.data
          })
        }
      }
    })
  }

  showDrawer = () => {
    this.props.dispatch({
      type: 'functionPlaces/getFunctionRelateEntry',
      payload: {},
      callback: res => {
        if(res.code == 200){
          this.props.form.setFieldsValue({
            "advanceTime": res.data.advanceTime,
            "status": res.data.status
          })
          this.setState({
            visible: true,
          })
        }
      }
    })
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  add = ()=>{
    this.props.dispatch(routerRedux.push("/function-place-detail?type=1"))
  }

  set = ()=>{
    this.props.form.validateFields(["status", "advanceTime"], (err, values) => {
      if(err) return
      this.props.dispatch({
        type: 'functionPlaces/setFunctionRelateEntry',
        payload: {
          "advanceTime": values.advanceTime||'',
          "status": values.status||''
        },
        callback: res => {
          if(res.code == 200){
            message.success("保存成功")
            this.setState({
              visible: false,
            })
          }
        }
      })
    })
  }

  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        'isNeedApproval': values.isNeedApproval || '',
        'buildId': values.buildId || '',
      }
      this.getList(params)
      this.setState({ page: 1 })
    })
  }

  delete=(id)=> {
    let me=this;
    confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk() {
        me.props.dispatch({
          type:'functionPlaces/deleteFunctionPlace',
          payload:{"id": id},
          callback:(res)=>{
            if(res.code===200){
              message.success('删除成功！',3)
              me.search()
            }
          }
        })
      },
      onCancel() {},
    });
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "kw": values.kw || '',
        'isNeedApproval': values.isNeedApproval || '',
        'buildId': values.buildId || '',
      }
      this.getList(params)
    })
  }
  // 重置
  reset = () => {
    this.props.form.resetFields()
  }
  // 展开/收起
  toggle = () => {
    console.log(this.state.flag);
    this.setState({
      flag: !this.state.flag
    }, function () {
      console.log(this.state.flag);
      if (this.state.flag) {
        this.setState({
          isShow: true,
        })
      } else {
        this.setState({
          isShow: false,
        })
      }
    })
  }


  edit = (id)=>{
    this.props.dispatch(routerRedux.push("/function-place-detail?id=" + id))
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const columns = [{
      title: '功能室名称',
      dataIndex: 'name',
    }, {
      title: '可使用时段',
      render: (record) => {
        return (<span>{record.availableStartTime+"-"+record.availableEndTime}</span>)
      }
    }, {
      title: '需要审批',
      dataIndex: 'isNeedApproval',
      render: (record) => {
        return (<span>{record==1? "是" : "否"}</span>)
      }
    }, {
      title: '所属建筑',
      dataIndex: 'buildName',
     
    }, {
      title: '场所名称',
      dataIndex: 'placeName'
    },{
      title: '操作',
      dataIndex: "id",
      render:(id) => (
        <span className="make-box">
          <a href="javascript:;" onClick={this.edit.bind(this, id)} >编辑</a>&nbsp;&nbsp;
          <a href="javascript:;" onClick={this.delete.bind(this, id)} >删除</a>
        </span>
      )
    }

    ];
    const { flag, isShow,  } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {buildingList } = this.props;
    const buildChildren = [];
    buildingList&&buildingList.map(item=>{
        return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
    })
    return (
      <div className="blue-tooth">
        {/* <div className="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>功能室申请</Breadcrumb.Item>
            <Breadcrumb.Item>功能室配置</Breadcrumb.Item>
          </Breadcrumb>
          <h3>功能室配置</h3>
        </div> */}
        <div className="content-main">
          <Form className="ant-advanced-search-form content-form ">
            <Row gutter={24}>
              <Col span={4}>
                <FormItem label=''>
                  {getFieldDecorator('kw')(
                    <Input allowClear placeholder="请输入功能室名称/场所名称" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator("isNeedApproval")(
                    <Select placeholder="是否需要审批" allowClear>
                      <Option value='1' key=''>是</Option>
                      <Option value='2' key=''>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                    {getFieldDecorator("buildId",{

                    })(
                        <Select
                            placeholder="请选择所属建筑"
                            optionFilterProp="children"
                            showSearch
                            allowClear
                        >
                            {buildChildren}
                        </Select>
                      )}
                </FormItem>
              </Col>
              <Col span={5} style={{ textAlign: 'right',paddingRight:'15px' }}>
                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{this.state.flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} /></span>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: isShow ? 'block' : 'none' }}>
              <Col span={7} >
                <Button type='primary' onClick={this.add.bind(this)}>添加</Button>&emsp;
                <Button type='primary' onClick={this.showDrawer.bind(this)}>联动门禁设置</Button>&emsp;
              </Col>
            </Row>
          </Form>
          <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={this.state.data.dataList} pagination={false} />
          <PageIndex getPage={this.onPageChange.bind(this)} total={this.state.data.totalCount} totalPage={this.state.data.totalPage} currentPage={this.state.data.currentPage} />
        </div>

        <Drawer
          title="联动门禁配置"
          width={420}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
           <Form layout="vertical" hideRequiredMark>
            <Row gutter={2}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="联动功能">
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择联动功能' }],
                  })(
                    <Radio.Group>
                      <Radio value='0'>不启用</Radio>
                      <Radio value='1'>启用</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={2}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="开启权限时间">
                  {getFieldDecorator('advanceTime', {
                    rules: [{ required: true, message: '请选择开启权限时间' }],
                  })(
                    <Radio.Group>
                      <Radio value={5}>5分钟</Radio>
                      <Radio value={10}>10分钟</Radio>
                      <Radio value={30}>30分钟</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              </Row>
          </Form>

          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.set.bind(this)} type="primary">
              确定
            </Button>
          </div>
        </Drawer>


      </div>
    );
  }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    buildingList: state.user.buildingList,
  }
}
export default connect(mapStateToProps)(Form.create()(PlaceList));
