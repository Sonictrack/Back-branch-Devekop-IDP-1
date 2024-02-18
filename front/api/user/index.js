export default class UserService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * Check email
   * @param {*} { email  }
   */
  async checkEmail (email) {
    const body = new FormData()
    body.append('email', email)
    const response = await this.$axios.$post('/api/client/check_email', body)
    if (response) {
      return response
    }
  }

  /**
   * Record position
   * @param {*} { email, firstname, lastname, password, type }
   */
  async recordPosition (type, position) {
    const body = new FormData()
    body.append('position', JSON.stringify(position))
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/position', body)
    if (response) {
      return response
    }
  }

  /**
   * Register a new user
   * @param {*} { email, firstname, lastname, password, type }
   */
  async register (user) {
    const response = await this.$axios.$post('/api/client/register', { ...user, withCredentials: false })
    if (response) {
      return response
    }
  }

  /**
   * Resend password
   * @param {*} { email, firstname, lastname, password, type }
   */
  async resend ({ email }) {
    const response = await this.$axios.$post('/api/client/resend', {
      email,
      action: 'p' // v for verify_account, to determine
    })
    if (response) {
      return response
    }
  }

  /**
   * Reset password
   * @param {*} { token, password }
   */
  async resetPassword (token, password) {
    if (!token) { return }
    const response = await this.$axios.$post('/api/client/password', {
      token,
      password
    })
    if (response) {
      return response
    }
  }

  /**
 * Check password
 * @param {*} { id, password, type  }
 */
  async checkPassword(data) {
    const body = new FormData()
    body.append('type', data.userType)
    body.append('password', data.password)
    body.append('id', data.id)
    const response = await this.$axios.$post('/api/client/checkPassword', body)
    if (response) {
      return response
    }
  }

}
