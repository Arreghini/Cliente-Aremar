import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavLinkItem from '../NavLinkItem';
import { MemoryRouter } from 'react-router-dom';

describe('NavLinkItem individual items', () => {
  const items = [
    { to: '/home', label: 'Home', icon: '🏠', external: false },
    { to: '/about', label: 'About', icon: 'ℹ️', external: false },
    { to: '/contact', label: 'Contact', icon: '📞', external: false },
    { to: 'https://google.com', label: 'Google', icon: '🌐', external: true },
    { to: 'https://github.com', label: 'GitHub', icon: '🐙', external: true },
  ];

  const handleClick = vi.fn();

  test.each(items)('renders NavLinkItem: %s', (item) => {
    render(
      <MemoryRouter>
        <NavLinkItem
          to={item.to}
          icon={<span>{item.icon}</span>}
          label={item.label}
          onClick={handleClick}
          external={item.external}
        />
      </MemoryRouter>
    );

    // Verificar label e ícono
    expect(screen.getByText(item.label)).toBeInTheDocument();
    expect(screen.getByText(item.icon)).toBeInTheDocument();

    // Simular clic
    const link = screen.getByText(item.label).closest('a');
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalled();

    // Verificar atributos de links externos
    if (item.external) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
