import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQList from '../FAQList';

// Mock de FAQItem
vi.mock('../../molecules/FAQItem', () => ({
  default: vi.fn(({ question, answer, onClick }) => (
    <div data-testid="faq-item" onClick={onClick}>
      <p>{question}</p>
      <p>{answer}</p>
    </div>
  )),
}));

import FAQItem from '../../molecules/FAQItem';

describe('FAQList', () => {
  test('renderiza el contenedor principal', () => {
    render(<FAQList />);
    const container = screen.getByTestId('faq-list-container');
    expect(container).toBeInTheDocument();
  });

  test('renderiza todos los FAQItems', () => {
    render(<FAQList />);
    const items = screen.getAllByTestId('faq-item');
    expect(items.length).toBe(3); // Debe coincidir con el array faqs
  });

  test('cada FAQItem recibe la pregunta y respuesta correcta', () => {
    render(<FAQList />);
    expect(FAQItem).toHaveBeenCalledWith(
      {
        question: '¿Cómo hago una reserva?',
        answer:
          'Podés hacer una reserva desde la página de inicio seleccionando fechas y tipo de habitación.',
      },
      {}
    );
    expect(FAQItem).toHaveBeenCalledWith(
      {
        question: '¿Se puede cancelar una reserva?',
        answer:
          'Sí, podés cancelar desde tu perfil. Consultá nuestras políticas de cancelación.',
      },
      {}
    );
    expect(FAQItem).toHaveBeenCalledWith(
      {
        question: '¿Aceptan mascotas?',
        answer:
          'En algunos departamentos sí, según disponibilidad. Consultá antes de reservar.',
      },
      {}
    );
  });

  test('cada FAQItem muestra la pregunta y respuesta en pantalla', () => {
    render(<FAQList />);
    expect(screen.getByText('¿Cómo hago una reserva?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Podés hacer una reserva desde la página de inicio seleccionando fechas y tipo de habitación.'
      )
    ).toBeInTheDocument();
  });

  test('simula click en un FAQItem', () => {
    const handleClick = vi.fn();
    FAQItem.mockImplementationOnce(({ question, answer }) => (
      <div data-testid="faq-item" onClick={handleClick}>
        <p>{question}</p>
        <p>{answer}</p>
      </div>
    ));
    render(<FAQList />);
    const item = screen.getAllByTestId('faq-item')[0];
    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalled();
  });

  test('snapshot de FAQList', () => {
    const { container } = render(<FAQList />);
    expect(container).toMatchSnapshot();
  });
});
