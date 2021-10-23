import React,{Component} from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import {getGradeType} from '../utils/public';
const Option = Select.Option;

class GradeSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
          type:'user/getGradeName',
      })
    }
    change=(val)=>{
        this.props.getValue(val)
    }
    render(){
        const {data} = this.props;
        const gradeData=data&&data.gradeNameData;
        let options=[];
        gradeData&&gradeData.map(item=>{
            return options.push(<Option value={item.gradeId}>{getGradeType(item.type)}{item.gradeName}</Option>)
        })
        return (
            <div className="content-main">
                <Select onChange={this.change.bind(this)}>
                    <Option value="">--全部--</Option>
                    {options}
                </Select>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
     data:state.user
  }
}

export default connect(mapStateToProps)(GradeSelect);