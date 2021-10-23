import React,{Component} from 'react';
import { connect } from 'dva';
import { Breadcrumb ,TreeSelect , Modal, Select, Form, Col, Row, Input,Textarea, message, Button, Icon } from 'antd';
import {Link,routerRedux} from "dva/router";
import { getQueryString } from '../../utils/public';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
class TempalateManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            detail:[],
            // quotasList:[],
            // pointList:[],
            indexList:[],
            indexId:'',  //指标id
            indexId1:'',  
            indexId2:'',  
            indexId3:'',  
            indexId4:'',  
            value:'',
            visible1: false,
            confirmLoading1: false,
            visible2: false,
            confirmLoading2: false,
            visible3: false,
            confirmLoading3: false,
            visible4: false,
            confirmLoading4: false,
            visible5: false,
            confirmLoading5: false,
            targets:[{name:'',proportion:''}], //指标数组
            name:'',
            proportion:'',
            points:[{title:'',score:''}], //增加-要点数组
            value1:'',
            value2:'',
            value3:'',
            value4:'',
            pointsList:[],
            pointId:'',
            arr: [],
            num: 0,
            editName:'',
            editScore:'',
            EditQuotasId:'',
            EditPointId:'',
            level:1,
            title:'模板管理'
        }
    }
    componentDidMount =()=>{
        const id=getQueryString('id')
        this.templateManage(id)
        this.getQuotasList(id)
        //组件加载时，手动加入的面包屑，如果标题有变化，可以即时调整
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/evaluation-manage"
            },
          })
    }
    componentWillUnmount = () => {
        //组件卸载时，清空手动加入的面包屑
        this.props.dispatch({
          type: 'user/setLastRoute',
          payload: {},
        })    
    }

    // 模板管理列表
    templateManage=()=>{
        let me = this
        const id=getQueryString('id')
        this.props.dispatch({
            type:'teacherEvaluation/templateManage',
            payload: {"templateId":id},
            callback: (res)=>{
                if(res.code===200){
                    let points = res.data.points
                    let quotas = res.data.quotas
                    let nodes = this.generateNode(quotas)
                    let rst = []
                    nodes&&nodes.map(item=>{
                        let flag = false
                        points&&points.map(i=>{
                            if(i.quotasId == item.quotasId){
                                rst.push({
                                    quotasId: item.quotasId,
                                    first: item.first,
                                    second: item.second,
                                    third: item.third,
                                    fourth: item.fourth,
                                    name: i.name,
                                    score: i.score,
                                    pointId:i.pointId
                                })
                                flag = true
                            }
                        })
                        if(!flag){
                            rst.push(item)
                        }
                    })
                    
                    rst = this.rowspanFun(rst, ['first', 'second', 'third', 'fourth'])
                    console.log("rst",rst);

                    this.setState({
                        quotas: quotas,
                        rst: rst
                    })
    
                    console.log({quotas})
         
                }
            }
        })
    }
    // 获取指标列表
    getQuotasList =()=>{
        const id=getQueryString('id')
        this.props.dispatch({
            type:'teacherEvaluation/getQuotasList',
            payload: {"templateId":id},
            callback: (res)=>{
                // console.log("指标列表",res.data);
                if(res.code===200){
                  this.setState({
                    indexList:res.data
  
                  })
                }
            }
        })
    }
    // 获取要点列表
    getPoints = (id)=>{
        this.props.dispatch({
            type:'teacherEvaluation/getPoints',
            payload: {"quotasId":id},
            callback: (res)=>{
                console.log("要点列表",res.data);
                if(res.code===200){
                  this.setState({
                    pointsList:res.data
  
                  })
                }
            }
        })
    }

    // 添加指标
    addIndex = ()=>{
        this.setState({
            visible1: true,
        });
    }
    // 确认添加指标
    addIndexOk = () => {
        let flag = true
        const id=getQueryString('id');
        this.state.targets.map(item =>{
            if(this.state.value === ''&&item.name === ''){
                message.error('指标不能为空！');
                flag = false
            }
            if(this.state.value === ''&&item.name&&item.proportion === ''){
                message.error('占比不能为空！');
                flag = false
            }
        })
        if(!flag){
            return
        }
        let params = {
            templateId:id,
            pid:this.state.indexId||'',
            quotas:this.state.targets
        }
        this.props.dispatch({
            type:'teacherEvaluation/addIndexs',
            payload:params,
            callback:(res)=>{
                console.log("res",res);
                if(res.code===200){
                    message.success("添加指标成功!")
                    this.setState({
                        confirmLoading1: true,
                        value:'',
                        targets:[{name:'',proportion:''}]
                    });
                    setTimeout(() => {
                        this.setState({
                          visible1: false,
                          confirmLoading1: false,
                        });
                    }, 500);
                    this.getQuotasList()
                    this.templateManage()
                }
            }
        })
        
      
    };
    onChange = value => {
        const arr=value.split('~');
        this.setState({ value:arr[0],indexId:arr[1]},function(){
        } );
        
    };
    onChange1 = (index,e)=>{
        let oldData = this.state.targets
        oldData[index].name = e.target.value
        this.setState({
            targets: oldData
        })
    }
    onChange2 = (index,e)=>{
        let oldData = this.state.targets
        oldData[index].proportion = e.target.value
        this.setState({
            targets: oldData
        })
    }
     // 增加本级指标
     add = ()=>{
        let oldData = this.state.targets
        oldData.push({
            name:'',
            proportion:''
        })
        this.setState({targets:oldData})
    }
    // 删除本级指标
    del = (index)=>{
        let oldData = this.state.targets
        let newData = oldData.filter((item,i)=>{
            return i!==index
        })
        if(oldData.length === 1){
            return
        }
        this.setState({
            targets: newData
        })
    }
    
    // 删除指标
    delIndex = ()=>{
        this.setState({
            visible4: true,
        });
    }
    // 确认删除指标
    delIndexOk = ()=>{
        if(this.state.value4 === ''){
            message.error("请选择要删除的指标！")
            return
        }
        this.props.dispatch({
            type:'teacherEvaluation/delIndexs',
            payload:{id:this.state.indexId4},
            callback:(res)=>{
                if(res.code===200){
                    message.success("删除指标成功!")
                    this.setState({
                        confirmLoading4: true,
                        value4:''
                    });
                    setTimeout(() => {
                        this.setState({
                          visible4: false,
                          confirmLoading4: false,
                        });
                    }, 500);
                    this.getQuotasList()
                    this.templateManage()
                }
            }
        })

    }
    onChangeValue4= (value)=>{
        const arr=value.split('~');
        this.setState({ value4:arr[0],indexId4:arr[1]});
    }
    // 添加要点
    addKey = ()=>{
        this.setState({
            visible2: true,
        });
    }
    onChangeValue1 = (value)=>{
        const arr=value.split('~');
        this.setState({ value1:arr[0],indexId1:arr[1]});
        console.log(this.state.indexId1);
       
    }
    onChange3 = (index,e)=>{
        let pointData = this.state.points
        pointData[index].title = e.target.value
        this.setState({
            points: pointData
        })
    }
    onChange4 = (index,e)=>{
        let pointData = this.state.points
        pointData[index].score = e.target.value
        this.setState({
            points: pointData
        })
    }
    del1 = (index)=>{
        let pointData = this.state.points
        let newData = pointData.filter((item,i)=>{
            return i!==index
        })
        if(pointData.length === 1){
            return
        }
        this.setState({
            points: newData
        })
    }
    add1 = ()=>{
        let pointData = this.state.points
        pointData.push({
            title:'',
            score:''
        })
        this.setState({points:pointData})
    }
    // 确认添加要点
    addPointOk = ()=>{
        let flag = true
        this.state.points.map(item =>{
            if(this.state.value1 === ''){
                message.error('请选择上级指标！');
                flag = false
            }
            if(item.title === ''){
                message.error('要点不能为空！')
                flag = false
            }
            if(item.title&&item.score === ''){
                message.error('分数不能为空！');
                flag = false
            }
        })
        if(!flag){
            return
        }
        let params = {
            quotasId:this.state.indexId1,
            points:this.state.points
        }
        this.props.dispatch({
            type:'teacherEvaluation/addPoints',
            payload:params,
            callback:(res)=>{
                console.log("res",res);
                if(res.code===200){
                    message.success("添加要点成功!")
                    this.setState({
                        confirmLoading2: true,
                        points:[{title:'',score:''}],
                        value1:''
                    });
                    setTimeout(() => {
                        this.setState({
                          visible2: false,
                          confirmLoading2: false,
                        });
                    }, 500);
                    this.getPoints()
                    this.templateManage()
                }
            }
        })
    }
    
    // 删除要点
    delKey = ()=>{
        this.setState({
            visible3: true,
        });
    }
    // 确认删除要点
    delPointOk = ()=>{
        if(this.state.value2 === ''&&this.state.value3 === ''){
            message.error("请选择指标！")
            return
        }
        if(this.state.value3 === ''){
            message.error("请选择要点！")
            return
        }
       
        this.props.dispatch({
            type:'teacherEvaluation/delPoints',
            payload:{id:this.state.pointId},
            callback:(res)=>{
                if(res.code===200){
                    message.success("删除要点成功!")
                    this.setState({
                        confirmLoading3: true,
                        value2:'',
                        value3:''
                    });
                    setTimeout(() => {
                        this.setState({
                          visible3: false,
                          confirmLoading3: false,
                        });
                    }, 500);
                    this.getPoints()
                    this.templateManage()
                }
            }
        })

    }
    onChangeValue2 = (value)=>{
        const arr=value.split('~');
        this.setState({ value2:arr[0],indexId2:arr[1]});
        this.getPoints(arr[1])
        
    }
    onChangeValue3 = (value)=>{
        console.log("value3",value);
        const arr=value.split('~');
        this.setState({ value3:arr[0],pointId:arr[1]});
    }
    handleCancel1 = () => {
        this.setState({
          visible1: false,
          value:'',
          targets:[{name:'',proportion:''}]
         
        });
    };
    handleCancel2 = () => {
        this.setState({
          visible2: false,
          points:[{title:'',score:''}],
          value1:''
        });
    };
    handleCancel3 = () => {
        this.setState({
          visible3: false,
          value2:'',
          value3:''
        });
    };
    handleCancel4 = () => {
        this.setState({
          visible4: false,
          value4:''
        });
    };
    handleCancel5 = () => {
        this.setState({
          visible5: false,
          editName:'',
          editScore:''
        });
    };
    handleCancel6 = () => {
        this.setState({
          visible6: false,
        });
    };
    rowspanFun = (data, nameList)=> {
        for (var i = 0; i < nameList.length; i++) {
          var name = nameList[i];
          var startRow = 0;
          var endRow = data.length;
          var mergeNum = 1;
          if (endRow != 1) {
            for (var j = startRow; j < endRow; j++) {
              if (j == endRow - 1) { //判断是否是最后一个元素
                if (startRow == endRow - 1) {
                  data[j][name + 'Rowspan'] = 1;
                }
              } else {
                if ((data[startRow][name] == data[j + 1][name])&&data[startRow][name]!='-') {
                  data[j + 1][name + 'Rowspan'] = 0;
                  mergeNum = mergeNum + 1;
                  data[startRow][name + 'Rowspan'] =mergeNum;
                } else {
                  startRow = j + 1;
                  if (mergeNum > 1) {
                    data[startRow][name + 'Rowspan'] = 1;
                  } else {
                    data[j][name + 'Rowspan'] = 1;
                  }
                  mergeNum = 1;
                }
              }
            }
          } else {
            data[0][name + 'Rowspan'] = 1;
          }
        }
        return data;
    }

    generateNode = (arr)=>{
        let node = []
        let level = 1
        arr&&arr.map((item, index)=>{
            if(item.children){
                level = level>2?level:2
                let data = item.children
                data.map(i=>{
                    if(i.children){
                        level = level>3?level:3
                        let data = i.children
                        data.map(j=>{
                            if(j.children){
                                level = level>4?level:4
                                let data = j.children
                                data.map(k=>{
                                    if(k.children){
                                        level = level>5?level:5
                                    }else{
                                        node.push({
                                            quotasId: k.quotasId,
                                            first:  `${item.label} (${item.proportion}%)`||'', 
                                            second: i.label||'',
                                            third: j.label||'',
                                            fourth: k.label||'',
                                            name: "-", 
                                            score: "-"})
                                    }
                                })
                            }else{
                                node.push({
                                    quotasId: j.quotasId,
                                    first: `${item.label} (${item.proportion}%)`||'', 
                                    second: i.label||'',
                                    third: j.label||'',
                                    fourth: '-',
                                    name: "-", 
                                    score: "-"})
                            }
                        })
                    }else{
                        node.push({
                            quotasId: i.quotasId,
                            first:  `${item.label} (${item.proportion}%)`||'', 
                            second: i.label||'',
                            third: '-',
                            fourth: '-',
                            name: "-", 
                            score: "-"})
                    }
                })
            }else{
                node.push({
                    quotasId: item.quotasId,
                    first: `${item.label} (${item.proportion}%)`||'', 
                    second: '-',
                    third: '-',
                    fourth: '-',
                    name: "-", 
                    score: "-"})

            }
        })
        console.log({level})
        this.setState({
            level
        })
        return node
    }
    // 双击td修改要点
    dblClickPoint = (editName,editScore,EditQuotasId,EditPointId) =>{
        if(editName != '-'&&editScore != "-"){
            this.setState({
                visible5: true,
                editName,
                editScore,
                EditQuotasId,
                EditPointId
            });
        }
    }
    editChange1 = (e)=>{
        this.setState({editName:e.target.value})
        
    }
    editChange2 = (e)=>{
        this.setState({editScore:e.target.value})
    }
    editPointOk = ()=>{
        if(this.state.editName === ''){
            message.error('要点不能为空！')
        }
        if(this.state.editScore === ''){
            message.error('分值不能为空！')
        }
        let params = {
            quotasId:this.state.EditQuotasId,
            score:this.state.editScore,
            pointId:this.state.EditPointId,
            title:this.state.editName
        }
        this.props.dispatch({
            type:'teacherEvaluation/editPoint',
            payload:params,
            callback:(res)=>{
                console.log("res",res);
                if(res.code===200){
                    message.success("修改成功!")
                    this.setState({
                        confirmLoading5: true,
                        editName:'',
                        editScore:''
                    });
                    setTimeout(() => {
                        this.setState({
                          visible5: false,
                          confirmLoading5: false,
                        });
                    }, 500);
                    this.getPoints()
                    this.templateManage()
                }
            }
        })
    }
   
 
    goTemplate = () =>{
        this.props.dispatch(routerRedux.push("/evaluation-manage"))
    }
    render(){
        const {pointsList, targets, points, level, rst, indexList, visible1, visible2,visible3,visible4,visible5,confirmLoading1,confirmLoading2,confirmLoading3,confirmLoading4,confirmLoading5,confirmLoading6} = this.state;
        console.log({level})
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let options=[]
        indexList&&indexList.length>0&&indexList.map(item=>{
            let indexChildren=[];
            if(item.children&&item.children.length>0){
                item.children.map(child=>{
                    let childList = [];
                    if(child.children&&child.children.length>0){
                        child.children.map(v =>{
                            return childList.push(<TreeNode value={v.label+'~'+v.quotasId} title={v.label} key={v.quotasId} />)
                        })
                    }
                    return indexChildren.push(<TreeNode value={child.label+'~'+child.quotasId} title={child.label} key={child.quotasId} >{childList}</TreeNode>)
                })
            }
            return options.push(<TreeNode value={item.label+'~'+item.quotasId} title={item.label} key={item.quotasId}>{indexChildren}</TreeNode>)
        })
        let pointChild = []
        pointsList&&pointsList.length>0&&pointsList.map(item =>{
            return pointChild.push(<Option value={item.title+'~'+item.id} key={item.id}>{item.title}</Option>)
        })


        return (
            <div className="content-main templateMange">
                 {/* <Breadcrumb className="title">
                    <Breadcrumb.Item onClick={this.goTemplate.bind(this)} className="goTemplate">评课模板</Breadcrumb.Item>
                    <Breadcrumb.Item>模板管理</Breadcrumb.Item>
                </Breadcrumb> */}
                <div>
                    <div className="btn">
                        <Button type="primary" onClick={this.addIndex.bind(this)}>添加指标</Button>
                        <Button type="primary" onClick={this.addKey.bind(this)}>添加要点</Button>
                        <Button type="primary" onClick={this.delKey.bind(this)}>删除要点</Button>
                        <Button type="primary" onClick={this.delIndex.bind(this)}>删除指标</Button>
                    </div>
                    <Modal
                        width="1200px"
                        title="添加指标"
                        visible={visible1}
                        onOk={this.addIndexOk}
                        confirmLoading={confirmLoading1}
                        onCancel={this.handleCancel1}
                    >
                        <Form  style={{width:'100%',margin:'40px 0'}}>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='上级指标:'>
                                        <TreeSelect
                                            value={this.state.value}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:900,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChange}
                                            showSearch
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                targets&&targets.map((item,index) =>{
                                   return <Row gutter={24} key={index}>
                                            <Col span={17}>
                                                <FormItem {...formItemLayout} label='本级指标:'>
                                                    <TextArea onChange={this.onChange1.bind(this,index)} value={item.name||undefined} placeholder="本级指标，限100字" maxLength={100} />
                                                </FormItem>
                                            </Col>
                                           {
                                               this.state.value == ''?
                                                <Col span={4}>
                                                    <FormItem {...formItemLayout} label=''>
                                                        <Input onChange={this.onChange2.bind(this,index)} value={item.proportion||undefined} placeholder="百分比"/>
                                                    </FormItem>
                                                </Col>:null
                                            }
                                            <Col span={3}>
                                                <FormItem {...formItemLayout} label=''>
                                                    <Icon type="minus-circle" onClick={this.del.bind(this,index)} style={{color:'#39A7E1',fontSize:'20px'}} />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                })
                            }
                            
                            <Row gutter={24}>
                                <Col span={2} offset={3}>
                                    <FormItem  label=''>
                                        <Icon type="plus-circle" onClick={this.add.bind(this)} style={{color:'#39A7E1',fontSize:'20px'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="1200px"
                        title="添加要点"
                        visible={visible2}
                        onOk={this.addPointOk}
                        confirmLoading={confirmLoading2}
                        onCancel={this.handleCancel2}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='上级指标:'>
                                        <TreeSelect
                                            value={this.state.value1}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:900,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChangeValue1}
                                            showSearch
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                points&&points.map((item,index) =>{
                                   return <Row  key={index}>
                                            <Col span={17}>
                                                <FormItem {...formItemLayout} label='评价要点:'>
                                                    <TextArea onChange={this.onChange3.bind(this,index)} value={item.title||undefined} placeholder="本级要点，限100字" maxLength={100}/>
                                                </FormItem>
                                            </Col>
                                            <Col span={4} offset={1}>
                                                <FormItem {...formItemLayout} label=''>
                                                    <Input onChange={this.onChange4.bind(this,index)} value={item.score||undefined} placeholder="分数"/>
                                                </FormItem>
                                            </Col>
                                            <Col span={2}>
                                                <FormItem {...formItemLayout} label=''>
                                                    <Icon type="minus-circle" onClick={this.del1.bind(this,index)} style={{color:'#39A7E1',fontSize:'20px'}} />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                })
                            }
                            <Row gutter={24}>
                                <Col span={2} offset={3}>
                                    <FormItem  label=''>
                                        <Icon type="plus-circle" onClick={this.add1.bind(this)} style={{color:'#39A7E1',fontSize:'20px'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="1200px"
                        title="删除要点"
                        visible={visible3}
                        onOk={this.delPointOk.bind(this)}
                        confirmLoading={confirmLoading3}
                        onCancel={this.handleCancel3}
                    >
                        <Form  style={{width:'100%',padding:"30px 0"}}>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='指标:'>
                                        <TreeSelect
                                            value={this.state.value2}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:900,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChangeValue2}
                                            showSearch
                                            placeholder="请选择指标"
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='要点:'>
                                        <Select
                                            value={this.state.value3}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:900,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChangeValue3}
                                            showSearch
                                            placeholder="请选择要点"
                                        >
                                         {pointChild}  
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="1200px"
                        title="删除指标"
                        visible={visible4}
                        onOk={this.delIndexOk}
                        confirmLoading={confirmLoading4}
                        onCancel={this.handleCancel4}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='指标:'>
                                        <TreeSelect
                                            value={this.state.value4}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:900,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChangeValue4}
                                            showSearch
                                            placeholder="请选择指标"
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    {
                        level? <table border="1" className="templateTable" >
                        <thead>
                            <tr>
                                <th>一级指标</th>
                                {level>=2? <th>二级指标</th>: null}
                                {level>=3? <th>三级指标</th>: null}
                                {level>=4? <th>四级指标</th>: null}
                                <th className="point">评价要点</th>
                                <th>分值</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            rst&&rst.map((item, index)=>{
                                return <tr key={index}>
                                    {item.firstRowspan != 0?<td rowSpan={item.firstRowspan}>{item.first}</td>:null}
                                    {item.secondRowspan != 0&&level>=2?<td rowSpan={item.secondRowspan}>{item.second}</td>:null}
                                    {item.thirdRowspan != 0&&level>=3?<td rowSpan={item.thirdRowspan}>{item.third}</td>:null}
                                    {item.fourthRowspan != 0&&level>=4?<td rowSpan={item.fourthRowspan}>{item.fourth}</td>:null}
                                    <td onDoubleClick={this.dblClickPoint.bind(this,item.name,item.score,item.quotasId,item.pointId)}>{item.name}</td>
                                    <td onDoubleClick={this.dblClickPoint.bind(this,item.name,item.score,item.quotasId,item.pointId)}>{item.score}</td>
                                </tr>
                            })
                            }
                        </tbody>
                    </table>:null
                    }
                    
                    <Modal
                        width="500px"
                        title="编辑要点和分数"
                        visible={visible5}
                        onOk={this.editPointOk}
                        confirmLoading={confirmLoading5}
                        onCancel={this.handleCancel5}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={17}>
                                    <FormItem {...formItemLayout} label='评价要点:'>
                                        <Input onChange={this.editChange1.bind(this)} value={this.state.editName}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={9} offset={2}>
                                    <FormItem {...formItemLayout} label='分值：'>
                                        <Input onChange={this.editChange2.bind(this)} value={this.state.editScore}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                   
                   
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
  }
  
export default connect(mapStateToProps)(Form.create()(TempalateManage));