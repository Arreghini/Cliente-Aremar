import React from "react";
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

export default DolphinAnimation;
