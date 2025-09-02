import { render, screen } from "@testing-library/react";
import { vi, describe, expect , beforeEach, it} from "vitest";
import Opinion from "../Opinion";
import { useAuth0 } from "@auth0/auth0-react";

// Mock de useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

describe("Opinion component", () => {
  const defaultReviews = [
    "Juan Atkinson.",
    "María Sanchez.",
  ];

  beforeEach(() => {
    useAuth0.mockReturnValue({ isAuthenticated: false, user: null });
  });

  it("1. Renderiza correctamente el título principal", () => {
    render(<Opinion />);
    expect(screen.getByText("Opiniones de Nuestros Clientes")).toBeInTheDocument();
  });

  it("2. Renderiza correctamente el párrafo introductorio", () => {
    render(<Opinion />);
    expect(
      screen.getByText(/En Aremar, valoramos la opinión de nuestros huéspedes/i)
    ).toBeInTheDocument();
  });

  it("3. Renderiza el subtítulo 'Reseñas Recientes'", () => {
    render(<Opinion />);
    expect(screen.getByText("Reseñas Recientes")).toBeInTheDocument();
  });

  it("4. Muestra las reseñas por defecto cuando el usuario no está autenticado", () => {
    render(<Opinion />);
    defaultReviews.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("5. Genera imágenes de avatar para cada reseña", () => {
    render(<Opinion />);
    defaultReviews.forEach((name) => {
      const img = screen.getByAltText(name);
      expect(img).toBeInTheDocument();
      // Solución para acentos en URL
      expect(decodeURIComponent(img.src)).toContain(name.replaceAll(" ", ""));
    });
  });

  it("6. Agrega la reseña del usuario si está autenticado", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Carlos Lopez", picture: "avatar.jpg" },
    });
    render(<Opinion />);
    expect(screen.getByText("Carlos Lopez")).toBeInTheDocument();
    expect(screen.getByText("¡Me encantó mi experiencia en Aremar! Todo impecable.")).toBeInTheDocument();
  });

  it("7. Muestra correctamente todas las reseñas, incluyendo la del usuario autenticado", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Carlos Lopez", picture: "avatar.jpg" },
    });
    render(<Opinion />);
    const allNames = ["Carlos Lopez", ...defaultReviews];
    allNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
