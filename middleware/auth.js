export default function ({ redirect }) {
  if (process.browser) {
    const guard = JSON.parse(localStorage.getItem('user'))
    // If the user is not authenticated
    if (!guard) {
      localStorage.clear()
      return redirect('/')
    }
    if (guard) {
      if (
        // eslint-disable-next-line no-prototype-builtins
        guard.hasOwnProperty('token') &&
        // eslint-disable-next-line no-prototype-builtins
        guard.hasOwnProperty('firstName') &&
        // eslint-disable-next-line no-prototype-builtins
        guard.hasOwnProperty('lastName') &&
        // eslint-disable-next-line no-prototype-builtins
        guard.hasOwnProperty('role')
      ) {
        if (!guard.token || !guard.role) {
          localStorage.clear()
          return redirect('/')
        }
      }
    }
  }
}
