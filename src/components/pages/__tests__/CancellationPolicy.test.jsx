import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CancellationPolicy from "../CancellationPolicy";

describe("CancelationPolicy component", () => {
  it("renderiza el título principal", () => {
    render(<CancellationPolicy />);
    expect(
      screen.getByRole("heading", { name: /Política de Cancelaciónes/i })
    ).toBeInTheDocument();
  });

  it("muestra el párrafo introductorio", () => {
    render(<CancellationPolicy />);
    expect(
      screen.getByText(/En Aremar, entendemos que pueden surgir imprevistos/i)
    ).toBeInTheDocument();
  });

  it("contiene la sección de Condiciones Generales con 3 reglas", () => {
    render(<CancellationPolicy />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(
      screen.getByText(/Reembolso total del monto pagado/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Reembolso del 50% del valor total/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No se realizará reembolso/i)
    ).toBeInTheDocument();
  });

  it("incluye sección de Cancelación por parte del establecimiento", () => {
    render(<CancellationPolicy />);
    expect(
      screen.getByRole("heading", {
        name: /Cancelación por parte del establecimiento/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Aremar se reserva el derecho de cancelar una reserva/i)
    ).toBeInTheDocument();
  });

  it("tiene un link de contacto con mailto correcto", () => {
    render(<CancellationPolicy />);
    const link = screen.getAllByRole("link", {
      name: /reservas@aremar\.com/i,
    })[0]; // hay dos, agarramos el primero
    expect(link).toHaveAttribute("href", "mailto:reservas@aremar.com");
  });

  it("incluye la sección Política de No-Show", () => {
    render(<CancellationPolicy />);
    expect(
      screen.getByRole("heading", { name: /Política de No-Show/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/cancelación sin reembolso/i)
    ).toBeInTheDocument();
  });

  it("incluye la sección de Contacto al final", () => {
    render(<CancellationPolicy />);
    expect(
      screen.getByRole("heading", { name: /Contacto/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Si tiene alguna pregunta sobre nuestra política/i)
    ).toBeInTheDocument();
  });
});
