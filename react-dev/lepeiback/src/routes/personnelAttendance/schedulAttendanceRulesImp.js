/**
 * 排班制考勤规则
 */
import React,{Component} from 'react';
import { Modal, Form, Row, Col,  DatePicker ,message,Button,Upload,Icon,Table } from "antd";

import { getUpload } from '../../utils/img';
import { connect } from 'dva';
import './style.less';

import moment from 'moment';

const {MonthPicker} = DatePicker;

class SchedulAttendanceRulesImp extends Component{
  constructor(props) {
    // 注意这里将props传入了构造器 Class 方式创建的组件必须总是调用带有 props 的构造器
    super(props);
    this.state = {
      visible: false,
      errorVisible:false,
      errorData:[],
      fileList:[],
      uploading: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      fileList:[],
      visible: false,
      uploading: false,
    });
  };
  handleSave = (e) => {
    let that = this;
    let { fileList,uploading } = that.state;
    if(uploading){
      message.warn("正在上传，请等待",2);
      return;
    }
    if(fileList.length < 1){
      message.error("请选择班次表",3);
      return;
    }
    that.setState({
      uploading: true,
    });
    that.props.form.validateFields().then(values => {
      let formData = new FormData();
      formData.append('excel', fileList[0]);
      let month = moment(values.month).format("yyyy-MM");
      formData.append('month', month);
      this.props.dispatch({
        type: 'scheduleRule/importScheduleRule',
        payload: formData,
        callback: (res) => {
          if (res.code === 200) {
            that.setState({
              uploading: false,
            });
            if(res.data.hasError){
              message.error(res.msg,3);
              that.setState({
                errorData:res.data,
                errorVisible:true,
              })
            }else{
              that.props.refreshData();
              that.handleCancel();
            }
          }
        }
      })
    }).catch(e => {
      that.setState({
        uploading: false,
      });
    })
  };

  handleShow() {
    this.setState({
      visible: true,
      fileList:[],
      uploading: false,
    });
  }

  handleErroCancel = () =>{
    this.setState({
      errorData:{},
      errorVisible:false,
    })
  }

  render() {
    let { visible,fileList,uploading,errorVisible,errorData } = this.state;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const monthFormat = 'YYYY年MM月';
    const uploadProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        let names = file.name.split(".");
        let suffix = names[names.length - 1];
        let canSuffix = ["xls","xlsx","XLS","XLSX"];
        if(canSuffix.includes(suffix)){
          this.setState(state => ({
            fileList: [file],
          }));
        }else{
          message.error("请上传xls，xlsx的扩展名文件",3);
        }
        return false;
      },
      fileList,
      accept:".xls, .xlsx"
    };

    const errorTableColumns = [
      {
        title:"人员编号",
        dataIndex:"A",
        width:100,
        // fixed: 'left',
      },{
        title:"姓名",
        dataIndex:"B",
        width:120,
        // fixed: 'left',
      },
    ];

    //暂时不显示所有的
    // let abcs = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    // for (let i = 0; i < errorData.header; i++) {
    //   if(i >= abcs.length){
    //     let i_1 = i - abcs.length;
    //     errorTableColumns.push({
    //       title:i + 1,
    //       dataIndex:abcs[i_1],
    //     })
    //   }else{
    //     errorTableColumns.push({
    //       title:i + 1,
    //       dataIndex:abcs[i - 1],
    //     })
    //   }
    // }

    errorTableColumns.push({
      title:"提示",
      dataIndex:"error",
      // fixed: 'right',
    })

    return (
      <Modal
        title="导入班表"
        visible={visible}
        keyboard={false}
        maskClosable={false}
        width="600px"
        onOk={this.handleSave}
        okText="保存"
        onCancel={this.handleCancel}
      >
        <div className="edit-modal">
          <Form>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item {...formItemLayout} label="班表周期">
                    {getFieldDecorator("month", {
                      initialValue: moment(),
                      rules: [{ required: true, message: "请选择班表周期" },],
                    })(<MonthPicker format={monthFormat} ></MonthPicker>)}
                  </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item {...formItemLayout} label="选择表格">
                  <Upload {...uploadProps}>
                    <Button loading={uploading}>
                      <Icon type="upload" /> 选择表格
                    </Button>
                    {fileList.length > 0 ? null : <span>&emsp;未选择任何文件</span>}
                  </Upload>
                  <div>
                    <span>支持扩展名：xls，xlsx</span>&emsp;
                    <a target="target" rel="noopener noreferrer" href={getUpload("班表导入模板.xls")}>下载导入模板</a>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>


        <Modal
          title="导入错误信息"
          visible={errorVisible}
          keyboard={false}
          maskClosable={false}
          width="700px"
          onOk={this.handleErroCancel}
          okText="知道了"
          onCancel={this.handleErroCancel}
        >
          <Table rowKey="personId" columns={errorTableColumns} dataSource={errorData.sheetData} pagination={false} />
        </Modal>
      </Modal>
    );
  }
  }

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(SchedulAttendanceRulesImp));


