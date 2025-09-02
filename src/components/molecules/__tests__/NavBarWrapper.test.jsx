import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBarWrapper from '../NavBarWrapper';
import { useAuth0 } from '@auth0/auth0-react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 

vi.mock('@auth0/auth0-react');

describe('NavBarWrapper component', () => {
  const loginWithRedirectMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

 it('renders logo and main buttons', () => {
  useAuth0.mockReturnValue({
    isAuthenticated: false,
    loginWithRedirect: loginWithRedirectMock,
    logout: logoutMock,
  });

  render(
    <MemoryRouter>
      <NavBarWrapper />
    </MemoryRouter>
  );

  // Comprueba la presencia de botones y logo
  expect(screen.getAllByRole('button').length).toBeGreaterThan(0);

  // Opción 1: por alt
  expect(screen.getByAltText(/logo solymar/i)).toBeInTheDocument();

  // Opción 2: por testId
  // expect(screen.getByTestId('logo-main')).toBeInTheDocument();
});


  it('renders SideMenu when showMenu is true', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: loginWithRedirectMock,
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <NavBarWrapper />
      </MemoryRouter>
    );

    const menuButton = screen.getAllByRole('button')[0];
    fireEvent.click(menuButton);

    expect(screen.getByText(/login/i) || screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('calls loginWithRedirect when login is triggered', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: loginWithRedirectMock,
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <NavBarWrapper />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]); // abrir menú
    const loginButton = screen.getByText(/login/i);
    fireEvent.click(loginButton);

    expect(loginWithRedirectMock).toHaveBeenCalledTimes(1);
  });

  it('calls logout when logout is triggered', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: loginWithRedirectMock,
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <NavBarWrapper />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]); // abrir menú
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('hides navbar on scroll down and shows on scroll up', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: loginWithRedirectMock,
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <NavBarWrapper />
      </MemoryRouter>
    );

    // simulamos scroll hacia abajo
    fireEvent.scroll(window, { target: { scrollY: 200 } });
    expect(document.querySelector('div.fixed')).toHaveClass('-translate-y-full');

    // simulamos scroll hacia arriba
    fireEvent.scroll(window, { target: { scrollY: 50 } });
    expect(document.querySelector('div.fixed')).toHaveClass('translate-y-0');
  });
});
