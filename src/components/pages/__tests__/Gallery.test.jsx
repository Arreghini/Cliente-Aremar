import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Gallery from '../Gallery';

// Mock de DolphinAnimation
vi.mock('../../atoms/DolphinAnimation', () => ({
  default: (props) => <div data-testid="dolphin" {...props} />,
}));

describe('Gallery component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza sin errores', () => {
    const { container } = render(<Gallery />);
    expect(container).toBeInTheDocument();
  });

  it('no muestra el delfín inmediatamente antes del primer timeout', () => {
    render(<Gallery />);
    expect(screen.queryByTestId('dolphin')).not.toBeInTheDocument();
  });

  it('muestra el delfín después de iniciar playDolphin', () => {
    render(<Gallery />);
    // Avanzamos 50ms para que se active el showDelfin
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByTestId('dolphin')).toBeInTheDocument();
  });

  it('el delfín tiene las clases correctas', () => {
    render(<Gallery />);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    const delfin = screen.getByTestId('dolphin');
    expect(delfin).toHaveClass(
      'absolute bottom-4 left-0 h-12 pointer-events-none animate-dolphin z-30'
    );
  });

  it('el delfín desaparece después de la duración DELFIN_DURATION', () => {
    render(<Gallery />);
    act(() => {
      vi.advanceTimersByTime(50); // aparezca
      vi.advanceTimersByTime(30000); // desaparezca
    });
    expect(screen.queryByTestId('dolphin')).not.toBeInTheDocument();
  });

  it('limpia los intervalos y timeouts al desmontar', () => {
    const { unmount } = render(<Gallery />);
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });
});
