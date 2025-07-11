import React from "react";
import PropTypes from "prop-types";
import delfinAnimado from "../../assets/images/delfinAnimado.mp4"; 

const DolphinAnimation = ({ className }) => (
  <video
    className={className}
    src={delfinAnimado}
    autoPlay
    muted
    loop
    playsInline
    style={{ zIndex: 10 }}
  />
);

DolphinAnimation.propTypes = {
  className: PropTypes.string,
};

export default DolphinAnimation;
