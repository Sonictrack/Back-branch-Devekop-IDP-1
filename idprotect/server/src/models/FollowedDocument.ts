import { AllowNull, Model, BelongsTo, Column, Table, ForeignKey } from "sequelize-typescript";
import Client from "./Client";
// import Perte from "./Perte";

@Table
export class FollowedDocument extends Model<FollowedDocument> {
  // @AllowNull(false)
  // @Column
  // documentId!: number;
  
  @AllowNull(false)
  @Column
  number!: string;

  @AllowNull(false)
  @Column
  type!: string

  @BelongsTo(() => Client, {
    onDelete: 'cascade'
  })
  user!: Client

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  userId!: number
}