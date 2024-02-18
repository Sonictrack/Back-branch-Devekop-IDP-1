export default class RenewService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * Send renew
   * @param {*} { type, form }
   */
  async sendRenew (type, form) {
    const body = new FormData()
    body.append('data', JSON.stringify(form))
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/renew', body)
    if (response) {
      return response
    }
  }

  /**
   * Send renew anon
   * @param {*} { form }
   */
  async sendRenewAnon (form) {
    const body = new FormData()
    body.append('data', JSON.stringify(form))
    const response = await this.$axios.$post('/api/client/renew_anonymous', { ...form, withCredentials: false })
    if (response) {
      return response
    }
  }
}
