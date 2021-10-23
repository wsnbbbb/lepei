import './style.less'
import React from 'react'

export default class SectionTag extends React.Component {
  constructor(props) {
    super(props)
  }

    
 
  render() {
    let {title, paddingBottom} = this.props
    return (
        <div className="sectionTag" style={{paddingBottom: paddingBottom + "px"}}>
            <h3>{title}</h3>
        </div>
    )
  }
}
