export default class DocumentsService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * Get Documents
   * @param {*} { type, path, name }
   */
  async downloadFile (type, path, filename) {
    const body = new FormData()
    body.append('filepath', path)
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/download_file', body, {
      responseType: 'blob'
    })
    if (response) {
      const blob = new Blob([response])
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'document'
      link.click()
      return response
    }
  }

  /**
   * Get Lost Documents
   * @param {*} { type }
   */
  async getLostDocuments (type) {
    const response = await this.$axios.$post('/api/client/get_lost_documents', {
      type
    })
    if (response) {
      this.store.dispatch('documents/SET_DOCUMENTS', response)
      return response
    }
  }

  /**
   * Get Request
   * @param {*} { type }
   */
  async getRenewDocuments (type) {
    const body = new FormData()
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/all_renew_request', body)
    if (response) {
      this.store.dispatch('renew/SET_RENEW_DOCUMENTS', response) 
      return response
    }
  }

  /**
   * Lock Document
   * @param {*} { type, documentNumber }
   */
  async lockDocument (documentNumber, type) {
    const response = await this.$axios.$post(`/api/client/lockdocument/${documentNumber}`, {
      type
    })
    if (response) {
      return response
    }
  }

  /**
   * Lock Document Anonymous
   * @param {*} { documentNumber }
   */
  async lockDocumentAnon (documentNumber) {
    const response = await this.$axios.$get(`/api/client/lockdocument_anonymous/${documentNumber}`)
    if (response) {
      return response
    }
  }

  /**
   * Check Document
   * @param {*} { idNumber }
   */
  async checkDocument (type, docType, idNumber) {
    const body = new FormData()
    body.append('number', idNumber)
    body.append('docType', docType)
    body.append('type', type)
    const response = await this.$axios.$post('/api/client/search_lost_document', body)
    if (response) {
      return response
    }
  }

  /**
   * Save Lost Documents
   * @param {*} { type, docType, idNumber }
   */
  async saveLostDocument (userType, reason, idNumber, idImage, pv, docType) {
    const body = new FormData()
    body.append('type', userType)
    body.append('reason', reason)
    body.append('idNumber', idNumber)
    body.append('id', idImage)
    body.append('pv', pv)
    body.append('docType', docType)
    const response = await this.$axios.$post('/api/client/save_lost_documents', body)
    if (response) {
      return response
    }
  }

  /**
   * Search Lost Documents
   * @param {*} { type, docType, idNumber }
   */
  async searchLostDocument (type, docType, idNumber) {
    const body = new FormData()
    body.append('type', type)
    body.append('docType', docType)
    body.append('number', idNumber)
    const response = await this.$axios.$post('/api/client/search_lost_document', body)
    if (response) {
      return response
    }
  }


  
  /**
   * Delete Document 
   * @param {*} { documentNumber , state document(en suivi or perte)}
   */
  async deleteDocument (data) {
    const response = await this.$axios.$post(`/api/client/deleteDocument`, data)
    if (response) {
      return response
    }
  }

    


}
