import React,{Component} from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

class GradeTypeSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount=()=>{}
    change=(val)=>{
        this.props.getValue(val)
    }
    render(){
        return (
            <div className="content-main">
                <Select onChange={this.change.bind(this)}>
                    {this.props.showAll==='1'?<Option value="">--全部--</Option>:null}
                    <Option value="1">幼儿园</Option>
                    <Option value="2">小学</Option>
                    <Option value="3">初中</Option>
                    <Option value="4">高中</Option>
                    <Option value="5">大学</Option>
                </Select>
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

export default connect(mapStateToProps)(GradeTypeSelect);