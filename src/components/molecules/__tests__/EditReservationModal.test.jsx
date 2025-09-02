import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditReservationModal from '../EditReservationModal';

describe('EditReservationModal component', () => {
  const reservation = {
    id: 'res1',
    roomId: '101',
    checkInDate: '2025-09-01',
    checkOutDate: '2025-09-05',
    status: 'pending',
    numberOfGuests: 2,
    totalPrice: 500,
  };

  const onClose = vi.fn();
  const onSave = vi.fn((e) => e.preventDefault());
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(<EditReservationModal isOpen reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    expect(screen.getByText(/Editar Reserva #res1/i)).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    render(<EditReservationModal isOpen={false} reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    expect(screen.queryByText(/Editar Reserva #res1/i)).not.toBeInTheDocument();
  });

  it('calls onClose when clicking outside the modal', () => {
    render(<EditReservationModal isOpen reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when input values change', () => {
    render(<EditReservationModal isOpen reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    const checkInInput = screen.getByLabelText(/Check-in/i);
    fireEvent.change(checkInInput, { target: { value: '2025-09-02' } });
    expect(onChange).toHaveBeenCalledWith({ checkInDate: '2025-09-02' });
  });

  it('calls onSave when submitting the form', () => {
    render(<EditReservationModal isOpen reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    const form = screen.getByRole('form', { name: /edit-reservation-form/i });
    fireEvent.submit(form);
    expect(onSave).toHaveBeenCalled();
  });

  it('renders all inputs and select with correct initial values', () => {
    render(<EditReservationModal isOpen reservation={reservation} onClose={onClose} onSave={onSave} onChange={onChange} />);
    expect(screen.getByLabelText(/Habitación/i)).toHaveValue('101');
    expect(screen.getByLabelText(/Check-in/i)).toHaveValue('2025-09-01');
    expect(screen.getByLabelText(/Check-out/i)).toHaveValue('2025-09-05');
    expect(screen.getByLabelText(/Estado/i)).toHaveValue('pending');
    expect(screen.getByLabelText(/Cantidad de huéspedes/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Precio total/i)).toHaveValue('500');
  });
});
