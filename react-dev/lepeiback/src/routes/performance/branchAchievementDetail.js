import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,Breadcrumb, DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import PageIndex from '../../components/page';
import { Link } from 'dva/router';
import "./style.less";
import { getQueryString, isCorrectMoneyCanBeNegative} from '../../utils/public';
import { portUrl } from '../../utils/img';

const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;

class branchAchievementDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            visible: false,
            personId: '',
            itemId: '',
            isPublished: '',
            exportUrl: '',
            title:"查看"
        };
    }
    componentDidMount=()=>{
        this.props.dispatch({
            type: 'user/setLastRoute',
            payload: {
              breadcrumbTitle:this.state.title,
              parentRoute:"/branch-list"
            },
          })
        this.getDetail()
    }
    componentWillUnmount = () => {
        sessionStorage.removeItem("qiniuToken");
            //组件卸载时，清空手动加入的面包屑
            this.props.dispatch({
              type: 'user/setLastRoute',
              payload: {},
            })
          
      }
    handleCancel=()=>{
        this.setState({
            visible: false
        })
    }
    handleOk=()=>{
        this.props.form.validateFields((err, values) => {
            if(err) return
            if(!isCorrectMoneyCanBeNegative(values.money)){
                return message.warning("金额格式不正确！")
            }
            const params={
              "personId": this.state.personId,
              "itemId": this.state.itemId,
              "money": values.money||'',
            }
            this.props.dispatch({
                type:'performance/modifyMoney',
                payload: params,
                callback:(res)=>{
                    if(res.code===200){
                        message.success('修改成功')
                        this.setState({
                            visible: false
                        })
                        this.getDetail()
                    }
                }
            })
          })
    }

    edit=(personId, itemId)=>{
        this.props.form.resetFields(["money"])
        if(personId&&itemId&&this.state.isPublished!=1){
            this.setState({
                visible: true,
                personId,
                itemId
            })
        }
    }

    getDetail=()=>{
        this.props.dispatch({
            type:'performance/getBranchDetail',
            payload: {
                id: getQueryString("id")
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        tableData: res.data,
                        isPublished: res.data.isPublished
                    })
                }
            }
        })
    }
    
    cancelPublish = () =>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>是否撤销？</span>,
            onOk() {
            that.props.dispatch({
                type: 'performance/cancelPublish',
                payload:{templateId: getQueryString("id")},
                callback:(res)=>{
                    if(res.code===200){
                        message.success('撤销成功！')
                        that.getDetail()
                    }
                }
            })
            },
            onCancel() {},
        });
    }

    publishTemplate = () =>{
        let that = this;
        confirm({
            title: '提示',
            content: <span>是否发布？</span>,
            onOk() {
            that.props.dispatch({
                type: 'performance/publishTemplate',
                payload:{templateId: getQueryString("id")},
                callback:(res)=>{
                    if(res.code===200){
                        message.success('发布成功！')
                        that.getDetail()
                    }
                }
            })
            },
            onCancel() {},
        });
    }


    export=()=>{
        this.props.form.validateFields((err, values) => {
            let token=sessionStorage.getItem("token");
            let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
            let userId=sessionStorage.getItem("userId");
            let templateId =getQueryString('id')||'';
            let url = portUrl("/manager/achievement/template/export?userId="+userId+"&userType="+userType+"&accessToken="+token+"&templateId="+templateId)
            this.setState({exportUrl: url})
        })
    }


    render(){
        const {tableData, visible, isPublished} = this.state;
        const { getFieldDecorator } = this.props.form;
    
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
   
  
        return (
            <div className="content-main branch-table">
                <Row gutter={24}>
                    <Col span={16}>
                        <Row gutter={24}>
                            <Col span={6}>
                                总人数：{tableData.totalPersonNum}
                            </Col>
                            {
                                tableData.branchMoney&&tableData.branchMoney.map((i, idx)=>{
                                    return  <Col span={6} key={idx}>
                                                {i.branchName}应发：{i.realMoney}
                                            </Col>
                                })
                            }
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Button  type='primary'><a href={this.state.exportUrl} onClick={this.export.bind(this)}>导出</a></Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            isPublished==0?<Button type="primary" onClick={this.publishTemplate.bind(this)}>一键发布</Button>:null
                        }
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            isPublished==1?<Button type="danger" onClick={this.cancelPublish.bind(this)}>撤销发布</Button>:null
                        }
                        
                    </Col>
                </Row>
                <table border="1" className="branch-table" style={{margin:'10px 50px 50px 10px' }}>
                    <thead>
                    <tr>
                        {
                            tableData.table&&tableData.table.headers.map((i, idx)=>{
                                let len = tableData.table.headers.length
                                if(idx == 0 || idx == 1 || idx == len-1 || idx == len-2 ||idx == len-3){
                                    return <th rowSpan={2} key={idx}>{i.label}</th>
                                }else{
                                    return <th colSpan={i.colspan||1} key={idx}>{i.label}</th>
                                }
                            })
                        }
                    </tr>
                    <tr>
                    {
                        tableData.table&&tableData.table.headers.map((i, idx)=>{
                           if(i.children){
                                return i.children.map((item, index)=>{
                                            return <td key={index}>{item.label}</td>
                                        })
                            }
                        })
                    }
                 </tr>
                 </thead>
                <tbody>

                 {
                     
                        tableData.table&&tableData.table.rows.map((i, idx)=>{
                            let hiddenItemIds = tableData.table.hiddenItemIds
                            if(Array.isArray(i)){
                             return <tr key={idx}>
                                        {i.map((item, index)=>{
                                            return <td onClick={this.edit.bind(this, i[0],hiddenItemIds[index])} key={index}>{item}</td>
                                        })}
                                    </tr>
                            }
                        })
                    }
                
               
                 </tbody>
                </table>
                <Modal
                    className="allot-record-modal"
                    width={500}
                    title="修改金额"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <FormItem {...formItemLayout} label={'金额'}>
                        {getFieldDecorator("money",{initialValue:'',rules:[{required:true,message:"请输入金额"}]})(
                            <Input placeholder="请输入金额"/>
                        )}
                    </FormItem>
                 </Modal>
           </div>
           
        );
    }
}
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(branchAchievementDetail));
