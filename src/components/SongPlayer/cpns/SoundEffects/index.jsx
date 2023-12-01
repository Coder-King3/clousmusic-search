import React, { forwardRef, useEffect } from 'react'
import './style.less'

const SoundEffects = forwardRef(function (props, ref) {
  const { className, url } = props

  useEffect(() => {
    const singleItems = document.getElementsByClassName('circle-single')
    Array.from(singleItems).forEach((item) => {
      const random = Math.random() * 0.5 + 0.5
      item.style.setProperty('--width', random * 10 + 'px')
      item.style.setProperty('--half-width', -random * 5 + 'px')
    })
  })

  return (
    <div className={`sound-effects ${className}`}>
      <div className="circle">
        <div className="circle-item">
          <div className="circle-single"></div>
        </div>
        <div className="circle-item">
          <div className="circle-single one"></div>
        </div>
        <div className="circle-item">
          <div className="circle-single two"></div>
        </div>
        <div className="circle-item">
          <div className="circle-single three"></div>
        </div>
        <div className="circle-img">
          <img ref={ref} src={url} />
        </div>
      </div>
    </div>
  )
})

export default SoundEffects
