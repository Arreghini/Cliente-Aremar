import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  test('se renderiza sin errores', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('contiene la dirección del edificio', () => {
    render(<Footer />);
    expect(
      screen.getByText('Edificio Aremar - Av. Calle 1 N°1919, Las Toninas, Argentina')
    ).toBeInTheDocument();
  });

  test('contiene el aviso de derechos reservados', () => {
    render(<Footer />);
    expect(screen.getByText('© 2025 Aremar. Todos los derechos reservados.')).toBeInTheDocument();
  });

  test('tiene clases de Tailwind correctas en el footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('relative z-10 text-center font-body text-neutral-oscuro bg-neutral-claro bg-opacity-70');
  });

  test('el contenedor interno tiene clases de Tailwind correctas', () => {
    render(<Footer />);
    const innerDiv = screen.getByText(/Edificio Aremar/).parentElement;
    expect(innerDiv).toHaveClass('max-w-7xl mx-auto p-4');
  });

  test('snapshot del Footer', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
