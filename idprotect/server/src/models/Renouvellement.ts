import { AllowNull, Column, Model, Table, BelongsTo, ForeignKey } from "sequelize-typescript"
import Client from './Client'
@Table
class Renouvellement extends Model<Renouvellement> {

  @AllowNull(false)
  @Column
  type!: string

  @AllowNull(false)
  @Column
  status!: string

  @AllowNull(true)
  @Column
  info!: string

  @AllowNull(true)
  @ForeignKey(() => Client)
  @Column
  ownerId!: number

  @BelongsTo(() => Client, {
    onDelete: 'SET NULL'
  })
  owner!: Client
}

export default Renouvellement
