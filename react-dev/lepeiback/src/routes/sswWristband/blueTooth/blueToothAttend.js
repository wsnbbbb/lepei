import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import StudentAttend from './studentAttend';
import TeacherAttend from './teacherAttend';
const TabPane = Tabs.TabPane;


class BlueTootnAttendIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabData:'1'
        };
    }
    componentDidMount=()=>{ 
        
    }
    tabChange=(value)=>{
        this.setState({tabData:value})
    }
    render(){
        
        return (
            <div className="leave-main">
              <Tabs defaultActiveKey="1" activeKey={this.state.tabData} onChange={this.tabChange}>
                  <TabPane tab="学生考勤" key="1"><StudentAttend /></TabPane>
                  <TabPane tab="教师考勤" key="2"><TeacherAttend /></TabPane>
              </Tabs>
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
export default connect(mapStateToProps)(BlueTootnAttendIndex);
