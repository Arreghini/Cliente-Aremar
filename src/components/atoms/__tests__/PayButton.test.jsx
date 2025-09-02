import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import PayButton from '../PayButton';
import { vi } from 'vitest';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ preferenceId: 'fake-preference-id' }),
  })
);

// Mock MercadoPago con spy compartido
let mpCreateSpy;

beforeAll(() => {
  mpCreateSpy = vi.fn().mockResolvedValue('mocked-brick');
  const bricksMock = vi.fn(() => ({ create: mpCreateSpy }));
  window.MercadoPago = vi.fn(() => ({ bricks: bricksMock }));
  window.__mpCreateSpy = mpCreateSpy; // Exportamos el spy para testearlo
});

describe('PayButton component', () => {
  const item = { reservationId: '1', containerId: 'pay1', price: 100, paymentType: 'card' };

  it('renders PayButton component', async () => {
    render(
      <PayButton
        reservationId={item.reservationId}
        price={item.price}
        containerId={item.containerId}
        paymentType={item.paymentType}
      />
    );

    const container = await screen.findByTestId(item.containerId);
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Cargando botón de pago...');
  });

  it('creates payment preference with correct headers', async () => {
    render(
      <PayButton
        reservationId={item.reservationId}
        price={item.price}
        containerId={item.containerId}
        paymentType={item.paymentType}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/reservations/${item.reservationId}/payment`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          }),
          body: JSON.stringify({ reservationId: item.reservationId, paymentType: item.paymentType }),
        })
      );
    });
  });

  it('initializes MercadoPago after receiving preferenceId', async () => {
    render(
      <PayButton
        reservationId={item.reservationId}
        price={item.price}
        containerId={item.containerId}
        paymentType={item.paymentType}
      />
    );

    await waitFor(() => {
      expect(window.MercadoPago).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it('handles multiple PayButton components', async () => {
  const items = [
    { reservationId: '1', containerId: 'pay1', price: 100, paymentType: 'card' },
    { reservationId: '2', containerId: 'pay2', price: 200, paymentType: 'card' },
    { reservationId: '3', containerId: 'pay3', price: 300, paymentType: 'card' },
  ];

  render(
    <div>
      {items.map((item) => (
        <PayButton
          key={item.reservationId}
          reservationId={item.reservationId}
          price={item.price}
          containerId={item.containerId}
          paymentType={item.paymentType}
        />
      ))}
    </div>
  );

  for (const item of items) {
    const container = await screen.findByTestId(item.containerId);
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Cargando botón de pago...');
  }

  // 🚨 React 18 StrictMode ejecuta los efectos dos veces
  expect(window.MercadoPago.mock.calls.length).toBeGreaterThanOrEqual(items.length);
  expect(window.MercadoPago.mock.calls.length).toBeLessThanOrEqual(items.length * 2);

  expect(window.__mpCreateSpy.mock.calls.length).toBeGreaterThanOrEqual(items.length);
  expect(window.__mpCreateSpy.mock.calls.length).toBeLessThanOrEqual(items.length * 2);
});

  it('handles backend without preferenceId gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PayButton
        reservationId="999"
        price={50}
        containerId="pay999"
        paymentType="card"
      />
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'No se recibió un preferenceId en la respuesta del backend.'
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
