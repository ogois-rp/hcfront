// validationRules.ts
export const fullNameRules = value => {
  if (value?.trim() !== '') return true
  return 'Full name must not be empty.'
}

export const emailRules = value => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailPattern.test(value)) return true
  return 'Email must be a valid format.'
}

export const passwordRules = value => {
  return value?.length >= 8 || 'Password must be at least 8 characters long.'
}

export const orderDateRules = value => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to start of the day for accurate comparison
  const selectedDate = new Date(value)

  if (selectedDate >= today) return true
  return 'Order date cannot be in the past.'
}
