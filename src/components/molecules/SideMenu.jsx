import React from 'react';
import MenuList from '../molecules/MenuList';
import PropTypes from 'prop-types';

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay para bloquear clics en el resto de la pantalla */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Contenedor del menú lateral */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-50 p-4 flex flex-col transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <MenuList onLinkClick={onClose} />
      </div>
    </>
  );
};
SideMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideMenu;
