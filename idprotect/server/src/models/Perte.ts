import { Table, Column, Model, AllowNull, BelongsTo, ForeignKey, Unique } from 'sequelize-typescript'
import Client from './Client'

@Table
class Perte extends Model<Perte> {
  
  @AllowNull(false)
  @Column
  type!: string

  @AllowNull(false)
  @Column
  reason!: string

  @AllowNull(false)
  @Unique
  @Column
  number!: string

  @AllowNull(false)
  @Column
  idPath!: string

  @AllowNull(false)
  @Column
  pvPath!: string

  @AllowNull(true)
  @ForeignKey(() => Client)
  @Column
  ownerId!: number

  @BelongsTo(() => Client, {
    onDelete: 'SET NULL'
  })
  owner!: Client
}

export default Perte