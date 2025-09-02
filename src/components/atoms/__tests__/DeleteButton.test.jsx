import { vi, describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DeleteButton from '../DeleteButton'

describe('DeleteButton', () => {
  const mockOnDelete = vi.fn()
  const reservationId = '123ABC'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el botón con el ícono y el title correcto', () => {
    render(<DeleteButton onDelete={mockOnDelete} reservationId={reservationId} />)
    
    const button = screen.getByRole('button', { name: /Eliminar reserva/i })
    expect(button).toBeInTheDocument()
    
    // Verificar el title
    expect(button).toHaveAttribute('title', 'Eliminar reserva')
    
    // Verificar clases CSS
    expect(button).toHaveClass(
      'p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors'
    )

    // Verificar que el ícono SVG está presente
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('llama a onDelete con reservationId al hacer click', () => {
    render(<DeleteButton onDelete={mockOnDelete} reservationId={reservationId} />)
    
    const button = screen.getByRole('button', { name: /Eliminar reserva/i })
    fireEvent.click(button)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
    expect(mockOnDelete).toHaveBeenCalledWith(reservationId)
  })

  it('llama a onDelete múltiples veces si se hace click varias veces', () => {
    render(<DeleteButton onDelete={mockOnDelete} reservationId={reservationId} />)
    
    const button = screen.getByRole('button', { name: /Eliminar reserva/i })
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockOnDelete).toHaveBeenCalledTimes(3)
    expect(mockOnDelete).toHaveBeenCalledWith(reservationId)
  })

  it('coincide con el snapshot', () => {
    const { asFragment } = render(
      <DeleteButton onDelete={mockOnDelete} reservationId={reservationId} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
