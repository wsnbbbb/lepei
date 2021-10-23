import React,{Component} from 'react';
import { connect } from 'dva';
import { Pagination  } from 'antd';
import './style.less';

class PageIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size:20,
        };
    }
    componentDidMount=()=>{
      // console.log(this.props.match.params.id)//获取参数
    }
    onShowSizeChange=(current, pageSize)=> {
        this.setState({page:current,size:pageSize, defaultPageSize: pageSize})
        this.props.getPage(current,pageSize)
    }
    // showTotal=(total)=> {
    //     const {currentPage,totalPage} = this.props;
    //     return (<span>共 {total} 条记录&nbsp;&nbsp;&nbsp;&nbsp;<span>第{currentPage}/{totalPage}页</span></span>);
    // }
    onChange=(pageNumber)=> {
        this.props.getPage(pageNumber,this.state.size)
    }
    render(){
        const {currentPage,totalPage,total,defaultPageSize} = this.props;
        return (
            <div className="page-main">
              <span className="page-left">共 {total} 条记录&nbsp;&nbsp;&nbsp;&nbsp;<span>第{currentPage}/{totalPage}页</span></span>
              <Pagination className='content-page' total={this.props.total} current={currentPage}
                pageSizeOptions={["20","50","100"]} showSizeChanger showQuickJumper defaultPageSize={defaultPageSize||20}
                onShowSizeChange={this.onShowSizeChange} onChange={this.onChange}
              />
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

export default connect(mapStateToProps)(PageIndex);