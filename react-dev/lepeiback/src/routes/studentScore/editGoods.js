import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Breadcrumb, InputNumber, Upload, DatePicker, Select, Form, Row, Col, Icon,Menu, Dropdown,Modal,message} from 'antd';
import PageIndex from '../../components/page';
import { routerRedux ,Link} from 'dva/router';
import {portUrl, getImg} from '../../utils/img';
import moment from 'moment';

import { getQueryString, formatDate, dateToTimestamp, isPositiveInteger} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class EditGoods extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: {},
          title:"编辑商品",

        };
    }
    componentDidMount=()=>{
       this.personScoreGoodsDetail()

       this.props.dispatch({
        type: 'user/setLastRoute',
        payload: {
          breadcrumbTitle:this.state.title,
          parentRoute:"/score-goods"
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



    back=()=>{
      window.history.go(-1)
    }
    
    personScoreGoodsDetail=()=>{
      this.props.dispatch({
        type: 'score/personScoreGoodsDetail',
        payload: {
          id: getQueryString("id")
        },
        callback: res=>{
            if(res.code===200){
              this.setState({
                data: res.data
              })
            }
        }
      })
    }

    save=()=>{
      this.props.form.validateFields((err, values) => {
        if(err){
          return
        }
        const params={
          "id": getQueryString("id"),
          "code":values.code,
          "name": values.name,
          "price": values.price,
          "unit": values.unit,
          "startTime": dateToTimestamp(values.time[0].format('YYYY-MM-DD HH:mm:ss')),
          "endTime": dateToTimestamp(values.time[1].format('YYYY-MM-DD HH:mm:ss')),
          "stock": values.stock,
          "allowNum": values.allowNum
        }

        this.props.dispatch({
          type: 'score/personScoreGoodsEdit',
          payload: params,
          callback: res=>{
              if(res.code===200){
                message.success("保存成功！")
                setTimeout(() => {
                  window.history.go(-1)
                }, 1000);
              }
          }
        })
      })
      
    }

 
    priceValidator = (rule, value, callback) => {
      const { form } = this.props;
      if (value&&value<=0) {
        callback('兑换价必须大于0!');
      } else {
        callback();
      }
    };

    allowNumValidator = (rule, value, callback) => {
      const { form } = this.props;
      if (value&&!isPositiveInteger(value)) {
        callback('兑换上限必须为大于等于1的整数!');
      } else {
        callback();
      }
    };

    stockValidator = (rule, value, callback) => {
      const { form } = this.props;
      if (value&&!isPositiveInteger(value)) {
        callback('兑换数量必须为大于等于1的整数!');
      } else {
        callback();
      }
    };

    render(){
        const { data } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: {
            // xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            // xs: { span: 24 },
            sm: { span: 8 },
          },
        };

        return (
            <div className="content-main student-score">
                {/* <div className="breadcrumb">
                  <Breadcrumb>
                      <Breadcrumb.Item><Link to="/student-score">积分商城</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>编辑商品</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
         
                <Form {...formItemLayout}>
                  <Form.Item label="商品编码" hasFeedback>
                    {getFieldDecorator('code', {
                      initialValue: data.code,
                      rules: [
                        {
                          required: true,
                          message: '请输入正确的商品编码!',
                          pattern: /^(?!\d*?(\d)\d*?\1)\d+$/ 
                        }
                      ],
                    })(<Input maxLength={5}/>)}
                  </Form.Item>
                  <Form.Item label="商品名称" hasFeedback>
                    {getFieldDecorator('name', {
                      initialValue: data.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入商品名称!',
                          whitespace: true 
                        }
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="单位" hasFeedback>
                    {getFieldDecorator('unit', {
                      initialValue: data.unit,
                      rules: [
                        {
                          required: true,
                          message: '请输入单位!',
                          whitespace: true 
                        }
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="兑换价" hasFeedback>
                    {getFieldDecorator('price', {
                      initialValue: data.price,
                      rules: [
                        {
                          required: true,
                          message: '请输入兑换价!',
                          pattern: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
                        },
                        {
                          validator: this.priceValidator,
                        },
                      ],
                    })(<Input addonAfter="积分"/>)}
                  </Form.Item>
                   
                  <Form.Item label="有效期" hasFeedback>
                    {getFieldDecorator('time', {
                      initialValue: [data.startTime&&moment(formatDate(data.startTime), 'YYYY/MM/DD HH:mm:ss'), data.endTime&&moment(formatDate(data.endTime), 'YYYY/MM/DD HH:mm:ss')],
                      rules: [
                        { 
                          type: 'array', 
                          required: true, 
                          message: '请选择时间!' ,
                          whitespace: true }
                        ]
                    })(
                      <RangePicker style={{width: "388px"}} showTime format="YYYY-MM-DD HH:mm:ss" />,
                    )}
                  </Form.Item>
                  <Form.Item label="每人兑换上限" hasFeedback>
                    {getFieldDecorator('allowNum', {
                      initialValue: data.allowNum,
                      rules: [
                        {
                          required: true,
                          message: '请输入兑换上限!',
                        },
                        {
                          validator: this.allowNumValidator,
                        },
                      ],
                    })( <Input />)}
                  </Form.Item>
                  <Form.Item label="可兑换数量" hasFeedback>
                    {getFieldDecorator('stock', {
                      initialValue: data.stock,
                      rules: [
                        {
                          required: true,
                          message: '请输入兑换数量!',
                        },
                        {
                          validator: this.stockValidator,
                        },
                      ],
                    })( <Input />)}
                  </Form.Item>
                </Form>
                
             
                <Row style={{textAlign: "center", padding: "70px 0 50px 0"}}>
                  <Button onClick={this.back.bind(this)}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
                </Row>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    
  }
}

export default connect(mapStateToProps)(Form.create()(EditGoods));
