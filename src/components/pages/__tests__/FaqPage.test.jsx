import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FaqPage from '../FaqPage';

// Mock de FAQList para Vitest
vi.mock('../../organisms/FAQList', () => ({
  default: () => <div data-testid="faq-list">FAQList Mock</div>,
}));

describe('FaqPage component', () => {
  it('renderiza el título principal', () => {
    render(<FaqPage />);
    expect(screen.getByRole('heading', { name: /preguntas frecuentes/i })).toBeInTheDocument();
  });

  it('incluye el componente FAQList', () => {
    render(<FaqPage />);
    expect(screen.getByTestId('faq-list')).toBeInTheDocument();
  });

  it('usa el contenedor principal con la clase correcta', () => {
    render(<FaqPage />);
    const container = screen.getByText(/preguntas frecuentes/i).closest('div');
    expect(container).toHaveClass(
      'px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg'
    );
  });

  it('usa un contenedor exterior con padding superior y fondo oscuro', () => {
    render(<FaqPage />);
    const outerDiv = screen.getByText(/preguntas frecuentes/i).parentElement.parentElement;
    expect(outerDiv).toHaveClass('pt-36 bg-neutral-oscuro min-h-screen flex');
  });

  it('el título principal tiene las clases de estilo correctas', () => {
    render(<FaqPage />);
    const heading = screen.getByRole('heading', { name: /preguntas frecuentes/i });
    expect(heading).toHaveClass('text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6');
  });

  it('renderiza correctamente sin errores', () => {
    const { container } = render(<FaqPage />);
    expect(container).toBeInTheDocument();
  });
});
