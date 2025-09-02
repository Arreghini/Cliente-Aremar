// src/components/__tests__/AuthButton.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthButton from '../AuthButton'

describe('AuthButton', () => {
  it('muestra "Login" cuando no está autenticado', () => {
    render(<AuthButton isAuthenticated={false} onLogin={() => {}} onLogout={() => {}} />)
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })

  it('muestra "Salir" cuando está autenticado', () => {
    render(<AuthButton isAuthenticated={true} onLogin={() => {}} onLogout={() => {}} />)
    expect(screen.getByText(/Salir/i)).toBeInTheDocument()
  })

  it('ejecuta onLogin cuando se hace click en Login', () => {
    const onLogin = vi.fn()
    render(<AuthButton isAuthenticated={false} onLogin={onLogin} onLogout={() => {}} />)

    fireEvent.click(screen.getByText(/Login/i))
    expect(onLogin).toHaveBeenCalledTimes(1)
  })

  it('ejecuta onLogout cuando se hace click en Salir', () => {
    const onLogout = vi.fn()
    render(<AuthButton isAuthenticated={true} onLogin={() => {}} onLogout={onLogout} />)

    fireEvent.click(screen.getByText(/Salir/i))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
