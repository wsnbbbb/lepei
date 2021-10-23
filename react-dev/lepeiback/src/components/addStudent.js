import React,{Component} from 'react';
import { connect } from 'dva';
import { Table,Button,Input,Form,Row,Col,Select } from 'antd';
import { getSexType,getGradeType,getResidence,getNumberType,formatIdcard } from '../utils/public';
import PageIndex from '../components/page';
import './style.less';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

class AddStudent extends Component{
    constructor(props) {
        super(props);
        this.state = {
          selectedRowKeys:[],
          selectedRows:[],
          page:1,
          prePage:20,
          classValue:'',
          disabled:true,
        };
    }
    componentDidMount=()=>{
      const params={"page":1,"prePage":20,"personType":1}
      this.getStudentList(params)
      this.props.dispatch({
        type:'user/getCommonGradeList'
      })
    }
    getStudentList=(params)=>{
      this.props.dispatch({
        type:'user/getPersonList',
        payload:params
      })
    }
    // 查询
    search=()=>{
      this.props.form.validateFields((err, values) => {
        this.setState({selectedRowKeys:[]})
        const params={
          "kw":values.kw||'',"page":1,"prePage":this.state.prePage,"personType":1,
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getStudentList(params)
      })
    }
    personCancel=()=>{
        this.props.getData('cancel')
    }
    personSubmit=()=>{
        const {selectedRows} = this.state
        this.props.getData('add',selectedRows)
        this.setState({selectedRowKeys:[]})
    }
    onPageChange=(current,size)=>{
      this.setState({selectedRowKeys:[]})
      this.props.form.validateFields((err, values) => {
        this.setState({page:current,prePage:size})
        const params={
          "page":current,
          "prePage":size,
          "personType":1,
          "kw":values.kw||'',
          "gradeId":values.gradeId?values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length):'',
          "classId":this.state.classValue?this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length):''
        }
        this.getStudentList(params)
      })
    }
    selectChange=(selectedRowKeys, selectedRows)=>{
      this.setState({selectedRowKeys,selectedRows})
    }
    gradeChange=(val)=>{
      if(val){
        this.setState({disabled:false})
        const id=val.substring(val.lastIndexOf('-')+1, val.length)
        this.props.dispatch({
          type:'user/getClassName',
          payload:{"gradeId": id||""},
          callback:(res)=>{
            if(res.code===200){
              this.setState({classValue:''})
            }
          }
        })
      }else{
        this.setState({classValue:'',disabled:true})
      }
    }
    classChange=(val)=>{
      this.setState({classValue:val})
    }
    render(){
        const columns = [{
          title: '姓名',
          dataIndex: 'personName'
        }, {
          title: '性别',
          dataIndex: 'sex',
          render:(text,record)=>(
            <span>{getSexType(record.sex)}</span>
          )
        }, 
        // {
        //     title: '证件类型',
        //     dataIndex: 'numberType',
        //     render:(record)=>{
        //         return(<span>{getNumberType(record)}</span>)
        //     }
        // }, 
        {
            title: '读书形式',
            dataIndex: 'inResidence',
            render:(record)=>{
              return(<span>{getResidence(record)}</span>)
            }
          }, {
            title: '身份证',
            dataIndex: 'idCardNo',
            render:(record)=>{
              return(<span>{formatIdcard(record)}</span>)
            }
          }, {
            title: '其他证件',
            dataIndex: 'usin',
          }, {
            title: '学业阶段',
            dataIndex: 'gradeType',
            render:(record)=>{
              return(<span>{getGradeType(record)}</span>)
            }
          }, {
            title: '年级',
            dataIndex: 'gradeName',
          }, {
            title: '班级',
            dataIndex: 'className',
          }];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys:selectedRowKeys, 
          onChange: this.selectChange,
        };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        };
        const {personData,commonData,gradeList} =this.props;
        console.log(personData)
        let classOptions=[];
        commonData&&commonData.classNameData&&commonData.classNameData.length>0&&commonData.classNameData.map(item=>{
          return classOptions.push(<Option key={item.classId} value={item.className+'-'+item.classId}>{item.className}</Option>)
        })
        let options=[]
        gradeList&&gradeList.length>0&&gradeList.map(item=>{
          return options.push(<Option key={item.gradeId} value={item.gradeName+'-'+item.gradeId}>{item.gradeName}</Option>)
        })
        return (
            <div className="content-main">
              <div className="top">添加人员</div>
              <Form className="content-form">
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label=''>
                      {getFieldDecorator('kw')(
                        <Search  placeholder="请输入姓名"/>
                      )}
                    </FormItem>
                  </Col> 
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={'年级名称'}>
                      {getFieldDecorator("gradeId",{initialValue:''})(
                        <Select showSearch onChange={this.gradeChange.bind(this)}>
                          <Option value='' key=''>全部</Option>
                          {options}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem {...formItemLayout} label={'班级'}>
                      <Select showSearch value={this.state.classValue} onChange={this.classChange} disabled={this.state.disabled}>
                        <Option value='' key=''>全部</Option>
                        {classOptions}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={2} offset={1}>
                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                  </Col>
                </Row>
              </Form>              
              <Table className='content-table' rowSelection={rowSelection} columns={columns} dataSource={personData&&personData.dataList} pagination={false}/>
              <PageIndex getPage={this.onPageChange.bind(this)} total={personData&&personData.totalCount} totalPage={personData&&personData.totalPage} currentPage={personData&&personData.currentPage}/>
              <div className="bottom-btns">
                    <Button style={{marginRight:20}} onClick={this.personCancel.bind(this)}>取消</Button>
                    <Button type="primary" onClick={this.personSubmit.bind(this)}>确定</Button>
              </div>
            </div>
        );
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    personData:state.user.personData,
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(AddStudent));
