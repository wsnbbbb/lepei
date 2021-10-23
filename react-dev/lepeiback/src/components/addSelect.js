import React,{Component} from 'react';
import { connect } from 'dva';
import {  Form, Input, Icon, Button,Row,Col,message } from 'antd';
import './style.less';

const FormItem = Form.Item;
let id = 0;

class AddSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
          oldData:[],
          flag:false
        };
    }
    componentDidMount=()=>{
        this.props.onRef(this);
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        // if (keys.length === 1) {
        //   return;
        // }
    
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if(keys.length===5){
            return;
        }
        const nextKeys = keys.concat(++id);
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
    }
    delDefault=(item,idx)=>{
        const {data,isEdit}=this.props;
        if(isEdit){
            return message.error("请先点击编辑按钮后操作",2)
        }
        const datas= eval(data);
        let arr=[];
        // if(!this.state.flag){
        //     datas&&datas.map(n=>{
        //         if(n.title!=item.title||n.content!=item.content){
        //             arr.push({title:n.title,content:n.content})
        //         }
        //     })
        // }else{
        //     this.state.oldData&&this.state.oldData.map(n=>{
        //         if(n.title!=item.title||n.content!=item.content){
        //             arr.push({title:n.title,content:n.content})
        //         }
        //     })
        // }
        if(!this.state.flag){
            datas&&datas.map((n,k)=>{
                if(idx!=k){
                    arr.push({title:n.title,content:n.content})
                }
            })
        }else{
            this.state.oldData&&this.state.oldData.map((n,k)=>{
                if(idx!=k){
                    arr.push({title:n.title,content:n.content})
                }
            })
        }
        this.setState({oldData:arr,flag:true})
    }
    handleSubmit = (e) => {
        // e.preventDefault();
        const {data}=this.props;
        const datas= eval(data);
        let arr=[];let isOk=false;
        this.props.form.validateFields((err, values) => {
          if (!err) {
            isOk=true
            const contents=values.content;
            const titles=values.title;
            contents&&titles&&titles.map((t,i)=>{
                contents.map((c,n)=>{
                    if(i===n){
                        arr.push({title:t,content:c})
                    }
                })
            })
            const {type}=this.props;
            if(Number(type)===2&&this.state.flag){ //在详情页，有删除标签后再添加标签
                arr.push(...this.state.oldData)
                console.log(arr)
            }else if(Number(type)===2&&!this.state.flag){  //在详情页，没有删除标签直接添加
                arr.push(...datas)
                console.log(arr)
            }
            return [arr,isOk]
          }
        });
        console.log(arr)

        return [arr,isOk];
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 1 },
          },
        };
        const formItemLayoutWithOutLabel2 = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18, offset: 0 },
                sm: { span: 16, offset: 1 },
            },
        };
        const {data,type,isEdit}=this.props;
        const {oldData,flag} = this.state;
        getFieldDecorator('keys', { initialValue: [] });
        let formDefaultItems=[];
        if(Number(type)===2){
            const datas=eval(data)
            if(!flag){
                console.log(datas)
                datas&&datas.length>0&&datas.map((item,idx)=>{
                    formDefaultItems.push(
                    <div style={{marginLeft:20,marginBottom:10,display:'flex',textAlign:"left"}}>
                        <span style={{marginRight:40,display:'inline-block',width:'30%'}}>{item.title}</span>
                        <span style={{marginRight:20,display:'inline-block'}}>{item.content}</span>
                        <Icon type='minus-circle-o' onClick={this.delDefault.bind(this,item,idx)}/>
                    </div>)
                })
            }else{ //操作删除数据
                console.log(oldData)
                oldData&&oldData.length>0&&oldData.map((item,idx)=>{
                    formDefaultItems.push(
                    <div style={{marginLeft:20,marginBottom:10,display:'flex',textAlign:"left"}}>
                        <span style={{marginRight:40,display:'inline-block',width:'30%'}}>{item.title}</span>
                        <span style={{marginRight:20,display:'inline-block'}}>{item.content}</span>
                        <Icon type='minus-circle-o' onClick={this.delDefault.bind(this,item,idx)}/>
                    </div>)
                })
            }
        }
         
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Row gutter={24}>
                <Col span={9}>
                    <FormItem
                        {...formItemLayoutWithOutLabel}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`title[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入",
                        }],
                        })(
                        <Input placeholder="请输入标签名称 例：18年度评优" style={{ width: '100%', marginRight: 8 }} />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        {...formItemLayoutWithOutLabel}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`content[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入",
                        }],
                        })(
                        <Input placeholder="请输入标签内容 例：获得2018年度优秀奖" style={{ width: '90%', marginRight: 8 }} />
                        )}
                        {/* {keys.length > 1 ? ( */}
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                        {/* ) : null} */}
                    </FormItem>
                </Col>
            </Row>
          
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                <p style={{color:'rgba(0, 0, 0, 0.85)',margin: "0 0 10px 20px"}}>标签：</p>
                {formDefaultItems}
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel2}>
                <Button disabled={isEdit} type="dashed" onClick={this.add} style={{ width: '80%' }}>
                    <Icon type="plus" /> 增加标签
                </Button>
                </FormItem>
            </Form>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     
  }
}

export default connect(mapStateToProps)(Form.create()(AddSelect));
