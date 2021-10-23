import React, { Component } from 'react';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Table, Modal, InputNumber, Button, Select, message, Breadcrumb, Input, Form, Row, Col, Icon, Menu, Dropdown, Drawer, } from 'antd';
import PageIndex from '../../components/page';
import { getUpload, portUrl } from '../../utils/img';
import { isBlank,actionType,buildType } from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class PlaceManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            prePage: 20,
            selectedRowKeys: [],
            placeId: "",
            isShow: false,
            flag: false,
            btnOffset: 0,
            buildList: [],
            disabled: true,
            listData: {},
            visible:false,
            showErr:false,
            placeFile:'',
            exportUrl:'',
            ids:[],
            selectNum:0,
            addVisible:false,
            isAdd:true,
            detailList:{},
            limit:''

        };
    }

    componentDidMount = () => {
        // this.setState({
        //     buildName: this.state.buildType[this.props.match.params.buildType]
        // })
        const params = {
            "page": 1,
            "prePage": this.state.prePage
        }
        this.getPlaceList(params)
        this.props.dispatch({ //获取建筑列表
            type: 'user/getAllBuildings',
        })
    }

    // 根据类型获取建筑
    changebuildType = (val) => {
        if (val) {
            this.setState({ disabled: false })
            this.props.dispatch({
                type: 'place/getBuildings',
                payload: { "buildType": val },
                callback: (res) => {
                    this.setState({
                        buildList: res.data
                    })
                }
            })
        } else {
            this.setState({
                disabled: true
            })
        }
        this.props.form.resetFields(["buildName"])
    }
   

    // 查询
    queryList = () => {
        this.props.form.validateFields(["kw", "buildType", "buildName", "actionType"],(err, values) => {
            const params = {
                "page": 1,
                "prePage": this.state.prePage,
                "kw": values.kw || '',
                "buildType": values.buildType || '',
                "buildId": values.buildName || '',
                "actionType": values.actionType || '',
            }
            this.getPlaceList(params)
            this.setState({
                page:1
            })
        })
    }
    // 重置
    reset = () => {
        this.props.form.resetFields(["kw", "buildType", "buildName", "actionType"])
    }
    // 场所列表
    getPlaceList = (params) => {
        let _this = this
        this.props.dispatch({
            type: 'place/placeList',
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

    // 分页
    onPageChange = (current, size) => {
        this.props.form.validateFields(["kw", "buildType", "buildName", "actionType"],(err, values) => {
            this.setState({ page: current, prePage: size })
            const params = {
                "page": current,
                "prePage": size,
                "kw": values.kw || '',
                "buildType": values.buildType || '',
                "buildId": values.buildName || '',
                "actionType": values.actionType || '',
            }
            this.getPlaceList(params)
        })
    }
    // 场所导入
    importPlace = () =>{
        this.setState({
            visible:true,
        })
    }
    // 文件上传
    changeFile = (e) => {
        this.setState({placeFile: e.target.files[0]})
    }
    
    // 确定导入场所
    handleOk = () =>{
        this.props.form.validateFields(["excel"],(err,values) =>{
            if(!err){
            const params = new FormData();
            params.append('excel', this.state.placeFile)
            console.log({params});
            this.props.dispatch({ 
                type:'place/importPlace',
                payload:params,
                callback:(res)=>{
                this.setState({file: ''})
                this.props.form.resetFields(["excel"])
                if(res.code === 200){
                    if(res.data.hasError){
                    if(res.data.header && res.data.sheetData){
                        message.error(res.msg)
                        let errData = []
                        res.data.sheetData.map(item =>{
                        if(item.error){
                            errData.push(item)
                        }
                        })
                        this.setState({
                        visible3:true,
                        header:res.data.header,
                        sheetData:errData,
                        showErr:true
                        })
                    }else{
                        message.error(res.msg)
                    }
                    }else{
                    message.success("场所导入成功")
                    this.setState({
                        visible:false,
                        showErr:false
                    })
                    this.props.form.resetFields(["excel"])
                    this.queryList()
                    }
                }
                }
            })
            }
        })
    }
    // 取消场所导入
    handleCancel = () =>{
        this.setState({
            visible:false,
            showErr:false
        })
        this.props.form.resetFields(["excel"])
    }
    // 导出
    export = () => {
        this.props.form.validateFields(["kw", "buildType", "buildName", "actionType"],(err, values) => {
            let token = sessionStorage.getItem("token");
            let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
            let userId = sessionStorage.getItem("userId");
            let kw = values.kw || '';
            let buildType = values.buildType || '';
            let buildId = values.buildName || '';
            let actionType = values.actionType || '';
            let url = portUrl("/manager/school-place/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&kw=" + kw +
                "&buildType=" + buildType + "&buildId=" + buildId + "&actionType=" + actionType)
            this.setState({ exportUrl: url })
        })
    }

    // 跳转建筑管理
    toBuildPage = () => {
        this.props.dispatch(routerRedux.push("/build-manage"))
    }

    // 删除
    deletePlace = (id) =>{
        let that = this;
        confirm({
          title: '提示',
          content: <span>是否确认删除这条信息？</span>,
          onOk() {
            that.props.dispatch({
                type: 'place/deletePlace',
                payload:{"placeId":id},
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
    // 选择项
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let ids=[];
        selectedRows&&selectedRows.length>0&&selectedRows.map(item =>{
          return ids.push(item.placeId)
        })
        this.setState({ 
            ids,
            selectedRowKeys,
            selectNum:ids.length > 0 ? ids.length : 0
        });
      }
    // 全选
    selectAll=(selected, selectedRows, changeRows)=>{
        let allIds = [];
        if(selected === true){
            selectedRows&&selectedRows.length>0&&selectedRows.map(item=>{
            return allIds.push(item.id)
            })
            this.setState({ ids:allIds});
        }else{
            this.setState({ ids:[]});
        }
    }
    // 批量删除
    batchDel = () =>{
        if(this.state.ids.length == 0){
            return message.error("请先选择内容，再进行删除！")
        }
        let that = this;
        confirm({
            title: '提示',
            content: <span>确定批量删除所选内容？</span>,
            onOk() {
                that.props.dispatch({
                    type: 'place/deleteArrPlace',
                    payload:{"placeIds":that.state.ids},
                    callback:(res)=>{
                        if(res.code===200){
                            message.success('删除成功')
                            that.getPlaceList()
                            that.setState({
                                ids:[],
                                selectedRowKeys:[]
                            })
                        }
                    }
                })
            },
            onCancel() {},
        });
    }
    // 取消选择
    cancelSelect = () =>{
        this.setState({
            ids : [],
            selectedRowKeys : [],
            selectNum:0
        })
    }
    // 获取详情
    placeDetail = (id) => {
        this.props.dispatch({
            type: 'place/placeDetail',
            payload:{"placeId":id},
            callback:(res)=>{
                if(res.code === 200){
                    this.setState({
                        detailList:res.data,
                        limit:res.data.limitNum
                    })
                }
            }
        })
    }
    // 添加/编辑
    placeAdd = (id) => {
        if(id){
            this.setState({
                placeId:id
            })
            this.placeDetail(id)
        }
        this.setState({
            addVisible: true,
        });
    };
    // 确定
    addPlaceOK = () => {
        this.props.form.validateFields(["placeName", "placeCode", "actionType1", "buildId"],(err, values) => {
            if(!err) {
                const params = {
                    "placeName": values.placeName || '',
                    "placeCode": values.placeCode || '',
                    "actionType": values.actionType1 || '',
                    "limitNum":this.state.limit,
                    "buildId": values.buildId || '',
                }
                if(this.state.placeId){
                    params.placeId = this.state.placeId
                }
                console.log({params});
                this.props.dispatch({
                    type: this.state.placeId ? 'place/editPlace' : 'place/addPlace',
                    payload: params,
                    callback: (res) => {
                        if (res.code === 200) {
                            message.success(this.state.placeId ?'修改成功！':'添加成功！');
                            this.setState({
                                addVisible: false,
                                placeId:'',
                                limit: ''
                            })
                            this.props.form.resetFields(["placeName", "placeCode", "actionType1", "buildId"])
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
            placeId:'',
            limit:''
        })
        this.props.form.resetFields(["placeName", "placeCode", "actionType1", "buildId"])
    };

    // 容纳人数
    changeNum = (value) => {
        console.log('limit', value);
        this.setState({
            limit: value,
        });
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
                    btnOffset: 7
                })
            } else {
                this.setState({
                    isShow: false,
                    btnOffset: 0
                })
            }
        })
    }

    render() {
        const { selectedRowKeys, isShow, flag, btnOffset, buildList, disabled, listData,header, sheetData,visible ,showErr,selectNum,placeId,detailList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const { buildingList } = this.props;
        const buildChildren = [];
        buildingList && buildingList.map(item => {
            return buildChildren.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
        })
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.onSelectChange(selectedRowKeys, selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              this.selectAll(selected, selectedRows, changeRows)
            },
        };
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const columns = [{
            title: '名称',
            dataIndex: 'placeName',
        }, {
            title: 'ID',
            dataIndex: 'placeId',
        }, {
            title: '第三方ID',
            dataIndex: 'placeCode',
        }, {
            title: '容纳人数',
            dataIndex: 'limitNum',
        }, {
            title: '功能类型',
            dataIndex: 'actionType',
            render:(record) => (
                <span>{actionType(record)}</span>
            )
        }, {
            title: '建筑类型',
            dataIndex: 'buildType',
            render:(record) => (
                <span>{buildType(record)}</span>
            )
        }, {
            title: '建筑名称',
            dataIndex: 'buildName',
        }, {
            title: '操作',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.placeAdd.bind(this,record.placeId)}>编辑</a> &nbsp;&nbsp;&nbsp;&nbsp;
                    <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.deletePlace.bind(this, record.placeId)}>删除</a>
                </span>
            ),
        }];

        let buildOptions = []
        buildList && buildList.length > 0 && buildList.map(item => {
            return buildOptions.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        let ths = [];
        if (header) {
            for (var i in header) {
                ths.push(<th key={i}>{header[i]}</th>)
            }
        }
        let tbodys = []
        if (sheetData) {
            sheetData.map((item, idx) => {
                let tds = []
                for (var i in item) {
                    tds.push(<td key={i} style={{ color: item.error ? "#f00" : "" }}>{item[i] ? item[i] : "无"}</td>)
                }
                return tbodys.push(<tr key={idx}>{tds}</tr>)
            })
        }

        return (
            <div className="places-manage content-building">
                <div className="content-main content-box">
                    <Form className="form-content">
                        <Row gutter={24}>
                            <Col xl={{ span: 4 }} lg={{ span: 8 }}>
                                {getFieldDecorator('kw')(
                                    <Input placeholder="名称/ID/第三方ID" />
                                )}
                            </Col>
                            <Col xl={{ span: 4 }} lg={{ span: 8 }}>
                                {getFieldDecorator("buildType")(
                                    <Select placeholder="建筑类型" showSearch allowClear onChange={this.changebuildType.bind(this)}>
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
                            <Col xl={{ span: 4 }} lg={{ span: 8 }}>
                                {getFieldDecorator("buildName")(
                                    <Select placeholder="建筑名称" showSearch allowClear disabled={disabled}>
                                        {buildOptions}
                                    </Select>
                                )}
                            </Col>
                            <Col xl={{ span: 4 }} lg={{ span: 8 }}>
                                {getFieldDecorator("actionType")(
                                    <Select placeholder="功能类型" allowClear>
                                        <Option value="1">教室</Option>
                                        <Option value="2">功能室</Option>
                                        <Option value="3">办公室</Option>
                                        <Option value="4">寝室</Option>
                                        <Option value="5">厕所</Option>
                                        <Option value="6">走廊</Option>
                                        <Option value="7">楼梯</Option>
                                        <Option value="8">其他</Option>
                                    </Select>
                                )}
                            </Col>
                            <Col xl={{ span: 9, offset: 0 }} style={{ display: isShow ? 'block' : 'none' }}>
                                <Button type='primary' onClick={this.placeAdd.bind(this,null)}>添加</Button>&emsp;
                                <Button type='primary' onClick={this.importPlace.bind(this)}>导入</Button>&emsp;
                                <Button type='primary'><a target="" rel="noopener noreferrer" href={this.state.exportUrl}  onClick={this.export.bind(this)}>导出</a></Button>&emsp;
                                <Button type='primary' onClick={this.toBuildPage.bind(this)}>建筑管理</Button>&emsp;
                            </Col>
                            <Col xl={{ span: 8 }} lg={{ span: 8 }} offset={btnOffset} style={{ textAlign: 'right', }}>
                                <Button type='primary' onClick={this.queryList.bind(this)}>查询</Button>&emsp;
                                <Button onClick={this.reset.bind(this)}>重置</Button>&emsp;
                                <span className="cursor ftColor" onClick={this.toggle.bind(this)}>{flag ? '收起' : '展开'}<Icon type={flag ? 'up' : 'down'} /></span>
                            </Col>
                        </Row>
                    </Form>
                    {
                        hasSelected ? 
                        <div className="delAll">
                            <p>
                                <Icon type="info-circle" theme="filled" className="ftColor" />
                                    <span className="text">已选择</span><span>{selectNum}</span>&nbsp;/&nbsp;<span className="total">{listData.totalCount}</span>条数据
                                <span onClick={this.cancelSelect} className="cancele cursor ftColor">取消选择</span>
                                {/* <span className="ftColor cursor">选择全部</span> */}
                            </p>
                            <Button type="primary" onClick={this.batchDel}>批量删除</Button>
                        </div> : null
                    }
                    <Table rowSelection={rowSelection} columns={columns} dataSource={listData.dataList} pagination={false} />
                </div>
                <div className="paginationBox">
                    <PageIndex getPage={this.onPageChange.bind(this)} total={listData.totalCount} totalPage={listData.totalPage} currentPage={listData.currentPage} />
                </div>
                <Modal
                    title="场所导入"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className="importPlaces"
                >
                    <Form>
                        <Row gutter={24} >
                            <Col span={22}>
                                <FormItem {...formItemLayout} label={'选择文件'}>
                                    {getFieldDecorator("excel", { initialValue: '', rules: [{ required: true, message: "请上传附件" }] })(
                                        <Input style={{ border: "none" }} type="file" name="file" onChange={this.changeFile.bind(this)} single="true" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <p style={{ marginLeft: "138px" }}>
                            <span >支持扩展名为.xls及.xlsx的文件</span>
                            <a style={{ marginLeft: "30px" }} href={getUpload("场所导入模板.xlsx")}>下载模板</a>
                        </p>
                        {
                            showErr ? <table border="1" className="batch-import-place-table">
                                <thead>
                                    <tr>{ths}<th>提示</th></tr>
                                </thead>
                                <tbody>
                                    {tbodys}
                                </tbody>
                            </table> : null
                        }
                    </Form>
                </Modal>

                <Drawer
                    title={placeId ? '编辑' : '添加'}
                    placement="right"
                    width="600"
                    onClose={this.onClose}
                    visible={this.state.addVisible}
                    className="add-place-drawer"
                    >
                    <Form>
                        <Row gutter={24}>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="场所名称">
                                {getFieldDecorator('placeName', {initialValue:placeId && detailList.placeName ? detailList.placeName : '',
                                rules: [{ required: true, message: '请输入场所名称' }],})(
                                    <Input placeholder="请输入场所名称" />
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="第三方ID">
                                {getFieldDecorator('placeCode', {initialValue: placeId && detailList.placeCode ? detailList.placeCode : ''})(
                                    <Input placeholder="请输入第三方ID" />
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="容纳人数">
                                    <InputNumber defaultValue=''  size="large" value={this.state.limit} min='' max={999} onChange={this.changeNum} />
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="功能类型">
                                    {getFieldDecorator("actionType1",{initialValue: placeId && detailList.actionType ? detailList.actionType + '' : undefined})(
                                        <Select placeholder="请选择" allowClear>
                                            <Option value="1">教室</Option>
                                            <Option value="2">功能室</Option>
                                            <Option value="3">办公室</Option>
                                            <Option value="4">寝室</Option>
                                            <Option value="5">厕所</Option>
                                            <Option value="6">走廊</Option>
                                            <Option value="7">楼梯</Option>
                                            <Option value="8">其他</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item {...formItemLayout} label="所属建筑">
                                    {getFieldDecorator("buildId",{initialValue: placeId && detailList.buildId ? detailList.buildId + '' : undefined,
                                    rules: [{ required: true, message: '请选择所属建筑' }]})(
                                        <Select placeholder="请选择"    
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } 
                                            showSearch
                                            allowClear>
                                            {buildChildren}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="btns">
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
                        <Button onClick={this.addPlaceOK} type="primary">确定</Button>
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

export default connect(mapStateToProps)(Form.create()(PlaceManage));
