import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopMenuButton from '../TopMenuButton';

// Mock de Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// Mocks de subcomponentes
vi.mock('../../components/atoms/MisReservas', () => ({
  default: () => <div data-testid="mis-reservas">MisReservas Component</div>,
}));
vi.mock('../../components/atoms/LoginButton', () => ({
  default: () => <button data-testid="login-button">Login</button>,
}));
vi.mock('../../components/atoms/LogoutButton', () => ({
  default: () => <button data-testid="logout-button">Logout</button>,
}));
vi.mock('../../hooks/UseSyncUserWithBackend', () => ({
  default: vi.fn(),
}));

import { useAuth0 } from '@auth0/auth0-react';

describe('TopMenuButton component', () => {
  it('renderiza el logo de Home', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/Logo Aremar/i)).toBeInTheDocument();
  });

  it('muestra Mis Reservas deshabilitado si no está autenticado', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mis Reservas/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mis-reservas')).not.toBeInTheDocument();
  });

  it('muestra Mis Reservas y botón Logout si está autenticado', () => {
    useAuth0.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mis Reservas/i)).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
  });

  it('abre y cierra el modal de Mis Reservas al hacer clic fuera', () => {
    useAuth0.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    const button = screen.getByText(/Mis Reservas/i);
    fireEvent.click(button);

    expect(screen.getByTestId('mis-reservas')).toBeInTheDocument();

    // Simula click fuera
    fireEvent.mouseDown(document);
    expect(screen.queryByTestId('mis-reservas')).not.toBeInTheDocument();
  });

  it('renderiza botones de navegación Promociones y Mi Perfil', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Promociones/i)).toBeInTheDocument();
    expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
  });

  it('muestra LoginButton si no está autenticado', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('no muestra LoginButton si está autenticado', () => {
    useAuth0.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <TopMenuButton className="" />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
  });
});
