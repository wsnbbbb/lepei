/**
 * 部门考勤统计
 */
 import React,{Component} from 'react';
 import { Form,Tabs } from 'antd';

 import { connect } from 'dva';
 import './style.less';


 import DepartmentAttendanceStatisticsStu from './departmentAttendanceStatisticsStu';
 import DepartmentAttendanceStatisticsTeach from './departmentAttendanceStatisticsTeach';

 const { TabPane  } = Tabs;

 class DepartmentAttendanceStatistics extends Component{
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
               <DepartmentAttendanceStatisticsStu></DepartmentAttendanceStatisticsStu>
             </TabPane>
             <TabPane tab="教职工" key="2">
                <DepartmentAttendanceStatisticsTeach></DepartmentAttendanceStatisticsTeach>
             </TabPane>
           </Tabs>
         </div>)
     }
 }

 const mapStateToProps = (state) => {
   return {

   }
 }
 export default connect(mapStateToProps)(Form.create()(DepartmentAttendanceStatistics));
