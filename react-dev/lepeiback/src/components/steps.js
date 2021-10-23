import React,{Component} from 'react';
import { connect } from 'dva';
import { Steps } from 'antd';
import {formatDate} from '../utils/public';
import './style.less';

const Step = Steps.Step;

class StepIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{
        
    }
    
    render(){
        const {data}=this.props;
        let steps=[];
        data && data.length >0 && data.map((item,index) =>{
            return steps.push(<Step key={index} description={<span>{item.operateType==="1"?"创建":(item.operateType==="2"?"修改":(item.operateType==="3"?"删除":"--"))}&nbsp;&nbsp;{formatDate(item.operateTime)}&nbsp;&nbsp;{item.operator}</span>}/>)
        })
        return (
            <Steps progressDot direction="vertical" >
                {steps}
            </Steps>
        )
    }
  
}
// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(StepIndex);
