import React,{Component} from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import './style.less';
import { getImg } from '../utils/img';
import { log } from 'util';
import { xiaopingtaiUrl } from '@/config'
const { SubMenu } = Menu;

class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page:1,
      prePage:20,
      menu: JSON.parse(sessionStorage.getItem("menu")),
      third: {
        "changhong": this.toChanghong,
        "hik-vision": this.tohik,
        "read-paper": this.toReadPaper,
        "wei-gen": this.toWeigen,
        "blueTooth": this.toBlueTooth,
        "class-brand": this.classBrand,
        "yuangaofen": this.toYuangaofen,
        "vanlon": this.toVanlon,
        "xiaopingtai": this.toXiaopingtai,
        "toShishi": this.toShishi,

      }
    };
  }
  state = {
    mode: 'inline',
  }


  tohik=()=>{
    this.props.dispatch({
      type:"user/hikVision",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }
  toChanghong=()=>{
    this.props.dispatch({
      type:"user/changhongSystem",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }
  toReadPaper=()=>{
    this.props.dispatch({
      type:"user/readPaperSystem",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }
  toWeigen=()=>{
    this.props.dispatch({
      type:"user/weigen",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl + '?type=1&code='+ encodeURIComponent(res.data.code))
        }
      }
    })
  }
  classBrand=()=>{
    this.props.dispatch({
      type:"user/classBrand",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl + '?code='+encodeURIComponent(res.data.code))
        }
      }
    })
  }
  toYuangaofen=()=>{
    this.props.dispatch({
      type:"user/yuangaofen",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }
  toVanlon=()=>{
    this.props.dispatch({
      type:"user/vanlon",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }

  toBlueTooth=()=>{
    this.props.dispatch({
      type:"user/weigen",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl + '?type=2&code='+encodeURIComponent(res.data.code))
        }
      }
    })
  }

  // 学校自我诊断
  toShishi=()=>{
    this.props.dispatch({
      type:"user/redirectSwyd",
      callback:(res)=>{
        if(res.code===200){
          window.open(res.data.serviceUrl)
        }
      }
    })
  }


  toThird=(action)=>{
    this.state.third[action]()
  }

  toXiaopingtai=()=>{
    window.open(xiaopingtaiUrl+'?'+window.btoa(window.encodeURIComponent("schoolId="+localStorage.getItem("schoolId"))))
  }

  // toOutsideApply = () =>{
  //   window.open(outsideApplyUrl + '?' + window.btoa("schoolId=" + localStorage.getItem("schoolId")))
  // }


  generateIcon=(action)=>{
    let iconConfig={
      "school-manage": "bank",
      "education-manage": "profile",
      "teaching-manage": "schedule",
      "logistics-manage": "switcher",
      "3rd-platform": "ie",
      "system-setting": "setting"
    }
    return iconConfig[action] ? iconConfig[action] : "shop"
  }
  render() {
    const mode=this.props.mode;
    const menu=this.state.menu;
    const schoolName = localStorage.getItem("schoolName")
    const third = this.state.third
    return (
      <div className="g-layout-slider">
        <div className="g-layout-title">
            <img src={getImg(localStorage.getItem("logo"))} className='logo-school' alt=""/>
            <h2>乐陪校园综合管理平台</h2>
            <h4>{schoolName}</h4>
        </div>
        <Menu
          style={{ width: 200 }}
          defaultSelectedKeys={['sub1']}
          mode={mode}
          theme='dark'
        >
        {
          menu&&menu.map((item)=>{
            return  <SubMenu key={item.nodeId} title={<span><Icon type={this.generateIcon(item.action)}/><span>{item.title}</span></span>}>
                      {
                        item.children&&item.children.map((i)=>{
                          if(i.children){
                              return <SubMenu key={i.nodeId} title={i.title}>
                                      {i.children.map((e)=>{
                                        return Object.keys(third).includes(e.action)?<Menu.Item key={e.nodeId} onClick={this.toThird.bind(this, e.action)}>{e.title}</Menu.Item>:
                                        <Menu.Item key={e.nodeId}><Link to={"/"+e.action}>{e.title}</Link></Menu.Item>
                                      })}
                                    </SubMenu>
                          }else{
                              return Object.keys(third).includes(i.action)?<Menu.Item key={i.nodeId} onClick={this.toThird.bind(this, i.action)}>{i.title}</Menu.Item>:
                              <Menu.Item key={i.nodeId}><Link to={"/"+i.action}>{i.title}</Link></Menu.Item>
                          }
                        })
                      }
              </SubMenu>
          })
        }
        </Menu>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Sider);
