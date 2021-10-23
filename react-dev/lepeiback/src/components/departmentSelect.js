import React,{Component} from 'react';
import { connect } from 'dva';
import { Select,TreeSelect  } from 'antd';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class DepartmentSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            value: undefined,
        };
    }
    componentDidMount=()=>{
      this.props.dispatch({
          type:'user/getDepartmentList',
          callback:(res)=>{
              if(res.code===200){
                  this.setState({treeData:res.data})
              }
          }
      })
    }
    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
          return (
            <TreeNode disabled={item.departmentId==0?true:false} value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode disabled={item.departmentId==0?true:false} value={item.departmentName+'-'+item.departmentId} title={item.departmentName} key={item.departmentId} dataRef={item} />;
    })
    onChange = (value) => {
        this.setState({ value });
        this.props.getDepartmentId(value)
    }
    render(){
        const {data,isEdit} = this.props;
        return (
            <div>
              <TreeSelect
                  showSearch
                  // style={{ width: 300 }}
                  value={this.state.value||data}
                  dropdownStyle={{ maxHeight:180, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.onChange}
                  disabled={isEdit}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </TreeSelect>
            </div>
        );
    }
  
}

// ExamplePage.propTypes = {
// };
const mapStateToProps = (state) => {
  return {
    departmentData:state.user.departmentData
  }
}

export default connect(mapStateToProps)(DepartmentSelect);