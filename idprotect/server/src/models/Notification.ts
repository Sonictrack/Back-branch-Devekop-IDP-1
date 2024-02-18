import { Table, Column, Model, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Client from './Client'

@Table
class Notification extends Model<Notification> {
  @AllowNull(false)
  @Column
  action!: string
    
  @AllowNull(false)
  @Column
  from!: string

  @AllowNull(false)
  @Column
  to!: string

  @AllowNull(false)
  @Column
  detail!: string

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  ownerId!: number

  @BelongsTo(() => Client, {
    onDelete: 'cascade'
  })
  owner!: Client

}

export default Notification