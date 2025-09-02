import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuList from '../MenuList';
import { useAuth0 } from '@auth0/auth0-react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@auth0/auth0-react');

describe('MenuList component', () => {
  const onLinkClickMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all links when user is not admin', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { 'https://aremar.com/roles': ['guest'] },
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Nuestra historia')).toBeInTheDocument();
    expect(screen.getByText('Cómo llegar')).toBeInTheDocument();
    expect(screen.getByText('Opiniones')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Política de cancelaciones')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders Dashboard link if user is admin', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { 'https://aremar.com/roles': ['admin'] },
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('calls onLinkClick when a link is clicked', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { 'https://aremar.com/roles': ['guest'] },
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(onLinkClickMock).toHaveBeenCalledTimes(1);
  });

  it('renders all links when user is not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Nuestra historia')).toBeInTheDocument();
    expect(screen.getByText('Cómo llegar')).toBeInTheDocument();
    expect(screen.getByText('Opiniones')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Política de cancelaciones')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('does not render any links if user is null', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: null,
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument(); // siempre Home
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders Dashboard link if user has multiple roles including admin', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { 'https://aremar.com/roles': ['guest', 'admin'] },
    });

    render(
      <MemoryRouter>
        <MenuList onLinkClick={onLinkClickMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
