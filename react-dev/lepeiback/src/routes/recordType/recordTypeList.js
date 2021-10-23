import React,{ Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, message, Switch  } from 'antd';
import './style.less';

class RecordTypeList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      list:[],
      typeIds:[]
    };
  }
  componentDidMount=()=>{
    this.getRecordTypeList()
  } 

  // 获取类型列表
  getRecordTypeList = () => {
    this.props.dispatch({
      type:'recordType/getRecordTypeList',
      callback:(res) => {
        if(res.code === 200){
          this.setState({
            list:res.data.dataList,
          })
        }
      }
    })
  }

  // 状态选择
  changeStatus = (id,status) => {
    let newList = this.state.list
    newList.map(item => {
      if(item.id == id){
        if(status == 1){
          item.status = 0
        }else{
          item.status = 1
        }
      }
    })
    this.setState({
      list:newList
    })
  }

  // 保存
  save = () =>{
    this.state.list.map(item => {
      if(item.status == 1){
        this.state.typeIds.push(item.id)
      }
    })
    console.log(this.state.typeIds);
    this.props.dispatch({
      type:'recordType/saveRecordTypes',
      payload:{"typeIds":this.state.typeIds},
      callback:(res) => {
        if(res.code === 200){
          this.setState({
            typeIds:[],
          })
          message.success("保存成功！")
          this.getRecordTypeList()
        }
      }
    })
  }
  render(){
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },{
        title: '名称  ',
        dataIndex: 'name',
      },{
        title: '是否启用',
        dataIndex: '',
        render:(record) => (
          <span><Switch checkedChildren="启用" unCheckedChildren="禁用" checked={record.status == 1 ? true : (record.status == 0 ? false : '')} onChange={this.changeStatus.bind(this,record.id,record.status)} /></span>
        )
      }
    ];
    

    return (
      <div className="content-main">
        <Table scroll={{ x: 1000 }} columns={columns} dataSource={this.state.list} pagination={false}/>
        {this.state.list.length > 0 ?
          <div className="btn">
            <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
          </div>:null
        }
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(RecordTypeList));
