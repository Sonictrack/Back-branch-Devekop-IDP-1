import { Table, Column, Model, AllowNull, BelongsTo, HasMany, ForeignKey, Default } from 'sequelize-typescript'
import Client from './Client'
import Document from './Document'
import FolderAuthorization from './FolderAuthorization'

@Table
class Folder extends Model<Folder> {
  @AllowNull(false)
  @Column
  name!: string

  @Default(false)
  @AllowNull(false)
  @Column
  visibility!: boolean

  @Default(false)
  @AllowNull(false)
  @Column
  system!: boolean

  @Default(false)
  @AllowNull(false)
  @Column
  adminAccess!: boolean

  @HasMany(() => FolderAuthorization)
  authorizations!: FolderAuthorization[]
  
  @HasMany(() => Document)
  documents!: Document[]

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  ownerId!: number

  @BelongsTo(() => Client, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  })
  owner!: Client
}

export default Folder