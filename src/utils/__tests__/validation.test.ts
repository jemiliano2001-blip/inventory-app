import {
  validateField,
  validateForm,
  inventoryValidators,
  sanitizeInput,
} from '../validation'

describe('validateField', () => {
  describe('required validation', () => {
    it('should fail when value is empty and field is required', () => {
      const result = validateField('', { required: true }, 'Name')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Name es requerido')
    })

    it('should fail when value is null and field is required', () => {
      const result = validateField(null, { required: true }, 'Name')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Name es requerido')
    })

    it('should pass when value exists and field is required', () => {
      const result = validateField('John', { required: true }, 'Name')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should pass when value is empty and field is not required', () => {
      const result = validateField('', { required: false }, 'Name')
      expect(result.isValid).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should pass for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
      ]

      validEmails.forEach((email) => {
        const result = validateField(email, { email: true }, 'Email')
        expect(result.isValid).toBe(true)
      })
    })

    it('should fail for invalid email addresses', () => {
      const invalidEmails = ['invalid', 'test@', '@example.com', 'test @example.com']

      invalidEmails.forEach((email) => {
        const result = validateField(email, { email: true }, 'Email')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('email válido')
      })
    })
  })

  describe('numeric validation', () => {
    it('should pass for valid numbers', () => {
      const result = validateField(123, { numeric: true }, 'Stock')
      expect(result.isValid).toBe(true)
    })

    it('should pass for string numbers', () => {
      const result = validateField('456', { numeric: true }, 'Stock')
      expect(result.isValid).toBe(true)
    })

    it('should fail for non-numeric values', () => {
      const result = validateField('abc', { numeric: true }, 'Stock')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('número')
    })
  })

  describe('positive number validation', () => {
    it('should pass for positive numbers', () => {
      const result = validateField(10, { positive: true }, 'Quantity')
      expect(result.isValid).toBe(true)
    })

    it('should pass for zero', () => {
      const result = validateField(0, { positive: true }, 'Quantity')
      expect(result.isValid).toBe(true)
    })

    it('should fail for negative numbers', () => {
      const result = validateField(-5, { positive: true }, 'Quantity')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('positivo')
    })
  })

  describe('min/max value validation', () => {
    it('should pass when value is within min and max', () => {
      const result = validateField(50, { min: 10, max: 100 }, 'Stock')
      expect(result.isValid).toBe(true)
    })

    it('should fail when value is below min', () => {
      const result = validateField(5, { min: 10 }, 'Stock')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('mayor o igual a 10')
    })

    it('should fail when value is above max', () => {
      const result = validateField(150, { max: 100 }, 'Stock')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('menor o igual a 100')
    })
  })

  describe('minLength/maxLength validation', () => {
    it('should pass when string length is valid', () => {
      const result = validateField('hello', { minLength: 3, maxLength: 10 }, 'Name')
      expect(result.isValid).toBe(true)
    })

    it('should fail when string is too short', () => {
      const result = validateField('ab', { minLength: 3 }, 'Name')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('al menos 3 caracteres')
    })

    it('should fail when string is too long', () => {
      const result = validateField('verylongstring', { maxLength: 5 }, 'Name')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('no debe exceder 5 caracteres')
    })
  })

  describe('pattern validation', () => {
    it('should pass when value matches pattern', () => {
      const alphanumericPattern = /^[a-zA-Z0-9]+$/
      const result = validateField('abc123', { pattern: alphanumericPattern }, 'Code')
      expect(result.isValid).toBe(true)
    })

    it('should fail when value does not match pattern', () => {
      const alphanumericPattern = /^[a-zA-Z0-9]+$/
      const result = validateField('abc-123', { pattern: alphanumericPattern }, 'Code')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('formato inválido')
    })
  })

  describe('custom validation', () => {
    it('should pass when custom validator returns true', () => {
      const isEven = (value: unknown) => Number(value) % 2 === 0
      const result = validateField(4, { custom: isEven }, 'Number')
      expect(result.isValid).toBe(true)
    })

    it('should fail when custom validator returns false', () => {
      const isEven = (value: unknown) => Number(value) % 2 === 0
      const result = validateField(5, { custom: isEven }, 'Number')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('no cumple con los requisitos')
    })
  })
})

describe('validateForm', () => {
  it('should validate all fields in a form', () => {
    const formData = {
      name: 'Test Item',
      stock: 50,
      email: 'test@example.com',
    }

    const rules = {
      name: { required: true, minLength: 2 },
      stock: { required: true, numeric: true, min: 0 },
      email: { required: true, email: true },
    }

    const result = validateForm(formData, rules)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('should return all validation errors', () => {
    const formData = {
      name: 'A',
      stock: -5,
      email: 'invalid-email',
    }

    const rules = {
      name: { required: true, minLength: 2 },
      stock: { required: true, numeric: true, min: 0 },
      email: { required: true, email: true },
    }

    const result = validateForm(formData, rules)
    expect(result.isValid).toBe(false)
    expect(Object.keys(result.errors)).toHaveLength(3)
    expect(result.errors.name).toContain('al menos 2 caracteres')
    expect(result.errors.stock).toContain('mayor o igual a 0')
    expect(result.errors.email).toContain('email válido')
  })

  it('should handle missing required fields', () => {
    const formData = {
      name: '',
    }

    const rules = {
      name: { required: true },
      stock: { required: true },
    }

    const result = validateForm(formData, rules)
    expect(result.isValid).toBe(false)
    expect(result.errors.stock).toBe('stock es requerido')
  })
})

describe('inventoryValidators', () => {
  it('should have correct validators for inventory item', () => {
    expect(inventoryValidators.name).toEqual({
      required: true,
      minLength: 2,
      maxLength: 100,
    })

    expect(inventoryValidators.category).toEqual({
      required: true,
      minLength: 2,
      maxLength: 50,
    })

    expect(inventoryValidators.stock).toEqual({
      required: true,
      numeric: true,
      min: 0,
    })
  })

  it('should validate a complete inventory item', () => {
    const itemData = {
      name: 'Test Item',
      category: 'Tools',
      stock: 100,
      minStock: 10,
    }

    const result = validateForm(itemData, {
      name: inventoryValidators.name,
      category: inventoryValidators.category,
      stock: inventoryValidators.stock,
      minStock: inventoryValidators.minStock,
    })

    expect(result.isValid).toBe(true)
  })
})

describe('sanitizeInput', () => {
  it('should escape HTML special characters', () => {
    const input = '<script>alert("XSS")</script>'
    const result = sanitizeInput(input)
    expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
  })

  it('should escape single quotes', () => {
    const input = "It's a test"
    const result = sanitizeInput(input)
    expect(result).toBe('It&#x27;s a test')
  })

  it('should escape double quotes', () => {
    const input = 'He said "hello"'
    const result = sanitizeInput(input)
    expect(result).toBe('He said &quot;hello&quot;')
  })

  it('should escape forward slashes', () => {
    const input = '</script>'
    const result = sanitizeInput(input)
    expect(result).toBe('&lt;&#x2F;script&gt;')
  })

  it('should handle multiple special characters', () => {
    const input = '<div class="test">Hello & "goodbye"</div>'
    const result = sanitizeInput(input)
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
    expect(result).not.toContain('"')
  })

  it('should return empty string for empty input', () => {
    const result = sanitizeInput('')
    expect(result).toBe('')
  })

  it('should not modify plain text', () => {
    const input = 'This is plain text'
    const result = sanitizeInput(input)
    expect(result).toBe('This is plain text')
  })
})
