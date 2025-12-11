import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../Header'

jest.mock('@/utils/debounce', () => ({
  debounce: (fn: Function) => fn, // Return non-debounced function for testing
}))

describe('Header', () => {
  const mockOnMenuToggle = jest.fn()

  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onMenuToggle: mockOnMenuToggle,
  }

  beforeEach(() => {
    mockOnMenuToggle.mockClear()
  })

  it('should render title and subtitle', () => {
    render(<Header {...defaultProps} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<Header {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar artículos/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should call onMenuToggle when menu button is clicked', () => {
    render(<Header {...defaultProps} />)

    const menuButton = screen.getByLabelText(/abrir menú de navegación/i)
    fireEvent.click(menuButton)

    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1)
  })

  it('should update search query when typing', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar artículos/i)
    await user.type(searchInput, 'test query')

    expect(searchInput).toHaveValue('test query')
  })

  it('should show clear button when search has value', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar artículos/i)
    await user.type(searchInput, 'test')

    const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when search is empty', () => {
    render(<Header {...defaultProps} />)

    const clearButton = screen.queryByLabelText(/limpiar búsqueda/i)
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar artículos/i)
    await user.type(searchInput, 'test query')
    expect(searchInput).toHaveValue('test query')

    const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('should toggle advanced search help when filter button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const filterButton = screen.getByLabelText(/mostrar ayuda de búsqueda avanzada/i)

    // Advanced search should not be visible initially
    expect(screen.queryByText('Búsqueda Avanzada')).not.toBeInTheDocument()

    // Click to show
    await user.click(filterButton)
    expect(screen.getByText('Búsqueda Avanzada')).toBeInTheDocument()

    // Click to hide
    await user.click(filterButton)
    await waitFor(() => {
      expect(screen.queryByText('Búsqueda Avanzada')).not.toBeInTheDocument()
    })
  })

  it('should display advanced search operators', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const filterButton = screen.getByLabelText(/mostrar ayuda de búsqueda avanzada/i)
    await user.click(filterButton)

    expect(screen.getByText(/AND:/i)).toBeInTheDocument()
    expect(screen.getByText(/OR:/i)).toBeInTheDocument()
    expect(screen.getByText(/NOT:/i)).toBeInTheDocument()
    expect(screen.getByText(/frase/i)).toBeInTheDocument()
  })

  it('should have proper ARIA labels for accessibility', () => {
    render(<Header {...defaultProps} />)

    expect(screen.getByLabelText(/abrir menú de navegación/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/buscar artículos en el inventario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mostrar ayuda de búsqueda avanzada/i)).toBeInTheDocument()
  })

  it('should submit form when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<Header {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/buscar artículos/i)
    await user.type(searchInput, 'test query')
    await user.keyboard('{Enter}')

    // Form submission is handled, no errors should occur
    expect(searchInput).toHaveValue('test query')
  })
})
