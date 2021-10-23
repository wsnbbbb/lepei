import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Select, Form, Row, Col } from 'antd';
import PageIndex from '../../components/page';
import { routerRedux } from 'dva/router';
import { getGradeType, getSexType, getResidence, formatIdcard} from '../../utils/public';
import './style.less';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class PersonInfoList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      page:1,
      prePage:20,
      visible: false,
      gradeId:'',
      classValue:'',
      classData:[],
      disabled:false,
      list:{},
      detailList:[],
    };
  }
  componentDidMount=()=>{
    const params={
      "page":1,
      "prePage":20,
    }
    this.getBabys(params)
    this.props.dispatch({
      type:'user/getCommonGradeList'
    })
  }

  // 获取人员列表
  getBabys = (params) => {
    this.props.dispatch({
      type:'kindergartenManage/getBabys',
      payload:params,
      callback:(res) => {
        if(res.code === 200) {
          this.setState({
            list:res.data,
            detailList:res.data.dataList
          })
        }
      }
    })
  }

  // 年级选择
  gradeChange = (val) => {
    if(val){
      this.setState({disabled:false})
      const id=val.substring(val.lastIndexOf('-')+1, val.length)
      this.props.dispatch({
        type:'user/getClassName',
        payload:{"gradeId": id||""},
        callback:(res)=>{
          if(res.code === 200){
            this.setState({
              classData:res.data,
              classValue:''
            })
          }
        }
      })
    }else{
      this.setState({classValue:'',disabled:true})
    }
  }
  // 班级选择
  classChange = (val) => {
    this.setState({classValue:val})
  }
  // 查询
  search = () => {
    this.props.form.validateFields((err, values) => {
      const params={
        "page":1,
        "prePage":this.state.prePage,
        "kw":values.kw || '',
        "gradeId":values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId":this.state.classValue ? this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length) : '',
      }
      console.log({params});
      this.getBabys(params)
    })
  }
  
  // 分页
  onPageChange = (current,size) => {
    this.props.form.validateFields((err, values) => {
      this.setState({page:current,prePage:size})
      const params={
        "page":current,
        "prePage":size,
        "kw":values.kw || '',
        "gradeId":values.gradeId ? values.gradeId.substring(values.gradeId.lastIndexOf('-')+1, values.gradeId.length) : '',
        "classId":this.state.classValue ? this.state.classValue.substring(this.state.classValue.lastIndexOf('-')+1, this.state.classValue.length) : '',
      }
      this.getBabys(params)
    })
  }
  // 跳转报告列表
  toReportList = (id,type) => {
    this.props.dispatch(routerRedux.push("/test-report-list?type=" + type + "&personId=" + id))
  }

  render(){
    const { list, detailList, classData  } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {commonData,gradeList} = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };
    const columns = [{
        title: '姓名',
        dataIndex: 'personName',
      }, {
        title: '性别',
        dataIndex: 'personSex',
        render:(record)=>{
          return(<span>{getSexType(record)}</span>)
        }
      }, {
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
      }, {
        title: '操作',
        dataIndex: '',
        width:280,
        fixed:'right',
        render:(text, record) => (
          <span>
            <a href="javascript:;" onClick={this.toReportList.bind(this,record.personId,1)}>测评报告&emsp;</a>
            <a href="javascript:;" onClick={this.toReportList.bind(this,record.personId,2)}>成长评估&emsp;</a>
            <a href="javascript:;" onClick={this.toReportList.bind(this,record.personId,3)}>给宝宝的话</a>
          </span>
        )
    }];
    let classOptions = [];
    // commonData && commonData.classNameData && commonData.classNameData.length > 0 && commonData.classNameData.map(item => {
    //   return classOptions.push(<Option key={ item.classId } value={ item.className + '-' + item.classId }>{ item.className }</Option>)
    // })
    classData && classData.length > 0 && classData.map(item => {
      return classOptions.push(<Option key={ item.classId } value={ item.className + '-' + item.classId }>{ item.className }</Option>)
    })
    let options=[]
    gradeList && gradeList.length > 0 && gradeList.map(item => {
      return options.push(<Option key={ item.gradeId } value={ item.gradeName + '-' + item.gradeId }>{ item.gradeName }</Option>)
    })
    return (
      <div className="content-main">
        <Form className="content-form">
          <Row gutter={24}>
            <Col span={5}>
              <FormItem label=''>
                {getFieldDecorator('kw')(
                  <Search
                    placeholder="请输入姓名或证件号"
                  />
                )}
              </FormItem>
            </Col> 
            <Col span={5}>
              <FormItem {...formItemLayout} label={'年级'}>
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
            <Col span={3} >
              <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Form>              
        <Table className='content-table' scroll={{ x: 1000 }} columns={columns} dataSource={detailList} pagination={false}/>
        <PageIndex getPage={this.onPageChange.bind(this)} total={list.totalCount} totalPage={list.totalPage} currentPage={list.currentPage}/>
        
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    commonData:state.user,
    gradeList:state.user.commonGradeData
  }
}

export default connect(mapStateToProps)(Form.create()(PersonInfoList));
