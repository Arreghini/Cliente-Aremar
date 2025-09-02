import { vi, describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import DepositPayReservation from '../DepositPayReservation'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

// Mock de axios
vi.mock('axios')
const mockedAxios = axios

// Mock de useAuth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}))

// Mock de PayButton para testear props
vi.mock('../PayButton', () => ({
  __esModule: true,
  default: (props) => <div data-testid="pay-button" {...props} />,
}))

describe('DepositPayReservation', () => {
  const reservation = { id: 'res123' }
  const mockGetAccessTokenSilently = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuth0.mockReturnValue({ getAccessTokenSilently: mockGetAccessTokenSilently })
  })

  it('muestra "Cargando..." inicialmente', () => {
    render(<DepositPayReservation reservation={reservation} />)
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('obtiene el precio y renderiza PayButton', async () => {
    mockGetAccessTokenSilently.mockResolvedValue('mocked-token')
    mockedAxios.post.mockResolvedValueOnce({
      data: { price: 500, title: 'Seña de reserva' },
    })

    render(<DepositPayReservation reservation={reservation} />)

    // Esperar a que se muestre el precio
    await waitFor(() => {
      expect(screen.getByText(/\$500/i)).toBeInTheDocument()
    })

    // Verificar que el PayButton mockeado está presente
    const payButton = screen.getByTestId('pay-button')
    expect(payButton).toBeInTheDocument()
    expect(payButton).toHaveAttribute('reservationId', reservation.id)
    expect(payButton).toHaveAttribute('price', '500')
    expect(payButton).toHaveAttribute('title', 'Seña de reserva')
    expect(payButton).toHaveAttribute('paymentType', 'deposit')
  })

  it('no renderiza nada si el precio es 0', async () => {
    mockGetAccessTokenSilently.mockResolvedValue('mocked-token')
    mockedAxios.post.mockResolvedValueOnce({
      data: { price: 0, title: 'Seña de reserva' },
    })

    const { container } = render(<DepositPayReservation reservation={reservation} />)

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })
  })

  it('maneja errores al obtener precio', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetAccessTokenSilently.mockResolvedValue('mocked-token')
    mockedAxios.post.mockRejectedValueOnce(new Error('Error en axios'))

    render(<DepositPayReservation reservation={reservation} />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error al obtener el precio de la seña:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })
})
