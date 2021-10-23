import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import {getQueryString} from '../../../utils/public';
import StudentMac from './studentMac';
import TeacherMac from './teacherMac';
import StaffMac from './staffMac';
const TabPane = Tabs.TabPane;

class SswPersonMacIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabData:'1'
        };
    }
    componentDidMount=()=>{ 
        const key=getQueryString("key")
        if(key){
            this.setState({tabData:key})
        }
    }
    tabChange=(value)=>{
        this.setState({tabData:value})
    }
    render(){
        
        return (
            <div className="leave-main">
              <Tabs defaultActiveKey="1" activeKey={this.state.tabData} onChange={this.tabChange}>
                  <TabPane tab="学生标签" key="1"><StudentMac /></TabPane>
                  <TabPane tab="教师标签" key="2"><TeacherMac /></TabPane>
                  <TabPane tab="职工标签" key="3"><StaffMac /></TabPane>
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
export default connect(mapStateToProps)(SswPersonMacIndex);
