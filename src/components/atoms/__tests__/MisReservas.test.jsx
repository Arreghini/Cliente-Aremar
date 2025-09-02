// src/__tests__/MisReservas.test.jsx
import { expect, describe, test } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MisReservas from '../../atoms/MisReservas';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../../services/ReservationService';
import roomService from '../../../services/RoomService';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { vi } from 'vitest';

// Mocks
vi.mock('@auth0/auth0-react');
vi.mock('../../../services/ReservationService');
vi.mock('../../../services/RoomService');
vi.mock('@mercadopago/sdk-react');

// Mock de Auth0
const mockUser = { sub: 'auth0|123456789' };
const mockGetToken = vi.fn(() => Promise.resolve('mock-token'));
useAuth0.mockReturnValue({
  user: mockUser,
  getAccessTokenSilently: mockGetToken,
});

// Mock MercadoPago
initMercadoPago.mockImplementation(() => {});

// Mock de PayButton y botones simples
vi.mock('../components/atoms/ActionButton', () => {
  return { default: ({ children, ...props }) => <button {...props}>{children}</button> };
});
vi.mock('../PayButton', () => ({ default: () => <div>PayButton</div> }));
vi.mock('./DeleteButton', () => ({ default: ({ onDelete }) => <button onClick={() => onDelete('res-1')}>Eliminar</button> }));
vi.mock('./EditButton', () => ({ default: ({ onEdit }) => <button onClick={onEdit}>Editar</button> }));
vi.mock('../molecules/EditReservationModal', () => ({ default: ({ isOpen }) => (isOpen ? <div>Editar reserva</div> : null) }));
vi.mock('./StatusTag', () => ({ default: ({ status }) => <span>{status}</span> }));

describe('MisReservas', () => {
  const mockReservations = [
    {
      id: 'res-1',
      checkIn: '2025-12-01T00:00:00Z',
      checkOut: '2025-12-05T00:00:00Z',
      numberOfGuests: 2,
      totalPrice: 500,
      amountPaid: 0,
      status: 'pending',
      roomId: 'room-101',
      room: { id: 'room-101' },
    },
    {
      id: 'res-2',
      checkIn: '2025-11-10T00:00:00Z',
      checkOut: '2025-11-15T00:00:00Z',
      numberOfGuests: 1,
      totalPrice: 350,
      amountPaid: 350,
      status: 'confirmed',
      roomId: 'room-102',
      room: { id: 'room-102' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('muestra mensaje de carga inicialmente', () => {
    render(<MisReservas />);
    expect(screen.getByText('Cargando reservas...')).toBeInTheDocument();
  });

  test('renderiza reservas correctamente', async () => {
    reservationService.getUserReservations.mockResolvedValue(mockReservations);

    render(<MisReservas />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando reservas...')).not.toBeInTheDocument();
    });

    const toggleBtn = screen.getByRole('button', { name: /mostrar mis reservas/i });
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText(/habitación: room-101/i)).toBeInTheDocument();
      expect(screen.getByText(/habitación: room-102/i)).toBeInTheDocument();
      expect(screen.getAllByText('PayButton')).toHaveLength(2);

    });
  });

  test('abre modal de edición al hacer clic en "Editar"', async () => {
  reservationService.getUserReservations.mockResolvedValue(mockReservations);

  render(<MisReservas />);
  await waitFor(() => expect(screen.queryByText('Cargando reservas...')).not.toBeInTheDocument());

  const toggleBtn = screen.getByRole('button', { name: /mostrar mis reservas/i });
  fireEvent.click(toggleBtn);

  const editBtn = await screen.findByRole('button', { name: /editar/i });
  fireEvent.click(editBtn);

  // 👀 debug para ver qué está en el DOM después de hacer clic
  screen.debug();

  // usamos regex insensible a mayúsculas
  await waitFor(() => {
    expect(screen.getByText(/editar reserva/i)).toBeInTheDocument();
  });
});

test('elimina una reserva correctamente', async () => {
  reservationService.getUserReservations.mockResolvedValue(mockReservations);

  render(<MisReservas />);
  await waitFor(() => expect(screen.queryByText('Cargando reservas...')).not.toBeInTheDocument());

  const toggleBtn = screen.getByRole('button', { name: /mostrar mis reservas/i });
  fireEvent.click(toggleBtn);

  expect(screen.getByText(/habitación: room-101/i)).toBeInTheDocument();

  const deleteBtn = await screen.findByRole('button', { name: /eliminar/i });
  fireEvent.click(deleteBtn);

  await waitFor(() => {
    expect(screen.queryByText(/habitación: room-101/i)).not.toBeInTheDocument();
  });
});
});
