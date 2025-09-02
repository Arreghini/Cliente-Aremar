// src/components/atoms/__tests__/EditButton.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EditButton from '../EditButton'

// 🟦 Grupo de tests
describe('EditButton', () => {
  it('renderiza el botón con el icono y atributos correctos', () => {
    const mockFn = vi.fn()
    render(<EditButton onEdit={mockFn} reservationId="P3D2" />)

    const button = screen.getByRole('button', { name: /editar reserva/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('title', 'Editar reserva')
    expect(button).toHaveClass('p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors')

    // El icono Pencil debería estar en el DOM
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('ejecuta la función onEdit con el reservationId (string) al hacer clic', () => {
    const mockFn = vi.fn()
    render(<EditButton onEdit={mockFn} reservationId="P3D2" />)

    const button = screen.getByRole('button', { name: /editar reserva/i })
    fireEvent.click(button)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('P3D2')
  })

  it('ejecuta la función onEdit con el reservationId (number) al hacer clic', () => {
    const mockFn = vi.fn()
    render(<EditButton onEdit={mockFn} reservationId={123} />)

    const button = screen.getByRole('button', { name: /editar reserva/i })
    fireEvent.click(button)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(123)
  })

  it('no dispara un submit si está dentro de un formulario', () => {
    const mockFn = vi.fn()
    const handleSubmit = vi.fn((e) => e.preventDefault())

    render(
      <form onSubmit={handleSubmit}>
        <EditButton onEdit={mockFn} reservationId="TEST123" />
      </form>
    )

    const button = screen.getByRole('button', { name: /editar reserva/i })
    fireEvent.click(button)

    expect(mockFn).toHaveBeenCalledWith('TEST123')
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('coincide con el snapshot', () => {
    const { container } = render(<EditButton onEdit={() => {}} reservationId="SNAPSHOT" />)
    expect(container).toMatchSnapshot()
  })
})
