import React,{Component} from 'react';
import { connect } from 'dva';
import { Pagination  } from 'antd';
import './style.less';

class Page extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size:20
        };
    }
    
    onShowSizeChange=(current, pageSize)=> {
        this.setState({page:current,size:pageSize})
        this.props.getPage(current,pageSize)
    }
   
    onChange=(pageNumber)=> {
        this.props.getPage(pageNumber,this.state.size) 
    }
    render(){
        const {currentPage,totalPage,total} = this.props;
        return (
            <div className="minWidth-page">
              <span>共 {total} 条记录&nbsp;&nbsp;&nbsp;&nbsp;<span>第{currentPage}/{totalPage}页</span></span>
              <Pagination total={this.props.total} current={currentPage}
                pageSizeOptions={["20","50","100"]} showSizeChanger showQuickJumper defaultPageSize={20}
                onShowSizeChange={this.onShowSizeChange} onChange={this.onChange}
              />
            </div>
        );
    }
  
}

const mapStateToProps = (state) => {
  return {
     
  }
}

export default connect(mapStateToProps)(Page);