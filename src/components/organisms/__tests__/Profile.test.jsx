import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Profile from '../Profile';

// Mock de useAuth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

const { useAuth0 } = await import('@auth0/auth0-react');

describe('Profile component', () => {
  const mockUser = {
    name: 'Mauricio Arreghini',
    email: 'mauricio@test.com',
    picture: 'https://example.com/photo.jpg',
    given_name: 'Mauricio',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('1. Muestra "Cargando..." cuando isLoading es true', () => {
    useAuth0.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    });

    render(<Profile />);
    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });

  test('2. No renderiza nada si no está autenticado', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });

    const { container } = render(<Profile />);
    expect(container).toBeEmptyDOMElement();
  });

  test('3. Renderiza el encabezado con "Mi Perfil"', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });

    render(<Profile />);
    expect(screen.getByRole('heading', { name: /Mi Perfil/i })).toBeInTheDocument();
  });

  test('4. Muestra la información básica del usuario (nombre y email)', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });

    render(<Profile />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  test('5. Renderiza el nombre dado (given_name) si está presente', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });

    render(<Profile />);
    expect(screen.getByText(mockUser.given_name)).toBeInTheDocument();
  });

  test('6. Alterna el JSON al hacer click en el botón', () => {
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });

    render(<Profile />);
    const toggleButton = screen.getByRole('button', { name: /Ver JSON completo/i });

    // Verifica que el JSON no está visible
    expect(screen.queryByText(/"email": "mauricio@test.com"/i)).not.toBeInTheDocument();

    // Click para mostrar JSON
    fireEvent.click(toggleButton);
    expect(screen.getByText(/"email": "mauricio@test.com"/i)).toBeInTheDocument();

    // Click para ocultar JSON
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/"email": "mauricio@test.com"/i)).not.toBeInTheDocument();
  });
});
