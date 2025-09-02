import { describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SitiosInteres from '../../organisms/SitiosInteres';
import { vi } from 'vitest';

// Mock de react-slick para evitar errores en test
vi.mock('react-slick', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>, // Renderiza los children sin carrusel real
  };
});

describe('SitiosInteres component', () => {
  test('renderiza al menos 6 ítems con sus descripciones', () => {
    render(<SitiosInteres />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(6);

    expect(screen.getByAltText(/Playa/)).toBeInTheDocument();
    expect(screen.getByAltText(/Barcos de pesca/)).toBeInTheDocument();
    expect(screen.getByAltText(/Escollera/)).toBeInTheDocument();
    expect(screen.getByAltText(/Banana/)).toBeInTheDocument();
    expect(screen.getByAltText(/Laberinto/)).toBeInTheDocument();
    expect(screen.getByAltText(/Pesca/)).toBeInTheDocument();
  });

  const items = [
    /Playa/,
    /Barcos de pesca/,
    /Escollera/,
    /Banana/,
    /Laberinto/,
    /Pesca/,
  ];

  items.forEach((item) => {
    test(`abre y cierra el modal al hacer click en ${item}`, () => {
      render(<SitiosInteres />);
      
      // Abrimos modal
      const image = screen.getByAltText(item);
      fireEvent.click(image);

      const closeButton = screen.getByRole('button', { name: /Cerrar imagen ampliada/i });
      expect(closeButton).toBeInTheDocument();

      // La imagen aparece en modal
      const modalImages = screen.getAllByAltText(item);
      expect(modalImages.length).toBe(2); // en lista + modal
      expect(modalImages[1]).toBeVisible();

      // Cerramos modal
      fireEvent.click(closeButton);
      expect(screen.queryByRole('button', { name: /Cerrar imagen ampliada/i })).not.toBeInTheDocument();
    });
  });
});
