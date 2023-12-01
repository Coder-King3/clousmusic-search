import React from 'react'
import './style.less'

function ImageIcon(props) {
  const { iconUrl, style = {}, className = '' } = props
  return (
    <img
      src={iconUrl}
      alt="iconName"
      className={`image-icon ${className}`}
      style={style}
    />
  )
}

export default ImageIcon
