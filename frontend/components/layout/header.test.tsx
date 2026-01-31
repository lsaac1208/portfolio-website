import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './header'

describe('Header', () => {
  it('renders logo', () => {
    render(<Header />)
    expect(screen.getByText(/MyPortfolio/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /首页/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /博客/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /论坛/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /项目/i })).toBeInTheDocument()
  })

  it('renders login and register buttons', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /登录/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /注册/i })).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button')
    expect(screen.queryByRole('link', { name: /关于/i })).not.toBeVisible()

    fireEvent.click(menuButton)
    expect(screen.getByRole('link', { name: /关于/i })).toBeVisible()
  })
})
