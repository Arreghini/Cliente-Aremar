// src/components/atoms/__tests__/LogoutButton.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from '../LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

// Mock del hook de Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

describe('LogoutButton', () => {
  let logoutMock;

  beforeEach(() => {
    logoutMock = vi.fn();
    useAuth0.mockReturnValue({
      logout: logoutMock,
    });
  });

  it('renderiza el botón correctamente', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('el botón tiene el texto correcto', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Logout');
  });

  it('el botón tiene clase y tipo correctos', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-0 py-2 w-full text-left text-white hover:text-yellow-500 cursor-pointer'
    );
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('llama a logout al hacer clic con returnTo correcto', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(logoutMock).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });

  it('coincide con el snapshot', () => {
    const { container } = render(<LogoutButton />);
    expect(container).toMatchSnapshot();
  });
});
