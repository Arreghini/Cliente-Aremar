import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '../ContactPage';

describe('Contacto component', () => {
  it('renderiza el título principal', () => {
    render(<Contacto />);
    expect(screen.getByRole('heading', { name: /contacto/i })).toBeInTheDocument();
  });

  it('muestra el párrafo introductorio', () => {
    render(<Contacto />);
    expect(
      screen.getByText(/Si tenés dudas, consultas o querés hacer una reserva directa/i)
    ).toBeInTheDocument();
  });

  it('renderiza los campos del formulario', () => {
    render(<Contacto />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
  });

  it('permite escribir en los campos del formulario', () => {
    render(<Contacto />);
    const nombreInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const mensajeInput = screen.getByLabelText(/mensaje/i);

    fireEvent.change(nombreInput, { target: { value: 'Mauricio' } });
    fireEvent.change(emailInput, { target: { value: 'mauricio@test.com' } });
    fireEvent.change(mensajeInput, { target: { value: 'Hola' } });

    expect(nombreInput.value).toBe('Mauricio');
    expect(emailInput.value).toBe('mauricio@test.com');
    expect(mensajeInput.value).toBe('Hola');
  });

  it('simula el envío del formulario', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<Contacto />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Mauricio' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mauricio@test.com' } });
    fireEvent.change(screen.getByLabelText(/mensaje/i), { target: { value: 'Hola' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Mensaje enviado:',
      expect.objectContaining({
        nombre: 'Mauricio',
        email: 'mauricio@test.com',
        mensaje: 'Hola',
      })
    );

    consoleSpy.mockRestore();
  });

  it('muestra la información de contacto (teléfono, email y dirección)', () => {
    render(<Contacto />);
    expect(screen.getByText(/\+54 9 2255 12-3456/)).toBeInTheDocument();
    expect(screen.getByText(/info@aremar.com/)).toBeInTheDocument();
    expect(screen.getByText(/Calle 42 y 1, Las Toninas/)).toBeInTheDocument();
  });
});
