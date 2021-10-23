import React,{Component} from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import './style.less';

class BottomBtns extends Component{
    constructor(props) {
        super(props);
        this.state = {
            edit:false
        };
    }
    componentDidMount=()=>{
        this.setState({edit:this.props.edit})
    }
    edit=()=>{
        this.setState({edit:true})
        this.props.getBtnDate('edit');
    }
    cancel=()=>{
        this.props.getBtnDate('cancel');
    }
    submit=()=>{
        this.props.getBtnDate('submit');
    }
    render(){
        const {type,controlBtn}=this.props;
        const {edit}=this.state;
        return (
            <div className="common-bottom-btns">
                {Number(type)===2&&!edit?<Button type='primary' onClick={this.edit.bind(this)}>编辑</Button>:null}
                {Number(type)===1||edit?<span className={Number(type)===1?"":"submit-btn"}>
                    <Button style={{marginRight:50}} onClick={this.cancel.bind(this)}>取消</Button>
                    <Button type='primary' disabled={controlBtn} onClick={this.submit.bind(this)}>提交</Button>
                </span>:null}
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

export default connect(mapStateToProps)(BottomBtns);
