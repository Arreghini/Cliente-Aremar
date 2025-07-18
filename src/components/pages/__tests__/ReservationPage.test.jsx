import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import ReservationPage from '../ReservationPage';
import { roomService } from '../../../services/roomService';
import { reservationService } from '../../../services/reservationService';

jest.mock('@auth0/auth0-react');
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn()
}));
jest.mock('../../../services/roomService');
jest.mock('../../../services/reservationService');

describe('ReservationPage', () => {
  const mockUser = {
    sub: 'auth0|123'
  };

  const mockLocation = {
    state: {
      roomTypeId: '123',
      roomTypeName: 'Deluxe Room',
      checkIn: '2024-01-01',
      checkOut: '2024-01-03',
      numberOfGuests: '2'
    }
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      getAccessTokenSilently: jest.fn().mockResolvedValue('mock-token'),
      user: mockUser,
      isLoading: false
    });

    useLocation.mockReturnValue(mockLocation);

    roomService.getAvailableRoomsByType.mockResolvedValue({
      rooms: [{
        id: 'room123',
        roomTypeId: '123'
      }]
    });

    reservationService.createReservation.mockResolvedValue({
      id: 'res123',
      status: 'pending'
    });
  });

  test('renders reservation form with initial values', () => {
    render(<ReservationPage />);
    
    expect(screen.getByDisplayValue('Deluxe Room')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-03')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  test('handles successful reservation creation', async () => {
    render(<ReservationPage />);
    
    const createButton = screen.getByText('Crear Reserva');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Reserva creada correctamente. Proceda al pago.')).toBeInTheDocument();
    });
  });

  test('displays error message when no rooms available', async () => {
    roomService.getAvailableRoomsByType.mockResolvedValueOnce({ rooms: [] });
    
    render(<ReservationPage />);
    
    const createButton = screen.getByText('Crear Reserva');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('No hay habitaciones disponibles')).toBeInTheDocument();
    });
  });

  test('validates required fields before submission', async () => {
    useLocation.mockReturnValueOnce({ state: {} });
    
    render(<ReservationPage />);
    
    const createButton = screen.getByText('Crear Reserva');
    fireEvent.click(createButton);

    expect(screen.getByText('Faltan datos requeridos para la reserva')).toBeInTheDocument();
  });

  test('handles API error during reservation creation', async () => {
    reservationService.createReservation.mockRejectedValueOnce(new Error('API Error'));
    
    render(<ReservationPage />);
    
    const createButton = screen.getByText('Crear Reserva');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('updates number of guests when input changes', () => {
    render(<ReservationPage />);
    
    const guestsInput = screen.getByPlaceholderText('Número de huéspedes');
    fireEvent.change(guestsInput, { target: { value: '3' } });

    expect(guestsInput.value).toBe('3');
  });

  test('disables create button while processing', async () => {
    render(<ReservationPage />);
    
    const createButton = screen.getByText('Crear Reserva');
    fireEvent.click(createButton);

    expect(createButton).toBeDisabled();
    expect(screen.getByText('Procesando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Reserva creada correctamente. Proceda al pago.')).toBeInTheDocument();
    });
  });
}
