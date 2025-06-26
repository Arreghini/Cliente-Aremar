import React from "react";
import LogoImage from "../../assets/logos/logoSolyMar.png";

const Logo = ({ className }) => (
  <img
    src={LogoImage}
    alt="Logo SolyMar"
    className={className || "h-16 md:h-20 object-contain"}
  />
);

export default Logo;
