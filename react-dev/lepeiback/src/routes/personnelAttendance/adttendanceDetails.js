/**
 * 考勤明细
 */
 import React,{Component} from 'react';
 import { Form,Tabs ,Breadcrumb} from 'antd';

 import { connect } from 'dva';
 import './style.less';


 import AdttendanceDetailsStu from './adttendanceDetailsStu';
 import AdttendanceDetailsTeach from './adttendanceDetailsTeach';

 const { TabPane  } = Tabs;

 class AdttendanceDetails extends Component{
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
               <AdttendanceDetailsStu></AdttendanceDetailsStu>
             </TabPane>
             <TabPane tab="教职工" key="2">
                <AdttendanceDetailsTeach></AdttendanceDetailsTeach>
             </TabPane>
           </Tabs>
         </div>)
     }
 }

 const mapStateToProps = (state) => {
   return {

   }
 }
 export default connect(mapStateToProps)(Form.create()(AdttendanceDetails));
