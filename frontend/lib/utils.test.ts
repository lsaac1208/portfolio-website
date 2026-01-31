import { cn, formatDate, slugify, truncate, generateOrderNo } from './utils'

describe('cn', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
    expect(result).toContain('class3')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'not-included')
    expect(result).toContain('base')
    expect(result).toContain('conditional')
    expect(result).not.toContain('not-included')
  })

  it('should handle tailwind merge', () => {
    const result = cn('p-4 p-6', 'text-red-500 text-blue-500')
    expect(result).toContain('p-6')
    expect(result).toContain('text-blue-500')
  })
})

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
    expect(result).toContain('1')
    expect(result).toContain('15')
  })

  it('should format Date object correctly', () => {
    const date = new Date('2024-01-15T10:30:00')
    const result = formatDate(date)
    expect(result).toContain('2024')
  })
})

describe('slugify', () => {
  it('should convert text to slug format', () => {
    const result = slugify('Hello World')
    expect(result).toBe('hello-world')
  })

  it('should remove special characters', () => {
    const result = slugify('Hello @#$% World')
    expect(result).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    const result = slugify('hello   world')
    expect(result).toBe('hello-world')
  })

  it('should handle leading/trailing dashes', () => {
    const result = slugify('  hello world  ')
    expect(result).toBe('hello-world')
  })
})

describe('truncate', () => {
  it('should truncate long text', () => {
    const result = truncate('This is a very long text that should be truncated', 20)
    expect(result).toBe('This is a very long ...')
  })

  it('should not truncate short text', () => {
    const result = truncate('Short text', 20)
    expect(result).toBe('Short text')
  })
})

describe('generateOrderNo', () => {
  it('should generate order number with correct format', () => {
    const result = generateOrderNo()
    expect(result).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/)
  })

  it('should generate unique order numbers', () => {
    const result1 = generateOrderNo()
    const result2 = generateOrderNo()
    expect(result1).not.toBe(result2)
  })
})
