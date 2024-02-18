export default class NotificationsService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * Get Notifcations
   * @param {*} { type }
   */
  async getNotifcations (type) {
    const response = await this.$axios.$post('/api/client/notifications', {
      type
    })
    if (response) {
      this.store.dispatch('notifications/SET_NOTIFICATIONS', response)
    }
  }

  /**
   * Send Notifcations
   * @param {*} { type, notification }
   */
  async sendNotification (type, notification) {
    const body = new FormData()
    body.append('notification', JSON.stringify(notification))
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/notification', body)
    if (response) { 
      this.getNotifcations(type);
      return response
    }
  }
}
