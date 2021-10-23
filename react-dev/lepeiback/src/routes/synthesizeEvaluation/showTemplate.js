import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, TreeSelect, Modal, Select, Form, Col, Row, Input, Upload, message, Button, Icon } from 'antd';
import { Link } from "dva/router";
import { getQueryString, chartType, isNumber } from '../../utils/public';
import { getImg } from '../../utils/img';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

class ShowTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexList: [], //上级指标
            visible1: false,
            confirmLoading1: false,
            visible2: false,
            confirmLoading2: false,
            visible3: false,
            confirmLoading3: false,
            visible4: false,
            confirmLoading4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            confirmLoading5: false,
            confirmLoading6: false,
            confirmLoading7: false,
            confirmLoading8: false,
            targets: [{ name: '', chartType:'1',proportion: '' }], //指标数组
            name: '',
            proportion: '',
            points: [{title: '',raters: [] }], //增加-要点数组
            value: '',
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            value5: '',
            pointsList: [], //要点数组
            pointId: '',
            arr: [],
            targetName:'',
            editPoint:'',
            editName: '',
            EditPointId: '',
            level: 1,
            raterList:[], //评价人列表
            imageUrl:'',
			title:"模板管理",

        }
    }
    componentDidMount = () => {
        this.templateManage()
        this.getQuotasList()
        sessionStorage.removeItem("qiniuToken");
        this.props.dispatch({ //获取上传图片token
            type:'user/getPicToken',
            callback:(res)=>{
                if(res.code===200){
                    sessionStorage.setItem("qiniuToken",res.data.token)
                    this.setState({qiniuToken:res.data.token})
                }
            }
        })
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/evaluation-template"
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

    // 模板管理列表
    templateManage = () => {
        const id = getQueryString('templateId')
        this.props.dispatch({
            type: 'synthesizeEvaluation/showTemplateList',
            payload: { "templateId": id },
            callback: (res) => {
                if (res.code === 200) {
                    let points = res.data.points
                    let quotas = res.data.quotas
                    let nodes = this.generateNode(quotas)
                    let rst = []
                    nodes && nodes.map(item => {
                        let flag = false
                        points && points.map(i => {
                            if (i.quotasId == item.quotasId) {
                                rst.push({
                                    quotasId: item.quotasId,
                                    first: item.first,
                                    proportion:item.proportion,
                                    chartType:item.chartType,
                                    second: item.second,
                                    third: item.third,
                                    fourth: item.fourth,
                                    title: i.title,
                                    rater: i.rater,
                                    pointId: i.pointId,
                                    icon:item.icon
                                })
                                flag = true
                            }
                        })
                        if (!flag) {
                            rst.push(item)
                        }
                    })
                    rst = this.rowspanFun(rst, ['first', 'second', 'third', 'fourth'])
                    this.setState({
                        rst: rst
                    })

                }
            }
        })
    }
    // 获取指标列表
    getQuotasList = () => {
        const id = getQueryString('templateId')
        this.props.dispatch({
            type: 'synthesizeEvaluation/templateQuotas',
            payload: { "templateId": id },
            callback: (res) => {
                if (res.code === 200) {
                    this.setState({
                        indexList: res.data
                    })
                }
            }
        })
    }
    // 获取要点列表
    getPoints = (id) => {
        this.props.dispatch({
            type: 'synthesizeEvaluation/pointsList',
            payload: { "quotasId": id },
            callback: (res) => {
                if (res.code === 200) {
                    this.setState({
                        pointsList: res.data
                    })
                }
            }
        })
    }

    // 添加指标
    addIndex = () => {
        this.setState({
            visible1: true,
        });
    }
    // 上级指标选择
    onChange = value => {
        this.setState({ value: value});
    };
    // 本机指标
    onChange1 = (index, e) => {
        let oldData = this.state.targets
        oldData[index].name = e.target.value
        this.setState({
            targets: oldData
        })
    }
    // 图标类型选择
    onChange2 = (index, val) => {
        let oldData = this.state.targets
        oldData[index].chartType = val
        this.setState({
            targets: oldData
        })
    }
    // 百分比
    onChange3 = (index, e) => {
        let oldData = this.state.targets
        oldData[index].proportion = e.target.value
        this.setState({
            targets: oldData
        })
    }
    // 增加本级指标
    add = () => {
        let oldData = this.state.targets
        oldData.push({
            name: '',
            proportion: '',
            chartType:'1'
        })
        this.setState({ targets: oldData })
    }
    // 删除本级指标
    del = (index) => {
        let oldData = this.state.targets
        let newData = oldData.filter((item, i) => {
            return i !== index
        })
        if (oldData.length === 1) {
            return
        }
        this.setState({
            targets: newData
        })
    }
    positive = (val) =>{
        if(!(/(^(0|[1-9][0-9]*)(\.\d+)?$)/.test(val))){
          return false
        }
        return true
    }
    // 确认添加指标
    addIndexOk = () => {
        let flag = true
        const id = getQueryString('templateId');
        this.state.targets.map(item => {
          
            if (item.name === '') {
                message.error('指标不能为空！');
                flag = false
            }
            if (this.state.value === '' && item.name && item.proportion === '') {
                message.error('占比不能为空！');
                flag = false
            }else if(item.proportion && !this.positive(item.proportion)){
                message.error('占比输入不合法');
                flag = false
            }
        })
        if (!flag) {
            return
        }
        let params = {
            "templateId": id,
            "pid": this.state.value || '',
            "quotas": this.state.targets
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/addTemplateQuotas',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("添加指标成功!")
                    this.setState({
                        confirmLoading1: true,
                        value: '',
                        targets: [{ name: '', proportion: '',chartType:'1' }]
                    });
                    setTimeout(() => {
                        this.setState({
                            visible1: false,
                            confirmLoading1: false,
                        });
                    }, 500);
                    this.templateManage()
                    this.getQuotasList()
                }
            }
        })


    };
    // 取消指标添加
    handleCancel1 = () => {
        this.setState({
            visible1: false,
            value: '',
            targets: [{ name: '', chartType:'1',proportion: '' }]
        });
    };
    // 获取评价人
    getRater = () =>{
        this.props.dispatch({
            type: 'synthesizeEvaluation/getRater',
            callback: (res) => {
                if (res.code === 200) {
                    this.setState({
                        raterList: res.data,
                    })
                }
            }
        })
    }
    // 添加要点
    addKey = () => {
        this.getRater()
        this.setState({visible2: true})
    }
    // 添加要点-上级指标选择
    onChangeValue1 = (value) => {
        this.setState({ value1: value})
    }
    // 添加要点-评价要点
    onChange4 = (index, e) => {
        let pointData = this.state.points
        pointData[index].title = e.target.value
        this.setState({
            points: pointData
        })
    }
    // 添加要点-选择评价人
    onChange5 = (index,val) => {
        let pointData = this.state.points
        pointData[index].raters = val
        this.setState({
            points: pointData,
        })
    }
    // 添加要点-添加
    add1 = () => {
        let pointData = this.state.points
        pointData.push({
            title: '',
            raters: []
        })
        this.setState({ points: pointData })
    }
    // 添加要点-删除
    del1 = (index) => {
        let pointData = this.state.points
        let newData = pointData.filter((item, i) => {
            return i !== index
        })
        if (pointData.length === 1) {
            return
        }
        this.setState({
            points: newData
        })
    }
    // 确认添加要点
    addPointOk = () => {
        let flag = true
        let pointData = this.state.points
        if (this.state.value1 === '') {
            return message.error('请选择上级指标！');
        }
        pointData.map((item,index) => {
            let newArr = []
            item.raters&&item.raters.map(v =>{
                newArr.push({
                    raterType:v.split('~')[0],
                    rater:v.split('~')[1]
                })
            })
            item.raters = newArr
            if (item.title === '') {
                message.error('要点不能为空！')
                flag = false
            }else if(item.raters == []){
                message.error('请选择评价人')
                flag = false
            }
        })
        if (!flag) {
            return
        }
        let params = {
            quotasId: this.state.value1,
            points: this.state.points
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/addEvaPoint',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("添加要点成功!")
                    this.setState({
                        confirmLoading2: true,
                        points: [{ 
                            title: '', 
                            raters: []
                        }],
                        value1: ''
                    });
                    setTimeout(() => {
                        this.setState({
                            visible2: false,
                            confirmLoading2: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })
    }
    // 取消添加要点
    handleCancel2 = () => {
        this.setState({
            visible2: false,
            points: [{ 
                title: '', 
                raters: []
            }],
            value1: '',
        });
    };

    // 删除要点
    delKey = () => {
        this.setState({
            visible3: true,
        });
    }
    // 删除要点-顶级指标选择
    onChangeValue2 = (value) => {
        this.setState({ value2: value});
        this.getPoints(value)
    }
     // 删除要点-要点选择
    onChangeValue3 = (value) => {
        this.setState({ value3: value});
    }
    // 确认删除要点
    delPointOk = () => {
        if (this.state.value2 === '') {
            message.error("请选择指标！")
            return
        }
        if (this.state.value3 === '') {
            message.error("请选择要点！")
            return
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/delEvaPoint',
            payload: { "pointId": this.state.value3 },
            callback: (res) => {
                if (res.code === 200) {
                    message.success("删除要点成功!")
                    this.setState({
                        confirmLoading3: true,
                        value2: '',
                        value3: ''
                    });
                    setTimeout(() => {
                        this.setState({
                            visible3: false,
                            confirmLoading3: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })

    }
    // 取消删除要点
    handleCancel3 = () => {
        this.setState({
            visible3: false,
            value2: '',
            value3: ''
        });
    };

    // 删除指标
    delIndex = () => {
        this.setState({
            visible4: true,
        });
    }
    // 删除指标-指标选择
    onChangeValue4 = (value) => {
        this.setState({ value4: value});
    }
    // 确认删除指标
    delIndexOk = () => {
        if (this.state.value4 === '') {
            message.error("请选择要删除的指标！")
            return
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/delTarget',
            payload: { quotasId: this.state.value4 },
            callback: (res) => {
                if (res.code === 200) {
                    message.success("删除指标成功!")
                    this.setState({
                        confirmLoading4: true,
                        value4: ''
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
    // 取消指标删除
    handleCancel4 = () => {
        this.setState({
            visible4: false,
            value4: ''
        });
    };

    // 指标图标
    targetIcon = () => {
        const id = getQueryString('templateId')
        this.props.dispatch({
            type:'synthesizeEvaluation/allTopQuotas',
            payload:{"templateId":id},
            callback:(res) =>{
              if(res.code === 200){
                this.setState({
                    quotasList:res.data,
                    visible5: true,
                })
              }
            }
        })
      
    }
    // 指标图标-一级指标选择
    onChangeValue5 = (value) => {
        this.setState({ value5: value});
    }
    // 上传图标
    beforeUpload = (file) =>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('仅支持上传JPG/PNG');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传图片需小于2MB');
        }
        return isJpgOrPng && isLt2M;
    }
    
    handleChange = info => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.setState({imgPath:info.file.response.id})
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name}上传失败`);
        }
    };
    // 确认上传
    uploadTargetIcon = () => {
        if (this.state.value5 === '') {
            message.error("请选择一级指标")
            return
        }
        if (this.state.imgPath === '') {
            message.error("请选择上传图标")
            return
        }
        const params = {
            "quotasId":this.state.value5,
            "icon":this.state.imgPath
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/uploadTargetIcon',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("图标上传成功!")
                    this.setState({
                        confirmLoading5: true,
                        value5: ''
                    });
                    setTimeout(() => {
                        this.setState({
                            visible5: false,
                            confirmLoading5: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })

    }
    // 图标上传取消
    handleCancel5 = () => {
        this.setState({
            visible5: false,
            value5: '',
            imgPath: ''
        });
    };

     // 合并行
     rowspanFun = (data, nameList) => {
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
                        if ((data[startRow][name] == data[j + 1][name]) && data[startRow][name] != '-') {
                            data[j + 1][name + 'Rowspan'] = 0;
                            mergeNum = mergeNum + 1;
                            data[startRow][name + 'Rowspan'] = mergeNum;
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
    // 表格数据重组
    generateNode = (arr) => {
        let node = []
        let level = 1
        arr && arr.map((item, index) => {
            if (item.children) {
                level = level>2?level:2
                let data = item.children
                data.map(i => {
                    if (i.children) {
                        level = level>3?level:3
                        let data = i.children
                        data.map(j => {
                            if (j.children) {
                                level = level>4?level:4
                                let data = j.children
                                data.map(k => {
                                    if (k.children) {
                                        level = level>5?level:5
                                    } else {
                                        node.push({
                                            quotasId: k.quotasId,
                                            first: item.name,
                                            proportion:item.proportion,
                                            chartType:item.chartType,
                                            second: i.name || '',
                                            third: j.name || '',
                                            fourth: k.name || '',
                                            title: "-",
                                            rater: "-",
                                            icon:item.icon
                                        })
                                    }
                                })
                            } else {
                                node.push({
                                    quotasId: j.quotasId,
                                    first: item.name,
                                    proportion:item.proportion,
                                    chartType:item.chartType,
                                    second: i.name || '',
                                    third: j.name || '',
                                    fourth: '-',
                                    title: "-",
                                    rater: "-",
                                    icon:item.icon
                                })
                            }
                        })
                    } else {
                        node.push({
                            quotasId: i.quotasId,
                            first: item.name,
                            proportion:item.proportion,
                            chartType:item.chartType,
                            second: i.name || '',
                            third: '-',
                            fourth: '-',
                            title: "-",
                            rater: "-",
                            icon:item.icon
                        })
                    }
                })
            } else {
                node.push({
                    quotasId: item.quotasId,
                    first: item.name,
                    proportion:item.proportion,
                    chartType:item.chartType,
                    second: '-',
                    third: '-',
                    fourth: '-',
                    title: "-",
                    rater: "-",
                    icon:item.icon,
                })

            }
        })
        this.setState({
            level
        })
        return node
    }
    
    // 双击修改指标
    dblClickTarget =(name,id) =>{
        if(name != '-'){
            this.setState({
                visible6: true,
                targetName:name,
                targetId:id
            })
        }
    }
    // 修改指标
    editChange1 = (e) => {
        this.setState({ targetName: e.target.value })
    }
    // 确认修改指标
    editTarget = () =>{
        if(this.state.targetName === ''){
            message.error("指标不能为空")
        }
        const params = {
            "id":this.state.targetId,
            "name":this.state.targetName,
            "type":1
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/editTarget',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("指标修改成功!")
                    this.setState({
                        confirmLoading6: true,
                        targetName: ''
                    });
                    setTimeout(() => {
                        this.setState({
                            visible6: false,
                            confirmLoading6: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })
    }
    // 取消指标修改
    handleCancel6 = () => {
        this.setState({
            visible6: false,
            targetName: '',
        });
    };
   
    // 双击td修改要点
    dblClickPoint = (title,id) => {
        if (title != '-') {
            this.setState({
                visible7: true,
                editPoint:title,
                EditPointId:id
            });
        }
    }
    // 修改要点
    editChange2 = (e) => {
        this.setState({ editPoint: e.target.value })
    }
    // 确认修改要点
    editPointOk = () => {
        if (this.state.editPoint === '') {
            message.error('要点不能为空！')
        }
        let params = {
            "id":this.state.EditPointId,
            "name":this.state.editPoint,
            "type":2
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/editTarget',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("要点修改成功!")
                    this.setState({
                        confirmLoading7: true,
                        editPoint: '',
                    });
                    setTimeout(() => {
                        this.setState({
                            visible7: false,
                            confirmLoading7: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })
    }
    // 取消要点修改
    handleCancel7 = () => {
        this.setState({
            visible7: false,
            editPoint: '',
        });
    };
    // 双击修改评价人
    dblClickRater = (id) => {
        this.getRater()
        if (id) {
            this.props.dispatch({ 
                type: 'synthesizeEvaluation/editRater',
                payload:{"pointId":id},
                callback:(res)=>{
                    if(res.code === 200){
                        let raterIds = []
                        res.data&&res.data.map(item =>{
                            raterIds.push(item.raterType + '~' + item.rater)
                        })
                        this.setState({
                            visible8: true,
                            raterIds,
                            gistId:id
                        });
                    }
                }
            })
          
        }
    }
    // 选择评价人
    editChange3 = (val) =>{
        this.setState({raterIds:val})
    }
    // 确认修改评价人
    editRaterOk = () => {
        if (this.state.raterIds.length == 0) {
            return message.error('评价人不能为空！')
        }
        let raters = []
        this.state.raterIds&&this.state.raterIds.map(item =>{
            raters.push({
                raterType:item.split('~')[0],
                rater:item.split('~')[1]
            })
        })
        let params = {
            "pointId":this.state.gistId,
            "raters":raters
        }
        this.props.dispatch({
            type: 'synthesizeEvaluation/changeRater',
            payload: params,
            callback: (res) => {
                if (res.code === 200) {
                    message.success("评价人修改成功!")
                    this.setState({
                        confirmLoading8: true,
                        raterIds: [],
                    });
                    setTimeout(() => {
                        this.setState({
                            visible8: false,
                            confirmLoading8: false,
                        });
                    }, 500);
                    this.templateManage()
                }
            }
        })
    }
    // 取消评价人修改
    handleCancel8 = () => {
        this.setState({
            visible8: false,
        });
    };
    render() {
        const { raterList,quotasList,imgPath, pointsList, targets, points, level, rst, indexList, visible1, visible2, visible3, visible4, visible5,visible6, visible7,
        visible8,confirmLoading1, confirmLoading2, confirmLoading3, confirmLoading4, confirmLoading5, confirmLoading6, confirmLoading7,confirmLoading8 } = this.state;
    
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>)
        const qiniuToken=sessionStorage.getItem('qiniuToken');
        const props = {
            name: 'file',
            action: 'https://upload.qiniup.com/',
            headers: {
              authorization: 'authorization-text',
              "Content-Disposition":'form-data; name="file";'
            },
            data:{
                token:qiniuToken?qiniuToken:this.state.qiniuToken,
            },
            beforeUpload:this.beforeUpload,
            onChange: this.handleChange,
        } 
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const formItemLayout1 = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        let options = []
        indexList && indexList.length > 0 && indexList.map(item => {
            let indexChildren = [];
            if (item.children && item.children.length > 0) {
                item.children.map(child => {
                    let childList = [];
                    if (child.children && child.children.length > 0) {
                        child.children.map(v => {
                            return childList.push(<TreeNode value={ v.quotasId} title={v.name} key={v.quotasId} />)
                        })
                    }
                    return indexChildren.push(<TreeNode value={child.quotasId} title={child.name} key={child.quotasId} >{childList}</TreeNode>)
                })
            }
            return options.push(<TreeNode value={item.quotasId} title={item.name} key={item.quotasId}>{indexChildren}</TreeNode>)
        })
        let children = []
        raterList&&raterList.map((item,index) =>{
            return children.push(<Option key={index} value={item.raterType + '~' + item.rater}>{item.name}</Option>)
        })
        let pointChild = []
        pointsList && pointsList.length > 0 && pointsList.map(item => {
            return pointChild.push(<Option value={item.pointId} key={item.pointId}>{item.title}</Option>)
        })
        let quotasOption = []
        quotasList&&quotasList.length>0&&quotasList.map(item => {
          return quotasOption.push(<Option key={item.quotasId} value={item.quotasId}>{item.name}</Option>)
        })

        return (
            <div className="content-main show-template">
                {/* <Breadcrumb style={{ padding: "15px" }}>
                    <Breadcrumb.Item><Link to="/evaluation-template">评价模板</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>模板管理</Breadcrumb.Item>
                </Breadcrumb> */}
                <div style={{ margin: "0 0 20px 20px" }}>
                    <div className="btn">
                        <Button type="primary" onClick={this.addIndex.bind(this)}>添加指标</Button>
                        <Button type="primary" onClick={this.addKey.bind(this)}>添加要点</Button>
                        <Button type="primary" onClick={this.delKey.bind(this)}>删除要点</Button>
                        <Button type="primary" onClick={this.delIndex.bind(this)}>删除指标</Button>
                        <Button type="primary" onClick={this.targetIcon.bind(this)}>指标图标</Button>
                    </div>
                    {
                        level ? <table border="1" className="templateTable" >
                            <thead>
                                <tr>
                                    <th>一级指标</th>
                                    {level >= 2 ? <th>二级指标</th> : null}
                                    {level >= 3 ? <th>三级指标</th> : null}
                                    {level >= 4 ? <th>四级指标</th> : null}
                                    <th className="point">评价要点</th>
                                    <th>评价人</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rst && rst.map((item, index) => {
                                        return <tr key={index}>
                                            {item.firstRowspan != 0 ? <td 
                                            onDoubleClick={this.dblClickTarget.bind(this, item.first, item.quotasId)} 
                                            rowSpan={item.firstRowspan}>
                                                <span>{item.first}({item.proportion}%)-{chartType(item.chartType)}</span>
                                                {item.icon?<img className="chartIcon" alt="" src={getImg(item.icon)} />:null}
                                            </td> : null}
                                            {item.secondRowspan != 0 && level >= 2 ? <td 
                                            onDoubleClick={this.dblClickTarget.bind(this, item.second, item.quotasId)} 
                                            rowSpan={item.secondRowspan}>{item.second}</td> : null}
                                            {item.thirdRowspan != 0 && level >= 3 ? <td 
                                            onDoubleClick={this.dblClickTarget.bind(this, item.third, item.quotasId)} 
                                            rowSpan={item.thirdRowspan}>{item.third}</td> : null}
                                            {item.fourthRowspan != 0 && level >= 4 ? <td 
                                            onDoubleClick={this.dblClickTarget.bind(this, item.fourth, item.quotasId)} 
                                            rowSpan={item.fourthRowspan}>{item.fourth}</td> : null}
                                            <td onDoubleClick={this.dblClickPoint.bind(this, item.title,item.pointId)}>{item.title}</td>
                                            <td onDoubleClick={this.dblClickRater.bind(this, item.pointId)}>{item.rater}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table> : null
                    }
                    <Modal
                        width="800px"
                        title="添加指标"
                        visible={visible1}
                        onOk={this.addIndexOk}
                        confirmLoading={confirmLoading1}
                        onCancel={this.handleCancel1}
                    >
                        <Form style={{ width: '100%', margin: '20px 0' }}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <FormItem {...formItemLayout} label='上级指标:'>
                                        <TreeSelect
                                            placeholder="上级指标"
                                            value={this.state.value}
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto', maxWidth: 700, }}
                                            treeDefaultExpandAll
                                            onChange={this.onChange}
                                            showSearch
                                            allowClear
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                targets && targets.map((item, index) => {
                                    return <Row gutter={24} key={index}>
                                        <Col span={14}>
                                            <FormItem {...formItemLayout} label='本级指标:'>
                                                <TextArea 
                                                onChange={this.onChange1.bind(this, index)} 
                                                value={item.name} placeholder="本级指标，限100字" 
                                                maxLength={100} 
                                                autosize={{ minRows: 1,maxRows:6 }}/>
                                            </FormItem>
                                        </Col>
                                        {
                                            !this.state.value ?
                                                <Col span={4}>
                                                    <FormItem label=''>
                                                        <Select value={item.chartType} onChange={this.onChange2.bind(this,index)}>
                                                            <Option value="1">柱状图</Option>
                                                            <Option value="3">曲线图</Option>
                                                            <Option value="5">雷达图</Option>
                                                        </Select>
                                                    </FormItem>
                                                </Col> : null
                                        }
                                        {
                                            !this.state.value ?
                                                <Col span={4}>
                                                    <FormItem>
                                                        <Input onChange={this.onChange3.bind(this, index)}  value={item.proportion} placeholder="百分比" />
                                                    </FormItem>
                                                </Col> : null
                                        }
                                        {
                                            targets.length>1?
                                            <Col span={2}>
                                                <FormItem label=''>
                                                    <Icon type="minus-circle" onClick={this.del.bind(this, index)} style={{ color: '#39A7E1', fontSize: '20px' }} />
                                                </FormItem>
                                            </Col>:null
                                        }
                                    </Row>
                                })
                            }
                            <Row gutter={24}>
                                <Col span={2} offset={3}>
                                    <FormItem label=''>
                                        <Icon type="plus-circle" onClick={this.add.bind(this)} style={{ color: '#39A7E1', fontSize: '20px' }} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="900px"
                        title="添加要点"
                        visible={visible2}
                        onOk={this.addPointOk}
                        confirmLoading={confirmLoading2}
                        onCancel={this.handleCancel2}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <FormItem {...formItemLayout1} label='上级指标:'>
                                        <TreeSelect
                                            value={this.state.value1}
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto',maxWidth:700,}}
                                            treeDefaultExpandAll
                                            onChange={this.onChangeValue1}
                                            showSearch
                                            allowClear
                                        >
                                            {options}
                                        </TreeSelect>
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                points&&points.map((item,index) =>{
                                   return <Row  key={index} gutter={24}>
                                            <Col span={14}>
                                                <FormItem {...formItemLayout1} label='评价要点:'>
                                                    <TextArea 
                                                    onChange={this.onChange4.bind(this,index)} 
                                                    value={item.title||undefined} 
                                                    placeholder="评价要点，限100字" 
                                                    maxLength={100} 
                                                    autosize={{ minRows: 1,maxRows:6 }}/>
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem>
                                                    <Select 
                                                    onChange={this.onChange5.bind(this,index)} 
                                                    mode="multiple"
                                                    showSearch
                                                    value={item.raters}
                                                    filterOption={(input, option) =>
                                                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    placeholder="请选择评价人">
                                                       {children}
                                                    </Select>
                                                </FormItem>
                                            </Col> 
                                            {
                                                points.length>1?
                                                <Col span={2}>
                                                    <FormItem>
                                                        <Icon type="minus-circle" onClick={this.del1.bind(this,index)} style={{color:'#39A7E1',fontSize:'20px'}} />
                                                    </FormItem>
                                                </Col>:null
                                            }
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
                        width="800px"
                        title="删除要点"
                        visible={visible3}
                        onOk={this.delPointOk.bind(this)}
                        confirmLoading={confirmLoading3}
                        onCancel={this.handleCancel3}
                    >
                        <Form  style={{width:'100%',padding:"30px 0"}}>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout} label='指标:'>
                                        <TreeSelect
                                            value={this.state.value2}
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto',maxWidth:700,}}
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
                                <Col span={20}>
                                    <FormItem {...formItemLayout} label='要点:'>
                                        <Select
                                            value={this.state.value3}
                                            onChange={this.onChangeValue3}
                                            showSear
                                        >
                                         {pointChild}  
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="600px"
                        title="删除指标"
                        visible={visible4}
                        onOk={this.delIndexOk}
                        confirmLoading={confirmLoading4}
                        onCancel={this.handleCancel4}
                    >
                        <Form>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout1} label='指标:'>
                                        <TreeSelect
                                            value={this.state.value4}
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto',maxWidth:600,}}
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
                    <Modal
                        width="600px"
                        title="图标上传"
                        visible={visible5}
                        onOk={this.uploadTargetIcon}
                        confirmLoading={confirmLoading5}
                        onCancel={this.handleCancel5}
                    >
                        <Form>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout1} label='一级指标:'>
                                        <Select
                                            value={this.state.value5}
                                            onChange={this.onChangeValue5}
                                        >
                                            {quotasOption}
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={20}>
                                <FormItem {...formItemLayout1} label={'上传图标'}>
                                    <Upload
                                        {...props}
                                        showUploadList={false}
                                        listType="picture-card"
                                    >
                                        {imgPath ? <img src={getImg(imgPath)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>
                                </FormItem>
                                </Col> 
                            </Row>
                          
                        </Form>
                    </Modal>
                    <Modal
                        width="700px"
                        title="编辑指标"
                        visible={visible6}
                        onOk={this.editTarget}
                        confirmLoading={confirmLoading6}
                        onCancel={this.handleCancel6}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout} label='指标:'>
                                        <Input onChange={this.editChange1.bind(this)} value={this.state.targetName}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="700px"
                        title="编辑要点"
                        visible={visible7}
                        onOk={this.editPointOk}
                        confirmLoading={confirmLoading7}
                        onCancel={this.handleCancel7}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout} label='要点:'>
                                        <TextArea maxLength={100} onChange={this.editChange2.bind(this)} value={this.state.editPoint}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        width="700px"
                        title="编辑评价人"
                        visible={visible8}
                        onOk={this.editRaterOk}
                        confirmLoading={confirmLoading8}
                        onCancel={this.handleCancel8}
                    >
                        <Form  style={{width:'100%'}}>
                            <Row gutter={24}>
                                <Col span={20}>
                                    <FormItem {...formItemLayout} label='评价人'>
                                        <Select 
                                        onChange={this.editChange3.bind(this)} 
                                        mode="multiple"
                                        showSearch
                                        value={this.state.raterIds}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {children}
                                        </Select>
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

export default connect(mapStateToProps)(Form.create()(ShowTemplate));