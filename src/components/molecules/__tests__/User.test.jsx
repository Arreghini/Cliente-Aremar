import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import User from '../User';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Mock de axios
vi.mock('axios');

// Mock de Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

describe('User Component', () => {
  const mockUser = { name: 'Juan Pérez', email: 'juan@example.com' };
  const mockToken = 'mocked-token';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('muestra mensaje de login si no está autenticado', () => {
    useAuth0.mockReturnValue({
      user: null,
      isAuthenticated: false,
      getAccessTokenSilently: vi.fn(),
    });

    render(<User />);
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  test('muestra nombre y email del usuario si está autenticado', async () => {
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
    });

    render(<User />);

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });
  });

  test('llama a getAccessTokenSilently al montar el componente', async () => {
    const getToken = vi.fn().mockResolvedValue(mockToken);
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: getToken,
    });

    render(<User />);
    await waitFor(() => expect(getToken).toHaveBeenCalledTimes(1));
  });

  test('guarda token en localStorage', async () => {
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
    });

    render(<User />);
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken);
    });
  });

  test('guarda info de usuario en localStorage', async () => {
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
    });

    render(<User />);
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    });
  });

  test('llama a axios.post con los datos correctos', async () => {
    const postMock = vi.fn().mockResolvedValue({ data: 'success' });
    axios.post.mockImplementation(postMock);

    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
    });

    render(<User />);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/sync',
        mockUser,
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
    });
  });
});
