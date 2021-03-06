import React,{Component} from 'react';
import { connect } from 'dva';
import {Link} from 'dva/router';
import { Upload,message,Button,Input,Select,Form,Row,Col,Icon,DatePicker,Radio,TreeSelect,Breadcrumb} from 'antd';
import BottomBtns from '../../components/bottom-btns';
import StepIndex from '../../components/steps';
import AddSelect from '../../components/addSelect';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import md5 from 'md5';
import {getQueryString,onlyDate,isBlank} from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';
import { Tree } from 'antd';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
// const TreeNode = TreeSelect.TreeNode;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
class accessDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            nodeStatus: [],
            nodeIds: [],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            treeData:[],
            nodeIdsArr: [],
            dataAuth: []
        };
    }
    componentDidMount=()=>{
      this.accessDetail();
      this.getGrades();
    }

    getGrades = () => {
        this.props.dispatch({
            type:'setting/allGrades',
            payload:{},
        })
    }

    toGradeManage = () => {
        this.props.dispatch(
          routerRedux.push("/grade-manage")
        )
    }

    accessDetail = () => {
        this.props.dispatch({
            type:'setting/accessDetail',
            payload:{
                "type": 1,
                "jobId": this.props.match.params.jobId,
            },
            callback:(res)=>{
                this.props.form.setFieldsValue({
                    "jobName": res.data.jobName,
                })
                let treeData=[]
                res.data.nodes.map((item)=>{
                    if(item.children){
                        var children2=[]
                        item.children.map((i)=>{
                            if(i.children){
                                var children3=[]
                                i.children.map((j)=>{
                                    if(j.children){
                                        var children4=[]
                                        j.children.map((k)=>{
                                            children4.push(
                                                {
                                                    title: k.title,
                                                    key: k.nodeId,
                                                }
                                            )
                                        })
                                    }
                                    children3.push(
                                        {
                                            title: j.title,
                                            key: j.nodeId,
                                            children: children4
                                        }
                                    )
                                })
                            }
                            children2.push(
                                {
                                    title: i.title,
                                    key: i.nodeId,
                                    children: children3
                                }
                            )
                        })
                    }
                    treeData.push({
                        title: item.title,
                        key: item.nodeId,
                        children: children2
                    })
                })
                let arr=[]
                res.data.nodes.map((item)=>{
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
                
                let selectedArr1=res.data.nodeIds&&res.data.nodeIds.split(",")
                let selectedArr=[]
                arr.map((item)=>{
                    res.data.nodeIds&&selectedArr1.map((i)=>{
                        if(item==i){
                            selectedArr.push(item)
                        }
                    })
                })
                console.log(selectedArr)
                this.setState({
                    status: res.data.status.toString(),
                    dataAuthType: res.data.dataAuthType.toString(),
                    nodeIdsArr: selectedArr1,
                    treeData: treeData,
                    checkedKeys: selectedArr,
                    dataAuth: res.data.dataAuth?res.data.dataAuth.split(","):[]
                })
            }
        })
    }

    update = () => {
        this.props.dispatch({
            type:'setting/updataAccredit',
            payload:{
                "jobId": this.props.match.params.jobId,
                "status": this.state.status,
                "dataAuthType": this.state.dataAuthType,
                "dataAuth": this.state.dataAuthType==2?this.state.dataAuth:[],
                "nodeIds": this.state.nodeIdsArr,
                "type": 1
            },
            callback:(res)=>{
                if(res.code===200){
                    message.success('???????????????',3)
                    setTimeout(() => {
                        window.history.go(-1)
                    }, 3000);
                }
            }
        })
    }

    handleChange = (value)=> {
        console.log(`Selected: ${value}`);
        this.setState({
            dataAuth: value
        })
    }
      
    handleFormLayoutChange = (e) => {
        this.setState({ status: e.target.value });
    }
    handleAuthChange = (e) => {
        this.setState({ dataAuthType: e.target.value });
    }
    cancel= (e) => {
        this.props.dispatch(
            routerRedux.push("/role-access")
        )
    }
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }

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
    render(){
        const { getFieldDecorator} = this.props.form;
        const { gradesList } = this.props;
        const gradeOption = gradesList&&gradesList.map((item)=>{
            return <Option value={item.gradeId} key={item.gradeId}>{item.gradeName}</Option>
        })
        
        return (
            <div>
                <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/role-access">????????????</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>????????????</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <h3 className='detail-title'>????????????</h3>
                <div className="content-main information">
                    <Form.Item {...formItemLayout} label="????????????">
                        {getFieldDecorator('jobName', {
                            rules: [{
                            required: true,
                            message: '',
                            }],
                        })(
                            <Input disabled/>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        {...formItemLayout}
                    >
                        <RadioGroup value={this.state.status} onChange={this.handleFormLayoutChange}>
                            <Radio.Button value="1">??????</Radio.Button>
                            <Radio.Button value="2">??????</Radio.Button>
                        </RadioGroup>
                    </Form.Item>
                </div>

                <h3 className='detail-title mt50'>????????????</h3>
                <div className="content-main information">
                    <Form.Item
                        label="????????????"
                        {...formItemLayout}
                    >
                        <RadioGroup value={this.state.dataAuthType} onChange={this.handleAuthChange}>
                            <Radio.Button value="1">??????</Radio.Button>
                            <Radio.Button value="2">??????</Radio.Button>
                            <Radio.Button value="3">??????</Radio.Button>
                            <Radio.Button value="0">???</Radio.Button>
                        </RadioGroup>
                    </Form.Item>
                     {
                         this.state.dataAuthType==2? <div>
                            <Form.Item
                                label="????????????"
                                {...formItemLayout}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="?????????"
                                    defaultValue={this.state.dataAuth}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ width: '100%' }}
                                    >
                                    {gradeOption}
                                </Select>
                            </Form.Item>
                            <Row>
                                <Col span={8} offset={4}>
                                    ???????????????????????????<br/>
                                    <Button type="primary" onClick={this.toGradeManage.bind(this)} >??????????????????&gt;&gt;</Button>
                                </Col>
                            </Row>
                         </div>:""
                     }
                     {
                         this.state.dataAuthType==3? <div>
                           <Form.Item {...formItemLayout} label="????????????">
                                {getFieldDecorator('className', {
                                    rules: [{
                                    required: true,
                                    message: '',
                                    }],
                                })(
                                    <Input placeholder="??????????????????????????????" disabled />
                                )}
                            </Form.Item>
                         </div>:""
                     }
              
                </div>

                <h3 className='detail-title mt50'>????????????</h3>
                <div className="content-main information access-part">
                    <Tree
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

                <div className="btn-box">
                    <Button className="btn-cancel" onClick={this.cancel.bind(this)}>??????</Button>
                    <Button className="btn-submit" onClick={this.update.bind(this)} type="primary">??????</Button>
                </div>
            </div>
        )
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    gradesList: state.setting.gradeData,
  }
}

export default connect(mapStateToProps)(Form.create()(accessDetail));
