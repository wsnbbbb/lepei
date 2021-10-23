import React, { Component } from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { Table, Modal, Button, Select, message, Breadcrumb, Input, Form, Row, Col, Drawer, } from 'antd';
import PageIndex from '../../components/page';
import { buildType } from '../../utils/public';
import './style.less';
import { routerRedux } from 'dva/router'

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class BuildManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            prePage: 20,
            id:'',
            listData: {},
            addVisible:false,
            detailList:{},
            title:"建筑管理",
        };
    }
    componentDidMount = () => {
        const params = {
            "page": 1,
            "prePage": this.state.prePage
        }
        this.buildingList(params)
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/place-manage"
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

    // 建筑列表
    buildingList = (params) => {
        this.props.dispatch({
            type: 'place/buildingList',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    this.setState({
                        listData: res.data
                    })
                }
            }
        })
    }

    // 查询
    queryList = () => {
        this.props.form.validateFields(["kw", "buildType"],(err, values) => {
            const params = {
                "page": 1,
                "prePage": this.state.prePage,
                "kw": values.kw || '',
                "buildType": values.buildType || '',
            }
            this.buildingList(params)
            this.setState({
                page:1
            })
        })
    }
    // 重置
    reset = () => {
        this.props.form.resetFields(["kw", "buildType"])
    }

    // 分页
    onPageChange = (current, size) => {
        this.props.form.validateFields(["kw", "buildType"],(err, values) => {
            this.setState({ page: current, prePage: size })
            const params = {
                "page": current,
                "prePage": size,
                "kw": values.kw || '',
                "buildType": values.buildType || '',
            }
            this.buildingList(params)
        })
    }
   
    // 删除
    deleteBuilding = (id) =>{
        let that = this;
        confirm({
          title: '提示',
          content: <span>是否确认删除这条信息？</span>,
          onOk() {
            that.props.dispatch({
                type: 'place/deleteBuilding',
                payload:{"buildId":id},
                callback:(res)=>{
                    if(res.code === 200){
                        message.success('删除成功！')
                        that.onPageChange(that.state.page,that.state.prePage)
                    } else {
                        message.error('删除失败！');
                    }
                }
            })
          },
          onCancel() {},
        });
    }
    
    // 获取详情
    buildDetail = (id) => {
        this.props.dispatch({
            type: 'place/buildDetail',
            payload:{"buildId":id},
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        detailList:res.data
                    })
                }
            }
        })
    }
    // 添加/编辑
    addBuild = (id) => {
        if(id){
            this.setState({
                id:id
            })
            this.buildDetail(id)
        }
        this.setState({
            addVisible: true,
        });
    };
    addMap = () => {
        this.props.dispatch(routerRedux.push("/aerial-view-add"))
    };
    // 确定
    addBuildOK = () => {
        this.props.form.validateFields(["name", "buildType1"],(err, values) => {
            if(!err) {
                const params = {
                    "name": values.name || '',
                    "buildType": values.buildType1 || '',
                }
                if(this.state.id){
                    params.buildId = this.state.id
                }
                console.log({params});
                this.props.dispatch({
                    type: this.state.id ? 'place/editBuilding' : 'place/addBuilding',
                    payload: params,
                    callback: (res) => {
                        if (res.code === 200) {
                            message.success(this.state.id?'编辑成功！':'添加成功！');
                            this.setState({
                                addVisible: false,
                                id:''
                            })
                            this.props.form.resetFields(["name", "buildType1"])
                            this.onPageChange(this.state.page,this.state.prePage)
                        }
                    }
                })
            }
        })
    }

    // 关闭
    onClose = () => {
        this.setState({
            addVisible: false,
            id:'',
        })
        this.props.form.resetFields(["name", "buildType1"])
    };


    render() {
        const { listData,id,detailList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const columns = [{
            title: '建筑名称',
            dataIndex: 'name',
        }, {
            title: '建筑类型',
            dataIndex: 'buildType',
            render:(record) => (
                <span>{buildType(record)}</span>
            )
        }, {
            title: '操作',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.addBuild.bind(this,record.id)}>编辑</a> &nbsp;&nbsp;&nbsp;&nbsp;
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.deleteBuilding.bind(this, record.id)}>删除</a>
                </span>
            ),
        }];

        return (
            <div className="places-manage content-building">
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>基础管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/place-manage">场所管理</Link> </Breadcrumb.Item>
                        <Breadcrumb.Item>建筑管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>建筑管理</h3>
                </div> */}
                <div className="content-main content-box">
                    <Form className="form-content">
                        <Row gutter={24}>
                            <Col xl={{ span: 5 }} lg={{ span: 5 }}>
                                {getFieldDecorator('kw')(
                                    <Input placeholder="建筑名称" />
                                )}
                            </Col>
                            <Col xl={{ span: 5 }} lg={{ span: 5 }}>
                                {getFieldDecorator("buildType")(
                                    <Select placeholder="建筑类型" showSearch allowClear >
                                        <Option value="1">教学楼</Option>
                                        <Option value="2">行政楼</Option>
                                        <Option value="3">宿舍楼</Option>
                                        <Option value="4">实验楼</Option>
                                        <Option value="5">操场</Option>
                                        <Option value="6">食堂</Option>
                                        <Option value="7">体育馆</Option>
                                        <Option value="8">活动中心</Option>
                                        <Option value="9">图书馆</Option>
                                        <Option value="10">校园出入口</Option>
                                    </Select>
                                )}
                            </Col>
                            <Col xl={{ span: 14 }} lg={{ span: 14 }} style={{ textAlign: 'right', }}>
                                <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                                <Button type='primary' onClick={this.addBuild.bind(this,undefined)}>添加</Button>&emsp;
                                <Button type='primary' onClick={this.addMap.bind(this)}>点位图配置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table columns={columns} dataSource={listData.dataList} pagination={false} />
                </div>
                <div className="paginationBox">
                    <PageIndex getPage={this.onPageChange.bind(this)} total={listData.totalCount} totalPage={listData.totalPage} currentPage={listData.currentPage} />
                </div>

                <Drawer
                    title={id ? '编辑' : '添加'}
                    placement="right"
                    width="600"
                    onClose={this.onClose}
                    visible={this.state.addVisible}
                    className="add-place-drawer"
                    >
                    <Form>
                        <Row gutter={24}>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="建筑名称">
                                    {getFieldDecorator('name', {initialValue:id && detailList.name ? detailList.name : '',
                                    rules: [{ required: true, message: '请输入建筑名称' }],})(
                                        <Input placeholder="请输入建筑名称" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="建筑类型">
                                    {getFieldDecorator("buildType1",{initialValue: id && detailList.buildType ? detailList.buildType + '' : undefined,
                                     rules: [{ required: true, message: '请选择建筑类型' }]})(
                                       <Select placeholder="建筑类型" showSearch allowClear >
                                            <Option value="1">教学楼</Option>
                                            <Option value="2">行政楼</Option>
                                            <Option value="3">宿舍楼</Option>
                                            <Option value="4">实验楼</Option>
                                            <Option value="5">操场</Option>
                                            <Option value="6">食堂</Option>
                                            <Option value="7">体育馆</Option>
                                            <Option value="8">活动中心</Option>
                                            <Option value="9">图书馆</Option>
                                            <Option value="10">校园出入口</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="btns">
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
                        <Button onClick={this.addBuildOK} type="primary">确定</Button>
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
    }
}

export default connect(mapStateToProps)(Form.create()(BuildManage));
