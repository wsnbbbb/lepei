/**
 * 人员考勤统计
 */
import React,{Component} from 'react';
import { Form,Tabs ,Breadcrumb} from 'antd';

import { connect } from 'dva';
import './style.less';

import PersonnelAttendanceStatisticsStu from './personnelAttendanceStatisticsStu';
import PersonnelAttendanceStatisticsTeach from './personnelAttendanceStatisticsTeach';

const { TabPane  } = Tabs;

class PersonnelAttendanceStatistics extends Component{
  constructor(props) {
      super(props);
      this.state = {
      }
    }

    componentDidMount = () => {
    }

    render(){
      return (
        <div className="content-main content-box">
          <Tabs defaultActiveKey="1">
            <TabPane tab="学生" key="1">
              <PersonnelAttendanceStatisticsStu></PersonnelAttendanceStatisticsStu>
            </TabPane>
            <TabPane tab="教职工" key="2">
               <PersonnelAttendanceStatisticsTeach></PersonnelAttendanceStatisticsTeach>
            </TabPane>
          </Tabs>
        </div>)
    }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(Form.create()(PersonnelAttendanceStatistics));
