import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Use Vitest's vi.fn() instead of jest.fn()
    removeListener: vi.fn(), // Use Vitest's vi.fn() instead of jest.fn()
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})
