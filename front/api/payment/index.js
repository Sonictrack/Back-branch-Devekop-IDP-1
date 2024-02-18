export default class PaymentService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * emailAfterPaymentAnonymous
   * @param {*} { email, amount, credits }
   */
  async emailAfterPaymentAnonymous (email, amount, credits) {
    const response = await this.$axios.$post('/api/client/payment_anonymous', { email, amount, withCredentials: false , credits})
    if (response) {
      return response
    }
  }

  /**
   * emailAfterPayment
   * @param {*} { type, amount, credits }
   */
  async emailAfterPayment (type, amount, credits) {
    const body = new FormData()
    body.append('type', type)
    body.append('amount', amount)
    body.append('credits', credits)
    const response = await this.$axios.$post('/api/client/payment', body)
    if (response) {
      return response
    }
  }

  /**
   * Get paymentIntent for new user
   * @param {*} { amount, currency, description, statement_descriptor }
   */
  async getPaymentIntent (data) {
    const response = await this.$axios.$post('/api/client/payment_intent', data)
    if (response) {
      return response
    }
  }
}
