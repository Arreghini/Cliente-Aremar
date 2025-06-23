import React from "react";
import delfinAnimado from "../../assets/images/delfinAnimado.mp4";

const DolphinAnimation = ({ className }) => (
  <video
    src={delfinAnimado}
    autoPlay
    muted
    playsInline
    className={className} 
    style={{ animationDuration: "5s", zIndex: 10 }}
  />
);

export default DolphinAnimation;
