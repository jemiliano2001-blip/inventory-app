export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  numeric?: boolean;
  positive?: boolean;
  custom?: (value: unknown) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateField = (
  value: unknown,
  rules: ValidationRule,
  fieldName: string = 'Field'
): ValidationResult => {
  // Required validation
  if (rules.required) {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} es requerido` };
    }
  }

  // If value is empty and not required, skip other validations
  if (!value && !rules.required) {
    return { isValid: true };
  }

  const stringValue = String(value);

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return { isValid: false, error: `${fieldName} debe ser un email válido` };
    }
  }

  // Numeric validation
  if (rules.numeric) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, error: `${fieldName} debe ser un número` };
    }
  }

  // Positive number validation
  if (rules.positive) {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      return { isValid: false, error: `${fieldName} debe ser un número positivo` };
    }
  }

  // Min/Max value validation (for numbers)
  if (rules.min !== undefined) {
    const numValue = Number(value);
    if (numValue < rules.min) {
      return { isValid: false, error: `${fieldName} debe ser mayor o igual a ${rules.min}` };
    }
  }

  if (rules.max !== undefined) {
    const numValue = Number(value);
    if (numValue > rules.max) {
      return { isValid: false, error: `${fieldName} debe ser menor o igual a ${rules.max}` };
    }
  }

  // Min/Max length validation (for strings)
  if (rules.minLength !== undefined) {
    if (stringValue.length < rules.minLength) {
      return {
        isValid: false,
        error: `${fieldName} debe tener al menos ${rules.minLength} caracteres`,
      };
    }
  }

  if (rules.maxLength !== undefined) {
    if (stringValue.length > rules.maxLength) {
      return {
        isValid: false,
        error: `${fieldName} no debe exceder ${rules.maxLength} caracteres`,
      };
    }
  }

  // Pattern validation (regex)
  if (rules.pattern) {
    if (!rules.pattern.test(stringValue)) {
      return { isValid: false, error: `${fieldName} tiene un formato inválido` };
    }
  }

  // Custom validation
  if (rules.custom) {
    if (!rules.custom(value)) {
      return { isValid: false, error: `${fieldName} no cumple con los requisitos` };
    }
  }

  return { isValid: true };
};

export const validateForm = (
  formData: Record<string, unknown>,
  validationRules: Record<string, ValidationRule>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const value = formData[fieldName];
    const result = validateField(value, rules, fieldName);

    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Specific validators for inventory items
export const inventoryValidators = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  category: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  stock: {
    required: true,
    numeric: true,
    min: 0,
  },
  minStock: {
    required: true,
    numeric: true,
    min: 0,
  },
  price: {
    numeric: true,
    min: 0,
  },
  quantity: {
    required: true,
    numeric: true,
    positive: true,
  },
  email: {
    email: true,
  },
};

// Input sanitization to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
