import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Avatar,Button,Input,Form,Col,Row,List, Card, message,Icon,Breadcrumb } from 'antd';
import {getQueryString} from '../../utils/public';
import { getImg } from '../../utils/img';
import AddPerson from '../../components/addPerson';
import BottomBtns from '../../components/bottom-btns';
import StepIndex from '../../components/steps';
import './style.less';

class SetTeacherHander extends Component{
    constructor(props) {
        super(props);
        this.state = {
            step:1,
            disabled:false,
            oldData:[], //编辑
            edit:false,
            controlBtn:false,
			title:"教师端发布人设置",

        };
    }
    componentDidMount=()=>{
        this.props.dispatch({
            type:'schoolNotice/getNoticePublishers',
            callback:(res)=>{
                if(res.code==200){
                    const {oldData} = this.state;
                    res&&res.data&&res.data.map(item=>{
                        return oldData.push({name:item.personName,key:item.personId,pic:item.pic})
                    })
                    this.setState({oldData:oldData,disabled:true})
                }
            }
        });
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/school-notice-list"
            },
            })
    }
    componentWillUnmount = () =>{
		//组件卸载时，清空手动加入的面包屑
		this.props.dispatch({
		  type: 'user/setLastRoute',
		  payload: {},
		})
	  }
    addData=()=>{
        this.setState({step:2})
    }
    getData=(tip,data)=>{
        console.log(data)
        const {oldData} = this.state;
        if(tip==='cancel'){
            this.setState({step:1})
        }else{
            data&&data.map(item=>{
                return oldData.push({name:item.personName,key:item.personId,pic:item.pic})
            })
            let result = [];
            let obj = {};
            oldData.map((item)=>{
                if(!obj[item.key]){
                    result.push(item);
                    obj[item.key] = true;
                }

            })
            this.setState({oldData:result,step:1,edit:true})
        }
    }
    submit=()=>{
        const {oldData} = this.state;
        let personIds=[];
        oldData.map(item=>{
            return personIds.push(item.key)
        })     
        console.log(oldData,personIds)
        this.props.dispatch({
            type:'schoolNotice/setNoticePublishers',
            payload:{"publishers":personIds},
            callback:(res)=>{
                if(res.code===200){
                    message.success('创建教师发布人成功！',2)
                    this.props.history.push('/school-notice-list')
                }
            }
        })        
    }
    close=(data)=>{
        const {oldData} =this.state;
        let arr=[];
       
        oldData.map(item=>{
            if(item.key!=data.key){
                return arr.push(item)
            }
            this.setState({oldData:arr})
        })
    }
    render(){
        
        const {oldData} = this.state;
        console.log(oldData)
        return (
            <div className='detail-main'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>教务管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/school-notice-list">校园公告</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>教师端发布人设置</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                {this.state.step===1?
                <span>
                <div className='teacher-hander-main'>
                    <div className='department-item' style={{width:'100%'}}>
                        <h3 className='detail-title'>人员名单</h3>
                        <Button type='primary' onClick={this.addData.bind(this)}>添加人员</Button>
                        <div className='department-content job-persons' style={{padding:'20px 2%',height:oldData&&oldData.length>0?'460px':'120px'}}>
                            <List className='job-list'
                                grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6,}}
                                dataSource={oldData}
                                renderItem={(item) => (
                                <List.Item> 
                                    <Card>
                                        <Icon type='close' onClick={this.close.bind(this,item)} />
                                        <Avatar src={getImg(item.pic)}/>
                                        <p className='job-name'>{item.name}</p>
                                    </Card>
                                </List.Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
                {/*jobDetail&&jobDetail.operateLogs.length>0?<div className='step-contents'>
                    <StepIndex data={jobDetail&&jobDetail.operateLogs}/>
                                </div>:null
                <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} edit={edit} controlBtn={controlBtn}/>*/}
                <Row style={{marginTop:20}}>
                  <Col span={2} offset={10}>
                      <Button ><Link to='/school-notice-list'>返回</Link></Button>
                  </Col>
                  <Col span={2} offset={0}>
                      <Button type='primary' onClick={this.submit.bind(this)} >确定</Button>
                  </Col>
                </Row>
                </span>:<div><AddPerson getData={this.getData.bind(this)} /></div>}
            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    //  jobDetail:state.job.jobDetail
  }
}

export default connect(mapStateToProps)(Form.create()(SetTeacherHander));
