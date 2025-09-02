import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NextArrow from '../NextArrow';

describe('NextArrow multiple items', () => {
  it('renders multiple arrows and responds to clicks', () => {
    const handleClick1 = vi.fn();
    const handleClick2 = vi.fn();
    const handleClick3 = vi.fn();

    render(
      <>
        <NextArrow onClick={handleClick1} />
        <NextArrow onClick={handleClick2} />
        <NextArrow onClick={handleClick3} />
      </>
    );

    const arrows = screen.getAllByTestId('next-arrow');
    expect(arrows).toHaveLength(3);

    // Hacemos click en cada flecha y verificamos que su handler se ejecute
    fireEvent.click(arrows[0]);
    fireEvent.click(arrows[1]);
    fireEvent.click(arrows[2]);

    expect(handleClick1).toHaveBeenCalledTimes(1);
    expect(handleClick2).toHaveBeenCalledTimes(1);
    expect(handleClick3).toHaveBeenCalledTimes(1);
  });
});
