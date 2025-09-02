import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  test('renderiza el contenedor principal', () => {
    const container = screen.getByTestId('navbar'); 
    expect(container).toBeInTheDocument();
  });

  test('renderiza NavBarWrapper dentro del Navbar', () => {
    // Usamos un elemento dentro de NavBarWrapper como referencia
    const wrapperLogo = screen.getByTestId('logo-main');
    expect(wrapperLogo).toBeInTheDocument();
  });

  test('renderiza el logo principal', () => {
    const logo = screen.getByAltText('Logo SolyMar');
    expect(logo).toBeInTheDocument();
  });

  test('renderiza los links principales', () => {
    const homeLink = screen.getByRole('link', { name: /home/i });
    const offersLink = screen.getByRole('link', { name: /promociones/i });
    const profileLink = screen.getByRole('link', { name: /mi perfil/i });

    expect(homeLink).toBeInTheDocument();
    expect(offersLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });

  test('renderiza el botón de menú (hamburger)', () => {
  const buttons = screen.getAllByRole('button');
  const menuButton = buttons[0]; 
  expect(menuButton).toBeInTheDocument();
});
});
