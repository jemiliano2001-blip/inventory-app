import { debounce } from '../debounce'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should debounce function calls', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    // Call multiple times rapidly
    debouncedFn('call 1')
    debouncedFn('call 2')
    debouncedFn('call 3')

    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300)

    // Function should be called once with the last argument
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call 3')
  })

  it('should only execute the last call within the delay period', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn('first')
    jest.advanceTimersByTime(200)
    
    debouncedFn('second')
    jest.advanceTimersByTime(200)
    
    debouncedFn('third')
    jest.advanceTimersByTime(500)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('third')
  })

  it('should handle multiple arguments correctly', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('arg1', 'arg2', 123)
    jest.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })

  it('should work with different delay values', () => {
    const mockFn = jest.fn()
    const debouncedFn100 = debounce(mockFn, 100)
    const debouncedFn500 = debounce(mockFn, 500)

    debouncedFn100('fast')
    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledWith('fast')

    mockFn.mockClear()

    debouncedFn500('slow')
    jest.advanceTimersByTime(100)
    expect(mockFn).not.toHaveBeenCalled()
    
    jest.advanceTimersByTime(400)
    expect(mockFn).toHaveBeenCalledWith('slow')
  })

  it('should cancel previous timeout when called again', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first call')
    jest.advanceTimersByTime(200)
    
    // This should cancel the previous timeout
    debouncedFn('second call')
    jest.advanceTimersByTime(200)
    
    // First call should never execute
    expect(mockFn).not.toHaveBeenCalled()
    
    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('second call')
  })

  it('should work with functions that have no parameters', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn()
    jest.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith()
  })

  it('should preserve the function return type (void)', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    const result = debouncedFn('test')
    
    // Debounced function should return void
    expect(result).toBeUndefined()
  })

  it('should handle rapid successive calls correctly', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 300)

    // Simulate rapid typing
    for (let i = 0; i < 10; i++) {
      debouncedFn(`char ${i}`)
      jest.advanceTimersByTime(50) // 50ms between each call
    }

    // After the typing stops, wait for debounce
    jest.advanceTimersByTime(300)

    // Should only call once with the last value
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('char 9')
  })
})
