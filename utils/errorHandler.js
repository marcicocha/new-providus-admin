export const ErrorHandler = (err) => {
  // err.response.data.message
  const errors = []
  if (err && err.response && err.response.data) {
    if (err.response.data.hasError) {
      const { fieldValidationErrors, processErrors } = err.response.data
      if (fieldValidationErrors) {
        err.response.data.fieldValidationErrors.forEach((e) => {
          errors.push(e.message)
        })
      } else if (processErrors) {
        err.response.data.processErrors.forEach((e) => {
          errors.push(e.errorMessage)
        })
      } else if (err.response.data.response) {
        errors.push(err.response.data.response)
      } else {
        errors.push(err.response.data.errorMessage)
      }
    } else if (err.response.data.errorMessage) {
      errors.push(err.response.data.response)
    } else if (err.response.data.message) {
      errors.push(err.response.data.message)
    } else if (
      err.response.data.error_description &&
      err.response.data.error_description.includes('token expired')
    ) {
      errors.push('Session expired!!!')
    }
  } else if (err && err.message) {
    errors.push(err.message)
  }
  return errors
}
export default ErrorHandler
