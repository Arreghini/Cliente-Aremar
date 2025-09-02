import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQItem from '../FAQItem';

describe('FAQItem component', () => {
  const question = '¿Cómo hago una reserva?';
  const answer = 'Puedes hacerla desde nuestra web fácilmente.';

  it('renders the question correctly', () => {
    render(<FAQItem question={question} answer={answer} />);
    expect(screen.getByText(question)).toBeInTheDocument();
  });

 it('does not show the answer initially', () => {
  render(<FAQItem question={question} answer={answer} />);
  const answerElement = screen.getByText(answer);
  expect(answerElement.parentElement).toHaveStyle('max-height: 0');
});

it('toggles the icon from + to -', () => {
  render(<FAQItem question={question} answer={answer} />);
  const button = screen.getByRole('button', { name: question });
  const icon = button.querySelector('span[aria-hidden="true"]');
  expect(icon.textContent).toBe('+');
  fireEvent.click(button);
  expect(icon.textContent).toBe('-');
});

it('hides the answer when button is clicked again', () => {
  render(<FAQItem question={question} answer={answer} />);
  const button = screen.getByRole('button', { name: question });
  fireEvent.click(button); // abrir
  fireEvent.click(button); // cerrar
  const answerElement = screen.getByText(answer);
  expect(answerElement.parentElement).toHaveStyle('max-height: 0');
});

  it('hides the answer when button is clicked again', () => {
    render(<FAQItem question={question} answer={answer} />);
    const button = screen.getByRole('button', { name: question });
    fireEvent.click(button); // abrir
    fireEvent.click(button); // cerrar
    const answerElement = screen.getByText(answer);
    expect(answerElement.parentElement).toHaveStyle('max-height: 0');
  });
});
