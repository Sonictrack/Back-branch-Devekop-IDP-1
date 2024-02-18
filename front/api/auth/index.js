export default class AuthService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
    this.router = ctx.router
  }

  /**
   * Check auth state change
   * @param {*} { }
   */
  async authStateChange () {
    const type = localStorage.getItem('type')
    if (type) {
      await this.getUser(type)
    }
  }

  /**
   * Get user
   * @param {*} { type }
   */
  async getUser (type) {
    await this.$axios.$post('/api/client/account', {
      type
    })
      .then((data) => {
        this.store.dispatch('auth/SAVE_USER', data)
        return data
      })
      .catch((err) => {
        return err
      })
  }

  /**
   * Update user account
   * @param {*} { type, account (user) }
   */
  async updateAccount (type, account) {
    await this.$axios.$put('/api/client/account', {
      type,
      account: JSON.stringify(account)
    })
      .then(() => {
        this.store.dispatch('auth/SAVE_USER', account)
      })
      .catch((err) => {
        return err
      })
  }

  /**
   * Delete user account
   * @param {*} { type }
   */
  async deleteAccount (type) {
    const body = new FormData()
    body.append('type', type)
    const response = await this.$axios.$delete('/api/client/account', {
      data: body
    })
      .then(() => {
        this.ctx.redirect('/')
        this.logout()
      })
    if (response) {
      return response
    }
  }

  /**
   * User confirmation
   * @param {*} { token }
   */
  async userConfirmation (token) {
    const body = new FormData()
    body.append('token', token)
    const response = await this.$axios.$post('/api/client/confirmation', body)
    if (response) {
      return response
    }
  }

  /**
   * Send login
   * @param {*} { mail, password, type }
   */
  async login(email, password, type) {
    const response = await this.$axios.$post('/api/client/login', {
      email, password, type
    });
    if (response) {
      // localStorage.setItem('type', type); // Stocker le type d'utilisateur dans le localStorage
      this.store.dispatch('auth/SAVE_USER', response);
      return response;
    }
  }
  

  /**
   * Send logout
   * @param {*} { }
   */
  async logout () {
    const response = await this.$axios.$get('/api/logout')
    if (response) {
      localStorage.removeItem('type')
      this.store.dispatch('auth/SAVE_USER', null)
    }
  }
}
