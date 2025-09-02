// src/components/atoms/__tests__/ConfirmedPay.test.jsx
import { expect, describe, beforeEach, it, vi  } from 'vitest'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ConfirmedPay from '../ConfirmedPay'
import { useAuth0 } from '@auth0/auth0-react'
import { MemoryRouter, useNavigate } from 'react-router-dom'

// Mock de Auth0
vi.mock('@auth0/auth0-react')

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ConfirmedPay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra mensaje de carga inicialmente', () => {
    useAuth0.mockReturnValue({ getAccessTokenSilently: vi.fn() })
    render(
      <MemoryRouter>
        <ConfirmedPay reservationId="123" />
      </MemoryRouter>
    )
    expect(screen.getByText(/Verificando el estado del pago/i)).toBeInTheDocument()
  })

  it('muestra error si no hay reservationId', async () => {
    useAuth0.mockReturnValue({ getAccessTokenSilently: vi.fn() })
    render(
      <MemoryRouter>
        <ConfirmedPay reservationId={null} />
      </MemoryRouter>
    )
    expect(await screen.findByText(/No se proporcionó un ID de reserva válido/i)).toBeInTheDocument()
  })

  it('muestra mensaje de reserva confirmada y permite navegar al home', async () => {
    useAuth0.mockReturnValue({ getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token') })
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'confirmed' }),
      })
    )

    render(
      <MemoryRouter>
        <ConfirmedPay reservationId="123" />
      </MemoryRouter>
    )

    const button = await screen.findByRole('button', { name: /Volver al inicio/i })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('muestra mensaje si el pago fue rechazado', async () => {
    useAuth0.mockReturnValue({ getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token') })
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'rejected' }),
      })
    )

    render(
      <MemoryRouter>
        <ConfirmedPay reservationId="123" />
      </MemoryRouter>
    )

    expect(await screen.findByText(/El pago ha sido rechazado o cancelado/i)).toBeInTheDocument()
  })

  it('muestra error si fetch falla', async () => {
    useAuth0.mockReturnValue({ getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token') })
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error de prueba' }),
      })
    )

    render(
      <MemoryRouter>
        <ConfirmedPay reservationId="123" />
      </MemoryRouter>
    )

    expect(await screen.findByText(/Error al verificar el estado del pago/i)).toBeInTheDocument()
  })
})
