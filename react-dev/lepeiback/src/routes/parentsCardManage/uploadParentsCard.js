import React,{Component} from 'react';
import { connect } from 'dva';
import { Button, Input, Breadcrumb, Form, Row, Col, Modal,message } from 'antd';
import { Link } from 'dva/router';
import { getUpload } from '../../utils/img';
import './style.less';

const FormItem = Form.Item;

class UploadParentsCard extends Component{
  constructor(props) {
    super(props);
    this.state = {
      file:'',
      visible:false,
    };
  }
  componentDidMount=()=>{
  
  }

  // 文件上传
  changeFile=(e)=> {
    console.log(e.target.files[0]);
    this.setState({file: e.target.files[0]})
  }
  // 保存
  save = () =>{
    this.props.form.validateFields((err,values) => {
      if(!err){
        const params = new FormData();
        params.append('excel', this.state.file)
        this.props.dispatch({
          type:'card/importParentsCard',
          payload:params, 
          callback:(res) => {
            if(res.code === 200){
              if(res.data.hasError){
                if(res.data.header && res.data.sheetData){
                  message.error(res.msg)
                  let errData = []
                  res.data.sheetData.map(item => {
                    errData.push(item)
                  })
                  this.setState({
                    visible:true,
                    header:res.data.header,
                    sheetData:errData,
                  })
                }else{
                  message.error(res.msg)
                  this.props.form.resetFields()
                }
              }else{
                message.success("批量导入成功")
                this.props.form.resetFields()
                window.history.go(-1)
              }
              
            }
          }
        })
      }
    })
  }

  hideModal = () => {
    this.props.form.resetFields()
    this.setState({visible:false})
  }
  // 返回
  back = () =>{
   window.history.go(-1)
  }

  render(){
    const { visible, header, sheetData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span:4 },
      wrapperCol: { span: 18 }
    };
    let ths = [];
    if(header){
      for (var p in header){
        ths.push(<th key={p}>{header[p]}</th>)
      }
    }
    let tbodys = []
    if(sheetData){
      sheetData.map((item,idx) => {
        if(!item.error){
          item.msg = "无"
        }
        let tds=[]
        for(var p in item){
          tds.push(<td key={p} style={{color:item.error?"#f00":""}}>{item[p]?item[p]:"无"}</td>)
        }
        return tbodys.push(<tr key={idx}>{tds}</tr>)
      })
    }
    return (
      <div className="content-main batch-import">
        <Breadcrumb className="Breadcrumb">
          <Breadcrumb.Item><Link to="parents-card">开卡管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>家长批量开卡</Breadcrumb.Item>
        </Breadcrumb>  
        <Form>
          <Row gutter={24} >
            <Col span={22}>
              <FormItem {...formItemLayout} label={'请选择表格'}>
                {getFieldDecorator("excel",{rules:[{required:true,message:"请上传附件"}]})(
                  <Input style={{border:"none"}} type="file" name="file" onChange={this.changeFile.bind(this)} single="true"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <p style={{marginLeft:"138px"}}>
            <span style={{marginLeft:"30px"}}>支持扩展名为.xls及.xlsx的文件</span>
            <a style={{marginLeft:"30px"}} href={getUpload("家长开卡导入模板.xls")}>下载导入模板</a>
          </p>
          <Row className="btn">
            <Button onClick={this.back.bind(this)}>返回</Button>&emsp;&emsp;
            <Button type="primary" onClick={this.save.bind(this)}>导入</Button>
          </Row>
        </Form>
        <Modal
          title="错误提示"
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
          className="batch-import-cards-modal"
        >
          <table border="1" className="batch-import-cards-table">
            <thead>
              <tr>{ths}<th>提示</th></tr>
            </thead>
            <tbody>
              {tbodys}
            </tbody>
          </table>
        </Modal>
      </div> 
            
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(UploadParentsCard));
