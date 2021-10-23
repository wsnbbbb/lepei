import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import RoomApplyList from './roomApplyList';
import RoomCharts from './roomChart';
// import "./style.less";

const TabPane = Tabs.TabPane;

class RoomIndex extends Component{
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
                  <TabPane tab="列表" key="1"><RoomApplyList /></TabPane>
                  <TabPane tab="统计" key="2"><RoomCharts /></TabPane>
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
export default connect(mapStateToProps)(RoomIndex);
