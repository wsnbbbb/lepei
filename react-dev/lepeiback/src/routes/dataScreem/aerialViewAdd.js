import React, { Component } from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';
import { Form, Row, Breadcrumb, Col, Button, TreeSelect, message, Select, Upload, Icon, Modal } from 'antd';
import { getImg, } from '../../utils/img';
import ImgCutter from '../../components/imgCutter'
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const confirm = Modal.confirm;
const { SHOW_PARENT } = TreeSelect;
import { Slider } from 'antd';
import { RabbitLegacy } from 'crypto-js';

class aerialViewAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgPath: '',
      cropVisible: false,
      cropSrc: '',
      points: [],
      buildList: [],
      brightness: 0,
      currentBuildId: [],
    }
  }
  componentDidMount = () => {
    this.aerialViewDetail()
    this.aerialViewPoints()
    this.getAllBuildings()
  }

  componentWillUnmount = () => {
      
}

  getAllBuildings = () => {
    this.props.dispatch({
      type: 'dataScreem/getAllBuildings',
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            buildList: res.data
          })
        }
      }
    })
  }
  // 获取地图详情
  aerialViewDetail = () => {
    this.props.dispatch({
      type: 'dataScreem/aerialViewDetail',
      callback: (res) => {
        if (res.code === 200) {
          this.setState({
            imgPath: res.data.aerialView
          })
        }
      }
    })
  }
  // 获取点位列表
  aerialViewPoints = () => {
    this.props.dispatch({
      type: 'dataScreem/getBuildPoints',
      callback: (res) => {
        if (res.code === 200) {
          let data = res.data.builds
          let arr = []
          data && data.map(item => {
            item.xCoordinate = Number(item.xCoordinate) - 17
            item.yCoordinate = Number(item.yCoordinate) - 34
            item.buildId = item.buildId
            arr.push(item.buildId)
          })
          this.setState({
            points: data,
            brightness: Number(res.data.brightness),
            currentBuildId: arr
          })          
        }
      }
    })
  }


  // 建筑选择
  selectBuild = (index, value) => {
    console.log({value});
    let newArr = this.state.points
    newArr.map((item, idx) => {
      if (index == idx) {
        item.buildId = value
      }
    })
    let arr = []
    this.state.points.map(i=>{
      arr.push(i.buildId)
    })
    this.setState({ 
      points: newArr,
      currentBuildId: arr
     })
  }

  // 鼠标按下事件
  fnDown = (index, ev) => {
    // console.log({ev});
    let flag = true
    // 获取元素
    let bigBox = document.querySelector(".upload-img");
    let sBox = document.querySelector(".point_" + index);
    // 获取小盒子的间距
    let sbox_l = sBox.offsetLeft;
    let sbox_t = sBox.offsetTop;
    // 获取鼠标在盒子中的位置
    let disX = ev.pageX - sbox_l;
    let disY = ev.pageY - sbox_t;
    this.setState({
      disX, disY, flag,
      boxIndex: index
    })
    // console.log(ev.pageX,ev.pageY)
    // console.log(disX,disY)
    // console.log(sBox.offsetWidth, sBox.offsetHeight)
    document.addEventListener('mousemove', this.fnMove);
    document.addEventListener('mouseup', this.fnUp);
  }
  // 鼠标移动
  fnMove = (e) => {
    if (this.state.flag) {
      // 获取元素
      let bigBox = document.querySelector(".upload-img");
      let sBox = document.querySelector(".point_" + this.state.boxIndex);
      // 获取图片的大小
      let bigbox_w = bigBox.offsetWidth;
      let bigbox_h = bigBox.offsetHeight;
      // 获取小盒子的大小
      let sbox_w = sBox.offsetWidth;
      let sbox_h = sBox.offsetHeight;
      // 元素在大盒子的位置
      let moveX = e.pageX - this.state.disX;
      let moveY = e.pageY - this.state.disY;
      // 判断临界点
      if (moveX < 0) {
        moveX = 0;
      }
      if (moveY < 0) {
        moveY = 0;
      }
      if (moveX > bigbox_w - sbox_w) {
        moveX = bigbox_w - sbox_w;
      }
      if (moveY > bigbox_h - sbox_h) {
        moveY = bigbox_h - sbox_h;
      }
      this.setState({
        moveX, moveY
      })
      sBox.style.left = moveX + 'px';
      sBox.style.top = moveY + 'px';
      // console.log(moveX, moveY);
    }
  }

  // 鼠标抬起
  fnUp = (e) => {
    let newArr = this.state.points
    newArr.map((item, idx) => {
      if (this.state.boxIndex == idx) {
        item.xCoordinate = this.state.moveX
        item.yCoordinate = this.state.moveY
      }
    })
    this.setState({
      points: newArr,
      flag: false
    })
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  // 添加点位
  addPoint = () => {
    let newArr = this.state.points
    newArr.push({
      xCoordinate: '',
      yCoordinate: '',
    })
    this.setState({ points: newArr })
  }

  back = () => {
    window.history.go(-1)
  }
  // 保存
  save = () => {
    let dataArr = this.state.points
    console.log(this.state.points);
    let paramsArr = []
    let flag = false
    dataArr.map(item => {
      if(!item.buildId){
        flag = true
      }
      paramsArr.push({
        "xCoordinate": Number(item.xCoordinate) + 17,
        "yCoordinate": Number(item.yCoordinate) + 34,
        "buildId": item.buildId,
      })
    })
    if(flag){
      return message.error("点位不能为空")
    }
    console.log({ paramsArr });
    let _this = this
    this.props.dispatch({
      type: 'dataScreem/setBuildPoints',
      payload: { "points": paramsArr , brightness: _this.state.brightness},
      callback: (res) => {
        if (res.code === 200) {
          message.success("保存成功")
          this.aerialViewPoints()
        }
      }
    })
  }
  onChange = value => {
    this.setState({
      brightness: value,
    });
  };
  // 点位删除
  pointDel = (id, index) => {
    let that = this;
    if (id) {
      confirm({
        title: '提示',
        content: <span>确定要删除该点位吗？</span>,
        onOk() {
          that.props.dispatch({
            type: 'dataScreem/pointDel',
            payload: { id },
            callback: (res) => {
              if (res.code === 200) {
                message.success('删除成功！')
                that.aerialViewPoints()
              }
            }
          })
        },
        onCancel() { },
      });
    } else {
      let newArr = this.state.points
      newArr.map((item, idx) => {
        if (index == idx) {
          newArr.splice(idx,1);
        }
      })
      this.setState({ points: newArr })
    }
  }

  render() {
    const { imgPath, points, cropVisible, cropSrc, treeData ,devSns, buildList} = this.state
    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    let children = [];
    buildList&&buildList.length>0&&buildList.map(item=>{
      return children.push(<Option key={item.id} disabled={this.state.currentBuildId.includes(item.id)}>{item.name}</Option>);
    })
    return (
      <div className="content-main aerial-view">
        <div className="breadcrumb">
            <Breadcrumb>
                <Breadcrumb.Item>基础管理</Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/place-manage">场所管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/build-manage">建筑管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>点位图配置</Breadcrumb.Item>
            </Breadcrumb>
            <h3>点位图配置</h3>
        </div>
        <div className="btns">
        <Row gutter={24}>
            <Col span={2}>
              <Button type="primary" onClick={this.addPoint.bind(this)}>添加点位</Button>&emsp;&emsp;
            </Col>
            <Col span={18}>
            <FormItem {...formItemLayout} label={'背景亮度'}>
              <Slider min={0} max={100} onChange={this.onChange.bind(this)} value={this.state.brightness} width={100}  />
            </FormItem>
            </Col>
            <Col span={4}>
              <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;
              <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            </Col>
        </Row>  

        </div>
        {imgPath ?
          <div className="upload-img">
            <div className="mask-img" style={{background: "rgba(0, 0, 0,"+ this.state.brightness/100+")"}}></div>
            <img src={getImg(imgPath)} alt="coverImg" />
            <div>
              {
                points && points.map((item, index) => {
                  return <div
                    key={index}
                    className={`${'point_' + index} points`}
                    style={{ "top": item.yCoordinate + 'px', "left": item.xCoordinate + 'px' }}
                  >
                    <Icon onMouseDown={this.fnDown.bind(this, index)} type="environment" theme="filled" className="icon" />
                        <Select
                          placeholder="请选择"
                          value={item.buildId||undefined}
                          style={{ width: 120 }}
                          onChange={this.selectBuild.bind(this, index)}
                        >
                        {children}
                        </Select>
                    <Icon type="minus-circle" className="del" onClick={this.pointDel.bind(this, item.id, index)} />
                  </div>
                })
              }
            </div>
          </div> : null
        }
      </div>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    buildingList: state.user.buildingList,
  }
}

export default connect(mapStateToProps)(Form.create()(aerialViewAdd));