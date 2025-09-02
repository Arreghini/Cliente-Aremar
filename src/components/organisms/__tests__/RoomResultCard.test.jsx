import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoomResultCard from '../RoomResultCard';

describe('RoomResultCard component', () => {
  const mockRoom = {
    photoRoom: 'https://example.com/photo.jpg',
    roomType: { name: 'Habitación Deluxe' },
    capacity: 3,
    price: 150,
  };

  it('1. No renderiza nada si no recibe room', () => {
    const { container } = render(<RoomResultCard room={null} onReserve={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('2. Renderiza los datos de la habitación correctamente', () => {
    render(<RoomResultCard room={mockRoom} onReserve={vi.fn()} />);
    expect(screen.getByText('Habitación Deluxe')).toBeInTheDocument();
    expect(screen.getByText(/Capacidad: 3 huéspedes/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio: \$150\/noche/i)).toBeInTheDocument();
  });

  it('3. Muestra la imagen si photoRoom existe', () => {
    render(<RoomResultCard room={mockRoom} onReserve={vi.fn()} />);
    const img = screen.getByAltText('Foto de Habitación Deluxe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockRoom.photoRoom);
  });

  it('4. No muestra imagen si photoRoom no existe', () => {
    const roomWithoutPhoto = { ...mockRoom, photoRoom: null };
    render(<RoomResultCard room={roomWithoutPhoto} onReserve={vi.fn()} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('5. Ejecuta onReserve al hacer click en el botón', () => {
    const onReserveMock = vi.fn();
    render(<RoomResultCard room={mockRoom} onReserve={onReserveMock} />);
    const button = screen.getByRole('button', { name: /reservar ahora/i });
    fireEvent.click(button);
    expect(onReserveMock).toHaveBeenCalledTimes(1);
  });

  it('6. Match con snapshot (estructura básica)', () => {
    const { container } = render(<RoomResultCard room={mockRoom} onReserve={vi.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
