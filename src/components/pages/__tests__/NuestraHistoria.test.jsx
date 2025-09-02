import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "../Landing";

describe("Landing component", () => {

  it("1. Renderiza correctamente el título por defecto", () => {
    render(<Landing />);
    expect(screen.getByText(/Las Toninas/i)).toBeInTheDocument();
  });

  it("2. Renderiza correctamente el subtítulo por defecto", () => {
    render(<Landing />);
    expect(screen.getByText(/Una puerta a la naturaleza/i)).toBeInTheDocument();
  });

  it("3. Renderiza la imagen de amanecer con alt correcto", () => {
    render(<Landing />);
    const img = screen.getByAltText(/Atardecer en la playa/i);
    expect(img).toBeInTheDocument();
  });

  it("4. Renderiza el logo y el edificio", () => {
    render(<Landing />);
    expect(screen.getByAltText(/Logo/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Edificio Toninas/i)).toBeInTheDocument();
  });

  it("5. Permite cerrar el modal al hacer click en el botón de cerrar", () => {
    render(<Landing />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(screen.queryByText(/Las Toninas/i)).not.toBeInTheDocument();
  });

  it("6. Redirige al hacer click en el contenedor principal", () => {
    const assignMock = vi.fn();
    const originalLocation = window.location;
    delete window.location;
    window.location = { assign: assignMock };

    render(<Landing />);
    const redirectContainer = screen.getByTestId("redirect-container");
    fireEvent.click(redirectContainer);

    expect(assignMock).toHaveBeenCalledWith("http://localhost:5173/home");

    // Restaurar window.location original
    window.location = originalLocation;
  });

  it("7. No redirige si se cierra el modal primero", () => {
    const assignMock = vi.fn();
    const originalLocation = window.location;
    delete window.location;
    window.location = { assign: assignMock };

    render(<Landing />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    const redirectContainer = screen.queryByTestId("redirect-container");
    expect(redirectContainer).toBeNull();
    expect(assignMock).not.toHaveBeenCalled();

    window.location = originalLocation;
  });

  it("8. Renderiza la animación del pez con alt correcto", () => {
    render(<Landing />);
    const fish = screen.getByAltText(/Pescado animado/i);
    expect(fish).toBeInTheDocument();
  });

});
