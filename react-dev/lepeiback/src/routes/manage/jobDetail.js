import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Avatar,Button,Input,Form,Col,Row,List, Card, message,Icon,Breadcrumb, Radio, Select, Tree } from 'antd';
import {getQueryString} from '../../utils/public';
import { getPortrait } from '../../utils/img';
import AddPerson from '../../components/addPerson';
import BottomBtns from '../../components/bottom-btns';
import StepIndex from '../../components/steps';
import './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TreeNode } = Tree;

class JobDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            step:1,
            disabled:false,
            oldData:[], //编辑
            addNewData:[], //添加
            edit:false,
            controlBtn:false,
            textNum:'0',
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            treeData:[],
            nodeIdsArr: [],
            dataAuth: [],
            nodeIds: [],
            authStatus:'1',
            authType:'1',
            roleType:'0',
            authFlag:false,
            title:"职务详情",
            title1:"添加职务",
        };
    }
    componentDidMount=()=>{
        const type=getQueryString('type'); // type=1 添加  type=2  查看和编辑
        if(Number(type) === 2){
            this.getJobDetail()
        }
        this.getAllNodes()
        this.getGrades();

        if(Number(type)===1){
            //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
              this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title1,
                  parentRoute:"/job-manage"
                },
              })
        }else if (Number(type)===2){
            this.props.dispatch({
                type: 'user/setLastRoute',
                payload: {
                  breadcrumbTitle:this.state.title,
                  parentRoute:"/job-manage"
                },
              })
        }
    }

    componentWillUnmount = () => {
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })
          
    }

    // 获取职务详情
    getJobDetail = () => {
        this.props.dispatch({
            type:'job/getJobDetail',
            payload:{"jobId":getQueryString('jobId')},
            callback:(res) => {
                if(res.code == 200){
                    const {oldData} = this.state;
                    res && res.data.persons && res.data.persons.map(item => {
                        return oldData.push({
                            name:item.personName,
                            key:item.personId,
                            pic:item.personPic,
                            sex:item.sex
                        })
                    })
                    let arr=[]
                    let selectedArr = []
                    res.data.nodes && res.data.nodes.map((item) => {
                        if(item.children){
                            item.children.map((i)=>{
                                if(i.children){
                                    i.children.map((j)=>{
                                        if(j.children){
                                            j.children.map((k)=>{
                                                if(k.children){
                                                    
                                                }else{
                                                    arr.push(k.nodeId)
                                                }
                                            })
                                        }else{
                                            arr.push(j.nodeId)
                                        }
                                    })
                                }else{
                                    arr.push(i.nodeId)
                                }
                            })
                        }else{
                            arr.push(item.nodeId)
                        }
                    })
                    let selectedArr1 = res.data.nodeIds && res.data.nodeIds.split(",")
                    console.log({arr});
                    console.log({selectedArr1});
                    arr && arr.map(item => {
                        selectedArr1 && selectedArr1.map(i => {
                            if(item == i){
                                selectedArr.push(item)
                            }
                        })
                    })
                    this.setState({
                        authStatus:res.data.authStatus && res.data.authStatus.toString(),
                        oldData:oldData,
                        textNum:res.data.intro ? res.data.intro.length : '0',
                        disabled:true,
                        checkedKeys: selectedArr,
                        nodeIdsArr: selectedArr1,
                        dataAuthType: res.data.dataAuthType && res.data.dataAuthType.toString(),
                        dataAuth: res.data.dataAuth ? res.data.dataAuth.split(","):[]
                    })
                }
            }
        });
    }

    // 获取功能权限列表
    getAllNodes = () =>{
        this.props.dispatch({
            type:'job/getAllNodes',
            callback:(res)=>{
                if(res.code == 200) {
                    let treeData=[]
                    res.data.map((item)=>{
                        if(item.children){
                            var children2=[]
                            item.children.map((i)=>{
                                if(i.children){
                                    var children3=[]
                                    i.children.map((j)=>{
                                        if(j.children){
                                            var children4=[]
                                            j.children.map((k)=>{
                                                children4.push({
                                                    title: k.title,
                                                    key: k.nodeId,
                                                })
                                            })
                                        }
                                        children3.push({
                                            title: j.title,
                                            key: j.nodeId,
                                            children: children4
                                        })
                                    })
                                }
                                children2.push({
                                    title: i.title,
                                    key: i.nodeId,
                                    children: children3
                                })
                            })
                        }
                        treeData.push({
                            title: item.title,
                            key: item.nodeId,
                            children: children2
                        })
                    })
                    this.setState({
                        treeData: treeData,
                    })
                }
            }
        })
    }

    // 获取所有年级
    getGrades = () => {
        this.props.dispatch({
            type:'job/allGrades',
            payload:{},
        })
    }

    // 数据权限选择
    handleAuthChange = (e) => {
        this.setState({ dataAuthType: e.target.value });
    }

    //简介输入字数
    onBlur = (e) => {
        this.setState({textNum:e.target.value.length})
    }

    // 年级选择
    handleChange = (value)=> {
        this.setState({
            dataAuth: value
        })
    }
    // 展开/收起节点
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }
    // 选择项
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys);
        console.log(info.halfCheckedKeys)
        let checkedKey = [...checkedKeys, ...info.halfCheckedKeys]
        // console.log(checkedKey)
        this.setState({
            checkedKeys,
            nodeIdsArr: checkedKey,
        });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })

    // 添加人员
    addData = () => {
        this.setState({step:2})
        this.props.form.validateFields((err, values) => {
            this.setState({
                jobName:values.jobName,
                intro:values.intro,
                roleType:values.roleType,
                authStatus:values.authStatus
            })
        })
    }

    // 获取教师人员列表
    getData = (tip,data) => {
        const { oldData, addNewData } = this.state;
        if(tip === 'cancel'){
            this.setState({step:1})
        }else{
            const type = getQueryString('type');
            if(Number(type) === 1){
                data && data.map(item => {
                    return addNewData.push({
                        name:item.personName,
                        key:item.personId,
                        pic:item.personPic,
                        sex:item.sex
                    })
                })
                let result = [];
                let obj = {};
                addNewData.map((item) => {
                    if(!obj[item.key]){
                        result.push(item);
                        obj[item.key] = true;
                    }

                })
                this.setState({
                    addNewData:result,
                    step:1,
                    edit:true
                })
            }else{
                data.map(item => {
                    return oldData.push({
                        name:item.personName,
                        key:item.personId,
                        pic:item.personPic,
                        sex:item.sex
                    })
                })
                let result = [];
                let obj = {};
                oldData.map((item) =>{
                    if(!obj[item.key]){
                        result.push(item);
                        obj[item.key] = true;
                    }

                })
                this.setState({
                    oldData:result,
                    step:1,
                    edit:true
                })
            }
        }
    }

    // 相关人员删除
    close = (data) => {
        const {addNewData,oldData} =this.state;
        let arr=[];
        addNewData.map(item=>{
            if(item.key!=data.key){
                return arr.push(item)
            }
            this.setState({addNewData:arr})
        })
        oldData.map(item=>{
            if(item.key!=data.key){
                return arr.push(item)
            }
            this.setState({oldData:arr})
        })
    }
    changeAuthStatus = (e) =>{
        this.setState({
            authFlag:true,
            authType:e.target.value
        })
    }

    getBtnDate = (data) => {
        const type = getQueryString('type');
        const jobId = getQueryString('jobId');
        const {oldData,addNewData} = this.state;
        let personIds = [];
        if(Number(type) === 1){
            addNewData.map(item => {
                return personIds.push(item.key)
            })
        }else{
            oldData.map(item => {
                return personIds.push(item.key)
            })
        }
        if(data === 'edit'){
            this.setState({disabled:false,edit:true})
        }else if(data === 'cancel'){
            this.props.history.push('/job-manage')
        }else if(data === 'submit'){
            this.props.form.validateFields((err, values) => {
                if(!err){
                    this.setState({controlBtn:true})
                    const params = {
                        jobName:values.jobName,
                        intro:values.intro||'',
                        roleType:values.roleType,
                        authStatus:values.authStatus,
                        persons:personIds,
                        dataAuthType:this.state.dataAuthType,
                        dataAuth:this.state.dataAuthType == 2 ? this.state.dataAuth : [],
                        nodeIds:this.state.nodeIdsArr
                    }
                    console.log({params});
                    if(Number(type) === 1){//添加
                        this.props.dispatch({
                            type:'job/addJob',
                            payload:params,
                            callback:(res)=>{
                                if(res.code===200){
                                    message.success('创建职务成功！',2)
                                    this.props.history.push('/job-manage')
                                }
                                this.setState({controlBtn:false})
                            }
                        })
                    }else{ //编辑
                        this.props.dispatch({
                            type:'job/updateJob',
                            payload:{
                                ...params,
                                jobId:jobId
                            },
                            callback:(res)=>{
                                if(res.code===200){
                                    message.success('更新职务成功！',2)
                                    this.props.history.push('/job-manage')
                                }
                                this.setState({controlBtn:false})
                            }
                        })
                    }
                }
            })
        }
    }
   
    render(){
        const { jobDetail, gradesList } = this.props;
        const {authFlag,authType,disabled,oldData,addNewData,edit,intro,jobName,controlBtn, roleType,authStatus} = this.state;
        const type=getQueryString('type');
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:9 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span:4 },
            wrapperCol: { span: 14 }
        };
        const gradeOption = gradesList && gradesList.map((item) => {
            return <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        return (
            <div className='detail-main job-detail'>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>学校管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/job-manage">职务管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{type == 1?"添加职务":"职务详情"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                {this.state.step === 1 ?
                <span>
                    <h3 className='detail-title'>基础资料</h3>
                    <div className="content-main information">
                        <Form className="content-form teacher-form">                                
                            <Row gutter={24}>
                                <Col span={9}>
                                    <FormItem {...formItemLayout} label='职务名称'>
                                    {getFieldDecorator('jobName',{initialValue:type == 2 && !jobName ? jobDetail && jobDetail.jobName:jobName,
                                    rules:[{required:true,message:"请输入职务名称",whitespace: true,}]})(
                                        <Input disabled={disabled} placeholder='请输入职务名称' clear='true'/>
                                    )}
                                    </FormItem>
                                </Col>                                                                                                                                                                                                                                                                                                                                                                       
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={'职务类型'}>
                                        {getFieldDecorator("roleType",{initialValue:type == 2 && roleType == '0' ? jobDetail && jobDetail.roleType:roleType})(
                                        <Select disabled={disabled}>
                                            <Option value='0'>无</Option>
                                            <Option value='1'>年级组长</Option>
                                            <Option value='2'>教导主任</Option>
                                            <Option value='3'>学科主任</Option>
                                        </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label="状态">
                                    {getFieldDecorator('authStatus',{initialValue:authFlag ? authType : authStatus})(
                                        <RadioGroup disabled={disabled} onChange={this.changeAuthStatus}>
                                            <Radio.Button value="1">启用</Radio.Button>
                                            <Radio.Button value="2">禁用</Radio.Button>
                                        </RadioGroup>
                                    )}
                                    </FormItem>
                                </Col>                                                                                                                                                                                                                                                                                                                                                                                               
                            </Row>
                            <Row gutter={24} className="jobInfo">
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label='职务简介'>
                                    {getFieldDecorator('intro',{initialValue:type == 2 && !intro ? jobDetail && jobDetail.intro : intro})(
                                        <TextArea maxLength={150} disabled={disabled} onInput={this.onBlur.bind(this)} placeholder="请输入职务简介" autosize={{ minRows: 2, maxRows: 6 }} />
                                    )}
                                    <p className="textNum"><span>{this.state.textNum || '0'}</span>/150</p>
                                    </FormItem>
                                </Col> 
                            </Row>
                        </Form>          
                    </div>
                    <div className='authority'>
                        <div className='department-item'>
                            <h3 className='detail-title'>功能权限</h3>
                            <div className="content-main">
                                <Tree
                                    disabled={disabled}
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={this.state.expandedKeys}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    selectedKeys={this.state.selectedKeys}
                                >
                                    {this.renderTreeNodes(this.state.treeData)}
                                </Tree>
                            </div>
                        </div>
                        <div className='department-item'>
                            <h3 className='detail-title'>数据权限</h3>
                            <div className="content-main dataAuth">
                                <Form.Item label="数据权限" {...formItemLayout2}>
                                    <RadioGroup disabled={disabled} value={this.state.dataAuthType} onChange={this.handleAuthChange}>
                                        <Radio.Button value="1">全校</Radio.Button>
                                        <Radio.Button value="2">年级</Radio.Button>
                                        <Radio.Button value="3">班级</Radio.Button>
                                        <Radio.Button value="0">无</Radio.Button>
                                    </RadioGroup>
                                </Form.Item>
                                {
                                    this.state.dataAuthType == 2 ? <div>
                                        <Form.Item label="选择年级" {...formItemLayout2}>
                                            <Select
                                                mode="tags"
                                                placeholder="请选择"
                                                defaultValue={this.state.dataAuth}
                                                onChange={this.handleChange.bind(this)}
                                                style={{ width: '100%' }}
                                                >
                                                {gradeOption}
                                            </Select>
                                        </Form.Item>
                                    </div>:""
                                }
                                {
                                    this.state.dataAuthType == 3? <div>
                                        <Form.Item {...formItemLayout2} label="选择班级">
                                            {getFieldDecorator('className')(
                                                <Input placeholder="根据绑定关系确定权限" disabled />
                                            )}
                                        </Form.Item>
                                    </div>:""
                                }
                            </div>
                        </div>
                    </div>                        
                    <div className='authority' style={{marginBottom:'5%'}}>
                        <div className='department-item' style={{width:'100%'}}>
                            <h3 className='detail-title'>相关人员</h3>
                            <Button type='primary' disabled={disabled} onClick={this.addData.bind(this)}>添加人员</Button>
                            <div className='department-content job-persons' style={{padding:'20px 2%',height:oldData&&oldData.length>0||(addNewData&&addNewData.length>0)?'460px':'120px'}}>
                                <List className='job-list'
                                    grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6,}}
                                    dataSource={type == 1 ? addNewData : oldData}
                                    renderItem={(item) => (
                                        <List.Item> 
                                            <Card>
                                                {edit?<Icon type='close' onClick={this.close.bind(this,item)} />:null}
                                                <Avatar src={getPortrait(item.pic,item.sex)}/>
                                                <p className='job-name'>{item.name}</p>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    {jobDetail && jobDetail.operateLogs.length > 0 ? <div className='step-contents'>
                        <StepIndex data={jobDetail && jobDetail.operateLogs}/>
                    </div> : null}
                    <BottomBtns getBtnDate={this.getBtnDate.bind(this)} type={type} edit={edit} controlBtn={controlBtn}/>
                </span> : <div><AddPerson getData={this.getData.bind(this)} /></div>}

            </div>
            
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    jobDetail:state.job.jobDetail,
    gradesList: state.job.gradeData,
  }
}

export default connect(mapStateToProps)(Form.create()(JobDetail));
