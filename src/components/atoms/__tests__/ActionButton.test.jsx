import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../ActionButton';

describe('ActionButton', () => {
  it('renderiza con children y clases Tailwind', () => {
    const handleClick = vi.fn();
    render(<ActionButton onClick={handleClick}>Click me</ActionButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-mar-profundo');
  });

  it('llama al onClick cuando se hace click', () => {
    const handleClick = vi.fn();
    render(<ActionButton onClick={handleClick}>Click me</ActionButton>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

