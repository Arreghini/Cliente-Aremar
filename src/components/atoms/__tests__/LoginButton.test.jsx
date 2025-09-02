import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '../LoginButton';
import { useAuth0 } from '@auth0/auth0-react';

// Mock del hook de Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

describe('LoginButton', () => {
  let loginWithRedirectMock;

  beforeEach(() => {
    loginWithRedirectMock = vi.fn();
    useAuth0.mockReturnValue({
      loginWithRedirect: loginWithRedirectMock,
    });
  });

  it('renderiza el botón correctamente', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeInTheDocument();
  });

  it('el botón tiene el texto correcto', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Login');
  });

  it('el botón tiene clase y tipo correctos', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-0 py-2 w-full text-left text-yellow-200 hover:text-yellow-500 cursor-pointer'
    );
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('llama a loginWithRedirect al hacer clic', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(loginWithRedirectMock).toHaveBeenCalledTimes(1);
    expect(loginWithRedirectMock).toHaveBeenCalledWith({ prompt: 'select_account' });
  });

  it('coincide con el snapshot', () => {
    const { container } = render(<LoginButton />);
    expect(container).toMatchSnapshot();
  });
});
