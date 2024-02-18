import { AllowNull, Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { Model } from "sequelize";
import Client from "./Client";
import Document from "./Document";
import Perte from "./Perte";
import { FollowedDocument } from "./FollowedDocument";

@Table
class DocumentAuthorizationRequest extends Model<DocumentAuthorizationRequest> {
  @Column
  documentNumber!: string;

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  clientId!: number

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column
  professionalId!: number

  @AllowNull(false)
  @ForeignKey(() => FollowedDocument)
  @Column
  documentId!: number

  @Column
  status!: string
}

export default DocumentAuthorizationRequest