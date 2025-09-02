import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationPage from '../ReservationPage';
import reservationService from '../../../services/ReservationService';
import roomService from '../../../services/RoomService';
import { useLocation } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useLocation: vi.fn() };
});

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { sub: 'user123' },
    isLoading: false,
    getAccessTokenSilently: async () => 'fake-token',
  }),
}));

// Mock PaymentOptions
vi.mock('../../components/molecules/PayButton', () => {
  return () => <button>Pagar</button>;
});

// Mock services
vi.mock('../../../services/ReservationService');
vi.mock('../../../services/RoomService');

describe('ReservationPage', () => {
  const roomState = {
    roomTypeId: '1',
    roomTypeName: 'Deluxe Room',
    checkIn: '2025-08-28',
    checkOut: '2025-08-30',
    numberOfGuests: 2,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    useLocation.mockReturnValue({ state: roomState });
  });

  it('1. renders form with initial room name from state', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });

    render(<ReservationPage />);

    const roomInput = await screen.findByLabelText('Tipo de Habitación');
    expect(roomInput.value).toBe('Deluxe Room');

    const createBtn = await screen.findByRole('button', { name: /Crear Reserva/i });
    expect(createBtn).not.toBeDisabled();
  });

  it('2. shows error when no rooms available', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [] });

    render(<ReservationPage />);

    const createBtn = await screen.findByRole('button', { name: /Crear Reserva/i });
    fireEvent.click(createBtn);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/No hay habitaciones disponibles/i);
  });

  it('3. creates reservation successfully', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });
    reservationService.createReservation.mockResolvedValue({ id: 'res1' });

    render(<ReservationPage />);

    const createBtn = await screen.findByRole('button', { name: /Crear Reserva/i });
    fireEvent.click(createBtn);

    const successMsg = await screen.findByRole('alert');
    expect(successMsg).toHaveTextContent(/Reserva creada correctamente/i);

    const payBtn = await screen.findByRole('button', { name: /Pagar/i });
    expect(payBtn).toBeInTheDocument();
  });

  it('4. updates number of guests correctly', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });

    render(<ReservationPage />);

    const guestsInput = screen.getByLabelText('Cantidad de Huéspedes');
    fireEvent.change(guestsInput, { target: { value: '3' } });
    expect(guestsInput.value).toBe('3');
  });

  it('5. disables create button while processing reservation', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });
    reservationService.createReservation.mockImplementation(
      () => new Promise((res) => setTimeout(() => res({ id: 'res1' }), 100))
    );

    render(<ReservationPage />);

    const createBtn = await screen.findByRole('button', { name: /Crear Reserva/i });
    fireEvent.click(createBtn);

    expect(createBtn).toBeDisabled();
  });

  it('6. shows error if reservationService.createReservation fails', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });
    reservationService.createReservation.mockRejectedValue(new Error('Fallo del servidor'));

    render(<ReservationPage />);

    const createBtn = await screen.findByRole('button', { name: /Crear Reserva/i });
    fireEvent.click(createBtn);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Fallo del servidor/i);
  });

  it('7. renders correct initial check-in and check-out dates', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValue({ rooms: [{ id: 'r1' }] });

    render(<ReservationPage />);

    const checkInInput = screen.getByLabelText('Check-in');
    const checkOutInput = screen.getByLabelText('Check-out');
    expect(checkInInput.value).toBe('2025-08-28');
    expect(checkOutInput.value).toBe('2025-08-30');
  });
});
