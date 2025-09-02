import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GalleryEdificio from '../GalleryEdificio';

// Mock de react-slick y flechas
vi.mock('react-slick', () => ({
  default: ({ children }) => <div data-testid="slider">{children}</div>,
}));
vi.mock('../atoms/NextArrow', () => ({ default: () => <div data-testid="next-arrow" /> }));
vi.mock('../atoms/PrevArrow', () => ({ default: () => <div data-testid="prev-arrow" /> }));

describe('GalleryEdificio', () => {
  test('renderiza todas las miniaturas', () => {
    render(<GalleryEdificio />);
    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails.length).toBe(6); // Deben ser 6 imágenes
  });

  test('abrir modal al hacer click en una miniatura', () => {
    render(<GalleryEdificio />);
    const firstThumbnail = screen.getByAltText('Habitación');
    fireEvent.click(firstThumbnail);

    const modalOverlay = document.querySelector('.fixed.inset-0.flex');
    expect(modalOverlay).toBeInTheDocument();
    
    const modalImage = modalOverlay.querySelector('img');
    expect(modalImage).toHaveAttribute('src', expect.stringContaining('habitacion'));
  });

  test('cerrar modal haciendo click en overlay', () => {
    render(<GalleryEdificio />);
    const firstThumbnail = screen.getByAltText('Habitación');
    fireEvent.click(firstThumbnail);

    const modalOverlay = document.querySelector('.fixed.inset-0.flex');
    fireEvent.click(modalOverlay);
    expect(document.querySelector('.fixed.inset-0.flex')).not.toBeInTheDocument();
  });

  test('cerrar modal haciendo click en botón de cerrar', () => {
    render(<GalleryEdificio />);
    const firstThumbnail = screen.getByAltText('Habitación');
    fireEvent.click(firstThumbnail);

    const closeButton = screen.getByLabelText('Cerrar imagen ampliada');
    fireEvent.click(closeButton);
    expect(document.querySelector('.fixed.inset-0.flex')).not.toBeInTheDocument();
  });

  test('mostrar la imagen correcta en el modal según miniatura clickeada', () => {
    render(<GalleryEdificio />);
    const thirdThumbnail = screen.getByAltText('Estacionamiento');
    fireEvent.click(thirdThumbnail);

    const modalOverlay = document.querySelector('.fixed.inset-0.flex');
    const modalImage = modalOverlay.querySelector('img');
    expect(modalImage).toHaveAttribute('alt', 'Estacionamiento');
  });
});
