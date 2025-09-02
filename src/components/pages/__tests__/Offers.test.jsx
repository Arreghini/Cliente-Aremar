import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import OffersPage from "../Offers";

describe("OffersPage component", () => {
  it("1. Renderiza correctamente el título y descripción principal", () => {
    render(<OffersPage />);
    expect(screen.getByText("Ofertas Especiales")).toBeInTheDocument();
    expect(
      screen.getByText(/Descubrí promociones exclusivas/i)
    ).toBeInTheDocument();
  });

 it("2. Renderiza todos los botones de categoría", () => {
    render(<OffersPage />);
    
    // Seleccionamos el contenedor de los botones de categoría
    const buttonContainer = screen.getByRole("button", { name: /Todas/i }).parentElement;

    // Verificamos cada botón dentro de ese contenedor
    const categories = ["Todas", "Semana tranquila", "Fin de semana largo", "Voucher / +6 días", "HomeOffice"];
    categories.forEach((label) => {
      expect(within(buttonContainer).getByText(label)).toBeInTheDocument();
    });
  });

  it("3. Renderiza todas las ofertas por defecto", () => {
    render(<OffersPage />);
    const offers = [
      "Semana de baja demanda",
      "Fin de semana largo",
      "Voucher por larga estadía",
      "Mes de HomeOffice con vista al mar"
    ];
    offers.forEach((title) => {
      expect(screen.getByAltText(title)).toBeInTheDocument();
    });
  });

  it("4. Filtra correctamente las ofertas al seleccionar 'Semana tranquila'", () => {
    render(<OffersPage />);
    fireEvent.click(screen.getByText("Semana tranquila"));

    // Solo debe aparecer "Semana de baja demanda"
    expect(screen.getByAltText("Semana de baja demanda")).toBeInTheDocument();
    expect(screen.queryByAltText("Fin de semana largo")).toBeNull();
    expect(screen.queryByAltText("Voucher por larga estadía")).toBeNull();
    expect(screen.queryByAltText("Mes de HomeOffice con vista al mar")).toBeNull();
  });

  it("5. Filtra correctamente las ofertas al seleccionar 'Voucher / +6 días'", () => {
    render(<OffersPage />);
    fireEvent.click(screen.getByText("Voucher / +6 días"));

    expect(screen.getByAltText("Voucher por larga estadía")).toBeInTheDocument();
    expect(screen.queryByAltText("Semana de baja demanda")).toBeNull();
    expect(screen.queryByAltText("Fin de semana largo")).toBeNull();
    expect(screen.queryByAltText("Mes de HomeOffice con vista al mar")).toBeNull();
  });

  it("6. Muestra la imagen correspondiente a cada oferta filtrada sin fallar por encoding", () => {
    render(<OffersPage />);
    fireEvent.click(screen.getByText("Voucher / +6 días"));
    const img = screen.getByAltText("Voucher por larga estadía");
    expect(img).toBeInTheDocument();
    expect(img.src).toMatch(/voucher-6d/); // Evita problema con %C3%AD
  });

  it("7. Cambia correctamente de categoría al hacer click en varios botones", () => {
    render(<OffersPage />);
    // Semana tranquila
    fireEvent.click(screen.getByText("Semana tranquila"));
    expect(screen.getByAltText("Semana de baja demanda")).toBeInTheDocument();

    // Fin de semana largo
    fireEvent.click(screen.getByText("Fin de semana largo"));
    expect(screen.getByAltText("Fin de semana largo")).toBeInTheDocument();
    expect(screen.queryByAltText("Semana de baja demanda")).toBeNull();
  });
});
