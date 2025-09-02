import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import PaymentOptions from '../PaymentOptions';

// Mock de los subcomponentes
vi.mock('../DepositPayReservation', () => ({
  default: (props) => (
    <div data-testid="deposit-pay">DepositPayReservation {props.reservation.id}</div>
  ),
}));
vi.mock('../TotalPayReservation', () => ({
  default: (props) => (
    <div data-testid="total-pay">TotalPayReservation {props.reservation.id}</div>
  ),
}));
vi.mock('../RemainingPayReservation', () => ({
  default: (props) => (
    <div data-testid="remaining-pay">RemainingPayReservation {props.reservation.id}</div>
  ),
}));

describe('PaymentOptions component', () => {
  it('renders deposit and total options when status is pending', () => {
    const reservation = {
      id: 'res1',
      totalPrice: 500,
      amountPaid: 0,
      status: 'pending',
    };

    render(<PaymentOptions reservation={reservation} />);

    expect(screen.getByText(/Opciones de Pago/i)).toBeInTheDocument();
    expect(screen.getByTestId('deposit-pay')).toHaveTextContent('DepositPayReservation res1');
    expect(screen.getByTestId('total-pay')).toHaveTextContent('TotalPayReservation res1');
    expect(screen.queryByTestId('remaining-pay')).not.toBeInTheDocument();
  });

  it('renders remaining option when status is confirmed and there is balance left', () => {
    const reservation = {
      id: 'res2',
      totalPrice: 500,
      amountPaid: 200,
      status: 'confirmed',
    };

    render(<PaymentOptions reservation={reservation} />);

    expect(screen.getByText(/Opciones de Pago/i)).toBeInTheDocument();
    expect(screen.getByTestId('remaining-pay')).toHaveTextContent('RemainingPayReservation res2');
    expect(screen.queryByTestId('deposit-pay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('total-pay')).not.toBeInTheDocument();
  });

  it('renders nothing extra when confirmed and fully paid', () => {
    const reservation = {
      id: 'res3',
      totalPrice: 500,
      amountPaid: 500,
      status: 'confirmed',
    };

    render(<PaymentOptions reservation={reservation} />);

    expect(screen.getByText(/Opciones de Pago/i)).toBeInTheDocument();
    expect(screen.queryByTestId('remaining-pay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deposit-pay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('total-pay')).not.toBeInTheDocument();
  });

  it('always renders the title "Opciones de Pago"', () => {
    const reservation = {
      id: 'res4',
      totalPrice: 300,
      amountPaid: 0,
      status: 'pending',
    };

    render(<PaymentOptions reservation={reservation} />);
    expect(screen.getByRole('heading', { name: /Opciones de Pago/i })).toBeInTheDocument();
  });

  it('passes the correct reservation object to DepositPayReservation', () => {
    const reservation = {
      id: 'res5',
      totalPrice: 700,
      amountPaid: 0,
      status: 'pending',
    };

    render(<PaymentOptions reservation={reservation} />);
    expect(screen.getByTestId('deposit-pay')).toHaveTextContent('DepositPayReservation res5');
  });

  it('matches snapshot for a confirmed reservation with remaining balance', () => {
    const reservation = {
      id: 'res6',
      totalPrice: 1000,
      amountPaid: 400,
      status: 'confirmed',
    };

    const { container } = render(<PaymentOptions reservation={reservation} />);
    expect(container).toMatchSnapshot();
  });
});
