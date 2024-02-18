import { Table, Column, Model, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Client from './Client'
import Admin from './Admin'
import Folder from './Folder'

@Table
class FolderAuthorization extends Model<FolderAuthorization> {
  @AllowNull(false)
  @Column
  isAuthorized!: boolean

  @AllowNull(false)
  @ForeignKey(() => Folder)
  @Column
  folderId!: number

  @BelongsTo(() => Folder, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  })
  folder!: Folder

  @AllowNull(true)
  @ForeignKey(() => Client)
  @Column
  clientId!: number

  @AllowNull(true)
  @ForeignKey(() => Admin)
  @Column
  adminId!: number

  @BelongsTo(() => Client, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  })
  client!: Client
}

export default FolderAuthorization