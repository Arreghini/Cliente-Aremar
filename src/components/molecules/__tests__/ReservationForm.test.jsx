// src/components/molecules/__tests__/ReservationForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationForm from '../ReservationForm';
import ReservationService from '../../../services/ReservationService';
import { vi } from 'vitest';

// Mock del default export
vi.mock('../../../services/ReservationService', () => {
  return {
    default: {
      createReservation: vi.fn(),
    },
  };
});

describe('ReservationForm', () => {
  const mockOnReserve = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all form inputs and submit button', () => {
    render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);
    expect(screen.getByLabelText(/User ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check Out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Guests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reserve/i })).toBeInTheDocument();
  });

  test('updates form state on input change', () => {
    render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);
    const guestsInput = screen.getByLabelText(/Number of Guests/i);
    fireEvent.change(guestsInput, { target: { value: '3' } });
    expect(guestsInput.value).toBe('3');
  });

  test('prevents submission with empty required fields', () => {
    render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);
    const submitBtn = screen.getByRole('button', { name: /reserve/i });
    fireEvent.click(submitBtn);
    expect(mockOnReserve).not.toHaveBeenCalled();
  });

  test('numberOfGuests cannot be less than 1', () => {
    render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);
    const guestsInput = screen.getByLabelText(/Number of Guests/i);
    fireEvent.change(guestsInput, { target: { value: '0' } });
    expect(guestsInput.value).toBe('1');
  });

  test('calls createReservation and onReserve on form submit', async () => {
  const createReservation = ReservationService.createReservation;
  createReservation.mockResolvedValueOnce({ success: true });

  render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);

  fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'user1' } });
  fireEvent.change(screen.getByLabelText(/Check In/i), { target: { value: '2025-09-01' } });
  fireEvent.change(screen.getByLabelText(/Check Out/i), { target: { value: '2025-09-05' } });
  fireEvent.change(screen.getByLabelText(/Number of Guests/i), { target: { value: '2' } });

  fireEvent.click(screen.getByRole('button', { name: /reserve/i }));

  await waitFor(() => {
    expect(createReservation).toHaveBeenCalledWith({
      userId: 'user1',
      roomId: 'room123',
      checkInDate: '2025-09-01',
      checkOutDate: '2025-09-05',
      numberOfGuests: 2,
    });

    expect(mockOnReserve).toHaveBeenCalled();
  });
});

test('logs error when createReservation fails', async () => {
  const createReservation = ReservationService.createReservation;
  const error = new Error('Server error');
  createReservation.mockRejectedValueOnce(error);

  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(<ReservationForm roomId="room123" onReserve={mockOnReserve} />);

  fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'user1' } });
  fireEvent.change(screen.getByLabelText(/Check In/i), { target: { value: '2025-09-01' } });
  fireEvent.change(screen.getByLabelText(/Check Out/i), { target: { value: '2025-09-05' } });
  fireEvent.change(screen.getByLabelText(/Number of Guests/i), { target: { value: '2' } });

  fireEvent.click(screen.getByRole('button', { name: /reserve/i }));

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith('Error creating reservation:', error);
  });

  consoleSpy.mockRestore();
});

});
