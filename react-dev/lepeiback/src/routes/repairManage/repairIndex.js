import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import RepairApplyList from './repairApplyList';
import RepairCharts from './repairChart';
// import "./style.less";

const TabPane = Tabs.TabPane;

class RepairIndex extends Component{
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
                  <TabPane tab="列表" key="1"><RepairApplyList /></TabPane>
                  <TabPane tab="统计" key="2"><RepairCharts /></TabPane>
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
export default connect(mapStateToProps)(RepairIndex);
