import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
  })

  it('handles value changes', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    expect(input).toHaveValue('test value')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('handles different types', () => {
    render(<Input type="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })
})
