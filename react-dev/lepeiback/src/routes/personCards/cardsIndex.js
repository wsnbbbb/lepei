import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import StudentCard from './studentCard';
import TeacherCard from './teacherCard';
import StaffCard from './staffCard';
// import "./style.less";

const TabPane = Tabs.TabPane;

class CardsIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeKey:''
        };
    }
    componentDidMount=()=>{ }
    tabChange=(id)=>{
        this.setState({
            activeKey:id
        })
    }
    render(){
        return (
            <div className="card-main">
              <Tabs defaultActiveKey="1" onChange={this.tabChange.bind(this)}>
                  <TabPane tab="学生开卡" key="1"><StudentCard /></TabPane>
                  <TabPane tab="教师开卡" key="2"><TeacherCard /></TabPane>
                  <TabPane tab="员工开卡" key="3"><StaffCard /></TabPane>
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
export default connect(mapStateToProps)(CardsIndex);
