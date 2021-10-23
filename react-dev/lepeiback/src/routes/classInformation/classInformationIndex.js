import React,{Component} from 'react';
import { connect } from 'dva';
import { Tabs , Form,Breadcrumb} from 'antd';
import ClassInformationList from './classInformationList';
import ClassInformationCharts from './classInformationChart';
import "./style.less";

const TabPane = Tabs.TabPane;

class ClassInformationIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{ }
    
    render(){
        return (
            <div>
                {/* <div className="breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item>家校互动</Breadcrumb.Item>
                        <Breadcrumb.Item>家长通知</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>家长通知</h3>
                </div> */}
                <Tabs defaultActiveKey="1" className="content-main">
                    <TabPane tab="列表" key="1"><ClassInformationList /></TabPane>
                    <TabPane tab="统计" key="2"><ClassInformationCharts /></TabPane>
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
export default connect(mapStateToProps)(ClassInformationIndex);
