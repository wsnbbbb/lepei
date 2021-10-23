import React, {Component} from 'react'
import { connect } from 'dva';
import { Button } from 'antd'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

class imgCutter extends Component {
  _crop(){}

  handleOk = () => {
  	//将裁剪的图片转成blob对象
    this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      this.props.onOk(blob);
    },'image/jpeg');
  }
 
  render() {
    const { src,aspectRatio } = this.props;
    return (
      <div className="cropper-wrap">
        <Cropper
          className="cutterBox"
          ref='cropper'
          src={src}
          style={{height: 400, width: '100%'}}
          aspectRatio={aspectRatio}
          guides={false}
          crop={this._crop.bind(this)}
          autoCropArea={1} 
        />
        <Button onClick={this.handleOk} className="button">确认</Button>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {
      
    }
  }
  
export default connect(mapStateToProps)(imgCutter);