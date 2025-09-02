import { render, screen } from "@testing-library/react";
import HowToArrive from "../HowToArrive";
import { describe, it, expect } from "vitest";

describe("HowToArrive component", () => {
  it("1. Renderiza el título principal", () => {
    render(<HowToArrive />);
    const heading = screen.getByRole("heading", { name: /cómo llegar/i });
    expect(heading).toBeInTheDocument();
  });

  it("2. Renderiza el párrafo descriptivo", () => {
    render(<HowToArrive />);
    const paragraph = screen.getByText(
      /nuestra ubicación exacta está marcada en el mapa/i
    );
    expect(paragraph).toBeInTheDocument();
  });

  it("3. Contiene un iframe para el mapa", () => {
    render(<HowToArrive />);
    const iframe = screen.getByTitle(/google maps/i);
    expect(iframe).toBeInTheDocument();
  });

  it("4. El iframe tiene la URL correcta de Google Maps", () => {
    render(<HowToArrive />);
    const iframe = screen.getByTitle(/google maps/i);
    expect(iframe).toHaveAttribute("src");
    expect(iframe.src).toContain("https://www.google.com/maps/embed");
  });

  it("5. Aplica clases de estilo principales al contenedor", () => {
    render(<HowToArrive />);
    const container = screen.getByText(/nuestra ubicación exacta/i).closest("div");
    expect(container).toHaveClass("px-6", "py-10", "max-w-4xl");
  });

  it("6. El título tiene clases personalizadas de color y tamaño", () => {
    render(<HowToArrive />);
    const heading = screen.getByRole("heading", { name: /cómo llegar/i });
    expect(heading).toHaveClass(
      "text-3xl",
      "font-bold",
      "text-mar-profundo",
      "dark:text-mar-espuma"
    );
  });
});
