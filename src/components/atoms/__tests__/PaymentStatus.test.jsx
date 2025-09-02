import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PaymentStatus from '../PaymentStatus';

// Helper para renderizar con router y query params
const renderWithQuery = (query) => {
  return render(
    <MemoryRouter initialEntries={[`/payment-status${query}`]}>
      <Routes>
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PaymentStatus component', () => {
  it('muestra mensaje de error cuando faltan parámetros', () => {
    renderWithQuery('');
    expect(screen.getByText(/Parámetros inválidos/i)).toBeInTheDocument();
  });

  it('muestra "Reserva Confirmada" cuando status es approved', () => {
    renderWithQuery('?status=approved&reservationId=123');
    expect(screen.getByText(/Reserva Confirmada/i)).toBeInTheDocument();
  });

  it('muestra "El pago ha fallado" cuando status es failure', () => {
    renderWithQuery('?status=failure&reservationId=456');
    expect(screen.getByText(/El pago ha fallado/i)).toBeInTheDocument();
  });

  it('muestra "El pago está pendiente" cuando status es pending', () => {
    renderWithQuery('?status=pending&reservationId=789');
    expect(screen.getByText(/El pago está pendiente/i)).toBeInTheDocument();
  });

  it('muestra error si falta status aunque haya reservationId', () => {
    renderWithQuery('?reservationId=111');
    expect(screen.getByText(/Parámetros inválidos/i)).toBeInTheDocument();
  });

  it('muestra error si falta reservationId aunque haya status', () => {
    renderWithQuery('?status=approved');
    expect(screen.getByText(/Parámetros inválidos/i)).toBeInTheDocument();
  });

  it('aplica clases de estilo correctas para cada estado', () => {
    renderWithQuery('?status=approved&reservationId=222');
    expect(screen.getByText(/Reserva Confirmada/i)).toHaveClass('text-green-700');

    renderWithQuery('?status=failure&reservationId=333');
    expect(screen.getByText(/El pago ha fallado/i)).toHaveClass('text-red-500');

    renderWithQuery('?status=pending&reservationId=444');
    expect(screen.getByText(/El pago está pendiente/i)).toHaveClass('text-yellow-500');
  });
});
