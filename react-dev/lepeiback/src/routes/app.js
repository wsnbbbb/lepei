import React,{Component} from 'react';
import { connect } from 'dva';
import { Icon, Button, ConfigProvider,Tooltip,Modal,Breadcrumb } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import Slider from '../components/slider';
import { getImg } from '../utils/img';
import { routerRedux } from 'dva/router';
import { portUrl } from '../utils/img';
import './app.less';
import { log } from 'util';
const confirm = Modal.confirm;

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            mode:'inline'
        };
    }
    componentDidMount=()=>{
        this.props.dispatch({
            type:'user/getInformation',
        })   
    }
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
          mode:this.state.mode==='inline'?'vertical':'inline'
        });
    }
    turnto=()=>{
        this.props.dispatch(routerRedux.push("/edit-information"))
    }
    showConfirm=()=> {
        let me=this;
        let authFrom = sessionStorage.getItem("authFrom")
        let userId = sessionStorage.getItem("userId")
        let userType = sessionStorage.getItem("userType")
        let accessToken = sessionStorage.getItem("token")
        let url =portUrl("/other/hy-school/home?act=logout&userId="+userId+"&userType="+userType+"&accessToken="+accessToken)
        console.log({url});

        confirm({
            title: '退出提示',
            content: '你确定要退出登录吗?',
            onOk() {
                if(authFrom&&authFrom === "hongyuam"){
                    window.location.href = url
                }else{
                    me.props.dispatch({
                        type:'user/loginOut',
                        payload:{},
                        callback:(res)=>{
                            if(res.code===200){
                                me.props.dispatch(routerRedux.push("/login"))
                            }
                        }
                    })
                }

            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }


    findIndexArray = (data, path, indexArray) => {
      let arr = Array.from(indexArray)
      for (let i = 0, len = data.length; i < len; i++) {
          arr.push({nodeId:data[i].nodeId,title:data[i].title,action:data[i].action})
          if (data[i].action === path) {
              return arr;
          }
          let children = data[i].children;
          if (children && children.length) {
              let result = this.findIndexArray(children, path, arr)
              if (result) return result
          }
          arr.pop()
      }
      return false;
    }

    getBreadcrumbData = (pathname) => {
      if(!pathname || pathname === "/") return [];
      const menu = JSON.parse(sessionStorage.getItem("menu"));
      let path = pathname;
      if(path.indexOf("/") !== -1){
        path = pathname.substr(1,pathname.length - 1);
      }
    //   let breadcrumbData = this.findIndexArray(menu,path,[]);
    //   if(!breadcrumbData) return [];
    //   return breadcrumbData;
    }

    render(){
        const {mode} =this.state;
        const {information,lastNodeRoute = {}} = this.props;
        // let breadcrumbData = this.getBreadcrumbData(this.props.location.pathname);
        // if(breadcrumbData.length < 1 && lastNodeRoute.parentRoute){
        //   breadcrumbData = this.getBreadcrumbData(lastNodeRoute.parentRoute);
        //   breadcrumbData.push(Object.assign({action:lastNodeRoute.parentRoute,title:lastNodeRoute.breadcrumbTitle},lastNodeRoute));
        // }
        // let breadcrumbHtml = breadcrumbData.map((ele,index) => {
        //   if(index === breadcrumbData.length - 2 && lastNodeRoute.parentRoute){
        //     if(ele.action.indexOf("/") !== -1){
        //       ele.action = ele.action.substr(1,ele.action.length - 1);
        //     }
        //     return (<Breadcrumb.Item key={ele.action}><a href={"#/"+ele.action}>{ele.title}</a></Breadcrumb.Item>);
        //   }
        //   return (<Breadcrumb.Item key={ele.action}>{ele.title}</Breadcrumb.Item>);
        // });

        return (
            // <LocaleProvider locale={zh_CN}>
            <ConfigProvider locale={zhCN}>
            <div className="g-layout">
                <Slider mode={mode}></Slider>
                <div className="g-layout-main">
                    <div className="g-layout-top">
                        <Button className="mode-btn" type="primary" onClick={this.toggleCollapsed}>
                            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        </Button>
                        <div className="breadcrumb-div">
                          {/* {breadcrumbData.length > 0 ? <Breadcrumb>{breadcrumbHtml}</Breadcrumb> : null} */}
                        </div>
                        <div className="top-right">
                            <Icon type='bell' className="bell-btn"></Icon>
                            {/* {information&&!information.phone?
                            <span className='role'>当前角色：平台用户
                                <Tooltip placement="bottom" title={<span>教师客户端用户</span>}>
                                    <span  className='change'>切换</span>
                                </Tooltip>
                            </span>:null} */}
                            <span onClick={this.turnto.bind(this)}>
                                <img src={getImg(information&&information.pic)} className='top-name' alt=""/>
                                <span style={{cursor:"pointer"}}>{information&&information.username}</span>
                            </span>
                            <a href="javascript:;" style={{marginLeft:20}} onClick={this.showConfirm.bind(this)}>注销</a>
                        </div>
                    </div>
                    <div className="g-layout-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
            </ConfigProvider>
        );
    }

}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    information:state.user.information,
    lastNodeRoute:state.user.lastRoute || {}
  }
}

export default connect(mapStateToProps)(App);
