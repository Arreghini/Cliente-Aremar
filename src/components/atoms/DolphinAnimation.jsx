import React from 'react'
import PropTypes from 'prop-types'

const DolphinAnimation = ({ className }) => {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      src="/videos/delfinAnimado.mp4"
      style={{ zIndex: 10 }}
    />
  )
}

DolphinAnimation.propTypes = {
  className: PropTypes.string,
}

export default DolphinAnimation
