import React,{Component} from 'react';
import { connect } from 'dva';
// import {Link} from 'dva/router';
import { Table,Button,Input,Form,Row,Col,Icon,Modal,message,Tree,Breadcrumb, TreeSelect , Badge, Popover } from 'antd';
import AddDepartmentPerson from '../../components/addDepartmentPerson';
import PageIndex from '../../components/page';
import { getSexType, formatIdcard} from '../../utils/public';
import './style.less';

const confirm = Modal.confirm;
const { TreeNode } = Tree;
const FormItem = Form.Item;
// const TreeNode = TreeSelect.TreeNode;

class DepartmentMange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,  
          step:1,
          treeData: [],//部门结构数据
          tableData:[],//部门相关人员表格数据
          id:1,
          flag:false,
          expandedFlag:false,
          selectedRows:[],
          expandedKeys:['0'],
          departmentNodes:{},
          departmentNode:[],
          // autoExpandParent: true,
          addVisible:false,
          page:1,
          prePage:20,
          selectNum:'',
          allPerson:{},
          dataList:[],
          selectedRowKeys:[]

        };
    }
    componentDidMount = () => {
      this.getDepartmentList();
    }
    getDepartmentList = () => {
      this.props.dispatch({ //部门结构
        type:'user/getDepartmentList',
        callback:(res) => {
          if(res.code === 200){
            // console.log("部门结构",res.data[0].children);
            this.setState({
              treeData:res.data,
              departmentNodes:res.data[0],
              departmentNode:res.data[0].children ? res.data[0].children : []
            })
          }
        }
      })
    }

    //部门相关人员列表
    getDepartmentPerson = (params) => { 
      this.props.dispatch({
        type:'department/departmentDetail',
        payload:params,
        callback:(res) =>{
          if(res.code === 200){
            res.data.persons && res.data.persons.map(item => {
              item.key = item.personId
            })
            this.setState({
              tableData:res.data.persons
            })
          }
        }
      })
    }
   
    // 点击部门获取列表详情
    getDepartmentId = (data) => {
      if(data.departmentId == 0){
        this.setState({
          flag:false,
          tableData:[],
          departmentId:data.departmentId,
          departmentName:data.departmentName,
        })
      }else{
        this.setState({
          flag:true,
          departmentId:data.departmentId,
          departmentName:data.departmentName
        })
        const params={
          "departmentId":data.departmentId
        }
        this.getDepartmentPerson(params)
      }
    }

    // 节点展开/收起
    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        expandedFlag:true,
        // autoExpandParent: false,
      });
    }

    // 部门结构添加/编辑/删除
    click = (data,type,e) => {
      e.stopPropagation(); 
      if(type == 'add'){
          const { id } = this.state;
          let newId;
          newId = id + 1;
          this.setState({
            type:1,
            id:newId,
            departmentName:`新增部门${id}`,
            departmentId:data.departmentId
          })
          if(data.departmentId != 0){
            const params = {
              "departmentId":data.departmentId
            }
            this.getDepartmentPerson(params)
          }
          this.props.dispatch({
              type:'department/addDepartment',
              payload:{"departmentName":`新增部门${id}`,"pid":data.departmentId},
              callback:(res) =>{
                  if(res.code === 200){
                      message.success('新增成功！',2)
                      this.getDepartmentList();
                      this.setState({
                        expandedKeys:this.state.expandedKeys.concat([`${data.departmentId}`])
                      })
                  }
              }
          })
      }else if(type == 'edit'){
        const params = {
          "departmentId":data.departmentId
        }
        this.getDepartmentPerson(params)
        this.setState({
          edit:true,
          type:2,
          num:data.departmentId,
          departmentName:data.departmentName,
          departmentId:data.departmentId
        })
      }else if(type == 'del'){
          // this.setState({tableData:[],flag:false})
          this.props.dispatch({
              type:'department/delDepartment',
              payload:{"departmentId":data.departmentId},
              callback:(res)=>{
                  if(res.code === 200){
                      message.success('删除成功！',2)
                      this.getDepartmentList();
                      this.setState({delId:data.departmentId})
                  }
              }
          })
      }
    }

    // 部门结构修改确定
    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        this.props.dispatch({
          type:'department/updateDepartment',
          payload:{"departmentName":values.departmentNameData,"departmentId":this.state.num},
          callback:(res)=>{
            if(res.code === 200){
              this.setState({edit:false})
              message.success('修改成功！',2)
              this.getDepartmentList();
            }
          }
        })
      })
    }

    // 部门结构修改确定
    handleCancel = () => {
      this.setState({edit:false})
    }

    // 部门结构数据
    renderTreeNodes = data => data.map((item) => {
      const { getFieldDecorator } = this.props.form;
      if (item.children) {
        return (
          <TreeNode 
            title={<span className='node-title'>
              {this.state.type == 2 && this.state.edit && this.state.num == item.departmentId ? <span>
                <Form>
                  <FormItem style={{display:'inline-block',width:'50%'}}>
                  {getFieldDecorator('departmentNameData',{initialValue:item.departmentName,rules:[{required:true,message:'请输入部门名称',whitespace: true,}]})(
                      <Input placeholder="" />
                  )}
                  </FormItem>
                  <Button type='primary' size='small' onClick={this.handleSubmit}>确定</Button><Button size='small' onClick={this.handleCancel}>取消</Button>
                </Form>
              </span>:
              <span className='node-title'>
                <span className={item.departmentId == this.state.departmentId ? "active" : ""} onClick={this.getDepartmentId.bind(this,item)}>{item.departmentName}</span>
                {item.departmentId == 0 ? null : <Icon type="edit" onClick={this.click.bind(this,item,'edit')} />}
                <Icon type="plus-circle" onClick={this.click.bind(this,item,'add')} />
                {item.departmentId == 0 ? null : <Icon type="minus-circle" onClick={this.click.bind(this,item,'del')} />}
              </span>
               } 
             </span>}
            key={item.departmentId} dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode 
      title={<span className='node-title'>
         {this.state.type == 2 && this.state.edit && this.state.num == item.departmentId ? <span>
          <Form>
            <FormItem style={{display:'inline-block',width:'50%'}}>
            {getFieldDecorator('departmentNameData',{initialValue:item.departmentName})(
                <Input placeholder="" />
            )}
            </FormItem>
            <Button type='primary' size='small' onClick={this.handleSubmit}>确定</Button><Button size='small' onClick={this.handleCancel}>取消</Button>
          </Form>
          </span>:
          <span className='node-title'>
            <span className={item.departmentId == this.state.departmentId ? "active" : ""} onClick={this.getDepartmentId.bind(this,item)}>{item.departmentName}</span>
            {item.departmentId == 0 ? null : <Icon type="edit" onClick={this.click.bind(this,item,'edit')} />}
            <Icon type="plus-circle" onClick={this.click.bind(this,item,'add')} />
            {item.departmentId == 0 ? null : <Icon type="minus-circle" onClick={this.click.bind(this,item,'del')} />}
          </span>
          }
        </span>}
      key={item.departmentId} dataRef={item} />;
    })
   
    // 部门选择
    departmentTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
            {this.departmentTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })

    // 更改部门
    changeDepartment = (id) => {
      this.setState({
        visible:true,
        personId:id
      })
    }
    selectDepartment = (val) => {
      const id = val.substring(val.lastIndexOf('-')+1, val.length)
      this.setState({
        newDepartId:id,
      })
    }
    // 更改部门-确定
    handleOk = () => {
      this.props.form.validateFields((err, values) => {
        if(!err) {
          const params = {
            "personId" : this.state.personId,
            "oldDepartId":this.state.departmentId,
            "newDepartId": this.state.newDepartId
          }
          this.props.dispatch({
            type:'department/changeDepartment',
            payload:params,
            callback:(res) =>{
              if(res.code === 200){
                message.success("部门更改成功")
                this.setState({visible:false})
                this.props.form.resetFields(["departmentName"])
                this.getDepartmentPerson({"departmentId":this.state.departmentId})
              }
            }
          })
        }
      })
    }
    // 更改部门-取消
    modalCancel = () => {
      this.setState({visible:false})
      this.props.form.resetFields(["departmentName"])
    }

    // 设置/取消管理
    setManager = (record,type) => {
      let params = {
        "personId" : record.personId,
        "departId" : this.state.departmentId,
        "isManager" : record.isManager == 0 ? '1' : '0',
      }
      let that = this;
      confirm({
        title: '提示',
        content: type == 1 ? '确定设置为管理员吗？' : '确定取消管理权限吗？',
        onOk() {
          that.props.dispatch({
            type:'department/setManager',
            payload:params,
            callback:(res) => {
              if(res.code === 200){
                message.success(type == 1 ? '设置管理员成功' : '取消管理员成功')
                that.getDepartmentPerson({"departmentId":that.state.departmentId})
              }
            }
          })
        },
        onCancel() {},
      });
    }

    // 批量添加
    batchAdd = () =>{
      let params = {
        page:1,
        prePage:20
      }
      this.getAllPerson(params)
      this.setState({addVisible:true})
    }
    // 获取人员列表
    getAllPerson = (params) =>{
      this.props.dispatch({
        type:'department/getAllPerson',
        payload:params,
        callback:res =>{
          if(res.code == 200){
            this.setState({
              allPerson:res.data,
              dataList:res.data.dataList
            })
          }
        }
      })
    }
    // 批量添加-列表查询
    search = () =>{
      this.props.form.validateFields(["kw", "departmentName1"],(err, values) => {
        const params = {
          "page": 1,
          "prePage": this.state.prePage,
          "kw": values.kw || '',
          "departmentId": values.departmentName1 ? values.departmentName1.substring(values.departmentName1.lastIndexOf('-')+1, values.departmentName1.length):'',
        }
        this.getAllPerson(params)
        this.setState({page:1})
      })
    }
    // 分页
    onPageChange = (current, size) => {
      this.props.form.validateFields(["kw","departmentName1"],(err, values) => {
          this.setState({ page: current, prePage: size })
          const params = {
            "page": current,
            "prePage": size,
            "kw": values.kw || '',
            "departmentId": values.departmentName1 ? values.departmentName1.substring(values.departmentName1.lastIndexOf('-')+1, values.departmentName1.length):'',
          }
          this.getAllPerson(params)
      })
    }
    // 批量添加-重置
    reset = () => {
      this.props.form.resetFields(["kw","departmentName1"])
    }

    // 人员选择
    onSelectChange = selectedRowKeys => {
      this.setState({ 
        selectedRowKeys,
        selectedRowIds : selectedRowKeys.map(Number) 
      });
    };

    // 批量添加-确定
    handleOk1 = () =>{
        let params = {
          "personIds":this.state.selectedRowIds,
          "departmentId":this.state.departmentId
        }
        this.props.dispatch({
          type:'department/batchAddTeacher',
          payload:params,
          callback:res =>{
            if(res.code == 200){
              message.success("添加成功")
              this.setState({
                selectedRowKeys:[],
                selectedRowIds:[],
                addVisible:false
              })
              this.props.form.resetFields(["kw","departmentName1"])
              this.getDepartmentPerson({"departmentId":this.state.departmentId})
            }
          }
        })
    }
    // 批量添加-取消
    modalCancel1 = () =>{
      this.setState({
        addVisible:false,
        selectedRowKeys:[],
        selectedRowIds:[]
      })
      this.props.form.resetFields(["kw","departmentName1"])
    }

    render(){
      const { getFieldDecorator } = this.props.form;
      const { allPerson, dataList, selectedRowKeys, visible,tableData,expandedFlag,departmentId,departmentName,expandedKeys,addVisible, selectNum} = this.state;
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      };
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
      const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      }, {
        title: '性别',
        dataIndex: 'sex',
        render:(record)=>{
          return(<span>{getSexType(record)}</span>)
        }
      }, {
        title: '身份证',
        dataIndex: 'idCardNo',
        render:(record)=>{
          return(<span>{formatIdcard(record)}</span>)
        }
      }, {
        title: '其他证件',
        dataIndex: 'usin',
      }, {
        title: '管理人员',
        dataIndex: 'isManager',
        render:(record)=>{
          return(<span>{record == 0 ? '否' : (record == 1 ? '是' : '')}</span>)
        }
      }, {
        title: '职务',
          dataIndex: 'jobName',
        },{
        title: '操作',
        dataIndex: '',
        width:180,
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.changeDepartment.bind(this,record.personId)}>更改部门</a>&emsp;
            {record.isManager == 1 ? 
              <a href="javascript:;" onClick={this.setManager.bind(this,record,2)}>取消管理</a> :
              <a href="javascript:;" onClick={this.setManager.bind(this,record,1)}>设置管理</a> }
          </span>
        )
      }];
      const columns1 = [{
        title: '姓名',
        dataIndex: 'personName',
      }, {
        title: '性别',
        dataIndex: 'sex',
        render:(record)=>{
          return(<span>{getSexType(record)}</span>)
        }
      }, {
        title: '身份证',
        dataIndex: 'idCardNo',
        render:(record)=>{
          return(<span>{formatIdcard(record)}</span>)
        }
      }, {
        title: '其他证件',
        dataIndex: 'usin',
      }, {
        title: '部门',
        dataIndex: 'departmentName',
      }, {
        title: '管理人员',
        dataIndex: 'isManager',
        render:(record)=>{
          return(<span>{record == 0 ? '否' : (record == 1 ? '是' : '')}</span>)
        }
      }];
     
      return (
        <div className="content-main department">     
          <div className='department-left'>
            <Tree showLine expandedKeys={expandedFlag ? expandedKeys : ['0']} onExpand={this.onExpand}>
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div> 
          <div className='department-right'>
            {departmentId ? <div className="batch-add"><Button type="primary" onClick={this.batchAdd.bind(this)}>批量添加</Button></div> : null}
            <Table className='content-table' columns={columns} dataSource={tableData} pagination={false}/>
          </div>
          <Modal
            title="更改部门"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.modalCancel}
          >
            <Form>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout}  label='部门'>
                    {getFieldDecorator("departmentName",{initialValue:departmentName + '-' + departmentId,rules:[{required:true,message:"请选择部门"}]})(
                      <TreeSelect
                      onChange={this.selectDepartment.bind(this)}
                      showSearch
                      dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                      placeholder="请选择"
                      treeDefaultExpandAll
                      >
                        <TreeNode disabled value={this.state.departmentNodes.departmentName+'-'+this.state.departmentNodes.departmentId} title={this.state.departmentNodes.departmentName} key={this.state.departmentNodes.departmentId}>
                          {this.departmentTreeNodes(this.state.departmentNode)}
                        </TreeNode>
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
            width={1000}
            title="批量添加"
            visible={addVisible}
            onOk={this.handleOk1}
            onCancel={this.modalCancel1}
            className="batchAdd-modal"
          >
            <Form>
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem {...formItemLayout} label='姓名'>
                    {getFieldDecorator('kw')(
                      <Input allowClear placeholder="请输入姓名"/>
                    )}
                  </FormItem>
                </Col> 
                <Col span={8}>
                  <FormItem {...formItemLayout}  label='部门'>
                    {getFieldDecorator("departmentName1")(
                      <TreeSelect
                      allowClear
                      showSearch
                      dropdownStyle={{ maxHeight:180,overflow: 'auto' }}
                      placeholder="请选择"
                      treeDefaultExpandAll
                      >
                        <TreeNode disabled value={this.state.departmentNodes.departmentName+'-'+this.state.departmentNodes.departmentId} title={this.state.departmentNodes.departmentName} key={this.state.departmentNodes.departmentId}>
                          {this.departmentTreeNodes(this.state.departmentNode)}
                        </TreeNode>
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>
                <Col span={10} style={{textAlign:"right"}}>
                  <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
                  <Button onClick={this.reset.bind(this)}>重置</Button>
                </Col>
              </Row>
            </Form>
            {
              selectedRowKeys.length > 0 ? 
              <div className="selectNum">
                <Icon type="info-circle" theme="filled" className="ftColor" />
                <span className="text">已选择&nbsp;</span><span>{selectedRowKeys.length}</span>&nbsp;人
              </div> : null
            }
            <Table rowKey={record=>record.personId} className="pd24" rowSelection={rowSelection} columns={columns1} dataSource={dataList} pagination={false}/>
            <PageIndex getPage={this.onPageChange.bind(this)} total={allPerson.totalCount} totalPage={allPerson.totalPage} currentPage={allPerson.currentPage}/>
          </Modal>
        </div>
      );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    // departmentData:state.user.departmentData,
    // personList:state.person,
    // personData:state.user.teacherAndWorksData
  }
}

export default connect(mapStateToProps)(Form.create()(DepartmentMange));
