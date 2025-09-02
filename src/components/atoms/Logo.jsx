import React from 'react';
import LogoImage from '../../assets/logos/logoSolyMar.png';
import PropTypes from 'prop-types';

const Logo = () => (
  <img
    data-testid="logo-main"
    alt="Logo SolyMar"
    src="/src/assets/logos/logoSolyMar.png"
    className="h-16 md:h-20 object-contain"
  />
);

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
