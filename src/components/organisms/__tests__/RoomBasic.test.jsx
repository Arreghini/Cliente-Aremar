import { render, screen, fireEvent } from '@testing-library/react';
import RoomBasic from '../RoomBasic';

// Mock de react-slick (evitamos animaciones y lógica interna de slick)
vi.mock('react-slick', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="mock-slider">{children}</div>,
  };
});

// Mock de imágenes (vite las transforma en strings)
vi.mock('../../assets/images/deptoVistaMar.webp', () => 'deptoVistaMar1.jpg');
vi.mock('../../assets/images/depto3Ventanas.jpeg', () => 'depto3Ventanas.jpg');
vi.mock(
  '../../assets/images/deptoContrafrenteMatrimonial.webp',
  () => 'deptoContrafrenteMatrimonial.jpg'
);
vi.mock('../../assets/images/deptoVistaMar2.jpg', () => 'deptoVistaMar2.jpg');
vi.mock('../../assets/images/deptoVistaMar3.jpeg', () => 'deptoVistaMar3.jpg');

describe('RoomBasic component', () => {
  test('1. Renderiza el slider', () => {
    render(<RoomBasic />);
    expect(screen.getByTestId('mock-slider')).toBeInTheDocument();
  });

  test('2. Renderiza todas las imágenes con sus alt', () => {
    render(<RoomBasic />);
    expect(
      screen.getByAltText('Deptos. Vista mar singles')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Deptos. 3 Ventanas')).toBeInTheDocument();
    expect(
      screen.getByAltText('Deptos. Contrafrente matrimonial')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Deptos. Vista mar dobles')).toBeInTheDocument();
    expect(screen.getByAltText('Deptos. Vista mar triples')).toBeInTheDocument();
  });

  test('3. Muestra los textos debajo de cada imagen', () => {
    render(<RoomBasic />);
    expect(screen.getByText('Deptos. Vista mar singles')).toBeInTheDocument();
    expect(screen.getByText('Deptos. 3 Ventanas')).toBeInTheDocument();
  });

  test('4. Al hacer click en una imagen se abre el modal con la imagen ampliada', () => {
  render(<RoomBasic />);
  const img = screen.getByAltText('Deptos. Vista mar singles');
  fireEvent.click(img);

  // Verifico que el modal está en pantalla buscando el botón de cerrar
  expect(
    screen.getByRole('button', { name: /cerrar imagen ampliada/i })
  ).toBeInTheDocument();
});

  test('5. Se puede cerrar el modal con el botón ×', () => {
    render(<RoomBasic />);
    fireEvent.click(screen.getByAltText('Deptos. Vista mar singles'));

    const closeBtn = screen.getByRole('button', { name: /cerrar imagen ampliada/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('button', { name: /cerrar imagen ampliada/i })).not.toBeInTheDocument();
  });

test('6. Se puede cerrar el modal haciendo click en el fondo oscuro', () => {
  render(<RoomBasic />);
  fireEvent.click(screen.getByAltText('Deptos. Vista mar singles'));

  const overlay = screen.getByTestId('modal');
  fireEvent.click(overlay);

  expect(
    screen.queryByRole('button', { name: /cerrar imagen ampliada/i })
  ).not.toBeInTheDocument();
});
});
