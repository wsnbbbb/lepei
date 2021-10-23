import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs,Button,Input,Select,Form,Col,Row,Breadcrumb, DatePicker, Modal,message,Tooltip ,Steps, Radio ,Table} from 'antd';
import PageIndex from '../../components/page';
import { Link } from 'dva/router';
import "./style.less";
import { getQueryString, isCorrectMoney } from '../../utils/public';

const FormItem = Form.Item;
const { RangePicker , MonthPicker} = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;

class branchDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            classScoreDetails: '',
            tableData: [],
            visible: false,
            personId: '',
            itemId: '',

            totalCount: 0,
            totalPage: 0,
            currentPage: 0,
            page: 1,
            prePage: 20,
        };
    }
    componentDidMount=()=>{
        this.getDetail()
    }

    handleCancel=()=>{
        this.setState({
            visible: false
        })
    }
    handleOk=()=>{
        this.props.form.validateFields((err, values) => {
            if(err) return

            if(!isCorrectMoney(values.money)){
                message.warning("金额格式不正确！")
            }
            const params={
              "personId": this.state.personId,
              "itemId": this.state.itemId,
              "money": values.money||'',
            }
            debugger
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
        if(personId&&itemId){
            this.setState({
                visible: true,
                personId,
                itemId

            })
        }
    }

    getDetail=()=>{
        this.props.dispatch({
            type:'performance/getBranchRelation1',
            payload: {
                id: getQueryString("id")
            },
            callback:(res)=>{
                if(res.code===200){
                    this.setState({
                        tableData: res.data
                    })
                }
            }
        })
    }
    
    getWeekList=(params)=>{
        this.props.dispatch({
            type:'evaluate/getWeekList',
            payload: params,
            callback:(res)=>{
            if(res.code===200){
                this.setState({
                    weekData: res.data
                })
            }
            }
        })
    }


    render(){
        const { tableData, visible} = this.state;
        const { getFieldDecorator } = this.props.form;
    
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
          };
   
  
        return (
            <div className="content-main">
                <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item>绩效管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/branch-upload">绩效上传</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
                <h3>详情</h3>
                <Row gutter={24}>
                    <Col span={3}>总人数：{tableData.totalPersonNum}</Col>
                    <Col span={3}>应发：{tableData.shouldMoney}</Col>
                    <Col span={3}>应扣：{tableData.deductMoney}</Col>
                    <Col span={3}>实发：{tableData.realMoney}</Col>
                </Row>
                <table border="1" className="branch-table" style={{margin:'10px 10px 50px 10px' }}>
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
                   
                            if(Array.isArray(i)){
                             return <tr key={idx}>
                                        {i.map((item, index)=>{
                                            return <td key={index}>{item}</td>
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
export default connect(mapStateToProps)(Form.create()(branchDetail));
