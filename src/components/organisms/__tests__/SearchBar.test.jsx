import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../SearchBar';

// Mock RoomService
vi.mock('../../../services/RoomService', () => ({
  default: {
    getRoomTypes: vi.fn(),
    checkAvailability: vi.fn(),
  },
}));
import roomService from '../../../services/RoomService';

// Mock react-datepicker para simplificar la selección de fechas
vi.mock('react-datepicker', () => {
  // Componente mock: dos inputs para start y end; llama a onChange con Dates
  const MockDatePicker = ({ startDate, endDate, onChange }) => {
    return (
      <div data-testid="mock-datepicker">
        <input
          data-testid="dp-start"
          onChange={(e) =>
            onChange([new Date(e.target.value), endDate ?? null])
          }
        />
        <input
          data-testid="dp-end"
          onChange={(e) =>
            onChange([startDate ?? null, new Date(e.target.value)])
          }
        />
      </div>
    );
  };
  return { default: MockDatePicker };
});

describe('SearchBar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga 6 tipos, permite seleccionar tipo, setear fechas y buscar disponibilidad', async () => {
    // 1) Mockeo de 6 tipos
    const roomTypes = [
      { id: 1, name: 'Suite',      price: 100 },
      { id: 2, name: 'Doble',      price:  80 },
      { id: 3, name: 'Triple',     price: 120 },
      { id: 4, name: 'Familiar',   price: 150 },
      { id: 5, name: 'Deluxe',     price: 200 },
      { id: 6, name: 'Económica',  price:  60 },
    ];
    roomService.getRoomTypes.mockResolvedValue(roomTypes);

    // 2) Mockeo disponibilidad
    roomService.checkAvailability.mockResolvedValue({
      isAvailable: true,
      availableRooms: [{ id: 10, roomType: 'Suite', photoRoom: 'foto.jpg' }],
    });

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    // 3) Esperar a que termine el loading
    await waitForElementToBeRemoved(() =>
      screen.queryByText(/Cargando tipos de habitación/i)
    );

    // 4) Abrir menú de tipos
    fireEvent.click(screen.getByTestId('open-room-types'));

    // 5) Verificar los 6 items
    const optionButtons = await screen.findAllByTestId(/room-type-/);
    expect(optionButtons).toHaveLength(6);

    // Chequeo rápido por texto (al menos dos para asegurar render)
    expect(screen.getByText(/Suite - \$100\/noche/i)).toBeInTheDocument();
    expect(screen.getByText(/Económica - \$60\/noche/i)).toBeInTheDocument();

    // 6) Seleccionar tipo "Suite" (id:1)
    fireEvent.click(screen.getByTestId('room-type-1'));

    // 7) Abrir calendario y setear fechas mediante el mock
    fireEvent.click(screen.getByTestId('open-calendar'));
    const startInput = await screen.findByTestId('dp-start');
    const endInput = await screen.findByTestId('dp-end');

    const start = '2030-06-10';
    const end = '2030-06-12';
    fireEvent.change(startInput, { target: { value: start } });
    fireEvent.change(endInput, { target: { value: end } });

    // 8) Buscar disponibilidad
    fireEvent.click(screen.getByText('BUSCAR'));

    // 9) Validar mensaje de éxito
    await waitFor(() => {
      expect(
        screen.getByText(/¡Habitación disponible!/i)
      ).toBeInTheDocument();
    });

    // 10) Validar que se llamó a checkAvailability con lo esperado
    expect(roomService.checkAvailability).toHaveBeenCalled();
    const lastCallArgs = roomService.checkAvailability.mock.calls.at(-1);
    expect(lastCallArgs[0]).toBe('');                 // hotelId en tu código
    expect(lastCallArgs[1]).toBe(1);                  // roomType id
    expect(lastCallArgs[2]).toBeInstanceOf(Date);     // startDate
    expect(lastCallArgs[3]).toBeInstanceOf(Date);     // endDate
    expect(lastCallArgs[4]).toEqual(expect.any(Number)); // numberOfGuests

    // 11) Validar que aparece algo de la card (por ejemplo, el texto "Suite")
    expect(await screen.findByText(/Suite/i)).toBeInTheDocument();
  });
});
