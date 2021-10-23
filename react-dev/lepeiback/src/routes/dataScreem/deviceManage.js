import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col, Modal, Radio, message } from 'antd';
import PageIndex from '../../components/page';
import { portUrl, getUpload } from '../../utils/img';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class deviceManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      prePage: 20,
      list: {},
      detailList: [],
      placeDisabled: true, // 场所选择框
      placeDisabled1: true, // 场所选择框-编辑
      placeDisabled2: true, // 场所选择框-添加
      exportUrl: '',
      visible: false,
      visible2: false,
      visible3: false,
      deviceDetail:{}, // 设备详情
      visibleImport:false,
      file:'',
      deviceData:{},
      sheetData:[],
      deviceType:[]
    };
  }
  componentDidMount = () => {
    const params = {
      "page": 1,
      "prePage": 20,
    }
    this.getDeviceList(params)
    this.getDeviceType()
    this.props.dispatch({ //获取建筑列表
      type: 'user/getAllBuildings',
    })
  }

  // 获取设备类型
  getDeviceType = () => {
    this.props.dispatch({
      type: 'dataScreem/getDeviceType',
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            deviceType:res.data
          })
        }
      }
    })
  }
  // 获取设备列表
  getDeviceList = (params) => {
    this.props.dispatch({
      type: 'dataScreem/getDeviceList',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            list: res.data,
            detailList: res.data.dataList
          })
        }
      }
    })
  }

  // 建筑选择
  buildChange = (val) => {
    if (val) {
      this.props.dispatch({ //获取建筑下面的场所
        type: 'user/getAllPlacesByBuild',
        payload: { "buildId": val }
      })
      this.setState({ buildId: val, placeId: '', placeDisabled: false })
    } else {
      this.setState({ buildId: '', placeId: '', placeDisabled: true })
    }
    this.props.form.resetFields(["placeId"])
    console.log(this.state.placeId);
  }
  // 建筑选择
  buildChange1 = (val) => {
    let newData = this.state.deviceDetail
    if (val) {
      this.props.dispatch({ //获取建筑下面的场所
        type: 'user/getAllPlacesByBuild',
        payload: { "buildId": val }
      })
      newData.buildId = val
      newData.placeId = ''
      this.setState({ deviceDetail:newData, placeDisabled1: false })
    } else {
      newData.placeId = ''
      this.setState({ deviceDetail:newData, placeDisabled1: true })
    }
    this.props.form.resetFields(["placeId1"])
  }
  // 建筑选择
  buildChange2 = (val) => {
    if (val) {
      this.props.dispatch({ //获取建筑下面的场所
        type: 'user/getAllPlacesByBuild',
        payload: { "buildId": val }
      })
      this.setState({ buildId2: val, placeId2: '', placeDisabled2: false })
    } else {
      this.setState({ buildId2: '', placeId2: '', placeDisabled2: true })
    }
    this.props.form.resetFields(["placeId2"])
  }


  // 查询
  search = () => {
    this.props.form.validateFields(["kw", "devType", "buildId","placeId"],(err, values) => {
      this.setState({page:1})
      const params = {
        "page": 1,
        "prePage": this.state.prePage,
        "kw": values.kw || '',
        "devType": values.devType || '',
        "buildId": values.buildId || '',
        "placeId": values.placeId || '',
      }
      console.log({ params });
      this.getDeviceList(params)
    })
  }

  // 分页
  onPageChange = (current, size) => {
    this.props.form.validateFields(["kw", "devType", "buildId","placeId"],(err, values) => {
      this.setState({ page: current, prePage: size })
      const params = {
        "page": current,
        "prePage": size,
        "kw": values.kw || '',
        "devType": values.devType || '',
        "buildId": values.buildId || '',
        "placeId": values.placeId || '',
      }
      this.getDeviceList(params)
    })
  }

  // 详情
  seatDetail = (devSn, devType) => {
    let params = {
      devSn,
      devType
    }
    this.props.dispatch({
      type: 'dataScreem/getDeviceDetail',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            visible3:true,
            deviceDetail: res.data,
          })
        }
      }
    })
  }

  handleCance2 = () => {
    this.setState({visible3:false})
  }
  // 编辑
  editSeat = (devSn, devType) => {
    let params = {
      devSn,
      devType
    }
    let that = this
    this.props.dispatch({
      type: 'dataScreem/getDeviceDetail',
      payload: params,
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            deviceDetail: res.data,
            visible: true,
            placeDisabled1:res.data.placeId?false:true,
            oldDevSn: devSn,
            oldDevType: devType,
          })
          if(res.data.placeId){
            that.props.dispatch({ //获取建筑下面的场所
              type: 'user/getAllPlacesByBuild',
              payload: { "buildId": res.data.buildId }
            })
          }
        }
      }
    })
    
  }
  // 编辑确定
  handleOk = () => {
    this.props.form.validateFields(["devSn1", "ip1", "isShow","devType1", "buildId1", "placeId1"],(err, values) => {
      if(!err){
        const params = {
          "oldDevSn": this.state.oldDevSn,
          "oldDevType": this.state.oldDevType,
          "newDevSn": values.devSn1 || '',
          "newDevType": values.devType1 || '',
          "buildId": values.buildId1 || '',
          "placeId": values.placeId1 || '',
          "ip": values.ip1 || '',
          "isShow": values.isShow || '',
        }
        this.props.dispatch({
          type: 'dataScreem/editDevice',
          payload: params,
          callback: (res) => {
            if (res.code === 200) {
              message.success("修改成功")
              this.setState({
                visible:false
              })
              this.props.form.resetFields(["devSn1", "ip1", "isShow","devType1", "buildId1", "placeId1"])
              this.onPageChange(this.state.page,this.state.prePage)
            }
          }
        })
      }
    })
  }
  // 编辑弹框取消
  handleCancel = () => {
    this.setState({ visible: false })
    this.props.form.resetFields(["devSn1", "ip1", "isShow","devType1", "buildId1", "placeId1"])
  }

  // 添加
  add = () =>{
    this.setState({visible2:true})
  }
  // 添加确定
  handleOk1 = () => {
    this.props.form.validateFields(["devSn2", "ip2", "isShow1","devType2", "buildId2", "placeId2"],(err, values) => {
      if(!err){
        const params = {
          "devSn": values.devSn2 || '',
          "devType": values.devType2 || '',
          "buildId": values.buildId2 || '',
          "placeId": values.placeId2 || '',
          "ip": values.ip2 || '',
          "isShow": values.isShow1 || '',
        }
        this.props.dispatch({
          type: 'dataScreem/addDevice',
          payload: params,
          callback: (res) => {
            if (res.code === 200) {
              message.success("添加成功")
              this.setState({
                visible2:false
              })
              this.props.form.resetFields(["devSn2", "ip2", "isShow1","devType2", "buildId2", "placeId2"])
              this.search()
            }
          }
        })
      }
    })
  }
  // 添加弹框取消
  handleCancel1 = () => {
    this.setState({ visible2: false,placeDisabled2:true })
    this.props.form.resetFields(["devSn2", "ip2", "isShow1","devType2", "buildId2", "placeId2"])
  }

  // 删除
  del = (devSn,devType) => {
    let params = {
      devSn,devType
    }
    let that = this;
    confirm({
      title: '提示',
      content: <span>确定要删除这条信息吗？</span>,
      onOk() {
        that.props.dispatch({
          type:'dataScreem/delDevice',
          payload:params,
          callback:(res)=>{
            if(res.code===200){
              message.success('删除成功！')
              that.onPageChange(that.state.page,that.state.prePage)
            }
          }
        })
      },
      onCancel() {},
    });
  }
  // 重置
  reset = () => {
    this.props.form.resetFields(["kw", "devType", "buildId", "placeId"])
    this.setState({ placeDisabled: true })
  }
  // 导出
  export = () => {
    this.props.form.validateFields((err, values) => {
      let token = sessionStorage.getItem("token");
      let userType = sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
      let userId = sessionStorage.getItem("userId");
      let catId = values.catId || '';
      let kw = values.kw || '';
      let devType = values.devType || '';
      let buildId = values.buildId || '';
      let placeId = values.placeId || '';
      let url = portUrl("/manager/devices/export?userId=" + userId + "&userType=" + userType + "&accessToken=" + token + "&catId=" + catId + "&kw=" + kw +
        "&devType=" + devType + "&buildId=" + buildId + "&placeId=" + placeId)
      this.setState({ exportUrl: url })
    })
  }

  // 导入
  deviceImport = () => {
    this.setState({
      visibleImport: true,
    })
  }
  // 文件上传
  changeFile = (e) => {
    const file = e.target.files[0]
    this.setState({
      file: file
    })
  }

  // 导入确定
  importOk = () => {
    if (!this.state.file) {
      message.warning('请先选择文件，再导入！');
      return;
    }
    let params = new FormData()
    params.append('excel', this.state.file)
    this.props.dispatch({
      type: 'dataScreem/importDevice',
      payload: params,
      callback: (res) => {
        this.setState({ file: '' })
        if (res.data.hasError==false) {
          message.success('导入成功！');
          document.getElementById("upload-file").value = ""
          this.search()
          this.setState({
            visibleImport: false
          })
        } else {
          message.warn(res.msg);
          if (res.data.header && res.data.sheetData) {
            let headerArr = []
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
            document.getElementById("upload-file").value = ""
            this.setState({
              deviceData: res.data,
              sheetData:res.data.sheetData,
            })
          }
        }
      }
    })

  };

  //导入取消
  importCancel = () => {
    document.getElementById("upload-file").value = ""
    this.setState({
      visibleImport: false,
      file: null,
      deviceData: {},
      sheetData:[]
    })
  }
  // 设备类型
  typeList = (type) => {
    let name = ''
    this.state.deviceType && this.state.deviceType.map(item =>{
      if(type == item.type){
        name =  item.name
      }
    })
    return name
  }
  render() {
    const { list, detailList, placeDisabled, placeDisabled1, visible, deviceDetail, visible2, placeDisabled2,visible3,sheetData, deviceType } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const formItemLayout1 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };
    const columns = [{
      title: '设备号',
      dataIndex: 'devSn',
    },{
      title: '设备类型',
      dataIndex: 'devType',
      render: (record) => {
        return (<span>{this.typeList(record)}</span>)
      }
    }, {
      title: 'ip地址',
      dataIndex: 'ip',
    }, {
      title: '所在场所',
      dataIndex: 'placeName',
    }, {
      title: '所在建筑',
      dataIndex: 'buildName',
    }, {
      title: '是否显示画面',
      dataIndex: 'isShow',
      render: (record) => {
        return (<span>{record == 0 ? "否" : (record == 1 ? "是" : '')}</span>)
      }
    }, {
      title: '操作',
      dataIndex: '',
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={this.seatDetail.bind(this, record.devSn, record.devType)}>详情&emsp;</a>
          <a href="javascript:;" onClick={this.editSeat.bind(this, record.devSn, record.devType)}>编辑&emsp;</a>
          <a href="javascript:;" onClick={this.del.bind(this, record.devSn, record.devType)}>删除</a>
        </span>
      )
    }];
    const { buildingList, placeList } = this.props;
    const buildChildren = [];
    buildingList && buildingList.map(item => {
      return buildChildren.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
    })
    const placeChildren = [];
    placeList && placeList.map(item => {
      return placeChildren.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
    })
    let typeOption = []
    deviceType && deviceType.map(item => {
      return typeOption.push(<Option value={item.type} key={item.type}>{item.name}</Option>);
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
      <div className="content-main device-manage">
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={5}>
              <FormItem >
                {getFieldDecorator('kw')(
                  <Search
                    placeholder="设备号/ip"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={'类型'}>
                {getFieldDecorator("devType", { initialValue: '' })(
                  <Select showSearch>
                    <Option value=''>全部</Option>
                    {typeOption}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label='建筑'>
                {getFieldDecorator('buildId', { initialValue: '' })(
                  <Select
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={this.buildChange}
                    showSearch
                  >
                    <Option value=''>全部</Option>
                    {buildChildren}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label='场所'>
                {getFieldDecorator('placeId', { initialValue: '' })(
                  <Select
                    placeholder="请选择"
                    optionFilterProp="children"
                    disabled={placeDisabled}
                    showSearch
                  >
                    <Option value=''>全部</Option>
                    {placeChildren}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>&emsp;
              <Button onClick={this.reset.bind(this)}>重置</Button>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} >
              <Button type='primary' onClick={this.add.bind(this)}>添加</Button>&emsp;
              <Button type='primary' onClick={this.deviceImport.bind(this)}>导入</Button>&emsp;
              <a target="" rel="noopener noreferrer" href={this.state.exportUrl} onClick={this.export.bind(this)}><Button type='primary'>导出</Button></a>

            </Col>
          </Row>
        </Form>
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false} />
        <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage} />
        <Modal
          width={600}
          title="编辑"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'类型'}>
                  {getFieldDecorator("devType1",{ initialValue: deviceDetail.devType?deviceDetail.devType:'' })(
                    <Select showSearch>
                      {typeOption}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <Form.Item {...formItemLayout1} label="是否显示画面">
                  {getFieldDecorator('isShow',{ initialValue: deviceDetail.isShow?deviceDetail.isShow:'' })(
                    <Radio.Group>
                      <Radio value="1">显示</Radio>
                      <Radio value="0">不显示</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'设备号'}>
                  {getFieldDecorator("devSn1", { initialValue: deviceDetail.devSn?deviceDetail.devSn:''})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'ip'}>
                  {getFieldDecorator("ip1", { initialValue: deviceDetail.ip?deviceDetail.ip:'' })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label='建筑'>
                  {getFieldDecorator('buildId1',{initialValue: deviceDetail.buildId?deviceDetail.buildId:''})(
                    <Select
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.buildChange1}
                      showSearch
                    >
                      {buildChildren}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label='场所'>
                  {getFieldDecorator('placeId1',{initialValue: deviceDetail.placeId?deviceDetail.placeId:''})(
                    <Select
                      placeholder="请选择"
                      optionFilterProp="children"
                      disabled={placeDisabled1}
                      showSearch
                    >
                      {placeChildren}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          width={600}
          title="添加"
          visible={visible2}
          onOk={this.handleOk1}
          onCancel={this.handleCancel1}
        >
          <Form>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'类型'}>
                  {getFieldDecorator("devType2")(
                    <Select showSearch placeholder="请选择">
                      {typeOption}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <Form.Item {...formItemLayout1} label="是否显示画面">
                  {getFieldDecorator('isShow1')(
                    <Radio.Group>
                      <Radio value="1">显示</Radio>
                      <Radio value="0">不显示</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'设备号'}>
                  {getFieldDecorator("devSn2")(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label={'ip'}>
                  {getFieldDecorator("ip2")(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label='建筑'>
                  {getFieldDecorator('buildId2')(
                    <Select
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.buildChange2}
                      showSearch
                    >
                      {buildChildren}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} >
              <Col span={22}>
                <FormItem {...formItemLayout1} label='场所'>
                  {getFieldDecorator('placeId2')(
                    <Select
                      placeholder="请选择"
                      optionFilterProp="children"
                      disabled={placeDisabled2}
                      showSearch
                    >
                      {placeChildren}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          className="device-detail-modal"
          width={600}
          title="详情"
          visible={visible3}
          onCancel={this.handleCance2}
          footer={<Button type="primary" onClick={this.handleCance2}>返回</Button>}
        >
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>类型：</span>{this.typeList(deviceDetail.devType)}</Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>是否显示画面：</span>{deviceDetail.isShow == 0 ? "不显示" : (deviceDetail.isShow == 1 ? "显示" : '')} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>设备号：</span>{deviceDetail.devSn} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>ip：</span>{deviceDetail.ip} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>建筑名称：</span>{deviceDetail.buildName} </Col>
          </Row>
          <Row gutter={24} className="margin">
            <Col offset={2} span={20}><span>场所名称：</span>{deviceDetail.placeName} </Col>
          </Row>
        </Modal>  
        <Modal
          className="import-device-modal"
          title="批量导入"
          width={800}
          visible={this.state.visibleImport}
          onOk={this.importOk.bind(this)}
          onCancel={this.importCancel.bind(this)}
        >
          <label>请选择文件：</label>
          <form style={{ display: "inline-block" }}>
            <input type="file" id="upload-file" name="file" onChange={this.changeFile.bind(this)} />
          </form>
          <a href={getUpload("设备信息导入模板.xls")}>下载模板</a>
          <p className="tips">支持扩展名：.xls,.xlsx, excel表中红色字段为必填。</p>
          <div className="table-box">
              <table border="1" className="import-table">
                <thead>
                  <tr>
                    {
                      (this.state.deviceData.error == false) && this.state.deviceData.headerArr.map(item => {
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

const mapStateToProps = (state) => {
  return {
    buildingList: state.user.buildingList,
    placeList: state.user.placeList
  }
}

export default connect(mapStateToProps)(Form.create()(deviceManage));
