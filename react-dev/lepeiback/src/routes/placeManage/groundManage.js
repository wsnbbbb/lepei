import React,{Component} from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { Table,Modal, InputNumber,Button,Select,message, Breadcrumb ,Input, Form, Row, Col, Icon,Menu, Dropdown, Pagination  } from 'antd';
import './style.less';
import {isBlank} from '../../utils/public';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class GroundManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            visibleAdd: false,
            visibleEdit: false,
            visibleDel: false,
            visibleDelAll: false,
            functionType: {
                1: "教室" ,
                2: "功能室",
                3: "办公室",
                4: "寝室",
                5: "厕所",
                6: "走廊",
                7: "楼梯",
                8: "其他"
            },
            buildType:{
                1: "教学楼" ,
                2: "行政楼",
                3: "宿舍楼",
                4: "实验楼",
                5: "操场",
                6: "食堂",
                7: "体育馆",
                8: "活动中心",
                9: "图书馆",
                10: "校园出入口"
            },
            buildName:"",
            arrData: [],
            addName: "",
            addRemark:"",
            funType: 1,
            limit: 1,
            deleteId:"",
            editName: "",
            editRemark: "",
            searchType:"",
            keyWord:""
        };
    }
  
    echoData=(id)=>{
        let _this=this
        _this.state.arrData.map(
            function(item){
                if(item.key==id){
                    console.log(item)
                    _this.setState({
                            editName: item.name,
                            editRemark: item.remark
                    })
                    return
                }
            }
        )
    }

    componentDidMount=()=>{

        this.setState({
            buildName: this.state.buildType[this.props.match.params.buildType]
        })
        const params={
            "kw": "",
            "buildId": sessionStorage.getItem("buildId"),
            "actionType": ""
        }
        this.getPlaceList(params)
    }

    getPlaceList=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'place/placeList',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                   if(res.data instanceof Array){
                        let arrData=[]
                        res.data.map(function(item, index){
                            arrData.push({
                                            key: item.placeId,
                                            name: item.placeName,
                                            remark: item.remark,
                                        })
                        })
                        _this.setState({
                            arrData: arrData
                        })
                    }
                }
              }
        })
    }

    addPlace=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'place/addPlace',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    message.success('添加成功！');
                    _this.setState({
                        visibleAdd: false,
                        addName: '',
                        addRemark:""
                    })
                    const params={
                        "kw": "",
                        "buildType": this.props.match.params.buildType,
                        "actionType": ""
                    }
                    this.getPlaceList(params)
                }else{
                    message.error('添加失败！');
                }

              }
        })
    }
    

    deletePlace=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'place/deletePlace',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    message.success('删除成功！');
                    _this.setState({
                        visibleDel: false,
                    })
                    const params={
                        "kw": "",
                        "buildType": this.props.match.params.buildType,
                        "actionType": ""
                    }
                    this.getPlaceList(params)
                }else{
                    message.error('删除失败！');
                }

              }
        })
    }

    deleteArrPlace=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'place/deleteArrPlace',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    message.success('删除成功！');
                    _this.setState({
                        visibleDelAll: false,
                        selectedRowKeys:[]
                    })
                    const params={
                        "kw": "",
                        "buildType": this.props.match.params.buildType,
                        "actionType": ""
                    }
                    this.getPlaceList(params)
                }else{
                    message.error('删除失败！');
                }

              }
        })
    }

    editPlace=(params)=>{
        let _this=this
        this.props.dispatch({
            type:'place/editPlace',
            payload:params,
            callback:(res)=>{
                if(res.code===200){
                    message.success('编辑成功！');
                    _this.setState({
                        visibleEdit: false
                    })
                    const params={
                        "kw": "",
                        "buildType": this.props.match.params.buildType,
                        "actionType": ""
                    }
                    this.getPlaceList(params)
                }else{
                    message.error('编辑失败！');
                }
              }
        })
    }

    queryList=()=>{
        const params={
            "kw": this.state.keyWord,
            "buildType": this.props.match.params.buildType,
            "actionType": this.state.searchType
        }
        this.getPlaceList(params)
    }

    changeKeyWord=(e)=>{
        console.log(e.target.value)
        this.setState({
            keyWord: e.target.value,
        });
    }

    changeActionType=(value)=>{
        console.log(`selected ${value}`);
        this.setState({
            searchType: value
        })
    }

    onChange=(value)=> {
        console.log('limit', value);
        this.setState({
            limit: value,
        });
        
    }

    handleChange1=(value)=> {
        console.log('funtype:', value);
        this.setState({
            funType: value,
        });
    }

    onChange1=(e)=> {
        console.log('addname', e.target.value);
        this.setState({
            addName: e.target.value,
        });
    }

    
    onChange2=(e)=> {
        console.log('addRemark', e.target.value);
        this.setState({
            addRemark: e.target.value,
        });
    }

    onChange3=(e)=> {
        console.log('addRemark', e.target.value);
        this.setState({
            editName: e.target.value,
        });
    }

    onChange4=(e)=> {
        console.log('addRemark', e.target.value);
        this.setState({
            editRemark: e.target.value,
        });
    }

    placeAdd = () => {

        this.setState({
            visibleAdd: true,
        });
    }
    
    placeDel = (id) => {
        console.log(id)
        this.setState({
            visibleDel: true,
            deleteId: id
        });
    }
 
    placeDelAll = () => {
        this.setState({
            visibleDelAll: true,
        });
    }

    handleAddOk = (e) => {
        console.log(e);
        const params={
            "buildId": sessionStorage.getItem("buildId"),
            "name": this.state.addName,
            "remark":this.state.addRemark
        }
        if(isBlank(params.name)){
            message.warning('请输入名称！')
            return
        }
        this.addPlace(params)
    }

    placeEdit = (id) => {
        console.log(id)
        this.echoData(id);
        this.setState({
            deleteId: id,
            visibleEdit: true,
        });
    }
    
    handleEditOk = (e) => {
        const params={
            "placeId": this.state.deleteId,
            "buildId": sessionStorage.getItem("buildId"),
            "name": this.state.editName,
            "remark":this.state.editRemark
        }
        this.editPlace(params);
    }
    
    handleEditCancel = (e) => {
        console.log(e);
        this.setState({
            visibleEdit: false,
        });
    }

    handleDelOk = (e) => {
        // this.setState({
        //     visibleDel: false,
        // });
        const params={
            "placeId": this.state.deleteId,
        }
        this.deletePlace(params);
    }
    
    handleDelCancel = (e) => {
        console.log(e);
        this.setState({
            visibleDel: false,
        });
    }

    handleDelAllOk = (e) => {
        const params={
            "placeId": this.state.selectedRowKeys
        }
        this.deleteArrPlace(params)
    }
    
    handleDelAllCancel = (e) => {
        console.log(e);
        this.setState({
            visibleDelAll: false,
        });
    }
    
    handleAddCancel = (e) => {
        console.log(e);
        this.setState({
            visibleAdd: false,
        });
    }

    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }
    
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    render(){
        const { selectedRowKeys } = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const menu = (
            <Menu>
              <Menu.Item>
                <a target="" rel="noopener noreferrer" href="javascript:;" onClick={this.placeAdd}>新增</a>
              </Menu.Item>
            </Menu>
          );
          const menu1 = id=>(
            <Menu onClick={this.placeDel.bind(this, id)}>
              <Menu.Item>
                <a target="" rel="noopener noreferrer" href="javascript:;" >删除</a>
              </Menu.Item>
            </Menu>
          );
          const columns = [{
            title: '编号',
            dataIndex: 'key',
          }, 
          {
            title: '名称',
            dataIndex: 'name',
          }, {
            title: '备注',
            dataIndex: 'remark',
          },
          {
            title: '操作',
            render: (text, record) => (
                <span>
                  <a href="javascript:;" onClick={this.placeEdit.bind(this, record.key)}>编辑</a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Dropdown overlay={menu1(record.key)} key={record.key}>
                    <a className="ant-dropdown-link" href="javascript:;" >
                        <Icon type="ellipsis" />
                    </a>
                </Dropdown>
                </span>
              ),
          }];

          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectChange(selectedRowKeys);
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
              name: record.name,
            }),
          };

        return (
            <div className="content-main content-building">
                <div className="content-box">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={"/place-manage"}>场所位置管理</Link> \ {this.state.buildName}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row className="option-wrap">
                        <Input placeholder="名称" onChange={this.changeKeyWord}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={this.queryList}>查询</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="javascript:;">
                                更多<Icon type="down" />
                            </a>
                        </Dropdown>
                    </Row>
                    <Row>
                    <Button
                        type="primary"
                        disabled={!hasSelected}
                        onClick={this.placeDelAll}
                    >
                        批量删除
                    </Button>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.arrData} />
                    </Row>
                </div>

                <Modal className="add-modal"
                    title="添加场所"
                    visible={this.state.visibleAdd}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    footer={[
                        <Button key="back" onClick={this.handleAddCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleAddOk}>
                            新增
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>名称<span className="color-red">*</span></label>
                        <Input placeholder="请输入名称" value={this.state.addName} onChange={this.onChange1} maxLength="40" />
                    </Row>
                    <Row>
                        <label>备注</label>
                        <TextArea rows={3} value={this.state.addRemark} placeholder="例：东面男厕所、东面楼梯、201教室旁走廊" maxLength="40" onChange={this.onChange2}/>
                    </Row>
                </Modal>

                <Modal className="edit-modal"
                    title="编辑场所"
                    visible={this.state.visibleEdit}
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleEditOk}>
                            保存
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>名称<span className="color-red">*</span></label>
                        <Input value={this.state.editName} onChange={this.onChange3}/>
                    </Row>
                    <Row>
                        <label>备注</label>
                        <TextArea rows={3} value={this.state.editRemark} placeholder="例：东面男厕所、东面楼梯、201教室旁走廊" onChange={this.onChange4}/>
                    </Row>

                </Modal>

                <Modal className="del-modal"
                    title="删除场所"
                    visible={this.state.visibleDel}
                    onOk={this.handleDelOk}
                    onCancel={this.handleDelCancel}
                    footer={[
                        <Button key="back" onClick={this.handleDelCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleDelOk}>
                            删除
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>是否确认删除？</label>
                    </Row>
                   
                </Modal>

                <Modal className="delall-modal"
                    title="批量删除场所"
                    visible={this.state.visibleDelAll}
                    onOk={this.handleDelAllOk}
                    onCancel={this.handleDelAllCancel}
                    footer={[
                        <Button key="back" onClick={this.handleDelAllCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleDelAllOk}>
                            删除
                        </Button>,
                        ]}
                    >
                    <Row>
                        <label>是否确认删除选中场所？</label>
                    </Row>
                </Modal>

            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
     
  }
}

export default connect(mapStateToProps)(Form.create()(GroundManage));
