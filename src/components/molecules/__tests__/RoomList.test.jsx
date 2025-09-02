import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RoomList from '../RoomList';
import roomService from '../../../services/RoomService';

// Mock del servicio
vi.mock('../../../services/RoomService', () => ({
  default: {
    getAvailableRooms: vi.fn(),
  },
}));

describe('RoomList', () => {
  const mockRoomsInitial = [
    { id: '1', description: 'Habitación simple' },
    { id: '2', description: 'Habitación doble' },
    { id: '3', description: 'Habitación triple' },
  ];

  const mockRoomsUpdated = [
    { id: '4', description: 'Suite junior' },
    { id: '5', description: 'Suite senior' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('muestra las habitaciones disponibles con fechas válidas', async () => {
    roomService.getAvailableRooms.mockResolvedValueOnce(mockRoomsInitial);

    render(<RoomList checkInDate="2025-09-10" checkOutDate="2025-09-15" />);

    // Esperamos a que el servicio haya sido llamado con las fechas correctas
    await waitFor(() => {
      expect(roomService.getAvailableRooms).toHaveBeenCalledWith(
        '2025-09-10',
        '2025-09-15'
      );
    });

    // Verificamos que se rendericen las habitaciones
    for (const room of mockRoomsInitial) {
      expect(screen.getByText(room.description)).toBeInTheDocument();
    }
  });

  test('no llama al servicio si las fechas son nulas o vacías', async () => {
    render(<RoomList checkInDate="" checkOutDate="" />);

    await waitFor(() => {
      expect(roomService.getAvailableRooms).not.toHaveBeenCalled();
    });
  });

  test('actualiza la lista al cambiar las fechas', async () => {
    // Primer render
    roomService.getAvailableRooms.mockResolvedValueOnce(mockRoomsInitial);

    const { rerender } = render(
      <RoomList checkInDate="2025-09-10" checkOutDate="2025-09-15" />
    );

    await waitFor(() => {
      expect(roomService.getAvailableRooms).toHaveBeenCalledWith(
        '2025-09-10',
        '2025-09-15'
      );
    });

    // Cambiamos las fechas para actualizar la lista
    roomService.getAvailableRooms.mockResolvedValueOnce(mockRoomsUpdated);

    rerender(<RoomList checkInDate="2025-10-01" checkOutDate="2025-10-05" />);

    await waitFor(() => {
      expect(roomService.getAvailableRooms).toHaveBeenCalledWith(
        '2025-10-01',
        '2025-10-05'
      );
    });

    // Verificamos que se rendericen las nuevas habitaciones
    for (const room of mockRoomsUpdated) {
      expect(screen.getByText(room.description)).toBeInTheDocument();
    }
  });
});
