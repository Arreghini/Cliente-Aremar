// src/components/atoms/__tests__/MenuButton.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuButton from '../MenuButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

// Mock del FontAwesomeIcon para simplificar las pruebas
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="icon">{icon.iconName}</span>,
}));

describe('MenuButton', () => {
  let onClickMock;

  beforeEach(() => {
    onClickMock = vi.fn();
  });

  it('renderiza el botón correctamente', () => {
    render(<MenuButton isOpen={false} onClick={onClickMock} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('muestra el ícono faBars cuando isOpen es false', () => {
    render(<MenuButton isOpen={false} onClick={onClickMock} />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveTextContent('bars');
  });

  it('muestra el ícono faTimes cuando isOpen es true', () => {
  render(<MenuButton isOpen={true} onClick={onClickMock} />);
  const icon = screen.getByTestId('icon');
  expect(icon).toHaveTextContent('xmark'); // <-- cambio de 'times' a 'xmark'
});

  it('llama a onClick al hacer clic', () => {
    render(<MenuButton isOpen={false} onClick={onClickMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('coincide con el snapshot', () => {
    const { container } = render(<MenuButton isOpen={false} onClick={onClickMock} />);
    expect(container).toMatchSnapshot();
  });
});
