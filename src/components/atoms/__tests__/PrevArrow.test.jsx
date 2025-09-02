import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrevArrow from '../PrevArrow';

describe('PrevArrow component', () => {
  it('se renderiza sin explotar', () => {
    const mockClick = vi.fn();
    render(<PrevArrow onClick={mockClick} />);
    expect(screen.getByTestId('prev-arrow')).toBeInTheDocument();
  });

  it('renderiza el ícono FaChevronLeft dentro del contenedor', () => {
    const mockClick = vi.fn();
    const { container } = render(<PrevArrow onClick={mockClick} />);

    // Busca un <svg> que renderiza react-icons
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('ejecuta la función onClick cuando se hace clic', () => {
    const mockClick = vi.fn();
    render(<PrevArrow onClick={mockClick} />);
    const arrowDiv = screen.getByTestId('prev-arrow');

    fireEvent.click(arrowDiv);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('contiene las clases de estilo esperadas en el contenedor', () => {
    const mockClick = vi.fn();
    const { container } = render(<PrevArrow onClick={mockClick} />);

    const div = container.firstChild;
    expect(div).toHaveClass(
      'absolute',
      'top-1/2',
      '-translate-y-1/2',
      '-left-6',
      'cursor-pointer',
      'z-10'
    );
  });

  it('aplica estilos correctos al icono', () => {
    const mockClick = vi.fn();
    const { container } = render(<PrevArrow onClick={mockClick} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-playa-sol', 'hover:text-gray-700', 'transition');
  });
});
