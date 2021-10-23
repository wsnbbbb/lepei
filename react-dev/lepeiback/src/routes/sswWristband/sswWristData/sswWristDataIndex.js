import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form } from 'antd';
import {getQueryString} from '../../../utils/public';
import TrackList from './tractList';
import HealthList from './healthList';
import HeartList from './heartList';
const TabPane = Tabs.TabPane;

class SswWristDataIndex extends Component{
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
                  <TabPane tab="轨迹查询" key="1"><TrackList /></TabPane>
                  <TabPane tab="健康查询" key="2"><HealthList /></TabPane>
                  <TabPane tab="心率查询" key="3"><HeartList /></TabPane>
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
export default connect(mapStateToProps)(SswWristDataIndex);
