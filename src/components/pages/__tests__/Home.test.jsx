import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../Home';

// Mock de subcomponentes
vi.mock('../../organisms/SearchBar', () => ({
  default: () => <div data-testid="search-bar">SearchBar</div>,
}));
vi.mock('../../organisms/GalleryEdificio', () => ({
  default: () => <div data-testid="gallery-edificio">GalleryEdificio</div>,
}));
vi.mock('../../organisms/SitiosInteres', () => ({
  default: () => <div data-testid="sitios-interes">SitiosInteres</div>,
}));
vi.mock('../../organisms/RoomBasic', () => ({
  default: () => <div data-testid="room-basic">RoomBasic</div>,
}));
vi.mock('../../organisms/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Home component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Renderiza el título principal', () => {
    render(<Home />);
    expect(
      screen.getByText(/Bienvenidos a/i)
    ).toBeInTheDocument();
  });

  it('2. Renderiza la barra de búsqueda (SearchBar)', () => {
    render(<Home />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('3. Cambia el video automáticamente cada 5 segundos', () => {
  render(<Home />);
  const video = screen.getByTestId('background-video');
  const firstSrc = video.getAttribute('src');

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  const secondSrc = video.getAttribute('src');
  expect(secondSrc).not.toBe(firstSrc);
});

  it('4. Renderiza la sección de departamentos con RoomBasic', () => {
    render(<Home />);
    expect(screen.getByTestId('room-basic')).toBeInTheDocument();
    expect(screen.getByText(/Visite nuestros deptos/i)).toBeInTheDocument();
  });

it('5. Renderiza botón Deptos y permite hacer click', () => {
  render(<Home />);
  const button = screen.getByTestId('btn-deptos');
  expect(button).toBeInTheDocument();
  fireEvent.click(button); // dispara el handler de scroll
});

  it('6. Renderiza el Footer', () => {
    render(<Home />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
