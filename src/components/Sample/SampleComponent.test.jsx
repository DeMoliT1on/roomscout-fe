import { render, screen } from '@testing-library/react'
import SampleComponent from './SampleComponent'

test('renders the SampleComponent with correct text', () => {
  render(<SampleComponent />)
  expect(screen.getByText('Hello, Vitest!')).toBeInTheDocument()
})
