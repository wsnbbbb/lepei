import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, TreeSelect, message, Select, Upload, Icon, Modal } from 'antd';
import { getImg, } from '../../utils/img';
import ImgCutter from '../../components/imgCutter'
import './style.less';
import { log } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const confirm = Modal.confirm;
const { SHOW_PARENT } = TreeSelect;

class aerialView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgPath: '',
      cropVisible: false,
      cropSrc: '',
      points: [],
      treeData: [],
      deviceType:[],
      devSns:[]

    }
  }
  componentDidMount = () => {
    this.aerialViewDetail()
    this.aerialViewPoints()
    this.getDeviceType()
    this.getAllDevices()

    sessionStorage.removeItem("qiniuToken");
    this.props.dispatch({ //获取上传图片token
      type: 'user/getPicToken',
      callback: (res) => {
        if (res.code === 200) {
          sessionStorage.setItem("qiniuToken", res.data.token)
          this.setState({ qiniuToken: res.data.token })
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
      type: 'dataScreem/aerialViewPoints',
      callback: (res) => {
        if (res.code === 200) {
          let data = res.data
          data && data.map(item => {
            let devSns = []
            item.devices.length > 0 && item.devices.map(v => {
              devSns.push(v.devType+'~'+ v.devSn)
            })
            item.isShow = false
            item.xCoordinate = Number(item.xCoordinate) - 17
            item.yCoordinate = Number(item.yCoordinate) - 34
            item.devSns = devSns
            console.log({devSns});
          })
          this.setState({
            points: data,
          })
        }
      }
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
  // 设备名称
  typeList = (type) => {
    let name = ''
    this.state.deviceType && this.state.deviceType.map(item =>{
      if(type == item.type){
        name =  item.name
      }
    })
    return name
  }
  

  // 获取树状所有设备
  getAllDevices = () => {
    this.props.dispatch({
      type: 'dataScreem/getAllDevices',
      callback: (res) => {
        if (res.code === 200) {
          let treeData = []
          res.data && res.data.map(item => {
            let children = []
            if (item.devices && item.devices.length > 0) {
              item.devices.map(child => {
                if(item.devType == child.devType){
                  children.push({
                    title: !child.buildName || !child.placeName ? child.devSn : child.buildName + '~' + child.placeName + '（' + child.devSn + '）',
                    value: child.devType + '~' + child.devSn,
                    key: child.devType+ '~' +child.devSn
                  })
                }
              })
            }
            treeData.push({
              title: item.devName,
              value: item.devType+ '~n',
              key: item.devType,
              children:children
            })
          })
          this.setState({
            treeData: treeData,
            devTypes:res.data
          })
        }
      }
    })
  }

  
  test = (type) => {
    let arr = []
    this.state.devTypes && this.state.devTypes.map(item =>{
      if(type == item.devType){
        item.devices && item.devices.map(v =>{
          arr.push({
            "devType":v.devType,
            "devSn":v.devSn
          })
        })
      }
    })
    return arr
  }

  // 上传图片
  beforeUpload = (file) => {
    // console.log({ file });
    let imageType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    let isImage = imageType.findIndex(o => o === file.type) !== -1;
    if (!isImage) {
      message.error('请选择正确的图片类型!');
      return false;
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('图片大小不能超过2M!');
    //   return false;
    // }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let _this = this;
    reader.onload = (e) => {
      _this.setState({
        cropSrc: e.target.result,
        cropVisible: true,
      })
    }
    return new Promise((resolve, reject) => {
      let index = setInterval(() => {
        if (this.blob) {  // 监听裁剪是否完成
          window.clearInterval(index);
          this.blob.uid = file.uid;   // 需要给裁剪后的blob对象设置uid，否则会报错！
          this.blob.name = file.name
          resolve(this.blob);   // 执行后续的上传操作
        }
      }, 100);
    });
  }

  handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({ imgPath: info.file.response.id })
      this.props.dispatch({
        type: 'dataScreem/aerialViewSet',
        payload: { "aerialView": info.file.response.id },
        callback: (res) => {
          if (res.code === 200) {
            message.success(`${info.file.name} 上传成功！`);
          }
        }
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  // 裁剪
  handleOk = (dataUrl) => {
    this.setState({
      cropVisible: false
    });
    this.blob = dataUrl;
  }
  // 裁剪取消
  handleCropCancel = () => {
    this.setState({
      cropVisible: false
    });
  }


  // 设备选择
  selectPlace = (index, value) => {
    console.log({value});
    let newArr = this.state.points
    newArr.map((item, idx) => {
      if (index == idx) {
        item.devSns = value
      }
    })
    this.setState({ points: newArr })
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
      devices:[]
    })
    this.setState({ points: newArr })
  }

  // 点击设备名称
  toggle = (index) => {
    let newArr = this.state.points
    newArr.map((item, idx) => {
      if (index == idx) {
        item.isShow = true
      }
    })
    this.setState({ points: newArr })
  }
  // 保存
  save = () => {
    let dataArr = this.state.points
    console.log(this.state.points);
    let paramsArr = []
    let flag = false
    dataArr.map(item => {
      if(item.devSns.length == 0){
        flag = true
      }
      let devices = []
      item.devSns.map(val =>{
        let ids = val.split('~')
        if(ids[1] == 'n'){
          let arr = this.test(ids[0])
          devices.push(...arr)
        }else{
          devices.push({
            "devType":ids[0],
            "devSn":ids[1]
          })
        }
      })
      paramsArr.push({
        "xCoordinate": Number(item.xCoordinate) + 17,
        "yCoordinate": Number(item.yCoordinate) + 34,
        "devices": devices,
      })
    })
    if(flag){
      return message.error("点位不能为空")
    }
    console.log({ paramsArr });
    this.props.dispatch({
      type: 'dataScreem/savePointPosition',
      payload: { "points": paramsArr },
      callback: (res) => {
        if (res.code === 200) {
          message.success("保存成功")
          this.aerialViewPoints()
        }
      }
    })
  }
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
    const { imgPath, points, cropVisible, cropSrc, treeData ,devSns} = this.state
    const qiniuToken = sessionStorage.getItem('qiniuToken');
    const props = {
      name: 'file',
      action: 'https://upload.qiniup.com/',
      accept: "image/jpg,image/jpeg,image/png",
      headers: {
        authorization: 'authorization-text',
        "Content-Disposition": 'form-data; name="file";'
      },
      data: {
        token: qiniuToken ? qiniuToken : this.state.qiniuToken,
      },
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload
    };
    // let options = []
    // treeData && treeData.map(item => {
    //   let children = []
    //   if (item.devices && item.devices.length > 0) {
    //     item.devices.map(child => {
    //       if(item.devType == child.devType){
    //         return children.push(<TreeNode value={child.devType + '~' + child.devSn} title={'（'+item.devName+'）'+child.devSn} key={child.devType+ '~' +child.devSn} />)
    //       }
    //     })
    //     return options.push(<TreeNode value={item.devType+ '~n'} title={item.devName} key={item.devType}>{children}</TreeNode>)
    //   }
    // })
    return (
      <div className="content-main aerial-view">
        <div className="btns">
          {/* <Upload
            {...props}
            showUploadList={false}
          > 
            <Button type="primary">上传图片</Button>
          </Upload>&emsp;&emsp; */}
          <Button type="primary" onClick={this.addPoint.bind(this)}>添加点位</Button>&emsp;&emsp;
          <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
        </div>
        {imgPath ?
          <div className="upload-img">
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
                    {
                      item.isShow == false ? <div className="placeName" onClick={this.toggle.bind(this, index)}>
                        {item.devices.length > 0 && item.devices[0].buildName && item.devices[0].placeName ? item.devices[0].buildName + '~' + item.devices[0].placeName : item.devices[0].devSn}</div> :
                        <TreeSelect
                          placeholder="请选择"
                          showSearchvalue
                          allowClear
                          treeCheckable
                          treeData={treeData}
                          showCheckedStrategy='SHOW_PARENT'
                          value={item.devSns||[]}
                          treeDefaultExpandAll
                          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                          style={{ width: 120 }}
                          onChange={this.selectPlace.bind(this, index)}
                        >
                        </TreeSelect>
                    }
                    <Icon type="minus-circle" className="del" onClick={this.pointDel.bind(this, item.id, index)} />
                  </div>
                })
              }
            </div>
          </div> : null
        }
        <Modal visible={cropVisible} footer={null} onCancel={this.handleCropCancel} width={600}>
          <ImgCutter aspectRatio={434 / 309} src={cropSrc} onOk={this.handleOk} />
        </Modal>

      </div>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    buildingList: state.user.buildingList,
  }
}

export default connect(mapStateToProps)(Form.create()(aerialView));