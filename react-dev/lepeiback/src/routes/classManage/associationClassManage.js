import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Popover, Col,Modal,Alert,message,Tooltip} from 'antd';
import PageIndex from '../../components/page';
import {formatDate} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class AssociationClassManage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          page: 1,
          prePage: 20,
          visible: false,
          data: []
        };
    }
    componentDidMount=()=>{
      const params={
        "page":1,
        "prePage":20,
      }
      this.associationClassList(params)
    }
    associationClassList=(params)=>{
      this.props.dispatch({
        type:'association/associationClassList',
        payload:params,
        callback: res=>{
          if(res.code === 200){
            this.setState({
              data: res.data
            })
          }
        }
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        const params={
          "page":1,
          "prePage":this.state.prePage,
          "kw":values.kw||'',
          "type":values.type,
        }
        this.associationClassList(params)
      })
    }
    // 分页
    onPageChange=(current,size)=>{
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "kw":values.kw||'',
          "type":values.type,
        }
        this.associationClassList(params)
      })
    }

    generateType = (type) => {
       if(type == 2){
         return "社团课"
       }else if(type == 3){
         return "延时课"
       }
    }
    render(){
        const columns = [{
            title: '课程名称',
            dataIndex: 'subjectName',
            key:'subjectName'
          }, {
            title: '课程类型',
            dataIndex: 'type',
            key:'type',
            width: 100,
            render:(type)=>{
                return(
                    <span>{this.generateType(type)}</span>
                )
            }
          }, 
          // {
          //   title: '课程描述',
          //   dataIndex: 'description',
          //   key:'description',
          //   width: 200,
          //   render:(record)=>{
          //     return(
          //       <span>
          //         {/* <Tooltip placement="top" title={record} dangerouslySetInnerHTML={{ __html: record }}>
          //           <span className="des-content" dangerouslySetInnerHTML={{ __html: record }} ></span>
          //         </Tooltip> */}
          //         <Popover content={record} title="Title">
          //           <span className="des-content" dangerouslySetInnerHTML={{ __html: record }} ></span>
          //         </Popover>
          //       </span>
          //     )
          //   }
          // },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            key:'createTime',
            render:(record)=>{
                return(<span>{formatDate(record)}</span>)
            }
          }];
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          };
          const {data } = this.state;
          const {visitDetail} = this.props;
          // if(!data){
          //   return null;
          // }
          console.log(visitDetail)
        return (
            <div className="content-main association">
              <Form className="ant-advanced-search-form content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search placeholder="请输入课程名称"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'课程类型'}>
                      {getFieldDecorator("type",{initialValue:''})(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="2">社团课</Option>
                          <Option value="3">延时课</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={0}>
                        <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={data.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={data.totalCount} totalPage={data.totalPage} currentPage={data.currentPage}/>
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
export default connect(mapStateToProps)(Form.create()(AssociationClassManage));
