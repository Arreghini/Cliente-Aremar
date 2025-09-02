import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TotalPayReservation from '../TotalPayReservation';

// Mock del componente PayButton
vi.mock('../PayButton', () => ({
  default: (props) => (
    <div data-testid="pay-button">
      PayButton {props.reservationId} - ${props.price} - {props.paymentType} - {props.containerId}
    </div>
  ),
}));

describe('TotalPayReservation component', () => {
  const reservation = { id: 'res1', totalPrice: 500 };
  const reservationZero = { id: 'res2', totalPrice: 0 };

  it('renders without crashing', () => {
    render(<TotalPayReservation reservation={reservation} />);
    expect(screen.getByText(/Pagá el total de tu reserva ahora/i)).toBeInTheDocument();
  });

  it('shows the correct total price', () => {
    render(<TotalPayReservation reservation={reservation} />);
    const priceSpan = screen.getByTestId('reservation-price');
    expect(priceSpan).toHaveTextContent('$500');
  });

  it('renders PayButton with correct props', () => {
    render(<TotalPayReservation reservation={reservation} />);
    const payButton = screen.getByTestId('pay-button');
    expect(payButton).toHaveTextContent('PayButton res1 - $500 - total - total-pay-res1');
  });

  it('renders PayButton with price 0 correctly', () => {
    render(<TotalPayReservation reservation={reservationZero} />);
    const payButton = screen.getByTestId('pay-button');
    expect(payButton).toHaveTextContent('PayButton res2 - $0 - total - total-pay-res2');
  });

  it('displays the price in red', () => {
    render(<TotalPayReservation reservation={reservation} />);
    const priceSpan = screen.getByTestId('reservation-price');
    expect(priceSpan).toHaveClass('text-red-600');
  });

  it('renders container with border and shadow', () => {
    render(<TotalPayReservation reservation={reservation} />);
    const container = screen.getByTestId('total-pay-container');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('rounded-md');
    expect(container).toHaveClass('shadow');
  });
});
