import { describe, expect, test, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SideMenu from '../SideMenu';

// Mock de MenuList
vi.mock('../../molecules/MenuList', () => ({
  default: vi.fn(({ onLinkClick }) => (
    <div data-testid="menu-list">
      <button onClick={onLinkClick}>Link 1</button>
      <button onClick={onLinkClick}>Link 2</button>
    </div>
  )),
}));

import MenuList from '../../molecules/MenuList';

describe('SideMenu', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el menú abierto y el overlay', () => {
    render(<SideMenu isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.fixed.inset-0.bg-gray-900');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('opacity-100');

    const menuContainer = document.querySelector('.fixed.left-0.top-0');
    expect(menuContainer).toBeInTheDocument();
    expect(menuContainer).toHaveClass('translate-x-0');

    expect(screen.getByTestId('menu-list')).toBeInTheDocument();
  });

  test('renderiza el menú cerrado', () => {
    render(<SideMenu isOpen={false} onClose={onClose} />);
    const menuContainer = document.querySelector('.-translate-x-full');
    expect(menuContainer).toBeInTheDocument();

    const overlay = document.querySelector('.pointer-events-none');
    expect(overlay).toBeInTheDocument();
  });

  test('llama a onClose al hacer click en el overlay', () => {
    render(<SideMenu isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.opacity-100');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('llama a onClose al hacer click en un link de MenuList', () => {
    render(<SideMenu isOpen={true} onClose={onClose} />);
    const linkButton = screen.getByText('Link 1');
    fireEvent.click(linkButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ------------------ NUEVOS TESTS ------------------

  test('MenuList recibe correctamente la prop onLinkClick', () => {
    render(<SideMenu isOpen={true} onClose={onClose} />);
    expect(MenuList).toHaveBeenCalledWith(
      expect.objectContaining({ onLinkClick: onClose }),
      expect.any(Object)
    );
  });

  test('varios clicks en los links llaman varias veces a onClose', () => {
    render(<SideMenu isOpen={true} onClose={onClose} />);
    const link1 = screen.getByText('Link 1');
    const link2 = screen.getByText('Link 2');

    fireEvent.click(link1);
    fireEvent.click(link2);

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('overlay permanece oculto cuando el menú está cerrado', () => {
    render(<SideMenu isOpen={false} onClose={onClose} />);
    const overlay = document.querySelector('.fixed.inset-0.bg-gray-900');
    expect(overlay).toHaveClass('pointer-events-none');
    expect(overlay).toHaveClass('opacity-0');
  });
});
