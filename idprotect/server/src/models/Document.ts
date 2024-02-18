import { Table, Column, Model, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Folder from './Folder'

@Table
class Document extends Model<Document> {
@AllowNull(false)
@Column
name!: string

@AllowNull(false)
@Column
path!: string

@AllowNull(false)
@ForeignKey(() => Folder)
@Column
folderId!: number

@BelongsTo(() => Folder, {
  onDelete: 'cascade',
  onUpdate: 'cascade',
})
folder!: Folder
}

export default Document

export enum DocumentResponse {
  NotFound = "not_found",
  LostOrSloten = "lost_or_sloten",
  NotLostOrSloten = "not_lost_or_sloten",
}