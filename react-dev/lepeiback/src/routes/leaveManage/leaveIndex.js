import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import LeaveList from './leaveList';
import LeaveCharts from './leaveCharts';
import "./style.less";

const TabPane = Tabs.TabPane;

class LeaveIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{ }
    
    render(){
        return (
            <div className="leave-main">
              <Tabs defaultActiveKey="1" >
                  <TabPane tab="明细" key="1"><LeaveList /></TabPane>
                  <TabPane tab="概况" key="2"><LeaveCharts /></TabPane>
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
export default connect(mapStateToProps)(LeaveIndex);
