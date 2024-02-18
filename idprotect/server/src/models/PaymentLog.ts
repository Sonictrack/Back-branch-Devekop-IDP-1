import { Table, Model, BelongsTo, Column, Default, AllowNull, ForeignKey } from "sequelize-typescript";
import Client from "./Client";

@Table
export class PaymentLog extends Model<PaymentLog> {
  @Default(0)
  @Column
  amount!: number

  @Default(0)
  @Column
  addedCredits!: number

  @BelongsTo(() => Client, {
    onDelete: 'cascade'
  })
  issuer!: Client

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  issuerId!: number
}