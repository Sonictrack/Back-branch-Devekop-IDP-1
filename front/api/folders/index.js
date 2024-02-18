export default class FoldersService {
  constructor (ctx) {
    this.ctx = ctx
    this.$axios = ctx.$axios
    this.store = ctx.store
  }

  /**
   * Get Folders
   * @param {*} { type }
   */
  async getFolders (type) {
    const response = await this.$axios.$post('/api/client/folders', {
      type
    })
    if (response) {
      this.store.dispatch('folders/SET_FOLDERS', response)
      return response
    }
  }

  /**
   * Update Folder
   * @param {*} { type, folder, filesToUpload, filesToDelete }
   */
  async updateFolder (type, folder, filesToUpload = [], filesToDelete = []) {
    const body = new FormData()
    body.append('folder', JSON.stringify(folder))
    for (const file of filesToUpload) {
      // @ts-ignore
      body.append('filesToUpload', file, file.name)
    }
    body.append('filesToDelete', JSON.stringify(filesToDelete))
    body.append('type', type)
    const response = await this.$axios.$put(`/api/client/folder/${folder.id}`, body)
    if (response) {
      await this.getFolders(type)
      return response
    }
  }
}
