import React from 'react'
import { expect, describe, it } from 'vitest'
import { render } from '@testing-library/react'
import DolphinAnimation from '../DolphinAnimation'

describe('DolphinAnimation', () => {
  it('renderiza el video con la clase correcta y atributos', () => {
    render(<DolphinAnimation className="test-class" />)

    const video = document.querySelector('video')

    expect(video).toBeInTheDocument()
    expect(video).toHaveClass('test-class')

    // Estos sí aparecen como atributos
    expect(video).toHaveAttribute('autoPlay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsInline')
    expect(video).toHaveAttribute('src', expect.stringContaining('delfinAnimado.mp4'))

    // Este se maneja como propiedad en JSDOM, no como atributo
    expect(video.muted).toBe(true)

    // style se evalúa como propiedad de estilo
    expect(video.style.zIndex).toBe('10')
  })
})
