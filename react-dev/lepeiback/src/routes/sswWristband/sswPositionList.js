import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col,Modal,Alert,message,Menu,Icon,Dropdown} from 'antd';
import PageIndex from '../../components/page';
import {formatDate,formatPhone} from '../../utils/public';
import {getImg} from '../../utils/img';
import './style.less';
import { sswPositionDetail } from '../../services';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;

class SswPositionList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page:1,
          prePage:20,
          visible:false,
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
      }
      this.getPositionLists(params)
      this.props.dispatch({
        type:'user/getAllBuildings'
      })
    }
    getPositionLists=(params)=>{
      this.props.dispatch({
        type:'sswWristband/getSswPositionList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "buildId":values.buildId,
        }
        this.getPositionLists(params)
        this.setState({page:1})
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "buildId":values.buildId,
        }
        this.getPositionLists(params)
      })
    }
    // 删除
    showConfirm=(id)=> {
      let me=this;
      confirm({
        title: '提示',
        content: <span>确定要删除这条信息吗？</span>,
        onOk() {
          me.props.dispatch({
            type:'sswWristband/delSswPosition',
            payload:{"positionId":id},
            callback:(res)=>{
              if(res.code===200){
                message.success('删除成功！',3)
                me.props.form.validateFields((err, values) => {
                  const params={
                    "page":me.state.page,
                    "prePage":me.state.prePage,
                    "kw":values.kw||'',
                    "buildId":values.buildId,
                  }
                  me.getPositionLists(params)
                })
              }
            }
          })
        },
        onCancel() {},
      });
    }
    showModal = (type,record) => {
        console.log(type,record)
        this.props.form.resetFields(['positionId','build','remark']);
        this.setState({
          visible: true,
          typeId:type
        });
        if(type==2){
          this.props.dispatch({
            type:'sswWristband/sswPositionDetail',
            payload:{"positionId":record.positionId},
            callback:(res)=>{
              if(res.code===200){
                this.props.dispatch({
                  type:'user/getAllPlacesByBuild',
                  payload:{"buildId":res.data.buildId},
                })
                this.setState({placeId:res.data.placeId})
              }
            }
          })
          this.setState({
            itemDate:record
          });
        }
        
    }
    handleOk = (e) => {  
      console.log(this.state.typeId)
      this.props.form.validateFields((err, values) => {
        if(!this.state.placeId){
          return message.error('请选择场所名称',2)
        }
        if(!err){
          const params={
            "positionId":values.positionId,
            "placeId":this.state.placeId,
            "remark":values.remark
          }
          this.props.dispatch({
            type:this.state.typeId==1?'sswWristband/setSswPosition':'sswWristband/updateSswPosition',
            payload:this.state.typeId==1?params:{id:this.state.itemDate.positionId,...params},
            callback:(res)=>{
              if(res.code===200){
                message.success(this.state.typeId==1?"添加成功":"编辑成功",2)
                const params={
                  "page":1,
                  "prePage":20,
                }
                this.getPositionLists(params)
                this.props.form.resetFields(['positionId','build','remark']);
                this.setState({
                  visible: false,placeId:''
                });
              }
            }
          })
        }
      })
    }
    handleCancel = (e) => {
      this.props.form.resetFields(['positionId','build','remark']);
        this.setState({
            visible: false,placeId:''
        });
    }
    buildChange=(val)=>{
      if(val){
        this.props.dispatch({
          type:'user/getAllPlacesByBuild',
          payload:{"buildId":val},
        })
        this.setState({placeId:''})
      }else{
        this.setState({placeId:''})
      }
    }
    placeChange=(val)=>{
      this.setState({placeId:val})
    }
    render(){
        const columns = [{
            title: '位置ID',
            dataIndex: 'positionId',
            key: 'positionId',
          }, {
            title: '所属建筑',
            dataIndex: 'buildName',
            key: 'buildName',
          }, {
            title: '场所名称',
            dataIndex: 'placeName',
            key: 'placeName',
          }, {
            title: '备注',
            dataIndex: 'remark',         
            key: 'remark',   
          },{
            title: '操作',
            dataIndex: '',
            width:100,
            fixed:'right',
            render:(text, record) => (
              <span className="make-box">
                <a href="javascript:;" className="check-btn" onClick={this.showModal.bind(this,2,record)}>编辑</a> 
                <Dropdown overlay={<Menu>
                  <Menu.Item>
                  <span onClick={this.showConfirm.bind(this,record.positionId)}>删除</span>
                  </Menu.Item>
                </Menu>}><Icon type="ellipsis" /></Dropdown>
              </span>
            )
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {sswPositionLists,buildingList,placeList,positionDetail} = this.props;
          const {typeId} = this.state;
          if(!sswPositionLists){
            return null;
          }
          const buildChildren = [];
          buildingList&&buildingList.map(item=>{
              return buildChildren.push(<Option key={item.id}>{item.name}</Option>);
          }) 
          const placeChildren = [];
          placeList&&placeList.map(item=>{
              return placeChildren.push(<Option key={item.id}>{item.name}</Option>);
          }) 
        return (
            <div className="content-main">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="位置ID/场所名称"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'所属建筑'}>
                      {getFieldDecorator("buildId",{initialValue:''})(
                        <Select
                            placeholder="请选择"
                            optionFilterProp="children"
                            showSearch
                        >
                            <Option key='' value=''>请选择</Option>
                            {buildChildren}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.showModal.bind(this,1)}>添加</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={sswPositionLists.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={sswPositionLists.totalCount} totalPage={sswPositionLists.totalPage} currentPage={sswPositionLists.currentPage}/>
              <Modal
                title={typeId==1?"添加终端":"编辑终端"}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form className="ant-advanced-search-form content-form">
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'位置ID'}>
                        {getFieldDecorator('positionId',{initialValue:typeId==2&&positionDetail&&positionDetail.positionId||'',rules:[{required:true, message:'请输入',whitespace: true}]})(
                          <Input placeholder="请输入位置ID" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'所属建筑'}>
                        {getFieldDecorator("build",{initialValue:typeId==2&&positionDetail&&positionDetail.buildId||'',rules: [{required: true, message:"请选择"}]})(
                          <Select
                              placeholder="请选择"
                              optionFilterProp="children"
                              onChange={this.buildChange}
                              showSearch
                          >
                              
                              {buildChildren}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'场所名称'}>
                          <Select
                              placeholder="请选择"
                              optionFilterProp="children"
                              onChange={this.placeChange}
                              showSearch
                              value={this.state.placeId}
                          >
                              <Option key='' value=''>请选择</Option>
                              {placeChildren}
                          </Select>
                      </FormItem>
                    </Col> 
                  </Row>
                  <Row gutter={24}>
                    <Col span={18}>
                      <FormItem {...formItemLayout} label={'备注'}>
                        {getFieldDecorator('remark',{initialValue:typeId==2&&positionDetail&&positionDetail.remark||''})(
                          <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                      </FormItem>
                    </Col> 
                  </Row>
                </Form>            
              </Modal>
            </div>
        );
    }
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     sswPositionLists:state.sswWristband,
     buildingList:state.user.buildingList,
     placeList:state.user.placeList,
     positionDetail:state.sswWristband.positionDetail
  }
}
export default connect(mapStateToProps)(Form.create()(SswPositionList));
